---
layout: default
title: Home
---

<div class="hero-section">
  <div class="hero-content">
    <div class="hero-tag">✦ Portfolio</div>
    <h1 class="hero-title">
      Hi, I'm <span class="name-highlight">Farzana</span>
    </h1>
    <p class="hero-subtitle">Researcher · Developer · Creator</p>
    <p class="hero-bio">
      I build thoughtful digital experiences, explore ideas through research,
      and write about the things I learn along the way.
    </p>
    <div class="hero-cta">
     <a href="{{ '/projects/' | relative_url }}" class="btn btn-primary">View Projects</a>
     <a href="{{ '/blog/' | relative_url }}" class="btn btn-secondary">Read Blog</a>
    </div>
  </div>
  <div class="hero-visual">
    <div class="avatar-ring">
      <div class="avatar-inner">FA</div>
    </div>
    <div class="orbit orbit-1"><span class="orbit-dot"></span></div>
    <div class="orbit orbit-2"><span class="orbit-dot"></span></div>
  </div>
</div>

<section class="section-divider">
  <span class="divider-text">what i do</span>
</section>

<section class="cards-section">
  <div class="card">
    <div class="card-icon">⚡</div>
    <h3>Development</h3>
    <p>Building clean, functional web experiences with modern tools and thoughtful architecture.</p>
  </div>
  <div class="card">
    <div class="card-icon">🔬</div>
    <h3>Research</h3>
    <p>Diving deep into topics that matter — synthesizing complex ideas into clear insights.</p>
  </div>
  <div class="card">
    <div class="card-icon">✍️</div>
    <h3>Writing</h3>
    <p>Sharing knowledge through articles, tutorials, and reflections on what I've learned.</p>
  </div>
</section>

<section class="section-divider">
  <span class="divider-text">recent posts</span>
</section>

<section class="posts-section">
  {% for post in site.posts limit:3 %}
  <article class="post-card">
    <div class="post-meta">
      <time>{{ post.date | date: "%B %d, %Y" }}</time>
    </div>
    <h3 class="post-title">
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    </h3>
    <p class="post-excerpt">{{ post.excerpt | strip_html | truncatewords: 20 }}</p>
    <a href="{{ post.url | relative_url }}" class="read-more">Read more →</a>
  </article>
  {% endfor %}

  {% if site.posts.size == 0 %}
  <p class="no-posts">Posts coming soon — stay tuned.</p>
  {% endif %}
</section>

<section class="connect-section">
  <h2>Let's Connect</h2>
  <p>I'm always open to interesting conversations, collaborations, and new ideas.</p>
  <div class="social-links">
    <a href="https://github.com/farzanaesha" target="_blank" class="social-link">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
      </svg>
      GitHub
    </a>
    <a href="mailto:hello@farzana.dev" class="social-link">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
      Email
    </a>
  </div>
</section>

