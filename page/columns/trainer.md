---
layout: post
title: "培训师"
permalink: /column/trainer
author: "袁慎建"
date: 2020-01-01
---

* content
{:toc}

{% for category in site.data.trainer.catetories %}
### {{category.name}}
  {% for article in category.articles %}
- <a target="_blank" href="{{ article.link }}">{{ article.title }}</a>
  {% endfor %}
{% endfor %}
