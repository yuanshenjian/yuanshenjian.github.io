---
bg: "insight.jpg"
layout: page
title: "INSIGHT"
permalink: /insight/
summary: "IT视野"

active: insight

---


{% for article in site.data.insight.articles %}

###  {{article.category}}
{% for entry in article.entries %}
[{{ entry.title }}]({{ entry.url }})
{% endfor %}

---

{% endfor %}
