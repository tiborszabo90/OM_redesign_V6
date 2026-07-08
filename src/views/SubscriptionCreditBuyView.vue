<template>
  <DashboardLayout active-menu-item="" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="w-full max-w-[1500px] mx-auto pb-10 -mt-[10px]">
        <h1 class="text-2xl font-semibold text-om-gray-700 mb-[22px]">Subscription</h1>

        <!-- Summary + Payment -->
        <div :class="['grid grid-cols-1 gap-6 mb-7', variant === 'D' ? 'lg:grid-cols-2 xl:grid-cols-3' : 'lg:grid-cols-2']">
          <!-- Current plan summary -->
          <div class="bg-white rounded-2xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-6">
            <h2 class="text-base font-semibold text-om-gray-700 mb-6">{{ variant === 'D' ? 'OptiMonk · ' : '' }}Essential 20 plan (annual)</h2>

            <div class="flex items-center justify-between text-sm mb-6">
              <span class="text-om-gray-600">Basic pageview (20,000 / month)</span>
              <span class="font-semibold text-om-gray-700">$228</span>
            </div>

            <div class="mb-5">
              <div class="flex items-center justify-between text-sm mb-2">
                <span class="text-om-gray-600">Total pageviews (reset on 2026-07-11)</span>
                <span class="text-om-gray-500">0 / 20,000</span>
              </div>
              <div class="h-1.5 bg-om-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-[#7C93E8] rounded-full" style="width: 0%"></div>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between text-sm mb-2">
                <span class="text-om-gray-600">Active sites</span>
                <span class="text-om-gray-500">1 / 2</span>
              </div>
              <div class="h-1.5 bg-om-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-[#7C93E8] rounded-full" style="width: 50%"></div>
              </div>
            </div>
          </div>

          <!-- Payment details -->
          <div class="bg-white rounded-2xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-6">
            <h2 class="text-base font-semibold text-om-gray-700 mb-6">Payment details</h2>

            <div class="flex items-start justify-between mb-5">
              <div>
                <p class="text-sm text-om-gray-600 mb-1.5">Payment method</p>
                <p class="text-sm text-om-gray-700 flex items-center gap-2">
                  <span class="inline-flex items-center justify-center h-5 px-1.5 rounded bg-[#1A1F71] text-white text-[10px] font-bold tracking-wide">VISA</span>
                  <span class="font-semibold">471527******0932. Expiry date: 03/2029</span>
                </p>
              </div>
              <button class="text-sm font-medium text-om-orange-500 hover:text-om-orange-600 cursor-pointer shrink-0">Edit</button>
            </div>

            <div class="flex items-start justify-between mb-5">
              <div>
                <p class="text-sm text-om-gray-600 mb-1.5">Billing address</p>
                <p class="text-sm font-semibold text-om-gray-700">University of New England, Armidale, Australia</p>
              </div>
              <button class="text-sm font-medium text-om-orange-500 hover:text-om-orange-600 cursor-pointer shrink-0">Edit</button>
            </div>

            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm text-om-gray-600 mb-1.5">Next payment</p>
                <p class="text-sm font-semibold text-om-gray-700">Jun 11, 2027</p>
              </div>
              <button class="text-sm font-medium text-om-orange-500 hover:text-om-orange-600 cursor-pointer shrink-0">Cancel subscription</button>
            </div>
          </div>
        </div>

        <!-- AI credits card -->
        <div class="bg-white rounded-2xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-6 mb-7">
          <!-- Header + total balance -->
          <div class="flex items-center justify-between gap-4 mb-6">
            <div class="flex items-center gap-4 min-w-0">
              <div class="w-11 h-11 rounded-xl bg-om-orange-100 flex items-center justify-center shrink-0">
                <Coins :size="22" class="text-om-orange-500" />
              </div>
              <div class="min-w-0">
                <h2 class="text-base font-semibold text-om-gray-700 mb-0.5">AI credits</h2>
                <p class="text-sm text-om-gray-500 leading-relaxed">Used across AI text &amp; image generation.</p>
              </div>
            </div>
            <div class="text-right shrink-0">
              <div class="flex items-baseline gap-1.5 justify-end">
                <span class="text-2xl font-semibold text-om-gray-700">{{ totalAvailable.toLocaleString() }}</span>
                <span class="text-sm text-om-gray-500">credits available</span>
              </div>
              <p class="text-xs text-om-gray-400">Monthly + additional</p>
            </div>
          </div>

          <!-- Monthly (left) + Additional & actions (right) -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <div class="flex flex-col justify-center">
              <div class="flex items-center justify-between text-sm mb-2">
                <span class="text-om-gray-600">Monthly credits (reset {{ creditsResetDate }})</span>
                <span class="text-om-gray-500">{{ credits.available.toLocaleString() }} / {{ credits.total.toLocaleString() }} left</span>
              </div>
              <div class="h-1.5 bg-om-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-om-orange-400 rounded-full" :style="{ width: (credits.available / credits.total * 100) + '%' }"></div>
              </div>
            </div>
            <div class="bg-om-gray-50 rounded-xl p-5 lg:ml-5 flex items-center justify-between gap-6">
              <div>
                <div class="flex items-baseline gap-1.5 mb-0.5">
                  <span class="text-2xl font-semibold text-om-gray-700">{{ additionalCredits.toLocaleString() }}</span>
                  <span class="text-sm text-om-gray-500">additional credits</span>
                </div>
                <p class="text-xs text-om-gray-400">Purchased · never expire</p>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <Button variant="secondary" size="md" @click="historyOpen = true">
                  <template #icon><History :size="14" /></template>
                  Credit history
                </Button>
                <Button variant="primary" size="md" @click="openBuyModal">Buy credits</Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Change plan -->
        <h2 class="text-xl font-semibold text-om-gray-700 mb-3">Change Plan</h2>

        <!-- Billing toggle -->
        <div class="inline-flex items-center gap-1 p-1 rounded-full bg-om-orange-100 mb-5">
          <button
            @click="billing = 'annual'"
            :class="['px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer', billing === 'annual' ? 'bg-om-orange-500 text-white' : 'text-om-orange-500']"
          >Annual (20% off)</button>
          <button
            @click="billing = 'monthly'"
            :class="['px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer', billing === 'monthly' ? 'bg-om-orange-500 text-white' : 'text-om-orange-500']"
          >Monthly billing</button>
        </div>

        <!-- Plan cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
          <div v-for="plan in plans" :key="plan.id" class="bg-white rounded-2xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] flex flex-col">
            <!-- Header -->
            <div class="px-4 pt-6 pb-5 text-center border-b border-om-gray-100">
              <h3 class="text-lg font-bold text-om-gray-700 mb-2">{{ plan.name }}</h3>
              <p class="text-[13px] text-om-gray-500 leading-snug whitespace-pre-line">{{ plan.desc }}</p>
            </div>

            <!-- Body -->
            <div class="px-6 pt-6 pb-6 flex flex-col flex-1">
              <!-- Price -->
              <div class="text-center mb-5">
                <div class="flex items-baseline justify-center gap-1">
                  <span class="text-3xl font-bold text-om-gray-800">{{ billing === 'annual' ? plan.priceYear : plan.priceMonthBig }}</span>
                  <span class="text-sm text-om-gray-500">/ {{ billing === 'annual' ? 'year' : 'month' }}</span>
                </div>
                <p v-if="billing === 'annual' && plan.priceMonthSub" class="text-sm text-om-gray-500 mt-1">{{ plan.priceMonthSub }} / month</p>
                <p v-else class="text-sm text-transparent mt-1 select-none">.</p>
              </div>

              <!-- Pageviews -->
              <div class="mb-5">
                <p v-if="plan.pageviewFixed" class="text-center text-sm font-semibold text-om-gray-700 py-2">{{ plan.pageviewFixed }}</p>
                <Dropdown v-else v-model="plan.pageview" :options="plan.pageviewOptions" size="default" />
              </div>

              <!-- Features -->
              <div class="space-y-2.5 flex-1">
                <div v-for="(f, fi) in plan.features" :key="fi" class="flex items-center gap-2 text-sm text-om-gray-600">
                  <Check v-if="f.ok" :size="16" class="text-[#2CC896] shrink-0" />
                  <X v-else :size="16" class="text-om-gray-300 shrink-0" />
                  <span>{{ f.label }}</span>
                  <Info v-if="f.info" :size="15" class="text-om-gray-400 shrink-0" />
                </div>
              </div>

              <!-- CTA -->
              <div class="mt-6 flex justify-center">
                <p v-if="plan.current" class="text-sm font-semibold text-om-gray-700">Current plan</p>
                <Button v-else-if="plan.cta === 'Upgrade plan'" variant="primary">Upgrade plan</Button>
                <Button v-else variant="secondary">{{ plan.cta }}</Button>
              </div>
            </div>
          </div>
        </div>

        <p class="text-sm text-om-gray-500 mb-10">Switching from an existing plan? Don't worry, we'll save you the time-proportional price difference.</p>

        <!-- Master banner -->
        <div class="relative bg-om-orange-50 rounded-2xl px-10 py-9 overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 items-center max-w-[820px]">
            <div>
              <h3 class="text-xl font-bold text-om-gray-800 leading-snug mb-5">Need a larger plan?<br />Ask about Master</h3>
              <Button variant="primary">Contact us</Button>
            </div>
            <div class="space-y-3">
              <div v-for="(f, i) in masterFeatures" :key="i" class="flex items-center gap-2 text-sm font-semibold text-om-gray-700">
                <Check :size="16" class="text-[#2CC896] shrink-0" />
                <span>{{ f }}</span>
                <Info :size="15" class="text-om-gray-400 shrink-0" />
              </div>
            </div>
          </div>
          <img src="/monk-hi-user.svg" alt="" class="hidden lg:block absolute -bottom-10 right-12 h-56 w-auto" />
        </div>
      </div>

      <!-- Credit history modal -->
      <Modal v-model="historyOpen" title="Credit history" size="lg">
        <div class="flex items-center justify-between gap-4 pb-4 mb-1 border-b border-om-gray-100">
          <div>
            <div class="flex items-baseline gap-1.5">
              <span class="text-2xl font-semibold text-om-gray-700">{{ totalAvailable.toLocaleString() }}</span>
              <span class="text-sm text-om-gray-500">credits available</span>
            </div>
            <p class="text-xs text-om-gray-400 mt-0.5">{{ credits.available.toLocaleString() }} plan · resets {{ creditsResetDate }} · +{{ additionalCredits.toLocaleString() }} additional · never expires</p>
          </div>
          <Button variant="primary" size="sm" @click="openBuyModal">Buy credits</Button>
        </div>
        <div>
          <div
            v-for="(h, i) in creditHistory"
            :key="i"
            class="flex items-center justify-between gap-4 py-3 border-b border-om-gray-100 last:border-0"
          >
            <div class="flex items-center gap-3 min-w-0">
              <span class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :class="h.amount > 0 ? 'bg-[#D6F5EC]' : 'bg-om-gray-100'">
                <component :is="h.amount > 0 ? Plus : Minus" :size="15" :class="h.amount > 0 ? 'text-[#2CC896]' : 'text-om-gray-500'" />
              </span>
              <div class="min-w-0">
                <p class="text-sm font-medium text-om-gray-700 truncate">{{ h.desc }}</p>
                <p class="text-xs text-om-gray-400">{{ h.date }}</p>
              </div>
            </div>
            <span :class="['text-sm font-semibold shrink-0', h.amount > 0 ? 'text-[#2CC896]' : 'text-om-gray-700']">
              {{ h.amount > 0 ? '+' : '' }}{{ h.amount.toLocaleString() }}
            </span>
          </div>
        </div>
      </Modal>

      <!-- Buy credits (hybrid: packs + custom amount) -->
      <Modal v-model="showBuyModal" size="md" :overflow-visible="true">
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-om-orange-500 flex items-center justify-center shrink-0">
              <Coins :size="18" class="text-white" />
            </div>
            <h2 class="text-lg font-semibold text-om-gray-700">Add credits</h2>
          </div>
        </template>

        <!-- Select -->
        <div v-if="buyStep === 'select'" class="flex flex-col gap-4">
          <p class="text-sm text-om-gray-500">Current balance: <span class="font-semibold text-om-gray-700">{{ totalAvailable.toLocaleString() }}</span> credits</p>
          <div class="flex flex-col gap-2">
            <button
              v-for="pack in creditPacks"
              :key="pack.credits"
              class="flex items-center justify-between gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors"
              :class="isPackSelected(pack) ? 'border-om-orange-500 bg-om-orange-50' : 'border-om-gray-200 hover:border-om-gray-300'"
              @click="selectPack(pack)"
            >
              <span class="flex items-center gap-2">
                <span class="text-sm font-semibold text-om-gray-700 tabular-nums">{{ pack.credits.toLocaleString() }} credits</span>
                <Tag v-if="pack.best" variant="green">Best value</Tag>
              </span>
              <span class="text-sm font-bold text-om-gray-700 tabular-nums">€{{ pack.price }}</span>
            </button>
          </div>
          <div class="flex items-center gap-3">
            <div class="h-px bg-om-gray-200 flex-1"></div>
            <span class="text-xs font-semibold text-om-gray-400 uppercase tracking-wider">or</span>
            <div class="h-px bg-om-gray-200 flex-1"></div>
          </div>
          <div class="rounded-xl border px-4 py-3 transition-colors" :class="customActive ? 'border-om-orange-500 bg-om-orange-50' : 'border-om-gray-200'">
            <div class="flex items-center justify-between gap-3">
              <div class="flex-1 min-w-0">
                <label class="text-xs text-om-gray-500 font-medium">Custom amount</label>
                <input v-model="buyCustom" type="number" min="0" placeholder="e.g. 12000" class="w-full bg-transparent text-sm text-om-gray-700 outline-none tabular-nums mt-0.5 placeholder-om-gray-400" />
              </div>
              <span class="text-sm font-bold text-om-gray-700 tabular-nums shrink-0">€{{ customPrice }}</span>
            </div>
          </div>
          <!-- Payment method -->
          <div class="flex flex-col gap-1.5">
            <span class="text-xs text-om-gray-500 font-medium">Payment method</span>
            <div v-if="savedCards.length === 0" class="flex items-center justify-between gap-3 rounded-lg border border-om-gray-200 px-4 py-2.5">
              <span class="text-sm text-om-gray-500 flex items-center gap-1.5"><CreditCard :size="14" class="text-om-gray-400" /> No card on file</span>
              <button class="text-sm font-medium text-om-orange-500 hover:text-om-orange-600" @click="buyStep = 'add-card'">+ Add card</button>
            </div>
            <Dropdown v-else drop-up :model-value="selectedCardId" :options="cardOptions" @update:model-value="onCardSelect">
              <template #icon><CreditCard :size="14" class="text-om-gray-400" /></template>
            </Dropdown>
          </div>
          <div class="flex items-center gap-2 pt-0.5">
            <span class="text-[11px] text-om-gray-400">Demo · cards on file:</span>
            <button
              v-for="n in [0, 1, 2]"
              :key="n"
              class="text-[11px] px-1.5 py-0.5 rounded transition-colors"
              :class="savedCards.length === n ? 'bg-om-gray-200 text-om-gray-700 font-medium' : 'text-om-gray-400 hover:text-om-gray-600'"
              @click="setCardCount(n)"
            >{{ n }}</button>
          </div>
        </div>

        <!-- Processing -->
        <div v-else-if="buyStep === 'processing'" class="flex flex-col items-center justify-center gap-3 py-12">
          <svg class="animate-spin w-8 h-8 text-om-orange-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p class="text-sm text-om-gray-500">Processing payment…</p>
        </div>

        <!-- Add card -->
        <div v-else-if="buyStep === 'add-card'" class="flex flex-col gap-3">
          <p class="text-sm text-om-gray-500">Add a card to complete your purchase of <span class="font-semibold text-om-gray-700">{{ buyCredits.toLocaleString() }}</span> credits (€{{ buyPrice }}).</p>
          <div class="flex flex-col gap-1">
            <label class="text-xs text-om-gray-500 font-medium">Card number</label>
            <input v-model="cardForm.number" inputmode="numeric" placeholder="1234 1234 1234 1234" class="w-full rounded-lg border border-om-gray-200 px-3 py-2 text-sm text-om-gray-700 outline-none focus:border-om-orange-300 tabular-nums" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-1">
              <label class="text-xs text-om-gray-500 font-medium">Expiry</label>
              <input v-model="cardForm.expiry" placeholder="MM / YY" class="w-full rounded-lg border border-om-gray-200 px-3 py-2 text-sm text-om-gray-700 outline-none focus:border-om-orange-300 tabular-nums" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs text-om-gray-500 font-medium">CVC</label>
              <input v-model="cardForm.cvc" inputmode="numeric" placeholder="123" class="w-full rounded-lg border border-om-gray-200 px-3 py-2 text-sm text-om-gray-700 outline-none focus:border-om-orange-300 tabular-nums" />
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs text-om-gray-500 font-medium">Name on card</label>
            <input v-model="cardForm.name" placeholder="Jane Doe" class="w-full rounded-lg border border-om-gray-200 px-3 py-2 text-sm text-om-gray-700 outline-none focus:border-om-orange-300" />
          </div>
          <Checkbox v-model="saveCard" label="Save this card for future purchases" />
        </div>

        <!-- Success -->
        <div v-else class="flex flex-col items-center justify-center gap-2 py-10 text-center">
          <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <p class="text-base font-semibold text-om-gray-700">+{{ lastPurchaseCredits.toLocaleString() }} credits added</p>
          <p class="text-sm text-om-gray-500">New balance: <span class="font-semibold text-om-gray-700">{{ totalAvailable.toLocaleString() }}</span> credits</p>
        </div>

        <template #footer="{ close }">
          <template v-if="buyStep === 'select'">
            <Button variant="secondary" @click="close">Cancel</Button>
            <Button variant="primary" :disabled="buyCredits <= 0" @click="startPay">{{ buyPrimaryLabel }}</Button>
          </template>
          <template v-else-if="buyStep === 'add-card'">
            <Button variant="secondary" @click="buyStep = 'select'">Back</Button>
            <Button variant="primary" :disabled="!cardFormValid" @click="submitCardAndPay">Pay €{{ buyPrice }}</Button>
          </template>
          <Button v-else-if="buyStep === 'success'" variant="primary" @click="close">Done</Button>
        </template>
      </Modal>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Check, X, Info, History, Plus, Minus, Coins, CreditCard } from 'lucide-vue-next'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Button from '../components/shared/Button.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import Modal from '../components/shared/Modal.vue'
