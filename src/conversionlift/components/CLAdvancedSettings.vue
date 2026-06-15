<template>
  <div class="space-y-3">
    <div class="grid grid-cols-2 gap-2">
      <div><div class="text-[11px] text-om-gray-500 mb-1">Model</div><Dropdown v-model="genModel" :options="modelOptions" size="sm" /></div>
      <div><div class="text-[11px] text-om-gray-500 mb-1">Ratio</div><Dropdown v-model="genRatio" :options="ratioOptions" size="sm" /></div>
    </div>
    <div>
      <div class="text-[11px] text-om-gray-500 mb-1">Usage location</div>
      <div class="flex gap-4">
        <label class="flex items-center gap-1.5 text-xs text-om-gray-700 cursor-pointer"><input type="radio" v-model="usageLocation" value="product" class="accent-[#0EA5E9]" />Product page</label>
        <label class="flex items-center gap-1.5 text-xs text-om-gray-700 cursor-pointer"><input type="radio" v-model="usageLocation" value="popup" class="accent-[#0EA5E9]" />Popup/Embedded</label>
      </div>
    </div>
    <div>
      <div class="text-[11px] text-om-gray-500 mb-1">Available data sources</div>
      <div class="flex flex-wrap gap-1.5"><Tag v-for="s in genDataSources" :key="s" variant="orange">{{ s }}</Tag></div>
    </div>
    <div>
      <div class="text-[11px] text-om-gray-500 mb-1">Variables</div>
      <div class="flex flex-wrap gap-1.5"><Tag v-for="v in genVariables" :key="v" variant="green">{{ v }}</Tag></div>
    </div>
    <label class="flex items-center justify-between gap-2 cursor-pointer"><span class="text-xs text-om-gray-700">Auto-generate prompt variables for missing products</span><ToggleSwitch v-model="autoGenVars" /></label>
    <label class="flex items-center justify-between gap-2"><span class="text-xs text-om-gray-700">Minimum description length</span><input v-model="minDescLen" type="number" min="0" class="w-14 text-sm text-right border border-om-gray-200 rounded-lg px-2 py-1 bg-white outline-none focus:border-(--cl-accent-400)" /></label>
    <label class="flex items-center justify-between gap-2 cursor-pointer"><span class="text-xs text-om-gray-700">Use multiple product images</span><ToggleSwitch v-model="useMultipleImages" /></label>
    <div>
      <div class="text-[11px] text-om-gray-500 mb-1">Source images</div>
      <div class="flex gap-1.5"><img v-for="(img, i) in sourceImages" :key="i" :src="img" alt="" class="w-10 h-10 rounded-lg object-cover border border-om-gray-200" /></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Dropdown from '../../components/shared/Dropdown.vue'
import ToggleSwitch from '../../components/shared/ToggleSwitch.vue'
import Tag from '../../components/shared/Tag.vue'
import { storeImages } from '../data/storeImages.js'

const genModel = ref('Gemini 2.5 Flash Image')
const modelOptions = ['Gemini 2.5 Flash Image', 'Flux Pro 1.1', 'SDXL', 'DALL·E 3']
const genRatio = ref('4:3 (Landscape)')
const ratioOptions = ['1:1 (Square)', '4:3 (Landscape)', '16:9 (Wide)', '9:16 (Portrait)']
const usageLocation = ref('popup')
const genDataSources = ['Product name', 'Product description', 'Recommended product name', 'Recommended product description']
const genVariables = ['peopleImage2']
const autoGenVars = ref(true)
const minDescLen = ref(0)
const useMultipleImages = ref(false)
const sourceImages = storeImages.gallery.slice(0, 2)
</script>
