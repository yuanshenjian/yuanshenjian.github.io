---
layout: post

title: "高效技术领导的5个锦囊妙计"
date: 2016-03-15
categories: [CAREER]
tags: [Career]

author: "袁慎建"

source: "https://www.thoughtworks.com/insights/blog/5-tips-being-effective-tech-lead"

brief: "
成为一个技术领导者(后文简称TL)对任何开发人员来讲都是一个艰难的转型，因为开发人员的经验和技能仅仅只有部分有助于他们达到对这个新角色的期望。除了简单的设计和编码，TL最重要的职责在于管理整个开发团队，这意味着TL要经常与技术人员以及非技术人员进行沟通协作。</br></br>

一个开发人员花在编写良好结构的代码的时间并不能等效地转化成一些必要的技能，比如了解他人，解决冲突，以及突然需要同时处理多个他们自己并不太可能独立搞定的任务。本文分享一些初次做TL的人Tips，以帮助一个新人更好地胜任TL。
"

---



* content
  {:toc}

---

成为一个技术领导者(后文简称TL)对任何开发人员来讲都是一个艰难的转型，因为开发人员的经验和技能仅仅只有部分有助于他们达到对这个新角色的期望。除了简单的设计和编码，TL最重要的职责在于管理整个开发团队，这意味着TL要经常与技术人员以及非技术人员进行沟通协作。

一个开发人员花在编写良好结构的代码的时间并不能等效地转化成一些必要的技能，比如了解他人，解决冲突，以及突然需要同时处理多个他们自己并不太可能独立搞定的任务。

![Alt text]({{ site.url }}{{ site.img_path }}{{ '/career/5-tips-for-being-an-effective-tech-lead-1.png' }})

下面是如何成为一个高效TL的5个锦囊妙计

---

## 1.学会委托

作为开发人员，当你在工作中遇到了一个难以解决的技术问题时，你会寻找各种解决方案，你挑了一个最简单的方案把问题解决了，最后你高兴地庆祝你的测试如愿以偿的由红变绿。

作为TL，不论你有多少经验，你都不能去承担所有的编码工作，也不能去解决所有有挑战和有趣的问题。因为有更多的职责需要你去关注，一旦你独自将自己专注在一个任务里，你就不能兼顾其他的职责了。当你着手去解决棘手的难题时，这会剥夺团队其他开发人员成长的机会。这可能会让一些开发人员觉得没意思，进而选择离开团队。

当然，有时候你的经验和知识对于一些问题非常有用，但你又不想成为解决问题的瓶颈（译者注：意思是只有你能解决那些问题），所以你想找到一种合适的方式将它委托给其他开发人员。你可以召集开发人员一起开会讨论一些常用的方案，将问题派给某些人去做，然后定期的检查他们的进展，确保进展在可控的范围内。

一旦你和开发人员的信任建立起来后，你就可以更少的参与到开发工作中，甚至你完全可以将一些事情委托出去，从而让你能够专注在更重要的事情上。



---

## 2.抽出时间写代码

这个角色之所以被称作TL有一个原因，它是最基本的一点：你要花时间在代码库上。让自己熟悉代码能够有助于你获得团队成员的尊敬，同时也使你的知识技能得到更新，并且你还能清楚的了解代码库的当前的现状，比如代码库的一些约束和存在的问题。

如果你不花任何时间去写代码，你有可能践行了“象牙塔建筑师”这个反模式，导致了你在做一些技术决定的时候并没有理解代码实现以及维护背后真正的含义。而且这个反模式有很多的副作用，它会让你失去团队成员的信任，会延长新功能的开发时间，并且会增加软件系统的意外复杂性。

TL可以有很多方式抽出时间来编码，重要的是你要有意识去做这件事。这通常意味着你要对怎么支配你的时间做出艰难的选择。锦囊1可以帮助你腾出更多的时间。我了解到一些TL会在他们的日历上标注出一些特定的时间段来确保自己有时间写代码或者跟其他开发成员检查代码。我还知道一些TL会检查提交的日志，给开发成员提出反馈--这种方式更像一个宽松自由的结对编程。




---

## 3.可视化你的系统架构

我待过的几个团队中，开发人员不明白他们所做的工作是怎样跟系统架构的设计融合在一起的。开发人员一个小的技术决策可能会造成大范围的架构影响。如果开发人员不能理解这些抽象的系统架构，这些将无法避免。

高效的TL通常将系统架构通过可视化的方式呈现出来，并拿它来跟开发人员展开讨论。通常有多种不同的图形方式来呈现系统架构（逻辑图，部署图，等等）。并且每一个图形都能帮助开发人员明白他们的工作是怎么与系统架构融合在一起的。

一个全员的白板会议是检查整体架构的一个很有用的方式，因为它会随着时间逐步完善，从而能够满足不断变化的需求以及会议中那些比图形更重要的讨论结果。专注在关键的质量指标上，这些指标是驱动系统架构可视化的指标（可扩展性，性能，可用性等等）。同时要清楚它们是如何促成你当前的系统架构。引出一些假设以及分享历史上下文信息能够帮助开发人员指导他们的平时的决策。

---


## 4.与团队成员一对一交流
衡量一个TL是否高效并不是看他完成了多少编码工作，而要看整个团队有多么的高效。一个TL所做的任何事情就是让团队成员成长，让整个团队持续进步。坐下来跟团队成员进行一对一的交流沟通，了解每个人的知识背景、长处以及他们的目标，从而了解你的团队成员如何在一起工作的。同时也要让开发人员都有机会成长。这意味着你要允许他们尝试冒险、挑战有难度的工作，让自己成长的同时也为团队做出贡献。鼓励团队成员在团队中分享知识，并且让他们有更多的交流互动。

---


## 5.学会说业务语言
想要成为一个高效的TL，你还需要跟开发团队之外的人保持好关系，比如产品经理、市场人员、销售等。他们并不能理解你作为一个开发人员的一些术语，所以跟他们讲框架、技术工具以及平台只会让他们困惑。

高效的TL会想办法让非技术人员理解这些技术概念，最好的方式是找出那些业务人员经常使用的术语并想办法用那些术语来解释我们的开发工作。可视化模型，白板会议以及恰当的比喻都会有助于业务人员理解技术概念和含义。你可以找来一个非技术人员跟你一起练习，看你是否能让他听懂你在说什么。

通过将业务术语引进开发团队中并鼓励他们尽可能多的使用这些术语，可以尽可能地减小转换层。开发团队成员运用这些领域术语越多，他们就能越容易理解相关业务人员。

在Patrick写的《Talking with Tech Leads》书里可以找到更多关于TL的经验。你可以[下载](http://info.thoughtworks.com/talking-with-tech-leads-book.html)一本免费的样本，或者，不要错过[初次做技术领导的三个陷阱]({{ site.url }}{{"/3-common-mistakes-of-first-time-tech-lead/"}})这篇精彩的文章。


[原文链接](https://www.thoughtworks.com/insights/blog/5-tips-being-effective-tech-lead)