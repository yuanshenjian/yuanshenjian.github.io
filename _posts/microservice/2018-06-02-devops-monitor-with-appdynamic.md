---
layout: post
title: 基于AppDynamics的应用监控系统
topic: Micro Service
date: 2018-06-02
author: 陈崇发
author_index: https://www.jianshu.com/u/6d9b0af2d0af

categories: [Micro Service]
tags: [Workshop@Micro-Service]

published: true

brief: "
微服务治理Workshop系列之运营监控篇。
"

---

* content
{:toc}

---

## AppDynamic是什么
Appdynamics 是一种**服务性能监控/管理工具**，主要包含两种功能：
1. 终端用户性能体验监控
2. 计算资源监控

### 类似的工具
在 [这篇文章](https://mp.weixin.qq.com/s/zFJokAv8lSQejGFTGJTJeQ) 中详细分析了微服务技术选型的内容，其中服务监控部分截图如下

![服务监控工具](http://upload-images.jianshu.io/upload_images/3059968-46bff9f9e26d907b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 为什么使用AppDynamic

### 微服务本身的复杂度带来的问题
> 微服务的特点决定了功能模块的部署是分布式的，以往在单应用环境下，所有的业务都在同一个服务器上，如果服务器出现错误和异常，我们只要盯住一个点，就可以快速定位和处理问题，但是在微服务的架构下，大部分功能模块都是单独部署运行的，彼此通过总线交互，都是无状态的服务，这种架构下，前后台的业务流会经过很多个微服务的处理和传递，我们难免会遇到这样的问题：
>
1. 分散在各个服务器上的日志怎么处理？
2. 如果业务流出现了错误和异常，如何定位是哪个点出的问题？
3. 如何快速定位问题？
4. 如何跟踪业务流的处理顺序和结果？
>
我们发现，以前在单应用下的日志监控很简单，在微服务架构下却成为了一个大问题，如果无法跟踪业务流，无法定位问题，我们将耗费大量的时间来查找和定位问题，在复杂的微服务交互关系中，我们就会非常被动。


### 微服务时代 运维监控是难点
![appdynamics 服务间调用路线概览](http://upload-images.jianshu.io/upload_images/3059968-a343304495fcddba.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



下面是 appdynamics 官方介绍视频中给出的例子，从中可以看出，一个简单的登陆请求，跨越了 5 个服务节点。
![appdynamics 请求追踪监控](http://upload-images.jianshu.io/upload_images/3059968-e13d93d9c3852755.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

appdynamics 会收集同一个一段时间内的处理情况，从中可以查看是否存在性能问题
![appdynamics 请求资源性能监控](http://upload-images.jianshu.io/upload_images/3059968-bef559f29b8a65e7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



## 怎么用AppDynamic
打开 [官网](https://www.appdynamics.com/)

![appdynamics 官网首页](http://upload-images.jianshu.io/upload_images/3059968-3b232436bfe5a87d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

* 点击**What is AppDynamics**，查看介绍视频
* 点击**What is AppDynamics**，注册之后开始试用

根据网站说明注册账户，注册之后，会收到 appdynamics 发来的注册确认邮件。

![appdynamics 注册确认邮件](http://upload-images.jianshu.io/upload_images/3059968-32919c9398d7e5c6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

根据邮件上的步骤提示，前往个人 SaaS，填写用户名密码，便可以查看 appdynamics Dashboard，根据第三步的提示，前往 appdynamics agent 的安装下载页面。

![ appdynamics agent 的安装下载页面](http://upload-images.jianshu.io/upload_images/3059968-f82728349c378725.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![appdynamics agents](http://upload-images.jianshu.io/upload_images/3059968-0986348743015967.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


下面，尝试搭建一个 service，注册到 appdynamics 上，看 service 的运行状况。


为了方便起见，使用 spring.io 上的例子，选取一个简单的 REST service 作为试验使用，执行下面的命令克隆并构建 jar 包

```shell
git clone https://github.com/spring-guides/gs-rest-service.git
cd gs-rest-service
cd complete
./gradlew build
```

将下载的 java agent 压缩包解压后放到 complete 的目录下，重命名为 `appagent`，最后使用 java 命令指定 agent 运行上一步构建的 jar 包。*[这里](https://docs.appdynamics.com/display/PRO44/Install+the+Java+Agent) 是 appdynamics java agent 的使用说明，如果在下面的安装使用过程中遇到问题，请参考解决。*

```shell
java -javaagent:./appagent/javaagent.jar -jar build/libs/gs-rest-service-0.1.0.jar
```

![指定 appagent 运行 jar ](http://upload-images.jianshu.io/upload_images/3059968-adb1bed421362db0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

在启动的过程中，spring boot 的日志输出与 appdynamics 的输出交互打印。从下面可以看出，spring boot 服务器已经启动了，但是 appdynamics 的输出还在持续。
![启动日志](http://upload-images.jianshu.io/upload_images/3059968-fe4045ec64ba14dc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


等到日志停止输出，如果发下没有错误提示，就说明已经正常启动，接下来打开 appdynamics 查看，此时可以发现已经监控了我们使用 agent 监控的服务。

![image.png](http://upload-images.jianshu.io/upload_images/3059968-ca9e65a8752ca3e3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


给刚刚启动的服务发送几次请求
![发送请求](http://upload-images.jianshu.io/upload_images/3059968-7fa3d2dc793497ad.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![监控请求](http://upload-images.jianshu.io/upload_images/3059968-745b8fc6f9a71a49.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![请求详情](http://upload-images.jianshu.io/upload_images/3059968-bb0eb223f09103aa.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


上面就是一个简单的 appdynamics java agent 的简单搭建使用过程，复杂的使用情景，请参照官网文档学习使用。

---

关于文中提到的 java agent，相关概念可以参看 [JVM源码分析之javaagent原理完全解读](http://www.infoq.com/cn/articles/javaagent-illustrated) 和 [How-to guide to writing a javaagent](https://zeroturnaround.com/rebellabs/how-to-inspect-classes-in-your-jvm/)。

本文了参考以下资源：

- <https://www.cnblogs.com/wintersun/p/6747355.html>
- <https://www.youtube.com/watch?v=sFuFotJD1vM>
- <https://mp.weixin.qq.com/s/zFJokAv8lSQejGFTGJTJeQ>
- <https://www.appdynamics.com/>
- <https://36kr.com/p/5115119.html>
- <http://www.infoq.com/cn/articles/javaagent-illustrated>
- <https://zeroturnaround.com/rebellabs/how-to-inspect-classes-in-your-jvm/>
