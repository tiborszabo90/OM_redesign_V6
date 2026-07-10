<script setup>
import { ref, computed } from 'vue'
import { state, products } from '../store'
import WizardHeader from '../components/WizardHeader.vue'
import { ExternalLink, Check, Rocket, PawPrint, ShieldCheck, Loader2 } from 'lucide-vue-next'

// off | waiting | on
const status = ref(state.themeEnabled ? 'on' : 'off')
const toggleOn = ref(state.themeEnabled)

const approvedCount = computed(() =>
  products.filter(p => state.selected.includes(p.id) && state.approved[p.id]).length
)

function openEditor() {
  if (status.value !== 'off') return
  status.value = 'waiting'
  setTimeout(() => { toggleOn.value = true }, 1200)
  setTimeout(() => {
    status.value = 'on'
    state.themeEnabled = true
  }, 2400)
}

function publish() {
  if (status.value !== 'on' || !approvedCount.value) return
  state.steps.live = true
  state.published = true
  state.screen = 'done'
}
</script>

<template>
  <div class="max-w-[960px] mx-auto px-6 py-5">
    <WizardHeader
      :step="5"
      title="Turn on Picbear in your theme"
      subtitle="One switch in the theme editor. Without it, Shopify cannot show your new images on the storefront."
      back-to="review"
    />

    <div class="grid grid-cols-[1.15fr_1fr] gap-4 mb-5">
      <!-- Enable pb-card -->
      <div class="pb-card p-5">
        <div class="flex items-center justify-between mb-1">
          <p class="font-semibold text-[#1a1a1a]">App embed in your theme</p>
          <span
            class="text-[11px] font-semibold rounded-full px-2 py-0.5"
            :class="status === 'on' ? 'text-[#0c6b45] bg-[#d7f2e4]' : 'text-[#616161] bg-[#f1f1f1]'"
          >
            {{ status === 'on' ? 'On' : 'Off' }}
          </span>
        </div>
        <p class="text-[12px] text-[#616161] mb-4">
          Current theme: Horizon. The theme editor opens with the Picbear embed already selected, you only press Save.
        </p>

        <button v-if="status === 'off'" class="pb-btn-primary" @click="openEditor">
          <ExternalLink :size="13" /> Open theme editor
        </button>
        <p v-else-if="status === 'waiting'" class="text-[12px] font-medium text-[#616161] flex items-center gap-2">
          <Loader2 :size="14" class="animate-spin text-[#5548e0]" />
          Waiting for you to press Save in the theme editor...
        </p>
        <p v-else class="text-[13px] font-semibold text-[#0c6b45] flex items-center gap-1.5">
          <Check :size="14" /> Picbear is on in your theme
        </p>

        <p class="text-[12px] text-[#8a8a8a] mt-4 flex items-center gap-1.5">
          <ShieldCheck :size="13" class="shrink-0" />
          You only do this once. If you uninstall Picbear, every change is removed automatically.
        </p>
      </div>

      <!-- Faux theme editor -->
      <div class="pb-card p-4">
        <p class="text-[11px] font-semibold text-[#616161] uppercase tracking-wide mb-3">Theme editor · App embeds</p>
        <div class="rounded-lg border border-[#ececec] divide-y divide-[#ececec]">
          <div class="flex items-center gap-2.5 px-3 py-2.5">
            <span class="w-6 h-6 rounded-md bg-[#5548e0] flex items-center justify-center shrink-0">
              <PawPrint :size="13" class="text-white" />
            </span>
            <div class="flex-1">
              <p class="font-medium text-[#1a1a1a] text-[12px]">Picbear AI images</p>
              <p class="text-[11px] text-[#8a8a8a]">Shows your AI images on product pages</p>
            </div>
            <span
              class="w-8 h-[18px] rounded-full transition-colors duration-300 relative shrink-0"
              :class="toggleOn ? 'bg-[#36c98e]' : 'bg-[#d4d4d4]'"
            >
              <span
                class="absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow transition-all duration-300"
                :class="toggleOn ? 'left-[16px]' : 'left-[2px]'"
              ></span>
            </span>
          </div>
          <div class="flex items-center gap-2.5 px-3 py-2.5 opacity-45">
            <span class="w-6 h-6 rounded-md bg-[#ececec] shrink-0"></span>
            <div class="flex-1">
              <div class="h-2.5 w-24 bg-[#ececec] rounded"></div>
            </div>
            <span class="w-8 h-[18px] rounded-full bg-[#d4d4d4] relative shrink-0">
              <span class="absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-white shadow"></span>
            </span>
          </div>
        </div>
        <p class="text-[11px] text-[#8a8a8a] mt-2">This is what you will see. One toggle, then Save.</p>
      </div>
    </div>

    <!-- Go live -->
    <div class="pb-card px-5 py-4 flex items-center gap-3" :class="status === 'on' ? '' : 'opacity-60'">
      <span class="w-8 h-8 rounded-lg bg-[#d7f2e4] flex items-center justify-center shrink-0">
        <Rocket :size="15" class="text-[#0c6b45]" />
      </span>
      <div class="flex-1">
        <p class="font-semibold text-[#1a1a1a]">Everything is ready</p>
        <p class="text-[12px] text-[#616161]">{{ approvedCount }} approved images are waiting. Publishing adds them to your live product pages, you can undo any time.</p>
      </div>
      <button class="pb-btn-primary" :disabled="status !== 'on'" @click="publish">
        <Rocket :size="13" /> Publish {{ approvedCount }} images and go live
      </button>
    </div>
  </div>
</template>
