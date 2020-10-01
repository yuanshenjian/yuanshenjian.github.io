---
layout: post
title: 在Pipeline中使用Docker执行构建任务
topic: Micro Service
date: 2018-02-09
author: 袁慎建

categories: [Micro Service]
tags: [Workshop@Micro-Service]

published: true

brief: "
微服务治理Workshop系列之CI/CD，容器化构建。
"

---

* content
{:toc}
brief: "
微服务治理Workshop系列之CI/CD，容器化构建。
"

---

上节课我们完成了 [搭建基于GoCD的持续集成基础设施]({{ site.url }}{{'/setup-ci-with-gocd/'}})，最后以我们的第一个pipeline的失败而结束，那么本节课的核心目标是扩展Pileline，并让Pipeline由红转绿。

主要任务有：

- 扩展并配置stage
- 编写build scripts
- Pipeline as Code

---

## 准备工作
在你本地的Vagrant VM（`10.29.5.155`）上将上节课中的Go server、Go agent容器启动，另外确保你搭建的Nexus服务正常启动：

```sh
$ docker ps -a
$ docker start <go_server_contain_id>
$ docker start <go_agent_contain_id>
```

---

## 扩展并配置Stage
上节课我们为了演示Pipeline，创加了一个名为`compile`的stage，该stage中直接执行了`./gradlew compileJava`，现在我们来将task交由Docker容器去执行。

首先我们将上节课中创建的`compile` stage更新为`test`，并将Task更改为执行工程根目录的Shell脚本。

```sh
$ bash -e scripts/test.sh
```

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/pipeline-with-scripts.jpg' }})

添加一个名为`build` 的stage，并按照上述方式配置task为：

```sh
$ bash -e scripts/build.sh
```

---

