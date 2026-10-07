---
id: "urn:uuid:4f88ec78-6f63-4b9d-aa50-5e93b207e7c7"
slug: y-skill-origin
title: "Origin of y-skill: How a Tired Cat Became a Skill That Writes Skills"
date: 2026-10-07
author:
  name: Cuihtlauac Alvarado
tags: [y-combinator, lambda-calculus, attention, claude-skills, recursion, turing-completeness, self-reference, origin-story]
summary: >
  Origin story of y-skill, a self-referential Claude Skill implementing the Y
  combinator: a SKILL.md whose only supporting file is itself and whose payload
  mints further skills. The chain: the "cat sat on the mat" attention example,
  reframed as oriented bonds between tokens; four context-dependent word
  classes mapped to lambda-calculus constructs (attention as a probabilistic
  interpreter); a natural-language Y-combinator sentence mirroring
  λf.(λx.f(x x))(λx.f(x x)); the sentence rebuilt as a skill; a repository
  with structural and behavioural gates, an OCaml oracle, Turing-completeness
  constructions, and a defense of the stochastic interpreter (computers err
  too; LLMs hallucinate where silicon crashes or hangs). The narrative version
  (ORIGIN.md) was ghost-written by Claude Code from the two founding chat
  transcripts.
assertions:
  - subject: y-skill
    predicate: is-a
    object: self-referential Claude Skill implementing the Y combinator
  - subject: y-skill/SKILL.md
    predicate: supporting-file-is
    object: itself
  - subject: attention
    predicate: modeled-as
    object: probabilistic lambda calculus
  - subject: context-dependent-word-classes
    predicate: map-to
    object: [non-alpha-renamed-terms, free-variables, let-bindings-beta-reduction, function-application]
  - subject: anaphora-resolution
    predicate: behaves-as
    object: catamorphism (fold over preceding context)
  - subject: cataphora
    predicate: behaves-as
    object: anamorphism (lazy slot awaiting downstream binding)
  - subject: y-combinator-sentence
    predicate: mirrors-structure-of
    object: "λf.(λx.f(x x))(λx.f(x x))"
  - subject: y-skill/dispatch-rule
    predicate: placed-in
    object: replaceable payload section (the f of Y f)
  - subject: evidence-of-recursion
    predicate: is
    object: consultation call log, not the final answer
  - subject: y-skill
    predicate: adopts
    object: infinite-context hypothesis (termination belongs to the topic, not the combinator)
  - subject: y-skill/harness
    predicate: enforces
    object: [byte-identical kept tail (structural gate), oracle-verified baselines (behavioural gate), negative control]
  - subject: word-rev-sub
    predicate: negative-result
    object: subagent consultation does not scale (depth-1 nesting cap)
  - subject: ski-eval
    predicate: demonstrates
    object: Turing completeness by SK normalization through self-consultation
  - subject: stochastic-interpreter-objection
    predicate: answered-by
    object: computability belongs to the notation; reliability belongs to the interpreter
  - subject: LLM-interpreter
    predicate: errs-by
    object: hallucination, where silicon errs by crashing or hanging
  - subject: ORIGIN.md
    predicate: ghost-written-by
    object: Claude Code, from the two founding chat transcripts
related: [llm-first-blog]
human_versions:
  - lang: en
    file: human.en.md
