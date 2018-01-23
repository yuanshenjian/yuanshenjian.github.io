---
layout: post
title: 使用Rancher Compose部署服务

permalink: /topics/micro-service/deploy-with-rancher-compose/

topic: Micro service

date: 2018-01-21
---

* content
{:toc}

---

上节课我们成功地 [在Pipeline中使用Docker执行构建任务]({{ site.url }}{{ '/topics/micro-service/build-pipeline-with-docker/' }})，从测试到打包，都利用了宿主机的docker进程进行容器化构建。本节课我们来完成Pipeline最后一站：*部署*。

主要任务有：

- 搭建Rancher部署环境
- 部署应用服务

---

## 准备工作

由于我们在 [搭建基于GoCD的持续集成基础设施]({{ site.url }}{{'/topics/micro-service/build-pipeline-with-docker/' }}) 那节课中注册Go agent时，已经将在Go agent中安装了Rancher Compose，这节课我们来搭建一个部署环境，并利用rancher compose cli将服务部署到。

同样，在`10.29.5.155`的VM中将Go server、Go agent、Nexus三个容器启动（如果已启动可以跳过）：

```sh
$ docker ps -a 
$ docker start <go_service_contain_id>
$ docker start <go_agent_contain_id>
$ docker start <go_nexus_contain_id>
```

---

## 搭建Rancher部署环境
为了保持部署环境的独立性，我们再次使用Vagrant创建一个ubuntu的VM(`10.29.25.155`)，在之前的Vagrantfile中添加一个虚拟机的配置：

*~/mst/vm/Vagrantfile*

```sh
# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  ...
  config.vm.define :mst_rancher do |config|
     config.vm.box = "ubuntu/trusty64"
     config.vm.hostname = "tw-mst-rancher"
     config.vm.synced_folder "./vagrant_shared", "/vagrant"
     config.vm.network :private_network, ip: "10.29.25.155"
     config.vm.provision :shell, path: "./vagrant_shared/setup_docker.sh"
     config.vm.provider "virtualbox" do |vb|
       vb.memory = "4096"
     end
   end
end
```


### 配置Rancher server
登录到`10.29.25.155`的VM中，从rancher镜像中启动一个rancher server:

```sh
$ cd ~/mst/vm
$ vagrant ssh mst_rancher
$ docker run -d --restart=unless-stopped -p 8080:8080 rancher/server:v1.6.13
```

等待1~2分钟启动完毕，在浏览器通过 <http://10.29.25.155:8080> 访问Rancher的主界面。

*待完善*

### 安装MySQL和Redis
我们的服务使用了Redis存储JWT token的黑名单，使用MySQL作为核心数据库服务，所以要在部署环境中预装好MySQL和Redis。

在`10.29.25.155`的VM上使用docker-compose启动MySQL和Redis，创建`docker-compose.yml`文件：

*~/mst/docker-compose.yml*

```yaml
version: '2'
services:
  mysql:
     image: mysql:5.7
     environment:
       MYSQL_ROOT_PASSWORD: dev
       DB_USER: root
       USER_PASSWD: dev
     ports:
       - '3306:3306'
     command:
       - --character-set-server=utf8mb4
       - --collation-server=utf8mb4_unicode_ci
       - --lower_case_table_names=1
     volumes:
       - ./config/db/mysql/docker-entrypoint-initdb.d:/docker-entrypoint-initdb.d
  redis:
    tty: true
    image: redis:alpine
    ports:
       - '6379:6379'
    stdin_open: true
```

再创建数据库初始化文件`00-dbinit.sql`

*~/mst/config/db/mysql/docker-entrypoint-initdb.d/00-dbinit.sql*

```sql
CREATE DATABASE IF NOT EXISTS `mst_user` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS `mst_order` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS `mst_goods` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'dev';
```

最后，使用docker-compose启动MySQL和Redis服务：

```
$ cd ~/mst
$ docker-compose up -d 
```

---

