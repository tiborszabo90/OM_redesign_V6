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

        <!-- Step 1: choose a sign-up method -->
        <div v-if="step === 'choose'" class="flex flex-col gap-3">
          <OcButton variant="outline" size="lg" class="w-full" @click="step = 'email'">
            <template #icon><Mail :size="18" /></template>
            Sign up with email
          </OcButton>

          <OcButton variant="outline" size="lg" class="w-full" @click="handleOAuth('google')">
            <template #icon>
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
            </template>
            Sign up with Google
          </OcButton>

          <OcButton variant="outline" size="lg" class="w-full" @click="handleOAuth('facebook')">
            <template #icon>
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
              </svg>
            </template>
            Sign up with Facebook
          </OcButton>
        </div>

        <!-- Step 2: email registration form -->
        <form v-else class="space-y-4" @submit.prevent="handleSubmit">
          <button
            type="button"
            class="flex items-center gap-1.5 text-sm text-[var(--oc-text-muted)] hover:text-[var(--oc-neutral-700)] mb-1 cursor-pointer transition-colors"
            @click="step = 'choose'"
          >
            <ArrowLeft :size="15" />
            Back
          </button>
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
import { Box, Check, Mail, ArrowLeft } from 'lucide-vue-next'
import './opticube.css'
import OcButton from './components/OcButton.vue'
import OcInput from './components/OcInput.vue'

const emit = defineEmits(['complete', 'signIn'])

// 'choose' = pick a sign-up method, 'email' = the email registration form
const step = ref('choose')
const form = ref({ firstName: '', lastName: '', email: '', password: '' })

// Google / Facebook behave like OAuth elsewhere — pass straight through to onboarding.
const handleOAuth = (provider) => emit('complete', { ...form.value, method: provider })

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
  if (canSubmit.value) emit('complete', { ...form.value, method: 'email' })
}
</script>
