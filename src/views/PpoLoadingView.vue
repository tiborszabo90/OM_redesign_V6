<template>
  <DashboardLayout active-menu-item="campaigns" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="flex flex-col items-center justify-center h-full -translate-y-[5%]">
        <!-- SVG illustration with animations -->
        <div class="mb-10 relative w-60 h-50 flex items-center justify-center">
          <transition name="fade-step" mode="out-in">

            <!-- Step 0: Page scanning with Lottie scanner overlay -->
            <div v-if="currentStep === 0" key="s0" class="relative">
              <img src="/SPP_loader1.svg?v=2" class="w-60 relative z-0" />
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
                <rect width="62" height="62" rx="4" fill="#F7B59F" class="build-in" style="animation-delay: 0.5s" />
                <path d="M41.5 16H20.5C19.3065 16 18.1619 16.4741 17.318 17.318C16.4741 18.1619 16 19.3065 16 20.5V41.5C16 42.6935 16.4741 43.8381 17.318 44.682C18.1619 45.5259 19.3065 46 20.5 46H41.5C41.7467 45.9966 41.9927 45.9715 42.235 45.925L42.685 45.82H42.79H42.865L43.42 45.61L43.615 45.505C43.765 45.415 43.93 45.34 44.08 45.235C44.2803 45.0876 44.4707 44.9273 44.65 44.755L44.755 44.62C44.9023 44.4708 45.0377 44.3103 45.16 44.14L45.295 43.945C45.3998 43.778 45.4901 43.6024 45.565 43.42C45.6062 43.348 45.6413 43.2728 45.67 43.195C45.745 43.015 45.79 42.82 45.85 42.625V42.4C45.935 42.1069 45.9854 41.8048 46 41.5V20.5C46 19.3065 45.5259 18.1619 44.682 17.318C43.8381 16.4741 42.6935 16 41.5 16ZM20.5 43C20.1022 43 19.7206 42.842 19.4393 42.5607C19.158 42.2794 19 41.8978 19 41.5V35.035L23.935 30.085C24.0744 29.9444 24.2403 29.8328 24.4231 29.7567C24.6059 29.6805 24.802 29.6413 25 29.6413C25.198 29.6413 25.3941 29.6805 25.5769 29.7567C25.7597 29.8328 25.9256 29.9444 26.065 30.085L38.965 43H20.5ZM43 41.5C42.9986 41.6849 42.963 41.868 42.895 42.04C42.8607 42.1131 42.8206 42.1833 42.775 42.25C42.7349 42.3135 42.6897 42.3737 42.64 42.43L34.615 34.405L35.935 33.085C36.0744 32.9444 36.2403 32.8328 36.4231 32.7567C36.6059 32.6805 36.802 32.6413 37 32.6413C37.198 32.6413 37.3941 32.6805 37.5769 32.7567C37.7597 32.8328 37.9256 32.9444 38.065 33.085V33.085L43 38.035V41.5ZM43 33.79L40.18 31C39.3216 30.1855 38.1833 29.7314 37 29.7314C35.8167 29.7314 34.6784 30.1855 33.82 31L32.5 32.32L28.18 28C27.3216 27.1855 26.1833 26.7314 25 26.7314C23.8167 26.7314 22.6784 27.1855 21.82 28L19 30.79V20.5C19 20.1022 19.158 19.7206 19.4393 19.4393C19.7206 19.158 20.1022 19 20.5 19H41.5C41.8978 19 42.2794 19.158 42.5607 19.4393C42.842 19.7206 43 20.1022 43 20.5V33.79Z" fill="#FBD9CE" class="build-in" style="animation-delay: 0.5s" />
                <rect x="71" y="9" width="86" height="12" rx="4" fill="#F7B59F" class="build-in" style="animation-delay: 1.2s" />
                <rect x="71" y="25" width="8" height="8" rx="4" fill="#F7B59F" class="build-in" style="animation-delay: 1.8s" />
                <rect x="81" y="26" width="94" height="6" rx="3" fill="#F7B59F" class="build-in" style="animation-delay: 1.8s" />
                <rect x="71" y="35" width="8" height="8" rx="4" fill="#F7B59F" class="build-in" style="animation-delay: 2.2s" />
                <rect x="81" y="36" width="104" height="6" rx="3" fill="#F7B59F" class="build-in" style="animation-delay: 2.2s" />
                <rect x="71" y="45" width="8" height="8" rx="4" fill="#F7B59F" class="build-in" style="animation-delay: 2.6s" />
                <rect x="81" y="46" width="86" height="6" rx="3" fill="#F7B59F" class="build-in" style="animation-delay: 2.6s" />
              </svg>
            </div>

            <!-- Step 2+3: Finding placement — single inline SVG, elements animate via CSS transitions -->
            <div v-else key="s2" class="flex items-center justify-center">
              <svg width="236" height="196" viewBox="0 0 236 196" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-60">
                <rect x="1" y="1" width="234" height="194" rx="7" stroke="#F1F2F4" stroke-width="2"/>
                <rect class="anim-el" id="lv-img" x="12" y="12" width="62" height="62" rx="4" fill="#E3E5E8"/>
                <rect class="anim-el" id="lv-thumb1" :x="p.thumb1.x" :y="p.thumb1.y" width="18" height="18" rx="4" fill="#E3E5E8" :style="{ opacity: p.thumb1.opacity }"/>
                <rect class="anim-el" id="lv-thumb2" :x="p.thumb2.x" :y="p.thumb2.y" width="18" height="18" rx="4" fill="#E3E5E8" :style="{ opacity: p.thumb2.opacity }"/>
                <rect class="anim-el" id="lv-thumb3" :x="p.thumb3.x" :y="p.thumb3.y" width="18" height="18" rx="4" fill="#E3E5E8" :style="{ opacity: p.thumb3.opacity }"/>
                <rect class="anim-el" x="83" y="12" width="99" height="12" rx="4" fill="#E3E5E8"/>
                <rect class="anim-el" :x="83" :y="p.text1.y" width="56" height="6" rx="3" fill="#E3E5E8"/>
                <rect class="anim-el" :x="83" :y="p.text2.y" width="76" height="6" rx="3" fill="#E3E5E8"/>
                <rect class="anim-el" :x="83" :y="p.price.y" width="42" height="12" rx="4" fill="#E3E5E8"/>
                <rect class="anim-el" x="12" :y="p.desc1.y" width="185" height="6" rx="3" fill="#E3E5E8" :style="{ opacity: p.desc1.opacity }"/>
                <rect class="anim-el" x="12" :y="p.desc2.y" width="212" height="6" rx="3" fill="#E3E5E8" :style="{ opacity: p.desc2.opacity }"/>
                <rect class="anim-el" x="12" :y="p.desc3.y" width="157" height="6" rx="3" fill="#E3E5E8" :style="{ opacity: p.desc3.opacity }"/>
                <rect class="anim-el" x="12" :y="p.desc4.y" width="212" height="6" rx="3" fill="#E3E5E8" :style="{ opacity: p.desc4.opacity }"/>
                <rect class="anim-el" x="12" y="159" width="62" height="26" rx="4" fill="#E3E5E8" :style="{ opacity: p.btn.opacity }"/>
                <rect class="anim-el" x="87" y="159" width="62" height="26" rx="4" fill="#E3E5E8" :style="{ opacity: p.btn.opacity }"/>
                <rect class="anim-el" x="162" y="159" width="62" height="26" rx="4" fill="#E3E5E8" :style="{ opacity: p.btn.opacity }"/>

                <!-- SPP block -->
                <rect class="anim-el" :x="p.sppBg.x" :y="p.sppBg.y" :width="p.sppBg.width" :height="p.sppBg.height" rx="4" fill="#FBD9CE" :style="{ opacity: p.spp.opacity }"/>
                <rect class="anim-el" :x="p.sppImg.x" :y="p.sppImg.y" :width="p.sppImg.width" :height="p.sppImg.height" rx="4" fill="#F7B59F" :style="{ opacity: p.spp.opacity }"/>
                <path class="anim-el" d="M41.5 16H20.5C19.3065 16 18.1619 16.4741 17.318 17.318C16.4741 18.1619 16 19.3065 16 20.5V41.5C16 42.6935 16.4741 43.8381 17.318 44.682C18.1619 45.5259 19.3065 46 20.5 46H41.5C41.7467 45.9966 41.9927 45.9715 42.235 45.925L42.685 45.82H42.79H42.865L43.42 45.61L43.615 45.505C43.765 45.415 43.93 45.34 44.08 45.235C44.2803 45.0876 44.4707 44.9273 44.65 44.755L44.755 44.62C44.9023 44.4708 45.0377 44.3103 45.16 44.14L45.295 43.945C45.3998 43.778 45.4901 43.6024 45.565 43.42C45.6062 43.348 45.6413 43.2728 45.67 43.195C45.745 43.015 45.79 42.82 45.85 42.625V42.4C45.935 42.1069 45.9854 41.8048 46 41.5V20.5C46 19.3065 45.5259 18.1619 44.682 17.318C43.8381 16.4741 42.6935 16 41.5 16ZM20.5 43C20.1022 43 19.7206 42.842 19.4393 42.5607C19.158 42.2794 19 41.8978 19 41.5V35.035L23.935 30.085C24.0744 29.9444 24.2403 29.8328 24.4231 29.7567C24.6059 29.6805 24.802 29.6413 25 29.6413C25.198 29.6413 25.3941 29.6805 25.5769 29.7567C25.7597 29.8328 25.9256 29.9444 26.065 30.085L38.965 43H20.5ZM43 41.5C42.9986 41.6849 42.963 41.868 42.895 42.04C42.8607 42.1131 42.8206 42.1833 42.775 42.25C42.7349 42.3135 42.6897 42.3737 42.64 42.43L34.615 34.405L35.935 33.085C36.0744 32.9444 36.2403 32.8328 36.4231 32.7567C36.6059 32.6805 36.802 32.6413 37 32.6413C37.198 32.6413 37.3941 32.6805 37.5769 32.7567C37.7597 32.8328 37.9256 32.9444 38.065 33.085L43 38.035V41.5ZM43 33.79L40.18 31C39.3216 30.1855 38.1833 29.7314 37 29.7314C35.8167 29.7314 34.6784 30.1855 33.82 31L32.5 32.32L28.18 28C27.3216 27.1855 26.1833 26.7314 25 26.7314C23.8167 26.7314 22.6784 27.1855 21.82 28L19 30.79V20.5C19 20.1022 19.158 19.7206 19.4393 19.4393C19.7206 19.158 20.1022 19 20.5 19H41.5C41.8978 19 42.2794 19.158 42.5607 19.4393C42.842 19.7206 43 20.1022 43 20.5V33.79Z" fill="#FBD9CE" :transform="p.sppIcon.transform" :style="{ opacity: p.spp.opacity }"/>
                <rect class="anim-el" :x="p.sppTitle.x" :y="p.sppTitle.y" :width="p.sppTitle.width" :height="p.sppTitle.height" rx="4" fill="#F7B59F" :style="{ opacity: p.spp.opacity }"/>
                <rect class="anim-el" :x="p.sppCheck1.x" :y="p.sppCheck1.y" :width="p.sppCheck1.width" :height="p.sppCheck1.height" rx="4" fill="#F7B59F" :style="{ opacity: p.spp.opacity }"/>
                <rect class="anim-el" :x="p.sppLine1.x" :y="p.sppLine1.y" :width="p.sppLine1.width" :height="p.sppLine1.height" rx="3" fill="#F7B59F" :style="{ opacity: p.spp.opacity }"/>
                <rect class="anim-el" :x="p.sppCheck2.x" :y="p.sppCheck2.y" :width="p.sppCheck2.width" :height="p.sppCheck2.height" rx="4" fill="#F7B59F" :style="{ opacity: p.spp.opacity }"/>
                <rect class="anim-el" :x="p.sppLine2.x" :y="p.sppLine2.y" :width="p.sppLine2.width" :height="p.sppLine2.height" rx="3" fill="#F7B59F" :style="{ opacity: p.spp.opacity }"/>
                <rect class="anim-el" :x="p.sppCheck3.x" :y="p.sppCheck3.y" :width="p.sppCheck3.width" :height="p.sppCheck3.height" rx="4" fill="#F7B59F" :style="{ opacity: p.spp.opacity }"/>
                <rect class="anim-el" :x="p.sppLine3.x" :y="p.sppLine3.y" :width="p.sppLine3.width" :height="p.sppLine3.height" rx="3" fill="#F7B59F" :style="{ opacity: p.spp.opacity }"/>
              </svg>
            </div>

          </transition>
        </div>

        <!-- Current step text -->
        <transition name="fade-step" mode="out-in">
          <p :key="currentStep" class="text-xl text-om-gray-700 text-center w-80 leading-relaxed">
            {{ steps[currentStep] }}
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
  'Scanning your product page and identifying content areas...',
  'Generating AI-powered text and visual elements...',
  'Finding the optimal area on your page for the generated content...',
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
    sppBg: { x: 12, y: 105, width: 212, height: 62 }, sppImg: { x: 12, y: 105, width: 62, height: 62 },
    sppIcon: { transform: 'translate(12, 105)' },
    sppTitle: { x: 83, y: 114, width: 86, height: 12 },
    sppCheck1: { x: 83, y: 130, width: 8, height: 8 }, sppLine1: { x: 93, y: 131, width: 94, height: 6 },
    sppCheck2: { x: 83, y: 140, width: 8, height: 8 }, sppLine2: { x: 93, y: 141, width: 104, height: 6 },
    sppCheck3: { x: 83, y: 150, width: 8, height: 8 }, sppLine3: { x: 93, y: 151, width: 86, height: 6 },
  },
  // Phase 1a: desc lines slide down, bottom 2 fade
  '1a': {
    thumb1: { x: 12, y: 80, opacity: 1 }, thumb2: { x: 34, y: 80, opacity: 1 }, thumb3: { x: 56, y: 80, opacity: 1 },
    text1: { y: 31 }, text2: { y: 40 }, price: { y: 62 },
    desc1: { y: 175, opacity: 1 }, desc2: { y: 184, opacity: 1 }, desc3: { y: 175, opacity: 0 }, desc4: { y: 184, opacity: 0 },
    btn: { opacity: 0 },
    spp: { opacity: 0 },
    sppBg: { x: 12, y: 105, width: 212, height: 62 }, sppImg: { x: 12, y: 105, width: 62, height: 62 },
    sppIcon: { transform: 'translate(12, 105)' },
    sppTitle: { x: 83, y: 114, width: 86, height: 12 },
    sppCheck1: { x: 83, y: 130, width: 8, height: 8 }, sppLine1: { x: 93, y: 131, width: 94, height: 6 },
    sppCheck2: { x: 83, y: 140, width: 8, height: 8 }, sppLine2: { x: 93, y: 141, width: 104, height: 6 },
    sppCheck3: { x: 83, y: 150, width: 8, height: 8 }, sppLine3: { x: 93, y: 151, width: 86, height: 6 },
  },
  // Phase 1: 3a — SPP full-width at y=105
  1: {
    thumb1: { x: 12, y: 80, opacity: 1 }, thumb2: { x: 34, y: 80, opacity: 1 }, thumb3: { x: 56, y: 80, opacity: 1 },
    text1: { y: 31 }, text2: { y: 40 }, price: { y: 62 },
    desc1: { y: 175, opacity: 1 }, desc2: { y: 184, opacity: 1 }, desc3: { y: 175, opacity: 0 }, desc4: { y: 184, opacity: 0 },
    btn: { opacity: 0 },
    spp: { opacity: 1 },
    sppBg: { x: 12, y: 105, width: 212, height: 62 }, sppImg: { x: 12, y: 105, width: 62, height: 62 },
    sppIcon: { transform: 'translate(12, 105)' },
    sppTitle: { x: 83, y: 114, width: 86, height: 12 },
    sppCheck1: { x: 83, y: 130, width: 8, height: 8 }, sppLine1: { x: 93, y: 131, width: 94, height: 6 },
    sppCheck2: { x: 83, y: 140, width: 8, height: 8 }, sppLine2: { x: 93, y: 141, width: 104, height: 6 },
    sppCheck3: { x: 83, y: 150, width: 8, height: 8 }, sppLine3: { x: 93, y: 151, width: 86, height: 6 },
  },
  // Phase 2: 3b — SPP smaller at y=64
  2: {
    thumb1: { x: 12, y: 80, opacity: 1 }, thumb2: { x: 34, y: 80, opacity: 1 }, thumb3: { x: 56, y: 80, opacity: 1 },
    text1: { y: 28 }, text2: { y: 37 }, price: { y: 46 },
    desc1: { y: 117, opacity: 1 }, desc2: { y: 126, opacity: 1 }, desc3: { y: 136, opacity: 1 }, desc4: { y: 145, opacity: 1 },
    btn: { opacity: 1 },
    spp: { opacity: 1 },
    sppBg: { x: 83, y: 64, width: 141, height: 44 }, sppImg: { x: 83, y: 64, width: 43.53, height: 43.53 },
    sppIcon: { transform: 'translate(83, 64) scale(0.7)' },
    sppTitle: { x: 132.85, y: 70.32, width: 33.7, height: 8.43 },
    sppCheck1: { x: 132.85, y: 81.55, width: 5.62, height: 5.62 }, sppLine1: { x: 140.57, y: 82.26, width: 33.7, height: 4.21 },
    sppCheck2: { x: 132.85, y: 88.57, width: 5.62, height: 5.62 }, sppLine2: { x: 140.57, y: 89.28, width: 37.21, height: 4.21 },
    sppCheck3: { x: 132.85, y: 95.6, width: 5.62, height: 5.62 }, sppLine3: { x: 140.57, y: 96.3, width: 30.89, height: 4.21 },
  },
  // Phase 3: 3c — SPP full-width at y=129
  3: {
    thumb1: { x: 12, y: 82, opacity: 1 }, thumb2: { x: 34, y: 82, opacity: 1 }, thumb3: { x: 56, y: 82, opacity: 1 },
    text1: { y: 31 }, text2: { y: 40 }, price: { y: 62 },
    desc1: { y: 108, opacity: 1 }, desc2: { y: 117, opacity: 1 }, desc3: { y: 108, opacity: 0 }, desc4: { y: 117, opacity: 0 },
    btn: { opacity: 0 },
    spp: { opacity: 1 },
    sppBg: { x: 12, y: 129, width: 212, height: 62 }, sppImg: { x: 12, y: 129, width: 62, height: 62 },
    sppIcon: { transform: 'translate(12, 129)' },
    sppTitle: { x: 83, y: 138, width: 86, height: 12 },
    sppCheck1: { x: 83, y: 154, width: 8, height: 8 }, sppLine1: { x: 93, y: 155, width: 94, height: 6 },
    sppCheck2: { x: 83, y: 164, width: 8, height: 8 }, sppLine2: { x: 93, y: 165, width: 104, height: 6 },
    sppCheck3: { x: 83, y: 174, width: 8, height: 8 }, sppLine3: { x: 93, y: 175, width: 86, height: 6 },
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
</style>
