---
bg: "insight.jpg"
layout: page
title: "TECH TOPIC"
permalink: /topic-practice/
summary: "技术主题实践"

active: topic

---


{% for category in site.data.topic.toc %}

<h3>{{ category.topic }}</h3>
  <ul class="categories">
    {% for item in category.collection %}
        <li>
        <a href="{{ '/topics/micro-service' }}{{ item.permalink }}">{{ item.title }}</a>
        </li>
    {% endfor %}
  </ul>
{% endfor %}
