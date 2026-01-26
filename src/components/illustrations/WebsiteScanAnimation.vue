<template>
  <div class="w-[820px] h-[500px] flex items-center justify-center">
    <div class="relative w-[820px] h-[500px]">
      <!-- Dummy website background -->
      <div class="absolute left-[10px] bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E3E5E8] w-[800px] h-[500px]">
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
        class="absolute inset-0 w-[820px] h-[500px] z-10"
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
