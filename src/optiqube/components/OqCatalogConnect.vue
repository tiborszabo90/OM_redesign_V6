<script setup>
/**
 * The choose-products step when there is no catalog to choose from.
 *
 * The store scan found enough products to design a style on, but an ad runs on the
 * catalog: it is what keeps prices, stock and new products in sync once the ad is live.
 * So the step asks for it here, where the question comes up, rather than sending the
 * merchant off to Settings and away from the style they just finished.
 *
 * The sources are Settings' own list (`SettingsCatalogScreen`). Connecting reads the
 * feed for a moment and then hands the step back to the host, which shows the picker.
 */
import { computed, ref } from 'vue'
import { ArrowRight, FileCode2, LayoutGrid, Loader2, Package, ShoppingBag, ShoppingCart, Store, Tag } from 'lucide-vue-next'
import { BRAND, CARD_SHADOW } from '../tokens'
import { activeBrand, connections, products } from '../store'

defineProps({
  /** The direction the ad is made in. */
  runLabel: { type: String, default: '' },
  /** Its latest creative, to show what the catalog will be drawn in. */
  imageUrl: { type: String, default: '' },
  /** Asked from a campaign rather than the run window: its own heading and reason. */
  title: { type: String, default: 'Connect your catalog to choose products' },
  body: { type: String, default: '' },
  laterLabel: { type: String, default: 'Not now — save it as a draft campaign' },
})
const emit = defineEmits(['connected', 'later'])

const KINDS = [
  { kind: 'meta', label: 'Meta Commerce Catalog', icon: LayoutGrid, blurb: 'a catalog already in Commerce Manager' },
  { kind: 'xml', label: 'XML feed', icon: FileCode2, blurb: 'a Google Shopping or Meta-style export URL' },
  { kind: 'unas', label: 'Unas', icon: Store, blurb: "read live over the shop's API with an API key" },
  { kind: 'shoprenter', label: 'Shoprenter', icon: ShoppingBag, blurb: "read live over the shop's API with an API user" },
  { kind: 'woo', label: 'WooCommerce', icon: ShoppingCart, blurb: 'a WordPress shop, read over its REST API' },
  { kind: 'shopify', label: 'Shopify', icon: Tag, blurb: 'read off the storefront, or with an Admin API token' },
]

const kind = ref('shopify')
const feedUrl = ref('')
const syncing = ref(false)

const picked = computed(() => KINDS.find((k) => k.kind === kind.value))
const canConnect = computed(() => kind.value !== 'xml' || feedUrl.value.trim())

/** The ad's frame, then the products it will be repeated on — a few, and the rest implied. */
const previewProducts = computed(() => products.filter((p) => p.imageUrl).slice(0, 4))

function connect() {
  if (!canConnect.value || syncing.value) return
  syncing.value = true
  setTimeout(() => {
    const url = feedUrl.value.trim()
    connections.catalog.connected = true
    connections.catalog.source = kind.value
    connections.catalog.feedUrl = url || connections.catalog.feedUrl
    connections.catalog.sourceLabel =
      kind.value === 'xml'
        ? `XML feed · ${url.replace(/^https?:\/\//, '')}`
        : `${picked.value.label} · ${activeBrand().domain}`
    connections.catalog.productCount = products.length
    connections.catalog.lastSyncedAt = new Date().toISOString()
    syncing.value = false
    emit('connected')
  }, 1600)
}
</script>

