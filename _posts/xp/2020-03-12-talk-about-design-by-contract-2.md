---
layout: "post"
title: "简单聊聊契约设计（下）"
date: 2020-03-12
categories: [eXtreme Programming]
tag: [eXtreme Programming, DBC]

author: "袁慎建"

---

* content
{:toc}

---


<!--brief-->
在上一篇文章中，我们通过Bob大叔在讲解LSP的案例，我们在做模型设计的时候，要基于客户程序使用的角度去审视模型的有效性，这就需要我们要去猜测客户程序的一些"合理"的假设。当一个事情需要靠猜测的时候，我们总会觉得心里不安。Bob大叔提到了`DbC`这项技术，能够帮助我们来明确用户的合理假设。
<!--brief-->

## DbC的源头
早在1986年，伯特兰·迈耶就提了出**Design by Contract**[1]，这哥们还设计了Eiffel编程语言来实现这种设计思想。2003年，由伯特兰·迈耶创建的Eiffel Software公司申请将**Design by Contract**作为商标，并于2004年12月获得授权。


**Design by Contract**，按契约设计，也叫契约编程，它规定软件设计人员应为软件组件定义正式、精确和可验证的接口规范，该规范应使用**前提条件**、**后置条件**和**不变式**来扩展抽象数据类型的普通定义。根据对商业合同的条件和义务的概念隐喻，这些规范被称为`合同`，在本文中我称之为契约。


{% include post-image.html name = 'dbc.png' reference='https://en.wikipedia.org/wiki/Design_by_contract' %}


DbC应用了霍尔逻辑[2]，霍尔逻辑中的霍尔三元组清晰定义了：

> {P} C {Q}

P和Q是**断言**，C是**命令** 。P叫做**前置条件**，Q叫做**后置条件**。霍尔三元组简单理解为：只要P在C执行前的状态下成立，则在执行之后Q也成立。


## DbC在OOD中的应用
结合DbC的描述，我们来看看，上文中提到的Rectangle和Square，`Rectangle.setWidth(double width)`

- 前置条件是：assert type width is double
- 后置条件是：assert this.width == new.width && this.height = old.height


而`Square.setWidth(double width)`：

- 前置条件是：assert type width is double
- 后置条件是：assert this.width == new.width && this.height = new.width

同理，setHeight的方法也是如此。

从上述的分析来看，派生类Square的前置条件跟基类Rectangle保持一致，后置条件发生了变化，那么对于以下方法：

```java
private static void assertStandardHouseArea(Rectangle rectangle) {
    rectangle.setHeight(20);
    rectangle.setWidth(30);
    assert rectangle.calculateArea() == 600;
}
```

- 前置条件：assert input is a Rectangle
- 后置条件：assert rectangle.calculateArea() == 600

假如使用者传入了一个Square实例，因为Square is a Rectangle，前置条件没有变，但后置条件变了`assert rectangle.calculateArea() == 900`，该方法违背了DbC。这种现象的发生很可能会让使用者心寒 -- 一个"遵纪守法"的公民受到了不公的对待。

究其原因，归根结底是因为Square继承了Rectangle之后，违反了Rectangle定下的契约。那么，回到OOD中，按照伯特兰·迈耶的DbC思想，相比于基类，派生类应该遵守的契约是：

1. 派生类只能使用相等或更宽松的前置条件。
2. 派生类只能使用相等或者更严格的后置条件。


为了更好地理解这两条契约规则，我们来看一个生活中的故事。


## 房屋买卖的合同契约

比如，你正在买房，房产销售顾问小吴跟你签了个协议，并加盖了公章，协议里对你的约束：

1. 3.15号之前缴纳剩余100万首付款
2. 支付方式可以是支付宝、储蓄卡或者现金

合同里，房产商需要履行的职责：

1. 3.15号之前房源被锁定，不再对外销售：
2. 提供24小时私人订制服务。

后来小吴因为有事情休假了，让小高来服务你，这时候如果他中途告诉你：

1. 3.13号之前要缴纳剩余100万首付款。
2. 只能付现金或刷储蓄卡。

在后期的协作过程中，你得知了如下实情：

1. 3.13号就将房源对外公布购买。
2. 下午8 ~ 10点销售电话一直关机。

在这个过程中，你跟房产商的契约发生了如下变化：

- 前置条件更加严格：对你的要求更为苛刻。
- 后置条件更加宽松：服务承诺和服务质量下降。

作为客户，你遵守了跟小吴一起建立的契约，但是小高破坏了这个契约，后面你跟销售顾问这边的摩擦就在所难免了，如果不能及时协商调解，很有可能引发跟房产商的法律纠纷。


## 


## 参考阅读
1. [契约式设计](https://en.wikipedia.org/wiki/Design_by_contract)
2. [霍尔逻辑](https://en.wikipedia.org/wiki/Hoare_logic)
3. [面向对象软件建构](https://en.wikipedia.org/wiki/Object-Oriented_Software_Construction)


## 契约有效地维持着社会秩序
> 契约是指"依照法律订立的正式的证明.出卖.抵押.租赁等关系的文书"。 -- 《现代汉语词典》

契约这个东西，我们祖先在很久前就发明出来了。古代以物易物，我用2斤大米跟你环1斤黄豆，我今天帮你干半天活，你明天帮我干半天活。再到后来，发明了货币制度，用货币去购买物品，背后其实体现的也是一种契约精神。

由于上述的交易很快完成了，就不需要正式的合同文书。而对于那些具有后续持续义务的交易，比如按揭买房，我们需要通过一些法律的保障来加强强化彼此契约精神，所以就有了后来各种协议和合同，并受到了法律的保护。

契约明确地规定了双方需要履行的职责，以及可以各自可以享受的权益。在现实生活中的房产交易，有了购房合同，只要彼此履行契约规则，互相不需要去猜测对方会不会变卦，因为变卦后会受到法律保护。

但在软件设计中，就没有这么幸运了，你设计的API接口，如果使用者不按照你的要求使用，或者使用者按照你的规则来使用，却产生了意外的结果，这对彼此都不是一件值得高兴的事情。

那在软件设计中，我们是否也可以引入契约精神，来减少这种没必要的"纠纷"呢？当然可以，已经有人这么干了。




