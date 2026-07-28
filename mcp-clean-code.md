​{
 "version": "5.2",
 "name": "Generic Clean Code & Architecture MCP",
 "purpose": "Enforce clean code, modular architecture, maintainable structure, and controlled file organization, while preserving senior-level contextual judgment over dogmatic rule application",

 "philosophy": {
   "statement": "Rules are heuristics, not laws. The mark of seniority is knowing why a rule exists, and therefore when breaking it produces better code. Every quantitative threshold below is a default, not an absolute. Violations are allowed when justified, documented, and reviewed.",
   "principles": [
     "Optimize for the reader, not for the metric",
     "Cohesion beats arbitrary file/function splitting",
     "A rule with no enforcement mechanism is a wish, not a rule",
     "Prefer pragmatism over purity when they conflict",
     "Make the exception explicit, never silent"
   ]
 },

 "principles": [
   "Single Responsibility Principle",
   "Separation of concerns",
   "Modularity and composability",
   "Explicit naming and clarity",
   "Testability first",
   "Low coupling and high cohesion",
   "Dependency inversion (depend on abstractions)",
   "Functional core, imperative shell"
 ],

 "priority": {
   "critical": [
     "singleResponsibility",
     "noMixedResponsibilities",
     "correctLayerSeparation",
     "dependencyInversion",
     "isolatedSideEffects",
     "inputValidationAtBoundaries"
   ],
   "important": [
     "testCoverage",
     "errorTaxonomy",
     "namingConvention",
     "fileStructure",
     "importRules",
     "observability"
   ],
   "optional": [
     "maxLines",
     "maxParameters",
     "maxFunctionsPerFile",
     "complexityLimits"
   ]
 },

 "functionTypes": {
   "transform": {
     "description": "Pure functions that transform data",
     "location": "src/domain/transform",
     "rules": {
       "singleResponsibility": true,
       "pureFunction": true,
       "noSideEffects": true,
       "noBusinessLogic": true,
       "noExternalCalls": true
     }
   },
   "business": {
     "description": "Functions that contain business rules and make decisions",
     "location": "src/domain/business",
     "rules": {
       "singleResponsibility": true,
       "decisionMaking": true,
       "decisionScope": "local",
       "noExternalCalls": true,
       "returnsResultType": "preferred"
     }
   },
   "orchestrator": {
     "description": "Functions that orchestrate flow by composing other functions",
     "location": "src/orchestrators",
     "rules": {
       "noTransformation": true,
       "onlyCallOtherFunctions": true,
       "maxIfStatements": 1,
       "noLoops": true,
       "maxComplexity": "low",
       "note": "See ruleExceptions.orchestratorControlFlow for legitimate violations (sagas, batch, retry, fan-out)."
     }
   },
   "adapter": {
     "description": "Infrastructure boundary: DB, HTTP, queues, filesystem, external APIs. The only place side effects live (imperative shell).",
     "location": "src/adapters",
     "rules": {
       "implementsDomainPort": true,
       "noBusinessLogic": true,
       "noDomainDecisions": true,
       "handlesIOErrorsExplicitly": true,
       "thinByDesign": true
     }
   },
   "repository": {
     "description": "Persistence abstraction returning domain entities, never raw rows/ORM models",
     "location": "src/adapters/repositories",
     "layer": "boundary",
     "rules": {
       "returnsDomainEntities": true,
       "noBusinessLogic": true,
       "implementsDomainPort": true
     }
   },
   "controller": {
     "description": "Transport entry point (HTTP route, CLI command, queue consumer, GraphQL resolver). Thin: parse/authenticate the request, delegate to a service, format the response. Transport-specific.",
     "location": "src/controllers",
     "layer": "boundary",
     "rules": {
       "noBusinessLogic": true,
       "noTransformation": true,
       "noDirectAdapterCalls": true,
       "delegatesToService": true,
       "validatesAndParsesInput": true,
       "translatesErrorsToTransport": true,
       "transportSpecific": true,
       "thinByDesign": true
     }
   },
   "service": {
     "description": "Application use-case / feature owner. Coordinates domain + orchestrators + adapters to fulfill ONE use case. Owns the transaction boundary and authorization. Transport-agnostic (knows nothing about HTTP).",
     "location": "src/services",
     "layer": "application",
     "rules": {
       "ownsUseCase": true,
       "ownsTransactionBoundary": true,
       "ownsAuthorization": true,
       "transportAgnostic": true,
       "callsDomainThroughPorts": true,
       "noTransportTypes": true,
       "noPureTransformation": "delegate to transform",
       "noBusinessDecisions": "delegate to business"
     }
   },
   "validator": {
     "description": "Pure function that checks input validity and returns a Result/typed errors, not a boolean-and-throw. Structural/format validation lives at the boundary; invariant/domain validation lives in business or factories.",
     "location": "src/domain/validators (domain invariants) or src/<layer>/validation (structural)",
     "layer": "pure",
     "rules": {
       "pureFunction": true,
       "returnsResultType": true,
       "noSideEffects": true,
       "noThrowForExpectedInvalidInput": true,
       "structuralAtBoundary": true,
       "invariantInDomain": true
     }
   },
   "factory": {
     "description": "Constructs a domain object (entity or value object) enforcing its invariants. Returns a valid object or a typed error. The only sanctioned place to build domain types.",
     "location": "src/domain/value-objects or src/domain/entities (as named constructors/factories)",
     "layer": "pure",
     "rules": {
       "pureFunction": true,
       "enforcesInvariants": true,
       "returnsResultOrValidObject": true,
       "noSideEffects": true,
       "noExternalCalls": true
     }
   },
   "mapper": {
     "description": "Pure translation across a layer boundary: DTO <-> domain, domain <-> persistence model. Directional and explicit. A specialized, boundary-crossing transform.",
     "location": "src/<layer>/mappers",
     "layer": "pure",
     "rules": {
       "pureFunction": true,
       "noSideEffects": true,
       "noBusinessLogic": true,
       "crossesOneBoundaryOnly": true,
       "directionExplicit": "toDomain / toDto / toPersistence"
     }
   },
   "eventHandler": {
     "description": "Inbound use-case trigger for an asynchronous message/domain event. Controller-like: receives an ALREADY-deserialized message, validates the domain input, delegates to a service, and returns an outcome that decides ack/nack. Contains no transport, protocol, or serialization concern. Must be idempotent.",
     "location": "src/controllers/events",
     "layer": "boundary",
     "subtypeOf": "controller",
     "rules": {
       "noBusinessLogic": true,
       "noTransportOrProtocol": true,
       "noSerialization": true,
       "receivesDeserializedMessage": true,
       "translatesMessageToDomainInput": true,
       "delegatesToService": true,
       "idempotent": true,
       "returnsOutcomeForAckNack": true
     }
   },
   "messagingAdapter": {
     "description": "Infrastructure boundary for a message/queue/stream transport. Owns raw reception, deserialization, protocol specifics, and the ack/nack mechanics. Hands a clean, deserialized message to an eventHandler and applies ack/nack based on the handler's outcome. Contains no business logic and triggers no use case directly.",
     "location": "src/adapters/messaging",
     "layer": "boundary",
     "subtypeOf": "adapter",
     "rules": {
       "noBusinessLogic": true,
       "noUseCaseTrigger": true,
       "handlesProtocolAndSerialization": true,
       "ownsAckNackMechanics": true,
       "deliversToEventHandler": true,
       "thinByDesign": true
     }
   }
 },

 "functionTypeDecisionTree": {
   "purpose": "Deterministic procedure an agent applies to ANY function it must write, to place it in exactly one type. Evaluate steps top to bottom; the FIRST match wins. This is what makes the standard reproducible across agents and prompts.",
   "orderedQuestions": [
     {
       "step": 1,
       "ask": "Is it the entry point of a transport (HTTP/CLI/GraphQL)?",
       "ifYes": "controller"
     },
     {
       "step": 2,
       "ask": "Is it an async entry whose job is to trigger a use case from an already-deserialized message (no protocol/serialization concern)?",
       "ifYes": "eventHandler"
     },
     {
       "step": 3,
       "ask": "Does it perform IO / touch the outside world (DB, HTTP, filesystem, clock, randomness, env, queue, message broker)?",
       "ifYes": "adapter (repository if persistence; messagingAdapter if it owns message reception/serialization/protocol/ack-nack)"
     },
     {
       "step": 4,
       "ask": "Is it the owner of a use-case: does it open a transaction, check authorization, and coordinate domain + adapters for one feature?",
       "ifYes": "service"
     },
     {
       "step": 5,
       "ask": "Does it only sequence/compose other functions, with no decisions, no transformation, no IO of its own?",
       "ifYes": "orchestrator"
     },
     {
       "step": 6,
       "ask": "Does it construct a domain object (entity/value object) while enforcing invariants?",
       "ifYes": "factory"
     },
     {
       "step": 7,
       "ask": "Does it translate data across a layer boundary (DTO<->domain, domain<->persistence)?",
       "ifYes": "mapper"
     },
     {
       "step": 8,
       "ask": "Does it check input validity and return a Result/typed errors?",
       "ifYes": "validator"
     },
     {
       "step": 9,
       "ask": "Does it make a domain decision or enforce a business rule (requires domain knowledge/state)?",
       "ifYes": "business"
     },
     {
       "step": 10,
       "ask": "Does it reshape data purely, within a single layer, with no decision?",
       "ifYes": "transform"
     }
   ],
   "fallback": "If nothing matches, the function is probably doing several things. Split it until each piece matches exactly one type."
 },

 "ambiguousBoundaries": {
   "purpose": "The handful of pairs where agents misclassify most. Crisp rules to break the tie.",
   "serviceVsOrchestrator": {
     "service": "Owns the use-case: transaction boundary, authorization, the 'what' of a feature. Knows the feature exists.",
     "orchestrator": "Dumb composition: sequences calls, owns nothing, makes no decisions, opens no transaction.",
     "rule": "If it opens a transaction or checks authorization -> service. A small feature may have a service and NO orchestrator. An orchestrator never owns a transaction. A service may call one or more orchestrators."
   },
   "controllerVsService": {
     "controller": "Transport-specific (HTTP/CLI/queue). Parses request, formats response, translates errors to status codes.",
     "service": "Transport-agnostic. Knows nothing about HTTP/status codes/request objects.",
     "rule": "If removing HTTP would change the function, it is a controller. If it would not, it is a service. Controllers never contain business logic."
   },
   "validatorVsBusiness": {
     "validator": "Structural/format validity (is this a well-formed email string, is this field present).",
     "business": "Domain invariants and rules (is this user allowed to do X given current state).",
     "rule": "If rejecting the input requires domain knowledge or state, it is business. If it only requires the shape of the data, it is a validator. Boundary structural validation runs first; domain validation runs in the domain."
   },
   "factoryVsTransform": {
     "factory": "Produces a domain type with identity and/or invariants; can fail.",
     "transform": "Reshapes plain data; cannot fail on domain grounds.",
     "rule": "If the output is a domain entity/value object that must be valid by construction -> factory. If it is just a reshaped data structure -> transform."
   },
   "mapperVsTransform": {
     "mapper": "Crosses a layer boundary (DTO<->domain<->persistence).",
     "transform": "Stays within one layer.",
     "rule": "If the function exists because two layers speak different shapes -> mapper. Otherwise -> transform. Both are pure."
   },
   "adapterVsRepository": {
     "adapter": "Any IO to an external system (HTTP client, queue publisher, email, filesystem).",
     "repository": "Specifically persistence of domain entities (the data store).",
     "rule": "Repository is a specialized adapter for the persistence port. Use repository for the data store, adapter for everything else."
   },
   "eventHandlerVsMessagingAdapter": {
     "eventHandler": "Triggers a business use case from a deserialized message. Cares about WHAT the message means.",
     "messagingAdapter": "Receives raw messages, deserializes, handles protocol and ack/nack mechanics. Cares about HOW the message arrives.",
     "rule": "If its primary job is to process data and change system state via a use case -> eventHandler (controller-like). If its primary job is raw reception, serialization, or transport protocol -> messagingAdapter (infrastructure). The adapter feeds the handler; never merge them."
   }
 },

 "domainModeling": {
   "enabled": true,
   "concepts": {
     "entity": "Object with identity and lifecycle. Lives in src/domain/entities.",
     "valueObject": "Immutable, equality by value, self-validating (e.g. Email, Money). Lives in src/domain/value-objects.",
     "dto": "Data transfer object at API/transport boundaries. Never leaks into domain. Lives in src/<layer>/dto.",
     "port": "Interface defined by the domain, implemented by adapters (dependency inversion). Lives in src/domain/ports.",
     "aggregate": "Consistency boundary grouping entities; mutated through a single root."
   },
   "rules": [
     "Domain models must not depend on framework, ORM, or transport types",
     "Validate and construct value objects at the boundary, pass them inward",
     "Map DTO to domain on the way in, domain to DTO on the way out",
     "Domain defines ports (interfaces); infrastructure implements them"
   ]
 },

 "dependencyInjection": {
   "enabled": true,
   "required": true,
   "rules": [
     "Inject dependencies via constructor or function parameters; never instantiate them inline",
     "Depend on abstractions (ports/interfaces), not concrete implementations",
     "Wire concrete implementations only in the composition root",
     "No service locator / global singletons for domain dependencies",
     "Time, randomness, IO, and clocks are dependencies and must be injectable for testing"
   ],
   "compositionRoot": {
     "location": "src/main or src/bootstrap",
     "note": "The one place allowed to know concrete implementations and violate maxParameters/maxLines for wiring."
   }
 },

 "sideEffectIsolation": {
   "pattern": "functional core, imperative shell (hexagonal / ports & adapters)",
   "rules": [
     "Pure decision logic in domain (transform + business)",
     "All IO and side effects pushed to adapters at the edges",
     "Orchestrators sequence pure logic and adapter calls but contain neither",
     "No hidden side effects: a function's signature must reveal its effects (return type, async, or injected effectful dependency)"
   ]
 },

 "functionRules": {
   "maxLines": 40,
   "maxParameters": 3,
   "maxNestedDepth": 2,
   "maxCyclomaticComplexity": 10,
   "maxCognitiveComplexity": 15,
   "mustHaveExplicitName": true,
   "mustDoOneThing": true,
   "mustReturnValue": true,
   "preferGuardClauses": true,
   "note": "All numeric limits are defaults. See ruleExceptions for sanctioned overrides."
 },

 "fileOrganization": {
   "groupByResponsibility": true,
   "minFunctionsPerFile": 1,
   "maxFunctionsPerFile": 5,
   "maxLinesPerFile": 300,
   "colocationPreferred": "Tests and small helpers may colocate with the unit they serve",
   "rules": [
     "Do not create extremely large files",
     "Do not create excessive numbers of tiny files (file explosion is also an anti-pattern)",
     "Group related functions logically by cohesion, not by arbitrary count",
     "Split files when complexity grows, not when a counter trips",
     "Prefer cohesion over the function-count limit when they conflict"
   ]
 },

 "projectStructure": {
   "root": "src",
   "folders": {
     "controllers": "Transport entry points (HTTP, CLI, GraphQL) + event use-case triggers under controllers/events. Thin: parse, authenticate, delegate to service, format response.",
     "services": "Application use-cases. Own transaction + authorization, coordinate domain + adapters. Transport-agnostic.",
     "domain": {
       "transform": "Pure data transformation",
       "business": "Business rules and decisions",
       "entities": "Entities with identity",
       "value-objects": "Immutable self-validating values (with factories)",
       "validators": "Pure domain-invariant validation returning Result",
       "ports": "Interfaces the domain depends on (implemented by adapters)"
     },
     "orchestrators": "Flow composition (no decisions, no IO, no transaction)",
     "adapters": "Infrastructure boundary: DB via repositories, HTTP, fs, and messaging under adapters/messaging (raw reception, serialization, protocol, ack/nack)",
     "mappers": "Pure cross-boundary translation (DTO<->domain<->persistence)",
     "utils": "Pure, dependency-free shared helpers",
     "config": "Configuration loading and validation",
     "main": "Composition root / bootstrap / DI wiring"
   }
 },

 "testing": {
   "enabled": true,
   "required": true,
   "philosophy": "Tests are a first-class deliverable, not an afterthought. Untested code is legacy code the moment it is written.",
   "pyramid": {
     "unit": "Majority. Pure domain logic, no IO, fast, deterministic.",
     "integration": "Adapters against real or containerized dependencies (DB, queues).",
     "e2e": "Few. Critical user journeys end to end.",
     "contract": "For service boundaries and external API consumers/providers."
   },
   "coverage": {
     "domainLogic": 90,
     "overall": 80,
     "note": "Coverage is a floor and a smell detector, not a goal. 100% coverage of trivial code is waste; 0% of domain logic is negligence."
   },
   "rules": [
     "Test behavior and contracts, not implementation details",
     "One logical assertion focus per test; arrange-act-assert structure",
     "Tests must be deterministic (inject clock, randomness, IO)",
     "No shared mutable state between tests",
     "Mock only at architectural boundaries (ports/adapters), never internal domain functions",
     "Name tests as 'should <behavior> when <condition>'",
     "Every bug fix starts with a failing regression test"
   ],
   "location": "colocated (*.test.*) or mirrored under tests/",
   "approach": "TDD encouraged for domain logic and bug fixes; not mandated for exploratory spikes"
 },

 "errorHandling": {
   "required": true,
   "taxonomy": {
     "domainError": "Expected business-rule violations (e.g. InsufficientFunds). Often modeled as return values.",
     "validationError": "Invalid input at boundaries.",
     "technicalError": "Infrastructure/IO failures (DB down, timeout). Retryable or fatal.",
     "programmerError": "Bugs (null deref, invariant broken). Should crash loudly, not be caught and swallowed."
   },
   "rules": [
     "Distinguish expected (domain) errors from unexpected (technical) errors",
     "Prefer Result/Either return types for expected domain errors over throwing",
     "Reserve exceptions for truly exceptional/technical conditions",
     "Never swallow errors silently; never catch-all without rethrow or explicit handling",
     "Use explicit, typed errors with actionable messages; no generic 'Error'",
     "Errors crossing a boundary must be translated (no leaking stack traces or ORM errors to clients)",
     "Handle edge cases explicitly; fail fast on programmer errors",
     "Attach correlation/trace IDs to errors for observability"
   ]
 },

 "observability": {
   "enabled": true,
   "required": true,
   "logging": {
     "structured": true,
     "format": "JSON",
     "rules": [
       "Structured key-value logs, never string concatenation",
       "Log levels used correctly (debug/info/warn/error)",
       "Never log secrets, credentials, tokens, or PII",
       "Include correlation/request/trace IDs on every log line",
       "Log the 'why' (decision context), not just the 'what'"
     ]
   },
   "metrics": [
     "Expose key business and technical metrics (latency, error rate, throughput)",
     "Use RED (Rate, Errors, Duration) for services and USE for resources"
   ],
   "tracing": [
     "Propagate distributed trace context across service and adapter boundaries",
     "Span around every IO call"
   ]
 },

 "security": {
   "enabled": true,
   "required": true,
   "rules": [
     "Validate and sanitize all input at the boundary, before it reaches the domain",
     "Authentication and authorization checks at entry points, never in domain logic",
     "Authorize on every request; never trust client-supplied identity or role claims blindly",
     "No secrets in code or version control; load from a secret manager or environment",
     "Follow OWASP Top 10 mitigations (injection, broken access control, etc.)",
     "Classify and protect PII; encrypt sensitive data at rest and in transit",
     "Parameterized queries only; never string-build SQL or shell commands",
     "Rate limit and throttle public entry points",
     "Apply least privilege to all credentials and service accounts",
     "Keep dependencies patched; run automated vulnerability scanning"
   ]
 },

 "asyncAndResilience": {
   "enabled": true,
   "rules": [
     "Async functions must propagate, not swallow, rejections",
     "Every IO call has an explicit timeout",
     "Use retries with exponential backoff and jitter for transient failures only",
     "Make externally-triggered operations idempotent (idempotency keys)",
     "Apply circuit breakers to unstable downstream dependencies",
     "Wrap multi-step persistence in transactions (unit of work); define rollback/compensation",
     "Avoid unbounded concurrency; bound parallelism and queue depth",
     "Design for at-least-once delivery (assume duplicates)"
   ]
 },

 "configuration": {
   "enabled": true,
   "rules": [
     "Twelve-factor: configuration comes from the environment, not from code",
     "Separate config per environment (dev/staging/prod) without code changes",
     "Validate configuration at startup; fail fast on missing/invalid config",
     "Secrets are never plain config; load from a secret manager",
     "Feature flags for incremental rollout and kill switches",
     "No magic numbers or strings; promote to named, typed config or constants"
   ]
 },

 "indexFiles": {
   "enabled": true,
   "required": false,
   "rules": [
     "Use index/barrel files to define a folder's public API and hide internals",
     "Barrel files are optional and context-dependent",
     "Do NOT use barrels where they create circular dependencies or defeat tree-shaking (see ruleExceptions.barrelFiles)"
   ]
 },

 "importRules": {
   "noDeepImports": "default",
   "throughIndexOnly": "default",
   "useAliases": true,
   "rules": [
     "Prefer importing from a module's public API (index) over reaching into internals",
     "Use path aliases over long relative paths",
     "Keep imports readable and centralized",
     "Allow deep imports when barrels harm bundle size, tree-shaking, or cause cycles"
   ]
 },

 "dependencyRules": {
   "noCircularDependencies": true,
   "allowedFlow": [
     "controller -> service",
     "eventHandler -> service",
     "messagingAdapter -> eventHandler",
     "service -> orchestrator",
     "service -> domain",
     "orchestrator -> domain",
     "orchestrator -> ports",
     "adapter -> ports (implements)",
     "domain -> utils"
   ],
   "forbiddenFlow": [
     "domain -> adapter (domain must not know infrastructure)",
     "domain -> framework",
     "utils -> domain"
   ]
 },

 "typing": {
   "enabled": true,
   "rules": [
     "Strict type checking enabled; no implicit any",
     "Forbid 'any'; use 'unknown' plus narrowing at boundaries",
     "Validate external data against a schema at the boundary (parse, don't assume)",
     "Prefer type inference where it is clear; annotate public APIs and non-obvious returns",
     "Make illegal states unrepresentable via the type system (discriminated unions, branded types)",
     "No magic numbers/strings; use named constants or enums"
   ]
 },

 "naming": {
   "style": "camelCase",
   "rules": [
     "Function names must describe a single action (verb + noun)",
     "Avoid vague names (data, handle, process, manager, util) without qualification",
     "Boolean names read as predicates (isX, hasX, canX)",
     "Names reveal intent; length is proportional to scope"
   ]
 },

 "dataRules": {
   "inputValidation": true,
   "sanitizeInputs": true,
   "noNullPropagation": true,
   "explicitTypesPreferred": true,
   "validateAtBoundary": true,
   "immutableByDefault": true
 },

 "documentation": {
   "enabled": true,
   "rules": [
     "Comments explain WHY, not WHAT; the code shows the what",
     "Public APIs documented with JSDoc/docstrings (params, returns, throws)",
     "Architecture Decision Records (ADRs) for significant, irreversible, or contested decisions",
     "README per module describing its responsibility and public API",
     "No commented-out code in version control",
     "Keep documentation next to code and update it in the same change"
   ]
 },

 "tooling": {
   "enabled": true,
   "required": true,
   "note": "Enforcement without automation is opinion. These rules give the declarative checks teeth.",
   "static": [
     "Linter with the architecture and complexity rules encoded",
     "Auto-formatter (no style debates in review)",
     "Type checker in strict mode",
     "Dependency-cycle detector",
     "Import-boundary linter (enforce allowedFlow/forbiddenFlow)"
   ],
   "preCommit": [
     "Run linter, formatter, type-check, and affected unit tests before commit"
   ],
   "ci": {
     "qualityGates": [
       "All tests pass",
       "Coverage thresholds met",
       "No lint or type errors",
       "No new high/critical vulnerabilities",
       "No circular dependencies introduced"
     ],
     "blockMergeOnFailure": true
   }
 },

 "enforcement": {
   "autoSplitFunctions": "suggest, do not force",
   "rejectIfMultipleResponsibilities": true,
   "enforceLayerSeparation": true,
   "enforceViaTooling": true,
   "note": "Mechanical limits (lines, params, file count) are advisory and tool-warned, not hard-rejected. Architectural rules (layer separation, dependency direction, SRP) are hard-enforced."
 },

 "validation": {
   "postGenerationChecks": [
     "singleResponsibilityPerFunction",
     "noMixedFunctionTypes",
     "correctFolderPlacement",
     "dependencyDirectionRespected",
     "sideEffectsIsolatedToAdapters",
     "inputValidatedAtBoundary",
     "testsPresentForDomainLogic",
     "errorsTypedAndTranslated",
     "noSecretsInCode",
     "noBannedAnyTypes",
     "fileSizeWithinLimitsOrJustified"
   ]
 },

 "qualityChecks": {
   "enabled": true,
   "note": "Weights below are a rubric for human/automated review, NOT a precise computed score. Each criterion maps to concrete, measurable signals listed in 'measurement'. A number with no measurement method is theater; these have one.",
   "criteria": {
     "singleResponsibility": 25,
     "testability": 20,
     "readability": 15,
     "modularity": 15,
     "correctLayering": 15,
     "naming": 10
   },
   "measurement": {
     "singleResponsibility": "Reasons-to-change count; cyclomatic/cognitive complexity per unit; mixed function-type detection",
     "testability": "Coverage of domain logic; ratio of injectable vs hardcoded dependencies; presence of side effects in pure layers",
     "readability": "Cognitive complexity; nesting depth; naming-lint pass rate; review feedback",
     "modularity": "Coupling (fan-in/fan-out); circular-dependency count; public-API surface size",
     "correctLayering": "Import-boundary violations; forbiddenFlow violations",
     "naming": "Naming-lint pass rate; vague-name detector hits"
   },
   "minScore": 80,
   "scoringNote": "Treat as a review aid surfacing weak areas, not a gate that blocks on a single decimal."
 },

 "ruleExceptions": {
   "philosophy": "This section is the heart of senior judgment. For each commonly dogmatic rule: why it exists, the EXHAUSTIVE list of legitimate cases to break it, and the guardrail that keeps the exception honest. An undocumented violation is a defect; a documented, justified one is engineering.",
   "globalGuardrail": "When breaking any rule, leave an inline annotation explaining the why, and ensure the alternative would genuinely be worse. The exception must serve the reader, not the author's convenience.",

   "orchestratorControlFlow": {
     "rule": "maxIfStatements: 1, noLoops in orchestrators",
     "whyItExists": "Keep orchestrators as readable, flat composition with low cyclomatic complexity; push branching into business functions and transformation into transforms.",
     "breakWhen": [
       "Saga / process manager: sequencing steps with compensating transactions inherently needs ordered branching and conditional rollback",
       "Batch processing: iterating over a collection of items is the orchestrator's actual job (loop is irreducible)",
       "Fan-out / fan-in: mapping a list of inputs to parallel calls then aggregating requires iteration",
       "Retry / polling loops: bounded retry with backoff is control flow that belongs at the orchestration edge",
       "Guard clauses: multiple early-return ifs that validate preconditions read far better flat than extracted",
       "Pagination: looping until cursor exhaustion to drain a paged source",
       "State-machine driven flows: a switch over states is clearer than artificial decomposition",
       "Short-circuit on first success/failure across several attempts (fallback chains)"
     ],
     "guardrail": "Extract the body of any loop/branch into a named function so the orchestrator still reads as composition. Keep the iteration/branching skeleton thin and intention-revealing. If branching encodes a business decision, move that decision into a business function and let the orchestrator branch on its typed result."
   },

   "maxLines": {
     "rule": "maxLines: 40 per function",
     "whyItExists": "Long functions usually do more than one thing and are hard to test and read.",
     "breakWhen": [
       "Exhaustive switch/match over a domain enum or discriminated union (state reducers, command handlers): splitting scatters cohesive logic and hurts exhaustiveness checking",
       "Linear, branchless data mapping (large DTO <-> domain mappers): the length is field count, not complexity",
       "Cohesive algorithm that loses meaning when fragmented (parsers, tokenizers, numerical/geometry routines)",
       "Composition root / DI wiring: long by nature and clearer kept in one place",
       "Test functions: arrange-act-assert with elaborate fixtures legitimately runs long",
       "Generated code",
       "Configuration objects / schema definitions expressed as code",
       "A sequence of guard clauses validating many preconditions"
     ],
     "guardrail": "Length is acceptable only when cyclomatic AND cognitive complexity stay low and the function still does ONE thing. Long-but-flat is fine; long-and-deep is not. If you cannot name a clean extraction, forcing one is worse."
   },

   "maxParameters": {
     "rule": "maxParameters: 3",
     "whyItExists": "Many positional parameters are error-prone and often signal a function doing too much or a missing abstraction.",
     "breakWhen": [
       "Constructor injection at the composition root or in a service legitimately coordinating several collaborators (prefer a dependencies object, but the count itself is not the smell)",
       "An options/config object passed as a single named parameter (this is the preferred fix, not a violation)",
       "Framework-imposed signatures (middleware (req,res,next,err), React component props, event handlers)",
       "Pure mathematical/geometric functions where the parameters are the irreducible inputs (x, y, z, w)",
       "Curried or partially-applied functions where arity is intentional",
       "Interop with an external API whose signature you do not control"
     ],
     "guardrail": "If you exceed 3 because of behavior (not data), treat it as a SRP smell and decompose. If it is genuinely cohesive data, pass a single named parameter object so call sites stay self-documenting. More than ~4 INJECTED collaborators is a real signal the unit has too many responsibilities."
   },

   "maxFunctionsPerFile": {
     "rule": "maxFunctionsPerFile: 5",
     "whyItExists": "Prevent god-files and encourage cohesion.",
     "breakWhen": [
       "A single cohesive value object/entity with many small methods belongs together, not scattered across files",
       "A reducer/handler with one case-function per action that are meaningless apart",
       "Index/barrel files that only re-export",
       "Test files mirroring many cases of one unit",
       "Lookup/dispatch tables of small pure functions keyed by type",
       "Tightly-coupled private helpers that exist only to serve one public function (keep them adjacent, not exported)"
     ],
     "guardrail": "Cohesion is the real criterion: would a reader expect these together? If yes, keep them. The anti-pattern to avoid is BOTH the god-file AND the explosion of single-line files. Split on responsibility boundaries, not on a counter."
   },

   "maxLinesPerFile": {
     "rule": "maxLinesPerFile: 300",
     "whyItExists": "Large files are hard to navigate and usually mix concerns.",
     "breakWhen": [
       "Generated files (do not hand-split)",
       "Large but flat constant/lookup tables or schema definitions",
       "A single cohesive class/module whose split would create artificial coupling",
       "Comprehensive test suites for one unit"
     ],
     "guardrail": "Acceptable when the file has ONE responsibility despite its length. Split only when distinct concerns appear, not to satisfy the line count."
   },

   "maxNestedDepth": {
     "rule": "maxNestedDepth: 2",
     "whyItExists": "Deep nesting is the strongest correlate of unreadable code.",
     "breakWhen": [
       "Recursive tree/graph traversal where depth mirrors the structure",
       "Genuinely nested domain data you do not control (parsing nested formats)"
     ],
     "guardrail": "First exhaust guard clauses, early returns, and extraction. Real nesting is acceptable only when it reflects irreducibly nested structure; cosmetic nesting is not."
   },

   "purityInTransforms": {
     "rule": "transform.pureFunction / noSideEffects",
     "whyItExists": "Pure transforms are trivially testable and composable.",
     "breakWhen": [
       "Internal memoization/caching (referentially transparent side effect, observably pure)",
       "Defensive copying that allocates but does not mutate inputs"
     ],
     "guardrail": "The function must remain observably pure: same input -> same output, no externally visible effect. Logging, IO, randomness, time, or mutation of inputs are never allowed here."
   },

   "businessLogicBoundary": {
     "rule": "transform.noBusinessLogic / business.decisionScope: local",
     "whyItExists": "Keep transformation and decision-making separable and individually testable.",
     "breakWhen": [
       "Trivial domain-flavored mapping (e.g. label selection) where forcing a separate business function adds indirection without value",
       "A decision and its transformation are atomically coupled and splitting harms readability"
     ],
     "guardrail": "Default to separation. Merge only when the combined unit is small, has one reason to change, and the split would be pure ceremony."
   },

   "barrelFiles": {
     "rule": "indexFiles.required / throughIndexOnly / noDeepImports",
     "whyItExists": "Barrels define a clean public API and hide internals.",
     "breakWhen": [
       "Barrels create circular dependencies (a common, hard-to-debug failure mode)",
       "Barrels defeat tree-shaking and bloat bundles in frontend/serverless code",
       "Barrels slow cold-start by eagerly loading a whole folder when one symbol was needed",
       "Monorepo/package boundaries where deep imports into a published subpath are the intended API"
     ],
     "guardrail": "Prefer barrels for stable public module APIs; allow deep imports where bundle size, startup time, or cycles make barrels harmful. Measure before mandating. This is a real case where the 'clean' rule is often the wrong default in modern JS/TS."
   },

   "explicitTypes": {
     "rule": "explicitTypesPreferred",
     "whyItExists": "Explicit types document intent and catch errors.",
     "breakWhen": [
       "Local variables with obvious inferred types (annotation is noise)",
       "Inferred return types of small internal functions"
     ],
     "guardrail": "Always annotate public API signatures and non-obvious returns; let inference handle the obvious. Explicitness serves the reader, it is not a tax to pay everywhere."
   },

   "noCircularDependencies": {
     "rule": "noCircularDependencies: true",
     "whyItExists": "Cycles couple modules, break initialization order, and resist testing/refactoring.",
     "breakWhen": [
       "Effectively never at the module/architecture level"
     ],
     "guardrail": "Mutually recursive TYPES are fine; mutually dependent MODULES are not. Break cycles by extracting the shared abstraction or inverting a dependency via a port. This rule has essentially no legitimate exception and stays hard-enforced."
   },

   "backwardCompatibility": {
     "rule": "governance.backwardCompatibility (was: false)",
     "whyItExists": "The original 'false' default was a red flag: silently breaking consumers is rarely acceptable.",
     "policy": "Default is now CONTEXT-DEPENDENT, not 'break freely'.",
     "breakWhen": [
       "Pre-1.0 / internal-only code with no external consumers: breaking changes are cheap and fine",
       "Spikes, prototypes, throwaway code",
       "Behind a feature flag not yet released",
       "A security or correctness fix where preserving the broken contract is worse than breaking it (document and communicate)"
     ],
     "doNotBreakWhen": [
       "Published libraries / public APIs / shared platform code with external consumers",
       "Anything covered by a stability or semver commitment"
     ],
     "guardrail": "For public surfaces: follow semver, deprecate before removing, provide a migration path and changelog entry, and give consumers a deprecation window. Breaking compatibility is a deliberate, announced decision, never a default."
   },

   "tddMandate": {
     "rule": "TDD / test-first",
     "whyItExists": "Test-first drives better design and guarantees coverage.",
     "breakWhen": [
       "Exploratory spikes where the design is unknown (throw the spike away, then build test-first)",
       "Pure UI/visual tweaks better verified by snapshot or visual review",
       "Glue/config code with no logic worth a unit test"
     ],
     "guardrail": "TDD stays mandatory for domain logic and every bug fix (regression test first). Relax only where a test would assert trivia or where design must be discovered first."
   }
 },

 "selfImprovement": {
   "allowRefactoring": true,
   "refactorIfScoreBelow": 80,
   "boyScoutRule": "Leave code cleaner than you found it, scoped to the change",
   "rules": [
     "Refactor under green tests only",
     "Separate refactoring commits from behavior changes",
     "Do not gold-plate: refactor what the current change touches, not the whole codebase"
   ]
 },

 "outputConstraints": {
   "mustInclude": [
     "modularFunctions",
     "transformFunctions",
     "businessFunctions",
     "orchestrator",
     "ports/adapters for any IO",
     "dependencyInjectionAtCompositionRoot",
     "inputValidationAtBoundary",
     "typedErrorHandling",
     "tests for domain logic",
     "properFolderStructure"
   ],
   "mustJustify": [
     "Any violation of a numeric functionRules/fileOrganization limit",
     "Any deviation from allowedFlow",
     "Any backward-incompatible change to a public surface"
   ]
 },

 "codeStyle": {
   "forbidden": [
     "emojis",
     "commented-out code",
     "magic numbers and strings",
     "TODO without a tracking reference"
   ],
   "rules": [
     "Code must not contain emojis",
     "Keep formatting clean, consistent, and tool-enforced",
     "Immutability by default"
   ]
 },

 "instructions": {
   "codeGeneration": [
     "Analyze the problem and split into transform / business / orchestrator / adapter responsibilities",
     "Model the domain (entities, value objects, ports) before wiring",
     "Isolate every side effect into an adapter behind a port",
     "Inject dependencies; wire concretes only at the composition root",
     "Validate and type all input at the boundary",
     "Return typed errors; translate them at boundaries",
     "Write tests for domain logic alongside the code",
     "Add structured logging and trace propagation around IO",
     "Keep functions small and focused, but prefer cohesion over arbitrary splitting",
     "Avoid both large monolithic files and excessive fragmentation",
     "When breaking any limit, annotate the justification inline",
     "Ensure architectural consistency (dependency direction, layer separation)"
   ]
 },

 "antiPatterns": [
   "multi-purpose functions",
   "mixed transformation and logic",
   "complex orchestrators",
   "deep nested logic",
   "large monolithic files",
   "too many small scattered files",
   "deep relative imports without need",
   "barrel files causing cycles or bloating bundles",
   "circular dependencies",
   "side effects leaking into the domain",
   "domain depending on infrastructure or frameworks",
   "hardcoded dependencies (no DI)",
   "swallowed or generic errors",
   "untested domain logic",
   "secrets in code",
   "use of 'any'",
   "magic numbers and strings",
   "dogmatic application of metrics against readability",
   "silent backward-incompatible changes to public APIs",
   "use of emojis in code"
 ],

 "governance": {
   "versioning": true,
   "changelogRequired": true,
   "backwardCompatibility": "context-dependent (see ruleExceptions.backwardCompatibility)",
   "semverForPublicApis": true,
   "deprecationPolicy": "Deprecate with a migration path and a window before removal",
   "adrRequiredForSignificantDecisions": true
 }
}