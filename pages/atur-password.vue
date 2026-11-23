<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { apiFetchErrorMessage } from '~/utils/apiFormat'

definePageMeta({ layout: false })
useHead({ title: 'Atur Password' })

const route = useRoute()
const token = computed(() => String(route.query.token ?? '').trim())
const { apiPost } = useApi()

const form = reactive({
  password: '',
  confirm_password: '',
})
const loading = ref(false)
const errorMessage = ref('')
const success = ref(false)

async function submit() {
  errorMessage.value = ''
  if (!token.value) {
    errorMessage.value = 'Tautan aktivasi tidak valid.'
    return
  }
  if (form.password.length < 8) {
    errorMessage.value = 'Password minimal 8 karakter.'
    return
  }
  if (form.password !== form.confirm_password) {
    errorMessage.value = 'Konfirmasi password tidak cocok.'
    return
  }

  loading.value = true
  try {
    await apiPost('/v1/auth/password-setup', {
      token: token.value,
      password: form.password,
    })
    success.value = true
  } catch (e) {
    errorMessage.value = apiFetchErrorMessage(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthShell
    title="Atur password akun"
    subtitle="Buat password untuk masuk ke portal klien Qatar Loker Info."
  >
    <div v-if="!token" class="space-y-4">
      <UAlert
        color="error"
        variant="soft"
        title="Tautan aktivasi tidak valid."
        description="Minta tautan baru kepada admin melalui Customer Service."
      />
      <UButton to="/login" color="primary" block class="justify-center"> Ke Halaman Masuk </UButton>
    </div>

    <div v-else-if="success" class="space-y-4">
      <UAlert
        color="success"
        variant="soft"
        title="Password berhasil dibuat."
        description="Sekarang kamu bisa masuk ke portal klien dengan email dan password tersebut."
      />
      <UButton to="/login" color="primary" block class="justify-center"> Masuk ke Portal </UButton>
    </div>

    <form v-else class="space-y-4" @submit.prevent="submit">
      <UAlert v-if="errorMessage" color="error" variant="soft" :title="errorMessage" />

      <UFormField label="Password baru" required>
        <UInput
          v-model="form.password"
          type="password"
          autocomplete="new-password"
          placeholder="Minimal 8 karakter"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Konfirmasi password" required>
        <UInput
          v-model="form.confirm_password"
          type="password"
          autocomplete="new-password"
          placeholder="Ulangi password"
          class="w-full"
        />
      </UFormField>

      <UButton
        type="submit"
        block
        size="lg"
        color="primary"
        :loading="loading"
        class="min-h-11 justify-center font-semibold"
      >
        Simpan Password
      </UButton>
    </form>

    <p class="mt-6 text-center text-sm text-zinc-600">
      Sudah punya password?
      <NuxtLink to="/login" class="font-medium text-primary-700 hover:underline"> Masuk </NuxtLink>
    </p>
  </AuthShell>
</template>
