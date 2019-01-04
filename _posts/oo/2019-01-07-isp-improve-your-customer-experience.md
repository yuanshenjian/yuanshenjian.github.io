---
layout: post

title: "接口隔离原则造福使用者"
date: 2019-01-07
categories: [OOD]
tag: [OO]

author: "袁慎建"
published: false

brief: "
从事软件开发的朋友或多或少都听过以下一些原则：比如KiSS、DRY、LKP、COC、DbC、SoC、HP、SOLID等。这些原则已经在业界被证实了自身的价值，尤其当谈到面向对象设计的时候，SOLID则是一个避不开的主题。
</br></br>

对于大部分OO程序员，这五大原则的名字可能已经耳熟能详，却总不能很清晰的描述出SOLID是如何为我们服务，因为SOLID从来也没有告诉我们How，它只在说：'这就是你最终要达到的目的地'。
</br></br>

本文我将带着我的思考来聊一聊ISP，用好它，有助于提升你的程序客户端的使用体验。

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

本文我将带着我的思考来聊一聊ISP，用好它，有助于提升你的程序客户端的使用体验。

---

*待续*

## 参考阅读
- [写了这么多年代码，你真的了解SOLID吗？](https://insights.thoughtworks.cn/do-you-really-know-solid/)
