<template>
  <DashboardLayout active-menu-item="campaigns" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="flex flex-col items-center justify-center h-full -translate-y-[5%]">
        <!-- SVG illustration with animations -->
        <div class="mb-10 relative w-60 h-50 flex items-center justify-center">
          <transition name="fade-step" mode="out-in">

            <!-- Step 0: Page scanning with Lottie scanner overlay -->
            <div v-if="currentStep === 0" key="s0" class="relative">
              <svg width="236" height="151" viewBox="0 0 236 151" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-60 relative z-0">
                <defs>
                  <linearGradient id="skeletonShimmerScan" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="80" y2="0">
                    <stop offset="0%" stop-color="#E3E5E8"/>
                    <stop offset="50%" stop-color="#F5F6F8"/>
                    <stop offset="100%" stop-color="#E3E5E8"/>
                    <animate attributeName="x1" values="-80;236" dur="1.8s" repeatCount="indefinite"/>
                    <animate attributeName="x2" values="0;316" dur="1.8s" repeatCount="indefinite"/>
                  </linearGradient>
                </defs>
                <rect x="1" y="1" width="234" height="149" rx="7" stroke="#F1F2F4" stroke-width="2"/>
                <rect x="12" y="12" width="62" height="62" rx="4" fill="url(#skeletonShimmerScan)"/>
                <rect x="12" y="80" width="18" height="18" rx="4" fill="url(#skeletonShimmerScan)"/>
                <rect x="34" y="80" width="18" height="18" rx="4" fill="url(#skeletonShimmerScan)"/>
                <rect x="56" y="80" width="18" height="18" rx="4" fill="url(#skeletonShimmerScan)"/>
                <rect x="83" y="12" width="99" height="12" rx="4" fill="url(#skeletonShimmerScan)"/>
                <rect x="83" y="62" width="42" height="12" rx="4" fill="url(#skeletonShimmerScan)"/>
                <rect x="83" y="31" width="56" height="6" rx="3" fill="url(#skeletonShimmerScan)"/>
                <rect x="83" y="40" width="76" height="6" rx="3" fill="url(#skeletonShimmerScan)"/>
                <rect x="12" y="105" width="185" height="6" rx="3" fill="url(#skeletonShimmerScan)"/>
                <rect x="12" y="114" width="212" height="6" rx="3" fill="url(#skeletonShimmerScan)"/>
                <rect x="12" y="124" width="157" height="6" rx="3" fill="url(#skeletonShimmerScan)"/>
                <rect x="12" y="133" width="212" height="6" rx="3" fill="url(#skeletonShimmerScan)"/>
              </svg>
              <DotLottieVue
                src="https://lottie.host/3ac1aa01-5f66-42cb-a30f-cd070359a648/UwHQ4qaeYo.lottie"
                autoplay
                loop
                class="absolute z-10 scanner-lottie"
              />
            </div>

            <!-- Step 1: Generating content block — elements appear sequentially -->
            <div v-else-if="currentStep === 1" key="s1" class="flex items-center justify-center">
              <svg width="212" height="62" viewBox="0 0 212 62" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-54">
                <rect width="212" height="62" rx="4" fill="#FBD9CE" class="build-in" style="animation-delay: 0s" />
                <path d="M142.5 17H121.5C120.307 17 119.162 17.4741 118.318 18.318C117.474 19.1619 117 20.3065 117 21.5V42.5C117 43.6935 117.474 44.8381 118.318 45.682C119.162 46.5259 120.307 47 121.5 47H142.5C142.747 46.9966 142.993 46.9715 143.235 46.925L143.685 46.82H143.79H143.865L144.42 46.61L144.615 46.505C144.765 46.415 144.93 46.34 145.08 46.235C145.28 46.0876 145.471 45.9273 145.65 45.755L145.755 45.62C145.902 45.4708 146.038 45.3103 146.16 45.14L146.295 44.945C146.4 44.778 146.49 44.6024 146.565 44.42C146.606 44.348 146.641 44.2728 146.67 44.195C146.745 44.015 146.79 43.82 146.85 43.625V43.4C146.935 43.1069 146.985 42.8048 147 42.5V21.5C147 20.3065 146.526 19.1619 145.682 18.318C144.838 17.4741 143.693 17 142.5 17ZM121.5 44C121.102 44 120.721 43.842 120.439 43.5607C120.158 43.2794 120 42.8978 120 42.5V36.035L124.935 31.085C125.074 30.9444 125.24 30.8328 125.423 30.7567C125.606 30.6805 125.802 30.6413 126 30.6413C126.198 30.6413 126.394 30.6805 126.577 30.7567C126.76 30.8328 126.926 30.9444 127.065 31.085L139.965 44H121.5ZM144 42.5C143.999 42.6849 143.963 42.868 143.895 43.04C143.861 43.1131 143.821 43.1833 143.775 43.25C143.735 43.3135 143.69 43.3737 143.64 43.43L135.615 35.405L136.935 34.085C137.074 33.9444 137.24 33.8328 137.423 33.7567C137.606 33.6805 137.802 33.6413 138 33.6413C138.198 33.6413 138.394 33.6805 138.577 33.7567C138.76 33.8328 138.926 33.9444 139.065 34.085V34.085L144 39.035V42.5ZM144 34.79L141.18 32C140.322 31.1855 139.183 30.7314 138 30.7314C136.817 30.7314 135.678 31.1855 134.82 32L133.5 33.32L129.18 29C128.322 28.1855 127.183 27.7314 126 27.7314C124.817 27.7314 123.678 28.1855 122.82 29L120 31.79V21.5C120 21.1022 120.158 20.7206 120.439 20.4393C120.721 20.158 121.102 20 121.5 20H142.5C142.898 20 143.279 20.158 143.561 20.4393C143.842 20.7206 144 21.1022 144 21.5V34.79Z" fill="#F7B59F" class="build-in" style="animation-delay: 0.5s" />
                <rect x="9" y="9" width="42" height="12" rx="4" fill="#F7B59F" class="build-in" style="animation-delay: 1.2s" />
                <circle cx="15" cy="15" r="4" fill="#FBD9CE" class="build-in" style="animation-delay: 1.2s" />
                <rect x="9" y="25" width="42" height="12" rx="4" fill="#F7B59F" class="build-in" style="animation-delay: 1.8s" />
                <circle cx="15" cy="31" r="4" fill="#FBD9CE" class="build-in" style="animation-delay: 1.8s" />
                <rect x="9" y="41" width="42" height="12" rx="4" fill="#F7B59F" class="build-in" style="animation-delay: 2.4s" />
                <circle cx="15" cy="47" r="4" fill="#FBD9CE" class="build-in" style="animation-delay: 2.4s" />
              </svg>
            </div>

            <!-- Step 2+3: Finding placement — single inline SVG, elements animate via CSS transitions -->
            <div v-else key="s2" class="flex items-center justify-center">
              <svg width="236" height="196" viewBox="0 0 236 196" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-60">
                <defs>
                  <linearGradient id="skeletonShimmer" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="80" y2="0">
                    <stop offset="0%" stop-color="#E3E5E8"/>
                    <stop offset="50%" stop-color="#F5F6F8"/>
                    <stop offset="100%" stop-color="#E3E5E8"/>
                    <animate attributeName="x1" values="-80;236" dur="1.8s" repeatCount="indefinite"/>
                    <animate attributeName="x2" values="0;316" dur="1.8s" repeatCount="indefinite"/>
                  </linearGradient>
                </defs>
                <rect x="1" y="1" width="234" height="194" rx="7" stroke="#F1F2F4" stroke-width="2"/>
                <rect class="anim-el" id="lv-img" x="12" y="12" width="62" height="62" rx="4" fill="url(#skeletonShimmer)"/>
                <rect class="anim-el" id="lv-thumb1" :x="p.thumb1.x" :y="p.thumb1.y" width="18" height="18" rx="4" fill="url(#skeletonShimmer)" :style="{ opacity: p.thumb1.opacity }"/>
                <rect class="anim-el" id="lv-thumb2" :x="p.thumb2.x" :y="p.thumb2.y" width="18" height="18" rx="4" fill="url(#skeletonShimmer)" :style="{ opacity: p.thumb2.opacity }"/>
                <rect class="anim-el" id="lv-thumb3" :x="p.thumb3.x" :y="p.thumb3.y" width="18" height="18" rx="4" fill="url(#skeletonShimmer)" :style="{ opacity: p.thumb3.opacity }"/>
                <rect class="anim-el" x="83" y="12" width="99" height="12" rx="4" fill="url(#skeletonShimmer)"/>
                <rect class="anim-el" :x="83" :y="p.text1.y" width="56" height="6" rx="3" fill="url(#skeletonShimmer)"/>
                <rect class="anim-el" :x="83" :y="p.text2.y" width="76" height="6" rx="3" fill="url(#skeletonShimmer)"/>
                <rect class="anim-el" :x="83" :y="p.price.y" width="42" height="12" rx="4" fill="url(#skeletonShimmer)"/>
                <rect class="anim-el" x="12" :y="p.desc1.y" width="185" height="6" rx="3" fill="url(#skeletonShimmer)" :style="{ opacity: p.desc1.opacity }"/>
                <rect class="anim-el" x="12" :y="p.desc2.y" width="212" height="6" rx="3" fill="url(#skeletonShimmer)" :style="{ opacity: p.desc2.opacity }"/>
                <rect class="anim-el" x="12" :y="p.desc3.y" width="157" height="6" rx="3" fill="url(#skeletonShimmer)" :style="{ opacity: p.desc3.opacity }"/>
                <rect class="anim-el" x="12" :y="p.desc4.y" width="212" height="6" rx="3" fill="url(#skeletonShimmer)" :style="{ opacity: p.desc4.opacity }"/>
                <rect class="anim-el" x="12" y="159" width="62" height="26" rx="4" fill="url(#skeletonShimmer)" :style="{ opacity: p.btn.opacity }"/>
                <rect class="anim-el" x="87" y="159" width="62" height="26" rx="4" fill="url(#skeletonShimmer)" :style="{ opacity: p.btn.opacity }"/>
                <rect class="anim-el" x="162" y="159" width="62" height="26" rx="4" fill="url(#skeletonShimmer)" :style="{ opacity: p.btn.opacity }"/>

                <!-- SPP block -->
                <rect class="anim-el" :x="p.sppBg.x" :y="p.sppBg.y" :width="p.sppBg.width" :height="p.sppBg.height" rx="4" fill="#FBD9CE" :style="{ opacity: p.spp.opacity }"/>
                <path class="anim-el" d="M142.5 17H121.5C120.307 17 119.162 17.4741 118.318 18.318C117.474 19.1619 117 20.3065 117 21.5V42.5C117 43.6935 117.474 44.8381 118.318 45.682C119.162 46.5259 120.307 47 121.5 47H142.5C142.747 46.9966 142.993 46.9715 143.235 46.925L143.685 46.82H143.79H143.865L144.42 46.61L144.615 46.505C144.765 46.415 144.93 46.34 145.08 46.235C145.28 46.0876 145.471 45.9273 145.65 45.755L145.755 45.62C145.902 45.4708 146.038 45.3103 146.16 45.14L146.295 44.945C146.4 44.778 146.49 44.6024 146.565 44.42C146.606 44.348 146.641 44.2728 146.67 44.195C146.745 44.015 146.79 43.82 146.85 43.625V43.4C146.935 43.1069 146.985 42.8048 147 42.5V21.5C147 20.3065 146.526 19.1619 145.682 18.318C144.838 17.4741 143.693 17 142.5 17ZM121.5 44C121.102 44 120.721 43.842 120.439 43.5607C120.158 43.2794 120 42.8978 120 42.5V36.035L124.935 31.085C125.074 30.9444 125.24 30.8328 125.423 30.7567C125.606 30.6805 125.802 30.6413 126 30.6413C126.198 30.6413 126.394 30.6805 126.577 30.7567C126.76 30.8328 126.926 30.9444 127.065 31.085L139.965 44H121.5ZM144 42.5C143.999 42.6849 143.963 42.868 143.895 43.04C143.861 43.1131 143.821 43.1833 143.775 43.25C143.735 43.3135 143.69 43.3737 143.64 43.43L135.615 35.405L136.935 34.085C137.074 33.9444 137.24 33.8328 137.423 33.7567C137.606 33.6805 137.802 33.6413 138 33.6413C138.198 33.6413 138.394 33.6805 138.577 33.7567C138.76 33.8328 138.926 33.9444 139.065 34.085V34.085L144 39.035V42.5ZM144 34.79L141.18 32C140.322 31.1855 139.183 30.7314 138 30.7314C136.817 30.7314 135.678 31.1855 134.82 32L133.5 33.32L129.18 29C128.322 28.1855 127.183 27.7314 126 27.7314C124.817 27.7314 123.678 28.1855 122.82 29L120 31.79V21.5C120 21.1022 120.158 20.7206 120.439 20.4393C120.721 20.158 121.102 20 121.5 20H142.5C142.898 20 143.279 20.158 143.561 20.4393C143.842 20.7206 144 21.1022 144 21.5V34.79Z" fill="#F7B59F" :transform="p.sppIcon.transform" :style="{ opacity: p.spp.opacity }"/>
                <rect class="anim-el" :x="p.sppBar1.x" :y="p.sppBar1.y" :width="p.sppBar1.width" :height="p.sppBar1.height" rx="4" fill="#F7B59F" :style="{ opacity: p.spp.opacity }"/>
                <circle class="anim-el" :cx="p.sppDot1.cx" :cy="p.sppDot1.cy" :r="p.sppDot1.r" fill="#FBD9CE" :style="{ opacity: p.spp.opacity }"/>
                <rect class="anim-el" :x="p.sppBar2.x" :y="p.sppBar2.y" :width="p.sppBar2.width" :height="p.sppBar2.height" rx="4" fill="#F7B59F" :style="{ opacity: p.spp.opacity }"/>
                <circle class="anim-el" :cx="p.sppDot2.cx" :cy="p.sppDot2.cy" :r="p.sppDot2.r" fill="#FBD9CE" :style="{ opacity: p.spp.opacity }"/>
                <rect class="anim-el" :x="p.sppBar3.x" :y="p.sppBar3.y" :width="p.sppBar3.width" :height="p.sppBar3.height" rx="4" fill="#F7B59F" :style="{ opacity: p.spp.opacity }"/>
                <circle class="anim-el" :cx="p.sppDot3.cx" :cy="p.sppDot3.cy" :r="p.sppDot3.r" fill="#FBD9CE" :style="{ opacity: p.spp.opacity }"/>
              </svg>
            </div>

          </transition>
        </div>

        <!-- Current step text -->
        <transition name="fade-step" mode="out-in">
          <p :key="currentStep" class="text-xl text-om-gray-700 text-center w-80 leading-relaxed">
            {{ steps[currentStep] }}<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
          </p>
        </transition>

      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

