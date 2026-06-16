<template>
  <!--
    Conversion Lift → Products.
    Reuses the existing SettingsView, scoped to the "Products" group and rendered
    inside the Conversion Lift sidebar context. The `navigate` event is
    intentionally NOT forwarded, so the embedded AI Texts & Images sub-screens
    stay contained inside this view (no jump back to the Settings route).
  -->
  <SettingsView
    :nav-groups="['products']"
    sidebar-title="Conversion Lift"
    layout-active-menu-item="conversion-lift"
    :layout-nav-items="clNavItems"
    layout-logo-src="/conversion_lift_logo_white_by_optimonk%201.svg"
    initial-section="products-ai-texts-images-v2"
    @menu-click="$emit('menu-click', $event)"
  />
</template>

<script setup>
import SettingsView from './SettingsView.vue'
import { clNavItems } from '../data/clNavItems.js'

defineEmits(['menu-click'])
</script>
