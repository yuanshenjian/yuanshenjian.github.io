---
layout: post
title: 基于Netflix Zuul的API Gateway
topic: Micro Service
date: 2018-04-29
author: 谭艺冰
author_index: https://www.jianshu.com/u/a6b3075161bd

categories: [Micro Service]
tag: [Workshop@Micro Service]

brief: "
微服务治理Workshop系列之API Gateway。
"

---

* content
{:toc}

---

## API Gateway
API Gateway 是随着微服务（Microservice）这个概念一起兴起的一种架构模式，它用于解决微服务过于分散，没有一个统一的出入口进行流量管理的问题。
我们用两张图来解释：

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/api-gateway-original.jpg' }})


当使用微服务构建整个API服务时，一般有许多不同的应用在运行，如上图所示的`mst-user-service, mst-good-service, mst-order-service`，这些应用会需要一些通用的功能，比如Authentication, 这些功能过于分散，代码就需要在三个服务中都写一遍，因此需要有一个统一的出入口来管理流量，就像下图

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/api-gateway-optimization.jpg' }})

在请求不同微服务的API前，先通过一个统一的流量入口。
还可以针对不同的渠道和客户端提供不同的API Gateway,对于该模式的使用由另外一个大家熟知的方式叫Backend for front-end, 在Backend for front-end模式当中，我们可以针对不同的客户端分别创建其BFF。

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/api-gateway-bff.jpg' }})

---

## 使用Zuul实现API Gateway
现在我们使用Spring Cloud Zuul实现一个简单的API Gateway，先来体会一下API Gateway的魅力，稍后会对Zuul的工作原理做一个介绍。

### 依赖管理
创建一个空的gradle project，添加依赖：

*build.gradle*

```groovy
buildscript {
	ext {
		springBootVersion = '1.5.10.RELEASE'
	}
	repositories {
		maven { url "https://jitpack.io" }
		mavenCentral()
	}
​}
​
repositories {
	maven { url "https://jitpack.io" }
	mavenCentral()
}
​
dependencies {
    //...
    compile('org.springframework.cloud:spring-cloud-starter-feign:1.2.3.RELEASE')
    compile('org.springframework.cloud:spring-cloud-starter-zuul:1.3.5.RELEASE')
    compile('com.marcosbarbero.cloud:spring-cloud-zuul-ratelimit:1.4.0.RELEASE')
}
```

### 配置应用
首先，需要在spring application里添加的注解：

```java
@EnableZuulProxy
@EnableDiscoveryClient
```

配置`mst-zuul-service`中的bootstrap.yml文件：

*bootstrap.yml*

```yaml
spring:
  cloud:
    consul:
      enabled: true
      host: 127.0.0.1
      port: 8500
      config:
        enabled: true
      ribbon:
        enabled: true
      discovery:
        enabled: true
        register: true
        heartbeat:
          enabled: true
          ttlValue: 10
        preferIpAddress: true
        tags: localtag
        default-query-tag: localtag
        query-passing: true
```

配置`mst-user-service`的bootstrap.yml:

*bootstrap.yml*

```yaml
spring:
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
        tags: localtag  #必须与zuul的一致
```

配置`mst-zuul-service`中的application.yml文件：

*application.yml*

```yaml
zuul:
  routes:
    api:
      path: /api/**
      serviceId: mst-user-service
      stripPrefix: false
  ratelimit:
    enabled: true
    repository: IN_MEMORY
    policies:
      api:
        limit: 3
        refresh-interval: 60
        type: URL
```

关于zuul的配置：

- routes。当call`/api/**`的api，会去call serviceId为`mst-user-service`的服务
设置 `zuul.prefix` 可以为所有的匹配增加前缀, 例如 `/api .` 代理前缀默认会从请求路径中移除(通过`zuul.stripPrefix=false`可以关闭这个功能)
- ratelimit。`spring-cloud-zuul-ratelimit`是和zuul整合提供分布式限流策略的扩展
`repository`是支持的存储方式，总共有四种方式`IN_MEMORY, CONSUL, REDIS和JPA`
`limit`是单位时间内允许访问的个数，`refresh-interval`是单位时间设置
`type`是限流方式，共有三种`USER, ORIGIN, URL`

