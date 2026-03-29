# Blog — implementation plan

> Status: planning
> Last updated: 2026-03-29

---

## Approach

Keep it static. No CMS, no framework, no JS dependencies.

- Posts are written in **Markdown** (easy to author)
- A small **Python build script** converts Markdown → HTML using the existing site style
- Output is plain `.html` files in a `blog/` folder, deployable to GitHub Pages as-is
- A `blog/index.html` lists all posts chronologically

This matches the existing site architecture and keeps authoring simple — write a `.md` file, run the script, commit.

---

## Structure

```
ritsinha.github.io/
├── blog/
│   ├── index.html              ← generated: post listing
│   ├── YYYY-MM-DD-slug.html    ← generated: individual posts
│   └── posts/
│       └── YYYY-MM-DD-slug.md  ← source: you write these
├── build_blog.py               ← build script
└── (existing files)
```

---

## Post format

Each post is a Markdown file with a YAML front matter header:

```markdown
---
title: My first post
date: 2026-03-29
tags: [statistics, causal inference]
summary: A short summary shown in the post listing.
---

Post body goes here...
```

---

## To-do list

### Phase A — scaffold (Open Graph support included)

- [ ] Create `blog/posts/` directory
- [ ] Write `build_blog.py`
  - [ ] Parse front matter from each `.md` file
  - [ ] Convert Markdown body to HTML (use `markdown` Python library)
  - [ ] Wrap in site template (nav, footer, style.css — matching existing pages)
  - [ ] Inject Open Graph meta tags per post (og:title, og:description, og:url, og:image) for clean LinkedIn/Facebook sharing
  - [ ] Generate individual post pages → `blog/YYYY-MM-DD-slug.html`
  - [ ] Generate `blog/index.html` — chronological post listing with title, date, summary
- [ ] Add `blog` link to nav in all existing HTML pages
- [ ] Test with one sample post

### Phase B — first post

- [ ] Write first post as `.md`
- [ ] Run `build_blog.py` and verify output
- [ ] Commit and push to GitHub Pages
- [ ] Verify live at `ritsinha.github.io/blog/`

### Phase C — workflow refinements (later)

- [ ] Add RSS feed generation to build script
- [ ] Add tag filtering to blog index
- [ ] Add reading time estimate to each post
- [ ] Consider: agent-assisted drafting (dictate idea via Telegram → Claude drafts post → you edit → build)

---

## Open questions

1. **Tags** — do you want tag pages (click a tag, see all posts with that tag)?
2. **Comments** — static sites can embed Giscus (GitHub Discussions-backed). Worth it?
3. **Agent-assisted authoring** — do you want a workflow where you send rough notes via Telegram and Claude drafts the post for review?

---

## Notes

- `build_blog.py` should be idempotent — safe to run repeatedly
- Generated HTML files go in `blog/` (not `blog/posts/`) to keep URLs clean: `ritsinha.github.io/blog/2026-03-29-my-post`
- Source `.md` files are committed too — they serve as the canonical record
