<script setup>
import { BRAND, FONT } from '../tokens'
import { account, navigate } from '../store'
import OqWordmark from '../components/OqWordmark.vue'
</script>

<template>
  <div class="flex min-h-full flex-col items-center justify-center px-6 py-16" :style="{ fontFamily: FONT }">
    <div class="w-full max-w-md text-center">
      <OqWordmark class-name="mx-auto h-7 w-auto" />
      <h1 class="mt-8 text-2xl font-semibold" :style="{ color: BRAND.ink }">Join {{ account.name }}</h1>
      <p class="mt-2 text-sm" :style="{ color: BRAND.gray500 }">
        <strong :style="{ color: BRAND.ink }">tomas@nordicsupply.com</strong> has been invited to
        work in this account. You will sign in with your own password, and everything except
        billing is shared.
      </p>
      <button
        type="button"
        class="mt-6 rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
        :style="{ background: BRAND.blueSolid }"
        @click="navigate('/campaigns')"
      >
        Accept invitation
      </button>
    </div>
  </div>
</template>
