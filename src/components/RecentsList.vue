<template>
  <div>
    <p class="px-3 mb-0.5 text-[11px] font-medium uppercase tracking-wide text-om-gray-400">Recents</p>

    <div v-for="c in sorted" :key="c.id" class="group relative">
      <!-- Rename mode -->
      <input
        v-if="editingId === c.id"
        ref="editInput"
        v-model="editText"
        @keydown.enter="commitRename(c)"
        @keydown.esc="cancelRename"
        @blur="commitRename(c)"
        class="w-full px-3 py-1.5 rounded-lg text-[13px] text-om-gray-700 bg-white border border-om-orange-300 focus:outline-none focus:ring-2 focus:ring-om-orange-200"
      />

      <!-- Normal row -->
      <template v-else>
        <button
          class="w-full text-left pl-3 pr-8 py-1.5 rounded-lg text-[13px] text-om-gray-600 hover:bg-om-gray-100 hover:text-om-gray-700 transition-colors cursor-pointer flex items-center gap-1.5"
          :title="c.title"
        >
          <Star v-if="c.starred" :size="12" class="text-om-orange-500 shrink-0" fill="currentColor" />
          <span class="truncate">{{ c.title }}</span>
        </button>
        <!-- Actions trigger (appears on hover) -->
        <button
          @click.stop="menuId = menuId === c.id ? null : c.id"
          :class="['absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md flex items-center justify-center text-om-gray-400 hover:text-om-gray-700 hover:bg-om-gray-200 transition-opacity', menuId === c.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100']"
          title="More"
        >
          <MoreHorizontal :size="14" />
        </button>
        <!-- Actions menu -->
        <div v-if="menuId === c.id" class="absolute right-1 top-full mt-1 z-50 w-36 bg-white rounded-lg shadow-lg border border-om-gray-200 py-1">
          <button @click.stop="startRename(c)" class="w-full text-left px-3 py-1.5 text-sm text-om-gray-700 hover:bg-om-gray-50 flex items-center gap-2 cursor-pointer">
            <Pencil :size="14" class="text-om-gray-400" /> Rename
          </button>
          <button @click.stop="onStar(c)" class="w-full text-left px-3 py-1.5 text-sm text-om-gray-700 hover:bg-om-gray-50 flex items-center gap-2 cursor-pointer">
            <Star :size="14" class="text-om-gray-400" /> {{ c.starred ? 'Unstar' : 'Star' }}
          </button>
          <button @click.stop="onDelete(c)" class="w-full text-left px-3 py-1.5 text-sm text-[#D92D20] hover:bg-om-gray-50 flex items-center gap-2 cursor-pointer">
            <Trash2 :size="14" /> Delete
          </button>
        </div>
      </template>
    </div>

    <!-- Click-outside to close the menu -->
    <div v-if="menuId" class="fixed inset-0 z-40" @click="menuId = null"></div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { MoreHorizontal, Pencil, Star, Trash2 } from 'lucide-vue-next'
import { useRecents } from '../composables/useRecents.js'

const { conversations, rename, toggleStar, remove } = useRecents()

// Starred conversations float to the top; order is otherwise preserved.
const sorted = computed(() => [...conversations.value].sort((a, b) => (b.starred === a.starred ? 0 : b.starred ? 1 : -1)))

const menuId = ref(null)
const editingId = ref(null)
const editText = ref('')
const editInput = ref(null)

const startRename = (c) => {
  menuId.value = null
  editingId.value = c.id
  editText.value = c.title
  nextTick(() => {
    const el = Array.isArray(editInput.value) ? editInput.value[0] : editInput.value
    if (el) { el.focus(); el.select() }
  })
}
const commitRename = (c) => {
  if (editingId.value !== c.id) return
  rename(c.id, editText.value)
  editingId.value = null
}
const cancelRename = () => { editingId.value = null }

const onStar = (c) => { toggleStar(c.id); menuId.value = null }
const onDelete = (c) => { remove(c.id); menuId.value = null }
</script>
