---
bg: "insight.jpg"
layout: page
title: "TECH TOPIC"
permalink: /topics/
summary: "专题实践"

# active: topic

---

{% for topic in site.data.topic.toc %}
  {% assign existed = false %}
  {% for post in site.posts %}{% if post.topic == topic.name %}{% assign existed = true %}{% break %}{% endif %}{% endfor %}
  {% if existed %}
  <h3>{{ topic.name }}</h3>
  <ul class="categories">
    {% for post in site.posts %}
      {% if post.topic == topic.name %}
        <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
        </li>
      {% endif %}
    {% endfor %}
  </ul>
  {% endif %}
{% endfor %}
