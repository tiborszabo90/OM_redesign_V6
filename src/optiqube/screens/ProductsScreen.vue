<script setup>
import { computed, ref, watch } from 'vue'
import { ImageOff, Search } from 'lucide-vue-next'
import { BRAND, CARD_SHADOW, FONT } from '../tokens'
import { products, catalogFacets, catalogSortOptions, sortProducts } from '../store'

const PAGE_LIMIT = 60
const RAIL_DEFAULT = 176
const RAIL_MIN = 150
const RAIL_MAX = 520

const query = ref('')
const sort = ref('default')
const page = ref(0)
const withImageOnly = ref(false)
const stock = ref('any')
const brand = ref(null)
const category = ref(null)

const railWidth = ref(RAIL_DEFAULT)
const draggingRail = ref(false)

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

const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_LIMIT)))
const pageRows = computed(() =>
  filtered.value.slice(page.value * PAGE_LIMIT, (page.value + 1) * PAGE_LIMIT),
)

const filterCount = computed(
  () =>
    (withImageOnly.value ? 1 : 0) +
    (stock.value !== 'any' ? 1 : 0) +
    (brand.value ? 1 : 0) +
    (category.value ? 1 : 0),
)

// A narrowed list can be shorter than the page you were on.
watch(filtered, () => {
  if (page.value > pageCount.value - 1) page.value = 0
})

function clearAll() {
  query.value = ''
  withImageOnly.value = false
  stock.value = 'any'
  brand.value = null
  category.value = null
}

function clampRail(px) {
  return Math.min(RAIL_MAX, Math.max(RAIL_MIN, Math.round(px)))
}

function onRailMove(e) {
  if (!draggingRail.value) return
  const left = e.currentTarget.parentElement.querySelector('aside').getBoundingClientRect().left
  railWidth.value = clampRail(e.clientX - left)
}

function nf(n) {
  return n.toLocaleString('hu-HU')
}
</script>