import Checkbox from '../components/shared/Checkbox.vue'
import Tag from '../components/shared/Tag.vue'

defineProps({
  // Conversion Lift subscriber indication style:
  // 'A' = full-width status card, 'D' = third summary card.
  variant: { type: String, default: 'A' },
})
defineEmits(['menu-click'])

const billing = ref('annual')

// AI credit balance — two kinds:
//  • plan credits: renew each cycle (the `credits` object)
//  • additional credits: purchased, never expire
const credits = { available: 2700, total: 5000 }
const creditsResetDate = '2026-07-11'
const additionalCredits = ref(1200)
const totalAvailable = computed(() => credits.available + additionalCredits.value)

const historyOpen = ref(false)
const creditHistory = ref([
  { date: 'Jun 14, 2026', desc: 'AI image generation · Don Papa Baroko rum', amount: -40 },
  { date: 'Jun 12, 2026', desc: 'SPPO – Benefit List · 33 products', amount: -33 },
  { date: 'Jun 10, 2026', desc: 'Credit purchase', amount: 2000 },
  { date: 'Jun 6, 2026', desc: 'AI lifestyle image · batch run', amount: -120 },
  { date: 'Jun 2, 2026', desc: 'SPPO3 – USP · 100 products', amount: -100 },
  { date: 'Jun 1, 2026', desc: 'Monthly credit allocation', amount: 5000 },
  { date: 'May 28, 2026', desc: 'Product Description Generator · 500 products', amount: -500 },
  { date: 'May 20, 2026', desc: 'Credit purchase', amount: 1000 },
])

