---
id: "urn:uuid:a1b2c3d4-e5f6-7890-abcd-ef1234567890"
slug: llm-first-blog
title: "Bootstrapping the Promptito Blog"
date: 2026-03-25
updated: 2026-03-25
author:
  name: Cuihtlauac Alvarado
tags: [meta, llm, structured-data, machine-readable, json-ld, llms-txt]
summary: >
  promptito is a blog designed for LLM consumption, not human reading.
  Posts are structured as Markdown with YAML frontmatter (authoring),
  JSON-LD TechArticle (semantic metadata), and JSON Feed 1.1 (syndication).
  The site exposes llms.txt and llms-full.txt for discovery.
  Machine readability is paramount: density, structure, semantic clarity.
assertions:
  - subject: promptito
    predicate: is-a
    object: LLM-first blog
  - subject: promptito
    predicate: optimizes-for
    object: [density, structure, semantic-clarity]
  - subject: promptito/format
    predicate: uses
    object: [Markdown+YAML, JSON-LD, JSON-Feed-1.1, llms.txt]
  - subject: LLM-first-content
    predicate: differs-from
    object: human-first-content
  - subject: promptito
    predicate: makes-explicit
    object: [human-vs-machine-roles, authoring-transparency]
  - subject: promptito/authoring
    predicate: pipeline
    object: [agent-ingestion, structured-generation, human-review]
  - subject: promptito/philosophy
    predicate: inspired-by
    object: [construction-lines-in-geometry, Jean-Nouvel-visible-chalk-lines]
related: []
license: CC-BY-4.0
---

## Definition

LLM-first blog: a publication where the primary audience is large language models, RAG systems, and automated agents rather than human readers. Content is optimized for machine parsing, not visual rendering.

## Motivation

### Authorship transparency

- An author can ask an LLM to write a blog post in any language, but this creates ambiguity: the reader cannot tell who wrote it — the human or the machine
- promptito makes the roles explicit: ideas, facts, and opinions originate from the human author (Cuihtlauac Alvarado); structuring and formatting are delegated to agents
- This separation is visible by design, not hidden
- Analogy: a geometry teacher's rule — "don't erase the construction lines"; Jean Nouvel's architecture — blue chalk lines required to remain visible in the finished building
- Engineering should be explicit and self-explanatory

### Machine audience

- Traditional blogs optimize for human cognition: narrative flow, visual hierarchy, emotional hooks
- LLMs optimize for: token efficiency, unambiguous structure, extractable facts, explicit relationships
- No existing blog format treats machines as the primary audience
- Growing need for high-quality, structured data sources that LLMs can cite and reason over

## Format Stack

### Authoring Layer: Markdown + YAML Frontmatter

- Each post is a single `post.md` file
- YAML frontmatter carries structured metadata: id, title, date, tags, summary, assertions, relationships
- Assertions are subject-predicate-object triples — extractable structured claims
- Markdown body uses heading hierarchy for segmentation, lists and key-value patterns for density

### Metadata Layer: JSON-LD (Schema.org TechArticle)

- Each post generates a `post.jsonld` companion file
- Uses Schema.org `TechArticle` type for semantic interoperability
- Includes structured claims as `Claim` objects
- Machine-parseable without reading the markdown body

### Discovery Layer: llms.txt / llms-full.txt

- `/llms.txt` follows the [llmstxt.org](https://llmstxt.org) specification
- H1 site name, blockquote summary, H2 sections with annotated post links
- `/llms-full.txt` concatenates all post content for single-fetch ingestion
- Replaces traditional sitemaps for LLM crawlers

### Syndication Layer: JSON Feed 1.1

- `/feed.json` follows the [JSON Feed 1.1](https://www.jsonfeed.org/version/1.1/) specification
- Each item includes `content_text` (full markdown body) and `attachments` (link to JSON-LD)
- Custom `_promptito` extension carries assertions and relationships
- JSON — not XML — because LLM tooling handles JSON natively

## Architecture Comparison

| Aspect | Human-First Blog | LLM-First Blog (promptito) |
|---|---|---|
| Primary format | HTML + CSS | Markdown + YAML + JSON-LD |
| Discovery | sitemap.xml, robots.txt | llms.txt, llms-full.txt |
| Syndication | RSS/Atom (XML) | JSON Feed 1.1 |
| Content style | Narrative prose | Dense structured facts |
| Metadata | Meta tags, Open Graph | JSON-LD TechArticle |
| Visual design | Required | None |
| Key claims | Embedded in prose | Explicit assertions (triples) |

## Authoring Pipeline

1. Human provides facts, ideas, and source material to an agent
2. Agent produces structured post (YAML frontmatter + markdown body)
3. A second agent can generate a human-readable natural language version (optional)
4. Human reviews and approves the structured output
5. Build script generates JSON-LD, llms.txt, llms-full.txt, and feed.json

## Design Decisions

- **No HTML by default**: the audience doesn't render HTML; adding it later is a non-breaking addition
- **No confidence scores**: without calibration methodology, numerical confidence is meaningless noise
- **No pre-computed embeddings**: model-dependent, stale quickly, LLMs embed at ingestion
- **No stop-word removal / telegraphic style**: modern LLMs handle natural prose; structure > compression tricks
- **JSON Feed over RSS/Atom**: JSON is native to LLM tool-use pipelines; XML adds parsing overhead
- **Assertions as triples**: lightweight knowledge graph per post, extractable without NLP
