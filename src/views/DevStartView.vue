<template>
  <div class="min-h-screen-safe bg-white flex items-center justify-center">
    <div class="text-center">
      <div class="flex flex-col gap-4">
        <button
          @click="$emit('select', 'email')"
          class="px-8 py-4 bg-transparent text-om-gray-700 text-lg font-medium rounded-xl border border-om-gray-200 hover:border-om-orange-500 hover:shadow-[0_4px_14px_rgba(237,90,41,0.4)] transition-all cursor-pointer"
        >
          Email Registration
        </button>

        <button
          @click="$emit('select', 'shopify')"
          class="px-8 py-4 bg-transparent text-om-gray-700 text-lg font-medium rounded-xl border border-om-gray-200 hover:border-om-orange-500 hover:shadow-[0_4px_14px_rgba(237,90,41,0.4)] transition-all cursor-pointer"
        >
          Shopify Registration
        </button>

        <button
          @click="$emit('go-home')"
          class="px-8 py-4 bg-transparent text-om-gray-700 text-lg font-medium rounded-xl border border-om-gray-200 hover:border-om-orange-500 hover:shadow-[0_4px_14px_rgba(237,90,41,0.4)] transition-all cursor-pointer"
        >
          Home
        </button>

        <button
          @click="$emit('go-design-guide')"
          class="px-8 py-4 bg-transparent text-om-gray-700 text-lg font-medium rounded-xl border border-om-gray-200 hover:border-om-orange-500 hover:shadow-[0_4px_14px_rgba(237,90,41,0.4)] transition-all cursor-pointer"
        >
          Design Guide
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['select', 'go-home', 'go-design-guide'])
</script>
