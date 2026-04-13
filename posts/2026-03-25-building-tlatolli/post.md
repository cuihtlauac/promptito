---
id: "urn:uuid:8afb2463-f124-4e36-9031-5a9bce4727d8"
slug: building-tlatolli
title: "Building Tlatolli: A Simulation Compiler in One Session"
date: 2026-03-25
author:
  name: Cuihtlauac Alvarado
  url: https://github.com/cuihtlauac
tags: [ocaml, simulation, formal-verification, devs, tla+, prism, algebraic-effects, llm-assisted-development]
summary: >
  Tlatolli is a discrete-event simulation compiler for OCaml. Write a model
  once, compile it to 6 backends: OCaml simulation, TLA+ (safety invariants),
  PRISM (probabilistic properties), C++/adevs (high-performance), Mermaid
  (visualization), Markdown (documentation). Built in ~24 hours with Claude
  Opus 4.6 from a pre-existing design document and formal verification
  feasibility study. The design pivoted mid-session from a SimPy-compatible
  engine to a GADT intermediate representation with defunctionalized state
  transitions. Property-based testing served as oracle across the architecture
  transition. A real SimPy bug was discovered during the formal study.
  UPPAAL was tried and abandoned (license required); PRISM replaced it,
  enabling probabilistic properties TLA+/TLC cannot express.
assertions:
  - subject: Tlatolli
    predicate: is-a
    object: discrete-event-simulation-compiler
  - subject: Tlatolli
    predicate: uses
    object: [OCaml-5-algebraic-effects, DEVS-formalism, GADT-IR, defunctionalized-transitions]
  - subject: Tlatolli
    predicate: compiles-to
    object: [OCaml-simulation, TLA+, PRISM, C++/adevs, Mermaid, Markdown]
  - subject: Tlatolli
    predicate: discovered
    object: SimPy-non-atomic-release-bug
  - subject: PRISM
    predicate: checks-properties-that
    object: TLA+/TLC-cannot
  - subject: defunctionalization
    predicate: enables
    object: multi-backend-compilation
  - subject: property-based-testing
    predicate: validates
    object: architecture-transitions
  - subject: Tlatolli
    predicate: built-with
    object: Claude-Opus-4.6-1M-context
  - subject: Tlatolli
    predicate: built-in
    object: one-session-24-hours
related: []
references:
  - url: https://github.com/tarides/tlatolli
    label: Tlatolli repository
    description: Full source code, tests, examples, formal verification artifacts
  - url: https://simpy.readthedocs.io/
    label: SimPy
    description: Python DES framework that inspired Tlatolli's user-facing API
  - url: https://www.prismmodelchecker.org/
    label: PRISM model checker
    description: GPL probabilistic model checker used for P=?, R=?, S=? properties
  - url: https://github.com/tlaplus/tlaplus
    label: TLA+ Tools
    description: MIT-licensed model checker used for safety invariants (5.1M states)
  - url: https://www.fceia.unr.edu.ar/~mcristia/publicaciones/devs-tla.pdf
    label: "Cristia: A TLA+ Encoding of DEVS Models"
    description: The DEVS-to-TLA+ encoding that Tlatolli implements
  - url: https://cuihtlauac.pages.dev/SPEC.md
    label: Promptito format specification
  - url: https://cuihtlauac.pages.dev/
    label: Promptito blog
license: CC-BY-4.0
---

## What Tlatolli is

- A discrete-event simulation compiler for OCaml
- Write a model once as a `Transition.model` value (GADT IR with defunctionalized state transitions)
- The same model compiles to 6 backends:

| Backend | Output | Checks |
|---------|--------|--------|
| OCaml sim | execution traces | functional correctness |
| TLA+/TLC | `.tla` spec | safety invariants, liveness |
| PRISM | `.prism` model | probability bounds, expected rewards, steady-state |
| C++/adevs | `.h` header | high-performance DEVS simulation |
| Mermaid | state/Gantt/sequence diagrams | visualization |
| Markdown | documentation with tables | literate specification |

