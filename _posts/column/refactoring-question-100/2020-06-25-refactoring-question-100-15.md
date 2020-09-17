---
layout: post

title: "能为你的全局常量安个家吗？"
date: 2020-06-25
categories: [eXtreme Programming]
tags: [REFACTORING-QUESTION-100]
column: REFACTORING-QUESTION-100
sub-tag: "Code Smell"

author: "袁慎建"

brief: "
百问重构系列问答。
"

---

* content
{:toc}

---

```java
public class Constants {
    public static final String LOVE = "Love";
    public static final String FIFTEEN = "Fifteen";
    public static final String THIRTY = "Thirty";
    public static final String FORTY = "Forty";
    public static final String DEUCE = "Deuce";
    public static final String ADVANTAGE = "Advantage";
    public static final String WIN = "Win";
    public static final String PLAYER_1 = "player1";
    public static final String PLAYER_2 = "player2";
    public static final String ALL = "-All";
}
```

上面这种风格的代码，我相信写过代码的人在代码库中或多或少见过，甚至有的代码库会呈现泛滥的倾向。我们来一起来阅读一下这段代码：

1. 类名Constants，常量？什么常量？没有任何业务含义，是哪个业务模块的？不知道，继续看
2. 往里看，LOVE = "love"，THIRTY = "Thirty"，好像就是转个大写，看名字还是不知道是干嘛的？
3. 继续看，PLAYER_1 = "player1"，PLAYER_2 = "player2"，咦，怎么不按套路出牌？看来前面判断不对
4. 看到最后一个，ALL = "-All"，心态崩了，什么玩意儿？这种代码，不光伤眼睛，还伤脑袋

这个是真实存在的代码，在我的训练营中，有不少小伙伴就写出这样的代码，这种代码，我给他起了一个名字 -- **全局常量**，注意它不是代码坏味道的**全局数据**。

要知道这些常量的出身，得看需求，这个是Tennis-Game重构Kata中的代码，网球的大致规则：

1. 第一位赢得比赛的玩家赢得了至少4分，并且比对手多赢得了至少2分
2. 每个游戏的得分都以网球特有的方式描述： 从零到三点的分数分别被描述为Love、Fifteen、Thirty和Forty
3. 如果每个玩家至少得到了三点，且得分相等，得分为Deuce。
4. 如果每方至少得分3分，并且玩家比对手多1分，则该游戏的得分对领先的玩家来说是Advantage

从这个需求上，逐渐还原了这些常量的出处，Constants类涵盖了多个业务场景中所用到的信息，只因为它们是一个字符串，所以被无情地用常量进行了定义。定义常量本身没什么大问题，但你把它从它应该待的地方硬拽到一个你打造的铁笼子，相当于把一群母语不同的人放到一个屋子，每个人都不知道说啥，整个屋子里氛围略显尴尬。

这种做法会带来一些副作用：

1. 领域知识集中营。模块中的业务信息泄露，相当于好几个业务模块的信息都被放到一起，知识集中、知识爆炸，造成了理解和认知负担。
2. 全局无限制访问。任何地方都可以随意使用这些常量，多个模块依赖该类，很容易造成看似相同实则不同的A和B两个业务上下文都在使用同一个常量，后期因为A发生了变化去修改了该模块，导致B也莫名其妙的挂掉。

基于这两方面的副作用，这些常量值得你去思考它们本应该待的地方。况且，Constants这种神秘命名本身就是一种代码坏味道，因为它没有传达任何业务含义。

在你的代码库中，你可以为这些全局常量安个家吗？

