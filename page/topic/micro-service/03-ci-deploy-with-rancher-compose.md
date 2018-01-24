---
layout: topic
title: 使用Rancher Compose部署服务
permalink: /topics/micro-service/deploy-with-rancher-compose/
topic: Micro service
date: 2018-01-21
author: 袁慎建
---

* content
{:toc}

---

上节课我们成功地 [在Pipeline中使用Docker执行构建任务]({{ site.url }}{{ '/topics/micro-service/build-pipeline-with-docker/' }})，从测试到打包，都利用了宿主机的docker进程进行容器化构建。本节课我们来完成Pipeline最后一站：*部署*。

主要任务有：

- 搭建Rancher部署环境
- 部署应用服务
- 配置访问应用服务

---

## 准备工作

由于我们在 [搭建基于GoCD的持续集成基础设施]({{ site.url }}{{'/topics/micro-service/build-pipeline-with-docker/' }}) 那节课中注册Go agent时，已经将在Go agent中安装了Rancher Compose，这节课我们来搭建一个部署环境，并利用Rancher CLI将服务部署到。

同样，在Vagrant VM(`10.29.5.155`)中将Go server、Go agent容器启动（如果已启动可以跳过）：

```sh
$ docker ps -a 
$ docker start <go_service_contain_id>
$ docker start <go_agent_contain_id>
```

---

## 搭建Rancher部署环境
这里我继续使用了第一节课的那台独立的Scaleworks VM（`10.202.129.3`）。如果你的机器性能足够好，可以使用Vagrant创建一个Ubuntu的VM，只需要在之前的Vagrantfile中添加一个虚拟机的配置即可（要确保Rancher agent能够访问你的Nexus）：

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
     config.vm.synced_folder "~/mst/vm/rancher/vagrant_shared", "/vagrant"
     config.vm.network :private_network, ip: "10.29.5.195"
     config.vm.provision :shell, path: "~/mst/vm/rancher/vagrant_shared/setup_docker.sh"
     config.vm.provider "virtualbox" do |vb|
       vb.memory = "4096"
     end
   end
end
```


### 配置Rancher server
ssh登录到Scaleworks VM(`10.202.129.3`)中，从Rancher镜像中启动一个Rancher server:

```sh
$ docker run -d --restart=unless-stopped -p 8080:8080 rancher/server:v1.6.15-rc1
```

等待1~2分钟启动完毕，在浏览器通过 <http://10.202.129.3:8080> 访问Rancher的主界面。

#### 注册Rancher
Rancher server启动后，跟GoCD类似，Rancher server负责调用部署，而真正执行部署的是Rancher agent。所以我们需要先添加一个host，然后获取到注册Rancher命令，然后在要执行部署的Rancher agent上执行这个命令，将Ranger agent和Rancher server关联起来。

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/rancher-host-register.jpg' }})

将上图中的命令在要运行Rancher agent的机器上执行，从而启动一个Rancher agent，这里我继续使用了Rancher server那台Scaleworks VM（`10.202.129.3`）：

```sh
$ sudo docker run --rm --privileged -v /var/run/docker.sock:/var/run/docker.sock -v /var/lib/rancher:/var/lib/rancher rancher/agent:v1.2.8 http://10.202.129.3:8080/v1/scripts/0531E87514DF14304767:1514678400000:3jDZspEqXJc6uwEfRU40BrMAM
```

### 安装MySQL和Redis
我们的服务使用了Redis存储JWT token的黑名单，使用MySQL作为核心数据库服务，所以要在部署环境中预装好MySQL和Redis。

在Scaleworks VM(`10.202.129.3`)上使用docker-compose启动MySQL和Redis，创建`docker-compose.yml`文件：

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

创建数据库初始化文件`00-dbinit.sql`

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
现在，我们来部署`mst-user-service`。首先，在pipeline添加一个`deploy` stage，准备好部署脚本`deploy.sh`。除了这些，我们还需要提前在`mst-user-service`项目中创建`docker-compose.yml`和`rancher-compose.yml`文件，最后在Go agent中使用Rancher CLI将服务部署上去。

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
        git: https://github.com/tw-ms-training/mst-user-service.git
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

export RANCHER_URL=http://10.202.129.3:8080/v2-beta/projects/1a5
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
访问Rancher server web页面 <http://10.202.129.3:8080>，在导航栏`API`上点击`Keys`，然后`Keys`点击`Add Environment API key`按钮：

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/rancher-api-key.jpg' }})

到此为止，我们准备好了部署相关的脚本和配置文件，对`mst-user-service`和`mst-pipeline`各做一次提交，等待Pipeline重新运行。

---

## 访问mst-user-service
到目前为止，我们完成了`mst-user-service`的部署。因为没有暴露端口，我们还不能访问服务。要访问到服务，我们还要在Rancher上创建一个Load balance服务，用于暴露访问端口，以及确保服务集群的高可用。

点击`Add Stack`创建一个名为`mst-lb`的Stack，然后在该Stack上点击`Add Load Balancer`添加一个Load Balancer服务：

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/rancher-lb-addition.jpg' }})

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/rancher-lb-config.jpg' }})

上述配置暴露了8090端口，Load Balance会将8090端口的请求转发给`mst-user-service`。

使用curl发送登录请求：

```sh
$ curl -X POST -H "Content-Type: application/json" -d '{"username":"admin", "password":"123"}' http://10.202.129.3:8090/api/authentication
{"username":"admin","role":"SYSTEM_ADMIN","privileges":["CREATE_USER","DELETE_USER","RETRIVE_USER","UPDATE_USER"]}
```

---

## 延伸阅读
- [CI基础 & Setup环境]({{ site.url }}{{ '/ci-basics/' }})
- [手把手搭建CI]({{ site.url }}{{ '/ci-setup-step-by-step/' }})
- [构建可持续部署的Pipeline]({{ site.url }}{{ '/ci-pipeline/' }})
- [持续集成的容器化策略]({{ site.url }}{{ '/ci-container-strategy/' }})
