<template>
  <div class="w-full h-full flex items-center justify-center">
    <div class="relative w-72 h-80">
      <!-- Main profile card with line-art style -->
      <svg viewBox="0 0 280 320" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Background decorative circles -->
        <circle cx="240" cy="40" r="30" class="fill-[#ED5A29]/5 transition-all duration-700"
                :class="{ 'fill-[#ED5A29]/10': isAnimating }" />
        <circle cx="40" cy="280" r="25" class="fill-[#ED5A29]/5 transition-all duration-700"
                :style="{ transform: `scale(${referralSource ? 1.2 : 1})` }" />
        <circle cx="260" cy="200" r="15" class="fill-[#ED5A29]/8" />

        <!-- Dotted decorative lines -->
        <path d="M20 100 Q60 80 100 100" stroke="#ED5A29" stroke-width="1" stroke-dasharray="4 4" opacity="0.3" />
        <path d="M180 280 Q220 260 260 280" stroke="#ED5A29" stroke-width="1" stroke-dasharray="4 4" opacity="0.3" />

        <!-- Main profile card outline -->
        <rect x="40" y="30" width="200" height="260" rx="20"
              class="fill-white stroke-[#23262A]/10 transition-all duration-500"
              stroke-width="1.5"
              :class="{ 'stroke-[#ED5A29]/30': isAnimating }" />

        <!-- Profile avatar circle -->
        <circle cx="140" cy="90" r="35" class="fill-[#ED5A29]/10 stroke-[#ED5A29] transition-all duration-500"
                stroke-width="2"
                :class="{ 'fill-[#ED5A29]/20': currentStep >= 2 }" />

        <!-- Avatar icon (person silhouette) -->
        <g class="transition-all duration-500" :style="{ transform: `translateY(${isAnimating ? -2 : 0}px)` }">
          <circle cx="140" cy="82" r="12" class="fill-[#ED5A29]/60" />
          <path d="M118 110 Q140 95 162 110" class="fill-[#ED5A29]/60" />
        </g>

        <!-- Website name text placeholder -->
        <rect x="90" y="135" width="100" height="10" rx="5"
              class="transition-all duration-500"
              :class="websiteName ? 'fill-[#23262A]' : 'fill-[#E3E5E8]'" />

        <!-- Website URL placeholder -->
        <rect x="70" y="152" width="140" height="6" rx="3"
              class="transition-all duration-500"
              :class="websiteUrl ? 'fill-[#ED5A29]/40' : 'fill-[#F1F2F4]'" />

        <!-- Divider line -->
        <line x1="60" y1="175" x2="220" y2="175" stroke="#E5E7EB" stroke-width="1" />

        <!-- Business type section -->
        <g class="transition-all duration-700" :style="{ opacity: businessType ? 1 : 0.4 }">
          <!-- Business icon based on type -->
          <g v-if="businessType === 'ecommerce'" class="transition-all duration-300">
            <rect x="65" y="190" width="30" height="30" rx="6" class="fill-[#ED5A29]/10 stroke-[#ED5A29]/50" stroke-width="1" />
            <path d="M73 200 L87 200 M80 193 L80 207" class="stroke-[#ED5A29]" stroke-width="2" stroke-linecap="round" />
          </g>
          <g v-else-if="businessType === 'saas'" class="transition-all duration-300">
            <rect x="65" y="190" width="30" height="30" rx="6" class="fill-blue-50 stroke-blue-400/50" stroke-width="1" />
            <path d="M73 205 L80 198 L87 205" class="stroke-blue-500" stroke-width="2" stroke-linecap="round" fill="none" />
            <circle cx="80" cy="200" r="2" class="fill-blue-500" />
          </g>
          <g v-else-if="businessType === 'service'" class="transition-all duration-300">
            <rect x="65" y="190" width="30" height="30" rx="6" class="fill-green-50 stroke-green-400/50" stroke-width="1" />
            <path d="M73 205 L80 212 L90 195" class="stroke-green-500" stroke-width="2" stroke-linecap="round" fill="none" />
          </g>
          <g v-else-if="businessType === 'media'" class="transition-all duration-300">
            <rect x="65" y="190" width="30" height="30" rx="6" class="fill-purple-50 stroke-purple-400/50" stroke-width="1" />
            <circle cx="80" cy="205" r="8" class="stroke-purple-500" stroke-width="2" fill="none" />
            <path d="M77 205 L84 201 L84 209 Z" class="fill-purple-500" />
          </g>
          <g v-else class="transition-all duration-300">
            <rect x="65" y="190" width="30" height="30" rx="6" class="fill-[#F9FAFB] stroke-[#D5D8DD]" stroke-width="1" />
            <rect x="73" y="198" width="14" height="3" rx="1.5" class="fill-[#D5D8DD]" />
            <rect x="73" y="205" width="10" height="3" rx="1.5" class="fill-[#D5D8DD]" />
          </g>

          <!-- Business type label lines -->
          <rect x="105" y="195" width="80" height="6" rx="3"
                :class="businessType ? 'fill-[#23262A]/70' : 'fill-[#E3E5E8]'" />
          <rect x="105" y="208" width="60" height="4" rx="2" class="fill-[#F1F2F4]" />
        </g>

        <!-- Referral source section -->
        <g class="transition-all duration-700" :style="{ opacity: referralSource ? 1 : 0.4 }">
          <!-- Referral icon based on source -->
          <g :class="referralIconClass">
            <rect x="65" y="235" width="30" height="30" rx="6"
                  :class="referralBgClass" stroke-width="1" />

            <!-- Google icon -->
            <g v-if="referralSource === 'google'">
              <circle cx="80" cy="250" r="8" class="stroke-[#4285F4]" stroke-width="2" fill="none" />
              <path d="M86 256 L90 260" class="stroke-[#4285F4]" stroke-width="2" stroke-linecap="round" />
            </g>

            <!-- Social media icon -->
            <g v-else-if="referralSource === 'social-media'">
              <circle cx="76" cy="247" r="4" class="fill-[#1DA1F2]" />
              <circle cx="84" cy="247" r="4" class="fill-[#E4405F]" />
              <circle cx="80" cy="254" r="4" class="fill-[#0A66C2]" />
            </g>

            <!-- Friend/Colleague icon -->
            <g v-else-if="referralSource === 'friend-colleague'">
              <circle cx="76" cy="248" r="5" class="fill-[#ED5A29]/60" />
              <circle cx="84" cy="248" r="5" class="fill-[#ED5A29]/40" />
              <path d="M70 260 Q80 252 90 260" class="fill-[#ED5A29]/50" />
            </g>

            <!-- Blog/Article icon -->
            <g v-else-if="referralSource === 'blog-article'">
              <rect x="73" y="244" width="14" height="12" rx="2" class="stroke-[#ED5A29]" stroke-width="1.5" fill="none" />
              <line x1="76" y1="248" x2="84" y2="248" class="stroke-[#ED5A29]" stroke-width="1" />
              <line x1="76" y1="252" x2="82" y2="252" class="stroke-[#ED5A29]" stroke-width="1" />
            </g>

            <!-- YouTube icon -->
            <g v-else-if="referralSource === 'youtube'">
              <rect x="72" y="244" width="16" height="12" rx="3" class="fill-[#FF0000]" />
              <path d="M78 250 L83 253 L78 256 Z" class="fill-white" />
            </g>

            <!-- Other/Default icon -->
            <g v-else>
              <circle cx="80" cy="250" r="8" class="stroke-[#D5D8DD]" stroke-width="1.5" fill="none" />
              <circle cx="80" cy="250" r="2" class="fill-[#D5D8DD]" />
            </g>
          </g>

          <!-- Referral label lines -->
          <rect x="105" y="240" width="70" height="6" rx="3"
                :class="referralSource ? 'fill-[#23262A]/70' : 'fill-[#E3E5E8]'" />
          <rect x="105" y="253" width="50" height="4" rx="2" class="fill-[#F1F2F4]" />
        </g>

        <!-- Relationship indicator badge -->
        <transition name="badge">
          <g v-if="relationship" class="transition-all duration-500">
            <rect x="180" y="55" width="50" height="20" rx="10"
                  :class="relationshipBadgeClass" />
            <g v-if="relationship === 'my-business'">
              <circle cx="192" cy="65" r="4" class="fill-white/80" />
              <rect x="200" y="62" width="22" height="3" rx="1.5" class="fill-white/60" />
            </g>
            <g v-else-if="relationship === 'company-employee'">
              <rect x="188" y="60" width="8" height="10" rx="1" class="fill-white/80" />
              <rect x="200" y="62" width="22" height="3" rx="1.5" class="fill-white/60" />
            </g>
            <g v-else-if="relationship === 'client'">
              <path d="M188 65 L192 60 L196 65 L192 70 Z" class="fill-white/80" />
              <rect x="200" y="62" width="22" height="3" rx="1.5" class="fill-white/60" />
            </g>
          </g>
        </transition>
      </svg>

      <!-- Floating animated elements -->
      <transition name="float-right">
        <div v-if="currentStep >= 2"
             class="absolute -right-4 top-1/4 bg-white rounded-xl shadow-lg p-2 border border-[#F1F2F4]">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
              <!-- uil-check -->
              <svg class="w-3 h-3 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71,7.21a1,1,0,0,0-1.42,0L9.84,14.67,6.71,11.53A1,1,0,1,0,5.29,13l3.84,3.84a1,1,0,0,0,1.42,0l8.16-8.16A1,1,0,0,0,18.71,7.21Z"/>
              </svg>
            </div>
            <span class="text-xs text-[#8F97A4] font-medium">Profile</span>
          </div>
        </div>
      </transition>

      <transition name="float-left">
        <div v-if="businessType"
             class="absolute -left-2 top-1/2 bg-white rounded-xl shadow-lg p-2 border border-[#F1F2F4]">
          <div class="flex items-center gap-1.5">
            <div class="w-5 h-5 rounded-full bg-[#ED5A29]/10 flex items-center justify-center">
              <svg class="w-2.5 h-2.5 text-[#ED5A29]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
              </svg>
            </div>
            <span class="text-[10px] text-[#8F97A4]">{{ businessTypeLabel }}</span>
          </div>
        </div>
      </transition>

      <!-- Connection lines animation -->
      <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 280 320">
        <transition name="line">
          <path v-if="currentStep >= 3"
                d="M0 160 Q20 160 40 180"
                stroke="#ED5A29"
                stroke-width="1.5"
                stroke-dasharray="4 4"
                fill="none"
                class="animate-dash" />
        </transition>
        <transition name="line">
          <path v-if="referralSource"
                d="M280 250 Q260 250 240 235"
                stroke="#ED5A29"
                stroke-width="1.5"
                stroke-dasharray="4 4"
                fill="none"
                class="animate-dash" />
        </transition>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  formData: {
    type: Object,
    default: () => ({})
  },
  currentStep: {
    type: Number,
    default: 1
  }
})

