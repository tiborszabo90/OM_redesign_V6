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
          <!-- Main Content -->
          <main class="templates-main" ref="mainRef">
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

            <!-- NEW: Horizontal Filter Bar -->
            <div class="filters-bar" :class="{ 'filters-bar-scrolled': isScrolled }">
              <!-- Navigation Tabs -->
              <div class="sidebar-tabs">
                <button class="sidebar-tab">
                  <Paintbrush :size="20" />
                  <span>Featured Families</span>
                </button>
                <button class="sidebar-tab">
                  <Calendar :size="20" />
                  <span>Seasonal Templates</span>
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

              <!-- Goals Section -->
              <div class="filter-dropdown-wrapper">
                <MultiSelect
                  v-model="selectedGoals"
                  :options="goalsOptions"
                  placeholder="All goals"
                  size="sm"
                />
              </div>

              <!-- Content Section -->
              <div class="filter-dropdown-wrapper">
                <MultiSelect
                  v-model="selectedContent"
                  :options="contentOptions"
                  placeholder="All content"
                  size="sm"
                />
              </div>

              <!-- Search on right -->
              <div class="sidebar-search">
                <input type="text" placeholder="Search" />
                <Search :size="18" class="search-icon" />
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
              <div class="section-header">
                <h2 class="featured-families-title">Featured Families</h2>
                <button class="show-all-button">Show all themes</button>
              </div>
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
              <div class="section-header">
                <h2 class="upcoming-seasons-title">Upcoming Seasons</h2>
                <button class="show-all-button">Show all seasonal themes</button>
              </div>
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
              <div class="section-header">
                <h2 class="recommended-usecases-title">Recommended Use Cases</h2>
                <button class="show-all-button">Show all use cases</button>
              </div>
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
              <div class="section-header">
                <h2 class="my-theme-telekom-title">My Theme Telekom</h2>
                <button class="show-all-button">Show all</button>
              </div>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronRight, Paintbrush, FolderOpen, Edit, Search, Calendar } from 'lucide-vue-next'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import MultiSelect from '../components/shared/MultiSelect.vue'

const emit = defineEmits(['menu-click'])

const handleMenuClick = (menuId) => {
  emit('menu-click', menuId)
}

// Goals filter state
const selectedGoals = ref([])
const goalsOptions = [
  { value: 'listBuilding', label: 'List Building' },
  { value: 'cartAbandonment', label: 'Reduce Cart Abandonment' },
  { value: 'averageOrderValue', label: 'Increase Average Order Value' },
  { value: 'feedback', label: 'Collect Feedback' },
  { value: 'visitorDirection', label: 'Direct Visitors' },
  { value: 'conversion', label: 'Increase Conversion' },
  { value: 'salesPromotion', label: 'Promote Sales' }
]

// Content filter state
const selectedContent = ref([])
const contentOptions = [
  { value: 'kupon', label: 'Coupon' },
  { value: 'szerencsekerek', label: 'Lucky Wheel' },
  { value: 'termekajanlo', label: 'Product Recommender' },
  { value: 'visszaszamlalo', label: 'Countdown' },
  { value: 'felmeres', label: 'Survey' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'ajandekvalaszto', label: 'Gift Selector' },
  { value: 'kaparosSorsjegy', label: 'Scratch Card' }
]

// Language dropdown state
const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'hu', label: 'Magyar' },
  { value: 'de', label: 'Deutsch' }
]
const selectedLanguage = ref(languageOptions[0])

// Main scroll for sticky shadow
const mainRef = ref(null)
const isScrolled = ref(false)

const handleMainScroll = () => {
  if (mainRef.value) {
    isScrolled.value = mainRef.value.scrollTop > 0
  }
}

// Carousel navigation
const carouselRef = ref(null)
const seasonsCarouselRef = ref(null)
const showFamilyLeftArrow = ref(false)
const showSeasonLeftArrow = ref(false)

const scrollCarouselRight = () => {
  if (carouselRef.value) {
    const scrollAmount = 900 // Width of one item + gap
    carouselRef.value.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    })
  }
}

