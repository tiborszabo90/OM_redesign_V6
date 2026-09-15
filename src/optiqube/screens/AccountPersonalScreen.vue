<script setup>
import { ref } from 'vue'
import { Monitor, Moon, Sun } from 'lucide-vue-next'
import { BRAND, CARD_SHADOW } from '../tokens'
import { account, state } from '../store'
import OqAccountLayout from '../components/OqAccountLayout.vue'

const firstName = ref(account.displayName.split(' ')[0])
const lastName = ref(account.displayName.split(' ').slice(1).join(' '))
const saved = ref(false)

const THEMES = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

const inputClass = 'mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[var(--oq-blue)]'

function save() {
  account.displayName = `${firstName.value} ${lastName.value}`.trim()
  saved.value = true
}
</script>

<template>
  <OqAccountLayout title="Personal details">
    <form class="flex max-w-md flex-col gap-4" @submit.prevent="save">
      <label class="text-sm font-medium" :style="{ color: BRAND.ink }">
        First name
        <input
          v-model="firstName"
          required
          autocomplete="given-name"
          :class="inputClass"
          :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
        />
      </label>
      <label class="text-sm font-medium" :style="{ color: BRAND.ink }">
        Last name
        <input
          v-model="lastName"
          required
          autocomplete="family-name"
          :class="inputClass"
          :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
        />
      </label>
      <p v-if="saved" class="text-sm" :style="{ color: BRAND.emeraldText }">Saved.</p>
      <button
        type="submit"
        :disabled="!firstName.trim() || !lastName.trim()"
        class="self-start rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        :style="{ background: BRAND.blueSolid }"
      >
        Save
      </button>
    </form>

    <!-- Appearance is its own thing, not a field of the profile form: it takes
         effect on the click, so it must not sit inside something with a Save. -->
    <section class="mt-10 max-w-md border-t pt-8" :style="{ borderColor: BRAND.gray200 }">
      <h2 class="text-sm font-medium" :style="{ color: BRAND.ink }">Appearance</h2>
      <p class="mt-1 text-[13px]" :style="{ color: BRAND.gray500 }">
        Applies on this device — it is not part of your saved profile.
      </p>
      <div
        role="group"
        aria-label="Appearance"
        class="mt-3 inline-flex rounded-lg p-0.5"
        :style="{ background: BRAND.gray100 }"
      >
        <button
          v-for="opt in THEMES"
          :key="opt.value"
          type="button"
          :aria-pressed="state.theme === opt.value"
          class="flex h-8 items-center gap-1.5 rounded-md px-3 text-[13px] font-semibold transition-colors"
          :style="{
            background: state.theme === opt.value ? BRAND.surfaceRaised : 'transparent',
            color: state.theme === opt.value ? BRAND.blue : BRAND.gray400,
            boxShadow: state.theme === opt.value ? CARD_SHADOW : undefined,
          }"
          @click="state.theme = opt.value === 'system' ? 'light' : opt.value"
        >
          <component :is="opt.icon" class="size-3.5" />
          {{ opt.label }}
        </button>
      </div>
    </section>
  </OqAccountLayout>
</template>
