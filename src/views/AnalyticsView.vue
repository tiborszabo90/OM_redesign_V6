<template>
  <DashboardLayout
    active-menu-item="insights"
    :no-content-padding="true"
    @menu-click="$emit('menu-click', $event)"
  >
    <template #content>
      <div class="analytics-container">
        <iframe
          src="/analytics-app/index.html"
          class="analytics-iframe"
          title="Analytics Dashboard"
        ></iframe>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '../components/layouts/DashboardLayout.vue'

defineEmits(['menu-click'])
</script>

<style scoped>
.analytics-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.analytics-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}
</style>