// ── Buy credits (hybrid: packs + custom amount) ──
const showBuyModal = ref(false)
const buyStep = ref('select') // 'select' | 'add-card' | 'processing' | 'success'
const creditPacks = [
  { credits: 5000, price: 19 },
  { credits: 20000, price: 59 },
  { credits: 50000, price: 119, best: true },
]
const CREDIT_UNIT_PRICE = 0.00275
const buySelectedPack = ref(creditPacks[1])
const buyCustom = ref('')
const lastPurchaseCredits = ref(0)
const customActive = computed(() => (parseInt(buyCustom.value, 10) || 0) > 0)
const isPackSelected = (pack) => !customActive.value && buySelectedPack.value?.credits === pack.credits
const customPrice = computed(() => Math.round((parseInt(buyCustom.value, 10) || 0) * CREDIT_UNIT_PRICE * 100) / 100)
const buyCredits = computed(() => customActive.value ? parseInt(buyCustom.value, 10) : (buySelectedPack.value?.credits ?? 0))
const buyPrice = computed(() => customActive.value ? customPrice.value : (buySelectedPack.value?.price ?? 0))
const selectPack = (pack) => { buySelectedPack.value = pack; buyCustom.value = '' }
const openBuyModal = () => { historyOpen.value = false; buyStep.value = 'select'; buyCustom.value = ''; showBuyModal.value = true }
const confirmBuy = () => {
  buyStep.value = 'processing'
  setTimeout(() => {
    const c = buyCredits.value
    additionalCredits.value += c
    lastPurchaseCredits.value = c
    creditHistory.value.unshift({ date: 'Today', desc: 'Credit purchase', amount: c })
    buyStep.value = 'success'
  }, 1500)
}

