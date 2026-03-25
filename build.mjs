import { readFileSync, writeFileSync, mkdirSync, cpSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import ejs from "ejs";
import matter from "gray-matter";

const ROOT = resolve(".");
const POSTS_DIR = join(ROOT, "posts");
const BUILD_DIR = join(ROOT, "build");
const TEMPLATES_DIR = join(ROOT, "templates");

const BASE_URL = "https://cuihtlauac.pages.dev";

// ---------------------------------------------------------------------------
// 1. Discover and parse posts
// ---------------------------------------------------------------------------
const postDirs = readdirSync(POSTS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort()
  .reverse(); // newest first

const posts = postDirs.map((dir) => {
  const filePath = join(POSTS_DIR, dir, "post.md");
  const raw = readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { ...data, content, _dir: dir };
});

console.log(`Found ${posts.length} post(s)`);

// ---------------------------------------------------------------------------
// 2. Generate per-post output
// ---------------------------------------------------------------------------
const jsonldTemplate = readFileSync(
  join(TEMPLATES_DIR, "post.jsonld.ejs"),
  "utf-8"
);

for (const post of posts) {
  const outDir = join(BUILD_DIR, "posts", post.slug);
  mkdirSync(outDir, { recursive: true });

  // Copy source markdown
  cpSync(join(POSTS_DIR, post._dir, "post.md"), join(outDir, "post.md"));

  // Generate JSON-LD
  const jsonld = ejs.render(jsonldTemplate, { post });
  writeFileSync(join(outDir, "post.jsonld"), jsonld);

  console.log(`  ✓ ${post.slug}`);
}

// ---------------------------------------------------------------------------
// 3. Generate llms.txt
// ---------------------------------------------------------------------------
const llmsTxtTemplate = readFileSync(
  join(TEMPLATES_DIR, "llms.txt.ejs"),
  "utf-8"
);
const llmsTxt = ejs.render(llmsTxtTemplate, { posts });
writeFileSync(join(BUILD_DIR, "llms.txt"), llmsTxt);
console.log("  ✓ llms.txt");

// ---------------------------------------------------------------------------
// 4. Generate llms-full.txt
// ---------------------------------------------------------------------------
const SEPARATOR = "\n\n---\n\n";
const llmsFullParts = posts.map((post) => {
  const header = [
    `# ${post.title}`,
    "",
    `- id: ${post.id}`,
    `- date: ${new Date(post.date).toISOString().split("T")[0]}`,
    `- tags: ${post.tags.join(", ")}`,
    `- summary: ${post.summary.trim()}`,
    "",
  ].join("\n");
  return header + post.content;
});
writeFileSync(join(BUILD_DIR, "llms-full.txt"), llmsFullParts.join(SEPARATOR));
console.log("  ✓ llms-full.txt");

// ---------------------------------------------------------------------------
// 5. Generate JSON Feed 1.1
// ---------------------------------------------------------------------------
const feed = {
  version: "https://jsonfeed.org/version/1.1",
  title: "promptito",
  home_page_url: BASE_URL,
  feed_url: `${BASE_URL}/feed.json`,
  description:
    "An LLM-first blog. Structured content for machine consumption.",
  language: "en",
  items: posts.map((post) => ({
    id: post.id,
    url: `${BASE_URL}/posts/${post.slug}/post.md`,
    title: post.title,
    summary: post.summary.trim(),
    date_published: new Date(post.date).toISOString(),
    date_modified: new Date(post.updated || post.date).toISOString(),
    tags: post.tags,
    authors: [post.author],
    content_text: post.content,
    attachments: [
      {
        url: `${BASE_URL}/posts/${post.slug}/post.jsonld`,
        mime_type: "application/ld+json",
        title: "JSON-LD metadata",
      },
    ],
    _promptito: {
      assertions: post.assertions || [],
      related: post.related || [],
      references: post.references || [],
    },
  })),
};
writeFileSync(join(BUILD_DIR, "feed.json"), JSON.stringify(feed, null, 2));
console.log("  ✓ feed.json");

// ---------------------------------------------------------------------------
// 6. Generate robots.txt
// ---------------------------------------------------------------------------
writeFileSync(
  join(BUILD_DIR, "robots.txt"),
  "User-agent: *\nAllow: /\n\nSitemap: " + BASE_URL + "/llms.txt\n"
);
console.log("  ✓ robots.txt");

// ---------------------------------------------------------------------------
// 7. Generate index.html
// ---------------------------------------------------------------------------
const indexTemplate = readFileSync(
  join(TEMPLATES_DIR, "index.html.ejs"),
  "utf-8"
);
const indexHtml = ejs.render(indexTemplate, { posts });
writeFileSync(join(BUILD_DIR, "index.html"), indexHtml);
console.log("  ✓ index.html");

// ---------------------------------------------------------------------------
// 8. Copy SPEC.md
// ---------------------------------------------------------------------------
cpSync(join(ROOT, "SPEC.md"), join(BUILD_DIR, "SPEC.md"));
console.log("  ✓ SPEC.md");

// ---------------------------------------------------------------------------
// 8. Generate _headers (Cloudflare Pages MIME types)
// ---------------------------------------------------------------------------
writeFileSync(
  join(BUILD_DIR, "_headers"),
  `/*.jsonld
  Content-Type: application/ld+json

/*.md
  Content-Type: text/markdown; charset=utf-8

/feed.json
  Content-Type: application/feed+json; charset=utf-8
`
);
console.log("  ✓ _headers");

console.log("\nBuild complete.");
