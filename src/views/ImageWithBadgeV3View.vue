<template>
  <div class="min-h-screen bg-white flex items-center justify-center relative">
    <!-- Optimonk Logo -->
    <img
      src="/OM-Logo-primary-basic.svg"
      alt="OptiMonk"
      class="absolute top-6 left-6 h-8"
    />

    <div class="w-full px-8">
      <!-- Initial Loading State -->
      <div v-if="showInitialLoading" class="flex items-center justify-center gap-12">
        <!-- Scanning Animation -->
        <div class="scanner-container-custom overflow-hidden">
          <div class="scanner-inner-custom relative">
            <!-- Dummy website background -->
            <div class="absolute left-[15px] top-[10px] bg-white rounded-2xl overflow-hidden border border-om-gray-200 w-[790px] h-[480px]">
              <!-- Skeleton content - visible first 2 seconds -->
              <transition name="fade">
                <div v-if="!showScreenshot" class="p-6 space-y-4 h-full overflow-hidden">
                  <!-- Header skeleton -->
                  <div class="flex items-center justify-between mb-6">
                    <div class="w-24 h-8 bg-om-gray-200 rounded"></div>
                    <div class="flex gap-3">
                      <div class="w-16 h-4 bg-om-gray-200 rounded"></div>
                      <div class="w-16 h-4 bg-om-gray-200 rounded"></div>
                      <div class="w-16 h-4 bg-om-gray-200 rounded"></div>
                    </div>
                  </div>

                  <!-- Hero skeleton -->
                  <div class="space-y-3 mb-6">
                    <div class="w-3/4 h-8 bg-om-gray-200 rounded"></div>
                    <div class="w-1/2 h-8 bg-om-gray-200 rounded"></div>
                    <div class="w-full h-4 bg-om-gray-100 rounded mt-4"></div>
                    <div class="w-2/3 h-4 bg-om-gray-100 rounded"></div>
                  </div>

                  <!-- CTA button skeleton -->
                  <div class="w-32 h-10 bg-om-gray-200 rounded-lg mb-8"></div>

                  <!-- Content grid skeleton -->
                  <div class="grid grid-cols-3 gap-4">
                    <div class="space-y-3">
                      <div class="w-full h-24 bg-om-gray-100 rounded-lg"></div>
                      <div class="w-full h-4 bg-om-gray-200 rounded"></div>
                      <div class="w-2/3 h-4 bg-om-gray-200 rounded"></div>
                    </div>
                    <div class="space-y-3">
                      <div class="w-full h-24 bg-om-gray-100 rounded-lg"></div>
                      <div class="w-full h-4 bg-om-gray-200 rounded"></div>
                      <div class="w-2/3 h-4 bg-om-gray-200 rounded"></div>
                    </div>
                    <div class="space-y-3">
                      <div class="w-full h-24 bg-om-gray-100 rounded-lg"></div>
                      <div class="w-full h-4 bg-om-gray-200 rounded"></div>
                      <div class="w-2/3 h-4 bg-om-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </transition>

              <!-- Whiskynet screenshot - visible after 2 seconds -->
              <transition name="fade">
                <div v-if="showScreenshot" class="w-full h-full">
                  <img src="/demos/whiskeynet/screenshot.png" alt="Whiskynet Website" class="w-full h-full object-cover object-top" />
                </div>
              </transition>
            </div>

            <!-- Lottie animation overlay -->
            <DotLottieVue
              src="https://lottie.host/3ac1aa01-5f66-42cb-a30f-cd070359a648/UwHQ4qaeYo.lottie"
              autoplay
              loop
              class="absolute inset-0 z-10"
              style="width: 820px; height: 500px;"
            />
          </div>
        </div>

        <!-- Loading Text -->
        <div class="flex flex-col justify-center" style="min-width: 400px;">
          <h2 class="text-2xl font-semibold text-om-gray-700 mb-6">
            Analyzing your website
          </h2>

          <!-- Activity List -->
          <transition-group name="slide-up" tag="div" class="flex flex-col gap-3">
            <div
              v-for="(activity, index) in activities.filter(a => a.visible)"
              :key="index"
              class="flex items-center justify-between px-4 py-3 bg-om-gray-100 rounded-lg"
            >
              <span class="text-sm text-om-gray-700">{{ activity.text }}</span>
              <CircleCheckBig
                v-if="activity.completed"
                :size="20"
                class="text-green-500 shrink-0"
              />
            </div>
          </transition-group>
        </div>
      </div>


      <!-- Success Modal -->
      <div v-if="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 relative">
          <!-- Success Icon -->
          <div class="flex justify-center mb-6">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CircleCheckBig :size="32" class="text-green-500" />
            </div>
          </div>

          <!-- Title -->
          <h3 class="text-2xl font-semibold text-om-gray-700 text-center mb-4">
            Kampány aktiválva!
          </h3>

          <!-- Message -->
          <p class="text-om-gray-600 text-center mb-6">
            Sikeresen elindítottuk a képgenerálást <span class="font-semibold text-om-gray-700">387 termékoldalra</span>.
          </p>

          <!-- Close Button -->
          <div class="flex justify-center">
            <Button
              variant="primary"
              size="md"
              @click="showSuccessModal = false"
            >
              Rendben
            </Button>
          </div>
        </div>
      </div>

      <!-- Preview Section -->
      <div v-else-if="showPreview" class="w-fit mx-auto">
        <div class="flex gap-4">
          <!-- Desktop Preview -->
          <div class="rounded-xl border border-om-gray-200" style="width: 720px; height: 400px;">
            <!-- Skeleton Loader -->
            <div v-if="previewLoading" class="w-full h-full bg-om-gray-200 animate-pulse rounded-xl"></div>
            <!-- Actual Preview -->
            <div v-else ref="previewContainer" class="overflow-auto w-full h-full rounded-xl">
              <img
                src="/image-with-badge/preview-1.png"
                alt="Preview"
                class="w-full h-auto"
                @load="onImageLoad"
              />
            </div>
          </div>
          <!-- Mobile Preview -->
          <div class="rounded-xl border border-om-gray-200" style="width: 220px; height: 400px;">
            <!-- Skeleton Loader -->
            <div v-if="previewLoading" class="w-full h-full bg-om-gray-200 animate-pulse rounded-xl"></div>
            <!-- Actual Preview -->
            <div v-else ref="mobilePreviewContainer" class="overflow-auto w-full h-full rounded-xl">
              <img
                src="/image-with-badge/preview-1-mobile.png"
                alt="Mobile Preview"
                class="w-full h-auto"
              />
            </div>
          </div>
        </div>

        <!-- Position Buttons -->
        <div class="mt-4 flex gap-2 justify-center">
          <button
            @click="selectedPosition = 1"
            :class="[
              'chip px-3 py-1.5 rounded-xl text-om-gray-700 text-sm cursor-pointer transition-all duration-200 ease-out hover:scale-[1.02]',
              selectedPosition === 1
                ? 'bg-om-orange-50 border-2 border-om-orange-500'
                : 'bg-white border border-om-gray-200'
            ]"
          >
            Position 1
          </button>
          <button
            @click="selectedPosition = 2"
            :class="[
              'chip px-3 py-1.5 rounded-xl text-om-gray-700 text-sm cursor-pointer transition-all duration-200 ease-out hover:scale-[1.02]',
              selectedPosition === 2
                ? 'bg-om-orange-50 border-2 border-om-orange-500'
                : 'bg-white border border-om-gray-200'
            ]"
          >
            Position 2
          </button>
          <button
            @click="selectedPosition = 3"
            :class="[
              'chip px-3 py-1.5 rounded-xl text-om-gray-700 text-sm cursor-pointer transition-all duration-200 ease-out hover:scale-[1.02]',
              selectedPosition === 3
                ? 'bg-om-orange-50 border-2 border-om-orange-500'
                : 'bg-white border border-om-gray-200'
            ]"
          >
            Position 3
          </button>
        </div>

        <!-- Activate Campaign Button -->
        <div class="mt-6 flex justify-center">
          <Button
            variant="primary"
            size="md"
            @click="handleActivateCampaign"
          >
            Activate Campaign
          </Button>
        </div>
      </div>

      <!-- Image Result / Loading State -->
      <div v-else-if="showImage || isLoading">
        <!-- Left Controls and Right Image Container -->
        <div class="flex gap-8 w-fit mx-auto items-center">
          <!-- Left side: Controls -->
          <div class="flex flex-col gap-4" style="width: 400px;">
            <!-- Product URL Input -->
            <input
              type="text"
              v-model="productUrl"
              placeholder="https://example.com/product"
              class="w-full px-4 py-2.5 border border-om-gray-200 rounded text-om-gray-700 focus:outline-none focus:border-om-orange-500 focus:ring-2 focus:ring-om-orange-500/20 transition-all"
            />

            <!-- Controls -->
            <Checkbox
              v-model="includePeople"
              label="Include people in the image"
              class="my-4"
            />
            <div class="w-full">
              <label class="block text-sm font-medium text-om-gray-700 mb-2">
                Language
              </label>
              <Dropdown
                v-model="selectedLanguage"
                :options="languageOptions"
                placeholder="Language"
              />
            </div>
            <div class="w-full">
              <label class="block text-sm font-medium text-om-gray-700 mb-2">
                Badge design
              </label>
              <Dropdown
                v-model="selectedBadgeDesign"
                :options="badgeDesignOptions"
                placeholder="Badge design"
              />
            </div>
            <Button
              variant="outline"
              size="md"
              @click="handleRegenerate"
            >
              Regenerate
            </Button>
            <Button
              variant="outline"
              size="md"
              @click="handleCheckMorePreviews"
            >
              Show more previews
            </Button>

            <!-- Next Button -->
            <Button
              variant="primary"
              size="md"
              @click="handleContinue"
              class="mt-2"
            >
              Next to placement
            </Button>
          </div>

          <!-- Right side: Image or Carousel -->
          <div>
            <!-- Skeleton Loading -->
            <div v-if="isLoading">
              <div class="h-128 shrink-0 rounded-xl bg-om-gray-200 animate-pulse" style="aspect-ratio: 0.562;"></div>
            </div>

            <!-- Carousel -->
            <div v-else-if="showSlider" class="relative overflow-hidden" style="width: 550px; height: 580px;">
              <div class="relative w-full h-full flex items-center justify-center">
                <!-- Image carousel -->
                <div
                  v-for="(image, index) in sliderImages"
                  :key="index"
                  @click="goToImage(index)"
                  :class="[
                    'absolute transition-all duration-500 ease-out cursor-pointer rounded-xl overflow-hidden',
                    getImagePosition(index)
                  ]"
                  :style="getImageStyle(index)"
                >
                  <!-- Skeleton Loader for new images (index > 0) -->
                  <div
                    v-if="sliderLoading && index > 0"
                    class="rounded-xl bg-om-gray-200 animate-pulse w-full h-full"
                  ></div>

                  <!-- Actual Image -->
                  <img
                    v-else
                    :src="image"
                    :alt="`Product ${index + 1}`"
                    class="h-full w-auto object-contain rounded-xl"
                  />

                  <!-- White overlay for non-selected images -->
                  <div
                    v-if="index !== currentImageIndex && !sliderLoading"
                    class="absolute inset-0 bg-white/60 hover:bg-white/40 transition-all duration-300 rounded-xl"
                  ></div>
                </div>

                <!-- Navigation Arrows -->
                <button
                  v-if="currentImageIndex > 0"
                  @click="prevImage"
                  class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 rounded-full shadow-xl flex items-center justify-center hover:bg-white hover:scale-110 transition-all cursor-pointer z-50"
                >
                  <svg class="w-6 h-6 text-om-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  v-if="currentImageIndex < sliderImages.length - 1"
                  @click="nextImage"
                  class="absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 rounded-full shadow-xl flex items-center justify-center hover:bg-white hover:scale-110 transition-all cursor-pointer z-50"
                  style="left: 460px;"
                >
                  <svg class="w-6 h-6 text-om-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Single Image -->
            <div v-else>
              <img
                src="/image-with-badge/image-1-mobile.jpg"
                alt="Product with badge mobile"
                class="h-128 w-auto shrink-0 rounded-xl shadow-lg object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, computed, onMounted, onBeforeUnmount } from 'vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { CircleCheckBig } from 'lucide-vue-next'