- State updates use a universal defunctionalized vocabulary: `Set`, `Incr`, `Decr`, `Append`, `Remove`
- Every backend interprets these mechanically in its target language

## Starting point

- The project started from two pre-existing artifacts, not from code:
  1. `tlatolli.md` — a design document covering DEVS formalism, SimPy-to-DEVS mapping, and a TLA+ export pipeline
  2. `formal/` — a complete formal verification feasibility study executed against SimPy's Python implementation
- The feasibility study had already:
  - Specified the SimPy engine in TLA+ (5 modules: Engine, Process, Resource, Interrupt, Condition)
  - Model-checked 6 safety invariants + 1 liveness property across 5,137,825 states
  - Formalized all 7 SimPy examples as DEVS JSON models
  - Translated them to TLA+ via Cristia's encoding (24 invariants verified)
  - Instrumented SimPy to emit execution traces (42,480 steps)
  - Validated traces against TLA+ specs (56 invariants)
  - Discovered a previously undocumented SimPy bug: resource release-and-reacquire is not atomic

## The SimPy bug

- After `resource.release()`, `resource.count` drops to 0 immediately
- But pending queued requests are granted only via a deferred callback (`_trigger_put`)
- Between the release and the callback, `resource.count == 0` while `len(resource.queue) > 0`
- Observable by the releasing process itself, by any callback that fires in between, and by instrumentation
- Produces materially wrong simulation results: a repair shop model overestimates repairman availability on every repair cycle
- Affects all `BaseResource` subclasses: Resource, PriorityResource, PreemptiveResource, Container, Store, FilterStore
- Documented in `formal/traces/bug_report.md` with proof-of-concept code

## v1: SimPy in OCaml

- OCaml 5.4.1 with a local opam switch
- `Effect.Shallow` handlers replace Python generators for process suspension
  - `perform (Timeout 5.0)` replaces `yield env.timeout(5)`
  - Shallow handlers keep the stack flat (O(1) per suspension, vs O(n) accumulation with Deep handlers)
- Core engine: event queue (psq), event lifecycle (Pending→Triggered→Processed), environment step loop
- Resources: Resource, PreemptiveResource, Container, Store, Condition (AllOf/AnyOf)
- All 7 SimPy examples ported: latency, carwash, bank_renege, gas_station_refuel, machine_shop, movie_renege, process_communication
- Output matches SimPy `.out` files (verified by oracle tests)
- 33 tests across 4 suites
- DEVS layer: `ATOMIC` module signature, `Sim_atomic` functor, coupled model simulator, JSON serialization
- TLA+ generation via Cristia encoding, trace emission, CLI tools

## The design pivot

- The v1 engine faithfully reproduces SimPy — but transitions are opaque closures
- You can run them but not inspect, serialize, or compile them to other targets
- The conversation explored a different design: effects that map directly to formal primitives
  - `Delay` (DEVS ta), `Step` (named state transition), `Choose` (nondeterministic weighted choice), `Observe` (performance metric)
- Key insight: **defunctionalize** state updates
  - Instead of `next_state: 's -> 's` (a closure — opaque), use `actions: Action.t list` (data — inspectable)
  - `Action.t = Set | Incr | Decr | Append | Remove | Noop`
  - Every backend can interpret these mechanically: `Incr("n",1)` → `n' = n + 1` in TLA+, `state.n += 1;` in C++, `(n'=n+1)` in PRISM
- The GADT IR: `Internal { duration; actions }`, `External { port; actions }`, `Probabilistic { branches }`, `Sequence`

## PBT oracle across the transition

