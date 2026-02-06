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
                <div class="language-selector relative w-[240px]" ref="languageDropdownRef">
                <button
                  @click="isLanguageDropdownOpen = !isLanguageDropdownOpen"
                  class="dropdown-select w-full px-3 pr-8 py-2 border border-om-gray-200 rounded-lg text-sm text-[#23262A] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus:shadow-none active:shadow-none cursor-pointer bg-white text-left hover:border-om-gray-300 hover:bg-[#FAFAFA] transition-colors"
                  :class="{ 'border-om-orange-300': isLanguageDropdownOpen }"
                  :style="isLanguageDropdownOpen ? 'box-shadow: 0 0 0 2px #FBD9CE; outline: none;' : 'box-shadow: none; outline: none;'"
                >
                  {{ selectedLanguage.label }}
                </button>
                <div class="absolute inset-y-0 right-2.5 flex items-center pointer-events-none">
                  <ChevronDown
                    :size="16"
                    class="text-om-gray-600 transition-transform"
                    :class="{ 'rotate-180': isLanguageDropdownOpen }"
                  />
                </div>

                <!-- Dropdown menu -->
                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="opacity-0 scale-95"
                  enter-to-class="opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="opacity-100 scale-100"
                  leave-to-class="opacity-0 scale-95"
                >
                  <div
                    v-if="isLanguageDropdownOpen"
                    class="absolute z-10 w-full mt-2 bg-white border border-[#D5D8DD] rounded-lg shadow-lg overflow-hidden"
                  >
                    <button
                      v-for="option in languageOptions"
                      :key="option.value"
                      @click="selectLanguage(option)"
                      class="w-full px-3 py-1.5 text-left text-sm text-[#23262A] hover:bg-[#F9FAFB] transition-colors cursor-pointer focus:outline-none focus:ring-0 focus:shadow-none active:bg-[#F9FAFB]"
                      :class="{ 'bg-[#F1F2F4] font-medium': selectedLanguage.value === option.value }"
                      style="box-shadow: none !important; outline: none !important;"
                    >
                      {{ option.label }}
                    </button>
                  </div>
                </transition>
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
              <div class="filter-dropdown-wrapper" ref="goalsDropdownRef">
                <button
                  @click="isGoalsDropdownOpen = !isGoalsDropdownOpen"
                  class="filter-dropdown-button"
                >
                  <span>{{ selectedGoalsText }}</span>
                  <ChevronDown
                    :size="16"
                    class="filter-dropdown-icon"
                    :class="{ 'rotate-180': isGoalsDropdownOpen }"
                  />
                </button>
                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="opacity-0 scale-95"
                  enter-to-class="opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="opacity-100 scale-100"
                  leave-to-class="opacity-0 scale-95"
                >
                  <div v-if="isGoalsDropdownOpen" class="filter-dropdown-menu">
                    <label
                      class="filter-checkbox-item"
                      :class="{ 'filter-checkbox-item-selected': goals.listBuilding }"
                      @click="goals.listBuilding = !goals.listBuilding"
                    >
                      <span>List Building</span>
                      <Check v-if="goals.listBuilding" :size="16" class="text-gray-500" stroke-width="2" />
                    </label>
                    <label
                      class="filter-checkbox-item"
                      :class="{ 'filter-checkbox-item-selected': goals.cartAbandonment }"
                      @click="goals.cartAbandonment = !goals.cartAbandonment"
                    >
                      <span>Reduce Cart Abandonment</span>
                      <Check v-if="goals.cartAbandonment" :size="16" class="text-gray-500" stroke-width="2" />
                    </label>
                    <label
                      class="filter-checkbox-item"
                      :class="{ 'filter-checkbox-item-selected': goals.averageOrderValue }"
                      @click="goals.averageOrderValue = !goals.averageOrderValue"
                    >
                      <span>Increase Average Order Value</span>
                      <Check v-if="goals.averageOrderValue" :size="16" class="text-gray-500" stroke-width="2" />
                    </label>
                    <label
                      class="filter-checkbox-item"
                      :class="{ 'filter-checkbox-item-selected': goals.feedback }"
                      @click="goals.feedback = !goals.feedback"
                    >
                      <span>Collect Feedback</span>
                      <Check v-if="goals.feedback" :size="16" class="text-gray-500" stroke-width="2" />
                    </label>
                    <label
                      class="filter-checkbox-item"
                      :class="{ 'filter-checkbox-item-selected': goals.visitorDirection }"
                      @click="goals.visitorDirection = !goals.visitorDirection"
                    >
                      <span>Direct Visitors</span>
                      <Check v-if="goals.visitorDirection" :size="16" class="text-gray-500" stroke-width="2" />
                    </label>
                    <label
                      class="filter-checkbox-item"
                      :class="{ 'filter-checkbox-item-selected': goals.conversion }"
                      @click="goals.conversion = !goals.conversion"
                    >
                      <span>Increase Conversion</span>
                      <Check v-if="goals.conversion" :size="16" class="text-gray-500" stroke-width="2" />
                    </label>
                    <label
                      class="filter-checkbox-item"
                      :class="{ 'filter-checkbox-item-selected': goals.salesPromotion }"
                      @click="goals.salesPromotion = !goals.salesPromotion"
                    >
                      <span>Promote Sales</span>
                      <Check v-if="goals.salesPromotion" :size="16" class="text-gray-500" stroke-width="2" />
                    </label>
                  </div>
                </transition>
              </div>

              <!-- Content Section -->
              <div class="filter-dropdown-wrapper" ref="contentDropdownRef">
                <button
                  @click="isContentDropdownOpen = !isContentDropdownOpen"
                  class="filter-dropdown-button"
                >
                  <span>{{ selectedContentText }}</span>
                  <ChevronDown
                    :size="16"
                    class="filter-dropdown-icon"
                    :class="{ 'rotate-180': isContentDropdownOpen }"
                  />
                </button>
                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="opacity-0 scale-95"
                  enter-to-class="opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="opacity-100 scale-100"
                  leave-to-class="opacity-0 scale-95"
                >
                  <div v-if="isContentDropdownOpen" class="filter-dropdown-menu">
                    <label
                      class="filter-checkbox-item"
                      :class="{ 'filter-checkbox-item-selected': content.kupon }"
                      @click="content.kupon = !content.kupon"
                    >
                      <span>Coupon</span>
                      <Check v-if="content.kupon" :size="16" class="text-gray-500" stroke-width="2" />
                    </label>
                    <label
                      class="filter-checkbox-item"
                      :class="{ 'filter-checkbox-item-selected': content.szerencsekerek }"
                      @click="content.szerencsekerek = !content.szerencsekerek"
                    >
                      <span>Lucky Wheel</span>
                      <Check v-if="content.szerencsekerek" :size="16" class="text-gray-500" stroke-width="2" />
                    </label>
                    <label
                      class="filter-checkbox-item"
                      :class="{ 'filter-checkbox-item-selected': content.termekajanlo }"
                      @click="content.termekajanlo = !content.termekajanlo"
                    >
                      <span>Product Recommender</span>
                      <Check v-if="content.termekajanlo" :size="16" class="text-gray-500" stroke-width="2" />
                    </label>
                    <label
                      class="filter-checkbox-item"
                      :class="{ 'filter-checkbox-item-selected': content.visszaszamlalo }"
                      @click="content.visszaszamlalo = !content.visszaszamlalo"
                    >
                      <span>Countdown</span>
                      <Check v-if="content.visszaszamlalo" :size="16" class="text-gray-500" stroke-width="2" />
                    </label>
                    <label
                      class="filter-checkbox-item"
                      :class="{ 'filter-checkbox-item-selected': content.felmeres }"
                      @click="content.felmeres = !content.felmeres"
                    >
                      <span>Survey</span>
                      <Check v-if="content.felmeres" :size="16" class="text-gray-500" stroke-width="2" />
                    </label>
                    <label
                      class="filter-checkbox-item"
                      :class="{ 'filter-checkbox-item-selected': content.feedback }"
                      @click="content.feedback = !content.feedback"
                    >
                      <span>Feedback</span>
                      <Check v-if="content.feedback" :size="16" class="text-gray-500" stroke-width="2" />
                    </label>
                    <label
                      class="filter-checkbox-item"
                      :class="{ 'filter-checkbox-item-selected': content.ajandekvalaszto }"
                      @click="content.ajandekvalaszto = !content.ajandekvalaszto"
                    >
                      <span>Gift Selector</span>
                      <Check v-if="content.ajandekvalaszto" :size="16" class="text-gray-500" stroke-width="2" />
                    </label>
                    <label
                      class="filter-checkbox-item"
                      :class="{ 'filter-checkbox-item-selected': content.kaparosSorsjegy }"
                      @click="content.kaparosSorsjegy = !content.kaparosSorsjegy"
                    >
                      <span>Scratch Card</span>
                      <Check v-if="content.kaparosSorsjegy" :size="16" class="text-gray-500" stroke-width="2" />
                    </label>
                  </div>
                </transition>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Check, ChevronDown, ChevronRight, Paintbrush, FolderOpen, Edit, Search, Calendar } from 'lucide-vue-next'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'

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

