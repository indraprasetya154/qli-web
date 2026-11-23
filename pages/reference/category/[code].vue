<script setup lang="ts">
import { computed, watch } from 'vue'
import type { CategoryDetailRow } from '~/types/category'
import { apiFetchErrorMessage } from '~/utils/apiFormat'
import { formatDateTimeDmyHm } from '~/utils/dateFormat'

definePageMeta({ layout: 'app-sidebar', middleware: ['admin'] })

const route = useRoute()
const code = computed(() => decodeURIComponent(String(route.params.code ?? '')))

const { setBreadcrumbs } = useAppLayout()
watch(
  code,
  (c) => {
    setBreadcrumbs([
      { title: 'Beranda', href: '/dashboard' },
      { title: 'Referensi' },
      { title: 'Kategori', href: '/reference/category' },
      { title: c ? `Detail · ${c}` : 'Detail' },
    ])
  },
  { immediate: true }
)

useHead(() => ({
  title: code.value ? `Detail Kategori ${code.value}` : 'Detail Kategori',
}))

const { apiFetch } = useApi()

const {
  data: detailData,
  pending: detailPending,
  error: detailError,
  refresh: refreshDetail,
} = useAsyncData(
  'category-detail',
  () => apiFetch<{ data: CategoryDetailRow }>(`/v1/category/${encodeURIComponent(code.value)}`),
  { watch: [code] }
)

const category = computed(() => detailData.value?.data)
const detailErrorMessage = computed(() => apiFetchErrorMessage(detailError.value))
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col gap-6 p-4 sm:p-6">
    <AppPageHeader
      title="Detail Kategori"
      :description="category?.name ?? 'Memuat data kategori...'"
      icon-name="i-heroicons-tag"
      container-class="items-center"
      description-class="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-600"
    >
      <template #actions>
        <UButton to="/reference/category" color="neutral" variant="outline" size="sm">
          Kembali ke daftar
        </UButton>
        <UButton
          color="neutral"
          size="sm"
          icon="i-lucide-refresh-cw"
          class="shrink-0"
          :loading="detailPending"
          @click="() => refreshDetail()"
        >
          Muat ulang
        </UButton>
      </template>
    </AppPageHeader>

    <section class="rounded-2xl border border-zinc-200/90 bg-white p-5 sm:p-6">
      <div v-if="detailPending" class="space-y-3">
        <USkeleton class="h-6 w-56 rounded bg-zinc-100" />
        <USkeleton class="h-20 w-full rounded bg-zinc-100" />
      </div>
      <AppEmptyState
        v-else-if="detailError"
        title="Gagal memuat detail kategori."
        :description="detailErrorMessage"
      >
        <UButton
          color="neutral"
          variant="outline"
          size="sm"
          :loading="detailPending"
          @click="() => refreshDetail()"
        >
          Coba lagi
        </UButton>
      </AppEmptyState>
      <div v-else class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p class="text-zinc-500">Kode</p>
          <p class="font-mono text-zinc-900">
            {{ category?.code ?? '-' }}
          </p>
        </div>
        <div class="sm:col-span-1">
          <p class="text-zinc-500">Nama</p>
          <p class="font-medium text-zinc-900">
            {{ category?.name ?? '-' }}
          </p>
        </div>
        <div>
          <p class="text-zinc-500">Aktif</p>
          <UBadge :color="category?.is_active ? 'success' : 'neutral'" variant="subtle" size="sm">
            {{ category?.is_active ? 'Ya' : 'Tidak' }}
          </UBadge>
        </div>
        <div
          v-if="category?.created_at != null || category?.updated_at != null"
          class="sm:col-span-2 lg:col-span-3"
        >
          <p class="text-zinc-500">Diperbarui</p>
          <p class="text-zinc-900">
            {{ formatDateTimeDmyHm(category?.updated_at ?? category?.created_at) }}
          </p>
        </div>
        <div class="sm:col-span-2 lg:col-span-3">
          <p class="text-zinc-500">Deskripsi</p>
          <p class="whitespace-pre-wrap text-zinc-900">
            {{ category?.description?.trim() ? category.description : '-' }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