<template>
  <div
    class="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl"
    :style="{ fontFamily: FONT, background: BRAND.surface, boxShadow: CARD_SHADOW }"
  >
      <header class="shrink-0 border-b px-5 py-3.5" :style="{ borderColor: BRAND.gray200 }">
        <h1 class="text-lg font-semibold tracking-tight" :style="{ color: BRAND.ink }">Products</h1>
        <p class="text-xs" :style="{ color: BRAND.gray500 }">
          {{ nf(products.length) }} products across your catalog ·
          {{ nf(facets.withImage) }} with an image
        </p>
      </header>

      <div class="flex min-h-0 flex-1">
        <aside
          class="shrink-0 space-y-4 overflow-y-auto p-3"
          :style="{ width: `${railWidth}px`, background: BRAND.gray50 }"
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
            <p class="mb-1.5 text-[10px] font-bold uppercase tracking-wider" :style="{ color: BRAND.gray500 }">
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
            <p class="mb-1.5 text-[10px] font-bold uppercase tracking-wider" :style="{ color: BRAND.gray500 }">
              Category
            </p>
            <div class="flex flex-col gap-0.5">
              <button
                v-for="c in facets.categories"
                :key="c.value"
                type="button"
                @click="category = category === c.value ? null : c.value"
                class="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-[11px]"
                :style="{
                  background: category === c.value ? BRAND.blueSoft : 'transparent',
                  color: category === c.value ? BRAND.blue : BRAND.gray600,
                }"
                :title="c.value"
              >
                <span class="min-w-0 flex-1 truncate">{{ c.value }}</span>
                <span class="shrink-0 font-mono opacity-70">{{ c.count }}</span>
              </button>
            </div>
          </div>

          <div>
            <p class="mb-1.5 text-[10px] font-bold uppercase tracking-wider" :style="{ color: BRAND.gray500 }">
              Brand
            </p>
            <div class="flex flex-col gap-0.5">
              <button
                v-for="b in facets.brands"
                :key="b.value"
                type="button"
                @click="brand = brand === b.value ? null : b.value"
                class="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-[11px]"
                :style="{
                  background: brand === b.value ? BRAND.blueSoft : 'transparent',
                  color: brand === b.value ? BRAND.blue : BRAND.gray600,
                }"
              >
                <span class="min-w-0 flex-1 truncate">{{ b.value }}</span>
                <span class="shrink-0 font-mono opacity-70">{{ b.count }}</span>
              </button>
            </div>
          </div>
        </aside>

        <!-- Doubles as the rail's border and its grip. -->
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize filters"
          class="w-1.5 shrink-0 cursor-col-resize touch-none"
          :style="{ background: draggingRail ? BRAND.blueSolid : BRAND.gray200 }"
          @pointerdown="(e) => { e.currentTarget.setPointerCapture(e.pointerId); draggingRail = true }"
          @pointermove="onRailMove"
          @pointerup="(e) => { e.currentTarget.releasePointerCapture(e.pointerId); draggingRail = false }"
          @dblclick="railWidth = RAIL_DEFAULT"
        />

        <div class="flex min-w-0 flex-1 flex-col" :class="{ 'select-none': draggingRail }">
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
              @click="clearAll"
              class="text-xs font-medium underline underline-offset-2"
              :style="{ color: BRAND.blue }"
            >
              Clear filters
            </button>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto p-4" :style="{ background: BRAND.gray50 }">
            <div v-if="!pageRows.length" class="py-10 text-center">
              <p class="text-sm" :style="{ color: BRAND.gray600 }">No products match these filters.</p>
              <button
                type="button"
                @click="clearAll"
                class="mt-2 text-xs font-medium underline underline-offset-2"
                :style="{ color: BRAND.blue }"
              >
                Clear filters
              </button>
            </div>

            <ul
              v-else
              class="grid gap-3"
              style="grid-template-columns: repeat(auto-fill, minmax(128px, 1fr))"
            >
              <li
                v-for="p in pageRows"
                :key="p.id"
                class="overflow-hidden rounded-xl border"
                :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
              >
                <div
                  class="grid aspect-square place-items-center border-b p-2"
                  :style="{ background: BRAND.gray50, borderColor: BRAND.gray100 }"
                >
                  <!-- object-contain keeps the source aspect visible inside the 1:1
                       target — a wide product visibly fails to fill the square. -->
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
                </div>

                <div class="px-2 pb-2 pt-1.5">
                  <p
                    class="line-clamp-2 text-[11px] font-medium leading-snug"
                    :style="{ color: BRAND.ink }"
                    :title="p.name"
                  >
                    {{ p.name }}
                  </p>
                  <div class="mt-1 flex items-center gap-1.5">
                    <span class="truncate font-mono text-[10px]" :style="{ color: BRAND.gray500 }">
                      {{ p.id }}
                    </span>
                    <span class="ml-auto shrink-0 font-mono text-[10px]" :style="{ color: BRAND.gray600 }">
                      {{ p.price }}
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div
            v-if="pageCount > 1"
            class="flex shrink-0 items-center gap-3 border-t px-4 py-2.5"
            :style="{ borderColor: BRAND.gray200 }"
          >
            <button
              type="button"
              :disabled="page <= 0"
              @click="page = Math.max(0, page - 1)"
              class="rounded-lg border px-2.5 py-1 text-xs font-medium"
              :class="{ 'opacity-40': page <= 0 }"
              :style="{ borderColor: BRAND.gray300, color: BRAND.gray600 }"
            >
              Previous
            </button>
            <span class="font-mono text-xs" :style="{ color: BRAND.gray500 }">
              Page {{ page + 1 }} of {{ pageCount }}
            </span>
            <button
              type="button"
              :disabled="page >= pageCount - 1"
              @click="page = page + 1"
              class="rounded-lg border px-2.5 py-1 text-xs font-medium"
              :class="{ 'opacity-40': page >= pageCount - 1 }"
              :style="{ borderColor: BRAND.gray300, color: BRAND.gray600 }"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
</template>
