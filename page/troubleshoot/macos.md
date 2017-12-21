---
layout: post
title: Mac OSX 锦囊
permalink: /troubleshoots/mac-osx

date: 2017-09-07

---

* content
{:toc}

---
## 如何禁止系统自动生成`.DS_store`文件

##### 更新时间：2017-12-21

#### 问题描述
经常在提交代码的时候会发现系统自动生成了一个`.DS_store`文件，容易造成误提交。

#### 解决方案
`.DS_Store`是Mac OS保存文件夹的自定义属性的隐藏文件，如文件的图标位置或背景色，相当于Windows的`desktop.ini`。

禁止自动生成：

```sh
$ defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool TRUE
```

恢复自动生成：

```sh
$ defaults delete com.apple.desktopservices DSDontWriteNetworkStores
```

---

## 如何解决Java Web程序（Springboot）在某些Mac中运行集成测试非常慢

##### 更新时间：2017-09-07

#### 问题描述
[ThoughtWorks]()的程序员都是使用Mac book Pro来做开发的，最近有些小伙伴运行Springboot微服务的API测试能够长达40分钟，而同样的测试在某些小伙伴的机器上运行了15分钟左右，时间相差很大，非常影响开发效率。

在网上查找了该问题的原因，果真有同仁遇到相似问题：*Mac OSX的某些版本造成的*，哥们还精心做了测试，发现`java.net.InetAddress.getLocalHost()`方法执行时间的差别是`5000ms` VS `8ms`。

#### 解决方案

DNS解析，在`/ect/hosts`文件中添加如下内容：

```
127.0.0.1   localhost mbpro.local
::1         localhost mbpro.local
```

