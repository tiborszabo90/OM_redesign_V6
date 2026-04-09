// Multi-step flow definitions used by DevNavBar for breadcrumb rendering
export const flowDefinitions = {
  'public-wizard': {
    registrationType: 'public-wizard',
    steps: [
      { id: 'public-wizard-url', label: 'URL Input' },
      { id: 'public-wizard-chat', label: 'Goal Input' },
      { id: 'wizard-analysis', label: 'Analysis' },
      { id: 'wizard-style', label: 'Style' },
      { id: 'wizard-quicktune', label: 'Quicktune' },
      { id: 'wizard-recommendation-v4', label: 'Recommendation' },
    ],
  },
  'wizard': {
    registrationType: 'wizard',
    steps: [
      { id: 'wizard-analysis', label: 'Analysis' },
      { id: 'wizard-style', label: 'Style' },
      { id: 'wizard-quicktune', label: 'Quicktune' },
      { id: 'wizard-recommendation-v4', label: 'Recommendation' },
    ],
  },
  'image-with-badge': {
    registrationType: 'image-with-badge',
    versions: [
      { view: 'image-with-badge', label: 'V1', stepCount: 7 },
      { view: 'image-with-badge-v2', label: 'V2', stepCount: 2 },
      { view: 'image-with-badge-v3', label: 'V3', stepCount: 3 },
    ],
  },
  'email': {
    registrationType: 'email',
    steps: [
      { id: 'registration', label: 'Registration' },
      { id: 'onboarding', label: 'Onboarding', hasSteps: true, defaultSteps: 4 },
      { id: 'task-creation', label: 'Tasks' },
    ],
  },
}
