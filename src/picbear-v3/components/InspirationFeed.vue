<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { inspirationFeed } from '../store'
import { X } from 'lucide-vue-next'

defineProps({
  note: { type: String, default: 'Real Picbear images from other Shopify stores.' },
})

// Feed image opened in the inspiration modal.
const preview = ref(null)

function onKeydown(e) {
  if (e.key === 'Escape') preview.value = null
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div>
    <h2 class="text-lg font-bold text-[#1a1a1a]">See what other stores made</h2>
    <p class="text-[13px] text-[#616161] mt-1 mb-4">{{ note }}</p>
    <div class="grid grid-cols-4 gap-3">
      <button
        v-for="item in inspirationFeed" :key="item.img"
        class="aspect-square rounded-xl overflow-hidden border border-[#e3e3e3] bg-white cursor-zoom-in"
        @click="preview = item"
      >
        <img :src="item.img" :alt="item.title" loading="lazy" class="w-full h-full object-cover transition-transform duration-200 hover:scale-[1.04]" />
      </button>
    </div>
  </div>

  <!-- Inspiration preview -->
  <div
    v-if="preview"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    @click="preview = null"
  >
    <div class="grid w-full max-w-[57.6rem] sm:grid-cols-[1fr_336px] rounded-2xl overflow-hidden bg-white shadow-xl" @click.stop>
      <div class="bg-white p-6">
        <img :src="preview.img" :alt="preview.title" class="w-full rounded-xl" />
      </div>
      <div class="flex flex-col p-5">
        <div class="flex items-start justify-between gap-2">
          <div>
            <p class="text-[12px] font-medium uppercase tracking-wide text-[#8a8a8a]">Inspiration</p>
            <h3 class="mt-1 text-lg font-semibold text-[#1a1a1a]">{{ preview.title }}</h3>
            <p class="mt-1 text-[13px] text-[#8a8a8a]">PicBear gallery · {{ preview.style }}</p>
          </div>
          <button class="rounded-md p-1 text-[#8a8a8a] hover:text-[#1a1a1a] cursor-pointer" aria-label="Close" @click="preview = null">
            <X :size="16" />
          </button>
        </div>
        <p class="mt-4 flex-1 text-[13px] leading-relaxed text-[#616161]">
          Start a new task for <strong class="text-[#1a1a1a]">roast-and-co.com</strong> using this
          creative as a visual reference. The image will be attached; you can refine in chat next.
        </p>
        <button
          class="mt-4 w-full rounded-lg px-4 py-2.5 text-[13px] font-semibold text-white bg-[#b2592e] hover:bg-[#96481f] cursor-pointer"
          @click="preview = null"
        >
          Use this as Inspiration
        </button>
      </div>
    </div>
  </div>
</template>
