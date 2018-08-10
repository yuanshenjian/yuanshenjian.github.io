---
layout: post

title: "Java泛型•认识泛型"
date: 2016-06-28
category: [JAVASE]
tag: [Java]

author: "袁慎建"
brief: "
Java从1.0版本到现在的8，中间Java5中发生了一个很重要的变化，那就是泛型机制的引入。Java5引入了泛型，主要还是为了满足在1999年指定的最早Java规范之一。经过了5年左右的时间，专家组定义了一套泛型规范，实现后通过测试投入到使用。所以说泛型是Java5以后才有的，欲知详情，继续往下看。</br></br>

换个角度想，Java5引入泛型，必定是它能带来好处，否则牛气的Java工程师就要遭到吐槽了。我们来吐槽一下没有泛型的程序是怎么写的。
"

---

* content
{:toc}

---

## 什么是泛型
>Java从1.0版本到现在的8，中间Java5中发生了一个很重要的变化，那就是泛型机制的引入。Java5引入了泛型，主要还是为了满足在1999年指定的最早Java规范之一。经过了5年左右的时间，专家组定义了一套泛型规范，实现后通过测试投入到使用。所以说泛型是Java5以后才有的，欲知详情，继续往下看。

---

## 为什么用泛型

>换个角度想，Java5引入泛型，必定是它能带来好处，否则牛气的Java工程师就要遭到吐槽了。我们来吐槽一下没有泛型的程序是怎么写的。

---

### 没有泛型的代码

```java
[code01]

ArrayList al = new ArrayList();
al.add("ysjian001");
al.add(1);
al.add(new Object());   
```

这段代码看似功能强大，为什么呢？因为它似乎能够往集合添加各种类型的对象(`int`类型会被装箱成`Integer`对象类型)，貌似一些老程序员也倾向于这么去做，而且他们可以理直气壮的告诉我理由：我这么做想存什么就存什么！先不否定这种说法，让我们继续，看看下面代码：

```java
[code02]

// 获取值的时候必须进行强制转换，然后调用对应对象的方法
String first = (String) al.get(0);
```

往集合里面存值就是为了后期取出来用的，而不是`System.out.println(first)`,这里就产生了一个强制转换的问题，而往往这种类型的强制转换在编译器是允许通过的，而写程序的人们会犯下无意间的错误，错误的进行了强制转换，导致程序运行失败。

强制类型转换导致的程序运行失败的原因是没有在编译器对类型进行控制，看看`code01`调用`ArrayList`对象的`add`方法，任何类型都是可以添加进行的，编译器无法进行错误检验，埋下了安全隐患，例如：

```java
[code03]

ArrayList al = new ArrayList();
// 无法进行错误检查，File对象可以添加进去，编译器和运行期都可以通过
al.add(new File()); 
String first = (String) al.get(0);  // 类型转换失败导致运行失败
```
---

### 不用泛型的缺点
没有泛型的程序面临两个问题：  

```
1. 编译器无法进行类型检查，可以向集合中添加任意类型的对象。
2. 取值时类型转换失败导致程序运行失败。
```

没有泛型的程序导致的后果：

```
1. 程序的可读性有所降低，因为程序员可以不受限制往集合中添加任意对象。
2. 程序的安全性遭到质疑，类型转换失败将导致程序运行失败。
```

Java5泛型提供了一个更好的解决方案：类型参数(type parameters)，使用泛型的程序改善上述代码如下：

```java
[code04]

ArrayList<String> al = new ArrayList<String>();
al.add( "ysjian001");
// al.add(new Thread()); // 定义了String类型参数，添加File对象会报错
String first =  al.get(0);// 使用泛型后取值不用进行类型转换       
```

>问：到这里，通过前后对比，泛型的好处是不是很清楚了呢？为什么用泛型呢？  
>答：因为出现编译错误比类在运行时出现强制类型转换异常要好得多，泛型的好处在于提高了程序的可读性和安全性，这也是程序设计的宗旨之一。

---

## 什么时候使用泛型
>使用泛型类是一件很轻松的事，集合框架中的类都是泛型类，用起来很方便。有人会想类型限制我们为什么不直接用数组呢？这个问题就好像问为什么集合优于数组，数组是固定的，而集合是可以自动扩展的。另外在实际中，实现一个泛型其实并不是那么容易。看一个员工和经理继承结构：

```java
[code05]

public class Employee {
      //......
}
public class Manager extends Employee {
      // ......
}
``` 
         
当我们创建并使用一个员工的集合的时候，使用起来并不复杂：

```java
[code06]

ArrayList<Employee> employees = new ArrayList<Employee>();
employees.add(new Employee());       // 可以添加员工
employees.add( new Manager());         // 可以添加经理，因为经理也是员工
```          
          
上述的使用毫无问题的，因为`Manager is a Employee`，典型的继承关系，但是当反过来的时候，可能不那么顺利了，比如：

