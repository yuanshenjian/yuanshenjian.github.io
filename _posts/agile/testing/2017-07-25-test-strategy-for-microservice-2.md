---
layout: post

title: "微服务架构下的测试应对策略（下）"
date: 2017-07-25
categories: [Agile]
tags: [AGILE, AGILE-TESTING]
column: AGILE-TESTING

author: "袁慎建"

brief: "
微服务架构解决了单体应用的痛点，打破了SOA的瓶颈，同时也带来了很多的复杂性。部署运维方面，服务的部署、管理、监控。开发设计方面，服务的拆分、设计、编码、测试都将会变得复杂。幸运的是，容器化技术（比如无比流行的Docker）已经很大程度上帮助我们克服了环境的差异性，而一些容器编排工具诸如Kubernetes, Rancher, Docker-compose 提供了容器部署管理的解决方案。作为行业的领航者，ThoughtWorks也在极力倡导 开发、设计、部署、运维一体化 的DEVOPS文化理念，并通过丰富的咨询和交付成果来帮助企业研发团队更好地实施微服务架构的开发。
<br/><br/>

那么在编码测试方面，又有什么新招来保证微服务架构下系统的质量？

<br/><br/>

本文接着上一篇来阐述消费者驱动契约测试。
"

---

* content
{:toc}

---


在 [上一篇]({{ '/test-strategy-to-meet-microservice-architecture-1/' }}) 中我们了解了测试策略的转变，本文我将为大家揭晓*消费者驱动契约测试*。

## CDCT
消费者驱动契约测试的流程是，消费者定义他们期望的API或消息是什么样子，这些期望即为契约，从这些契约可以生成存根，此后消费者团队可以在构建过程中重复使用它们。*消费者和生产者都需要验证契约*。

CDCT强调契约由消费者来驱动，并由双方**共同遵守**，核心是**共同遵守**。

*那么如何保证**共同遵守**呢？*

敏捷宣言中提到 `可工作的软件 优于 面面俱到的文档`。引入Contract概念的测试会定义一个Contract文档（JSON协议文件）。对于消费方，该文档被用作测试断言依据，文档被转换成一个`可工作的软件`（可执行的测试套件：修改文档会导致测试失败）。而对于服务提供方，因为测试的断言与Contract文档没有强制关联，它最多只能是一个`面面俱到的文档`。

所以，只有当双方都将文档转换成可工作的软件时，文档的修改便会导致任意一方测试失败，文档才真正成为双方**共同遵守**的契约（可工作的软件总是可靠的，文档却有可能已经过期）。

消费者驱动契约测试中存在一个契约，双方基于契约生成可工作的测试套件：

![]({{ site.url }}{{ site.img_path }}{{ '/xp/cdct.jpg' }})

CDCT具备了`引入Contract概念集成测试`的诸多优点，并且通过可工作的测试套件保证了契约的一致性和实时性。

---

## 技术实践

>运筹帷幄之中，决胜千里之外。

三国明星诸葛亮负责运筹帷幄，关、张、赵等武将负责冲锋陷阵，从而决胜千里之外的硝烟战场。团队确定了测试策略之后，应当交由优秀工具来实施执行。

