---
bg: "rails.jpg"
layout: page
title: Insight
permalink: /insight/
summary: "IT人生"

active: insight

---


{% for article in site.data.insight.articles %}

---

##  {{article.category}}
{% for entry in article.entries %}
[{{ entry.title }}]({{ entry.url }})
{% endfor %}

{% endfor %}
