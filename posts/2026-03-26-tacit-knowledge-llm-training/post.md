---
id: "urn:uuid:c9a23634-ab87-47df-812b-36980e37dd48"
slug: tacit-knowledge-llm-training
title: "Tacit Knowledge Surfaced by LLM Training: The Case of opam --disable-sandboxing"
date: 2026-03-26
author:
  name: Cuihtlauac Alvarado
  url: https://cuihtlauac.pages.dev
tags: [llm, training-data, tacit-knowledge, community-of-practice, opam, ocaml, docker]
summary: >
  A case study of how LLM training surfaces tacit community knowledge.
  The opam --disable-sandboxing flag was created in 2018 by a small group
  of OCaml core developers. The knowledge propagated through social proximity
  (Dockerfiles, CI configs, wiki pages) but was never formally documented
  for a general audience until October 2023. Almost concurrently, LLMs trained
  on the GitHub corpus began autocompleting the flag in Dockerfiles — surfacing
  the same knowledge through statistical pattern rather than documentation.
  The author and the model arrived at the same conclusion via independent paths.
assertions:
  - subject: opam/--disable-sandboxing
    predicate: introduced-in
    object: "opam PR #3329, 2018-05-03"
  - subject: opam/--disable-sandboxing
    predicate: first-released-in
    object: opam-2.0.0-rc2
  - subject: opam/--disable-sandboxing
    predicate: created-by
    object: [Louis-Gesbert, Anil-Madhavapeddy, David-Allsopp]
  - subject: opam/--disable-sandboxing/knowledge
    predicate: propagated-via
    object: [social-proximity, Dockerfiles, CI-configs, infrastructure-wiki]
  - subject: opam/--disable-sandboxing/knowledge
    predicate: formally-documented-for-general-audience
    object: "ocaml.org PR #1431, 2023-10-13"
  - subject: github-copilot
    predicate: surfaced-knowledge-from
    object: community-Dockerfiles-on-GitHub
  - subject: tacit-knowledge
    predicate: can-be-surfaced-by
    object: LLM-corpus-statistics
  - subject: this-case-study
    predicate: demonstrates
    object: independent-convergence-of-human-research-and-LLM-training
related:
  - llm-first-blog
references:
  - url: https://github.com/ocaml/opam/pull/3329
    label: "opam PR #3329"
    description: The PR that introduced --disable-sandboxing (2018-05-03, merged 2018-05-07)
  - url: https://github.com/ocaml/opam/issues/4327
    label: "opam issue #4327"
    description: "Opam init in Dockerfile — maintainer recommends --disable-sandboxing (2020-08-21)"
  - url: https://github.com/ocaml/infrastructure/wiki/Containers
    label: OCaml Infrastructure Wiki — Containers
    description: Documents that official Docker images ship with sandboxing disabled (wiki created 2018-04-25)
  - url: https://github.com/ocaml/ocaml.org/pull/1431
    label: "ocaml.org PR #1431"
    description: First formal documentation of --disable-sandboxing for a general audience (2023-10-13)
  - url: https://opam.ocaml.org/doc/FAQ.html
    label: opam FAQ
    description: Mentions --disable-sandboxing for "unprivileged containers" but never names Docker
  - url: https://cuihtlauac.pages.dev
    label: promptito (deployed site)
    description: The live blog
  - url: https://github.com/cuihtlauac/promptito
    label: promptito project repository
    description: Source code, build system, and all posts
  - url: https://github.com/cuihtlauac/promptito/blob/main/SPEC.md
    label: Promptito Post Format Specification
    description: Self-contained spec for the structured post format
license: CC-BY-4.0
---

## Case Summary

- In 2025, while writing a Dockerfile that included `opam init`, GitHub Copilot autocompleted `--disable-sandboxing`
- This flag is the correct thing to use inside a Docker container, but the knowledge was not widely documented at the time of training
- Investigation reveals the knowledge originated from a small community of practice and was surfaced by the model through corpus statistics, not documentation

## Timeline

