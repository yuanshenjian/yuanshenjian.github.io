---
layout: post
title: "敏捷教练"
permalink: /column/agile-coach
author: "袁慎建"
date: 2020-08-02

column: AGILE-COACHING

---

* content
{:toc}


### 敏捷工程实践
{% for post in site.posts reversed %}
{% if post.column == page.column %}
{% if post.sub-tag == "Agile engineering practice" %}
<a target="_blank" href="{{ post.url }}">{{ post.title }}</a>
{% endif %}
{% endif %}
{% endfor %}


---

### 敏捷赋能
{% for post in site.posts %}
{% if post.column == page.column %}
{% if post.sub-tag == "Agile enablement" %}
<a target="_blank" href="{{ post.url }}">{{ post.title }}</a>
{% endif %}
{% endif %}
{% endfor %}


---

### 规模化极限编程
{% for post in site.posts reversed %}
{% if post.column == page.column %}
{% if post.sub-tag == "Stand-up" %}
<a target="_blank" href="{{ post.url }}">{{ post.title }}</a>
{% endif %}
{% endif %}
{% endfor %}


