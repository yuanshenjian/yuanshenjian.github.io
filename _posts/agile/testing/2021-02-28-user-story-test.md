---
layout: post

title: "用户故事测试"
date: 2021-02-28
categories: [Agile]
tags: [AGILE, AGILE-TESTING]
column: AGILE-TESTING
sub-tag: "common"

author: "袁慎建"

brief: "
用户故事测试是一种面向业务的测试（BusinessFacingTests），它作为用户故事的一部分，用于描述和验证所交付的软件。当一个故事被详细阐述后，团队会创建多个故事测试，并将它们作为用户故事的验收标准。用户故事测试可以被纳入回归测试套件中，从而提供从需求（用户故事）到测试以及（通过执行）到系统行为的可追溯性。用户故事测试通常也是一种宽栈测试（BroadStackTests）。
"

---

* content
{:toc}

用户故事测试是一种[面向业务的测试](https://www.yuque.com/yuanshenjian/agile/business-facing-test/)（[BusinessFacingTests](https://martinfowler.com/bliki/BusinessFacingTest.html)），它作为用户故事的一部分，用于描述和验证所交付的软件。当一个故事被详细阐述后，团队会创建多个故事测试，并将它们作为用户故事的验收标准。用户故事测试可以被纳入回归测试套件中，从而提供从需求（用户故事）到测试以及（通过执行）到系统行为的可追溯性。用户故事测试通常也是一种[宽栈测试](https://www.yuque.com/yuanshenjian/agile/broad-stack-test/)（[BroadStackTests](https://martinfowler.com/bliki/BroadStackTest.html)）。

用户故事很受欢迎，因为它提供了一个简单的工作流程，每个用户故事都会往故事测试套件中添加新测试。但是，用户故事测试也会引发一些问题。比如，定期添加这些测试会导致测试套件的膨胀，并且它们之间存在大量的重复。当在项目后期需要更改系统的行为时，更新这些重复的测试将花费大量的时间，这个过程会比较痛苦。此外，宽栈的故事测试执行也非常耗时，这也是为什么大量的用户故事测试会违反[测试金字塔](https://www.yuque.com/yuanshenjian/agile/test-pyramid/)（[TestPyramid](https://martinfowler.com/bliki/TestPyramid.html)）的原因。所以，很多人建议只编写少量的[用户旅程测试](https://www.yuque.com/yuanshenjian/agile/user-journey-test/)（[UserJourneyTests](https://martinfowler.com/bliki/UserJourneyTest.html)）和面向业务的[组件测试](https://www.yuque.com/yuanshenjian/agile/component-test/)（[ComponentTests](https://martinfowler.com/bliki/ComponentTest.html)）。

#### 声明

本文翻译自Martin Fowler的文章*StoryTest*：

*   原文链接： [StoryTest](https://martinfowler.com/bliki/StoryTest.html)
*   原文作者： [Martin Fowler](https://martinfowler.com/)
*   发表时间： 2013年4月24日

