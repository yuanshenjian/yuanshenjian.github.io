---
layout: "post"
title: "让我们再聊聊TDD"
date: 2017-03-10
categories: [eXtreme Programming]
tags: [TDD]
toXPSite: true
author: "刘冉"

---

* content
{:toc}

<!--brief-->
最近几年“TDD已死”的声音不断出现，特别是David Heinemeier Hansson那篇文章——[《TDD is dead. Long live testing. (DHH)》](http://david.heinemeierhansson.com/2014/tdd-is-dead-long-live-testing.html)引发了大量的讨论。其中最引人注目的是Kent Beck、Martin Fowler、David三人就这个举行的系列对话（辩论）——[Is TDD Dead](https://martinfowler.com/articles/is-tdd-dead/)?
<!--brief-->

![](http://insights.thoughtworkers.org/wp-content/uploads/2017/03/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7-2017-03-11-%E4%B8%8A%E5%8D%8812.12.26.png)


当前国内对TDD的理解十分模糊，大部分人也没有明确和有意识的去实施TDD，因此许多人对此都有着不同的理解。

其中最经典的理解就是基于代码的某个单元，使用Mock等技术编写单元测试，然后用这个单元测试来驱动开发，抑或是帮助在重构、修改以后进行回归测试。而现在大部分反对TDD的声音就是基于这个理解，比如：

- 工期紧，时间短，写TDD太浪费时间；
- 业务需求变化太快，修改功能都来不及，根本没有时间来写TDD；
- 写TDD对开发人员的素质要求非常高，普通的开发人员不会写；
- TDD 推行的最大问题在于大多数程序员还不会「写测试用例」和「重构」；
- 由于大量使用Mock和Stub技术，导致UT没有办法测试集成后的功能，对于测试业务价值作用不大
- ……

总结一下，技术人员拒绝TDD的主要原因在于难度大、工作量大、Mock的大量使用导致很难测试业务价值等。

这些理解主要是建立在片面的理解和实践之上，而在我的认知中，TDD的核心是：先写测试，并使用它帮助开发人员t来驱动软件开发。

首先是先写测试，这里的测试并不只是单元测试，也不是说一定要使用mock和stub来做测试。这里的测试就是指软件测试本身，可以是基于代码单元的单元测试，可以是基于业务需求的功能测试，也可以是基于特定验收条件的验收测试。

其次是帮助开发人员，主要是帮助开发人员理解软件的功能需求和验收条件，帮助其思考和设计代码，从而达到驱动开发的目的，所以[TDD是包含两部分：ATDD与UTDD](http://www.agiledata.org/essays/tdd.html)。

![](http://insights.thoughtworkers.org/wp-content/uploads/2017/03/1-TDD-3.png)

**ATDD（Acceptance Test Driven Development）：**验收驱动测试开发，首先BA或者QA编写验收测试用例，然后Dev通过验收测试来理解需求和验收条件，并编写实现代码直到验收测试用例通过。

由于验收方法和类型也是多种多样的，所以根据验收方法和类型的不同，ATDD其实是包含BDD（Behavior Driven Development）、EDD（Example Driven Development），FDD（Feature Driven Development）、CDCD（Consumer Driven Contract Development）等各种的实践方法。

比如以软件的行为为验收标准，这个是BDD；如果以特定的实例数据为验收标准，这个是EDD；如果以Web Service API消费者提出API契约来驱动API提供者开发API，这个是CDCD等。所以ATDD的具体实现需要结合项目的实际情况来选用适合的验收测试方法与类型。

**UTDD（Unit Test Driven Development）：**单元驱动测试开发，首先Dev编写单元测试用例，然后编写实现代码直到单元测试通过。这个就是现在很多人所谓的TDD、实践的TDD、喜欢的TDD、抱怨的TDD，但是它却只是真正意义上TDD的一部分而已。


TDD金字塔

![](http://insights.thoughtworkers.org/wp-content/uploads/2017/03/2-UTDD.jpg)

再来看看David 的[《TDD is dead. Long live testing》](http://david.heinemeierhansson.com/2014/tdd-is-dead-long-live-testing.html)，他主要是认为TDD大量使用mock，导致无法测试软件连接了数据库之后的功能，进而无法测试其业务价值。

其次他提出应该使用”Long live testing”, 而他并没有说明这种测试应该是在编写代码之前还是之后写，以及会不会用来作为客户对于软件的验收标准。如果他没有这样做，那他只是使用”Long live testing”来做回归测试；如果他做了，那么他也是使用了ATDD，从而使用了TDD。

所以他对TDD的理解还是狭隘的，认为TDD只是UTDD，导致他写了这篇文章来批评TDD。有可能他在现实工作中已经使用了ATDD，也就是TDD。

最后来看看Kent Beck、Martin Fowler、David关于[Is TDD Dead?](https://martinfowler.com/articles/is-tdd-dead/)的辩论，我觉得他们所说的都有道理，并且也是合理的。原因是他们的背景和行业不同，本来对于不同的行业和不同的背景就应该选择适合的测试驱动方法（有可能不一样）。

首先来看看Kent Beck，他在Facebook工作，出版过很多书，可以定位为一名在大型IT公司工作的软件思想家。其次是David，一个标准欧洲帅哥，ROR创造者之一，Basecamp公司的创始人和CTO，Basecamp是一个只有几十个人的小型软件公司，所以他可以定位是一名创业者、技术牛人。

Kent Beck所在的公司开发的是大型复杂业务软件（Facebook平台），代码量巨大，需要长时间（几年）大量人员（几十甚至几百）来开发和维护。DHH开发的中小型企业软件（比如CRM），代码量一般，需要快速（几个月）、少量人员（几个到十几个）开发和维护。

Kent Beck在金钱和人力资源相对充足、时间相对充裕的情况下追求的是代码质量，大量人员的良好协作与平台稳定。DHH却在金钱和人力资源相对较少情况下追求最大化客户业务价值，使得少量人员能快速开发出软件并卖给客户赚钱。

所以在Kent Beck所在的环境下，单元测试（UTDD）是非常有价值的；而在DHH所在的环境下，功能测试或者ATDD却更为适合。

国内很多人对于TDD的狭隘理解还源于很多网上的中文资料，百度百科对于TDD的解释就是其中一个：

“TDD的原理是在开发功能代码之前，先编写单元测试用例代码，测试代码确定需要编写什么产品代码。TDD虽是敏捷方法的核心实践，但不只适用于XP（Extreme Programming），同样可以适用于其他开发方法和过程。”

而国外有不少站点上的资料是对于TDD是有正确理解的，比如下图是一个[敏捷调查表](http://www.ambysoft.com/surveys/howAgileAreYou2013.html)。从其中的“We take a test-driven development(TDD) approach”和”We take a TDD approach at the requirements level”就能发现其对TDD的理解就是包含UTDD和ATDD。

![](http://insights.thoughtworkers.org/wp-content/uploads/2017/03/3-agility.png)


**TDD不是银弹，不要期望它能轻易解决你的问题，无论是UTDD、EDD还是BDD，根据自己项目的实际情况，比如资金、人力资源、时间、组织架构等，合理的选择。**

今天我们又聊了聊TDD，也希望大家重新理解一下，重新思考和尝试一下，然后你会发现另外一片云彩。

**TDD并没有死，死的是你的持续学习、思考、实践与总结。当前国内很多软件开发人员对于TDD的理解比较模糊，大部分人也没有明确和有意识的去实施TDD，因此很多人都有着不同的理解。**

