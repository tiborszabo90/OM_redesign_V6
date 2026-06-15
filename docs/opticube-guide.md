# Opticube — project guide

Standalone prototype living under `src/opticube/`. Read this before working on
Opticube. Repo-wide rules (commit, archive, registry, deployment) come from the
root [CLAUDE.md](../CLAUDE.md) and still apply here.

## Where things live

- **Design tokens:** `src/opticube/tokens.js` (JS mirror of the CSS) — primary brand is indigo `#6366F1`.
- **CSS:** `src/opticube/opticube.css`
- **Design guide view:** `src/opticube/OpticubeDesignGuideView.vue` (the visual source of truth for colors/type)
- **Flow views:** `OpticubeStartView.vue`, `OpticubeRegistrationView.vue`, `OpticubeOnboardingView.vue`
- **Demo data:** `src/opticube/` (alongside the views)

## Components

Opticube has its **own component set** in `src/opticube/components/`, prefixed `Oc*`:

| Component | Purpose |
|-----------|---------|
| `OcButton` | Button |
| `OcInput` | Text input |
| `OcCard` | Card container |
| `OcBadge` | Badge / pill |
| `OcToggle` | Toggle switch |

**Use the `Oc*` components inside Opticube, not the shared `src/components/shared/`
catalog.** They follow the Opticube token system. If an Opticube screen needs a
component that doesn't exist yet, create it in `src/opticube/components/` as an
`Oc*` component following the existing ones.

## Conventions

- Colors and type come from `OpticubeDesignGuideView.vue` / `tokens.js` — never arbitrary Tailwind defaults.
- New Opticube views still follow the [Adding New Views](../CLAUDE.md#adding-new-views) steps (register in `src/registry/views.js`, etc.). Opticube entries use `product: 'opticube'`.