// Saved payment methods (demo: 0 / 1 / many)
const allDemoCards = [
  { id: 1, brand: 'Visa', last4: '0932', default: true },
  { id: 2, brand: 'Mastercard', last4: '1881', default: false },
]
const savedCards = ref(allDemoCards.map(c => ({ ...c })))
const selectedCardId = ref(1)
const setCardCount = (n) => {
  savedCards.value = allDemoCards.slice(0, n).map(c => ({ ...c }))
  selectedCardId.value = savedCards.value[0]?.id ?? null
}
const hasCard = computed(() => savedCards.value.length > 0)
const cardOptions = computed(() => [
  ...savedCards.value.map(c => ({ value: c.id, label: `${c.brand} •••• ${c.last4}${c.default ? ' · Default' : ''}` })),
  { value: '__add__', label: '+ Use a different card' },
])
const onCardSelect = (v) => { if (v === '__add__') buyStep.value = 'add-card'; else selectedCardId.value = v }
const buyPrimaryLabel = computed(() => (hasCard.value ? 'Confirm & pay' : 'Add card & pay') + ` €${buyPrice.value}`)
const startPay = () => { hasCard.value ? confirmBuy() : (buyStep.value = 'add-card') }
const cardForm = ref({ number: '', expiry: '', cvc: '', name: '' })
const saveCard = ref(true)
const cardFormValid = computed(() => cardForm.value.number.trim() && cardForm.value.expiry.trim() && cardForm.value.cvc.trim())
const submitCardAndPay = () => {
  if (saveCard.value) {
    const last4 = cardForm.value.number.replace(/\D/g, '').slice(-4) || '0000'
    const id = savedCards.value.reduce((m, c) => Math.max(m, c.id), 0) + 1
    savedCards.value.push({ id, brand: 'Card', last4, default: savedCards.value.length === 0 })
    selectedCardId.value = id
  }
  cardForm.value = { number: '', expiry: '', cvc: '', name: '' }
  confirmBuy()
}

