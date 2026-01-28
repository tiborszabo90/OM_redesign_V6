<template>
  <div class="scanner-container overflow-hidden">
    <div class="scanner-inner relative">
      <!-- Dummy website background - centered within scanner -->
      <div class="absolute left-[15px] top-[10px] bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E3E5E8] w-[790px] h-[480px]">
        <!-- Skeleton content - visible first 2 seconds -->
        <transition name="fade">
          <div v-if="!showScreenshot" class="p-6 space-y-4 h-full overflow-hidden">
            <!-- Header skeleton -->
            <div class="flex items-center justify-between mb-6">
              <div class="w-24 h-8 bg-[#E3E5E8] rounded"></div>
              <div class="flex gap-3">
                <div class="w-16 h-4 bg-[#E3E5E8] rounded"></div>
                <div class="w-16 h-4 bg-[#E3E5E8] rounded"></div>
                <div class="w-16 h-4 bg-[#E3E5E8] rounded"></div>
              </div>
            </div>

            <!-- Hero skeleton -->
            <div class="space-y-3 mb-6">
              <div class="w-3/4 h-8 bg-[#E3E5E8] rounded"></div>
              <div class="w-1/2 h-8 bg-[#E3E5E8] rounded"></div>
              <div class="w-full h-4 bg-[#F1F2F4] rounded mt-4"></div>
              <div class="w-2/3 h-4 bg-[#F1F2F4] rounded"></div>
            </div>

            <!-- CTA button skeleton -->
            <div class="w-32 h-10 bg-[#E3E5E8] rounded-lg mb-8"></div>

            <!-- Content grid skeleton -->
            <div class="grid grid-cols-3 gap-4">
              <div class="space-y-3">
                <div class="w-full h-24 bg-[#F1F2F4] rounded-lg"></div>
                <div class="w-full h-4 bg-[#E3E5E8] rounded"></div>
                <div class="w-2/3 h-4 bg-[#E3E5E8] rounded"></div>
              </div>
              <div class="space-y-3">
                <div class="w-full h-24 bg-[#F1F2F4] rounded-lg"></div>
                <div class="w-full h-4 bg-[#E3E5E8] rounded"></div>
                <div class="w-2/3 h-4 bg-[#E3E5E8] rounded"></div>
              </div>
              <div class="space-y-3">
                <div class="w-full h-24 bg-[#F1F2F4] rounded-lg"></div>
                <div class="w-full h-4 bg-[#E3E5E8] rounded"></div>
                <div class="w-2/3 h-4 bg-[#E3E5E8] rounded"></div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Telekom screenshot - visible after 2 seconds -->
        <transition name="fade">
          <div v-if="showScreenshot" class="w-full h-full">
            <img src="/telekom_screenshot.png" alt="Telekom Website" class="w-full h-full object-cover object-top" />
          </div>
        </transition>
      </div>

      <!-- Lottie animation overlay - extends beyond skeleton -->
      <DotLottieVue
        src="https://lottie.host/3ac1aa01-5f66-42cb-a30f-cd070359a648/UwHQ4qaeYo.lottie"
        autoplay
        loop
        class="absolute inset-0 z-10"
        style="width: 820px; height: 500px;"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

const showScreenshot = ref(false)
let screenshotTimeout = null

onMounted(() => {
  // Show screenshot after 2 seconds
  screenshotTimeout = setTimeout(() => {
    showScreenshot.value = true
  }, 2000)
})

onUnmounted(() => {
  if (screenshotTimeout) {
    clearTimeout(screenshotTimeout)
  }
})
</script>

<style scoped>
/* Base size - scales down for smaller screens */
.scanner-container {
  width: 300px;
  height: 183px;
}

.scanner-inner {
  width: 820px;
  height: 500px;
  transform: scale(0.366);
  transform-origin: top left;
}

/* Small screens - slightly larger */
@media (min-width: 640px) {
  .scanner-container {
    width: 400px;
    height: 244px;
  }
  .scanner-inner {
    transform: scale(0.488);
  }
}

/* Medium screens */
@media (min-width: 768px) {
  .scanner-container {
    width: 450px;
    height: 275px;
  }
  .scanner-inner {
    transform: scale(0.549);
  }
}

/* Large screens */
@media (min-width: 1024px) {
  .scanner-container {
    width: 500px;
    height: 305px;
  }
  .scanner-inner {
    transform: scale(0.61);
  }
}

/* 1200px screens */
@media (min-width: 1200px) {
  .scanner-container {
    width: 574px;
    height: 350px;
  }
  .scanner-inner {
    transform: scale(0.7);
  }
}

/* Extra large screens */
@media (min-width: 1280px) {
  .scanner-container {
    width: 656px;
    height: 400px;
  }
  .scanner-inner {
    transform: scale(0.8);
  }
}

/* 1440px+ screens */
@media (min-width: 1440px) {
  .scanner-container {
    width: 738px;
    height: 450px;
  }
  .scanner-inner {
    transform: scale(0.9);
  }
}

/* 2XL screens - full size */
@media (min-width: 1600px) {
  .scanner-container {
    width: 820px;
    height: 500px;
  }
  .scanner-inner {
    transform: scale(1);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
