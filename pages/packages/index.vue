<script setup lang="ts">
import { computed } from 'vue'
import type { PublicPackage } from '~/types/order'
import { apiFetchErrorMessage } from '~/utils/apiFormat'

definePageMeta({ layout: 'public' })
useHead({ title: 'Paket Layanan' })

const { apiFetch } = useApi()
const { isLoggedIn, isClient } = useAuth()

const { data, pending, error } = useAsyncData('public-packages-page', () =>
  apiFetch<{ data: PublicPackage[] }>('/v1/package/public')
)

const packages = computed(() => data.value?.data ?? [])
const errMsg = computed(() => apiFetchErrorMessage(error.value))

const cta = computed(() => {
  if (isClient.value) return { to: '/client/offers', label: 'Lihat Penawaran Saya' }
  if (isLoggedIn.value) return { to: '/dashboard', label: 'Buka Dashboard' }
  return { to: '/register', label: 'Daftar untuk Konsultasi' }
})
</script>

<template>
  <div class="bg-[#faf8f4] py-14 lg:py-20">
    <div class="public-container">
      <header class="max-w-2xl">
        <p class="text-sm font-medium text-accent-500">Paket Layanan</p>
        <h1 class="mt-3 text-3xl font-medium text-[#1a1919] sm:text-[42px]">
          Pilih layanan yang sesuai kebutuhanmu.
        </h1>
        <p class="mt-4 text-base leading-relaxed text-[#575654]">
          Setiap paket punya cakupan yang jelas. Paket disiapkan setelah CV kamu direview tim Qatar
          Loker Info.
        </p>
        <p class="mt-2 text-sm leading-relaxed text-[#575654]">
          Harga paket ditentukan setelah review CV.
        </p>
        <UButton :to="cta.to" color="primary" size="lg" class="mt-6 font-medium">
          {{ cta.label }}
        </UButton>
      </header>

      <div v-if="pending" class="mt-10 grid gap-6 lg:grid-cols-3" aria-busy="true">
        <div v-for="n in 3" :key="n" class="rounded-lg border border-[#e2e0dc] bg-white p-7">
          <USkeleton class="h-5 w-40 bg-[#f4e5ea]" />
          <USkeleton class="mt-4 h-4 w-full bg-[#f4e5ea]" />
          <USkeleton class="mt-2 h-4 w-2/3 bg-[#f4e5ea]" />
        </div>
      </div>

      <div
        v-else-if="error"
        class="mt-10 rounded-lg border border-[#e2e0dc] bg-white p-8 text-center"
        role="alert"
      >
        <h2 class="text-lg font-semibold text-[#1a1919]">Gagal memuat paket.</h2>
        <p class="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[#575654]">
          {{ errMsg }}
        </p>
        <UButton to="/#layanan" color="primary" class="mt-6">Kembali ke beranda</UButton>
      </div>

      <div
        v-else-if="packages.length === 0"
        class="mt-10 rounded-lg border border-dashed border-[#b1afac] bg-white p-10 text-center"
      >
        <h2 class="text-lg font-semibold text-[#1a1919]">Belum ada paket yang dipublikasikan.</h2>
        <p class="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[#575654]">
          Tim sedang memperbarui layanan. Hubungi Customer Service untuk informasi terbaru.
        </p>
      </div>

      <div v-else class="mt-10 grid gap-6 lg:grid-cols-3">
        <article
          v-for="pkg in packages"
          :key="pkg.id"
          class="relative flex flex-col rounded-lg border bg-white p-7"
          :class="pkg.is_featured ? 'border-brand-500 brand-shadow-md' : 'border-[#e2e0dc]'"
        >
          <UBadge
            v-if="pkg.is_featured"
            color="primary"
            variant="solid"
            class="absolute -top-3 left-7 rounded-full px-3 text-xs font-semibold"
          >
            Paling diminati
          </UBadge>
          <h2 class="text-xl font-semibold text-[#1a1919]">{{ pkg.name }}</h2>
          <p class="mt-2 text-sm leading-relaxed text-[#575654]">
            {{ pkg.description ?? 'Layanan konsultasi dan pendampingan.' }}
          </p>
          <ul class="mt-5 flex-1 space-y-2.5">
            <li
              v-for="feature in pkg.features"
              :key="feature"
              class="flex items-center gap-2 text-sm text-[#1a1919]"
            >
              <UIcon name="i-heroicons-check" class="h-4 w-4 shrink-0 text-brand-500" />
              {{ feature }}
            </li>
          </ul>
          <div class="mt-7">
            <UButton
              :to="`/packages/${pkg.id}`"
              color="primary"
              class="w-full justify-center font-medium"
            >
              Lihat Detail
            </UButton>
          </div>
        </article>
      </div>

      <p class="mt-8 text-xs leading-relaxed text-[#575654]">
        Layanan tidak menjanjikan penempatan atau penerimaan kerja.
      </p>
    </div>
  </div>
</template>
