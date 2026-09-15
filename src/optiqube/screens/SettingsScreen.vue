<script setup>
import { computed, reactive } from 'vue'
import { BRAND, CARD_SHADOW, FONT } from '../tokens'
import {
  activeBrand, connections, brandKitFields, brandKitSourceLabels, brandDnaLanguages, navigate,
} from '../store'

/** Unsaved edits by field id — the inputs show these over the stored values. */
const drafts = reactive({})

const dirty = computed(() => Object.keys(drafts).some((id) => {
  const field = brandKitFields.find((f) => f.id === id)
  return field && drafts[id] !== field.value
}))

function shown(field) {
  return drafts[field.id] ?? field.value
}

function save() {
  for (const field of brandKitFields) {
    if (drafts[field.id] != null && drafts[field.id] !== field.value) {
      field.value = drafts[field.id]
      field.source = 'edited'
    }
    delete drafts[field.id]
  }
}

function resetField(field) {
  delete drafts[field.id]
}

const sourceTone = {
  edited: { background: BRAND.blueSoft, color: BRAND.blue },
  scraped: { background: BRAND.successSoft, color: BRAND.emeraldText },
  default: { background: BRAND.gray100, color: BRAND.gray500 },
}

function syncedLabel(iso) {
  return new Date(iso).toLocaleString()
}
</script>

