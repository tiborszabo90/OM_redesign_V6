<template>
  <div class="h-full bg-white flex flex-col relative overflow-hidden">
    <div class="w-full h-full min-h-0 flex flex-col md:flex-row">
      <!-- Left Side - 50% with centered content container -->
      <div class="w-full h-full md:w-1/2 flex items-center px-8 login-left-pad lg:pr-24 pt-8 pb-8 overflow-hidden relative">
        <img
          src="/OM-Logo-primary-basic.svg"
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
              <h2 class="text-4xl font-bold text-om-gray-700 mb-1 text-center">Welcome back</h2>
              <p class="text-om-gray-500 mb-8 text-center">Sign in to continue optimizing</p>

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

                <Button variant="outline" size="lg" class="w-full" @click="emit('complete', formData)">
                  <template #icon>
                    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 9a9 9 0 1 0-10.406 8.89V11.6H5.316V9h2.278V7.024c0-2.248 1.338-3.49 3.387-3.49.98 0 2.007.175 2.007.175v2.207H11.893c-1.114 0-1.461.691-1.461 1.4V9h2.487l-.397 2.6h-2.09v6.29A9.002 9.002 0 0 0 18 9z" fill="#1877F2"/>
                    </svg>
                  </template>
                  Continue with Facebook
                </Button>
              </div>

              <p class="text-sm text-om-gray-500 text-center mt-6">
                Don't have an account?
                <a href="#" @click.prevent="emit('go-to-register')" class="text-om-orange-500 hover:underline font-medium">Sign up</a>
              </p>
            </template>

            <!-- Email login form view -->
            <template v-else-if="currentStep === 'email-form'">
              <h2 class="text-4xl font-bold text-om-gray-700 mb-1 text-center">Welcome back</h2>
              <p class="text-om-gray-500 mb-6 text-center">Sign in to continue optimizing</p>

              <form @submit.prevent="handleEmailSubmit" class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-om-gray-700 mb-1.5">Business email</label>
                  <input
                    v-model="formData.email"
                    type="email"
                    placeholder="john@company.com"
                    required
                    class="w-full px-3 py-2.5 border border-om-gray-200 rounded-xl focus:ring-2 focus:ring-om-orange-400 focus:border-transparent transition-colors text-om-gray-700 text-sm"
                  />
                </div>

                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <label class="block text-sm font-medium text-om-gray-700">Password</label>
                    <a href="#" @click.prevent="emit('forgot-password')" class="text-xs text-om-orange-500 hover:underline">Forgot password?</a>
                  </div>
                  <input
                    v-model="formData.password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    class="w-full px-3 py-2.5 border border-om-gray-200 rounded-xl focus:ring-2 focus:ring-om-orange-400 focus:border-transparent transition-colors text-om-gray-700 text-sm"
                  />
                </div>

                <label class="flex items-center gap-2 pt-1 cursor-pointer select-none">
                  <Checkbox v-model="formData.rememberMe" />
                  <span class="text-sm text-om-gray-600">Keep me signed in</span>
                </label>

                <button
                  type="submit"
                  class="w-full py-3 bg-om-orange-500 text-white font-medium rounded-xl hover:bg-om-orange-600 transition-colors cursor-pointer text-sm"
                >
                  Sign in
                </button>

                <p class="text-sm text-om-gray-500 text-center pt-1">
                  Don't have an account?
                  <a href="#" @click.prevent="emit('go-to-register')" class="text-om-orange-500 hover:underline font-medium">Sign up</a>
                </p>
              </form>
            </template>

          </div>
          </transition>
        </div>
      </div>

      <!-- Right Side - full height, edge to edge -->
      <div class="hidden md:flex flex-1 bg-om-peach-50 overflow-hidden relative items-center justify-center">
        <!-- Scrolling use case marquee columns -->
        <div class="absolute inset-0 flex gap-4 justify-center pointer-events-none marquee-mask">
          <div
            v-for="(col, ci) in marqueeColumns"
            :key="ci"
            class="flex flex-col w-64 shrink-0"
            :class="[ci % 2 === 0 ? 'marquee-up' : 'marquee-down', columnBreakpointClass[ci]]"
          >
            <img
              v-for="(src, i) in [...col, ...col]"
              :key="ci + '-' + i"
              :src="src"
              alt=""
              class="w-full rounded-xl shadow-lg bg-white mb-5"
            />
          </div>
        </div>

        <!-- Soft opacity layer over marquee -->
        <div class="absolute inset-0 bg-om-peach-50/85 pointer-events-none"></div>

        <img src="/monk-hi-user.svg" alt="" class="absolute top-1/6 -right-12 w-64 -rotate-50 pointer-events-none monk-slide-in z-20" />

        <div class="relative z-10 flex flex-col items-center text-center px-10 py-10 max-w-120 mx-8 bg-white rounded-3xl shadow-2xl">
          <h2 class="text-4xl font-bold text-om-gray-700 leading-tight mb-6">
            50+ curated<br />use cases that<br />
            <span class="text-om-orange-500">boost conversions</span>
          </h2>
          <p class="text-om-gray-600 text-base mb-8 leading-relaxed">
            Start optimizing your website conversions<br />with our tested, step-by-step strategies.
          </p>
          <Button variant="outline" size="lg">
            Browse Use Case Library
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Mail, Check } from 'lucide-vue-next'
import Button from '../components/shared/Button.vue'
import Checkbox from '../components/shared/Checkbox.vue'
import YamahaLogo from '../components/logos/YamahaLogo.vue'
import AvonLogo from '../components/logos/AvonLogo.vue'
import NikonLogo from '../components/logos/NikonLogo.vue'
import AcerLogo from '../components/logos/AcerLogo.vue'
import VilgainLogo from '../components/logos/VilgainLogo.vue'
import LoccitaneLogo from '../components/logos/LoccitaneLogo.vue'
import AldoLogo from '../components/logos/AldoLogo.vue'
import BenchLogo from '../components/logos/BenchLogo.vue'

