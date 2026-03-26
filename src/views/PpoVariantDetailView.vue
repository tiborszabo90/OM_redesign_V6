<template>
  <DashboardLayout active-menu-item="campaigns" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Back + pathway -->
        <div class="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" :icon-only="true" @click="$emit('back')">
            <template #icon><ArrowLeft :size="16" /></template>
          </Button>
          <nav class="flex items-center gap-1.5 text-sm text-om-gray-400">
            <span class="cursor-pointer hover:text-om-gray-600" @click="$emit('back')">Product Page Optimizer</span>
            <span class="text-om-gray-300">›</span>
            <span class="text-om-gray-600 font-medium">{{ variantName }}</span>
          </nav>
        </div>

        <!-- Header -->
        <div class="flex items-center justify-between mb-5">
          <h1 class="text-2xl font-semibold text-om-gray-700">{{ variantName }} — AI Variables</h1>
          <Button variant="primary" size="md" @click="$emit('navigate', 'ai-texts-images-v2-new')">New Variable</Button>
        </div>


        <!-- Table -->
        <div class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] overflow-hidden">
          <div class="grid grid-cols-[1fr_140px_160px_180px_160px] px-6 h-10 items-center border-b border-[#e3e5e8]">
            <span class="text-[13px] font-normal text-om-gray-500">Variable</span>
            <span class="text-[13px] font-normal text-om-gray-500">Type</span>
            <span class="text-[13px] font-normal text-om-gray-500">Generated</span>
            <span class="text-[13px] font-normal text-om-gray-500">Status</span>
            <span class="text-[13px] font-normal text-om-gray-500">Last Updated</span>
          </div>

          <div
            v-for="(item, index) in filteredItems"
            :key="item.id"
            class="grid grid-cols-[1fr_140px_160px_180px_160px] px-6 py-4 items-center cursor-pointer hover:bg-om-gray-50 transition-colors duration-150"
            :class="index < filteredItems.length - 1 ? 'border-b border-om-gray-100' : ''"
          >
            <span class="text-sm font-medium text-om-orange-500 truncate pr-4">{{ item.name }}</span>
            <Tag variant="outlined">{{ item.type }}</Tag>
            <span class="text-sm font-semibold text-om-gray-700">{{ item.generated }}</span>
            <Tag :variant="statusVariant(item.status)">{{ item.status }}</Tag>
            <span class="text-sm text-om-gray-400">{{ item.lastUpdated }}</span>
          </div>

          <div v-if="filteredItems.length === 0" class="py-16 text-center text-sm text-om-gray-400">
            No variables found.
          </div>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Button from '../components/shared/Button.vue'
import Tag from '../components/shared/Tag.vue'
import { ArrowLeft } from 'lucide-vue-next'

const props = defineProps({
  variant: { type: String, default: 'variant1' },
})

defineEmits(['menu-click', 'back', 'navigate'])

const variantName = computed(() => props.variant === 'variant1' ? 'Image, Headline, Subheadline' : 'Headline, Subheadline')


const variant1Items = [
  { id: 0, name: 'AI lifestyle image 1', type: 'Image', generated: '1 / 6', status: 'Ready to use', lastUpdated: 'Mar 13, 2026' },
  { id: 8, name: 'Headline + Subheadline', type: 'Text', generated: '0 / 0', status: 'Draft', lastUpdated: 'Mar 16, 2026' },
]

const variant2Items = []

const items = computed(() => props.variant === 'variant1' ? variant1Items : variant2Items)

const filteredItems = computed(() => items.value)

const statusVariant = (status) => {
  if (status === 'Ready to use') return 'green'
  if (status === 'Pending changes') return 'orange'
  return 'gray-muted'
}
</script>
