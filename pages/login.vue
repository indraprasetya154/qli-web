<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { LoginPayload } from '~/types/auth'
import { apiFetchErrorMessage } from '~/utils/apiFormat'
definePageMeta({
  layout: false,
  middleware: ['guest'],
})

const { login, homePath } = useAuth()
const route = useRoute()

useHead({ title: 'Masuk' })

const activated = computed(() => route.query.activated === '1')

const form = reactive<LoginPayload>({
  identifier: '',
  password: '',
})
const loading = ref(false)
const errorMessage = ref('')

async function submit() {
  errorMessage.value = ''
  loading.value = true
  try {
    await login(form)
    await navigateTo(homePath.value)
  } catch (e) {
    errorMessage.value = apiFetchErrorMessage(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthShell title="Masuk" subtitle="Gunakan username atau email beserta password akun Anda.">
    <UAlert
      v-if="activated"
      color="success"
      variant="soft"
      title="Password berhasil dibuat."
      description="Masuk dengan email dan password baru Anda."
      class="mb-5"
    />

    <UAlert v-if="errorMessage" color="error" variant="soft" :title="errorMessage" class="mb-5" />

    <form class="space-y-4" @submit.prevent="submit">
      <UFormField label="Username atau email" required>
        <UInput
          v-model="form.identifier"
          placeholder="admin atau admin@example.com"
          autocomplete="username"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Password" required>
        <UInput
          v-model="form.password"
          type="password"
          placeholder="Masukkan password"
          autocomplete="current-password"
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
        Masuk
      </UButton>
    </form>

    <p class="mt-6 text-center text-sm text-zinc-600">
      Belum punya akun?
      <NuxtLink to="/register" class="font-medium text-primary-700 hover:underline">
        Daftar
      </NuxtLink>
    </p>
  </AuthShell>
</template>
