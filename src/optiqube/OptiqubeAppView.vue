<script setup>
import { computed } from 'vue'
import { LayoutGrid, Library, Package, Settings, Plus, Moon, Sun } from 'lucide-vue-next'
import './optiqube.css'
import { BRAND, CARD_SHADOW, LOGO_SRC, LOGO_SRC_DARK } from './tokens'
import {
  state, navigate, isSection, toggleTheme, resetSession,
  recentSessions, groupRecents, liveCampaigns, relativeWhen,
} from './store'
import OqBrandSwitcher from './components/OqBrandSwitcher.vue'
import OqUserMenu from './components/OqUserMenu.vue'
import OqCreditMeter from './components/OqCreditMeter.vue'
import OqConceptOverlay from './components/OqConceptOverlay.vue'
import CampaignsScreen from './screens/CampaignsScreen.vue'
import CampaignWorkspaceScreen from './screens/CampaignWorkspaceScreen.vue'
import CampaignAdScreen from './screens/CampaignAdScreen.vue'
import BulkScreen from './screens/BulkScreen.vue'
import HandoffScreen from './screens/HandoffScreen.vue'
import HelpMetaFeedsScreen from './screens/HelpMetaFeedsScreen.vue'
import LibraryScreen from './screens/LibraryScreen.vue'
import ProductsScreen from './screens/ProductsScreen.vue'
import SettingsScreen from './screens/SettingsScreen.vue'
import SettingsCatalogScreen from './screens/SettingsCatalogScreen.vue'
import SettingsMetaScreen from './screens/SettingsMetaScreen.vue'
import OnboardingScreen from './screens/OnboardingScreen.vue'
import SessionScreen from './screens/SessionScreen.vue'
import SessionV2Screen from './screens/SessionV2Screen.vue'
import SessionV3Screen from './screens/SessionV3Screen.vue'
import SessionV4Screen from './screens/SessionV4Screen.vue'
import SessionV5Screen from './screens/SessionV5Screen.vue'
import AgenticHomeScreen from './screens/AgenticHomeScreen.vue'
import AccountPersonalScreen from './screens/AccountPersonalScreen.vue'
import AccountSecurityScreen from './screens/AccountSecurityScreen.vue'
import AccountDomainsScreen from './screens/AccountDomainsScreen.vue'
import AccountUsersScreen from './screens/AccountUsersScreen.vue'
import AccountUsageScreen from './screens/AccountUsageScreen.vue'
import AccountSubscriptionScreen from './screens/AccountSubscriptionScreen.vue'
import LoginScreen from './screens/LoginScreen.vue'
import RegisterScreen from './screens/RegisterScreen.vue'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen.vue'
import ResetPasswordScreen from './screens/ResetPasswordScreen.vue'
import VerifyEmailScreen from './screens/VerifyEmailScreen.vue'
import InviteScreen from './screens/InviteScreen.vue'
import NotFoundScreen from './screens/NotFoundScreen.vue'

// `product` is passed by the host App.vue for product views; not used internally.
// `startPath` lets a registry entry open the app on one screen — the Session V2
// entry in the dev nav is that, and nothing else.
const props = defineProps({
  product: { type: String, default: 'optiqube' },
  startPath: { type: String, default: '' },
})
defineEmits(['navigate'])

if (props.startPath) {
  resetSession()
  navigate(props.startPath)
}

const navItems = [
  { nest: '/campaigns', label: 'Campaigns', icon: LayoutGrid },
  { nest: '/library', label: 'Library', icon: Library },
  { nest: '/products', label: 'Products', icon: Package },
  { nest: '/settings', label: 'Settings', icon: Settings },
]

/**
 * Screens that render without the product shell.
 *
 * In the app these are separate routes above the `/app/:accountId` nest: the auth
 * pages, because a sidebar full of a workspace you are not signed into yet would
 * be furniture, and account settings, which are a full page with their own nav.
 */
const bareScreens = {
  '/account': AccountPersonalScreen,
  '/account/personal': AccountPersonalScreen,
  '/account/security': AccountSecurityScreen,
  '/account/domains': AccountDomainsScreen,
  '/account/users': AccountUsersScreen,
  '/account/usage': AccountUsageScreen,
  '/account/subscription': AccountSubscriptionScreen,
  '/login': LoginScreen,
  '/register': RegisterScreen,
  '/forgot-password': ForgotPasswordScreen,
  '/reset-password': ResetPasswordScreen,
  '/verify-email': VerifyEmailScreen,
  '/invite': InviteScreen,
}

