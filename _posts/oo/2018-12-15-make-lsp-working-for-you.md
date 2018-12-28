---
layout: post

title: "让里氏替换原则为你效力"
date: 2018-12-15
categories: [OOD]
tag: [OO]

author: "袁慎建"

brief: "
从事软件开发的朋友或多或少都听过以下一些原则：比如KiSS、DRY、LKP、COC、DbC、SoC、HP、SOLID等。这些原则已经在业界被证实了自身的价值，尤其当谈到面向对象设计的时候，SOLID则是一个避不开的主题。
</br></br>

对于大部分OO程序员，这五大原则的名字可能已经耳熟能详，却总不能很清晰的描述出SOLID是如何为我们服务，因为SOLID从来也没有告诉我们How，它只在说：'这就是你最终要达到的目的地'。
</br></br>

本文我将带着我的思考来捋一下LSP，LSP可能是一个很容易被破坏的原则，理解了它将能够很好地驱动我们去思考如何正确地做抽象设计。

"

---

* content
{:toc}

---

## 面向对象的基石
从事软件开发的朋友或多或少都听过以下一些原则：比如KiSS、DRY、LKP、COC、DbC、SoC、HP、SOLID等。这些原则已经在业界被证实了自身的价值，尤其当谈到面向对象设计的时候，SOLID则是一个避不开的主题。

作为面向对象的基本原则，SOLID本身就是一个明显的招牌 - 坚固的磐石，撑起了面向对象设计大厦。

SOLID由五大原则构成：

1. **S**ingle Responsibility Principle【单一职责原则】
2. **O**pen Close Principle【开闭原则】
3. **L**iskov Substitution Principle【里氏替换原则】
4. **I**nterface Segregation Principle【接口隔离原则】
5. **D**ependency Inversion Principle【依赖倒置原则】

对于大部分OO程序员，这五大原则的名字可能已经耳熟能详，却总不能很清晰的描述出SOLID是如何为我们服务，因为SOLID从来也没有告诉我们How，它只在说："这就是你最终要达到的目的地"。

本文我将带着我的思考来捋一下LSP，LSP可能是一个很容易被破坏的原则，理解了它将能够很好地驱动我们去思考如何正确地做抽象设计。

---

## 打破里氏替换原则
> In a computer program, if S is a subtype of T, then objects of type T may be replaced with objects of type S without altering any of the desirable properties of the program (correctness, task performed, etc.) --  Barbara Liskov in 1987

简单描述LSP：***一个子类实例对象替换掉其父类实例对象，不会引发程序的任何变化。***

如果要保证这点，我们在设计类的继承关系的时候，子类不应重写父类的方法，这样保证了父类的行为没有被修改。来看个代码示例，一个`Square`类继承自`Rectangle`类，我们计算它们的面积：

```java

class RectangleTest {
    @Test
    void should_return_area_when_calculate_given_width_and_height_valid() {
        Rectangle rectangle = new Rectangle();
        rectangle.setHeight(3);
        rectangle.setWidth(5);

        assertThat(rectangle.calculateArea()).isEqualTo(15);
    }
    @Test
    void should_return_area_when_calculate_given_width_and_height_valid() {
        Rectangle rectangle = new Square();
        rectangle.setHeight(3);
        rectangle.setWidth(5);

        assertThat(rectangle.calculateArea()).isEqualTo(25);
    }
}
```

前者返回的是`15`，而后者返回的是`25`。这两者的差别在于我们使用了`Square`替换掉`Rectangle`，从而导致了程序的行为发生了改变。

看看`Rectangle`和`Square`的实现，不难发现子类`Square`重写了`setHeight`和`setWidth`方法，修改了父类行为，导致了替换失败。

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

所以按照LSP的观点，这个继承关系被扣上`不良`的帽子，注意这里我用了`不良`，而非`错误`。因为我知道你可能会怼我："*我设计这个子类我就想基于父类做一个扩展，不同的子类有不同的实现，没让你在使用的时候去替换父类呀!* " （我敢打赌你在项目中遇到过这种覆写父类的实现，并且软件还能正常Work）。在我怼回去之前，请先跟我来回顾一下现象对象特性。

---

## 从复用来看继承
从一踏入职场那一刻，我就在面试中多次被问过：请谈谈你对面向对象的三大特性的理解？

简单捋一下面向对象的三大特性：

- 封装：隐藏对象的属性和实现细节，仅对外公开接口。比如`Rectangle`类，首先对自身属性`width`和`height`进行了隐藏，通过`calculateArea`方法提供服务，将依赖自身数据的计算细节也进行了隐藏
- 继承：允许子类在不需要重新编写父类的前提下，复用父类的所有功能，并能够按需进行扩展。比如`Square`继承了`Rectangle`，就具有了`calculateArea`的功能。（当心：这个继承不合理）
- 多态：允许对象在运行期表现出不同的形体


恰巧LSP中提到了子类和父类的概念，所以不得不说说`继承`。在这之前，我假设：*在做面向对象软件设计的你认同面向对象设计的价值 -- 提升软件的对变化的响应力*。

继承的最核心的目的之一是为了复用，很多时候我们为了复用采用了继承。如果我们设计继承单纯为了复用，你可能会问为啥不用组合？而且很多时候提倡`组合优于继承`。这就需要我们思考面向对象的设计初衷：面向对象建立在对真实世界的抽象前提上，它很大程度上反映了我们的真实世界。比如一只鹦鹉是一只鸟，鸟能飞，鹦鹉也能飞，所以让鹦鹉继承自鸟，鹦鹉具备了飞的能力。

```java
public class Bird {
    public void fly() {
        System.out.println("I am flying");
    }
}

public class Parrot extends Bird {}
```

