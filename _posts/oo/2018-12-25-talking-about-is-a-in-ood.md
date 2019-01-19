---
layout: post

title: "聊聊面向对象设计中的Is-A"
date: 2018-12-25
categories: [OOD]
tag: [OO]

author: "袁慎建"

brief: "
面向对象编程范式得到了广大开发者的青睐，在做面向对象软件设计的同仁也或多或少曾经心存困惑过。比如，怎么样才是正确的封装？如何恰当的继承？何时应该抽象？ 对于设计，我们很难说对与错，通常只有好与不好的区分，而所谓的最佳实践也只是 -- 在当前约束下，人们所能找到的最佳解决方案。
<br/><br/>
最近我在给ThoughtWorks内部某海外交付团队的核心成员（Tech Lead & Second Tier）做OO Bootcamp的培训，在分享讨论和编码实践的过程中加强了对面向对象设计的理解，本文我来聊一聊面向对象中关于继承设计的`IS-A`的这个工具。
"

---

* content
{:toc}

---

面向对象编程范式得到了广大开发者的青睐，在做面向对象软件设计的同仁也或多或少曾经心存困惑过。比如，*怎么样才是正确的封装？如何恰当的继承？何时应该抽象？* 对于设计，我们很难说对与错，通常只有好与不好的区分，而所谓的最佳实践也只是 -- *在当前约束下，人们所能找到的最佳解决方案。*

最近我在给ThoughtWorks内部某海外交付团队的核心成员（Tech Lead & Second Tier）做OO Bootcamp的培训，在分享讨论和编码实践的过程中加强了对面向对象设计的理解，本文我来聊一聊面向对象中关于继承设计的`IS-A`的这个工具。

---

## IS-A是把好尺子
在做面向对象设计的时候，我们心中始终会装着三大武器：`封装`、`继承`、`多态`，设计出的软件也得有它们的身影。然而，很多时候并不是没有它们，而是它们的影子太多了（滥用或误用）。就拿继承来说，我们会经常使用`IS-A`来审视两个类的继承关系。比如以下场景：

1. A Parrot IS A Bird（鹦鹉是一只鸟）
2. A Man IS A Person（男人是一个人）
3. A Square IS A Rectangle（正方形是一个矩形）

以上关系，单纯从自然属性来思考都好像是正确的，所以我们在设计继承关系的时候通常会很容易类似写出以下代码：

```java
class Man extends Person{ }

class Person {
    private int age;
    private double height;
    
    public void walk(){ }
}

class Square extends Rectangle{ }

class Rectangle{ }
```

因为`IS-A`这把尺子的辅助，我们很容易地采用了继承，继承之后，子类什么也不用做就拥有了父类的特征和行为能力。看起来很好，它如期达到我们复用的期望。

---

## IS-A的失效区
拿`Square IS A Rectangle`来说，我们都知道正方形是一个矩形，这话没毛病。然而，当我们按照真实业务要求完善`Rectangle`之后可能是这样子的：

```java
public class Rectangle {
    protected double width;
    protected double height;
    public void setWidth(double width) { this.width = width; }
    public void setHeight(double height) { this.height = height; }
    public double calculateArea() { return width * height; }
}

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
此时我们有一个客户类这样使用Rectangle：


```java
public class SizeChanger {
    private double newWidth;
    private double newHeight;

    public SizeChanger(double newWidth, double newHeight) {
        this.newWidth = newWidth;
        this.newHeight = newHeight;
    }

    public double resize(Rectangle rectangle) {
        rectangle.setWidth(newWidth);
        rectangle.setHeight(newHeight);
        return rectangle.calculateArea();
    }
}
```
`resize`方法接受一个`Rectangle`对象参数，而`Square`作为子类，也可以被传入到这个方法中，比如我们测试客户类：

```java
class SizeChangerTest {
    @Test
    void should_calculate_correct_area_after_resize() {
        SizeChanger sizeChanger = new SizeChanger(5, 10);
        Rectangle rectangle = new Rectangle();
        rectangle.setWidth(4);
        rectangle.setHeight(5);

        assertThat(sizeChanger.resize(rectangle)).isEqualTo(50);
    }
}
```
我们期望`resize`的返回值是50，没毛病。但我们如果把`Rectangle`子类对象传给`resize`方法就会挂掉：

```java
class SizeChangerTest {
    @Test
    void should_calculate_correct_area_after_resize() {
        SizeChanger sizeChanger = new SizeChanger(5, 10);
        Rectangle rectangle = new Square();
        rectangle.setWidth(4);
        rectangle.setHeight(5);

        assertThat(sizeChanger.resize(rectangle)).isEqualTo(50); // 100 not 50
    }
}
```

作为客户程序就会产生疑惑了："我调用`resize`方法的表现时而不一样，这让我很焦虑，没法信任你的程序，既然`A Square IS A Rectangle`，给`resize`传入`Square`和`Rectangle`的结果应该是跟期望一致的。" 所以从`resize`的角度来看，`A Square IS NOT A Rectangle`。而导致这一现象的原因是`Square`和`Rectangle`的行为方式发生了改变，它们的`setWidth`和`setHeight`行为不一样。

`行为`是面向对象设计的关键所在，我们通过封装将对象属性隐藏，以API的方式来服务于客户程序，这些公开的API就是一系列行为，这些行为正是客户程序想使用的（客户程序依赖这些行为），它们也构成了我们软件的功能。

所有，不难理解`LSP（里氏替换原则）`强调`IS-A`的关系是针对行为方式来讲的，这也是面向对象软件设计中与真实世界的对象关系的微妙差别，当子类与父类针对某个具体的行为发生改变时，这个继承就违背了`LSP`。

---

## 拯救IS-A的铁弹
**`IS-A`是基于行为方式的，也就是说，当你的子类改变了父类的某个具体行为时，`IS-A`就需要重新审视了。**

如何重新审视？你需要进一步进行抽象，进一步提取抽象概念，此时需要念出`面向抽象编程`的六字真经了，抽出`多态`这把匕首，并移步*[让里氏替换原则为你效力](https://sjyuan.cc/make-lsp-working-for-you/)。*
