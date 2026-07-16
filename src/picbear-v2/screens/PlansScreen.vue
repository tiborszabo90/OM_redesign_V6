<script setup>
import { ref, computed } from 'vue'
import { state, products, subscriptionPlans } from '../store'
import { ArrowLeft, ArrowRight, Check, Loader2, ShieldCheck } from 'lucide-vue-next'

// idle | subscribing | subscribed
const status = ref('idle')
const selectedPlan = ref('growth')

const remaining = computed(() => products.length - state.selected.length)
const chosen = computed(() => subscriptionPlans.find(p => p.id === selectedPlan.value))

function back() {
  state.screen = state.published ? 'done' : 'home-onboarding-fallback'
}

function pick(id) {
  if (status.value !== 'idle') return
  selectedPlan.value = id
}

function subscribe() {
  if (status.value !== 'idle') return
  status.value = 'subscribing'
  setTimeout(() => {
    state.plan = chosen.value.id
    state.imageLimit = chosen.value.images
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
      <h1 class="text-xl font-bold text-[#1a1a1a]">Keep generating images</h1>
      <p class="text-[13px] text-[#616161] mt-1">
        Your 10 free upgrades are live and working. {{ remaining }} products are still on their original photos — pick a plan to cover them too.
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
        Pick the next products to upgrade — your style and placement are already saved.
      </p>
      <button class="pb-btn-primary" @click="pickProducts">
        Pick more products <ArrowRight :size="13" />
      </button>
    </div>

    <!-- Plan cards -->
    <template v-else>
      <div class="grid grid-cols-3 gap-4 mb-5">
        <div
          v-for="plan in subscriptionPlans" :key="plan.id"
          class="pb-card p-5 cursor-pointer relative transition-all duration-200"
          :class="selectedPlan === plan.id ? 'ring-2 ring-[#5548e0]' : 'hover:shadow-lg hover:border-[#c3bdf5]'"
          @click="pick(plan.id)"
        >
          <span
            v-if="plan.recommended"
            class="absolute -top-2.5 left-4 text-[10px] font-semibold text-white bg-[#5548e0] rounded-full px-2 py-0.5"
          >
            Recommended
          </span>
          <p class="font-bold text-[#1a1a1a]">{{ plan.name }}</p>
          <p class="mt-1.5">
            <span class="text-2xl font-bold text-[#1a1a1a]">{{ plan.price }}</span>
            <span class="text-[12px] text-[#8a8a8a]"> / {{ plan.per }}</span>
          </p>
          <p class="text-[12px] text-[#616161] mt-1.5 mb-3">{{ plan.blurb }}</p>
          <ul class="space-y-1.5">
            <li v-for="f in plan.features" :key="f" class="text-[12px] text-[#303030] flex items-center gap-1.5">
              <Check :size="12" class="text-[#36c98e] shrink-0" /> {{ f }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Subscribe bar -->
      <div class="flex items-center justify-between gap-4">
        <p class="text-[12px] text-[#616161] flex items-center gap-1.5">
          <ShieldCheck :size="14" class="text-[#36c98e] shrink-0" />
          Billed through Shopify. Cancel anytime, your published images stay live until the end of the billing period.
        </p>
        <button class="pb-btn-primary shrink-0" :disabled="status === 'subscribing'" @click="subscribe">
          <template v-if="status === 'subscribing'">
            <Loader2 :size="13" class="animate-spin" /> Confirming with Shopify...
          </template>
          <template v-else>
            Subscribe to {{ chosen.name }} · {{ chosen.price }}/{{ chosen.per }}
          </template>
        </button>
      </div>
    </template>
  </div>
</template>
