---
id: "urn:uuid:a1b2c3d4-e5f6-7890-abcd-ef1234567890"
slug: llm-first-blog
title: "Bootstrapping the Promptito Blog"
date: 2026-03-25
updated: 2026-03-27
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
  - subject: natural-language-prose
    predicate: is-redundant-when
    object: both-producer-and-consumer-are-LLMs
  - subject: structured-content
    predicate: reduces
    object: [inference-energy, token-count, writing-time, reading-time]
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
    object: [construction-lines-in-geometry, Jean-Nouvel-Nemausus-visible-construction-marks, Hergé-Studios-Hergé-division-of-labor]
  - subject: this-post
    predicate: bootstrapped-via
    object: single-Claude-Code-session
  - subject: this-post/metrics
    predicate: involved
    object: [20-user-prompts, ~50k-tokens, 5-commits, 12-files]
  - subject: this-post/update-2026-03-27
    predicate: demonstrates
    object: [low-friction-authoring, fuzzy-memory-to-structured-content, insomnia-session, agent-fact-checking]
related: []
references:
  - url: https://cuihtlauac.pages.dev
    label: promptito (deployed site)
    description: The live blog — llms.txt, feed.json, and all posts
  - url: https://cuihtlauac.pages.dev/llms.txt
    label: llms.txt
    description: Site index for LLM discovery
  - url: https://cuihtlauac.pages.dev/feed.json
    label: JSON Feed
    description: Full syndication feed with structured metadata
  - url: https://github.com/cuihtlauac/promptito
    label: promptito project repository
    description: Source code, build system, and all posts
  - url: https://github.com/cuihtlauac/promptito/blob/main/SPEC.md
    label: Promptito Post Format Specification
    description: Self-contained spec for the structured post format
  - url: https://fr.wikipedia.org/wiki/Studios_Herg%C3%A9
    label: "Studios Hergé — Wikipédia"
    description: >
      History of Studios Hergé (founded 1950): Hergé retained story,
      storyboard, and character pencils; assistants Bob de Moor,
      Jacques Martin, and Roger Leloup handled backgrounds, inking,
      and final rendering. Illustrates division of labor between
      creative direction and execution.
  - url: https://fr.wikipedia.org/wiki/Mise_en_couleur_(bande_dessin%C3%A9e)
    label: "Mise en couleur (bande dessinée) — Wikipédia"
    description: >
      Colouring in Franco-Belgian comics has been a separate specialized
      trade (coloriste) since the 1940s, distinct from the main artist.
      Transitioned from hand-painted gouache on blue-line proofs to
      digital tools in the 1990s–2000s.
  - url: https://www.jeannouvel.com/en/projects/nemausus/
    label: "Nemausus — Ateliers Jean Nouvel"
    description: >
      Jean Nouvel's Nemausus social housing project (Nîmes, 1987).
      Raw concrete walls with visible construction-site markings —
      including cordeau à tracer (chalk snap-line) traces — were
      preserved by design; tenants were contractually prohibited
      from covering them.
  - url: https://llmstxt.org
    label: llms.txt specification
    description: The standard for LLM-friendly site indexes
  - url: https://www.jsonfeed.org/version/1.1/
    label: JSON Feed 1.1 specification
    description: The syndication format used by promptito
  - url: https://schema.org/TechArticle
    label: Schema.org TechArticle
    description: The JSON-LD type used for post metadata
license: CC-BY-4.0
---

## Definition

LLM-first blog: a publication where the primary audience is large language models, RAG systems, and automated agents rather than human readers. Content is optimized for machine parsing, not visual rendering.

## Motivation

### Authorship transparency

- An author can ask an LLM to write a blog post in any language, but this creates ambiguity: the reader cannot tell who wrote it — the human or the machine
- promptito makes the roles explicit: ideas, facts, and opinions originate from the human author (Cuihtlauac Alvarado); structuring and formatting are delegated to agents
- This separation is visible by design, not hidden
- Analogy: a geometry teacher's rule — "don't erase the construction lines"; Jean Nouvel's Nemausus social housing (Nîmes, 1987) — construction-site markings, including cordeau à tracer (chalk snap-line) traces, were deliberately left visible on raw concrete walls, and tenants were contractually prohibited from covering them
- Analogy: Hergé and the bande dessinée studio model — Hergé drew the first Tintin albums solo, but from the creation of Studios Hergé (1950) onward, he focused on story, storyboard, and character pencils while assistants (Bob de Moor, Jacques Martin, Roger Leloup) handled backgrounds, inking (encrage), and final rendering (mise au net). The author's role shifted from sole craftsman to creative director. In the broader BD industry, colouring (mise en couleur) has been a separate specialized trade since the 1940s — performed by dedicated coloristes, not the main artist — and later transitioned to digital tools. promptito follows the same logic: the author provides the creative substance, agents handle the rendering
- Engineering should be explicit and self-explanatory

