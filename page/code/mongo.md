---
layout: post
title: Mongo db Code Snippet
permalink: /code/mongo

date: 2017-07-24
tags: [Code, Database, Mongo]

---

* content
{:toc}

---

## 从外部CSV文件更新Mongo DB的Collection

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
