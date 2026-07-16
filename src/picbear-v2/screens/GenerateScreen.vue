<script setup>
import { ref, computed } from 'vue'
import { state, products, bestseller, styleById, placementOptions, openEditor } from '../store'
import WizardHeader from '../components/WizardHeader.vue'
import StyledImage from '../components/StyledImage.vue'
import { Sparkles, ArrowRight, Pencil, RefreshCw, Check, Loader2, SlidersHorizontal } from 'lucide-vue-next'

// idle | sampling | sample-ready | batch (persisted so it survives the fine-tune round trip)
const phase = computed({
  get: () => state.genPhase,
  set: v => { state.genPhase = v },
})
const doneCount = ref(0)

const selectedProducts = computed(() => products.filter(p => state.selected.includes(p.id)))
const chosenStyle = computed(() => styleById(state.style) || styleById('lifestyle'))
const chosenPlacement = computed(() => placementOptions.find(o => o.id === state.placement))
const restCount = computed(() => Math.max(selectedProducts.value.length - 1, 0))

function generateSample() {
  phase.value = 'sampling'
  setTimeout(() => { phase.value = 'sample-ready' }, 3200)
}

function generateAll() {
  phase.value = 'batch'
  // the sample (bestseller) is already done
  state.generated = { [bestseller.id]: 'done' }
  doneCount.value = 1
  const rest = selectedProducts.value.filter(p => p.id !== bestseller.id)
  rest.forEach((p, i) => {
    state.generated[p.id] = 'pending'
    setTimeout(() => {
      state.generated[p.id] = 'done'
      doneCount.value = i + 2
      if (i === rest.length - 1) {
        selectedProducts.value.forEach(sp => { state.approved[sp.id] = true })
        setTimeout(() => { state.screen = 'review' }, 700)
      }
    }, 1400 + i * 1400)
  })
}

function edit(screen) {
  if (phase.value === 'idle' || phase.value === 'sample-ready') state.screen = screen
}
</script>

<template>
  <div class="py-5">
    <div class="max-w-[960px] mx-auto px-6">
      <WizardHeader
        :step="4"
        title="Generate your images"
        subtitle="First we make one sample so you can check the quality. Approve it, then we generate the rest."
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
        <span v-if="phase === 'batch' && doneCount < selectedProducts.length" class="text-[12px] font-medium text-[#616161]">
          Generating {{ doneCount }} of {{ selectedProducts.length }}...
        </span>
        <span v-else-if="phase === 'batch'" class="text-[12px] font-semibold text-[#0c6b45]">All done, taking you to review</span>
      </div>

      <!-- SAMPLE-FIRST -->
      <template v-if="phase !== 'batch'">
        <!-- AI instructions -->
        <div class="pb-card p-4 mb-4">
          <p class="font-semibold text-[#1a1a1a] mb-1">Additional AI instructions <span class="font-normal text-[#8a8a8a]">(optional)</span></p>
          <p class="text-[12px] text-[#616161] mb-2">Applied to the sample and every image after it. Tweak this, then regenerate the sample to test it.</p>
          <textarea
            v-model="state.instructions"
            rows="2"
            :disabled="phase === 'sampling'"
            placeholder="e.g. Use a warm outdoor background with natural morning light"
            class="w-full rounded-lg border border-[#d4d4d4] px-3 py-2 text-[13px] outline-none focus:border-[#5548e0] resize-none disabled:opacity-60"
          ></textarea>
        </div>

        <!-- Sample pb-card -->
        <div class="pb-card p-5">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="font-semibold text-[#1a1a1a]">Your sample · {{ bestseller.name }}</p>
              <p class="text-[12px] text-[#616161]">We generate one image first so you can confirm the look before the full batch.</p>
            </div>
            <span class="text-[11px] font-semibold text-[#3a3468] bg-[#f6f5ff] border border-[#dedbf7] rounded-full px-2 py-0.5">Sample 1 of {{ selectedProducts.length }}</span>
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
            <!-- after -->
            <div class="shrink-0 w-96 h-96 rounded-xl overflow-hidden ring-1 ring-[#dedbf7] relative">
              <div v-if="phase === 'idle'" class="absolute inset-0 border-2 border-dashed border-[#d4d4d4] rounded-xl flex items-center justify-center bg-[#fafafa]">
                <span class="text-[13px] text-[#8a8a8a] text-center px-3">Your sample<br />appears here</span>
              </div>
              <div v-else-if="phase === 'sampling'" class="absolute inset-0 pb-skeleton"></div>
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
          <div class="h-full bg-[#5548e0] rounded-full transition-all duration-500" :style="{ width: (doneCount / selectedProducts.length) * 100 + '%' }"></div>
        </div>

        <div class="flex items-center justify-between mb-3 px-1">
          <p class="text-[12px] text-[#616161]">{{ doneCount }} of {{ selectedProducts.length }} generated</p>
        </div>

        <div class="flex flex-col gap-3">
          <div v-for="p in selectedProducts" :key="p.id" class="pb-card px-4 py-3 flex items-center gap-4">
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

        <p v-if="doneCount < selectedProducts.length" class="text-[12px] text-[#8a8a8a] mt-4">
          You can leave this page, we will send you an email when everything is ready.
        </p>
      </template>
    </div>

    <!-- Sticky action bar (sample-first phase only) -->
    <div v-if="phase !== 'batch'" class="sticky bottom-[var(--dev-nav-height,0px)] mt-5 px-6 py-3 bg-[#f1f1f1]/90 backdrop-blur border-t border-[#e3e3e3]">
      <div class="max-w-[960px] mx-auto flex items-center justify-between gap-4">
        <template v-if="phase === 'idle'">
          <p class="text-[12px] text-[#8a8a8a]">Takes a few seconds. Nothing is added to your store yet.</p>
          <button class="pb-btn-primary" @click="generateSample">
            <Sparkles :size="13" /> Generate a sample
          </button>
        </template>
        <template v-else-if="phase === 'sampling'">
          <p class="text-[13px] font-medium text-[#616161] flex items-center gap-2">
            <Loader2 :size="15" class="animate-spin text-[#5548e0]" /> Generating your sample...
          </p>
          <span></span>
        </template>
        <template v-else>
          <p class="text-[12px] text-[#616161] flex items-center gap-1.5">
            <Check :size="14" class="text-[#0c6b45] shrink-0" /> Sample ready. We will apply this look to the other {{ restCount }} products.
          </p>
          <div class="flex flex-wrap justify-end gap-2 shrink-0">
            <button class="pb-btn-secondary" @click="generateSample">
              <RefreshCw :size="13" /> Regenerate
            </button>
            <button class="pb-btn-secondary" @click="openEditor(bestseller.id, 'generate')">
              <SlidersHorizontal :size="13" /> Fine-tune
            </button>
            <button class="pb-btn-primary" @click="generateAll">
              <Sparkles :size="13" /> Looks good, generate all {{ selectedProducts.length }}
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
