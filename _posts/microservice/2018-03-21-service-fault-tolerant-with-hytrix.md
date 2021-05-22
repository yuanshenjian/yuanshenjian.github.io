---
layout: post
title: 基于Hystix的服务容错保护
topic: Micro Service
date: 2018-03-21
author: 赵琪琪
author_index: https://www.jianshu.com/u/2db65e841261

categories: [Micro Service]
tags: [Workshop@Micro-Service]

published: true

brief: "
微服务治理Workshop系列之服务容错，主要涉及服务熔断和服务降级。
"

---

* content
{:toc}

---

上节课我们搭建了 [基于Consul的服务注册和服务发现]({{ site.url }}{{ '/service-registration-and-discovery/' }})，为微服务互相调用提供了服务查询列表。微服务在互相调用的过程中，因为下游服务产生了延时导致上游服务不可用，而延时可能会一直蔓延下去，最糟糕的情况是，整个系统面临 [`雪崩`](https://zh.wikipedia.org/wiki/%E9%9B%AA%E5%B4%A9)，这节课我们借助一些技术手段提升服务的容错能力。


本文主要内容：

- 服务容错保护
- 服务降级
- 服务熔断
- 动手实践
- 服务降级 VS 服务熔断


## 服务容错保护
在开始前，我们先了解服务容错保护，它主要涉及三大块功能：服务降级、依赖隔离、服务熔断。假设服务A调用了服务B：

- 服务熔断：当服务A调用服务B的请求满足一定的规则，比如10秒内请求数达到20个，并且有一半以上的请求失败了，此时我们通过切断对服务B的调用来保护系统的整体响应，这种操作即为服务熔断。
- 服务降级：在服务B被熔断之后，服务A不会真正地调用服务B。取而代之的是，我们在服务A中定义一个服务降级逻辑（通常是一个fallback接口），此时服务A会直接调用服务降级逻辑快速获取返回结果。
- 依赖隔离：微服务的最佳搭档Docker，将每个服务放在不同容器里，容器与容器之间互不影响。而这里的依赖隔离，则是为每一个Hystrix命令创建一个独立的线程池，这样当某一个线程池出现延迟的情况下，只会影响到此次服务调用，而其他服务调用依然正常。

本文将介绍Hystrix是如何实现这三种机制的。

---

## 服务降级
先来举个女生旅行例子：

>喜欢旅行的女生都会有一个旅行箱，平时周边游箱子绰绰有余，但一旦要出远门，可能再大的箱子都白搭了，怎么办呢？常见的做法就是把物品拿出来进行比较分类，最后将一些非必需品忍痛留下，等下次箱子够用了再带上。

服务降级类似女生旅行：*在用户访问量高峰期，整体资源面临不足的时候，将一些重要优先程度相对较低的服务先关掉，等到过了高峰期再恢复。比如京东商城在双十一期间，可能会对评论服务进行服务降级。*

回到微服务系统，服务A调用服务B，当我们对服务B进行降级后，服务A将直接调用预定义的降级逻辑（即方法调用代替跨服务请求），从而快速获取返回结果，而*降级方法逻辑的返回结果与真实服务B的返回结果的区别* 就好比 *残次品与良品的区别*，此时我们认为服务B所提供的服务质量降低了，即我所说的降级。

在Hytrix的实现中，我们会在调用方预定义一个服务降级的方法接口，在服务调用超时的时候直接调用该方法快速获取返回值。下面代码是使用`FeignClient`实现的服务降级：

```java
// 主逻辑
@FeignClient(value = "mst-goods-service", fallback = GoodClientFallback.class)
public interface GoodsClient {
    @RequestMapping(method = RequestMethod.GET, path = "/api/goods/{goods_id}")
    GoodsDTO getOne(@PathVariable("goods_id") Long goodsId);
}

// 降级逻辑
@Component
public class GoodClientFallback implements GoodsClient {
    @Override
    public GoodsDTO getOne(Long goodsId) {
        return new GoodsDTO(1l, 12.3, 2l, "name");
    }
}
```

---

## 服务熔断
断路器模式源于的 [CircuitBreaker](https://martinfowler.com/bliki/CircuitBreaker.html) 一文。断路器本身是一种开关装置，用于在电路上保护线路过载，当线路中有电器发生短路时，它能够及时的切断故障电路，防止发生过载、发热、甚至起火等严重后果。

在分布式架构中，断路器模式的作用也是类似的，如果某个目标服务调用慢或者有大量超时，此时，熔断该服务的调用，对于后续调用请求，不再调用目标服务，直接返回结果，快速释放资源，避免最终因为服务不可用蔓延导致系统雪崩灾难。

### 为什么需要断路器
假设我们系统中有N个应用服务，它们之间存在A调用B，B调用C，C调用.....N的关系。此时，由于某些原因我们的服务N挂了，接着服务N-1、N-2、......、C、B、A 这一系列的服务都挂了，即发生了服务雪崩效应。

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/service-invocations.jpg' }})

为了保证高可用性，我们需要做到：

- 服务N挂的时候，断开与服务N-1之间的调用关系
- 服务N-1在服务N挂的时候，还能正常运行

所以，为了达到上述目标，我们就需要引入断路器来做服务容错保护。

### 工作原理
断路器什么时候会打开？这里涉及到断路器的三个重要参数：`快照时间窗`、`请求总数下限`、`错误百分比下限`。

- 快照时间窗：断路器确定是否需要统计一些请求和错误数据，而统计的时间范围就是快照时间窗，默认10秒
- 请求总数下限：在快照时间窗内，必须满足请求总数下限才会启用熔断。默认20，意味着在10秒内，如果调用不足20次，即便所有的请求都失败，断路器都不会打开。
- 错误百分比下限：当请求总数在快照时间内超过了下限，比如发生了30次调用，如果在这 30次调用中，有16次发生了超时异常，也就是超过50%的错误百分比，在默认设定50%下限的情况下，断路器就会打开。


*断路器打开之前发生了什么？*

每个请求都会在超时之后调用降级逻辑，每个请求时间延迟就是近似Hystrix的超时时间，假设是5秒，那么每个请求都要延迟5秒后才返回。当熔断器在10秒内发现请求总数超过20，并且错误百分比超过50%，此时熔断打开。

*断路器打开之后，又会发生什么？*

熔断打开之后，再有请求调用的时候，将不会调用主逻辑，而是直接调用降级逻辑，这个时候就会快速返回，而不是等待5秒后才返回fallback。通过断路器实现了自动发现错误并将降级逻辑切换为主逻辑，减少响应延迟的效果。

在断路器打开之后，降级逻辑已经被成了主逻辑，那么原来的主逻辑如何恢复呢？

Hystrix会启动一个休眠时间窗，在这个时间窗内，降级逻辑是临时的成为主逻辑，当休眠时间窗到期，断路器就进入半开状态，释放一次请求到原来的主逻辑上。如果此次请求正常返回，那么断路器将会关闭，主逻辑恢复正常。否则，断路器继续保持打开状态，而休眠时间窗会重新计时。

---

## 动手实践
在我们的应用有这样一个API，查看订单详情，需要发请求到order service拿到order信息，再发请求到goods service拿到 goods的信息。

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

在应用入口通过`@EnableCircuitBreaker`注解来启用断路器：

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

在GoodsClient中加入fallback，指定服务降级逻辑

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


---

## 服务降级 VS 服务熔断
我们使用Hystrix做服务容错保护时，一般在服务熔断后会自动切换到服务降级逻辑，可能给我们带来一个幻觉：*两者是一体的*。其实，服务降级和服务熔断并没有必然的联系，下面介绍一下它们的相似点和不同点。

两者的相似点

- *目标一致*，都是从可用性可靠性着想，为防止系统的整体缓慢甚至崩溃，采用的技术手段。
- *最终表现类似*，最终让用户体验到的是某些功能暂时不可用。
- *控制粒度相似*，通常都是服务级别，不过业界也有不少更细粒度的做法，比如做到数据持久层（允许查询，不允许增删改）。
- *自治性要求很高*，熔断模式一般都是服务基于策略的自动触发，降级虽说可人工干预，但在微服务架构下，完全靠人显然不可能，开关预置、配置中心都是必要手段。

两者的不同点：

- *触发原因*，服务熔断是因为某个服务的故障引起的，而服务降级是因为我们的策略所致，比如我们从整个系统全局出发考虑，按照服务优先级提前备选了方案。
- *管理目标*，熔断是一个框架级的处理，每个微服务都需要配置，无业务层级之分，更偏向于技术。而降级一般需要对业务有层级之分，比如降级是从最外围、优先重要程度低的服务开始，更偏向于业务。
- *实现方式*，这点可以参考上文的介绍。
