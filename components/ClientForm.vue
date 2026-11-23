<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type {
  ClientDetail,
  ClientFormPayload,
  ClientStatus,
} from '~/types/client'
import {
  CLIENT_STATUS_OPTIONS,
  GENDER_OPTIONS,
} from '~/utils/client'

const props = withDefaults(
  defineProps<{
    initial?: Partial<ClientDetail> | null
    mode?: 'create' | 'edit'
    loading?: boolean
    error?: string
    submitLabel?: string
    cancelTo?: string
  }>(),
  {
    initial: null,
    mode: 'create',
    loading: false,
    error: '',
    submitLabel: 'Simpan',
    cancelTo: '/clients',
  }
)

const emit = defineEmits<{
  submit: [payload: ClientFormPayload]
}>()

const localError = ref('')

function buildForm(
  initial?: Partial<ClientDetail> | null
): ClientFormPayload {
  return {
    full_name: initial?.full_name ?? '',
    phone_number: initial?.phone_number ?? '',
    personal_email: initial?.personal_email ?? '',
    application_email: initial?.application_email ?? '',
    recovery_email: initial?.recovery_email ?? '',
    recovery_phone: initial?.recovery_phone ?? '',
    date_of_birth: initial?.date_of_birth ?? '',
    gender: initial?.gender ?? '',
    address: initial?.address ?? '',
    education: initial?.education ?? '',
    experience: initial?.experience ?? '',
    skills: initial?.skills ?? '',
    status: (initial?.status ?? 'new') as ClientStatus,
    notes: initial?.notes ?? '',
    create_account: false,
    account_email: '',
    account_password: '',
  }
}

const form = reactive<ClientFormPayload>(buildForm(props.initial))

watch(
  () => props.initial,
  (value) => {
    Object.assign(form, buildForm(value))
  }
)

function submit() {
  localError.value = ''

  if (!form.full_name.trim()) {
    localError.value = 'Full name wajib diisi.'
    return
  }
  if (!form.phone_number.trim()) {
    localError.value = 'Phone number wajib diisi.'
    return
  }
  if (!form.personal_email.trim()) {
    localError.value = 'Personal email wajib diisi.'
    return
  }
  if (props.mode === 'create' && form.create_account) {
    if (!form.account_email?.trim()) {
      localError.value = 'Login email wajib diisi jika membuat akun CMS.'
      return
    }
    if (form.account_password && form.account_password.length < 8) {
      localError.value = 'Password minimal 8 karakter.'
      return
    }
  }

  emit('submit', { ...form })
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="submit">
    <UAlert
      v-if="localError || error"
      color="error"
      variant="soft"
      :title="localError || error"
    />

    <fieldset class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
      <legend class="px-1 text-sm font-semibold text-zinc-900">
        Personal Information
      </legend>
      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <UFormField label="Full name" required class="md:col-span-2">
          <UInput v-model="form.full_name" placeholder="Nama lengkap client" class="w-full" />
        </UFormField>
        <UFormField label="Phone number" required>
          <UInput v-model="form.phone_number" placeholder="08123456789" class="w-full" />
        </UFormField>
        <UFormField label="Personal email" required>
          <UInput
            v-model="form.personal_email"
            type="email"
            placeholder="nama@email.com"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Date of birth">
          <UInput v-model="form.date_of_birth" type="date" class="w-full" />
        </UFormField>
        <UFormField label="Gender">
          <USelect
            v-model="form.gender"
            :items="GENDER_OPTIONS"
            placeholder="Not specified"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Address" class="md:col-span-2">
          <UTextarea v-model="form.address" :rows="3" class="w-full" />
        </UFormField>
      </div>
    </fieldset>

    <fieldset class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
      <legend class="px-1 text-sm font-semibold text-zinc-900">
        Professional Information
      </legend>
      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <UFormField label="Education">
          <UInput v-model="form.education" placeholder="SMA, D3, S1" class="w-full" />
        </UFormField>
        <UFormField label="Skills">
          <UInput
            v-model="form.skills"
            placeholder="Komunikasi, Microsoft Office"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Work experience" class="md:col-span-2">
          <UTextarea
            v-model="form.experience"
            :rows="3"
            placeholder="Riwayat pekerjaan singkat"
            class="w-full"
          />
        </UFormField>
      </div>
    </fieldset>

    <fieldset class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
      <legend class="px-1 text-sm font-semibold text-zinc-900">
        Application Information
      </legend>
      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <UFormField label="Application email">
          <UInput
            v-model="form.application_email"
            type="email"
            placeholder="email untuk lamaran"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Recovery email">
          <UInput v-model="form.recovery_email" type="email" class="w-full" />
        </UFormField>
        <UFormField label="Recovery phone">
          <UInput v-model="form.recovery_phone" placeholder="08123456789" class="w-full" />
        </UFormField>
        <UFormField label="Client status">
          <USelect v-model="form.status" :items="CLIENT_STATUS_OPTIONS" class="w-full" />
        </UFormField>
        <UFormField label="Internal notes" class="md:col-span-2">
          <UTextarea
            v-model="form.notes"
            :rows="4"
            placeholder="Catatan internal admin"
            class="w-full"
          />
        </UFormField>
      </div>
    </fieldset>

    <fieldset
      v-if="mode === 'create'"
      class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6"
    >
      <legend class="px-1 text-sm font-semibold text-zinc-900">
        CMS Account
      </legend>
      <div class="mt-4 space-y-4">
        <div>
          <UCheckbox
            v-model="form.create_account"
            label="Buat akun CMS untuk client ini"
          />
          <p class="mt-1 text-xs text-zinc-500">
            Client bisa dibuat tanpa akun login terlebih dahulu.
          </p>
        </div>

        <div v-if="form.create_account" class="grid gap-4 md:grid-cols-2">
          <UFormField label="Login email" required>
            <UInput
              v-model="form.account_email"
              type="email"
              placeholder="login@email.com"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Temporary password">
            <UInput
              v-model="form.account_password"
              type="password"
              placeholder="Kosongkan untuk dibuat otomatis"
              class="w-full"
            />
          </UFormField>
          <p class="text-xs leading-relaxed text-zinc-500 md:col-span-2">
            Jika password dikosongkan, sistem membuat password sementara dan
            menampilkannya sekali setelah client dibuat.
          </p>
        </div>
      </div>
    </fieldset>

    <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <UButton :to="cancelTo" color="neutral" variant="outline" size="lg">
        Batal
      </UButton>
      <UButton type="submit" color="primary" size="lg" :loading="loading">
        {{ submitLabel }}
      </UButton>
    </div>
  </form>
</template>
