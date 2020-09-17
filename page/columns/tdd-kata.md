---
layout: post
title: "TDD KATA"
permalink: /column/tdd-katas
author: "袁慎建"
date: 2020-01-01
column: TDD-KATA
---

* content
{:toc}


{% for post in site.posts reversed %}
{% if post.column == page.column %}
<a target="_blank" href="{{ post.url }}">{{ post.title }}</a>
{% endif %}
{% endfor %}
