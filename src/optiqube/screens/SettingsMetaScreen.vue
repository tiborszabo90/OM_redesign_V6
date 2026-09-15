<script setup>
import { computed, ref } from 'vue'
import { BRAND, CARD_SHADOW } from '../tokens'
import { activeBrand, connections, navigate } from '../store'
import OqWizardChrome from '../components/OqWizardChrome.vue'
import OqChoiceCard from '../components/OqChoiceCard.vue'

/**
 * `products` replaced a "link a Meta Commerce Catalog?" step whose only effect was
 * storing an id nobody read. The decision belongs at the end of the flow, and it is
 * a real one: the picked catalog's products get synced into the product index.
 */
const STEPS = ['Login', 'Business', 'Ad account', 'Products']

const step = ref('intro')
const businessId = ref(null)
const adAccountId = ref(null)

const stepIndex = computed(() => {
  if (step.value === 'intro' || step.value === 'oauth') return 0
  if (step.value === 'business') return 1
  if (step.value === 'adaccount') return 2
  return 3
})

const businesses = [
  { id: '104829471', name: 'Nordic Supply Co.' },
  { id: '558210394', name: 'Nordic Supply — Agency seat' },
]

const adAccounts = [
  { id: 'act_1043928471', name: 'Nordic Supply — EU', currency: 'EUR', status: 'active' },
  { id: 'act_1043928999', name: 'Nordic Supply — Nordics', currency: 'DKK', status: 'active' },
  { id: 'act_2048112233', name: 'Nordic Supply — legacy', currency: 'EUR', status: 'disabled' },
]

const selectedBusiness = computed(() => businesses.find((b) => b.id === businessId.value))

function finish() {
  const acc = adAccounts.find((a) => a.id === adAccountId.value)
  connections.meta.connected = true
  connections.meta.businessName = selectedBusiness.value.name
  connections.meta.adAccountId = acc.id
  connections.meta.adAccountName = acc.name
  step.value = 'products'
}
</script>

