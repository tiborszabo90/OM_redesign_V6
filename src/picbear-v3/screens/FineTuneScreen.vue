<script setup>
import { ref, computed, watch } from 'vue'
import { state, products, editSettings, styleById, placementOptions, ratioOptions, variationBatches, isApproved, approveImage, isImageLive, toggleImageLive, isOutdated, historyFor, restoreImage, regenerateImage, currentImage, isSkipped, toggleSkip } from '../store'
import RatioPreview from '../components/RatioPreview.vue'
import { ArrowLeft, Check, RefreshCw, Loader2, ChevronLeft, ChevronRight, History, Undo2, X, Ban } from 'lucide-vue-next'

const product = computed(() => products.find(p => p.id === state.editingId) || products[0])
const s = computed(() => editSettings(state.editingId))
const chosenStyle = computed(() => styleById(state.style) || styleById('lifestyle'))
// The creative picked on the style step, unless an older version was restored.
const styleCreative = computed(() => chosenStyle.value.preview || chosenStyle.value.img)
const creative = computed(() =>
  batch.value ? currentImage(batch.value.id, state.editingId, styleCreative.value) : styleCreative.value
)

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

// Ratios are a variation-level setting, so on a variation the preview follows
// the batch; only the setup review edits them per image.
const ratios = computed(() => batch.value || s.value)

// ── history and staleness ──
// Every edit keeps what it replaced, so going back costs nothing and generates
// nothing. Only makes sense on a variation, where the versions are recorded.
const historyOpen = ref(false)
const pending = computed(() => state.generated[state.editingId] === 'pending')
const history = computed(() => (batch.value ? historyFor(batch.value.id, state.editingId) : []))
const stale = computed(() => (batch.value ? isOutdated(batch.value, state.editingId) && !isSkipped(batch.value.id, state.editingId) : false))

function restore(entryId) {
  restoreImage(batch.value.id, state.editingId, entryId, styleCreative.value)
  historyOpen.value = false
}

function regenerateCurrent() {
  if (!batch.value) return regenerate()
  historyOpen.value = false
  regenerateImage(batch.value.id, state.editingId, styleCreative.value)
}

// Paging to another image closes the history of the one you left.
watch(() => state.editingId, () => { historyOpen.value = false })

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

// Skipping is the other half of the same decision: keep the product's own photo
// for this variation. Like approving, it moves to the next image.
const skipped = computed(() => (batch.value ? isSkipped(batch.value.id, state.editingId) : false))

function skip() {
  if (!batch.value) return
  toggleSkip(batch.value.id, state.editingId)
  step(1)
}

