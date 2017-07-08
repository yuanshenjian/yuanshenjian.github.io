---
layout: post

title: "Java加载器"
date: 2013-05-25
category: [JAVASE]
tag: [Java,ClassLoader]

author: "袁慎建"
brief: "
简单写写Java反射和ClassLoader，之前玩过反射，觉得有点意思。
"

---

* content
{:toc}


---

## JAVA中的反射

简单写写Java反射和ClassLoader，之前玩过反射，觉得有点意思。

比如在Jdbc中我们通常首先会根据一个字符串加载特定数据库驱动类的字节码，如下:

```java
Class.forName("com.mysql.jdbc.Driver");
Class.forName("oracle.jdbc.OracleDriver");
Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
```

这里其实是用到了类加载器`ClassLoader`：

```java
// ClassLoader loader = ReflectTest.class.getClassLoader();
ClassLoader loader = Thread.currentThread().getContextClassLoader();
```

然后可以进行一些操作了：

```java
//获取声明的构造方法(任何权限修饰符的)，此处为默认的无参构造，如要生成有参的，只需传入相应参数的类型Class对象
Constructor cons = clazz.getDeclaredConstructor();
//创建对象
Car car = (Car) cons.newInstance();
//根据传入方法的参数的类型，获取setBrand方法
Method setBrand = clazz.getMethod("setBrand", String.class);
//回调方法
setBrand.invoke(car, "红旗CA72");
//同理
Method setMaxSpeed = clazz.getMethod("setMaxSpeed", int.class);
setMaxSpeed.invoke(car, 200);
```

问题来了，如果我们获取一个类的方法或属性是非`public`的，我们访问一个非`public`的方法或属性时如果不加设置会抛出异常： `java.lang.IllegalAccessException`，我们只需要加一行代码：`setAccessible(true)`，通常不这样做，有特殊要求时可以这么解决;

```java
// 获取private属性
Field colorFld = clazz.getDeclaredField("color");
// 设置可访问
colorFld.setAccessible(true);
colorFld.set(pcar, "红色");

// 获得private声明的方法
Method driveMtd = clazz.getDeclaredMethod("drive");
// 设置可访问
driveMtd.setAccessible(true);
driveMtd.invoke(pcar, (Object[]) null);
```

---

## ClassLoader

Java反射机制在诸多的框架中应用很广泛，我们在开发中常用的也不多，如需要自己编写一些框架，底层是逃离不了对Java反射的运用的，在JDK中reflect包中提供了这些类和接口，详细的可以在API中找到。

---

### ClassLoader工作机制

>`ClassLoader`是一个重要的Java运行时环境组件，负责在运行时查找和载入Class字节码文件。类加载工作是有`ClassLoader`及其子类负责的。

JVM在运行时会产生三个ClassLoader，准确的说是两个，因为根装载器不是ClassLoader的子类，它使用C++编写的，所以在Java中不能看到，看一个小程序：

```java
public class ClassLoaderTest {
	public static void main(String[] args) {
		// 获取当前线程上下文的类加载器
		ClassLoader loader = Thread.currentThread().getContextClassLoader();
		// ClassLoader loader = ClassLoaderTest.class.getClassLoader();
		System.out.println("Current loader:"+loader);//当前类加载器
		System.out.println("Parent loader:"+loader.getParent());//父加载器
		System.out.println("Grandparent loader:"+loader.getParent().getParent());
	}
}
```

输出结果是：

```java
Current loader:sun.misc.Launcher$AppClassLoader@6b97fd
Parent loader:sun.misc.Launcher$ExtClassLoader@1c78e57
Grandparent loader:null
```

1. `ClassLoader`：根装载器，负责装载JRE的核心类库，如JRE目标下的charsets.jar和rt.jar等，在Java中访问不到，无法获得它的句柄，返回`null`。
2. `ExtClassLoader`：是`ClassLoader`的子类，负责装载JRE扩展目录ext中的jar类包。
3. `AppClassLoader`：是`ExtClassLoader`的子类，负责装载classpath路径下的类包。

---

### 全盘负责委托机制
`全盘负责`：当一个ClassLoader装载一个类时，除非显式地指定使用另一个ClassLoader，该类锁依赖及引用的类也由这个ClassLoader载入。

`委托机制`：先委托父装载器寻找目标，只有在找不到的情况下在从自己的类路径中查找并装载目标类，这样就避免了一个安全隐患，

譬如我一不小心自己写了一个String(开始阶段这样写过)，委托机制或委托父装载器去装载String类，这样就不会装载我写的这个String类了。

---

## ClassLoader常用的方法

### loadClass
`Class loadClass(String name)`，`name`参数指定类装载器需要装载类的名字，必须使用全限定类名，如`com.baobaotao.beans.Car`。

>该方法有一个重载方法loadClass(Stringname ,boolean resolve)，resolve参数告诉类装载器是否需要解析该类。在初始化类之前，应考虑进行类解析的工作，
但并不是所有的类都需要解析，如果JVM只需要知道该类是否存在或找出该类的超类，那么就不需要进行解析。

---

### findSystemClass

`Class findSystemClass(String name)`，从本地文件系统载入Class文件，如果本地文件系统不存在该Class文件，将抛出`ClassNotFoundException`异常。该方法是JVM默认使用的装载机制。

---

### findLoadedClass
`Class findLoadedClass(String name)`，调用该方法来查看`ClassLoader `是否已装入某个类。如果已装入，那么返回`java.lang.Class`对象，否则返回`null`。如果强行装载已存在的类，将会抛出链接错误。

---

### getParent
`ClassLoader getParent()`，获取类装载器的父装载器，除根装载器外，所有的类装载器都有且仅有一个父装载器，`ExtClassLoader`的父装载器是根装载器，因为根装载器非Java编写，所以无法获得，将返回`null`。

---

## CLassLoader与对象的关系
以下用一个图描述类装载器与对象的关系：

![]({{ site.url }}{{ site.img_path }}{{ '/javase/classloader-in-java-1.png' }})

>Object.getClass()   Class ---实例对象获得类字节码
>Class.getClassLoader()    ClassLoader  ----类字节码对象获得类装载器
>ClassLoader.loaderClass(string className)  Class  ----类装载器转载特定的类




