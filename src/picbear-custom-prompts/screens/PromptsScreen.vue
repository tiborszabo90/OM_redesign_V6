<script setup>
import { ref, watch } from 'vue'
import {
  state, products, customPrompts, baseLookLabels, baseLookImages,
  createPromptDraft, promptById, savePrompt, deletePrompt, duplicatePrompt,
} from '../store'
import {
  PawPrint, ChevronRight, Plus, Pencil, Copy, Trash2,
  ArrowRight, Loader2, Sparkles,
} from 'lucide-vue-next'

// picbear-custom-prompts: manage reusable custom AI prompts. List + full-page
// two-pane editor (form left, live preview right).
const baseLooks = Object.keys(baseLookLabels)

// ── Editor draft ──
const draft = ref(null)
const previewImg = ref(null)
const generating = ref(false)

watch(() => state.promptEditorId, (id) => {
  if (id === 'new') {
    draft.value = createPromptDraft()
  } else if (id != null) {
    const p = promptById(id)
    draft.value = p ? { ...p } : createPromptDraft()
  } else {
    draft.value = null
    return
  }
  previewImg.value = draft.value.previewImg || null
  generating.value = false
}, { immediate: true })

function previewProduct() {
  return products.find(p => p.id === draft.value.previewProductId) || products[0]
}

let previewTimer = null
function generatePreview() {
  generating.value = true
  previewImg.value = null
  clearTimeout(previewTimer)
  previewTimer = setTimeout(() => {
    previewImg.value = baseLookImages[draft.value.baseStyle] || baseLookImages.none
    generating.value = false
  }, 1200)
}

// ── List actions ──
function newPrompt() { state.promptEditorId = 'new' }
function edit(p) { state.promptEditorId = p.id }
function backToList() { state.promptEditorId = null }

function save() {
  draft.value.previewImg = previewImg.value
  savePrompt(draft.value)
  state.promptEditorId = null
}
</script>

