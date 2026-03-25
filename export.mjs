import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = resolve(".");
const POSTS_DIR = join(ROOT, "posts");
const TMP_DIR = join(ROOT, "tmp");

const LANGUAGES = {
  fr: "French",
  en: "English",
  es: "Spanish",
  de: "German",
  pt: "Portuguese",
  it: "Italian",
  ja: "Japanese",
  zh: "Chinese",
};

// ---------------------------------------------------------------------------
// Parse arguments
// ---------------------------------------------------------------------------
const [langCode, slug] = process.argv.slice(2);

if (!langCode || !slug) {
  console.error("Usage: node export.mjs <lang> <slug>");
  console.error("  lang: " + Object.keys(LANGUAGES).join(", "));
  console.error("  slug: post slug (directory name under posts/)");
  console.error("\nExample: node export.mjs fr llm-first-blog");
  process.exit(1);
}

const language = LANGUAGES[langCode];
if (!language) {
  console.error(`Unknown language code: ${langCode}`);
  console.error("Supported: " + Object.keys(LANGUAGES).join(", "));
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Find and read the post
// ---------------------------------------------------------------------------
const postDir = readdirSync(POSTS_DIR).find((d) => d.endsWith(slug));
if (!postDir) {
  console.error(`No post found matching slug: ${slug}`);
  process.exit(1);
}

const postPath = join(POSTS_DIR, postDir, "post.md");
const postContent = readFileSync(postPath, "utf-8");

// ---------------------------------------------------------------------------
// Build the prompt
// ---------------------------------------------------------------------------
const prompt = `You are a technical writer. Convert the following structured blog post into a natural-language article in ${language}.

Rules:
- The YAML frontmatter contains metadata and structured assertions — use them as the backbone of your article
- The markdown body contains dense structured facts — expand them into readable prose
- Use first person. The author is the person named in the frontmatter
- Write an accessible technical blog post, conversational in tone
- Do not invent facts beyond what is in the source
- Do not include the YAML frontmatter in your output
- At the end of the article, include a note linking to the source post in promptito format: https://github.com/cuihtlauac/promptito/blob/main/posts/${postDir}/post.md — phrase it naturally, e.g. "This article was generated from a structured source: [read the promptito format version](url)."
- Output clean Markdown only

Source post:

${postContent}`;

// ---------------------------------------------------------------------------
// Call Claude CLI
// ---------------------------------------------------------------------------
console.log(`Exporting "${slug}" to ${language}...`);

mkdirSync(TMP_DIR, { recursive: true });

const result = execFileSync(
  "claude",
  ["-p", prompt, "--output-format", "text"],
  {
    encoding: "utf-8",
    maxBuffer: 1024 * 1024,
    timeout: 120_000,
  }
);

const outPath = join(TMP_DIR, `${slug}.${langCode}.md`);
writeFileSync(outPath, result);
console.log(`Written to ${outPath}`);
