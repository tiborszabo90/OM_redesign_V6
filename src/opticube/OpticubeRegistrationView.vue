<template>
  <div class="oc-font min-h-screen-safe bg-white flex">
    <!-- Left: signup form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8">
      <div class="w-full max-w-md">
        <!-- Brand -->
        <div class="flex items-center gap-2 mb-10">
          <div class="w-8 h-8 rounded-[8px] oc-gradient-bg flex items-center justify-center text-white">
            <Box :size="18" />
          </div>
          <span class="text-lg font-bold text-[var(--oc-text)]">OptiCube</span>
        </div>

        <h1 class="text-2xl font-bold text-[var(--oc-text)] mb-1">Create your account</h1>
        <p class="text-sm text-[var(--oc-text-muted)] mb-8">
          Turn your product catalog into winning ads — no credit card required.
        </p>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div class="grid grid-cols-2 gap-3">
            <OcInput v-model="form.firstName" label="First name" placeholder="Jane" required />
            <OcInput v-model="form.lastName" label="Last name" placeholder="Doe" required />
          </div>
          <OcInput v-model="form.email" label="Work email" type="email" placeholder="jane@company.com" required />
          <OcInput
            v-model="form.password"
            label="Password"
            type="password"
            placeholder="••••••••"
            hint="Use at least 8 characters."
            required
          />
          <OcButton type="submit" variant="primary" size="lg" class="w-full" :disabled="!canSubmit">
            Create account
          </OcButton>
        </form>

        <p class="text-sm text-[var(--oc-text-muted)] text-center mt-6">
          Already have an account?
          <button
            type="button"
            class="font-medium text-[var(--oc-primary-600)] hover:underline cursor-pointer"
            @click="$emit('signIn')"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>

    <!-- Right: marketing panel -->
    <div class="hidden lg:flex w-1/2 oc-gradient-bg text-white flex-col justify-center p-14">
      <h2 class="text-3xl font-bold leading-snug mb-8">
        Turn your product catalog into high-performing ads.
      </h2>
      <ul class="space-y-4">
        <li v-for="feature in features" :key="feature" class="flex items-start gap-3">
          <span class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Check :size="14" />
          </span>
          <span class="text-sm opacity-95">{{ feature }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Box, Check } from 'lucide-vue-next'
import './opticube.css'
import OcButton from './components/OcButton.vue'
import OcInput from './components/OcInput.vue'

const emit = defineEmits(['complete', 'signIn'])

const form = ref({ firstName: '', lastName: '', email: '', password: '' })

const canSubmit = computed(() =>
  !!form.value.firstName &&
  !!form.value.lastName &&
  !!form.value.email &&
  form.value.password.length >= 8
)

const features = [
  'Auto-generate branded ad creative from your product feed',
  'Spin up hundreds of creative variations in minutes',
  'Launch and test across Meta, Google, and TikTok',
  'Pinpoint the products and creative that maximize ROAS',
]

const handleSubmit = () => {
  if (canSubmit.value) emit('complete', { ...form.value })
}
</script>
