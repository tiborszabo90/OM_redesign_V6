<template>
  <div class="h-full overflow-y-auto flex items-center justify-center p-8">
    <div class="w-full max-w-md">
      <div class="text-center mb-6">
        <div class="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center text-white"
          style="background: linear-gradient(135deg, #0EA5E9, #0369A1)">
          <Globe :size="22" />
        </div>
        <h2 class="text-xl font-semibold text-om-gray-800">Add your store</h2>
        <p class="text-sm text-om-gray-500 mt-1">We'll analyze the product page and suggest improvements.</p>
      </div>

      <div class="bg-white rounded-2xl border border-om-gray-200 p-5">
        <FormInput v-model="url" label="Store URL" placeholder="example.com" @keydown.enter="analyze" />
        <Button class="w-full mt-5" :disabled="!url.trim() || analyzing" @click="analyze">
          <template #icon><Loader2 v-if="analyzing" :size="16" class="animate-spin" /><Sparkles v-else :size="16" /></template>
          {{ analyzing ? 'Analyzing site…' : ctaLabel }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Globe, Sparkles, Loader2 } from 'lucide-vue-next'
import FormInput from '../../components/shared/FormInput.vue'
import Button from '../../components/shared/Button.vue'

defineProps({ ctaLabel: { type: String, default: 'Analyze' } })
const emit = defineEmits(['done'])

const url = ref('peakgear.example')
const analyzing = ref(false)

function analyze() {
  if (!url.value.trim() || analyzing.value) return
  analyzing.value = true
  // Platform is auto-detected by the AI during analysis — not asked of the user.
  setTimeout(() => {
    analyzing.value = false
    emit('done', { url: url.value.trim() })
  }, 1100)
}
</script>
