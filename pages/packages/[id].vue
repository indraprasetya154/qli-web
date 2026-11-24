<script setup lang="ts">
import { computed } from 'vue'
import type { PublicPackage } from '~/types/order'
import { apiFetchErrorMessage } from '~/utils/apiFormat'

definePageMeta({ layout: 'public' })

const route = useRoute()
const packageId = computed(() => String(route.params.id ?? ''))

const { apiFetch } = useApi()
const { isLoggedIn, isClient } = useAuth()
const { data, pending, error } = useAsyncData(`public-package-${packageId.value}`, () =>
  apiFetch<{ data: PublicPackage }>(`/v1/package/public/${packageId.value}`)
)

const pkg = computed(() => data.value?.data)
const errMsg = computed(() => apiFetchErrorMessage(error.value))
const notFound = computed(() => errMsg.value.toLowerCase().includes('not found'))

const cta = computed(() => {
  if (isClient.value) return { to: '/client/offers', label: 'Lihat Penawaran Saya' }
  if (isLoggedIn.value) return { to: '/dashboard', label: 'Buka Dashboard' }
  return { to: '/register', label: 'Daftar untuk Konsultasi' }
})

useHead({
  title: computed(() => pkg.value?.name ?? 'Detail Paket'),
})
</script>

<template>
  <div class="bg-[#faf8f4] py-14 lg:py-20">
    <div class="public-container">
      <div v-if="pending" class="max-w-3xl">
        <USkeleton class="h-4 w-32 bg-[#f4e5ea]" />
        <USkeleton class="mt-4 h-10 w-2/3 bg-[#f4e5ea]" />
        <USkeleton class="mt-6 h-24 w-full bg-[#f4e5ea]" />
      </div>

      <div
        v-else-if="error"
        class="max-w-2xl rounded-lg border border-[#e2e0dc] bg-white p-8"
        role="alert"
      >
        <h1 class="text-2xl font-medium text-[#1a1919]">
          {{ notFound ? 'Paket tidak tersedia.' : 'Gagal memuat paket.' }}
        </h1>
        <p class="mt-3 text-sm leading-relaxed text-[#575654]">
          {{
            notFound
              ? 'Paket ini mungkin sudah tidak aktif. Lihat paket lain yang tersedia.'
              : errMsg
          }}
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <UButton to="/packages" color="primary">Lihat Semua Paket</UButton>
          <UButton to="/" color="neutral" variant="outline">Kembali ke Beranda</UButton>
        </div>
      </div>

      <article v-else-if="pkg" class="max-w-3xl">
        <div>
          <NuxtLink to="/packages" class="text-sm font-medium text-accent-500 hover:underline">
            Kembali ke daftar paket
          </NuxtLink>
          <h1 class="mt-4 text-3xl font-medium text-[#1a1919] sm:text-[42px]">
            {{ pkg.name }}
          </h1>
          <p class="mt-4 max-w-2xl text-base leading-relaxed text-[#575654]">
            {{ pkg.description ?? 'Layanan konsultasi dan pendampingan.' }}
          </p>
          <p class="mt-2 max-w-2xl text-sm leading-relaxed text-[#575654]">
            Paket ini disiapkan setelah CV kamu direview tim Qatar Loker Info.
          </p>
          <p class="mt-2 max-w-2xl text-sm font-medium text-[#1a1919]">
            Berlaku {{ pkg.duration_months ?? 1 }} bulan
          </p>
          <p class="mt-2 max-w-2xl text-sm font-medium text-[#1a1919]">
            Harga paket ditentukan setelah review CV.
          </p>

          <section class="mt-10">
            <h2 class="text-lg font-semibold text-[#1a1919]">Yang kamu dapatkan</h2>
            <ul class="mt-4 grid gap-3 sm:grid-cols-2">
              <li
                v-for="feature in pkg.features"
                :key="feature"
                class="flex items-start gap-2 rounded-lg border border-[#e2e0dc] bg-white p-4 text-sm text-[#1a1919]"
              >
                <UIcon
                  name="i-heroicons-check-circle"
                  class="mt-0.5 h-5 w-5 shrink-0 text-brand-500"
                />
                {{ feature }}
              </li>
            </ul>
          </section>

          <UButton :to="cta.to" color="primary" size="lg" class="mt-10 font-medium">
            {{ cta.label }}
          </UButton>
        </div>
      </article>
    </div>
  </div>
</template>
