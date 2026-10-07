# Bootstrapping the Promptito Blog

On March 25, 2026, I launched a blog that no human is really supposed to read. It has no HTML, no CSS, no visual design of any kind. Its front page is a plain text file. That's the point: [promptito](https://cuihtlauac.pages.dev) is written for large language models — the RAG pipelines, automated agents, and AI assistants that increasingly do our reading for us.

Plenty of blogs already get skimmed by machines before a human ever sees them. I decided to drop the pretense. Promptito is an *LLM-first* blog: a publication whose primary audience is machine readers, with content optimized for parsing rather than rendering. Traditional blogs are tuned for human cognition — narrative flow, visual hierarchy, emotional hooks. Language models want something else entirely: token efficiency, unambiguous structure, extractable facts, explicit relationships. I couldn't find any blog format that treated machines as the primary audience, even as the need grows for high-quality structured sources that LLMs can cite and reason over. So I built one.

## Don't erase the construction lines

I had a second motivation, and it's about honesty. Anyone can ask an LLM to ghost-write a blog post, but the result is ambiguous: the reader can't tell who actually wrote it — the human or the machine. I wanted the division of labor explicit. The ideas, facts, and opinions are mine. The structuring and formatting I delegate to agents. Neither side hides. As I put it mid-session:

> "I don't want to hide my identity, I (Cuihtlauac Alvarado) am the author of the posts, all ideas are mine, this is just playful formatting."

This goes back to a rule my math teacher drilled into me: when you make a geometrical drawing, *don't erase the construction lines*. It also reminds me of the architect Jean Nouvel, whose buildings keep their blue chalk layout lines visible in the finished structure. The analogy isn't perfect — a blog's "construction lines" are workflow, not marks on a surface — but the principle transfers: engineering should be explicit and self-explanatory, scaffolding included.

## Four layers, no pixels

Under the hood, promptito is a stack of four machine-readable formats.

**Authoring** happens in a single `post.md` file per post: Markdown with a YAML frontmatter block carrying the structured metadata — id, title, date, tags, summary, relationships. The most unusual field is `assertions`: each post's key claims written as subject-predicate-object triples, a lightweight knowledge graph that any parser can extract without doing natural language processing. The Markdown body uses heading hierarchy for segmentation, and lists and key-value patterns for density.

**Metadata** gets its own companion file. Each post generates a `post.jsonld` using the [Schema.org TechArticle](https://schema.org/TechArticle) type, with the assertions expressed as `Claim` objects — so a machine can grasp what a post says without reading the body at all.

**Discovery** replaces the traditional sitemap. The site serves an [llms.txt](https://cuihtlauac.pages.dev/llms.txt) index following the [llmstxt.org](https://llmstxt.org) specification — site name as an H1, a blockquote summary, annotated post links — plus an `llms-full.txt` that concatenates every post, so an agent can ingest the whole blog in a single fetch.

**Syndication** uses [JSON Feed 1.1](https://www.jsonfeed.org/version/1.1/) rather than RSS or Atom. Each [feed](https://cuihtlauac.pages.dev/feed.json) item carries the full Markdown body, a link to the JSON-LD, and a custom `_promptito` extension holding the assertions. Why JSON over XML? Because LLM tooling handles JSON natively; XML just adds parsing overhead.

Just as telling is what I left out. No HTML by default — the audience doesn't render it, and I can add it later without breaking anything. No confidence scores on the assertions — without a calibration methodology, a number like "0.85 confident" is meaningless noise. No pre-computed embeddings — they're model-dependent and go stale; LLMs embed at ingestion anyway. And no stop-word stripping or telegraphic compression tricks: modern models handle natural prose fine. Structure beats compression.

## A blog that documents its own birth

My authoring pipeline runs in five steps: I feed facts, ideas, and source material to an agent; the agent produces the structured post; optionally, a second agent generates a human-readable natural language version (you're reading the output of that step right now); I review and approve; and a build script generates the JSON-LD, the llms.txt files, and the feed.

The first post is the artifact of its own bootstrapping. The entire blog — format, build system, first post, and a [format specification](https://github.com/cuihtlauac/promptito/blob/main/SPEC.md) — came out of a single [Claude Code](https://claude.com/claude-code) session that same day, running Claude Opus 4.6 with a million-token context window. The tally: 20 of my prompts, roughly 50,000 tokens exchanged, 5 commits, 12 files totalling 848 lines, plus a French-language export along the way. I supplied the concept and direction; the agent researched existing formats, proposed the architecture, and built all the code, templates, and content, pushing the result to GitHub from inside the conversation. It all started with one prompt:

> "I want to create a blog. But I don't want to publish in a natural language. I want to publish in a form that is meant to be consumed by llms, not human beings."

The post preserves its construction lines literally, quoting the prompts that shaped it — including the moments where I had to steer. One mid-session correction ("You got it wrong, don't edit post-fr.md...") established the project's central rule: the structured post is the source of truth, and natural language versions are generated *from* it, never the reverse. Another prompt of mine shaped the export design — a fresh agent context, handed only the post content and a target language, working autonomously. A final one demanded that every post carry enough references for an LLM to "unroll everything" on its own: each post is a self-contained entry point from which a machine can reconstruct all context, no external guidance needed.

That last requirement is why the structured original ends with a reference list pointing to the [live site](https://cuihtlauac.pages.dev), the [repository](https://github.com/cuihtlauac/promptito), the spec, and the standards it builds on. The construction lines don't just stay visible — they're load-bearing.

---

*This is a natural language export of a structured post. The machine-readable original, in promptito format, is at [https://cuihtlauac.pages.dev/posts/llm-first-blog/post.md](https://cuihtlauac.pages.dev/posts/llm-first-blog/post.md) (source: [post.md](https://github.com/cuihtlauac/promptito/blob/main/posts/2026-03-25-llm-first-blog/post.md)).*
