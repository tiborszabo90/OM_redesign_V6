<script setup>
import { ref } from 'vue'
import { BRAND, FONT } from '../tokens'
import { navigate } from '../store'
import OqWordmark from '../components/OqWordmark.vue'
import OqPasswordStrength from '../components/OqPasswordStrength.vue'

const password = ref('')
const done = ref(false)
</script>

<template>
  <div class="flex min-h-full flex-col items-center justify-center px-6 py-16" :style="{ fontFamily: FONT }">
    <div class="w-full max-w-md">
      <OqWordmark class-name="mx-auto h-7 w-auto" />
      <h1 class="mt-8 text-center text-2xl font-semibold" :style="{ color: BRAND.ink }">
        Choose a new password
      </h1>

      <template v-if="done">
        <p class="mt-3 text-center text-sm leading-relaxed" :style="{ color: BRAND.gray600 }">
          Your password is set. Every other signed-in browser was signed out.
        </p>
        <button
          type="button"
          class="mt-6 w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          :style="{ background: BRAND.blueSolid }"
          @click="navigate('/login')"
        >
          Sign in
        </button>
      </template>

      <form v-else class="mt-6 flex flex-col gap-3" @submit.prevent="done = true">
        <label class="text-sm font-medium" :style="{ color: BRAND.ink }">
          New password
          <input
            v-model="password"
            type="password"
            required
            minlength="8"
            autocomplete="new-password"
            placeholder="At least 8 characters"
            class="mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[var(--oq-blue)]"
            :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
          />
          <OqPasswordStrength :password="password" />
        </label>
        <button
          type="submit"
          class="rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          :style="{ background: BRAND.blueSolid }"
        >
          Set password
        </button>
      </form>
    </div>
  </div>
</template>
