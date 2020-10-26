---
layout: post

title: "TDD Kata - 镶金玫瑰（GildedRose）"
date: 2020-03-19
categories: [eXtreme Programming]
tags: [TDD-KATA]
column: TDD-KATA

author: "袁慎建"

brief: "
TDD KATA，Gilded Rose 镶金玫瑰，TDD的入门练习。
"

---

* content
{:toc}

---

## 需求背景
“镶金玫瑰”！这是一家魔兽世界里的小商店。出售的商品也都是高质量的。但不妙的是，随着商品逐渐接近保质期，它们的质量也不断下滑。现邀请你开发一个IT系统，从而能够在每过去一天后，对商店中商品的信息做出对应的更新。

首先，简单介绍一下我们的商品特性：
1. 所有商品都有一个SellIn值，这是商品距离过期的天数，最好在这么多天之内卖掉
2. 所有商品都有一个Quality值，代表商品的价值
3. 商品的SellIn值和Quality值，它们每天会发生变化，但是会有特例

商品的价格规则说明如下：
1. 商品每过一天价值会下滑1点 ，一旦过了保质期，价值就以双倍的速度下滑
2. 商品的价值永远不会小于0，也永远不会超过50
3. 陈年干酪（Aged Brie）是一种特殊的商品，放得越久，价值反而越高
4. 萨弗拉斯（Sulfuras）是一种传奇商品，没有保质期的概念，质量也不会下滑
    - 后台门票（Backstage pass）和陈年干酪（Aged Brie）有相似之处：
    - 越接近演出日，商品价值Quality值反而上升
    - 在演出前10天，价值每天上升2点
    - 演出前5天，价值每天上升3点
    - 一旦过了演出日，价值就马上变成0


## 视频演示
- [第0集 - 需求澄清](https://www.bilibili.com/video/BV1dz411q7J5/)
- [第1集 - Tasking 1](https://www.bilibili.com/video/BV1SA41147vX/)
- [第2集 - Tasking 2](https://www.bilibili.com/video/BV1La4y1i7Te/)
- [第3集 - TDD 1](https://www.bilibili.com/video/BV1oi4y1x7yy/)
- [第4集 - TDD 2](https://www.bilibili.com/video/BV1st4y117XE/)
- [第5集 - TDD 3](https://www.bilibili.com/video/BV1CA411476m/)
- [第6集 - TDD 4](https://www.bilibili.com/video/BV1ze411p7ED/)
- [第7集 - 重构到模式](https://www.bilibili.com/video/BV1xt4y117pF/)

