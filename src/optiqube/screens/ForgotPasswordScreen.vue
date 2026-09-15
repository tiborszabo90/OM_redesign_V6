<script setup>
import { ref } from 'vue'
import { BRAND, FONT } from '../tokens'
import { navigate } from '../store'
import OqWordmark from '../components/OqWordmark.vue'

const email = ref('')
const sent = ref(false)
</script>

<template>
  <div class="flex min-h-full flex-col items-center justify-center px-6 py-16" :style="{ fontFamily: FONT }">
    <div class="w-full max-w-md">
      <OqWordmark class-name="mx-auto h-7 w-auto" />
      <h1 class="mt-8 text-center text-2xl font-semibold" :style="{ color: BRAND.ink }">
        Reset your password
      </h1>

      <template v-if="sent">
        <!-- Worded without confirming that an account exists — the server answers the
             same either way, and so does this page. -->
        <p class="mt-3 text-center text-sm leading-relaxed" :style="{ color: BRAND.gray600 }">
          If an OptiQube account uses <strong>{{ email }}</strong>, a reset link is on its way. The
          link works once and expires in an hour.
        </p>
        <p class="mt-6 text-center text-sm">
          <button type="button" class="font-semibold hover:underline" :style="{ color: BRAND.blue }" @click="navigate('/login')">
            Back to sign in
          </button>
        </p>
      </template>

      <template v-else>
        <p class="mt-2 text-center text-sm" :style="{ color: BRAND.gray500 }">
          We'll email you a link to choose a new one.
        </p>
        <form class="mt-6 flex flex-col gap-3" @submit.prevent="sent = true">
          <label class="text-sm font-medium" :style="{ color: BRAND.ink }">
            Email
            <input
              v-model="email"
              type="email"
              required
              autocomplete="email"
              class="mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[var(--oq-blue)]"
              :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
            />
          </label>
          <button
            type="submit"
            class="rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
            :style="{ background: BRAND.blueSolid }"
          >
            Send reset link
          </button>
        </form>
        <p class="mt-4 text-center text-sm">
          <button type="button" class="font-semibold hover:underline" :style="{ color: BRAND.blue }" @click="navigate('/login')">
            Back to sign in
          </button>
        </p>
      </template>
    </div>
  </div>
</template>
