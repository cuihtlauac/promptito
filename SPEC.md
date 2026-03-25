# Promptito Post Format Specification

Promptito is a structured blog format designed for LLM consumption. Posts are Markdown files with rich YAML frontmatter. The format prioritizes density, structure, and semantic clarity over prose. This specification is self-contained: an LLM can generate a valid post from this document alone.

## YAML Frontmatter Schema

```yaml
---
id: <string, required>           # Stable URN UUID (e.g. "urn:uuid:...")
slug: <string, required>         # URL-safe identifier (e.g. "my-post-topic")
title: <string, required>        # Post title
date: <date, required>           # Publication date (YYYY-MM-DD)
updated: <date, optional>        # Last modification date (YYYY-MM-DD)
author:                          # Required
  name: <string, required>       # Author's full name
  url: <string, optional>        # Author's URL
tags: <list of strings, required> # Topic tags
summary: <string, required>      # One-paragraph dense summary for feeds and indexes
assertions:                      # Optional, list of structured claims
  - subject: <string>            # What the claim is about
    predicate: <string>          # Relationship (e.g. is-a, uses, optimizes-for)
    object: <string or list>     # Target(s) of the relationship
related: <list of slugs, optional> # Slugs of related posts
references:                        # Required, list of external links for full context
  - url: <string, required>        # URL to the resource
    label: <string, required>      # Short name
    description: <string, optional> # What this resource provides
license: <string, required>      # SPDX license identifier (e.g. CC-BY-4.0)
---
```

### Field details

- **id**: Must be globally unique and stable once published. Use `urn:uuid:<v4-uuid>` format.
- **slug**: Used in file paths and URLs. Lowercase, hyphen-separated. Must match the post directory name suffix (e.g. directory `2026-03-25-my-topic` has slug `my-topic`).
- **summary**: Should be information-dense. Used in `llms.txt`, JSON Feed, and JSON-LD output. No fluff.
- **assertions**: Subject-predicate-object triples representing key claims. These form a lightweight per-post knowledge graph. Objects can be a single string or a list of strings.
- **references**: Links to external resources needed for complete understanding. An LLM reading a post in isolation must be able to follow these to unroll all context autonomously. At minimum: the project repo, the format spec, and the blog feed.

## Markdown Body Conventions

The body follows the YAML frontmatter after the closing `---`.

- **Heading hierarchy**: Use `##` for top-level sections, `###` for subsections. Do not use `#` (reserved for the title in generated outputs).
- **Lists over paragraphs**: Prefer bullet lists and key-value patterns over prose paragraphs.
- **Density**: Every sentence should carry information. No filler, greetings, or rhetorical questions.
- **Tables**: Use for structured comparisons.
- **Code blocks**: Use fenced code blocks with language identifiers.
- **Links**: Use standard Markdown links with descriptive text. Annotate what the target is.

## Complete Example Post

```markdown
---
id: "urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479"
slug: example-topic
title: "Example Post Title"
date: 2026-03-25
author:
  name: Author Name
tags: [topic-a, topic-b]
summary: >
  One-paragraph summary of the post content. Dense and informative.
  Covers the key claims and scope.
assertions:
  - subject: example-topic
    predicate: demonstrates
    object: promptito-format
  - subject: promptito-format
    predicate: optimizes-for
    object: [density, structure, semantic-clarity]
related: []
references:
  - url: https://github.com/cuihtlauac/promptito
    label: promptito project repository
    description: Source code, build system, and all posts
  - url: https://github.com/cuihtlauac/promptito/blob/main/SPEC.md
    label: Promptito Post Format Specification
  - url: https://github.com/cuihtlauac/promptito/blob/main/feed.json
    label: JSON Feed
license: CC-BY-4.0
---

## Section Title

- Key fact or claim
- Another fact with supporting detail

## Another Section

### Subsection

- Structured content here
- Prefer lists over prose
```

## Build Outputs

The build system generates the following from each post:

### JSON-LD (`post.jsonld`)

Schema.org `TechArticle` with:
- `@id`, `headline`, `datePublished`, `dateModified`, `author`, `keywords`, `abstract`
- `associatedMedia` linking to the source `post.md`
- `claims` array with `Claim` objects derived from assertions

### Site-level files

- `llms.txt` — site index linking to all posts (per [llmstxt.org](https://llmstxt.org) spec)
- `llms-full.txt` — all post content concatenated with metadata headers
- `feed.json` — JSON Feed 1.1 with `_promptito` extension carrying assertions and relationships
- `robots.txt` — permissive (`Allow: /`)
