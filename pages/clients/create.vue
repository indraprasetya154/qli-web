<script setup lang="ts">
import { ref } from 'vue'
import type { ClientDetail, ClientFormPayload } from '~/types/client'
import { apiFetchErrorMessage } from '~/utils/apiFormat'

definePageMeta({ layout: 'app-sidebar', middleware: ['admin'] })

const { setBreadcrumbs } = useAppLayout()
setBreadcrumbs([
  { title: 'Beranda', href: '/dashboard' },
  { title: 'Client Management' },
  { title: 'Client List', href: '/clients' },
  { title: 'Add Client' },
])

useHead({ title: 'Add Client' })

const { apiPost } = useApi()
const toast = useToast()

const loading = ref(false)
const errorMessage = ref('')
const credentialOpen = ref(false)
const temporaryPassword = ref('')
const accountEmail = ref('')
const createdId = ref('')

async function submit(payload: ClientFormPayload) {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await apiPost<{
      data: ClientDetail
      temporary_password?: string
      message: string
    }>('/v1/client/', { ...payload })

    createdId.value = response.data.id
    await refreshNuxtData(['client-list', 'client-stats'])

    if (response.temporary_password) {
      temporaryPassword.value = response.temporary_password
      accountEmail.value = payload.account_email ?? ''
      credentialOpen.value = true
      toast.add({ title: 'Client dan akun CMS berhasil dibuat.', color: 'success' })
      return
    }

    toast.add({ title: 'Client berhasil dibuat.', color: 'success' })
    await navigateTo(`/clients/${response.data.id}`)
  } catch (e) {
    errorMessage.value = apiFetchErrorMessage(e)
  } finally {
    loading.value = false
  }
}

async function copyPassword() {
  try {
    await navigator.clipboard.writeText(temporaryPassword.value)
    toast.add({ title: 'Password disalin.', color: 'success' })
  } catch {
    toast.add({ title: 'Gagal menyalin password.', color: 'error' })
  }
}

async function finish() {
  credentialOpen.value = false
  await navigateTo(`/clients/${createdId.value}`)
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col gap-6 p-4 sm:p-6">
    <AppPageHeader
      title="Add Client"
      description="Daftarkan client baru, lengkapi profil, dan opsional buat akun CMS."
      icon-name="i-heroicons-user-plus"
      container-class="items-center"
      description-class="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-600"
    >
      <template #actions>
        <UButton to="/clients" color="neutral" variant="outline" size="sm">
          Kembali ke daftar
        </UButton>
      </template>
    </AppPageHeader>

    <ClientForm
      mode="create"
      submit-label="Simpan Client"
      :loading="loading"
      :error="errorMessage"
      @submit="submit"
    />

    <UModal
      v-model:open="credentialOpen"
      title="Akun CMS berhasil dibuat"
      description="Simpan password sementara ini. Password hanya ditampilkan sekali."
    >
      <template #body>
        <div class="space-y-3 text-sm">
          <div>
            <p class="text-zinc-500">Login email</p>
            <p class="font-medium text-zinc-900">{{ accountEmail }}</p>
          </div>
          <div>
            <p class="text-zinc-500">Temporary password</p>
            <div class="mt-1 flex items-center gap-2">
              <code class="rounded-lg bg-zinc-100 px-3 py-2 font-mono text-sm text-zinc-900">
                {{ temporaryPassword }}
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
          <UButton color="primary" @click="finish"> Selesai </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
