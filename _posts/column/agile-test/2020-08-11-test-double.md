---
layout: post

title: "测试替身"
date: 2020-08-11
categories: [Agile]
tags: [AGILE-TEST]
column: AGILE-TEST
sub-tag: "common"

author: "袁慎建"

brief: "
Gerard Meszaros正在写一本书，用以总结各种Xunit框架的使用模式。他遇到的一个棘手的问题是如何更好地区分各种名词概念，比如存根（stubs），模拟（mocks），伪造品（fakes），假人（dummies）以及人们用来代替被测系统依赖项的东西。为了解决这个问题，他发明了一系列词汇，这些词汇我觉得很有意义，值得普及。
"

---

* content
{:toc}



Gerard Meszaros正在[写一本书](https://martinfowler.com/books/meszaros.html)，用以总结各种Xunit框架的使用模式。他遇到的一个棘手的问题是如何更好地区分各种名词概念，比如存根（stubs），模拟（mocks），伪造品（fakes），假人（dummies）以及人们用来代替被测系统依赖项的东西。为了解决这个问题，他发明了一系列词汇，这些词汇我觉得很有意义，值得普及。


他使用的通用术语是[测试替身](http://xunitpatterns.com/Test%20Double.html)（想象一下演员替身）。任何你出于测试目的而替换掉实际生产对象的场景都是对它的运用。Gerard罗列出了几种类型的测试替身：

- **Dummy**对象会被构建和传递，但实际上不会被使用。 通常它们仅用于填充参数列表。
- **Fake**对象实际上一个等效的实现，只是实现方式更简单，它们往往不适合用于生产环境。（[InMemoryTestDatabase](https://martinfowler.com/bliki/InMemoryTestDatabase.html)是一个很好的例子）
- **Stubs**对测试指定的调用提供固定的返回值，它们不会响应测试没有涉及的任何其他调用。
- **Spy**也是stubs，只是它们还会根据调用方式记录一些额外信息。比如，电子邮件服务，它会记录发送了多少消息。
- **Mocks** 会预先设定好期望，这些期望代表它们希望接收到特定规范的调用。它们会在验证过程中进行校验，从而确保接收到所有如期的调用，否则会抛出异常。


#### 声明
本文翻译自Martin Fowler的文章TestDouble：

- 原文链接： [TestDouble](https://martinfowler.com/bliki/TestDouble.html)
- 原文作者： [Martin Fowler](https://martinfowler.com/)
- 发表时间： 2006年1月17日
