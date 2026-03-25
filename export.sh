#!/bin/sh
set -eu

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
POSTS_DIR="$SCRIPT_DIR/posts"
TMP_DIR="$SCRIPT_DIR/tmp"

# ---------------------------------------------------------------------------
# Language lookup
# ---------------------------------------------------------------------------
resolve_language() {
  case "$1" in
    fr) echo "French" ;;
    en) echo "English" ;;
    es) echo "Spanish" ;;
    de) echo "German" ;;
    pt) echo "Portuguese" ;;
    it) echo "Italian" ;;
    ja) echo "Japanese" ;;
    zh) echo "Chinese" ;;
    *)  echo "Unknown language code: $1" >&2
        echo "Supported: fr, en, es, de, pt, it, ja, zh" >&2
        return 1 ;;
  esac
}

# ---------------------------------------------------------------------------
# Parse arguments
# ---------------------------------------------------------------------------
if [ $# -lt 2 ]; then
  echo "Usage: $0 <lang> <slug>" >&2
  echo "  lang: fr, en, es, de, pt, it, ja, zh" >&2
  echo "  slug: post slug (directory name suffix under posts/)" >&2
  echo "" >&2
  echo "Example: $0 fr llm-first-blog" >&2
  exit 1
fi

lang_code="$1"
slug="$2"
language=$(resolve_language "$lang_code")

# ---------------------------------------------------------------------------
# Find and read the post
# ---------------------------------------------------------------------------
post_dir=""
for d in "$POSTS_DIR"/*-"$slug"; do
  if [ -d "$d" ]; then
    post_dir="$d"
    break
  fi
done

if [ -z "$post_dir" ]; then
  echo "No post found matching slug: $slug" >&2
  exit 1
fi

post_path="$post_dir/post.md"
post_dir_name=$(basename "$post_dir")

# ---------------------------------------------------------------------------
# Build prompt via temp file
# ---------------------------------------------------------------------------
prompt_file=$(mktemp)
trap 'rm -f "$prompt_file"' EXIT

cat > "$prompt_file" <<PROMPT_EOF
You are a technical writer. Convert the following structured blog post into a natural-language article in $language.

Rules:
- The YAML frontmatter contains metadata and structured assertions — use them as the backbone of your article
- The markdown body contains dense structured facts — expand them into readable prose
- Use first person. The author is the person named in the frontmatter
- Write an accessible technical blog post, conversational in tone
- Do not invent facts beyond what is in the source
- Do not include the YAML frontmatter in your output
- At the end of the article, include a note linking to the source post in promptito format: https://github.com/cuihtlauac/promptito/blob/main/posts/${post_dir_name}/post.md — phrase it naturally, e.g. "This article was generated from a structured source: [read the promptito format version](url)."
- Output clean Markdown only

Source post:

$(cat "$post_path")
PROMPT_EOF

# ---------------------------------------------------------------------------
# Call Claude CLI
# ---------------------------------------------------------------------------
echo "Exporting \"$slug\" to $language..."

mkdir -p "$TMP_DIR"
out_path="$TMP_DIR/${slug}.${lang_code}.md"

claude -p "$(cat "$prompt_file")" --output-format text > "$out_path"

echo "Written to $out_path"
