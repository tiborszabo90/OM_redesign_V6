<template>
  <!-- Subpage opened from the flyout menu: one product's content full-width,
       with NO left products submenu and NO tabs. The flyout on the rail handles
       switching between products. -->
  <DashboardLayout
    :nav-items="clNavItemsWithFlyout"
    logo-src="/conversion_lift_logo_white_by_optimonk%201.svg"
    active-menu-item="conversion-lift"
    @menu-click="onMenu"
  >
    <template #content>
      <div class="w-full max-w-[1400px] mx-auto">
        <ClProductsPanel :show-tabs="false" :product="product" />
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import ClProductsPanel from './ClProductsPanel.vue'
import { clNavItemsWithFlyout } from '../data/clNavItems.js'

defineProps({
  product: { type: String, default: 'ai-texts-images' },
})

const emit = defineEmits(['menu-click'])
const onMenu = (id) => { if (id !== 'conversion-lift') emit('menu-click', id) }
</script>
