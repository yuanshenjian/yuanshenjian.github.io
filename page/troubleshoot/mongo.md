---
layout: post
title: Mongo 锦囊
permalink: /troubleshoots/mongo

date: 2016-06-20

---

* content
{:toc}

---

## 如何从CSV文件来更新Mongo的Collection数据

##### 更新时间：2017-07-24

#### 问题描述
现在有一个外部的csv文件，文件内容如下：

|customer_id | ucid |
|:---|:---|
|90fijd0af9d | 194370128943|
|90fijd0a90k | 194370128942|

Mongo数据库中有一个`person`collection，

|customer_id | ucid | ... |
|:---|:---|:---|
|90fijd0af9d | |...|
|90fijd0a90k | |...|

我需要将csv文件中的ucid更新到`customer`表中的`ucid`

#### 解决方案

思路分如下三步

```
1. 创建一个临时collection temp_update_person_collection，用来导入csv中的字段。
2. 遍历更新临时collection的记录，针对每一条做更新。
3. 删除临时collection。
```

代码实现

```sh
#!/usr/bin/env bash

USERNAME=
PASSWORD=
HOST=127.0.0.1
PORT=27017
DATABASE=lead-management

IMPORT_CUSTOMER_CSV_FILE=/var/lib/mongo-files/customer-ucid-data.csv

mongoimport --host ${HOST}:${PORT} -d ${DATABASE} -c temp_update_person_collection --type csv --file ${IMPORT_CUSTOMER_CSV_FILE} --headerline

mongo ${HOST}:${PORT}/${DATABASE} --eval '

db.temp_update_person_collection.find().forEach(function(item){
	db.person.update({ _id: ObjectId(item.customer_id) }, { $set: {ucid: item.ucid} }, false, true);
})

db.temp_update_person_collection.drop();
'
```

