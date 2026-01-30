<template>
  <div>
    <div class="mb-12">
      <h1 class="text-5xl font-normal text-om-gray-700 font-headline heading-responsive">Great, now let's create your first campaign 🚀</h1>
    </div>

    <label class="block text-xl font-semibold text-om-gray-700 mb-3">
      What should be the goal of your first campaign?
    </label>

    <!-- Input area -->
    <div class="relative">
      <textarea
        ref="textareaRef"
        v-model="message"
        rows="4"
        @keydown.enter.exact.prevent="handleSubmit"
        class="w-full px-4 py-3 border border-[#D5D8DD] rounded-xl focus:ring-2 focus:ring-[#8F97A4] focus:border-transparent transition-colors text-[#23262A] h-32 resize-none pr-12 bg-white"
        :placeholder="currentPlaceholder"
      ></textarea>
      <!-- Submit button -->
      <button
        @click="handleSubmit"
        :disabled="!message?.trim()"
        :class="[
          'absolute bottom-3 right-1.5 w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
          message?.trim() ? 'bg-[#ED5A29] text-white cursor-pointer' : 'bg-[#E3E5E8] text-[#8F97A4] cursor-default'
        ]"
      >
        <!-- uil-arrow-up -->
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.71,11.29l-5-5a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21l-5,5a1,1,0,0,0,1.42,1.42L11,9.41V17a1,1,0,0,0,2,0V9.41l3.29,3.3a1,1,0,0,0,1.42,0A1,1,0,0,0,17.71,11.29Z"/>
        </svg>
      </button>
    </div>

    <!-- Example prompts (Pill Chips) -->
    <div class="mt-3 flex flex-wrap items-center gap-2">
      <button
        v-for="example in examples"
        :key="example.label"
        @click="selectExample(example.prompt)"
        class="chip flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-om-gray-200 text-sm text-om-gray-700 transition-all duration-200 ease-out cursor-pointer hover:scale-[1.02] hover:border-om-orange-300"
      >
        <span class="w-4 h-4 text-om-gray-500" v-html="example.icon"></span>
        <span>{{ example.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'auto-next'])

const textareaRef = ref(null)
const message = ref(props.modelValue?.useCase || '')

// Rotating placeholder state
const currentPlaceholderIndex = ref(0)
const displayedText = ref('')
let typingTimeout = null

// Placeholder suggestions - goals/use cases in sentence form
const placeholderSuggestions = [
  'I want to grow my email subscriber list',
  'I want to reduce cart abandonment',
  'I want to collect feedback from visitors',
  'I want to promote special offers'
]

const currentPlaceholder = computed(() => {
  return displayedText.value || 'Describe your goal...'
})

const typeText = (text, index = 0) => {
  if (index <= text.length) {
    displayedText.value = text.slice(0, index)
    typingTimeout = setTimeout(() => typeText(text, index + 1), 50)
  } else {
    // Wait before erasing
    typingTimeout = setTimeout(() => eraseText(text, text.length), 2000)
  }
}

const eraseText = (text, index) => {
  if (index >= 0) {
    displayedText.value = text.slice(0, index)
    typingTimeout = setTimeout(() => eraseText(text, index - 1), 30)
  } else {
    // Move to next suggestion
    currentPlaceholderIndex.value = (currentPlaceholderIndex.value + 1) % placeholderSuggestions.length
    typingTimeout = setTimeout(() => {
      typeText(placeholderSuggestions[currentPlaceholderIndex.value])
    }, 300)
  }
}

onMounted(() => {
  typeText(placeholderSuggestions[0])
})

onUnmounted(() => {
  if (typingTimeout) {
    clearTimeout(typingTimeout)
  }
})

// Example prompts with icons - 3 chips only
const examples = [
  {
    label: 'Email list building',
    prompt: 'I want to grow my email subscriber list',
    // uil-envelope
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19,4H5A3,3,0,0,0,2,7V17a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm-.41,2-5.88,5.88a1,1,0,0,1-1.42,0L5.41,6ZM20,17a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V7.41l5.88,5.88a3,3,0,0,0,4.24,0L20,7.41Z"/></svg>'
  },
  {
    label: 'Stop cart abandonment',
    prompt: 'I want to reduce shopping cart abandonment',
    // uil-shopping-cart
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.5,19A1.5,1.5,0,1,0,10,20.5,1.5,1.5,0,0,0,8.5,19ZM19,16H7a1,1,0,0,1,0-2h8.49121A3.0132,3.0132,0,0,0,18.376,11.82422L19.96143,6.2749A1.00009,1.00009,0,0,0,19,5H6.73907A3.00666,3.00666,0,0,0,3.92139,3H3A1,1,0,0,0,3,5h.92139a1.00459,1.00459,0,0,1,.96142.7251l.15552.54474.00024.00506L6.6792,12.01709A3.00006,3.00006,0,0,0,7,18H19a1,1,0,0,0,0-2ZM17.67432,7l-1.2212,4.27441A1.00458,1.00458,0,0,1,15.49121,12H8.75439l-.25494-.89221L7.32642,7ZM16.5,19A1.5,1.5,0,1,0,18,20.5,1.5,1.5,0,0,0,16.5,19Z"/></svg>'
  },
  {
    label: 'Collect feedback',
    prompt: 'I want to collect feedback from my visitors',
    // uil-thumbs-up
    icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.3,10.08A3,3,0,0,0,19,9H14.44L15,7.57A4.13,4.13,0,0,0,11.11,2a1,1,0,0,0-.91.59L7.35,9H5a3,3,0,0,0-3,3v7a3,3,0,0,0,3,3H17.73a3,3,0,0,0,2.95-2.46l1.27-7A3,3,0,0,0,21.3,10.08ZM7,20H5a1,1,0,0,1-1-1V12a1,1,0,0,1,1-1H7Zm13-7.82-1.27,7a1,1,0,0,1-1,.82H9V10.21l2.72-6.12A2.11,2.11,0,0,1,13.1,6.87L12.57,8.3A2,2,0,0,0,14.44,11H19a1,1,0,0,1,.77.36A1,1,0,0,1,20,12.18Z"/></svg>'
  }
]

const selectExample = (prompt) => {
  message.value = prompt
  textareaRef.value?.focus()
}

const handleSubmit = () => {
  if (message.value?.trim()) {
    emit('update:modelValue', { useCase: message.value.trim() })
    emit('auto-next')
  }
}
</script>