import Checkbox from '../components/shared/Checkbox.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import Button from '../components/shared/Button.vue'

const productUrl = ref('https://www.whiskynet.hu/shankys-whip-black-irish-whiskey-likor-07l-33')
const isLoading = ref(false)
const showInitialLoading = ref(true)
const showImage = ref(false)
const showPreview = ref(false)
const showDashboard = ref(false)
const showSuccessModal = ref(false)
const includePeople = ref(false)
const selectedLanguage = ref('hu')
const selectedBadgeDesign = ref('product')
const selectedPosition = ref(1)
const previewContainer = ref(null)
const mobilePreviewContainer = ref(null)
const showMorePreviews = ref(false)
const morePreviewsLoading = ref(false)
const showScreenshot = ref(false)
const previewLoading = ref(false)
const showSlider = ref(false)
const currentImageIndex = ref(0)
const sliderLoading = ref(false)

const additionalPreviewImages = [
  '/image-with-badge/image-2-mobile.jpg',
  '/image-with-badge/image-3-mobile.jpg'
]

const sliderImages = [
  '/image-with-badge/image-1-mobile.jpg',
  '/image-with-badge/image-2-mobile.jpg',
  '/image-with-badge/image-3-mobile.jpg'
]

// Activities for loading screen
const activities = ref([
  { text: 'Analyzing product pages', visible: false, completed: false },
  { text: 'Collecting product images', visible: false, completed: false },
  { text: 'Image generation in progress', visible: false, completed: false }
])

