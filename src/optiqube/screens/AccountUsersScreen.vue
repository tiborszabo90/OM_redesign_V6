<script setup>
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import { BRAND } from '../tokens'
import { teamMembers, teamInvites, initials, relativeWhen } from '../store'
import OqAccountLayout from '../components/OqAccountLayout.vue'

const inviteOpen = ref(false)
const inviteEmail = ref('')
const inviteRole = ref('member')

const ROLE_LABELS = { owner: 'Owner', admin: 'Admin', member: 'Member' }

function sendInvite() {
  if (!inviteEmail.value.trim()) return
  teamInvites.push({
    id: `inv_${Date.now()}`,
    email: inviteEmail.value.trim(),
    role: inviteRole.value,
    sentAt: new Date().toISOString(),
  })
  inviteEmail.value = ''
  inviteOpen.value = false
}

function revoke(id) {
  const i = teamInvites.findIndex((x) => x.id === id)
  if (i >= 0) teamInvites.splice(i, 1)
}
</script>

<template>
  <OqAccountLayout title="Users">
    <p class="text-sm" :style="{ color: BRAND.gray500 }">
      Everyone here works in this account. Everything except billing is shared.
    </p>

    <div v-if="inviteOpen" class="mt-4 flex flex-wrap items-center gap-2">
      <input
        v-model="inviteEmail"
        type="email"
        placeholder="colleague@yourshop.com"
        class="min-w-[220px] flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
        :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
        @keydown.enter.prevent="sendInvite"
      />
      <select
        v-model="inviteRole"
        class="rounded-lg border px-2.5 py-2 text-sm outline-none"
        :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
      >
        <option value="member">Member</option>
        <option value="admin">Admin</option>
      </select>
      <button
        type="button"
        class="rounded-lg px-3 py-2 text-sm font-semibold text-white"
        :style="{ background: BRAND.blueSolid }"
        @click="sendInvite"
      >
        Send invite
      </button>
      <button type="button" class="text-sm font-medium" :style="{ color: BRAND.gray500 }" @click="inviteOpen = false">
        Cancel
      </button>
    </div>
    <button
      v-else
      type="button"
      class="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
      :style="{ background: BRAND.blueSolid }"
      @click="inviteOpen = true"
    >
      <Plus class="size-4" />
      Invite user
    </button>

    <div class="mt-6 flex flex-col gap-2">
      <div
        v-for="m in teamMembers"
        :key="m.id"
        class="flex items-center gap-3 rounded-xl border px-3 py-3"
        :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
      >
        <div
          class="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
          :style="{ background: BRAND.blueSolid }"
        >
          {{ initials(m.name) }}
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium" :style="{ color: BRAND.ink }">{{ m.name }}</p>
          <p class="truncate text-xs" :style="{ color: BRAND.gray500 }">{{ m.email }}</p>
        </div>
        <span
          class="rounded-full px-2 py-0.5 text-[11px] font-medium"
          :style="
            m.role === 'owner'
              ? { background: BRAND.blueSoft, color: BRAND.blue }
              : { background: BRAND.gray100, color: BRAND.gray600 }
          "
        >
          {{ ROLE_LABELS[m.role] }}
        </span>
      </div>

      <div
        v-for="inv in teamInvites"
        :key="inv.id"
        class="flex items-center gap-3 rounded-xl border px-3 py-3"
        :style="{ borderColor: BRAND.gray200, background: BRAND.gray50 }"
      >
        <div
          class="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
          :style="{ background: BRAND.gray100, color: BRAND.gray500 }"
        >
          ?
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium" :style="{ color: BRAND.ink }">{{ inv.email }}</p>
          <p class="truncate text-xs" :style="{ color: BRAND.gray500 }">
            Invited {{ relativeWhen(inv.sentAt) }} ago · {{ ROLE_LABELS[inv.role] }}
          </p>
        </div>
        <span
          class="rounded-full px-2 py-0.5 text-[11px] font-medium"
          :style="{ background: BRAND.warningSoft, color: BRAND.warningText }"
        >
          Pending
        </span>
        <button type="button" class="text-xs font-semibold" :style="{ color: BRAND.red }" @click="revoke(inv.id)">
          Revoke
        </button>
      </div>
    </div>
  </OqAccountLayout>
</template>
