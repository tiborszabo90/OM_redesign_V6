<template>
  <DashboardLayout @logo-click="handleLogoClick" @menu-click="$emit('menu-click', $event)" :right-panel-collapsed="!isChatOpen">
    <template #content>
      <div class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Header -->
        <h1 class="text-2xl font-semibold text-om-gray-700 mb-5">Hi Csaba</h1>

        <!-- Filters Section -->
        <div class="flex items-center justify-between mb-5 gap-4">
          <!-- Domain Selector -->
          <div class="w-56">
            <Dropdown
              v-model="selectedDomain"
              :options="domains"
              placeholder="Select domain"
            >
              <template #icon>
                <img src="/demos/telekom/logo.png" alt="Domain" class="w-5 h-5 rounded-full object-cover" />
              </template>
            </Dropdown>
          </div>

        </div>

        <!-- Onboarding Checklist -->
        <div class="space-y-3 mb-5">
          <!-- Step 1: Create first campaign -->
          <Accordion
            title="Create your first campaign"
            :open="openStep === 0"
            @toggle="openStep = openStep === 0 ? null : 0"
          >
            <template #icon>
              <LayoutTemplate :size="20" class="text-om-orange-500" />
            </template>
            <template #meta>
              <span class="text-sm text-om-gray-400">~10 min</span>
            </template>
            <!-- Content -->
            <div class="flex gap-6 pt-2">
              <div class="pl-13 flex-1 min-w-0">
                <h3 class="text-xl font-bold text-om-gray-700 leading-snug mb-3">Choose from recommended<br>campaigns for Reflexshop</h3>
                <p class="text-base text-om-gray-500 mb-6">Based on your answers, we identified the most suitable campaigns for you.</p>
                <Button variant="primary" size="lg" class="self-start" @click="$emit('menu-click', 'wizard-recommendation')">Show recommendations</Button>
              </div>

              <!-- Illustration -->
              <div class="flex items-center justify-center shrink-0 w-56">
                <img src="/monk-wizard.svg" alt="" class="w-48 h-48 object-contain" />
              </div>

              <!-- Divider -->
              <div class="flex flex-col items-center gap-2 self-stretch">
                <div class="flex-1 w-px bg-om-gray-200"></div>
                <span class="text-sm text-om-gray-400 italic">or</span>
                <div class="flex-1 w-px bg-om-gray-200"></div>
              </div>

              <!-- Right: quick links -->
              <div class="flex flex-col justify-around flex-1 min-w-0 gap-4">
                <div class="cursor-pointer group" @click="$emit('menu-click', 'templates')">
                  <p class="text-sm font-semibold text-om-orange-500 group-hover:underline">Browse templates ›</p>
                  <p class="text-xs text-om-gray-500 mt-0.5">Browse 300+ ready-made templates tailored to your business goals</p>
                </div>
                <div class="border-t border-om-gray-100"></div>
                <div class="cursor-pointer group" @click="$emit('menu-click', 'ab-test')">
                  <p class="text-sm font-semibold text-om-orange-500 group-hover:underline">Optimize your website ›</p>
                  <p class="text-xs text-om-gray-500 mt-0.5">Run A/B tests, personalize, and more</p>
                </div>
                <div class="border-t border-om-gray-100"></div>
                <div class="cursor-pointer group" @click="$emit('menu-click', 'tactics')">
                  <p class="text-sm font-semibold text-om-orange-500 group-hover:underline">Pick a proven Tactic ›</p>
                  <p class="text-xs text-om-gray-500 mt-0.5">Get inspired by 50+ proven tactics!</p>
                </div>
              </div>
            </div>
          </Accordion>

          <!-- Step 2: Install OptiMonk -->
          <Accordion
            title="Install OptiMonk"
            :open="openStep === 1"
            @toggle="openStep = openStep === 1 ? null : 1"
          >
            <template #icon>
              <Plug :size="20" class="text-om-orange-500" />
            </template>
            <template #meta>
              <span class="text-sm text-om-gray-400">~2 min</span>
            </template>
            <div class="flex items-stretch gap-6">
              <div class="pl-13 flex-1 py-2 pr-96">
                <p class="text-base text-om-gray-500 mb-5">Connect your website to OptiMonk and let us make the most of your online presence.</p>
                <Button variant="primary" size="lg" class="self-start">Connect my website</Button>
              </div>
              <div class="absolute top-10 right-0 bottom-10 flex items-stretch -translate-x-20">
                <MeditatingPersonSvg class="h-full w-auto" />
              </div>
            </div>
          </Accordion>
        </div>

        <!-- Promo Blocks -->
        <div v-if="showInviteBlock || showConsultBlock" class="flex gap-4 mb-8">
          <!-- Invite block -->
          <div v-if="showInviteBlock" class="flex-1 bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-4 flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-om-orange-100 flex items-center justify-center shrink-0">
              <UserPlus :size="20" class="text-om-orange-500" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-om-gray-700">Invite your teammates</p>
              <p class="text-xs text-om-gray-400 mt-0.5">Get more out of OptiMonk by inviting your team for free</p>
            </div>
            <Button variant="outline" size="sm">Invite your team</Button>
            <button @click="showInviteBlock = false" class="text-om-gray-400 hover:text-om-gray-600 transition-colors cursor-pointer shrink-0">
              <X :size="16" />
            </button>
          </div>

          <!-- Consultation block -->
          <div v-if="showConsultBlock" class="flex-1 bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-4 flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-om-orange-100 flex items-center justify-center shrink-0">
              <Signpost :size="20" class="text-om-orange-500" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-om-gray-700">Free consultation / demo</p>
              <p class="text-xs text-om-gray-400 mt-0.5">Discover OptiMonk with expert guidance</p>
            </div>
            <Button variant="outline" size="sm">Book now</Button>
            <button @click="showConsultBlock = false" class="text-om-gray-400 hover:text-om-gray-600 transition-colors cursor-pointer shrink-0">
              <X :size="16" />
            </button>
          </div>
        </div>

        <!-- Trend Chart Section (empty state) -->
        <div class="relative bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] mb-5 overflow-hidden">
          <!-- Skeleton chart background -->
          <svg viewBox="-40 0 880 220" xmlns="http://www.w3.org/2000/svg" class="w-full opacity-80">
            <defs>
              <linearGradient id="skeletonGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#E5E7EB" stop-opacity="0.6"/>
                <stop offset="100%" stop-color="#E5E7EB" stop-opacity="0.05"/>
              </linearGradient>
            </defs>
            <!-- Y-axis label placeholders -->
            <rect x="8" y="22" width="36" height="8" rx="4" fill="#E5E7EB"/>
            <rect x="8" y="67" width="36" height="8" rx="4" fill="#E5E7EB"/>
            <rect x="8" y="112" width="36" height="8" rx="4" fill="#E5E7EB"/>
            <rect x="8" y="157" width="36" height="8" rx="4" fill="#E5E7EB"/>
            <!-- Grid lines -->
            <line x1="54" y1="26" x2="792" y2="26" stroke="#E5E7EB" stroke-width="1.5"/>
            <line x1="54" y1="71" x2="792" y2="71" stroke="#E5E7EB" stroke-width="1.5"/>
            <line x1="54" y1="116" x2="792" y2="116" stroke="#E5E7EB" stroke-width="1.5"/>
            <line x1="54" y1="161" x2="792" y2="161" stroke="#E5E7EB" stroke-width="1.5"/>
            <!-- Area fill -->
            <path
              d="M54,161 L54,120 C120,120 150,60 200,75 C250,90 280,45 330,55 C380,65 420,100 470,85 C520,70 560,35 610,50 C660,65 700,90 750,80 L792,75 L792,161 Z"
              fill="url(#skeletonGrad)"
            />
            <!-- Line -->
            <path
              d="M54,120 C120,120 150,60 200,75 C250,90 280,45 330,55 C380,65 420,100 470,85 C520,70 560,35 610,50 C660,65 700,90 750,80 L792,75"
              fill="none"
              stroke="#E5E7EB"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <!-- X-axis label placeholders -->
            <rect x="54"  y="172" width="38" height="8" rx="4" fill="#E5E7EB"/>
            <rect x="120" y="172" width="38" height="8" rx="4" fill="#E5E7EB"/>
            <rect x="186" y="172" width="38" height="8" rx="4" fill="#E5E7EB"/>
            <rect x="252" y="172" width="38" height="8" rx="4" fill="#E5E7EB"/>
            <rect x="318" y="172" width="38" height="8" rx="4" fill="#E5E7EB"/>
            <rect x="384" y="172" width="38" height="8" rx="4" fill="#E5E7EB"/>
            <rect x="450" y="172" width="38" height="8" rx="4" fill="#E5E7EB"/>
            <rect x="516" y="172" width="38" height="8" rx="4" fill="#E5E7EB"/>
            <rect x="582" y="172" width="38" height="8" rx="4" fill="#E5E7EB"/>
            <rect x="648" y="172" width="38" height="8" rx="4" fill="#E5E7EB"/>
            <rect x="714" y="172" width="38" height="8" rx="4" fill="#E5E7EB"/>
            <rect x="754" y="172" width="38" height="8" rx="4" fill="#E5E7EB"/>
          </svg>
          <!-- Empty state overlay -->
          <div class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/60">
            <LineChart :size="40" class="text-om-gray-300" />
            <p class="text-sm text-om-gray-400 text-center">You'll see your campaign statistics here<br>once you've set up OptiMonk.</p>
          </div>
        </div>

        <!-- Top Campaigns Section -->
        <div class="mt-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-om-gray-700">Top campaigns</h2>
            <Button variant="primary" size="sm" @click="$emit('menu-click', 'wizard')">New campaign</Button>
          </div>

          <!-- Skeleton rows -->
          <div class="relative bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] overflow-hidden">
            <svg viewBox="0 0 800 220" xmlns="http://www.w3.org/2000/svg" class="w-full opacity-80">
              <!-- Row 1 -->
              <rect x="16" y="20" width="40" height="40" rx="8" fill="#E5E7EB"/>
              <rect x="68" y="24" width="160" height="10" rx="5" fill="#E5E7EB"/>
              <rect x="68" y="42" width="100" height="8" rx="4" fill="#F3F4F6"/>
              <rect x="340" y="24" width="80" height="10" rx="5" fill="#E5E7EB"/>
              <rect x="340" y="42" width="50" height="8" rx="4" fill="#F3F4F6"/>
              <rect x="500" y="24" width="80" height="10" rx="5" fill="#E5E7EB"/>
              <rect x="500" y="42" width="50" height="8" rx="4" fill="#F3F4F6"/>
              <rect x="680" y="26" width="60" height="16" rx="8" fill="#E5E7EB"/>
              <rect x="752" y="26" width="32" height="16" rx="8" fill="#F3F4F6"/>
              <!-- Divider -->
              <line x1="16" y1="74" x2="784" y2="74" stroke="#F3F4F6" stroke-width="1"/>
              <!-- Row 2 -->
              <rect x="16" y="83" width="40" height="40" rx="8" fill="#E5E7EB"/>
              <rect x="68" y="87" width="140" height="10" rx="5" fill="#E5E7EB"/>
              <rect x="68" y="105" width="110" height="8" rx="4" fill="#F3F4F6"/>
              <rect x="340" y="87" width="80" height="10" rx="5" fill="#E5E7EB"/>
              <rect x="340" y="105" width="50" height="8" rx="4" fill="#F3F4F6"/>
              <rect x="500" y="87" width="80" height="10" rx="5" fill="#E5E7EB"/>
              <rect x="500" y="105" width="50" height="8" rx="4" fill="#F3F4F6"/>
              <rect x="680" y="89" width="60" height="16" rx="8" fill="#E5E7EB"/>
              <rect x="752" y="89" width="32" height="16" rx="8" fill="#F3F4F6"/>
              <!-- Divider -->
              <line x1="16" y1="137" x2="784" y2="137" stroke="#F3F4F6" stroke-width="1"/>
              <!-- Row 3 -->
              <rect x="16" y="146" width="40" height="40" rx="8" fill="#E5E7EB"/>
              <rect x="68" y="150" width="180" height="10" rx="5" fill="#E5E7EB"/>
              <rect x="68" y="168" width="90" height="8" rx="4" fill="#F3F4F6"/>
              <rect x="340" y="150" width="80" height="10" rx="5" fill="#E5E7EB"/>
              <rect x="340" y="168" width="50" height="8" rx="4" fill="#F3F4F6"/>
              <rect x="500" y="150" width="80" height="10" rx="5" fill="#E5E7EB"/>
              <rect x="500" y="168" width="50" height="8" rx="4" fill="#F3F4F6"/>
              <rect x="680" y="152" width="60" height="16" rx="8" fill="#E5E7EB"/>
              <rect x="752" y="152" width="32" height="16" rx="8" fill="#F3F4F6"/>
            </svg>
            <!-- Empty state overlay -->
            <div class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/60">
              <LayoutGrid :size="40" class="text-om-gray-300" />
              <p class="text-sm text-om-gray-400 text-center">Your campaigns will appear here<br>once you've created your first one.</p>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #right-panel>
      <ChatPanel v-model="isChatOpen" :suggestions="chatSuggestions" :ai-responses="chatAiResponses" />
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue'
import { UserPlus, Signpost, X, LayoutTemplate, LayoutGrid, Plug, LineChart } from 'lucide-vue-next'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Accordion from '../components/shared/Accordion.vue'
import Button from '../components/shared/Button.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import ChatPanel from '../components/shared/ChatPanel.vue'
import MeditatingPersonSvg from '../components/illustrations/MeditatingPersonSvg.vue'

