
---
layout: post
title: MySQL 锦囊
permalink: /troubleshoots/mysql

date: 2016-06-20

---

* content
{:toc}

---

## MySQL修改表的一些常用操作

##### 更新时间：2017-09-06

```sql
// 1. 添加外键
ALTER TABLE `t_user`
  ADD CONSTRAINT FK_User_projectId FOREIGN KEY (`project_id`) REFERENCES `t_project` (id);

// 2. 添加/删除列
ALTER TABLE `t_user` ADD COLUMN `nick_name` VARCHAR(25) DEFAULT NULL AFTER `name`;
ALTER TABLE `t_user` DROP COLUMN `nick_name`;

// 3. 修改列
ALTER TABLE `t_user` MODIFY `nick_name` VARCHAR(30);
ALTER TABLE `t_user` CHANGE COLUMN `nick_name` `nick_name_new` VARCHAR(25) DEFAULT NULL;
  
```


---

## 如何从CSV文件来更新MySQL表数据

##### 更新时间：2017-07-19

#### 问题描述
现在有一个外部的csv文件，文件内容如下：

|customer_id | ucid |
|:---|:---|
|90fijd0af9d | 194370128943|
|90fijd0a90k | 194370128942|

MySQL数据库中有一个`customer`表，

|customer_id | ucid | ... |
|:---|:---|:---|
|90fijd0af9d | |...|
|90fijd0a90k | |...|

我需要将csv文件中的ucid更新到`customer`表中的`ucid`

#### 解决方案
思路分如下三步:

```
1. 创建一个临时表temp_update_table，用来导入csv中的字段。
2. 内联temp_update_table和customer表来执行更新。
3. 删除临时表
```

代码实现

```sh
#!/usr/bin/env bash

USERNAME=root
PASSWORD=pass
HOST=127.0.0.1
PORT=3306
DATABASE=customer

IMPORT_CSV_FILE=/var/lib/mysql-files/customer-ucid-data.csv

mysql -u${USERNAME} -p${PASSWORD} -P${PORT} ${DATABASE} -e "

create temporary table temp_update_table (customer_id varchar(200), ucid varchar(200));

load data infile '${IMPORT_CSV_FILE}'
into table temp_update_table
fields terminated by ','
enclosed by '\"'
lines terminated by '\n'
(customer_id, ucid);

update customer
inner join temp_update_table
on temp_update_table.customer_id = customer.id
set customer.ucid = temp_update_table.ucid
where customer.ucid is null;

drop temporary table temp_update_table;
"
```

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


