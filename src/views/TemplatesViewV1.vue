<template>
  <div class="templates-view">
    <DashboardLayout
      active-menu-item="library"
      @menu-click="handleMenuClick"
      background-color="#FFFFFF"
      :no-content-padding="true"
    >
      <template #content>
        <div class="templates-layout">
          <!-- Left Sidebar -->
          <aside class="templates-sidebar">
            <!-- Navigation Tabs -->
            <div class="sidebar-tabs">
              <button class="sidebar-tab active">
                <Home :size="20" />
                <span>All templates</span>
              </button>
              <button class="sidebar-tab">
                <Paintbrush :size="20" />
                <span>Themes</span>
              </button>
              <button class="sidebar-tab">
                <FolderOpen :size="20" />
                <span>Use Cases</span>
              </button>
              <button class="sidebar-tab">
                <Edit :size="20" />
                <span>Create Blank</span>
              </button>
            </div>

            <!-- Search -->
            <div class="sidebar-search">
              <input type="text" placeholder="Search" />
              <Search :size="18" class="search-icon" />
            </div>

            <!-- Goals Section -->
            <div class="sidebar-section">
              <h3 class="sidebar-section-title">Goals</h3>
              <div class="sidebar-checkboxes">
                <label class="checkbox-item" @click="goals.listBuilding = !goals.listBuilding">
                  <button
                    :class="[
                      'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all',
                      goals.listBuilding
                        ? 'bg-om-orange-500 border-om-orange-500'
                        : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                    ]"
                  >
                    <Check v-if="goals.listBuilding" :size="14" class="text-white" stroke-width="3" />
                  </button>
                  <span>List Building</span>
                </label>
                <label class="checkbox-item" @click="goals.cartAbandonment = !goals.cartAbandonment">
                  <button
                    :class="[
                      'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all',
                      goals.cartAbandonment
                        ? 'bg-om-orange-500 border-om-orange-500'
                        : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                    ]"
                  >
                    <Check v-if="goals.cartAbandonment" :size="14" class="text-white" stroke-width="3" />
                  </button>
                  <span>Reduce Cart Abandonment</span>
                </label>
                <label class="checkbox-item" @click="goals.averageOrderValue = !goals.averageOrderValue">
                  <button
                    :class="[
                      'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all',
                      goals.averageOrderValue
                        ? 'bg-om-orange-500 border-om-orange-500'
                        : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                    ]"
                  >
                    <Check v-if="goals.averageOrderValue" :size="14" class="text-white" stroke-width="3" />
                  </button>
                  <span>Increase Average Order Value</span>
                </label>
                <label class="checkbox-item" @click="goals.feedback = !goals.feedback">
                  <button
                    :class="[
                      'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all',
                      goals.feedback
                        ? 'bg-om-orange-500 border-om-orange-500'
                        : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                    ]"
                  >
                    <Check v-if="goals.feedback" :size="14" class="text-white" stroke-width="3" />
                  </button>
                  <span>Collect Feedback</span>
                </label>
                <label class="checkbox-item" @click="goals.visitorDirection = !goals.visitorDirection">
                  <button
                    :class="[
                      'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all',
                      goals.visitorDirection
                        ? 'bg-om-orange-500 border-om-orange-500'
                        : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                    ]"
                  >
                    <Check v-if="goals.visitorDirection" :size="14" class="text-white" stroke-width="3" />
                  </button>
                  <span>Direct Visitors</span>
                </label>
                <label class="checkbox-item" @click="goals.conversion = !goals.conversion">
                  <button
                    :class="[
                      'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all',
                      goals.conversion
                        ? 'bg-om-orange-500 border-om-orange-500'
                        : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                    ]"
                  >
                    <Check v-if="goals.conversion" :size="14" class="text-white" stroke-width="3" />
                  </button>
                  <span>Increase Conversion</span>
                </label>
                <label class="checkbox-item" @click="goals.salesPromotion = !goals.salesPromotion">
                  <button
                    :class="[
                      'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all',
                      goals.salesPromotion
                        ? 'bg-om-orange-500 border-om-orange-500'
                        : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                    ]"
                  >
                    <Check v-if="goals.salesPromotion" :size="14" class="text-white" stroke-width="3" />
                  </button>
                  <span>Promote Sales</span>
                </label>
              </div>
            </div>

            <!-- Content Section -->
            <div class="sidebar-section">
              <h3 class="sidebar-section-title">Content</h3>
              <div class="sidebar-checkboxes">
                <label class="checkbox-item" @click="content.kupon = !content.kupon">
                  <button
                    :class="[
                      'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all',
                      content.kupon
                        ? 'bg-om-orange-500 border-om-orange-500'
                        : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                    ]"
                  >
                    <Check v-if="content.kupon" :size="14" class="text-white" stroke-width="3" />
                  </button>
                  <span>Coupon</span>
                </label>
                <label class="checkbox-item" @click="content.szerencsekerek = !content.szerencsekerek">
                  <button
                    :class="[
                      'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all',
                      content.szerencsekerek
                        ? 'bg-om-orange-500 border-om-orange-500'
                        : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                    ]"
                  >
                    <Check v-if="content.szerencsekerek" :size="14" class="text-white" stroke-width="3" />
                  </button>
                  <span>Lucky Wheel</span>
                </label>
                <label class="checkbox-item" @click="content.termekajanlo = !content.termekajanlo">
                  <button
                    :class="[
                      'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all',
                      content.termekajanlo
                        ? 'bg-om-orange-500 border-om-orange-500'
                        : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                    ]"
                  >
                    <Check v-if="content.termekajanlo" :size="14" class="text-white" stroke-width="3" />
                  </button>
                  <span>Product Recommender</span>
                </label>
                <label class="checkbox-item" @click="content.visszaszamlalo = !content.visszaszamlalo">
                  <button
                    :class="[
                      'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all',
                      content.visszaszamlalo
                        ? 'bg-om-orange-500 border-om-orange-500'
                        : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                    ]"
                  >
                    <Check v-if="content.visszaszamlalo" :size="14" class="text-white" stroke-width="3" />
                  </button>
                  <span>Countdown</span>
                </label>
                <label class="checkbox-item" @click="content.felmeres = !content.felmeres">
                  <button
                    :class="[
                      'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all',
                      content.felmeres
                        ? 'bg-om-orange-500 border-om-orange-500'
                        : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                    ]"
                  >
                    <Check v-if="content.felmeres" :size="14" class="text-white" stroke-width="3" />
                  </button>
                  <span>Survey</span>
                </label>
                <label class="checkbox-item" @click="content.feedback = !content.feedback">
                  <button
                    :class="[
                      'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all',
                      content.feedback
                        ? 'bg-om-orange-500 border-om-orange-500'
                        : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                    ]"
                  >
                    <Check v-if="content.feedback" :size="14" class="text-white" stroke-width="3" />
                  </button>
                  <span>Feedback</span>
                </label>
                <label class="checkbox-item" @click="content.ajandekvalaszto = !content.ajandekvalaszto">
                  <button
                    :class="[
                      'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all',
                      content.ajandekvalaszto
                        ? 'bg-om-orange-500 border-om-orange-500'
                        : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                    ]"
                  >
                    <Check v-if="content.ajandekvalaszto" :size="14" class="text-white" stroke-width="3" />
                  </button>
                  <span>Gift Selector</span>
                </label>
                <label class="checkbox-item" @click="content.kaparosSorsjegy = !content.kaparosSorsjegy">
                  <button
                    :class="[
                      'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all',
                      content.kaparosSorsjegy
                        ? 'bg-om-orange-500 border-om-orange-500'
                        : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                    ]"
                  >
                    <Check v-if="content.kaparosSorsjegy" :size="14" class="text-white" stroke-width="3" />
                  </button>
                  <span>Scratch Card</span>
                </label>
              </div>
            </div>

            <!-- Message Type Section -->
            <div class="sidebar-section">
              <h3 class="sidebar-section-title">Message Type</h3>
              <div class="sidebar-checkboxes">
                <label class="checkbox-item" @click="messageType.beagyazhato = !messageType.beagyazhato">
                  <button
                    :class="[
                      'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all',
                      messageType.beagyazhato
                        ? 'bg-om-orange-500 border-om-orange-500'
                        : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                    ]"
                  >
                    <Check v-if="messageType.beagyazhato" :size="14" class="text-white" stroke-width="3" />
                  </button>
                  <span>Embedded</span>
                </label>
                <label class="checkbox-item" @click="messageType.stickyBar = !messageType.stickyBar">
                  <button
                    :class="[
                      'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all',
                      messageType.stickyBar
                        ? 'bg-om-orange-500 border-om-orange-500'
                        : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                    ]"
                  >
                    <Check v-if="messageType.stickyBar" :size="14" class="text-white" stroke-width="3" />
                  </button>
                  <span>Sticky bar</span>
                </label>
                <label class="checkbox-item" @click="messageType.popup = !messageType.popup">
                  <button
                    :class="[
                      'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all',
                      messageType.popup
                        ? 'bg-om-orange-500 border-om-orange-500'
                        : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                    ]"
                  >
                    <Check v-if="messageType.popup" :size="14" class="text-white" stroke-width="3" />
                  </button>
                  <span>Popup</span>
                </label>
                <label class="checkbox-item" @click="messageType.sidemessage = !messageType.sidemessage">
                  <button
                    :class="[
                      'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all',
                      messageType.sidemessage
                        ? 'bg-om-orange-500 border-om-orange-500'
                        : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                    ]"
                  >
                    <Check v-if="messageType.sidemessage" :size="14" class="text-white" stroke-width="3" />
                  </button>
                  <span>Sidemessage</span>
                </label>
              </div>
            </div>
          </aside>

          <!-- Main Content -->
          <main class="templates-main">
            <!-- Header -->
            <div class="templates-header">
              <h1>What will you create today?</h1>
              <div class="language-selector-wrapper">
                <label class="language-label">Template Language</label>
                <div class="language-selector w-[240px]">
                  <Dropdown
                    v-model="selectedLanguage"
                    :options="languageOptions"
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <!-- Popup Types -->
            <div class="popup-types">
              <div class="popup-type-box">
                <img src="/type_popup.svg" alt="Popup" class="popup-type-icon" />
                <span class="popup-type-label">Popup</span>
              </div>
              <div class="popup-type-box">
                <img src="/type_wheel.svg" alt="Gamification" class="popup-type-icon" />
                <span class="popup-type-label">Gamification</span>
              </div>
              <div class="popup-type-box">
                <img src="/type_stickybar.svg" alt="Sticky Bar" class="popup-type-icon" />
                <span class="popup-type-label">Sticky Bar</span>
              </div>
              <div class="popup-type-box">
                <img src="/type_side.svg" alt="Sidemessage" class="popup-type-icon" />
                <span class="popup-type-label">Sidemessage</span>
              </div>
              <div class="popup-type-box">
                <img src="/type_embedded.svg" alt="Embedded" class="popup-type-icon" />
                <span class="popup-type-label">Embedded</span>
              </div>
              <div class="popup-type-box">
                <img src="/type_new.svg" alt="Image popup" class="popup-type-icon" />
                <span class="popup-type-label">Image popup</span>
              </div>
            </div>

            <!-- Featured Families Section -->
            <div class="featured-families">
              <h2 class="featured-families-title">Featured families</h2>
              <div class="carousel-wrapper">
                <button
                  v-if="showFamilyLeftArrow"
                  class="carousel-nav-button carousel-nav-left"
                  @click="scrollCarouselLeft"
                >
                  <ChevronRight :size="24" style="transform: rotate(180deg);" />
                </button>
                <div class="families-carousel" ref="carouselRef" @scroll="handleFamilyScroll">
                  <div class="family-item">
                    <img src="/family_essential.png" alt="Family Essential" class="family-image" />
                  </div>
                  <div class="family-item">
                    <img src="/family_black.png" alt="Family Black" class="family-image" />
                  </div>
                  <div class="family-item">
                    <img src="/family_midnight.png" alt="Family Midnight" class="family-image" />
                  </div>
                </div>
                <button class="carousel-nav-button carousel-nav-right" @click="scrollCarouselRight">
                  <ChevronRight :size="24" />
                </button>
              </div>
            </div>

            <!-- Upcoming Seasons Section -->
            <div class="upcoming-seasons">
              <h2 class="upcoming-seasons-title">Upcoming seasons</h2>
              <div class="seasons-carousel-wrapper">
                <button
                  v-if="showSeasonLeftArrow"
                  class="seasons-nav-button seasons-nav-left"
                  @click="scrollSeasonsCarouselLeft"
                >
                  <ChevronRight :size="24" style="transform: rotate(180deg);" />
                </button>
                <div class="seasons-carousel" ref="seasonsCarouselRef" @scroll="handleSeasonsScroll">
                  <div class="season-item">
                    <img src="/season_1.png" alt="Season 1" class="season-image" />
                  </div>
                  <div class="season-item">
                    <img src="/season_2.png" alt="Season 2" class="season-image" />
                  </div>
                  <div class="season-item">
                    <img src="/season_3.png" alt="Season 3" class="season-image" />
                  </div>
                </div>
                <button class="seasons-nav-button seasons-nav-right" @click="scrollSeasonsCarouselRight">
                  <ChevronRight :size="24" />
                </button>
              </div>
            </div>

            <!-- Recommended Use Cases Section -->
            <div class="recommended-usecases">
              <h2 class="recommended-usecases-title">Recommended use cases</h2>
              <div class="usecases-grid">
                <div class="usecase-card">
                  <div class="usecase-image-wrapper">
                    <img src="/usecase_1.png" alt="Use Case 1" class="usecase-image" />
                  </div>
                  <h3 class="usecase-title">Use Case Title 1</h3>
                  <p class="usecase-subtext">Description for use case 1</p>
                </div>
                <div class="usecase-card">
                  <div class="usecase-image-wrapper">
                    <img src="/usecase_2.png" alt="Use Case 2" class="usecase-image" />
                  </div>
                  <h3 class="usecase-title">Use Case Title 2</h3>
                  <p class="usecase-subtext">Description for use case 2</p>
                </div>
                <div class="usecase-card">
                  <div class="usecase-image-wrapper">
                    <img src="/usecase_3.png" alt="Use Case 3" class="usecase-image" />
                  </div>
                  <h3 class="usecase-title">Use Case Title 3</h3>
                  <p class="usecase-subtext">Description for use case 3</p>
                </div>
              </div>
            </div>

            <!-- My Theme Telekom Section -->
            <div class="my-theme-telekom">
              <h2 class="my-theme-telekom-title">My theme Telekom</h2>
              <div class="telekom-grid">
                <div class="telekom-card">
                  <div class="telekom-image-wrapper"></div>
                  <h3 class="telekom-title">Telekom Template 1</h3>
                </div>
                <div class="telekom-card">
                  <div class="telekom-image-wrapper"></div>
                  <h3 class="telekom-title">Telekom Template 2</h3>
                </div>
                <div class="telekom-card">
                  <div class="telekom-image-wrapper"></div>
                  <h3 class="telekom-title">Telekom Template 3</h3>
                </div>
              </div>
            </div>

            <!-- Content will go here -->
            <div class="templates-content">
              <!-- Templates will be added in next step -->
            </div>
          </main>
        </div>
      </template>
    </DashboardLayout>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Check, ChevronRight, Home, Paintbrush, FolderOpen, Edit, Search } from 'lucide-vue-next'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Dropdown from '../components/shared/Dropdown.vue'

