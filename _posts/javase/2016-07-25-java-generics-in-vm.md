---
layout: post

title: "JAVA泛型•虚拟机执行泛型代码"
date: 2016-07-25
category: [JAVASE]
tag: [Java,Generic]

---

* content
{:toc}

---

## 虚拟机中类型擦除w
Java虚拟机是不存在泛型类型对象的，所有的对象都属于普通类，甚至在泛型实现的早起版本中，可以将使用泛型的程序编译为在1.0虚拟机上能够运行的class文件，这个向后兼容性后期被抛弃了，所以后来如果用Sun公司的编译器编译的泛型代码，是不能运行在Java5.0之前的虚拟机的，这样就导致了一些实际生产的问题，如一些遗留代码如何跟新的系统进行衔接，要弄明白这个问题，需要先了解一下虚拟机是怎么执行泛型代码的。

>虚拟机的一种机制：擦除类型参数，并将其替换成特定类型，没有指定特定类型用Object代替，如前文中的Couple<T>类，虚拟机擦除后：   

```java
[code01]

public class Couple {
	private Object wife ;
	private Object husband ;

	public Couple(Object  wife, Object  husband) {
		this.wife = wife;
		this.husband = husband;
	}
	public void setWife(Object  wife) {this. wife = wife;}
	public void setHusband(Object  husband) {this. husband = husband;}
          
	public Object  getWife() {return wife;}
	public Object  getHusband() {return husband;}
}
```

类型参数`T`是一个任意类型的，所以擦除后用`Object`代替了。不管是`Couple<Employee>`或者`Couple<String>`擦除后都成为了原始类`Couple`类，这就好比回到了泛型引入Java之前的普通类。所以这里重点围绕着擦除类型参数这个机制展开讲解。

如有对类型参数有类型限定会怎么替换呢？擦除类型参数机制告诉我们，使用限定的类型代替，如果有多个，使用第一个代替，看一段代码：

```java
[code02]

public class Period<T extends Comparable<T> & Serializable> {
	private T begin;
	private T end;

	public Period(T one, T two) {
		if (one.compareTo(two) > 0) {
			begin = two;end = one;
		} else {
			begin = one;end = two;
		}
	}
}
```
     
`code02`擦除后，`Period`的原始类型如下：

```java
[code03]

public class Period {
	private Comparable begin;
	private Comparable end;

	public Period(Comparable one, Comparable two) {
		if (one.compareTo(two) > 0) {
			begin = two; end = one;
		} else {
			begin = one; end = two;
		}
	}
}
```
>思考一下，如果将`Period<T extends Comparable<T> & Serializable>`写成`Period<T extends Serializable  & Comparable<T>>`会是怎么样呢?

---

### 标签接口

同理，擦除后原始类型用第一个`Serializable`代替，这样进行`compareTo`方法调用的时候，编译器会进行必要的强制类型转换，所以为了提高效率，将标签接口(没有任何方法的接口，也叫tagging接口)放在后面。

先来看看虚拟机执行表达式的时候发生了什么，如：

```java
[code04]

Couple<Employee> couple = ...;
Employee wife = couple.getWife();
```
擦除后，`getWife()`返回的是`Object`类型，然后虚拟机会插入强制类型转换，将`Object`转换为`Employee`，所以虚拟机实际上执行了两天指令：

1. 调用`Couple.getWife()`方法。
2. 将`Object`转换成`Employee`类型。

再来看看虚拟机执行泛型方法的时候发生了什么，泛型方法如：

```java
[code05]

public static <T extends Comparable<T>> max(T[] arrays) {... }

擦除后成了:

public static Comoparable max(Comparable[] arrays) {... }
```  
但是泛型方法的擦除会带来两个复杂的问题，且看第一个实例，一个实例：

```java
[code06]

public class Period <T extends Comparable<T> & Serializable> {
	private T begin;
	private T end;

	public Period(T one, T two) {
		if (one.compareTo(two) > 0) {
			begin = two;end = one;
		} else {
			begin = one;end = two;
		}
	}
	public void setBegin(T begin) {this. begin = begin;}
	public void setEnd(T end) {this. end = end;}
	public T getBegin() {return begin;}
	public T getEnd() {return end;}
}
public class DateInterval extends Period<Date> {

	public DateInterval(Date one, Date two) {
		super(one, two);
	}
	public void setBegin(Date begin) {
		super.setBegin(begin);
	}
}
```
`DateInterval`类型擦除后，`Period`中的方法变成：
>public void setBegin(Object begin) {...}

而`DateInterval`中的方法还是：
>public void setBegin(Date begin) {...}

所以`DateInterval`从`Period`中继承了`public void setBegin(Object begin) {...}`而自身又存在`public void setBegin(Date begin) {...}`方法，用户使用时问题发生了。

---

### 桥方法

```java
[code07]

Period<Date> period  = new DateInterval(...);
period.setBegin(new Date());
```
这里因为`period`引用指向了`DateInterval`实例，根据多态性，`setBegin`应该调用`DateInterval`对象的`setBegin`方法，可是这个擦除让`Period`中的 `public void setBegin(Object begin) {...}`被调用，导致了擦除与多态发生了冲突，怎么办呢？虚拟机此时会在`DateInterval`类中生成一个桥方法(bridge method)，调用过程发生了细微的变化：

```java
[code08]

public void setBegin(Object begin) {
	setBegin((Date)begin);
}
```
有了这个合成的桥方法以后，`code07`中对`setBegin`的调用步骤如下：

```
1. 调用DateInterval.setBegin(Object)方法。
2. DateInterval.setBegin(Object)方法调用DateInterval.setBegin(Date)方法。
```

发现了吗，当我们在`DateInterval`中增加了`getBegin`方法之后会是什么样子的呢？是不是`Peroid`中有一个`Object getBegin()`的方法，而`DateInterval`中有一个`Date getBegin()`方法呢，这两个方法在Java中是不能同时存在的？可是Java5以后增加了一个协变类型，使得这里是被允许的，看看`DateInterval`中`getBegin`方法就知道了：


```java
[code09]

@Override
public Date getBegin(){ return super.getBegin(); }
```

这里用了`@Override`，说明是覆盖了父类的`Object getBegin()`方法，而返回值可以指定为父类中的返回值类型的子类，这就是协变类型，这是Java5以后才可以允许的，允许子类覆盖了方法后指定一个更严格的类型(子类型)。

---

## 总结

```
1. 记住一点，虚拟机中没有泛型，只有普通的类。
2. 所有泛型的类型参数都用它们限定的类型代替，没有限定则用Object。
3. 为了保持类型安全性，虚拟机在有必要时插入强制类型转换。
4. 桥方法的合成用来保持多态性。
5. 协变类型允许子类覆盖方法后返回一个更严格的类型。
```