const plans = reactive([
  {
    id: 'free', name: 'Free', desc: 'A simple way to get\nstarted with OptiMonk',
    priceYear: '$0', priceMonthBig: '$0', priceMonthSub: null,
    pageviewFixed: '10,000 pageviews / month',
    features: [
      { label: 'Max. 1 domain', ok: true, info: true },
      { label: 'All features', ok: true },
      { label: 'Unlimited campaigns', ok: true },
      { label: 'Unbranded', ok: false },
    ],
    cta: 'Downgrade',
  },
  {
    id: 'essential', name: 'Essential', desc: 'For new brands that want to\nstart driving revenue with popups',
    priceYear: '$228', priceMonthBig: '$24', priceMonthSub: '$19',
    pageview: '20,000 pageviews / month',
    pageviewOptions: ['20,000 pageviews / month', '30,000 pageviews / month', '50,000 pageviews / month'],
    features: [
      { label: 'Max. 2 domains', ok: true, info: true },
      { label: 'All features', ok: true },
      { label: 'Unlimited campaigns', ok: true },
      { label: 'Unbranded', ok: true },
    ],
    current: true,
  },
  {
    id: 'growth', name: 'Growth', desc: 'For fast-growing brands\nto maximize sales and subscribers',
    priceYear: '$828', priceMonthBig: '$86', priceMonthSub: '$69',
    pageview: '100,000 pageviews / month',
    pageviewOptions: ['100,000 pageviews / month', '150,000 pageviews / month', '200,000 pageviews / month'],
    features: [
      { label: 'Max. 4 domains', ok: true, info: true },
      { label: 'All features', ok: true },
      { label: 'Unlimited campaigns', ok: true },
      { label: 'Unbranded', ok: true },
    ],
    cta: 'Upgrade plan',
  },
  {
    id: 'premium', name: 'Premium', desc: 'Full solution for\nhigh-performance brands',
    priceYear: '$2,148', priceMonthBig: '$224', priceMonthSub: '$179',
    pageview: '500,000 pageviews / month',
    pageviewOptions: ['500,000 pageviews / month', '750,000 pageviews / month', '1,000,000 pageviews / month'],
    features: [
      { label: 'Max. 10 domains', ok: true, info: true },
      { label: 'All features', ok: true },
      { label: 'Unlimited campaigns', ok: true },
      { label: 'Unbranded', ok: true },
    ],
    cta: 'Upgrade plan',
  },
])

const masterFeatures = ['Custom amount of pageview', 'Unlimited domains', 'Unlimited campaigns']
</script>