const bareScreen = computed(() => bareScreens[state.path] || null)

const screen = computed(() => {
  const p = state.path
  if (p.startsWith('/help/meta-feeds')) return HelpMetaFeedsScreen
  // Campaign-scoped catalog surfaces reuse the same pages the nav reaches, the
  // way `ProductRoutes` maps them in the product.
  if (/^\/campaigns\/[^/]+\/library$/.test(p)) return LibraryScreen
  if (/^\/campaigns\/[^/]+\/(products|catalog)$/.test(p)) return ProductsScreen
  if (/^\/campaigns\/[^/]+\/bulk$/.test(p)) return BulkScreen
  if (/^\/campaigns\/[^/]+\/handoff$/.test(p)) return HandoffScreen
  if (/^\/campaigns\/[^/]+\/ads\/[^/]+$/.test(p)) return CampaignAdScreen
  if (/^\/campaigns\/[^/]+/.test(p)) return CampaignWorkspaceScreen
  if (/^\/campaigns(\/|$)/.test(p)) return CampaignsScreen
  if (p.startsWith('/agentic')) return AgenticHomeScreen
  if (p.startsWith('/session-v2')) return SessionV2Screen
  if (p.startsWith('/session-v3')) return SessionV3Screen
  if (p.startsWith('/session-v4')) return SessionV4Screen
  if (p.startsWith('/session-v5')) return SessionV5Screen
  if (p.startsWith('/session')) return SessionScreen
  if (p.startsWith('/onboarding')) return OnboardingScreen
  if (p.startsWith('/library')) return LibraryScreen
  if (p.startsWith('/products')) return ProductsScreen
  if (p === '/settings/catalog') return SettingsCatalogScreen
  if (p === '/settings/meta') return SettingsMetaScreen
  if (p.startsWith('/settings')) return SettingsScreen
  return NotFoundScreen
})

/**
 * Screens that own their height instead of scrolling inside main — the ones whose
 * own panel scrolls (the catalog grid behind a fixed filter rail).
 */
const fillMain = computed(
  () =>
    state.path.startsWith('/products') ||
    state.path.startsWith('/onboarding') ||
    state.path.startsWith('/agentic') ||
    state.path.startsWith('/session') ||
    /^\/campaigns\/[^/]+\/(bulk|products|catalog)$/.test(state.path),
)

const visibleSessions = computed(() =>
  recentSessions.filter((s) => (state.recentsView === 'archived' ? s.archived : !s.archived)),
)

const recentBlocks = computed(() => groupRecents(visibleSessions.value))

/** A duplicate title needs the time cue to stay distinguishable. */
function sessionLabel(row) {
  const dup = visibleSessions.value.filter((s) => s.title === row.title).length > 1
  return dup ? `${row.title} · ${relativeWhen(row.updatedAt)}` : row.title
}

/** Blue while a round is running, green when concepts are waiting, otherwise nothing. */
function dotColor(row) {
  if (row.phase === 'generating') return BRAND.blue
  if (row.conceptCount > 0) return BRAND.emerald
  return null
}
</script>

