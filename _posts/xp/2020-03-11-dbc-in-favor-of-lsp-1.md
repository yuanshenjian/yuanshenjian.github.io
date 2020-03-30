---
layout: "post"
title: "简单聊聊契约式设计（上）"
date: 2020-03-11
categories: [eXtreme Programming]
tags: [DbC]
toXPSite: true
author: "袁慎建"

---

* content
{:toc}


{% if site.is_personal %}
{% assign base_url = site.url %}
{% else%}
{% assign base_url = 'https://yuanshenjian.cn' %}
{% endif %}
{% assign base_post_image_path = base_url | append: site.image_path_post %}

<!--brief-->
我在阅读Bob大叔的《敏捷软件开发：原则、模式与实践》第十章的时候第一次接触**Design by Contract**这个概念。Bob大叔在讲述面向对象设计SOLID原则中的LSP(Liskov Substitution Principle)时，就借助DbC的设计思想来支撑LSP[1]。关于DbC，我将用两篇文章来简单聊聊。
<!--brief-->

袁帅大学毕业后半年左右折回到长安大学的IT部门。他被安排到一个刚启动的教学软件系统项目。系统中已经存在一个长方形（Rectangle）类，该类有设置宽、高以及计算面积的行为：


```java
public class Rectangle {
    protected double width;
    protected double height;

    public void setWidth(double width) {
        this.width = width;
    }
    public void setHeight(double height) {
        this.height = height;
    }
    public double calculateArea(){
        return width * height;
    }
}
```

入职后第二周，接到新需求要实现一个正方形（Square）。周一，袁帅开完站会后就Kick off了这张卡。看着代码库，他思忖着："`A Square is a Rectangle`，这个小学数学教了多少遍的概念一定不会有错"。于是，他果断创建了一个`Square`类，并继承`Rectangle`。**程序功能要满足客户需求**这条准则袁帅还是没有忘记的，他心里清楚得覆写设置宽和高的方法：

```java
public class Square extends Rectangle {
    @Override
    public void setHeight(double height) {
        this.height = height;
        this.width = height;
    }
    @Override
    public void setWidth(double width) {
        this.height = width;
        this.width = width;
    }
}
```

接着，袁帅将用户使用场景翻译成如下代码：

```java
public class Client {
    public static void main(String[] args) {
        assertStandardHouseArea(new Rectangle());
    }
    public static void assertStandardHouseArea(Rectangle rectangle) {
        rectangle.setHeight(20);
        rectangle.setWidth(30);
        assert rectangle.calculateArea() == 600;
    }
}
```

不到一上午时间，他就提前完成了功能开发，午饭时间还没到，他边等时间边琢磨怎么折腾一下他这个代码，争取不给QA留下"把柄"。想着想着，他回忆起大二书上看到的一个概念 -- LSP，模模糊糊记得是 "子类能够替换掉父类..."。既然是子类、父类，不就是继承关系吗。于是他模拟用户使用时传入了一个子类对象：

```java
public class Client {
    public static void main(String[] args) {
        assertStandardHouseArea(new Square()); // Failed
    }
}
```

程序挂了，一试就中，袁帅小有成就感。因为不太确定LSP完整含义，他顺手翻开桌前的《敏捷软件开发：原则、模式与实践》，快速目录锁定到LSP的位置。LSP -- 子类对象能够替换掉父类对象，而且不会引发程序的不一致。

他没有怀疑古人提出的LSP是否本身有问题，而是先反观自己的程序："得是哪里不对劲!"。查看了15分钟，没看出明显问题，百思不得其解，他只好继续往后阅读。

他好像明白了点什么 -- 原来Rectangle/Square继承结构对`assertStandardHouseArea`的使用者来说是脆弱的。

假设将`Rectangle`和`Square`模型独立看，各自的使用者只知道`Rectangle`或`Square`，分别使用这两个模型的时候不会存在这个问题，这两个孤立的模型都是有效的。一旦这两个模型发生了继承关系，相当于组合后构建了一个新的模型，但是对于使用者来说，他的期望是建立在父类`Rectangle`之上的，而`Square`继承了父类后，又打破了这个期望，这个新的模型对于用户来说是无效的。

