<script setup>
import { ref, computed } from 'vue'
import { state, products, bestseller, styleById, placementOptions, openEditor } from '../store'
import WizardHeader from '../components/WizardHeader.vue'
import StyledImage from '../components/StyledImage.vue'
import GenerateLimit from '../components/GenerateLimit.vue'
import { Sparkles, ArrowRight, Pencil, RefreshCw, Check, Loader2, SlidersHorizontal } from 'lucide-vue-next'

// preview (fine-tune) | scope (how many to generate) | batch (running)
// Persisted so it survives the fine-tune round trip.
const phase = computed({
  get: () => state.genPhase,
  set: v => { state.genPhase = v },
})
const doneCount = ref(0)
const regenerating = ref(false)

const selectedProducts = computed(() => products.filter(p => state.selected.includes(p.id)))

// A live account picks from the whole catalog, so it also picks how many of the
// selected products to generate now; onboarding always generates its 10.
const capped = computed(() => !state.published)
const batchLimit = ref(selectedProducts.value.length)
const batch = computed(() => (capped.value ? selectedProducts.value : selectedProducts.value.slice(0, batchLimit.value)))
const chosenStyle = computed(() => styleById(state.style) || styleById('lifestyle'))
const chosenPlacement = computed(() => placementOptions.find(o => o.id === state.placement))

function regenerate() {
  if (regenerating.value) return
  regenerating.value = true
  setTimeout(() => { regenerating.value = false }, 1500)
}

// Onboarding generates its 10 credits straight away; a live account first picks
// how many of the selected products to generate on the scope step.
function nextFromPreview() {
  if (capped.value) return generateAll()
  phase.value = 'scope'
}

function generateAll() {
  phase.value = 'batch'
  // the fine-tuned bestseller image is already done
  state.generated = { [bestseller.id]: 'done' }
  doneCount.value = 1
  const rest = batch.value.filter(p => p.id !== bestseller.id)
  if (!rest.length) {
    state.approved[bestseller.id] = true
    return setTimeout(() => { state.screen = 'review' }, 700)
  }
  rest.forEach((p, i) => {
    state.generated[p.id] = 'pending'
    setTimeout(() => {
      state.generated[p.id] = 'done'
      doneCount.value = i + 2
      if (i === rest.length - 1) {
        batch.value.forEach(sp => { state.approved[sp.id] = true })
        setTimeout(() => { state.screen = 'review' }, 700)
      }
    }, 1400 + i * 1400)
  })
}

function edit(screen) {
  if (phase.value !== 'batch') state.screen = screen
}
</script>

