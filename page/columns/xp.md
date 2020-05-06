---
layout: post
title: "极限编程"
permalink: /column/xp
author: "袁慎建"
date: 2020-01-01
---

* content
{:toc}

{% for category in site.data.xp.catetories %}
### {{category.name}}
  {% for article in category.articles %}
- <a target="_blank" href="{{ article.link }}">{{ article.title }}</a>
  {% endfor %}
{% endfor %}
