---
layout: post
title: Intellij 锦囊
permalink: /troubleshoots/intellij

date: 2017-01-26
---

* content
{:toc}

---

## 如何显示编辑器行号

##### 更新时间：2017-01-26

#### 问题描述
在开发过程中，Intellij的编辑窗口的行号默认不显示，这样不利于debug。

---

#### 解决方案
以IDEA为例，找到IDEA的最上面工具栏的左方Intellij IDEA，导航：`Preferences...` --> `Editor` -->`General`-->`Appearance` (快捷键: `[Command] + ,`)

将 `Show line numbers` 选项勾上：

![]({{ site.url }}{{ site.img_path }}{{ '/troubleshoot/intellij-show-line-number.png' }})


---

## 如何正确使用lombok插件

##### 更新时间：2017-06-15

#### 问题描述
[lombok](https://github.com/rzwitserloot/lombok) 是一个代码自动生成工具，在Intellij中使用lombok插件会面临无法提示SSlf4j的`log`以及`Setter`和`Getter`。

---

#### 解决方案
解决这个问题有两个步骤：

1.安装插件

`Preferences...` --> `Plugins` -->`Broswe repositories`--> 搜索lombok

![]({{ site.url }}{{ site.img_path }}{{ '/troubleshoot/install-lombok.png' }})

2.启动Annotation processors
`Preferences...` --> `Compiler` -->`Annotation Processors`--> 勾上`Enable annotation processing`

![]({{ site.url }}{{ site.img_path }}{{ '/troubleshoot/enable-annotation-processing.png' }})









