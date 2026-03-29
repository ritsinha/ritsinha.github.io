#!/usr/bin/env python3
"""
Blog build script for ritsinha.github.io.

Usage:
    python3 build_blog.py

Reads:  blog/posts/YYYY-MM-DD-slug.md   (Markdown + YAML front matter)
Writes: blog/YYYY-MM-DD-slug.html       (individual post pages)
        blog/index.html                 (chronological post listing)

Front matter fields:
    title:    (required) Post title
    date:     (required) YYYY-MM-DD
    summary:  One-sentence summary shown in the index listing
    tags:     [tag1, tag2]  (optional)
    image:    relative URL for og:image (optional)
"""

from __future__ import annotations

import re
from datetime import datetime
from pathlib import Path

import markdown
import yaml

SITE_ROOT = Path(__file__).parent
POSTS_DIR = SITE_ROOT / "blog" / "posts"
BLOG_DIR  = SITE_ROOT / "blog"
SITE_URL  = "https://ritsinha.github.io"

NAV = """\
<nav>
  <div class="nav-inner">
    <span class="nav-brand">Ritwik Sinha</span>
    <ul class="nav-links">
      <li><a href="../index.html">Home</a></li>
      <li><a href="../work.html">Research</a></li>
      <li><a href="../publications.html">Publications</a></li>
      <li><a href="../patents.html">Patents</a></li>
      <li><a href="../family.html">Family</a></li>
      <li><a href="index.html" class="active">Blog</a></li>
    </ul>
  </div>
</nav>"""

NAV_INDEX = """\
<nav>
  <div class="nav-inner">
    <span class="nav-brand">Ritwik Sinha</span>
    <ul class="nav-links">
      <li><a href="../index.html">Home</a></li>
      <li><a href="../work.html">Research</a></li>
      <li><a href="../publications.html">Publications</a></li>
      <li><a href="../patents.html">Patents</a></li>
      <li><a href="../family.html">Family</a></li>
      <li><a href="index.html" class="active">Blog</a></li>
    </ul>
  </div>
</nav>"""

FOOTER = """\
<footer>
  &copy; 2026 Ritwik Sinha &nbsp;·&nbsp; Cupertino, CA
</footer>"""


def parse_post(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    # Split YAML front matter
    if text.startswith("---"):
        parts = text.split("---", 2)
        front = yaml.safe_load(parts[1]) or {}
        body = parts[2].strip()
    else:
        front = {}
        body = text.strip()

    slug = path.stem  # YYYY-MM-DD-slug

    # Convert [youtube: VIDEO_ID] shortcodes to responsive iframes
    def youtube_replace(m):
        vid = m.group(1).strip()
        return (
            f'<div class="yt-embed">'
            f'<iframe src="https://www.youtube.com/embed/{vid}" '
            f'title="YouTube video" frameborder="0" allowfullscreen '
            f'allow="accelerometer; autoplay; clipboard-write; encrypted-media; '
            f'gyroscope; picture-in-picture"></iframe></div>'
        )
    body = re.sub(r'\[youtube:\s*([A-Za-z0-9_\-]+)\]', youtube_replace, body)

    html_body = markdown.markdown(
        body,
        extensions=["extra", "smarty", "toc"],
    )

    date_str = str(front.get("date", slug[:10]))
    try:
        date = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        date = datetime.today()

    return {
        "slug": slug,
        "title": front.get("title", "Untitled"),
        "date": date,
        "date_str": date.strftime("%B %-d, %Y"),
        "summary": front.get("summary", ""),
        "tags": front.get("tags", []),
        "image": front.get("image", ""),
        "body_html": html_body,
        "url": f"{SITE_URL}/blog/{slug}.html",
        "out_path": BLOG_DIR / f"{slug}.html",
    }


def render_post(post: dict) -> str:
    og_image = (
        f'  <meta property="og:image" content="{SITE_URL}/{post["image"]}"/>\n'
        if post["image"] else ""
    )
    tags_html = ""
    if post["tags"]:
        tags_html = "".join(
            f'<span class="blog-tag">{t}</span>' for t in post["tags"]
        )
        tags_html = f'<div class="blog-tags">{tags_html}</div>'

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="description" content="{post['summary'] or post['title']}"/>
  <meta name="author" content="Ritwik Sinha"/>
  <meta property="og:title" content="{post['title']} — Ritwik Sinha"/>
  <meta property="og:description" content="{post['summary'] or post['title']}"/>
  <meta property="og:url" content="{post['url']}"/>
  <meta property="og:type" content="article"/>
{og_image}  <title>{post['title']} — Ritwik Sinha</title>
  <link rel="stylesheet" href="../style.css"/>
</head>
<body>

{NAV}

<main>
  <article class="blog-post">
    <header class="blog-post-header">
      <h1 class="blog-post-title">{post['title']}</h1>
      <div class="blog-meta">
        <time datetime="{post['date'].strftime('%Y-%m-%d')}">{post['date_str']}</time>
        {tags_html}
      </div>
    </header>
    <div class="blog-post-content">
      {post['body_html']}
    </div>
    <footer class="blog-post-footer">
      <a href="index.html">&larr; All posts</a>
    </footer>
  </article>
</main>

{FOOTER}

</body>
</html>
"""


def render_index(posts: list[dict]) -> str:
    items = ""
    for post in posts:
        tags_html = ""
        if post["tags"]:
            tags_html = "".join(
                f'<span class="blog-tag">{t}</span>' for t in post["tags"]
            )
            tags_html = f'<div class="blog-tags">{tags_html}</div>'

        summary = f'<p class="blog-summary">{post["summary"]}</p>' if post["summary"] else ""

        items += f"""
    <li class="blog-index-item">
      <a class="blog-index-title" href="{post['slug']}.html">{post['title']}</a>
      <div class="blog-meta">
        <time datetime="{post['date'].strftime('%Y-%m-%d')}">{post['date_str']}</time>
        {tags_html}
      </div>
      {summary}
    </li>"""

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="description" content="Ritwik Sinha's blog — notes on statistics, AI, and research."/>
  <meta name="author" content="Ritwik Sinha"/>
  <meta property="og:title" content="Blog — Ritwik Sinha"/>
  <meta property="og:description" content="Notes on statistics, AI, and research."/>
  <meta property="og:url" content="{SITE_URL}/blog/"/>
  <title>Blog — Ritwik Sinha</title>
  <link rel="stylesheet" href="../style.css"/>
</head>
<body>

{NAV_INDEX}

<main>
  <div class="section">
    <h2>Blog</h2>
    <p style="color:var(--muted); font-size:.93rem; margin-bottom:2rem;">
      Notes on statistics, causal inference, AI, and whatever else I find worth writing down.
    </p>
    <ul class="blog-index-list">{items}
    </ul>
  </div>
</main>

{FOOTER}

</body>
</html>
"""


def main() -> None:
    posts_files = sorted(POSTS_DIR.glob("*.md"), reverse=True)
    if not posts_files:
        print("No posts found in blog/posts/")
        return

    posts = [parse_post(p) for p in posts_files]

    for post in posts:
        post["out_path"].write_text(render_post(post), encoding="utf-8")
        print(f"  built: blog/{post['slug']}.html")

    (BLOG_DIR / "index.html").write_text(render_index(posts), encoding="utf-8")
    print(f"  built: blog/index.html")
    print(f"Done. {len(posts)} post(s).")


if __name__ == "__main__":
    main()
