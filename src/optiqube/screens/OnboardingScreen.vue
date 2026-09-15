<script setup>
import { computed, ref } from 'vue'
import { ArrowUp } from 'lucide-vue-next'
import { BRAND, CARD_SHADOW, FONT } from '../tokens'
import { navigate } from '../store'

const domainInput = ref('')

/**
 * A whole brief typed here still works: the store it names becomes the domain and
 * the sentence itself opens the session, instead of being despaced into one token.
 */
const parsed = computed(() => {
  const raw = domainInput.value.trim()
  if (!raw) return null
  const match = raw.match(/([a-z0-9-]+(?:\.[a-z0-9-]+)+)/i)
  if (!match) return null
  const domain = match[1].toLowerCase()
  const intent = raw.replace(match[1], '').trim()
  return { domain, intent: intent.length > 3 ? intent : '' }
})

function startSession() {
  if (!parsed.value) return
  navigate('/session')
}
</script>

<template>
  <div
    class="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl"
    :style="{ fontFamily: FONT, background: BRAND.surface, boxShadow: CARD_SHADOW }"
  >
    <div class="flex min-h-0 w-full flex-1 flex-col overflow-y-auto px-6">
      <!-- Equal flex spacers pin the input to vertical center; copy sits just above it. -->
      <div class="flex min-h-0 flex-1 flex-col justify-end">
        <div class="mx-auto w-full max-w-[680px] pb-8 text-center">
          <p class="mb-3 text-lg font-medium tracking-tight sm:text-xl" :style="{ color: BRAND.blue }">
            Great! Let's get started.
          </p>
          <h1
            class="mb-2 text-[2rem] font-semibold tracking-tight sm:text-[2.4rem]"
            :style="{ color: BRAND.ink }"
          >
            First — which domain should we
            <br />
            create Meta ads for?
          </h1>
          <p class="text-sm" :style="{ color: BRAND.gray500 }">
            Enter your store — we'll open a session and design catalog creatives together.
          </p>
        </div>
      </div>

      <div
        class="mx-auto flex w-full max-w-[680px] shrink-0 items-center gap-2 rounded-2xl border py-1.5 pl-3 pr-1.5"
        :style="{ borderColor: BRAND.gray200, background: BRAND.surface, boxShadow: CARD_SHADOW }"
      >
        <label class="sr-only" for="onboarding-domain">Domain</label>
        <span class="shrink-0 text-sm font-medium" :style="{ color: BRAND.gray400 }">https://</span>
        <input
          id="onboarding-domain"
          v-model="domainInput"
          placeholder="yourbrand.com"
          class="min-w-0 flex-1 bg-transparent py-1.5 text-[15px] outline-none"
          :style="{ color: BRAND.ink }"
          @keydown.enter.prevent="startSession"
        />
        <button
          type="button"
          :disabled="!parsed"
          class="flex size-9 shrink-0 items-center justify-center rounded-full text-white transition-opacity disabled:opacity-40"
          :style="{ background: BRAND.blueSolid }"
          aria-label="Start session"
          @click="startSession"
        >
          <ArrowUp class="size-4" />
        </button>
      </div>

      <div class="min-h-0 flex-1" />
    </div>
  </div>
</template>
