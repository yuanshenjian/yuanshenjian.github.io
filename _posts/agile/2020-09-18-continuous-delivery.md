---
layout: post

title: "持续交付"
date: 2020-09-18
categories: [Agile]
tags: [AGILE, AGILE-DELIVERY]
column: AGILE
sub-tag: "AGILE-DELIVERY"

author: "袁慎建"

brief: "
持续交付是一种软件开发规程（discipline），在这种规范下构建的软件，具备可以随时发布到生产环境的能力。通过持续地集成开发团队完成的软件，构建可执行文件并在这些可执行文件上运行自动化测试，可以实现持续交付。此外，你要将可执行文件推送到越来越接近生产的环境中，以确保软件将来可以在生产环境中正常工作。这个过程你可以使用部署流水线。
"

---

* content
{:toc}

Continuous Delivery is a software development discipline where you build software in such a way that the software can be released to production at any time.

持续交付是一种软件开发规程（discipline），在这种规范下构建的软件，具备可以随时发布到生产环境的能力。


你所在的项目如果具备以下特点，则说明你正在做持续交付[注1]：

- 你的软件在整个生命周期中都是可部署的
- 你的团队将保持软件可部署性的优先级置于处理新特性之上
- 每当有人更改了系统，任何人都可以获得快速、自动化的反馈，从而知晓系统在生产环境中的最新情况
- 你可以根据需要在任何环境中一键部署任何版本

通过持续地集成开发团队完成的软件，构建可执行文件并在这些可执行文件上运行自动化测试，可以实现持续交付。此外，你要将可执行文件推送到越来越接近生产的环境中，以确保软件将来可以在生产环境中正常工作。这个过程你可以使用[部署流水线]({{site.url | append: '/deployment-pipeline'}})（[DeploymentPipeline](https://martinfowler.com/bliki/DeploymentPipeline.html)）。

持续交付团队的关键特征是，**当业务发起人要求立即将软件的当前开发版本部署到生产环境中时**，没人会对此感到惊讶，更不用说恐慌了。

要实现持续交付，你需要：

- 交付团队中每个人之间紧密协作（通常称为[DevOps文化]({{site.url | append: '/devops-culture'}})（[DevOpsCulture](https://martinfowler.com/bliki/DevOpsCulture.html)）[注2]）。
- 交付过程中所有可能部分都进行自动化，通常使用[部署流水线]({{site.url | append: '/deployment-pipeline'}})（[DeploymentPipeline](https://martinfowler.com/bliki/DeploymentPipeline.html)）

持续交付有时容易跟**持续部署**搞混淆。持续部署意味着每项变更都会贯穿整个过程并自动部署到生产环境中，这样子每天就会部署多次到生产环境中。持续交付只是意味着你有能力进行频繁的部署，但不一定会这么做。通常是由于业务方选择了较慢的部署频率。要做到持续部署，你首先必须做好持续交付。

持续集成（[Continuous Integration](https://martinfowler.com/articles/continuousIntegration.html)）通常指在开发环境中集成、构建和测试代码。持续交付建立在此基础上，处理生产部署所需的最后阶段。

持续交付的主要好处是：
- **低部署风险：**因为你部署的是较小的变更，所以降低了出错的几率，并且在出现问题时更容易修复。
- **可信赖的进度：**许多人通过跟踪已完成的工作来跟踪进度。如果“完成”表示“开发人员宣布已完成”，则与将其部署到生产（或类生产）环境中相比，其可信度要低得多。
- **用户反馈：**任何软件工作面临的最大风险是最终构建出没用的软件。你能够越早、越频繁地在真实用户之前拿到可工作的软件，你就能越快地获得反馈，从而更好地识别出软件的真正价值（特别是使用了[ObservedRequirements](https://martinfowler.com/bliki/ObservedRequirement.html)的时候）。

用户反馈需要你进行持续部署。如果你想收集用户反馈，但又不想让所有用户都使用新版本，你可以部署到一个用户子集。在我们最近的一个项目中，那家零售商首是将新版本的在线系统部署给内部员工使用，然后部署到一组被邀请的高级客户群，最后才覆盖所有的客户。

#### 延伸阅读
要了解更多信息，最好的在线学习资源是Jez Humble的[持续交付](http://continuousdelivery.com/)页面(Jez特别解释了[为什么](https://continuousdelivery.com/2010/08/continuous-delivery-vs-continuous-deployment/)他和Dave Farley选择了持续交付这个名字，并将其与持续部署进行了对比)。更多细节，你应该去看看[这本书](https://martinfowler.com/books/continuousDelivery.html)[译注1]。在我的[指南页面](https://martinfowler.com/delivery.html)上我也罗列了一些资源。

#### 致谢
[Jez Humble](http://jezhumble.com/)在此文上面上提供了详细的帮助。


#### 注释
1. 这些指标由ThoughtWorks的持续交付工作组开发。
3. 尽管名称为"devops"，但它应该延伸到开发人员和运维人员之外，包括测试人员，数据库团队以及将软件发布到生产环境过程中所需要的任何人。
3. 译注1：中文版是《[持续交付 : 发布可靠软件的系统方法](https://book.douban.com/subject/6862062/)》

2014年8月12日更新，增加了关于好处和部署到用户子集的文本。



#### 声明
本文翻译自Martin Fowler的文章*ContinuousDelivery*：

- 原文链接： [ContinuousDelivery](https://martinfowler.com/bliki/ContinuousDelivery.html)
- 原文作者： [Martin Fowler](https://martinfowler.com/)
- 发表时间： 2013年5月30日
