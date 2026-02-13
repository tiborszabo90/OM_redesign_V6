<template>
  <div class="min-h-screen bg-white flex items-center justify-center relative">
    <!-- Optimonk Logo -->
    <img
      src="https://www.optimonk.com/wp-content/uploads/optimonk-logo-2024.svg"
      alt="OptiMonk"
      class="absolute top-6 left-6 h-8"
    />

    <div class="w-full px-8">
      <!-- Preview Section -->
      <div v-if="showPreview" class="w-fit mx-auto">
        <div class="flex gap-4">
          <!-- Desktop Preview -->
          <div ref="previewContainer" class="overflow-auto rounded-xl border border-om-gray-200 shadow-lg" style="width: 720px; height: 400px;">
            <img
              src="/iwb_preview_1.png"
              alt="Preview"
              class="w-full h-auto"
              @load="onImageLoad"
            />
          </div>
          <!-- Mobile Preview -->
          <div ref="mobilePreviewContainer" class="overflow-auto rounded-xl border border-om-gray-200 shadow-lg" style="width: 220px; height: 400px;">
            <img
              src="/iwb_preview_1m.png"
              alt="Mobile Preview"
              class="w-full h-auto"
            />
          </div>
        </div>

        <!-- Position Buttons -->
        <div class="mt-4 flex gap-2 justify-center">
          <button
            @click="selectedPosition = 1"
            :class="[
              'chip px-3 py-1.5 rounded-lg text-om-gray-700 text-sm cursor-pointer transition-all duration-200 ease-out hover:scale-[1.02]',
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
              'chip px-3 py-1.5 rounded-lg text-om-gray-700 text-sm cursor-pointer transition-all duration-200 ease-out hover:scale-[1.02]',
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
              'chip px-3 py-1.5 rounded-lg text-om-gray-700 text-sm cursor-pointer transition-all duration-200 ease-out hover:scale-[1.02]',
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
              class="w-full px-4 py-3 border border-om-gray-200 rounded-xl text-om-gray-700 focus:outline-none focus:border-om-orange-500 focus:ring-2 focus:ring-om-orange-500/20 transition-all"
            />

            <!-- Controls -->
            <Checkbox
              v-model="includePeople"
              label="Include people in the image"
            />
            <div class="w-full">
              <Dropdown
                v-model="selectedLanguage"
                :options="languageOptions"
                placeholder="Language"
                size="md"
              />
            </div>
            <div class="flex gap-2">
              <Button
                variant="outline"
                size="md"
                @click="handleRegenerate"
                class="flex-1"
              >
                Regenerate
              </Button>
              <Button
                variant="outline"
                size="md"
                @click="handleCheckMorePreviews"
                class="flex-1"
              >
                More previews
              </Button>
            </div>

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

          <!-- Right side: Image or Slider -->
          <div>
            <!-- Skeleton Loading -->
            <div v-if="isLoading">
              <div class="h-128 shrink-0 rounded-xl bg-om-gray-200 animate-pulse" style="aspect-ratio: 0.562;"></div>
            </div>

            <!-- Slider -->
            <div v-else-if="showSlider" class="relative overflow-hidden" style="width: 800px; height: 580px;">
              <div class="relative w-full h-full flex items-center justify-center">
                <!-- Image carousel -->
                <div
                  v-for="(image, index) in sliderImages"
                  :key="index"
                  @click="goToImage(index)"
                  :class="[
                    'absolute transition-all duration-500 ease-out cursor-pointer rounded-xl',
                    getImagePosition(index)
                  ]"
                  :style="getImageStyle(index)"
                >
                  <img
                    :src="image"
                    :alt="`Product ${index + 1}`"
                    class="h-full w-auto object-contain rounded-xl"
                  />
                </div>

                <!-- Navigation Arrows -->
                <button
                  @click="prevImage"
                  class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 rounded-full shadow-xl flex items-center justify-center hover:bg-white hover:scale-110 transition-all cursor-pointer z-50"
                >
                  <svg class="w-6 h-6 text-om-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  @click="nextImage"
                  class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 rounded-full shadow-xl flex items-center justify-center hover:bg-white hover:scale-110 transition-all cursor-pointer z-50"
                >
                  <svg class="w-6 h-6 text-om-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <!-- Dots Navigation -->
              <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
                <button
                  v-for="(image, index) in sliderImages"
                  :key="index"
                  @click="goToImage(index)"
                  :class="[
                    'w-2 h-2 rounded-full transition-all cursor-pointer',
                    currentImageIndex === index
                      ? 'bg-om-orange-500 w-6'
                      : 'bg-white shadow-md hover:bg-om-gray-300'
                  ]"
                ></button>
              </div>
            </div>

            <!-- Single Image -->
            <div v-else>
              <img
                src="/image-with-badge1m.jpg"
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
import { ref, watch, nextTick, computed } from 'vue'
import Checkbox from '../components/shared/Checkbox.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import Button from '../components/shared/Button.vue'

