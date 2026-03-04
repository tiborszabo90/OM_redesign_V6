<template>
  <MainLayout>
    <template #content>
      <div class="w-full xl:pr-16">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-5xl font-normal text-[#23262A] mb-3 heading-responsive">Everything you need to stop losing customers</h1>
          <p class="text-base text-[#8F97A4] font-light">No credit card required. No surprises. Just results.</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-3">
          <!-- Name Row -->
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-[#23262A] mb-1.5">First name</label>
              <input
                v-model="formData.firstName"
                type="text"
                class="w-full px-3 py-2.5 border border-[#D5D8DD] rounded-xl focus:ring-2 focus:ring-[#ED5A29] focus:border-transparent transition-colors text-[#23262A]"
                placeholder="John"
                required
              />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-[#23262A] mb-1.5">Last name</label>
              <input
                v-model="formData.lastName"
                type="text"
                class="w-full px-3 py-2.5 border border-[#D5D8DD] rounded-xl focus:ring-2 focus:ring-[#ED5A29] focus:border-transparent transition-colors text-[#23262A]"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-[#23262A] mb-1.5">Business email</label>
            <input
              v-model="formData.email"
              type="email"
              class="w-full px-3 py-2.5 border border-[#D5D8DD] rounded-xl focus:ring-2 focus:ring-[#ED5A29] focus:border-transparent transition-colors text-[#23262A]"
              placeholder="john@company.com"
              required
            />
            <p class="text-xs text-[#8F97A4] font-normal mt-1.5">You'll receive important alerts and notifications about your account and popups.</p>
          </div>

          <!-- Password (only for email registration) -->
          <div v-if="props.registrationType === 'email'">
            <label class="block text-sm font-medium text-[#23262A] mb-1.5">Password (8+ characters)</label>
            <input
              v-model="formData.password"
              type="password"
              class="w-full px-3 py-2.5 border border-[#D5D8DD] rounded-xl focus:ring-2 focus:ring-[#ED5A29] focus:border-transparent transition-colors text-[#23262A]"
              placeholder="Enter your password"
              minlength="8"
              required
            />
            <!-- Password Strength Tracker -->
            <div class="mt-2">
              <div class="flex gap-1.5">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="h-1 flex-1 rounded-full transition-colors"
                  :class="i <= passwordStrength ? strengthColors[passwordStrength] : 'bg-[#E3E5E8]'"
                ></div>
              </div>
              <p v-if="formData.password" class="text-xs mt-1.5" :class="strengthTextColors[passwordStrength]">
                {{ strengthLabels[passwordStrength] }}
              </p>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full py-3 bg-[#ED5A29] text-white font-medium rounded-xl hover:bg-[#E54D1F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ED5A29] focus:ring-offset-2 cursor-pointer"
          >
            {{ props.registrationType === 'shopify' ? 'Next' : 'Get Started' }}
          </button>

          <!-- Disclaimer -->
          <p class="text-sm text-[#8F97A4] text-center font-normal">
            By submitting this form, you agree to the
            <a href="#" class="text-[#ED5A29] hover:underline">Terms of Service</a>
            and
            <a href="#" class="text-[#ED5A29] hover:underline">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </template>

    <template #illustration>
      <div class="w-full h-full">
        <img
          src="/mascot/monk1.png"
          alt="OptiMonk Mascot"
          class="w-full h-full object-contain"
        />
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import MainLayout from '../components/layouts/MainLayout.vue'

const props = defineProps({
  registrationType: {
    type: String,
    default: 'email' // 'email' or 'shopify'
  }
})

const emit = defineEmits(['complete'])

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})

// Password strength calculation
const passwordStrength = computed(() => {
  const password = formData.value.password
  if (!password) return 0

  let strength = 0

  // Length check
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++

  // Character variety checks
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  return Math.min(4, strength)
})

const strengthColors = {
  0: 'bg-[#E3E5E8]',
  1: 'bg-red-400',
  2: 'bg-orange-400',
  3: 'bg-yellow-400',
  4: 'bg-green-500'
}

const strengthTextColors = {
  0: 'text-[#8F97A4]',
  1: 'text-red-500',
  2: 'text-orange-500',
  3: 'text-yellow-600',
  4: 'text-green-600'
}

const strengthLabels = {
  0: '',
  1: 'Weak',
  2: 'Fair',
  3: 'Good',
  4: 'Strong'
}

const handleSubmit = () => {
  emit('complete', formData.value)
}
</script>
