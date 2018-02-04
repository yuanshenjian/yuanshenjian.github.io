---
layout: topic
title: 断路器与服务熔断
permalink: /topics/micro-service/service-circuit-breaker-with-hytrix/
topic: Micro service
date: 2018-01-29
author: 赵琪琪
author_index: https://www.jianshu.com/u/2db65e841261
---

* content
{:toc}

---

上节课我们搭建了 [基于Consul的服务注册和服务发现]({{ site.url }}{{ '/topics/micro-service/service-registration-and-discovery-with-consul/' }})，为微服务互相调用提供了服务查询列表。微服务在互相调用的过程中，因为下游服务产生了延时导致上游服务不可用，而延时可能会一直蔓延下去，最糟糕的情况是，整个系统面临`"雪崩"`，这节课我们借助一些技术手段提升服务的容错能力。


本文主要内容：

- 服务容错保护
- 断路器
- 动手实践

## 准备工作
在开始前，我们先了解服务容错保护，它的主要功能：服务降级、依赖隔离、断路器。

- 服务降级：在被调方服务挂了，不能给予调用方正确响应的时候，返回给调用方一个比较接近的响应。
- 依赖隔离：微服务的最佳搭档Docker，将每个服务放在不同容器里，容器与容器之间互不影响。而这里的依赖隔离，则是为每一个Hystrix命令创建一个独立的线程池，这样当某一个线程池出现延迟的情况下，只会影响到此次服务调用，而其他服务调用依然正常。
- 断路器：在被调方服务挂了的时候还能给调用方响应。

本文将通过断路器来介绍Hystrix是如何实现这三种机制的。

---

## 断路器
`"断路器"`本身是一种开关装置，用于在电路上保护线路过载，当线路中有电器发生短路时，`"断路器"`能够及时的切断故障电路，防止发生过载、发热、甚至起火等严重后果。

在分布式架构中，断路器模式的作用也是类似的，如果某个目标服务调用慢或者有大量超时，此时，熔断改服务的调用该，对于后续调用请求，不在调用目标服务，直接返回，快速释放资源。

### 为什么需要断路器
我们的系统中有n个应用服务，它们之间存在 A 调用 B，B 调用 C，C 调用.....N 的关系。此时，由于某些原因我们的服务 N 挂了，接着服务 N-1，N-2，...... C，B，A 这一系列的服务都挂了，即服务雪崩效应。

![](http://upload-images.jianshu.io/upload_images/3100944-02918d1cd2ae3060.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

为了保证高可用性，我们需要做到：

- 服务 n 挂的时候，断开与服务 n-1 之间的调用关系
- 服务 n-1 在服务 n 挂的时候，还能正常运行 

所以，为了达到上述目标，我们就需要引入断路器来做服务容错保护。

### 工作原理
断路器什么时候会打开？这里涉及到断路器的三个重要参数：`快照时间窗`、`请求总数下限`、`错误百分比下限`。

- 快照时间窗：断路器确定是否需要统计一些请求和错误数据，而统计的时间范围就是快照时间窗，默认 10 秒

- 请求总数下限：在快照时间窗内，必须满足请求总数下线才有资格熔断。默认 20，意味在 10 秒内，如果 hystrix 命令的调用不足 20 次，即使所有的请求失败，断路器都不会打开。

- 错误百分比下限：当请求总数在快照时间内超过了下限，比如发生了 30 次调用，如果在这 30 次调用中，有 16 次发生了超时异常，也就是超过 50% 的错误百分比，在默认设定 50% 下限的情况下，断路器就会打开。


断路器打开之前发生了什么呢？

每个请求都会在 hystrix 超时之后返回 fallback，每个请求时间延迟就是近似 hystrix 的超时时间，假设是 5 秒，那么每个请求都要延迟 5 秒后才返回。当熔断器在 10 秒内发现请求总数超过 20，并且错误百分比超过 50%，此时熔断打开。

断路器打开之后，又会发生什么呢？

熔断打开之后，再有请求调用的时候，将不会调用主逻辑，而是直接调用降级逻辑，这个时候就会快速返回，而不是等待 5 秒才返回 fallback。通过断路器，实现了自动发现错误并将降级逻辑切为主逻辑，减少响应延迟。

降级后，主逻辑又是怎么恢复的呢？

当断路器打开，主逻辑被熔断后，hystrix 会启动一个休眠时间窗，在这个时间窗内，降级逻辑就是主逻辑；当休眠时间窗到期，断路器进入半开状态，释放一次请求到原来的主逻辑上，如果此次请求返回正常，那么断路器将闭合，主逻辑恢复，如果这次请求依然失败，断路器继续打开，休眠时间窗重新计时。


---

## 动手实践
在我们的应用有这样一个API，查看订单详情，需要发请求到order service拿到 order 信息，再发请求到goods service拿到 goods的信息。

如果goods挂了，也会殃及order，因此，我们需要在order和goods中间加入熔断。

在order service 中添加依赖：

*build.gradle*

```groovy
dependencies {
    compile('org.springframework.cloud:spring-cloud-starter-feign')
    compile('org.springframework.cloud:spring-cloud-starter-hystrix')
    compile('org.springframework.cloud:spring-cloud-starter-hystrix-dashboard')
}

dependencyManagement {
	imports {
		mavenBom "org.springframework.cloud:spring-cloud-dependencies:Edgware.RELEASE"
	}
}
```

在应用入口通过@EnableCircuitBreaker注解来启用断路器：

```java
@EnableCircuitBreaker
@EnableFeignClients
@EnableDiscoveryClient
@SpringBootApplication
public class MstOrderServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(MstOrderServiceApplication.class, args);
	}
}
```

配置应用程序：

*application.yml*

```yaml
feign:
  hystrix:
    enable: true

circuitBreaker:
  requestVolumeThreshold: 2

metrics:
  rollingStats:
    numBuckets: 5

execution:
  isolation:
    thread:
      timeoutInMilliseconds: 2000
```

在GoodsClient中加入fallback，指定服务降级的返回值

*GoodsClient.java*

```java
@FeignClient(value = "mst-goods-service", fallback = GoodClientFallback.class)
public interface GoodsClient {

    @RequestMapping(method = RequestMethod.GET, path = "/api/goods/{goods_id}")
    GoodsDTO getOne(@PathVariable("goods_id") Long goodsId);
}
```

实现fallback中指定的类:

*GoodClientFallback.java*

```java
import org.springframework.stereotype.Component;

@Component
public class GoodClientFallback implements GoodsClient {

    @Override
    public GoodsDTO getOne(Long goodsId) {
        return new GoodsDTO(1l, 12.3, 2l, "name");
    }
}
```

到此，order service和goods service之间的熔断已经实现了。

