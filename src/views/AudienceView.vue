<template>
  <DashboardLayout @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-5 max-960:flex-col max-960:items-start max-960:gap-3">
          <h1 class="text-2xl max-960:text-xl font-semibold text-om-gray-700">Audience ({{ leads.length }})</h1>
        </div>

        <!-- Tabs -->
        <div class="flex items-center border-b border-gray-200 mb-5">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-4 py-2.5 text-sm font-medium transition-colors relative cursor-pointer',
              activeTab === tab.id
                ? 'text-om-gray-700'
                : 'text-om-gray-400 hover:text-om-gray-600'
            ]"
          >
            {{ tab.label }}
            <span
              v-if="activeTab === tab.id"
              class="absolute bottom-0 left-4 right-4 h-0.5 bg-om-orange-500 rounded-full"
            ></span>
          </button>
        </div>

        <!-- Filters and Controls -->
        <div class="flex items-center justify-between mb-4 max-960:flex-col max-960:items-start max-960:gap-3">
          <!-- Left: Dropdowns -->
          <div class="flex items-center gap-3">
            <Dropdown
              v-model="filterDomain"
              :options="domainOptions"
              placeholder="Select domain"
              style="width: 240px; min-width: 240px"
            >
              <template #icon>
                <div class="w-6 h-6 rounded-full overflow-hidden">
                  <img src="/demos/telekom/logo.png" alt="Domain" class="w-full h-full object-cover" />
                </div>
              </template>
            </Dropdown>

            <Dropdown
              v-model="filterCampaign"
              :options="campaignOptions"
              placeholder="Select Campaigns"
              style="width: 240px; min-width: 240px"
            />

            <!-- Search input -->
            <div class="relative">
              <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-om-gray-400 pointer-events-none" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search leads..."
                class="pl-9 pr-3 h-10 text-sm border border-om-gray-200 rounded-lg bg-white text-om-gray-700 placeholder-om-gray-400 focus:outline-none focus:border-om-gray-300 w-[240px]"
              />
            </div>
          </div>

          <!-- Right: Sort, Columns, Date, Export -->
          <div class="flex items-center gap-2">
            <!-- Sort -->
            <div class="relative">
              <Button variant="ghost" size="md" icon-only :class="sortOpen ? '!bg-[#505763]/10' : ''" @click="sortOpen = !sortOpen">
                <template #icon><ArrowUpDown :size="18" /></template>
              </Button>
              <div v-if="sortOpen" class="fixed inset-0 z-10" @click="sortOpen = false" />
              <div
                v-if="sortOpen"
                class="absolute right-0 top-full mt-1 z-20 bg-white border border-[#D5D8DD] rounded-lg shadow-lg overflow-hidden min-w-[200px]"
              >
                <button
                  v-for="opt in sortOptions"
                  :key="opt.value"
                  @click="sortBy = opt.value; sortOpen = false"
                  class="w-full text-left text-sm text-[#23262A] px-4 py-2 hover:bg-[#F9FAFB] transition-colors cursor-pointer flex items-center justify-between"
                  :class="sortBy === opt.value ? 'bg-[#F1F2F4] font-medium' : ''"
                >
                  {{ opt.label }}
                  <Check v-if="sortBy === opt.value" :size="16" class="text-om-gray-500 shrink-0" />
                </button>
              </div>
            </div>

            <!-- Columns toggle -->
            <div class="relative">
              <Button variant="ghost" size="md" icon-only :class="columnsOpen ? '!bg-[#505763]/10' : ''" @click="columnsOpen = !columnsOpen">
                <template #icon><Columns3 :size="18" /></template>
              </Button>
              <div v-if="columnsOpen" class="fixed inset-0 z-10" @click="columnsOpen = false" />
              <div
                v-if="columnsOpen"
                class="absolute right-0 top-full mt-1 z-20 bg-white border border-[#D5D8DD] rounded-lg shadow-lg overflow-hidden min-w-[200px] py-1"
              >
                <button
                  v-for="col in toggleableColumns"
                  :key="col.key"
                  @click="col.visible = !col.visible"
                  class="w-full text-left text-sm text-[#23262A] px-4 py-2 hover:bg-[#F9FAFB] transition-colors cursor-pointer flex items-center justify-between"
                >
                  {{ col.label }}
                  <Check v-if="col.visible" :size="16" class="text-om-gray-500 shrink-0" />
                </button>
              </div>
            </div>

            <!-- Date filter -->
            <Dropdown
              v-model="selectedTimeFilter"
              :options="timeFilterOptions"
              style="width: 240px; min-width: 240px"
            >
              <template #icon>
                <Calendar :size="20" class="text-om-gray-600" />
              </template>
            </Dropdown>

            <!-- Export -->
            <Button variant="primary" size="md" @click="handleExport">Export</Button>
          </div>
        </div>

        <!-- Leads Tab -->
        <div v-if="activeTab === 'leads'">

          <!-- Table -->
          <div class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] border border-gray-100 table-scroll-wrapper relative">
            <!-- Right fade gradient -->
            <div
              v-if="showRightFade"
              class="absolute right-0 top-0 bottom-0 w-16 pointer-events-none z-10 rounded-r-xl"
              style="background: linear-gradient(to right, transparent, white)"
            ></div>
            <!-- Top scrollbar (inside white card) -->
            <div class="overflow-x-auto table-scrollbar" @scroll="syncScroll('top', $event)" ref="topScrollRef">
              <div :style="{ width: tableMinWidth, height: '1px' }"></div>
            </div>

            <div class="overflow-x-auto max-w-full table-scrollbar" @scroll="syncScroll('bottom', $event)" ref="bottomScrollRef">
            <table :style="{ width: tableMinWidth, minWidth: tableMinWidth }">
              <thead>
                <tr class="border-b border-gray-200 text-[13px] font-medium text-om-gray-500">
                  <th class="text-left px-5 py-3 whitespace-nowrap font-medium" :style="{ width: '280px', minWidth: '280px' }">Email</th>
                  <th v-if="isVisible('name')" class="text-left px-4 py-3 whitespace-nowrap font-medium" :style="{ width: '200px', minWidth: '200px' }">Name</th>
                  <th v-if="isVisible('campaign')" class="text-left px-4 py-3 whitespace-nowrap font-medium" :style="{ width: '220px', minWidth: '220px' }">Campaign</th>
                  <th v-if="isVisible('domain')" class="text-left px-4 py-3 whitespace-nowrap font-medium" :style="{ width: '200px', minWidth: '200px' }">Domain</th>
                  <th v-if="isVisible('status')" class="text-left px-4 py-3 whitespace-nowrap font-medium" :style="{ width: '110px', minWidth: '110px' }">Status</th>
                  <th v-if="isVisible('date')" class="text-left px-4 py-3 whitespace-nowrap font-medium" :style="{ width: '130px', minWidth: '130px' }">Date</th>
                  <th v-if="isVisible('phone')" class="text-left px-4 py-3 whitespace-nowrap font-medium" :style="{ width: '150px', minWidth: '150px' }">Phone</th>
                  <th v-if="isVisible('country')" class="text-left px-4 py-3 whitespace-nowrap font-medium" :style="{ width: '140px', minWidth: '140px' }">Country</th>
                  <th v-if="isVisible('source')" class="text-left px-4 py-3 whitespace-nowrap font-medium" :style="{ width: '120px', minWidth: '120px' }">Source</th>
                  <th v-if="isVisible('pageViews')" class="text-right px-4 py-3 whitespace-nowrap font-medium" :style="{ width: '110px', minWidth: '110px' }">Page views</th>
                  <th v-if="isVisible('lastVisit')" class="text-left px-4 py-3 whitespace-nowrap font-medium" :style="{ width: '120px', minWidth: '120px' }">Last visit</th>
                  <th v-if="isVisible('couponCode')" class="text-left px-4 py-3 whitespace-nowrap font-medium" :style="{ width: '140px', minWidth: '140px' }">Coupon code</th>
                  <th v-if="isVisible('region')" class="text-left px-4 py-3 whitespace-nowrap font-medium" :style="{ width: '150px', minWidth: '150px' }">Region</th>
                  <th v-if="isVisible('industry')" class="text-left px-4 py-3 whitespace-nowrap font-medium" :style="{ width: '150px', minWidth: '150px' }">Industry</th>
                  <th v-if="isVisible('birthday')" class="text-left px-4 py-3 whitespace-nowrap font-medium" :style="{ width: '140px', minWidth: '140px' }">Birthday</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr
                  v-for="lead in sortedLeads"
                  :key="lead.id"
                  class="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  @click="$emit('open-profile', lead)"
                >
                  <td class="px-5 py-3">
                    <p class="text-sm text-om-gray-600 truncate max-w-[240px]">{{ lead.email }}</p>
                  </td>
                  <td v-if="isVisible('name')" class="px-4 py-3">
                    <p class="text-sm font-medium text-om-gray-700 truncate max-w-[180px]">{{ lead.name || '' }}</p>
                  </td>
                  <td v-if="isVisible('campaign')" class="px-4 py-3">
                    <p class="text-sm text-om-gray-600 leading-snug">{{ lead.campaign }}</p>
                  </td>
                  <td v-if="isVisible('domain')" class="px-4 py-3">
                    <p class="text-xs text-om-gray-500 truncate max-w-[200px] font-mono">{{ lead.domain }}</p>
                  </td>
                  <td v-if="isVisible('status')" class="px-4 py-3">
                    <Tag :variant="lead.syncStatus === 'Completed' ? 'green' : lead.syncStatus === 'Failed' ? 'orange' : 'gray'">
                      {{ lead.syncStatus }}
                    </Tag>
                  </td>
                  <td v-if="isVisible('date')" class="px-4 py-3 whitespace-nowrap">
                    <p class="text-sm text-om-gray-600">{{ lead.dateFormatted }}</p>
                    <p class="text-xs text-om-gray-400">{{ lead.timeFormatted }}</p>
                  </td>
                  <td v-if="isVisible('phone')" class="px-4 py-3">
                    <p class="text-sm text-om-gray-600 whitespace-nowrap">{{ lead.phone || '' }}</p>
                  </td>
                  <td v-if="isVisible('country')" class="px-4 py-3">
                    <p class="text-sm text-om-gray-600 whitespace-nowrap">{{ lead.country }}</p>
                  </td>
                  <td v-if="isVisible('source')" class="px-4 py-3">
                    <p class="text-sm text-om-gray-600 whitespace-nowrap">{{ lead.source }}</p>
                  </td>
                  <td v-if="isVisible('pageViews')" class="px-4 py-3 text-right">
                    <p class="text-sm text-om-gray-600 tabular-nums">{{ lead.pageViews }}</p>
                  </td>
                  <td v-if="isVisible('lastVisit')" class="px-4 py-3">
                    <p class="text-sm text-om-gray-600 whitespace-nowrap">{{ lead.lastVisit }}</p>
                  </td>
                  <td v-if="isVisible('couponCode')" class="px-4 py-3">
                    <p class="text-sm text-om-gray-600 whitespace-nowrap font-mono">{{ lead.couponCode || '' }}</p>
                  </td>
                  <td v-if="isVisible('region')" class="px-4 py-3">
                    <p class="text-sm text-om-gray-600 whitespace-nowrap">{{ lead.region }}</p>
                  </td>
                  <td v-if="isVisible('industry')" class="px-4 py-3">
                    <p class="text-sm text-om-gray-600 whitespace-nowrap">{{ lead.industry }}</p>
                  </td>
                  <td v-if="isVisible('birthday')" class="px-4 py-3">
                    <p class="text-sm text-om-gray-600 whitespace-nowrap">{{ lead.birthday || '' }}</p>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </div>

        <!-- Segments Tab -->
        <div v-if="activeTab === 'segments'" class="flex flex-col items-center justify-center py-20">
          <div class="w-16 h-16 rounded-full bg-om-gray-100 flex items-center justify-center mb-4">
            <Users :size="28" class="text-om-gray-400" />
          </div>
          <p class="text-lg font-semibold text-om-gray-700 mb-1">Segments</p>
          <p class="text-sm text-om-gray-400">Segment management coming soon</p>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Search, ArrowUpDown, Check, Calendar, Columns3, Users } from 'lucide-vue-next'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Button from '../components/shared/Button.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import Tag from '../components/shared/Tag.vue'

