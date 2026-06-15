# Claude Code — Project Guidelines

## Contents

- [Projects](#projects)
- [1. Behavioral Guidelines](#1-behavioral-guidelines)
- [2. Hard Prohibitions](#2-hard-prohibitions)
  - [Commit Rule](#commit-rule)
  - [Archive Rule](#archive-rule)
  - [Deployment Rule](#deployment-rule)
- [3. Workflow Rules](#3-workflow-rules)
  - [Import Rule](#import-rule)
  - [Adding New Views](#adding-new-views)
  - [Component Reuse Rule](#component-reuse-rule)
- [Shared Component Reference](docs/component-reference.md)

---

## Projects

The prototype hosts several independent sub-projects. The rules in this file are
repo-wide and apply to all of them. Each sub-project has its own guide — **read
the relevant one before starting work on that project.**

| Project | Folder | Read first |
|---------|--------|------------|
| Main OM-redesign | `src/views/`, `src/components/shared/` | this file + [docs/component-reference.md](docs/component-reference.md) |
| ConversionLift (CRO tool) | `src/conversionlift/` | **[docs/conversionlift-implementation.md](docs/conversionlift-implementation.md) — the as-built baseline (read first, build on it)** · [docs/conversionlift-spec-v1.md](docs/conversionlift-spec-v1.md) — domain model · [docs/conversionlift-flows-v1.md](docs/conversionlift-flows-v1.md) — the 3 flows |
| Opticube | `src/opticube/` | [docs/opticube-guide.md](docs/opticube-guide.md) — tokens, CSS, `Oc*` components |

**ConversionLift baseline:** the store page, in-context suggestion overlay, the 3
flows, components, and mock layer in [docs/conversionlift-implementation.md](docs/conversionlift-implementation.md)
are the established foundation. Build on them and reuse them (`ClStorePage`,
`ClRegion`, the step components, `flowDemo`/mock layer) — don't rebuild from scratch.

---

## 1. Behavioral Guidelines

How to work. Behavioral rules to reduce common LLM coding mistakes.
**Tradeoff:** these bias toward caution over speed. For trivial tasks, use judgment.

### Think Before Coding
**Don't assume. Don't hide confusion. Surface tradeoffs.**
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them, don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### Simplicity First
**Minimum code that solves the problem. Nothing speculative.**
- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.
- Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.
- See also [Component Reuse Rule](#component-reuse-rule): the concrete application of this principle in this codebase.

### Surgical Changes
**Touch only what you must. Clean up only your own mess.**
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it, don't delete it.
- Remove imports/variables/functions that YOUR changes made unused; leave pre-existing dead code unless asked.
- The test: every changed line should trace directly to the user's request.

### Goal-Driven Execution
**Define success criteria. Loop until verified.**
- "Add validation" becomes "Write tests for invalid inputs, then make them pass".
- "Fix the bug" becomes "Write a test that reproduces it, then make it pass".
- "Refactor X" becomes "Ensure tests pass before and after".
- For multi-step tasks, state a brief plan with a verify check per step.
- Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

## 2. Hard Prohibitions

Absolute "never" rules. These override convenience and any default behavior.

### Commit Rule

**NEVER commit or push unless the user explicitly asks.**
Do not run `git commit`, `git push`, or `vercel --prod` unless the user specifically requests it in their message.

### Archive Rule

**NEVER read, edit, or modify any view file that has `status: 'archived'` in `src/registry/views.js`, or any file in an `_archive/` folder.**
These are frozen historical versions kept for reference only. The single source of truth is the `status` field in `src/registry/views.js`.

To check if a view is archived: look for its entry in `src/registry/views.js` and check if `status: 'archived'`.
Also never touch: `src/views/_archive/` (entire folder)

### Deployment Rule

**Deploy using Vercel, not Netlify.**
Run `vercel --prod` to deploy to production.

---

## 3. Workflow Rules

How to make changes correctly in this codebase.

### Import Rule

**Every component, icon, or utility used in a file MUST be explicitly imported in that file's `<script setup>` block.**
Before using any component or icon, verify it is already imported. If not, add the import immediately — never assume global registration.

### Adding New Views

**When creating any new view, ALWAYS follow these steps — no exceptions:**

1. Create the `.vue` file in `src/views/`
2. **Register it** in `src/registry/views.js` — add an object to the appropriate category array with at minimum: `id`, `component: () => import(...)`, `label`, `status`, `section`, `hideLogo: true`
3. **Add props** in `src/App.vue` → `activeProps` computed (only if the view receives props)
4. **Add events** in `src/App.vue` → `activeEvents` computed (only if the view emits events)
5. **If the view needs a session reset on navigate** (e.g. wizard flows, registration), add `nav: { sessionReset: true, flowSelected: true }` to the registry entry and optionally `keyPrefix` for the component key

DevNavBar sections, archive dropdown, and logo visibility all derive from the registry automatically — NEVER add views to these manually.

The `section` field controls which DevNavBar dropdown group the view appears in. Valid values: `'home'`, `'campaigns'`, `'campaignPage'`, `'analytics'`, `'ppo'`, `'ppoV1'`, `'aiContent'`, or `null` (no section).

### Component Reuse Rule

**Before writing any button, input, dropdown, checkbox, toggle, accordion, multi-select, time-picker, chat panel, or tag/badge from raw HTML/Tailwind, always check `src/components/shared/` first and use the matching shared component.**

If a suitable shared component does not exist, create it in `src/components/shared/` so it can be reused by future work. See the full catalog in [docs/component-reference.md](docs/component-reference.md).

---

## Shared Component Reference

The full shared-component catalog (props, slots, usage examples) lives in a
separate file to keep this one lean:

@docs/component-reference.md
