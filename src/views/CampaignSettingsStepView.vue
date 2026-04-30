<template>
  <div>
  <DashboardLayout active-menu-item="campaigns" @logo-click="$emit('logo-click')" @menu-click="$emit('menu-click', $event)" :right-panel-collapsed="true">
    <template #content>
      <div class="w-full max-w-[1400px] mx-auto -mt-2 pb-12">
        <!-- Header -->
        <div class="flex items-start justify-between mb-6">
          <div>
            <h1 class="text-2xl font-semibold text-om-gray-700 mb-1">Black Friday 2025</h1>
            <p class="text-xs text-om-gray-400">www.mydomain.com</p>
          </div>
          <Button variant="primary" size="md" @click="emit('next')">Next</Button>
        </div>

        <!-- Settings -->
        <div class="space-y-4">
          <!-- Goal & A/B test -->
          <Accordion
            title="Goal & A/B test"
            :open="openAccordion === 'abTest'"
            @toggle="toggleAccordion('abTest')"
            icon-rounded="rounded-xl"
            icon-bg="bg-om-orange-100"
          >
            <template #icon><FlaskConical :size="20" class="text-om-orange-400" /></template>
            <section>
              <h4 class="text-base font-semibold text-om-gray-700 mb-3">Primary goal</h4>
              <p class="text-sm text-om-gray-500 mb-3">The main conversion event used to measure this campaign's success.<br />Reports and variant comparisons default to this metric.</p>
              <div class="w-64">
                <Dropdown v-model="primaryGoal" :options="goalValues" />
              </div>
            </section>
            <p class="text-sm text-om-gray-500 mt-4">You can launch an A/B test from the campaign page once this campaign is saved.</p>
            <div class="flex justify-end mt-6">
              <Button variant="primary" size="md" @click="goToStep('showUp')">Next to Triggering</Button>
            </div>
          </Accordion>

          <!-- When would you like this campaign to show up? -->
          <Accordion
            title="When would you like this campaign to show up?"
            :open="openAccordion === 'showUp'"
            @toggle="toggleAccordion('showUp')"
            icon-rounded="rounded-xl"
            icon-bg="bg-om-orange-100"
          >
              <template #icon><Clock :size="20" class="text-om-orange-400" /></template>
              <div class="trigger-timeline">
                <div class="trigger-timeline-item">
                  <div class="trigger-card">
                    <div class="flex items-center gap-5">
                      <div class="w-20 h-14 shrink-0">
                        <img src="/settings/setting-1.png" alt="Exit intent" class="w-full h-full object-contain" />
                      </div>
                      <div class="flex-1">
                        <h5 class="text-base font-semibold text-om-gray-700 mb-1">On exit-intent</h5>
                        <p class="text-sm text-om-gray-400">When a visitor is about to leave your site</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="trigger-timeline-or">
                  <span class="trigger-or-badge">OR</span>
                </div>

                <div class="trigger-timeline-item">
                  <div class="trigger-card">
                    <div class="flex items-center gap-5">
                      <div class="w-20 h-14 shrink-0">
                        <img src="/settings/setting-1.png" alt="After seconds" class="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h5 class="text-base font-semibold text-om-gray-700 mb-1">After x seconds of inactivity</h5>
                        <p class="text-sm text-om-gray-400">
                          When a visitor is inactive for <span class="font-semibold text-om-gray-700">20 seconds</span>
                        </p>
                      </div>
                      <div class="flex items-center gap-2 shrink-0">
                        <Monitor :size="20" class="text-om-gray-700" />
                        <Smartphone :size="20" class="text-om-gray-700" />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="trigger-timeline-add pl-6">
                  <Button variant="outline" size="md">
                    <template #icon><Plus :size="18" /></template>
                    Add new trigger
                  </Button>
                </div>
              </div>
              <div class="flex justify-end mt-6">
                <Button variant="primary" size="md" @click="goToStep('howMany')">Next to Frequency</Button>
              </div>
          </Accordion>

          <!-- How many times should this campaign appear? -->
          <Accordion
            title="How many times should this campaign appear?"
            :open="openAccordion === 'howMany'"
            @toggle="toggleAccordion('howMany')"
            icon-rounded="rounded-xl"
            icon-bg="bg-om-orange-100"
          >
              <template #icon><RefreshCw :size="20" class="text-om-orange-400" /></template>
              <div class="mb-6">
                <h4 class="text-sm font-semibold text-om-gray-700 mb-3">
                  How many times <span class="font-normal text-om-gray-500">can this campaign appear to a visitor?</span>
                </h4>
                <div class="space-y-2.5">
                  <RadioButton v-model="frequencyType" value="unlimited" label="Unlimited Times" />
                  <RadioButton v-model="frequencyType" value="maximum">
                    <span class="text-sm text-om-gray-700">Maximum</span>
                    <input
                      type="number"
                      v-model="maxTimes"
                      :disabled="frequencyType !== 'maximum'"
                      class="w-16 px-2 py-1 border border-om-gray-200 rounded text-sm text-om-gray-700 focus:outline-none focus:border-om-gray-300 disabled:bg-om-gray-50 disabled:text-om-gray-400"
                    />
                    <span class="text-sm text-om-gray-700">times</span>
                  </RadioButton>
                </div>
              </div>

              <div class="mb-6">
                <h4 class="text-sm font-semibold text-om-gray-700 mb-3">
                  How frequently <span class="font-normal text-om-gray-500">can this campaign appear again after a visitor has closed it?</span>
                </h4>
                <div class="space-y-2.5">
                  <RadioButton v-model="frequencyMode" value="asap" label="As soon as possible" />
                  <RadioButton v-model="frequencyMode" value="min">
                    <span class="text-sm text-om-gray-700">Minimum</span>
                    <input
                      type="number"
                      v-model="minValue"
                      :disabled="frequencyMode !== 'min'"
                      class="w-16 px-2 py-1 border border-om-gray-200 rounded text-sm text-om-gray-700 focus:outline-none focus:border-om-gray-300 disabled:bg-om-gray-50 disabled:text-om-gray-400"
                    />
                    <div class="relative">
                      <select
                        v-model="timeUnit"
                        :disabled="frequencyMode !== 'min'"
                        class="w-24 pl-2 pr-6 py-1 border border-om-gray-200 rounded-lg text-sm text-om-gray-700 focus:outline-none focus:border-om-gray-300 appearance-none cursor-pointer disabled:bg-om-gray-50 disabled:text-om-gray-400 disabled:cursor-not-allowed"
                      >
                        <option value="hour">hour(s)</option>
                        <option value="day">day(s)</option>
                        <option value="session">session(s)</option>
                      </select>
                      <ChevronDown :size="16" class="absolute right-1.5 top-1/2 -translate-y-1/2 text-om-gray-600 pointer-events-none" />
                    </div>
                    <span class="text-sm text-om-gray-700">between two impressions</span>
                  </RadioButton>
                </div>
              </div>

              <div class="mb-6">
                <h4 class="text-sm font-semibold text-om-gray-700 mb-3">
                  When should <span class="font-normal text-om-gray-500">the campaign</span> stop showing <span class="font-normal text-om-gray-500">to the visitors?</span>
                </h4>
                <div class="flex flex-col gap-2.5">
                  <Checkbox v-model="stopAfterClose" label="After a visitor has closed the campaign" />
                  <Checkbox v-model="stopAfterConvert" label="After a visitor has converted in this campaign" />
                </div>
              </div>
              <div class="flex justify-end">
                <Button variant="primary" size="md" @click="goToStep('whoSee')">Next to Targeting</Button>
              </div>
          </Accordion>

          <!-- Who should see this campaign? -->
          <Accordion
            title="Who should see this campaign?"
            :open="openAccordion === 'whoSee'"
            @toggle="toggleAccordion('whoSee')"
            icon-rounded="rounded-xl"
            icon-bg="bg-om-orange-100"
          >
            <template #icon><Users :size="20" class="text-om-orange-400" /></template>
            <div class="trigger-timeline">
              <div class="trigger-timeline-item">
                <div class="trigger-card">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-om-orange-400 rounded-xl flex items-center justify-center shrink-0">
                      <Timer :size="28" class="text-white" />
                    </div>
                    <div class="flex-1">
                      <div class="text-sm font-semibold text-om-gray-700">Spent on pages</div>
                      <div class="text-sm text-om-gray-500 mt-0.5">The popup will appear to visitors who spent a minimum of <span class="font-semibold text-om-gray-800">10 seconds</span> on the current subpage</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="trigger-timeline-item">
                <div class="trigger-card">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-om-orange-400 rounded-xl flex items-center justify-center shrink-0">
                      <Globe :size="28" class="text-white" />
                    </div>
                    <div class="flex-1">
                      <div class="text-sm font-semibold text-om-gray-700">Current page / URL</div>
                      <div class="text-sm text-om-gray-500 mt-0.5">URL or its subpaths contains <span class="font-semibold text-om-gray-800">cart</span>, <span class="font-semibold text-om-gray-800">shop_cart</span>, <span class="font-semibold text-om-gray-800">shop_reg</span>, or <span class="font-semibold text-om-gray-800">shop_category</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="trigger-timeline-add pl-6 flex items-center justify-between gap-3">
                <Button variant="outline" size="md">
                  <template #icon><Plus :size="18" /></template>
                  Add new rule
                </Button>
                <Button variant="outline" size="md">Save as segment</Button>
              </div>
            </div>
            <div class="flex justify-end mt-6">
              <Button variant="primary" size="md" @click="goToStep('sendData')">Next to Integration</Button>
            </div>
          </Accordion>

          <!-- Where you would like to send the subscribers and campaign data? -->
          <Accordion
            title="Where you would like to send the subscribers and campaign data?"
            :open="openAccordion === 'sendData'"
            @toggle="toggleAccordion('sendData')"
            icon-rounded="rounded-xl"
            icon-bg="bg-om-orange-100"
          >
            <template #icon><Send :size="20" class="text-om-orange-400" /></template>
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-[#FFE01B] rounded-xl flex items-center justify-center">
                <img src="/icons/mailchimp.svg" alt="Mailchimp" class="w-7 h-7" />
              </div>
              <span class="text-sm font-medium text-om-gray-700">Mailchimp</span>
            </div>
            <div class="mt-8">
              <Button variant="outline" size="md">
                <template #icon><Plus :size="18" /></template>
                Add new integration
              </Button>
            </div>
            <div class="flex justify-end mt-6">
              <Button variant="primary" size="md" @click="emit('next')">Next</Button>
            </div>
          </Accordion>

          <!-- Email Notification Toggle -->
          <div class="bg-white rounded-2xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] pl-4 pr-7 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-om-orange-100 flex items-center justify-center shrink-0">
                  <Mail :size="20" class="text-om-orange-400" />
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-om-gray-700">Email notification</h4>
                  <p class="text-sm text-om-gray-500 mt-1">Get notified when someone submits this campaign</p>
                </div>
              </div>
              <ToggleSwitch v-model="emailNotification" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </DashboardLayout>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronDown, Clock, RefreshCw, Users, Send, Monitor, Smartphone, Globe, Plus, FlaskConical, Mail, Timer } from 'lucide-vue-next'