defineEmits(['menu-click', 'open-profile'])

const tabs = [
  { id: 'leads', label: 'Leads' },
  { id: 'segments', label: 'Segments' },
]
const activeTab = ref('leads')

// Filters
const filterDomain = ref(null)
const filterCampaign = ref(null)
const searchQuery = ref('')
const selectedTimeFilter = ref('Last 30 days')
const timeFilterOptions = ['Yesterday', 'Last 7 days', 'Last 30 days', 'Last month', 'Last year', 'All time']

// Sort
const sortOpen = ref(false)
const sortBy = ref('newest')
const sortOptions = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name', label: 'Name A–Z' },
]

// Column visibility
const columnsOpen = ref(false)
const toggleableColumns = reactive([
  { key: 'name', label: 'Name', visible: true },
  { key: 'campaign', label: 'Campaign', visible: true },
  { key: 'domain', label: 'Domain', visible: true },
  { key: 'status', label: 'Status', visible: true },
  { key: 'date', label: 'Date', visible: true },
  { key: 'phone', label: 'Phone', visible: true },
  { key: 'country', label: 'Country', visible: false },
  { key: 'source', label: 'Source', visible: false },
  { key: 'pageViews', label: 'Page views', visible: false },
  { key: 'lastVisit', label: 'Last visit', visible: false },
  { key: 'couponCode', label: 'Coupon code', visible: true },
  { key: 'region', label: 'Region', visible: true },
  { key: 'industry', label: 'Industry', visible: true },
  { key: 'birthday', label: 'Birthday', visible: true },
])

