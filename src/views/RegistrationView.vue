<template>
  <div class="h-full bg-white flex flex-col relative overflow-hidden">
    <div class="w-full h-full min-h-0 flex flex-col md:flex-row">
      <!-- Left Side - 50% with centered content container -->
      <div class="w-full h-full md:w-1/2 flex items-center px-8 reg-left-pad lg:pr-24 pt-8 pb-8 overflow-hidden relative">
        <img
          src="https://www.optimonk.com/wp-content/uploads/optimonk-logo-2024.svg"
          alt="OptiMonk"
          class="absolute top-8 left-8 h-8"
        />
        <div class="w-full max-w-[516px]">
          <transition name="step-fade" mode="out-in">
          <div :key="currentStep" class="w-full">

            <!-- Back button -->
            <button
              v-if="currentStep !== 'buttons'"
              @click="goBack"
              class="flex items-center gap-1.5 text-sm text-[#8F97A4] hover:text-[#23262A] transition-colors mb-6"
            >
              <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              Back
            </button>

            <!-- Social login buttons view -->
            <template v-if="currentStep === 'buttons'">
              <h2 class="text-3xl font-bold text-om-gray-700 mb-1">Create your free account</h2>
              <p class="text-om-gray-500 mb-8">and unlock your full optimization plan</p>

              <div class="flex flex-col gap-3">
                <Button variant="outline" size="lg" class="w-full" @click="currentStep = 'email-form'">
                  <template #icon><Mail :size="18" /></template>
                  Continue with Email
                </Button>

                <Button variant="outline" size="lg" class="w-full" @click="emit('complete', formData)">
                  <template #icon>
                    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                    </svg>
                  </template>
                  Continue with Google
                </Button>

                <Button variant="outline" size="lg" class="w-full">
                  <template #icon>
                    <img src="/icons/shopify-logo.svg" alt="Shopify" class="w-4.5 h-4.5 object-contain" />
                  </template>
                  Continue with Shopify
                </Button>
              </div>

              <p class="text-xs text-om-gray-400 text-center mt-6">
                By submitting this form, you agree to the
                <a href="#" class="text-om-orange-500 hover:underline">Terms of Service</a>
                and
                <a href="#" class="text-om-orange-500 hover:underline">Privacy Policy</a>.
              </p>
            </template>

            <!-- Email registration form view -->
            <template v-else-if="currentStep === 'email-form'">
              <h2 class="text-3xl font-bold text-om-gray-700 mb-1">Create your free account</h2>
              <p class="text-om-gray-500 mb-6">and unlock your full optimization plan</p>

              <form @submit.prevent="handleEmailSubmit" class="space-y-3">
                <div class="flex gap-3">
                  <div class="flex-1">
                    <label class="block text-sm font-medium text-om-gray-700 mb-1.5">First name</label>
                    <input
                      v-model="formData.firstName"
                      type="text"
                      placeholder="John"
                      required
                      class="w-full px-3 py-2.5 border border-om-gray-200 rounded-xl focus:ring-2 focus:ring-om-orange-400 focus:border-transparent transition-colors text-om-gray-700 text-sm"
                    />
                  </div>
                  <div class="flex-1">
                    <label class="block text-sm font-medium text-om-gray-700 mb-1.5">Last name</label>
                    <input
                      v-model="formData.lastName"
                      type="text"
                      placeholder="Doe"
                      required
                      class="w-full px-3 py-2.5 border border-om-gray-200 rounded-xl focus:ring-2 focus:ring-om-orange-400 focus:border-transparent transition-colors text-om-gray-700 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-om-gray-700 mb-1.5">Business email</label>
                  <input
                    v-model="formData.email"
                    type="email"
                    placeholder="john@company.com"
                    required
                    class="w-full px-3 py-2.5 border border-om-gray-200 rounded-xl focus:ring-2 focus:ring-om-orange-400 focus:border-transparent transition-colors text-om-gray-700 text-sm"
                  />
                  <p class="text-xs text-om-gray-400 mt-1.5">You'll receive important alerts and notifications about your account.</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-om-gray-700 mb-1.5">Password (8+ characters)</label>
                  <input
                    v-model="formData.password"
                    type="password"
                    placeholder="Enter your password"
                    minlength="8"
                    required
                    class="w-full px-3 py-2.5 border border-om-gray-200 rounded-xl focus:ring-2 focus:ring-om-orange-400 focus:border-transparent transition-colors text-om-gray-700 text-sm"
                  />
                  <div class="mt-2">
                    <div class="flex gap-1.5">
                      <div
                        v-for="i in 4"
                        :key="i"
                        class="h-1 flex-1 rounded-full transition-colors"
                        :class="i <= passwordStrength ? strengthColors[passwordStrength] : 'bg-om-gray-200'"
                      ></div>
                    </div>
                    <p v-if="formData.password" class="text-xs mt-1.5" :class="strengthTextColors[passwordStrength]">
                      {{ strengthLabels[passwordStrength] }}
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  class="w-full py-3 bg-om-orange-500 text-white font-medium rounded-xl hover:bg-om-orange-600 transition-colors cursor-pointer text-sm"
                >
                  Get Started
                </button>

                <p class="text-xs text-om-gray-400 text-center">
                  By submitting this form, you agree to the
                  <a href="#" class="text-om-orange-500 hover:underline">Terms of Service</a>
                  and
                  <a href="#" class="text-om-orange-500 hover:underline">Privacy Policy</a>.
                </p>
              </form>
            </template>

            <!-- How did you hear about us? -->
            <template v-else-if="currentStep === 'referral'">
              <div class="[&>div]:pr-0!">
                <StepReferralSource
                  v-model="referralData"
                  @auto-next="handleReferralNext"
                />
              </div>
            </template>

            <!-- Who are you optimizing this website for? -->
            <template v-else-if="currentStep === 'relationship'">
              <div class="[&>div]:pr-0!">
                <StepRelationship
                  v-model="relationshipData"
                  @auto-next="handleRelationshipNext"
                />
              </div>
            </template>

            <!-- Who does this account belong to? -->
            <template v-else-if="currentStep === 'contact-type'">
              <StepContactType
                v-model="contactTypeData"
                :registration-data="formData"
                @auto-next="handleContactTypeNext"
              />
            </template>

            <!-- Agency details -->
            <template v-else-if="currentStep === 'agency-details'">
              <StepAgencyDetails
                v-model="agencyDetailsData"
                @auto-next="handleAgencyDetailsNext"
              />
            </template>

          </div>
          </transition>
        </div>
      </div>

      <!-- Right Side - full height, edge to edge -->
      <div class="hidden md:flex flex-1 bg-om-orange-500 overflow-hidden">
        <div class="w-full flex flex-col justify-center pl-16 lg:pl-24 why-join-content reg-right-pad">
          <h2 class="text-white font-bold text-3xl mb-10">Why join us?</h2>
          <ul class="space-y-4 mb-10">
            <li v-for="item in whyJoinItems" :key="item" class="flex items-center gap-3">
              <span class="shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Check :size="14" class="text-white" stroke-width="3" />
              </span>
              <span class="text-white text-lg font-semibold">{{ item }}</span>
            </li>
          </ul>
          <div class="flex items-center gap-2 mb-10">
            <div class="flex">
              <svg v-for="i in 5" :key="i" width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <span class="text-white/90 text-sm">Trusted by 30,000+ businesses</span>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div v-for="logo in trustedLogos" :key="logo.name" class="bg-white/15 rounded-xl px-5 py-4 flex items-center justify-center h-14">
              <component :is="logo.component" class="max-w-full max-h-full brightness-0 invert opacity-90" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Mail, Check } from 'lucide-vue-next'
