<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ClientDetail } from '~/types/client'
import { apiFetchErrorMessage } from '~/utils/apiFormat'
import {
  accountStatusColor,
  clientStatusColor,
  clientStatusLabel,
  genderLabel,
} from '~/utils/client'
import { formatDateDmy, formatDateTimeDmyHm } from '~/utils/dateFormat'

definePageMeta({ layout: 'app-sidebar', middleware: ['admin'] })

const route = useRoute()
const id = computed(() => String(route.params.id ?? ''))

const { setBreadcrumbs } = useAppLayout()
setBreadcrumbs([
  { title: 'Beranda', href: '/dashboard' },
  { title: 'Client Management' },
  { title: 'Client List', href: '/clients' },
  { title: 'Detail Client' },
])

useHead({ title: 'Detail Client' })

const { apiFetch, apiPatch, apiPost, apiDelete } = useApi()
const toast = useToast()

type ClientTab = 'overview' | 'application' | 'account' | 'notes'
const tabs: Array<{ key: ClientTab; label: string }> = [
  { key: 'overview', label: 'Overview' },
  { key: 'application', label: 'Application Information' },
  { key: 'account', label: 'Account' },
  { key: 'notes', label: 'Notes' },
]
const activeTab = ref<ClientTab>('overview')
const accountBusy = ref(false)
const statusBusy = ref(false)
const notesBusy = ref(false)
const deleteBusy = ref(false)
const accountEmail = ref('')
const accountPassword = ref('')
const notesDraft = ref('')
const deleteOpen = ref(false)
const statusConfirmOpen = ref(false)
const credentialOpen = ref(false)
const credentialTitle = ref('')
const credentialEmail = ref('')
const credentialPassword = ref('')

const { data, pending, error, refresh } = useAsyncData(
  'client-detail',
  () => apiFetch<{ data: ClientDetail }>(`/v1/client/${id.value}`),
  { watch: [id] }
)

const detail = computed(() => data.value?.data)
const loadError = computed(() => apiFetchErrorMessage(error.value))
const account = computed(() => detail.value?.user ?? null)
const hasAccount = computed(() => Boolean(account.value))
const accountIsActive = computed(() => account.value?.is_active === true)

watch(
  detail,
  (value) => {
    notesDraft.value = value?.notes ?? ''
    if (!value?.user) {
      accountEmail.value = value?.personal_email ?? ''
    }
  },
  { immediate: true }
)

function showCredential(title: string, email: string, password: string) {
  credentialTitle.value = title
  credentialEmail.value = email
  credentialPassword.value = password
  credentialOpen.value = true
}

async function copyPassword() {
  try {
    await navigator.clipboard.writeText(credentialPassword.value)
    toast.add({ title: 'Password disalin.', color: 'success' })
  } catch {
    toast.add({ title: 'Gagal menyalin password.', color: 'error' })
  }
}

async function createAccount() {
  if (!accountEmail.value.trim()) {
    toast.add({ title: 'Login email wajib diisi.', color: 'error' })
    return
  }
  accountBusy.value = true
  try {
    const response = await apiPost<{
      data: ClientDetail
      temporary_password?: string
    }>(`/v1/client/${id.value}/account`, {
      email: accountEmail.value.trim(),
      password: accountPassword.value || undefined,
    })
    accountPassword.value = ''
    await refresh()
    toast.add({ title: 'Akun CMS berhasil dibuat.', color: 'success' })
    if (response.temporary_password) {
      showCredential(
        'Akun CMS berhasil dibuat',
        response.data.user?.email ?? accountEmail.value,
        response.temporary_password
      )
    }
  } catch (e) {
    toast.add({ title: apiFetchErrorMessage(e), color: 'error' })
  } finally {
    accountBusy.value = false
  }
}

async function resetPassword() {
  accountBusy.value = true
  try {
    const response = await apiPost<{
      data: ClientDetail
      temporary_password: string
    }>(`/v1/client/${id.value}/account/reset-password`, {})
    await refresh()
    showCredential(
      'Password berhasil direset',
      response.data.user?.email ?? '-',
      response.temporary_password
    )
  } catch (e) {
    toast.add({ title: apiFetchErrorMessage(e), color: 'error' })
  } finally {
    accountBusy.value = false
  }
}

