<template>
  <transition name="fade" appear>
    <div class="min-h-screen-safe bg-white">
      <!-- Two-column intro section -->
      <div class="w-full flex gap-6 items-stretch p-6 h-screen-safe">
        <!-- Left column (60%) -->
        <div class="w-[60%] flex items-center">
          <div class="bg-[#F9FAFB] rounded-2xl px-15 py-12 w-full h-full relative flex items-center">
            <div class="w-full">
              <!-- URL Chip -->
              <div class="mb-5">
                <span class="inline-block px-6 py-2 bg-[#FEF3EF] text-[#ED5A29] text-base rounded-full border border-[#FECAB5]">
                  {{ url || 'telekom.hu' }}
                </span>
              </div>

              <!-- Main Heading -->
              <h1 class="text-6xl font-bold mb-8 leading-none text-[#23262A]">
                Optimization Plan<br>
                for {{ brandName }}
              </h1>

              <!-- Cards Container -->
              <div class="flex gap-6">
                <!-- Objective Card -->
                <div class="flex-1 bg-white rounded-2xl p-5">
                  <div class="flex items-center gap-3 mb-5">
                    <div class="w-10 h-10 bg-[#FEF3EF] rounded-lg flex items-center justify-center">
                      <Target :size="20" class="text-[#ED5A29]" />
                    </div>
                    <h2 class="text-xl font-bold text-[#23262A]">Objective</h2>
                  </div>
                  <p class="text-sm text-[#505763] leading-relaxed">
                    The primary goal is to identify effective conversion optimization strategies to boost revenue for {{ brandName }}.
                  </p>
                </div>

                <!-- Solutions Card -->
                <div class="flex-1 bg-white rounded-2xl p-5">
                  <div class="flex items-center gap-3 mb-5">
                    <div class="w-10 h-10 bg-[#FEF3EF] rounded-lg flex items-center justify-center">
                      <Lightbulb :size="20" class="text-[#ED5A29]" />
                    </div>
                    <h2 class="text-xl font-bold text-[#23262A]">Solutions</h2>
                  </div>
                  <p class="text-sm text-[#505763] leading-relaxed">
                    Following a thorough website analysis, we've developed <span class="font-semibold text-[#ED5A29]">6 tailored popup strategies</span> and <span class="font-semibold text-[#ED5A29]">2 site optimization recommendations</span> aimed at enhancing user engagement and increasing conversions.
                  </p>
                </div>
              </div>
            </div>

            <!-- Floating Mouse Icon -->
            <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
              <Mouse :size="36" class="text-[#8F97A4]" />
            </div>
          </div>
        </div>

        <!-- Right column (40%) -->
        <div class="w-[40%] flex items-center">
          <div class="w-full h-full bg-[#F9FAFB] rounded-2xl overflow-hidden flex items-center justify-center">
            <img
              src="/demos/telekom/img1.png"
              alt=""
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <!-- Use cases section -->
      <div class="max-w-[1520px] mx-auto px-6 mt-6 pb-[100px]">
        <!-- Heading with divider -->
        <div class="flex items-center gap-6 mb-12">
          <h2 class="text-3xl font-semibold text-om-gray-700 whitespace-nowrap pl-15">
            Recommended Popup Campaigns
          </h2>
          <div class="flex-1 h-px bg-om-gray-300"></div>
          <div class="w-15"></div>
        </div>

        <!-- Use cases list - single column -->
        <div class="flex flex-col gap-12">
          <div
            v-for="(useCase, index) in useCases"
            :key="useCase.id"
            :ref="el => { if (el) useCaseRefs[index] = el }"
            class="bg-om-gray-50 rounded-2xl p-5 lg:p-6 use-case-item"
            :class="[
              { 'animate-fade-in-up-visible': visibleUseCases[index] },
              isLocked(index) ? 'blur-md select-none pointer-events-none' : ''
            ]"
          >
            <div class="flex flex-col gap-6 px-6 lg:px-9 py-3">
              <!-- Top: text + CTA -->
              <div class="flex flex-col">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-6 h-6 bg-om-gray-200 rounded-md flex items-center justify-center">
                    <component :is="iconMap[useCase.icon]" :size="14" class="text-om-gray-500" />
                  </div>
                  <span class="text-xs font-medium text-om-gray-500 uppercase">{{ useCase.title }}</span>
                </div>
                <h3 class="text-xl lg:text-2xl font-semibold text-om-gray-700 mb-3">{{ useCase.description }}</h3>
                <p class="text-sm lg:text-base text-om-gray-500">{{ useCase.subheadline }}</p>
              </div>

              <!-- Bottom: 3 desktop thumbnails -->
              <div class="grid grid-cols-3 gap-4">
                <div
                  v-for="n in 3"
                  :key="n"
                  class="aspect-video bg-om-gray-200 rounded-lg border border-om-gray-300 w-full transition-all cursor-pointer hover:shadow-lg hover:border-om-gray-400 hover:-translate-y-0.5"
                  @click="emit('select', useCase)"
                ></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Sticky CTA bar (slides up when reaching the locked section) -->
      <transition name="slide-up">
        <div v-if="!registered && showStickyBar" class="fixed bottom-0 left-0 right-0 bg-om-orange-500 text-white shadow-lg z-40">
          <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <p class="text-sm">
              Unlock the rest of your optimization plan and get all recommendations, sign up free.
            </p>
            <button
              @click="openRegistration"
              class="h-10 px-5 rounded-lg bg-white text-om-orange-600 text-sm font-semibold whitespace-nowrap hover:bg-om-gray-100 transition-colors cursor-pointer"
            >
              Get my full report
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>

  <!-- Registration Modal -->
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="showRegistrationModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white rounded-2xl overflow-hidden max-w-4xl w-full flex shadow-2xl h-155">
          <!-- Left: Form -->
          <div class="w-1/2 py-10 px-10 flex flex-col relative">
            <img src="/OM-Logo-primary-basic.svg" alt="OptiMonk" class="h-7 shrink-0 self-start mb-6" />

            <transition name="modal-step-fade" mode="out-in">
              <div :key="modalStep" class="flex-1 flex flex-col justify-center">
                <!-- Social login buttons -->
                <template v-if="modalStep === 'buttons'">
                  <h2 class="text-2xl font-bold text-om-gray-700 mb-1">Create your free account</h2>
                  <p class="text-om-gray-500 mb-8">and unlock your full optimization plan</p>

                  <div class="flex flex-col gap-3">
                    <button class="w-full h-12 px-4 rounded-xl border border-om-gray-200 bg-white text-om-gray-700 text-sm font-medium flex items-center justify-center gap-2 hover:bg-om-gray-50 transition-colors cursor-pointer" @click="modalStep = 'email-form'">
                      <Mail :size="18" /> Continue with Email
                    </button>
                    <button class="w-full h-12 px-4 rounded-xl border border-om-gray-200 bg-white text-om-gray-700 text-sm font-medium flex items-center justify-center gap-2 hover:bg-om-gray-50 transition-colors cursor-pointer" @click="completeRegistration">
                      <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                      </svg>
                      Continue with Google
                    </button>
                    <button class="w-full h-12 px-4 rounded-xl border border-om-gray-200 bg-white text-om-gray-700 text-sm font-medium flex items-center justify-center gap-2 hover:bg-om-gray-50 transition-colors cursor-pointer" @click="completeRegistration">
                      <img src="/icons/shopify-logo.svg" alt="Shopify" class="w-4.5 h-4.5 object-contain" />
                      Continue with Shopify
                    </button>
                  </div>

                  <p class="text-xs text-om-gray-400 text-center mt-6">
                    By submitting this form, you agree to the
                    <a href="#" class="text-om-orange-500 hover:underline">Terms of Service</a>
                    and
                    <a href="#" class="text-om-orange-500 hover:underline">Privacy Policy</a>.
                  </p>

                  <button
                    @click="showRegistrationModal = false"
                    class="mt-4 text-xs text-om-gray-400 hover:text-om-gray-600 underline cursor-pointer text-center w-full transition-colors"
                  >
                    I don't want to register
                  </button>
                </template>

                <!-- Email registration form -->
                <template v-else-if="modalStep === 'email-form'">
                  <h2 class="text-2xl font-bold text-om-gray-700 mb-1">Create your free account</h2>
                  <p class="text-om-gray-500 mb-6">and unlock your full optimization plan</p>

                  <form @submit.prevent="completeRegistration" class="space-y-3">
                    <div class="flex gap-3">
                      <div class="flex-1">
                        <label class="block text-sm font-medium text-om-gray-700 mb-1.5">First name</label>
                        <input v-model="emailFormData.firstName" type="text" placeholder="John" required
                          class="w-full px-3 py-2.5 border border-om-gray-200 rounded-xl focus:ring-2 focus:ring-om-orange-400 focus:border-transparent transition-colors text-om-gray-700 text-sm" />
                      </div>
                      <div class="flex-1">
                        <label class="block text-sm font-medium text-om-gray-700 mb-1.5">Last name</label>
                        <input v-model="emailFormData.lastName" type="text" placeholder="Doe" required
                          class="w-full px-3 py-2.5 border border-om-gray-200 rounded-xl focus:ring-2 focus:ring-om-orange-400 focus:border-transparent transition-colors text-om-gray-700 text-sm" />
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-om-gray-700 mb-1.5">Business email</label>
                      <input v-model="emailFormData.email" type="email" placeholder="john@company.com" required
                        class="w-full px-3 py-2.5 border border-om-gray-200 rounded-xl focus:ring-2 focus:ring-om-orange-400 focus:border-transparent transition-colors text-om-gray-700 text-sm" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-om-gray-700 mb-1.5">Password (8+ characters)</label>
                      <input v-model="emailFormData.password" type="password" placeholder="Enter your password" minlength="8" required
                        class="w-full px-3 py-2.5 border border-om-gray-200 rounded-xl focus:ring-2 focus:ring-om-orange-400 focus:border-transparent transition-colors text-om-gray-700 text-sm" />
                    </div>
                    <button type="submit"
                      class="w-full py-3 bg-om-orange-500 text-white font-medium rounded-xl hover:bg-om-orange-600 transition-colors cursor-pointer text-sm">
                      Get Started
                    </button>
                  </form>
                </template>
              </div>
            </transition>

            <button v-if="modalStep !== 'buttons'" @click="modalStep = 'buttons'"
              class="flex items-center gap-1.5 text-sm text-om-gray-500 hover:text-om-gray-700 cursor-pointer mt-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>
          </div>

          <!-- Right: Why join us -->
          <div class="w-1/2 bg-om-peach-50 flex flex-col px-8 py-10 overflow-y-auto">
            <h2 class="text-om-gray-700 font-bold text-2xl mb-8">Why join us?</h2>
            <ul class="space-y-3 mb-8">
              <li v-for="item in whyJoinItems" :key="item" class="flex items-center gap-3">
                <span class="shrink-0 w-6 h-6 rounded-full bg-om-orange-500 flex items-center justify-center">
                  <Check :size="14" class="text-white" stroke-width="3" />
                </span>
                <span class="text-om-gray-600 text-base">{{ item }}</span>
              </li>
            </ul>
            <div class="flex items-center gap-2">
              <div class="flex">
                <svg v-for="i in 5" :key="i" width="22" height="22" viewBox="0 0 24 24" fill="#ED5A29" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <span class="text-om-gray-600 text-base">Trusted by 30,000+ businesses</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {
  Target, Lightbulb, Mouse, Check,
  Mail, ShoppingCart, Gift, Star, Truck, CircleDot, Compass,
} from 'lucide-vue-next'
import OptimizationPlanCard from './OptimizationPlanCard.vue'

