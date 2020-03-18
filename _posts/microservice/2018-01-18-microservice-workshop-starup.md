---
layout: post
title: 微服务Workshop启动
topic: Micro Service
date: 2018-01-18
author: 袁慎建

categories: [Micro Service]
tags: [Workshop@Micro Service]

published: false

brief: "
微服务治理Workshop系列之培训介绍。
"

---

* content
{:toc}

---

## 背景
比较幸运，我被Local项目微服务培训组织抽选为微服务培训的学员之一，参加了历时两个周末的微服务培训，加深了我对微服务理论和技术实践的理解。而我所服务的项目也在运用这些实践，经过长达半年时间的协作和观察，我发现在项目开发过程中一些DEV对项目上所使用的微服务相关的技术实践并不是很了解，或者换一种说法：对项目技术实践缺乏一个全貌的了解。

在众多力量的推动下，我决定搞一场微服务相关的培训。因为偏重技术实践，培训以Workshop的形式展开，理论结合实践，实践多于讲解。

---

## 目标
组织本次Workshop的出发点主要有三点：

- 团队能力培养。驾驭微服务需要一定的高度，希望通过此次培训加强团队成员对微服务相关技术实践运用的成熟度，从而在项目中更好地解决相关问题。
- 挖掘和培养讲师。培训的讲师皆来自民间项目组，每个人把自己擅长的主题分享出来，一方面加强自己的理解，另一方面强化了解演讲和动手能力，同时参加培训的学员可以在后续的培训中作为讲师输出主题。
- 抛砖引玉。培训起到引线的作用，从而激发公司其他Office和项目组发起这种培训。

---

## 内容
培训内容主要偏重技术实践，通过一个简单的业务场景来驱动技术实践的落地，先来看看我们的简单业务场景：
![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/user-journey-1.jpg' }})

以下是上述业务场景的系统交互图：

![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/user-journey-2.jpg' }})

以上业务场景被划分到三个服务中，目前用户认证逻辑包含在`mst-user-service`中，并且存在一些跨服务调用，后续可以通过API Gateway和BFF进行改进。

整个Workshop的主题内容如下：
![]({{ site.url }}{{ site.img_path }}{{ '/topic/microservice/agendar.jpg' }})

---

## 团队
本次Workshop准备历时一个多月，提前招募了数名讲师，还有数名志愿者，最后面向北京Office招募了25名学员。

### 讲师团
讲师团成员负责输出主题内容，并提供现场辅导，讲师团成员有：

- 袁慎建
- 冯博
- 沈建
- 李强
- 吴邦
- 张琳
- 黄亚铭
- 张沙沙

### 学员团
此次Workshop面向北京Office招募了25名学员，共分为五组，5个人一组，每个组选定一个组长，组长负责Drive完成小组homework。


### 志愿者
我为此次培训申请了5台VM，为了节省课程时间，提前招募了两位志愿者在VM上搭建技术基础设施，另外招募了一名志愿者负责相关组织工作和订餐，还有数名小伙伴输出主题文章，他们是：

- 赵琪琪（设计Newsletter && 输出文章）
- 陈崇发（搭建环境 && 输出文章）
- 谭艺冰（搭建环境）
- 潘旖旎（组织和订餐）


---

## 资料库
- [mst-user-service](https://github.com/tw-ms-training/mst-user-service)
- [mst-order-service](https://github.com/tw-ms-training/mst-order-service)
- [mst-goods-service](https://github.com/tw-ms-training/mst-goods-service)
- [Slides](https://drive.google.com/drive/folders/1UFRdwXQUOiFMdBlbKUbPzOzOQTIGxX7A)

上述代码库已经包含了后续培训的很多功能，建议你从头开始，借助 <https://start.spring.io/>生成空project，跟着后续教程一步一步展开。


