---
layout: post

title: "宽栈测试"
date: 2020-11-19
categories: [Agile]
tags: [AGILE, AGILE-TESTING]
column: AGILE-TESTING
sub-tag: "common"

author: "袁慎建"

brief: "
宽栈测试是一种用来测试大型应用程序中的大部分功能集合的测试。它通常被称为端到端测试（end-to-end test）或全栈测试（full-stack test）。它与组件测试相反，后者只测试系统中明确定义的部分。
"

---

* content
{:toc}


宽栈测试是一种用来测试大型应用程序中的大部分功能集合的测试。它通常被称为**端到端测试（end-to-end test）**或**全栈测试（full-stack test）**。它与[组件测试]({{ site.url | append: '/component-test'}})（[ComponentTest](https://martinfowler.com/bliki/ComponentTest.html)）相反，后者只测试系统中明确定义的部分。


宽栈测试（broad-stack test）和组件测试之间并不存在明确的界限。（ One area where bits can be missing from the fullness of the stack is how the test manipulates the application.）。宽栈测试（broad-stack test）通常通过UI来操作应用程序。比如使用Selenium和Sahi等工具来测试Web应用程序。然而，如果[皮下测试]({{ site.url | append: '/subcutaneous-test'}})（[SubcutaneousTest](https://martinfowler.com/bliki/SubcutaneousTest.html)）覆盖了系统剩余的绝大部分功能，它也可以是一种宽栈测试。如果再进一步限制范围，通过服务接口测试应用程序的测试也可以看作是服务端的宽栈测试。


宽栈测试不能覆盖的另一块区域是与远程系统的连接。包括我自己在内的很多人都认为那些调用远程系统的测试运行起来即缓慢又脆弱。通常最好使用[测试替身]({{ site.url | append: '/test-double'}})（[TestDouble](https://martinfowler.com/bliki/TestDouble.html)）来隔离这些远程系统，然后通过[契约测试]({{ site.url | append: '/subcutaneous-test'}})（[ContractTests](https://martinfowler.com/bliki/ContractTest.html)）来检验测试替身的有效性。

宽栈（broad-stack）测试的优势在于，你可以把应用程序的所有部分都连接在一起进行测试，因此可以发现那些潜伏在组件间交互中的bug，而这一点是组件测试无法做到的。然而，与组件测试相比，宽栈测试往往更难维护，运行速度也更慢。因此，[测试金字塔]({{ site.url | append: '/test-pyramid'}})（[TestPyramid](https://martinfowler.com/bliki/TestPyramid.html)）建议只使用少量宽栈（broad-stack）测试。


#### 声明
本文翻译自Martin Fowler的文章*BroadStackTest*：
- 原文链接： [BroadStackTest](https://martinfowler.com/bliki/BroadStackTest.html)
- 原文作者： [Martin Fowler](https://martinfowler.com/)
- 发表时间： 2013年4月22日
