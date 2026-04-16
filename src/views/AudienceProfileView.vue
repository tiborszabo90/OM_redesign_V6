<template>
  <DashboardLayout active-menu-item="audience" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Back button -->
        <button @click="$emit('back')" class="flex items-center gap-1.5 text-sm text-om-gray-500 hover:text-om-gray-700 transition-colors mb-5 cursor-pointer">
          <ChevronLeft :size="16" />
          Back to Audience
        </button>

        <!-- Two-column layout: Profile left, Activity right -->
        <div class="flex gap-5 items-start">
          <!-- Left column: Profile (1/3) -->
          <div class="w-1/4 shrink-0 space-y-5">

            <!-- Identity card -->
            <div class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] border border-gray-100 p-6">
              <div class="text-center mb-5">
                <h1 class="text-lg font-semibold text-om-gray-700">{{ lead.email || `${lead.city}, ${lead.country}` }}</h1>
                <p v-if="lead.name" class="text-base font-medium text-om-gray-600 mt-1">{{ lead.name }}</p>
                <p v-if="!lead.email" class="text-xs text-om-gray-400 mt-1">Anonymous visitor · No email captured</p>
                <div class="flex items-center justify-center gap-1.5 mt-2 text-sm text-om-gray-500">
                  <Calendar :size="14" class="text-om-gray-400" />
                  {{ lead.email ? 'Captured' : 'Visiting since' }} {{ lead.dateFormatted }}
                </div>
                <p v-if="lead.campaign" class="text-sm mt-1">via <button @click="$emit('navigate-to-campaign')" class="text-om-orange-500 font-medium hover:underline cursor-pointer">{{ lead.campaign }}</button></p>
              </div>

              <!-- Stats grid -->
              <div class="grid grid-cols-2 gap-3 mb-0">
                <div class="bg-gray-50 rounded-lg py-3 px-4 text-center">
                  <p class="text-lg font-bold text-om-gray-700 tabular-nums">{{ lead.totalVisits }}</p>
                  <p class="text-xs text-om-gray-400">Total Visits</p>
                </div>
                <div class="bg-gray-50 rounded-lg py-3 px-4 text-center">
                  <p class="text-lg font-bold text-om-gray-700 tabular-nums">{{ lead.pageViews }}</p>
                  <p class="text-xs text-om-gray-400">Pages Viewed</p>
                </div>
                <div class="bg-gray-50 rounded-lg py-3 px-4 text-center">
                  <p class="text-lg font-bold text-om-gray-700 tabular-nums">{{ lead.orders }}</p>
                  <p class="text-xs text-om-gray-400">Orders</p>
                </div>
                <div class="bg-gray-50 rounded-lg py-3 px-4 text-center">
                  <p class="text-lg font-bold text-om-gray-700 tabular-nums">{{ lead.lifetimeValue }}</p>
                  <p class="text-xs text-om-gray-400">Lifetime Value</p>
                </div>
              </div>
            </div>

            <!-- Technical Details -->
            <div class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] border border-gray-100 p-5">
              <h2 class="text-sm font-semibold text-om-gray-700 mb-4">Technical Details</h2>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <Monitor :size="16" class="text-om-gray-400 shrink-0" />
                  <span class="text-sm text-om-gray-400 w-28">Device</span>
                  <span class="text-sm font-medium text-om-gray-700">{{ lead.device }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <Globe :size="16" class="text-om-gray-400 shrink-0" />
                  <span class="text-sm text-om-gray-400 w-28">Browser</span>
                  <span class="text-sm font-medium text-om-gray-700">{{ lead.browser }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <Laptop :size="16" class="text-om-gray-400 shrink-0" />
                  <span class="text-sm text-om-gray-400 w-28">OS</span>
                  <span class="text-sm font-medium text-om-gray-700">{{ lead.os }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <MapPin :size="16" class="text-om-gray-400 shrink-0" />
                  <span class="text-sm text-om-gray-400 w-28">Country</span>
                  <span class="text-sm font-medium text-om-gray-700">{{ lead.flag }} {{ lead.country }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <MapPin :size="16" class="text-om-gray-400 shrink-0" />
                  <span class="text-sm text-om-gray-400 w-28">City</span>
                  <span class="text-sm font-medium text-om-gray-700">{{ lead.city }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <Languages :size="16" class="text-om-gray-400 shrink-0" />
                  <span class="text-sm text-om-gray-400 w-28">Language</span>
                  <span class="text-sm font-medium text-om-gray-700">{{ lead.language }}</span>
                </div>
              </div>
            </div>

          </div>

          <!-- Right column: Activity timeline (2/3) -->
          <div class="flex-1 min-w-0">
            <div class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] border border-gray-100 p-6 sticky top-8">
              <h2 class="text-base font-semibold text-om-gray-700 mb-5">Activity Timeline</h2>

              <div class="relative">
                <!-- Vertical line connecting all icons -->
                <div class="absolute left-[15px] top-4 bottom-4 w-px bg-gray-200"></div>

                <template v-for="(group, gi) in activityTimeline" :key="gi">
                  <!-- Date header -->
                  <div class="flex items-center gap-3 mb-3 relative">
                    <div class="w-8 h-8 rounded-full bg-om-gray-100 flex items-center justify-center shrink-0 z-10">
                      <CalendarDays :size="14" class="text-om-gray-500" />
                    </div>
                    <span class="text-sm font-semibold text-om-gray-700">{{ group.date }}</span>
                  </div>

                  <!-- Events -->
                  <div
                    v-for="(event, ei) in group.events"
                    :key="`${gi}-${ei}`"
                    class="flex items-start gap-3 relative"
                    :class="gi < activityTimeline.length - 1 || ei < group.events.length - 1 ? 'mb-3' : ''"
                  >
                    <!-- Icon -->
                    <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10" :class="event.iconBg">
                      <component :is="event.icon" :size="14" :class="event.iconColor" />
                    </div>

                    <!-- Content card -->
                    <div class="flex-1 min-w-0 bg-gray-50 rounded-lg px-4 py-3">
                      <div class="flex items-center justify-between mb-1">
                        <span class="text-sm font-semibold" :class="event.titleColor">{{ event.title }}</span>
                        <span class="text-xs text-om-gray-400 flex items-center gap-1 shrink-0 ml-3">
                          <Clock :size="12" />
                          {{ event.time }}
                        </span>
                      </div>
                      <div class="flex flex-wrap gap-x-4 gap-y-0.5">
                        <span v-for="(detail, di) in event.details" :key="di" class="text-xs text-om-gray-500">
                          <span class="text-om-gray-400">{{ detail.label }}:</span>
                          <span class="font-medium text-om-gray-700 ml-1">{{ detail.value }}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </template>
              </div>

            </div>
          </div>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { computed, markRaw } from 'vue'
import { ChevronLeft, Calendar, CalendarDays, Clock, Monitor, Globe, Laptop, MapPin, Languages, Eye, Send, ShoppingCart, Mail as MailIcon } from 'lucide-vue-next'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Tag from '../components/shared/Tag.vue'

const props = defineProps({
  lead: {
    type: Object,
    required: true,
  }
})

defineEmits(['menu-click', 'back', 'navigate-to-campaign'])

const activityTimeline = computed(() => {
  const lead = props.lead
  const pages = ['/products/wireless-headphones', '/categories/electronics', '/products/yoga-mat', '/cart', '/checkout']
  const products = [
    { name: 'Wireless Headphones Pro', price: '$89.00' },
    { name: 'Yoga Mat Premium', price: '$34.00' },
    { name: 'Running Shoes X1', price: '$129.00' },
  ]

  const day1Events = [
    {
      title: 'First Visit',
      titleColor: 'text-red-500',
      icon: markRaw(Globe),
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
      time: '09:14 AM',
      details: [
        { label: 'Landing Page', value: `/shop_search.php?q=${lead.industry?.toLowerCase() || 'products'}` },
        { label: 'UTM Source', value: lead.source.toLowerCase() },
        { label: 'Traffic Source', value: lead.source },
      ],
    },
    {
      title: 'Page View',
      titleColor: 'text-blue-600',
      icon: markRaw(Eye),
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      time: '09:15 AM',
      details: [
        { label: 'URL', value: pages[0] },
        { label: 'Time Spent', value: '2m 34s' },
      ],
    },
    {
      title: 'Page View',
      titleColor: 'text-blue-600',
      icon: markRaw(Eye),
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      time: '09:18 AM',
      details: [
        { label: 'URL', value: pages[1] },
        { label: 'Time Spent', value: '1m 12s' },
      ],
    },
    {
      title: 'Campaign Impression',
      titleColor: 'text-amber-600',
      icon: markRaw(Send),
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      time: '09:20 AM',
      details: [
        { label: 'Campaign', value: lead.campaign },
        { label: 'Variant', value: 'B (Gamification)' },
        { label: 'Step', value: 'Step 1 — Spin the Wheel' },
      ],
    },
    {
      title: 'Form Submit',
      titleColor: 'text-emerald-600',
      icon: markRaw(MailIcon),
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
      time: '09:21 AM',
      details: [
        { label: 'Campaign', value: lead.campaign },
        { label: 'Data Captured', value: 'Email' },
        ...(lead.couponCode ? [{ label: 'Coupon Received', value: lead.couponCode }] : []),
      ],
    },
  ]

  const day2Events = [
    {
      title: 'Return Visit',
      titleColor: 'text-blue-600',
      icon: markRaw(Eye),
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      time: '02:41 PM',
      details: [
        { label: 'URL', value: '/ (homepage)' },
        { label: 'Traffic Source', value: 'Direct' },
        { label: 'Time Spent', value: '0m 48s' },
      ],
    },
    {
      title: 'Page View',
      titleColor: 'text-blue-600',
      icon: markRaw(Eye),
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      time: '02:43 PM',
      details: [
        { label: 'URL', value: pages[2] },
        { label: 'Time Spent', value: '3m 05s' },
      ],
    },
    {
      title: 'Add to Cart',
      titleColor: 'text-amber-600',
      icon: markRaw(ShoppingCart),
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      time: '02:46 PM',
      details: [
        { label: 'Product', value: products[0].name },
        { label: 'Price', value: products[0].price },
        { label: 'Quantity', value: '1' },
      ],
    },
    {
      title: 'Page View',
      titleColor: 'text-blue-600',
      icon: markRaw(Eye),
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      time: '02:47 PM',
      details: [
        { label: 'URL', value: pages[3] },
        { label: 'Time Spent', value: '1m 22s' },
      ],
    },
    {
      title: 'Add to Cart',
      titleColor: 'text-amber-600',
      icon: markRaw(ShoppingCart),
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      time: '02:49 PM',
      details: [
        { label: 'Product', value: products[1].name },
        { label: 'Price', value: products[1].price },
        { label: 'Quantity', value: '1' },
      ],
    },
  ]

  // Use actual lead dates for the day headers
  const capturedDate = new Date(lead.date)
  const returnDate = new Date(capturedDate.getTime() + 2 * 86400000)

  return [
    {
      date: returnDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      events: day2Events.reverse(),
    },
    {
      date: capturedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      events: day1Events.reverse(),
    },
  ]
})
</script>
