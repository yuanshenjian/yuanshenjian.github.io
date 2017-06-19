---
bg: "rails.jpg"
layout: page
title: Troubleshoots
permalink: /troubleshoots/
summary: "疑难杂症"

active: troubleshoots
---

{% for category in site.data.troubleshoot.toc %}
---

## {{ category.letter }}{% for item in category.collection %}
[{{ item.title }}]({{ item.permalink }})
{% endfor %}{% endfor %}
