---
layout: post

title: "Java 8 函数式编程"
date: 2017-08-14
category: [JAVASE]
tag: [Java, Java8, lambda]
published: false

---

* content
{:toc}

---

## Java8新特性列表

## Stream API
* Stream API的惰性求值实现机制

```java
allArtists.stream().filter(artist -> {
	System.out.println(artist.getName());
	return artist.isFrom("London");
});


long count = allArtists.stream().filter(artist -> {
	System.out.println(artist.getName());
	return artist.isFrom("London"); b

}).count();
```


---

## interface的变化。

### interface默认方法
`类中重的默认方法胜出接口中的默认方法`，默认方法设计初衷是为了在接口上向后兼容，让类中重写的方法优先级高于默认方法能简化很多问题。

接口多重继承结构中，如果两个接口同时含有相同签名的默认方法，子类就必须重写(实现)该默认方法，使用`SuperInterface.super.method()`的方式显示指定被调用的接口默认方法。

---

### interface 能够包含静态方法。
---