import Button from '../components/shared/Button.vue'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import ToggleSwitch from '../components/shared/ToggleSwitch.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import Accordion from '../components/shared/Accordion.vue'
import Checkbox from '../components/shared/Checkbox.vue'
import RadioButton from '../components/shared/RadioButton.vue'

const emit = defineEmits(['menu-click', 'logo-click', 'next'])

// Flow: only one accordion open at a time; Next opens the next step
const openAccordion = ref('abTest')
const toggleAccordion = (section) => {
  openAccordion.value = openAccordion.value === section ? null : section
}
const goToStep = (section) => {
  openAccordion.value = section
}


// Goal
const primaryGoal = ref('Submit')
const goalValues = ['Submit', 'Order', 'Add to cart', 'Email capture', 'Phone capture']

// How many times accordion state
const frequencyType = ref('maximum')
const maxTimes = ref(2)
const frequencyMode = ref('min')
const minValue = ref(1)
const timeUnit = ref('hour')
const stopAfterClose = ref(false)
const stopAfterConvert = ref(true)

// Email notification
const emailNotification = ref(false)
</script>

<style scoped>
.trigger-timeline {
  position: relative;
  margin-left: 10px;
  padding-left: 28px;
}

.trigger-timeline-item,
.trigger-timeline-or,
.trigger-timeline-add {
  position: relative;
}