let screenshotTimeout = null
let activityTimeouts = []

// Start initial loading on mount
onMounted(() => {
  // Show screenshot after 2 seconds
  screenshotTimeout = setTimeout(() => {
    showScreenshot.value = true
  }, 2000)

  // Show and complete activities sequentially (slower timing)
  // Activity 1: Show at 2.5s, complete at 4.5s
  activityTimeouts.push(
    setTimeout(() => {
      activities.value[0].visible = true
    }, 2500)
  )
  activityTimeouts.push(
    setTimeout(() => {
      activities.value[0].completed = true
    }, 4500)
  )

  // Activity 2: Show at 5.5s, complete at 7.5s
  activityTimeouts.push(
    setTimeout(() => {
      activities.value[1].visible = true
    }, 5500)
  )
  activityTimeouts.push(
    setTimeout(() => {
      activities.value[1].completed = true
    }, 7500)
  )

  // Activity 3: Show at 8.5s, complete at 10.5s
  activityTimeouts.push(
    setTimeout(() => {
      activities.value[2].visible = true
    }, 8500)
  )
  activityTimeouts.push(
    setTimeout(() => {
      activities.value[2].completed = true
    }, 10500)
  )

  // Finish loading after 12 seconds
  activityTimeouts.push(
    setTimeout(() => {
      showInitialLoading.value = false
      showImage.value = true
    }, 12000)
  )
})

