---
layout: post

title: "面向业务测试"
date: 2021-03-01
categories: [Agile]
tags: [AGILE, AGILE-TESTING]
column: AGILE-TESTING
sub-tag: "common"

author: "袁慎建"

brief: "
面向业务的测试是一种旨在帮助与开发团队中的非编程人员（例如客户，用户，业务分析师等）进行沟通的测试。当它被自动化时，它们会忽略系统本身的组件体系结构，使用面向领域的术语来描述系统。面向业务的测试通常被用作验收标准，一旦通过这类测试即表明系统提供了客户所期望的功能。  
"

---

* content
{:toc}

面向业务的测试是一种旨在帮助与开发团队中的非编程人员（例如客户，用户，业务分析师等）进行沟通的测试。当它被自动化时，它们会忽略系统本身的组件体系结构，使用面向领域的术语来描述系统。面向业务的测试通常被用作验收标准，一旦通过这类测试即表明系统提供了客户所期望的功能。  

自动化的面向业务的测试通常以领域特定语言（[DomainSpecificLanguage](https://martinfowler.com/bliki/DomainSpecificLanguage.html)）的某种形式来表示，这样做有助于跟非程序员去交流，并且还为程序员提供了一种机制，从而帮助他们从代码实现细节中跳出来。像[Cucumber](http://cukes.info/)和[Twist](http://www.thoughtworks-studios.com/twist-agile-testing)这些工具可帮助设计此类DSL，并提供了一种机制将它们与被测系统绑定起来。  

面向业务的测试通常以[宽栈测试](https://www.yuque.com/yuanshenjian/agile/broad-stack-test/)（[BroadStackTests](https://martinfowler.com/bliki/BroadStackTest.html)）的形式实现，因为它们面向用户的表达形式建议将被测系统视作黑盒。然而，将面向业务的测试实现为[组件测试](https://www.yuque.com/yuanshenjian/agile/component-test/)（[ComponentTests](https://martinfowler.com/bliki/ComponentTest.html)）更有优势，因为这样会获得更好的可维护性和更快的执行速度。  

我是自动化测试的忠实拥护者，但认识到手工测试在面向业务的测试中扮演着重要的角色也很重要。像探索性测试和可用性测试只能手工进行，并且它们是一个良好的测试组合中必不可少的部分。

面向业务的测试一词源自[Brian Marick的测试四象限](http://www.exampler.com/old-blog/2003/08/21/#agile-testing-project-1)。[用户故事测试](https://www.yuque.com/yuanshenjian/agile/user-story-test/)（[StoryTests](https://martinfowler.com/bliki/StoryTest.html)）和[用户旅程测试](https://www.yuque.com/yuanshenjian/agile/user-journey-test/)（[UserJourneyTests](https://martinfowler.com/bliki/UserJourneyTest.html)）是它的两种常见形式。

#### 声明

本文翻译自Martin Fowler的文章*BusinessFacingTest*：

*   原文链接： [BusinessFacingTest](https://martinfowler.com/bliki/BusinessFacingTest.html)
*   原文作者： [Martin Fowler](https://martinfowler.com/)
*   发表时间： 2013年4月24日
