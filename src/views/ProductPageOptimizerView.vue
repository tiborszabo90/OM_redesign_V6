<template>
  <DashboardLayout active-menu-item="campaigns" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="flex h-full min-h-0">

        <!-- Left panel: type selector -->
        <div class="w-105 shrink-0 flex flex-col min-h-0 border-r border-om-gray-100">

          <!-- Header -->
          <div class="px-6 pt-6 pb-4 shrink-0">
            <button
              class="flex items-center gap-1.5 text-sm text-om-gray-500 hover:text-om-gray-700 transition-colors mb-4"
              @click="$emit('back')"
            >
              <ChevronLeft :size="18" />
              Back
            </button>
            <h1 class="text-xl font-semibold text-om-gray-700">Product Page Optimizer</h1>
            <p class="text-sm text-om-gray-400 mt-1">Válaszd ki, milyen AI tartalmakat szeretnél a termékoldaladon.</p>
          </div>

          <!-- Type list -->
          <div class="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-2">
            <div
              v-for="type in contentTypes"
              :key="type.id"
              class="flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-150"
              :class="selectedTypes.includes(type.id)
                ? 'border-om-orange-500 bg-om-orange-50'
                : type.comingSoon
                  ? 'border-om-gray-100 bg-om-gray-50 cursor-default opacity-60'
                  : 'border-om-gray-200 bg-white hover:border-om-gray-300'"
              @click="!type.comingSoon && toggleType(type.id)"
            >
              <div
                class="w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-colors"
                :class="selectedTypes.includes(type.id) ? 'border-om-orange-500 bg-om-orange-500' : 'border-om-gray-300 bg-white'"
              >
                <Check v-if="selectedTypes.includes(type.id)" :size="12" class="text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-om-gray-700">{{ type.label }}</span>
                  <Tag v-if="type.comingSoon" variant="gray-muted">Hamarosan</Tag>
                </div>
                <p class="text-xs text-om-gray-400 mt-0.5">{{ type.description }}</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-om-gray-100 shrink-0">
            <p class="text-xs text-om-gray-400">{{ selectedTypes.length }} típus kiválasztva</p>
          </div>
        </div>

        <!-- Right panel: product page preview -->
        <div class="flex-1 min-w-0 bg-om-gray-50 overflow-y-auto p-6 flex flex-col items-center">

          <div class="flex items-center justify-between w-full mb-4">
            <p class="text-xs text-om-gray-400">Preview — ahol megjelennek a kiválasztott típusok</p>
            <Button variant="primary" size="sm" :disabled="selectedTypes.length === 0" @click="emit('next', selectedTypes)">
              Következő lépés
            </Button>
          </div>

          <!-- Browser frame -->
          <div class="w-full max-w-170 bg-white rounded-2xl shadow-[0_4px_24px_0_rgb(0_0_0/0.08)] overflow-hidden">

            <!-- Browser chrome -->
            <div class="bg-om-gray-100 px-4 py-2.5 flex items-center gap-2 border-b border-om-gray-200">
              <div class="flex gap-1.5">
                <div class="w-3 h-3 rounded-full bg-om-gray-300" />
                <div class="w-3 h-3 rounded-full bg-om-gray-300" />
                <div class="w-3 h-3 rounded-full bg-om-gray-300" />
              </div>
              <div class="flex-1 mx-3 bg-white rounded-md px-3 py-1 text-xs text-om-gray-400 border border-om-gray-200">
                yourstore.com/products/premium-headphones
              </div>
            </div>

            <!-- Product page -->
            <div class="p-6">

              <!-- Product detail row -->
              <div class="flex gap-5">

                <!-- Product image -->
                <div class="w-52 shrink-0 flex flex-col gap-1.5">
                  <PreviewArea label="Termékkép" :active="isSelected('product-image')" class="w-full rounded-xl" style="aspect-ratio:1/1;">
                    <div class="w-full h-full bg-om-gray-100 flex items-center justify-center rounded-xl">
                      <ImageIcon :size="28" class="text-om-gray-300" />
                    </div>
                  </PreviewArea>
                  <div class="flex gap-1.5">
                    <div v-for="i in 4" :key="i" class="flex-1 aspect-square rounded-md bg-om-gray-100" />
                  </div>
                </div>

                <!-- Text info -->
                <div class="flex-1 min-w-0 flex flex-col gap-3 pt-1">

                  <!-- Headline -->
                  <TextPreviewArea label="Headline" :active="isSelected('headline')">
                    <div class="h-7 bg-om-gray-800 rounded w-4/5" />
                  </TextPreviewArea>

                  <!-- Subheadline -->
                  <TextPreviewArea label="Subheadline" :active="isSelected('subheadline')">
                    <div class="h-5 bg-om-gray-300 rounded w-3/5" />
                  </TextPreviewArea>

                  <!-- Price row (static) -->
                  <div class="flex items-center gap-2">
                    <div class="h-6 bg-om-gray-800 rounded w-16" />
                    <div class="h-4 bg-om-gray-200 rounded w-10" />
                  </div>

                  <!-- Benefit list -->
                  <TextPreviewArea v-if="isSelected('benefit-list')" label="Benefit list" :active="true">
                    <div class="space-y-2">
                      <div v-for="i in 4" :key="i" class="flex items-center gap-2">
                        <div class="w-4 h-4 rounded-full bg-om-gray-200 shrink-0" />
                        <div class="h-4 bg-om-gray-200 rounded" :style="`width: ${[80,65,75,60][i-1]}%`" />
                      </div>
                    </div>
                  </TextPreviewArea>

                  <!-- Product sentence -->
                  <TextPreviewArea v-if="isSelected('product-sentence')" label="Product sentence" :active="true">
                    <div class="h-5 bg-om-gray-200 rounded w-full" />
                  </TextPreviewArea>

                  <!-- Summary -->
                  <TextPreviewArea label="Summary" :active="isSelected('summary')">
                    <div class="space-y-2">
                      <div class="h-4 bg-om-gray-200 rounded w-full" />
                      <div class="h-4 bg-om-gray-200 rounded w-5/6" />
                      <div class="h-4 bg-om-gray-200 rounded w-4/6" />
                    </div>
                  </TextPreviewArea>

                  <!-- CTA -->
                  <div class="h-8 bg-om-gray-800 rounded-lg w-2/3 mt-1" />
                </div>
              </div>

              <!-- Image with badge – hero banner -->
              <PreviewArea
                v-if="isSelected('image-badge')"
                label="Kép badge-el"
                :active="true"
                class="w-full rounded-xl mt-6"
                style="aspect-ratio: 16/5;"
              >
                <div class="w-full h-full bg-linear-to-r from-om-gray-100 to-om-gray-200 flex items-center justify-center rounded-xl">
                  <ImageIcon :size="28" class="text-om-gray-300" />
                </div>
              </PreviewArea>

              <!-- Termékösszefoglaló (image + text combined) -->
              <PreviewArea label="Termékösszefoglaló" :active="isSelected('product-summary')" class="mt-6 rounded-xl">
                <div class="flex gap-4 p-3 bg-om-gray-50 rounded-xl">
                  <div class="w-20 h-20 bg-om-gray-200 rounded-lg shrink-0" />
                  <div class="flex flex-col justify-center gap-2 flex-1">
                    <div class="h-4 bg-om-gray-300 rounded w-3/4" />
                    <div class="h-3 bg-om-gray-200 rounded w-full" />
                    <div class="h-3 bg-om-gray-200 rounded w-2/3" />
                  </div>
                </div>
              </PreviewArea>

            </div>
          </div>

          <p v-if="selectedTypes.length === 0" class="text-sm text-om-gray-400 mt-6 text-center">
            Válassz típust a bal oldalon a preview megjelenítéséhez
          </p>

        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, defineComponent, h } from 'vue'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Button from '../components/shared/Button.vue'
