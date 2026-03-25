---
id: "urn:uuid:b7e3f1a2-9c4d-4e8f-a6b1-d2c3e4f5a6b7"
slug: ocaml-devcontainer
title: "Building an OCaml DevContainer with Claude Code"
date: 2026-03-25
author:
  name: Cuihtlauac Alvarado
  url: https://github.com/cuihtlauac
tags: [ocaml, devcontainer, docker, claude-code, llm-assisted-development, ci-cd, tsan, oxcaml, rocq]
summary: >
  ocaml-devcontainer is a production-ready OCaml 5.4 development environment
  packaged as a devcontainer, designed for tutorials and workshops where
  zero-friction onboarding is critical. Built iteratively with Claude Code
  (Claude Opus), the project evolved from a single Dockerfile into a
  three-layer image architecture with four variants (standard, Rocq, TSan,
  OxCaml), multi-arch CI/CD publishing to Docker Hub and GHCR, and
  comprehensive integration tests. Key design choices: Microsoft
  devcontainers/base over ocaml/opam images (for DevContainer Feature
  support), and narrow purpose-specific images driven by size constraints
  (opam switches are large, Codespaces penalizes big images). The post
  itself is a promptito artifact whose writing surfaced a discoverability
  bug in the promptito authoring workflow (promptito#1), creating a
  metadiegetic loop: the tool being described is simultaneously being
  used, tested, and debugged.
assertions:
  - subject: ocaml-devcontainer
    predicate: is-a
    object: devcontainer-based development environment
  - subject: ocaml-devcontainer
    predicate: targets
    object: [tutorials, workshops, zero-friction-onboarding]
  - subject: ocaml-devcontainer
    predicate: built-with
    object: Claude Code (Claude Opus)
  - subject: ocaml-devcontainer/architecture
    predicate: uses
    object: three-layer Docker image strategy
  - subject: ocaml-devcontainer/images
    predicate: includes
    object: [ocaml-devcontainer, ocaml-devcontainer-rocq, ocaml-devcontainer-tsan, oxcaml-devcontainer]
  - subject: ocaml-devcontainer/ci
    predicate: publishes-to
    object: [Docker Hub, GHCR]
  - subject: ocaml-devcontainer/ci
    predicate: builds
    object: [multi-arch amd64+arm64, fan-out/fan-in pipeline]
  - subject: llm-assisted-development
    predicate: surfaced-issues
    object: [opam-package-name-mismatches, github-actions-context-limitations, tsan-aslr-constraints]
  - subject: ocaml-devcontainer
    predicate: supports-workflows
    object: [VS Code, DevContainer CLI, GitHub Codespaces]
  - subject: ocaml-devcontainer/base-image
    predicate: chosen-over
    object: ocaml/opam Docker images
  - subject: ocaml-devcontainer/base-image
    predicate: based-on
    object: Microsoft devcontainers/base
  - subject: ocaml-devcontainer/architecture
    predicate: constrained-by
    object: [image-size, Codespaces-limits, local-disk-pressure]
  - subject: opam-switches
    predicate: are
    object: large (each switch duplicates the compiler and all packages)
  - subject: ocaml-devcontainer/development
    predicate: demonstrated
    object: iterative-llm-assisted-infrastructure-development
  - subject: this-post
    predicate: written-in
    object: promptito format
  - subject: this-post
    predicate: surfaced
    object: promptito authoring discoverability bug (cuihtlauac/promptito#1)
  - subject: this-post
    predicate: exhibits
    object: [metadiegesis (story-within-story), extradiegesis (narrator-level reflection)]
related: [llm-first-blog]
references:
  - url: https://github.com/tarides/ocaml-devcontainer
    label: ocaml-devcontainer repository
    description: Source code, Dockerfiles, CI pipelines, tests, and documentation
  - url: https://hub.docker.com/r/cuihtlauac/ocaml-devcontainer
    label: Docker Hub images
    description: Pre-built multi-arch images
  - url: https://containers.dev/
    label: Development Containers specification
    description: The devcontainer standard used by the project
  - url: https://ocaml.org/releases/5.4.0
    label: OCaml 5.4.0 release
    description: The OCaml compiler version used in the images
  - url: https://github.com/google/sanitizers/issues/1716
    label: TSan ASLR issue
    description: The sanitizers bug requiring vm.mmap_rnd_bits=28 for TSan builds
  - url: https://oxcaml.org
    label: OxCaml
    description: Jane Street's OxCaml compiler with local_ allocations
  - url: https://rocq-prover.org
    label: Rocq proof assistant
    description: Formerly Coq, added as a devcontainer variant
  - url: https://github.com/cuihtlauac/promptito/blob/main/SPEC.md
    label: Promptito Post Format Specification
    description: Self-contained spec for the structured post format
  - url: https://cuihtlauac.pages.dev/feed.json
    label: JSON Feed
    description: Full syndication feed with structured metadata
  - url: https://github.com/cuihtlauac/promptito/issues/1
    label: "promptito#1: llms.txt should link to authoring workflow"
    description: Bug filed during the writing of this post — LLM agents cannot discover authoring instructions from the website
  - url: https://github.com/devcontainers/images/tree/main/src/base-ubuntu
    label: Microsoft devcontainers/base image
    description: The base image chosen over ocaml/opam for DevContainer Feature compatibility
license: CC-BY-4.0
---

## Context

- OCaml workshops and tutorials suffer from onboarding friction: installing opam, building the compiler, configuring editors — each step is a potential blocker
- Devcontainers solve this: a Docker image with everything pre-installed, usable from VS Code, terminal editors, or GitHub Codespaces
- Goal: participants get a working OCaml 5.4 environment in minutes, regardless of OS or editor

## Why Not the Official OCaml Docker Images

- The [ocaml/opam](https://hub.docker.com/r/ocaml/opam) Docker images are the natural starting point, but they are not devcontainer images
- Devcontainers need a specific base structure to support [DevContainer Features](https://containers.dev/features) — things like Claude Code, GitHub CLI, or language-specific tooling that install via the devcontainer spec
- The [Microsoft devcontainers/base](https://github.com/devcontainers/images/tree/main/src/base-ubuntu) image provides this structure: a non-root user (`vscode`), Feature installation hooks, and compatibility with VS Code Remote Containers and GitHub Codespaces
- Trade-off: we install opam and the compiler ourselves on top of the Microsoft base, rather than starting from an image where they are already present
- This adds build time to the base image (~20-30 min) but unlocks the full devcontainer ecosystem

## Image Size: A Hard Constraint

- Image size matters more than it seems — it affects GitHub Codespaces startup time, local disk usage, and pull time over slow conference wifi
- Opam switches are large: each switch duplicates the compiler and all installed packages
- The default image with a single `ocaml` switch is ~4.5 GB — acceptable for Codespaces
- Adding TSan (a second switch) pushes the image to ~7.5 GB — too large for Codespaces, which forced the TSan split into a separate image
- OxCaml is ~18.8 GB — the OxCaml compiler and its dependencies are substantially larger
- This size pressure drove the entire architecture: narrow, purpose-specific images rather than one image with everything
- Each variant includes only what its target audience needs

## Development Method

- The project was built iteratively using Claude Code with Claude Opus
- The agent handled Dockerfile authoring, CI pipeline design, test scripting, and documentation
- The human (author) provided direction, made architectural decisions, and corrected course when the agent made wrong assumptions
- Persistent memory across sessions proved valuable: lessons learned in one session (package names, CI gotchas) informed subsequent work without re-discovery

## Architecture: Three-Layer Image Strategy

```
ocaml-devcontainer-base   (compiler + system tools, ~20-30 min build)
    └── ocaml-devcontainer  (opam packages, ~15-20 min build)
        ├── ocaml-devcontainer-rocq  (adds Rocq, ~10-15 min)
        └── ocaml-devcontainer-tsan  (adds ocaml+tsan switch, ~20-30 min)
```

- **Base image**: Ubuntu 24.04, opam, single `ocaml` switch (OCaml 5.4.0), platform tools (dune, ocaml-lsp-server, merlin, utop), editors (vim, emacs), debugging tools (gdb, lldb, valgrind, rr, perf, strace, bpftrace, hyperfine)
- **Dev image**: Testing (alcotest, ppx_inline_test, ppx_expect, qcheck, dscheck, qcheck-stm, qcheck-lin), profiling (landmarks, memtrace, runtime_events_tools, printbox), libraries (base, backoff)
- **Variant images**: Layer on top of dev — Rocq adds the proof assistant, TSan adds an `ocaml+tsan` switch, OxCaml has its own base/dev pair with Jane Street's compiler

### Why three layers

- Compiler builds take 20-30 minutes and change rarely — isolating them avoids unnecessary rebuilds
- Tool updates (dev layer) take 15-20 minutes — much faster than rebuilding everything
- Tutorial authors can add packages in seconds by layering on top of the dev image

## Evolution: Key Milestones

### Initial build (commits d341d31–aa7065f)

- Started with a single Dockerfile, then split into base/dev layers
- Immediate discovery: several opam packages don't exist or have different names than expected
  - `ocaml-mcp-server` does not exist in opam — removed entirely
  - `bisect_ppx` and `landmarks-ppx` not available on OCaml 5.4 — removed
  - `runtime_events_tools` installs `ocaml-runtime-tracer` binary, not `olly`
  - `merlin` package installs `ocamlmerlin` binary, not `merlin`
- These mismatches were caught by integration tests, saved to agent memory, and never repeated

### CI pipeline (commits f154807–d621dbb)

- Fan-out/fan-in multi-arch build: each architecture (amd64, arm64) builds on a native runner, then a merge job creates the multi-arch manifest
- GitHub Actions gotcha: `env` context is NOT available in `jobs.<job_id>.container.image` — must use `github` context directly
- Matrix `include` doesn't cross-product with other matrix dimensions — needed proper matrix dimensions instead

### TSan split (commits 85a5c63–421e607)

- Initially attempted to bake TSan into the default image with `--privileged` mode
- Problem: TSan requires `vm.mmap_rnd_bits <= 28` (reduced ASLR entropy), which is incompatible with GitHub Codespaces
- Solution evolution: privileged flag → runArgs → revert → remove privileged → split TSan into a separate image
- Result: default image stays at ~4.5 GB and works in Codespaces; TSan image is ~7.5 GB for local/CI use

### OxCaml variant (commits 611fc4e–86467d9)

- Added Jane Street's OxCaml compiler (5.2.0+ox) as a separate image pair (oxcaml-base, oxcaml-dev)
- Initially tried a 3-switch setup (ocaml, ocaml+tsan, oxcaml) — simplified to a single `oxcaml` switch
- Removed utop and odoc from the OxCaml switch (not compatible with the OxCaml compiler at the time)

### Rocq variant (commits 078ac4e–896484b)

- Added Rocq (formerly Coq) proof assistant on top of the standard dev image
- Discovered `rocq-extraction` is bundled in `rocq-stdlib` — removed the redundant package

### Broadening editor and tool support

- Added Neovim with exec pathway and LSP testing
- Added Emacs TRAMP + eglot integration testing
- Installed nushell from GitHub releases
- Pre-installed Node.js 22 LTS to avoid EOL Node 18 pulled in by the Claude Code DevContainer Feature
- Added Podman support and CI smoke test

## Three Workflows

| Workflow | Target user | Requirement |
|----------|-------------|-------------|
| VS Code + "Reopen in Container" | IDE users wanting graphical features | Docker locally |
| DevContainer CLI + `devcontainer exec` | Terminal editor users (vim, emacs, Claude Code) | Docker + Node.js locally |
| GitHub Codespaces | Zero-install, fastest start (~2 min) | GitHub account |

## Testing Strategy

- 10 integration test scripts covering: compiler, LSP protocol, profiling tools, Rocq, dune package management, VS Code integration, vim, neovim, emacs, Claude Code installation
- LSP test client rewritten from Python to OCaml (commit 50d49a6) — dogfooding the toolchain
- Tests parameterized by switch name: `./test/test-ocaml.sh ocaml+tsan`
- CI matrix: single `ocaml` switch for main image, `[ocaml, ocaml+tsan]` for TSan image, `oxcaml` for OxCaml

## Lessons on LLM-Assisted Infrastructure Development

### What worked well

- Agent handled boilerplate-heavy work effectively: Dockerfiles, GitHub Actions YAML, shell test scripts
- Iterative refinement loop: agent proposes, tests fail, agent reads errors, agent fixes — often without human intervention
- Cross-session memory eliminated repeated mistakes (opam package names, CI context limitations)
- Agent could research external constraints (TSan ASLR requirements, devcontainer spec details) via web search

### What required human judgment

- Architectural decisions: when to split TSan into a separate image vs. keeping it in the default image
- Scope decisions: which tools to include, which to drop (removing core, odoc, ocamlformat to keep the image lighter)
- Taste: naming conventions, documentation structure, README organization
- Recognizing when a workaround (privileged mode) was the wrong path and a redesign (image split) was needed

### Recurring pattern

1. Agent attempts something based on documentation or naming conventions
2. Integration test catches a mismatch with reality (binary name, package availability, CI context limitation)
3. Human or agent investigates and fixes
4. Lesson saved to agent memory for future sessions
5. The same mistake is never made twice

## Meta: Debugging Promptito by Writing This Post

This post is itself a promptito artifact, and writing it exposed a bug in the promptito authoring experience.

### What happened

- The author asked Claude Code to draft this post "using the promptito format described at cuihtlauac.pages.dev"
- The agent found the format spec (SPEC.md) and produced a valid structured post
- But the agent missed the two-step authoring pipeline entirely: it did not discover `CLAUDE.md` or `export.mjs` in the promptito repo
- The author had to ask explicitly: "Did you locate the instructions on how to pass a promptito formatted post to an agent to generate a version?"
- Investigation revealed the gap: the website, `llms.txt`, and SPEC.md all describe promptito from the reader's perspective — none of them link to the authoring workflow
- This led to filing [promptito#1](https://github.com/cuihtlauac/promptito/issues/1): `llms.txt` should link to authoring instructions for LLM agents

### Narrative layers

- **Metadiegesis** (story within story): the post about building ocaml-devcontainer with an LLM contains, embedded within it, the story of building the post itself with the same LLM — and that inner story produced a real bug fix
- **Extradiegesis** (narrator-level reflection): the author and the agent are simultaneously the subject of the post (they built ocaml-devcontainer), the producers of the post (they are writing it now in promptito format), and the debuggers of the medium (they found and filed a bug in promptito while using it)
- This is not ornamental — it demonstrates that structured authoring formats benefit from being exercised by their intended audience (LLM agents), and that the feedback loop between using a tool and improving it can happen within a single session
