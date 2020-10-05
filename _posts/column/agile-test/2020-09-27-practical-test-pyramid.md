---
layout: post

title: "测试金字塔实战"
date: 2020-09-27
categories: [Agile]
tags: [AGILE, AGILE-TEST]
column: AGILE-TEST
sub-tag: "common"

author: "袁慎建"

brief: "
“测试金字塔”是一个比喻，它告诉我们要把软件测试按照不同粒度来分组。它也告诉我们每个组应该有多少测试。虽然测试金字塔的概念已经存在了一段时间，但一些团队仍然很难正确将它投入实践。本文重新审视“测试金字塔”最初的概念，并展示如何将其付诸实践。本文将告诉你应该在金字塔的不同层次上寻找何种类型的测试，如何实现这些测试。
"

---

* content
{:toc}


“测试金字塔”是一个比喻，它告诉我们要把软件测试按照不同粒度来分组。它也告诉我们每个组应该有多少测试。虽然测试金字塔的概念已经存在了一段时间，但一些团队仍然很难正确将它投入实践。本文重新审视“测试金字塔”最初的概念，并展示如何将其付诸实践。本文将告诉你应该在金字塔的不同层次上寻找何种类型的测试，如何实现这些测试。


Ham 是德国 ThoughtWorks 的一名软件开发和咨询师。由于厌倦了在凌晨 3 点手动部署软件，他开始持续交付实践，加紧自动化步伐，并着手帮助团队高效可靠地交付高质量软件。这样他就可以把省出来的时间用在别的有趣的事情上了。

目录

- 测试自动化的重要性
- 测试金字塔
- 我们用到的工具和库
- 应用例子
	- 功能
	- 整体架构
	- 内部架构
- 单元测试
	- 什么是单元？
	- 社交和独处
	- 模拟和打桩
	- 测试什么？
	- 测试架构
	- 实现一个单元测试
- 集成测试
	- 数据库集成
	- REST API 集成
	- 几个独立服务的集成
	- JSON 的解析和撰写
- 契约测试
	- 消费者测试(我们团队)
	- 提供者测试(其他团队)
	- 提供者测试(我们团队)
- UI 测试
- 端到端测试
	- 用户界面端到端测试
	- REST API 端到端测试
- 验收测试 - 你的功能工作正常吗?
- 探索测试
- 测试术语误解
- 把测试放到部署流水线
- 避免测试重复
- 整洁测试代码
- 结论

文章详细内容请阅读ThoughtWorks洞见网站的中文译文：*[测试金字塔实战](https://insights.thoughtworks.cn/practical-test-pyramid/)*



#### 声明
本文摘自[ThoughtWorks洞见](https://insights.thoughtworks.cn/)网站，原文出自Ham Vocke之手。

- 原文链接： [The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
- 中文译文： [测试金字塔实战](https://insights.thoughtworks.cn/practical-test-pyramid/)
- 原文作者： [Ham Vocke](https://www.hamvocke.com/)
- 发表时间： 2018年2月26日