const emit = defineEmits(['complete', 'go-to-register', 'forgot-password'])

const currentStep = ref('buttons')
const formData = ref({ email: '', password: '', rememberMe: false })

const marqueeColumns = [
  [
    '/usecases/SmartDiscountPopup.png',
    '/usecases/Luckywheel.png',
    '/usecases/CountdownOffer.png',
    '/usecases/NewsletterSignupPopup.png',
    '/usecases/Giveaway.png',
  ],
  [
    '/usecases/FreeShippingBar.png',
    '/usecases/PersonalRecommender.png',
    '/usecases/Scratchcard.png',
    '/usecases/ShoppingQuiz.png',
    '/usecases/UpsellPopup.png',
  ],
  [
    '/usecases/CartAbandonmentStopper.png',
    '/usecases/LeadMagnet.png',
    '/usecases/SMSListBuilder.png',
    '/usecases/SmartRecommender.png',
    '/usecases/ReferralBoosterPopup.png',
  ],
  [
    '/usecases/SeasonalCountdown.png',
    '/usecases/PersonalWelcomeBack.png',
    '/usecases/EmbeddedListBuilder.png',
    '/usecases/BrowsingReminder.png',
    '/usecases/MagicPopupFormula.png',
  ],
  [
    '/usecases/Announcement.png',
    '/usecases/ContactForm.png',
    '/usecases/FeedbackSurvey.png',
    '/usecases/DynamicShippingBar.png',
    '/usecases/PersonalizedCartSaver.png',
  ],
  [
    '/usecases/TrojanHorse.png',
    '/usecases/Conversational.png',
    '/usecases/ConversationalPopupAlt.png',
    '/usecases/EmbeddedProductRecommender.png',
    '/usecases/PurchaseSatisfactionSurvey.png',
  ],
]

// Progressive reveal as the viewport grows. Columns 0-1 always visible; further
// columns unlock at lg / xl / 2xl / custom wide breakpoint.
const columnBreakpointClass = [
  'flex',
  'flex',
  'hidden lg:flex',
  'hidden xl:flex',
  'hidden 2xl:flex',
  'hidden min-[1800px]:flex',
]

const whyJoinItems = [
  'No. 1 rated popup builder according to G2',
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
  { name: 'Yves Rocher', src: '/trusted-logos/Yves_Rocher_logo.svg' },
]

const goBack = () => {
  currentStep.value = 'buttons'
}

const handleEmailSubmit = () => {
  emit('complete', formData.value)
}
</script>

<style scoped>
.marquee-mask {
  mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
}
.marquee-up {
  animation: marquee-up 40s linear infinite;
}
.marquee-down {
  animation: marquee-down 40s linear infinite;
}
@keyframes marquee-up {
  from { transform: translateY(0); }
  to { transform: translateY(-50%); }
}
@keyframes marquee-down {
  from { transform: translateY(-50%); }
  to { transform: translateY(0); }
}

.logo-gray-700 {
  filter: brightness(0) saturate(100%) invert(9%) sepia(5%) saturate(897%) hue-rotate(180deg) brightness(95%) contrast(93%);
}

@keyframes monk-slide-in {
  from { translate: 100% 0; opacity: 0; }
  to { translate: 0 0; opacity: 1; }
}
.monk-slide-in {
  animation: monk-slide-in 0.4s ease-out 0.3s both;
}

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

@media (min-width: 1024px) {
  .login-left-pad {
    padding-left: max(4rem, calc((100vw - 80rem) / 2 + 4rem));
  }
  .login-right-pad {
    padding-right: max(4rem, calc((100vw - 80rem) / 2 + 4rem));
  }
}
</style>
