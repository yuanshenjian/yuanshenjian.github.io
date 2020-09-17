---
layout: post

title: "什么时候重构？"
date: 2020-06-06
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

Martin Folwer在他的《重构》一书中提到，以下几种情况下你需要重构：

- 【增】增加新功能（增加新功能的时候，发现需要重构来便于新功能的添加）
- 【删】事不过三（消除重复）
- 【改】修复缺陷（修复Bug的时候）
- 【查】代码评审（大家通过交流提出了很多修改的主意）

在我看来，你什么时候都可以重构，当然也不能随心所欲。相比于重构本身，我觉得养成一个重构的意识更加重要。当你在写代码，遇到代码坏味道，忍不住停下来消除掉坏味道，恭喜你，你已经上道了。

当然这需要你对各种代码坏味道有足够的了解，并且对如何消除这些坏味道了如指掌，更重要的是，你应该时刻清楚为什么要做这个重构？想清楚这个问题之后，再动手吧。

什么时候重构，推荐给你一篇文章：[重构的七宗罪](https://insights.thoughtworks.cn/refactoring/)
