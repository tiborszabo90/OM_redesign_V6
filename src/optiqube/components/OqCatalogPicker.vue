<script setup>
/**
 * The catalog, whenever a product has to be chosen.
 *
 * One modal for both questions the session asks about products — which one the concepts
 * are built on, and which ones a direction is generated on — because they are the same
 * question with a different number of slots, and answering them through two different
 * windows was two things to learn for one job. It is the Products page in a modal: the
 * same search, sort and facet rail over the same rows, so what is being looked for is
 * found the way it is found everywhere else in the app.
 *
 * Full means full: a click past the last slot is refused rather than quietly dropping
 * something that was deliberately chosen, so what comes out is what was picked.
 * `lockedId` is the exception the concept overlay needs, where the seed is the step the
 * whole flow is about and cannot be swapped.
 *
 * Images are filtered in by default — a creative is drawn from the product's picture,
 * so a row without one is not a candidate.
 */
import { computed, ref, watch } from 'vue'
import { Check, ImageOff, Lock, Search, X } from 'lucide-vue-next'
import { BRAND, MODAL_SHADOW } from '../tokens'
import { products, catalogFacets, catalogSortOptions, sortProducts } from '../store'

const props = defineProps({
  open: { type: Boolean, default: false },
  /** Product ids already chosen. */
  selected: { type: Array, default: () => [] },
  /** How many slots there are. One is the seed question; three is a round. */
  max: { type: Number, default: 3 },
  /** The product a direction was designed on. Leads the grid with the rest of the picks. */
  seedId: { type: String, default: '' },
  /** A product that cannot be taken out. Empty leaves every slot free. */
  lockedId: { type: String, default: '' },
})
const emit = defineEmits(['confirm', 'close'])

const query = ref('')
const sort = ref('default')
const withImageOnly = ref(true)
const stock = ref('any')
const brand = ref(null)
const category = ref(null)
const picked = ref([])
/**
 * What led the grid when the modal opened.
 *
 * Frozen rather than live: a product that jumped to the front the moment it was ticked
 * would move the row being read out from under the cursor.
 */
const leadIds = ref([])

const single = computed(() => props.max === 1)

// Every opening starts clean, apart from what was already chosen.
watch(
  () => props.open,
  (open) => {
    if (!open) return
    picked.value = [...new Set([props.lockedId, ...props.selected].filter(Boolean))]
    leadIds.value = [...new Set([props.lockedId, props.seedId, ...picked.value].filter(Boolean))]
    query.value = ''
    sort.value = 'default'
    withImageOnly.value = true
    stock.value = 'any'
    brand.value = null
    category.value = null
  },
  { immediate: true },
)

const facets = computed(() => catalogFacets(products))

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  const rows = products.filter((p) => {
    if (withImageOnly.value && !p.imageUrl) return false
    if (stock.value === 'in' && p.availability !== 'in stock') return false
    if (stock.value === 'out' && p.availability !== 'out of stock') return false
    if (brand.value && p.brand !== brand.value) return false
    if (category.value && p.category !== category.value) return false
    if (q && !p.name.toLowerCase().includes(q) && !p.id.toLowerCase().includes(q)) return false
    return true
  })
  return sortProducts(rows, sort.value)
})

/** What is already chosen leads, so it is never hidden somewhere down the grid. */
const rows = computed(() => {
  if (!leadIds.value.length) return filtered.value
  const lead = []
  const rest = []
  for (const p of filtered.value) (leadIds.value.includes(p.id) ? lead : rest).push(p)
  return [...lead, ...rest]
})

const filterCount = computed(
  () =>
    (withImageOnly.value ? 1 : 0) +
    (stock.value !== 'any' ? 1 : 0) +
    (brand.value ? 1 : 0) +
    (category.value ? 1 : 0),
)

const full = computed(() => picked.value.length >= props.max)
const pickedProduct = computed(() => products.find((p) => p.id === picked.value[0]) ?? null)

function toggle(id) {
  if (id === props.lockedId) return
  if (single.value) {
    picked.value = [id]
    return
  }
  if (picked.value.includes(id)) {
    picked.value = picked.value.filter((x) => x !== id)
    return
  }
  if (full.value) return
  picked.value = [...picked.value, id]
}

function clearAll() {
  query.value = ''
  withImageOnly.value = false
  stock.value = 'any'
  brand.value = null
  category.value = null
}