<template>
  <!-- Column layout so the action bar sits at the bottom on short pages too. -->
  <div class="min-h-full flex flex-col">
    <div class="flex-1 py-5">
      <div class="max-w-[960px] mx-auto px-6">
      <WizardHeader
        v-if="phase === 'scope'"
        :step="4"
        title="Generate images"
        subtitle="Pick how many of the selected products to generate now. The rest stay in the variation and can be topped up later."
        back-to=""
        @back="phase = 'preview'"
      />
      <WizardHeader
        v-else
        :step="4"
        title="Fine-tune your image"
        subtitle="Your bestseller is already rendered in the look you picked. Tweak it here, then apply the same look to every product."
        back-to="products"
      />

      <!-- Summary -->
      <div class="pb-card px-4 py-3 mb-4 flex items-center gap-2 flex-wrap">
        <span class="text-[12px] font-semibold text-[#1a1a1a] bg-[#f1f1f1] rounded-full px-2.5 py-1 inline-flex items-center gap-1.5 cursor-pointer" @click="edit('style')">
          Style: {{ chosenStyle.name }} <Pencil :size="10" class="text-[#8a8a8a]" />
        </span>
        <span class="text-[12px] font-semibold text-[#1a1a1a] bg-[#f1f1f1] rounded-full px-2.5 py-1 inline-flex items-center gap-1.5 cursor-pointer" @click="edit('placement')">
          Placement: {{ chosenPlacement.name }} <Pencil :size="10" class="text-[#8a8a8a]" />
        </span>
        <span class="text-[12px] font-semibold text-[#1a1a1a] bg-[#f1f1f1] rounded-full px-2.5 py-1 inline-flex items-center gap-1.5 cursor-pointer" @click="edit('products')">
          {{ selectedProducts.length }} products <Pencil :size="10" class="text-[#8a8a8a]" />
        </span>
        <span class="flex-1"></span>
        <span v-if="phase === 'batch' && doneCount < batch.length" class="text-[12px] font-medium text-[#616161]">
          Generating {{ doneCount }} of {{ batch.length }}...
        </span>
        <span v-else-if="phase === 'batch'" class="text-[12px] font-semibold text-[#0c6b45]">All done, taking you to review</span>
      </div>

      <!-- SCOPE (how many to generate) -->
      <div v-if="phase === 'scope'" class="pb-card p-5">
        <GenerateLimit :remaining="selectedProducts.length" v-model="batchLimit" />
      </div>

      <!-- FINE-TUNE (single generated image) -->
      <template v-else-if="phase === 'preview'">
        <!-- AI instructions -->
        <div class="pb-card p-4 mb-4">
          <p class="font-semibold text-[#1a1a1a] mb-1">Additional AI instructions <span class="font-normal text-[#8a8a8a]">(optional)</span></p>
          <p class="text-[12px] text-[#616161] mb-2">Applied to this image and every one after it. Tweak it, then regenerate to preview the change.</p>
          <textarea
            v-model="state.instructions"
            rows="2"
            :disabled="regenerating"
            placeholder="e.g. Use a warm outdoor background with natural morning light"
            class="w-full rounded-lg border border-[#d4d4d4] px-3 py-2 text-[13px] outline-none focus:border-[#5548e0] resize-none disabled:opacity-60"
          ></textarea>
        </div>

        <!-- Generated image pb-card -->
        <div class="pb-card p-5">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="font-semibold text-[#1a1a1a]">{{ bestseller.name }}</p>
              <p class="text-[12px] text-[#616161]">Your bestseller in the {{ chosenStyle.name.toLowerCase() }} look. Fine-tune it before we apply the look to the rest.</p>
            </div>
            <span class="text-[11px] font-semibold text-[#3a3468] bg-[#f6f5ff] border border-[#dedbf7] rounded-full px-2 py-0.5">Preview</span>
          </div>

          <div class="flex items-center justify-center gap-6">
            <!-- before -->
            <div class="shrink-0 text-center">
              <div class="w-56 h-56 rounded-xl overflow-hidden relative">
                <img :src="bestseller.img" class="w-full h-full object-cover" />
                <span class="absolute bottom-1.5 left-1.5 text-[11px] font-semibold bg-white/90 rounded px-1.5 py-0.5">Before</span>
              </div>
            </div>
            <ArrowRight :size="22" class="text-[#8a8a8a] shrink-0" />
            <!-- after (already generated) -->
            <div class="shrink-0 w-96 h-96 rounded-xl overflow-hidden ring-1 ring-[#dedbf7] relative">
              <div v-if="regenerating" class="absolute inset-0 pb-skeleton flex items-center justify-center">
                <Loader2 :size="22" class="animate-spin text-[#c9c9c9]" />
              </div>
              <div v-else class="absolute inset-0 pb-fade-in">
                <StyledImage :src="bestseller.img" :overlay="chosenStyle.overlay" ai-tag enhance />
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- BATCH -->
      <template v-else>
        <div class="h-1.5 bg-[#ececec] rounded-full overflow-hidden mb-3">
          <div class="h-full bg-[#5548e0] rounded-full transition-all duration-500" :style="{ width: (doneCount / batch.length) * 100 + '%' }"></div>
        </div>

        <div class="flex items-center justify-between mb-3 px-1">
          <p class="text-[12px] text-[#616161]">{{ doneCount }} of {{ batch.length }} generated</p>
        </div>

        <div class="flex flex-col gap-3">
          <div v-for="p in batch" :key="p.id" class="pb-card px-4 py-3 flex items-center gap-4">
            <div class="flex items-center gap-2.5 shrink-0">
              <div class="w-16 h-16 rounded-lg overflow-hidden relative">
                <img :src="p.img" class="w-full h-full object-cover" />
                <span class="absolute bottom-1 left-1 text-[9px] font-semibold bg-white/90 rounded px-1">Before</span>
              </div>
              <ArrowRight :size="14" class="text-[#8a8a8a]" />
              <div class="w-24 h-24 rounded-lg overflow-hidden relative ring-1 ring-[#dedbf7]">
                <div v-if="state.generated[p.id] !== 'done'" class="absolute inset-0 pb-skeleton flex items-center justify-center">
                  <Loader2 :size="18" class="animate-spin text-[#c9c9c9]" />
                </div>
                <StyledImage v-else :src="p.img" :overlay="chosenStyle.overlay" ai-tag enhance />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-[#1a1a1a] truncate">{{ p.name }}</p>
              <p class="text-[12px] text-[#616161]">{{ chosenStyle.name }} · shown {{ chosenPlacement.name.toLowerCase() }}</p>
            </div>
            <span
              class="shrink-0 inline-flex items-center gap-1.5 text-[12px] font-semibold"
              :class="state.generated[p.id] === 'done' ? 'text-[#0c6b45]' : 'text-[#8a8a8a]'"
            >
              <template v-if="state.generated[p.id] === 'done'"><Check :size="14" /> Done</template>
              <template v-else><Loader2 :size="13" class="animate-spin" /> Generating...</template>
            </span>
          </div>
        </div>

        <p v-if="doneCount < batch.length" class="text-[12px] text-[#8a8a8a] mt-4">
          You can leave this page, we will send you an email when everything is ready.
        </p>
      </template>
    </div>

    </div>

    <!-- Sticky action bar (not while the batch runs) -->
    <div v-if="phase !== 'batch'" class="sticky bottom-[var(--dev-nav-height,0px)] mt-5 px-6 py-3 bg-[#f1f1f1]/90 backdrop-blur border-t border-[#e3e3e3]">
      <div class="max-w-[960px] mx-auto flex items-center justify-between gap-4">
        <p class="text-[12px] text-[#616161]">
          <template v-if="phase === 'scope'">Nothing is generated until you start. You can top up the rest any time.</template>
          <template v-else-if="capped">This look will be applied to all {{ selectedProducts.length }} selected products.</template>
          <template v-else>This look will be applied to every image in the variation, now and later.</template>
        </p>

        <div v-if="phase === 'scope'" class="shrink-0">
          <button class="pb-btn-primary" @click="generateAll">
            <Sparkles :size="13" /> Start generating ({{ batch.length }} product{{ batch.length !== 1 ? 's' : '' }})
          </button>
        </div>

        <div v-else class="flex flex-wrap justify-end gap-2 shrink-0">
          <button class="pb-btn-secondary" :disabled="regenerating" @click="regenerate">
            <RefreshCw :size="13" /> Regenerate
          </button>
          <button class="pb-btn-secondary" @click="openEditor(bestseller.id, 'generate')">
            <SlidersHorizontal :size="13" /> Fine-tune
          </button>
          <button class="pb-btn-primary" @click="nextFromPreview">
            <template v-if="capped"><Sparkles :size="13" /> Generate all {{ selectedProducts.length }}</template>
            <template v-else>Next <ArrowRight :size="13" /></template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
