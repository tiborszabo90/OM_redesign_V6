<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="fixed inset-0 bg-black/30" @click="cancel" />
        <div class="relative bg-white rounded-2xl shadow-xl p-6 w-96 z-10">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-om-gray-700">Add new domain</h2>
            <Button variant="ghost" size="sm" icon-only @click="cancel">
              <template #icon><X :size="16" /></template>
            </Button>
          </div>
          <FormInput
            v-model="domain"
            label="Domain"
            placeholder="example.com"
            @keydown.enter="handleAdd"
          />
          <div class="flex justify-end mt-6">
            <Button variant="primary" :disabled="!domain.trim()" @click="handleAdd">Add domain</Button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import FormInput from './FormInput.vue'
import Button from './Button.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'add'])

const domain = ref('')

watch(() => props.modelValue, (val) => {
  if (val) domain.value = ''
})

const handleAdd = () => {
  if (!domain.value.trim()) return
  emit('add', domain.value.trim())
  emit('update:modelValue', false)
}

const cancel = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.15s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
