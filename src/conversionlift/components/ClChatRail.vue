<template>
  <aside class="w-80 shrink-0 border-l border-om-gray-200 bg-white flex flex-col h-full">
    <div class="px-4 h-12 flex items-center gap-2 border-b border-om-gray-100 shrink-0">
      <Sparkles :size="16" class="text-[#0EA5E9]" />
      <span class="text-sm font-semibold text-om-gray-700">AI assistant</span>
    </div>

    <div ref="scroller" class="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-3">
      <p class="text-xs text-om-gray-400">{{ intro }}</p>
      <div v-for="(m, i) in messages" :key="i" class="flex" :class="m.role === 'user' ? 'justify-end' : 'justify-start'">
        <div
          class="max-w-[88%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line"
          :class="m.role === 'user'
            ? 'bg-(--cl-accent-500) text-white rounded-br-sm'
            : 'bg-om-gray-100 text-om-gray-700 rounded-bl-sm'"
        >{{ m.text }}</div>
      </div>
    </div>

    <div class="px-4 pt-2 pb-3 border-t border-om-gray-100 shrink-0">
      <div v-if="suggestions.length" class="flex flex-wrap gap-1.5 mb-2">
        <button
          v-for="s in suggestions"
          :key="s"
          @click="send(s)"
          class="text-xs px-2.5 py-1 rounded-full border border-om-gray-200 text-om-gray-600 hover:border-(--cl-accent-400) hover:text-[#0284C7] transition-colors cursor-pointer"
        >{{ s }}</button>
      </div>
      <div class="flex items-center gap-2">
        <input
          v-model="draft"
          @keydown.enter="send(draft)"
          type="text"
          :placeholder="placeholder"
          class="flex-1 px-3 h-9 text-sm border border-om-gray-200 rounded-lg focus:outline-none"
        />
        <Button size="sm" icon-only :disabled="!draft.trim()" @click="send(draft)">
          <template #icon><ArrowUp :size="16" /></template>
        </Button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { Sparkles, ArrowUp } from 'lucide-vue-next'
import Button from '../../components/shared/Button.vue'

const props = defineProps({
  messages: { type: Array, default: () => [] },
  suggestions: { type: Array, default: () => [] },
  intro: { type: String, default: 'Refine the result in plain language.' },
  placeholder: { type: String, default: 'Ask for a tweak…' },
})
const emit = defineEmits(['send'])

const draft = ref('')
const scroller = ref(null)

function send(text) {
  const t = (text || '').trim()
  if (!t) return
  emit('send', t)
  draft.value = ''
}

watch(() => props.messages.length, async () => {
  await nextTick()
  if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight
})
</script>
