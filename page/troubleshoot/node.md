---
layout: post
title: Node 锦囊
permalink: /troubleshoots/node

date: 2017-04-07

---

* content
{:toc}

---

## 如何以安静模式执行nmp install命令

##### 更新时间：2017-04-07

#### 问题描述
`$ npm install`执行后，会下载依赖，控制台不断地输出日志，而你并不想看到这些重复的日志，那么这些信息就是一个累赘。

---

#### 解决方案

```sh
$ npm install --silent
```
