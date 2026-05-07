<template>
  <div class="relative">
    <button
      @click="emit('sign-out')"
      class="fixed top-6 md:top-10 right-8 z-50 text-base font-semibold text-om-orange-500 hover:underline cursor-pointer"
    >
      Sign out
    </button>

    <div class="flex flex-col items-center text-center pt-6">
      <div class="mb-10 origin-top scale-125 h-57.25 sm:h-76.25">
        <WebsiteScanAnimation skeleton-only />
      </div>

      <h1 class="text-2xl font-bold text-om-gray-700 mb-6 leading-tight px-4">
        Editing requires a desktop computer or laptop.
      </h1>

      <p class="text-base text-om-gray-500 mb-4 px-4">
        We've sent you an email so you can easily continue later.
      </p>

      <p class="text-base text-om-gray-500 px-4">
        While you're away, we'll analyze your website and prepare personalized recommendations to help you get started faster.
      </p>
    </div>
  </div>
</template>

<script setup>
import WebsiteScanAnimation from '../illustrations/WebsiteScanAnimation.vue'

const emit = defineEmits(['sign-out'])
</script>
