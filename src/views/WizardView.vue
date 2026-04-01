<template>
  <div class="h-screen-safe bg-white flex flex-col relative overflow-hidden">
    <!-- Logo at top left corner -->
    <div class="fixed top-8 left-8 z-50">
      <img
        src="/OM-Logo-primary-basic.svg"
        alt="OptiMonk"
        class="h-8"
      />
    </div>

    <!-- Main content area - centered -->
    <div class="w-full h-full flex items-center justify-center px-8">
      <div class="w-full max-w-180">
        <!-- Heading -->
        <div class="mb-8 text-center">
          <h1 class="text-4xl font-semibold text-[#23262A]">What is your goal?</h1>
        </div>

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
            <ArrowUp :size="16" />
          </button>
        </div>

        <!-- Example prompts (Pill Chips) -->
        <div class="mt-2 flex flex-wrap items-center justify-center gap-2">
          <span class="text-sm text-[#8F97A4]">Try with an example</span>
          <button
            v-for="example in examples"
            :key="example.label"
            @click="selectExample(example.prompt)"
            class="chip flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-om-gray-200 text-sm text-om-gray-700 transition-all duration-200 ease-out cursor-pointer hover:scale-[1.02] hover:border-om-orange-300"
          >
            <component :is="example.iconComponent" :size="16" class="text-om-gray-500" />
            <span>{{ example.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Mail, ShoppingCart, TrendingUp, ArrowUp } from 'lucide-vue-next'

const emit = defineEmits(['submit'])

const textareaRef = ref(null)
const message = ref('')

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
    iconComponent: Mail
  },
  {
    label: 'Stop cart abandonment',
    prompt: 'I want to reduce shopping cart abandonment',
    iconComponent: ShoppingCart
  },
  {
    label: 'Increase sales',
    prompt: 'I want to increase my sales and revenue',
    iconComponent: TrendingUp
  }
]

const selectExample = (prompt) => {
  message.value = prompt
  textareaRef.value?.focus()
}

const handleSubmit = () => {
  if (message.value?.trim()) {
    emit('submit', message.value)
  }
}
</script>
