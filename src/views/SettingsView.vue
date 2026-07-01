<template>
  <DashboardLayout :active-menu-item="layoutActiveMenuItem" :nav-items="layoutNavItems" :logo-src="layoutLogoSrc" background-color="#F9FAFB" :no-content-padding="true" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="flex gap-12 min-h-full">
        <!-- Settings Sidebar -->
        <aside class="w-60 shrink-0 bg-white px-6 pb-4 pt-6 border-r border-[#E5E7EB]">
          <h2 class="text-2xl font-semibold text-om-gray-700 mb-6 ml-1">{{ sidebarTitle }}</h2>

          <!-- Contact information -->
          <div v-if="showGroup('contact')" class="mb-5">
            <p class="text-sm font-semibold text-om-gray-700 mb-1 px-2">Contact information</p>
            <nav class="flex flex-col pl-2">
              <button
                v-for="item in contactItems"
                :key="item.id"
                @click="handleSectionClick(item.id)"
                :class="navItemClass(item.id)"
              >{{ item.label }}</button>
            </nav>
          </div>

          <!-- Billing -->
          <div v-if="showGroup('billing')" class="mb-5">
            <p class="text-sm font-semibold text-om-gray-700 mb-1 px-2">Billing</p>
            <nav class="flex flex-col pl-2">
              <button
                v-for="item in billingItems"
                :key="item.id"
                @click="handleSectionClick(item.id)"
                :class="navItemClass(item.id)"
              >{{ item.label }}</button>
            </nav>
          </div>

          <!-- Products -->
          <div v-if="showGroup('products')" class="mb-5">
            <p v-if="!navGroups" class="text-sm font-semibold text-om-gray-700 mb-1 px-2">Products</p>
            <nav class="flex flex-col pl-2">
              <button
                v-for="item in productsItems"
                :key="item.id"
                @click="handleSectionClick(item.id)"
                :class="navItemClass(item.id)"
              >{{ item.label }}</button>
            </nav>
          </div>

          <!-- Account -->
          <div v-if="showGroup('account')">
            <p class="text-sm font-semibold text-om-gray-700 mb-1 px-2">Account</p>
            <nav class="flex flex-col pl-2">
              <button
                v-for="item in accountItems"
                :key="item.id"
                @click="handleSectionClick(item.id)"
                :class="navItemClass(item.id)"
              >{{ item.label }}</button>
            </nav>
          </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 min-w-0 py-8 pr-12">
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
            <h1 class="text-xl font-bold text-om-gray-700 mb-2">Change email address</h1>
            <p class="text-sm text-om-gray-500 mb-8">Enter your new email address and we'll send you a verification email to confirm you're the owner.</p>
            <div class="max-w-sm space-y-6">
              <FormInput v-model="newEmail" label="New email address" type="email" placeholder="New email address" />
              <FormInput v-model="confirmEmail" label="Confirm new email address" type="email" placeholder="New email address" />
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

          <!-- AI Texts & Images V1 embedded -->
          <template v-else-if="activeSection === 'products-ai-texts-images-v1'">
            <AiTextsImagesV1View
              :screen="embeddedScreen"
              :embedded="true"
              @navigate="handleEmbeddedNavigateV1"
            />
          </template>

          <!-- AI Texts & Images V2 embedded -->
          <template v-else-if="activeSection === 'products-ai-texts-images-v2'">
            <AiTextsImagesV2View
              :screen="embeddedScreen"
              :embedded="true"
              @navigate="handleEmbeddedNavigateV2"
            />
          </template>

          <!-- AI Texts & Images V2 Feedbacks embedded -->
          <template v-else-if="activeSection === 'products-ai-texts-images-v2-feedbacks'">
            <AiTextsImagesV2FeedbacksView
              :screen="embeddedScreen"
              :embedded="true"
              @navigate="handleEmbeddedNavigateV2Feedbacks"
            />
          </template>

          <!-- AI Texts & Images V2 Feedbacks Modal embedded -->
          <template v-else-if="activeSection === 'products-ai-texts-images-v2-feedbacks-modal'">
            <AiTextsImagesV2FeedbacksModalView
              :screen="embeddedScreen"
              :embedded="true"
              @navigate="handleEmbeddedNavigateV2FeedbacksModal"
            />
          </template>

          <!-- AI Texts & Images V2 Next Product embedded -->
          <template v-else-if="activeSection === 'products-ai-texts-images-v2-next-product'">
            <AiTextsImagesV2NextProductView
              :screen="embeddedScreen"
              :embedded="true"
              @navigate="handleEmbeddedNavigateV2NextProduct"
            />
          </template>

          <!-- AI Texts & Images V2 Next Product (AI Input) embedded -->
          <template v-else-if="activeSection === 'products-ai-texts-images-v2-next-product-ai-input'">
            <AiTextsImagesV2NextProductAiInputView
              :screen="embeddedScreen"
              :embedded="true"
              @navigate="handleEmbeddedNavigateV2NextProductAiInput"
            />
          </template>

          <!-- AI Texts & Images V2 Parent · Child Product embedded -->
          <template v-else-if="activeSection === 'products-ai-texts-images-v2-parent-child-product'">
            <AiTextsImagesV2ParentChildProductView
              :screen="embeddedScreen"
              :embedded="true"
              @navigate="handleEmbeddedNavigateV2ParentChildProduct"
            />
          </template>

          <!-- AI Texts & Images V2 (AI Input on preview pages) embedded -->
          <template v-else-if="activeSection === 'products-ai-texts-images-v2-ai-input'">
            <AiTextsImagesV2AiInputView
              :screen="embeddedScreen"
              :embedded="true"
              @navigate="handleEmbeddedNavigateV2AiInput"
            />
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
import { ref, computed, watch } from 'vue'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import FormInput from '../components/shared/FormInput.vue'
import Button from '../components/shared/Button.vue'
import RadioButton from '../components/shared/RadioButton.vue'
import AiTextsImagesView from './AiTextsImagesView.vue'
import AiTextsImagesV1View from './AiTextsImagesV1View.vue'
import AiTextsImagesV2View from './AiTextsImagesV2View.vue'
import AiTextsImagesV2FeedbacksView from './AiTextsImagesV2FeedbacksView.vue'
import AiTextsImagesV2FeedbacksModalView from './AiTextsImagesV2FeedbacksModalView.vue'
import AiTextsImagesV2NextProductView from './AiTextsImagesV2NextProductView.vue'
import AiTextsImagesV2NextProductAiInputView from './AiTextsImagesV2NextProductAiInputView.vue'
import AiTextsImagesV2ParentChildProductView from './AiTextsImagesV2ParentChildProductView.vue'
import AiTextsImagesV2AiInputView from './AiTextsImagesV2AiInputView.vue'

