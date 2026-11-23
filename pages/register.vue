<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { RegisterPayload } from '~/types/auth'
import { apiFetchErrorMessage } from '~/utils/apiFormat'

definePageMeta({
  layout: false,
  middleware: ['guest'],
})

const { register } = useAuth()

useHead({ title: 'Daftar' })

const form = reactive<RegisterPayload & { confirm_password: string }>({
  full_name: '',
  username: '',
  email: '',
  phone_number: '',
  password: '',
  confirm_password: '',
})
const loading = ref(false)
const errorMessage = ref('')

async function submit() {
  errorMessage.value = ''

  if (form.password !== form.confirm_password) {
    errorMessage.value = 'Konfirmasi password tidak cocok.'
    return
  }

  loading.value = true
  try {
    await register({
      full_name: form.full_name,
      username: form.username,
      email: form.email,
      phone_number: form.phone_number,
      password: form.password,
    })
    await navigateTo('/client/cv')
  } catch (e) {
    errorMessage.value = apiFetchErrorMessage(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthShell title="Buat akun" subtitle="Isi data berikut untuk membuat akun baru.">
    <UAlert v-if="errorMessage" color="error" variant="soft" :title="errorMessage" class="mb-5" />

    <form class="space-y-4" @submit.prevent="submit">
      <UFormField label="Nama lengkap" required>
        <UInput
          v-model="form.full_name"
          placeholder="Nama sesuai CV"
          autocomplete="name"
          required
          class="w-full"
        />
      </UFormField>

      <UFormField label="Username" required>
        <UInput
          v-model="form.username"
          placeholder="username"
          autocomplete="username"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Email" required>
        <UInput
          v-model="form.email"
          type="email"
          placeholder="nama@email.com"
          autocomplete="email"
          class="w-full"
        />
      </UFormField>

      <UFormField label="No. telepon" required>
        <UInput
          v-model="form.phone_number"
          placeholder="08123456789"
          autocomplete="tel"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Password" required>
        <UInput
          v-model="form.password"
          type="password"
          placeholder="Minimal 8 karakter"
          autocomplete="new-password"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Konfirmasi password" required>
        <UInput
          v-model="form.confirm_password"
          type="password"
          placeholder="Ulangi password"
          autocomplete="new-password"
          class="w-full"
        />
      </UFormField>

      <UButton
        type="submit"
        block
        size="lg"
        color="primary"
        :loading="loading"
        class="min-h-11 font-semibold"
      >
        Daftar
      </UButton>
    </form>

    <p class="mt-6 text-center text-sm text-zinc-600">
      Sudah punya akun?
      <NuxtLink to="/login" class="font-medium text-primary-700 hover:underline"> Masuk </NuxtLink>
    </p>
  </AuthShell>
</template>
