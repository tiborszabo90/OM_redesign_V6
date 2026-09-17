<script setup>
/**
 * Where a finished direction goes, in two steps.
 *
 * The first question is the only one with two real answers — an existing campaign or a
 * new one — and it decides what the second step even asks. Put on one screen, the two
 * were a list of campaigns with an odd row at the bottom, and the ad set had nowhere
 * to go: an ad lives in an ad set, so "which campaign" on its own never was the whole
 * answer.
 */
import { computed, ref, watch } from 'vue'
import { ArrowLeft, Check, ChevronRight, Layers, Plus, X } from 'lucide-vue-next'
import { BRAND, MODAL_SHADOW } from '../tokens'
import { campaignOptions, campaignAdSets } from '../store'

const props = defineProps({
  open: { type: Boolean, default: false },
  /** The direction being placed — named in the title, so the press is unambiguous. */
  runLabel: { type: String, default: '' },
  /** What a new campaign would be called unless the merchant says otherwise. */
  defaultName: { type: String, default: '' },
})
const emit = defineEmits(['confirm', 'close'])

const step = ref(1)
const mode = ref('existing')
const campaignId = ref(null)
const adSetId = ref(null)
const name = ref('')

const options = computed(() => campaignOptions())
const adSets = computed(() => (campaignId.value ? campaignAdSets(campaignId.value) : []))

watch(
  () => props.open,
  (open) => {
    if (!open) return
    step.value = 1
    mode.value = options.value.length ? 'existing' : 'new'
    campaignId.value = null
    adSetId.value = null
    name.value = props.defaultName
  },
  { immediate: true },
)

/** Picking a campaign picks its first ad set — the common case, still changeable. */
function pickCampaign(id) {
  campaignId.value = id
  adSetId.value = campaignAdSets(id)[0]?.id ?? null
}

function next() {
  if (mode.value === 'existing' && !campaignId.value) pickCampaign(options.value[0]?.id)
  step.value = 2
}

const canConfirm = computed(() =>
  mode.value === 'new' ? Boolean(name.value.trim()) : Boolean(campaignId.value),
)