async function inviteAccount() {
  accountBusy.value = true
  try {
    const response = await apiPost<{
      data: ClientDetail
      temporary_password: string
    }>(`/v1/client/${id.value}/account/invite`, {})
    await refresh()
    showCredential(
      'Password awal dibuat',
      response.data.user?.email ?? '-',
      response.temporary_password
    )
  } catch (e) {
    toast.add({ title: apiFetchErrorMessage(e), color: 'error' })
  } finally {
    accountBusy.value = false
  }
}

async function confirmToggleStatus() {
  statusBusy.value = true
  try {
    await apiPatch(`/v1/client/${id.value}/account/status`, {
      is_active: !accountIsActive.value,
    })
    await refresh()
    statusConfirmOpen.value = false
    toast.add({
      title: accountIsActive.value ? 'Akses client diaktifkan.' : 'Akses client dinonaktifkan.',
      color: 'success',
    })
  } catch (e) {
    toast.add({ title: apiFetchErrorMessage(e), color: 'error' })
  } finally {
    statusBusy.value = false
  }
}

async function saveNotes() {
  notesBusy.value = true
  try {
    await apiPatch(`/v1/client/${id.value}`, {
      notes: notesDraft.value,
    })
    await refresh()
    toast.add({ title: 'Catatan disimpan.', color: 'success' })
  } catch (e) {
    toast.add({ title: apiFetchErrorMessage(e), color: 'error' })
  } finally {
    notesBusy.value = false
  }
}

async function confirmDelete() {
  deleteBusy.value = true
  try {
    await apiDelete(`/v1/client/${id.value}`)
    await refreshNuxtData(['client-list', 'client-stats'])
    toast.add({ title: 'Client berhasil dihapus.', color: 'success' })
    await navigateTo('/clients')
  } catch (e) {
    toast.add({ title: apiFetchErrorMessage(e), color: 'error' })
  } finally {
    deleteBusy.value = false
  }
}

