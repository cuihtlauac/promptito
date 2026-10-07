---
id: "urn:uuid:11de1176-8292-4be5-8aaf-30ca56286095"
slug: y-skill-origin
title: "Origin of y-skill: the Y Combinator as a Claude Skill"
date: 2026-10-07
updated: 2026-10-07
author:
  name: Cuihtlauac Alvarado
tags: [y-skill, y-combinator, claude-skills, lambda-calculus, attention, recursion-schemes, turing-completeness, meta]
summary: >
  Origin story of y-skill: a Claude Skill encoding the Y combinator — a
  SKILL.md whose only supporting file is itself and whose payload mints
  further skills. Traces the chain from a Gemini conversation about
  self-attention (2026-10-05) through a probabilistic lambda calculus reading
  of attention, a natural-language Y combinator sentence, skill construction
  in a Claude session, to the repository (born 2026-10-06) with its
  oracle-backed verification harness and Turing-completeness argument
  (PROOF.md, 2026-10-07). This post inverts the usual promptito pipeline:
  the human narrative (ORIGIN.md) was written first; this structured post
  derives from it.
assertions:
  - subject: y-skill
    predicate: is-a
    object: Y-combinator-encoded-as-Claude-Skill
  - subject: y-skill/SKILL.md
    predicate: has-only-supporting-file
    object: itself
  - subject: y-skill/SKILL.md
    predicate: payload
    object: instructions-for-minting-further-skills
  - subject: attention
    predicate: interpreted-as
    object: probabilistic-lambda-calculus
  - subject: context-dependent-words
    predicate: classified-into
    object: [ambiguous-homographs, deictic-pointers, anaphoric-stand-ins, relative-modifiers]
  - subject: anaphora-resolution
    predicate: is-mechanically
    object: catamorphism
  - subject: cataphora-resolution
    predicate: is-mechanically
    object: anamorphism
  - subject: y-skill
    predicate: adopts
    object: infinite-context-hypothesis
  - subject: y-skill/harness
    predicate: validates-via
    object: [structural-gate-diff, behavioural-gate-oracle, negative-control]
  - subject: y-skill/baselines
    predicate: must-come-from
    object: OCaml-oracle-not-model
  - subject: y-skill/recursion-evidence
    predicate: is
    object: call-log-not-final-answer
  - subject: turing-completeness
    predicate: property-of
    object: notation-step-function-not-executor
  - subject: word-rev-sub
    predicate: negative-result
    object: subagents-nest-one-level-deep
  - subject: this-post
    predicate: has-human-version
    object: en
  - subject: this-post/pipeline
    predicate: inverted
    object: human-version-authored-first
  - subject: this-post/human-version
    predicate: authored-by
    object: Claude-Code-from-session-transcripts
related: [llm-first-blog]
human_versions:
  - lang: en
    file: human.en.md
references:
  - url: https://github.com/cuihtlauac/y-skill
    label: y-skill repository
    description: The project this post recounts — combinator skill, harness, proofs, demos
  - url: https://github.com/cuihtlauac/y-skill/blob/main/.claude/skills/y-skill/SKILL.md
    label: y-skill SKILL.md
    description: The self-referential skill — the fixed point itself
  - url: https://github.com/cuihtlauac/y-skill/blob/main/PROMPTS.md
    label: PROMPTS.md
    description: The prompts that drove the originating conversations
  - url: https://github.com/cuihtlauac/y-skill/blob/main/PROOF.md
    label: PROOF.md
    description: Turing-completeness constructions and the defense of the stochastic interpreter
  - url: https://github.com/cuihtlauac/y-skill/blob/main/TLDR.md
    label: TLDR.md
    description: Short version of the y-skill story
  - url: https://github.com/cuihtlauac/y-skill/tree/main/harness
    label: y-skill verification harness
    description: Shell-and-Make harness with OCaml oracle, structural and behavioural gates
  - url: https://github.com/cuihtlauac/y-skill/blob/main/ORIGIN.md
    label: ORIGIN.md
    description: The original narrative this post was derived from (copied here as the human version)
  - url: https://arxiv.org/abs/1706.03762
    label: Attention Is All You Need
    description: The self-attention paper behind the "tired cat" textbook example
  - url: https://research.utwente.nl/en/publications/functional-programming-with-bananas-lenses-envelopes-and-barbed-w
    label: Functional Programming with Bananas, Lenses, Envelopes and Barbed Wire
    description: The recursion-schemes paper that named anamorphism and catamorphism
  - url: https://gwern.net/turing-complete
    label: Surprisingly Turing-Complete
    description: Catalog cited in the argument that computability belongs to notations, not executors
  - url: https://code.claude.com/docs/en/skills
    label: Claude Skills documentation
    description: The extension mechanism y-skill is built on
  - url: https://github.com/cuihtlauac/promptito
    label: promptito project repository
    description: Source code, build system, and all posts of this blog
  - url: https://github.com/cuihtlauac/promptito/blob/main/SPEC.md
    label: Promptito Post Format Specification
    description: Self-contained spec for the structured post format
  - url: https://cuihtlauac.pages.dev/feed.json
    label: JSON Feed
    description: Full syndication feed with structured metadata
