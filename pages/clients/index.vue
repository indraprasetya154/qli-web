<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { PaginatedResponse } from '~/composables/useApi'
import type { ClientListRow, ClientStats } from '~/types/client'
import { apiFetchErrorMessage } from '~/utils/apiFormat'
import {
  ACCOUNT_STATUS_OPTIONS,
  CLIENT_STATUS_OPTIONS,
  clientStatusColor,
  clientStatusLabel,
  maskEmail,
} from '~/utils/client'
import { formatDateDmy } from '~/utils/dateFormat'

definePageMeta({ layout: 'app-sidebar', middleware: ['admin'] })

const { setBreadcrumbs } = useAppLayout()
setBreadcrumbs([
  { title: 'Beranda', href: '/dashboard' },
  { title: 'Client Management' },
  { title: 'Client List' },
])

useHead({ title: 'Client List' })

const { apiFetch, apiDelete } = useApi()
const toast = useToast()

const page = ref(1)
const perPage = ref(10)
const keyword = ref('')
const statusFilter = ref('all')
const accountFilter = ref('all')
const sortBy = ref('created_at')
const sortOrder = ref<'asc' | 'desc'>('desc')
const busy = ref(false)
const deleteOpen = ref(false)
const deleteTarget = ref<ClientListRow | null>(null)

const columns = [
  { key: 'client_code', label: 'Client ID', sortable: true, headerClass: 'whitespace-nowrap' },
  { key: 'full_name', label: 'Full Name', sortable: true, headerClass: 'min-w-[12rem]' },
  { key: 'personal_email', label: 'Email', sortable: true, headerClass: 'min-w-[14rem]' },
  { key: 'phone_number', label: 'Phone', sortable: true, headerClass: 'whitespace-nowrap' },
  { key: 'education', label: 'Education', sortable: true, headerClass: 'hidden md:table-cell' },
  {
    key: 'application_email',
    label: 'Application Email',
    sortable: true,
    headerClass: 'hidden xl:table-cell min-w-[14rem]',
  },
  { key: 'account_status', label: 'Account Status', headerClass: 'whitespace-nowrap' },
  { key: 'status', label: 'Client Status', sortable: true, headerClass: 'whitespace-nowrap' },
  {
    key: 'created_at',
    label: 'Created At',
    sortable: true,
    headerClass: 'hidden lg:table-cell whitespace-nowrap',
  },
  { key: 'aksi', label: 'Actions', headerClass: 'whitespace-nowrap text-right' },
]

const queryString = computed(() => {
  const params = new URLSearchParams({
    page: String(page.value),
    per_page: String(perPage.value),
    sort_by: sortBy.value,
    sort_order: sortOrder.value,
  })
  if (keyword.value.trim()) params.set('q', keyword.value.trim())
  if (statusFilter.value !== 'all') params.set('status', statusFilter.value)
  if (accountFilter.value !== 'all') params.set('account_status', accountFilter.value)
  return params.toString()
})

const { data, pending, error, refresh } = useAsyncData(
  'client-list',
  () => apiFetch<PaginatedResponse<ClientListRow>>(`/v1/client/?${queryString.value}`),
  { watch: [queryString] }
)

const { data: statsData, refresh: refreshStats } = useAsyncData('client-stats', () =>
  apiFetch<{ data: ClientStats }>('/v1/client/stats')
)

const rows = computed(() => data.value?.data ?? [])
const meta = computed(() => data.value?.meta)
const stats = computed<ClientStats>(
  () => statsData.value?.data ?? { total: 0, active: 0, with_account: 0 }
)
const errMsg = computed(() => apiFetchErrorMessage(error.value))
const metaFrom = computed(() => Number(meta.value?.from ?? 0))
const metaTo = computed(() => Number(meta.value?.to ?? 0))
const metaTotal = computed(() => Number(meta.value?.total ?? 0))
const hasPrev = computed(() => Boolean(meta.value?.has_prev))
const hasNext = computed(() => Boolean(meta.value?.has_next))

const statusOptions = [{ label: 'All statuses', value: 'all' }, ...CLIENT_STATUS_OPTIONS]

watch([keyword, statusFilter, accountFilter, perPage], () => {
  page.value = 1
})

async function refreshAll() {
  await Promise.all([refresh(), refreshStats()])
}

