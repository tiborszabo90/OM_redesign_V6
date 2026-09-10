<script setup>
import { computed } from 'vue'
import { state, products, subscriptionPlans, disclosureIcons, DISCLOSURE_MAX, bestseller, styleById } from '../store'
import AiLabel from '../components/AiLabel.vue'
import { Settings, Check, CreditCard, Bell, Store, ArrowRight, BadgeInfo, TriangleAlert } from 'lucide-vue-next'

const liveCount = computed(() => products.filter(p => state.selected.includes(p.id)).length)
const plan = computed(() => subscriptionPlans.find(p => p.id === state.plan))
const quota = computed(() => plan.value ? plan.value.images : 10)

const notificationRows = [
  { key: 'emailOnFinish', title: 'Batch finished', desc: 'Email me when a generation batch is done.' },
  { key: 'weeklyDigest', title: 'Weekly performance summary', desc: 'Image CTR, assisted orders and revenue, every Monday.' },
]

function toggle(key) {
  state.settings[key] = !state.settings[key]
}

function goPlans() {
  state.screen = 'plans'
}

function goEnable() {
  state.screen = 'enable'
}

// ── AI label ──
const d = state.disclosure
// The sample the merchant checks the label against is a real generated image.
const labelSample = computed(() => styleById('lifestyle').preview)

function pickIcon(id) {
  d.icon = id
}
</script>

