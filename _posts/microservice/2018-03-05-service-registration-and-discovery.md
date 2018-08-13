---
layout: post
title: 基于Consul的服务注册和服务发现
topic: Micro Service
date: 2018-03-05
author: 赵琪琪
author_index: https://www.jianshu.com/u/2db65e841261

categories: [Micro Service]
tag: [Workshop@Micro Service]

brief: "
微服务治理Workshop系列之服务注册与发现。
"

---

* content
{:toc}

---

上节课我们 [使用Rancher Compose部署了mst-user-service]({{ site.url }}{{ '/deploy-with-rancher-compose/' }})，我们的Pipeline已经搭建完毕，这节课我们切换到跟开发人员更密切的主题：如何在众多微服务中管理我们的服务注册和发现。

本节课主要内容：

- 服务注册
- 服务发现
- Consul Template

---

## 准备工作
这节课我们一起在本地机器搭建基于consul的服务注册和发现，并针对`mst-user-service`、`mst-order-service`、`mst-goods-service`三个服务配置服务注册和发现。

```sh
$ cd ~/mst
$ git clone git@github.com:tw-ms-training/mst-user-service.git
$ git clone git@github.com:tw-ms-training/mst-order-service.git
$ git clone git@github.com:tw-ms-training/mst-goods-service.git
```

开始之前，先来了解一下服务注册与发现工作原理：

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/service-registration-theory.jpg' }})

- 当User Service启动的时候，会向Consul发送一个POST请求，告诉Consul自己的IP和Port
- Consul 接收到User Service的注册后，每隔10s（默认）会向User Service发送一个健康检查的请求，检验User Service是否健康
- 当Order Service发送 GET 方式请求`/api/addresses`到User Service时，会先从Consul中拿到一个存储服务 IP 和 Port 的临时表，从表中拿到User Service的IP和Port后再发送`GET`方式请求`/api/addresses`
- 该临时表每隔10s会更新，只包含有通过了健康检查的Service

---

## 服务注册
>服务进程在注册中心注册自己的位置。它通常注册自己的主机和端口号，有时还包含了身份验证信息、协议、版本号以及运行环境的详细资料。

首先我们使用docker启动一个consul服务，然后配置在应用程序中启用服务发现。

### 启动consul服务

```sh
$ docker run -d -p 8500:8500 -p 8300:8300 -p 8301:8301 -p 8302:8302 -p 8600:8600 consul:0.9.2 agent -dev -bind=0.0.0.0 -client=0.0.0.0
```

在浏览器中访问 <http://127.0.0.1:8500>，可以看到一个非常简洁的consul主页面。

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/consul-home-page.jpg' }})

---

### 配置应用程序
要启用Consul服务注册和发现，我们需要添加相关的依赖，我们以`mst-user-service`为例。

*build.gralde*

```groovy
dependencyManagement {
    imports {
        mavenBom "org.springframework.cloud:spring-cloud-dependencies:Edgware.RELEASE"
    }
}

dependencies {
	...
	compile('org.springframework.boot:spring-boot-starter-actuator')
	compile('org.springframework.cloud:spring-cloud-starter-consul-discovery')
	...
}
```

接下来配置应用程序Spring Cloud Consul，我们需要创建一个bootstrap.xml配置文件，这个文件会优先于application.yml文件被应用的父Context加载：

*bootstrap.yml*

```yaml
spring:
  profiles:
    active: ${ACTIVE_PROFILE:local}
  application:
    name: mst-user-service
  cloud:
    consul:
      enabled: true
      host: ${CONSUL_HOST:127.0.0.1}
      port: 8500
      ribbon:
        enabled: true
      discovery:
        enabled: true
        register: true
```

在应用程序入口通过注解`@EnableDiscoveryClient`启用consul:

*MstUserServiceApplication.java*

```java
@SpringBootApplication
@EnableDiscoveryClient
public class MstUserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(MstUserServiceApplication.class, args);
    }
}
```

在浏览器中访问 <http://127.0.0.1:8500/>，可以看到界面多了一个`mst-user-service`：

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/user-service-registration-failing.jpg' }})

此次应用的健康状态是`failing`的。要改变健康状态为`passing`，需要授权health check。

### 授权health check
consul会调用`GET /health` API来检查应用的健康状态，所以我们需要配置Spring Security，让它放行这个API：

*WebSecurityConfig.java*