<template>
  <div
    v-if="bareScreen"
    class="oq-root h-screen overflow-auto"
    :data-oq-theme="state.theme"
  >
    <component :is="bareScreen" :key="state.path" class="oq-page-enter" />
  </div>

  <div
    v-else
    class="oq-root flex h-screen min-h-0 gap-[var(--oq-workspace-inset)] overflow-hidden p-[var(--oq-workspace-inset)]"
    :data-oq-theme="state.theme"
  >
    <aside
      class="flex w-[220px] shrink-0 flex-col overflow-hidden rounded-2xl"
      :style="{ background: BRAND.surface, boxShadow: CARD_SHADOW }"
    >
      <div class="px-4 pt-4 pb-3">
        <div class="flex items-center justify-between gap-2">
          <button type="button" class="inline-flex items-center gap-2" @click="navigate('/campaigns')">
            <img
              :src="state.theme === 'dark' ? LOGO_SRC_DARK : LOGO_SRC"
              alt="OptiQube"
              class="h-7 w-auto"
            />
          </button>
          <!-- Not in the product: the theme lives in account settings there. Kept in
               the prototype so both token sets can be looked at without signing in. -->
          <button
            type="button"
            @click="toggleTheme"
            class="rounded-md p-1.5 transition-colors hover:bg-[var(--oq-hover)]"
            :style="{ color: BRAND.gray500 }"
            :title="state.theme === 'dark' ? 'Switch to light' : 'Switch to dark'"
          >
            <Sun v-if="state.theme === 'dark'" class="size-4" />
            <Moon v-else class="size-4" />
          </button>
        </div>

        <OqBrandSwitcher />

        <button
          type="button"
          @click="resetSession(); navigate('/agentic')"
          class="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-white"
          :style="{ background: BRAND.blueSolid }"
        >
          <Plus class="size-4" />
          New task
        </button>
      </div>

      <nav class="flex flex-col gap-0.5 px-2">
        <button
          v-for="item in navItems"
          :key="item.nest"
          type="button"
          @click="navigate(item.nest)"
          class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors"
          :class="isSection(item.nest) ? 'font-semibold' : 'font-medium'"
          :style="{
            background: isSection(item.nest) ? BRAND.blueSoft : 'transparent',
            color: isSection(item.nest) ? BRAND.blue : BRAND.ink,
          }"
        >
          <component :is="item.icon" class="size-4 shrink-0" />
          {{ item.label }}
        </button>
      </nav>

      <div class="mt-4 min-h-0 flex-1 border-t px-2 pt-3" :style="{ borderColor: BRAND.gray200 }">
        <div class="mb-1.5 flex items-center justify-between gap-2 px-3">
          <p class="text-[11px] font-medium uppercase tracking-wide" :style="{ color: BRAND.gray500 }">
            {{ state.recentsView === 'archived' ? 'Archived' : 'Recents' }}
          </p>
          <button
            type="button"
            class="text-[11px] font-medium"
            :style="{ color: BRAND.gray500 }"
            @click="state.recentsView = state.recentsView === 'archived' ? 'active' : 'archived'"
          >
            {{ state.recentsView === 'archived' ? 'Active' : 'Archived' }}
          </button>
        </div>

        <div class="flex max-h-full flex-col gap-0.5 overflow-y-auto pb-2">
          <p
            v-if="state.recentsView === 'archived' && !visibleSessions.length"
            class="px-3 py-1 text-xs"
            :style="{ color: BRAND.gray500 }"
          >
            No archived sessions
          </p>

          <div v-for="block in recentBlocks" :key="block.key" class="flex flex-col gap-0.5">
            <p
              v-if="block.label"
              class="mt-1.5 px-3 pb-0.5 text-[11px] font-medium"
              :style="{ color: BRAND.gray500 }"
            >
              {{ block.label }}
            </p>
            <button
              v-for="s in block.rows"
              :key="s.id"
              type="button"
              @click="navigate(`/session/${s.id}`)"
              class="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--oq-hover)]"
              :style="{
                background: state.path === `/session/${s.id}` ? BRAND.blueSoft : 'transparent',
                color: BRAND.ink,
              }"
            >
              <span
                v-if="dotColor(s)"
                class="size-1.5 shrink-0 rounded-full"
                :style="{ background: dotColor(s) }"
              />
              <span class="truncate">{{ sessionLabel(s) }}</span>
            </button>
          </div>

          <button
            v-for="c in liveCampaigns()"
            :key="c.id"
            type="button"
            @click="navigate(`/campaigns/${c.id}`)"
            class="flex items-center gap-2 truncate rounded-lg px-3 py-2 text-left text-sm"
            :style="{
              background: state.path.startsWith(`/campaigns/${c.id}`) ? BRAND.blueSoft : 'transparent',
              color: BRAND.ink,
            }"
          >
            <span class="size-1.5 shrink-0 rounded-full" :style="{ background: BRAND.emerald }" />
            <span class="truncate">{{ c.name }}</span>
          </button>
        </div>
      </div>

      <OqCreditMeter />
      <OqUserMenu />
    </aside>

    <div class="flex min-w-0 flex-1 flex-col gap-[var(--oq-workspace-inset)]">
      <main
        :key="state.path"
        class="oq-page-enter min-w-0 flex-1"
        :class="fillMain ? 'flex min-h-0 flex-col overflow-hidden' : 'overflow-auto'"
      >
        <component :is="screen" />
      </main>
    </div>

    <!-- Drawn by the shell rather than by the session: a window put down in the
         corner is meant to survive walking off to another screen. -->
    <OqConceptOverlay />
  </div>
</template>
