<template>
  <div>
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-[#23262A] mb-3">Add meg a saját elérhetőségeidet is</h2>
      <p class="text-sm text-[#8F97A4] font-light">Kapsz egy e-mailt, amellyel ügynökségi fiókot hozhatsz létre, és egy fiókból érheted el az összes ügyfeled.</p>
    </div>

    <div class="space-y-5">
      <!-- Name Row -->
      <div class="flex gap-4">
        <div class="flex-1">
          <label class="block text-sm font-normal text-[#23262A] mb-1.5">A keresztneved</label>
          <input
            v-model="localData.firstName"
            type="text"
            class="w-full px-3 py-2.5 border border-[#D5D8DD] rounded-xl text-[#23262A] placeholder-[#8F97A4] focus:outline-none focus:ring-2 focus:ring-[#ED5A29] focus:border-transparent"
            placeholder="Keresztnév"
          />
        </div>
        <div class="flex-1">
          <label class="block text-sm font-normal text-[#23262A] mb-1.5">A vezetékneved</label>
          <input
            v-model="localData.lastName"
            type="text"
            class="w-full px-3 py-2.5 border border-[#D5D8DD] rounded-xl text-[#23262A] placeholder-[#8F97A4] focus:outline-none focus:ring-2 focus:ring-[#ED5A29] focus:border-transparent"
            placeholder="Vezetéknév"
          />
        </div>
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm font-normal text-[#23262A] mb-1.5">Az e-mail címed</label>
        <input
          v-model="localData.email"
          type="email"
          class="w-full px-3 py-2.5 border border-[#D5D8DD] rounded-xl text-[#23262A] placeholder-[#8F97A4] focus:outline-none focus:ring-2 focus:ring-[#ED5A29] focus:border-transparent"
          placeholder="E-mail cím"
        />
      </div>

      <!-- Agency Name -->
      <div>
        <label class="block text-sm font-normal text-[#23262A] mb-1.5">Mi az ügynökséged neve?</label>
        <input
          v-model="localData.agencyName"
          type="text"
          class="w-full px-3 py-2.5 border border-[#D5D8DD] rounded-xl text-[#23262A] placeholder-[#8F97A4] focus:outline-none focus:ring-2 focus:ring-[#ED5A29] focus:border-transparent"
          placeholder="Szuper Ügynökség"
        />
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex items-center gap-4 mt-4">
      <button
        @click="handleSubmit"
        class="px-6 py-2.5 bg-[#ED5A29] text-white text-base rounded-xl hover:bg-[#E54D1F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ED5A29] focus:ring-offset-2 cursor-pointer"
      >
        Tovább
      </button>
      <button
        @click="handleSkip"
        class="btn-text px-6 py-2.5 text-base text-[#505763] border border-transparent rounded-xl hover:bg-[#F9FAFB] transition-colors cursor-pointer"
      >
        Most kihagyom
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'auto-next'])

const localData = reactive({
  firstName: props.modelValue.firstName || '',
  lastName: props.modelValue.lastName || '',
  email: props.modelValue.email || '',
  agencyName: props.modelValue.agencyName || ''
})

const handleSubmit = () => {
  emit('update:modelValue', { ...localData, skipped: false })
  emit('auto-next')
}

const handleSkip = () => {
  emit('update:modelValue', { skipped: true })
  emit('auto-next')
}

watch(() => props.modelValue, (newVal) => {
  Object.assign(localData, newVal)
}, { deep: true })
</script>