如何决定继承关系，你可以用`Is-A`来进行初步验证，比如`A parrot is a bird`。当你使用`Is-A`读起来就能让自己发笑得的时候，就说明这个继承就明显不合理了。比如，你有一架飞机，它也能飞，为了复用你让飞机继承鸟 -- `A Plane is a Bird`。当关系不是那么明显的时候怎么办？比如，`A Square is a Rectangle`，下文我将给出答案。


所以，继承首先它应该体现一种现实世界的真实规则`Is-A`，复用是它提供的一个核心能力，也是我们期望在设计上能获得的好处，*而要达到复用，就要遵守一个规则：子类不去更改父类已有的行为，否则就与复用不沾边了*（复用，代表你啥也不用做，直接具备的行为，如果你重新实现了，那叫新的实现，你付出了新的努力。至于你要添加新的行为，这属于扩展，按需就好）。

我想你已经能够运用`Is-A`来避免很多明显恰当的继承关系。而当你面临模棱两可的继承场景时，从复用的视角出发，LSP提供了很好的校验规则。


---

## 抽象是为了更好地复用
回到文章一开始的例子，使用`Is-A`来解读：`A Square is a Rectangle`，好像还凑合，但有点把握不准。

让`Square`继承自`Rectangle`，`Square`能够复用`Rectangle`中的所有行为，假如你不对`Square`做任何事情就能完美复用，但这样子出来的正方形可能宽和高就不一样了（无法满足客户真实需求，这可都是无用功哟）。为了满足客户需求，你就不得不对`setWidth`和`setHeight`进行重写：

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

一旦重写，当你将下面代码的`Rectangle`替换成`Square`时候就挂了：

```java
@Test
void should_return_area_when_calculate_given_width_and_height_valid() {
    // Replace with Square
    Rectangle rectangle = new Rectangle(); 
    rectangle.setHeight(3);
    rectangle.setWidth(5);

    // 25 if using Square
    assertThat(rectangle.calculateArea()).isEqualTo(15); 
}
```

所以，Liskov就开始呐喊了："说好的`Square`只是复用`Rectangle`的呢，为啥把`Rectangle`的行为改了，程序挂了，你不守规矩，怎么回事！"


那规矩又是什么呢？此时你必须重写`setWidth`和`setHeight`，毕竟满足客户才是你首要目的。到这个时候，已经说明了该继承关系出了点问题。你需要做的是跳出来，重新审视一下你的设计：

*`Square`和`Rectangle`都有宽和高，并且计算面积的方式一样，不同的是`setWidth`和`setHeight`。是否可以将共同的特征进一步抽象提炼。就这样逼着自己去思考，你可能很快就抽象出一个四边形，因为`setWidth`和`setHeight`行为不确定，先将它们抽象化。*


你很快用Java代码实现：

```java
public abstract class Quads {
    protected int width;
    protected int height;
    
    public abstract void setWidth(int width);
    public abstract void setHeight(int height);
    
    public int calculateArea() { return width * height; }
}
```

然后你让`Rectangle`和`Square`分别继承自`Quads`，各自在自己的类中实现`setWidth`和`setHeight`。这时候你使用`Rectangle`和`Square`的方式也改了：

```java
class QuadsTest {
    @Test
    void should_return_area_when_calculate_given_width_and_height_valid() {
        Quads quads = new Rectangle();
        quads.setHeight(3);
        quads.setWidth(5);

        assertThat(quads.calculateArea()).isEqualTo(15);
    }
    @Test
    void should_return_area_when_calculate_given_width_and_height_valid() {
        Quads quads = new Square();
        quads.setWidth(5);
        assertThat(quads.calculateArea()).isEqualTo(25);
    }
}
```

通过进一步抽象，你改变了继承关系，`Rectangle is A Quads`，`Square is A Quads`，此时这种继承关系就更加清楚明显了，并且没有违背LSP（Quads是一个抽象类，不能实例化对象，所以不会出现子类实例对象替换父类实例对象）。

到这里，你已经成功通过了进一步抽象拯救了这个继承关系，而且新的继承关系更加合理，更加符合面向对象设计，也最大化发挥了继承的核心能力 -- 复用。

很多时候我们遇到这种，可能是因为我们过于着急写代码或是疏忽大意，那些貌似像`Is-A`的关系也被我们用上了继承，这也促成了继承被滥用。而解决办法也很简单，LSP这个工具提供了很大的帮助，最终你会发现大多是由于恰当抽象的缺失。


---


## 总结
如果用一句话来形容LSP，我觉得是：***当你无法根据`Is-A` 来判断继承关系是否合理时，你应该思考如何进行下一步抽象，从而避免让继承产生二义性***

借用极限编程的理念来讲：*将我们认同的有效软件开发原理和实践应用到极限*。我们在做面向对象设计时，不妨拿起LSP这个现成的工具，帮助我们有效地减少继承的滥用、模糊意图等设计缺陷，提升软件设计。

当然，很多不符合LSP的软件也能工作，这就像很多软件充斥着坏味道照样能工作一样（比如*代码注释*）。而它背后隐含的逻辑应该是：

***我们应该积极去思考更好的设计，而不是过早放弃思考的机会***

---

## 注释
- KiSS: Keep it simple, stupid
- DRY: Don't Repeat Yourself
- LKP: Least Knowledge Principle (LOD: Law of Demeter)
- CoC: Convention over Configuration
- DbC: Design by Contract
- SoC: Segregation of Concerns
- HP: Hollywood Principle

---

## 参考阅读
- [写了这么多年代码，你真的了解SOLID吗？](https://insights.thoughtworks.cn/do-you-really-know-solid/)