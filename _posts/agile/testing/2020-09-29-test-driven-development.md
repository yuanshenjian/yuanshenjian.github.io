---
layout: post

title: "测试驱动开发"
date: 2020-11-19
categories: [Agile]
tags: [AGILE, AGILE-TESTING]
column: AGILE-TESTING
sub-tag: "common"

author: "袁慎建"

brief: "
测试驱动开发(TDD)是一种通过编写测试来指导软件开发的技术。它是作为极限编程的一部分，由Kent Beck在20世纪90年代末提出。其实从本质上讲，你只需要重复三个简单的步骤......
"

---

* content
{:toc}

测试驱动开发(TDD)是一种通过编写测试来指导软件开发的技术。它是作为极限编程的一部分，由[Kent Beck](https://twitter.com/KentBeck)在20世纪90年代末提出。其实从本质上讲，你只需要重复三个简单的步骤:

- 为你要添加的下一个功能编写测试。
- 编写功能代码，直到测试通过。
- 重构代码，优化代码结构。

继续循环执行这三个步骤，一次进行一次测试，逐步构建起系统的功能。优先编写测试（在[极限编程第二版](https://book.douban.com/subject/6828074/)（[XPE2](https://www.amazon.com/gp/product/0321278658?ie=UTF8&tag=martinfowlerc-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0321278658)）一书中叫做“测试优先编程”）的方式具备两个主要优点。最明显的是，它能让你获得[自测试代码]({{ site.url | append: '/self-testing-code'}})（[SelfTestingCode](https://martinfowler.com/bliki/SelfTestingCode.html)），因为你只能编写功能代码来让测试通过。第二个好处是，优先编写测试会迫使你提前思考接口的设计。这种聚焦于接口设计以及类交互的方式，能够帮助你分离接口与实现。

我听说搞砸TDD最常见的方式是忽视了第三步。重构代码这一步非常关键，一旦忽视它，你最终得到的将是混乱不堪的代码库。(至少这些代码有测试覆盖，所以比起大多数失败的设计，它造成的痛苦要小得多)

#### 延伸阅读
关于TDD入门的最佳书籍是Kent Beck的[测试驱动开发]()（[Test-Driven Development](https://www.amazon.com/gp/product/0321146530?ie=UTF8&tag=martinfowlerc-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0321146530)）。

对于在线资源，可以从James Shore的《敏捷开发的艺术》的[TDD章节](http://www.jamesshore.com/Agile-Book/test_driven_development.html开始。James also还制作了一个名为 [Let's play TDD](http://www.jamesshore.com/Blog/Lets-Play)的系列录屏。


#### 注释
- 译注1：[敏捷开发的艺术](https://book.douban.com/subject/4037534/)

#### 声明
本文翻译自Martin Fowler的文章*TestDrivenDevelopment*：

- 原文链接： [TestDrivenDevelopment](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
- 原文作者： [Martin Fowler](https://martinfowler.com/)
- 发表时间： 2013年4月22日