defineProps({
  url: { type: String, default: '' },
  brandName: { type: String, default: 'Telekom' },
})

const emit = defineEmits(['registration-completed', 'select'])

// ── Paywall / registration ──
const VISIBLE_COUNT = 2
const registered = ref(false)
const isLocked = (index) => !registered.value && index >= VISIBLE_COUNT

const showRegistrationModal = ref(false)
const modalStep = ref('buttons')
const emailFormData = ref({ firstName: '', lastName: '', email: '', password: '' })

const whyJoinItems = [
  'Personalized optimization strategies',
  'AI-powered conversion insights',
  'Real-time performance tracking',
  '100+ optimization solutions',
]

const openRegistration = () => {
  modalStep.value = 'buttons'
  showRegistrationModal.value = true
}

const completeRegistration = () => {
  showRegistrationModal.value = false
  registered.value = true
}

const brandColor = '#E20074'
const cornerClass = 'rounded-none'

const useCases = [
  {
    id: 'newsletter',
    title: 'Smart Discount Popup',
    description: 'The most effective list-building popup formula',
    subheadline: 'Grow your list with a two-step popup formula with every tweak for max conversions',
    icon: 'mail',
    image: '/campaigns/smart-discount-popup.png',
    mobileImage: '/SmartDiscountPopup_mobile.png',
  },
  {
    id: 'cart-abandonment',
    title: 'Cart Abandonment Stopper',
    description: 'Offer a discount for cart abandoners',
    subheadline: 'Decrease cart abandonment rate with a strong discount offer',
    icon: 'cart',
    image: '/campaigns/cart-abandonment-stopper.png',
    mobileImage: '/CartAbandonmentStopper_mobile.png',
  },
  {
    id: 'spin-wheel',
    title: 'Lucky Wheel',
    description: 'Gamify popups to increase visitor engagement',
    subheadline: 'Capture new visitor attention and increase conversions with spin-to-win lucky wheels',
    icon: 'wheel',
    image: '/campaigns/lucky-wheel.png',
    mobileImage: '/LuckyWheel_mobile.png',
  },
  {
    id: 'feedback',
    title: 'Feedback Survey',
    description: 'Get real, measurable feedback on anything you want',
    subheadline: 'Find out how much your customers love you easily with a feedback survey',
    icon: 'star',
    image: '/campaigns/feedback-survey.png',
    mobileImage: '/FeedbackSurvey_mobile.png',
  },
]