const isVisible = (key) => toggleableColumns.find(c => c.key === key)?.visible ?? true

const columnWidths = {
  email: 280, name: 200, campaign: 220, domain: 200, status: 110,
  date: 130, phone: 150, country: 140, source: 120, pageViews: 110,
  lastVisit: 120, couponCode: 140, region: 150, industry: 150, birthday: 140,
}

const tableMinWidth = computed(() => {
  let total = columnWidths.email // email always visible
  for (const col of toggleableColumns) {
    if (col.visible) total += columnWidths[col.key] || 140
  }
  return `${total}px`
})

const domainOptions = [
  'All domains',
  'majorosmark2.myshoprent.hu',
  'delifarm.hu',
  'local.wordpress.test',
]

const campaignOptions = [
  'All campaigns',
  'Campaign #1100',
  'Campaign #1090',
  'MULTI 1',
  'Campaign #1067',
]


// Random lead generation
const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'James', 'Sophia', 'Lucas', 'Isabella', 'Mason', 'Mia', 'Ethan', 'Charlotte', 'Alexander', 'Amelia', 'Daniel', 'Harper', 'Benjamin', 'Evelyn', 'Sebastian']
const lastNames = ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Clark', 'Lewis', 'Walker']
const avatarColors = ['#E57373', '#F06292', '#BA68C8', '#9575CD', '#7986CB', '#64B5F6', '#4FC3F7', '#4DD0E1', '#4DB6AC', '#81C784', '#AED581', '#DCE775', '#FFD54F', '#FFB74D', '#FF8A65', '#A1887F', '#90A4AE', '#7E57C2', '#5C6BC0', '#26A69A']
const domainList = ['shopify-store.com', 'my-webshop.hu', 'fashion-outlet.de', 'gadgets-online.co.uk', 'eco-beauty.fr', 'sportgear.nl', 'techdeals.io', 'homestyle.at']
const campaignList = ['Summer Sale 2025 — 20% Off Everything', 'Welcome Popup for New Visitors', 'Exit Intent Offer — Last Chance', 'Newsletter Signup — Weekly Deals', 'Black Friday Mega Sale 2025', 'Cart Recovery — Complete Your Order', 'VIP Discount — Exclusive Members', 'Free Shipping Weekend Promo']

