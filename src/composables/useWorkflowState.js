import { ref } from 'vue'

// Module-level state so the workflow editor and the workflow generation page
// share the same step list and references across navigation.
let stepIdCounter = 1
export const nextStepId = () => stepIdCounter++

export const newStep = (overrides = {}) => ({
  id: nextStepId(),
  prompt: '',
  model: 'Nano Banana Pro',
  ratio: '1:1',
  inputs: {
    original: true,
    references: [],
    previousSteps: [],
    variables: [],
  },
  referenceImages: [],
  output: null,
  generating: false,
  waiting: false,
  useMultipleImages: false,
  useProductImageContext: false,
  minDescriptionLength: 0,
  continuePreviousPrompt: false,
  ...overrides,
})

export const workflowSteps = ref([newStep()])
export const workflowReferences = ref([])