const props = defineProps({
  initialSection: { type: String, default: 'personal-details' },
  initialScreen: { type: String, default: 'list' },
  // Limit which sidebar groups are shown. null = all groups (default Settings).
  // e.g. ['products'] renders only the Products group (used by Conversion Lift).
  navGroups: { type: Array, default: null },
  // Override the left settings sidebar heading (default "Settings").
  sidebarTitle: { type: String, default: 'Settings' },
  // Forwarded to the app's DashboardLayout (icon rail).
  layoutActiveMenuItem: { type: String, default: '' },
  layoutNavItems: { type: Array, default: null },
  layoutLogoSrc: { type: String, default: '' },
})

const showGroup = (group) => !props.navGroups || props.navGroups.includes(group)

const emit = defineEmits(['menu-click', 'navigate'])

const activeSection = ref(props.initialSection)

watch(() => props.initialSection, (val) => { activeSection.value = val })
watch(() => props.initialScreen, (val) => { embeddedScreen.value = val })

// Form values
const accountLanguage = ref('EN')

const lastName = ref('Szántai')
const firstName = ref('Tibor')
const currentEmail = ref('tibor.szabo+62@optimonk.com')
const newEmail = ref('')
const confirmEmail = ref('')
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

const productsItems = [
  { id: 'products-ai-texts-images-v2', label: 'AI Texts & Images' },
  { id: 'products-product-catalog', label: 'Product catalog' },
  { id: 'products-ai-recommendations', label: 'AI recommendations' },
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

const allItems = [...contactItems, ...billingItems, ...productsItems, ...accountItems]

const currentSectionTitle = computed(() => {
  return allItems.find(i => i.id === activeSection.value)?.label || ''
})

const navItemClass = (id) => {
  const base = 'text-left text-sm py-1.5 px-3 rounded-lg transition-colors cursor-pointer w-full font-medium'
  if (activeSection.value === id) {
    return `${base} bg-[#FEEFEA] text-[#ED5A29]`
  }
  return `${base} text-om-gray-600 hover:bg-[#F1F2F4]`
}

const handleSave = () => {
  // no-op for prototype
}

const sectionRouteMap = {
  'products-ai-texts-images-v2': 'settings-ai-texts-images-v2',
  'products-ai-texts-images-v2-feedbacks': 'settings-ai-texts-images-v2-feedbacks',
  'products-ai-texts-images-v2-feedbacks-modal': 'settings-ai-texts-images-v2-feedbacks-modal',
  'products-ai-texts-images-v2-next-product': 'settings-ai-texts-images-v2-next-product',
  'products-ai-texts-images-v2-next-product-ai-input': 'settings-ai-texts-images-v2-next-product-ai-input',
  'products-ai-texts-images-v2-parent-child-product': 'settings-ai-texts-images-v2-parent-child-product',
  'products-ai-texts-images-v2-ai-input': 'settings-ai-texts-images-v2-ai-input',
}

const handleSectionClick = (id) => {
  activeSection.value = id
  if (id === 'products-ai-texts-images-v2') {
    embeddedScreen.value = 'list'
  }
  if (id === 'products-ai-texts-images-v2-feedbacks') {
    embeddedScreen.value = 'generation'
  }
  if (id === 'products-ai-texts-images-v2-feedbacks-modal') {
    embeddedScreen.value = 'generation'
  }
  if (id === 'products-ai-texts-images-v2-next-product') {
    embeddedScreen.value = 'generation'
  }
  if (id === 'products-ai-texts-images-v2-next-product-ai-input') {
    embeddedScreen.value = 'generation'
  }
  if (id === 'products-ai-texts-images-v2-parent-child-product') {
    embeddedScreen.value = 'generation'
  }
  if (id === 'products-ai-texts-images-v2-ai-input') {
    embeddedScreen.value = 'image-preview'
  }
  if (sectionRouteMap[id]) {
    emit('navigate', sectionRouteMap[id])
  }
}

// Embedded AI Texts & Images navigation
const embeddedScreen = ref(props.initialScreen)
const screenMap = {
  'ai-texts-images': 'list',
  'ai-texts-images-new': 'new',
  'ai-texts-images-presets': 'image-presets',
  'ai-texts-images-preview': 'image-preview',
  'ai-texts-images-choose-products': 'choose-products',
  'ai-texts-images-generation': 'generation',
  'ai-texts-images-generation-product': 'generation-product',
  'ai-texts-images-add-products': 'add-products',
  'ai-texts-images-text-presets': 'text-presets',
  'ai-texts-images-text-generation': 'text-generation',
}
const handleEmbeddedNavigate = (route) => {
  embeddedScreen.value = screenMap[route] ?? 'list'
  emit('navigate', 'settings-' + route)
}

const screenMapV1 = {
  'ai-texts-images-v1': 'list',
  'ai-texts-images-v1-new': 'new',
  'ai-texts-images-v1-presets': 'image-presets',
  'ai-texts-images-v1-preview': 'image-preview',
  'ai-texts-images-v1-choose-products': 'choose-products',
  'ai-texts-images-v1-generation': 'generation',
  'ai-texts-images-v1-add-products': 'add-products',
  'ai-texts-images-v1-text-presets': 'text-presets',
  'ai-texts-images-v1-text-generation': 'text-generation',
}
const handleEmbeddedNavigateV1 = (route) => {
  embeddedScreen.value = screenMapV1[route] ?? 'list'
  emit('navigate', 'settings-' + route)
}

const screenMapV2 = {
  'ai-texts-images-v2': 'list',
  'ai-texts-images-v2-new': 'new',
  'ai-texts-images-v2-presets': 'image-presets',
  'ai-texts-images-v2-preview': 'image-preview',
  'ai-texts-images-v2-choose-products': 'choose-products',
  'ai-texts-images-v2-generation': 'generation',
  'ai-texts-images-v2-generation-product': 'generation-product',
  'ai-texts-images-v2-add-products': 'add-products',
  'ai-texts-images-v2-text-presets': 'text-presets',
  'ai-texts-images-v2-text-preview': 'text-preview',
  'ai-texts-images-v2-text-generation': 'text-generation',
  'ai-texts-images-v2-workflow-presets': 'workflow-presets',
  'ai-texts-images-v2-workflow-editor': 'workflow-editor',
  'ai-texts-images-v2-workflow-generation': 'workflow-generation',
}
const handleEmbeddedNavigateV2 = (route) => {
  embeddedScreen.value = screenMapV2[route] ?? 'list'
  emit('navigate', 'settings-' + route)
}

const handleEmbeddedNavigateV2Feedbacks = (route) => {
  embeddedScreen.value = screenMapV2[route] ?? 'generation'
  emit('navigate', 'settings-' + route)
}

const handleEmbeddedNavigateV2FeedbacksModal = (route) => {
  embeddedScreen.value = screenMapV2[route] ?? 'generation'
  emit('navigate', 'settings-' + route)
}

const handleEmbeddedNavigateV2NextProduct = (route) => {
  // Internal screen changes stay inside the next-product frame.
  // Bubbling up to App.vue would switch the URL to a generic v2 sub-route
  // and remount the regular V2 view instead of NextProductView.
  embeddedScreen.value = screenMapV2[route] ?? 'generation'
}

const handleEmbeddedNavigateV2NextProductAiInput = (route) => {
  // Same containment logic as the next-product handler above.
  embeddedScreen.value = screenMapV2[route] ?? 'generation'
}

const handleEmbeddedNavigateV2ParentChildProduct = (route) => {
  // Same containment logic as the next-product handler above.
  embeddedScreen.value = screenMapV2[route] ?? 'generation'
}

const handleEmbeddedNavigateV2AiInput = (route) => {
  // Mirrors handleEmbeddedNavigateV2 but keeps navigation contained inside
  // the AI Input variant frame (don't bubble up to App.vue or the URL would
  // switch to the regular V2 sub-route and remount the standard view).
  embeddedScreen.value = screenMapV2[route] ?? 'list'
}
</script>

