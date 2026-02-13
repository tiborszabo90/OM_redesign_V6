<template>
  <div class="min-h-screen bg-white flex items-center justify-center relative">
    <!-- Optimonk Logo -->
    <img
      src="https://www.optimonk.com/wp-content/uploads/optimonk-logo-2024.svg"
      alt="OptiMonk"
      class="absolute top-6 left-6 h-8"
    />

    <div :class="['w-full px-8', !showImage && !showPreview ? 'max-w-2xl' : '']">
      <!-- Photo Style Selection Section -->
      <div v-if="!showImage && !isLoading">
        <h1 class="text-2xl font-semibold text-om-gray-700 mb-6 text-center">
          Choose photo style
        </h1>
        <div class="flex gap-4 justify-center">
          <!-- Style 1 -->
          <button
            @click="handleStyleSelect(1)"
            class="group relative rounded-xl overflow-hidden border-2 border-om-gray-200 hover:border-om-orange-500 transition-all cursor-pointer hover:shadow-lg"
            style="width: 280px; height: 400px;"
          >
            <img
              src="/image-with-badge1m.jpg"
              alt="Style 1"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"></div>
          </button>

          <!-- Style 2 -->
          <button
            @click="handleStyleSelect(2)"
            class="group relative rounded-xl overflow-hidden border-2 border-om-gray-200 hover:border-om-orange-500 transition-all cursor-pointer hover:shadow-lg"
            style="width: 280px; height: 400px;"
          >
            <img
              src="/image-with-badge1m.jpg"
              alt="Style 2"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"></div>
          </button>

          <!-- Style 3 -->
          <button
            @click="handleStyleSelect(3)"
            class="group relative rounded-xl overflow-hidden border-2 border-om-gray-200 hover:border-om-orange-500 transition-all cursor-pointer hover:shadow-lg"
            style="width: 280px; height: 400px;"
          >
            <img
              src="/image-with-badge1m.jpg"
              alt="Style 3"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"></div>
          </button>
        </div>
      </div>

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
      </div>

      <!-- Image Result / Loading State -->
      <div v-else-if="showImage || isLoading">
        <!-- Skeleton Loading -->
        <div v-if="isLoading" class="flex gap-4 w-fit mx-auto">
          <div class="h-96 shrink-0 rounded-xl bg-om-gray-200 animate-pulse" style="aspect-ratio: 0.695;"></div>
          <div class="h-96 shrink-0 rounded-xl bg-om-gray-200 animate-pulse" style="aspect-ratio: 0.562;"></div>
        </div>

        <!-- Actual Images -->
        <div v-else class="flex gap-4 w-fit mx-auto">
          <img
            src="/image-with-badge1.jpg"
            alt="Product with badge"
            class="h-96 w-auto shrink-0 rounded-xl shadow-lg object-contain"
          />
          <img
            src="/image-with-badge1m.jpg"
            alt="Product with badge mobile"
            class="h-96 w-auto shrink-0 rounded-xl shadow-lg object-contain"
          />
        </div>

        <!-- Checkbox and Dropdown -->
        <div class="mt-6 flex items-center justify-center gap-4">
          <Checkbox
            v-model="includePeople"
            label="Include people in the image"
          />
          <div class="w-48">
            <Dropdown
              v-model="selectedLanguage"
              :options="languageOptions"
              placeholder="Language"
              size="sm"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            @click="handleRegenerate"
          >
            Regenerate
          </Button>
        </div>

        <!-- Action Buttons -->
        <div class="mt-6 flex items-center justify-center gap-3">
          <Button
            variant="primary"
            size="md"
            @click="handleContinue"
          >
            Next to the insert
          </Button>
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
const showImage = ref(false)
const showPreview = ref(false)
const includePeople = ref(false)
const selectedLanguage = ref('hu')
const selectedPosition = ref(1)
const previewContainer = ref(null)
const mobilePreviewContainer = ref(null)

// Computed property to track current step
const currentStep = computed(() => {
  if (showPreview.value) return 3
  if (showImage.value || isLoading.value) return 2
  return 1
})

const languageOptions = [
  { value: 'hu', label: 'Magyar' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'es', label: 'Español' }
]

const handleStyleSelect = (styleId) => {
  console.log('Selected style:', styleId)
  isLoading.value = true
  showImage.value = false

  setTimeout(() => {
    isLoading.value = false
    showImage.value = true
  }, 3000)
}

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
    showImage.value = false
    showPreview.value = false
    isLoading.value = false
  } else if (step === 2) {
    showImage.value = true
    showPreview.value = false
    isLoading.value = false
  } else if (step === 3) {
    showImage.value = true
    showPreview.value = true
    isLoading.value = false
  }
}

// Expose for parent component
defineExpose({
  currentStep,
  devGoToStep
})
</script>
