<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { CategoryDetailRow, CategoryRow } from '~/types/category'
import type { PaginatedResponse } from '~/composables/useApi'
import { apiFetchErrorMessage } from '~/utils/apiFormat'
import {
  checkboxUi,
  formFieldUi,
  formInputUi,
  formTextareaUi,
  modalNeutralButtonClass,
  modalPrimaryButtonClass,
  modalUi,
} from '~/utils/ui'

definePageMeta({ layout: 'app-sidebar', middleware: ['admin'] })

const { setBreadcrumbs } = useAppLayout()
setBreadcrumbs([
  { title: 'Beranda', href: '/dashboard' },
  { title: 'Referensi' },
  { title: 'Kategori' },
])
useHead({ title: 'Kategori' })

const { apiFetch, apiPost, apiPatch, apiDelete } = useApi()
const toast = useToast()
const page = ref(1)
const perPage = ref(15)
const keyword = ref('')
const busy = ref(false)

const createOpen = ref(false)
const editOpen = ref(false)
const deleteOpen = ref(false)
const form = reactive({
  code: '',
  name: '',
  description: '',
  is_active: true,
})
const editTarget = ref<CategoryRow | null>(null)
const deleteTarget = ref<CategoryRow | null>(null)
const columns = [
  {
    key: 'code',
    label: 'Kode',
    headerClass: 'whitespace-nowrap',
  },
  {
    key: 'name',
    label: 'Nama',
    headerClass: 'min-w-[10rem]',
  },
  {
    key: 'description',
    label: 'Deskripsi',
    headerClass: 'hidden sm:table-cell',
  },
  {
    key: 'is_active',
    label: 'Aktif',
    headerClass: 'whitespace-nowrap',
  },
  { key: 'aksi', label: 'Aksi', headerClass: 'whitespace-nowrap text-right' },
]

const queryString = computed(() => {
  const params = new URLSearchParams({
    page: String(page.value),
    per_page: String(perPage.value),
  })
  if (keyword.value.trim()) params.set('q', keyword.value.trim())
  return params.toString()
})

const { data, pending, error, refresh } = useAsyncData(
  'category-list',
  () => apiFetch<PaginatedResponse<CategoryRow>>(`/v1/category/?${queryString.value}`),
  { watch: [queryString] }
)

const rows = computed(() => data.value?.data ?? [])
const meta = computed(() => data.value?.meta)
const errMsg = computed(() => apiFetchErrorMessage(error.value))
const metaFrom = computed(() => Number(meta.value?.from ?? 0))
const metaTo = computed(() => Number(meta.value?.to ?? 0))
const metaTotal = computed(() => Number(meta.value?.total ?? 0))
const hasPrev = computed(() => Boolean(meta.value?.has_prev))
const hasNext = computed(() => Boolean(meta.value?.has_next))

watch([keyword, perPage], () => {
  page.value = 1
})

function categoryDetailHref(row: CategoryRow) {
  return `/reference/category/${encodeURIComponent(row.code)}`
}

function resetForm() {
  form.code = ''
  form.name = ''
  form.description = ''
  form.is_active = true
}

function openCreate() {
  resetForm()
  createOpen.value = true
}

async function openEdit(row: CategoryRow) {
  busy.value = true
  try {
    const detail = await apiFetch<{ data: CategoryDetailRow }>(
      `/v1/category/${encodeURIComponent(row.code)}`
    )
    const current = detail.data
    editTarget.value = current
    form.code = current.code
    form.name = current.name
    form.description = current.description ?? ''
    form.is_active = current.is_active
    editOpen.value = true
  } catch (e) {
    toast.add({
      title: apiFetchErrorMessage(e),
      color: 'error',
    })
  } finally {
    busy.value = false
  }
}

async function submitCreate() {
  if (!form.code.trim()) {
    toast.add({ title: 'Kode wajib diisi.', color: 'warning' })
    return
  }
  if (!form.name.trim()) {
    toast.add({ title: 'Nama wajib diisi.', color: 'warning' })
    return
  }
  if (!form.description.trim()) {
    toast.add({ title: 'Deskripsi wajib diisi.', color: 'warning' })
    return
  }
  busy.value = true
  try {
    await apiPost('/v1/category/', {
      code: form.code.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      is_active: form.is_active,
    })
    toast.add({
      title: 'Kategori berhasil dibuat.',
      color: 'success',
    })
    createOpen.value = false
    await refresh()
  } catch (e) {
    toast.add({
      title: apiFetchErrorMessage(e),
      color: 'error',
    })
  } finally {
    busy.value = false
  }
}

