# promptito

An LLM-first blog — structured content for silicon readers.

## Reading this blog

Posts here are not written in natural language. They are structured data designed for machines.

**To read them, use the LLM of your choice.** Paste a post into ChatGPT, Claude, Gemini, or any other model and ask for what you want:

- *"Summarize this post in French"*
- *"Explain this to a non-technical reader in 3 paragraphs"*
- *"Give me the key claims as bullet points in Spanish"*
- *"Rewrite this as a 2-minute blog post in English"*

You choose the language, the length, and the style. The structured format gives the LLM everything it needs to produce a faithful rendering — the ideas are all there, the presentation is up to you.

Raw posts are in [`posts/`](posts/). The full feed is at `feed.json`.

## Format

- **Authoring**: Markdown + YAML frontmatter (with structured assertions as subject-predicate-object triples)
- **Metadata**: JSON-LD ([Schema.org TechArticle](https://schema.org/TechArticle))
- **Discovery**: [llms.txt](https://llmstxt.org) + llms-full.txt
- **Syndication**: [JSON Feed 1.1](https://www.jsonfeed.org/version/1.1/)
- **Specification**: [SPEC.md](SPEC.md) — self-contained format spec for LLMs

## Build

```sh
npm install
npm run build
```

Output goes to `build/`.

## Author

[Cuihtlauac Alvarado](https://github.com/cuihtlauac)

## License

[CC-BY-4.0](LICENSE)
