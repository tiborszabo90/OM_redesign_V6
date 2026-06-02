<template>
  <Teleport to="body">
    <transition name="reg-modal-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="close"
      >
        <div class="bg-white rounded-2xl overflow-hidden max-w-4xl w-full flex shadow-2xl h-155 relative">
          <!-- Close button -->
          <button
            @click="close"
            class="absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-om-gray-500 hover:text-om-gray-700 hover:bg-om-gray-100 rounded-lg transition-colors cursor-pointer z-10"
            aria-label="Close"
          >
            <X :size="20" />
          </button>

          <!-- Left: Form -->
          <div class="w-1/2 py-10 px-10 flex flex-col relative">
            <img src="/OM-Logo-primary-basic.svg" alt="OptiMonk" class="h-7 shrink-0 self-start mb-6" />

            <transition name="reg-modal-step-fade" mode="out-in">
              <div :key="modalStep" class="flex-1 flex flex-col justify-center">
                <template v-if="modalStep === 'buttons'">
                  <h2 class="text-2xl font-bold text-om-gray-700 mb-1">{{ title }}</h2>
                  <p class="text-om-gray-500 mb-8">{{ subtitle }}</p>

                  <div class="flex flex-col gap-3">
                    <button class="w-full h-12 px-4 rounded-xl border border-om-gray-200 bg-white text-om-gray-700 text-sm font-medium flex items-center justify-center gap-2 hover:bg-om-gray-50 transition-colors cursor-pointer" @click="modalStep = 'email-form'">
                      <Mail :size="18" /> Continue with Email
                    </button>
                    <button class="w-full h-12 px-4 rounded-xl border border-om-gray-200 bg-white text-om-gray-700 text-sm font-medium flex items-center justify-center gap-2 hover:bg-om-gray-50 transition-colors cursor-pointer" @click="complete('google')">
                      <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                      </svg>
                      Continue with Google
                    </button>
                    <button class="w-full h-12 px-4 rounded-xl border border-om-gray-200 bg-white text-om-gray-700 text-sm font-medium flex items-center justify-center gap-2 hover:bg-om-gray-50 transition-colors cursor-pointer" @click="complete('shopify')">
                      <img src="/icons/shopify-logo.svg" alt="Shopify" class="w-4.5 h-4.5 object-contain" />
                      Continue with Shopify
                    </button>
                  </div>

                  <p class="text-xs text-om-gray-400 text-center mt-6">
                    By submitting this form, you agree to the
                    <a href="#" class="text-om-orange-500 hover:underline">Terms of Service</a>
                    and
                    <a href="#" class="text-om-orange-500 hover:underline">Privacy Policy</a>.
                  </p>

                  <button
                    v-if="dismissible"
                    @click="close"
                    class="mt-4 text-xs text-om-gray-400 hover:text-om-gray-600 underline cursor-pointer text-center w-full transition-colors"
                  >
                    I don't want to register
                  </button>
                </template>

                <template v-else-if="modalStep === 'email-form'">
                  <h2 class="text-2xl font-bold text-om-gray-700 mb-1">{{ title }}</h2>
                  <p class="text-om-gray-500 mb-6">{{ subtitle }}</p>

                  <form @submit.prevent="complete('email')" class="space-y-3">
                    <div class="flex gap-3">
                      <div class="flex-1">
                        <label class="block text-sm font-medium text-om-gray-700 mb-1.5">First name</label>
                        <input v-model="emailFormData.firstName" type="text" placeholder="John" required
                          class="w-full px-3 py-2.5 border border-om-gray-200 rounded-xl focus:ring-2 focus:ring-om-orange-400 focus:border-transparent transition-colors text-om-gray-700 text-sm" />
                      </div>
                      <div class="flex-1">
                        <label class="block text-sm font-medium text-om-gray-700 mb-1.5">Last name</label>
                        <input v-model="emailFormData.lastName" type="text" placeholder="Doe" required
                          class="w-full px-3 py-2.5 border border-om-gray-200 rounded-xl focus:ring-2 focus:ring-om-orange-400 focus:border-transparent transition-colors text-om-gray-700 text-sm" />
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-om-gray-700 mb-1.5">Business email</label>
                      <input v-model="emailFormData.email" type="email" placeholder="john@company.com" required
                        class="w-full px-3 py-2.5 border border-om-gray-200 rounded-xl focus:ring-2 focus:ring-om-orange-400 focus:border-transparent transition-colors text-om-gray-700 text-sm" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-om-gray-700 mb-1.5">Password (8+ characters)</label>
                      <input v-model="emailFormData.password" type="password" placeholder="Enter your password" minlength="8" required
                        class="w-full px-3 py-2.5 border border-om-gray-200 rounded-xl focus:ring-2 focus:ring-om-orange-400 focus:border-transparent transition-colors text-om-gray-700 text-sm" />
                    </div>
                    <button type="submit"
                      class="w-full py-3 bg-om-orange-500 text-white font-medium rounded-xl hover:bg-om-orange-600 transition-colors cursor-pointer text-sm">
                      Get Started
                    </button>
                  </form>
                </template>
              </div>
            </transition>

            <button v-if="modalStep !== 'buttons'" @click="modalStep = 'buttons'"
              class="flex items-center gap-1.5 text-sm text-om-gray-500 hover:text-om-gray-700 cursor-pointer mt-4">
              <ChevronLeft :size="16" />
              Back
            </button>
          </div>

          <!-- Right: Why join us -->
          <div class="w-1/2 bg-om-peach-50 flex flex-col px-8 py-10 overflow-y-auto">
            <h2 class="text-om-gray-700 font-bold text-2xl mb-8">Why join us?</h2>
            <ul class="space-y-3 mb-8">
              <li v-for="item in whyJoinItems" :key="item" class="flex items-center gap-3">
                <span class="shrink-0 w-6 h-6 rounded-full bg-om-orange-500 flex items-center justify-center">
                  <Check :size="14" class="text-white" stroke-width="3" />
                </span>
                <span class="text-om-gray-600 text-base">{{ item }}</span>
              </li>
            </ul>
            <div class="flex items-center gap-2">
              <div class="flex">
                <svg v-for="i in 5" :key="i" width="22" height="22" viewBox="0 0 24 24" fill="#ED5A29" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <span class="text-om-gray-600 text-base">Trusted by 30,000+ businesses</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch, onBeforeUnmount } from 'vue'
