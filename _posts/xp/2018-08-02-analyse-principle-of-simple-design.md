---
layout: post

title: "解析简单设计原则"
date: 2018-08-02
categories: [eXtreme Programming]
tags: [Simple Design]
author: "袁慎建"
toXPSite: true


brief: "
在我的简单设计价值观的指引下，本文我以代码设计面临的问题为起点，进而讨论设计决策中我们主要考虑的维度，针对这四个维度我们一起来尝试回答四个问题。

</br></br>

对于这些问题，我基于Kent Beck提出的简单设计原则，并结合当今的软件开发，做了一次全面的解读，最后通过价值延伸来诠释简单设计的魅力。

"

---

## 设计缺乏一个统一标准


经常听到程序员们针对代码设计的一些讨论，A对B说：“我的这个设计用了策略模式和状态模式，假如后面客户会有这样的需求，可以无缝扩展，无比健壮。” B听着一脸狐疑，心中已经念叨了数遍 ："哼，这就是典型的过度设计"，但B也不好说出口，因为上周才因为过度设计的分歧打了一次口水仗了。


我在项目中经常碰到这样的争论，因为设计的好坏本身没有一个标准权威的答案，这么多年各路大神提出的设计原则就够我们学几个学期，而且还是个似懂非懂。久而久之，每个人心中都有自己的一杆秤，导致了后来**什么是好的设计**就成了公说公有理婆说婆有理的问题，谁也说服不了谁。


设计是一个很大的话题，为了更好的起步，我尝试将范围缩小到敏捷团队程序员交付用户故事卡时的代码设计，不谈架构设计和系统设计。从变量、常量、方法、类、类与类之间的关系、对象的交互开始，一起来聊聊什么是设计的问题。


## 用简单的词汇来具象化设计


抽象的设计问题大大提升了初学者的学习门槛，想得太多怕被说过度设计，吃饱撑着没事找事。想少了，又怕被人认为能力不足，无脑编码。那到底怎么办，怎么样才能做出好的设计？SOLID、GoF的23种设计模式、STUPID、GRASP这些原则学会了就可以了吗？No，统统忘掉这些抽象不接地气的设计原则。起步，不要让自己那么难。来看看，极限编程领域的大神Kent Beck很早前就提出了几条容易理解的参考原则：


1. 通过测试
1. 揭示意图
1. 消除重复
1. 最少元素



