<script setup>
import { ref, computed } from 'vue'
import { state, products, editSettings, styleById, placementOptions, ratioOptions, variationBatches, isApproved, approveImage, isImageLive, toggleImageLive } from '../store'
import { ArrowLeft, Check, RefreshCw, Loader2, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const product = computed(() => products.find(p => p.id === state.editingId) || products[0])
const s = computed(() => editSettings(state.editingId))
const chosenStyle = computed(() => styleById(state.style) || styleById('lifestyle'))
// The generated image is the creative picked on the style step, same as in setup.
const creative = computed(() => chosenStyle.value.preview || chosenStyle.value.img)

const regenerating = ref(false)

// Paging and approval only make sense when the editor was opened on a variation.
const batch = computed(() => variationBatches.find(b => b.id === state.openVariation) || null)
const siblings = computed(() => batch.value ? products.filter(p => batch.value.generatedIds.includes(p.id)) : [])
const index = computed(() => siblings.value.findIndex(p => p.id === state.editingId))

function step(by) {
  const i = index.value + by
  if (i < 0 || i >= siblings.value.length) return
  state.editingId = siblings.value[i].id
  editSettings(state.editingId)
}

const approved = computed(() => (batch.value ? isApproved(batch.value.id, state.editingId) : false))
const live = computed(() => (batch.value ? isImageLive(batch.value.id, state.editingId) : false))

function toggleLive() {
  if (batch.value) toggleImageLive(batch.value.id, state.editingId)
}

// Approving moves on: the next image that still needs a look opens right away.
function approve() {
  if (!batch.value) return
  approveImage(batch.value.id, state.editingId)
  step(1)
}

function regenerate() {
  regenerating.value = true
  setTimeout(() => { regenerating.value = false }, 1200)
}

function done() {
  if (state.editReturn === 'variations') {
    state.appTab = 'variations'   // openVariation is still set, back to that sub-page
  } else {
    state.appTab = 'home'
    state.screen = state.editReturn
  }
}
</script>

<template>
  <!-- Same surface as the fine-tune step in setup: the image on the left,
       everything you can change on the right. -->
  <div class="min-h-full flex flex-col">
    <div class="flex-1 max-w-[960px] w-full mx-auto px-6 py-5">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-1.5 text-[13px]">
        <button class="pb-btn-ghost -ml-2" @click="done"><ArrowLeft :size="14" /> Back</button>
        <span class="text-[#8a8a8a]">/</span>
        <span class="font-semibold text-[#1a1a1a]">Fine-tune image</span>
      </div>
    </div>

    <!-- Summary: what is being fine-tuned, and the choices behind it -->
    <div class="pb-card px-4 py-3 mb-4 flex items-center gap-3">
      <div class="w-11 h-11 rounded-lg overflow-hidden ring-1 ring-[#e3e3e3] shrink-0">
        <img :src="product.img" class="w-full h-full object-cover" />
      </div>
      <div class="min-w-0 flex-1">
        <p class="font-semibold text-[#1a1a1a] truncate">{{ product.name }}</p>
        <p class="text-[12px] text-[#616161] truncate">In the {{ chosenStyle.name.toLowerCase() }} look.</p>
      </div>
      <div class="flex items-center gap-2 shrink-0 flex-wrap justify-end">
        <span class="text-[12px] font-semibold text-[#1a1a1a] bg-[#f1f1f1] rounded-full px-2.5 py-1">Style: {{ chosenStyle.name }}</span>
        <span class="text-[12px] font-semibold text-[#1a1a1a] bg-[#f1f1f1] rounded-full px-2.5 py-1">
          Placement: {{ placementOptions.find(o => o.id === s.placement)?.name }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-[1fr_360px] gap-4 items-start">

      <!-- Generated image -->
      <div class="pb-card overflow-hidden">
        <div v-if="regenerating" class="pb-skeleton w-full aspect-square flex items-center justify-center">
          <Loader2 :size="22" class="animate-spin text-[#c9c9c9]" />
        </div>
        <img v-else :src="creative" class="w-full block pb-fade-in" />
      </div>

      <!-- Options -->
      <div class="flex flex-col gap-4">
        <!-- Image ratios -->
        <div class="pb-card p-4">
          <p class="font-semibold text-[#1a1a1a] mb-2">Image ratios</p>
          <label class="flex items-center gap-2 text-[13px] text-[#303030] mb-3 cursor-pointer select-none">
            <input type="checkbox" v-model="s.ratioSame" class="w-4 h-4 accent-[#1a1a1a]" />
            Use same image for desktop and mobile
          </label>
          <div class="flex gap-3">
            <div class="flex-1 min-w-0">
              <label class="text-[12px] font-medium text-[#616161] mb-1 block">Desktop ratio</label>
              <select v-model="s.desktopRatio" class="w-full rounded-lg border border-[#d4d4d4] px-2.5 py-1.5 text-[13px] bg-white outline-none">
                <option v-for="r in ratioOptions" :key="r" :value="r">{{ r }}</option>
              </select>
            </div>
            <div class="flex-1 min-w-0" :class="s.ratioSame ? 'opacity-45 pointer-events-none' : ''">
              <label class="text-[12px] font-medium text-[#616161] mb-1 block">Mobile ratio</label>
              <select v-model="s.mobileRatio" :disabled="s.ratioSame" class="w-full rounded-lg border border-[#d4d4d4] px-2.5 py-1.5 text-[13px] bg-white outline-none">
                <option v-for="r in ratioOptions" :key="r" :value="r">{{ r }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- AI instructions -->
        <div class="pb-card p-4">
          <p class="font-semibold text-[#1a1a1a] mb-1">Additional AI instructions <span class="font-normal text-[#8a8a8a]">(optional)</span></p>
          <p class="text-[12px] text-[#616161] mb-2">Applied to this image only. Tweak it, then regenerate to preview the change.</p>
          <textarea
            v-model="s.instructions"
            rows="3"
            :disabled="regenerating"
            placeholder="e.g. Warmer tones, morning light, more space around the product"
            class="w-full rounded-lg border border-[#d4d4d4] px-3 py-2 text-[13px] outline-none resize-none disabled:opacity-60 mb-3"
          ></textarea>
          <button class="pb-btn-secondary" :disabled="regenerating" @click="regenerate">
            <Loader2 v-if="regenerating" :size="13" class="animate-spin" />
            <RefreshCw v-else :size="13" />
            {{ regenerating ? 'Generating...' : 'Regenerate image' }}
          </button>
        </div>

      </div>
    </div>
    </div>

    <!-- Sticky action bar, same place as in setup -->
    <div class="sticky bottom-[var(--dev-nav-height,0px)] mt-5 px-6 py-3 bg-white border-t border-[#e3e3e3]">
      <div class="max-w-[960px] mx-auto flex items-center justify-between gap-4">
        <p class="text-[12px] text-[#616161]">
          Approving puts the image live and opens the next one.
        </p>

        <div class="flex items-center gap-2 shrink-0">
          <template v-if="siblings.length > 1">
            <span class="text-[12px] text-[#616161] tabular-nums mr-1">Image {{ index + 1 }} of {{ siblings.length }}</span>
            <button
              class="shrink-0 h-8 w-8 inline-flex items-center justify-center rounded-lg border border-[#d4d4d4] bg-white text-[#303030] shadow-[0_1px_0_rgba(0,0,0,0.06)] hover:bg-[#fafafa] disabled:opacity-40 disabled:cursor-default cursor-pointer"
              :disabled="index <= 0" @click="step(-1)" aria-label="Previous image"
            >
              <ChevronLeft :size="15" class="shrink-0" />
            </button>
            <button
              class="shrink-0 h-8 w-8 inline-flex items-center justify-center rounded-lg border border-[#d4d4d4] bg-white text-[#303030] shadow-[0_1px_0_rgba(0,0,0,0.06)] hover:bg-[#fafafa] disabled:opacity-40 disabled:cursor-default cursor-pointer"
              :disabled="index >= siblings.length - 1" @click="step(1)" aria-label="Next image"
            >
              <ChevronRight :size="15" class="shrink-0" />
            </button>
          </template>

          <template v-if="approved">
            <span class="text-[12px] font-semibold text-[#0c6b45] bg-[#d7f2e4] rounded-full px-3 py-1 inline-flex items-center gap-1.5 ml-1">
              <Check :size="13" /> Approved
            </span>
            <span
              class="w-9 h-[20px] rounded-full transition-colors duration-300 relative shrink-0 cursor-pointer ml-1"
              :class="live ? 'bg-[#36c98e]' : 'bg-[#d4d4d4]'"
              role="switch" :aria-checked="live" aria-label="Serve this image on the storefront"
              @click="toggleLive"
            >
              <span
                class="absolute top-[2px] w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
                :class="live ? 'left-[18px]' : 'left-[2px]'"
              ></span>
            </span>
          </template>
          <button v-else-if="batch" class="pb-btn-primary ml-1" @click="approve">
            <Check :size="13" /> Approve
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
