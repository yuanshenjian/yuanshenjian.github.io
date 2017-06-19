---
layout: post
title: Jenkins 锦囊
permalink: /troubleshoots/jenkins
date: 2016-12-12

---

* content
{:toc}

---

## 忘记Jenkins密码的时候如何重置Jenkins配置

##### 更新时间：2016-12-12

#### 问题描述

`Jenkins用户密码忘记了，但又不能注册用户时，无法Login`

---

#### 解决方案
进入Jenkin服务器，更改Jenins配置文件 `/var/lib/jenkins/config.xml`，将`useSecurity`选项置为 `false`

```sh
# <useSecurity>true</useSecurity> 修改为 <useSecurity>false</useSecurity>
$ sudo vim /var/lib/jenkins/config.xml
```
