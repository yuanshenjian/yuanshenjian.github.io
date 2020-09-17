---
layout: post

title: "重构是什么？"
date: 2020-06-01
categories: [eXtreme Programming]
tags: [REFACTORING-QUESTION-100]
column: REFACTORING-QUESTION-100
sub-tag: "Basic Concept"

author: "袁慎建"

brief: "
百问重构系列问答。
"

---

* content
{:toc}

---

最开始认识到重构重要性的是Ward Cuuningham和Kent Beck，他们最早在Smalltalk语言上使用重构。他俩对SmallTalk社区产生了极大的影响，为重构的普及奠定了坚实的基础。

Martin Fowler在跟Kent Beck在同一个项目深度合作后，看到了Kent Beck娴熟的重构手法，以及重构对软件质量的重要性，于是他奋笔疾书，写下来《重构：改善既有代码的设计》这本书，如今第二版已经出版。

后来，重构被纳入为XP（eXtreme Programming，极限编程）中的一项核心实践。

![](https://upload-images.jianshu.io/upload_images/1445879-ce9478b004585bd3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

我们平时所说的重构，大多指代码重构，回到重构的定义，本身有两种理解：

1.  **名词：**对软件内部结构的一种调整，目的是在不改变软件可观察行为的前提下，提高其可理解性，降低其修改成本。

2.  **动词：**在不改变代码外在行为的基础上，调整代码结构，提高其可理解性，降低其修改成本。

了解了重构原始的定义后，你觉得你平时在项目上做的重构是重构吗？
