<script setup>
import { ref } from 'vue'
import { BRAND, FONT } from '../tokens'
import { navigate } from '../store'
import OqWordmark from '../components/OqWordmark.vue'
import OqGoogleSection from '../components/OqGoogleSection.vue'

const email = ref('')
const password = ref('')

const inputClass =
  'mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[var(--oq-blue)]'
</script>

<template>
  <div
    class="flex min-h-full flex-col items-center justify-center px-6 py-16"
    :style="{ fontFamily: FONT }"
  >
    <div class="w-full max-w-md">
      <OqWordmark class-name="mx-auto h-7 w-auto" />
      <h1 class="mt-8 text-center text-2xl font-semibold" :style="{ color: BRAND.ink }">Sign in</h1>
      <p class="mt-2 text-center text-sm" :style="{ color: BRAND.gray500 }">
        Continue with your OptiQube account.
      </p>

      <div class="mt-6">
        <OqGoogleSection />
      </div>

      <form class="mt-4 flex flex-col gap-3" @submit.prevent="navigate('/campaigns')">
        <label class="text-sm font-medium" :style="{ color: BRAND.ink }">
          Email
          <input
            v-model="email"
            type="email"
            required
            autocomplete="email"
            :class="inputClass"
            :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
          />
        </label>
        <label class="text-sm font-medium" :style="{ color: BRAND.ink }">
          Password
          <input
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            :class="inputClass"
            :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
          />
        </label>
        <button
          type="submit"
          class="rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          :style="{ background: BRAND.blueSolid }"
        >
          Sign in
        </button>
      </form>

      <p class="mt-4 text-center text-sm">
        <button
          type="button"
          class="font-semibold hover:underline"
          :style="{ color: BRAND.blue }"
          @click="navigate('/forgot-password')"
        >
          Forgot your password?
        </button>
      </p>

      <p class="mt-4 text-center text-sm" :style="{ color: BRAND.gray500 }">
        No account?
        <button
          type="button"
          class="font-semibold hover:underline"
          :style="{ color: BRAND.blue }"
          @click="navigate('/register')"
        >
          Register
        </button>
      </p>
    </div>
  </div>
</template>
