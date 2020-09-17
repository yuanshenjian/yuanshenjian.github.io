---
layout: post
title: "百问敏捷"
permalink: /column/agile-question-100
author: "袁慎建"
date: 2020-08-02

column: AGILE-QUESTION-100

---

* content
{:toc}

### 基础概念
{% for post in site.posts reversed %}
{% if post.column == page.column %}
{% if post.sub-tag == "Basic concept" %}
<a target="_blank" href="{{ post.url }}">{{ post.title }}</a>
{% endif %}
{% endif %}
{% endfor %}

---

### Stand-up
{% for post in site.posts reversed %}
{% if post.column == page.column %}
{% if post.sub-tag == "Stand-up" %}
<a target="_blank" href="{{ post.url }}">{{ post.title }}</a>
{% endif %}
{% endif %}
{% endfor %}


