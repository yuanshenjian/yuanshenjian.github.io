---
layout: post

title: "部署流水线"
date: 2020-09-18
categories: [Agile]
tags: [AGILE, AGILE-DELIVERY]
column: AGILE-DELIVERY
sub-tag: "DELIVERY"

author: "袁慎建"

brief: "
自动化构建和测试环境的挑战之一是，你希望快速构建，以便可以快速获得反馈，而运行全面的测试却需要很长的时间。部署流水线可以解决这个问题，它将构建分解为多个阶，它以额外的时间为代价，分阶段循序渐进地为你增加信心，部署流水线在早期阶段可以发现大多数问题，并提供更快的反馈，而在后期阶段则通过探索来提供相对较慢的反馈。部署流水线是持续交付的核心。
"

---

* content
{:toc}



自动化构建和测试环境的挑战之一是，你希望快速构建，以便可以快速获得反馈，而运行全面的测试却需要很长的时间。部署流水线可以解决这个问题，它将构建分解为多个阶，它以额外的时间为代价，分阶段循序渐进地为你增加信心，部署流水线在早期阶段可以发现大多数问题，并提供更快的反馈，而在后期阶段则通过探索来提供相对较慢的反馈。部署流水线是[持续交付]({{site.url | append: '/continuous-delivery'}})（[ContinuousDelivery](https://martinfowler.com/bliki/ContinuousDelivery.html)）的核心。

部署流水线第一个阶段通常用来执行编译，为后续阶段提供二进制文件。后续的阶段可能包含了手工测试，例如那些无法自动化的测试。每个阶段可能是自动的，也可能需要人工授权。它们还能同时并行运行在多台机器上来加快构建速度。流水线的最后一个阶段通常是部署到生产环境中。

更广泛地说，部署流水线的工作是检测任何可能导致生产环境问题的更改。这些问题包括性能、安全或可用性。部署流水线应支持交付软件的各个团队之间的协作，并为每个人提供有关系统更改流程的可见性，以及全面的审核跟踪。

引入持续交付的一种好方法是将当前交付过程建模为部署流水线，然后检查并发现该过程中的瓶颈、自动化机会和协作点。

有关更多信息，请参见[持续交付书](https://martinfowler.com/books/continuousDelivery.html)的第5章，可以[免费下载](https://www.informit.com/articles/article.aspx?p=1621865)。

#### 致谢
Jez Humble在此文上提供了详细的帮助。

#### 声明
本文翻译自Martin Fowler的文章*DeploymentPipeline*：

- 原文链接： [DeploymentPipeline](https://martinfowler.com/bliki/DeploymentPipeline.html)
- 原文作者： [Martin Fowler](https://martinfowler.com/)
- 发表时间： 2013年5月30日
