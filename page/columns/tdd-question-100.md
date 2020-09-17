---
layout: post
title: "百问TDD"
permalink: /column/tdd-question-100
author: "袁慎建"
date: 2020-01-01
column: TDD-QUESTION-100
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

### Task-Driven Development
{% for post in site.posts reversed %}
{% if post.column == page.column %}
{% if post.sub-tag == "Task-Driven Development" %}
<a target="_blank" href="{{ post.url }}">{{ post.title }}</a>
{% endif %}
{% endif %}
{% endfor %}

---

### Test-Driven Development
{% for post in site.posts reversed %}
{% if post.column == page.column %}
{% if post.sub-tag == "Test-Driven Development" %}
<a target="_blank" href="{{ post.url }}">{{ post.title }}</a>
{% endif %}
{% endif %}
{% endfor %}

---

### Test-Driven Design
{% for post in site.posts reversed %}
{% if post.column == page.column %}
{% if post.sub-tag == "Test-Driven Design" %}
<a target="_blank" href="{{ post.url }}">{{ post.title }}</a>
{% endif %}
{% endif %}
{% endfor %}

### 综合实践
{% for post in site.posts reversed %}
{% if post.column == page.column %}
{% if post.sub-tag == "Practice" %}
<a target="_blank" href="{{ post.url }}">{{ post.title }}</a>
{% endif %}
{% endif %}
{% endfor %}


