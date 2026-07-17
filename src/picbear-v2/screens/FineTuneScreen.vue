<script setup>
import { ref, computed } from 'vue'
import { state, products, editSettings, styleById, placementOptions, ratioOptions, ratioCss } from '../store'
import StyledImage from '../components/StyledImage.vue'
import { ArrowLeft, Check, RefreshCw, Loader2, Monitor, Smartphone } from 'lucide-vue-next'

const product = computed(() => products.find(p => p.id === state.editingId) || products[0])
const s = computed(() => editSettings(state.editingId))
const chosenStyle = computed(() => styleById(state.style) || styleById('lifestyle'))

const tab = ref('content')        // content | placement
const device = ref('desktop')     // desktop | mobile
const regenerating = ref(false)

const activeRatio = computed(() =>
  device.value === 'mobile' && !s.value.ratioSame ? s.value.mobileRatio : s.value.desktopRatio
)

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
  <div class="max-w-[1040px] mx-auto px-6 py-5">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-1.5 text-[13px]">
        <button class="pb-btn-ghost -ml-2" @click="done"><ArrowLeft :size="14" /> Back</button>
        <span class="text-[#8a8a8a]">/</span>
        <span class="font-semibold text-[#1a1a1a]">Fine-tune image</span>
      </div>
      <button class="pb-btn-primary" @click="done"><Check :size="13" /> Done</button>
    </div>

    <div class="pb-card px-4 py-3 mb-4 flex items-center gap-3">
      <img :src="product.img" class="w-9 h-9 rounded-lg object-cover" />
      <p class="text-[13px] text-[#1a1a1a]">
        Editing <span class="font-semibold">{{ product.name }}</span> across desktop and mobile storefront previews.
      </p>
    </div>

    <div class="grid grid-cols-[minmax(0,380px)_1fr] gap-4">
      <!-- Controls -->
      <div class="pb-card overflow-hidden">
        <!-- tabs -->
        <div class="flex border-b border-[#ececec] px-4">
          <button
            v-for="t in ['content', 'placement']" :key="t"
            class="text-[13px] font-semibold py-3 mr-5 border-b-2 -mb-px cursor-pointer capitalize"
            :class="tab === t ? 'border-[#5548e0] text-[#1a1a1a]' : 'border-transparent text-[#8a8a8a]'"
            @click="tab = t"
          >{{ t }}</button>
        </div>

        <!-- content tab -->
        <div v-if="tab === 'content'" class="p-4">
          <p class="font-semibold text-[#1a1a1a] mb-3">Image</p>

          <label class="text-[12px] font-medium text-[#616161] mb-1 block">Additional instructions</label>
          <textarea
            v-model="s.instructions"
            rows="3"
            :disabled="regenerating"
            placeholder="e.g. Warmer tones, morning light, more space around the product"
            class="w-full rounded-lg border border-[#d4d4d4] px-3 py-2 text-[13px] outline-none focus:border-[#5548e0] resize-none disabled:opacity-60 mb-3"
          ></textarea>
          <button class="pb-btn-secondary" :disabled="regenerating" @click="regenerate">
            <Loader2 v-if="regenerating" :size="13" class="animate-spin" />
            <RefreshCw v-else :size="13" />
            {{ regenerating ? 'Generating...' : 'Regenerate image' }}
          </button>

          <div class="h-px bg-[#ececec] my-4"></div>

          <p class="font-semibold text-[#1a1a1a] mb-2">Image ratios</p>
          <label class="flex items-center gap-2 text-[13px] text-[#303030] mb-3 cursor-pointer select-none">
            <input type="checkbox" v-model="s.ratioSame" class="w-4 h-4 accent-[#5548e0]" />
            Use same image for desktop and mobile
          </label>

          <div class="flex gap-3">
            <div class="flex-1">
              <label class="text-[12px] font-medium text-[#616161] mb-1 block">Desktop ratio</label>
              <select v-model="s.desktopRatio" class="w-full rounded-lg border border-[#d4d4d4] px-2.5 py-1.5 text-[13px] bg-white outline-none focus:border-[#5548e0]">
                <option v-for="r in ratioOptions" :key="r" :value="r">{{ r }}</option>
              </select>
            </div>
            <div class="flex-1" :class="s.ratioSame ? 'opacity-45 pointer-events-none' : ''">
              <label class="text-[12px] font-medium text-[#616161] mb-1 block">Mobile ratio</label>
              <select v-model="s.mobileRatio" :disabled="s.ratioSame" class="w-full rounded-lg border border-[#d4d4d4] px-2.5 py-1.5 text-[13px] bg-white outline-none focus:border-[#5548e0]">
                <option v-for="r in ratioOptions" :key="r" :value="r">{{ r }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- placement tab -->
        <div v-else class="p-4 flex flex-col gap-2.5">
          <p class="font-semibold text-[#1a1a1a] mb-1">Where it appears</p>
          <div
            v-for="opt in placementOptions" :key="opt.id"
            class="rounded-xl border p-3 cursor-pointer flex items-start gap-2.5"
            :class="s.placement === opt.id ? 'border-[#5548e0] ring-1 ring-[#5548e0]' : 'border-[#ececec] hover:border-[#d4d4d4]'"
            @click="s.placement = opt.id"
          >
            <span class="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5" :class="s.placement === opt.id ? 'border-[#5548e0]' : 'border-[#c9c9c9]'">
              <span v-if="s.placement === opt.id" class="w-2 h-2 rounded-full bg-[#5548e0]"></span>
            </span>
            <div>
              <p class="text-[13px] font-medium text-[#1a1a1a]">{{ opt.name }}</p>
              <p class="text-[12px] text-[#616161]">{{ opt.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Live preview -->
      <div class="pb-card p-4">
        <div class="flex items-center justify-between mb-3">
          <p class="text-[11px] font-semibold text-[#616161] uppercase tracking-wide">Live preview · {{ activeRatio }}</p>
          <div class="flex gap-1 bg-[#f1f1f1] rounded-lg p-0.5">
            <button
              class="px-2 py-1 rounded-md cursor-pointer flex items-center gap-1 text-[12px] font-medium"
              :class="device === 'desktop' ? 'bg-white shadow-sm text-[#1a1a1a]' : 'text-[#616161]'"
              @click="device = 'desktop'"
            ><Monitor :size="13" /> Desktop</button>
            <button
              class="px-2 py-1 rounded-md cursor-pointer flex items-center gap-1 text-[12px] font-medium"
              :class="device === 'mobile' ? 'bg-white shadow-sm text-[#1a1a1a]' : 'text-[#616161]'"
              @click="device = 'mobile'"
            ><Smartphone :size="13" /> Mobile</button>
          </div>
        </div>

        <!-- storefront mock -->
        <div class="bg-[#f7f7f7] rounded-xl p-4 flex justify-center">
          <div
            class="bg-white rounded-lg border border-[#ececec] p-3 transition-all"
            :style="{ width: device === 'mobile' ? '260px' : '100%' }"
          >
            <!-- hero -->
            <div class="rounded-lg overflow-hidden mb-2 relative" :class="s.placement === 'replace' ? 'ring-2 ring-[#5548e0]' : ''" style="aspect-ratio: 16 / 9">
              <div v-if="regenerating" class="absolute inset-0 pb-skeleton"></div>
              <template v-else>
                <StyledImage v-if="s.placement === 'replace'" :src="product.img" :overlay="chosenStyle.overlay" ai-tag enhance />
                <img v-else :src="product.img" class="w-full h-full object-cover" />
              </template>
            </div>
            <div class="flex gap-1.5 mb-2">
              <div class="w-9 h-9 rounded-md overflow-hidden"><img :src="product.img" class="w-full h-full object-cover" /></div>
              <div class="w-9 h-9 rounded-md bg-[#ececec]"></div>
              <div class="w-9 h-9 rounded-md bg-[#ececec]"></div>
            </div>

            <!-- AI image below hero -->
            <div v-if="s.placement === 'below-hero'" class="rounded-lg overflow-hidden mb-2 ring-2 ring-[#5548e0] relative" :style="{ aspectRatio: ratioCss(activeRatio) }">
              <div v-if="regenerating" class="absolute inset-0 pb-skeleton"></div>
              <StyledImage v-else :src="product.img" :overlay="chosenStyle.overlay" ai-tag enhance />
            </div>

            <div class="h-3 w-2/3 bg-[#e3e3e3] rounded mb-1.5"></div>
            <div class="h-3 w-16 bg-[#e3e3e3] rounded mb-2.5"></div>
            <div class="h-8 w-full bg-[#1a1a1a] rounded-lg mb-3 flex items-center justify-center text-white text-[11px] font-semibold">Add to cart</div>
            <div class="h-2 w-full bg-[#ececec] rounded mb-1"></div>
            <div class="h-2 w-full bg-[#ececec] rounded mb-1"></div>
            <div class="h-2 w-3/4 bg-[#ececec] rounded"></div>

            <!-- AI image below description -->
            <div v-if="s.placement === 'below-desc'" class="rounded-lg overflow-hidden mt-2 ring-2 ring-[#5548e0] relative" :style="{ aspectRatio: ratioCss(activeRatio) }">
              <div v-if="regenerating" class="absolute inset-0 pb-skeleton"></div>
              <StyledImage v-else :src="product.img" :overlay="chosenStyle.overlay" ai-tag enhance />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div class="pb-card px-4 py-3 mt-4 flex items-center gap-6 text-[13px]">
      <span><span class="text-[#616161]">Desktop ratio:</span> <span class="font-semibold text-[#1a1a1a]">{{ s.desktopRatio }}</span></span>
      <span><span class="text-[#616161]">Mobile ratio:</span> <span class="font-semibold text-[#1a1a1a]">{{ s.ratioSame ? s.desktopRatio : s.mobileRatio }}</span></span>
      <span><span class="text-[#616161]">Placement:</span> <span class="font-semibold text-[#1a1a1a]">{{ placementOptions.find(o => o.id === s.placement)?.name }}</span></span>
    </div>
  </div>
</template>