const emit = defineEmits(['menu-click'])

const handleMenuClick = (menuId) => {
  emit('menu-click', menuId)
}

// Goals checkboxes state
const goals = ref({
  listBuilding: false,
  cartAbandonment: false,
  averageOrderValue: false,
  feedback: false,
  visitorDirection: false,
  conversion: false,
  salesPromotion: false
})

// Content checkboxes state
const content = ref({
  kupon: false,
  szerencsekerek: false,
  termekajanlo: false,
  visszaszamlalo: false,
  felmeres: false,
  feedback: false,
  ajandekvalaszto: false,
  kaparosSorsjegy: false
})

// Message Type checkboxes state
const messageType = ref({
  beagyazhato: false,
  stickyBar: false,
  popup: false,
  sidemessage: false
})

// Language dropdown state
const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'hu', label: 'Magyar' },
  { value: 'de', label: 'Deutsch' }
]
const selectedLanguage = ref(languageOptions[0])

// Carousel navigation
const carouselRef = ref(null)
const seasonsCarouselRef = ref(null)
const showFamilyLeftArrow = ref(false)
const showSeasonLeftArrow = ref(false)

const scrollCarouselRight = () => {
  if (carouselRef.value) {
    const scrollAmount = 700 // Width of one item + gap
    carouselRef.value.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    })
  }
}