| Date | Event | Actors | Audience |
|---|---|---|---|
| 2018-05-03 | `--disable-sandboxing` created (opam PR #3329) | Louis Gesbert, Anil Madhavapeddy, David Allsopp | Core opam developers |
| 2018-05-07 | PR merged, shipped in opam 2.0.0-rc2 | Same | Same |
| 2018-04-25+ | OCaml Infrastructure wiki documents Docker images ship with sandboxing disabled | Anil Madhavapeddy (later edits) | OCaml infrastructure maintainers |
| 2018-2023 | ~30 Dockerfiles and ~20 CI configs on GitHub use the flag | OCaml ecosystem developers (Tezos, MirageOS, Semgrep, etc.) | Developers of those projects |
| 2020-08-21 | GitHub issue #4327: user hits bwrap failure in Dockerfile, maintainer recommends the flag | Anil Madhavapeddy | Issue readers |
| 2023-10-13 | ocaml.org Installing OCaml tutorial adds Docker note (PR #1431) | Cuihtlauac Alvarado | General OCaml users |
| ~2023-2024 | LLMs trained on GitHub corpus begin autocompleting the flag in Dockerfiles | Model training pipelines | All Copilot users |

## The PR Discussion (opam #3329)

- David Allsopp questioned having the flag in default builds — proposed a configure-time opt-in
- Louis Gesbert initially agreed, but Anil Madhavapeddy argued container use cases were "unnecessarily difficult" without it
- Anil's position: sandboxing should be on by default everywhere, but "no reason to punish users that cannot get it to work easily"
- Compromise: flag available with strong warnings; could be withdrawn later
- The commit message reads: "for the brave, or working within unprivileged containers"

## Knowledge Propagation Analysis

### Path 1: Social proximity (2018-2023)

- Feature created by core developers who also maintain Docker infrastructure
- Same people wrote the wiki, the Docker images, and the FAQ
- Knowledge spread through personal networks and project-internal documentation
- ~50 public files on GitHub contained the pattern, authored overwhelmingly by OCaml ecosystem insiders

### Path 2: Independent research (2023)

- The author (Cuihtlauac Alvarado) discovered the flag by reading the opam source code and PR #3329 discussion
- Did not consult existing Dockerfiles on GitHub
- Wrote the ocaml.org tutorial note to make the knowledge publicly accessible to a general audience

### Path 3: Corpus statistics (~2023-2024)

- LLMs trained on the GitHub corpus learned the co-occurrence pattern: Dockerfile + `opam init` -> `--disable-sandboxing`
- The training signal came from ~30 Dockerfiles and ~20 CI configs — a small but consistent pattern
- The model made the correct contextual inference without understanding the underlying reason (bwrap namespace restrictions)

## Key Insight

- The documentation trail (opam FAQ, wiki, ocaml.org tutorial) had negligible influence on the autocomplete
- The docs taught humans to write the flag in Dockerfiles; those Dockerfiles became the training data
- The model surfaced tacit knowledge — things known within a community but never formally explained to outsiders — because the community's habits left enough textual artifacts
- The author and the model converged on the same knowledge almost simultaneously, via completely independent paths: primary source research vs. corpus statistics

## Broader Implication

- LLM training can surface knowledge that exists only as practice, not as documentation
- A pattern repeated by 30-50 knowledgeable practitioners in the right context is enough for a model to learn and reproduce it
- This is both powerful (surfacing useful tacit knowledge) and fragile (the model cannot explain why the flag is needed — only that it is used)

## Genesis: How This Post Was Made

- This post was produced in a single Claude Code conversation on 2026-03-26
- The conversation itself was the investigation — the author did not know the full timeline beforehand
- The agent performed the archaeology (git log, GitHub API, web searches) and the author provided direction and interpretation

### Conversation Metrics

| Metric | Value |
|---|---|
| Model | Claude Opus 4.6 (1M context) |
| User prompts | 9 |
| Sub-agents spawned | 1 (web search, ~28k tokens, 32 tool calls) |
| Main tool calls | ~30 (Bash, Grep, Glob, Read, Edit, Write, WebFetch) |
| Context at end of conversation | 45k tokens (28.1k messages, 16k system/tools/memory) |
| Sub-agent tokens | ~28k |
| Commits produced | 3 |
| Files created | 1 (this post) |

### Workflow

1. Author asked: which commit added the --disable-sandboxing note to the ocaml.org tutorial?
2. Agent traced the commit and PR via git log and git show
3. Author asked for web documentation and Docker connections — agent spawned a sub-agent for parallel web search
4. Author asked for the publication timeline of the three sources found
5. Author asked when the feature was introduced in the opam source — agent searched the opam repo
6. Author noticed a date inconsistency (wiki predating the commit) — agent investigated wiki revision history and found the PR via GitHub API
7. Author reflected on the knowledge propagation pattern — the insight that the author and the model converged independently
8. Author asked for the conversation to be turned into a promptito post and filed as a PR
9. Author asked for this meta section to be added