关于单元测试，业界已经有非常优秀的测试工具和框架，比如我们正在做的Springboot应用，`JUnit`, `Mockito`, `JMock`, `Hamcrest`等都是测试工具箱里的明星。对于CDCT，目前比较流行的有JVM框架 [Spring cloud Contract](http://cloud.spring.io/spring-cloud-contract/spring-cloud-contract.html)，以及支持多语言的 [Pact](https://docs.pact.io/)。

如果团队正在开发一个Springboot应用，[Spring cloud Contract](http://cloud.spring.io/spring-cloud-contract/spring-cloud-contract.html) 是一个不错的选择。它使用Groovy DSL定义测试契约并生成测试套件，测试套件去验证服务提供方是否满足契约，测试通过之后会生成一个jar文件，该jar文件随后会作为一个可运行的Stub server，消费方基于Stub server编写测试，从而验证功能是否满足契约：

![]({{ site.url }}{{ site.img_path }}{{ '/xp/spring-cloud-contract.jpg' }})

在CDCT中，不管是测试生产者还是测试消费者，都需要引入一种快速失败方法。即如果任何一方违反了契约，最好在构建的第一分钟就失败，而不是等到2小时之后的集成测试中失败。所以，我们需要将CDCT作为构建Pipeline中的一个Stage集成到CI中。


---

## 何去何从
代价高昂的UI测试使得开发团队逐渐对它失去了信心，尤其引入了微服务架构，它所带来的复杂性使得业界摒弃UI测试的呼声高涨。早在2009年，著名的敏捷和TDD专家J.B. Rainsberger在InfoQ上提出 [Integration Tests Are a Scam](https://www.infoq.com/presentations/integration-tests-scam)。

>集成测试是一个骗局，你可能需要编写2-5%集成测试来做一个E2E的测试，但它们可能到处在重复单元测，另外集成测试存在彼此重复。更糟糕的是，当集成测试失败时，你不知道哪里出了问题，不能及时准确定位问题。

J.B. Rainsberger后来还在博客上发表了 [《Integration Tests Are a Scam》](http://blog.thecodewhisperer.com/permalink/integrated-tests-are-a-scam)，文章借用强有力的数据分析来证实自己的观点。他提出的最佳实践是：**用契约测试或协议测试来做集成测试！**

Martin Fowller 在2012年的 [测试金字塔理论](https://martinfowler.com/bliki/TestPyramid.html) 中也指出：

>应该引入面向应用程序服务层的中间层测试，这些测试既保持了端到端测试的诸多优势，又避免了许多与UI框架相关的复杂性。在Web应用程序中，中间层测试相当于API层测试，而位于金字塔顶层的UI测试则相当于Selenium测试。

[ThoughtWorks技术雷达](https://www.thoughtworks.com/radar/techniques/consumer-driven-contract-testing) 于2016年已经正式采纳消费者驱动契约测试。

>We’ve decided to bring consumer-driven contract testing back from the archive for this edition even though we had allowed it to fade in the past.

微服务架构的盛行促使越来越多的开发团队开始引入CDCT，逐渐淡化UI测试。团队的测试策略正在发生不同的演变：

![]({{ site.url }}{{ site.img_path }}{{ '/xp/testpyamid-evolution.jpg' }})

引入了CDCT并摆出了正确的姿势，便可大大弱化UI测试，甚至可以使用少量的人工测试来代替自动化UI测试。CDCT帮助我们缓解了UI测试的痛点，但也要当心走极端，譬如有些团队的测试策略发生了下面的极端情况：

![]({{ site.url }}{{ site.img_path }}{{ '/xp/testpyramid-bad-evolution.jpg' }})

软件工程曾经从未产出银弹，相信未来也不会，一种新的方案的诞生只是解决了已有方案的痛点，好比微服务架构解决了单体的那些痛点之后，却又带来了足够的复杂性，从而对团队自身的能力提出了挑战。在选择测试策略的时候可以参考以下几条原则：

- 单元测试成本低，运行效率高，性价比非常高，始终摆在第一位。
- 高层测试只是测试防护体系的第二防线。
- 软件开发是一项成本与收益的博弈活动，性价比高的方案应该更加受到青睐。
- 没有绝对的对与错，根据自身项目工程和技术能力选择适合团队的策略。

其中第二条原则强调：*如果一个高层测试失败了，不仅仅表明功能代码中存在bug，还意味着单元测试的欠缺。因此，无论何时修复失败的端到端测试，都应该同时添加相应的单元测试。*


---

## 写在最后

微服务架构的复杂度不仅体现在技术上，与之相辅相成的是系统的业务架构，而技术架构总是服务于业务架构。优秀的测试策略和工程技术实践让我们更好地构建复杂的架构体系并克服它所带来的挑战，而最终决定一个系统成功与否在于人。所以，团队中每一个人应该保持Open的心态，持续学习，提升自己的高度（技能和业务），掌握实施微服务的相关技能，比如利用DDD去做服务的划分，从而能够更好的驾驭微服务架构。