## 部署mst-user-service
现在，我们将`mst-user-service`部署到`10.29.25.155`上，我们需要在pipeline添加一个`deploy` stage，然后准备好部署脚本`deploy.sh`。除了这些，我们还需要提前在`mst-user-service`项目中创建`docker-compose.yml`和`rancher-compose.yml`文件，最后在Go agent中使用docker compose cli将服务部署上去。

### 编写*-compose.yml
`docker-compose.yml`用于管理编排容器，`rancher-compose.yml`用户管理容器的集群，我们需要在`mst-user-service`中创建这两个文件。

*docker-compose.yml*

```yaml
version: '2'
services:
  mst-user-service:
    stdin_open: true
    tty: true
    expose:
     - "8080"
    environment:
        SPRING_PROFILES_ACTIVE: qa
    image: <IMAGE_NAME>
```
`<IMAGE_NAME>`是一个被部署脚本动态替换的占位符。


*rancher-compose.yml*

```yaml
version: '2'
service:
  mst-user-service:
    scale: 1
    start_on_create: true
```

### 增加deploy stage
在之前Pipeline as Code的基础上添加一个名为`deploy`的stage：

*~/mst-pipeline/pipelines/mst-user-service.gocd.yml*

```yaml
pipelines:
  mst-user-service:
    group: mst
    label_template: "${COUNT}"
    locking: off
    materials:
      app:
        git: git@github.com:tw-ms-training/mst-user-service.git
        branch: master
    stages:
      - test:
        ...
      - build:
        ...
      - deploy:
          clean_workspace: yes
          jobs:
            deploy:
              tasks:
                - exec:
                    command: bash
                    arguments:
                      - "-e"
                      - "./scripts/deploy.sh"
                    run_if: passed
```

### 编写depoly.sh
创建`deploy.sh`脚本：

*~/mst-user-service/scripts/deploy.sh*

```sh
#! /usr/bin/env bash
set -x
set -e

export RANCHER_URL=http://10.29.25.155:8080/v2-beta/projects/1a5
export RANCHER_ACCESS_KEY=0776A1C81D57800F4CE9
export RANCHER_SECRET_KEY=Z2i8KcmfzeroaAy148wuPnxjyhwGxmxm3qZWsZC8

if [[ -z $DOCKER_REGISRTY ]]; then
  DOCKER_REGISRTY=10.29.5.155:5000
fi
IMAGE_NAME=${DOCKER_REGISRTY}/tw-ms-train/user-service:${GO_PIPELINE_COUNTER}

sed -i "s#<IMAGE_NAME>#$IMAGE_NAME#g" docker-compose.yml

rancher-compose -p mst-user-service up -d -c --upgrade
```
上述脚本定义了三个环境变量`RANCHER_URL`、`RANCHER_ACCESS_KEY`、`RANCHER_SECRET_KEY `，这三个变量是Rancher server的地址以及访问密钥，当Go agent在执行本地使用docker compose cli向Rancher server发出命令时用到的验证信息。要获取`RANCHER_ACCESS_KEY`和`RANCHER_SECRET_KEY`，我们需要在Rancher server创建一个。

### 创建API Key
访问Rancher server web页面 <http://10.29.25.155:8080>，在导航栏`API`上点击`Keys`，然后`Keys`点击`Add Environment API key`按钮：

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/rancher-api-key.jpg' }})

到此为止，我们准备好了部署相关的脚本和配置文件，对`mst-user-service`和`mst-pipeline`各做一次提交，等待Pipeline重新运行。

---

## 延伸阅读
- [CI基础 & Setup环境]({{ site.url }}{{ '/ci-basics/' }})
- [手把手搭建CI]({{ site.url }}{{ '/ci-setup-step-by-step/' }})
- [构建可持续部署的Pipeline]({{ site.url }}{{ '/ci-pipeline/' }})
- [持续集成的容器化策略]({{ site.url }}{{ '/ci-container-strategy/' }})



