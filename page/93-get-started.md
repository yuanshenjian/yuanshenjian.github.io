---
bg: "troubleshoot.jpg"
layout: page
title: Get Started
permalink: /get-started/
summary: "快速上手"

---


{% for category in site.data.get-started.toc %}

<h3>{{ category.letter }}</h3>
  <ul class="categories">
    {% for item in category.collection %}
        <li>
        <a href="{{ item.permalink }}">{{ item.title }}</a>
        </li>
    {% endfor %}
  </ul>
{% endfor %}