defineProps({
  registrationData: {
    type: Object,
    default: null
  }
})

defineEmits(['task-created', 'menu-click'])

const handleLogoClick = () => {}

const isChatOpen = ref(true)

const chatSuggestions = [
  'What campaign should I create first?',
  'How do I install OptiMonk?',
  'What results can I expect?',
  'Help me choose a use case',
]

const chatAiResponses = {
  'What campaign should I create first?': 'Great question! The best first campaign depends on your goal:\n\n- **Grow your email list** → try a Welcome Popup with a discount or lead magnet\n- **Reduce cart abandonment** → an Exit Intent popup works great\n- **Collect feedback** → a simple survey popup\n\nWould you like me to launch the campaign wizard for any of these?',
  'How do I install OptiMonk?': 'Installing OptiMonk takes about 2 minutes:\n\n1. **Copy your unique script** from the Install page\n2. **Paste it** into the `<head>` of your website\n3. Or use one of our **CMS plugins** (WordPress, Shopify, Wix, etc.)\n\nOnce installed, your campaigns will go live instantly. Want me to guide you to the install page?',
  'What results can I expect?': 'OptiMonk customers typically see:\n\n- **3–8% conversion rate** on email list building campaigns\n- **10–15% cart recovery** with exit intent popups\n- **2–5x ROI** within the first month\n\nResults vary by industry and traffic, but most users see their first conversions within 24 hours of launching their first campaign.',
  'Help me choose a use case': 'Here are the most popular use cases to start with:\n\n1. **Email list building** — capture leads with a discount or free resource\n2. **Cart abandonment** — recover visitors before they leave\n3. **Product promotion** — highlight offers to the right audience\n4. **Customer feedback** — learn what visitors think\n\nWhich one sounds most relevant to your business?',
}

const openStep = ref(0)

const showInviteBlock = ref(true)
const showConsultBlock = ref(true)

const selectedDomain = ref('reflexshop.hu')
const domains = ref([
  'reflexshop.hu',
  'telekom.hu',
  'shop.telekom.hu',
  'demo.optimonk.com'
])
</script>