const emit = defineEmits(['menu-click', 'done'])

const steps = [
  'Scanning your product page and identifying content areas',
  'Generating AI-powered text and visual elements',
  'Finding the optimal area on your page for the generated content',
]

const currentStep = ref(0)
const sppPhase = ref(0)
let sppTimeouts = []

// Phase data — exact coordinates from the 3 reference SVGs
const phaseData = {
  // Phase 0: empty page with 4 desc lines
  0: {
    thumb1: { x: 12, y: 80, opacity: 1 }, thumb2: { x: 34, y: 80, opacity: 1 }, thumb3: { x: 56, y: 80, opacity: 1 },
    text1: { y: 31 }, text2: { y: 40 }, price: { y: 62 },
    desc1: { y: 108, opacity: 1 }, desc2: { y: 117, opacity: 1 }, desc3: { y: 127, opacity: 1 }, desc4: { y: 136, opacity: 1 },
    btn: { opacity: 0 },
    spp: { opacity: 0 },
    sppBg: { x: 12, y: 105, width: 212, height: 62 },
    sppIcon: { transform: 'translate(12, 105)' },
    sppBar1: { x: 21, y: 114, width: 42, height: 12 }, sppDot1: { cx: 27, cy: 120, r: 4 },
    sppBar2: { x: 21, y: 130, width: 42, height: 12 }, sppDot2: { cx: 27, cy: 136, r: 4 },
    sppBar3: { x: 21, y: 146, width: 42, height: 12 }, sppDot3: { cx: 27, cy: 152, r: 4 },
  },
  // Phase 1a: desc lines slide down, bottom 2 fade
  '1a': {
    thumb1: { x: 12, y: 80, opacity: 1 }, thumb2: { x: 34, y: 80, opacity: 1 }, thumb3: { x: 56, y: 80, opacity: 1 },
    text1: { y: 31 }, text2: { y: 40 }, price: { y: 62 },
    desc1: { y: 175, opacity: 1 }, desc2: { y: 184, opacity: 1 }, desc3: { y: 175, opacity: 0 }, desc4: { y: 184, opacity: 0 },
    btn: { opacity: 0 },
    spp: { opacity: 0 },
    sppBg: { x: 12, y: 105, width: 212, height: 62 },
    sppIcon: { transform: 'translate(12, 105)' },
    sppBar1: { x: 21, y: 114, width: 42, height: 12 }, sppDot1: { cx: 27, cy: 120, r: 4 },
    sppBar2: { x: 21, y: 130, width: 42, height: 12 }, sppDot2: { cx: 27, cy: 136, r: 4 },
    sppBar3: { x: 21, y: 146, width: 42, height: 12 }, sppDot3: { cx: 27, cy: 152, r: 4 },
  },
  // Phase 1: 3a — SPP full-width at y=105
  1: {
    thumb1: { x: 12, y: 80, opacity: 1 }, thumb2: { x: 34, y: 80, opacity: 1 }, thumb3: { x: 56, y: 80, opacity: 1 },
    text1: { y: 31 }, text2: { y: 40 }, price: { y: 62 },
    desc1: { y: 175, opacity: 1 }, desc2: { y: 184, opacity: 1 }, desc3: { y: 175, opacity: 0 }, desc4: { y: 184, opacity: 0 },
    btn: { opacity: 0 },
    spp: { opacity: 1 },
    sppBg: { x: 12, y: 105, width: 212, height: 62 },
    sppIcon: { transform: 'translate(12, 105)' },
    sppBar1: { x: 21, y: 114, width: 42, height: 12 }, sppDot1: { cx: 27, cy: 120, r: 4 },
    sppBar2: { x: 21, y: 130, width: 42, height: 12 }, sppDot2: { cx: 27, cy: 136, r: 4 },
    sppBar3: { x: 21, y: 146, width: 42, height: 12 }, sppDot3: { cx: 27, cy: 152, r: 4 },
  },
  // Phase 2: 3b — SPP smaller at y=64 (scale 0.7)
  2: {
    thumb1: { x: 12, y: 80, opacity: 1 }, thumb2: { x: 34, y: 80, opacity: 1 }, thumb3: { x: 56, y: 80, opacity: 1 },
    text1: { y: 28 }, text2: { y: 37 }, price: { y: 46 },
    desc1: { y: 117, opacity: 1 }, desc2: { y: 126, opacity: 1 }, desc3: { y: 136, opacity: 1 }, desc4: { y: 145, opacity: 1 },
    btn: { opacity: 1 },
    spp: { opacity: 1 },
    sppBg: { x: 83, y: 64, width: 141, height: 44 },
    sppIcon: { transform: 'translate(83, 64) scale(0.7)' },
    sppBar1: { x: 89.3, y: 70.3, width: 29.4, height: 8.4 }, sppDot1: { cx: 93.5, cy: 74.5, r: 2.8 },
    sppBar2: { x: 89.3, y: 81.5, width: 29.4, height: 8.4 }, sppDot2: { cx: 93.5, cy: 85.7, r: 2.8 },
    sppBar3: { x: 89.3, y: 92.7, width: 29.4, height: 8.4 }, sppDot3: { cx: 93.5, cy: 96.9, r: 2.8 },
  },
  // Phase 3: 3c — SPP full-width at y=129
  3: {
    thumb1: { x: 12, y: 82, opacity: 1 }, thumb2: { x: 34, y: 82, opacity: 1 }, thumb3: { x: 56, y: 82, opacity: 1 },
    text1: { y: 31 }, text2: { y: 40 }, price: { y: 62 },
    desc1: { y: 108, opacity: 1 }, desc2: { y: 117, opacity: 1 }, desc3: { y: 108, opacity: 0 }, desc4: { y: 117, opacity: 0 },
    btn: { opacity: 0 },
    spp: { opacity: 1 },
    sppBg: { x: 12, y: 129, width: 212, height: 62 },
    sppIcon: { transform: 'translate(12, 129)' },
    sppBar1: { x: 21, y: 138, width: 42, height: 12 }, sppDot1: { cx: 27, cy: 144, r: 4 },
    sppBar2: { x: 21, y: 154, width: 42, height: 12 }, sppDot2: { cx: 27, cy: 160, r: 4 },
    sppBar3: { x: 21, y: 170, width: 42, height: 12 }, sppDot3: { cx: 27, cy: 176, r: 4 },
  },
}