### 创建PreFilter

```java
@Component
public class PreFilter extends ZuulFilter {
  @Override
  public String filterType() {
    return PRE_TYPE;
  }
​
  @Override
  public int filterOrder() {
    return 7;
  }
​
  @Override
  public boolean shouldFilter() {
    return true;
  }
​
  @Override
  public Object run() {
    RequestContext requestContext = RequestContext.getCurrentContext();
    requestContext.addZuulRequestHeader("Authorization", "Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6IlNZU1RFTV9BRE1JTiIsInByaXZpbGVnZXMiOlsiQ1JFQVRFX1VTRVIiLCJVUERBVEVfVVNFUiIsIlJFVFJJVkVfVVNFUiIsIkRFTEVURV9VU0VSIl0sImV4cCI6NjE1MTU2NDk1NzZ9.jP7P4c5tRGQfVyFlJA6Ac_mCOGUNXCtz7-iNY0NkdSWhia4g-mnAgEKWlZBDdfcrOD7vStxc9hSrW4i7Dmr9Yw");
    return null;
  }
}
```

我们在run方法里设置了`request header: Authorization`，将`mst-user-service`的一个token添加到header中，当通过zuul的host请求user service的API，就不用在postman中写token了。

### 验证Gateway

启动consul和两个服务(mst-user-service, mst-zuul-service)
[基于Consul的服务注册和服务发现
]({{ site.url }}{{ '/service-registration-and-discovery/' }})


请求`/api/addresses/{id}`
这是mst-user-service里的一个api，mst-user-service的host是`http://127.0.0.1:8090`，mst-zuul-service的host是`http://127.0.0.1:8082`

请求3次及以下的结果：
![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/api-gateway-less-3.jpg' }})

请求超过3次的结果：
![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/api-gateway-more-3.jpg' }})


得到429的status是因为我们在zuul服务中的application.yml中添加了限流配置，设置了limit为3，而refresh-interval为60，意思是60秒内最多可接受3次请求，60秒后才可以重新接受请求。

---

## Zuul的原理

### Zuul的架构图

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/api-gateway-zuul.jpg' }})

zuul提供了一个框架，可以对过滤器进行动态的加载，编译，运行。过滤器之间没有直接的相互通信。他们是通过一个RequestContext的静态类来进行数据传递的。RequestContext类中有ThreadLocal变量来记录每个Request所需要传递的数据。

### Zuul的过滤器类型
- PRE：这种过滤器在请求到达Origin Server之前调用。比如身份验证，在集群中选择请求的Origin Server，记log等，workshop中用的就是这种过滤器。
- ROUTING：在这种过滤器中把用户请求发送给Origin Server。发送给Origin Server的用户请求在这类过滤器中build。并使用Apache HttpClient或者Netfilx Ribbon发送给Origin Server。
- POST：这种过滤器在用户请求从Origin Server返回以后执行。比如在返回的response上面加response header，做各种统计等。并在该过滤器中把response返回给客户。
- ERROR：在其他阶段发生错误时执行该过滤器。
- 客户定制：比如我们可以定制一种STATIC类型的过滤器，用来模拟生成返回给客户的response。

### 过滤器的生命周期
![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/api-gateway-filter-lifecycle.jpg' }})

一个请求会先按顺序通过所有的前置过滤器，之后在路由过滤器中转发给后端应用，得到响应后又会通过所有的后置过滤器，最后响应给客户端。在整个流程中如果发生了异常则会跳转到错误过滤器中。

---


## 参考
- [聊聊 API Gateway 和 Netflix Zuul](http://www.scienjus.com/api-gateway-and-netflix-zuul/)
- [API GateWay(网关)那些儿事](http://blog.springcloud.cn/sc/sc-zuul/)
- [Spring Boot : 使用 Zuul 实现 API Gateway 的路由和过滤 ( Routing and Filtering )](https://www.jianshu.com/p/e0434a421c03)
- [Zuul上实现限流（spring-cloud-zuul-ratelimit）](https://www.jianshu.com/p/d165e12df1da)

