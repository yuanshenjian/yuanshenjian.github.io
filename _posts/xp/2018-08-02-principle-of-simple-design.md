---
layout: post

title: "简单设计原则"
date: 2018-08-02
categories: [TDD]
tag: [XP, Simple Design]

author: "袁慎建"

brief: "
在我的简单设计价值观的指引下，本文我以代码设计面临的问题为起点，进而讨论设计决策中我们主要考虑的维度，针对这四个维度我们一起来尝试回答四个问题。

</br></br>

对于这些问题，我基于Kent Beck提出的简单设计原则，并结合当今的软件开发，做了一次全面的解读，最后通过价值延伸来诠释简单设计的魅力。

"

---

* content
{:toc}

---

在 [我的简单设计价值观]({{ site.url }}{{ '/value-of-simple-design/' }}) 一文中，我分享了我在实践中形成对简单设计的理解。而提到价值观，平时跟同事讨论某个技术实践的时候，一旦触碰到价值观，我就会很谨慎，因为在两个人价值观不同的前提下，去讨论一项实践的好坏，很可能在面红耳赤之后不欢而散。

如果你压根都不认同简单设计价值观，我不建议你阅读此文。如果你跟我刚开始类似，并不是不认同简单设计的价值观，只是觉得它很抽象，没法落地，本文我会基于Kent Beck提出的简单设计原则，结合今天的软件开发，对这几个原则做一个全面的解读。

---

## 设计的问题
在使用某项实践之前我们一定要去思考一个问题：*我们为什么要使用它？* 我从代码设计所面临的问题为起点来回答为什么要遵循简单设计。

在代码设计中，我们会面临设计不足和过度设计的问题，比如不假思索过程式编写代码，以及不择手段套用设计模式，在实际中通常位于这两极端之间。设计不足主要表现为*冗余*、*耦合*、*注释覆盖率高*，过度设计主要表现为*复杂*、*臃肿*、*代码闲置率高*。这些现象势必会引发几大问题：*难以修改*、*难以测试*、*难以阅读*。

![]({{ site.url }}{{ site.img_path }}{{ '/xp/design-issues.jpg' }})

---


## 设计决策
针对上述常见的代码设计问题，我们可以通过引入提前设计来规避。值得一提的是，极限编程中也提倡提前做少量的设计。那么怎么把控这个度，我们在设计决策的时候就需要警惕了。

在设计决策中我们应该关注*需求*、*可理解性*、*易修改性* 和*复杂度* 这四个主要的维度，针对这四个维度，尝试问自己四个问题：

1. 测试都通过了吗？
2. 代码理解起来困难吗？
3. 代码存在重复逻辑吗?
4. 能够减少代码元素吗？