似懂非懂，袁帅对模型的有效性有了新的疑问，带着好奇心，继续往下读。


## 什么是模型的有效性？
> LSP则得出的重要结论：一个模型，如果孤立地看，并不具有真正意义上的有效性。模型的有效性只能通过它的客户程序程序来表现。

看到上面这句话，袁帅尝试回到自己的代码去理解。当孤立看`Rectangle`和`Square`时，它们各自都是有效的，为何有效？因为这两个模型的使用者分别有如下假设：

1. `Rectangle`，长和宽独自变化，互不影响。
2. `Square`，长和宽是同时变化，且始终相等。

`Square`继承`Rectangle`之后，使用者的假设就变了：

1. `Rectangle`，长和宽独自变化，互不影响。
2. `Square` is a `Rectangle`，可以回到假设1。

很明显，`Square`覆写了设置宽和高的方法后，破坏了`Rectangle`的用户假设，继承后的新模型就失效了。


袁帅平时喜欢看武侠小说，他盯着屏幕的代码，思绪飘到江湖：

一江湖侠客（用户）经常使用的一把宝剑，出鞘进鞘如行云流水。另一刺客（用户）手持利刃，刀光剑影不出三招必拿下人头，快到你以为刀未曾出鞘。本来这两人，使用自己的武器非常顺手（独立看模型，都没问题）。此时，调皮的袁帅，趁侠客舞剑，把刺客的刀鞘插到侠客的剑桥中（好比胡乱继承），侠客舞剑完毕按照老习惯将剑入鞘（原有假设），很可能会非常尴尬（程序出错）。

{% include post-image.html name = 'dbc-metaphor.png' %}

他拿起了笔，在纸上画下刚才几个模型：

1. 宝剑 + 剑鞘
2. 利刃 + 刀鞘
3. 宝剑 + 剑鞘 + 刀鞘 + 利刃

孤立去看`宝剑 + 剑鞘` 以及`利刃 + 刀鞘`这两个模型，各自依然有效成立的。将剑鞘和刀鞘结合之后，侠客的宝剑就没法入鞘。


袁帅突然回过神来，注意到`合理假设`这个词，喜欢思考的他又产生了一个新的问题 -- "那我怎么知道用户会做出哪些合理假设呢？" 

此时，他看到书中Bob大叔提到一个观点:

> 如果我们试图去预测所有的假设，代码很可能会充斥着浓浓的味道。我们应该优先预测那些明显违背了LSP的设计，延迟其他的预测，直到出现了脆弱性的臭味时。


读到这里，他心中能明确的点是 -- 那些明显违背了LSP的设计是不好的，应该当心警惕，并且予以及时修正。对于这个结论，他没有想要去驳斥，但他也不甘心做第六只猴子，只知道遵守，不知道为什么遵守？


## 为什么继承之后，模型就失效了？
袁帅看了眼手机，已经下午1点，错过了午饭黄金时间，他觉得没有必要再去食堂吃饭了，于是手机点了个外卖，开始总结刚才学习到的内容。

正方形是一个矩形，这个在现实世界中极其合理的关系。而在OO软件设计中，IS-A针对的是对象的行为而言。使用者会对对象的行为作出合理假设，而且是基于父类的行为做出的假设，如果子类的行为跟父类的的行为不兼容，就要当心这个继承的隐患。

基于此，袁帅在笔记上给LSP记了如下重点：

1. 对象的行为方式才是软件真正所关注的问题。
2. 行为方式是可以进行合理假设的，它是客户程序所依赖的。
3. 在OOD中，IS-A的关系是就行为而言的[2]。



## 如何明确用户的合理假设？
趁外卖还没有送到，袁帅又陷入了沉思："基于用户的合理假设来审视我们的模型设计，就需要我去猜测用户会存在哪些合理假设，而这种猜测总会让人觉得心里不踏实，到底如何才能知道客户的真正要求呢？"

突然手机铃声响了："袁先生你好，你的外卖到了，麻烦请到E座楼下取一下。" 




## 参考阅读

1. [听面向对象先生聊SOLID创业故事]({{base_url | append: '/solid-in-depth-explanation' }})
2. [聊聊面向对象设计中的Is-A]({{base_url | append: '/talking-about-is-a-in-ood' }})