const iconMap = {
  mail: Mail,
  cart: ShoppingCart,
  gift: Gift,
  star: Star,
  truck: Truck,
  wheel: CircleDot,
  compass: Compass,
}

// IntersectionObserver for use-case fade-in
const useCaseRefs = ref([])
const visibleUseCases = ref({})
const showStickyBar = ref(false)
let observer = null
let stickyObserver = null

onMounted(() => {
  setTimeout(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = useCaseRefs.value.indexOf(entry.target)
            if (index !== -1) {
              visibleUseCases.value[index] = true
            }
          }
        })
      },
      { threshold: 0.2 },
    )
    useCaseRefs.value.forEach((el, idx) => {
      if (!el) return
      observer.observe(el)
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        visibleUseCases.value[idx] = true
      }
    })

    // Sticky bar: appear when the first locked card scrolls into view
    const firstLocked = useCaseRefs.value[VISIBLE_COUNT]
    if (firstLocked) {
      stickyObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) showStickyBar.value = true
            else if (entry.boundingClientRect.top > window.innerHeight) showStickyBar.value = false
          })
        },
        { threshold: 0.05 },
      )
      stickyObserver.observe(firstLocked)
      const rect = firstLocked.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) showStickyBar.value = true
    }
  }, 100)
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
  if (stickyObserver) stickyObserver.disconnect()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.use-case-item {
  opacity: 0;
  transform: translateY(30px);
}

.animate-fade-in-up-visible {
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  50% {
    transform: translateY(-10px) translateX(-50%);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-step-fade-enter-active,
.modal-step-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-step-fade-enter-from,
.modal-step-fade-leave-to {
  opacity: 0;
}
</style>
