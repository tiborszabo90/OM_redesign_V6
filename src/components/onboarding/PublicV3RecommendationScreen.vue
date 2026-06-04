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
                  @click="openRegistration(useCase)"
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
  <RegistrationModal
    v-model="showRegistrationModal"
    subtitle="and unlock your full optimization plan"
    @register="completeRegistration"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {
  Target, Lightbulb, Mouse,
  Mail, ShoppingCart, Gift, Star, Truck, CircleDot, Compass,
} from 'lucide-vue-next'
import OptimizationPlanCard from './OptimizationPlanCard.vue'
import RegistrationModal from './RegistrationModal.vue'

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
const pendingUseCase = ref(null)

const openRegistration = (useCase = null) => {
  pendingUseCase.value = useCase && useCase.id ? useCase : null
  showRegistrationModal.value = true
}

const completeRegistration = () => {
  showRegistrationModal.value = false
  registered.value = true
  if (pendingUseCase.value) {
    emit('select', pendingUseCase.value)
    pendingUseCase.value = null
  }
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