```java
@Configuration
@EnableGlobalMethodSecurity(securedEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    // ...
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // ...
        http.authorizeRequests()
                .antMatchers(HttpMethod.GET, "/health").permitAll()
                .antMatchers(HttpMethod.POST, "/api/authentication").permitAll()
                .anyRequest().authenticated();
    }
}
```

重启应用程序，会发现健康状态发生了改变：

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/user-service-registration-passing.jpg' }})


---

## 服务发现
> 客户端应用进程向注册中心发起查询，来获取服务的位置。服务发现的一个重要作用就是提供一个可用的服务列表。

我们已经将`mst-user-service`注册到Consul中，如何让其他服务发现它，是我们接下来要做的事情，我们再将`mst-order-service`注册并能够通过Consul来发现`mst-user-service`。

除了配置Consul让`mst-order-service`注册到Consul，还需要添加一个Feign的依赖来测试服务的互相调用：

*build.gradle*

```groovy
dependencies {
     ...
     compile('org.springframework.cloud:spring-cloud-starter-feign')
     ... 
}
```

在应用程序入口通过注解`@EnableDiscoveryClient`启用Consul，并添加`@EnableFeignClients`，同样需要授权Health Check。

*MstOrderServiceApplication.java*

```java
@EnableDiscoveryClient
@EnableFeignClients
@SpringBootApplication
public class MstOrderServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(MstUserServiceApplication.class, args);
    }
}
```

接下来在`mst-order-service`创建一个接口测试服务之间的调用：

```java
@FeignClient("mst-user-service")  
 public interface UserClient {
     @GetMapping("/api/users/names")
     List<String> getUserNames();
}
```

启动服务，服务注册成功之后可以使用Post来测试跨服务调用。

---

## Consul Template
Consul Template是基于Consul的自动替换配置文件的应用，它提供了一种便捷的方式从Consul中获取存储的值，Consul Template守护进程会查询Consul实例来更新系统指定的任何模板，并且在更新完成后，模板还可以选择运行任意的命令。

Consul Template可以查询Consul中的服务目录、Key和Key-values等。这种强大的抽象功能和查询语言模板使得Consul Template特别适合于动态创建配置文件。例如：创建Apache/Nginx Proxy Balancers、Varnish Servers、Application Configurations等等。

接下来，我们使用Consule Template来动态配置Nginx并生成Nginx的配置文件。

### 安装
Mac OSX可以使用以下命令来安装和Consul-template和Nginx，其他操作系统使用对应的命令安转。

```sh
$ brew install nginx
$ brew install consul-template
```

### 配置模板

创建Consul Template Configuration文件`config.json`

*~/consult-template/config.json*

```nginx
 {
   "consul": {
     "address": "http://127.0.0.1:8500"
   },
   "template": {
     "source": "./config.ctmpl",
     "destination": "/usr/local/etc/nginx/servers/ms-nginx.conf",
     "command": "brew services reload nginx"
  }
}
```

- command：生成模板后执行的任意命令。如果你是用的是Ubuntu系统，命令需要更改成于操作系统一致的命令。
- destination：生成的Nginx配置文件的目标位置，操作系统不同，安装nginx目录也不相同。

创建Nginx模板文件`config.ctmpl`：

*~/consult-template/config.ctmpl*

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/consul-template-origin.jpg' }})


启动Consul Template:

```sh
$ consul-template -config ./config.json
Stopping `nginx`... (might take a while)
==> Successfully stopped `nginx` (label: homebrew.mxcl.nginx)
==> Successfully started `nginx` (label: homebrew.mxcl.nginx)
```

可以查看自动生成好的Nginx模板:

```nginx
$ cat /usr/local/etc/nginx/servers/ms-nginx.conf
```


### 动态替换

在Consul中为服务添加路由Key/Value

- `matchers/mst-user-service` -> `/api/(users)`
- `matchers/mst-order-service` -> `/api/(goods)`

访问 <http://127.0.0.1:8500/ui/#/dc1/kv/> 可以查看配置的Key/Value。

修改模板`config.ctmpl`：

*~/consult-template/config.ctmpl*

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/consul-template.jpg' }})

修改完之后，需要重启Consul Template，此后在Consul界面中更改了Key/Value之后会自动生效。

上述所有操作完毕后，我们可以通过Nginx来转发我们特定的请求到对应的服务上。









