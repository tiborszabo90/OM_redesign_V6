<template>
  <div class="h-full bg-white flex flex-col relative overflow-hidden">
    <!-- Main content area -->
    <div :class="['w-full h-full min-h-0 max-w-7xl mx-auto flex flex-col md:flex-row', reducedGap ? 'md:gap-8' : 'md:gap-16 lg:gap-32 xl:gap-32']">
      <!-- Left Side - Content Area -->
      <div :class="['w-full h-full md:w-129 xl:w-150 flex items-center justify-center md:justify-start px-8 lg:pl-16 lg:pr-0 pt-8 overflow-hidden', hasProgress ? 'pb-32' : 'pb-8']">
        <div class="w-full max-w-[516px] md:max-w-none">
          <slot name="content"></slot>
        </div>
      </div>

      <!-- Right Side - Illustration Area -->
      <div :class="['hidden md:flex flex-1 pt-8 pr-8 lg:pr-16', hasProgress ? 'pb-28' : 'pb-4', isExiting ? 'exit-animation' : '']">
        <div :class="['w-full rounded-[40px] flex items-center justify-center overflow-hidden transition-colors duration-500', transparentIllustration ? 'bg-transparent' : 'bg-[#FFEFE5]', reducedGap ? '' : 'max-w-xl']">
          <slot name="illustration">
            <!-- Default placeholder -->
            <div class="flex items-center justify-center">
              <div class="text-center">
                <div class="w-64 h-64 mx-auto bg-white/30 rounded-3xl backdrop-blur-sm flex items-center justify-center">
                  <!-- uil-image -->
                  <svg class="w-32 h-32 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,4H5A3,3,0,0,0,2,7V17a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4ZM5,6H19a1,1,0,0,1,1,1v7.92l-3.37-2.69a2.06,2.06,0,0,0-2.59,0L11.46,14.4,9.2,12.72a2.06,2.06,0,0,0-2.59,0L4,14.71V7A1,1,0,0,1,5,6ZM5,18a1,1,0,0,1-1-1V17l3.86-3.09,2.31,1.79a2.06,2.06,0,0,0,2.59,0l2.59-2.07L20,17v0a1,1,0,0,1-1,1ZM9.5,11A1.5,1.5,0,1,0,8,9.5,1.5,1.5,0,0,0,9.5,11Z"/>
                  </svg>
                </div>
              </div>
            </div>
          </slot>
        </div>
      </div>
    </div>

    <!-- Progress bar at bottom of viewport -->
    <div v-if="hasProgress" :class="['fixed bottom-12-safe left-0 right-0 bg-white z-40', isExiting ? 'fade-out-delayed' : '']">
      <div class="w-full max-w-7xl mx-auto px-8 lg:pl-16 py-4">
        <div class="md:w-[516px]">
          <slot name="progress"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  hasProgress: {
    type: Boolean,
    default: false
  },
  transparentIllustration: {
    type: Boolean,
    default: false
  },
  reducedGap: {
    type: Boolean,
    default: false
  },
  isExiting: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
/* Exit animation for wizard transition */
.exit-animation {
  animation: slideUpExit 0.5s ease-in-out forwards;
}

@keyframes slideUpExit {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-100%);
  }
}

/* Delayed fade out for progress bar */
.fade-out-delayed {
  animation: fadeOut 0.3s ease-in-out 0.2s forwards;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
