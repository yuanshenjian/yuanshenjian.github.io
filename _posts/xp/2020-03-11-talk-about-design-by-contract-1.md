---
layout: "post"
title: "简单聊聊契约设计（上）"
date: 2020-03-11
categories: [eXtreme Programming]
tag: [eXtreme Programming]
toXPSite: true
author: "袁慎建"

---

* content
{:toc}

---

{% if site.is_personal %}
{% assign base_url = site.url %}
{% else%}
{% assign base_url = 'https://yuanshenjian.cn' %}
{% endif %}
{% assign base_post_image_path = base_url | append: site.image_path_post %}

<!--brief-->
我在阅读Bob大叔的《敏捷软件开发：原则、模式与实践》第十章的时候第一次接触**Design by Contract**这个概念。Bob大叔在讲解面向对象设计SOLID原则中的LSP(Liskov Substitution Principle)的时候借助DbC来支撑LSP[1]。


当时的场景是这样子的：
<!--brief-->

在一个系统中，存在一个长方形（Rectangle）类，该类设置宽、高以及计算面积的方法：


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

之后出现一个正方形（Square），`A Square is a Rectangle`这句话在现实世界中完全没毛病，所以让`Square`继承自`Rectangle`也符合OOA(Obejct Oriented Analysis)。继承之后，为了保证程序的正确性，`Square`不得不覆写设置宽和高的方法：

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

存在这样子的用户使用场景：

```java
public class Client {
    public static void main(String[] args) {
        assertStandardHouseArea(new Rectangle());
        assertStandardHouseArea(new Square()); // Failed
    }
    private static void assertStandardHouseArea(Rectangle rectangle) {
        rectangle.setHeight(20);
        rectangle.setWidth(30);
        assert rectangle.calculateArea() == 600;
    }
}
```

而如果用户传入了一个`Square`对象，程序就会出错，Rectangle/Square继承结构对`assertStandardHouseArea`的使用者来说是脆弱的。我们认为`Square`和`Rectangle`的继承违背了LSP。



## 什么是模型的有效性？
> LSP则得出的重要结论：一个模型，如果孤立地看，并不具有真正意义上的有效性。模型的有效性只能通过它的客户程序程序来表现。

怎么理解上面这句话呢？例如：当我们从两个模型的设计者来看，当`Rectangle`和`Square`被孤立看待时，他们各自都是有效的，因为假如客户单独使用这模型的假设都是有效的：

1. `Rectangle`，假设长和宽独自变化，互不影响。
2. `Square`，假设长和宽是同时变化，且始终相等。

一旦`Square`继承自`Rectangle`之后，上述`assertStandardHouseArea`的用户会做出基于基类`Rectangle`的假设，合理地去断言面积为600。针对用户的这个假设，此时的模型设计就产生了臭味。


如果觉得这个用户假设不好理解，来看一个江湖小段：


一江湖侠客（用户）经常使用的一把宝剑，出鞘进鞘如行云流水。另一刺客（用户）手持利刃，刀光剑影不出三招必拿下人头，手速快到你都觉得刀从未出鞘。本来这两人，各自使用自己的武器非常顺手（独立看模型，都没问题）。此时，调皮的你，趁侠客舞剑，把刺客的刀鞘插到侠客的剑桥中（胡乱继承），侠客舞剑完毕按照老习惯将剑入鞘（原有假设），此时很可能会非常尴尬（程序出错）。

{% include post-image.html name = 'dbc-metaphor.png' %}

上述有段子对应三种模型设计：

1. 宝剑 + 剑鞘
2. 利刃 + 刀鞘
3. 宝剑 + 刀剑鞘

显然第三种模型设计是有问题的。所以，我们在设计模型的时候，不能抛开模型的用户而去孤立看待，要根据该模型的使用用户所做出的合理假设来审视我们的设计。


基于此，又产生了一个新的问题 -- "我们怎么知道用户会做出哪些合理假设呢？" 实际上，如果我们试图去预测所有的假设，代码很可能会充斥着浓浓的味道（类似防御是编程）。Bob大叔提出建议 -- 优先预测那些明显违背了LSP的设计，延迟其他的预测，直到出现了脆弱性的臭味时。


## OOD中的IS-A不灵了吗？
正方形是一个矩形，这个在现实世界中合理的两个概念模型关系难到不适用面向对象了吗？诚然，对于非`assertStandardHouseArea`的用户来说，正方形就是一个矩形，而对于`assertStandardHouseArea`的用户来说，因为`Square`的行为方式跟期望的（用户的合理假设）`Rectangle`的行为方式不相容，从行为方式来看，正方形并不是一个矩形。

基于此，LSP再次画重点：

1. 对象的行为方式才是软件真正所关注的问题。
2. 行为方式是可以进行合理假设的，它是客户程序所依赖的。
3. 在OOD中，IS-A的关系是就行为而言的[2]。



## 如何明确用户的合理假设？
聊了这么多，说起来我们好像是在基于用户的合理假设来审视我们的模型设计，我们需要去猜测用户会存在哪些合理假设，而这种猜测可能会让人觉得心里不踏实，如何才能知道客户的真正要求呢？Bob大叔提到了一项技术，也就是我们要聊的主题DbC (Design by Contract)，能够帮助明确用户的合理的假设。

下一篇文章我会来聊聊DBC到底是个什么东西？


## 除去模型设计的臭味
到这里，你也许想到了多种方式去除`Rectangle`和`Square`的这种继承的臭味，你可以让`setWidth`和`setHeight`成为抽象方法（虚方法），当然这样做也有点奇怪，因为对于`Rectangle`来说，设置宽和高是很合理的两个行为。所以，你可能干脆就去掉它们之间的继承关系，因为正方形完只需要一个边长的属性。再者，如果你需要多态，又不想抽象化设置宽和高的方法，还可以引入接口（Java中的interface），让两个类都实现该接口。



## 参考阅读

1. [听面向对象先生聊SOLID创业故事]({{base_url | append: '/solid-in-depth-explanation' }})
2. [聊聊面向对象设计中的Is-A]({{base_url | append: '/talking-about-is-a-in-ood' }})

