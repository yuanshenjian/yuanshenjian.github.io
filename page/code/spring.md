---
layout: post
title: Spring Code Snippet
permalink: /codes/spring

date: 2017-04-24
tags: [Code, Spring data, Mongo]

---

* content
{:toc}

---

## Spring data mongodb 条件查询

##### 更新时间：2017-04-12

```java
public interface BookRepository extends MongoRepository<Book, String>, BookRepositoryCustom {
    // 分页查询owner的account为传入参数值的图书
    @Query("{owner.account: ?0}")
    Page<Book> findAll(String ownerAccount, Pageable pageable) throws Exception;

    // 分页查询图书类型在传入的类型列表中的图书
    @Query("{type: {$in: ?0}}")
    Page<Book> findAll(List<Book.Type> types, Pageable pageable) throws Exception;

    // 分页查询owner的account为传入的第一个参数，版本号出现在传入第二个参数中的图书
    @Query("{owner.account: ?0, versions: {$elemMatch: {$in: ?1}}}")
    Page<Book> findAll(String ownerAccount, List<String> version, Pageable pageable) throws Exception;
}
```