.trigger-timeline-item::before {
  content: '';
  position: absolute;
  left: -28px;
  top: 44px;
  width: 24px;
  height: 3px;
  background: #D5D8DD;
}

.trigger-timeline-item::after,
.trigger-timeline-or::after {
  content: '';
  position: absolute;
  left: -28px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #D5D8DD;
}

.trigger-timeline-add::after {
  content: '';
  position: absolute;
  left: -28px;
  top: -1.5rem;
  bottom: 50%;
  width: 3px;
  background: #D5D8DD;
}

.trigger-timeline:not(:has(.trigger-timeline-add)) .trigger-timeline-item:last-child::after {
  bottom: 50%;
}

.trigger-timeline > *:first-child::after {
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
}

.trigger-timeline > *:last-child::after {
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
}

.trigger-card {
  padding: 1.25rem 1.5rem;
  background: white;
  cursor: pointer;
}

.trigger-timeline-or {
  position: relative;
  display: flex;
  align-items: center;
  height: 2.75rem;
}

.trigger-or-badge {
  position: absolute;
  left: -28px;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 4px 10px;
  background: #D5D8DD;
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: 6px;
  z-index: 1;
}

.trigger-timeline-add {
  position: relative;
  margin-top: 1.5rem;
}

.trigger-timeline-add::before {
  content: '';
  position: absolute;
  left: -28px;
  top: 50%;
  width: 24px;
  height: 3px;
  background: #D5D8DD;
}
</style>
