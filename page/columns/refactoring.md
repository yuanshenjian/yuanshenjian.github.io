---
layout: post
title: "百问重构"
permalink: /column/refactoring
author: "袁慎建"
date: 2020-01-01
---

* content
{:toc}

{% for category in site.data.refactoring.catetories %}
### {{category.name}}
  {% for question in category.questions %}
- <a target="_blank" href="{{ question.link }}">{{ question.title }}</a>
  {% endfor %}
{% endfor %}