const scrollCarouselLeft = () => {
  if (carouselRef.value) {
    const scrollAmount = 900 // Width of one item + gap
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
    const scrollAmount = 550 // Width of one item + gap
    seasonsCarouselRef.value.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    })
  }
}

const scrollSeasonsCarouselLeft = () => {
  if (seasonsCarouselRef.value) {
    const scrollAmount = 550 // Width of one item + gap
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

onMounted(() => {
  if (mainRef.value) {
    mainRef.value.addEventListener('scroll', handleMainScroll)
  }
})

onUnmounted(() => {
  if (mainRef.value) {
    mainRef.value.removeEventListener('scroll', handleMainScroll)
  }
})
</script>

<style scoped>
.templates-layout {
  display: flex;
  background: #FFFFFF;
}

/* Main Content */
.templates-main {
  flex: 1;
  min-width: 0;
  width: 100%;
}

.templates-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 3rem 0.75rem 3rem;
  position: relative;
  z-index: 20;
  background: white;
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

/* NEW: Horizontal Filter Bar */
.filters-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 3rem;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  transition: box-shadow 0.2s ease;
}

.filters-bar-scrolled {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Navigation Tabs - Horizontal */
.sidebar-tabs {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.sidebar-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #F3F4F6;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  white-space: nowrap;
}

.sidebar-tab:hover {
  background: #E5E7EB;
  color: #374151;
}

.sidebar-tab.active {
  background: #FEEFEA;
  color: #ED5A29;
}

.sidebar-tab svg {
  flex-shrink: 0;
}

/* Sidebar Section - No margin bottom */
.sidebar-section {
  margin-bottom: 0;
}

.sidebar-section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.sidebar-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
}

.checkbox-item button {
  flex-shrink: 0;
}

/* Search - Push to right */
.sidebar-search {
  position: relative;
  margin-left: auto;
}

.sidebar-search input {
  width: 240px;
  padding: 0.5rem 2.5rem 0.5rem 0.875rem;
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

/* Popup Types */
.popup-types {
  display: flex;
  gap: 0;
  padding: 0 0.75rem 0.5rem 0.75rem;
  margin: 0.5rem 3rem 2rem 3rem;
  background: #FAFAFA;
  border-radius: 12px;
}

.popup-type-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  background: transparent;
}

.popup-type-box:hover .popup-type-icon {
  transform: scale(1.05);
}

.popup-type-icon {
  width: 100%;
  max-width: 200px;
  height: auto;
  aspect-ratio: 1/1;
  object-fit: contain;
  transition: transform 0.2s ease;
}

.popup-type-label {
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
  margin-top: -0.5rem;
  text-align: center;
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.section-header h2 {
  margin-bottom: 0;
}

.show-all-button {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6B7280;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.show-all-button:hover {
  color: #111827;
}

/* Featured Families */
.featured-families {
  padding: 1.25rem 3rem 2rem 3rem;
}

.featured-families-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
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
  width: calc((100% - 3rem) / 2.5);
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
  border-radius: 20px;
}

.family-item:hover .family-image {
  transform: scale(1.03);
}

.family-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 20px;
  transition: transform 0.3s ease;
}

/* Upcoming Seasons */
.upcoming-seasons {
  padding: 3rem 3rem 2rem 3rem;
}

.upcoming-seasons-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
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
  width: calc((100% - 3rem) / 2.5);
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
  border-radius: 20px;
}

.season-item:hover .season-image {
  transform: scale(1.03);
}

.season-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 20px;
  transition: transform 0.3s ease;
}

/* Recommended Use Cases */
.recommended-usecases {
  padding: 3rem 3rem 2rem 3rem;
}

.recommended-usecases-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
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

.usecase-card:hover .usecase-image {
  transform: scale(1.03);
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
  transition: transform 0.3s ease;
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
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
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

/* Filter Dropdown Styles */
.filter-dropdown-wrapper {
  position: relative;
  width: 280px;
}
</style>
