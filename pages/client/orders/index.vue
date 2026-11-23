<script setup lang="ts">
import { computed } from 'vue'
import type { PublicOrder } from '~/types/order'
import { apiFetchErrorMessage } from '~/utils/apiFormat'
import { formatDateDmy } from '~/utils/dateFormat'
import {
  formatRupiah,
  ORDER_STATUS_LABEL,
  orderStatusColor,
  PAYMENT_STATUS_LABEL,
  paymentStatusColor,
} from '~/utils/order'

definePageMeta({ layout: 'app-sidebar', middleware: ['client'] })

const { setBreadcrumbs } = useAppLayout()
setBreadcrumbs([{ title: 'Profil Saya', href: '/client' }, { title: 'Pesanan Saya' }])
useHead({ title: 'Pesanan Saya' })

const { apiFetch } = useApi()
const { data, pending, error, refresh } = useAsyncData('client-orders', () =>
  apiFetch<{ data: PublicOrder[] }>('/v1/order/me')
)

const orders = computed(() => data.value?.data ?? [])
const errMsg = computed(() => apiFetchErrorMessage(error.value))
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col gap-6 p-4 sm:p-6">
    <AppPageHeader
      title="Pesanan Saya"
      description="Riwayat paket pendampingan dan status pesanan."
      icon-name="i-heroicons-clipboard-document-list"
      container-class="items-center"
      description-class="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-600"
    />

    <div v-if="pending" class="space-y-3">
      <USkeleton class="h-24 w-full rounded-2xl bg-zinc-100" />
      <USkeleton class="h-24 w-full rounded-2xl bg-zinc-100" />
    </div>

    <AppEmptyState v-else-if="error" title="Gagal memuat pesanan." :description="errMsg">
      <UButton color="neutral" variant="outline" size="sm" @click="() => refresh()">
        Coba lagi
      </UButton>
    </AppEmptyState>

    <AppEmptyState
      v-else-if="orders.length === 0"
      title="Belum ada pesanan."
      description="Paket akan dibuat setelah CV kamu direview tim Qatar Loker Info."
    />

    <section v-else class="space-y-3">
      <article
        v-for="order in orders"
        :key="order.id"
        class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6"
      >
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="min-w-0">
            <p class="font-mono text-xs text-zinc-500">{{ order.order_number }}</p>
            <h2 class="mt-1 text-base font-semibold text-zinc-900">
              {{ order.package_name }}
            </h2>
            <p class="mt-1 text-sm text-zinc-600">
              Dibeli {{ formatDateDmy(order.created_at) }} ·
              {{ formatRupiah(order.grand_total) }}
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <UBadge :color="orderStatusColor(order.status)" variant="subtle" size="sm">
              {{ ORDER_STATUS_LABEL[order.status] }}
            </UBadge>
            <UBadge :color="paymentStatusColor(order.payment_status)" variant="subtle" size="sm">
              {{ PAYMENT_STATUS_LABEL[order.payment_status] }}
            </UBadge>
          </div>
        </div>
        <div
          class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4"
        >
          <p v-if="order.payment?.rejection_reason" class="text-xs text-red-700">
            Catatan admin: {{ order.payment.rejection_reason }}
          </p>
          <p v-else class="text-xs text-zinc-500">
            Pembayaran: {{ PAYMENT_STATUS_LABEL[order.payment_status] }}
          </p>
          <UButton :to="`/client/orders/${order.id}`" color="neutral" variant="outline" size="sm">
            Lihat Detail
          </UButton>
        </div>
      </article>
    </section>
  </div>
</template>