license: CC-BY-4.0
---

## Definition

y-skill: a Claude Skill encoding the Y combinator. Its `SKILL.md` lists exactly one supporting file — itself — and its payload is instructions for minting further skills built the same way. Generated skills are gitignored and regenerated by running `/y-skill`; a fresh clone ships only the combinator.

## Origin Chain

Chronological chain from observation to repository:

1. **2026-10-05, Gemini session**: started from the textbook self-attention example ("the cat sat on the mat because it was tired"); reframed attention as oriented, weighted bonds between tokens — context-dependent words are empty cups filled by surrounding text
2. Classified context-dependent words into four classes: ambiguous homographs ("bank"), deictic pointers ("there", "now"), anaphoric stand-ins ("it", "does"), relative modifiers ("large")
3. Mapped the four classes onto lambda calculus: homograph clashes = terms without α-renaming; deictics = free variables awaiting an environment; anaphora = let-binding resolved by β-reduction; modifiers = function application. Attention = a soft, differentiable interpreter (a variable can be 80% bound to "the cat", 20% to "the mat")
4. Anaphora/anamorphism detour: both vocabularies use Greek *ana-*/*cata-*, mapped in opposite directions (linguists: direction of eye-scan; recursion schemes: direction of data growth). Mechanically they cross over: anaphora resolution is a catamorphism (fold over preceding context to the antecedent); cataphora is an anamorphism (lazy slot holding a promise)
5. Asked for a natural-language sentence mirroring λf.(λx.f(x x))(λx.f(x x)) with an explicit self-application driver. Result: "Tell a story by applying [the following rule] to [itself]: The rule is to speak of a traveler who is trapped inside [the story]." Literary fixed points: Borges' 602nd night of the One Thousand and One Nights, The Circular Ruins
6. **Claude session**: opened with the sentence verbatim; rebuilt the traveler-in-the-story rule as a Claude Skill — the fixed point as a usable tool. Boilerplate moved from prompt into the skill (`/y-skill <name> <topic>`); the dispatch rule placed in the replaceable payload (the f of Y f) so children don't inherit skill-making
7. **2026-10-06, repository born**: first real commit "Add y-skill: the Y combinator as a Claude Skill"; same day PROMPTS.md, README, and the verification harness
8. **2026-10-07**: PROOF.md (Turing-completeness constructions), demo/unary-tm (a Turing machine as a skill), ski-eval (generated skill normalizing SK combinator terms one rewrite per self-consultation — so the skill minted by the Y combinator evaluates the literal Y combinator); TLDR.md split out

## Design Principles

- **Infinite-context hypothesis**: chains of self-consultations may be unbounded; termination belongs to the topic (f), never to the combinator (Y)
- **Recursion is proven by the call log, not the answer**: a generated `/fibonacci` answering 8 for F(6) proves nothing (the model knows Fibonacci); 25 consultations, each case consulting exactly n−1 and n−2, each a separate subagent given only the SKILL.md and a smaller case, prove recursion
- **Verification gates**: structural gate (`structural.sh`) — kept tail of each child byte-identical to y-skill/SKILL.md, enforced with diff; behavioural gate (`grade.sh`) — answers checked against baselines in results.txt that must come from the OCaml oracle (oracle.ml), never from the model; negative control (`make broken`) proves the gates can fail
- **Negative result recorded**: word-rev-sub, a sibling combinator consulting via spawned subagents, doesn't scale — subagents nest only one level deep (breadth, not depth)

## Turing-Completeness Defense

- Objection: the default interpreter is a neural net, and neural nets make things up
- Answer: Turing completeness is a property of the abstract step function a notation defines, never of any particular executor
- In both constructions (unary TM, SKI rewriting) a step is a finite table lookup plus a local edit, mechanizable by a dumb deterministic parser — and the repo mechanizes them: the OCaml oracle and the demo's shell driver execute the same notations the LLM reads, and agree with LLM-driven runs
- Regular computers are also fault-prone finite approximations of their idealized selves (cf. the Surprisingly Turing-Complete catalog); an LLM errs differently — it hallucinates where silicon crashes or hangs
- Reliability belongs to the interpreter; computability belongs to the notation

## Authoring Note: Inverted Pipeline

- The usual promptito pipeline generates human versions from the structured post; this post ran backwards
- The human version (`human.en.md`) is ORIGIN.md from the y-skill repository, copied verbatim (plus a footer linking back here)
- ORIGIN.md was written by Claude Code from saved transcripts of the two originating sessions, retold in the first person of the human who had the conversations: every insight is from the transcripts, the sentences are Claude's
- This structured post was then derived from that narrative — ingestion, not export
- The narrative closes with its own construction story; the assertion graph above is the promptito-native rendering of the same facts