```java
[code07]

ArrayList<Manager> employees = new ArrayList<Manager>();
employees.add(new Manager());          // 添加经理是正常的操作
// employees.add(new Employee());     // 此时不可以添加Employee
```          
          
上面的代码就有问题了，而这种需求又不是不存在，那么怎么办呢？不要着急，聪明的Java设计者发明了一个独具创新的新概念，通配符类型(wildcard type)，这里只需要知道这个概念，后面会详细讲解。

---

### 学习泛型的目的
大多数应用程序员对泛型的熟练程度仅仅停留在使用泛型上，像集合类中的`List`、`Set`和`Map`这些泛型集合用的很多，他们不必考虑这些泛型集合的工作方式和原理。那么当把不同的泛型类混合在一起使用时，或者对Java5之前的遗留代码进行衔接时，可能会看到含糊不清的的错误消息。这样一来，程序员就需要学习Java泛型来解决问题了，而不是在程序中胡乱猜测了。最终，部分程序员可能想要实现自己的泛型类和泛型方法。

提炼出泛型程序设计的三种熟练程度就是：
 
```
1. 仅仅使用泛型。
2. 学习泛型解决一些问题。
3. 掌握泛型，实现自己的泛型。
```

---

## 怎么使用泛型

>如何使用泛型听起来是一件很容易的事情，因为Sun公司的那些工程师已经做了很大努力，而需求总是会稍微苛刻一点的，需要解决因为缺乏类型参数模糊不清的问题，或者我们有必要实现自己的泛型来满足业务需求，所以学习和掌握泛型是很有必要的。

---

### 泛型类
从简单的入手，定义一个泛型类

```java
[code08]

public class Couple<T> {
	private T wife ;
	private T husband ;

	public Couple(T wife, T husband) {
		this.wife = wife;
		this.husband = husband;
	}
	public void setWife(T wife) {this. wife = wife;}
	
	public void setHusband(T husband) {this. husband = husband;}
          
	public T getWife() {return wife;}
	
	public T getHusband() {return husband;}
}
```     
`Couple`夫妇类引入一个类型参数T，注意了，类型参数是用尖括号`< >`括起来的，并且放在类名后面，`code08`中的`Couple`类有一个类型参数，可以定义多个类型参数，格式为`<T, K, V>`， 类型参数可以用来定义方法的返回类型、参数类型、以及定义域或局部变量，如下面代码

```java
[code09]

public class Couple<T, K, V> {......} // 多个类型参数用逗号隔开
private T wife ;  // 类型参数定义域
public T getWife() {return wife;}// 类型参数定义方法返回的类型
```          
          
在Java类库中，类型变量通常用大写的字母表示，E表示集合的元素类型，`K`和`V`分别表示映射表的关键字和值的类型，T(U或S)表示任意类型。

一个简单的泛型类`Couple`定义好了，怎么使用呢？别着急，我们使用这个`Couple`类时指定一个具体的参数类型，如`Person`类：`Couple<Person>`

```java
[code10]

Couple<Person>(Person,Person);
setWife(Person);
setHusband(Person);
Person getWife();
Person getHusband();
```          

`code10`中的代码是使用`Person`类型作为参数类型后，`Couple`类型的变化，注意这里不是真正的变化成这样了，而是我们使用的时候这么理解，至于为什么呢？在后面会详细讲解擦除。

---

### 泛型方法
>定义了泛型类有什么好处呢？通过前面的例子，这个泛型类可以让使用该类的用户在使用的时候指定才具体的类型，提高了一定的灵活性。那么看看泛型方法的定义是怎么回事？

```java
[code11]

public class GenericMethod {
	public static <T> T getFirstValue(T[] values) {
			return values[0];
	}
}
```	     
     
从已经学习的泛型类加上`code11`中的泛型方法的定义中总结一条，就是所有泛型都必须先以`<T>`(多个类型参数用逗号隔开，如`<K, V>`)的形式进行定义，这是必要的前提，回过头来看看上述泛型方法的定义，给方法定义了一个类型参数`T`,指定方法的返回值为`T`，方法的参数为`T`类型的数组。

对方法的调用就比较直观了

```java
[code12]

String[] values = { "JavaSE","CoreJava" ,"EffectiveJava"};
String firstValue = GenericMethod.<String>getFirstValue(values);
```
          
咋看调用还是有点复杂，为什么要在方法调用前用`<String>`呢？其实这不是必要的，当我们将`String[]`类型的`values`传给方法时，编译器足以判断`T`的具体类型为`String`类型，所以`<String>`可以省略掉。

```java
[code13]

String firstValue = GenericMethod.getFirstValue(values);
```

---

## 总结
>这一节里，对泛型有了一个整体的认识，知道它是什么？为什么要用它？谁会用它？以及如何使用它？通过了泛型类和泛型方法的实践，感受了如何实现自己的泛型，后面一节，将对泛型中通配符进行讲解，以及虚拟机对泛型类和泛型方法的擦除。