- Before building v2, 15 property-based tests (QCheck) were written against v1
- These encode the TLA+ invariants as randomized checks:
  - TimeMonotonic, QueueOrdering, EventLifecycle, ResourceCapacity, ResourceFIFO, ConditionAllOf/AnyOf/Failure, ContainerBounded/Conservation, StoreFIFO/FilterCorrect, PreemptionOrder, InterruptDelivery, SingleActive
- v2 must pass every property that v1 does
- Cross-version tests run the same scenario through both engines and compare results
- The PBT suite is the oracle — it validates the architecture transition mechanically

## v2: multi-backend compiler

- State: `(string * value) list` — string-keyed records of typed values (Int/Float/String/Bool)
- Transition IR: GADT with `Internal`, `External`, `Probabilistic`, `Sequence`
- v2 effect handler (`Sim.run`): `Delay` parks the fiber, `Step` applies actions to shared state, `Choose` samples by PRNG, `Observe` records metrics
- Compat layer: v1-style Resource/Container/Store reimplemented as v2 `Step` effects
- Transition extraction: `Extract.from_process` records effects to build a `Transition.model` from imperative code
- 6 backends from the same `model` value

## What PRISM adds that TLA+/TLC cannot do

| Property | PRISM | TLC |
|----------|-------|-----|
| Exact probability | `P=? [F goal]` | cannot quantify probability |
| Probability bound | `P>=0.95 [F goal]` | cannot |
| Expected reward | `R{"metric"}=? [F done]` | no expected values |
| Steady-state | `S=? [condition]` | no equilibrium analysis |
| Statistical MC | simulation-based | exhaustive only |

- Verified on Tlatolli models:
  - Counter: `P=? [F n=5] = 1.0` (deterministic reachability)
  - Coin (10 fair flips): `P=? [F heads>=3] = 0.9453125` (exact, matches binomial)
  - Coin: `R{"steps"}=? [F heads+tails=10] = 10.0` (expected reward)
- UPPAAL was tried first but `verifyta` requires academic license registration — discovered at runtime
- PRISM is GPL, no registration, and covers UPPAAL's use cases plus probabilistic properties

## Verification results

| Spec | Tool | States | Invariants | Result |
|------|------|--------|------------|--------|
| SimPyEngine | TLC | 5,137,825 | 6 safety + 1 liveness | PASS |
| 7 DEVS models | TLC | 26-59 each | 24 total | PASS |
| Counter | PRISM | 6 | P=?[F n=5] = 1.0 | PASS |
| Coin | PRISM | — | P=?[F heads>=3] = 0.945 | PASS |
| Coin | PRISM | — | R{"steps"}=? = 10.0 | PASS |
| Counter | g++/adevs | — | compile + run + compare | PASS |
| 15 PBT properties | QCheck | 100-200 scenarios each | randomized | PASS |

## The trust question

- The conversation explored using LLM agents to translate arbitrary OCaml code into Tlatolli IR models
- The trust gap: does the model faithfully represent the code?
- Five approaches were identified:
  1. **Trace validation** — run the code, check traces against properties (highest trust for observed behavior)
  2. **Bisimulation testing** — run code and model on random inputs, compare outputs (probabilistic guarantee)
  3. **PPX annotation** — embed model markers in OCaml source, extract at compile time (model is part of the code)
  4. **Abstract interpretation** — mechanically compute a model from the AST (sound but hard)
  5. **Pragmatic hybrid** (recommended) — LLM proposes model + properties + annotations; engineer reviews; CI verifies via bisimulation + trace validation
- Every link in the chain is either mechanically checked or probabilistically tested
- The LLM accelerates human work but is never the sole source of trust

## Numbers

- 104 tests across 10 suites
- 7 OCaml libraries
- 8 example simulations
- 6 compilation backends
- ~8,000 lines of OCaml
- 20 commits in ~24 hours
- 24 TLA+ invariants verified across 5.1M states
- 4 PRISM quantitative properties verified
- 1 real SimPy bug discovered
- Built with Claude Opus 4.6 (1M context) via Claude Code CLI
