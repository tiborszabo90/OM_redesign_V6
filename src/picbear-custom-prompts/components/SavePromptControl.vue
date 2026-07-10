<script setup>
import { ref } from 'vue'
import { state, products, savePrompt, baseLookImages, baseLookLabels } from '../store'
import { Bookmark, Check, X } from 'lucide-vue-next'

// Save the current instructions as a reusable custom prompt (appears under the
// Prompts tab and the custom-prompt picker). Naming happens in a modal.
const props = defineProps({ instructions: { type: String, default: '' } })

const open = ref(false)
const name = ref('')
const saved = ref(false)

const baseLooks = ['lifestyle', 'badge', 'valueprop', 'people']
function currentBaseStyle() {
  return baseLooks.includes(state.style) ? state.style : 'none'
}

function start() {
  name.value = ''
  saved.value = false
  open.value = true
}
function close() {
  open.value = false
}
function save() {
  if (!name.value.trim()) return
  const baseStyle = currentBaseStyle()
  savePrompt({
    id: null,
    name: name.value.trim(),
    baseStyle,
    instructions: props.instructions.trim(),
    previewProductId: products[0].id,
    previewImg: baseLookImages[baseStyle] || null,
  })
  open.value = false
  saved.value = true
}
</script>

<template>
  <div>
    <button
      v-if="!saved"
      class="pb-btn-ghost flex items-center gap-1 disabled:opacity-45 disabled:cursor-default"
      :disabled="!instructions.trim()"
      @click="start"
    >
      <Bookmark :size="13" /> Save as prompt
    </button>
    <span v-else class="text-[13px] text-[#008060] font-semibold flex items-center gap-1">
      <Check :size="14" /> Saved to Prompts
    </span>

    <!-- Save modal -->
    <Teleport to="body">
      <div
        v-if="open"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40"
        style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, sans-serif"
        @click.self="close"
      >
        <div class="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between px-5 py-3.5 bg-[#f6f6f7] border-b border-[#e3e3e3]">
            <p class="text-[14px] font-semibold text-[#1a1a1a]">Save as prompt</p>
            <button class="text-[#616161] hover:text-[#1a1a1a] cursor-pointer" @click="close"><X :size="18" /></button>
          </div>

          <div class="p-5">
            <p class="text-[12px] text-[#6d7175] mb-1">Prompt name</p>
            <input
              v-model="name"
              type="text"
              placeholder="e.g. Cozy morning kitchen"
              class="w-full px-3 py-2 border border-[#c9cccf] rounded-md text-[14px] mb-4 focus:outline-none focus:border-[#5548e0]"
              @keyup.enter="save"
            />

            <p class="text-[12px] text-[#6d7175] mb-1">Base look</p>
            <p class="text-[13px] text-[#1a1a1a]">{{ baseLookLabels[currentBaseStyle()] }}</p>
          </div>

          <div class="flex justify-end gap-2 px-5 py-4 border-t border-[#e3e3e3]">
            <button class="pb-btn-secondary" @click="close">Cancel</button>
            <button class="pb-btn-primary disabled:opacity-45 disabled:cursor-default" :disabled="!name.trim()" @click="save">Save prompt</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
