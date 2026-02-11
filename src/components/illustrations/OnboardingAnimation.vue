<template>
  <div class="w-full h-full flex items-center justify-center relative overflow-hidden">
    <!-- Floating background shapes -->
    <div ref="bgShape1" class="absolute w-40 h-40 rounded-full bg-white/10 -top-12 -right-12 opacity-0"></div>
    <div ref="bgShape2" class="absolute w-28 h-28 rounded-full bg-white/10 -bottom-10 -left-10 opacity-0"></div>
    <div ref="bgShape3" class="absolute w-20 h-20 rounded-full bg-[#ED5A29]/20 top-1/3 left-1/4 opacity-0"></div>

    <!-- Main card -->
    <div ref="mainCard" class="relative w-72 bg-white rounded-3xl shadow-2xl p-6 opacity-0">
      <!-- Website Section (Step 1) -->
      <div ref="websiteSection" class="mb-5 opacity-0">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-[#FFEFE5] flex items-center justify-center">
            <!-- uil-globe -->
            <svg class="w-5 h-5 text-[#ED5A29]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.41,8.64s0,0,0-.05a10,10,0,0,0-18.78,0s0,0,0,.05a9.86,9.86,0,0,0,0,6.72s0,0,0,.05a10,10,0,0,0,18.78,0s0,0,0-.05a9.86,9.86,0,0,0,0-6.72ZM4.26,14a7.82,7.82,0,0,1,0-4H6.12a16.73,16.73,0,0,0,0,4Zm.82,2h1.4a12.13,12.13,0,0,0,1,2.57A8,8,0,0,1,5.08,16Zm1.4-8H5.08A8,8,0,0,1,7.45,5.43,12.13,12.13,0,0,0,6.48,8ZM11,19.7A6.34,6.34,0,0,1,8.57,16H11Zm0-5.7H8.14a14.36,14.36,0,0,1,0-4H11Zm0-6H8.57A6.34,6.34,0,0,1,11,4.3Zm7.92,0h-1.4a12.13,12.13,0,0,0-1-2.57A8,8,0,0,1,18.92,8ZM13,4.3A6.34,6.34,0,0,1,15.43,8H13Zm0,15.4V16h2.43A6.34,6.34,0,0,1,13,19.7Zm2.86-5.7H13V10h2.86a14.36,14.36,0,0,1,0,4Zm.69,4.57a12.13,12.13,0,0,0,1-2.57h1.4A8,8,0,0,1,16.55,18.57ZM19.74,14H17.88a16.73,16.73,0,0,0,0-4h1.86a7.82,7.82,0,0,1,0,4Z"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-xs text-[#8F97A4] mb-0.5">Website</p>
            <p ref="websiteUrl" class="text-sm font-medium text-[#23262A] truncate">
              {{ formData?.welcome?.websiteUrl || 'example.com' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div ref="divider" class="h-px bg-[#E3E5E8] mb-5 scale-x-0 origin-left"></div>

      <!-- Referral Source (Step 2) -->
      <div ref="referralSection" class="mb-4 opacity-0 -translate-x-4">
        <div class="flex items-center gap-3">
          <div ref="referralIcon" class="w-10 h-10 rounded-xl bg-[#F9FAFB] flex items-center justify-center transition-colors duration-300">
            <!-- uil-question-circle -->
            <svg class="w-5 h-5 text-[#8F97A4]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.29,15.29a1.58,1.58,0,0,0-.12.15.76.76,0,0,0-.09.18.64.64,0,0,0-.06.18,1.36,1.36,0,0,0,0,.2.84.84,0,0,0,.08.38.9.9,0,0,0,.54.54.94.94,0,0,0,.76,0,.9.9,0,0,0,.54-.54A1,1,0,0,0,13,16a1,1,0,0,0-.29-.71A1,1,0,0,0,11.29,15.29ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20ZM12,7A3,3,0,0,0,9.4,8.5a1,1,0,1,0,1.73,1A1,1,0,0,1,12,9a1,1,0,0,1,0,2,1,1,0,0,0-1,1v1a1,1,0,0,0,2,0v-.18A3,3,0,0,0,12,7Z"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-xs text-[#8F97A4] mb-0.5">Heard about us</p>
            <p ref="referralText" class="text-sm font-medium text-[#23262A]">
              {{ referralLabel }}
            </p>
          </div>
          <div ref="referralCheck" class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center opacity-0 scale-0">
            <!-- uil-check -->
            <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71,7.21a1,1,0,0,0-1.42,0L9.84,14.67,6.71,11.53A1,1,0,1,0,5.29,13l3.84,3.84a1,1,0,0,0,1.42,0l8.16-8.16A1,1,0,0,0,18.71,7.21Z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Business Type (Step 3) -->
      <div ref="businessSection" class="mb-4 opacity-0 -translate-x-4">
        <div class="flex items-center gap-3">
          <div ref="businessIcon" class="w-10 h-10 rounded-xl bg-[#F9FAFB] flex items-center justify-center transition-colors duration-300">
            <!-- uil-building -->
            <svg class="w-5 h-5 text-[#8F97A4]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,8h1a1,1,0,0,0,0-2H14a1,1,0,0,0,0,2Zm0,4h1a1,1,0,0,0,0-2H14a1,1,0,0,0,0,2ZM9,8h1a1,1,0,0,0,0-2H9A1,1,0,0,0,9,8Zm0,4h1a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Zm12,8H18V3a1,1,0,0,0-1-1H7A1,1,0,0,0,6,3V20H3a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Zm-5,0H13V16a1,1,0,0,0-1-1H12a1,1,0,0,0-1,1v4H8V4h8Z"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-xs text-[#8F97A4] mb-0.5">Business type</p>
            <p ref="businessText" class="text-sm font-medium text-[#23262A]">
              {{ businessLabel }}
            </p>
          </div>
          <div ref="businessCheck" class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center opacity-0 scale-0">
            <!-- uil-check -->
            <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71,7.21a1,1,0,0,0-1.42,0L9.84,14.67,6.71,11.53A1,1,0,1,0,5.29,13l3.84,3.84a1,1,0,0,0,1.42,0l8.16-8.16A1,1,0,0,0,18.71,7.21Z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Relationship (Step 4) -->
      <div ref="relationshipSection" class="mb-4 opacity-0 -translate-x-4">
        <div class="flex items-center gap-3">
          <div ref="relationshipIcon" class="w-10 h-10 rounded-xl bg-[#F9FAFB] flex items-center justify-center transition-colors duration-300">
            <!-- uil-users-alt -->
            <svg class="w-5 h-5 text-[#8F97A4]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.3,12.22A4.92,4.92,0,0,0,14,8.5a5,5,0,0,0-10,0,4.92,4.92,0,0,0,1.7,3.72A8,8,0,0,0,1,19.5a1,1,0,0,0,2,0,6,6,0,0,1,12,0,1,1,0,0,0,2,0A8,8,0,0,0,12.3,12.22ZM9,11.5a3,3,0,1,1,3-3A3,3,0,0,1,9,11.5Zm9.74.32A5,5,0,0,0,15,3.5a1,1,0,0,0,0,2,3,3,0,0,1,3,3,3,3,0,0,1-1.5,2.59,1,1,0,0,0-.5.84,1,1,0,0,0,.45.86l.39.26.13.07a7,7,0,0,1,4,6.38,1,1,0,0,0,2,0A9,9,0,0,0,18.74,11.82Z"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-xs text-[#8F97A4] mb-0.5">Relationship</p>
            <p ref="relationshipText" class="text-sm font-medium text-[#23262A]">
              {{ relationshipLabel }}
            </p>
          </div>
          <div ref="relationshipCheck" class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center opacity-0 scale-0">
            <!-- uil-check -->
            <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71,7.21a1,1,0,0,0-1.42,0L9.84,14.67,6.71,11.53A1,1,0,1,0,5.29,13l3.84,3.84a1,1,0,0,0,1.42,0l8.16-8.16A1,1,0,0,0,18.71,7.21Z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Contact Type (Step 5 - conditional) -->
      <div v-if="showContactType" ref="contactSection" class="mb-4 opacity-0 -translate-x-4">
        <div class="flex items-center gap-3">
          <div ref="contactIcon" class="w-10 h-10 rounded-xl bg-[#F9FAFB] flex items-center justify-center transition-colors duration-300">
            <!-- uil-user -->
            <svg class="w-5 h-5 text-[#8F97A4]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.71,12.71a6,6,0,1,0-7.42,0,10,10,0,0,0-6.22,8.18,1,1,0,0,0,2,.22,8,8,0,0,1,15.9,0,1,1,0,0,0,1,.89h.11a1,1,0,0,0,.88-1.1A10,10,0,0,0,15.71,12.71ZM12,12a4,4,0,1,1,4-4A4,4,0,0,1,12,12Z"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-xs text-[#8F97A4] mb-0.5">Contact info</p>
            <p ref="contactText" class="text-sm font-medium text-[#23262A]">
              {{ contactLabel }}
            </p>
          </div>
          <div ref="contactCheck" class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center opacity-0 scale-0">
            <!-- uil-check -->
            <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71,7.21a1,1,0,0,0-1.42,0L9.84,14.67,6.71,11.53A1,1,0,1,0,5.29,13l3.84,3.84a1,1,0,0,0,1.42,0l8.16-8.16A1,1,0,0,0,18.71,7.21Z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Agency Details (Step 6 - conditional) -->
      <div v-if="showAgencyDetails" ref="agencySection" class="opacity-0 -translate-x-4">
        <div class="flex items-center gap-3">
          <div ref="agencyIcon" class="w-10 h-10 rounded-xl bg-[#F9FAFB] flex items-center justify-center transition-colors duration-300">
            <!-- uil-briefcase-alt -->
            <svg class="w-5 h-5 text-[#8F97A4]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21,6H16V5a3,3,0,0,0-3-3H11A3,3,0,0,0,8,5V6H3A1,1,0,0,0,2,7V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A1,1,0,0,0,21,6ZM10,5a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1V6H10ZM20,19a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V12.39l5.69,1.9A1.17,1.17,0,0,0,10,14.3a1,1,0,0,0,.31-.05L12,13.72l1.69.53A1,1,0,0,0,14,14.3a1.17,1.17,0,0,0,.31-.01L20,12.39Zm0-8.62-6.15,2.05L12,11.88l-1.85.55L4,10.38V8H20Z"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-xs text-[#8F97A4] mb-0.5">Agency</p>
            <p ref="agencyText" class="text-sm font-medium text-[#23262A]">
              {{ agencyLabel }}
            </p>
          </div>
          <div ref="agencyCheck" class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center opacity-0 scale-0">
            <!-- uil-check -->
            <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71,7.21a1,1,0,0,0-1.42,0L9.84,14.67,6.71,11.53A1,1,0,1,0,5.29,13l3.84,3.84a1,1,0,0,0,1.42,0l8.16-8.16A1,1,0,0,0,18.71,7.21Z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating particles for animations -->
    <div ref="particle1" class="absolute w-3 h-3 rounded-full bg-[#ED5A29] opacity-0"></div>
    <div ref="particle2" class="absolute w-2 h-2 rounded-full bg-white opacity-0"></div>
    <div ref="particle3" class="absolute w-4 h-4 rounded-full bg-[#ED5A29]/30 opacity-0"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  currentStep: {
    type: Number,
    default: 1
  },
  formData: {
    type: Object,
    default: () => ({})
  }
})

// Template refs
const bgShape1 = ref(null)
const bgShape2 = ref(null)
const bgShape3 = ref(null)
const mainCard = ref(null)
const websiteSection = ref(null)
const divider = ref(null)
const referralSection = ref(null)
const referralIcon = ref(null)
const referralCheck = ref(null)
const businessSection = ref(null)
const businessIcon = ref(null)
const businessCheck = ref(null)
const relationshipSection = ref(null)
const relationshipIcon = ref(null)
const relationshipCheck = ref(null)
const contactSection = ref(null)
const contactIcon = ref(null)
const contactCheck = ref(null)
const agencySection = ref(null)
const agencyIcon = ref(null)
const agencyCheck = ref(null)
const particle1 = ref(null)
const particle2 = ref(null)
const particle3 = ref(null)

let idleTimeline = null

// Computed labels based on form data
const referralLabel = computed(() => {
  const source = props.formData?.referralSource?.referralSource
  if (!source) return 'Not selected yet'
  if (source === 'other') return props.formData?.referralSource?.otherText || 'Other'
  const labels = {
    'partner-agency': 'Partner/Agency',
    'shopify-wordpress': 'Shopify/WordPress',
    'google-search': 'Google Search',
    'instagram-facebook': 'Social Media',
    'friend-colleague': 'Friend/Colleague',
    'chatgpt': 'ChatGPT',
    'youtube': 'YouTube',
    'linkedin': 'LinkedIn',
    'already-used': 'Used before',
    'sales-inquiry': 'Sales Inquiry'
  }
  return labels[source] || source
})

const businessLabel = computed(() => {
  const type = props.formData?.businessType?.businessType
  if (!type) return 'Not selected yet'
  if (type === 'other') return props.formData?.businessType?.otherText || 'Other'
  const labels = {
    'ecommerce': 'eCommerce',
    'saas': 'SaaS/Software',
    'service': 'Service',
    'media': 'Media'
  }
  return labels[type] || type
})

const relationshipLabel = computed(() => {
  const rel = props.formData?.relationship?.relationship
  if (!rel) return 'Not selected yet'
  const labels = {
    'my-business': 'My business',
    'company-employee': 'Company employee',
    'client': 'Client project'
  }
  return labels[rel] || rel
})

const contactLabel = computed(() => {
  const contact = props.formData?.contactType?.contactType
  if (!contact) return 'Not selected yet'
  const labels = {
    'client-contact': "Client's contact",
    'own-contact': 'Own contact'
  }
  return labels[contact] || contact
})

const agencyLabel = computed(() => {
  const agency = props.formData?.agencyDetails
  if (!agency) return 'Not provided yet'
  if (agency.skipped) return 'Skipped'
  return agency.agencyName || 'Pending...'
})

const showContactType = computed(() => {
  return props.formData?.relationship?.relationship === 'client'
})

const showAgencyDetails = computed(() => {
  return showContactType.value && props.formData?.contactType?.contactType === 'client-contact'
})

// Entrance animation
const playEntrance = () => {
  const tl = gsap.timeline()

  gsap.set(mainCard.value, { y: 30 })

  tl.to([bgShape1.value, bgShape2.value, bgShape3.value], {
    opacity: 1,
    scale: 1,
    duration: 0.8,
    stagger: 0.1,
    ease: 'back.out(1.5)'
  })
  .to(mainCard.value, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power3.out'
  }, '-=0.4')
  .to(websiteSection.value, {
    opacity: 1,
    duration: 0.4,
    ease: 'power2.out'
  }, '-=0.2')
  .to(divider.value, {
    scaleX: 1,
    duration: 0.4,
    ease: 'power2.out'
  }, '-=0.2')
}

// Animate section appearance
const animateSection = (sectionRef, iconRef, checkRef, color = '#FFEFE5') => {
  if (!sectionRef?.value) return

  const tl = gsap.timeline()

  tl.to(sectionRef.value, {
    opacity: 1,
    x: 0,
    duration: 0.5,
    ease: 'back.out(1.5)'
  })

  if (iconRef?.value) {
    tl.to(iconRef.value, {
      backgroundColor: color,
      duration: 0.3
    }, '-=0.3')
  }

  // Particle burst
  emitParticles()
}

// Animate check mark
const animateCheck = (checkRef) => {
  if (!checkRef?.value) return

  gsap.to(checkRef.value, {
    opacity: 1,
    scale: 1,
    duration: 0.4,
    ease: 'back.out(2)'
  })
}

// Emit particles effect
const emitParticles = () => {
  const particles = [particle1.value, particle2.value, particle3.value]

  particles.forEach((p, i) => {
    if (!p) return

    gsap.set(p, {
      x: 0,
      y: 0,
      opacity: 0,
      scale: 1
    })

    gsap.to(p, {
      opacity: 0.8,
      x: gsap.utils.random(-60, 60),
      y: gsap.utils.random(-80, -30),
      scale: gsap.utils.random(0.5, 1.5),
      duration: 0.6,
      delay: i * 0.1,
      ease: 'power2.out'
    })

    gsap.to(p, {
      opacity: 0,
      y: '-=30',
      duration: 0.4,
      delay: 0.5 + i * 0.1
    })
  })
}

// Idle breathing animation
const startIdleAnimation = () => {
  idleTimeline = gsap.timeline({ repeat: -1, yoyo: true })

  idleTimeline
    .to(bgShape1.value, { scale: 1.1, duration: 3, ease: 'sine.inOut' }, 0)
    .to(bgShape2.value, { scale: 1.15, duration: 3.5, ease: 'sine.inOut' }, 0)
    .to(bgShape3.value, { x: 15, y: -10, duration: 4, ease: 'sine.inOut' }, 0)
    .to(mainCard.value, { y: -3, duration: 2.5, ease: 'sine.inOut' }, 0)
}

// Watch step changes
watch(() => props.currentStep, (newStep) => {
  nextTick(() => {
    if (newStep >= 2) {
      animateSection(referralSection, referralIcon, null, '#FFEFE5')
    }
    if (newStep >= 3) {
      animateSection(businessSection, businessIcon, null, '#E0F2FE')
    }
    if (newStep >= 4) {
      animateSection(relationshipSection, relationshipIcon, null, '#F3E8FF')
    }
    if (newStep >= 5 && showContactType.value) {
      animateSection(contactSection, contactIcon, null, '#ECFDF5')
    }
    if (newStep >= 6 && showAgencyDetails.value) {
      animateSection(agencySection, agencyIcon, null, '#FEF3C7')
    }
  })
})

// Watch for form data changes to show checkmarks
watch(() => props.formData?.referralSource?.referralSource, (val) => {
  if (val) {
    nextTick(() => animateCheck(referralCheck))
  }
})

watch(() => props.formData?.businessType?.businessType, (val) => {
  if (val) {
    nextTick(() => animateCheck(businessCheck))
  }
})

watch(() => props.formData?.relationship?.relationship, (val) => {
  if (val) {
    nextTick(() => animateCheck(relationshipCheck))
  }
})

watch(() => props.formData?.contactType?.contactType, (val) => {
  if (val) {
    nextTick(() => animateCheck(contactCheck))
  }
})

watch(() => props.formData?.agencyDetails, (val) => {
  if (val && (val.agencyName || val.skipped)) {
    nextTick(() => animateCheck(agencyCheck))
  }
}, { deep: true })

onMounted(() => {
  gsap.set([bgShape1.value, bgShape2.value, bgShape3.value], { scale: 0.5 })

  setTimeout(() => {
    playEntrance()
    setTimeout(() => {
      startIdleAnimation()
    }, 1200)
  }, 300)
})

onUnmounted(() => {
  if (idleTimeline) idleTimeline.kill()
})
</script>
