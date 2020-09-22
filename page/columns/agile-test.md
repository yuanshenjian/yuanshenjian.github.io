---
layout: post
title: "敏捷测试"
permalink: /column/agile-test
author: "袁慎建"
date: 2020-01-01
column: AGILE-TEST
---

* content
{:toc}


{% for post in site.posts %}
{% if post.column == page.column %}
<a target="_blank" href="{{ post.url }}">{{ post.title }}</a>
{% endif %}
{% endfor %}