import Button from '../components/shared/Button.vue'
import StepReferralSource from '../components/onboarding/StepReferralSource.vue'
import StepRelationship from '../components/onboarding/StepRelationship.vue'
import StepContactType from '../components/onboarding/StepContactType.vue'
import StepAgencyDetails from '../components/onboarding/StepAgencyDetails.vue'
import YamahaLogo from '../components/logos/YamahaLogo.vue'
import AvonLogo from '../components/logos/AvonLogo.vue'
import NikonLogo from '../components/logos/NikonLogo.vue'
import AcerLogo from '../components/logos/AcerLogo.vue'
import VilgainLogo from '../components/logos/VilgainLogo.vue'
import LoccitaneLogo from '../components/logos/LoccitaneLogo.vue'
import AldoLogo from '../components/logos/AldoLogo.vue'
import BenchLogo from '../components/logos/BenchLogo.vue'
import YvesRocherLogo from '../components/logos/YvesRocherLogo.vue'
import HugoLogo from '../components/logos/HugoLogo.vue'

const emit = defineEmits(['complete'])

const currentStep = ref('buttons')
const formData = ref({ firstName: '', lastName: '', email: '', password: '' })
const referralData = ref({})
const relationshipData = ref({})
const contactTypeData = ref({})
const agencyDetailsData = ref({})

