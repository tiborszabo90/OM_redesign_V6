<script setup>
import { ref, computed } from 'vue'
import { CreditCard, Link2, Settings, LogOut } from 'lucide-vue-next'
import { BRAND, CARD_SHADOW } from '../tokens'
import { account, initials, navigate } from '../store'

const open = ref(false)

const menuItems = [
  { path: '/account/subscription', label: 'Subscription', icon: CreditCard },
  { path: '/settings', label: 'Connections', icon: Link2 },
  { path: '/account/personal', label: 'Settings', icon: Settings },
]

const creditsPct = computed(() =>
  Math.round((account.credits.balance / account.credits.granted) * 100),
)

function go(path) {
  open.value = false
  navigate(path)
}
</script>

<template>
  <div class="relative mt-auto border-t px-3 py-3" :style="{ borderColor: BRAND.gray200 }">
    <button
      type="button"
      @click="open = !open"
      class="flex w-full items-center gap-2 rounded-lg px-1 py-1 text-left transition-colors hover:bg-[var(--oq-blue-soft)]"
      aria-haspopup="menu"
      :aria-expanded="open"
    >
      <div
        class="flex size-8 items-center justify-center rounded-full text-[11px] font-semibold text-white"
        :style="{ background: BRAND.blueSolid }"
      >
        {{ initials(account.displayName) }}
      </div>
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium" :style="{ color: BRAND.ink }">{{ account.displayName }}</p>
        <p class="truncate text-xs" :style="{ color: BRAND.gray500 }">{{ account.email }}</p>
      </div>
    </button>

    <!-- The real menu is portalled to the body and placed above the trigger; the
         prototype keeps it anchored, which lands in the same place on this layout. -->
    <div
      v-if="open"
      class="absolute bottom-[calc(100%-4px)] left-3 z-[80] w-[min(480px,calc(100vw-1.5rem))] overflow-hidden rounded-xl border"
      :style="{ borderColor: BRAND.gray200, background: BRAND.surfaceRaised, boxShadow: CARD_SHADOW }"
      role="menu"
    >
      <div class="flex items-center gap-3 border-b px-4 py-3.5" :style="{ borderColor: BRAND.gray200 }">
        <div
          class="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
          :style="{ background: BRAND.blueSolid }"
        >
          {{ initials(account.displayName) }}
        </div>
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold" :style="{ color: BRAND.ink }">{{ account.displayName }}</p>
          <p class="truncate text-xs" :style="{ color: BRAND.gray500 }">{{ account.email }}</p>
        </div>
      </div>

      <div class="grid grid-cols-[1fr_1.15fr]">
        <div class="border-r py-2" :style="{ borderColor: BRAND.gray200 }">
          <button
            v-for="item in menuItems"
            :key="item.path"
            type="button"
            role="menuitem"
            @click="go(item.path)"
            class="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-[var(--oq-blue-soft)]"
            :style="{ color: BRAND.ink }"
          >
            <component :is="item.icon" class="size-4 shrink-0" :style="{ color: BRAND.gray500 }" />
            {{ item.label }}
          </button>
          <button
            type="button"
            role="menuitem"
            @click="go('/login')"
            class="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-[var(--oq-blue-soft)]"
            :style="{ color: BRAND.ink }"
          >
            <LogOut class="size-4 shrink-0" :style="{ color: BRAND.gray500 }" />
            Sign out
          </button>
        </div>

        <div class="space-y-3.5 px-4 py-3.5">
          <div>
            <p class="text-xs font-medium" :style="{ color: BRAND.gray500 }">My plan</p>
            <p class="mt-0.5 text-sm font-semibold" :style="{ color: BRAND.ink }">{{ account.plan }}</p>
          </div>
          <div>
            <p class="text-xs font-medium" :style="{ color: BRAND.gray500 }">Next payment</p>
            <p class="mt-0.5 text-sm font-semibold" :style="{ color: BRAND.ink }">{{ account.nextPayment }}</p>
          </div>
          <div>
            <div class="flex items-baseline justify-between gap-2">
              <p class="text-xs font-medium" :style="{ color: BRAND.gray500 }">Credits left</p>
              <p class="text-sm font-semibold" :style="{ color: BRAND.ink }">
                {{ account.credits.balance }} / {{ account.credits.granted }}
              </p>
            </div>
            <div class="mt-1.5 h-1.5 overflow-hidden rounded-full" :style="{ background: BRAND.gray100 }">
              <div class="h-full rounded-full" :style="{ width: `${creditsPct}%`, background: BRAND.blueSolid }" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
