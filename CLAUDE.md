# Claude Code — Project Guidelines

## Contents

- [Project Specs](#project-specs)
- [1. Behavioral Guidelines](#1-behavioral-guidelines)
- [2. Hard Prohibitions](#2-hard-prohibitions)
  - [Commit Rule](#commit-rule)
  - [Archive Rule](#archive-rule)
  - [Deployment Rule](#deployment-rule)
- [3. Workflow Rules](#3-workflow-rules)
  - [Import Rule](#import-rule)
  - [Adding New Views](#adding-new-views)
  - [Component Reuse Rule](#component-reuse-rule)
- [4. Component Reference](#4-component-reference)
  - [Shared Components Reference](#shared-components-reference)
  - [Component Details](#component-details)

---

## Project Specs

Product specifications live in `docs/`. Read the relevant spec before starting work on that feature.

- **ConversionLift** (CRO tool, prototype): [docs/conversionlift-spec-v1.md](docs/conversionlift-spec-v1.md) — domain model, screens, flow, demo data.

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

If a suitable shared component does not exist, create it in `src/components/shared/` so it can be reused by future work. See [Component Reference](#4-component-reference) below for the full catalog.

---

## 4. Component Reference

### Shared Components Reference

| Component | Import path | Purpose | v-model type |
|-----------|-------------|---------|-------------|
| `Button` | `@/components/shared/Button.vue` | Styled button | — |
| `Checkbox` | `@/components/shared/Checkbox.vue` | Checkbox with optional label | `Boolean` |
| `Dropdown` | `@/components/shared/Dropdown.vue` | Single-select dropdown | `String\|Object` |
| `FormInput` | `@/components/shared/FormInput.vue` | Labeled text input with error/hint | `String\|Number` |
| `MultiSelect` | `@/components/shared/MultiSelect.vue` | Multi-select dropdown | `Array` |
| `Accordion` | `@/components/shared/Accordion.vue` | Collapsible section | — |
| `ToggleSwitch` | `@/components/shared/ToggleSwitch.vue` | On/off toggle switch | `Boolean` |
| `ChatPanel` | `@/components/shared/ChatPanel.vue` | AI chat interface panel | `Boolean` (visibility) |
| `ScrollTimePicker` | `@/components/shared/ScrollTimePicker.vue` | Scrollable HH:MM time picker | `String` ('HH:MM') |
| `Tag` | `@/components/shared/Tag.vue` | Informational badge/tag pill | — |
| `Chip` | `@/components/shared/Chip.vue` | Selectable onboarding chip (rounded-xl) | — |
| `Modal` | `@/components/shared/Modal.vue` | Generic modal/dialog with header/body/footer slots | `Boolean` (visibility) |

### Component Details

#### `Button`
```vue
<Button variant="primary" size="md" :disabled="false" @click="handleClick">
  Label text
</Button>
```
- `variant`: `primary` | `secondary` | `ghost` (default: `primary`)
- `size`: `sm` | `md` | `lg` (default: `md`)
- `icon-only`: `Boolean` — renders without text, square shape
- `active`: `Boolean` — active state for `ghost` variant
- Slot `icon`: place a Lucide icon inside for icon+text buttons
- **Always use instead of raw `<button>` tags with Tailwind classes**

---

#### `Checkbox`
```vue
<Checkbox v-model="checked" label="Enable feature" />
```
- `label`: optional label text
- `indeterminate`: `Boolean` — shows minus icon for partial selection
- `size`: `default` | `sm`
- **Always use instead of `<input type="checkbox">`**

---

#### `Dropdown`
```vue
<Dropdown v-model="selected" :options="options" placeholder="Select..." />
```
- `options`: required — array of strings or `{ value, label }` objects
- `size`: `default` | `sm`
- `drop-up`: `Boolean` — opens menu upward (useful for bottom-of-page dropdowns)
- Slots: `selected` (custom selected display), `icon` (left icon), `option` (custom option row)
- **Always use instead of custom `<select>` or hand-rolled dropdowns**

---

#### `FormInput`
```vue
<FormInput v-model="email" label="Email" type="email" :required="true" :error="errorMsg" hint="Helper text" />
```
- `label`, `type`, `placeholder`, `required`, `disabled`
- `error`: shows red error message below the input
- `hint`: shows gray helper text below the input
- **Always use for labeled form fields**

---

#### `MultiSelect`
```vue
<MultiSelect v-model="selectedItems" :options="options" placeholder="Select items" />
```
- `options`: same format as `Dropdown`
- Displays "X selected" count; checkmark on selected items
- **Always use for multi-option selection**

---

#### `Accordion`
```vue
<Accordion title="Section title" :open="false" @toggle="handleToggle">
  <template #icon><SomeIcon :size="16" /></template>
  Content goes here
</Accordion>
```
- `title`: required
- `open`: controlled open state
- Emits `toggle`
- Slot `icon`: icon in the header (rendered in a circular background)
- **Always use for expand/collapse sections**

---

#### `ToggleSwitch`
```vue
<ToggleSwitch v-model="isEnabled" />
```
- Green when on, gray when off
- `disabled`: `Boolean`
- **Always use instead of custom toggle implementations**

---

#### `ChatPanel`
```vue
<ChatPanel v-model="panelVisible" :suggestions="chips" :ai-responses="responses" />
```
- `v-model`: controls panel open/closed state
- `suggestions`: array of suggestion chip strings
- `ai-responses`: object mapping suggestion text → AI response
- Includes typing indicator, markdown formatting, color/logo message types
- **Always use for AI chat UI panels**

---

#### `ScrollTimePicker`
```vue
<ScrollTimePicker v-model="time" />
```
- `v-model`: `String` in `'HH:MM'` format (24h)
- Scrollable hours (00–23) and minutes (00–59) columns
- **Always use for time input fields**

---

#### `Tag`
```vue
<Tag variant="gray">Label</Tag>
<Tag variant="green">
  <template #icon><CheckIcon :size="12" /></template>
  Ready to use
</Tag>
```
- `variant`: `gray` (default) | `gray-muted` | `orange` | `green` | `outlined`
- Slot `icon`: optional leading icon
- **Always use instead of raw `<span>` pill badges**

---

#### `Modal`
```vue
<Modal v-model="open" title="Edit campaign" size="md">
  <p>Body content goes here.</p>
  <template #footer="{ close }">
    <Button variant="secondary" @click="close">Cancel</Button>
    <Button variant="primary" @click="save">Save</Button>
  </template>
</Modal>
```
- `v-model`: controls open/closed state
- `title`: optional header text (omit if using `#header` slot)
- `size`: `sm` | `md` | `lg` | `xl` (default: `md`)
- `closeOnBackdrop`: `Boolean` (default: `true`)
- `closeOnEsc`: `Boolean` (default: `true`)
- `hideClose`: `Boolean` — hide the X button
- `dividers`: `Boolean` — show top/bottom borders around the body
- Slots: `default` (body), `header` (overrides title), `footer` (receives `{ close }`)
- Teleports to `body`, locks page scroll while open, closes on Esc
- **Always use instead of hand-rolled modal wrappers**
