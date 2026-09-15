<script setup>
import { LOGO_SRC, LOGO_SRC_DARK } from '../tokens'
import { state } from '../store'

/**
 * The mark is near-black on transparent, so on a dark ground it disappears
 * entirely — every surface that draws it has to pick the variant.
 */
defineProps({ className: { type: String, default: '' } })
</script>

<template>
  <img :src="state.theme === 'dark' ? LOGO_SRC_DARK : LOGO_SRC" alt="OptiQube" :class="className" />
</template>
