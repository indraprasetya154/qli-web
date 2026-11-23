<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { CvReview, CvStatus } from '~/types/cv'
import { apiFetchErrorMessage, apiIsConflictError } from '~/utils/apiFormat'
import { formatDateDmy } from '~/utils/dateFormat'

definePageMeta({ layout: 'app-sidebar', middleware: ['client'] })

const { setBreadcrumbs } = useAppLayout()
setBreadcrumbs([{ title: 'Profil Saya', href: '/client' }, { title: 'CV Saya' }])
useHead({ title: 'CV Saya' })

const { apiFetch, apiPost } = useApi()

const { data, pending, error, refresh } = useAsyncData('client-cv', () =>
  apiFetch<{ data: CvReview | null }>('/v1/cv/me')
)

const cv = computed(() => data.value?.data ?? null)
const hasPreview = computed(() => !!cv.value && !cv.value.is_unlocked && cv.value.status === 'REVIEWED')
const notesHeading = computed(() => {
  if (cv.value?.is_unlocked) return 'Catatan lengkap'
  return hasPreview.value ? 'Hasil awal review' : 'Catatan review'
})
const errMsg = computed(() => apiFetchErrorMessage(error.value))

const STATUS_LABEL: Record<CvStatus, string> = {
  PENDING: 'Menunggu Review',
  IN_REVIEW: 'Sedang Direview',
  REVIEWED: 'Sudah Direview',
}

function statusColor(status: CvStatus): 'warning' | 'info' | 'success' {
  if (status === 'IN_REVIEW') return 'info'
  if (status === 'REVIEWED') return 'success'
  return 'warning'
}

const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx']

const selectedFile = ref<File | null>(null)
const fileError = ref('')
const uploadError = ref('')
const uploadNotice = ref('')
const uploading = ref(false)

function onFileChange(event: Event) {
  fileError.value = ''
  uploadError.value = ''
  uploadNotice.value = ''
  const input = event.target as HTMLInputElement
  const selected = input.files?.[0] ?? null
  if (!selected) {
    selectedFile.value = null
    return
  }
  const extension = (selected.name.split('.').pop() ?? '').toLowerCase()
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    fileError.value = 'Gunakan file PDF, DOC, atau DOCX.'
    selectedFile.value = null
    return
  }
  selectedFile.value = selected
}

async function uploadCv() {
  fileError.value = ''
  uploadError.value = ''
  uploadNotice.value = ''
  if (!selectedFile.value) {
    fileError.value = 'Pilih file CV terlebih dahulu.'
    return
  }

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('cv', selectedFile.value)
    const response = await apiPost<{ data: CvReview }>(
      '/v1/cv',
      formData as unknown as Record<string, unknown>
    )
    data.value = { data: response.data }
    selectedFile.value = null
    uploadNotice.value = 'CV terkirim. Status sekarang Menunggu Review.'
  } catch (e) {
    if (apiIsConflictError(e)) {
      uploadError.value = 'CV hanya dapat diunggah satu kali. CV sebelumnya tetap dipakai.'
      await refresh()
    } else {
      uploadError.value = apiFetchErrorMessage(e)
    }
  } finally {
    uploading.value = false
  }
}

const answers = reactive<Record<string, string>>({})
const answeringId = ref('')
const answerError = ref('')