// Campaign-specific field rules
const campaignFieldRules = {
  'Free Shipping Weekend Promo': { phone: false, couponCode: false, region: false, industry: false, birthday: false },
  'Summer Sale 2025 — 20% Off Everything': { couponCode: true, phone: 0.5, region: 0.7, industry: 0.5, birthday: 0.5 },
  'VIP Discount — Exclusive Members': { couponCode: true, phone: true, region: true, industry: 0.6, birthday: 0.7 },
  'Black Friday Mega Sale 2025': { couponCode: true, phone: 0.6, region: 0.7, industry: 0.5, birthday: 0.4 },
  'Newsletter Signup — Weekly Deals': { phone: false, couponCode: false, region: 0.5, industry: 0.4, birthday: 0.3 },
  'Welcome Popup for New Visitors': { phone: false, couponCode: 0.3, region: 0.4, industry: false, birthday: false },
  'Exit Intent Offer — Last Chance': { couponCode: true, phone: 0.3, region: 0.5, industry: 0.4, birthday: 0.3 },
  'Cart Recovery — Complete Your Order': { couponCode: 0.4, phone: 0.6, region: 0.6, industry: 0.5, birthday: 0.4 },
}

function shouldHaveField(campaign, field) {
  const rules = campaignFieldRules[campaign]
  if (!rules || rules[field] === undefined) return Math.random() > 0.4
  if (rules[field] === true) return true
  if (rules[field] === false) return false
  return Math.random() < rules[field]
}
const syncStatuses = ['Completed', 'Completed', 'Completed', 'Pending', 'Failed']
const countries = ['United States', 'Germany', 'Hungary', 'United Kingdom', 'France', 'Austria', 'Netherlands', 'Spain', 'Italy', 'Poland', 'Romania', 'Sweden']
const countryFlags = { 'United States': '🇺🇸', 'Germany': '🇩🇪', 'Hungary': '🇭🇺', 'United Kingdom': '🇬🇧', 'France': '🇫🇷', 'Austria': '🇦🇹', 'Netherlands': '🇳🇱', 'Spain': '🇪🇸', 'Italy': '🇮🇹', 'Poland': '🇵🇱', 'Romania': '🇷🇴', 'Sweden': '🇸🇪' }
const cities = { 'United States': 'New York', 'Germany': 'Berlin', 'Hungary': 'Budapest', 'United Kingdom': 'London', 'France': 'Paris', 'Austria': 'Vienna', 'Netherlands': 'Amsterdam', 'Spain': 'Madrid', 'Italy': 'Milan', 'Poland': 'Warsaw', 'Romania': 'Bucharest', 'Sweden': 'Stockholm' }
const languages = { 'United States': 'en-US', 'Germany': 'de-DE', 'Hungary': 'hu-HU', 'United Kingdom': 'en-GB', 'France': 'fr-FR', 'Austria': 'de-AT', 'Netherlands': 'nl-NL', 'Spain': 'es-ES', 'Italy': 'it-IT', 'Poland': 'pl-PL', 'Romania': 'ro-RO', 'Sweden': 'sv-SE' }
const sources = ['Google', 'Direct', 'Facebook', 'Instagram', 'Email', 'TikTok', 'Referral', 'LinkedIn']
const regions = ['North America', 'Western Europe', 'Central Europe', 'Eastern Europe', 'Scandinavia', 'Southern Europe', 'Asia Pacific', 'Latin America']
const devices = ['Desktop', 'Mobile', 'Tablet']
const browsers = ['Chrome 120', 'Safari 17', 'Firefox 121', 'Edge 120', 'Chrome 119', 'Safari 16']
const osList = ['Windows 11', 'macOS Sonoma', 'iOS 17', 'Android 14', 'Windows 10', 'macOS Ventura']
const industries = ['E-commerce', 'SaaS', 'Healthcare', 'Finance', 'Education', 'Retail', 'Travel', 'Food & Beverage', 'Fashion', 'Technology']
const couponCodes = ['', '', '', 'WELCOME10', 'SUMMER25', 'VIP20', 'FLASH15', 'LOYAL30', 'FIRST10', 'SAVE20']