const isAnimating = ref(false)
let animationInterval = null

// Extract data from form
const websiteUrl = computed(() => props.formData?.welcome?.websiteUrl || '')
const websiteName = computed(() => props.formData?.welcome?.websiteName || '')
const businessType = computed(() => props.formData?.businessType?.businessType || '')
const referralSource = computed(() => props.formData?.referralSource?.referralSource || '')
const relationship = computed(() => props.formData?.relationship?.relationship || '')

// Business type label
const businessTypeLabel = computed(() => {
  const labels = {
    'ecommerce': 'eCommerce',
    'saas': 'SaaS',
    'service': 'Service',
    'media': 'Media',
    'other': 'Other'
  }
  return labels[businessType.value] || ''
})

// Referral icon styling
const referralIconClass = computed(() => {
  return 'transition-all duration-300'
})

const referralBgClass = computed(() => {
  const classes = {
    'google': 'fill-blue-50 stroke-[#4285F4]/30',
    'social-media': 'fill-pink-50 stroke-pink-300/30',
    'friend-colleague': 'fill-[#ED5A29]/10 stroke-[#ED5A29]/30',
    'blog-article': 'fill-[#ED5A29]/5 stroke-[#ED5A29]/30',
    'youtube': 'fill-red-50 stroke-red-300/30',
  }
  return classes[referralSource.value] || 'fill-[#F9FAFB] stroke-[#E3E5E8]'
})