const scrollCarouselLeft = () => {
  if (carouselRef.value) {
    const scrollAmount = 700 // Width of one item + gap
    carouselRef.value.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    })
  }
}

const handleFamilyScroll = () => {
  if (carouselRef.value) {
    showFamilyLeftArrow.value = carouselRef.value.scrollLeft > 10
  }
}

const scrollSeasonsCarouselRight = () => {
  if (seasonsCarouselRef.value) {
    const scrollAmount = 434 // Width of one item + gap
    seasonsCarouselRef.value.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    })
  }
}

const scrollSeasonsCarouselLeft = () => {
  if (seasonsCarouselRef.value) {
    const scrollAmount = 434 // Width of one item + gap
    seasonsCarouselRef.value.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    })
  }
}

const handleSeasonsScroll = () => {
  if (seasonsCarouselRef.value) {
    showSeasonLeftArrow.value = seasonsCarouselRef.value.scrollLeft > 10
  }
}

</script>

<style scoped>
.templates-layout {
  display: flex;
  height: 100%;
  background: #FFFFFF;
  overflow: hidden;
}

/* Left Sidebar */
.templates-sidebar {
  width: 280px;
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  overflow-y: auto;
  flex-shrink: 0;
}

.sidebar-tabs {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
}

.sidebar-tab {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.sidebar-tab:hover {
  background: #F3F4F6;
  color: #374151;
}

.sidebar-tab.active {
  background: #FEEFEA;
  color: #ED5A29;
}

.sidebar-tab svg {
  flex-shrink: 0;
}

/* Search */
.sidebar-search {
  position: relative;
  margin-bottom: 1.5rem;
}

.sidebar-search input {
  width: 100%;
  padding: 0.625rem 2.5rem 0.625rem 0.875rem;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #374151;
  background: white;
}

.sidebar-search input::placeholder {
  color: #9CA3AF;
}

.sidebar-search .search-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9CA3AF;
  pointer-events: none;
}