<template>
  <div class="max-w-[960px] mx-auto px-6 py-5">
    <!-- Page header -->
    <div class="flex items-center gap-2 mb-5">
      <span class="w-7 h-7 rounded-lg bg-[#b2592e] flex items-center justify-center">
        <Settings :size="15" class="text-white" />
      </span>
      <h1 class="text-lg font-bold text-[#1a1a1a]">Settings</h1>
    </div>

    <!-- Notifications -->
    <div class="pb-card p-5 mb-4">
      <div class="flex items-center gap-2 mb-1">
        <Bell :size="15" class="text-[#b2592e]" />
        <p class="font-semibold text-[#1a1a1a]">Notifications</p>
      </div>
      <p class="text-[12px] text-[#616161] mb-3">Sent to the store owner email.</p>
      <div class="divide-y divide-[#ececec]">
        <div v-for="row in notificationRows" :key="row.key" class="flex items-center gap-4 py-3">
          <div class="flex-1">
            <p class="font-medium text-[#1a1a1a] text-[13px]">{{ row.title }}</p>
            <p class="text-[12px] text-[#616161] mt-0.5">{{ row.desc }}</p>
          </div>
          <span
            class="w-9 h-[20px] rounded-full transition-colors duration-300 relative shrink-0 cursor-pointer"
            :class="state.settings[row.key] ? 'bg-[#36c98e]' : 'bg-[#d4d4d4]'"
            @click="toggle(row.key)"
          >
            <span
              class="absolute top-[2px] w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
              :class="state.settings[row.key] ? 'left-[18px]' : 'left-[2px]'"
            ></span>
          </span>
        </div>
      </div>
    </div>

    <!-- AI label on generated images (EU AI Act Art. 50(4)) -->
    <div class="pb-card p-5 mb-4">
      <div class="flex items-center gap-2 mb-1">
        <BadgeInfo :size="15" class="text-[#b2592e]" />
        <p class="font-semibold text-[#1a1a1a]">AI label on your images</p>
      </div>
      <p class="text-[12px] text-[#616161] mb-4">
        The EU AI Act asks you to tell shoppers when an image is AI generated. Picbear
        puts this label in the corner of every image it makes.
      </p>

      <div class="grid grid-cols-[1fr_240px] gap-5 items-start">
        <div>
          <!-- On/off. Off is a deliberate choice, so it reads as one. -->
          <div class="flex items-center gap-4 pb-4 border-b border-[#ececec]">
            <div class="flex-1">
              <p class="font-medium text-[#1a1a1a] text-[13px]">Show the label</p>
              <p class="text-[12px] text-[#616161] mt-0.5">Applies to every image, on every product page.</p>
            </div>
            <span
              class="w-9 h-[20px] rounded-full transition-colors duration-300 relative shrink-0 cursor-pointer"
              :class="d.enabled ? 'bg-[#36c98e]' : 'bg-[#d4d4d4]'"
              @click="d.enabled = !d.enabled"
            >
              <span
                class="absolute top-[2px] w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
                :class="d.enabled ? 'left-[18px]' : 'left-[2px]'"
              ></span>
            </span>
          </div>

          <div v-if="!d.enabled" class="flex items-start gap-2 mt-3 rounded-lg bg-[#fdf4ef] border border-[#f2d9c9] px-3 py-2.5">
            <TriangleAlert :size="14" class="text-[#b2592e] shrink-0 mt-0.5" />
            <p class="text-[12px] text-[#6b3319]">
              With the label off, nothing on your product pages says the images are AI
              generated. Whether that is allowed where you sell is your call.
            </p>
          </div>

          <div :class="d.enabled ? '' : 'opacity-45 pointer-events-none'">
            <div class="mt-4">
              <label class="text-[12px] font-medium text-[#616161] mb-1 flex items-center justify-between">
                <span>Label text</span>
                <span class="tabular-nums text-[#8a8a8a]">{{ d.text.length }} / {{ DISCLOSURE_MAX }}</span>
              </label>
              <input
                v-model="d.text"
                type="text"
                :maxlength="DISCLOSURE_MAX"
                placeholder="AI Generated"
                class="w-full rounded-lg border border-[#d4d4d4] px-3 py-2 text-[13px] outline-none"
              />
              <p class="text-[12px] text-[#616161] mt-1.5">Leave it empty to show the icon on its own.</p>
            </div>

            <div class="mt-4">
              <p class="text-[12px] font-medium text-[#616161] mb-2">Icon</p>
              <div class="flex flex-col gap-2">
                <button
                  v-for="opt in disclosureIcons" :key="opt.id"
                  class="flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left cursor-pointer transition-colors"
                  :class="d.icon === opt.id ? 'border-[#b2592e] bg-[#fdf4ef]' : 'border-[#d4d4d4] hover:border-[#a0a0a0]'"
                  @click="pickIcon(opt.id)"
                >
                  <span class="shrink-0 rounded-md bg-[#1a1a1a] px-1.5 py-1 inline-flex">
                    <AiLabel :icon="opt.id" text="" compact />
                  </span>
                  <span class="flex-1 min-w-0">
                    <span class="block text-[13px] font-semibold text-[#1a1a1a]">{{ opt.name }}</span>
                    <span class="block text-[12px] text-[#616161]">{{ opt.hint }}</span>
                  </span>
                  <Check v-if="d.icon === opt.id" :size="15" class="text-[#b2592e] shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Live sample, so the label is judged on an image and not in a field -->
        <div>
          <p class="text-[12px] font-medium text-[#616161] mb-2">On your images</p>
          <div class="relative rounded-lg overflow-hidden ring-1 ring-[#e3e3e3]">
            <img :src="labelSample" class="w-full block" />
            <AiLabel v-if="d.enabled" class="absolute bottom-2 left-2" />
          </div>
          <p class="text-[12px] text-[#616161] mt-2">{{ bestseller.name }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-4">
      <!-- Plan & usage -->
      <div class="pb-card p-5 flex flex-col">
        <div class="flex items-center gap-2 mb-1">
          <CreditCard :size="15" class="text-[#b2592e]" />
          <p class="font-semibold text-[#1a1a1a]">Plan &amp; usage</p>
        </div>
        <div class="flex items-center justify-between mt-2 mb-1.5">
          <p class="text-[13px] font-semibold text-[#1a1a1a]">
            <template v-if="plan">{{ plan.name }} plan · {{ plan.price }}/{{ plan.per }}</template>
            <template v-else>Free trial</template>
          </p>
          <span class="text-[11px] font-semibold text-[#6b3319] bg-[#fdf4ef] border border-[#f2d9c9] rounded-full px-2 py-0.5">
            {{ liveCount }} of {{ quota >= 999 ? 'unlimited' : quota }} used
          </span>
        </div>
        <div class="h-1.5 bg-[#ececec] rounded-full overflow-hidden mb-3">
          <div class="h-full bg-[#b2592e] rounded-full" :style="{ width: Math.min(liveCount / Math.min(quota, 36) * 100, 100) + '%' }"></div>
        </div>
        <p class="text-[12px] text-[#616161] mb-3 flex-1">Billed through Shopify. Cancel anytime.</p>
        <button class="pb-btn-secondary self-start" @click="goPlans">
          {{ plan ? 'Manage plan' : 'See plans' }} <ArrowRight :size="12" />
        </button>
      </div>

      <!-- Theme embed -->
      <div class="pb-card p-5 flex flex-col">
        <div class="flex items-center gap-2 mb-1">
          <Store :size="15" class="text-[#b2592e]" />
          <p class="font-semibold text-[#1a1a1a]">Theme embed</p>
        </div>
        <div class="flex items-center justify-between mt-2 mb-1.5">
          <p class="text-[13px] font-semibold text-[#1a1a1a]">Picbear AI images · Horizon theme</p>
          <span
            class="text-[11px] font-semibold rounded-full px-2 py-0.5"
            :class="state.themeEnabled ? 'text-[#0c6b45] bg-[#d7f2e4]' : 'text-[#616161] bg-[#f1f1f1]'"
          >
            {{ state.themeEnabled ? 'On' : 'Off' }}
          </span>
        </div>
        <p class="text-[12px] text-[#616161] mb-3 flex-1">
          The app embed is what shows your AI images on the storefront. Turning it off hides every image without deleting anything.
        </p>
        <button v-if="!state.themeEnabled" class="pb-btn-secondary self-start" @click="goEnable">
          Turn on in theme editor <ArrowRight :size="12" />
        </button>
        <p v-else class="text-[12px] font-semibold text-[#0c6b45] flex items-center gap-1.5">
          <Check :size="13" /> Active on your storefront
        </p>
      </div>
    </div>
  </div>
</template>