const passwordStrength = computed(() => {
  const pw = formData.value.password
  if (!pw) return 0
  let s = 0
  if (pw.length >= 8) s++
  if (pw.length >= 12) s++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^a-zA-Z0-9]/.test(pw)) s++
  return Math.min(4, s)
})

const strengthColors = { 0: 'bg-om-gray-200', 1: 'bg-red-400', 2: 'bg-orange-400', 3: 'bg-yellow-400', 4: 'bg-green-500' }
const strengthTextColors = { 0: 'text-om-gray-400', 1: 'text-red-500', 2: 'text-orange-500', 3: 'text-yellow-600', 4: 'text-green-600' }
const strengthLabels = { 0: '', 1: 'Weak', 2: 'Fair', 3: 'Good', 4: 'Strong' }

const whyJoinItems = [
  'Personalized optimization strategies',
  'AI-powered conversion insights',
  'Real-time performance tracking',
  '100+ optimization solutions',
]

const trustedLogos = [
  { name: 'Yamaha', component: YamahaLogo },
  { name: 'Avon', component: AvonLogo },
  { name: 'Nikon', component: NikonLogo },
  { name: 'Acer', component: AcerLogo },
  { name: 'Vilgain', component: VilgainLogo },
  { name: "L'Occitane", component: LoccitaneLogo },
  { name: 'Aldo', component: AldoLogo },
  { name: 'Bench', component: BenchLogo },
  { name: 'Yves Rocher', component: YvesRocherLogo },
  { name: 'Hugo', component: HugoLogo },
]

const goBack = () => {
  const prevMap = {
    'email-form': 'buttons',
    'referral': 'email-form',
    'relationship': 'referral',
    'contact-type': 'relationship',
    'agency-details': 'contact-type',
  }
  currentStep.value = prevMap[currentStep.value] || 'buttons'
}

const handleEmailSubmit = () => {
  currentStep.value = 'referral'
}

const handleReferralNext = () => {
  currentStep.value = 'relationship'
}

const handleRelationshipNext = () => {
  const rel = relationshipData.value?.relationship
  if (rel === 'client') {
    currentStep.value = 'contact-type'
  } else {
    emit('complete', formData.value)
  }
}

const handleContactTypeNext = () => {
  if (relationshipData.value?.relationship === 'client' && contactTypeData.value?.contactType === 'client-contact') {
    currentStep.value = 'agency-details'
  } else {
    emit('complete', formData.value)
  }
}

const handleAgencyDetailsNext = () => {
  emit('complete', formData.value)
}
</script>

<style scoped>
.step-fade-enter-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.step-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.step-fade-enter-from {
  opacity: 0;
  transform: translateX(12px);
}
.step-fade-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}

/* Scale down right panel content on short viewports */
.why-join-content {
  padding-top: 2.5rem;
  padding-bottom: 2.5rem;
}
@media (max-height: 750px) {
  .why-join-content {
    transform: scale(0.85);
    transform-origin: center center;
  }
}
@media (max-height: 600px) {
  .why-join-content {
    transform: scale(0.7);
    transform-origin: center center;
  }
}

/* Match MainLayout's max-w-7xl mx-auto positioning */
@media (min-width: 1024px) {
  .reg-left-pad {
    padding-left: max(4rem, calc((100vw - 80rem) / 2 + 4rem));
  }
  .reg-right-pad {
    padding-right: max(4rem, calc((100vw - 80rem) / 2 + 4rem));
  }
}
</style>
