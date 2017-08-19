---
layout: post
title: MySQL Code Snippet
permalink: /code/mysql

date: 2017-07-19
tags: [Code, MySQL]

---

* content
{:toc}

---

## 将一张表的数据查询出来插入到另一张表

```sql
insert into customer(id, name)
select id, name from person;
```

---

## 从外部CSV文件更新MySQL表

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
