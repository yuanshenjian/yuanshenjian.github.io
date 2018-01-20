---
layout: post
title: 构建基于GoCD的持续集成基础设施

permalink: /topics/micro-service/setup-ci-with-gocd/

date: 2018-01-17
---

* content
{:toc}

---

本节课我们要在Mac OSX上使用Docker来搭建来一步步地搭建CI基础设施（GoCD）。在开始之前，为了提升CI的效率，预先在本地安装一个私有的nexus仓库，用来存放构建过程的Artifacts（镜像文件）。

课程主要内容：

- 安装和配置Nexus
- 安装和配置Go Server
- 安装和配置Go Agent
- 创建第一个Pipeline

---

### 准备工作
需要每个人在本地Mac OSX上需要安装如下工具：

- Docker
- Docker Compose


---

### 安装配置Nexus
**启动一个Nexus服务**

```
$ docker run -d -v $(pwd)/nexusdata:/nexus-data -p 5000:5000 -p 8081:8081 sonatype/nexus3
```

等待1~2分钟至启动完毕，在浏览器中访问 `http://127.0.0.1:8081`，你会看到Nexus的主界面：
![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/nexus-home-page.jpg' }})

**创建私有仓库**

接下来，我们以`admin/admin123`用户登录进入系统，创建一个名为`mst-nexus`，类型为`docker(hosted)`的仓库:

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/nexus-repository-creation.jpg' }})

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/config-nexus.jpg' }})


**配置Docker Daemon**

在Mac OSX中，我们需要针对http请求放开权限，并且将`127.0.0.1:5000`添加到 `Inscure registers`列表中：

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/mac-docker-daemon-setup.jpg' }})

---

### 安装配置Go Server + Go Agent

#### 启动Go Server

安装好私有仓库，我们可以使用镜像启动一个Go Server：

```sh
docker run -d -v $(pwd)/goserver:/godata -v $HOME:/home/go -p8153:8153 -p8154:8154 gocd/gocd-server:v17.12.0
```

等待1~2分钟至启动完毕，在浏览器中访问`http://127.0.0.1:8153`，你会看到如下界面：

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/go-server-home-page.jpg' }})

#### 自定义Go Agent

因为我们要在Go Agent里使用docker来做一些构建任务，并且使用rancher compose来做部署，所以需要在原生的Go Agent镜像中安装docker和rancher compose cli，在`~/mst/ci-cd/`目录下创建一个`Dockerfile`文件:

```sh
FROM gocd/gocd-agent-alpine-3.5:v17.12.0

MAINTAINER jshen <jshen@thoughtworks.com>

WORKDIR /opt

RUN apk update && apk add docker

RUN curl -O -L https://github.com/rancher/rancher-compose/releases/download/v0.12.5/rancher-compose-linux-amd64-v0.12.5.tar.gz \
       && tar -xvf rancher-compose-linux-amd64-v0.12.5.tar.gz \
       && mv rancher-compose-v0.12.5/rancher-compose /usr/local/bin/
```

基于上述Dockerfile构建一个自定义的Go Agent镜像：

```sh
$ cd ~/mst/ci-cd/
$ docker build -t gocd/gocd-agent-alpine-3.5:v17.12.0-rancher dockerfiles/gocd-agent-with-rancher-cli/
```

#### 启动并注册Go Agent

在启动Go Agent前，我们需要将下面命令中的`AGENT_AUTO_REGISTER_KEY`替换成自己机器上Go Server中的`agentAutoRegisterKey`。要获取这个`agentAutoRegisterKey`，访问`http://127.0.0.1:8153/go/admin/config_xml`，会看到如下图所示的`agentAutoRegisterKey`:

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/agent-auto-register-key.jpg' }})

完成替换后，使用替换后的命令启动并注册Go Agent：

```sh
$ cd ~/mst/ci-cd/
$ docker run -d -e WORKDIR=$(pwd)/goagent -e GO_SERVER_URL=https://172.17.0.1:8154/go -v $(pwd)/goagent:/godata -v $HOME:/home/go -v /var/run/docker.sock:/var/run/docker.sock:rw -v $HOME/.docker:/home/go/.docker:rw -e AGENT_AUTO_REGISTER_KEY=211f2c07-97cb-47b2-9eaf-af1326f190e2 -e AGENT_AUTO_REGISTER_RESOURCES=docker -e AGENT_AUTO_REGISTER_HOSTNAME=superman gocd/gocd-agent-alpine-3.5:v17.12.0-rancher
```

等待1~2分钟至启动完毕，在Go Server Web界面上进入`AGENT` Tab启用Agent：

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/enable-go-agent.jpg' }})

---

### 创建第一个Pipeline
到目前为止，我们的Go Server和Go Agent安装配置完毕。接下来我们来创建第一个Pipeline，并为Pipeline设置一个Stage，进而使用已注册的Agent来执行任务。

首先，创建一个名为`mst-user-service`的Pipeline，Group为`mst`，并配置Materials：

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/basic-setting-marerials.jpg' }})

为Pipeline配置一个Stage和一个Job：

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/stage-job.jpg' }})

运行Pipeline，我们的CI红了：

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/ci-red.jpg' }})

从日志上可以看出构建失败的原始是因为Go Agent上没有安装JDK，那么如何在不安装JDK的前提下让构建通过？请进入主题 [*在Pipeline中使用Docker执行构建任务*]({{ site.url }}{{ '/topics/micro-service/build-pipeline-with-docker/' }})。

---

## 延伸阅读
- [CI基础 & Setup环境]({{ site.url }}{{ '/ci-basics/' }})
- [手把手搭建CI]({{ site.url }}{{ '/ci-setup-step-by-step/' }})
- [构建可持续部署的Pipeline]({{ site.url }}{{ '/ci-pipeline/' }})
- [持续集成的容器化策略]({{ site.url }}{{ '/ci-container-strategy/' }})