// Cleanup timeouts on unmount
onBeforeUnmount(() => {
  if (screenshotTimeout) {
    clearTimeout(screenshotTimeout)
    screenshotTimeout = null
  }
  activityTimeouts.forEach(timeout => clearTimeout(timeout))
  activityTimeouts = []
})

// Computed property to track current step
const currentStep = computed(() => {
  if (showDashboard.value) return 3
  if (showPreview.value) return 2
  return 1
})

const languageOptions = [
  { value: 'hu', label: 'Magyar' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'es', label: 'Español' }
]

const badgeDesignOptions = [
  { value: 'product', label: 'Product design' },
  { value: 'brand', label: 'Webshop brand design' }
]

const handleSubmit = () => {
  console.log('Product URL:', productUrl.value)
  isLoading.value = true
  showImage.value = false

  setTimeout(() => {
    isLoading.value = false
    showImage.value = true
  }, 3000)
}

const handleRegenerate = () => {
  console.log('Regenerate with:', {
    url: productUrl.value,
    includePeople: includePeople.value,
    language: selectedLanguage.value,
    badgeDesign: selectedBadgeDesign.value
  })
  // TODO: Regenerate images with new settings
  isLoading.value = true
  showImage.value = false
  showMorePreviews.value = false
  morePreviewsLoading.value = false
  showSlider.value = false
  sliderLoading.value = false

  setTimeout(() => {
    isLoading.value = false
    showImage.value = true
  }, 3000)
}

const handleCheckMorePreviews = () => {
  console.log('More previews clicked, switching to carousel')
  showSlider.value = true
  currentImageIndex.value = 0
  sliderLoading.value = true

  // After 5 seconds, show the actual images
  setTimeout(() => {
    sliderLoading.value = false
  }, 5000)
}

const handleContinue = () => {
  console.log('Continue with selected images')
  // Small delay to ensure smooth transition
  setTimeout(() => {
    showPreview.value = true
    previewLoading.value = true

    // Show actual preview content after 3 seconds
    setTimeout(() => {
      previewLoading.value = false
    }, 3000)
  }, 10)
}