function nf(n) {
  return n.toLocaleString('hu-HU')
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4"
    @click="emit('close')"
  >
    <div
      class="flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl"
      :style="{ background: BRAND.surface, boxShadow: MODAL_SHADOW }"
      @click.stop
    >
      <div
        class="flex shrink-0 items-start justify-between gap-3 border-b px-5 py-3.5"
        :style="{ borderColor: BRAND.gray200 }"
      >
        <div>
          <h2 class="text-sm font-semibold" :style="{ color: BRAND.ink }">
            {{ single ? 'Select a product' : 'Generate on' }}
          </h2>
          <p class="text-xs" :style="{ color: BRAND.gray500 }">
            {{ nf(products.length) }} products across your catalog ·
            <template v-if="single">pick the one the concepts are built on</template>
            <template v-else>
              pick up to {{ max }}.
              <span v-if="full">Deselect one to choose another.</span>
            </template>
          </p>
        </div>
        <button type="button" aria-label="Close" class="rounded-md p-1" @click="emit('close')">
          <X class="size-4" :style="{ color: BRAND.gray500 }" />
        </button>
      </div>

      <div
        class="flex shrink-0 flex-wrap items-center gap-3 border-b px-4 py-3"
        :style="{ borderColor: BRAND.gray200 }"
      >
        <div
          class="flex min-w-[200px] flex-1 items-center gap-2 rounded-lg border px-2.5 py-1.5"
          :style="{ borderColor: BRAND.gray300 }"
        >
          <Search class="size-3.5 shrink-0" :style="{ color: BRAND.gray400 }" />
          <input
            v-model="query"
            :placeholder="`Search ${nf(products.length)} products…`"
            class="min-w-0 flex-1 bg-transparent text-[13px] outline-none"
            :style="{ color: BRAND.ink }"
          />
        </div>

        <select
          v-model="sort"
          class="rounded-lg border bg-transparent px-2.5 py-1.5 text-xs outline-none"
          :style="{ borderColor: BRAND.gray300, color: BRAND.gray600 }"
        >
          <option v-for="o in catalogSortOptions" :key="o.value" :value="o.value">
            {{ o.label }}
          </option>
        </select>

        <span class="text-xs" :style="{ color: BRAND.gray500 }">
          Showing
          <b class="font-mono" :style="{ color: BRAND.ink }">{{ nf(filtered.length) }}</b>
          <span v-if="filterCount"> · {{ filterCount }} filters</span>
        </span>

        <button
          v-if="filterCount || query"
          type="button"
          class="text-xs font-medium underline underline-offset-2"
          :style="{ color: BRAND.blue }"
          @click="clearAll"
        >
          Clear filters
        </button>
      </div>

      <div class="flex min-h-0 flex-1">
        <aside
          class="w-44 shrink-0 space-y-4 overflow-y-auto border-r p-3"
          :style="{ background: BRAND.gray50, borderColor: BRAND.gray200 }"
        >
          <label class="flex items-center gap-1.5 text-xs" :style="{ color: BRAND.gray600 }">
            <input
              v-model="withImageOnly"
              type="checkbox"
              class="size-3.5 rounded"
              :style="{ accentColor: BRAND.blue }"
            />
            Has an image
          </label>

          <div>
            <p
              class="mb-1.5 text-[10px] font-bold uppercase tracking-wider"
              :style="{ color: BRAND.gray500 }"
            >
              Stock
            </p>
            <select
              v-model="stock"
              class="w-full rounded-md border bg-transparent px-2 py-1.5 text-xs outline-none"
              :style="{ borderColor: BRAND.gray300, color: BRAND.ink }"
            >
              <option value="any">Any stock</option>
              <option value="in">In stock ({{ nf(facets.inStock) }})</option>
              <option value="out">Out of stock ({{ nf(facets.outOfStock) }})</option>
            </select>
          </div>

          <div>
            <p
              class="mb-1.5 text-[10px] font-bold uppercase tracking-wider"
              :style="{ color: BRAND.gray500 }"
            >
              Category
            </p>
            <div class="flex flex-col gap-0.5">
              <button
                v-for="c in facets.categories"
                :key="c.value"
                type="button"
                class="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-[11px]"
                :style="{
                  background: category === c.value ? BRAND.blueSoft : 'transparent',
                  color: category === c.value ? BRAND.blue : BRAND.gray600,
                }"
                :title="c.value"
                @click="category = category === c.value ? null : c.value"
              >
                <span class="min-w-0 flex-1 truncate">{{ c.value }}</span>
                <span class="shrink-0 font-mono opacity-70">{{ c.count }}</span>
              </button>
            </div>
          </div>

          <div>
            <p
              class="mb-1.5 text-[10px] font-bold uppercase tracking-wider"
              :style="{ color: BRAND.gray500 }"
            >
              Brand
            </p>
            <div class="flex flex-col gap-0.5">
              <button
                v-for="b in facets.brands"
                :key="b.value"
                type="button"
                class="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-[11px]"
                :style="{
                  background: brand === b.value ? BRAND.blueSoft : 'transparent',
                  color: brand === b.value ? BRAND.blue : BRAND.gray600,
                }"
                @click="brand = brand === b.value ? null : b.value"
              >
                <span class="min-w-0 flex-1 truncate">{{ b.value }}</span>
                <span class="shrink-0 font-mono opacity-70">{{ b.count }}</span>
              </button>
            </div>
          </div>
        </aside>

        <div class="min-h-0 flex-1 overflow-y-auto p-4" :style="{ background: BRAND.gray50 }">
          <div v-if="!rows.length" class="py-10 text-center">
            <p class="text-sm" :style="{ color: BRAND.gray600 }">No products match these filters.</p>
            <button
              type="button"
              class="mt-2 text-xs font-medium underline underline-offset-2"
              :style="{ color: BRAND.blue }"
              @click="clearAll"
            >
              Clear filters
            </button>
          </div>

          <ul
            v-else
            class="grid list-none gap-3 p-0"
            style="grid-template-columns: repeat(auto-fill, minmax(128px, 1fr))"
          >
            <li v-for="p in rows" :key="p.id">
              <button
                type="button"
                class="w-full overflow-hidden rounded-xl border text-left transition-shadow hover:shadow-[var(--oq-shadow-lift)]"
                :class="[
                  p.id === lockedId ? 'cursor-default' : '',
                  full && !single && !picked.includes(p.id) ? 'opacity-45' : '',
                ]"
                :style="{
                  borderColor: picked.includes(p.id) ? BRAND.blue : BRAND.gray200,
                  background: BRAND.surface,
                }"
                :title="full && !single && !picked.includes(p.id) ? 'Deselect one first' : p.name"
                @click="toggle(p.id)"
              >
                <span
                  class="relative grid aspect-square place-items-center border-b p-2"
                  :style="{ background: BRAND.gray50, borderColor: BRAND.gray100 }"
                >
                  <img
                    v-if="p.imageUrl"
                    :src="p.imageUrl"
                    alt=""
                    loading="lazy"
                    class="max-h-full max-w-full object-contain"
                  />
                  <span
                    v-else
                    class="flex flex-col items-center gap-1 text-[10px] font-semibold"
                    :style="{ color: BRAND.red }"
                  >
                    <ImageOff class="size-4" />
                    no image
                  </span>
                  <span
                    v-if="picked.includes(p.id)"
                    class="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full"
                    :style="{
                      background: p.id === lockedId ? BRAND.gray400 : BRAND.blueSolid,
                      color: BRAND.onAccent,
                    }"
                  >
                    <Lock v-if="p.id === lockedId" class="size-2.5" />
                    <Check v-else class="size-3" :stroke-width="3" />
                  </span>
                </span>

                <span class="block px-2 pb-2 pt-1.5">
                  <span
                    class="line-clamp-2 block text-[11px] font-medium leading-snug"
                    :style="{ color: BRAND.ink }"
                  >
                    {{ p.name }}
                  </span>
                  <span class="mt-1 flex items-center gap-1.5">
                    <span class="truncate font-mono text-[10px]" :style="{ color: BRAND.gray500 }">
                      {{ p.id }}
                    </span>
                    <span
                      class="ml-auto shrink-0 font-mono text-[10px]"
                      :style="{ color: BRAND.gray600 }"
                    >
                      {{ p.price }}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="flex shrink-0 items-center justify-between gap-3 border-t px-5 py-3"
        :style="{ borderColor: BRAND.gray200 }"
      >
        <p class="min-w-0 truncate text-xs" :style="{ color: BRAND.gray500 }">
          <template v-if="single">
            <span v-if="pickedProduct">
              Building on <b :style="{ color: BRAND.ink }">{{ pickedProduct.name }}</b>
            </span>
            <span v-else>Nothing selected yet</span>
          </template>
          <template v-else>{{ picked.length }} of {{ max }} selected</template>
        </p>
        <div class="flex shrink-0 items-center gap-2">
          <button
            type="button"
            class="rounded-xl border px-4 py-2 text-sm font-semibold"
            :style="{ borderColor: BRAND.gray200, color: BRAND.ink }"
            @click="emit('close')"
          >
            Cancel
          </button>
          <button
            type="button"
            :disabled="!picked.length"
            class="rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-45"
            :style="{ background: BRAND.blue, color: BRAND.onAccent }"
            @click="emit('confirm', picked)"
          >
            {{ single ? 'Use this product' : 'Use these' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