function openDelete(row: ClientListRow) {
  deleteTarget.value = row
  deleteOpen.value = true
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  busy.value = true
  try {
    await apiDelete(`/v1/client/${deleteTarget.value.id}`)
    toast.add({ title: 'Client berhasil dihapus.', color: 'success' })
    deleteOpen.value = false
    deleteTarget.value = null
    await refreshAll()
  } catch (e) {
    toast.add({ title: apiFetchErrorMessage(e), color: 'error' })
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col gap-6 p-4 sm:p-6">
    <AppPageHeader
      title="Client List"
      description="Kelola data client, akun CMS, dan status penempatan kerja."
      icon-name="i-heroicons-users"
      container-class="items-center"
      description-class="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-600"
    >
      <template #actions>
        <UButton
          color="neutral"
          size="sm"
          icon="i-lucide-refresh-cw"
          class="shrink-0"
          :loading="pending"
          @click="refreshAll"
        >
          Muat ulang
        </UButton>
        <UButton
          to="/clients/create"
          color="primary"
          size="sm"
          icon="i-lucide-plus"
          class="shrink-0"
        >
          Add Client
        </UButton>
      </template>
    </AppPageHeader>

    <section class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-2xl border border-zinc-200 bg-white p-5">
        <p class="text-xs font-medium text-zinc-500">Total Clients</p>
        <p class="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
          {{ stats.total }}
        </p>
      </div>
      <div class="rounded-2xl border border-zinc-200 bg-white p-5">
        <p class="text-xs font-medium text-zinc-500">Active Clients</p>
        <p class="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
          {{ stats.active }}
        </p>
      </div>
      <div class="rounded-2xl border border-zinc-200 bg-white p-5">
        <p class="text-xs font-medium text-zinc-500">With CMS Account</p>
        <p class="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
          {{ stats.with_account }}
        </p>
      </div>
    </section>

    <section class="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <div v-if="pending && !data" class="space-y-3 p-5 sm:p-6">
        <USkeleton class="h-8 w-full max-w-md rounded-lg bg-zinc-100" />
        <USkeleton class="h-48 w-full rounded-xl bg-zinc-100" />
      </div>

      <AppEmptyState v-else-if="error" title="Gagal memuat client." :description="errMsg">
        <UButton color="neutral" variant="outline" size="sm" @click="refreshAll">
          Coba lagi
        </UButton>
      </AppEmptyState>

      <AppDataTable
        v-else
        :columns="columns"
        :rows="rows"
        :keyword="keyword"
        :sort-by="sortBy"
        :sort-order="sortOrder"
        :page="page"
        :per-page="perPage"
        :from="metaFrom"
        :to="metaTo"
        :total="metaTotal"
        :has-prev="hasPrev"
        :has-next="hasNext"
        search-placeholder="Cari nama, email, atau client ID..."
        empty-title="Belum ada client."
        @update:keyword="keyword = $event"
        @update:sort-by="sortBy = $event"
        @update:sort-order="sortOrder = $event"
        @update:page="page = $event"
        @update:per-page="perPage = $event"
      >
        <template #filters>
          <div class="grid gap-2 sm:grid-cols-2">
            <USelect
              v-model="statusFilter"
              :items="statusOptions"
              placeholder="Filter client status"
              class="w-full sm:max-w-xs"
            />
            <USelect
              v-model="accountFilter"
              :items="ACCOUNT_STATUS_OPTIONS"
              placeholder="Filter account status"
              class="w-full sm:max-w-xs"
            />
          </div>
        </template>

        <template #rows>
          <tr
            v-for="row in rows"
            :key="row.id"
            class="bg-white transition-colors hover:bg-zinc-50/80"
          >
            <td class="whitespace-nowrap px-4 py-3 font-mono text-xs sm:px-5">
              <NuxtLink
                :to="`/clients/${row.id}`"
                class="text-zinc-900 underline-offset-2 hover:underline"
              >
                {{ row.client_code }}
              </NuxtLink>
            </td>
            <td class="px-4 py-3 font-medium sm:px-5">
              <NuxtLink
                :to="`/clients/${row.id}`"
                class="text-zinc-900 underline-offset-2 hover:underline"
              >
                {{ row.full_name }}
              </NuxtLink>
            </td>
            <td class="max-w-[16rem] truncate px-4 py-3 text-zinc-600 sm:px-5">
              {{ row.personal_email }}
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-zinc-600 sm:px-5">
              {{ row.phone_number }}
            </td>
            <td class="hidden px-4 py-3 text-zinc-600 md:table-cell sm:px-5">
              {{ row.education || '-' }}
            </td>
            <td class="hidden max-w-[14rem] truncate px-4 py-3 text-zinc-600 xl:table-cell sm:px-5">
              {{ maskEmail(row.application_email) }}
            </td>
            <td class="whitespace-nowrap px-4 py-3 sm:px-5">
              <UBadge
                v-if="row.account"
                :color="row.account.is_active ? 'success' : 'warning'"
                variant="subtle"
                size="sm"
              >
                {{ row.account.is_active ? 'Active' : 'Inactive' }}
              </UBadge>
              <UBadge v-else color="neutral" variant="subtle" size="sm"> No account </UBadge>
            </td>
            <td class="whitespace-nowrap px-4 py-3 sm:px-5">
              <UBadge :color="clientStatusColor(row.status)" variant="subtle" size="sm">
                {{ clientStatusLabel(row.status) }}
              </UBadge>
            </td>
            <td class="hidden whitespace-nowrap px-4 py-3 text-zinc-600 lg:table-cell sm:px-5">
              {{ formatDateDmy(row.created_at) }}
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-right sm:px-5">
              <div class="inline-flex items-center gap-2">
                <UButton size="xs" color="neutral" variant="soft" :to="`/clients/${row.id}`">
                  Detail
                </UButton>
                <UButton size="xs" color="warning" variant="soft" :to="`/clients/${row.id}/edit`">
                  Edit
                </UButton>
                <UButton
                  size="xs"
                  color="error"
                  variant="soft"
                  :disabled="busy"
                  @click="openDelete(row)"
                >
                  Delete
                </UButton>
              </div>
            </td>
          </tr>
        </template>
      </AppDataTable>
    </section>

    <UModal
      v-model:open="deleteOpen"
      title="Hapus client"
      :description="`Data ${deleteTarget?.full_name ?? ''} akan dihapus. Aksi ini dapat dipulihkan oleh admin melalui database.`"
    >
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton color="neutral" variant="outline" :disabled="busy" @click="deleteOpen = false">
            Batal
          </UButton>
          <UButton color="error" :loading="busy" @click="confirmDelete"> Ya, hapus </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
