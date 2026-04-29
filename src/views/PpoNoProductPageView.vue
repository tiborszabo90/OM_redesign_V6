<template>
  <DashboardLayout active-menu-item="campaigns" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="flex flex-col items-center justify-center h-full -translate-y-[5%] px-6">
        <img src="/no_product_page.svg" alt="" class="w-36 mb-8" />
        <h2 class="text-2xl font-semibold text-om-gray-700 mb-2 text-center">We can't display a product page</h2>
        <p class="text-sm text-om-gray-500 mb-8 text-center max-w-md">
          We weren't able to generate a product page preview for your Smart Product Page campaign.
        </p>
        <Button variant="primary" size="md" @click="$emit('go-to-new-campaign')">
          Try another campaign type
        </Button>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Button from '../components/shared/Button.vue'

defineEmits(['menu-click', 'go-to-new-campaign'])
</script>
