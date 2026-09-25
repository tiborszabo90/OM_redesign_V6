<script setup>
import './optiqube.css'
import { BRAND, FONT, LOGO_SRC, LOGO_SRC_DARK } from './tokens'
import { state, navigate, resetSession } from './store'

/**
 * Every screen in one list.
 *
 * The product reaches most of these by URL — the sidebar covers four of them and
 * the rest sit behind a sign-out, an email link or a campaign. This picker is the
 * prototype's address bar.
 */
const GROUPS = [
  {
    label: 'Product',
    paths: [
      { path: '/agentic', label: 'New task (home)' },
      { path: '/session', label: 'Agentic session — original (overlay)' },
      { path: '/session-v2', label: 'Agentic session — V2 (inline runs)' },
      { path: '/session-v3', label: 'Agentic session — V3 (run panel)' },
      { path: '/session-v3-no-catalog', label: 'Agentic session — V3, no catalog yet' },
      { path: '/session-v4', label: 'Agentic session — V4 (run rail)' },
      { path: '/session-v5', label: 'Agentic session — V5 (window over thread)' },
      { path: '/campaigns', label: 'Campaigns' },
      { path: '/campaigns/cmp_1', label: 'Campaign workspace' },
      { path: '/campaigns/cmp_1/ads/ad_1', label: 'Ad detail' },
      { path: '/campaigns/cmp_6', label: 'Campaign — no catalog connected' },
      { path: '/campaigns/cmp_6/ads/ad_nc1', label: 'Ad detail — no catalog connected' },
      { path: '/campaigns/cmp_1/bulk', label: 'Bulk generation' },
      { path: '/campaigns/cmp_1/handoff', label: 'Results & feed' },
      { path: '/library', label: 'Inspiration library' },
      { path: '/products', label: 'Products' },
      { path: '/help/meta-feeds', label: 'Help — Meta feeds' },
    ],
  },
  {
    label: 'Settings',
    paths: [
      { path: '/settings', label: 'Connections' },
      { path: '/settings/catalog', label: 'Connect catalog' },
      { path: '/settings/meta', label: 'Connect Meta Ads' },
    ],
  },
  {
    label: 'Entry',
    paths: [
      { path: '/onboarding', label: 'Onboarding — domain' },
      { path: '/login', label: 'Sign in' },
      { path: '/register', label: 'Register' },
      { path: '/forgot-password', label: 'Forgot password' },
      { path: '/reset-password', label: 'Reset password' },
      { path: '/verify-email', label: 'Verify email' },
      { path: '/invite', label: 'Invitation' },
    ],
  },
  {
    label: 'Account',
    paths: [
      { path: '/account/personal', label: 'Personal details' },
      { path: '/account/security', label: 'Security' },
      { path: '/account/domains', label: 'Domains' },
      { path: '/account/users', label: 'Users' },
      { path: '/account/usage', label: 'Usage' },
      { path: '/account/subscription', label: 'Subscription' },
    ],
  },
]

const emit = defineEmits(['navigate'])

function open(path) {
  if (path.startsWith('/session') || path === '/agentic') resetSession()
  navigate(path)
  emit('navigate', 'optiqube')
}
</script>

<template>
  <div class="oq-root min-h-screen px-6 py-16" :data-oq-theme="state.theme" :style="{ fontFamily: FONT }">
    <div class="mx-auto w-full max-w-3xl">
      <div class="flex items-center justify-center">
        <img :src="state.theme === 'dark' ? LOGO_SRC_DARK : LOGO_SRC" alt="OptiQube" class="h-8 w-auto" />
      </div>
      <h1 class="mt-6 text-center text-3xl font-semibold tracking-tight" :style="{ color: BRAND.ink }">
        Pick a screen
      </h1>
      <p class="mt-2 text-center text-sm" :style="{ color: BRAND.gray500 }">
        The OptiQube app, rebuilt from the product. Everything here is mock data.
      </p>

      <div v-for="group in GROUPS" :key="group.label" class="mt-8">
        <p class="mb-2 text-[11px] font-bold uppercase tracking-wider" :style="{ color: BRAND.gray500 }">
          {{ group.label }}
        </p>
        <div class="grid gap-2 sm:grid-cols-2">
          <button
            v-for="item in group.paths"
            :key="item.path"
            type="button"
            class="flex items-baseline justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors hover:bg-[var(--oq-blue-soft)]"
            :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
            @click="open(item.path)"
          >
            <span class="text-sm font-medium" :style="{ color: BRAND.ink }">{{ item.label }}</span>
            <code class="shrink-0 text-[11px]" :style="{ color: BRAND.gray400 }">{{ item.path }}</code>
          </button>
        </div>
      </div>

      <div class="mt-10 text-center">
        <button
          type="button"
          class="text-sm font-medium"
          :style="{ color: BRAND.gray500 }"
          @click="emit('navigate', 'apps')"
        >
          ← Back to apps
        </button>
      </div>
    </div>
  </div>
</template>
