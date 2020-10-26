---
layout: post

title: "Martin Fowler用户故事系列"
date: 2020-09-29
categories: [Agile]
tags: [AGILE,REQUIREMENTS ANALYSIS]
column: AGILE-DELIVERY
sub-tag: "REQUIREMENTS ANALYSIS"

author: "袁慎建"

brief: "
用户故事代表了软件系统期望的行为，它们被广泛用于敏捷软件开发方法中，人们将大量功能分成较小的部分以便做规划。你可能还听说过另一个相同的概念 -- 特性（feature），但是，“故事”或“用户故事”术语在当今的敏捷圈子里更为流行。
"

---

* content
{:toc}


### 用例
用例是一种用于组织和引出需求的技术。它们最初是由Ivar Jacobson在80年代末和90年代推广流行的。

人们通常会问有关用例的问题，其中大部分问题可以从Alistair Cockburn的[书](https://www.amazon.com/gp/product/0201702258?ie=UTF8&tag=martinfowlerc-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0201702258)[译注1]中找到答案，它是迄今为止学习用例最好的书。在使用或咨询有关用例的问题之前，你应该阅读一下这本书。

用例以用例图的形式出现在UML中，但是这些图没有什么价值 -- 用例的关键价值是那些没有在UML中标准化的文本。因此，如果你要使用用例，请把你的精力放在文本上。

简短易读的用例是最好的用例。在开始开发之前，你不应该花费几周（更不用说几个月）来生成用例文档。


### 用户故事
用户故事代表了软件系统期望的行为，它们被广泛用于敏捷软件开发方法中，人们将大量功能分成较小的部分以便做规划。你可能还听说过另一个相同的概念 -- **特性**（**feature**），但是，“故事”或“用户故事”术语在当今的敏捷圈子里更为流行。

肯特·贝克（Kent Beck）最初将该术语引入到“极限编程”中来倡导一种相比于长篇大论的规格清单更加非正式和对话式的需求管理方式。用户故事的可以被写在一张卡上（Kent和我更喜欢3x5英寸）。只有在准备好进入开发时，用户故事才会被细化，在此之前，你对它们的理解程度能够支撑你进行优先级排序就好。


Bill Wake指出好的用户故事特征应该符合[INVEST](https://xp123.com/articles/invest-in-good-stories-and-smart-tasks/)原则：


- **独立的**：故事可以任何顺序传递
- **可协商的**：故事的细节由程序员和客户在开发过程中共同商定。
- **有价值的**：该功能对客户或用户是存在价值的。
- **可估算的**：程序员可以为开发故事提供合理的估算。
- **小的**：故事应该能在很短的时间内完成，通常是人•天的工作量。当然，你应该能够在一个迭代中完成多个故事。
- **可测试**：你能够编写测试来验证该故事的软件功能是否正常工作。


编写故事的常用方法是“作为……我想要……以便……”形式。 “作为”子句指的是谁想要这个故事，“我想要”描述了该功能是什么，“以便”描述了他们为什么想要该功能。 “以便”部分提供了重要的上下文来帮助团队理解客户认为他们想要的东西，从而更好地提供他们真正需要的东西。


迈克·科恩（Mike Cohn）写了一本关于[编写用户故事的标准书](https://www.amazon.com/gp/product/0321205685?ie=UTF8&tag=martinfowlerc-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0321205685)[译注2]。想要了解XP中用户故事的根源，可以阅读[白皮书](https://www.amazon.com/gp/product/0321278658?ie=UTF8&tag=martinfowlerc-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0321278658)[译注3]或[雅致的绿皮书](https://martinfowler.com/books/pxp.html)[译注4]。在早期的bliki文章中，我讨论了为什么[UserCase和UserStory](#)（[UseCasesAndStories](https://martinfowler.com/bliki/UseCasesAndStories.html)）是指不同的东西。

### 用例和故事
**[用例](#用例)和XP的[用户故事](#用户故事)有什么区别？**

这是一个常见的问题，没有一个普遍同意的标准答案。在XP社区中，很多人认为故事是用例的一种简化形式，尽管我过去也持有这种观点，但我现在不这么看了。

在需求组织方面，用例和用户故事是相似的。不同之处在于它们组织需求的目的。用例组织需求以描述用户如何关联和使用系统。因此，它们专注于用户目标以及与系统的交互如何满足这些目标。 XP故事（以及类似的概念，通常称为**特性**（features））是将需求分解成小块，已达到规划的目的。故事被明确地分解，直到它们可以作为XP发布计划过程的一部分进行评估为止。由于需求的使用目的不同，对于好的用例和故事的启发方法也将有所不同。

两者具有复杂的相关性。故事通常更细粒度，因为它们必须在一个迭代(XP是1到2周)内可以被构建出来。一个小的用例可能完全跟一个用户故事能对应起来；但故事可能是用例中的一个或多个场景，或者是用例中的一个或多个步骤。故事甚至可能不会出现在用例的叙述中，例如向弹出列表中添加新的资产折旧方法。

你需要同时做这两件事吗？与很多事情一样，理论上你会这么做，但实际上你不会。一些团队可能会在早期使用用例来构建一个叙述性的全景，然后分解成用户故事来进行规划。有些团队则直接使用故事。还有一些团队可能只是通过注释用例文本来显示什么时候完成了哪些特性。

## 对话式故事

这里有一个关于敏捷方法的常见误解。它主要关注用户故事的创建方式和整个开发活动的流程。人们的误解是，用户故事应该由产品负责人（或业务分析师）来创建，然后将其交给开发人员去实现。该观念强调的是一个从产品负责人到开发的流程，产品负责人负责确定做什么，开发人员负责确定如何做。


![](https://www.martinfowler.com/bliki/images/conversationalStories/decreed.png)

采用这种方法的理由是，它可以根据能力来划分职责。产品负责人了解业务、软件的用途以及需要做什么。开发人员了解技术并且知道如何做事，因此他们清楚如何实现产品负责人的需求。


由产品负责人提出法令故事（[DecreedStories](https://www.martinfowler.com/bliki/DecreedStories.html)）的想法是对敏捷开发工作方式的深刻误解。当我们在雪鸟城[Snowbird](https://www.martinfowler.com/articles/agileStory.html)集思广益时，我记得Kent提出了“对话式”建议。这一点也突出了我们的核心思想：客户与开发人员之间应该进行持续地对话，共同来讨论研发项目进展方式。

![](https://www.martinfowler.com/bliki/images/conversationalStories/conversation.png)

这意味着用户故事始终需要通过对话来提炼 -- 开发人员应该在帮助定义故事方面发挥积极作用。

- 发现故事之间的不一致和差距
- 利用技术知识提出符合产品负责人愿景的新故事
- 在当前的技术环境下，寻找实现成本更低的故事
- 拆分故事，使它们更容易计划或实现


这是Bill Wake提出的用户故事[INVEST](http://xp123.com/xplor/xp0308)原则中的可协商原则。敏捷团队的任何成员都可以创建故事并提出修改建议。在实际执行时，大多数故事可能由团队中少数几个人编写。这完全取决于团队的自组织方式。但是每个人都应该参与提出和完善故事。（这种参与是对开发人员评估故事的责任的补充。）


产品负责人确实负有特殊职责。产品负责人是故事的最终决策人，尤其是故事的优先级。这反映了这样一个事实，即产品负责人应该是判断业务价值优先级的最佳人选。但是拥有最终的决策者绝不应阻止其他人参与，也不应该把人们引入一个法令故事模型（译者注：由产品负责人创建好故事颁发给开发人员来实现，像颁布法令一样）。


#### 注释
- 译注1：[编写有效用例](https://book.douban.com/subject/10769594/)
- 译注2：[用户故事和敏捷方法](https://book.douban.com/subject/4743056/)
- 译注3：XP白皮书，[解析极限编程](https://book.douban.com/subject/1099376/)
- 译注4：绿皮书，[规划极限编程](https://book.douban.com/subject/1231825/)


#### 声明
本文翻译自[Martin Fowler](https://martinfowler.com/)关于用户故事的系列文章：

- [UserStory @2013年4月22日](https://martinfowler.com/bliki/UserStory.html)
- [UseCasesAndStories @2003年8月18日](https://martinfowler.com/bliki/UserStory.html)
- [ConversationalStories @2010年2月4日](https://martinfowler.com/bliki/UserStory.html)
- [UseCase](https://martinfowler.com/bliki/UseCase.html)
