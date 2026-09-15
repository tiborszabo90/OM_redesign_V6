<script setup>
import { ref } from 'vue'
import { Check, Star } from 'lucide-vue-next'
import { BRAND, FONT } from '../tokens'
import { navigate } from '../store'
import OqWordmark from '../components/OqWordmark.vue'
import OqGoogleSection from '../components/OqGoogleSection.vue'
import OqPasswordStrength from '../components/OqPasswordStrength.vue'

const WHY_JOIN = [
  'Keep every creative you generate.',
  'Scale winning styles across your catalog.',
  'Connect your product feed & Meta when you’re ready.',
]

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')

const inputClass =
  'mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[var(--oq-blue)]'
</script>

<template>
  <div class="flex min-h-full flex-col md:flex-row" :style="{ fontFamily: FONT, background: BRAND.surface }">
    <div class="relative flex w-full flex-1 flex-col justify-center px-8 py-12 md:w-1/2 md:px-12 lg:pr-20">
      <OqWordmark class-name="absolute left-8 top-8 h-7 w-auto max-md:left-1/2 max-md:-translate-x-1/2" />

      <div class="mx-auto w-full max-w-[420px] pt-10">
        <h2 class="text-xl font-semibold tracking-tight sm:text-2xl" :style="{ color: BRAND.ink }">
          Create your free OptiQube account
        </h2>
        <p class="mt-2 text-sm leading-relaxed" :style="{ color: BRAND.gray600 }">
          Save creatives, apply styles across your catalog, and continue when you’re ready.
        </p>

        <div class="mt-6">
          <OqGoogleSection label="Sign up with Google" />
        </div>

        <form class="mt-4 space-y-3" @submit.prevent="navigate('/onboarding')">
          <div class="flex flex-col gap-3 sm:flex-row">
            <label class="flex-1 text-sm font-medium" :style="{ color: BRAND.ink }">
              First name
              <input
                v-model="firstName"
                type="text"
                required
                autocomplete="given-name"
                placeholder="Jane"
                :class="inputClass"
                :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
              />
            </label>
            <label class="flex-1 text-sm font-medium" :style="{ color: BRAND.ink }">
              Last name
              <input
                v-model="lastName"
                type="text"
                required
                autocomplete="family-name"
                placeholder="Smith"
                :class="inputClass"
                :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
              />
            </label>
          </div>

          <label class="block text-sm font-medium" :style="{ color: BRAND.ink }">
            Work email
            <input
              v-model="email"
              type="email"
              required
              autocomplete="email"
              placeholder="you@company.com"
              :class="inputClass"
              :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
            />
          </label>

          <label class="block text-sm font-medium" :style="{ color: BRAND.ink }">
            Password
            <input
              v-model="password"
              type="password"
              required
              minlength="8"
              autocomplete="new-password"
              placeholder="At least 8 characters"
              :class="inputClass"
              :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
            />
            <OqPasswordStrength :password="password" />
          </label>

          <button
            type="submit"
            class="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition-opacity"
            :style="{ background: BRAND.blueSolid }"
          >
            Create free account
          </button>
        </form>

        <p class="mt-5 text-center text-sm" :style="{ color: BRAND.gray600 }">
          Already have an account?
          <button
            type="button"
            class="font-semibold hover:underline"
            :style="{ color: BRAND.blue }"
            @click="navigate('/login')"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>

    <div class="relative hidden flex-1 overflow-hidden md:flex" :style="{ backgroundColor: BRAND.blueSoft }">
      <div class="relative z-10 flex w-full flex-col justify-center px-12 py-16 lg:px-20">
        <h2 class="text-2xl font-bold" :style="{ color: BRAND.ink }">Why join OptiQube</h2>
        <ul class="mt-8 space-y-4">
          <li v-for="item in WHY_JOIN" :key="item" class="flex items-center gap-3">
            <span
              class="flex size-6 shrink-0 items-center justify-center rounded-full"
              :style="{ background: BRAND.blueSolid }"
            >
              <Check class="size-3.5 text-white" :stroke-width="3" />
            </span>
            <span class="text-base" :style="{ color: BRAND.gray600 }">{{ item }}</span>
          </li>
        </ul>
        <div class="mt-10 flex items-center gap-2">
          <div class="flex">
            <Star v-for="i in 5" :key="i" class="size-5" :style="{ color: BRAND.blue, fill: BRAND.blue }" />
          </div>
          <span class="text-base" :style="{ color: BRAND.gray600 }">Built for ecommerce catalog ads</span>
        </div>
      </div>
    </div>
  </div>
</template>