/* Sidebar Section */
.sidebar-section {
  margin-bottom: 1.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
}

.sidebar-section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.75rem;
}

.sidebar-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
}

.checkbox-item button {
  flex-shrink: 0;
}

/* Main Content */
.templates-main {
  flex: 1;
  overflow-y: auto;
}

.templates-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 3rem 0.5rem 3rem;
}

.templates-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
}

.language-selector-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.language-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
}

/* Popup Types */
.popup-types {
  display: flex;
  gap: 0;
  padding: 0 3rem 2rem 3rem;
}

.popup-type-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  background: transparent;
}

.popup-type-box:hover {
  opacity: 0.7;
}

.popup-type-icon {
  width: 160px;
  height: 160px;
  aspect-ratio: 1/1;
  object-fit: contain;
}

.popup-type-label {
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
  margin-top: -0.5rem;
  text-align: center;
}

/* Featured Families */
.featured-families {
  padding: 0 3rem 2rem 3rem;
}

.featured-families-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
}

.carousel-wrapper {
  position: relative;
}

.families-carousel {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.families-carousel::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.carousel-nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  border: 1px solid #E5E7EB;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.carousel-nav-right {
  right: -24px;
}

.carousel-nav-left {
  left: -24px;
}

.carousel-nav-button:hover {
  background: #F9FAFB;
  border-color: #D1D5DB;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.carousel-nav-button:active {
  transform: translateY(-50%) scale(0.95);
}

