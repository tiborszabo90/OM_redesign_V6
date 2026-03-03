<template>
  <DashboardLayout active-menu-item="" background-color="#ffffff" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="flex gap-12 -mt-3">
        <!-- Settings Sidebar -->
        <aside class="w-48 shrink-0">
          <h2 class="text-xl font-bold text-om-gray-700 mb-6">Settings</h2>

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
            <h1 class="text-2xl font-bold text-om-gray-700 mb-8">Personal details</h1>
            <div class="max-w-sm space-y-6">
              <FormInput v-model="lastName" label="Last name" />
              <FormInput v-model="firstName" label="First name" />

              <div>
                <p class="block text-sm font-medium text-om-gray-600 mb-2">Account language</p>
                <div class="flex flex-col gap-2">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="accountLanguage" value="EN" class="custom-radio cursor-pointer" />
                    <span class="text-sm text-om-gray-700">EN</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" v-model="accountLanguage" value="HU" class="custom-radio cursor-pointer" />
                    <span class="text-sm text-om-gray-700">HU</span>
                  </label>
                </div>
              </div>

              <div>
                <Button variant="primary" @click="handleSave">Save</Button>
              </div>
            </div>
          </template>

          <!-- Change email -->
          <template v-else-if="activeSection === 'change-email'">
            <h1 class="text-2xl font-bold text-om-gray-700 mb-8">Change email</h1>
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
            <h1 class="text-2xl font-bold text-om-gray-700 mb-8">Change password</h1>
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
            <h1 class="text-2xl font-bold text-om-gray-700 mb-8">{{ currentSectionTitle }}</h1>
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

<style scoped>
.custom-radio {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #D5D8DD;
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  position: relative;
  background-color: white;
  transition: all 0.2s ease;
}

.custom-radio:checked {
  border-color: #ED5A29;
  background-color: white;
}

.custom-radio:checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ED5A29;
}

.custom-radio:hover {
  border-color: #C44D24;
}

.custom-radio:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(237, 90, 41, 0.1);
}
</style>