function display(value?: string | null) {
  return value?.trim() ? value : '-'
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col gap-6 p-4 sm:p-6">
    <div v-if="pending && !detail" class="space-y-3">
      <USkeleton class="h-24 w-full rounded-2xl bg-zinc-100" />
      <USkeleton class="h-64 w-full rounded-2xl bg-zinc-100" />
    </div>

    <AppEmptyState v-else-if="error" title="Gagal memuat client." :description="loadError">
      <UButton color="neutral" variant="outline" size="sm" @click="() => refresh()">
        Coba lagi
      </UButton>
    </AppEmptyState>

    <template v-else-if="detail">
      <AppPageHeader
        :title="detail.full_name"
        :description="`${detail.client_code} · Personal email ${detail.personal_email}`"
        icon-name="i-heroicons-user"
        container-class="items-start"
        actions-class="flex flex-wrap items-center justify-end gap-2"
        description-class="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-600"
      >
        <template #actions>
          <UBadge :color="clientStatusColor(detail.status)" variant="subtle" size="sm">
            {{ clientStatusLabel(detail.status) }}
          </UBadge>
          <UButton
            :to="`/clients/${detail.id}/edit`"
            color="warning"
            variant="soft"
            size="sm"
            icon="i-lucide-pencil"
          >
            Edit
          </UButton>
          <UButton
            color="error"
            variant="soft"
            size="sm"
            icon="i-lucide-trash-2"
            @click="deleteOpen = true"
          >
            Delete
          </UButton>
          <UButton to="/clients" color="neutral" variant="outline" size="sm"> Kembali </UButton>
        </template>
      </AppPageHeader>

      <div class="border-b border-zinc-200">
        <nav class="flex gap-1 overflow-x-auto" aria-label="Detail client">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            class="whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors"
            :class="
              activeTab === tab.key
                ? 'border-zinc-900 text-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            "
            :aria-current="activeTab === tab.key ? 'page' : undefined"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <section v-if="activeTab === 'overview'" class="grid gap-4 lg:grid-cols-2">
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
              <dt class="text-zinc-500">Recovery email</dt>
              <dd class="break-all text-zinc-900">{{ display(detail.recovery_email) }}</dd>
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
          <h2 class="text-sm font-semibold text-zinc-900">Client status</h2>
          <div class="mt-4 space-y-3 text-sm">
            <UBadge :color="clientStatusColor(detail.status)" variant="subtle">
              {{ clientStatusLabel(detail.status) }}
            </UBadge>
            <p class="text-zinc-600">Dibuat {{ formatDateTimeDmyHm(detail.created_at) }}</p>
            <p class="text-zinc-600">Diperbarui {{ formatDateTimeDmyHm(detail.updated_at) }}</p>
          </div>
        </div>
      </section>

      <section v-else-if="activeTab === 'application'" class="space-y-4">
        <div class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h2 class="text-sm font-semibold text-zinc-900">Application information</h2>
            <UButton size="sm" color="neutral" variant="outline" @click="activeTab = 'account'">
              Kelola kredensial
            </UButton>
          </div>
          <dl class="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt class="text-zinc-500">Application email</dt>
              <dd class="break-all text-zinc-900">{{ display(detail.application_email) }}</dd>
            </div>
            <div>
              <dt class="text-zinc-500">Personal email</dt>
              <dd class="break-all text-zinc-900">{{ detail.personal_email }}</dd>
            </div>
            <div>
              <dt class="text-zinc-500">Recovery email</dt>
              <dd class="break-all text-zinc-900">{{ display(detail.recovery_email) }}</dd>
            </div>
            <div>
              <dt class="text-zinc-500">Recovery phone</dt>
              <dd class="text-zinc-900">{{ display(detail.recovery_phone) }}</dd>
            </div>
          </dl>
          <p class="mt-4 rounded-xl bg-zinc-50 px-4 py-3 text-xs leading-relaxed text-zinc-600">
            Kredensial akun aplikasi tidak ditampilkan di sini. Gunakan tab Account untuk mengelola
            akses login CMS client.
          </p>
        </div>
      </section>

      <section v-else-if="activeTab === 'account'" class="grid gap-4 lg:grid-cols-2">
        <div class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
          <h2 class="text-sm font-semibold text-zinc-900">CMS account</h2>

          <div v-if="hasAccount" class="mt-4 space-y-3 text-sm">
            <div>
              <p class="text-zinc-500">Login email</p>
              <p class="break-all font-medium text-zinc-900">{{ account?.email }}</p>
            </div>
            <div>
              <p class="text-zinc-500">Account status</p>
              <UBadge :color="accountStatusColor(accountIsActive)" variant="subtle" size="sm">
                {{ accountIsActive ? 'Active' : 'Inactive' }}
              </UBadge>
            </div>
            <div>
              <p class="text-zinc-500">Last login</p>
              <p class="text-zinc-900">
                {{
                  detail.user?.last_login_at
                    ? formatDateTimeDmyHm(detail.user.last_login_at)
                    : 'Belum pernah login'
                }}
              </p>
            </div>
          </div>

          <div v-else class="mt-4 space-y-4">
            <p class="text-sm text-zinc-600">
              Client ini belum memiliki akun CMS. Buat akun untuk memberi akses login.
            </p>
            <UFormField label="Login email" required>
              <UInput v-model="accountEmail" type="email" class="w-full" />
            </UFormField>
            <UFormField label="Temporary password">
              <UInput
                v-model="accountPassword"
                type="password"
                placeholder="Kosongkan untuk dibuat otomatis"
                class="w-full"
              />
            </UFormField>
            <UButton color="primary" :loading="accountBusy" @click="createAccount">
              Buat akun CMS
            </UButton>
          </div>
        </div>

        <div class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
          <h2 class="text-sm font-semibold text-zinc-900">Access management</h2>
          <p class="mt-2 text-sm leading-relaxed text-zinc-600">
            Reset password menampilkan password sementara sekali. Nonaktifkan akun untuk mencabut
            akses login tanpa menghapus profil client.
          </p>
          <div class="mt-4 flex flex-wrap gap-2">
            <UButton
              v-if="hasAccount"
              color="neutral"
              variant="outline"
              :loading="accountBusy"
              @click="resetPassword"
            >
              Reset password
            </UButton>
            <UButton
              v-if="hasAccount"
              color="neutral"
              variant="outline"
              :loading="accountBusy"
              @click="inviteAccount"
            >
              Buat password awal
            </UButton>
            <UButton
              v-if="hasAccount"
              :color="accountIsActive ? 'warning' : 'success'"
              variant="soft"
              :loading="statusBusy"
              @click="statusConfirmOpen = true"
            >
              {{ accountIsActive ? 'Nonaktifkan akses' : 'Aktifkan akses' }}
            </UButton>
          </div>
        </div>
      </section>

      <section v-else class="grid gap-4 lg:grid-cols-3">
        <div class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 lg:col-span-2">
          <h2 class="text-sm font-semibold text-zinc-900">Internal notes</h2>
          <p class="mt-1 text-xs text-zinc-500">Catatan ini hanya terlihat oleh admin.</p>
          <UTextarea v-model="notesDraft" :rows="6" class="mt-4 w-full" />
          <div class="mt-3 flex justify-end">
            <UButton color="primary" :loading="notesBusy" @click="saveNotes">
              Simpan catatan
            </UButton>
          </div>
        </div>

        <div class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
          <h2 class="text-sm font-semibold text-zinc-900">Client history</h2>
          <ol class="mt-4 space-y-4 text-sm">
            <li class="border-l-2 border-zinc-200 pl-3">
              <p class="font-medium text-zinc-900">Status saat ini</p>
              <p class="text-zinc-600">{{ clientStatusLabel(detail.status) }}</p>
              <p class="text-xs text-zinc-500">{{ formatDateTimeDmyHm(detail.updated_at) }}</p>
            </li>
            <li class="border-l-2 border-zinc-200 pl-3">
              <p class="font-medium text-zinc-900">Client dibuat</p>
              <p class="text-xs text-zinc-500">{{ formatDateTimeDmyHm(detail.created_at) }}</p>
            </li>
          </ol>
        </div>
      </section>
    </template>

    <UModal v-model:open="deleteOpen" title="Hapus client">
      <template #body>
        <p class="text-sm text-zinc-600">
          Data {{ detail?.full_name }} akan dihapus dari daftar client. Tindakan ini membutuhkan
          konfirmasi admin.
        </p>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton
            color="neutral"
            variant="outline"
            :disabled="deleteBusy"
            @click="deleteOpen = false"
          >
            Batal
          </UButton>
          <UButton color="error" :loading="deleteBusy" @click="confirmDelete"> Ya, hapus </UButton>
        </div>
      </template>
    </UModal>

    <UModal
      v-model:open="statusConfirmOpen"
      :title="accountIsActive ? 'Nonaktifkan akses client' : 'Aktifkan akses client'"
    >
      <template #body>
        <p class="text-sm text-zinc-600">
          {{
            accountIsActive
              ? 'Client tidak akan bisa login sampai akses diaktifkan kembali.'
              : 'Client akan bisa login kembali ke CMS.'
          }}
        </p>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton
            color="neutral"
            variant="outline"
            :disabled="statusBusy"
            @click="statusConfirmOpen = false"
          >
            Batal
          </UButton>
          <UButton
            :color="accountIsActive ? 'warning' : 'success'"
            :loading="statusBusy"
            @click="confirmToggleStatus"
          >
            {{ accountIsActive ? 'Nonaktifkan' : 'Aktifkan' }}
          </UButton>
        </div>
      </template>
    </UModal>

    <UModal
      v-model:open="credentialOpen"
      :title="credentialTitle"
      description="Password sementara hanya ditampilkan sekali."
    >
      <template #body>
        <div class="space-y-3 text-sm">
          <div>
            <p class="text-zinc-500">Login email</p>
            <p class="break-all font-medium text-zinc-900">{{ credentialEmail }}</p>
          </div>
          <div>
            <p class="text-zinc-500">Temporary password</p>
            <div class="mt-1 flex items-center gap-2">
              <code class="rounded-lg bg-zinc-100 px-3 py-2 font-mono text-sm text-zinc-900">
                {{ credentialPassword }}
              </code>
              <UButton size="xs" color="neutral" variant="outline" @click="copyPassword">
                Copy
              </UButton>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full justify-end">
          <UButton color="primary" @click="credentialOpen = false"> Tutup </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
