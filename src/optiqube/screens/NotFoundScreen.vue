<script setup>
import { BRAND, FONT } from '../tokens'
</script>

<template>
  <div class="w-full px-6 py-8" :style="{ fontFamily: FONT }">
    <h1 class="text-[28px] font-bold tracking-tight" :style="{ color: BRAND.ink }">Not found</h1>
    <p class="mt-2 text-sm" :style="{ color: BRAND.gray600 }">This address has no screen in the prototype yet.</p>
  </div>
</template>