<template>
  <OqWizardChrome
    :brand-line="`${activeBrand().name} · ${activeBrand().domain}`"
    title="Connect Meta Ads"
    description="Link Business Portfolio + Ad Account, then choose where your products come from."
    :steps="STEPS"
    :active-step="stepIndex"
  >
    <!-- Intro -->
    <div v-if="step === 'intro'" class="space-y-4">
      <ul class="space-y-2 text-sm" :style="{ color: BRAND.gray600 }">
        <li>1. Sign in with a Meta Business user</li>
        <li>2. Pick Business Portfolio</li>
        <li>3. Pick Ad Account for {{ activeBrand().domain }}</li>
        <li>4. Choose products — a Meta catalog or an XML feed</li>
      </ul>
      <p
        class="rounded-lg border px-3 py-2 text-xs leading-relaxed"
        :style="{ borderColor: BRAND.warningLine, background: BRAND.warningSoft, color: BRAND.warningText }"
      >
        You need Admin (or sufficient) access on the Ad Account. Personal Facebook alone isn't
        enough if assets live in Business Manager.
      </p>
      <div class="flex gap-2">
        <button
          type="button"
          class="rounded-md border px-4 py-2.5 text-sm font-medium"
          :style="{ borderColor: BRAND.gray200, color: BRAND.ink }"
          @click="navigate('/settings')"
        >
          Skip
        </button>
        <button
          type="button"
          class="rounded-md px-4 py-2.5 text-sm font-semibold text-white"
          style="background: #1877f2"
          @click="step = 'oauth'"
        >
          Continue with Meta →
        </button>
      </div>
    </div>

    <!-- OAuth consent -->
    <div v-else-if="step === 'oauth'" class="space-y-4">
      <div
        class="rounded-xl border p-4"
        :style="{ borderColor: BRAND.gray200, background: BRAND.surface, boxShadow: CARD_SHADOW }"
      >
        <p class="text-xs font-medium" :style="{ color: BRAND.gray500 }">
          facebook.com / dialog/oauth (demo)
        </p>
        <h2 class="mt-1 text-lg font-semibold" :style="{ color: BRAND.ink }">OptiQube wants to</h2>
        <ul class="mt-3 space-y-1 text-sm" :style="{ color: BRAND.gray600 }">
          <li>✓ Manage your business</li>
          <li>✓ Access your ad accounts (read)</li>
          <li>✓ Read your product catalogs</li>
        </ul>
      </div>
      <div class="flex gap-2">
        <button
          type="button"
          class="rounded-md border px-4 py-2.5 text-sm font-medium"
          :style="{ borderColor: BRAND.gray200, color: BRAND.ink }"
          @click="step = 'intro'"
        >
          Cancel
        </button>
        <button
          type="button"
          class="rounded-md px-4 py-2.5 text-sm font-semibold text-white"
          style="background: #1877f2"
          @click="step = 'business'"
        >
          Allow
        </button>
      </div>
    </div>

    <!-- Business -->
    <div v-else-if="step === 'business'" class="space-y-3">
      <p class="text-sm" :style="{ color: BRAND.gray500 }">Which Business Portfolio?</p>
      <OqChoiceCard
        v-for="b in businesses"
        :key="b.id"
        :selected="businessId === b.id"
        :title="b.name"
        :description="`Business ID · ${b.id}`"
        @click="businessId = b.id; adAccountId = null"
      />
      <div class="flex gap-2 pt-2">
        <button
          type="button"
          class="rounded-md border px-4 py-2.5 text-sm font-medium"
          :style="{ borderColor: BRAND.gray200, color: BRAND.ink }"
          @click="step = 'oauth'"
        >
          Back
        </button>
        <button
          type="button"
          :disabled="!businessId"
          class="rounded-md px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          :style="{ background: BRAND.blueSolid }"
          @click="step = 'adaccount'"
        >
          Continue
        </button>
      </div>
    </div>

    <!-- Ad account -->
    <div v-else-if="step === 'adaccount'" class="space-y-3">
      <p class="text-sm" :style="{ color: BRAND.gray500 }">
        Pick Ad Account for {{ selectedBusiness?.name ?? 'business' }}
      </p>
      <OqChoiceCard
        v-for="a in adAccounts"
        :key="a.id"
        :selected="adAccountId === a.id"
        :disabled="a.status !== 'active'"
        :title="a.name"
        :description="
          a.status === 'active'
            ? `${a.id} · ${a.currency} · Active`
            : `${a.id} · Disabled — no spend permission`
        "
        @click="adAccountId = a.id"
      />
      <div class="flex gap-2 pt-2">
        <button
          type="button"
          class="rounded-md border px-4 py-2.5 text-sm font-medium"
          :style="{ borderColor: BRAND.gray200, color: BRAND.ink }"
          @click="step = 'business'"
        >
          Back
        </button>
        <button
          type="button"
          :disabled="!adAccountId"
          class="rounded-md px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          :style="{ background: BRAND.blueSolid }"
          @click="finish"
        >
          Continue
        </button>
      </div>
    </div>

    <!-- Products -->
    <div v-else-if="step === 'products'" class="space-y-4">
      <div>
        <h2 class="text-base font-semibold" :style="{ color: BRAND.ink }">Where are your products?</h2>
        <p class="mt-1 text-sm leading-relaxed" :style="{ color: BRAND.gray500 }">
          Meta Ads is connected. Sync one of your Meta catalogs, or paste an XML feed — this is what
          bulk creative generation runs on. Optional; you can add it later.
        </p>
      </div>
      <div class="flex gap-2">
        <button
          type="button"
          class="rounded-md border px-4 py-2.5 text-sm font-medium"
          :style="{ borderColor: BRAND.gray200, color: BRAND.ink }"
          @click="step = 'done'"
        >
          Skip for now
        </button>
        <button
          type="button"
          class="rounded-md px-4 py-2.5 text-sm font-semibold text-white"
          :style="{ background: BRAND.blueSolid }"
          @click="navigate('/settings/catalog')"
        >
          Choose a product source
        </button>
      </div>
    </div>

    <!-- Done -->
    <div v-else class="space-y-4">
      <div class="rounded-xl border p-4" :style="{ borderColor: BRAND.infoLine, background: BRAND.infoSoft }">
        <h2 class="text-base font-semibold" :style="{ color: BRAND.ink }">Meta Ads connected</h2>
        <p class="mt-1 text-sm" :style="{ color: BRAND.gray500 }">
          {{ connections.meta.businessName }} · {{ connections.meta.adAccountId }}
        </p>
      </div>
      <ul class="space-y-2 text-sm" :style="{ color: BRAND.gray600 }">
        <li>✓ Business Portfolio linked</li>
        <li>✓ Ad Account selected</li>
        <li>
          {{
            connections.catalog.connected
              ? `✓ Products · ${connections.catalog.sourceLabel} · ${connections.catalog.productCount}`
              : '○ Products — skipped, add a source in Settings for bulk generation'
          }}
        </li>
      </ul>
      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-xl border p-3" :style="{ borderColor: BRAND.gray200, background: BRAND.gray50 }">
          <p class="text-xs" :style="{ color: BRAND.gray500 }">Unlocks</p>
          <p class="text-sm font-semibold" :style="{ color: BRAND.ink }">Live KPIs</p>
        </div>
        <div class="rounded-xl border p-3" :style="{ borderColor: BRAND.gray200, background: BRAND.gray50 }">
          <p class="text-xs" :style="{ color: BRAND.gray500 }">Later</p>
          <p class="text-sm font-semibold" :style="{ color: BRAND.ink }">Feed push</p>
        </div>
      </div>
      <button
        type="button"
        class="inline-flex rounded-md px-4 py-2.5 text-sm font-semibold text-white"
        :style="{ background: BRAND.blueSolid }"
        @click="navigate('/settings')"
      >
        Back to Settings
      </button>
    </div>
  </OqWizardChrome>
</template>
