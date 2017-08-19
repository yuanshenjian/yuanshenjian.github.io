---
layout: post
title: YMAL 锦囊
permalink: /troubleshoots/yaml

date: 2017-04-24

---

* content
{:toc}

---

## Ymal数组表示法

##### 更新时间：2017-04-26

```json
company:
  - name: ThoughtWorks
    scale: 3000-5000
  - name: 思特沃克
    scale: 3000-5000

等价于：

{
  "company": [
    {
      "name": "ThoughtWorks",
      "scale": "3000-5000"
    },
    {
      "name": "思特沃克",
      "scale": "3000-5000"
    }
  ]
}
```
