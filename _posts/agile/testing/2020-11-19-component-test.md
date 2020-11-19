---
layout: post

title: "组件测试"
date: 2020-11-19
categories: [Agile]
tags: [AGILE, AGILE-TESTING]
column: AGILE-TESTING
sub-tag: "common"

author: "袁慎建"

brief: "
组件测试一种是将测试范围从整个软件系统缩小到部分的测试。它与宽栈测试（broad-stack test）相反，后者则追求尽可能多且合理地覆盖系统。
"

---

* content
{:toc}


组件测试一种是将测试范围从整个软件系统缩小到部分的测试。它与[宽栈测试]({{ site.url | append: '/broad-staack-test'}})（[BroadStackTest](https://martinfowler.com/bliki/BroadStackTest.html)）相反，后者则追求尽可能多且合理地覆盖系统。

宽栈测试和组件测试之间的差异主要在测试的覆盖范围上，它俩不存在绝对的差异。组件测试的大小取决于你对它的定义。本质区别在于，组件测试会有意屏蔽测试范围之外的系统部分。如何屏蔽？通常是通过内部代码接口来控制它们，使用一些像[xunit]({{ site.url | append: '/xunit'}})（[xunit](https://martinfowler.com/bliki/Xunit.html)）这样的测试工具，并使用[测试替身]({{ site.url | append: '/test-double'}})（[TestDouble](https://martinfowler.com/bliki/TestDouble.html)）将被测代码与其他组件隔离。

组件测试通常比宽栈（broad-stack）测试更容易编写和维护。由于它们只触及部分代码库，因此运行起来也更快。理论上，一个具有出色的组件测试覆盖率的系统应该是没有bug的。但实践证明，bug喜欢潜伏在组件之间的交互中。因此，最好使用[测试金字塔]({{ site.url | append: '/test-pyramid'}})（[TestPyramid](https://martinfowler.com/bliki/TestPyramid.html)）并将大量的组件测试与少量的宽栈（broad-stack）测试结合起来。



#### 声明
本文翻译自Martin Fowler的文章*ComponentTest*：

- 原文链接： [ComponentTest](https://martinfowler.com/bliki/ComponentTest.html)
- 原文作者： [Martin Fowler](https://martinfowler.com/)
- 发表时间： 2013年4月22日