references:
  - url: https://github.com/cuihtlauac/y-skill
    label: y-skill repository
    description: The project this post narrates — combinator, harness, proofs, demo
  - url: https://github.com/cuihtlauac/y-skill/blob/main/ORIGIN.md
    label: ORIGIN.md
    description: The human-readable narrative version of this post
  - url: https://github.com/cuihtlauac/y-skill/blob/main/PROOF.md
    label: PROOF.md
    description: Turing-completeness constructions and the stochastic-interpreter defense
  - url: https://github.com/cuihtlauac/y-skill/blob/main/.claude/skills/y-skill/SKILL.md
    label: y-skill SKILL.md
    description: The self-referential skill itself
  - url: https://arxiv.org/abs/1706.03762
    label: Attention Is All You Need
    description: The Transformer paper; source of the self-attention mechanism
  - url: https://research.utwente.nl/en/publications/functional-programming-with-bananas-lenses-envelopes-and-barbed-w
    label: Functional Programming with Bananas, Lenses, Envelopes and Barbed Wire
    description: Meijer, Fokkinga, Paterson 1991 — catamorphisms and anamorphisms
  - url: https://gwern.net/turing-complete
    label: Surprisingly Turing-Complete
    description: The catalog whose rigor standard PROOF.md matches
  - url: https://code.claude.com/docs/en/skills
    label: Claude Skills documentation
    description: The skill mechanism y-skill is built on
  - url: https://github.com/cuihtlauac/promptito
    label: promptito project repository
    description: Source code, build system, and all posts
  - url: https://github.com/cuihtlauac/promptito/blob/main/SPEC.md
    label: Promptito Post Format Specification
  - url: https://cuihtlauac.pages.dev/feed.json
    label: JSON Feed
license: CC-BY-4.0
---

## Scope

