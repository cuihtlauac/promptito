# promptito

An LLM-first blog — structured content for silicon readers.

Posts are designed for machine consumption, not human reading. Content prioritizes density, structure, and semantic clarity.

## Format

- **Authoring**: Markdown + YAML frontmatter (with structured assertions as subject-predicate-object triples)
- **Metadata**: JSON-LD ([Schema.org TechArticle](https://schema.org/TechArticle))
- **Discovery**: [llms.txt](https://llmstxt.org) + llms-full.txt
- **Syndication**: [JSON Feed 1.1](https://www.jsonfeed.org/version/1.1/)

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