<template>
  <div class="min-h-0 flex-1 overflow-y-auto">
    <div class="mx-auto flex max-w-[640px] flex-col items-center py-4 text-center">
      <!-- The finished style, and the catalog it is waiting for. -->
      <div class="flex items-center gap-3" aria-hidden="true">
        <div
          class="size-24 overflow-hidden rounded-2xl border"
          :style="{ borderColor: BRAND.gray200, background: BRAND.gray50, boxShadow: CARD_SHADOW }"
        >
          <img v-if="imageUrl" :src="imageUrl" alt="" class="size-full object-cover" />
        </div>
        <ArrowRight class="size-5 shrink-0" :style="{ color: BRAND.gray400 }" />
        <div class="flex items-center">
          <div
            v-for="(p, i) in previewProducts"
            :key="p.id"
            class="size-14 overflow-hidden rounded-xl border-2"
            :class="i > 0 ? '-ml-4' : ''"
            :style="{ borderColor: BRAND.pageBg, background: BRAND.gray100, opacity: 1 - i * 0.18 }"
          >
            <img :src="p.imageUrl" alt="" class="size-full object-cover grayscale" />
          </div>
          <div
            class="-ml-4 flex size-14 items-center justify-center rounded-xl border-2 border-dashed text-xs font-semibold"
            :style="{ borderColor: BRAND.gray300, background: BRAND.surface, color: BRAND.gray500 }"
          >
            <Package class="size-5" />
          </div>
        </div>
      </div>

      <h2 class="mt-6 text-xl font-semibold" :style="{ color: BRAND.ink }">
        {{ title }}
      </h2>
      <p v-if="body" class="mt-2 max-w-[520px] text-sm leading-relaxed" :style="{ color: BRAND.gray500 }">
        {{ body }}
      </p>
      <p v-else class="mt-2 max-w-[520px] text-sm leading-relaxed" :style="{ color: BRAND.gray500 }">
        The <span class="font-semibold" :style="{ color: BRAND.ink }">{{ runLabel }}</span> style is ready.
        To run it as an ad, OptiQube needs your product catalog — it keeps prices, stock and new
        products in sync with the ad. Your style is saved, and you’ll land right back here.
      </p>

      <div
        class="mt-6 w-full rounded-2xl border p-4 text-left"
        :style="{ borderColor: BRAND.gray200, background: BRAND.surface, boxShadow: CARD_SHADOW }"
      >
        <p class="text-xs font-semibold uppercase tracking-wide" :style="{ color: BRAND.gray500 }">
          Where do your products live?
        </p>
        <div role="radiogroup" aria-label="Product source" class="mt-2 grid grid-cols-2 gap-2">
          <button
            v-for="k in KINDS"
            :key="k.kind"
            type="button"
            role="radio"
            :aria-checked="kind === k.kind"
            :disabled="syncing"
            class="flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors disabled:opacity-60"
            :style="{
              borderColor: kind === k.kind ? BRAND.blue : BRAND.gray200,
              background: kind === k.kind ? BRAND.blueSoft : BRAND.surface,
            }"
            @click="kind = k.kind"
          >
            <component
              :is="k.icon"
              class="mt-0.5 size-4 shrink-0"
              :style="{ color: kind === k.kind ? BRAND.blue : BRAND.gray500 }"
            />
            <span class="min-w-0">
              <span class="block truncate text-sm font-semibold" :style="{ color: BRAND.ink }">{{ k.label }}</span>
              <span class="block text-xs leading-snug" :style="{ color: BRAND.gray500 }">{{ k.blurb }}</span>
            </span>
          </button>
        </div>

        <div class="mt-4 space-y-2">
          <template v-if="kind === 'xml'">
            <label class="block text-xs font-medium" :style="{ color: BRAND.gray600 }" for="oq-connect-feed">Feed URL</label>
            <input
              id="oq-connect-feed"
              v-model="feedUrl"
              :disabled="syncing"
              placeholder="https://yourshop.com/feeds/meta-catalog.xml"
              class="w-full rounded-md border px-3 py-2 text-sm outline-none"
              :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
              @keydown.enter.prevent="connect"
            />
          </template>
          <p v-else class="text-sm" :style="{ color: BRAND.gray500 }">
            {{ picked.label }} — you will be asked to sign in and pick which shop OptiQube reads.
          </p>
        </div>

        <div class="mt-4 flex items-center gap-3">
          <button
            type="button"
            :disabled="!canConnect || syncing"
            class="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-45"
            :style="{ background: BRAND.blueSolid }"
            @click="connect"
          >
            <Loader2 v-if="syncing" class="size-4 animate-spin" />
            {{ syncing ? 'Reading your products…' : 'Connect catalog' }}
          </button>
          <button
            type="button"
            :disabled="syncing"
            class="text-sm font-semibold hover:underline disabled:opacity-40"
            :style="{ color: BRAND.gray500 }"
            @click="emit('later')"
          >
            {{ laterLabel }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