- Origin story of the y-skill project: two chat sessions (Gemini, then Claude) on 5 October 2026, followed by two days of repository work (6–7 October 2026)
- Arc: attention → lambda calculus → natural-language Y combinator → story turned skill
- This post is the structured ingestion of [ORIGIN.md](https://github.com/cuihtlauac/y-skill/blob/main/ORIGIN.md), the narrative (human-readable) version kept in the y-skill repository; the narrative was written first, by Claude Code, from the session transcripts

## Attention as probabilistic lambda calculus

- Starting point: the textbook self-attention example "the cat sat on the mat because it was tired" — mats do not get tired, so the model binds "it" to "cat"
- Reframing (discarding the softmax formulas): attention is an oriented, weighted bond between tokens; words like "it" are empty placeholders that surrounding context fills
- Four word classes need these bonds most:
  - Homographs ("bank") — ambiguous without neighbors
  - Deictic words ("there", "now") — empty without an environment
  - Anaphoric stand-ins ("it", "does") — point to an antecedent
  - Relative modifiers ("large") — meaningless until applied to a noun
- The mapping to lambda calculus, one construct per class:
  - Homograph clash ↔ terms without α-renaming (name collision)
  - Deictic word ↔ free variable awaiting an environment
  - Anaphora ↔ let-binding resolved by β-reduction
  - Modifier ↔ function application
- Consequence: attention acts as a soft, differentiable interpreter — a variable can be 80% bound to "the cat" and 20% to "the mat"
- Caveat: Gemini claimed published research supports the correspondence (neural lambda calculus, Transformer type inference); citations unverified, chatbot-sourced; the structural mapping stands independently

## The recursion-schemes crossover

- Question: is anaphora vs anamorphism a naming coincidence? No — same Greek prefixes (ana-, cata-), opposite mapping directions
- Linguists named for eye movement on the page: anaphora points backward, cataphora forward
- Meijer–Fokkinga–Paterson named for data growth: anamorphism unfolds a seed, catamorphism folds a structure
- The mechanics cross over the names:
  - Resolving an anaphoric "it" is catamorphic — a fold over preceding context down to the antecedent (it = cat)
  - Cataphora is anamorphic — "When *he* arrived, John noticed…" opens a lazy slot, a promise bound by a downstream value

## The natural-language Y combinator

- Request: a sentence mirroring the exact structure λf.(λx.f(x x))(λx.f(x x)) — explicit self-application driver, not a mere loop ("a rumor is a story told by someone who heard a rumor") or liar paradox
- Result:

> Tell a story by applying [the following rule] to [itself]: The rule is to
> speak of a traveler who is trapped inside [the story].

- Execution unfolds forever: a traveler trapped inside a story about a traveler trapped inside a story…
- Literary fixed points recognized in-session: the 602nd night of the Thousand and One Nights (per Borges: Scheherazade begins telling the King his own story) and Borges's The Circular Ruins (a dreamer discovers he is dreamed)

## From story to skill

- The sentence was carried verbatim into a Claude session: "how does this sentence relate to the Y combinator?"
- Rebuilt as a Claude Skill: a SKILL.md whose only supporting file is itself, whose payload is instructions for minting further skills built the same way
- Engineering decisions from that session:
  - Boilerplate moved from prompt into the skill: `/y-skill <name> <topic>` suffices
  - Dispatch rule placed deliberately in the replaceable payload section (the f of Y f) so children do not inherit skill-making; `/hanoi-moves 3` is not misread as a request to build a skill named "3"
  - Renamed y-skill
- Key insight closing the session: a generated `/fibonacci` answering 8 for F(6) proves nothing (the model knows Fibonacci); evidence of recursion is the call log — 25 consultations, each case consulting exactly n−1 and n−2, each as a separate subagent given only the SKILL.md and a smaller case

## Repository build-up (6–7 October 2026)

### 6 October — skill and machinery

- First commit: "Add y-skill: the Y combinator as a Claude Skill"
- Design decision: the infinite-context hypothesis — self-consultation chains may be unbounded; termination belongs to the topic, never to the combinator (Y does not decide when to stop; f does)
- Harness (shell + Make + OCaml oracle as ground truth), two gates:
  - Structural gate: kept tail of every generated child byte-identical to y-skill/SKILL.md (the fixed point, enforced with diff)
  - Behavioural gate: answers checked against oracle-computed baselines, never model-computed
  - Negative control: `make broken` proves the gates can fail
- Generated skills are gitignored, not committed: a fresh clone ships only the combinator; children regenerate via `/y-skill`
- Negative result: word-rev-sub, a sibling combinator consulting via subagents, does not scale — subagents nest one level deep (breadth, not depth)

### 7 October — theory

- PROOF.md: Turing-completeness constructions to the standard of the Surprisingly Turing-Complete catalog
- demo/unary-tm: a runnable Turing machine as a skill
- ski-eval: the native construction — a generated skill normalizing SK combinator terms, one leftmost-outermost rewrite per self-consultation; the skill minted by the Y combinator evaluates the literal Y combinator
- Housekeeping: README kept short, long version split to TLDR.md, review passes fixing doc drift and hardening the harness

## The stochastic-interpreter objection

- Objection: the default interpreter is a neural net; neural nets make things up
- Answer (PROOF.md §4): Turing completeness is a property of the abstract step function the notation defines, never of any particular executor
- Every step in both constructions is a finite table lookup plus a local edit, mechanizable by a dumb deterministic parser
- Mechanized in-repo: the OCaml oracle and the demo shell driver execute the same notations the LLM reads, and agree with the LLM-driven runs
- Regular computers are not purer: finite memory, bugged hardware and software — every catalog entry runs on real silicon as a fault-prone finite approximation of its idealized self
- An LLM errs differently, not more fundamentally: it hallucinates where silicon crashes or hangs
- Reliability belongs to the interpreter; computability belongs to the notation — CSS's Turing completeness is a fact about the CSS specification, not about browser rendering bugs

## Provenance

- The narrative ORIGIN.md was not written by its narrator: Claude Code wrote it from saved transcripts of the two founding sessions, first in third person, then retold in first person on request
- The "I" of the narrative is real but reconstructed: insights and prompts come from the transcripts; the sentences are the machine's
- Later passes added the anaphora/anamorphism analysis, the repository build-up (from the git log), the stochastic-interpreter summary, and a colophon describing the document's own construction
- This post closes the loop: a story about a self-applying rule, ghost-written by the machine the rule runs on, published on a blog whose primary readers are machines