<template>
  <!-- ══ Editor ══ -->
  <div v-if="draft" class="max-w-[1040px] mx-auto px-6 py-5">
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-2">
        <span class="w-7 h-7 rounded-lg bg-[#5548e0] flex items-center justify-center">
          <PawPrint :size="15" class="text-white" />
        </span>
        <ChevronRight :size="14" class="text-[#8a8a8a]" />
        <button class="text-[#616161] hover:text-[#1a1a1a] cursor-pointer" @click="backToList">Prompts</button>
        <ChevronRight :size="14" class="text-[#8a8a8a]" />
        <h1 class="text-lg font-bold text-[#1a1a1a]">{{ draft.name || 'New prompt' }}</h1>
      </div>
      <button class="pb-btn-primary disabled:opacity-45 disabled:cursor-default" :disabled="!draft.name.trim()" @click="save">Save prompt</button>
    </div>

    <div class="grid grid-cols-[1fr_1fr] gap-4">
      <!-- Form -->
      <div class="pb-card p-5">
        <p class="text-[12px] text-[#6d7175] mb-1">Prompt name</p>
        <input
          v-model="draft.name"
          type="text"
          placeholder="e.g. Cozy morning kitchen"
          class="w-full px-3 py-2 border border-[#c9cccf] rounded-md text-[14px] mb-4 focus:outline-none focus:border-[#5548e0]"
        />

        <p class="text-[12px] text-[#6d7175] mb-1">Base look</p>
        <select v-model="draft.baseStyle" class="w-full px-3 py-2 border border-[#c9cccf] rounded-md text-[14px] bg-white mb-4 cursor-pointer">
          <option v-for="k in baseLooks" :key="k" :value="k">{{ baseLookLabels[k] }}</option>
        </select>

        <p class="text-[12px] text-[#6d7175] mb-1">Instructions</p>
        <textarea
          v-model="draft.instructions"
          rows="6"
          placeholder="Describe how the AI should transform the product image…"
          class="w-full px-3 py-2 border border-[#c9cccf] rounded-md text-[14px] resize-y mb-4 focus:outline-none focus:border-[#5548e0]"
        ></textarea>

        <p class="text-[12px] text-[#6d7175] mb-1">Preview on product</p>
        <select v-model="draft.previewProductId" class="w-full px-3 py-2 border border-[#c9cccf] rounded-md text-[14px] bg-white cursor-pointer">
          <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
      </div>

      <!-- Preview -->
      <div class="pb-card p-5 flex flex-col">
        <div class="flex items-center justify-between mb-3">
          <p class="text-[13px] font-semibold text-[#1a1a1a]">Preview</p>
          <button class="pb-btn-secondary flex items-center gap-1" :disabled="generating" @click="generatePreview">
            <Sparkles :size="13" /> Generate preview
          </button>
        </div>

        <div class="flex-1 flex items-center justify-center gap-3">
          <div class="flex-1">
            <p class="text-[11px] text-[#6d7175] mb-1 text-center">Original</p>
            <img :src="previewProduct().img" alt="" class="w-full aspect-square object-cover rounded-lg border border-[#e0e0e0]" />
          </div>
          <ArrowRight :size="18" class="text-[#999] shrink-0" />
          <div class="flex-1">
            <p class="text-[11px] text-[#6d7175] mb-1 text-center">Upgraded</p>
            <div class="w-full aspect-square rounded-lg border border-[#e0e0e0] overflow-hidden bg-[#f6f6f6] flex items-center justify-center">
              <div v-if="generating" class="pb-skeleton w-full h-full flex items-center justify-center">
                <Loader2 :size="18" class="animate-spin text-[#8a8a8a]" />
              </div>
              <img v-else-if="previewImg" :src="previewImg" alt="" class="w-full h-full object-cover pb-fade-in" />
              <span v-else class="text-[12px] text-[#8a8a8a] px-4 text-center">Generate a preview to see the result</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ══ List ══ -->
  <div v-else class="max-w-[960px] mx-auto px-6 py-5">
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-2">
        <span class="w-7 h-7 rounded-lg bg-[#5548e0] flex items-center justify-center">
          <PawPrint :size="15" class="text-white" />
        </span>
        <ChevronRight :size="14" class="text-[#8a8a8a]" />
        <h1 class="text-lg font-bold text-[#1a1a1a]">Prompts</h1>
      </div>
      <button class="pb-btn-primary flex items-center gap-1" @click="newPrompt"><Plus :size="14" /> New prompt</button>
    </div>

    <div class="pb-card p-4 mb-5">
      <p class="text-[13px] text-[#1a1a1a]">
        Save reusable AI instructions here, then pick them as a <span class="font-semibold">Custom</span> style when creating a variation.
      </p>
    </div>

    <!-- Empty state -->
    <div v-if="!customPrompts.length" class="pb-card p-8 text-center">
      <span class="w-12 h-12 rounded-xl bg-[#f6f5ff] border border-[#dedbf7] inline-flex items-center justify-center mb-4">
        <Sparkles :size="22" class="text-[#5548e0]" />
      </span>
      <h2 class="text-xl font-bold text-[#1a1a1a] mb-1.5">No custom prompts yet</h2>
      <p class="text-[13px] text-[#616161] max-w-md mx-auto mb-5">
        Create your first custom prompt to reuse your own AI instructions across variations.
      </p>
      <button class="pb-btn-primary flex items-center gap-1 mx-auto" @click="newPrompt"><Plus :size="14" /> Create your first prompt</button>
    </div>

    <!-- Prompt list -->
    <div v-else class="flex flex-col gap-3">
      <div v-for="p in customPrompts" :key="p.id" class="pb-card p-4 flex items-center gap-4">
        <div class="w-16 h-16 rounded-lg overflow-hidden bg-[#f6f6f6] border border-[#e0e0e0] shrink-0">
          <img v-if="p.previewImg" :src="p.previewImg" alt="" class="w-full h-full object-cover" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <p class="font-semibold text-[#1a1a1a]">{{ p.name }}</p>
            <span class="text-[11px] rounded-full bg-[#f1f2f4] text-[#5c5f62] px-2 py-0.5">{{ baseLookLabels[p.baseStyle] }}</span>
          </div>
          <p class="text-[12px] text-[#616161] line-clamp-2">{{ p.instructions }}</p>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <button class="pb-btn-ghost flex items-center gap-1" @click="edit(p)"><Pencil :size="13" /> Edit</button>
          <button class="text-[#616161] hover:text-[#1a1a1a] cursor-pointer" title="Duplicate" @click="duplicatePrompt(p.id)"><Copy :size="15" /></button>
          <button class="text-[#d72c0d] hover:opacity-70 cursor-pointer" title="Delete" @click="deletePrompt(p.id)"><Trash2 :size="15" /></button>
        </div>
      </div>
    </div>
  </div>
</template>
