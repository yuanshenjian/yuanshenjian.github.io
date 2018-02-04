---
layout: topic
title: 基于Spring Cloud Config的服务配置中心
permalink: /topics/micro-service/service-config-server/
topic: Micro service
date: 2018-02-01
author: 袁慎建
---

* content
{:toc}

---

在之前的课程中我们掌握了如何 [利用Consul进行服务注册和服务发现]({{ site.url }}{{ '/topics/micro-service/service-registration-and-discovery-with-consul/' }})，也实现了 [服务的容错机制]({{ site.url }}{{ '/topics/micro-service/service-circuit-breaker-with-hytrix/' }})。到目前为止，我们的每个服务的配置文件都是host在自身代码库中，当服务数量达到一定数量后，管理这些分散的配置文件会成为一个痛点。这节课我么就来解决配置文件管理的痛点。

本节课主要内容：

- Config repository
- Config Server
- Config Client
- Spring Cloud Config扩展
- Spring Boot Actuator

---

## 准备工作
这节课，我们以`mst-user-service`为例，使用Spring Cloud Config来搭建微服务的配置管理中心。

```sh
$ cd ~
$ git clone git@github.com:tw-ms-training/mst-user-service.git
```

Spring Cloud Config的目标是将各个微服务的配置文件集中存储一个文件仓库中（比如系统目录，Git仓库等等），然后通过Config Server从文件仓库中去读取配置文件，而各个微服务作为Config Client通过给Config Server发送请求指令来获取特定的Profile的配置文件，从而为自身的应用提供配置信息。同时还提供配置文件自动刷新功能。

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/spring-cloud-config-theory.jpg' }})