import Tag from '../components/shared/Tag.vue'
import { ChevronLeft, Check, ImageIcon } from 'lucide-vue-next'

const emit = defineEmits(['menu-click', 'back', 'next'])

const selectedTypes = ref([])

const toggleType = (id) => {
  const idx = selectedTypes.value.indexOf(id)
  if (idx === -1) selectedTypes.value.push(id)
  else selectedTypes.value.splice(idx, 1)
}

const isSelected = (id) => selectedTypes.value.includes(id)

const contentTypes = [
  { id: 'product-image',    label: 'Termékkép',          description: 'AI-generált termékkép lifestyle háttérrel.',             comingSoon: false },
  { id: 'image-badge',      label: 'Kép badge-el',       description: 'Termékkép akciós vagy egyéb badge-dzsel.',               comingSoon: false },
  { id: 'headline',         label: 'Headline',           description: 'AI-generált főcím a termékhez.',                         comingSoon: false },
  { id: 'subheadline',      label: 'Subheadline',        description: 'Kiegészítő alcím a headline alatt.',                     comingSoon: false },
  { id: 'benefit-list',     label: 'Benefit list',       description: 'Felsorolás a termék legfontosabb előnyeiről.',           comingSoon: false },
  { id: 'product-sentence', label: 'Product sentence',  description: 'Egyetlen összefoglaló mondat a termékről.',              comingSoon: false },
  { id: 'summary',          label: 'Summary',            description: 'Rövid szöveges összefoglaló a termék értékajánlatáról.', comingSoon: false },
  { id: 'product-summary',  label: 'Termékösszefoglaló',description: 'Kép és szöveg együtt — teljes termékblokk.',             comingSoon: true  },
]

// Image preview wrapper — ring around full container
const PreviewArea = defineComponent({
  props: { active: Boolean, label: String },
  setup(props, { slots }) {
    return () => h(
      'div',
      { class: `relative transition-all duration-200 ${props.active ? 'ring-2 ring-om-orange-400 ring-offset-2 rounded-xl' : ''}` },
      [
        slots.default?.(),
        props.active
          ? h('div', { class: 'absolute -top-1 right-2 z-10 -translate-y-1/2' },
              h(Tag, { variant: 'orange-solid', size: 'sm' }, () => props.label)
            )
          : null,
      ]
    )
  },
})

// Text preview wrapper — ring tight around content, label inside top-right
const TextPreviewArea = defineComponent({
  props: { active: Boolean, label: String },
  setup(props, { slots }) {
    return () => h(
      'div',
      { class: `relative transition-all duration-200 ${props.active ? 'ring-2 ring-om-orange-400 ring-offset-1 rounded-sm' : ''}` },
      [
        slots.default?.(),
        props.active
          ? h('div', { class: 'absolute -top-1 right-2 z-10 -translate-y-1/2' },
              h(Tag, { variant: 'orange-solid', size: 'sm' }, () => props.label)
            )
          : null,
      ]
    )
  },
})
</script>