<template>
  <div class="w-full px-6 py-8" :style="{ fontFamily: FONT }">
    <p class="text-xs font-medium" :style="{ color: BRAND.gray500 }">
      {{ activeBrand().name }} · {{ activeBrand().domain }}
    </p>
    <h1 class="mt-1 text-3xl font-semibold tracking-tight" :style="{ color: BRAND.ink }">Settings</h1>
    <p class="mt-2 max-w-2xl text-[15px] leading-relaxed" :style="{ color: BRAND.gray500 }">
      Connect the systems OptiQube needs for catalog creatives and Meta Ads.
    </p>

    <div class="mt-8 grid max-w-3xl gap-4">
      <!-- Products -->
      <section
        class="rounded-2xl border p-5"
        :style="{ borderColor: BRAND.gray200, background: BRAND.surface, boxShadow: CARD_SHADOW }"
      >
        <div class="flex items-start gap-3">
          <div
            class="grid size-10 shrink-0 place-items-center rounded-xl text-sm font-bold text-white"
            :style="{ background: BRAND.blueSolid }"
          >
            F
          </div>
          <div class="min-w-0 flex-1">
            <h2 class="flex items-center gap-2 text-base font-semibold" :style="{ color: BRAND.ink }">
              <span
                class="inline-block size-2 rounded-full"
                :style="{ background: connections.catalog.connected ? BRAND.emeraldText : BRAND.gray300 }"
                aria-hidden="true"
              />
              Products
            </h2>

            <template v-if="connections.catalog.connected">
              <p class="mt-1 break-all text-sm" :style="{ color: BRAND.gray500 }">
                {{ connections.catalog.sourceLabel }} · {{ connections.catalog.productCount }} products ·
                synced {{ syncedLabel(connections.catalog.lastSyncedAt) }}
              </p>
              <div class="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  class="rounded-md border px-3 py-1.5 text-sm"
                  :style="{ borderColor: BRAND.gray200, color: BRAND.ink }"
                  @click="connections.catalog.lastSyncedAt = new Date().toISOString()"
                >
                  Resync
                </button>
                <button
                  type="button"
                  class="rounded-md border px-3 py-1.5 text-sm"
                  :style="{ borderColor: BRAND.gray200, color: BRAND.ink }"
                  @click="navigate('/settings/catalog')"
                >
                  Manage
                </button>
                <button
                  type="button"
                  class="rounded-md border px-3 py-1.5 text-sm"
                  :style="{ borderColor: BRAND.gray200, color: BRAND.red }"
                  @click="connections.catalog.connected = false"
                >
                  Disconnect
                </button>
              </div>
            </template>
            <template v-else>
              <p class="mt-1 text-sm" :style="{ color: BRAND.gray500 }">
                Meta catalog or XML feed URL — needed before bulk generation.
              </p>
              <button
                type="button"
                class="mt-3 inline-flex rounded-md px-3.5 py-2 text-sm font-medium text-white"
                :style="{ background: BRAND.blueSolid }"
                @click="navigate('/settings/catalog')"
              >
                Connect catalog
              </button>
            </template>
          </div>
        </div>
      </section>

      <!-- Meta Ads -->
      <section
        class="rounded-2xl border p-5"
        :style="{ borderColor: BRAND.gray200, background: BRAND.surface, boxShadow: CARD_SHADOW }"
      >
        <div class="flex items-start gap-3">
          <div
            class="grid size-10 shrink-0 place-items-center rounded-xl text-sm font-bold text-white"
            style="background: #1877f2"
          >
            M
          </div>
          <div class="min-w-0 flex-1">
            <h2 class="flex items-center gap-2 text-base font-semibold" :style="{ color: BRAND.ink }">
              <span
                class="inline-block size-2 rounded-full"
                :style="{ background: connections.meta.connected ? BRAND.emeraldText : BRAND.gray300 }"
                aria-hidden="true"
              />
              Meta Ads
            </h2>

            <template v-if="connections.meta.connected">
              <p class="mt-1 text-sm" :style="{ color: BRAND.gray500 }">
                {{ connections.meta.businessName }} · {{ connections.meta.adAccountName }}
                ({{ connections.meta.adAccountId }})
              </p>
              <div class="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  class="rounded-md border px-3 py-1.5 text-sm"
                  :style="{ borderColor: BRAND.gray200, color: BRAND.ink }"
                  @click="navigate('/settings/meta')"
                >
                  Change account
                </button>
                <button
                  type="button"
                  class="rounded-md border px-3 py-1.5 text-sm"
                  :style="{ borderColor: BRAND.gray200, color: BRAND.red }"
                  @click="connections.meta.connected = false"
                >
                  Disconnect
                </button>
              </div>
            </template>
            <template v-else>
              <p class="mt-1 text-sm" :style="{ color: BRAND.gray500 }">
                Business Manager + Ad Account — unlocks live KPIs and future feed push.
              </p>
              <div class="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  class="inline-flex rounded-md px-3.5 py-2 text-sm font-medium text-white"
                  :style="{ background: BRAND.blueSolid }"
                  @click="navigate('/settings/meta')"
                >
                  Connect Meta
                </button>
                <span class="self-center text-xs" :style="{ color: BRAND.gray400 }">
                  Optional for creatives — required for live metrics
                </span>
              </div>
            </template>
          </div>
        </div>
      </section>

      <!-- Brand kit -->
      <section
        class="rounded-2xl border p-5"
        :style="{ borderColor: BRAND.gray200, background: BRAND.surface, boxShadow: CARD_SHADOW }"
      >
        <h2 class="text-base font-semibold" :style="{ color: BRAND.ink }">Brand kit</h2>
        <p class="mt-1 text-sm" :style="{ color: BRAND.gray500 }">
          Read off {{ activeBrand().domain }} by the store scan — these fill the
          <code class="text-xs">{{ '{brand_*}' }}</code> slots in the creative prompts. Edit a
          value and every new creative uses yours.
        </p>

        <div class="mt-4 grid gap-4">
          <div v-for="field in brandKitFields" :key="field.id" class="flex flex-wrap items-center gap-3">
            <div class="w-40 min-w-32">
              <p class="text-sm font-medium" :style="{ color: BRAND.ink }">{{ field.label }}</p>
              <p class="text-[11px] leading-tight" :style="{ color: BRAND.gray400 }">{{ field.hint }}</p>
            </div>

            <input
              v-if="field.kind === 'color'"
              type="color"
              :aria-label="`${field.label} color`"
              class="size-9 shrink-0 cursor-pointer rounded-md border p-1"
              :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
              :value="shown(field).toLowerCase()"
              @input="drafts[field.id] = $event.target.value.toUpperCase()"
            />
            <textarea
              v-else-if="field.kind === 'longtext'"
              rows="3"
              class="min-w-64 flex-1 rounded-md border px-3 py-2 text-sm"
              :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
              :aria-label="field.label"
              placeholder="e.g. 25-40 year old women in Copenhagen who hike at weekends"
              :value="shown(field)"
              @input="drafts[field.id] = $event.target.value"
            />
            <select
              v-else-if="field.kind === 'choice'"
              class="w-40 rounded-md border px-3 py-2 text-sm"
              :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
              :aria-label="field.label"
              :value="shown(field)"
              @change="drafts[field.id] = $event.target.value"
            >
              <option v-for="l in brandDnaLanguages" :key="l" :value="l">{{ l }}</option>
            </select>
            <input
              v-else
              class="min-w-48 flex-1 rounded-md border px-3 py-2 text-sm"
              :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
              :aria-label="field.label"
              :value="shown(field)"
              @input="drafts[field.id] = $event.target.value"
            />

            <span
              class="rounded-full px-2 py-0.5 text-[11px] font-medium"
              :style="sourceTone[field.source]"
            >
              {{ brandKitSourceLabels[field.source] }}
            </span>

            <button
              v-if="drafts[field.id] != null"
              type="button"
              class="text-xs font-medium underline underline-offset-2"
              :style="{ color: BRAND.gray500 }"
              @click="resetField(field)"
            >
              Reset
            </button>
          </div>
        </div>

        <button
          type="button"
          :disabled="!dirty"
          class="mt-4 rounded-lg px-3.5 py-2 text-sm font-semibold text-white"
          :class="{ 'opacity-40': !dirty }"
          :style="{ background: BRAND.blueSolid }"
          @click="save"
        >
          Save brand kit
        </button>
      </section>
    </div>
  </div>
</template>
