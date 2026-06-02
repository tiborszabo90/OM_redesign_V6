<template>
  <div class="bg-white rounded-2xl border border-om-gray-200 shadow-sm overflow-hidden">
    <!-- Tabs -->
    <div v-if="block.questions.length > 1" class="flex border-b border-om-gray-200 px-1.5">
      <button
        v-for="(q, qIdx) in block.questions"
        :key="qIdx"
        @click="block.activeTab = qIdx"
        :class="[
          'px-3 py-1.5 text-xs font-medium border-b-2 -mb-px transition-colors',
          block.activeTab === qIdx
            ? 'border-om-orange-500 text-om-orange-600'
            : 'border-transparent text-om-gray-500 hover:text-om-gray-700 cursor-pointer'
        ]"
      >
        {{ q.tabLabel }}
      </button>
    </div>

    <!-- Active question -->
    <div class="px-3 py-2 border-b border-om-gray-200">
      <p class="text-xs font-semibold text-om-gray-700">{{ activeQuestion.text }}</p>
    </div>

    <!-- Options -->
    <div v-if="!activeQuestion.inputOnly" class="px-1.5 py-1 flex flex-col gap-0.5">
      <button
        v-for="opt in activeQuestion.options"
        :key="opt.id"
        @click="activeQuestion.selectedId = opt.id"
        class="flex items-start gap-2 px-2 py-1.5 rounded-md text-left transition-colors cursor-pointer"
        :class="activeQuestion.selectedId === opt.id ? 'bg-om-orange-50' : 'hover:bg-om-gray-50'"
      >
        <span
          class="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5"
          :class="activeQuestion.selectedId === opt.id ? 'border-om-orange-500' : 'border-om-gray-300'"
        >
          <span v-if="activeQuestion.selectedId === opt.id" class="w-1.5 h-1.5 rounded-full bg-om-orange-500"></span>
        </span>
        <span class="flex-1 min-w-0">
          <span class="block text-xs font-semibold text-om-gray-700">{{ opt.label }}</span>
          <span v-if="opt.description" class="block text-[11px] text-om-gray-500 leading-snug">{{ opt.description }}</span>
        </span>
      </button>
    </div>

    <!-- Free-text input: for an input-only question, or when the selected option allows it (e.g. "Other") -->
    <div v-if="activeQuestion.inputOnly || selectedOption?.allowInput" :class="activeQuestion.inputOnly ? 'px-3 py-2' : 'px-3 pb-2'">
      <input
        v-model="activeQuestion.otherValue"
        type="text"
        :placeholder="(activeQuestion.inputOnly ? activeQuestion.inputPlaceholder : selectedOption?.inputPlaceholder) || 'Type your answer'"
        autofocus
        @keydown.enter.prevent="!continueDisabled && $emit('continue')"
        class="w-full px-3 py-2 border border-om-gray-200 rounded-lg focus:ring-2 focus:ring-om-orange-400 focus:border-transparent transition-colors text-om-gray-700 text-xs"
      />
    </div>

    <!-- Toolbar -->
    <div class="border-t border-om-gray-200 px-2 py-1.5 flex items-center justify-between">
      <div class="flex items-center gap-0.5">
        <button
          @click="block.activeTab = Math.max(0, block.activeTab - 1)"
          :disabled="block.activeTab === 0"
          :class="[
            'w-6 h-6 flex items-center justify-center rounded transition-colors',
            block.activeTab === 0 ? 'text-om-gray-300 cursor-not-allowed' : 'text-om-gray-500 hover:text-om-gray-700 hover:bg-om-gray-100 cursor-pointer'
          ]"
        >
          <ChevronLeft :size="14" />
        </button>
        <button
          @click="block.activeTab = Math.min(block.questions.length - 1, block.activeTab + 1)"
          :disabled="block.activeTab === block.questions.length - 1"
          :class="[
            'w-6 h-6 flex items-center justify-center rounded transition-colors',
            block.activeTab === block.questions.length - 1 ? 'text-om-gray-300 cursor-not-allowed' : 'text-om-gray-500 hover:text-om-gray-700 hover:bg-om-gray-100 cursor-pointer'
          ]"
        >
          <ChevronRight :size="14" />
        </button>
      </div>
      <div class="flex items-center gap-1">
        <button
          @click="$emit('skip')"
          class="px-2.5 py-1 rounded text-xs font-medium text-om-gray-500 hover:text-om-gray-700 hover:bg-om-gray-100 transition-colors cursor-pointer"
        >Skip</button>
        <button
          @click="$emit('continue')"
          :disabled="continueDisabled"
          :class="[
            'px-3 py-1 rounded text-xs font-semibold transition-colors',
            !continueDisabled ? 'bg-om-orange-500 text-white hover:bg-om-orange-600 cursor-pointer' : 'bg-om-gray-200 text-om-gray-400 cursor-not-allowed'
          ]"
        >Continue</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  // Reactive block: { activeTab, questions: [{ tabLabel, text, options:[{id,label,description}], selectedId }] }
  block: { type: Object, required: true },
})

defineEmits(['skip', 'continue'])

const activeQuestion = computed(() => props.block.questions[props.block.activeTab])
const selectedOption = computed(() => activeQuestion.value.options.find((o) => o.id === activeQuestion.value.selectedId) || null)
const continueDisabled = computed(() => {
  const q = activeQuestion.value
  if (q.inputOnly) return !q.otherValue?.trim()
  if (!q.selectedId) return true
  if (selectedOption.value?.allowInput && !q.otherValue?.trim()) return true
  return false
})
</script>
