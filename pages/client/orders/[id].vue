<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PublicOrder } from '~/types/order'
import { apiFetchErrorMessage } from '~/utils/apiFormat'
import { formatDateIdDmyLongMonthWib, formatDateTimeDmyHm } from '~/utils/dateFormat'
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
const { apiFetch, apiPost } = useApi()

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

const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const fileError = ref('')
const uploading = ref(false)
const uploadMessage = ref('')

const canUpload = computed(
  () => order.value?.payment_status === 'PENDING' || order.value?.payment_status === 'REJECTED'
)

function onFileChange(event: Event) {
  fileError.value = ''
  uploadMessage.value = ''
  const input = event.target as HTMLInputElement
  const selected = input.files?.[0] ?? null
  if (!selected) {
    file.value = null
    return
  }
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
  if (!allowed.includes(selected.type)) {
    fileError.value = 'Gunakan file JPG, PNG, WEBP, atau PDF.'
  } else if (selected.size > 5 * 1024 * 1024) {
    fileError.value = 'Ukuran file maksimal 5 MB.'
  } else {
    file.value = selected
    return
  }
  file.value = null
  input.value = ''
}

async function uploadProof() {
  fileError.value = ''
  uploadMessage.value = ''
  if (!order.value) return
  if (!file.value) {
    fileError.value = 'Pilih file bukti transfer terlebih dahulu.'
    return
  }

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('email', order.value.customer.email)
    formData.append('proof', file.value)

    await apiPost(
      `/v1/order/${encodeURIComponent(order.value.order_number)}/payment-proof`,
      formData as unknown as Record<string, unknown>
    )
    file.value = null
    if (fileInput.value) fileInput.value.value = ''
    await refresh()
    uploadMessage.value = 'Bukti pembayaran diterima. Pesanan menunggu verifikasi admin.'
  } catch (e) {
    fileError.value = apiFetchErrorMessage(e)
  } finally {
    uploading.value = false
  }
}
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
            <div>
              <dt class="text-zinc-500">Masa berlaku</dt>
              <dd class="text-zinc-900">{{ order.package?.duration_months ?? 1 }} bulan</dd>
            </div>
            <div>
              <dt class="text-zinc-500">Aktif sampai</dt>
              <dd class="text-zinc-900">
                {{
                  order.active_until
                    ? formatDateIdDmyLongMonthWib(order.active_until)
                    : 'Aktif setelah pembayaran terverifikasi'
                }}
              </dd>
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

        <div v-if="canUpload" class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
          <h2 class="text-sm font-semibold text-zinc-900">Unggah bukti transfer</h2>
          <p class="mt-2 text-sm text-zinc-600">Format JPG, PNG, WEBP, atau PDF. Maksimal 5 MB.</p>
          <form class="mt-4 space-y-3" @submit.prevent="uploadProof">
            <UFormField label="File bukti transfer" required>
              <input
                ref="fileInput"
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                class="block w-full cursor-pointer rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 file:mr-3 file:rounded file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-zinc-700"
                @change="onFileChange"
              />
            </UFormField>
            <UAlert v-if="fileError" color="error" variant="soft" :title="fileError" />
            <UAlert v-if="uploadMessage" color="success" variant="soft" :title="uploadMessage" />
            <UButton
              type="submit"
              color="primary"
              size="sm"
              :loading="uploading"
              :disabled="uploading"
            >
              Kirim Bukti Pembayaran
            </UButton>
          </form>
        </div>

        <div
          v-else-if="order.payment_status === 'WAITING_VERIFICATION'"
          class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6"
        >
          <UAlert
            color="info"
            variant="soft"
            title="Bukti pembayaran sedang diverifikasi."
            description="Kamu akan bisa mengunggah ulang jika admin menolak bukti sebelumnya."
          />
        </div>

        <div
          v-else-if="order.payment_status === 'PAID'"
          class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6"
        >
          <UAlert
            color="success"
            variant="soft"
            title="Pembayaran sudah diverifikasi."
            description="Akun portal akan dibuat atau ditautkan oleh admin."
          />
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
    </template>
  </div>
</template>