// Filter dropdown state
const goalsDropdownRef = ref(null)
const contentDropdownRef = ref(null)
const isGoalsDropdownOpen = ref(false)
const isContentDropdownOpen = ref(false)

// Computed properties for dropdown button text
const selectedGoalsText = computed(() => {
  const selectedCount = Object.values(goals.value).filter(Boolean).length
  if (selectedCount === 0) return 'All goals'
  return `${selectedCount} selected`
})

const selectedContentText = computed(() => {
  const selectedCount = Object.values(content.value).filter(Boolean).length
  if (selectedCount === 0) return 'All content'
  return `${selectedCount} selected`
})

// Language dropdown state
const languageDropdownRef = ref(null)
const isLanguageDropdownOpen = ref(false)
const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'hu', label: 'Magyar' },
  { value: 'de', label: 'Deutsch' }
]
const selectedLanguage = ref(languageOptions[0])

const selectLanguage = (option) => {
  selectedLanguage.value = option
  isLanguageDropdownOpen.value = false
}

const handleClickOutside = (event) => {
  if (languageDropdownRef.value && !languageDropdownRef.value.contains(event.target)) {
    isLanguageDropdownOpen.value = false
  }
  if (goalsDropdownRef.value && !goalsDropdownRef.value.contains(event.target)) {
    isGoalsDropdownOpen.value = false
  }
  if (contentDropdownRef.value && !contentDropdownRef.value.contains(event.target)) {
    isContentDropdownOpen.value = false
  }
}

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
  document.addEventListener('click', handleClickOutside)
  if (mainRef.value) {
    mainRef.value.addEventListener('scroll', handleMainScroll)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
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

.filter-dropdown-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.875rem;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  background: white;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-dropdown-button:hover {
  border-color: #D1D5DB;
  background: #F9FAFB;
}

.filter-dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  z-index: 20;
}

.filter-checkbox-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s;
}

.filter-checkbox-item:hover {
  background: #F9FAFB;
}

.filter-checkbox-item-selected {
  background: #F3F4F6;
}

.filter-dropdown-icon {
  flex-shrink: 0;
  transition: transform 0.2s;
  color: #6B7280;
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>
