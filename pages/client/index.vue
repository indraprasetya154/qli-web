<script setup lang="ts">
import { computed } from 'vue'
import type { ClientDetail } from '~/types/client'
import { apiFetchErrorMessage } from '~/utils/apiFormat'
import {
  accountStatusColor,
  clientStatusColor,
  clientStatusLabel,
  genderLabel,
} from '~/utils/client'
import { formatDateDmy, formatDateTimeDmyHm } from '~/utils/dateFormat'

definePageMeta({ layout: 'app-sidebar', middleware: ['client'] })

const { setBreadcrumbs } = useAppLayout()
setBreadcrumbs([{ title: 'Profil Saya', href: '/client' }])

useHead({ title: 'Profil Saya' })

const { apiFetch } = useApi()

const { data, pending, error, refresh } = useAsyncData('client-me', () =>
  apiFetch<{ data: ClientDetail }>('/v1/client/me')
)

const detail = computed(() => data.value?.data)
const loadError = computed(() => apiFetchErrorMessage(error.value))
const isNotFound = computed(() => loadError.value.toLowerCase().includes('not found'))

function display(value?: string | null) {
  return value?.trim() ? value : '-'
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col gap-6 p-4 sm:p-6">
    <div v-if="pending" class="space-y-3">
      <USkeleton class="h-24 w-full rounded-2xl bg-zinc-100" />
      <USkeleton class="h-64 w-full rounded-2xl bg-zinc-100" />
    </div>

    <AppEmptyState
      v-else-if="error && !isNotFound"
      title="Gagal memuat profil."
      :description="loadError"
    >
      <UButton color="neutral" variant="outline" size="sm" @click="() => refresh()">
        Coba lagi
      </UButton>
    </AppEmptyState>

    <AppEmptyState
      v-else-if="isNotFound"
      title="Profil client belum tersedia."
      description="Hubungi admin untuk melengkapi profil client Anda."
    />

    <template v-else-if="detail">
      <AppPageHeader
        :title="detail.full_name"
        :description="`${detail.client_code} · ${detail.personal_email}`"
        icon-name="i-heroicons-user-circle"
        container-class="items-start"
        description-class="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-600"
      >
        <template #actions>
          <UBadge :color="clientStatusColor(detail.status)" variant="subtle" size="sm">
            {{ clientStatusLabel(detail.status) }}
          </UBadge>
        </template>
      </AppPageHeader>

      <section class="grid gap-4 lg:grid-cols-2">
        <div class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
          <h2 class="text-sm font-semibold text-zinc-900">Personal information</h2>
          <dl class="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt class="text-zinc-500">Full name</dt>
              <dd class="font-medium text-zinc-900">{{ detail.full_name }}</dd>
            </div>
            <div>
              <dt class="text-zinc-500">Client ID</dt>
              <dd class="font-mono text-zinc-900">{{ detail.client_code }}</dd>
            </div>
            <div>
              <dt class="text-zinc-500">Date of birth</dt>
              <dd class="text-zinc-900">{{ formatDateDmy(detail.date_of_birth) }}</dd>
            </div>
            <div>
              <dt class="text-zinc-500">Gender</dt>
              <dd class="text-zinc-900">{{ genderLabel(detail.gender) }}</dd>
            </div>
            <div class="sm:col-span-2">
              <dt class="text-zinc-500">Address</dt>
              <dd class="whitespace-pre-wrap text-zinc-900">{{ display(detail.address) }}</dd>
            </div>
          </dl>
        </div>

        <div class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
          <h2 class="text-sm font-semibold text-zinc-900">Contact information</h2>
          <dl class="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt class="text-zinc-500">Phone</dt>
              <dd class="text-zinc-900">{{ detail.phone_number }}</dd>
            </div>
            <div>
              <dt class="text-zinc-500">Personal email</dt>
              <dd class="break-all text-zinc-900">{{ detail.personal_email }}</dd>
            </div>
            <div>
              <dt class="text-zinc-500">Application email</dt>
              <dd class="break-all text-zinc-900">{{ display(detail.application_email) }}</dd>
            </div>
            <div>
              <dt class="text-zinc-500">Recovery phone</dt>
              <dd class="text-zinc-900">{{ display(detail.recovery_phone) }}</dd>
            </div>
          </dl>
        </div>

        <div class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
          <h2 class="text-sm font-semibold text-zinc-900">Professional background</h2>
          <dl class="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt class="text-zinc-500">Education</dt>
              <dd class="text-zinc-900">{{ display(detail.education) }}</dd>
            </div>
            <div>
              <dt class="text-zinc-500">Skills</dt>
              <dd class="text-zinc-900">{{ display(detail.skills) }}</dd>
            </div>
            <div class="sm:col-span-2">
              <dt class="text-zinc-500">Work experience</dt>
              <dd class="whitespace-pre-wrap text-zinc-900">{{ display(detail.experience) }}</dd>
            </div>
          </dl>
        </div>

        <div class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
          <h2 class="text-sm font-semibold text-zinc-900">CMS account</h2>
          <dl class="mt-4 space-y-3 text-sm">
            <div>
              <dt class="text-zinc-500">Login email</dt>
              <dd class="break-all text-zinc-900">{{ detail.user?.email ?? '-' }}</dd>
            </div>
            <div>
              <dt class="text-zinc-500">Account status</dt>
              <dd>
                <UBadge
                  v-if="detail.user"
                  :color="accountStatusColor(detail.user.is_active)"
                  variant="subtle"
                  size="sm"
                >
                  {{ detail.user.is_active ? 'Active' : 'Inactive' }}
                </UBadge>
                <span v-else class="text-zinc-600">Belum ada akun</span>
              </dd>
            </div>
            <div>
              <dt class="text-zinc-500">Last login</dt>
              <dd class="text-zinc-900">
                {{
                  detail.user?.last_login_at
                    ? formatDateTimeDmyHm(detail.user.last_login_at)
                    : 'Belum pernah login'
                }}
              </dd>
            </div>
          </dl>
          <p class="mt-4 text-xs leading-relaxed text-zinc-500">
            Untuk perubahan data atau reset password, hubungi admin.
          </p>
        </div>
      </section>
    </template>
  </div>
</template>
