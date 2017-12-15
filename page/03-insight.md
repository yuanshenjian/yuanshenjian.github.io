---
bg: "insight.jpg"
layout: page
title: "INSIGHT"
permalink: /insight/
summary: "IT视野"

active: insight

---


{% for article in site.data.insight.articles %}

<h3>{{article.category}}</h3>
  <ul class="categories">
    {% for entry in article.entries %}
        <li>
        <a href="{{ entry.url }}">{{ entry.title }}</a>
        </li>
    {% endfor %}
  </ul>
{% endfor %}

---