import { Mail, Check, X, ChevronLeft } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Create your free account' },
  subtitle: { type: String, default: 'Sign up to open the editor' },
  dismissible: { type: Boolean, default: true },
  whyJoinItems: {
    type: Array,
    default: () => [
      'Personalized optimization strategies',
      'AI-powered conversion insights',
      'Real-time performance tracking',
      '100+ optimization solutions',
    ],
  },
})

const emit = defineEmits(['update:modelValue', 'register'])

const modalStep = ref('buttons')
const emailFormData = reactive({ firstName: '', lastName: '', email: '', password: '' })

const close = () => emit('update:modelValue', false)

const complete = (method) => {
  emit('register', { method, data: { ...emailFormData } })
  emit('update:modelValue', false)
}

// Reset to the first step each time the modal opens
watch(() => props.modelValue, (open) => {
  if (open) modalStep.value = 'buttons'
})

const onEsc = (e) => {
  if (e.key === 'Escape' && props.modelValue) close()
}
watch(() => props.modelValue, (open) => {
  if (open) window.addEventListener('keydown', onEsc)
  else window.removeEventListener('keydown', onEsc)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onEsc))
</script>

<style scoped>
.reg-modal-fade-enter-active,
.reg-modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.reg-modal-fade-enter-from,
.reg-modal-fade-leave-to {
  opacity: 0;
}

.reg-modal-step-fade-enter-active,
.reg-modal-step-fade-leave-active {
  transition: opacity 0.2s ease;
}
.reg-modal-step-fade-enter-from,
.reg-modal-step-fade-leave-to {
  opacity: 0;
}
</style>
