<template>
  <div class="xl:pr-16">
    <div :class="registrationType === 'shopify' ? 'mb-6' : 'mb-12'">
      <h2 class="text-5xl font-normal text-[#23262A] mb-4 font-headline heading-responsive">Welcome to OptiMonk 🙌</h2>
      <p class="text-base text-[#8F97A4] max-w-[400px] font-light">
        Let's begin with a few questions to help you get started with OptiMonk.
      </p>
    </div>

    <div class="space-y-5">
      <!-- Shopify Registration Fields -->
      <template v-if="registrationType === 'shopify'">
        <!-- Name Row -->
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-[#23262A] mb-1.5">First name</label>
            <input
              v-model="localData.firstName"
              @input="updateData"
              type="text"
              class="w-full px-3 py-2.5 border border-[#D5D8DD] rounded-xl focus:ring-2 focus:ring-[#ED5A29] focus:border-transparent transition-colors text-[#23262A]"
              placeholder="John"
            />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-[#23262A] mb-1.5">Last name</label>
            <input
              v-model="localData.lastName"
              @input="updateData"
              type="text"
              class="w-full px-3 py-2.5 border border-[#D5D8DD] rounded-xl focus:ring-2 focus:ring-[#ED5A29] focus:border-transparent transition-colors text-[#23262A]"
              placeholder="Doe"
            />
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-[#23262A] mb-1.5">Business email</label>
          <input
            v-model="localData.email"
            @input="updateData"
            type="email"
            class="w-full px-3 py-2.5 border border-[#D5D8DD] rounded-xl focus:ring-2 focus:ring-[#ED5A29] focus:border-transparent transition-colors text-[#23262A]"
            placeholder="john@company.com"
          />
        </div>
      </template>

      <!-- Question 1: Website URL (only for email flow) -->
      <div v-if="registrationType === 'email'">
        <label class="block text-xl font-semibold text-[#23262A] mb-3">
          Which website would you like to optimize?
        </label>
        <input
          type="url"
          v-model="localData.websiteUrl"
          @input="updateData"
          class="w-full px-3 py-2.5 border border-[#D5D8DD] rounded-xl focus:ring-2 focus:ring-[#ED5A29] focus:border-transparent transition-colors text-[#23262A]"
          placeholder="https://example.com"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  registrationType: {
    type: String,
    default: 'email'
  }
})

const emit = defineEmits(['update:modelValue'])

// Default values for Shopify flow
const shopifyDefaults = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@company.com'
}

const localData = reactive({
  websiteUrl: props.modelValue.websiteUrl || '',
  firstName: props.modelValue.firstName || (props.registrationType === 'shopify' ? shopifyDefaults.firstName : ''),
  lastName: props.modelValue.lastName || (props.registrationType === 'shopify' ? shopifyDefaults.lastName : ''),
  email: props.modelValue.email || (props.registrationType === 'shopify' ? shopifyDefaults.email : '')
})

const updateData = () => {
  emit('update:modelValue', { ...localData })
}

// Emit initial values on mount (for Shopify default values)
onMounted(() => {
  if (props.registrationType === 'shopify') {
    updateData()
  }
})

watch(() => props.modelValue, (newVal) => {
  Object.assign(localData, newVal)
}, { deep: true })
</script>