针对这四个问题，Kent Beck给出了四条参考原则 [[1]](#note-1)：

1. 通过测试
2. 揭示意图
3. 消除重复
4. 最少元素

![]({{ site.url }}{{ site.img_path }}{{ '/xp/design-facts.png' }})

---

## 原则解读

### 通过测试
*通过测试* 通常会被一概地理解为通过所编写的测试，这个点成立的两个前提条件是：

1. 测试覆盖率达到100%
2. 所有测试都是有效的

如果你的项目中没有满足这两点，就需要换一个角度去理解 *通过测试*。我们编写测试始终应该聚焦在业务价值上，测试测的是业务价值，所以*通过测试* 广义理解为要满足业务需求，通过客户的验收，不管是自动化测试还是手工测试，只要测试是业务价值驱动的，都可以理解为*通过测试*。

### 消除重复
> 重复乃万恶之源 -- SJ

重复意味着*低内聚、高耦合*，导致的后果是难以修改，对变化的响应力降低。响应力降低势必会造成维护工作量的提升，[我的简单设计价值观]({{ site.url }}{{ '/value-of-simple-design/' }}) 一文中的*懒惰* 将驱使我尽我所能消除这些重复，从而减少修改时的工作量，提升软件的响应力。

### 揭示意图
在代码设计层面，我们可从一增一减两个方向同时去努力，从而达到揭示意图：

1. 增强代码的自身可理解性，让代码自解释
2. 减弱代码的其他干扰因素，让代码更纯净

增强方面，比如在变量、方法以及类的命名等，我们都竭尽全力去赋予它们一个更加表露意图的名字，让它们能够自解释，从而让读者能够在深入细节之前就能够在较高层次上快速理解代码的意图。减弱方面，比如在注释、方法的组织、类的交互设计等，可以去除不必要的注释，控制方法体的大小、降低类交互复杂度来让代码更纯净，从而让读者更好地聚焦在核心代码上。

### 最少元素
Kent Beck以类和方法来代表*最少元素* 中的元素。我们可以把元素的覆盖面扩大，比如，变量、常量、注释、注解、关键字、包等都属于代码元素。

*最少元素* 的核心思想是：在不必要的时候，尽可能减少代码元素来降低代码复杂度，保持简单。它道出了简单设计的精髓。

### 画龙点睛
简单设计四原则给设计决策提供了有效的指导，在实际运用过程中，当面临冲突时，我们如何取舍，Kent Beck最后给出了一个优先级顺序：

![]({{ site.url }}{{ site.img_path }}{{ '/xp/simple-design-priority.jpg' }})

*最少元素* 这一条造就了*简单设计原则* 的独特性，它犹如点睛之笔，而优先级顺序则像一条龙将四条原则串接起来，让简单设计原则具有强大生命力。优先级顺序在简单设计原则中的重要程度类似于敏捷宣言中的最后一句：[*也就是说，尽管右项有其价值，我们更重视左项的价值*](http://agilemanifesto.org/iso/zhchs/manifesto.html)。

---

## 优先级解读
*通过测试*，这条优先级最高的原则告诉我们任何时候我们编写的软件是要为客户创造真实价值的，如果为了消除重复、揭示意图或减少代码元素，而编写出不符合客户期望的软件，这就严重违背了该原则。

*消除重复*，告诉我们不应该为未来编码，即为一个尚未出现的重复或变化方向去增加额外的复杂度，比如建立一个抽象接口，却只有一个实现。

*揭示意图*，在我看来，跟*消除重复* 不相上下，绝大多数时候这两条是相辅相成的，不会因为消除重复而有损揭示意图，也不会通过引入重复增加揭示意图。在实际开发中我们应该尽量同时遵循这两条原则来提高软件的质量。

*最少元素*，这条优先级最低的原则告诉我们除非在增加了代码元素之后，能够消除重复或揭示意图，否则我们不应该增加不必要的元素。比如，我们会为了消除重复逻辑而抽取了一个公共方法，会为了揭示意图使用常量替代魔鬼数字。

*示例：抽取公共方法*

```java
public class DateFormater {
    public LocalDate formatUserBirthday(String birthdayStr) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return LocalDate.parse(birthdayStr, formatter);
    }
    public LocalDate formatRegisterDate(String registerDateStr) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return LocalDate.parse(registerDateStr, formatter);
    }
}

public class DateFormater {
    public LocalDate formatUserBirthday(String birthdayStr) {
        return format(birthdayStr);
    }
    public LocalDate formatRegisterDate(String registerDateStr) {
        return format(registerDateStr);
    }
    private LocalDate format(String birthdayStr) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return LocalDate.parse(birthdayStr, formatter);
    }
}
```

*示例：常量代替魔鬼数字*

```java
public class Scheduler {
    public void executeJobs(int jobNumbers){
        if (jobNumbers < 1000000){
            for (int i = 0; i < jobNumbers; i++) {
                execute();
            }
        }
    }
}

public class Scheduler {
    public static final int MAC_CONCURRENT_EXECUTOR_NUMBERS = 1000000;
    public void executeJobs(int jobNumbers){
        if (jobNumbers < MAC_CONCURRENT_EXECUTOR_NUMBERS){
            for (int i = 0; i < jobNumbers; i++) {
                execute();
            }
        }
    }
}
```

> 针对*揭示意图*、*去除重复* 这两条业界存在一些争论，觉大多数情况下，这两者并不冲突，在我的经验中，可能在一些测试用例中会通过引入重复来避免逻辑分隔等测试坏味道，从而对读者更加友好。Kent Beck也提出唯一让他有印象的冲突是发生在测试用例 [[2]](#note-2)。

---

## 价值延伸
Kent Beck提出的简单设计原则更多关注的是代码设计，其实当你认同了 [简单设计价值观]({{ site.url }}{{ '/value-of-simple-design/' }}) 之后，简单设计可以运用在架构设计、沟通协作上。

架构设计

- 我们应该最先考虑的是满足业务架构的系统架构（*通过测试*，性能、稳定性等）
- 借助DDD来合理的划分微服务（*揭示意图*，明确限界上下文）
- 提取公共服务组件来分离关注点（*消除重复*，API Gateway、BFF等）
- 最后，我们在满足了前三点的前提下尽可能简化系统架构中的组件

沟通协作

- 在与客户正式场合的沟通中，我们始终应该明确沟通主题，确定目标（*通过测试* ）
- 通过加强结构思考力来提升表达的结构性和清晰度，从而达到言简意赅（*消除重复*，*揭示意图* ）
- 最后，我们达到了前面三点之后尽量不说多余的废话


简单设计价值观甚至会影响你的生活方式，辅以断、舍、离的心态修炼，相信你的生活会逐渐变得简约而不简单。

---

## 注释

<a id="note-1"></a>

1. 有关简单设计四原则更权威的表述，请参考Kent Beck的*《Extreme Programming Explained: Embrace Change》*

	- Runs all the tests
	- Has no duplicated logic. Be wary of hidden duplication like parallel class hierarchies
	- States every intention important to the programmer
	- Has the fewest possible classes and methods 	
<a id="note-2"></a>

2. 参考Martin Fowler博客 [BeckDesignRules](https://martinfowler.com/bliki/BeckDesignRules.html#footnote-kent-empathy)


> 我的博客即将搬运同步至腾讯云+社区，邀请大家一同入驻：<https://cloud.tencent.com/developer/support-plan?invite_code=2u3d25d0ch8gw>