## 编写build scripts
更新后的stage中，task都执行了shell脚本，接下来我们需要在 [mst-user-service](https://github.com/tw-ms-training/mst-user-service) 代码库中添加这些脚本。

建议按照下面指令创建script目录（代码库的地址填写你自己的）：

```sh
$ mkdir ~/mst
$ cd ~/mst
$ git clone https://github.com/tw-ms-training/mst-user-service
$ cd mst-user-service
$ mkdir scripts
$ touch test.sh
$ touch build.sh
$ touch deploy.sh
```

*test.sh*

```sh
#! /usr/bin/env bash
set -x
set -e

docker run --rm -v /tmp/gradle-caches:/root/.gradle/caches -v $WORKDIR/pipelines/$GO_PIPELINE_NAME:/opt/app -w /opt/app gradle:3.5-jdk8 gradle clean test
```

*build.sh*

```sh
#! /usr/bin/env bash
set -x
set -e

docker run --rm -v /tmp/gradle-caches:/root/.gradle/caches -v $WORKDIR/pipelines/$GO_PIPELINE_NAME:/opt/app -w /opt/app gradle:3.5-jdk8 gradle clean bootRepackage

if [[ -z $DOCKER_REGISRTY ]]; then
  DOCKER_REGISRTY=10.29.5.155:5000
fi

IMAGE_NAME=${DOCKER_REGISRTY}/tw-ms-training/user-service:${GO_PIPELINE_COUNTER}

docker build -t $IMAGE_NAME .
docker push $IMAGE_NAME
docker rmi $IMAGE_NAME
```

上述`build.sh`脚本中，`docker build -t $IMAGE_NAME .`命令基于项目根目录中的`Docerfile`构建了一个镜像，所以我们还需要创建一个`Dockerfile`：

```docker
FROM openjdk:8-alpine

MAINTAINER sjyuan <sjyuan@thoughtworks.com>

COPY build/libs/*.jar /app/*.jar

WORKDIR /app

CMD java -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+PrintGCDateStamps -XX:+PrintHeapAtGC -verbose:gc -XX:+PrintTenuringDistribution -XX:+PrintGCApplicationStoppedTime -Xloggc:gc_cdm.log -jar *.jar
```

最后做一次commit。

---

## Pipeline as Code
到目前为止，我们在Go Server的Web Page上手动创建的Pipeline，但这些手动的操作不可以被持久化以及复用，就像人工测试测试一样，必须每次都重复一样的操作，不利于自动化管理。GoCD支持从代码生成Pipeline，即Pipeline as Code。这种方式最直观的两个好处是：

- 可以对Code进行版本控制。
- 可以复用。

在GoCD中启用Pipeline as Code只需要一个简单的配置，访问 <http://10.29.5.155:8153/go/admin/config_xml>，加入如下配置：

```xml
<config-repos>
    <config-repo pluginId="yaml.config.plugin" id="mst-pipeline">
      <git url="https://github.com/tw-ms-training/mst-pipelines" />
    </config-repo>
</config-repos>
```

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/pipeline-as-code.jpg' }})

Go会去扫描`https://github.com/tw-ms-training/mst-pipelines`代码库，所以接下来我们需要在该代码库中创建一个以`.gocd.yml`结尾的文件作为配置文件（任何符合`*.gocd.yml`格式的文件都会被发现和执行）。

针对我们之前创建的pipeline，创建一个`mst-user-service.gocd.yml`文件：

*~/mst-pipeline/pipelines/mst-user-service.gocd.yml*

```yaml
pipelines:
  mst-user-service:
    group: mst
    label_template: "${COUNT}"
    locking: off
    materials:
      app:
        git: https://github.com/tw-ms-training/mst-user-service
        branch: master
    stages:
      - test:
          clean_workspace: true
          jobs:
            test:
              tasks:
                - exec:
                    command: bash
                    arguments:
                      - "-e"
                      - "./scripts/test.sh"
                    run_if: passed
      - build:
          clean_workspace: yes
          jobs:
            build:
              tasks:
                - exec:
                    command: bash
                    arguments:
                      - "-e"
                      - "./scripts/build.sh"
                    run_if: passed
```

做一次commit，Go会基于该配置文件生成一条Pipeline。如果你的配置文件中的Pipeline名称与你手动创建的一样，会产生冲突，将手动创建的删除掉即可，或者更改配置文件中的名称。

到目前为止，我们的服务还没有被部署到一个可以访问的地方。关于Pipeline的最后一站部署，请进入下一个主题 [使用Rancher Compose部署服务]({{ site.url }}{{ '/deploy-with-rancher-compose/' }})

---

## Troubleshoot

### Docker进程权限问题
如果你的`test` Stage在执行的时候出现如下错误：

```sh
docker: Cannot connect to the Docker daemon. Is the docker daemon running on this host?.
```
说明在Go Agent中执行docker失败，这是由于`/var/run/docker.sock`的权限问题导致。要解决这个问题，先来回顾一下我们上节课在注册Go Agent的命令：

```sh
$ docker run -d -e WORKDIR=$(pwd)/go-agent -e GO_SERVER_URL=https://172.17.0.1:8154/go -v $(pwd)/go-agent:/godata -v $HOME:/home/go -v /var/run/docker.sock:/var/run/docker.sock:rw -v $HOME/.docker:/home/go/.docker:rw -e AGENT_AUTO_REGISTER_KEY=211f2c07-97cb-47b2-9eaf-af1326f190e2 -e AGENT_AUTO_REGISTER_RESOURCES=docker -e AGENT_AUTO_REGISTER_HOSTNAME=superman gocd/gocd-agent-alpine-3.5:v17.12.0-rancher
```

以上命令中 `-v /var/run/docker.sock:/var/run/docker.sock:rw`是将本机的docker.sock挂在到Go Agent容器中，我们赋予的rw权限如果没有生效，更改`/var/run/docker.sock`的权限:

```sh
$ chmod 666 /var/run/docker.sock
```

重新运行Pipeline即可。

---

## 延伸阅读
- [CI基础 & Setup环境]({{ site.url }}{{ '/ci-basics/' }})
- [手把手搭建CI]({{ site.url }}{{ '/ci-setup-step-by-step/' }})
- [构建可持续部署的Pipeline]({{ site.url }}{{ '/ci-pipeline/' }})
- [持续集成的容器化策略]({{ site.url }}{{ '/ci-container-strategy/' }})

