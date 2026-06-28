<!-- headroom:rtk-instructions -->
# RTK (Rust Token Killer) - Token-Optimized Commands

When running shell commands, **always prefix with `rtk`**. This reduces context
usage by 60-90% with zero behavior change. If rtk has no filter for a command,
it passes through unchanged — so it is always safe to use.

## Key Commands
```bash
# Git (59-80% savings)
rtk git status          rtk git diff            rtk git log

# Files & Search (60-75% savings)
rtk ls <path>           rtk read <file>         rtk grep <pattern>
rtk find <pattern>      rtk diff <file>

# Test (90-99% savings) — shows failures only
rtk pytest tests/       rtk cargo test          rtk test <cmd>

# Build & Lint (80-90% savings) — shows errors only
rtk tsc                 rtk lint                rtk cargo build
rtk prettier --check    rtk mypy                rtk ruff check

# Analysis (70-90% savings)
rtk err <cmd>           rtk log <file>          rtk json <file>
rtk summary <cmd>       rtk deps                rtk env

# GitHub (26-87% savings)
rtk gh pr view <n>      rtk gh run list         rtk gh issue list

# Infrastructure (85% savings)
rtk docker ps           rtk kubectl get         rtk docker logs <c>

# Package managers (70-90% savings)
rtk pip list            rtk pnpm install        rtk npm run <script>
```

## Rules
- In command chains, prefix each segment: `rtk git add . && rtk git commit -m "msg"`
- For debugging, use raw command without rtk prefix
- `rtk proxy <cmd>` runs command without filtering but tracks usage
<!-- /headroom:rtk-instructions -->

<!-- headroom:agent-skills -->
# Agent Skills - OpenCode Integration

## Core Rules
- If a task matches a skill, you MUST invoke it via the `skill` tool
- Skills are located in `~/.agents/skills/<skill-name>/SKILL.md`
- Never implement directly if a skill applies
- Always follow the skill instructions exactly (do not partially apply them)

## Intent -> Skill Mapping
Map user intent to skills automatically:
- Feature / new functionality -> `spec-driven-development`, then `incremental-implementation`, `test-driven-development`
- Planning / breakdown -> `planning-and-task-breakdown`
- Bug / failure / unexpected behavior -> `debugging-and-error-recovery`
- Code review -> `code-review-and-quality`
- Refactoring / simplification -> `code-simplification`
- API or interface design -> `api-and-interface-design`
- UI work -> `frontend-ui-engineering`
- Security concerns -> `security-and-hardening`
- Performance issues -> `performance-optimization`
- Shipping / deployment -> `shipping-and-launch`

## Lifecycle Mapping (Implicit Commands)
- DEFINE -> `spec-driven-development`
- PLAN -> `planning-and-task-breakdown`
- BUILD -> `incremental-implementation` + `test-driven-development`
- VERIFY -> `debugging-and-error-recovery`
- REVIEW -> `code-review-and-quality`
- SHIP -> `shipping-and-launch`

## Execution Model
For every request:
1. Determine if any skill applies (even 1% chance)
2. Invoke the appropriate skill using the `skill` tool
3. Follow the skill workflow strictly
4. Only proceed to implementation after required steps (spec, plan, etc.) are complete

## Anti-Rationalization
The following thoughts are incorrect:
- "This is too small for a skill"
- "I can just quickly implement this"
- "I'll gather context first"

Correct behavior: Always check for and use skills first.
<!-- /headroom:agent-skills -->

<!-- headroom:ponytail -->
# Ponytail - Lazy Senior Dev Mode

Before writing any code, stop at the first rung that holds:

1. Does this need to be built at all? (YAGNI)
2. Does it already exist in this codebase? Reuse, don't rewrite.
3. Does the standard library already do this? Use it.
4. Does a native platform feature cover it? Use it.
5. Does an already-installed dependency solve it? Use it.
6. Can this be one line? Make it one line.
7. Only then: write the minimum code that works.

**Bug fix = root cause, not symptom:** fix the shared function once, not each caller.

Rules:
- No abstractions not explicitly requested. No new dependency if avoidable.
- Deletion over addition. Boring over clever. Fewest files possible.
- Shortest working diff wins, but only once you understand the problem.
- Mark intentional simplifications with `ponytail:` comment naming the ceiling and upgrade path.
- Non-trivial logic leaves ONE runnable check behind (assert or one small test; no frameworks).
- Trivial one-liners need no test.

Not lazy about: understanding the problem, input validation at trust boundaries, error handling preventing data loss, security, accessibility, anything explicitly requested.
<!-- /headroom:ponytail -->
