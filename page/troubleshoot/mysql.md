---
layout: post
title: MySQL 锦囊
permalink: /troubleshoots/mysql

date: 2016-06-20

---

* content
{:toc}

---

## 如何修改root的密码

##### 更新时间：2017-06-20

#### 问题描述
做本地开发环境的时候，发现root被设置了密码，密码为`dev`，要将密码重置或清空。

---

#### 解决方案

使用mysql的`SET PASSWORD`命令：

```sh
$ mysql -u root -pdev
$ SET PASSWORD FOR root@localhost=PASSWORD('')
```

使用`mysqladmin`命令，但不安全：

```sh
$ mysqladmin -u root -pdev password ''
```