<style>
  /* ─── Reset & Base ─── */
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Georgia', 'Times New Roman', serif;
    background: #0a0a0f;
    color: #e8e4d9;
    line-height: 1.7;
  }

  /* ─── Hero ─── */
  .hero-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 3rem;
    padding: 6rem 2rem 4rem;
    max-width: 900px;
    margin: 0 auto;
  }

  .hero-content { flex: 1; }

  .hero-tag {
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    color: #c9a96e;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
  }

  .hero-title {
    font-size: clamp(2.8rem, 6vw, 4.5rem);
    font-weight: 400;
    line-height: 1.1;
    margin-bottom: 0.5rem;
    color: #f0ebe0;
  }

  .name-highlight {
    color: #c9a96e;
    font-style: italic;
  }

  .hero-subtitle {
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
    letter-spacing: 0.15em;
    color: #888;
    margin-bottom: 1.5rem;
    text-transform: uppercase;
  }

  .hero-bio {
    font-size: 1.05rem;
    color: #b0a898;
    max-width: 440px;
    margin-bottom: 2.5rem;
  }

  .hero-cta { display: flex; gap: 1rem; flex-wrap: wrap; }

  .btn {
    display: inline-block;
    padding: 0.75rem 1.75rem;
    border-radius: 2px;
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    transition: all 0.25s ease;
  }

  .btn-primary {
    background: #c9a96e;
    color: #0a0a0f;
    font-weight: bold;
  }
  .btn-primary:hover { background: #dbbf8a; transform: translateY(-2px); }

  .btn-secondary {
    border: 1px solid #444;
    color: #e8e4d9;
  }
  .btn-secondary:hover { border-color: #c9a96e; color: #c9a96e; }

  /* ─── Hero Visual ─── */
  .hero-visual {
    position: relative;
    width: 200px;
    height: 200px;
    flex-shrink: 0;
  }

  .avatar-ring {
    position: absolute;
    inset: 20px;
    border-radius: 50%;
    border: 2px solid #c9a96e;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .avatar-inner {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1a1a2e, #2d2d4e);
    border: 2px solid #333;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    font-weight: bold;
    color: #c9a96e;
    letter-spacing: 0.05em;
  }

  .orbit {
    position: absolute;
    border-radius: 50%;
    border: 1px dashed #333;
    animation: spin linear infinite;
  }
  .orbit-1 { inset: 8px; animation-duration: 12s; }
  .orbit-2 { inset: -8px; animation-duration: 20s; animation-direction: reverse; }

  .orbit-dot {
    position: absolute;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #c9a96e;
    top: 50%; left: -3px;
    transform: translateY(-50%);
  }

  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  /* ─── Divider ─── */
  .section-divider {
    text-align: center;
    padding: 2.5rem 0;
    position: relative;
    max-width: 900px;
    margin: 0 auto;
  }
  .section-divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0; right: 0;
    height: 1px;
    background: #222;
  }
  .divider-text {
    position: relative;
    background: #0a0a0f;
    padding: 0 1.5rem;
    font-family: 'Courier New', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #555;
  }

  /* ─── Cards ─── */
  .cards-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    max-width: 900px;
    margin: 0 auto;
    padding: 0 2rem 2rem;
  }

  .card {
    background: #111118;
    border: 1px solid #222;
    padding: 2rem;
    border-radius: 4px;
    transition: border-color 0.25s, transform 0.25s;
  }
  .card:hover { border-color: #c9a96e; transform: translateY(-4px); }
  .card-icon { font-size: 1.8rem; margin-bottom: 1rem; }
  .card h3 { color: #f0ebe0; margin-bottom: 0.75rem; font-size: 1.1rem; font-weight: 600; }
  .card p { color: #888; font-size: 0.9rem; line-height: 1.6; }

  /* ─── Posts ─── */
  .posts-section {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 2rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .post-card {
    border-left: 2px solid #c9a96e;
    padding-left: 1.5rem;
  }

  .post-meta time {
    font-family: 'Courier New', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #555;
  }

  .post-title { margin: 0.4rem 0 0.6rem; font-size: 1.2rem; font-weight: 400; }
  .post-title a { color: #f0ebe0; text-decoration: none; }
  .post-title a:hover { color: #c9a96e; }
  .post-excerpt { color: #888; font-size: 0.9rem; margin-bottom: 0.75rem; }
  .read-more { font-family: 'Courier New', monospace; font-size: 0.8rem; color: #c9a96e; text-decoration: none; }
  .no-posts { color: #555; font-style: italic; }

  /* ─── Connect ─── */
  .connect-section {
    text-align: center;
    max-width: 900px;
    margin: 2rem auto 5rem;
    padding: 3rem 2rem;
    border: 1px solid #222;
    border-radius: 4px;
    background: #111118;
  }

  .connect-section h2 { font-size: 1.8rem; font-weight: 400; color: #f0ebe0; margin-bottom: 0.75rem; }
  .connect-section p { color: #888; margin-bottom: 2rem; }

  .social-links { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

  .social-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.4rem;
    border: 1px solid #333;
    border-radius: 2px;
    color: #e8e4d9;
    text-decoration: none;
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    transition: all 0.2s;
  }
  .social-link:hover { border-color: #c9a96e; color: #c9a96e; }

  /* ─── Responsive ─── */
  @media (max-width: 640px) {
    .hero-section { flex-direction: column; padding: 4rem 1.5rem 2rem; text-align: center; }
    .hero-bio { max-width: 100%; }
    .hero-cta { justify-content: center; }
    .hero-visual { display: none; }
    .cards-section, .posts-section { padding: 0 1.5rem 2rem; }
    .connect-section { margin: 2rem 1.5rem 4rem; }
  }
</style>
