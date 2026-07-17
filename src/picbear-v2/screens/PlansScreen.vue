<script setup>
import { ref, computed } from 'vue'
import { state, products, subscriptionPlans } from '../store'
import { ArrowLeft, ArrowRight, Check, Loader2, ShieldCheck } from 'lucide-vue-next'

// idle | subscribing | subscribed
const status = ref('idle')
const subscribingId = ref(null)

// The free tier is stored internally as 'trial'; the plans grid shows it as the 'free' card.
const effectiveId = computed(() => (state.plan === 'trial' ? 'free' : state.plan))
const remaining = computed(() => products.length - state.selected.length)
const chosen = computed(() => subscriptionPlans.find(p => p.id === subscribingId.value))
const isPaid = computed(() => state.plan !== 'trial')
const currentIndex = computed(() => subscriptionPlans.findIndex(p => p.id === effectiveId.value))

function isCurrent(plan) {
  return plan.id === effectiveId.value
}

function buttonLabel(plan, i) {
  if (plan.id === 'free') return 'Switch to Free'
  const base = !isPaid.value ? 'Subscribe' : (i > currentIndex.value ? 'Upgrade' : 'Downgrade')
  return `${base} · ${plan.price}/${plan.per}`
}

function back() {
  state.screen = state.published ? 'done' : 'home-onboarding-fallback'
}

function subscribe(plan) {
  if (status.value !== 'idle' || isCurrent(plan)) return
  subscribingId.value = plan.id
  status.value = 'subscribing'
  setTimeout(() => {
    if (plan.id === 'free') {
      state.plan = 'trial'      // revert to the free tier
      state.imageLimit = 10
    } else {
      state.plan = plan.id
      state.imageLimit = plan.images
    }
    status.value = 'subscribed'
  }, 1600)
}

function pickProducts() {
  state.screen = 'products'
}
</script>

<template>
  <div class="max-w-[960px] mx-auto px-6 py-5">
    <!-- Header -->
    <div class="mb-6">
      <button class="pb-btn-ghost -ml-2 mb-3" @click="back">
        <ArrowLeft :size="14" /> Back
      </button>
      <h1 class="text-xl font-bold text-[#1a1a1a]">{{ isPaid ? 'Manage your plan' : 'Keep generating images' }}</h1>
      <p class="text-[13px] text-[#616161] mt-1">
        <template v-if="isPaid">
          You're on the {{ subscriptionPlans.find(p => p.id === effectiveId)?.name }} plan. Upgrade or downgrade anytime, {{ remaining }} products are still on their original photos.
        </template>
        <template v-else>
          Your 10 free upgrades are live and working. {{ remaining }} products are still on their original photos, pick a plan to cover them too.
        </template>
      </p>
    </div>

    <!-- Subscribed confirmation -->
    <div v-if="status === 'subscribed'" class="pb-card p-8 text-center pb-fade-in">
      <span class="w-14 h-14 rounded-full bg-[#36c98e] inline-flex items-center justify-center mb-4">
        <Check :size="28" class="text-white" />
      </span>
      <h2 class="text-lg font-bold text-[#1a1a1a] mb-1.5">You're on the {{ chosen.name }} plan</h2>
      <p class="text-[13px] text-[#616161] max-w-md mx-auto mb-5">
        {{ chosen.images >= 999 ? 'Unlimited' : chosen.images }} AI images per month are now available.
        Pick the next products to upgrade, your style and placement are already saved.
      </p>
      <button class="pb-btn-primary" @click="pickProducts">
        Pick more products <ArrowRight :size="13" />
      </button>
    </div>

    <!-- Plan cards -->
    <template v-else>
      <div class="grid grid-cols-3 gap-4 mb-5">
        <div
          v-for="(plan, i) in subscriptionPlans" :key="plan.id"
          class="pb-card p-5 relative transition-all duration-200 flex flex-col"
          :class="isCurrent(plan) ? 'ring-2 ring-[#36c98e]' : (plan.recommended ? 'ring-1 ring-[#dedbf7]' : '')"
        >
          <span
            v-if="isCurrent(plan)"
            class="absolute -top-2.5 left-4 text-[10px] font-semibold text-white bg-[#36c98e] rounded-full px-2 py-0.5"
          >
            Current plan
          </span>
          <span
            v-else-if="plan.recommended"
            class="absolute -top-2.5 left-4 text-[10px] font-semibold text-white bg-[#5548e0] rounded-full px-2 py-0.5"
          >
            Recommended
          </span>

          <p class="font-bold text-[#1a1a1a]">{{ plan.name }}</p>
          <p class="mt-1.5">
            <template v-if="plan.id === 'free'">
              <span class="text-2xl font-bold text-[#1a1a1a]">Free</span>
            </template>
            <template v-else>
              <span class="text-2xl font-bold text-[#1a1a1a]">{{ plan.price }}</span>
              <span class="text-[12px] text-[#8a8a8a]"> / {{ plan.per }}</span>
            </template>
          </p>
          <p class="text-[12px] text-[#616161] mt-1.5 mb-3">{{ plan.blurb }}</p>
          <ul class="space-y-1.5 flex-1 mb-4">
            <li v-for="f in plan.features" :key="f" class="text-[12px] text-[#303030] flex items-center gap-1.5">
              <Check :size="12" class="text-[#36c98e] shrink-0" /> {{ f }}
            </li>
          </ul>

          <!-- per-card action -->
          <button
            v-if="isCurrent(plan)"
            class="pb-btn-secondary w-full justify-center text-[#0c6b45]! border-[#b7e2cb]! bg-[#f2fbf6]!"
            disabled
          >
            <Check :size="13" /> Current plan
          </button>
          <button
            v-else
            class="w-full justify-center"
            :class="plan.recommended ? 'pb-btn-primary' : 'pb-btn-secondary'"
            :disabled="status === 'subscribing'"
            @click="subscribe(plan)"
          >
            <template v-if="status === 'subscribing' && subscribingId === plan.id">
              <Loader2 :size="13" class="animate-spin" /> Confirming...
            </template>
            <template v-else>
              {{ buttonLabel(plan, i) }}
            </template>
          </button>
        </div>
      </div>

      <!-- Billing note -->
      <p class="text-[12px] text-[#616161] flex items-center gap-1.5">
        <ShieldCheck :size="14" class="text-[#36c98e] shrink-0" />
        Billed through Shopify. Cancel anytime, your published images stay live until the end of the billing period.
      </p>
    </template>
  </div>
</template>
