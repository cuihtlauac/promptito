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

## Conventions

- No HTML output (yet) — machine-readable formats only
- BASE_URL in build.mjs is a placeholder, update when hosting is decided
- Post UUIDs should be stable once published
