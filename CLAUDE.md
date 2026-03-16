# Claude Code — Project Guidelines

## Component Reuse Rule

**Before writing any button, input, dropdown, checkbox, toggle, accordion, multi-select, time-picker, chat panel, or tag/badge from raw HTML/Tailwind, always check `src/components/shared/` first and use the matching shared component.**

If a suitable shared component does not exist, create it in `src/components/shared/` so it can be reused by future work.

---

## Shared Components Reference

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

---

## Component Details

### `Button`
```vue
<Button variant="primary" size="md" :disabled="false" @click="handleClick">
  Label text
</Button>
```
- `variant`: `primary` | `secondary` | `outline` | `ghost` (default: `primary`)
- `size`: `sm` | `md` | `lg` (default: `md`)
- `icon-only`: `Boolean` — renders without text, square shape
- `active`: `Boolean` — active state for `ghost` variant
- Slot `icon`: place a Lucide icon inside for icon+text buttons
- **Always use instead of raw `<button>` tags with Tailwind classes**

---

### `Checkbox`
```vue
<Checkbox v-model="checked" label="Enable feature" />
```
- `label`: optional label text
- `indeterminate`: `Boolean` — shows minus icon for partial selection
- `size`: `default` | `sm`
- **Always use instead of `<input type="checkbox">`**

---

### `Dropdown`
```vue
<Dropdown v-model="selected" :options="options" placeholder="Select..." />
```
- `options`: required — array of strings or `{ value, label }` objects
- `size`: `default` | `sm`
- Slots: `selected` (custom selected display), `icon` (left icon), `option` (custom option row)
- **Always use instead of custom `<select>` or hand-rolled dropdowns**

---

### `FormInput`
```vue
<FormInput v-model="email" label="Email" type="email" :required="true" :error="errorMsg" hint="Helper text" />
```
- `label`, `type`, `placeholder`, `required`, `disabled`
- `error`: shows red error message below the input
- `hint`: shows gray helper text below the input
- **Always use for labeled form fields**

---

### `MultiSelect`
```vue
<MultiSelect v-model="selectedItems" :options="options" placeholder="Select items" />
```
- `options`: same format as `Dropdown`
- Displays "X selected" count; checkmark on selected items
- **Always use for multi-option selection**

---

### `Accordion`
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

### `ToggleSwitch`
```vue
<ToggleSwitch v-model="isEnabled" />
```
- Green when on, gray when off
- `disabled`: `Boolean`
- **Always use instead of custom toggle implementations**

---

### `ChatPanel`
```vue
<ChatPanel v-model="panelVisible" :suggestions="chips" :ai-responses="responses" />
```
- `v-model`: controls panel open/closed state
- `suggestions`: array of suggestion chip strings
- `ai-responses`: object mapping suggestion text → AI response
- Includes typing indicator, markdown formatting, color/logo message types
- **Always use for AI chat UI panels**

---

### `ScrollTimePicker`
```vue
<ScrollTimePicker v-model="time" />
```
- `v-model`: `String` in `'HH:MM'` format (24h)
- Scrollable hours (00–23) and minutes (00–59) columns
- **Always use for time input fields**

---

### `Tag`
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