### Redundant intermediary

- Common pipeline: an author asks an LLM to write prose, a reader asks another LLM to summarize, translate, simplify, or rewrite that prose
- The natural language in the middle has no raison d'être — it is LLM at both ends
- Eliminating the prose intermediary speeds up writing (no need to craft sentences), speeds up reading (fewer tokens to ingest), and reduces inference energy
- Energy scales linearly with generated tokens and superlinearly with ingested tokens (quadratic self-attention in transformers); fewer tokens = less compute at both ends
- Caveat: if a human eventually needs prose, the generation cost is deferred, not eliminated — but promptito handles this by exporting natural language on demand rather than storing it as the source of truth
- Net effect: structured-to-structured pipelines are faster and more energy-efficient than prose-mediated ones; prose is generated only when a human is actually in the loop

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

## Genesis: How This Post Was Made

This post is the artifact of its own bootstrapping conversation. The entire blog — format, build system, first post, and spec — was created in a single Claude Code session.

### Conversation metrics

- Model: Claude Opus 4.6 (1M context)
- User prompts: 20
- Estimated tokens exchanged: ~50,000 (input + output across all turns)
- Commits produced: 5
- Files created: 12 (848 lines)
- Duration: single session, 2026-03-25
- The same conversation also produced a French natural language export and a format specification

### Workflow demonstrated

- User provided the concept and high-level direction
- The agent (Claude Code) researched existing formats via web search
- The agent proposed an architecture; user refined it through iterative prompts
- The agent built all code, templates, and content
- User corrected course multiple times (see quotations below)
- The result was pushed to GitHub from within the conversation

### Selected prompts (quotations from the author)

> "I want to create a blog. But I don't want to publish in a natural language. I want to publish in a form that is meant to be consumed by llms, not human beings."

The opening prompt that started the project.

> "I don't want to hide my identity, I (Cuihtlauac Alvarado) am the author of the posts, all ideas are mine, this is just playful formatting."

Establishing authorship transparency as a core value.

> "Facts, motivation and anecdote to add: I want to make explicit the way I turn my ideas into artefacts. [...] That also reminds me when my math teacher telling me: don't erase the constructions lines when making a geometrical drawing. Also reminds me the blue chalk lines required to remain visible in a Jean Nouvel building."

The philosophical motivation — making the engineering visible. The "blue chalk lines" refer to cordeau à tracer (chalk snap-line) marks at Jean Nouvel's Nemausus housing project in Nîmes.

> "You got it wrong, don't edit post-fr.md. That's posts/2026-03-25-llm-first-blog/post.md that needs to be edited with the semantic content of what I wrote. Write in the CLAUDE.md, that's the workflow I intend to use."

A course correction that defined the core workflow: the structured post is the source of truth, not the natural language export.

> "When creating a natural language export of a promptito formated blog input data, I'd like an agent to be tasked under a fresh context, with the minimum data so it can work autonomously."

Led to the export pipeline design — a fresh agent context receiving only the post content and target language.

> "Update the first post with ad-hoc links to allow an LLM to unroll everything autonomously."

The insight that posts must be self-contained entry points — an LLM should be able to follow references and reconstruct all context without external guidance.

## Subsequent Update: 2026-03-27 (insomnia session, ~02:00–03:00 CET)

The author, unable to sleep, recalled vague memories of analogies that felt relevant to the post's motivation section: Jean Nouvel's Nemausus construction marks, Hergé's studio division of labor, and the redundancy of natural language as intermediary between LLMs. Over ~5 prompts, the agent fact-checked each claim against web sources, corrected inaccuracies (e.g., "blue chalk lines in a Jean Nouvel building" refined to the specific Nemausus project and cordeau à tracer traces), selected appropriate references, and integrated the verified material into the post.

### Workflow demonstrated

- Author's input: fuzzy recollections and half-formed intuitions, not polished ideas
- Agent's role: fact-checking, sourcing references, correcting details, structuring the material into the existing post format
- Result: three new motivation elements added (Nemausus corrected, BD studio analogy, redundant intermediary argument) with references, in a single late-night session
- This illustrates the low-friction authoring loop: the author does not need to research, write, or format — only to remember roughly and point the agent in the right direction
