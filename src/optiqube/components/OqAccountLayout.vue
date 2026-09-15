<script setup>
import { CreditCard, Gauge, Globe, Lock, User, Users } from 'lucide-vue-next'
import { BRAND, CARD_SHADOW, FONT } from '../tokens'
import { state, navigate } from '../store'

defineProps({ title: { type: String, required: true } })

const NAV = [
  { path: '/account/personal', label: 'Personal details', icon: User },
  { path: '/account/security', label: 'Security', icon: Lock },
  { path: '/account/domains', label: 'Domains', icon: Globe },
  { path: '/account/users', label: 'Users', icon: Users },
  { path: '/account/usage', label: 'Usage', icon: Gauge },
  { path: '/account/subscription', label: 'Subscription', icon: CreditCard },
]
</script>

<template>
  <div class="min-h-full overflow-auto" :style="{ background: BRAND.pageBg, fontFamily: FONT }">
    <div class="mx-auto w-full max-w-5xl px-6 py-8 sm:px-8">
      <button
        type="button"
        class="inline-flex text-sm font-medium transition-opacity hover:opacity-80"
        :style="{ color: BRAND.gray500 }"
        @click="navigate('/campaigns')"
      >
        ← Back to app
      </button>
      <h1 class="mt-3 text-3xl font-semibold tracking-tight" :style="{ color: BRAND.ink }">Settings</h1>

      <div class="mt-8 flex flex-col gap-6 lg:flex-row lg:gap-10">
        <nav
          class="flex shrink-0 gap-1 overflow-x-auto lg:w-56 lg:flex-col lg:overflow-visible"
          aria-label="Settings"
        >
          <button
            v-for="item in NAV"
            :key="item.path"
            type="button"
            @click="navigate(item.path)"
            class="flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-left text-sm transition-colors"
            :class="state.path === item.path ? 'font-semibold' : 'font-medium'"
            :style="{
              background: state.path === item.path ? BRAND.blueSoft : 'transparent',
              color: state.path === item.path ? BRAND.blue : BRAND.ink,
            }"
          >
            <component :is="item.icon" class="size-4 shrink-0" />
            {{ item.label }}
          </button>
        </nav>

        <div
          class="min-w-0 flex-1 rounded-2xl border p-5 sm:p-7"
          :style="{ borderColor: BRAND.gray200, background: BRAND.surface, boxShadow: CARD_SHADOW }"
        >
          <h2 class="text-lg font-semibold" :style="{ color: BRAND.ink }">{{ title }}</h2>
          <div class="oq-page-enter mt-5">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
