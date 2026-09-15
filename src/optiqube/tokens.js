/**
 * OptiQube brand tokens — the JS mirror of `optiqube.css`.
 *
 * Every value is a CSS custom property, so a component that binds a token into
 * an inline style follows the theme without being touched. Ported from the
 * product's `client/src/lib/brand.ts`, names included: the `gray*` names
 * describe the light-mode origin, not the rendered colour.
 */
export const BRAND = {
  /** Text, icons and borders. On dark this lightens; it is not a fill. */
  blue: 'var(--oq-blue)',
  /** Solid fill under a white label — a darker blue on dark ground. */
  blueSolid: 'var(--oq-blue-solid)',
  blueSoft: 'var(--oq-blue-soft)',
  blueMuted: 'var(--oq-blue-muted)',
  ink: 'var(--oq-ink)',
  /** Stays dark in both themes: deliberate dark chips. */
  inkFixed: 'var(--oq-ink-fixed)',
  gray600: 'var(--oq-ink-secondary)',
  gray500: 'var(--oq-ink-muted)',
  gray400: 'var(--oq-ink-faint)',
  /** Stronger rule — card frames, media edges. */
  gray300: 'var(--oq-line-strong)',
  /** The hairline rule used for nearly every divider and border. */
  gray200: 'var(--oq-line)',
  /** Sunken fill — inputs, progress tracks, the mat behind a creative. */
  gray100: 'var(--oq-surface-sunken)',
  /** Subtle fill — hover rows, quiet panels. */
  gray50: 'var(--oq-surface-subtle)',
  pageBg: 'var(--oq-page-bg)',
  hover: 'var(--oq-hover)',
  emerald: 'var(--oq-success)',
  emeraldText: 'var(--oq-success-text)',
  successSoft: 'var(--oq-success-soft)',
  successLine: 'var(--oq-success-line)',
  red: 'var(--oq-danger)',
  redSolid: 'var(--oq-danger-solid)',
  redSoft: 'var(--oq-danger-soft)',
  dangerLine: 'var(--oq-danger-line)',
  dangerText: 'var(--oq-danger-text)',
  warningSoft: 'var(--oq-warning-soft)',
  warningLine: 'var(--oq-warning-line)',
  warningText: 'var(--oq-warning-text)',
  infoSoft: 'var(--oq-info-soft)',
  infoLine: 'var(--oq-info-line)',
  infoText: 'var(--oq-info-text)',
  /** Behind a creative. A mid tone in both themes. */
  mediaMat: 'var(--oq-media-mat)',
  /** The 1px frame that keeps a creative's own edge visible. */
  mediaEdge: 'var(--oq-media-edge)',
  /** Card and panel fill — what used to be plain white. */
  surface: 'var(--oq-surface)',
  surfaceBlur: 'var(--oq-surface-blur)',
  /** Menus, popovers and modals, which sit above a card. */
  surfaceRaised: 'var(--oq-surface-raised)',
  /** Label on a solid accent fill. White in both themes. */
  onAccent: 'var(--oq-on-accent)',
}

export const CARD_SHADOW = 'var(--oq-shadow-card)'
export const POPOVER_SHADOW = 'var(--oq-shadow-popover)'
export const MODAL_SHADOW = 'var(--oq-shadow-modal)'

/** Workspace gutter around the floating panels. */
export const WORKSPACE_INSET = '0.5625rem'

export const LOGO_SRC = '/optiqube/optiqube_logo.svg'
/** The wordmark is near-black on transparent, so it vanishes on a dark sidebar. */
export const LOGO_SRC_DARK = '/optiqube/optiqube_logo_dark.svg'

export const FONT = "'Funnel Sans', system-ui, -apple-system, sans-serif"
