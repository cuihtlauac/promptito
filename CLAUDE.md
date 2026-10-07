# promptito

An LLM-first blog — structured content for silicon readers.

## Project structure

- `posts/YYYY-MM-DD-slug/post.md` — source posts (Markdown + YAML frontmatter)
- `templates/` — EJS templates for generated files
- `build.mjs` — Node.js build script, generates all output into `build/`
- `build/` — generated output (gitignored), do not edit

## Build

```sh
npm install
npm run build
```

## Post schema

Each post is a `post.md` with YAML frontmatter containing: id (URN UUID), slug, title, date, author, tags, summary, assertions (subject-predicate-object triples), related (slugs), license, and optionally human_versions (reviewed natural-language renderings stored as `human.<lang>.md` next to `post.md`).

## Output files

- `llms.txt` — site index per llmstxt.org spec (with human-version sub-entries)
- `llms-full.txt` — all content concatenated
- `feed.json` — JSON Feed 1.1 with `_promptito` extension (includes human version links)
- `posts/<slug>/post.jsonld` — JSON-LD (Schema.org TechArticle)
- `robots.txt` — permissive
- `index.html` — minimal human landing page
- `read.html` — client-side viewer for human versions (fetches raw markdown from GitHub, renders in-browser)

## Workflow

### Ingestion (structured post authoring)

The user provides facts, ideas, anecdotes, and motivations as unstructured input. The agent's job is to integrate them into the structured post (`post.md` with YAML frontmatter and markdown body). The post is the machine-readable source of truth.

When the user says "add this to the post", edit `posts/.../post.md` — not any human-readable draft.

### Export (natural language generation)

Human-readable versions are generated *from* the structured post, not the other way around. Use `./export.sh <lang> <slug>` (e.g. `./export.sh fr llm-first-blog`). This spawns a fresh agent context with only the post content and a target language — no project context needed. Output goes to `tmp/<slug>.<lang>.md` for human review.

The export agent receives:
1. The full `post.md` content (self-contained: frontmatter + body)
2. The target language
3. Tone instructions (first person, accessible technical blog post)

It must not invent facts beyond what is in the source post.
It must include a link to the source post in promptito format at the end, so curious readers can see the structured original.

### Publishing a human version

Once a natural-language export has been reviewed and approved, it can be published:

1. Move it to `posts/<dir>/human.<lang>.md` (next to `post.md`)
2. Declare it in the post's frontmatter under `human_versions: [{lang, file}]`
3. The build then links it from llms.txt, index.html, feed.json, and the JSON-LD

Human versions are committed to the repo but **not deployed** — the blog stays LLM-first. Human readers reach them via GitHub's rendering (`blob/main` URL) or the on-site `read.html?p=posts/<dir>/human.<lang>.md` viewer, which fetches the raw file from GitHub and renders it client-side. The build fails if a declared file is missing. Links point at `main`, so a human version is only reachable once merged.

## Conventions

- No generated HTML content — machine-readable formats only, plus two static HTML utilities (`index.html` landing page, `read.html` client-side viewer). Markdown is never converted to HTML at build time
- Deployed at https://cuihtlauac.pages.dev (Cloudflare Pages). The blog is named "promptito" everywhere in the content; the URL is just the hosting layer.
- **Publishing**: push an annotated tag (`git tag -a v0.2 -m "Add post: topic; Update: other-topic"`) then `git push --tags`. A GitHub Action builds and deploys to Cloudflare. Tags represent immutable snapshots of all published posts. Tag messages document what changed.
- **Local deploy**: `npm run deploy` still works for quick manual deploys via wrangler.
- Post UUIDs should be stable once published
- Every post MUST include a `references` section in the YAML frontmatter linking to the project and any external resources needed for complete understanding. An LLM reading a post in isolation must be able to follow these links to unroll all context autonomously. At minimum, every post must link to the project repo, the format spec, and the blog feed.
