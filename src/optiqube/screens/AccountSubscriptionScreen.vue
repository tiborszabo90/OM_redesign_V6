<script setup>
import { computed, ref } from 'vue'
import { Check } from 'lucide-vue-next'
import { BRAND } from '../tokens'
import { account, subscription, plans, invoices, brands } from '../store'
import OqAccountLayout from '../components/OqAccountLayout.vue'

const requested = ref(null)
const forDomain = ref(brands[0]?.domain ?? null)

const pct = computed(() =>
  Math.min(100, ((account.credits.balance / account.credits.granted) * 100) || 0),
)

const currentPlanId = computed(() => subscription.plan.toLowerCase())
</script>

<template>
  <OqAccountLayout title="Subscription">
    <div class="max-w-xl space-y-6">
      <div>
        <p class="text-sm font-medium" :style="{ color: BRAND.gray500 }">My plan</p>
        <p class="mt-1 text-base font-semibold" :style="{ color: BRAND.ink }">
          {{ subscription.plan }} · ${{ subscription.price }}/{{ subscription.interval }}
        </p>
        <p class="mt-1 text-xs" :style="{ color: BRAND.gray500 }">
          Renews {{ subscription.renewsAt }} · {{ subscription.paymentMethod.brand }} ····
          {{ subscription.paymentMethod.last4 }}
        </p>
      </div>

      <div>
        <div class="flex items-baseline justify-between gap-3">
          <p class="text-sm font-medium" :style="{ color: BRAND.gray500 }">Credits left</p>
          <p class="text-sm font-semibold" :style="{ color: BRAND.ink }">
            {{ account.credits.balance }} / {{ account.credits.granted }}
          </p>
        </div>
        <div class="mt-2 h-2 overflow-hidden rounded-full" :style="{ background: BRAND.gray100 }">
          <div class="h-full rounded-full" :style="{ width: `${pct}%`, background: BRAND.blueSolid }" />
        </div>
      </div>

      <div>
        <div class="flex flex-wrap items-baseline justify-between gap-2">
          <p class="text-sm font-medium" :style="{ color: BRAND.gray500 }">Plans</p>
          <label class="flex items-center gap-1.5 text-xs" :style="{ color: BRAND.gray500 }">
            For
            <select
              v-model="forDomain"
              class="rounded-lg border px-2 py-1 text-xs"
              :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
              aria-label="Domain to subscribe"
            >
              <option v-for="b in brands" :key="b.id" :value="b.domain">{{ b.domain }}</option>
            </select>
          </label>
        </div>

        <div class="mt-2 grid gap-3 sm:grid-cols-2">
          <div
            v-for="p in plans"
            :key="p.id"
            class="rounded-xl border p-4"
            :style="{ borderColor: BRAND.gray100 }"
          >
            <div class="flex items-baseline justify-between gap-2">
              <p class="text-sm font-semibold" :style="{ color: BRAND.ink }">{{ p.name }}</p>
              <p class="text-sm font-semibold tabular-nums" :style="{ color: BRAND.ink }">
                ${{ p.price }}<span class="text-xs font-normal" :style="{ color: BRAND.gray500 }">/mo</span>
              </p>
            </div>
            <p class="mt-1 text-xs" :style="{ color: BRAND.gray500 }">
              Per domain · {{ p.credits.toLocaleString() }} credits every month
            </p>
            <p class="mt-1 text-xs" :style="{ color: BRAND.gray500 }">{{ p.blurb }}</p>

            <p
              v-if="requested === p.id"
              class="mt-3 flex items-center gap-1.5 text-xs font-medium"
              :style="{ color: BRAND.emeraldText }"
            >
              <Check class="size-3.5" />
              Request sent — we'll be in touch shortly.
            </p>
            <p v-else-if="p.id === currentPlanId" class="mt-3 text-xs" :style="{ color: BRAND.gray500 }">
              Your account is on this plan.
            </p>
            <button
              v-else
              type="button"
              class="mt-3 w-full rounded-lg px-3 py-2 text-xs font-semibold text-white"
              :style="{ background: BRAND.blueSolid }"
              @click="requested = p.id"
            >
              Choose {{ p.name }}
            </button>
          </div>
        </div>
      </div>

      <div>
        <p class="text-sm font-medium" :style="{ color: BRAND.gray500 }">Invoices</p>
        <div class="mt-2 overflow-hidden rounded-lg border" :style="{ borderColor: BRAND.gray100 }">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left" :style="{ color: BRAND.gray500 }">
                <th class="px-3 py-2 font-medium">Date</th>
                <th class="px-3 py-2 text-right font-medium">Amount</th>
                <th class="px-3 py-2 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody :style="{ color: BRAND.ink }">
              <tr v-for="inv in invoices" :key="inv.id" class="border-t" :style="{ borderColor: BRAND.gray100 }">
                <td class="px-3 py-2">{{ inv.date }}</td>
                <td class="px-3 py-2 text-right tabular-nums">${{ inv.amount }}</td>
                <td class="px-3 py-2 text-right capitalize" :style="{ color: BRAND.emeraldText }">
                  {{ inv.status }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mt-2 text-xs" :style="{ color: BRAND.gray500 }">
          An image costs 4–9 credits depending on the style, a video clip 40.
        </p>
      </div>
    </div>
  </OqAccountLayout>
</template>
