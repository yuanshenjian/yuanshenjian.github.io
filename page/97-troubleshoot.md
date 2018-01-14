---
bg: "troubleshoot.jpg"
layout: page
title: Troubleshoot
permalink: /troubleshoots/
summary: "疑难 杂症"

# active: troubleshoots
---

{% for category in site.data.troubleshoot.toc %}

<h3>{{ category.letter }}</h3>
  <ul class="categories">
    {% for item in category.collection %}
        <li>
        <a href="{{ '/troubleshoots' }}{{ item.permalink }}">{{ item.title }}</a>
        </li>
    {% endfor %}
  </ul>
{% endfor %}
