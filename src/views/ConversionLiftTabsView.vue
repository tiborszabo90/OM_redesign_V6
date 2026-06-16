<template>
  <!-- Variant B — single full-width page with the Products entries as top tabs. -->
  <DashboardLayout
    :nav-items="clNavItems"
    logo-src="/conversion_lift_logo_white_by_optimonk%201.svg"
    active-menu-item="conversion-lift"
    @menu-click="onMenu"
  >
    <template #content>
      <div class="w-full max-w-[1400px] mx-auto -mt-[10px]">
        <ClProductsPanel />
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import ClProductsPanel from './ClProductsPanel.vue'
import { clNavItems } from '../data/clNavItems.js'

const emit = defineEmits(['menu-click'])
const onMenu = (id) => { if (id !== 'conversion-lift') emit('menu-click', id) }
</script>
