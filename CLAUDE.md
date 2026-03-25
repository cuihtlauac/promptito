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

Each post is a `post.md` with YAML frontmatter containing: id (URN UUID), slug, title, date, author, tags, summary, assertions (subject-predicate-object triples), related (slugs), license.

## Output files

- `llms.txt` — site index per llmstxt.org spec
- `llms-full.txt` — all content concatenated
- `feed.json` — JSON Feed 1.1 with `_promptito` extension
- `posts/<slug>/post.jsonld` — JSON-LD (Schema.org TechArticle)
- `robots.txt` — permissive

## Workflow

### Ingestion (structured post authoring)

The user provides facts, ideas, anecdotes, and motivations as unstructured input. The agent's job is to integrate them into the structured post (`post.md` with YAML frontmatter and markdown body). The post is the machine-readable source of truth.

When the user says "add this to the post", edit `posts/.../post.md` — not any human-readable draft.

### Export (natural language generation)

Human-readable versions are generated *from* the structured post, not the other way around. Use `node export.mjs <lang> <slug>` (e.g. `node export.mjs fr llm-first-blog`). This spawns a fresh agent context with only the post content and a target language — no project context needed. Output goes to `tmp/<slug>.<lang>.md` for human review.

The export agent receives:
1. The full `post.md` content (self-contained: frontmatter + body)
2. The target language
3. Tone instructions (first person, accessible technical blog post)

It must not invent facts beyond what is in the source post.
It must include a link to the source post in promptito format at the end, so curious readers can see the structured original.

## Conventions

- No HTML output (yet) — machine-readable formats only
- Deployed at https://cuihtlauac.pages.dev (Cloudflare Pages). The blog is named "promptito" everywhere in the content; the URL is just the hosting layer.
- **Publishing**: push an annotated tag (`git tag -a v0.2 -m "Add post: topic; Update: other-topic"`) then `git push --tags`. A GitHub Action builds and deploys to Cloudflare. Tags represent immutable snapshots of all published posts. Tag messages document what changed.
- **Local deploy**: `npm run deploy` still works for quick manual deploys via wrangler.
- Post UUIDs should be stable once published
- Every post MUST include a `references` section in the YAML frontmatter linking to the project and any external resources needed for complete understanding. An LLM reading a post in isolation must be able to follow these links to unroll all context autonomously. At minimum, every post must link to the project repo, the format spec, and the blog feed.
