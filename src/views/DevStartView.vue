<template>
  <div class="min-h-screen-safe bg-white flex items-center justify-center">
    <div class="text-center">
      <div class="flex flex-col gap-4">
        <Button
          variant="outline"
          size="lg"
          @click="$emit('select', 'email')"
        >
          Email Registration
        </Button>

        <Button
          variant="outline"
          size="lg"
          @click="$emit('select', 'shopify')"
        >
          Shopify Registration
        </Button>

        <Button
          variant="outline"
          size="lg"
          @click="$emit('select', 'wizard')"
        >
          Wizard
        </Button>

        <Button
          variant="outline"
          size="lg"
          @click="$emit('go-public-wizard')"
        >
          Public Wizard
        </Button>

        <Button
          variant="outline"
          size="lg"
          @click="$emit('go-home-onboarding')"
        >
          Home Onboarding
        </Button>

        <Button
          variant="outline"
          size="lg"
          @click="$emit('go-home')"
        >
          Home
        </Button>

        <Button
          variant="outline"
          size="lg"
          @click="$emit('go-design-guide')"
        >
          Design Guide
        </Button>

        <Button
          variant="outline"
          size="lg"
          @click="$emit('go-image-with-badge')"
        >
          Image with Badge
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from '../components/shared/Button.vue'

defineEmits(['select', 'go-home', 'go-home-onboarding', 'go-public-wizard', 'go-design-guide', 'go-image-with-badge'])
</script>
