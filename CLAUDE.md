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

## Conventions

- No HTML output (yet) — machine-readable formats only
- BASE_URL in build.mjs is a placeholder, update when hosting is decided
- Post UUIDs should be stable once published
