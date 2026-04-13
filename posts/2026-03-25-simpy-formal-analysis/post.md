---
id: "urn:uuid:7c3e9a1f-4b2d-4f8e-a6c1-d9e0f3b5a278"
slug: simpy-formal-analysis
title: "Formal Analysis of SimPy: Finding a Concurrency Bug with TLA+ and DEVS"
date: 2026-03-25
author:
  name: Cuihtlauac Alvarado
tags: [simpy, tla-plus, devs, formal-verification, discrete-event-simulation, model-checking, ocaml]
summary: >
  SimPy, the standard Python discrete-event simulation framework, was subjected
  to formal analysis using TLA+ model checking and DEVS (Discrete Event System
  Specification) modeling. Three rounds of increasingly deep verification —
  engine specification, DEVS model checking, and trace validation on all 7
  in-repo examples — produced 56 invariants checked against 42,480 execution
  trace steps. The third round surfaced a real bug: resource release-and-reacquire
  is not atomic. After release(), resource state (count, level, items) reflects
  the operation but pending queue requests are not granted until a deferred
  callback fires in a later step(). This creates an observable intermediate state
  analogous to a race condition, despite SimPy being single-threaded. The bug
  affects all BaseResource subclasses and can produce wrong simulation results.
  A bug report (issue #180) and fix (MR !37) were submitted upstream.
assertions:
  - subject: simpy/formal-analysis
    predicate: uses
    object: [TLA+, DEVS, TLC-model-checker, trace-validation]
  - subject: simpy/formal-analysis
    predicate: found
    object: non-atomic-resource-release-bug
  - subject: non-atomic-resource-release-bug
    predicate: affects
    object: [Resource, PriorityResource, PreemptiveResource, Container, Store, FilterStore, PriorityStore]
  - subject: non-atomic-resource-release-bug
    predicate: root-cause
    object: _trigger_put-deferred-to-callback-while-_trigger_get-runs-synchronously
  - subject: simpy
    predicate: is-a
    object: single-threaded-cooperative-coroutine-DES-framework
  - subject: simpy
    predicate: simulates
    object: concurrent-systems
  - subject: non-atomic-resource-release-bug
    predicate: has-flavor-of
    object: concurrency-bug
  - subject: formal-analysis
    predicate: motivation
    object: [oracle-for-OCaml-project, DES-plus-TLA+-on-same-model]
  - subject: formal-methods/folklore
    predicate: states
    object: if-model-checking-finds-no-bugs-the-model-or-properties-are-too-weak
  - subject: formal-analysis/round-1
    predicate: confirms
    object: formal-methods/folklore
  - subject: formal-analysis/round-1
    predicate: result
    object: trivial-structural-properties-only
  - subject: formal-analysis/round-2
    predicate: result
    object: meaningful-simulation-properties-all-pass
  - subject: formal-analysis/round-3
    predicate: result
    object: bug-found-via-rejected-invariant-candidate
related: []
references:
  - url: https://gitlab.com/team-simpy/simpy
    label: SimPy source repository
    description: Upstream GitLab repository for the SimPy framework
  - url: https://gitlab.com/team-simpy/simpy/-/issues/180
    label: "Issue #180: Resource state inconsistent after release"
    description: Bug report filed as a result of this analysis
  - url: https://gitlab.com/team-simpy/simpy/-/merge_requests/37
    label: "MR !37: fix non-atomic resource release"
    description: Patch that propagates resource state changes immediately after put/get
  - url: https://cuihtlauac.pages.dev
    label: promptito (deployed site)
    description: The live blog — llms.txt, feed.json, and all posts
  - url: https://cuihtlauac.pages.dev/feed.json
    label: JSON Feed
    description: Full syndication feed with structured metadata
  - url: https://github.com/cuihtlauac/promptito
    label: promptito project repository
    description: Source code, build system, and all posts
  - url: https://github.com/cuihtlauac/promptito/blob/main/SPEC.md
    label: Promptito Post Format Specification
    description: Self-contained spec for the structured post format
  - url: https://www.fceia.unr.edu.ar/~mcristia/publicaciones/devs-tla.pdf
    label: "Cristia: A TLA+ Encoding of DEVS Models"
    description: The TLA+ encoding of DEVS used in round 2
  - url: https://pron.github.io/files/Trace.pdf
    label: "Pron & Butcher: Verifying Software Traces Against a Formal Specification with TLA+ and TLC"
    description: Methodology for trace validation used in round 3
  - url: https://simpy.readthedocs.io/
    label: SimPy documentation
    description: Official SimPy documentation
license: CC-BY-4.0
---

## Motivation

- Needed a discrete-event simulation (DES) framework that could be paired with TLA+ model checking on the same model — simulate behavior and verify properties over the same system
- Surveyed the DES landscape; SimPy is the standard Python DES framework — process-based, mature, zero dependencies
- SimPy covers simulation but has no formal verification capability; TLA+ covers verification but has no metric-time simulation
- Building a larger project in OCaml — not a SimPy clone but something that subsumes it — details in a future post
- Generally avoid rewriting tools in different programming languages; this case was different because the goal evolved beyond reimplementation
- Needed SimPy as an oracle: a reference implementation to validate the OCaml project against
- Since TLC (the TLA+ model checker) was already at hand, decided to formally analyze SimPy itself — generate properties and check whether execution traces satisfy them

## SimPy's concurrency model

- SimPy simulates concurrent systems: multiple processes share resources, compete for capacity, interrupt each other, and renege on waits
- SimPy itself is single-threaded: processes are Python generator functions (cooperative coroutines) that yield events to suspend; the framework resumes them one at a time via callbacks
- No parallelism, no preemptive scheduling, no data races in the traditional sense
- However, the sequential callback processing within a single simulation time step creates observable intermediate states — one operation completes (release a resource), but its consequence (grant the next queued request) is deferred to a later callback
- This is structurally analogous to a race condition: a process observes state between two operations that should be atomic but aren't
- The single-threaded nature makes this subtle — there is no interleaving of threads, but the deferred callback creates a window of inconsistency within the deterministic execution order
- TLA+ is designed to reason about exactly this kind of interleaving and atomicity; applying it to SimPy's callback scheduling exposed the gap

## Approach: TLA+ trace validation

- Instrument SimPy to emit execution traces (monkey-patch `Environment.step()` and resource methods)
- Encode traces as NDJSON: one record per simulation step, capturing time, action, event type, resource state
- Generate TLA+ trace specifications with model-specific invariants
- Run TLC model checker against the trace specs: does the recorded behavior satisfy the properties?
- Three rounds of increasing depth, each building on the previous

## Round 1: Engine specification

- Hand-wrote TLA+ specifications of the core SimPy engine state machine: event lifecycle, step(), schedule(), process resume, interrupts, conditions, resources
- 6 safety invariants (TypeOK, TimeMonotonic, EventLifecycle, CallbacksCleared, QueueOrdering, SingleActive) + 1 liveness property (TimeoutFires)
- TLC explored 5.1 million states; all properties pass
- Assessment: **properties are trivial** — they are structural consequences of the action definitions, not of SimPy's behavior; they would be violated only by a bug in the TLA+ spec itself
- The engine spec models maximally nondeterministic event triggering (any event can be succeeded/failed at any time); no constraints on who triggers events or why
- Confirms the formal methods folklore: if model checking finds no bugs, the model or properties are probably too weak — not a specific attribution, but a practical consensus echoed by Newcombe et al. (2015, AWS TLA+ experience), Holzmann (SPIN), and others
- Value: confirmed the approach works and the engine mechanism is well-formed; insufficient to find real bugs

## Round 2: DEVS model checking

- Decomposed all 7 SimPy in-repo examples into DEVS atomic and coupled models (JSON format)
- Translated DEVS models to TLA+ using Cristia's encoding (RTnow, RTbound, time advance predicates)
- 24 invariants across 7 models: capacity bounds, conservation laws, mutual exclusion, monotonicity
- All pass; TLC state spaces small (26-59 states per model) due to deterministic times and bounded horizons
- Properties are now **meaningful at the simulation level**: RepairmanCapacity, NoDoubleRepair, ServedOrReneged, FuelBounded, NoLostMessages
- One genuine finding: the Latency DEVS model is lossy (overwrites in-flight messages) while SimPy's Store buffers them — a modeling discrepancy, not a code bug
- Assessment: verifies the DEVS models are correct abstractions, but checks the model, not the code

## Round 3: Trace validation on examples (found the bug)

- Instrumented SimPy, ran all 7 examples, captured 42,480 trace steps
- Generated TLA+ trace specs with 56 invariants: throughput bounds, work conservation, resource consistency, message conservation, preemption semantics, sold-out finality
- All 56 invariants pass in the final run
- **4 invariant candidates were rejected during development**, each revealing something non-obvious:

### Finding 1: In-flight message bound is 3, not 2 (Latency)

- Expected `ceil(delay/period) = ceil(10/5) = 2` messages in flight
- Actual bound is 3: at coinciding send/delivery times, SimPy processes the send before the delivery within the same step
- Insight: event ordering within a single simulation time depends on insertion order (eid), not just time

### Finding 2: Work conservation fails at intra-step granularity (Carwash)

- Attempted: if queue is non-empty, both machines must be busy
- Violated: during sequential callback processing at the same time, one machine is momentarily idle between release and reacquire
- Insight: SimPy's sequential callback processing creates observable transient states within a single time step

### Finding 3: Repairman conservation law was wrong (MachineShop)

- Attempted: `working + broken + repairman_count <= NUM_MACHINES`
- Violated: the repairman does "other_jobs" independently of machines; repairman state is separate from machine state
- Insight: the PreemptiveResource is shared between machine repairs and other tasks; correct law is `working + broken = NUM_MACHINES`

### Finding 4: Resource release-and-reacquire is not atomic (MachineShop)

- Attempted: `broken > 0 AND queue > 0 => repairman_count = 1`
- **Violated at step 58 (time=31.96)**: broken=1, count=0, queue=2
- The repairman finishes a repair; release removes the user synchronously (`count` drops to 0), but the next queued request is granted later via a deferred `_trigger_put` callback
- Between release and callback, `resource.count = 0` while `len(resource.queue) > 0` — the resource appears idle while requests are pending

## The bug

- Root cause in `base.py`: when a `Get` event is created (release path), `_trigger_get(None)` runs synchronously (removes user, decrements level), but `_trigger_put` is appended as a callback on the event — fires only when `step()` processes it later
- The intermediate state is observable by: the releasing process itself, any callback on events processed between release and the deferred trigger, and any monitoring code
- Affects all `BaseResource` subclasses: Resource, PriorityResource, PreemptiveResource, Container, Store, FilterStore, PriorityStore
- **Proof of concept producing wrong simulation results**: a repair shop where Machine-A checks `repairman.count == 0` after release to decide on preventive maintenance; it sees count=0 (repairman "appears idle") while Machine-B's repair request is pending in the queue; preventive maintenance is scheduled incorrectly, distorting utilization and throughput numbers; the error is systematic, not a rare edge case
- Pattern exists in `base.py` since the SimPy 3 rewrite
- Bug report: [Issue #180](https://gitlab.com/team-simpy/simpy/-/issues/180)
- Proposed fix: [MR !37](https://gitlab.com/team-simpy/simpy/-/merge_requests/37) — grant the next queued request synchronously when a put/get succeeds immediately, preserving deferred behavior only for blocked operations

## Methodology notes

- The entire formal analysis (TLA+ specs, DEVS models, tracer, trace validation pipeline) was developed with Claude Code (Claude Opus 4.6) in a single session
- Properties were not hand-picked to find bugs; they were systematically derived from each simulation model's semantics (capacity, conservation, monotonicity, work conservation)
- The bug was found by a rejected invariant candidate — a property that *should* hold but doesn't — not by targeted bug hunting
- Trace validation methodology follows Pron & Butcher (2020): reduce trace-checking to constrained model-checking; the trace spec constrains Init and Next to follow the recorded trace; TLC checks whether the trace is a valid behavior of the spec

## What's next

- The larger OCaml project that motivated this analysis — more than a SimPy clone — is the subject of a future post
- The formal artifacts (TLA+ specs, DEVS models, tracer, trace specs) are in the `formal/` directory of the SimPy fork
