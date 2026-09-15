<script setup>
import { ref } from 'vue'
import { BRAND } from '../tokens'
import { account } from '../store'
import OqAccountLayout from '../components/OqAccountLayout.vue'
import OqPasswordStrength from '../components/OqPasswordStrength.vue'

const currentPassword = ref('')
const newPassword = ref('')
const changed = ref(false)
const newEmail = ref('')

const inputClass = 'mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[var(--oq-blue)]'
const inputStyle = { borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }
</script>

<template>
  <OqAccountLayout title="Security">
    <div class="max-w-md space-y-8">
      <form class="flex flex-col gap-4" @submit.prevent="changed = true">
        <h3 class="text-base font-semibold" :style="{ color: BRAND.ink }">Password</h3>
        <label class="text-sm font-medium" :style="{ color: BRAND.ink }">
          Current password
          <input v-model="currentPassword" type="password" autocomplete="current-password" required :class="inputClass" :style="inputStyle" />
        </label>
        <label class="text-sm font-medium" :style="{ color: BRAND.ink }">
          New password
          <input v-model="newPassword" type="password" autocomplete="new-password" minlength="8" required :class="inputClass" :style="inputStyle" />
          <OqPasswordStrength :password="newPassword" />
        </label>
        <p v-if="changed" class="text-sm" :style="{ color: BRAND.emeraldText }">
          Password changed. Every other signed-in browser was signed out.
        </p>
        <button
          type="submit"
          class="self-start rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
          :style="{ background: BRAND.blueSolid }"
        >
          Change password
        </button>
      </form>

      <div class="border-t pt-6" :style="{ borderColor: BRAND.gray200 }">
        <h3 class="text-base font-semibold" :style="{ color: BRAND.ink }">Email address</h3>
        <p class="mt-1 text-[13px]" :style="{ color: BRAND.gray500 }">
          Where invoices, catalogue alerts and password resets go. A change takes effect when you
          click the link we send to the new address — so a typo here cannot lock you out.
        </p>

        <label class="mt-4 block text-sm font-medium" :style="{ color: BRAND.ink }">
          Current email
          <input :value="account.email" disabled readonly :class="`${inputClass} opacity-70`" :style="inputStyle" />
        </label>
        <p class="mt-2 text-xs" :style="{ color: BRAND.emeraldText }">Confirmed.</p>

        <label class="mt-4 block text-sm font-medium" :style="{ color: BRAND.ink }">
          New email
          <input v-model="newEmail" type="email" placeholder="you@company.com" :class="inputClass" :style="inputStyle" />
        </label>
        <button
          type="button"
          :disabled="!newEmail"
          class="mt-3 rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          :style="{ background: BRAND.blueSolid }"
        >
          Send confirmation link
        </button>
      </div>
    </div>
  </OqAccountLayout>
</template>