const p = computed(() => phaseData[sppPhase.value] || phaseData[0])

function startSppCycle() {
  sppPhase.value = 0
  sppTimeouts = [
    setTimeout(() => { sppPhase.value = '1a' }, 800),
    setTimeout(() => { sppPhase.value = 1 }, 1600),
    setTimeout(() => { sppPhase.value = 2 }, 3000),
    setTimeout(() => { sppPhase.value = 3 }, 4800),
  ]
}

function stopSppCycle() {
  sppTimeouts.forEach(t => clearTimeout(t))
  sppTimeouts = []
}

onMounted(() => {
  const stepDuration = 4000
  let stepCount = 0
  const interval = setInterval(() => {
    stepCount++
    if (stepCount < steps.length) {
      stopSppCycle()
      currentStep.value = stepCount
      if (stepCount === 2) {
        startSppCycle()
        // Last step — wait for SPP animation to finish, then emit done
        clearInterval(interval)
        setTimeout(() => emit('done'), 7600)
      }
    }
  }, stepDuration)
})

onUnmounted(() => {
  stopSppCycle()
})
</script>

<style scoped>
/* Step transitions */
.fade-step-enter-active,
.fade-step-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-step-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-step-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Scanner Lottie overlay */
.scanner-lottie {
  top: 0;
  left: -2%;
  width: 104%;
  height: 100%;
  pointer-events: none;
}

/* Sequential build-in for step 1 SVG elements */
.build-in {
  opacity: 0;
  transform-origin: center;
  transform-box: fill-box;
  animation: build-in-grow 0.5s cubic-bezier(0.34, 1.3, 0.64, 1) forwards;
}
@keyframes build-in-grow {
  0%   { opacity: 0; transform: scale(0.6); }
  100% { opacity: 1; transform: scale(1); }
}

/* Smooth transitions for all animated SVG elements in step 2+3 */
.anim-el {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animated dots after the step text */
.dot {
  opacity: 0;
  animation: dot-blink 1.4s infinite;
}
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes dot-blink {
  0%, 60%, 100% { opacity: 0; }
  30%           { opacity: 1; }
}
</style>