function generateLead(id) {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)]
  const last = lastNames[Math.floor(Math.random() * lastNames.length)]
  const hasName = Math.random() > 0.3
  const name = hasName ? `${first} ${last}` : ''
  const emailUser = hasName ? `${first.toLowerCase()}.${last.toLowerCase()}` : `user${id}`
  const emailDomain = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.io'][Math.floor(Math.random() * 4)]
  const color = avatarColors[Math.floor(Math.random() * avatarColors.length)]
  const daysAgo = Math.floor(Math.random() * 365)
  const date = new Date(Date.now() - daysAgo * 86400000 - Math.floor(Math.random() * 86400000))
  const country = countries[Math.floor(Math.random() * countries.length)]
  const campaign = campaignList[Math.floor(Math.random() * campaignList.length)]

  return {
    id,
    name,
    email: `${emailUser}@${emailDomain}`,
    initials: hasName ? `${first[0]}${last[0]}` : emailUser[0].toUpperCase(),
    avatarColor: color,
    syncStatus: syncStatuses[Math.floor(Math.random() * syncStatuses.length)],
    campaign,
    domain: domainList[Math.floor(Math.random() * domainList.length)],
    date,
    phone: shouldHaveField(campaign, 'phone') ? `+${Math.floor(10000000000 + Math.random() * 89999999999)}` : '',
    country,
    flag: countryFlags[country],
    city: cities[country],
    language: languages[country],
    source: sources[Math.floor(Math.random() * sources.length)],
    pageViews: Math.floor(Math.random() * 50) + 1,
    totalVisits: Math.floor(Math.random() * 30) + 1,
    orders: Math.floor(Math.random() * 10),
    lifetimeValue: `$${Math.floor(Math.random() * 500) + 10}`,
    lastVisit: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    couponCode: shouldHaveField(campaign, 'couponCode') ? (couponCodes[Math.floor(Math.random() * couponCodes.length)] || 'WELCOME10') : '',
    region: shouldHaveField(campaign, 'region') ? regions[Math.floor(Math.random() * regions.length)] : '',
    industry: shouldHaveField(campaign, 'industry') ? industries[Math.floor(Math.random() * industries.length)] : '',
    birthday: shouldHaveField(campaign, 'birthday') ? new Date(1975 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
    device: devices[Math.floor(Math.random() * devices.length)],
    browser: browsers[Math.floor(Math.random() * browsers.length)],
    os: osList[Math.floor(Math.random() * osList.length)],
  }
}

