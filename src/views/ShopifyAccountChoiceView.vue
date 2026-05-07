<template>
  <div class="h-full bg-white flex flex-col relative overflow-hidden">
    <!-- Logo top-left -->
    <img
      src="/OM-Logo-primary-basic.svg"
      alt="OptiMonk"
      class="absolute top-8 left-8 h-8 z-10"
    />

    <!-- Centered content -->
    <div class="flex-1 flex items-center justify-center px-6">
      <div class="w-full max-w-[680px] flex flex-col items-center text-center">

        <!-- Waving monk illustration -->
        <img
          src="/monk-hi-user.svg"
          alt=""
          class="w-44 h-44 object-contain mb-2 monk-pop-in"
        />

        <h1 class="text-4xl md:text-5xl font-bold text-om-gray-700 mb-3 font-headline">
          Hi {{ firstName }}!
        </h1>
        <p class="text-base text-om-gray-500 mb-10 max-w-[460px]">
          Welcome to OptiMonk. If you've already registered earlier, just login to your account. If not, create a new one.
        </p>

        <!-- Two choice cards -->
        <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ChoiceCard
            title="Create new OptiMonk account"
            description="First time here"
            @click="emit('create-account')"
          >
            <template #icon><Plus :size="22" /></template>
          </ChoiceCard>

          <ChoiceCard
            title="Login to my OptiMonk account"
            description="Connect existing account"
            @click="emit('login')"
          >
            <template #icon><KeyRound :size="22" /></template>
          </ChoiceCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Plus, KeyRound } from 'lucide-vue-next'
import ChoiceCard from '../components/shared/ChoiceCard.vue'

const props = defineProps({
  registrationData: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['create-account', 'login'])

const firstName = computed(() => props.registrationData?.firstName || 'Csaba')
</script>

<style scoped>
@keyframes monk-pop-in {
  from { transform: scale(0.85); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.monk-pop-in {
  animation: monk-pop-in 0.4s ease-out both;
}
</style>
