---
layout: post
title: JSON 锦囊
permalink: /troubleshoots/json

date: 2017-06-15
tags: [Java, JSON]

---

* content
{:toc}

---

## JSON类库读取文件进行反序列化的时候遇到`\uFEFF`非法字符

##### 更新时间：2017-06-15

#### 问题描述
JSON相关类库读取json文件进行反序列化字符串的时候，如果因为文件问题，读进来的字符串可能存在非法字符`\uFEFF`，它会导致反序列化无法进行。这是隐蔽字符BOM导致的。

---

#### 解决方案  
1. 在代码中将bom字符替换掉，使用String.replace("\uFEFF","")。
2. 将文件格式转换成UTF-8无BOM格式。很多编辑器都支持，而IDEA中，可以重新创建文件，将内容置于新创建的文件中。