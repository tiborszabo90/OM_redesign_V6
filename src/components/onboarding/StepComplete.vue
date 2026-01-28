<template>
  <div class="text-center">
    <div class="mb-6">
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <!-- uil-check -->
        <svg class="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71,7.21a1,1,0,0,0-1.42,0L9.84,14.67,6.71,11.53A1,1,0,1,0,5.29,13l3.84,3.84a1,1,0,0,0,1.42,0l8.16-8.16A1,1,0,0,0,18.71,7.21Z"/>
        </svg>
      </div>
    </div>
    <h2 class="text-3xl font-normal text-[#23262A] mb-4">All Set!</h2>
    <p class="text-lg text-[#505763] mb-6">
      Your profile has been successfully created. Welcome aboard!
    </p>

    <div class="bg-[#FEF3EF] rounded-lg p-6 mb-6">
      <h3 class="font-normal text-[#23262A] mb-3">Summary:</h3>
      <dl class="space-y-2 text-left">
        <div v-if="data.name" class="flex justify-between">
          <dt class="text-[#505763]">Name:</dt>
          <dd class="font-medium text-[#23262A]">{{ data.name }}</dd>
        </div>
        <div v-if="data.email" class="flex justify-between">
          <dt class="text-[#505763]">Email:</dt>
          <dd class="font-medium text-[#23262A]">{{ data.email }}</dd>
        </div>
        <div v-if="data.interests && data.interests.length" class="flex justify-between">
          <dt class="text-[#505763]">Interests:</dt>
          <dd class="font-medium text-[#23262A]">{{ data.interests.join(', ') }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
</script>
