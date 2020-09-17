---
layout: post
title: "百问重构"
permalink: /column/refactoring-question-100
author: "袁慎建"
date: 2020-06-01
column: REFACTORING-QUESTION-100
---

* content
{:toc}

### 基础概念
{% for post in site.posts reversed %}
{% if post.column == page.column %}
{% if post.sub-tag == "Basic Concept" %}
<a target="_blank" href="{{ post.url }}">{{ post.title }}</a>
{% endif %}
{% endif %}
{% endfor %}

---

### 设计
{% for post in site.posts reversed %}
{% if post.column == page.column %}
{% if post.sub-tag == "Code Design" %}
<a target="_blank" href="{{ post.url }}">{{ post.title }}</a>
{% endif %}
{% endif %}
{% endfor %}

---

### 坏味道
{% for post in site.posts reversed %}
{% if post.column == page.column %}
{% if post.sub-tag == "Code Smell" %}
<a target="_blank" href="{{ post.url }}">{{ post.title }}</a>
{% endif %}
{% endif %}
{% endfor %}

---

### 综合实践
{% for post in site.posts reversed %}
{% if post.column == page.column %}
{% if post.sub-tag == "Practice" %}
<a target="_blank" href="{{ post.url }}">{{ post.title }}</a>
{% endif %}
{% endif %}
{% endfor %}