function unskip() {
  if (batch.value) toggleSkip(batch.value.id, state.editingId)
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

    <!-- Made before the variation's settings changed -->
    <div v-if="stale" class="pb-card px-4 py-3 mb-4 flex items-center gap-3">
      <span class="w-8 h-8 rounded-lg bg-[#fdf1e3] border border-[#f5e0c2] flex items-center justify-center shrink-0">
        <History :size="15" class="text-[#9a6a00]" />
      </span>
      <p class="flex-1 min-w-0 text-[13px] text-[#303030]">
        <span class="font-semibold">This image was made with previous settings.</span>
        It keeps serving until you regenerate it.
      </p>
      <button class="pb-btn-secondary shrink-0" :disabled="pending" @click="regenerateCurrent">
        <RefreshCw :size="13" /> Regenerate
      </button>
    </div>

    <div class="grid grid-cols-[1fr_360px] gap-4 items-start">

      <!-- Generated image, cropped to the ratio it goes out in -->
      <RatioPreview
        :src="creative"
        :desktop-ratio="ratios.desktopRatio"
        :mobile-ratio="ratios.mobileRatio"
        :same="ratios.ratioSame"
        :loading="regenerating || pending"
      />

      <!-- Options -->
      <div class="flex flex-col gap-4">
        <!-- Earlier versions of this image; the list itself opens in a modal so
             it stays usable however many versions pile up. -->
        <div v-if="batch" class="pb-card p-4 flex items-center justify-between gap-3">
          <div class="min-w-0">
            <p class="font-semibold text-[#1a1a1a] inline-flex items-center gap-2">
              <History :size="15" class="text-[#8a8a8a]" /> Image history
            </p>
            <p class="text-[12px] text-[#616161] mt-0.5">
              {{ history.length ? `${history.length} earlier ${history.length === 1 ? 'version' : 'versions'} kept` : 'No earlier version yet' }}
            </p>
          </div>
          <button class="pb-btn-secondary shrink-0" :disabled="!history.length" @click="historyOpen = true">
            View all
          </button>
        </div>

        <!-- Image ratios: not per image, so they are out of the way when the
             editor is paging through a variation's generated images. -->
        <div v-if="!batch" class="pb-card p-4">
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
            :disabled="regenerating || pending"
            placeholder="e.g. Warmer tones, morning light, more space around the product"
            class="w-full rounded-lg border border-[#d4d4d4] px-3 py-2 text-[13px] outline-none resize-none disabled:opacity-60 mb-3"
          ></textarea>
          <button class="pb-btn-secondary" :disabled="regenerating || pending" @click="regenerateCurrent">
            <Loader2 v-if="regenerating || pending" :size="13" class="animate-spin" />
            <RefreshCw v-else :size="13" />
            {{ regenerating || pending ? 'Generating...' : 'Regenerate image' }}
          </button>
        </div>

      </div>
    </div>
    </div>

    <!-- Image history -->
    <div v-if="historyOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" @click="historyOpen = false"></div>
      <div class="pb-card relative z-10 w-full max-w-[720px] max-h-[85vh] flex flex-col p-5">
        <div class="flex items-start justify-between gap-4 mb-1">
          <div class="min-w-0">
            <p class="text-lg font-bold text-[#1a1a1a] leading-tight">Image history</p>
            <p class="text-[13px] text-[#616161] mt-0.5 truncate">{{ product.name }}</p>
          </div>
          <button class="text-[#8a8a8a] hover:text-[#1a1a1a] cursor-pointer shrink-0" @click="historyOpen = false" aria-label="Close">
            <X :size="18" />
          </button>
        </div>
        <p class="text-[12px] text-[#616161] mb-4">
          Restoring swaps a version back in and keeps the one it replaces. Nothing is
          generated and nothing is charged.
        </p>

        <div class="overflow-y-auto -mx-1 px-1">
          <!-- What is serving right now, so the versions have something to compare to -->
          <div class="flex items-center gap-3 rounded-lg border border-[#f2d9c9] bg-[#fdf4ef] p-2.5 mb-3">
            <div class="w-14 h-14 rounded-md overflow-hidden ring-1 ring-[#f2d9c9] shrink-0">
              <img :src="creative" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[13px] font-semibold text-[#6b3319]">Current image</p>
              <p class="text-[12px] text-[#8a6a55]">{{ stale ? 'Made with previous settings' : 'Made with the settings you have now' }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="h in history" :key="h.id"
              class="flex items-center gap-3 rounded-lg border border-[#ececec] p-2.5"
            >
              <div class="w-14 h-14 rounded-md overflow-hidden ring-1 ring-[#e3e3e3] shrink-0">
                <img :src="h.img" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[13px] font-medium text-[#1a1a1a]">{{ h.when }}</p>
                <p class="text-[12px] text-[#616161] truncate">{{ h.note }}</p>
              </div>
              <button class="pb-btn-secondary shrink-0" @click="restore(h.id)">
                <Undo2 :size="13" /> Restore
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky action bar, same place as in setup -->
    <div class="sticky bottom-[var(--dev-nav-height,0px)] mt-5 px-6 py-3 bg-white border-t border-[#e3e3e3]">
      <div class="max-w-[960px] mx-auto flex items-center justify-between gap-4">
        <p class="text-[12px] text-[#616161]">
          <template v-if="skipped">This product keeps its own photo in this variation.</template>
          <template v-else>Approving puts the image live and opens the next one. Skipping keeps the original photo.</template>
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

          <template v-if="skipped">
            <span class="text-[12px] font-semibold text-[#616161] bg-[#f1f1f1] rounded-full px-3 py-1 inline-flex items-center gap-1.5 ml-1">
              <Ban :size="13" /> Skipped
            </span>
            <button class="pb-btn-secondary ml-1" @click="unskip">
              <Undo2 :size="13" /> Use the AI image
            </button>
          </template>

          <template v-else-if="approved">
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
          <template v-else-if="batch">
            <button class="pb-btn-secondary ml-1" @click="skip">
              <Ban :size="13" /> Skip
            </button>
            <button class="pb-btn-primary" @click="approve">
              <Check :size="13" /> Approve
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
