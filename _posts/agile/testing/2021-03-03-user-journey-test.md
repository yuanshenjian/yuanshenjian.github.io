---
layout: post

title: "用户旅程测试"
date: 2021-03-03
categories: [Agile]
tags: [AGILE, AGILE-TESTING]
column: AGILE-TESTING
sub-tag: "common"

author: "袁慎建"

brief: "
用户旅程测试是面向业务测试（BusinessFacingTest）的一种形式，旨在模拟整个系统中典型的用户“旅程”。这样的测试通常将覆盖用户与系统的整个交互，从而实现某些目标。它们是用例中（use case）的一条路径。
"

---

* content
{:toc}

用户旅程测试是[面向业务测试](https://www.yuque.com/yuanshenjian/agile/business-facing-test/)（[BusinessFacingTest](https://martinfowler.com/bliki/BusinessFacingTest.html)）的一种形式，旨在模拟整个系统中典型的用户“旅程”。这样的测试通常将覆盖用户与系统的整个交互，从而实现某些目标。它们是用例中（use case）的一条路径。

用户旅程测试也是[宽栈测试](https://www.yuque.com/yuanshenjian/agile/broad-stack-test/)（[BroadStackTests](https://martinfowler.com/bliki/BroadStackTest.html)），因此它的执行速度会很慢，而且很脆弱。因此，通常不会将用户旅程测试套件构建为对系统行为的全面测试。你只需要编写少量用户旅程测试来验证整个系统的集成--可能每个用例只覆盖一条路径（通常是快乐路径（happy path））。行为中其他所有场景的验证都交给其他类型的测试，那些测试的覆盖通常也更加聚焦。

与[用户故事测试](https://www.yuque.com/yuanshenjian/agile/user-story-test/)（[StoryTests](https://martinfowler.com/bliki/StoryTest.html)）不同的是，用户旅程测试不跟用户故事绑定。当你在看一个用户故事时，你会查看现有的用户旅程测试，并修改它们以支持用户故事所暗示的任何行为变化，很少有用户故事会导致产生一个全新的用户旅程测试。

#### 声明

本文翻译自Martin Fowler的文章*UserJourneyTest*：

*   原文链接： [UserJourneyTest](https://martinfowler.com/bliki/UserJourneyTest.html)
*   原文作者： [Martin Fowler](https://martinfowler.com/)
*   发表时间： 2013年4月24日
