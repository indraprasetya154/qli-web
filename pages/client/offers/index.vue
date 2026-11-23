<script setup lang="ts">
import { computed } from 'vue'
import type { PackageOffer } from '~/types/offer'
import { apiFetchErrorMessage } from '~/utils/apiFormat'
import { formatDateDmy, formatDateTimeDmyHm } from '~/utils/dateFormat'
import { formatRupiah } from '~/utils/order'
import { isOfferOrderable, OFFER_STATUS_LABEL, offerStatusColor } from '~/utils/offer'

definePageMeta({ layout: 'app-sidebar', middleware: ['client'] })

const { setBreadcrumbs } = useAppLayout()
setBreadcrumbs([{ title: 'Profil Saya', href: '/client' }, { title: 'Penawaran Saya' }])
useHead({ title: 'Penawaran Saya' })

const { apiFetch } = useApi()
const { data, pending, error, refresh } = useAsyncData('client-offers', () =>
  apiFetch<{ data: PackageOffer[] }>('/v1/package-offer/me')
)

const offers = computed(() => data.value?.data ?? [])
const errMsg = computed(() => apiFetchErrorMessage(error.value))
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col gap-6 p-4 sm:p-6">
    <AppPageHeader
      title="Penawaran Saya"
      description="Paket dan biaya disesuaikan setelah tim membaca CV kamu. Pilih yang paling pas dengan kebutuhanmu."
      icon-name="i-heroicons-document-currency-dollar"
      container-class="items-center"
      description-class="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-600"
    />

    <div v-if="pending" class="space-y-3" aria-busy="true">
      <USkeleton class="h-40 w-full rounded-2xl bg-zinc-100" />
      <USkeleton class="h-40 w-full rounded-2xl bg-zinc-100" />
    </div>

    <AppEmptyState v-else-if="error" title="Gagal memuat penawaran." :description="errMsg">
      <UButton color="neutral" variant="outline" size="sm" @click="() => refresh()">
        Coba lagi
      </UButton>
    </AppEmptyState>

    <AppEmptyState
      v-else-if="offers.length === 0"
      title="Belum ada penawaran."
      description="Hasil awal review sudah siap. Rekomendasi paket muncul di sini setelah tim menyiapkannya."
    >
      <UButton to="/client/cv" color="primary" size="sm">Unggah CV</UButton>
    </AppEmptyState>

    <section v-else class="space-y-3">
      <article
        v-for="offer in offers"
        :key="offer.id"
        class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6"
      >
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="min-w-0">
            <h2 class="text-base font-semibold text-zinc-900">
              {{ offer.package?.name ?? 'Paket layanan' }}
            </h2>
            <p v-if="offer.package?.description" class="mt-1 text-sm text-zinc-600">
              {{ offer.package.description }}
            </p>
          </div>
          <UBadge :color="offerStatusColor(offer.status)" variant="subtle" size="sm">
            {{ OFFER_STATUS_LABEL[offer.status] }}
          </UBadge>
          <UBadge v-if="offer.is_expired" color="error" variant="subtle" size="sm" class="ml-1">
            Kedaluwarsa
          </UBadge>
        </div>

        <ul v-if="offer.package?.features?.length" class="mt-4 space-y-2 text-sm text-zinc-700">
          <li
            v-for="feature in offer.package.features"
            :key="feature"
            class="flex items-start gap-2"
          >
            <UIcon name="i-heroicons-check" class="mt-0.5 size-4 shrink-0 text-primary-600" />
            {{ feature }}
          </li>
        </ul>

        <dl class="mt-5 grid gap-3 border-t border-zinc-100 pt-4 text-sm sm:grid-cols-2">
          <div>
            <dt class="text-zinc-500">Harga penawaran</dt>
            <dd class="text-lg font-semibold text-zinc-900">{{ formatRupiah(offer.price) }}</dd>
          </div>
          <div>
            <dt class="text-zinc-500">Berlaku sampai</dt>
            <dd class="text-zinc-900">
              {{ offer.expires_at ? formatDateTimeDmyHm(offer.expires_at) : 'Tanpa batas waktu' }}
            </dd>
          </div>
          <div v-if="offer.notes" class="sm:col-span-2">
            <dt class="text-zinc-500">Catatan tim</dt>
            <dd class="whitespace-pre-wrap text-zinc-900">{{ offer.notes }}</dd>
          </div>
          <div>
            <dt class="text-zinc-500">Ditawarkan</dt>
            <dd class="text-zinc-900">
              {{ offer.offered_at ? formatDateDmy(offer.offered_at) : '-' }}
            </dd>
          </div>
        </dl>

        <div
          class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4"
        >
          <p class="text-xs text-zinc-500">
            {{
              isOfferOrderable(offer)
                ? 'Harga ini berlaku sampai masa penawaran berakhir.'
                : 'Penawaran ini tidak dapat dipesan lagi.'
            }}
          </p>
          <UButton
            v-if="isOfferOrderable(offer)"
            :to="`/checkout/${offer.id}`"
            color="primary"
            size="sm"
          >
            Lanjut dengan paket ini
          </UButton>
        </div>
      </article>
    </section>
  </div>
</template>