![](https://cdn.nlark.com/yuque/0/2020/png/104324/1606710638065-a085f32a-9b8b-4186-88ba-28164fa4746e.png#align=left&display=inline&height=576&margin=%5Bobject%20Object%5D&originHeight=576&originWidth=1168&size=0&status=done&style=none&width=1168)

---

## 简单设计原则不能忽略优先级


虽然Kent Beck提出的这四条原则里面也存在`揭示意图`这样一个每个人持有不一样标准的概念，但至少这一条在很大程度上能够代表代码的可读性，优秀程序员对代码可读性有90%相似度，可能在10%有钻牛角尖般的争议，也没有那么重要了。


其他几条则看起来就非常具体了，而且都能见字如意，测试一定要通过、重复就应该消除、元素没必要就不要存在。代码读不懂，那就就多找几个人看看。


### 通过测试不可动摇


_通过测试_ 通常会被一概地理解为通过自己在项目中所编写的各种自动化测试，这么理解，也没有什么问题，但是需要满足两个前提条件：


1. 测试覆盖率达到100%
1. 所有测试都是有效的



如果你的项目中没法满足这两点，当然，99%的项目是做不到的（还有1%我只听过）。此时你需要换一个角度去理解 _通过测试_。


想想你为什么写测试，测试在测什么，不就是为了增强你对系统满足了业务需求的信心吗？所以_通过测试_ 广义理解为要满足业务需求，不论是自动化测试还是手工测试，你需要做的是满足业务需求，只不过我们推荐自动化能自动化的测试。


### 消除重复要全力以赴


> 重复乃万恶之源 -- SJ



重复意味着_低内聚、高耦合_，导致的后果是难以修改（霰弹式修改），必然降低系统对变化的响应力。响应力的降低势必会造成维护工作量的提升，[我的简单设计价值观](https://www.yuque.com/yuanshenjian/xp/simple-design-value/) 一文中的_懒惰_ 将驱使我尽我所能消除这些重复，从而减少修改时的工作量，提升软件的响应力。


### 揭示意图聚焦90%


对于揭示意图，我们只聊程序员那90%认同区间。可从一增一减两个方向同时去努力，从而达到揭示意图：


1. 增强代码的自身可理解性，让代码自解释。
1. 减弱代码的其他干扰因素，让代码更纯净。



不管是哪个方面，目的只有一个，回答一个问题：这个代码读者读起来更容易理解了吗？


那么在增强方面，比如在变量、方法以及类的命名等，我们都竭尽全力去赋予它们一个更加表达业务的名字，让它们能够自解释，从而让读者能够在深入细节之前就能够在较高层次上快速理解代码的意图。


减弱方面，比如在注释、方法的组织、类的交互设计等，可以去除不必要的注释，控制方法体的大小、降低类交互复杂度来让代码更纯净，从而让读者更好地聚焦在核心代码上。


### 最少元素说的是Less is More


既然说的是代码，那么充斥在你的代码库中的任何东西都可以理解是元素。当然，我们还是焦点聚焦在与代码相关的元素，比如，变量、常量、注释、注解、关键字、包。


_最少元素_ 的核心思想是：在不必要的时候，尽可能减少代码元素来降低代码复杂度，保持简洁，贯彻less is more的思想，它道出了简单设计的精髓。


### 优先级让赋予四原则生命力


简单设计四原则给设计决策提供了有效的指导，在实际运用过程中，当面临冲突时，我们如何取舍，Kent Beck也给出了一个优先级顺序参考：通过测试 > 消除重复 >= 揭示意图 > 最少元素


以上四条优先级依次降低，这就话有点类似敏捷宣言中的最后一句：[_也就是说，尽管右项有其价值，我们更重视左项的价值_](http://agilemanifesto.org/iso/zhchs/manifesto.html)。


1. 不可动摇（100%）：通过测试
1. 应当做到（95%）：消除重复
1. 尽全力做（90%）：揭示意图
1. 尽力去做（？%）：最少元素

---

## 明白了优先级，你不再迷茫


_通过测试_，这条优先级最高的原则告诉我们任何时候我们编写的软件是要为客户创造真实价值的，如果为了消除重复、揭示意图或减少代码元素，而编写出不符合客户期望的软件，这就是好比捡了芝麻丢了西瓜。所以第一条没有满足的情况下，打着满足后三条的口号都是无稽之谈。


_消除重复_，一方面，已经存在的重复代码应当试图消除掉，降低修改的成本。另一方面，也在强调我们不应该为未来编码，即为一个尚未出现的重复或变化方向去增加额外的复杂度，比如建立一个抽象接口，却只有一个实现。


_揭示意图_，在我看来，跟_消除重复_ 不相上下，绝大多数时候这两条是相辅相成的，不会因为消除重复而有损揭示意图，也不会通过引入重复增加揭示意图。在实际开发中我们应该尽量同时遵循这两条原则来提高软件的质量。


_最少元素_，这条优先级最低的原则告诉我们除非在增加了代码元素之后，能够消除重复或揭示意图或者通过测试，否则我们不应该增加代码元素。如果，你为了消除重复逻辑而抽取了一个公共方法，或者会为了揭示意图增加一个常量来替代魔鬼数字。你打着为了满足优先级更高的原则，而去违背优先级更低的原则，这个就符合了这个原则思想理念。


如果，在工作中你的领导的领导的领导的领导（4个人），当他们给你的指令有冲突是，你只用听更高级领导的指令。


_示例：抽取公共方法_


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


_示例：常量代替魔鬼数字_


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


> 针对_揭示意图_、_去除重复_ 这两条业界存在一些争论，觉大多数情况下，这两者并不冲突，在我的经验中，可能在一些测试用例中会通过引入重复来避免逻辑分隔等测试坏味道，从而对读者更加友好。Kent Beck也提出唯一让他有印象的冲突是发生在测试用例 [2]。


---

## 简单设计思想有更广阔的填空


Kent Beck 提出的简单设计原则更多关注的是代码设计，简单设计思想其实可以运用在架构设计、沟通协作上。


架构设计


- 我们应该最先考虑的是满足业务架构的系统架构（_通过测试_，性能、稳定性等）
- 借助DDD来合理的划分微服务（_揭示意图_，明确限界上下文）
- 提取公共服务组件来分离关注点（_消除重复_，API Gateway、BFF等）
- 最后，我们在满足了前三点的前提下尽可能简化系统架构中的组件



沟通协作


- 在与客户正式场合的沟通中，我们始终应该明确沟通主题，确定目标（_通过测试_ ）
- 通过加强结构思考力来提升表达的结构性和清晰度，从而达到言简意赅（_消除重复_，_揭示意图_ ）
- 最后，我们达到了前面三点之后尽量不说多余的废话



简单设计价值观甚至会影响你的生活方式，辅以断、舍、离的心态修炼，相信你的生活会逐渐变得简约而不简单。

---

## 注释


1. 有关简单设计四原则更权威的表述，请参考Kent Beck的_《Extreme Programming Explained: Embrace Change》_
   - Runs all the tests
   - Has no duplicated logic. Be wary of hidden duplication like parallel class hierarchies
   - States every intention important to the programmer
   - Has the fewest possible classes and methods
2. 参考Martin Fowler博客 [BeckDesignRules](https://martinfowler.com/bliki/BeckDesignRules.html)