// Relationship badge styling
const relationshipBadgeClass = computed(() => {
  const classes = {
    'my-business': 'fill-[#ED5A29]',
    'company-employee': 'fill-blue-500',
    'client': 'fill-purple-500'
  }
  return classes[relationship.value] || 'fill-[#8F97A4]'
})

// Trigger animations when data changes
watch(() => props.formData, () => {
  triggerAnimation()
}, { deep: true })

watch(() => props.currentStep, () => {
  triggerAnimation()
})

const triggerAnimation = () => {
  isAnimating.value = true
  setTimeout(() => {
    isAnimating.value = false
  }, 600)
}

onMounted(() => {
  // Periodic subtle animation
  animationInterval = setInterval(() => {
    triggerAnimation()
  }, 5000)
})

onUnmounted(() => {
  if (animationInterval) {
    clearInterval(animationInterval)
  }
})
</script>

<style scoped>
.float-right-enter-active,
.float-right-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.float-right-enter-from,
.float-right-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.float-left-enter-active,
.float-left-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.float-left-enter-from,
.float-left-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.badge-enter-active,
.badge-leave-active {
  transition: all 0.4s ease;
}

.badge-enter-from,
.badge-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.line-enter-active,
.line-leave-active {
  transition: all 0.6s ease;
}

.line-enter-from,
.line-leave-to {
  opacity: 0;
  stroke-dashoffset: 20;
}

@keyframes dash {
  to {
    stroke-dashoffset: -20;
  }
}

.animate-dash {
  animation: dash 2s linear infinite;
}
</style>
