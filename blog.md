---
layout: page
title: Blog
permalink: /blog/
---
<section class="page-section">
  <h1 class="page-title">Blog</h1>
  {% for post in site.posts %}
  <article class="post-card">
    <div class="post-meta">
      <time>{{ post.date | date: "%B %d, %Y" }}</time>
    </div>
    <h3 class="post-title">
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    </h3>
    <p class="post-excerpt">{{ post.excerpt | strip_html | truncatewords: 25 }}</p>
    <a href="{{ post.url | relative_url }}" class="read-more">Read more →</a>
  </article>
  {% endfor %}
  {% if site.posts.size == 0 %}
  <p class="no-posts">Posts coming soon — stay tuned.</p>
  {% endif %}
</section>
