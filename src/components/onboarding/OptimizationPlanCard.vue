<template>
  <!-- Three column layout: Text | Desktop preview | Mobile preview -->
  <div class="flex gap-12 items-center">
    <!-- Left column: Text and button -->
    <div :class="['flex-1 flex flex-col justify-center mt-4 mb-2', textPadding]">
      <div class="flex items-center gap-2 mb-2">
        <div :class="['rounded-lg flex items-center justify-center', iconWrapperClass]">
          <component :is="iconComponent" :size="14" class="text-om-gray-500" />
        </div>
        <span class="text-xs @[1000px]:text-sm font-medium text-om-gray-500 uppercase">{{ useCase.title }}</span>
      </div>
      <h3 class="text-xl @[1000px]:text-2xl font-semibold text-om-gray-700 mb-3">{{ useCase.description }}</h3>
      <p class="text-sm @[1000px]:text-base text-om-gray-500 mb-4">{{ useCase.subheadline }}</p>
      <button class="px-5 py-2.5 text-base font-medium text-white bg-om-orange-500 rounded-lg hover:bg-om-orange-400 transition-colors w-fit flex items-center gap-2">
        <span>Show more</span>
        <ChevronRight :size="20" />
      </button>
    </div>

    <!-- Previews container -->
    <div class="flex gap-3 shrink-0 items-center">
      <!-- Desktop Preview -->
      <div class="bg-white border border-om-gray-200 rounded-lg h-48 @[1000px]:h-72 @[1200px]:h-80 @[1400px]:h-96 aspect-video overflow-hidden relative">
        <div class="absolute top-0 left-0 w-[682px] h-[384px] origin-top-left scale-[0.50] @[1000px]:scale-[0.75] @[1200px]:scale-[0.83] @[1400px]:scale-[1.00]">
          <!-- Newsletter desktop -->
          <template v-if="useCase.id === 'newsletter'">
            <div class="flex w-full h-full">
              <div class="w-[25%] shrink-0 bg-white flex items-end justify-center rounded-l-lg">
                <img src="/SmartDiscountPopup_img.png" alt="Smart Discount" class="h-3/4 object-contain" />
              </div>
              <div class="flex-1 px-8 py-6 flex flex-col justify-center text-center">
                <img src="/telekom_logo2.png" alt="Logo" class="w-14 h-14 object-contain mb-3 mx-auto" />
                <h4 class="text-2xl font-bold mb-2 leading-tight" :style="{ color: brandColor }">Tiéd a 10% KUPON</h4>
                <p class="text-sm text-om-gray-500 mb-4">Csapj le rá, mielőtt eltűnik!</p>
                <button class="w-full py-3 text-white text-sm font-bold mb-2" :class="cornerClass" :style="{ backgroundColor: brandColor }">KÉREM A 10%-OT</button>
                <button class="w-full py-3 text-sm font-bold border-2" :class="cornerClass" :style="{ color: brandColor, borderColor: brandColor, backgroundColor: 'white' }">NEM, KÖSZ!</button>
              </div>
              <div class="w-[25%] shrink-0 bg-white flex items-end justify-center rounded-r-lg">
                <img src="/SmartDiscountPopup_img.png" alt="Smart Discount" class="h-3/4 object-contain" />
              </div>
            </div>
          </template>

          <!-- Cart Abandonment desktop -->
          <template v-else-if="useCase.id === 'cart-abandonment'">
            <div class="relative w-full h-full bg-cover bg-center" style="background-image: url('/templatebg.svg')">
              <div class="absolute inset-0 flex items-center justify-center p-6">
                <div class="bg-white rounded-lg shadow-lg flex w-[85%] h-[90%]">
                  <div class="flex-1 px-8 py-5 flex flex-col justify-center">
                    <p class="text-[10px] mb-2 uppercase tracking-wide font-bold" :style="{ color: brandColor }">VÁRJ</p>
                    <h4 class="text-xl font-bold mb-4 leading-tight" :style="{ color: brandColor }">Szerezz egy<br>10%-os kuport!</h4>
                    <div class="h-10 bg-white border border-om-gray-300 text-xs flex items-center px-3 text-om-gray-400 mb-3" :class="cornerClass">Email cím</div>
                    <button class="w-full py-2.5 text-white text-xs font-bold" :class="cornerClass" :style="{ backgroundColor: brandColor }">FOLYTATÁS</button>
                  </div>
                  <div class="w-[50%] shrink-0 bg-white flex items-center justify-center rounded-r-lg overflow-hidden">
                    <img src="/CartAbandonmentStopper_img.png" alt="Cart Abandonment" class="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- Lucky Wheel desktop -->
          <template v-else-if="useCase.id === 'spin-wheel'">
            <div class="relative w-full h-full bg-cover bg-center" style="background-image: url('/templatebg.svg')">
              <div class="absolute inset-0 flex items-center justify-start">
                <div class="bg-white shadow-lg flex w-[70%] h-full">
                  <div class="w-[50%] shrink-0 bg-white flex items-center justify-center overflow-hidden pr-2 py-4">
                    <img src="/LuckyWheel_img2.png" alt="Lucky Wheel" class="w-full h-auto object-contain" />
                  </div>
                  <div class="flex-1 px-8 py-5 flex flex-col justify-center">
                    <img src="/telekom_logo2.png" alt="Logo" class="w-8 h-8 object-contain mb-2" />
                    <h4 class="text-lg font-bold mb-2 leading-tight" :style="{ color: brandColor }">Pörgess, nyerj és<br>spórolj!</h4>
                    <p class="text-[11px] text-om-gray-500 mb-3 leading-relaxed">Úgy érzed, rád mosolyghat a szerencse?<br>Add meg az email címed, és pörgess!</p>
                    <div class="h-10 bg-white border border-om-gray-300 text-xs flex items-center px-3 text-om-gray-400 mb-3" :class="cornerClass">Email</div>
                    <button class="w-full py-2.5 text-white text-xs font-bold mb-2" :class="cornerClass" :style="{ backgroundColor: brandColor }">PÖRGETEK</button>
                    <button class="text-xs font-medium underline" :style="{ color: brandColor }">NEM, KÖSZ!</button>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- Feedback Survey desktop -->
          <template v-else-if="useCase.id === 'feedback'">
            <div class="relative w-full h-full bg-cover bg-center" style="background-image: url('/templatebg.svg')">
              <div class="absolute inset-0 flex items-center justify-center p-6">
                <div class="bg-white shadow-lg rounded-lg w-[60%] h-[80%] flex flex-col justify-center px-12 py-8 text-center">
                  <img src="/telekom_logo2.png" alt="Logo" class="w-8 h-8 object-contain mb-3 mx-auto" />
                  <h4 class="text-xl font-bold mb-2 leading-tight" :style="{ color: brandColor }">Van egy perced?<br>Mondd el a véleményed!</h4>
                  <p class="text-xs text-om-gray-500 mb-5 leading-relaxed">Hogyan értékelnéd az általános<br>tapasztalatsodat velünk?</p>
                  <div class="flex justify-center gap-4 mb-4">
                    <div v-for="i in 5" :key="i" class="w-10 h-10 rounded-full border-2 flex items-center justify-center text-base font-bold" :style="{ borderColor: brandColor, color: brandColor }">{{ i }}</div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- Fallback: image -->
          <template v-else>
            <img :src="useCase.image" :alt="useCase.title" class="w-full h-full object-cover" />
          </template>
        </div>
      </div>

      <!-- Mobile Preview -->
      <div class="bg-white border border-om-gray-200 rounded-lg h-72 @[1000px]:h-96 @[1200px]:h-112 @[1400px]:h-128 aspect-9/19 overflow-hidden relative">
        <div class="absolute top-0 left-0 w-[182px] h-[384px] origin-top-left scale-[0.75] @[1000px]:scale-[1.00] @[1200px]:scale-[1.17] @[1400px]:scale-[1.33]">
          <!-- Newsletter mobile -->
          <template v-if="useCase.id === 'newsletter'">
            <div class="flex flex-col w-full h-full">
              <div class="h-1/3 shrink-0 bg-white flex items-end justify-center rounded-t-lg">
                <img src="/SmartDiscountPopup_img.png" alt="Smart Discount" class="h-full object-contain" />
              </div>
              <div class="flex-1 px-4 pb-3 flex flex-col justify-center text-center">
                <img src="/telekom_logo2.png" alt="Logo" class="w-8 h-8 object-contain mb-1 mx-auto" />
                <h4 class="text-[13px] font-bold mb-2 leading-tight" :style="{ color: brandColor }">Tiéd a 10% KUPON</h4>
                <p class="text-[7px] text-om-gray-500 mb-2">Csapj le rá, mielőtt eltűnik!</p>
                <button class="w-full py-2 text-white text-[7px] font-bold mb-1.5" :class="cornerClass" :style="{ backgroundColor: brandColor }">KÉREM A 10%-OT</button>
                <button class="w-full py-2 text-[7px] font-bold border" :class="cornerClass" :style="{ color: brandColor, borderColor: brandColor, backgroundColor: 'white' }">NEM, KÖSZ!</button>
              </div>
            </div>
          </template>

          <!-- Cart abandonment mobile -->
          <template v-else-if="useCase.id === 'cart-abandonment'">
            <div class="relative w-full h-full flex items-center justify-center p-2" style="background-color: #6A8085">
              <div class="flex flex-col w-full h-[90%] bg-white rounded-lg overflow-hidden shadow-lg">
                <div class="h-2/5 shrink-0">
                  <img src="/CartAbandonmentStopper_img.png" alt="Cart Abandonment" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 px-4 py-3 flex flex-col justify-center">
                  <p class="text-[7px] text-om-gray-500 mb-2 uppercase tracking-wide">Vár a</p>
                  <h4 class="text-[12px] font-bold mb-3 leading-tight" :style="{ color: brandColor }">Szerezz egy<br>10%-os kuport!</h4>
                  <div class="h-5 bg-white border border-om-gray-300 rounded text-[7px] flex items-center px-2 text-om-gray-400 mb-3" :class="cornerClass">Email cím</div>
                  <button class="w-full py-2 text-white text-[7px] font-bold" :class="cornerClass" :style="{ backgroundColor: brandColor }">FOLYTATÁS</button>
                </div>
              </div>
            </div>
          </template>

          <!-- Spin wheel mobile -->
          <template v-else-if="useCase.id === 'spin-wheel'">
            <div class="flex flex-col w-full h-full">
              <div class="flex-1 px-4 py-3 flex flex-col justify-center text-center">
                <img src="/telekom_logo2.png" alt="Logo" class="w-8 h-8 object-contain mb-2 mx-auto" />
                <h4 class="text-[12px] font-bold mb-2 leading-tight" :style="{ color: brandColor }">Pörgess, nyerj és<br>spórolj!</h4>
                <p class="text-[6px] text-om-gray-500 mb-2 leading-snug">Úgy érzed, rád mosolyghat a szerencse?<br>Add meg az email címed, és pörgess!</p>
                <div class="h-5 bg-white border border-om-gray-300 rounded text-[7px] flex items-center px-2 text-om-gray-400 mb-2" :class="cornerClass">Email</div>
                <button class="w-full py-2 text-white text-[7px] font-bold mb-1" :class="cornerClass" :style="{ backgroundColor: brandColor }">PÖRGETEK</button>
                <button class="text-[7px] font-medium underline" :style="{ color: brandColor }">NEM, KÖSZ!</button>
              </div>
              <div class="h-1/3 shrink-0">
                <img src="/LuckyWheel_img.png" alt="Lucky Wheel" class="w-full h-full object-cover rounded-b-lg" />
              </div>
            </div>
          </template>

          <!-- Feedback mobile -->
          <template v-else-if="useCase.id === 'feedback'">
            <div class="relative w-full h-full flex items-center justify-center p-2" style="background-color: #6A8085">
              <div class="flex flex-col w-full h-1/2 bg-white rounded-lg shadow-lg justify-center px-4 py-5 text-center">
                <img src="/telekom_logo2.png" alt="Logo" class="w-8 h-8 object-contain mb-3 mx-auto" />
                <h4 class="text-[11px] font-bold mb-2 leading-tight" :style="{ color: brandColor }">Van egy perced?<br>Mondd el a véleményed!</h4>
                <p class="text-[6px] text-om-gray-500 mb-3 leading-snug">Hogyan értékelnéd az általános<br>tapasztalatsodat velünk?</p>
                <div class="flex justify-center gap-1 mb-2">
                  <div v-for="i in 5" :key="i" class="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[8px] font-bold" :style="{ borderColor: brandColor, color: brandColor }">{{ i }}</div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  useCase: {
    type: Object,
    required: true
  },
  brandColor: {
    type: String,
    required: true
  },
  cornerClass: {
    type: String,
    default: ''
  },
  iconComponent: {
    type: Object,
    default: null
  },
  variant: {
    type: String,
    default: 'v4' // 'v4' | 'v5'
  }
})

const textPadding = computed(() => props.variant === 'v5' ? 'pl-6' : 'pl-10 lg:pl-9')
const iconWrapperClass = computed(() => props.variant === 'v5' ? 'w-8 h-8 bg-om-gray-100' : 'w-6 h-6 bg-om-gray-200')
</script>