function confirm() {
  if (!canConfirm.value) return
  if (mode.value === 'new') emit('confirm', { name: name.value })
  else emit('confirm', { campaignId: campaignId.value, adSetId: adSetId.value })
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
    @click="emit('close')"
  >
    <div
      class="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl"
      :style="{ background: BRAND.surface, boxShadow: MODAL_SHADOW }"
      @click.stop
    >
      <div
        class="flex items-center justify-between gap-3 border-b px-5 py-3.5"
        :style="{ borderColor: BRAND.gray200 }"
      >
        <div class="flex min-w-0 items-center gap-2">
          <button
            v-if="step === 2"
            type="button"
            class="-ml-1 rounded-md p-1 transition-colors hover:bg-[var(--oq-hover)]"
            title="Back"
            aria-label="Back"
            @click="step = 1"
          >
            <ArrowLeft class="size-4" :style="{ color: BRAND.gray500 }" />
          </button>
          <div class="min-w-0">
            <h2 class="truncate text-sm font-semibold" :style="{ color: BRAND.ink }">
              Use the {{ runLabel }} creatives
            </h2>
            <p class="text-xs" :style="{ color: BRAND.gray500 }">
              <template v-if="step === 1">Step 1 of 2 — where should they go?</template>
              <template v-else-if="mode === 'new'">Step 2 of 2 — name the campaign.</template>
              <template v-else>Step 2 of 2 — pick the campaign and the ad set.</template>
            </p>
          </div>
        </div>
        <button type="button" aria-label="Close" class="rounded-md p-1" @click="emit('close')">
          <X class="size-4" :style="{ color: BRAND.gray500 }" />
        </button>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto p-3">
        <!-- Step 1: the one question with two answers. -->
        <div v-if="step === 1" class="flex flex-col gap-2">
          <button
            type="button"
            :disabled="!options.length"
            class="flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left disabled:opacity-45"
            :style="{
              borderColor: mode === 'existing' ? BRAND.blue : BRAND.gray200,
              background: mode === 'existing' ? BRAND.blueSoft : BRAND.surface,
            }"
            @click="mode = 'existing'"
          >
            <Layers class="size-4 shrink-0" :style="{ color: BRAND.blue }" />
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-semibold" :style="{ color: BRAND.ink }">
                An existing campaign
              </span>
              <span class="block text-xs" :style="{ color: BRAND.gray500 }">
                {{ options.length }} to choose from — the ad joins one of its ad sets.
              </span>
            </span>
            <ChevronRight class="size-4 shrink-0" :style="{ color: BRAND.gray400 }" />
          </button>

          <button
            type="button"
            class="flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left"
            :style="{
              borderColor: mode === 'new' ? BRAND.blue : BRAND.gray200,
              background: mode === 'new' ? BRAND.blueSoft : BRAND.surface,
            }"
            @click="mode = 'new'"
          >
            <Plus class="size-4 shrink-0" :style="{ color: BRAND.blue }" />
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-semibold" :style="{ color: BRAND.ink }">
                A new campaign
              </span>
              <span class="block text-xs" :style="{ color: BRAND.gray500 }">
                Drafted with one ad set, ready to publish to Meta.
              </span>
            </span>
            <ChevronRight class="size-4 shrink-0" :style="{ color: BRAND.gray400 }" />
          </button>
        </div>

        <!-- Step 2, new: the only thing a new campaign needs from anyone. -->
        <div v-else-if="mode === 'new'" class="flex flex-col gap-2 p-1">
          <label class="text-xs font-medium" :style="{ color: BRAND.gray500 }">Campaign name</label>
          <input
            v-model="name"
            class="rounded-lg border px-3 py-2 text-sm outline-none"
            :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
            placeholder="Campaign name"
            autofocus
            @keydown.enter.prevent="confirm"
          />
          <p class="text-xs" :style="{ color: BRAND.gray500 }">
            It starts with a <strong :style="{ color: BRAND.ink }">Default ad set</strong>, which
            you can rename on the campaign page.
          </p>
        </div>

        <!-- Step 2, existing: the campaign, and then the set the ad actually lands in. -->
        <div v-else class="flex flex-col gap-3">
          <div class="flex flex-col gap-1.5">
            <p class="px-1 text-[11px] font-bold uppercase tracking-wide" :style="{ color: BRAND.gray500 }">
              Campaign
            </p>
            <button
              v-for="c in options"
              :key="c.id"
              type="button"
              class="flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left"
              :style="{
                borderColor: campaignId === c.id ? BRAND.blue : BRAND.gray200,
                background: campaignId === c.id ? BRAND.blueSoft : BRAND.surface,
              }"
              @click="pickCampaign(c.id)"
            >
              <span
                class="flex size-5 shrink-0 items-center justify-center rounded-full border"
                :style="{
                  borderColor: campaignId === c.id ? BRAND.blue : BRAND.gray300,
                  background: campaignId === c.id ? BRAND.blueSolid : 'transparent',
                }"
              >
                <Check v-if="campaignId === c.id" class="size-3 text-white" :stroke-width="3" />
              </span>
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm font-medium" :style="{ color: BRAND.ink }">
                  {{ c.name }}
                </span>
                <span class="block text-[11px] capitalize" :style="{ color: BRAND.gray500 }">
                  {{ c.status }}
                </span>
              </span>
            </button>
          </div>

          <div v-if="adSets.length" class="flex flex-col gap-1.5">
            <p class="px-1 text-[11px] font-bold uppercase tracking-wide" :style="{ color: BRAND.gray500 }">
              Ad set
            </p>
            <button
              v-for="a in adSets"
              :key="a.id"
              type="button"
              class="flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left"
              :style="{
                borderColor: adSetId === a.id ? BRAND.blue : BRAND.gray200,
                background: adSetId === a.id ? BRAND.blueSoft : BRAND.surface,
              }"
              @click="adSetId = a.id"
            >
              <span
                class="flex size-5 shrink-0 items-center justify-center rounded-full border"
                :style="{
                  borderColor: adSetId === a.id ? BRAND.blue : BRAND.gray300,
                  background: adSetId === a.id ? BRAND.blueSolid : 'transparent',
                }"
              >
                <Check v-if="adSetId === a.id" class="size-3 text-white" :stroke-width="3" />
              </span>
              <span class="truncate text-sm" :style="{ color: BRAND.ink }">{{ a.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 border-t px-5 py-3" :style="{ borderColor: BRAND.gray200 }">
        <button
          type="button"
          class="rounded-xl border px-4 py-2 text-sm font-semibold"
          :style="{ borderColor: BRAND.gray200, color: BRAND.ink }"
          @click="step === 2 ? (step = 1) : emit('close')"
        >
          {{ step === 2 ? 'Back' : 'Cancel' }}
        </button>
        <button
          v-if="step === 1"
          type="button"
          class="rounded-xl px-4 py-2 text-sm font-semibold text-white"
          :style="{ background: BRAND.blue }"
          @click="next"
        >
          Continue
        </button>
        <button
          v-else
          type="button"
          :disabled="!canConfirm"
          class="rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-45"
          :style="{ background: BRAND.blue }"
          @click="confirm"
        >
          {{ mode === 'new' ? 'Create campaign' : 'Add to ad set' }}
        </button>
      </div>
    </div>
  </div>
</template>
