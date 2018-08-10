---
layout: post
title: 搭建基于GoCD的持续集成基础设施
topic: Micro Service
date: 2018-01-29
author: 袁慎建

categories: [Micro Service]
tag: [Workshop@Micro Service]

brief: "
微服务治理Workshop系列之CI/CD，搭建基础设施
"
---

* content
{:toc}

---

本节课我们一起来在Ubuntu机器上使用Docker来搭建来一步步地搭建CI基础设施（GoCD）。针对Mac OSX系统的开发人员，推荐使用Virtualbox 来Setup一个Ubuntu VM。

课程主要内容：

- 安装和配置Vagrant VM
- 安装和配置Nexus
- 安装和配置Go server
- 安装和配置Go agent
- 创建第一个Pipeline

---

## 准备工作
每个人在本地Mac OSX上需要安装如下工具：

- [Virtualbox](https://www.virtualbox.org/wiki/Downloads)
- [Vagrant](https://www.vagrantup.com/)

另外我们需要两台Ubuntu的VM，一台用于安装GoCD，一台用于安装Nexus。这里我们使用一台Vagrant VM(`10.29.5.155`) 和一台Scaleworks VM(`10.202.129.3`)。

---

## 安装和配置Vagrant VM
首先下载安装 [Vagrant](https://www.vagrantup.com/downloads.html)(v2.0.1) 和 [Virtualbox](https://www.virtualbox.org/wiki/Downloads)(v5.2.6)。

Vagrant是一个命令行工具，用于管理虚拟机生命周期（启动，关机，注销，移除等），非常易用，官方文档的 [getting-started](https://www.vagrantup.com/intro/getting-started/) 是一个很好的学习文档。

```
$ vagrant -v 
Vagrant 2.0.1
```

在你本地机器创建Vagrantfile配置文件，**强烈推荐你在本地机器的用户目录下创建一个mst的目录，此后相关文件都以此目录为根目录**:

```sh
$ cd ~
$ mkdir mst
```

*~/mst/vm/Vagrantfile*

```sh
# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  config.vm.define :mst_ci do |config|
     config.vm.box = "ubuntu/trusty64"
     config.vm.hostname = "tw-mst-ci"
     config.vm.synced_folder "~/mst/vm/ci/vagrant_shared", "/vagrant"
     config.vm.network :private_network, ip: "10.29.5.155"
     config.vm.provision :shell, path: "~/mst/vm/ci/vagrant_shared/setup_docker.sh"
     config.vm.provider "virtualbox" do |vb|
       vb.memory = "4096"
     end
   end
end
```

上述主要配置信息说明：

- hostname，指定虚拟机用户名。
- private_network，指定VM IP为`10.29.5.155`。
- synced_folder，Host主机与虚拟机所挂载的同步目录，前者是Host主机上的目录，必须存在，后者在虚拟机创建之后会自动创建。
- network，配置网络选项，可以配置虚拟机IP，以及与Host主机的端口映射。
- provision，指定运行的文件，可以在虚拟机创建好之后自动运行脚本安转所需要的环境，该文件必须存在于Host主机上。

在启动VM之前，我们来创建provision的shell脚本，用于安装docker和docker-compose(也可以使用Ansible)。

*~mst/vm/ci/vagrant\_shared/setup\_docker.sh*

```sh
#! /usr/bin/env bash

# Install docker
curl -fsSL get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker vagrant

# Install docker compose
sudo curl -L https://github.com/docker/compose/releases/download/1.18.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

启动Vagrant VM，等待启动以及安转docker和docker-compose:

```sh
$ vagrant up
...
```

ssh登录到VM：

```sh
$ vagrant ssh
Welcome to Ubuntu 14.04.5 LTS (GNU/Linux 3.13.0-105-generic x86_64)

 * Documentation:  https://help.ubuntu.com/

  System information as of Tue Jan 23 03:35:48 UTC 2018

  System load:  0.36              Users logged in:        0
  Usage of /:   4.9% of 39.34GB   IP address for eth0:    10.0.2.15
  Memory usage: 5%                IP address for eth1:    192.168.5.155
  Swap usage:   0%                IP address for docker0: 172.17.0.1
  Processes:    89

  Graph this data and manage this system at:
    https://landscape.canonical.com/

  Get cloud support with Ubuntu Advantage Cloud Guest:
    http://www.ubuntu.com/business/services/cloud

New release '16.04.3 LTS' available.
Run 'do-release-upgrade' to upgrade to it.


Last login: Tue Jan 23 03:35:48 2018 from 10.0.2.2
vagrant@tw-mst:~$
```

查看Vagrant VM中的docker和docker-compose:

```sh
$ docker -v
Docker version 18.01.0-ce, build 03596f5
$ docker-compose -v
docker-compose version 1.18.0, build 8dd22a9
```

---

## 安装配置Nexus
为了提升CI的效率，我们在Scaleworks VM上安装Nexus作为Docker Registry，用来存放构建过程的Artifacts（镜像文件）。后续会用这台机器安装Rancher agent以及部署服务（如果你机器性能足够好，可以使用Vagrant在本地来搭建VM）。

### 配置Docker Registry
在没有ssl证书的情况下，要让Vagrant VM中的docker能够使用我们搭建的非安全的Registry，我们需要更改Vagrant VM中的Docker配置文件，添加下面的配置：

*/etc/default/docker*

```properties
DOCKER_OPTS="--insecure-registry 10.202.129.3:5000"
```

更新配置后重启Docker：

```sh
$ sudo service docker restart
docker stop/waiting
docker start/running, process 13199
```

### 启动Nexus服务
配置好非安全的Registry，我们登录到Scaleworks VM中启动Nexus服务（以下操作在`10.202.129.3`机器中进行）：

```
$ mkdir -p ~/mst/ci
$ cd ~/mst/ci
$ docker run -d -u root -v $(pwd)/nexus-data:/nexus-data -p 5000:5000 -p 8081:8081 sonatype/nexus3
```

等待1~2分钟至启动完毕，在浏览器中访问 <http://10.202.129.3:8081/>，你会看到Nexus的主界面：
![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/nexus-home-page.jpg' }})


### 创建私有仓库
接下来，我们以默认的`admin/admin123`登录系统，创建一个名为`mst-nexus`，类型为`docker(hosted)`的仓库:

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/nexus-repository-creation.jpg' }})

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/config-nexus.jpg' }})

私有库创建完毕后，我们在Vagrant VM中使用Docker登录Registry(简单起见，这里直接使用明文密码)：

```sh
$ docker login 10.202.129.3:5000 -u admin -p admin123
WARNING! Using --password via the CLI is insecure. Use --password-stdin.
Login Succeeded
```

---

## 安装配置Go server && Go agent
GoCD是ThoughtWorks的一款开源产品。要使用GoCD，我们需要Setup `Go server`和`Go agent`。

### 启动Go server
到目前为止，我们已经安装配置了Nexus私有仓库，接下来要在Vagrant VM中使用镜像启动Go server。

在你本地机器使用Vagrant ssh登录到Vagrant VM：

```sh
$ cd ~/mst/vm
$ vagrant ssh mst_ci
```

启动Go server（后续操作在Vagrant VM中进行）：

```sh
$ cd ~/mst/ci/vm
$ docker run -d -v $(pwd)/go-server:/godata -v $HOME:/home/go -p8153:8153 -p8154:8154 gocd/gocd-server:v17.12.0
```

等待1~2分钟至启动完毕，在浏览器中访问 <http://10.29.5.155:8153/>，你会看到如下界面：

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/go-server-home-page.jpg' }})

### 自定义Go agent
因为我们要在Go agent里使用Docker来做一些构建任务，并且使用Rancher Compose来做部署，所以需要在原生的Go agent镜像中安装Docker和Rancher CLI，在`~/mst/ci/custom-agent-config/`目录下创建一个`Dockerfile`文件:

*~/mst/ci/custom-agent-config/Dockerfile*

```sh
FROM gocd/gocd-agent-alpine-3.5:v17.12.0

MAINTAINER sjyuan <sjyuan@thoughtworks.com>

WORKDIR /opt

RUN apk update && apk add docker

RUN curl -O -L https://github.com/rancher/rancher-compose/releases/download/v0.12.5/rancher-compose-linux-amd64-v0.12.5.tar.gz \
       && tar -xvf rancher-compose-linux-amd64-v0.12.5.tar.gz \
       && mv rancher-compose-v0.12.5/rancher-compose /usr/local/bin/
```

基于上述Dockerfile构建一个自定义的Go agent镜像：

```sh
$ cd ~/mst/ci/custom-agent-config
$ docker build -t gocd/gocd-agent-alpine-3.5:v17.12.0-rancher ./
```

### 启动并注册Go agent

在启动Go agent前，我们需要将下面命令中的`AGENT_AUTO_REGISTER_KEY`替换成自己机器上Go server中的`agentAutoRegisterKey`。要获取这个`agentAutoRegisterKey`，访问 <http://10.29.5.155:8153/go/admin/config_xml>，会看到如下图所示的`agentAutoRegisterKey`:

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/agent-auto-register-key.jpg' }})

完成替换后，使用替换后的命令启动并注册Go agent：

```sh
$ cd ~/mst/ci/
$ sudo chmod 666 /var/run/docker.sock
$ docker run -d -e WORKDIR=$(pwd)/go-agent -e GO_SERVER_URL=https://10.29.5.155:8154/go -v $(pwd)/go-agent:/godata -v /var/run/docker.sock:/var/run/docker.sock:rw -v $HOME/.docker:/home/go/.docker:rw -e AGENT_AUTO_REGISTER_KEY=e91e80ec-65ad-4d5e-b683-07274fe0245f -e AGENT_AUTO_REGISTER_RESOURCES=docker -e AGENT_AUTO_REGISTER_HOSTNAME=superman gocd/gocd-agent-alpine-3.5:v17.12.0-rancher
```

等待1~2分钟至启动完毕，在Go server web界面上进入`AGENT` Tab启用agent：

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/enable-go-agent.jpg' }})

---

## 创建第一个Pipeline
到目前为止，我们的Go server和Go agent安装配置完毕。接下来我们来创建第一个Pipeline，并为Pipeline设置一个stage，进而使用已注册的agent来执行任务。

首先，创建一个名为`mst-user-service`的Pipeline，Group为`mst`，并配置Materials为`https://github.com/tw-ms-training/mst-user-service.git`：

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/basic-setting-marerials.jpg' }})

为Pipeline配置一个Stage和一个Job：

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/stage-job.jpg' }})

运行Pipeline，我们的CI红了：

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/ci-red.jpg' }})

从日志上可以看出构建失败的原始是因为Go agent上没有安装JDK，那么如何在不安装JDK的前提下让构建通过？请进入主题 [*在Pipeline中使用Docker执行构建任务*]({{ site.url }}{{ '/topics/micro-service/build-pipeline-with-docker/' }})。

---

## Troubleshoots

### docker login错误

```
Error saving credentials: open /home/vagrant/.docker/config.json: permission denied
```

因为登录时会往config.json文件中写入信息，而该文件属于root用户：  

```sh
$ sudo docker login 10.29.5.155:5000 -u admin -p admin123
```

### 运行docker命令出现警告  

```
WARNING: Error loading config file: /home/vagrant/.docker/config.json - open /home/vagrant/.docker/config.json: permission denied
```  

可以通过更改文件的权限消除警告：  

```sh
$ sudo chmod 644 /home/vagrant/.docker/config.json
```

---

## 延伸阅读
- [CI基础 & Setup环境]({{ site.url }}{{ '/ci-basics/' }})
- [手把手搭建CI]({{ site.url }}{{ '/ci-setup-step-by-step/' }})
- [构建可持续部署的Pipeline]({{ site.url }}{{ '/ci-pipeline/' }})
- [持续集成的容器化策略]({{ site.url }}{{ '/ci-container-strategy/' }})

---

## 代码库
- [mst-user-service](https://github.com/tw-ms-training/mst-user-service.git)


