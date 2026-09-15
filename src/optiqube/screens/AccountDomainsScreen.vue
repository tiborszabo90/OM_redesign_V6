<script setup>
import { ref } from 'vue'
import { Plus, X } from 'lucide-vue-next'
import { BRAND } from '../tokens'
import { brands, state } from '../store'
import OqAccountLayout from '../components/OqAccountLayout.vue'

const confirmingId = ref(null)
const addOpen = ref(false)
const newDomain = ref('')

function remove(id) {
  const i = brands.findIndex((b) => b.id === id)
  if (i >= 0) brands.splice(i, 1)
  confirmingId.value = null
}

function add() {
  const domain = newDomain.value.trim().replace(/^https?:\/\//, '').replace(/\/$/, '')
  if (!domain) return
  const name = domain.split('.')[0].replace(/^./, (c) => c.toUpperCase())
  brands.push({ id: `brd_${Date.now()}`, name, domain })
  newDomain.value = ''
  addOpen.value = false
}
</script>

<template>
  <OqAccountLayout title="Domains">
    <div v-if="!brands.length">
      <p class="text-sm" :style="{ color: BRAND.gray500 }">
        No domains yet. Add your first store to get started.
      </p>
      <button
        type="button"
        class="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
        :style="{ background: BRAND.blueSolid }"
        @click="addOpen = true"
      >
        <Plus class="size-4" />
        Add domain
      </button>
    </div>

    <div v-else class="flex flex-col gap-2">
      <template v-for="b in brands" :key="b.id">
        <div
          v-if="confirmingId === b.id"
          class="rounded-xl border px-3 py-3"
          :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
        >
          <p class="text-sm font-medium" :style="{ color: BRAND.ink }">
            Remove {{ b.domain }} from the list?
          </p>
          <p class="mt-0.5 text-xs" :style="{ color: BRAND.gray500 }">
            Its campaigns and sessions are kept — starting a new task on this domain brings it back.
          </p>
          <div class="mt-2 flex items-center gap-2">
            <button
              type="button"
              class="rounded-md px-2.5 py-1.5 text-xs font-semibold text-white"
              :style="{ background: BRAND.redSolid }"
              @click="remove(b.id)"
            >
              Remove
            </button>
            <button
              type="button"
              class="rounded-md px-2.5 py-1.5 text-xs font-medium"
              :style="{ color: BRAND.gray500 }"
              @click="confirmingId = null"
            >
              Cancel
            </button>
          </div>
        </div>

        <div
          v-else
          class="flex items-center gap-3 rounded-xl border px-3 py-3"
          :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
        >
          <div
            class="flex size-8 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white"
            :style="{ background: b.id === state.activeBrandId ? BRAND.blueSolid : BRAND.gray400 }"
          >
            {{ b.name.slice(0, 1).toUpperCase() }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium" :style="{ color: BRAND.ink }">{{ b.name }}</p>
            <p class="mt-0.5 text-xs" :style="{ color: BRAND.gray500 }">{{ b.domain }}</p>
          </div>
          <span
            v-if="b.id === state.activeBrandId"
            class="rounded-full px-2 py-0.5 text-[11px] font-medium"
            :style="{ background: BRAND.blueSoft, color: BRAND.blue }"
          >
            Active
          </span>
          <!-- The active store stays: removing it would strand the pages pinned to it. -->
          <button
            v-else
            type="button"
            :aria-label="`Remove ${b.domain} from the list`"
            class="rounded-md p-1.5"
            :style="{ color: BRAND.gray500 }"
            @click="confirmingId = b.id"
          >
            <X class="size-4" />
          </button>
        </div>
      </template>

      <div v-if="addOpen" class="flex items-center gap-2 pt-2">
        <input
          v-model="newDomain"
          placeholder="yourbrand.com"
          class="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
          :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
          @keydown.enter.prevent="add"
        />
        <button
          type="button"
          class="rounded-lg px-3 py-2 text-sm font-semibold text-white"
          :style="{ background: BRAND.blueSolid }"
          @click="add"
        >
          Add
        </button>
      </div>
      <button
        v-else
        type="button"
        class="mt-2 inline-flex items-center gap-2 self-start rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
        :style="{ background: BRAND.blueSolid }"
        @click="addOpen = true"
      >
        <Plus class="size-4" />
        Add domain
      </button>
    </div>
  </OqAccountLayout>
</template>
