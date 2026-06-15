<template>
  <div class="min-h-screen bg-om-gray-50 text-[#23262A]">
    <!-- Header -->
    <div class="border-b border-om-gray-200 bg-white px-8 py-5">
      <div class="max-w-[1200px] mx-auto flex items-center gap-2">
        <Timer :size="20" class="text-om-primary" />
        <h1 class="text-lg font-semibold">Countdown — unit display</h1>
      </div>
    </div>

    <div class="max-w-[1200px] mx-auto flex gap-6 px-8 py-8 items-start">
      <!-- ── Live preview ──────────────────────────────────────── -->
      <div class="flex-1 rounded-xl bg-[#C7CCD1] p-10 flex items-center justify-center min-h-[440px]">
        <div class="w-full max-w-md rounded-xl bg-[#F3F4EC] px-8 py-10 text-center shadow-lg">
          <p class="text-2xl font-serif italic text-[#0F3D3E]">Summer sale</p>
          <p class="mt-1 text-lg font-semibold text-[#E5396B]">10% coupon &amp; free shipping</p>
          <p class="mt-2 text-sm text-[#0F3D3E]">When you finish your order…</p>

          <div class="mt-8 flex items-end justify-center gap-2 sm:gap-3">
            <template v-for="(u, i) in visibleUnits" :key="u.key">
              <div class="flex flex-col items-center">
                <span class="text-5xl font-bold tabular-nums text-[#0F3D3E] leading-none">{{ pad(time[u.key]) }}</span>
                <span v-if="showLabels" class="mt-1.5 text-[11px] uppercase tracking-wide text-[#0F3D3E]/70">{{ u.label }}</span>
              </div>
              <span
                v-if="i < visibleUnits.length - 1"
                class="text-5xl font-bold text-[#0F3D3E] leading-none pb-px"
                :class="showLabels ? 'self-start' : ''"
              >:</span>
            </template>
          </div>

          <button class="mt-8 w-full rounded-md border-2 border-[#E5396B] py-3 font-semibold text-[#E5396B]">
            GET MY COUPON!
          </button>
        </div>
      </div>

      <!-- ── Settings panel ────────────────────────────────────── -->
      <div class="w-[360px] shrink-0 rounded-xl border border-om-gray-200 bg-white">
        <div class="flex items-center gap-2 border-b border-om-gray-200 px-5 py-4">
          <ChevronLeft :size="18" class="text-om-gray-500" />
          <span class="font-semibold">Countdown</span>
        </div>

        <div class="px-5 py-5 space-y-6">
          <!-- Time setting -->
          <div>
            <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-om-gray-500">Time</p>
            <div class="grid grid-cols-2 gap-3">
              <div v-for="u in units" :key="u.key">
                <label class="mb-1 block text-sm font-medium">{{ u.label }}</label>
                <Dropdown
                  :model-value="String(time[u.key])"
                  :options="rangeOptions(u.key)"
                  size="sm"
                  @update:model-value="v => setTime(u.key, v)"
                />
              </div>
            </div>
          </div>

          <!-- Unit labels toggle -->
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Time unit labels</span>
            <ToggleSwitch v-model="showLabels" />
          </div>

          <!-- Show seconds toggle — the only optional unit -->
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Show seconds</span>
            <ToggleSwitch v-model="showSeconds" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { Timer, ChevronLeft } from 'lucide-vue-next'
import Dropdown from '../components/shared/Dropdown.vue'
import ToggleSwitch from '../components/shared/ToggleSwitch.vue'

const units = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
]

const time = reactive({ days: 2, hours: 10, minutes: 20, seconds: 27 })
const showLabels = ref(false)
const showSeconds = ref(true)

const pad = (n) => String(n).padStart(2, '0')
const maxFor = { days: 30, hours: 23, minutes: 59, seconds: 59 }
const rangeOptions = (key) => Array.from({ length: maxFor[key] + 1 }, (_, i) => String(i))
const setTime = (key, v) => { time[key] = Number(v) }

// Days/hours/minutes always show; seconds is the only optional unit.
const visibleUnits = computed(() => units.filter(u => u.key !== 'seconds' || showSeconds.value))
</script>
