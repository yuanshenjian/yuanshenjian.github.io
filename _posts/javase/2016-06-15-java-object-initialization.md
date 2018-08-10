---
layout: post

title: "浅析Java对象初始化"
date: 2016-06-15
category: [JAVASE]
tag: [Java]

author: "袁慎建"
brief: "
最近交付了一个Android项目，用的是JDK7，回味了一把自己的起家手艺。项目做完了，整个过程中，我对Android开发的感触此起彼。一开始略表失望（因为一个Android开发者亲自告诉我他做Android从来不写测试），中间因为自己缺乏经验，踩了很多坑，对代码进行了多次的换血般的重构，可谓心累，不过成长也非常大，后慢慢熟悉了Android，参加了公司的面试官培训，觉得自己有必要把Android做的好一点点（包括代码结构设计，测试覆盖率）。</br></br>

重拾起Java后，突然看到之前写了一篇关于Java面向对象初始化的文章，最初这篇文章是源于一道阿里巴巴的面试题，此时我再次把它整理出来，作为对Java的怀念。</br></br>

文章很简短，建议放慢脚步多思考，并且能够亲自在自己的机器上运行，分析输出结果。
"


---

* content
{:toc}


---

## 重拾Java
最近交付了一个Android项目，用的是JDK7，回味了一把自己的起家手艺。项目做完了，整个过程中，我对Android开发的感触此起彼。一开始略表失望（因为一个Android开发者亲自告诉我他做Android从来不写测试），中间因为自己缺乏经验，踩了很多坑，对代码进行了多次的换血般的重构，可谓心累，不过成长也非常大，后慢慢熟悉了Android，参加了公司的面试官培训，觉得自己有必要把Android做的好一点点（包括代码结构设计，测试覆盖率）。

重拾起Java后，突然看到之前写了一篇关于Java面向对象初始化的文章，最初这篇文章是源于一道阿里巴巴的面试题，此时我再次把它整理出来，作为对Java的怀念。

文章很简短，建议放慢脚步多思考，并且能够亲自在自己的机器上运行，分析输出结果。

## 代码镜头
因为源于一道面试题，变量命名都很随意，旨在说明原理，在实际编写代码的时候要坚决杜绝这种命名方式。

```java
public class InitializeDemo {
	private static int k = 1;
	private static InitializeDemo t1 = new InitializeDemo("t1");
	private static InitializeDemo t2 = new InitializeDemo("t2");
	private static int i = print("i");
	private static int n = 99;
	static {
		print("静态块");
	}
	private int j = print("j");
	{
		print("构造块");
	}
	public InitializeDemo(String str) {
		System.out.println((k++) + ":" + str + "   i=" + i + "    n=" + n);
		++i;
		++n;
	}
	public static int print(String str) {
		System.out.println((k++) + ":" + str + "   i=" + i + "    n=" + n);
		++n;
		return ++i;
	}
	public static void main(String args[]) {
		new InitializeDemo("init");
	}
}
```

## 运行结果
将这段代码运行后可以看到输出结果如下：

```
1:j   i=0    n=0
2:构造块   i=1    n=1
3:t1   i=2    n=2
4:j   i=3    n=3
5:构造块   i=4    n=4
6:t2   i=5    n=5
7:i   i=6    n=6
8:静态块   i=7    n=99
9:j   i=8    n=100
10:构造块   i=9    n=101
11:init   i=10    n=102
```

---

## 核心概念
对于Java对象初始化，有时候会看到一些晦涩难懂的解释说明，弄得一些初学者`本来还清楚,看了之后不是那么清楚了`。其实，掌握几条核心的概念，任何事情只要抓住核心的宗旨，就变得简单了。

```
1. 静态属性和静态代码块都是在类加载的时候初始化和执行，两者的优先级别一致，且高于非静态成员，按照编码顺序执行。
2. 非静态属性和匿名构造器在所有的构造方法之前执行，两者的优先级别一致，按照编码执行顺序。
3. 以上执行完毕后才执行构造方法中的代码。
```
---

## 初始化分析
那么，心中秉持着核心概念，我们来简单分析每一步做了什么，就清楚明白了。

```
 1. 运行main方法的时候，JVM会调用`ClassLoader`来加载InitializeDemo类，那么一切源于这次加载。
 2. 四个静态属性，按顺序逐一初始化这四个静态属性。
 3. private static int k = 1; 此时将k初始化为1。
 4. private static InitializeDemo t1 = new InitializeDemo("t1");创建InitializeDemo对象，那么按照核心理念中的顺序，先执行private int j = print("j");，打印出j，然后执行构造块，最后执行构造方法。
 5. private static InitializeDemo t2 = new InitializeDemo("t2");同步骤4。
 6. private static int i = print("i");打印i。
 7. private static int n = 99;直到这一步，n才被赋值为99，之前是从默认的0开始++的。
 8. 静态属性初始化完毕，代码走到静态块，打印出静态块，此时n=99。
 9. 静态属性和静态块执行完毕，然后执行main方法中的代码new InitializeDemo("init");
10. main方法中创建对象，先初始化非静态属性，private int j = print("j");打印j，然后执行构造块，最后执行构造方法。
```
只要把握住核心概念，碰到在复杂的问题也都不会乱了分寸。  

---

## 总结

```
1. 静态只在类加载的时候执行，且执行一次。
2. 非静态只在实例化的时候执行，且每次实例化都执行。
3. 静态在非静态之前执行。
4. 静态属性和静态块的执行顺序取决于编码顺序，对它们一视同仁。
5. 非静态属性和构造块的执行顺取决于编码顺序，对它们也一视同仁。
6. 最后执行构造方法。
```

上面的总结有点绕对吧，问题进一步简化的话，就更好理解了

我们只需要将静态代码块视为一个静态属性，将构造块视为一个非静态属性，那么问题简化到了这种路线：

>静态属性-->非静态属性-->构造方法