.family-item {
  flex-shrink: 0;
  width: 680px;
  cursor: pointer;
  transition: all 0.2s;
}

.family-item:hover {
  opacity: 0.8;
}

.family-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 20px;
}

/* Upcoming Seasons */
.upcoming-seasons {
  padding: 3rem 3rem 2rem 3rem;
}

.upcoming-seasons-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
}

.seasons-carousel-wrapper {
  position: relative;
}

.seasons-carousel {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.seasons-carousel::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.seasons-nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  border: 1px solid #E5E7EB;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.seasons-nav-right {
  right: -24px;
}

.seasons-nav-left {
  left: -24px;
}

.seasons-nav-button:hover {
  background: #F9FAFB;
  border-color: #D1D5DB;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.seasons-nav-button:active {
  transform: translateY(-50%) scale(0.95);
}

.season-item {
  flex-shrink: 0;
  width: 410px;
  cursor: pointer;
  transition: all 0.2s;
}

.season-item:hover {
  opacity: 0.8;
}

.season-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 20px;
}

/* Recommended Use Cases */
.recommended-usecases {
  padding: 3rem 3rem 2rem 3rem;
}

.recommended-usecases-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
}

.usecases-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.usecase-card {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s;
}

.usecase-card:hover {
  opacity: 0.8;
}

.usecase-image-wrapper {
  background-color: #FEF7F3;
  aspect-ratio: 3 / 2;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.usecase-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.usecase-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.usecase-subtext {
  font-size: 0.875rem;
  color: #6B7280;
  line-height: 1.5;
}

/* My Theme Telekom */
.my-theme-telekom {
  padding: 3rem 3rem 2rem 3rem;
}

.my-theme-telekom-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
}

.telekom-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.telekom-card {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s;
}

.telekom-card:hover {
  opacity: 0.8;
}

.telekom-image-wrapper {
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #E5E7EB;
}

.telekom-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.telekom-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.templates-content {
  padding: 2rem 3rem;
}
</style>
