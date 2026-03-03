<template>
  <DashboardLayout active-menu-item="" background-color="#ffffff" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="flex gap-12 -mt-3">
        <!-- Settings Sidebar -->
        <aside class="w-48 shrink-0">
          <h2 class="text-2xl font-bold text-om-gray-700 mb-6">Settings</h2>

          <!-- Contact information -->
          <div class="mb-5">
            <p class="text-sm font-semibold text-om-gray-700 mb-1 px-2">Contact information</p>
            <nav class="flex flex-col">
              <button
                v-for="item in contactItems"
                :key="item.id"
                @click="activeSection = item.id"
                :class="navItemClass(item.id)"
              >{{ item.label }}</button>
            </nav>
          </div>

          <!-- Billing -->
          <div class="mb-5">
            <p class="text-sm font-semibold text-om-gray-700 mb-1 px-2">Billing</p>
            <nav class="flex flex-col">
              <button
                v-for="item in billingItems"
                :key="item.id"
                @click="activeSection = item.id"
                :class="navItemClass(item.id)"
              >{{ item.label }}</button>
            </nav>
          </div>

          <!-- Account -->
          <div>
            <p class="text-sm font-semibold text-om-gray-700 mb-1 px-2">Account</p>
            <nav class="flex flex-col">
              <button
                v-for="item in accountItems"
                :key="item.id"
                @click="activeSection = item.id"
                :class="navItemClass(item.id)"
              >{{ item.label }}</button>
            </nav>
          </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 min-w-0">
          <!-- Personal details -->
          <template v-if="activeSection === 'personal-details'">
            <h1 class="text-xl font-bold text-om-gray-700 mb-8">Personal details</h1>
            <div class="max-w-sm space-y-6">
              <FormInput v-model="lastName" label="Last name" />
              <FormInput v-model="firstName" label="First name" />

              <div>
                <p class="block text-sm font-medium text-om-gray-600 mb-2">Account language</p>
                <div class="flex flex-col gap-2">
                  <RadioButton v-model="accountLanguage" value="EN" label="EN" />
                  <RadioButton v-model="accountLanguage" value="HU" label="HU" />
                </div>
              </div>

              <div>
                <Button variant="primary" @click="handleSave">Save</Button>
              </div>
            </div>
          </template>

          <!-- Change email -->
          <template v-else-if="activeSection === 'change-email'">
            <h1 class="text-xl font-bold text-om-gray-700 mb-8">Change email</h1>
            <div class="max-w-sm space-y-6">
              <FormInput v-model="currentEmail" label="Current email" type="email" disabled />
              <FormInput v-model="newEmail" label="New email" type="email" placeholder="Enter new email" />
              <div>
                <Button variant="primary" @click="handleSave">Save</Button>
              </div>
            </div>
          </template>

          <!-- Change password -->
          <template v-else-if="activeSection === 'change-password'">
            <h1 class="text-xl font-bold text-om-gray-700 mb-8">Change password</h1>
            <div class="max-w-sm space-y-6">
              <FormInput v-model="currentPassword" label="Current password" type="password" placeholder="Enter current password" />
              <FormInput v-model="newPassword" label="New password" type="password" placeholder="Enter new password" />
              <FormInput v-model="confirmPassword" label="Confirm new password" type="password" placeholder="Repeat new password" />
              <div>
                <Button variant="primary" @click="handleSave">Save</Button>
              </div>
            </div>
          </template>

          <!-- Placeholder for all other sections -->
          <template v-else>
            <h1 class="text-xl font-bold text-om-gray-700 mb-8">{{ currentSectionTitle }}</h1>
            <p class="text-sm text-om-gray-400">Coming soon</p>
          </template>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import FormInput from '../components/shared/FormInput.vue'
import Button from '../components/shared/Button.vue'
import RadioButton from '../components/shared/RadioButton.vue'

defineEmits(['menu-click'])

const activeSection = ref('personal-details')

// Form values
const accountLanguage = ref('EN')

const lastName = ref('Szántai')
const firstName = ref('Tibor')
const currentEmail = ref('tibor.szabo+62@optimonk.com')
const newEmail = ref('')
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const contactItems = [
  { id: 'personal-details', label: 'Personal details' },
  { id: 'change-email', label: 'Change email' },
  { id: 'change-password', label: 'Change password' },
]

const billingItems = [
  { id: 'billing-address', label: 'Billing address' },
  { id: 'payment-method', label: 'Payment method' },
  { id: 'invoice-history', label: 'Invoice history' },
]

const accountItems = [
  { id: 'domains', label: 'Domains' },
  { id: 'email-notifications', label: 'Email notifications' },
  { id: 'users', label: 'Users' },
  { id: 'insert-code', label: 'Insert code' },
  { id: 'conversion-goals', label: 'Conversion goals' },
  { id: 'api-keys', label: 'API Keys' },
  { id: 'labs', label: 'Labs' },
]

const allItems = [...contactItems, ...billingItems, ...accountItems]

const currentSectionTitle = computed(() => {
  return allItems.find(i => i.id === activeSection.value)?.label || ''
})

const navItemClass = (id) => {
  const base = 'text-left text-sm py-1.5 px-2 rounded-lg transition-colors cursor-pointer w-full font-medium'
  if (activeSection.value === id) {
    return `${base} bg-[#FEEFEA] text-[#ED5A29]`
  }
  return `${base} text-om-gray-600 hover:bg-[#F1F2F4]`
}

const handleSave = () => {
  // no-op for prototype
}
</script>

