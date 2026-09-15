<script setup>
import { ref } from 'vue'
import { LayoutGrid, FileCode2, Store, ShoppingBag, ShoppingCart, Tag, Trash2 } from 'lucide-vue-next'
import { BRAND, CARD_SHADOW } from '../tokens'
import { activeBrand, connections, navigate } from '../store'
import OqWizardChrome from '../components/OqWizardChrome.vue'

/**
 * One page, no "done" step: several catalogs can be connected at once, so the
 * merchant has to be able to add a second one without walking back through a
 * completion screen.
 */
const KINDS = [
  { kind: 'meta', label: 'Meta Commerce Catalog', icon: LayoutGrid, blurb: 'a catalog already in Commerce Manager' },
  { kind: 'xml', label: 'XML feed', icon: FileCode2, blurb: 'a Google Shopping or Meta-style export URL' },
  { kind: 'unas', label: 'Unas', icon: Store, blurb: "read live over the shop's API with an API key" },
  { kind: 'shoprenter', label: 'Shoprenter', icon: ShoppingBag, blurb: "read live over the shop's API with an API user" },
  { kind: 'woo', label: 'WooCommerce', icon: ShoppingCart, blurb: 'a WordPress shop, read over its REST API' },
  { kind: 'shopify', label: 'Shopify', icon: Tag, blurb: 'read off the storefront, or with an Admin API token' },
]

const kind = ref('xml')
const feedUrl = ref('')

function connect() {
  connections.catalog.connected = true
  connections.catalog.source = kind.value
  connections.catalog.feedUrl = feedUrl.value || connections.catalog.feedUrl
  connections.catalog.sourceLabel =
    kind.value === 'xml'
      ? `XML feed · ${(feedUrl.value || connections.catalog.feedUrl).replace(/^https?:\/\//, '')}`
      : `${KINDS.find((k) => k.kind === kind.value).label} · ${activeBrand().domain}`
  connections.catalog.lastSyncedAt = new Date().toISOString()
  feedUrl.value = ''
}

function disconnect() {
  connections.catalog.connected = false
}
</script>

<template>
  <OqWizardChrome
    :brand-line="`${activeBrand().name} · ${activeBrand().domain}`"
    title="Connect catalog"
    description="Sync a Meta Commerce Catalog, paste an XML product feed, or connect your Unas, Shoprenter, WooCommerce or Shopify shop — every connected source feeds the same product pool for bulk creative generation."
    :steps="['Products']"
    :active-step="0"
  >
    <div class="space-y-5">
      <div v-if="connections.catalog.connected" class="space-y-2">
        <div
          class="flex items-center gap-3 rounded-xl border p-3"
          :style="{ borderColor: BRAND.gray200, background: BRAND.surface, boxShadow: CARD_SHADOW }"
        >
          <span class="size-2 shrink-0 rounded-full" :style="{ background: BRAND.emeraldText }" />
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold" :style="{ color: BRAND.ink }">
              {{ connections.catalog.sourceLabel }}
            </p>
            <p class="text-xs" :style="{ color: BRAND.gray500 }">
              {{ connections.catalog.productCount }} products · synced
              {{ new Date(connections.catalog.lastSyncedAt).toLocaleString() }}
            </p>
          </div>
          <button
            type="button"
            aria-label="Remove source"
            class="rounded-md p-1.5"
            :style="{ color: BRAND.gray400 }"
            @click="disconnect"
          >
            <Trash2 class="size-4" />
          </button>
        </div>
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-wide" :style="{ color: BRAND.gray500 }">
          {{ connections.catalog.connected ? 'Add another source' : 'Where do your products live?' }}
        </p>
        <div
          role="radiogroup"
          aria-label="Product source"
          class="mt-2 overflow-hidden rounded-xl border"
          :style="{ borderColor: BRAND.gray200 }"
        >
          <button
            v-for="(k, i) in KINDS"
            :key="k.kind"
            type="button"
            role="radio"
            :aria-checked="kind === k.kind"
            @click="kind = k.kind"
            class="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors"
            :class="{ 'border-t': i > 0 }"
            :style="{
              borderColor: BRAND.gray200,
              background: kind === k.kind ? BRAND.blueSoft : BRAND.surface,
            }"
          >
            <span
              class="grid size-4 shrink-0 place-items-center rounded-full border"
              :style="{ borderColor: kind === k.kind ? BRAND.blue : BRAND.gray300 }"
              aria-hidden="true"
            >
              <span v-if="kind === k.kind" class="size-2 rounded-full" :style="{ background: BRAND.blueSolid }" />
            </span>
            <component
              :is="k.icon"
              class="size-4 shrink-0"
              :style="{ color: kind === k.kind ? BRAND.blue : BRAND.gray500 }"
            />
            <span class="min-w-0 flex-1 truncate text-sm">
              <span class="font-semibold" :style="{ color: BRAND.ink }">{{ k.label }}</span>
              <span class="ml-2 text-xs" :style="{ color: BRAND.gray500 }">{{ k.blurb }}</span>
            </span>
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <template v-if="kind === 'xml'">
          <label class="block text-xs font-medium" :style="{ color: BRAND.gray600 }">Feed URL</label>
          <input
            v-model="feedUrl"
            placeholder="https://yourshop.com/feeds/meta-catalog.xml"
            class="w-full rounded-md border px-3 py-2 text-sm outline-none"
            :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
          />
        </template>
        <p v-else class="text-sm" :style="{ color: BRAND.gray500 }">
          {{ KINDS.find((k) => k.kind === kind).label }} — you will be asked to sign in and pick
          which shop OptiQube reads.
        </p>

        <button
          type="button"
          class="rounded-md px-4 py-2.5 text-sm font-semibold text-white"
          :style="{ background: BRAND.blueSolid }"
          @click="connect"
        >
          {{ connections.catalog.connected ? 'Add source' : 'Connect' }}
        </button>
      </div>

      <div class="flex flex-wrap gap-2 border-t pt-4" :style="{ borderColor: BRAND.gray200 }">
        <button
          type="button"
          class="rounded-md border px-4 py-2.5 text-sm font-medium"
          :style="{ borderColor: BRAND.gray200, color: BRAND.ink }"
          @click="navigate('/settings')"
        >
          Back to Settings
        </button>
        <button
          v-if="connections.catalog.connected"
          type="button"
          class="rounded-md px-4 py-2.5 text-sm font-semibold text-white"
          :style="{ background: BRAND.blueSolid }"
          @click="navigate('/campaigns')"
        >
          Go to campaigns
        </button>
      </div>
    </div>
  </OqWizardChrome>
</template>