const handleActivateCampaign = () => {
  console.log('Activate campaign with position:', selectedPosition.value)
  // Show success modal
  showSuccessModal.value = true
}

// Carousel navigation functions
const nextImage = () => {
  if (currentImageIndex.value < sliderImages.length - 1) {
    currentImageIndex.value++
  }
}

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const goToImage = (index) => {
  currentImageIndex.value = index
}

const getImagePosition = (index) => {
  const diff = index - currentImageIndex.value

  if (diff === 0) {
    // Current image - main focus without border
    return 'z-40 shadow-2xl'
  } else if (diff === 1) {
    // Next image to the right
    return 'z-30 hover:scale-105'
  } else if (diff === 2) {
    // Second image to the right
    return 'z-20 hover:scale-105'
  } else {
    // Hidden images (previous images or far future images)
    return 'z-10 opacity-0 pointer-events-none'
  }
}

const getImageStyle = (index) => {
  const diff = index - currentImageIndex.value

  if (diff === 0) {
    // Current image - positioned on the left side
    return {
      height: '500px',
      transform: 'translateX(0) scale(1)',
      left: '50px'
    }
  } else if (diff === 1) {
    // Next image - to the right, overlapping more behind current image
    return {
      height: '400px',
      transform: 'translateX(0) scale(0.85)',
      left: '200px'
    }
  } else if (diff === 2) {
    // Second image - further to the right, overlapping more behind first next image
    return {
      height: '340px',
      transform: 'translateX(0) scale(0.75)',
      left: '310px'
    }
  } else {
    // Hidden images
    return {
      height: '340px',
      transform: diff < 0 ? 'translateX(0) scale(0.7)' : 'translateX(0) scale(0.7)',
      left: diff < 0 ? '-200px' : '420px',
      opacity: 0
    }
  }
}

// Scroll after image loads
const onImageLoad = () => {
  // Desktop preview scroll
  if (previewContainer.value) {
    setTimeout(() => {
      const start = previewContainer.value.scrollTop
      const target = 300
      const duration = 2000
      const startTime = performance.now()

      const animateScroll = (currentTime) => {
        if (!previewContainer.value) return

        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        const easeInOutCubic = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2

        previewContainer.value.scrollTop = start + (target - start) * easeInOutCubic

        if (progress < 1) {
          requestAnimationFrame(animateScroll)
        }
      }

      requestAnimationFrame(animateScroll)
    }, 500)
  }

  // Mobile preview scroll
  if (mobilePreviewContainer.value) {
    setTimeout(() => {
      const start = mobilePreviewContainer.value.scrollTop
      const target = 630
      const duration = 2000
      const startTime = performance.now()

      const animateScroll = (currentTime) => {
        if (!mobilePreviewContainer.value) return

        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        const easeInOutCubic = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2

        mobilePreviewContainer.value.scrollTop = start + (target - start) * easeInOutCubic

        if (progress < 1) {
          requestAnimationFrame(animateScroll)
        }
      }

      requestAnimationFrame(animateScroll)
    }, 500)
  }
}

// Dev navigation method
const devGoToStep = (step) => {
  if (step === 1) {
    showInitialLoading.value = false
    showImage.value = true
    showPreview.value = false
    showDashboard.value = false
    isLoading.value = false
    showMorePreviews.value = false
    morePreviewsLoading.value = false
    showSlider.value = false
    sliderLoading.value = false
  } else if (step === 2) {
    showInitialLoading.value = false
    showImage.value = true
    showPreview.value = true
    showDashboard.value = false
    isLoading.value = false
    showMorePreviews.value = false
    morePreviewsLoading.value = false
    showSlider.value = false
    sliderLoading.value = false
  } else if (step === 3) {
    showInitialLoading.value = false
    showImage.value = true
    showPreview.value = true
    showDashboard.value = true
    isLoading.value = false
    showMorePreviews.value = false
    morePreviewsLoading.value = false
    showSlider.value = false
    sliderLoading.value = false
  }
}

// Expose for parent component
defineExpose({
  currentStep,
  devGoToStep
})
</script>

<style scoped>
/* Scanner animation container */
.scanner-container-custom {
  width: 574px;
  height: 350px;
}

.scanner-inner-custom {
  width: 820px;
  height: 500px;
  transform: scale(0.7);
  transform-origin: top left;
}

/* Fade transition for screenshot */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide up animation for activity boxes */
.slide-up-enter-active {
  transition: all 0.6s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
