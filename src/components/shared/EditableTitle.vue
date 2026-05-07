<template>
  <input
    v-if="isEditing"
    ref="inputRef"
    :value="modelValue"
    type="text"
    @input="$emit('update:modelValue', $event.target.value)"
    @blur="isEditing = false"
    @keydown.enter="isEditing = false"
    @keydown.esc="isEditing = false"
    class="block text-2xl font-semibold text-om-gray-700 mb-1 bg-transparent border border-om-orange-300 rounded-md focus:outline-none focus:border-om-orange-500 px-2 py-0.5 -mx-2 leading-tight box-border"
  />
  <h1
    v-else
    @click="startEditing"
    class="text-2xl font-semibold text-om-gray-700 mb-1 cursor-text border border-transparent hover:border-om-gray-200 hover:bg-om-gray-100 rounded-md px-2 py-0.5 -mx-2 leading-tight box-border"
  >{{ modelValue }}</h1>
</template>

<script setup>
import { ref, nextTick } from 'vue'

defineProps({
  modelValue: { type: String, required: true }
})

defineEmits(['update:modelValue'])

const isEditing = ref(false)
const inputRef = ref(null)

const startEditing = async () => {
  isEditing.value = true
  await nextTick()
  inputRef.value?.focus()
  inputRef.value?.select()
}
</script>
