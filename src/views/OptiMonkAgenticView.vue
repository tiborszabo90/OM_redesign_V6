<template>
  <!-- Step 1: URL input -->
  <div v-if="step === 'url'" class="h-screen-safe bg-white flex flex-col items-center justify-center px-4">
    <div class="w-full max-w-2xl">
      <div class="flex justify-center mb-10">
        <img src="/OM-Logo-primary-basic.svg" alt="OptiMonk" class="h-8" />
      </div>

      <h1 class="text-4xl font-semibold text-om-gray-700 text-center mb-2">Website optimization magic.</h1>
      <p class="text-om-gray-500 text-center mb-8">Add your website URL and get your tailored optimization ideas in 2 minutes.</p>

      <form @submit.prevent="handleUrlSubmit" class="flex flex-col gap-3">
        <div class="flex gap-2">
          <input
            v-model="url"
            type="text"
            placeholder="enter website URL"
            class="flex-1 h-12 px-4 rounded-xl border border-om-gray-200 text-om-gray-700 placeholder-om-gray-400 focus:outline-none focus:ring-2 focus:ring-om-orange-400 focus:border-transparent text-sm"
            autofocus
          />
          <button
            type="submit"
            :disabled="!url.trim()"
            class="h-12 px-6 rounded-xl bg-om-orange-500 text-white font-medium text-sm whitespace-nowrap transition-opacity disabled:opacity-40 hover:bg-om-orange-600 cursor-pointer disabled:cursor-not-allowed"
          >
            Get started
          </button>
        </div>
        <p class="text-center text-xs text-om-gray-400">No email address needed.</p>
      </form>
    </div>
  </div>

  <!-- Step 2: Loading / analysis -->
  <div v-else-if="step === 'loading'" class="h-screen-safe bg-white flex flex-col items-center justify-center px-4">
    <div class="w-full max-w-md flex flex-col items-center">
      <div class="mb-8">
        <img src="/OM-Logo-primary-basic.svg" alt="OptiMonk" class="h-8" />
      </div>
      <div class="w-12 h-12 border-3 border-om-orange-500 border-t-transparent rounded-full animate-spin mb-6"></div>
      <h2 class="text-xl font-semibold text-om-gray-700 mb-2">Analyzing your website</h2>
      <transition name="fade-msg" mode="out-in">
        <p :key="loadingMessage" class="text-sm text-om-gray-500 text-center">{{ loadingMessage }}</p>
      </transition>
    </div>
  </div>

  <!-- Step 4: Generating popup -->
  <div v-else-if="step === 'generating'" class="h-screen-safe bg-white flex flex-col items-center justify-center px-4">
    <div class="w-full max-w-md flex flex-col items-center">
      <div class="mb-8">
        <img src="/OM-Logo-primary-basic.svg" alt="OptiMonk" class="h-8" />
      </div>
      <div class="w-12 h-12 border-3 border-om-orange-500 border-t-transparent rounded-full animate-spin mb-6"></div>
      <h2 class="text-xl font-semibold text-om-gray-700 mb-2">Building your popup</h2>
      <transition name="fade-msg" mode="out-in">
        <p :key="generatingMessage" class="text-sm text-om-gray-500 text-center">{{ generatingMessage }}</p>
      </transition>
      <p v-if="selectedOpportunityTitle" class="mt-6 text-xs text-om-gray-400 text-center max-w-xs">
        For: {{ selectedOpportunityTitle }}
      </p>
    </div>
  </div>

  <!-- Step 3: Opportunities -->
  <div v-else class="min-h-screen-safe bg-white">
    <div class="max-w-5xl mx-auto px-6 pt-16 pb-32">
      <div class="flex items-center gap-2 mb-10">
        <img src="/OM-Logo-primary-basic.svg" alt="OptiMonk" class="h-7" />
      </div>

      <h1 class="text-3xl font-semibold text-om-gray-700 mb-2">
        I found {{ opportunities.length }} conversion opportunities on your site.
      </h1>
      <p class="text-om-gray-500 mb-10">Ranked by estimated revenue impact.</p>

      <div class="flex flex-col gap-4">
        <div
          v-for="(opp, idx) in opportunities"
          :key="opp.id"
          class="relative bg-white border border-om-gray-200 rounded-2xl p-6 transition-all"
          :class="{ 'overflow-hidden': isLocked(opp) }"
        >
          <div class="flex gap-5">
            <div class="w-7 h-7 rounded-full bg-om-orange-100 text-om-orange-600 text-sm font-semibold flex items-center justify-center shrink-0 mt-0.5">
              {{ idx + 1 }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-base font-semibold text-om-gray-700 mb-2">{{ opp.title }}</h3>
              <p
                class="text-sm text-om-gray-500 leading-relaxed mb-5"
                :class="{ 'blur-sm select-none pointer-events-none': isLocked(opp) }"
              >
                {{ opp.description }}
              </p>
              <div class="flex items-end justify-between gap-4 flex-wrap">
                <div class="flex gap-8">
                  <div>
                    <div class="text-xs text-om-gray-400 mb-1">Est. revenue</div>
                    <div class="text-base font-semibold text-om-gray-700">{{ opp.revenue }}</div>
                  </div>
                  <div v-if="!isLocked(opp)">
                    <div class="text-xs text-om-gray-400 mb-1">Expected lift</div>
                    <div class="text-base font-semibold text-om-gray-700">{{ opp.lift }}</div>
                  </div>
                </div>
                <Button
                  v-if="!isLocked(opp)"
                  :variant="idx === 0 ? 'primary' : 'secondary'"
                  size="sm"
                  @click="handleRunForMe(opp)"
                >
                  Run this for me
                </Button>
              </div>
            </div>
            <div
              class="shrink-0 w-96 aspect-video rounded-xl overflow-hidden"
              :class="{ 'blur-xs': isLocked(opp) }"
            >
              <OpportunityPopupThumb :variant="opp.variant" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky CTA bar -->
    <div v-if="!registered" class="fixed bottom-0 left-0 right-0 bg-om-orange-500 text-white shadow-lg">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <p class="text-sm">
          Unlock the other {{ lockedCount }} opportunities and run them with one click, sign up free.
        </p>
        <button
          @click="handleGetReport"
          class="h-10 px-5 rounded-lg bg-white text-om-orange-600 text-sm font-semibold whitespace-nowrap hover:bg-om-gray-100 transition-colors cursor-pointer"
        >
          Get my full report
        </button>
      </div>
    </div>
  </div>

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
                    <Button variant="secondary" size="lg" class="w-full" @click="modalStep = 'email-form'">
                      <template #icon><Mail :size="18" /></template>
                      Continue with Email
                    </Button>
                    <Button variant="secondary" size="lg" class="w-full" @click="handleSocialRegister">
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
                    <Button variant="secondary" size="lg" class="w-full" @click="handleSocialRegister">
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

                  <form @submit.prevent="handleEmailRegSubmit" class="space-y-3">
                    <div class="flex gap-3">
                      <div class="flex-1">
                        <label class="block text-sm font-medium text-om-gray-700 mb-1.5">First name</label>
                        <input
                          v-model="emailFormData.firstName"
                          type="text"
                          placeholder="John"
                          required
                          class="w-full px-3 py-2.5 border border-om-gray-200 rounded-xl focus:ring-2 focus:ring-om-orange-400 focus:border-transparent transition-colors text-om-gray-700 text-sm"
                        />
                      </div>
                      <div class="flex-1">
                        <label class="block text-sm font-medium text-om-gray-700 mb-1.5">Last name</label>
                        <input
                          v-model="emailFormData.lastName"
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
                        v-model="emailFormData.email"
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
                        v-model="emailFormData.password"
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
                            :class="i <= emailPasswordStrength ? strengthColors[emailPasswordStrength] : 'bg-om-gray-200'"
                          ></div>
                        </div>
                        <p v-if="emailFormData.password" class="text-xs mt-1.5" :class="strengthTextColors[emailPasswordStrength]">
                          {{ strengthLabels[emailPasswordStrength] }}
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
              </div>
            </transition>

            <button
              v-if="modalStep !== 'buttons'"
              @click="modalStep = 'buttons'"
              class="flex items-center gap-1.5 text-sm text-om-gray-500 hover:text-om-gray-700 cursor-pointer mt-4"
            >
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
            <div class="flex items-center gap-2 mb-8">
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
import { ref, computed, onUnmounted } from 'vue'
import { Mail, Check } from 'lucide-vue-next'
import Button from '../components/shared/Button.vue'
import OpportunityPopupThumb from '../components/shared/OpportunityPopupThumb.vue'

defineProps({
  registrationData: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['navigate-to', 'phase-changed', 'registration-completed'])

const step = ref('url')
const url = ref('')

const loadingMessages = [
  'Looking for logo...',
  'Analyzing brand colors...',
  'Identifying fonts...',
  'Detecting language...',
  'Scanning your traffic patterns...',
  'Ranking conversion opportunities...',
]
const loadingMessage = ref(loadingMessages[0])
let loadingTimeouts = []

const generatingMessages = [
  'Picking the best popup type...',
  'Designing the layout...',
  'Applying your brand colors...',
  'Writing copy that converts...',
  'Wiring up triggers and conditions...',
  'Polishing the final design...',
]
const generatingMessage = ref(generatingMessages[0])
const selectedOpportunityTitle = ref('')
let generatingTimeouts = []

const opportunities = [
  {
    id: 1,
    title: 'Exit-intent capture on category pages',
    description: '73% of your category-page visitors leave without reaching a product page. An exit-intent offer here recovers high-intent shoppers before they bounce.',
    revenue: '$2,800/mo',
    lift: '+15%',
    variant: 'discount',
    locked: false,
  },
  {
    id: 2,
    title: 'Cart-abandonment recovery offer',
    description: 'Roughly 1 in 5 carts is abandoned at the shipping step. A timed reminder with a small incentive nudges those shoppers back to checkout.',
    revenue: '$2,100/mo',
    lift: '+12%',
    variant: 'email-capture',
    locked: false,
  },
  {
    id: 3,
    title: 'First-time visitor welcome discount',
    description: 'New visitors convert 40% below returning ones. A first-order welcome offer lifts that first purchase and grows your email list at the same time.',
    revenue: '$1,650/mo',
    lift: '+9%',
    variant: 'discount',
    locked: false,
  },
  {
    id: 4,
    title: 'Free-shipping threshold nudge',
    description: 'Traffic that arrives here behaves differently than the rest of your visitors, and the agent has a specific pattern in mind based on the on-page behavior it observed.',
    revenue: '$1,400/mo',
    lift: '+8%',
    variant: 'sticky-bar',
    locked: true,
  },
  {
    id: 5,
    title: 'Back-in-stock email capture',
    description: 'Traffic that arrives here behaves differently than the rest of your visitors, and the agent has a specific pattern in mind based on the on-page behavior it observed.',
    revenue: '$1,180/mo',
    lift: '+7%',
    variant: 'email-capture',
    locked: true,
  },
  {
    id: 6,
    title: 'Post-purchase upsell',
    description: 'Traffic that arrives here behaves differently than the rest of your visitors, and the agent has a specific pattern in mind based on the on-page behavior it observed.',
    revenue: '$940/mo',
    lift: '+6%',
    variant: 'upsell',
    locked: true,
  },
  {
    id: 7,
    title: 'Mobile sticky add-to-cart',
    description: 'Traffic that arrives here behaves differently than the rest of your visitors, and the agent has a specific pattern in mind based on the on-page behavior it observed.',
    revenue: '$820/mo',
    lift: '+5%',
    variant: 'sticky-bar',
    locked: true,
  },
  {
    id: 8,
    title: 'Newsletter signup gamification',
    description: 'Traffic that arrives here behaves differently than the rest of your visitors, and the agent has a specific pattern in mind based on the on-page behavior it observed.',
    revenue: '$650/mo',
    lift: '+4%',
    variant: 'wheel',
    locked: true,
  },
  {
    id: 9,
    title: 'Product page social proof',
    description: 'Traffic that arrives here behaves differently than the rest of your visitors, and the agent has a specific pattern in mind based on the on-page behavior it observed.',
    revenue: '$540/mo',
    lift: '+4%',
    variant: 'social-proof',
    locked: true,
  },
  {
    id: 10,
    title: 'Returning visitor personalization',
    description: 'Traffic that arrives here behaves differently than the rest of your visitors, and the agent has a specific pattern in mind based on the on-page behavior it observed.',
    revenue: '$420/mo',
    lift: '+3%',
    variant: 'welcome-back',
    locked: true,
  },
  {
    id: 11,
    title: 'Time-on-site re-engagement',
    description: 'Traffic that arrives here behaves differently than the rest of your visitors, and the agent has a specific pattern in mind based on the on-page behavior it observed.',
    revenue: '$310/mo',
    lift: '+2%',
    variant: 'countdown',
    locked: true,
  },
  {
    id: 12,
    title: 'Checkout-step shipping reassurance',
    description: 'Traffic that arrives here behaves differently than the rest of your visitors, and the agent has a specific pattern in mind based on the on-page behavior it observed.',
    revenue: '$240/mo',
    lift: '+2%',
    variant: 'shipping',
    locked: true,
  },
]

const lockedCount = computed(() => opportunities.filter(o => o.locked).length)

const handleUrlSubmit = () => {
  if (!url.value.trim()) return
  step.value = 'loading'
  loadingMessages.forEach((msg, i) => {
    const t = setTimeout(() => {
      loadingMessage.value = msg
    }, i * 1000)
    loadingTimeouts.push(t)
  })
  const final = setTimeout(() => {
    step.value = 'opportunities'
  }, loadingMessages.length * 1000)
  loadingTimeouts.push(final)
}

// Registration modal state
const showRegistrationModal = ref(false)
const modalStep = ref('buttons')
const emailFormData = ref({ firstName: '', lastName: '', email: '', password: '' })
const registered = ref(false)

const isLocked = (opp) => opp.locked && !registered.value

const whyJoinItems = [
  'Personalized optimization strategies',
  'AI-powered conversion insights',
  'Real-time performance tracking',
  '100+ optimization solutions',
]

const emailPasswordStrength = computed(() => {
  const pw = emailFormData.value.password
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

const handleGetReport = () => {
  modalStep.value = 'buttons'
  showRegistrationModal.value = true
}

const completeRegistration = () => {
  showRegistrationModal.value = false
  registered.value = true
}

const handleEmailRegSubmit = () => {
  completeRegistration()
}

const handleSocialRegister = () => {
  completeRegistration()
}

const handleRunForMe = (opp) => {
  selectedOpportunityTitle.value = opp.title
  step.value = 'generating'
  generatingMessage.value = generatingMessages[0]
  generatingMessages.forEach((msg, i) => {
    const t = setTimeout(() => {
      generatingMessage.value = msg
    }, i * 900)
    generatingTimeouts.push(t)
  })
  const final = setTimeout(() => {
    emit('navigate-to', 'editor')
  }, generatingMessages.length * 900 + 400)
  generatingTimeouts.push(final)
}

onUnmounted(() => {
  loadingTimeouts.forEach(t => clearTimeout(t))
  generatingTimeouts.forEach(t => clearTimeout(t))
})
</script>

<style scoped>
.fade-msg-enter-active,
.fade-msg-leave-active {
  transition: opacity 0.3s ease;
}
.fade-msg-enter-from,
.fade-msg-leave-to {
  opacity: 0;
}

.border-3 {
  border-width: 3px;
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
