<script setup>
/**
 * The balance, in the sidebar where it stays put.
 *
 * Credits were only in the account menu, behind a click, on every screen where they are
 * being spent. Here they are furniture: the same number everywhere, falling as a session
 * renders. It sits on its own fill rather than in the nav's rhythm, because a number
 * that is one more row in a list of links is a number nobody reads. A click goes to the
 * plan.
 */
import { computed } from 'vue'
import { Coins } from 'lucide-vue-next'
import { BRAND } from '../tokens'
import { account, navigate } from '../store'

const pct = computed(() =>
  Math.round((account.credits.balance / account.credits.granted) * 100),
)
</script>

<template>
  <button
    type="button"
    class="mx-3 mb-3 rounded-xl border px-3 py-2.5 text-left transition-colors hover:bg-[var(--oq-blue-soft)]"
    :style="{ borderColor: BRAND.gray200, background: BRAND.gray50 }"
    :title="`${account.credits.balance} of ${account.credits.granted} credits left`"
    @click="navigate('/account/subscription')"
  >
    <span class="flex items-baseline justify-between gap-2">
      <span class="flex items-center gap-1.5 text-xs font-medium" :style="{ color: BRAND.gray600 }">
        <Coins class="size-3.5 shrink-0" :style="{ color: BRAND.blue }" />
        Credits
      </span>
      <span class="text-base font-semibold leading-none tabular-nums" :style="{ color: BRAND.ink }">
        {{ account.credits.balance }}
      </span>
    </span>
    <span class="mt-2 block h-1.5 overflow-hidden rounded-full" :style="{ background: BRAND.gray100 }">
      <span class="block h-full rounded-full" :style="{ width: `${pct}%`, background: BRAND.blueSolid }" />
    </span>
  </button>
</template>