## Setup Config Repository
我们在GitHub上创建一个 [mst-config-storage](https://github.com/tw-ms-training/mst-config-storage)，在工程中创建一个跟`mst-user-service`的子目录，并创建两个配置文件：

*mst-config-storage/mst-user-service/application-qa.yml*

```yaml
user:
  default: sjyuan-qa
  home-page: http://sjyuan.cc
```

*mst-config-storage/mst-user-service/application-uat.yml*

```yaml
user:
  default: sjyuan-uat
  home-page: http://sjyuan.cc
```

---

## Setup Config Server
再次借助 <http://start.spring.io/> 为我们生成一个名为 [mst-config-server](https://github.com/tw-ms-training/mst-config-server) 的Spring Boot的Gradle工程。

添加相应的依赖：

*build.gralde*

```groovy
dependencies {
	compile('org.springframework.boot:spring-boot-starter-actuator')
	compile('org.springframework.cloud:spring-cloud-config-server')
}

dependencyManagement {
	imports {
		mavenBom "org.springframework.cloud:spring-cloud-dependencies:Edgware.RELEASE"
	}
}
```

在应用的入口添加`@EnableConfigServer`注解来启用Config Server：

*MstConfigServerApplication.java*

```java
@SpringBootApplication
@EnableConfigServer
@EnableDiscoveryClient
public class MstConfigServerApplication {
	public static void main(String[] args) {
		SpringApplication.run(MstConfigServerApplication.class, args);
	}
}
```

配置Config Server读取配置文件仓库的规则：

*bootstrap.yml*

```yaml
server.port: 9999
spring:
  profiles:
    active: ${ACTIVE_PROFILE:local}
  application:
    name: mst-config-service
  cloud:
    config:
      server:
        git:
          uri: https://github.com/tw-ms-training/mst-config-storage.git
          clone-on-start: true
          search-paths: '{application}'
          host-key: ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCqAiyCU8CrYYu0pAo25Sv+U4BOFk4N0sdyzhGfbWarJvqqJrmFZDabIDeR9Ob9NT5HLljLGpjYcZ02107lvQ25aci3UIlr+SyfS0pPX6Ml0LkRm1pSulAGNpJ3Y2ldywvhbJet0wpaQAEuHCXL0CjURQsI0Y6P2JwQxgDAJunRT0EP6Tk78WhpFRfSuQdVu+9iekudS6Pkl/3OIZXSlvsUiYOwOP8sJrve1ahw9zuWOs3KXBPsOjpkadUu2tC231jHSeBl+dCJxw86nov888gKHtLVUjkdOgKsMRzX6lxFJANaB1O0X0mOMft80YSqt9gEtRQrCP6HJ3Q3SCX6zoLD sjyuan@thoughtworks.com
          repos:
            none_prod:
              pattern:
                - '*/qa'
                - '*/uat'
              uri: https://github.com/tw-ms-training/mst-config-storage.git
              searchPaths: '{application}'
            prod:
              pattern:
                - '*/prod'
              uri: https://github.com/tw-ms-training/mst-config-storage.git
              searchPaths: '{application}'
```

- search-paths：对应的是配置文件仓库的目录，这些目录跟服务的application name要保持一致，比如`mst-user-service`。
- uri：配置文件的仓库地址。
- host-key：如果是SSH获取需要Key，它的值便是Config Server的`~/.ssh/id_rsa.pub`文件的值。另外，还有一种`username/password`的授权方式。
- repos：可以指定多个repository，这个适用于需要配置多个配置文件仓库的项目，比如生产配置信息隔离。

提交配置文件仓库，启动Config Server，服务正常启动后我们可以发送请求检索配置信息，Spring Cloud Config Server提供了如下获取配置信息的API（建议都请求试一试这些API）：

- `GET /{application}/{profile}[/{label}]`
- `GET /{application}-{profile}.yml`
- `GET /{label}/{application}-{profile}.yml`
- `GET /{application}-{profile}.properties`

`lable`为Git仓库的分支名，默认是`master`。`application`和`profile`为应用的名称和active profile：

```yaml
spring:
  profiles:
    active: ${ACTIVE_PROFILE:local}
  application:
    name: mst-config-service
```

---

## Setup Config Client
Config Server已经就绪，我们来更改`mst-user-service`的配置，让它从Config Server去获取配置信息。

添加相关依赖：

*build.gralde*

```groovy
dependencies {
    compile('org.springframework.boot:spring-boot-starter-actuator')
    compile('org.springframework.cloud:spring-cloud-starter-config')
}

dependencyManagement {
    imports {
        mavenBom "org.springframework.cloud:spring-cloud-dependencies:Edgware.RELEASE"
    }
}
```

为应用程序启用Config：

*bootstrap.yml*

```yaml
server.port: 8090

spring:
  profiles:
    active: ${ACTIVE_PROFILE:local}
  application:
    name: mst-user-service
  cloud:
    config:
      uri: ${CONFIG_SERVER_URI:http://127.0.0.1:9999}
      enabled: true
```

配置完毕后，我们来添加一段代码测试它从Config Server拿到的配置信息：

*GreetingController.java*

```java
@RestController
public class GreetingController {
    @Value("${user.default}")
    private String defaultUser;

    @Value("${user.home-page}")
    private String homePage;

    @GetMapping("/greeting")
    public String getDefaultUser() {
        return String.join(": ", defaultUser, homePage);
    }
}
```

启动`mst-user-service`并指定`ACTIVE_PROFILE`为qa或uat：

```sh
$ export ACTIVE_PROFILE=qa && ./gradlew bRun
```

---

## Spring Cloud Config扩展
这节课中我们将`mst-user-service`改造成从Config Service获取配置信息。Spring Cloud Config作为微服务的配置中心，主要存在两种落地实践：

- 每个环境部署一个Config Server，但是都从同一个配置文件仓库中获取配置。如果生产配置信息需要单独隔离，可以指定多个配置文件仓库。
- 所有环境都使用同一个Config Server，这个时候Config Server是一个固定配置中心。同样，生产配置信息需要单独隔离，可以指定多个配置文件仓库。

针对于第一种情况，可以将Config Server当成一个服务注册到Consul中，在应用服务中通过服务发现来连接Config Server。

我们按照之前关于服务注册和发现的课程指南将Config Server注册到Consul中，然后在Config Client中更改配置文件通过`service-id`来连接Config Server：

*bootstrap.yml*

```yaml
spring:
  profiles:
    active: ${ACTIVE_PROFILE:local}
  application:
    name: mst-user-service
  cloud:
    config:
      enabled: true
      discovery:
        enabled: true
        service-id: mst-config-server
```

Spring Cloud Config还提供了自动刷新功能以及安全加密等功能，关于Spring Cloud Config更多内容，请参阅 [Spring Cloud Config](http://cloud.spring.io/spring-cloud-config/1.4.x/single/spring-cloud-config.html)。

---

## Spring Boot Actuator
`spring-boot-starter-actuator`模块提供了应用程序的交互入口，它暴露了一些端点用于应用程序的监控和管理。比如服务注册和发现中提到的Health Check就是它暴露的API。它还提供内置的端口：

- 应用配置。获取应用中加载的应用配置、环境变量、自动化配置等信息。比如，端口`/info`、`/env`、`/beans`等。
- 度量指标。获取应用程序运行过程中用于监控的度量指标（线程池、HTTP请求统计、磁盘信息、缓存状态）。比如，端口`/metrics`、`/health`。
- 操作控制。提供了对应用的关闭等操作类功能。比如，端口`/shutdown`

关于`spring-boot-starter-actuator`更多内容，请参阅 [Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-endpoints.html)。

---