async function submitEdit() {
  if (!editTarget.value) return
  if (!form.code.trim()) {
    toast.add({ title: 'Kode wajib diisi.', color: 'warning' })
    return
  }
  if (!form.name.trim()) {
    toast.add({ title: 'Nama wajib diisi.', color: 'warning' })
    return
  }
  if (!form.description.trim()) {
    toast.add({ title: 'Deskripsi wajib diisi.', color: 'warning' })
    return
  }
  busy.value = true
  try {
    await apiPatch(`/v1/category/${editTarget.value.code}`, {
      name: form.name.trim(),
      description: form.description.trim(),
      is_active: form.is_active,
    })
    toast.add({
      title: 'Kategori berhasil diperbarui.',
      color: 'success',
    })
    editOpen.value = false
    await refresh()
  } catch (e) {
    toast.add({
      title: apiFetchErrorMessage(e),
      color: 'error',
    })
  } finally {
    busy.value = false
  }
}

function promptRemoveRow(row: CategoryRow) {
  deleteTarget.value = row
  deleteOpen.value = true
}

async function confirmRemoveRow() {
  if (!deleteTarget.value) return
  busy.value = true
  try {
    await apiDelete(`/v1/category/${deleteTarget.value.code}`)
    toast.add({
      title: 'Kategori berhasil dihapus.',
      color: 'success',
    })
    deleteOpen.value = false
    deleteTarget.value = null
    await refresh()
  } catch (e) {
    toast.add({
      title: apiFetchErrorMessage(e),
      color: 'error',
    })
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col gap-6 p-4 sm:p-6">
    <AppPageHeader
      title="Kategori"
      description="Referensi kategori aplikasi."
      icon-name="i-heroicons-tag"
      container-class="items-center"
      description-class="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-600"
    >
      <template #actions>
        <UButton
          color="neutral"
          size="sm"
          icon="i-lucide-refresh-cw"
          class="shrink-0"
          :loading="pending || busy"
          @click="() => refresh()"
        >
          Muat ulang
        </UButton>
        <UButton
          color="neutral"
          variant="outline"
          size="sm"
          icon="i-lucide-plus"
          class="shrink-0"
          @click="openCreate"
        >
          Tambah Kategori
        </UButton>
      </template>
    </AppPageHeader>

    <section class="overflow-hidden rounded-2xl border border-zinc-200/90 bg-white">
      <div v-if="pending && !data" class="space-y-3 p-5 sm:p-6">
        <USkeleton class="h-8 w-full max-w-md rounded-lg bg-zinc-100" />
        <USkeleton class="h-40 w-full rounded-xl bg-zinc-100" />
      </div>

      <template v-else>
        <AppEmptyState v-if="error" title="Gagal memuat data Kategori." :description="errMsg">
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            :loading="pending"
            @click="() => refresh()"
          >
            Coba lagi
          </UButton>
        </AppEmptyState>
        <AppDataTable
          v-else
          :columns="columns"
          :rows="rows"
          :keyword="keyword"
          sort-by=""
          sort-order="asc"
          :page="page"
          :per-page="perPage"
          :from="metaFrom"
          :to="metaTo"
          :total="metaTotal"
          :has-prev="hasPrev"
          :has-next="hasNext"
          search-placeholder="Cari kode atau nama..."
          empty-title="Tidak ada data Kategori."
          @update:keyword="keyword = $event"
          @update:page="page = $event"
          @update:per-page="perPage = $event"
        >
          <template #rows>
            <tr
              v-for="row in rows"
              :key="row.code"
              class="bg-white transition-colors hover:bg-zinc-50/80"
            >
              <td class="whitespace-nowrap px-4 py-3 font-mono text-xs sm:px-5">
                <NuxtLink
                  :to="categoryDetailHref(row)"
                  class="text-zinc-900 underline-offset-2 hover:underline"
                >
                  {{ row.code }}
                </NuxtLink>
              </td>
              <td class="px-4 py-3 font-medium sm:px-5">
                <NuxtLink
                  :to="categoryDetailHref(row)"
                  class="text-zinc-900 underline-offset-2 hover:underline"
                >
                  {{ row.name }}
                </NuxtLink>
              </td>
              <td class="hidden max-w-md truncate px-4 py-3 text-zinc-600 sm:table-cell sm:px-5">
                {{ row.description ?? '-' }}
              </td>
              <td class="px-4 py-3 sm:px-5">
                <UBadge :color="row.is_active ? 'success' : 'neutral'" variant="subtle" size="sm">
                  {{ row.is_active ? 'Ya' : 'Tidak' }}
                </UBadge>
              </td>
              <td class="px-4 py-3 text-right sm:px-5">
                <div class="inline-flex items-center gap-2">
                  <UButton
                    size="xs"
                    color="neutral"
                    variant="soft"
                    :to="categoryDetailHref(row)"
                    class="cursor-pointer"
                  >
                    Detail
                  </UButton>
                  <UButton
                    size="xs"
                    color="warning"
                    variant="soft"
                    :disabled="busy"
                    @click="openEdit(row)"
                    class="cursor-pointer"
                  >
                    Ubah
                  </UButton>
                  <UButton
                    size="xs"
                    color="error"
                    variant="soft"
                    :disabled="busy"
                    @click="promptRemoveRow(row)"
                    class="cursor-pointer"
                  >
                    Hapus
                  </UButton>
                </div>
              </td>
            </tr>
          </template>
        </AppDataTable>
      </template>
    </section>

    <UModal v-model:open="createOpen" title="Tambah Kategori" :ui="modalUi">
      <template #body>
        <div class="space-y-4">
          <UFormField label="Kode" required :ui="formFieldUi">
            <UInput v-model="form.code" placeholder="Contoh: CAT001" :ui="formInputUi" />
          </UFormField>
          <UFormField label="Nama" required :ui="formFieldUi">
            <UInput v-model="form.name" placeholder="Nama Kategori" :ui="formInputUi" />
          </UFormField>
          <UFormField label="Deskripsi" required :ui="formFieldUi">
            <UTextarea
              v-model="form.description"
              :rows="3"
              :ui="formTextareaUi"
              placeholder="Contoh: Kategori utama aplikasi."
            />
          </UFormField>
          <UCheckbox v-model="form.is_active" label="Aktif" :ui="checkboxUi" />
        </div>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton
            color="neutral"
            variant="outline"
            :class="modalNeutralButtonClass"
            @click="createOpen = false"
            >Batal</UButton
          >
          <UButton
            color="primary"
            :class="modalPrimaryButtonClass"
            :loading="busy"
            @click="submitCreate"
            >Simpan</UButton
          >
        </div>
      </template>
    </UModal>

    <UModal v-model:open="editOpen" title="Ubah Kategori" :ui="modalUi">
      <template #body>
        <div class="space-y-4">
          <UFormField label="Kode" required :ui="formFieldUi">
            <UInput
              :model-value="form.code"
              readonly
              :ui="formInputUi"
              placeholder="Contoh: CAT001"
            />
          </UFormField>
          <UFormField label="Nama" required :ui="formFieldUi">
            <UInput v-model="form.name" :ui="formInputUi" placeholder="Nama Kategori" />
          </UFormField>
          <UFormField label="Deskripsi" required :ui="formFieldUi">
            <UTextarea
              v-model="form.description"
              :rows="3"
              :ui="formTextareaUi"
              placeholder="Contoh: Kategori utama aplikasi."
            />
          </UFormField>
          <UCheckbox v-model="form.is_active" label="Aktif" :ui="checkboxUi" />
        </div>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton
            color="neutral"
            variant="outline"
            :class="modalNeutralButtonClass"
            @click="editOpen = false"
            >Batal</UButton
          >
          <UButton
            color="primary"
            :class="modalPrimaryButtonClass"
            :loading="busy"
            @click="submitEdit"
            >Perbarui</UButton
          >
        </div>
      </template>
    </UModal>

    <UModal
      v-model:open="deleteOpen"
      title="Konfirmasi Hapus Kategori"
      :description="`Data ${deleteTarget?.code ?? ''} akan dihapus permanen.`"
      :ui="modalUi"
    >
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton
            color="neutral"
            variant="outline"
            :class="modalNeutralButtonClass"
            :disabled="busy"
            @click="deleteOpen = false"
          >
            Batal
          </UButton>
          <UButton
            color="error"
            class="bg-red-600 text-white hover:bg-red-700"
            :loading="busy"
            @click="confirmRemoveRow"
          >
            Ya, Hapus
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