const productUrl = ref('https://www.whiskynet.hu/shankys-whip-black-irish-whiskey-likor-07l-33')
const isLoading = ref(false)
const showImage = ref(true)
const showPreview = ref(false)
const includePeople = ref(false)
const selectedLanguage = ref('hu')
const selectedPosition = ref(1)
const previewContainer = ref(null)
const mobilePreviewContainer = ref(null)
const showSlider = ref(false)
const currentImageIndex = ref(0)

const sliderImages = [
  '/image-with-badge1m.jpg',
  '/image-with-badge2m.jpg',
  '/image-with-badge3m.jpg',
  '/image-with-badge4m.jpg',
  '/image-with-badge5m.jpg'
]

// Computed property to track current step
const currentStep = computed(() => {
  if (showPreview.value) return 2
  return 1
})

const languageOptions = [
  { value: 'hu', label: 'Magyar' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'es', label: 'Español' }
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
    language: selectedLanguage.value
  })
  // TODO: Regenerate images with new settings
  isLoading.value = true
  showImage.value = false
  showSlider.value = false
  currentImageIndex.value = 0

  setTimeout(() => {
    isLoading.value = false
    showImage.value = true
  }, 3000)
}

const handleContinue = () => {
  console.log('Continue with selected images')
  // Small delay to ensure smooth transition
  setTimeout(() => {
    showPreview.value = true
  }, 10)
}

const handleActivateCampaign = () => {
  console.log('Activate campaign with position:', selectedPosition.value)
  // TODO: Implement campaign activation
}

const handleCheckMorePreviews = () => {
  console.log('More previews clicked, showSlider before:', showSlider.value)
  showSlider.value = true
  currentImageIndex.value = 0
  console.log('More previews clicked, showSlider after:', showSlider.value)
  console.log('isLoading:', isLoading.value, 'showImage:', showImage.value)
}

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % sliderImages.length
}

const prevImage = () => {
  currentImageIndex.value = currentImageIndex.value === 0
    ? sliderImages.length - 1
    : currentImageIndex.value - 1
}

const goToImage = (index) => {
  currentImageIndex.value = index
}

const getImagePosition = (index) => {
  const diff = index - currentImageIndex.value
  const total = sliderImages.length

  // Normalize difference to handle circular navigation
  let normalizedDiff = diff
  if (Math.abs(diff) > total / 2) {
    normalizedDiff = diff > 0 ? diff - total : diff + total
  }

  const absDiff = Math.abs(normalizedDiff)

  if (normalizedDiff === 0) {
    return 'z-40 shadow-2xl ring-4 ring-om-orange-500'
  } else if (absDiff === 1) {
    return 'z-20 opacity-60 hover:opacity-85 hover:scale-105'
  } else {
    return 'z-10 opacity-0 pointer-events-none'
  }
}

const getImageStyle = (index) => {
  const diff = index - currentImageIndex.value
  const total = sliderImages.length

  // Normalize difference to handle circular navigation
  let normalizedDiff = diff
  if (Math.abs(diff) > total / 2) {
    normalizedDiff = diff > 0 ? diff - total : diff + total
  }

  const absDiff = Math.abs(normalizedDiff)

  if (normalizedDiff === 0) {
    // Center image - largest and in front
    return {
      height: '500px',
      transform: 'translateX(0) scale(1)',
      left: '50%',
      marginLeft: '-140px'
    }
  } else if (absDiff === 1) {
    // Side images behind center
    const xOffset = normalizedDiff > 0 ? 210 : -210
    return {
      height: '400px',
      transform: `translateX(${xOffset}px) scale(0.85)`,
      left: '50%',
      marginLeft: '-112px'
    }
  } else {
    // Hidden images
    const xOffset = normalizedDiff > 0 ? 350 : -350
    return {
      height: '340px',
      transform: `translateX(${xOffset}px) scale(0.7)`,
      left: '50%',
      marginLeft: '-180px'
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
    showImage.value = true
    showPreview.value = false
    isLoading.value = false
    showSlider.value = false
    currentImageIndex.value = 0
  } else if (step === 2) {
    showImage.value = true
    showPreview.value = true
    isLoading.value = false
    showSlider.value = false
    currentImageIndex.value = 0
  }
}

// Expose for parent component
defineExpose({
  currentStep,
  devGoToStep
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
