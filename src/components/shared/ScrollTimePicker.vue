<template>
  <div class="relative" ref="pickerRef">
    <div
      @click.stop="isOpen = !isOpen"
      class="w-full pl-3 pr-9 py-2 border border-om-gray-200 rounded-lg text-sm text-om-gray-700 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus:shadow-none active:shadow-none cursor-pointer bg-white hover:border-om-gray-300 hover:bg-[#FAFAFA] transition-colors font-funnel"
      style="box-shadow: none !important; outline: none !important;"
    >
      {{ displayValue }}
    </div>
    <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
      <Clock :size="16" class="text-om-gray-600" />
    </div>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 bg-white border border-om-gray-200 rounded-lg shadow-lg p-3"
      style="width: 140px;"
    >
      <div class="flex gap-2">
        <!-- Hours Column -->
        <div class="flex-1">
          <div class="h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-om-gray-300">
            <button
              v-for="hour in hours"
              :key="hour"
              @click.stop="selectHour(hour)"
              :class="[
                'w-full px-2 py-1.5 text-sm font-medium text-center rounded transition-colors font-funnel',
                selectedHour === hour
                  ? 'bg-om-orange-500 text-white'
                  : 'text-om-gray-700 hover:bg-om-gray-100'
              ]"
            >
              {{ hour }}
            </button>
          </div>
        </div>

        <!-- Minutes Column -->
        <div class="flex-1">
          <div class="h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-om-gray-300">
            <button
              v-for="minute in minutes"
              :key="minute"
              @click.stop="selectMinute(minute)"
              :class="[
                'w-full px-2 py-1.5 text-sm font-medium text-center rounded transition-colors font-funnel',
                selectedMinute === minute
                  ? 'bg-om-orange-500 text-white'
                  : 'text-om-gray-700 hover:bg-om-gray-100'
              ]"
            >
              {{ minute }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { Clock } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: String,
    default: '00:00'
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const pickerRef = ref(null)

// Parse initial value
const [initialHour, initialMinute] = props.modelValue.split(':')
const selectedHour = ref(parseInt(initialHour))
const selectedMinute = ref(parseInt(initialMinute))

// Generate hours (00-23)
const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))

// Generate minutes (00-59)
const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

const displayValue = computed(() => {
  return `${selectedHour.value}:${selectedMinute.value}`
})

const selectHour = (hour) => {
  selectedHour.value = hour
  emit('update:modelValue', displayValue.value)
}

const selectMinute = (minute) => {
  selectedMinute.value = minute
  emit('update:modelValue', displayValue.value)
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  const [hour, minute] = newValue.split(':')
  selectedHour.value = hour
  selectedMinute.value = minute
})

// Close on click outside
const handleClickOutside = (event) => {
  if (!pickerRef.value) return

  // Check if click is outside the picker
  if (isOpen.value && !pickerRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

// Add and remove event listener with proper lifecycle hooks
onMounted(() => {
  // Use setTimeout to ensure the event listener is added after the current event cycle
  setTimeout(() => {
    document.addEventListener('mousedown', handleClickOutside)
  }, 0)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
/* Custom scrollbar */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #F1F2F4;
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #D5D8DD;
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #B8BCC4;
}
</style>
