---
bg: "insight.jpg"
layout: page
title: "TECH TOPIC"
permalink: /topics/
summary: "技术主题实践"

active: topic

---

{% for topic in site.data.topic.toc %}
  {% assign existed = false %}
  {% for page in site.pages %}{% if page.topic == topic.name %}{% assign existed = true %}{% break %}{% endif %}{% endfor %}
  {% if existed %}
  <h3>{{ topic.name }}</h3>
  <ul class="categories">
    {% for page in site.pages %}
      {% if page.topic == topic.name %}
        <li>
        <a href="{{ page.permalink }}">{{ page.title }}</a>
        </li>
      {% endif %}
    {% endfor %}
  </ul>
  {% endif %}
{% endfor %}
