<template>
  <div class="h-screen-safe bg-white flex flex-col relative overflow-hidden">
    <!-- Logo at top left corner -->
    <div class="fixed top-8 left-8 z-50">
      <img
        src="https://www.optimonk.com/wp-content/uploads/optimonk-logo-2024.svg"
        alt="OptiMonk"
        class="h-8"
      />
    </div>

    <!-- Main content area -->
    <div :class="['w-full h-full max-w-7xl mx-auto flex flex-col md:flex-row', reducedGap ? 'md:gap-8' : 'md:gap-16 lg:gap-32 xl:gap-48']">
      <!-- Left Side - Content Area -->
      <div class="w-full h-full md:w-[516px] flex items-center justify-center md:justify-start px-8 lg:pl-16 lg:pr-0 py-8 overflow-hidden">
        <div class="w-full max-w-[516px] md:max-w-none">
          <slot name="content"></slot>
        </div>
      </div>

      <!-- Right Side - Illustration Area -->
      <div :class="['hidden md:flex flex-1 pt-8 pr-8 lg:pr-16', hasProgress ? 'pb-28' : 'pb-8']">
        <div :class="['w-full rounded-[40px] flex items-center justify-center overflow-hidden mb-8 transition-colors duration-500', transparentIllustration ? 'bg-transparent' : 'bg-[#FFEFE5]', reducedGap ? '' : 'max-w-xl']">
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
    <div v-if="hasProgress" class="fixed bottom-12-safe left-0 right-0 bg-white z-40">
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
  }
})
</script>