const leads = ref(Array.from({ length: 20 }, (_, i) => generateLead(i + 1)))

const sortedLeads = computed(() => {
  let filtered = [...leads.value]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(l => l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q))
  }
  if (sortBy.value === 'newest') filtered.sort((a, b) => b.date - a.date)
  else if (sortBy.value === 'oldest') filtered.sort((a, b) => a.date - b.date)
  else if (sortBy.value === 'name') filtered.sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email))
  return filtered.map(lead => ({
    ...lead,
    dateFormatted: lead.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    timeFormatted: lead.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
  }))
})

const handleExport = () => {
  // Export placeholder
}

// Sync top and bottom scrollbars
const topScrollRef = ref(null)
const bottomScrollRef = ref(null)
const showRightFade = ref(true)
let scrolling = false

const updateFade = (el) => {
  if (!el) return
  const maxScroll = el.scrollWidth - el.clientWidth
  showRightFade.value = maxScroll > 5 && el.scrollLeft < maxScroll - 5
}

const syncScroll = (source, event) => {
  if (scrolling) return
  scrolling = true
  const target = source === 'top' ? bottomScrollRef.value : topScrollRef.value
  if (target) target.scrollLeft = event.target.scrollLeft
  updateFade(event.target)
  requestAnimationFrame(() => { scrolling = false })
}

onMounted(() => {
  setTimeout(() => updateFade(bottomScrollRef.value), 100)
})
</script>

<style scoped>
/* Scrollbar: always reserve space, show thumb only on wrapper hover */
.table-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
.table-scrollbar::-webkit-scrollbar {
  height: 8px;
}
.table-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.table-scrollbar::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 4px;
  transition: background-color 0.2s;
}

/* Show scrollbar thumb when hovering the table wrapper */
.table-scroll-wrapper:hover .table-scrollbar {
  scrollbar-color: #D5D8DD transparent;
}
.table-scroll-wrapper:hover .table-scrollbar::-webkit-scrollbar-thumb {
  background-color: #D5D8DD;
}
.table-scroll-wrapper:hover .table-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #B0B5BD;
}
</style>