async function submitAnswer(feedbackId: string) {
  answerError.value = ''
  const answer = (answers[feedbackId] ?? '').trim()
  if (!answer) {
    answerError.value = 'Isi jawaban terlebih dahulu.'
    return
  }

  answeringId.value = feedbackId
  try {
    await apiPost(`/v1/cv/me/feedback/${feedbackId}/answer`, { answer })
    answers[feedbackId] = ''
    await refresh()
  } catch (e) {
    answerError.value = apiFetchErrorMessage(e)
  } finally {
    answeringId.value = ''
  }
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col gap-6 p-4 sm:p-6">
    <AppPageHeader
      title="CV Saya"
      description="Unggah sekali, lalu ikuti status review dan masukan dari tim."
      icon-name="i-heroicons-document-text"
      container-class="items-center"
      description-class="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-600"
    />

    <div v-if="pending" class="space-y-3" aria-busy="true">
      <USkeleton class="h-32 w-full rounded-2xl bg-zinc-100" />
      <USkeleton class="h-40 w-full rounded-2xl bg-zinc-100" />
    </div>

    <AppEmptyState v-else-if="error" title="Gagal memuat CV." :description="errMsg">
      <UButton color="neutral" variant="outline" size="sm" @click="() => refresh()">
        Coba lagi
      </UButton>
    </AppEmptyState>

    <section
      v-else-if="!cv"
      class="max-w-2xl rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6"
    >
      <h2 class="text-base font-semibold text-zinc-900">Unggah CV, dapat masukan awal</h2>
      <p class="mt-2 text-sm leading-relaxed text-zinc-600">
        Tim membaca CV kamu dan memberi gambaran singkat: apa yang sudah kuat, apa yang perlu
        dipertajam. Gratis, cukup sekali unggah, pakai versi terbaru.
      </p>

      <form class="mt-5 space-y-3" @submit.prevent="uploadCv">
        <input
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          class="block w-full cursor-pointer rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 file:mr-3 file:rounded file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-zinc-700"
          aria-label="Pilih file CV"
          @change="onFileChange"
        />
        <p v-if="selectedFile" class="text-sm text-zinc-700">{{ selectedFile.name }}</p>
        <UAlert v-if="fileError" color="error" variant="soft" :title="fileError" />
        <UAlert v-if="uploadError" color="error" variant="soft" :title="uploadError" />
        <UAlert v-if="uploadNotice" color="success" variant="soft" :title="uploadNotice" />
        <UButton type="submit" color="primary" size="lg" :loading="uploading" :disabled="uploading">
          Kirim CV
        </UButton>
      </form>
    </section>

    <template v-else>
      <section class="grid gap-4 lg:grid-cols-2">
        <div class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
          <h2 class="text-sm font-semibold text-zinc-900">File CV</h2>
          <dl class="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div class="sm:col-span-2">
              <dt class="text-zinc-500">Nama file</dt>
              <dd class="break-all font-medium text-zinc-900">{{ cv.file_name }}</dd>
            </div>
            <div>
              <dt class="text-zinc-500">Status</dt>
              <dd class="mt-1">
                <UBadge :color="statusColor(cv.status)" variant="subtle" size="sm">
                  {{ STATUS_LABEL[cv.status] }}
                </UBadge>
              </dd>
            </div>
            <div>
              <dt class="text-zinc-500">Diunggah</dt>
              <dd class="text-zinc-900">{{ formatDateDmy(cv.created_at) }}</dd>
            </div>
          </dl>

          <p v-if="cv.status === 'PENDING'" class="mt-4 text-xs leading-relaxed text-zinc-500">
            CV sudah masuk antrean. Tim biasanya memberi hasil awal dalam 1–2 hari kerja.
          </p>
          <p v-else-if="cv.status === 'IN_REVIEW'" class="mt-4 text-xs leading-relaxed text-zinc-500">
            Tim sedang membaca CV kamu. Hasil awal muncul di halaman ini.
          </p>
        </div>

        <div class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
          <div class="flex flex-wrap items-center gap-2">
            <h2 class="text-sm font-semibold text-zinc-900">
              {{ notesHeading }}
            </h2>
            <UBadge v-if="hasPreview" color="neutral" variant="subtle" size="sm">
              Pratinjau gratis
            </UBadge>
          </div>
          <p
            v-if="cv.is_unlocked && cv.notes"
            class="mt-3 whitespace-pre-wrap text-sm text-zinc-700"
          >
            {{ cv.notes }}
          </p>
          <p v-else-if="cv.is_unlocked" class="mt-3 text-sm text-zinc-600">
            Belum ada catatan dari tim.
          </p>
          <p v-else-if="hasPreview" class="mt-3 text-sm leading-relaxed text-zinc-600">
            Kami tampilkan satu masukan utama sebagai gambaran. Catatan lengkap dan masukan lanjutan
            disiapkan di paket pendampingan.
          </p>
          <p v-else class="mt-3 text-sm leading-relaxed text-zinc-600">
            Hasil awal muncul di sini setelah tim selesai membaca CV kamu.
          </p>
        </div>
      </section>

      <section class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h2 class="text-sm font-semibold text-zinc-900">Masukan tim</h2>
          <p class="text-xs text-zinc-500">{{ cv.feedback_count }} masukan</p>
        </div>

        <p v-if="cv.feedback.length === 0" class="mt-3 text-sm text-zinc-600">Belum ada masukan.</p>

        <ul v-else class="mt-4 space-y-4">
          <li
            v-for="item in cv.feedback"
            :key="item.id"
            class="rounded-xl border border-zinc-200 p-4"
          >
            <p class="text-sm font-medium text-zinc-900">{{ item.question }}</p>

            <div v-if="item.answer" class="mt-3 rounded-lg bg-zinc-50 p-3">
              <p class="whitespace-pre-wrap text-sm text-zinc-700">{{ item.answer }}</p>
              <p v-if="item.answered_at" class="mt-2 text-xs text-zinc-500">
                Dijawab {{ formatDateDmy(item.answered_at) }}
              </p>
            </div>

            <form v-else class="mt-3 space-y-3" @submit.prevent="submitAnswer(item.id)">
              <UTextarea
                v-model="answers[item.id]"
                :rows="3"
                placeholder="Tulis jawaban"
                class="w-full"
                :aria-label="`Jawaban untuk: ${item.question}`"
              />
              <UButton
                type="submit"
                color="primary"
                size="sm"
                :loading="answeringId === item.id"
                :disabled="answeringId === item.id"
              >
                Simpan Jawaban
              </UButton>
            </form>
          </li>
        </ul>

        <UAlert v-if="answerError" color="error" variant="soft" :title="answerError" class="mt-4" />

        <p v-if="!cv.is_unlocked" class="mt-4 text-xs leading-relaxed text-zinc-500">
          Satu masukan ditampilkan sebagai pratinjau. Masukan lanjutan menyusul di paket
          pendampingan.
        </p>
      </section>

      <UButton
        v-if="cv.is_unlocked"
        to="/client/offers"
        color="neutral"
        variant="outline"
        size="sm"
        class="self-start"
      >
        Lihat pendampingan saya
      </UButton>
      <UButton
        v-else-if="cv.status === 'REVIEWED'"
        to="/client/offers"
        color="primary"
        size="lg"
        class="self-start"
      >
        Lihat paket pendampingan
      </UButton>
    </template>
  </div>
</template>
