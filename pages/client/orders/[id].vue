<script setup lang="ts">
import { computed } from 'vue'
import type { PublicOrder } from '~/types/order'
import { apiFetchErrorMessage } from '~/utils/apiFormat'
import { formatDateTimeDmyHm } from '~/utils/dateFormat'
import {
  formatRupiah,
  ORDER_STATUS_LABEL,
  orderStatusColor,
  PAYMENT_STATUS_LABEL,
  paymentStatusColor,
} from '~/utils/order'

definePageMeta({ layout: 'app-sidebar', middleware: ['client'] })

const route = useRoute()
const orderId = computed(() => String(route.params.id ?? ''))
const { apiFetch } = useApi()

const { setBreadcrumbs } = useAppLayout()
setBreadcrumbs([
  { title: 'Profil Saya', href: '/client' },
  { title: 'Pesanan Saya', href: '/client/orders' },
  { title: 'Detail Pesanan' },
])
useHead({ title: 'Detail Pesanan' })

const { data, pending, error, refresh } = useAsyncData(`client-order-${orderId.value}`, () =>
  apiFetch<{ data: PublicOrder }>(`/v1/order/me/${orderId.value}`)
)

const order = computed(() => data.value?.data)
const errMsg = computed(() => apiFetchErrorMessage(error.value))
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col gap-6 p-4 sm:p-6">
    <div v-if="pending" class="space-y-3">
      <USkeleton class="h-24 w-full rounded-2xl bg-zinc-100" />
      <USkeleton class="h-64 w-full rounded-2xl bg-zinc-100" />
    </div>

    <AppEmptyState v-else-if="error" title="Gagal memuat pesanan." :description="errMsg">
      <UButton color="neutral" variant="outline" size="sm" @click="() => refresh()">
        Coba lagi
      </UButton>
      <UButton to="/client/orders" color="neutral" variant="ghost" size="sm" class="mt-2">
        Kembali ke daftar pesanan
      </UButton>
    </AppEmptyState>

    <template v-else-if="order">
      <AppPageHeader
        :title="order.package_name"
        :description="`Nomor pesanan ${order.order_number}`"
        icon-name="i-heroicons-shopping-bag"
        container-class="items-center"
        description-class="mt-1 text-sm text-zinc-600"
      >
        <template #actions>
          <UBadge :color="orderStatusColor(order.status)" variant="subtle" size="sm">
            {{ ORDER_STATUS_LABEL[order.status] }}
          </UBadge>
          <UButton to="/client/orders" color="neutral" variant="outline" size="sm">
            Kembali
          </UButton>
        </template>
      </AppPageHeader>

      <section class="grid gap-4 lg:grid-cols-2">
        <div class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
          <h2 class="text-sm font-semibold text-zinc-900">Informasi pesanan</h2>
          <dl class="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt class="text-zinc-500">Nomor pesanan</dt>
              <dd class="font-mono text-zinc-900">{{ order.order_number }}</dd>
            </div>
            <div>
              <dt class="text-zinc-500">Tanggal pembelian</dt>
              <dd class="text-zinc-900">{{ formatDateTimeDmyHm(order.created_at) }}</dd>
            </div>
            <div>
              <dt class="text-zinc-500">Harga paket</dt>
              <dd class="text-zinc-900">{{ formatRupiah(order.package_price) }}</dd>
            </div>
            <div>
              <dt class="text-zinc-500">Total</dt>
              <dd class="font-semibold text-zinc-900">{{ formatRupiah(order.grand_total) }}</dd>
            </div>
            <div v-if="order.voucher > 0">
              <dt class="text-zinc-500">Diskon</dt>
              <dd class="text-zinc-900">
                {{ formatRupiah(order.voucher) }}
                <span v-if="order.voucher_code" class="font-mono">({{ order.voucher_code }})</span>
              </dd>
            </div>
          </dl>
        </div>

        <div class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
          <h2 class="text-sm font-semibold text-zinc-900">Status pembayaran</h2>
          <div class="mt-4 space-y-3 text-sm">
            <UBadge :color="paymentStatusColor(order.payment_status)" variant="subtle" size="sm">
              {{ PAYMENT_STATUS_LABEL[order.payment_status] }}
            </UBadge>
            <p v-if="order.payment?.submitted_at" class="text-zinc-600">
              Bukti diunggah {{ formatDateTimeDmyHm(order.payment.submitted_at) }}
            </p>
            <p v-if="order.payment?.verified_at" class="text-zinc-600">
              Diverifikasi {{ formatDateTimeDmyHm(order.payment.verified_at) }}
            </p>
            <p v-if="order.payment?.rejection_reason" class="text-red-700">
              Catatan admin: {{ order.payment.rejection_reason }}
            </p>
            <p v-if="order.payment_at" class="text-zinc-600">
              Pembayaran lunas {{ formatDateTimeDmyHm(order.payment_at) }}
            </p>
          </div>
        </div>

        <div
          v-if="order.payment_account"
          class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6"
        >
          <h2 class="text-sm font-semibold text-zinc-900">Rekening tujuan</h2>
          <p class="mt-3 text-sm font-medium text-zinc-900">
            {{ order.payment_account.bank_name }}
          </p>
          <p class="mt-1 font-mono text-sm text-zinc-900">
            {{ order.payment_account.account_number }}
          </p>
          <p class="mt-1 text-sm text-zinc-600">a.n. {{ order.payment_account.account_holder }}</p>
        </div>

        <div v-if="order.package" class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
          <h2 class="text-sm font-semibold text-zinc-900">Cakupan layanan</h2>
          <ul class="mt-3 space-y-2 text-sm text-zinc-700">
            <li
              v-for="feature in order.package.features"
              :key="feature"
              class="flex items-start gap-2"
            >
              <UIcon name="i-heroicons-check" class="mt-0.5 size-4 shrink-0 text-primary-600" />
              {{ feature }}
            </li>
          </ul>
        </div>
      </section>

      <UAlert
        v-if="order.status === 'PENDING_PAYMENT'"
        color="warning"
        variant="soft"
        title="Pesanan menunggu pembayaran."
        description="Buka halaman status pesanan untuk melihat instruksi transfer dan mengunggah bukti pembayaran."
        class="mt-2"
      >
        <template #actions>
          <UButton
            :to="`/order/${order.order_number}`"
            color="warning"
            variant="outline"
            size="sm"
            class="mt-3"
          >
            Buka Instruksi Pembayaran
          </UButton>
        </template>
      </UAlert>
    </template>
  </div>
</template>
