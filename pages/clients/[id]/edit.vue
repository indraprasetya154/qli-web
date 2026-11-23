<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ClientDetail, ClientFormPayload } from '~/types/client'
import { apiFetchErrorMessage } from '~/utils/apiFormat'

definePageMeta({ layout: 'app-sidebar', middleware: ['admin'] })

const route = useRoute()
const id = computed(() => String(route.params.id ?? ''))

const { setBreadcrumbs } = useAppLayout()
setBreadcrumbs([
  { title: 'Beranda', href: '/dashboard' },
  { title: 'Client Management' },
  { title: 'Client List', href: '/clients' },
  { title: 'Edit Client' },
])

useHead({ title: 'Edit Client' })

const { apiFetch, apiPatch } = useApi()
const toast = useToast()

const loading = ref(false)
const errorMessage = ref('')

const { data, pending, error, refresh } = useAsyncData(
  'client-edit',
  () => apiFetch<{ data: ClientDetail }>(`/v1/client/${id.value}`),
  { watch: [id] }
)

const detail = computed(() => data.value?.data)
const loadError = computed(() => apiFetchErrorMessage(error.value))

async function submit(payload: ClientFormPayload) {
  loading.value = true
  errorMessage.value = ''
  try {
    await apiPatch(`/v1/client/${id.value}`, { ...payload })
    await refreshNuxtData('client-detail')
    toast.add({ title: 'Client berhasil diperbarui.', color: 'success' })
    await navigateTo(`/clients/${id.value}`)
  } catch (e) {
    errorMessage.value = apiFetchErrorMessage(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col gap-6 p-4 sm:p-6">
    <AppPageHeader
      title="Edit Client"
      :description="detail?.full_name ?? 'Memuat data client...'"
      icon-name="i-heroicons-pencil-square"
      container-class="items-center"
      description-class="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-600"
    >
      <template #actions>
        <UButton :to="`/clients/${id}`" color="neutral" variant="outline" size="sm">
          Kembali ke detail
        </UButton>
      </template>
    </AppPageHeader>

    <div v-if="pending" class="space-y-3">
      <USkeleton class="h-40 w-full rounded-2xl bg-zinc-100" />
      <USkeleton class="h-40 w-full rounded-2xl bg-zinc-100" />
    </div>

    <AppEmptyState v-else-if="error" title="Gagal memuat client." :description="loadError">
      <UButton color="neutral" variant="outline" size="sm" @click="() => refresh()">
        Coba lagi
      </UButton>
    </AppEmptyState>

    <ClientForm
      v-else
      mode="edit"
      :initial="detail"
      :loading="loading"
      :error="errorMessage"
      submit-label="Simpan Perubahan"
      :cancel-to="`/clients/${id}`"
      @submit="submit"
    />
  </div>
</template>
