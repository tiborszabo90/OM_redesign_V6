<script setup>
import { BRAND, FONT } from '../tokens'
import { account, navigate } from '../store'
import OqWordmark from '../components/OqWordmark.vue'

/**
 * The token is spent on mount rather than behind a button: the click in the inbox
 * was the confirmation, and a second one would only be in the way.
 */
</script>

<template>
  <div class="flex min-h-full flex-col items-center justify-center px-6 py-16" :style="{ fontFamily: FONT }">
    <div class="w-full max-w-md text-center">
      <OqWordmark class-name="mx-auto h-7 w-auto" />
      <h1 class="mt-8 text-2xl font-semibold" :style="{ color: BRAND.ink }">Email confirmed</h1>
      <p class="mt-2 text-sm" :style="{ color: BRAND.gray500 }">
        <strong :style="{ color: BRAND.ink }">{{ account.email }}</strong> is confirmed. Invoices,
        catalogue alerts and password resets will reach you there.
      </p>
      <button
        type="button"
        class="mt-6 rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
        :style="{ background: BRAND.blueSolid }"
        @click="navigate('/campaigns')"
      >
        Continue to OptiQube
      </button>
    </div>
  </div>
</template>
