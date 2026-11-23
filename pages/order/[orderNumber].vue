<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { PublicOrder } from '~/types/order'
import { apiFetchErrorMessage } from '~/utils/apiFormat'
import { formatDateTimeDmyHm } from '~/utils/dateFormat'
import {
  formatRupiah,
  ORDER_STATUS_LABEL,
  orderStatusColor,
  PAYMENT_STATUS_LABEL,
  paymentStatusColor,
  recallOrderEmail,
  rememberOrderEmail,
} from '~/utils/order'

definePageMeta({ layout: 'public' })

const route = useRoute()
const orderNumber = computed(() => String(route.params.orderNumber ?? ''))
const { apiFetch, apiPost } = useApi()

const email = ref('')
const emailInput = ref('')
const lookupError = ref('')
const loading = ref(true)
const order = ref<PublicOrder | null>(null)

const file = ref<File | null>(null)
const fileError = ref('')
const uploading = ref(false)
const uploadMessage = ref('')

const canUpload = computed(
  () =>
    order.value !== null &&
    ['PENDING_PAYMENT', 'WAITING_VERIFICATION'].includes(order.value.status) &&
    order.value.payment_status !== 'WAITING_VERIFICATION' &&
    order.value.payment_status !== 'PAID'
)

onMounted(async () => {
  email.value = recallOrderEmail(orderNumber.value)
  if (email.value) {
    await loadOrder()
  } else {
    loading.value = false
  }
})

async function loadOrder() {
  loading.value = true
  lookupError.value = ''
  try {
    order.value = await apiFetch<{ data: PublicOrder }>(
      `/v1/order/${encodeURIComponent(orderNumber.value)}?email=${encodeURIComponent(email.value)}`
    ).then((response) => response.data)
  } catch (e) {
    order.value = null
    lookupError.value = apiFetchErrorMessage(e)
  } finally {
    loading.value = false
  }
}

async function lookup() {
  lookupError.value = ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
    lookupError.value = 'Masukkan email yang dipakai saat memesan.'
    return
  }
  email.value = emailInput.value.trim()
  await loadOrder()
  if (order.value) {
    rememberOrderEmail(orderNumber.value, email.value)
  }
}

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
    file.value = null
    return
  }
  if (selected.size > 5 * 1024 * 1024) {
    fileError.value = 'Ukuran file maksimal 5 MB.'
    file.value = null
    return
  }
  file.value = selected
}

async function uploadProof() {
  fileError.value = ''
  uploadMessage.value = ''
  if (!file.value) {
    fileError.value = 'Pilih file bukti transfer terlebih dahulu.'
    return
  }

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('email', email.value)
    formData.append('proof', file.value)

    const response = await apiPost<{ data: PublicOrder }>(
      `/v1/order/${encodeURIComponent(orderNumber.value)}/payment-proof`,
      formData as unknown as Record<string, unknown>
    )
    order.value = response.data
    uploadMessage.value = 'Bukti pembayaran diterima. Pesanan menunggu verifikasi admin.'
    file.value = null
  } catch (e) {
    fileError.value = apiFetchErrorMessage(e)
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="bg-[#faf8f4] py-12 lg:py-16">
    <div class="public-container">
      <div v-if="loading" class="space-y-4" aria-busy="true">
        <USkeleton class="h-10 w-72 bg-white" />
        <USkeleton class="h-64 w-full bg-white" />
      </div>

      <template v-else>
        <section
          v-if="!order"
          class="mx-auto max-w-xl rounded-lg border border-[#e2e0dc] bg-white p-8"
        >
          <p class="text-sm font-medium text-accent-500">Status Pesanan</p>
          <h1 class="mt-3 text-2xl font-medium text-[#1a1919]">Masukkan email pemesan.</h1>
          <p class="mt-3 text-sm leading-relaxed text-[#575654]">
            Nomor pesanan: <span class="font-mono font-medium">{{ orderNumber }}</span
            >. Email dipakai untuk memastikan hanya pemilik pesanan yang dapat melihat instruksi dan
            mengunggah bukti.
          </p>
          <form class="mt-6 space-y-4" @submit.prevent="lookup">
            <UFormField label="Email" required>
              <UInput
                v-model="emailInput"
                type="email"
                autocomplete="email"
                placeholder="nama@email.com"
                class="w-full"
              />
            </UFormField>
            <UAlert v-if="lookupError" color="error" variant="soft" :title="lookupError" />
            <UButton
              type="submit"
              color="primary"
              size="lg"
              block
              class="justify-center font-semibold"
            >
              Lihat Pesanan
            </UButton>
          </form>
          <p class="mt-4 text-xs text-[#575654]">
            Butuh bantuan? Hubungi Customer Service melalui Instagram @qatarlokerinfo.
          </p>
        </section>

        <template v-else>
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p class="text-sm font-medium text-accent-500">Pesanan</p>
              <h1 class="mt-2 font-mono text-2xl font-medium text-[#1a1919] sm:text-3xl">
                {{ order.order_number }}
              </h1>
              <p class="mt-2 text-sm text-[#575654]">
                Dibuat {{ formatDateTimeDmyHm(order.created_at) }}
              </p>
            </div>
            <div class="flex flex-wrap gap-2">
              <UBadge :color="orderStatusColor(order.status)" variant="subtle" size="lg">
                {{ ORDER_STATUS_LABEL[order.status] }}
              </UBadge>
              <UBadge :color="paymentStatusColor(order.payment_status)" variant="subtle" size="lg">
                {{ PAYMENT_STATUS_LABEL[order.payment_status] }}
              </UBadge>
            </div>
          </div>

          <UAlert
            color="success"
            variant="soft"
            icon="i-heroicons-check-circle"
            title="Pesanan berhasil dibuat."
            description="Silakan lakukan transfer sesuai instruksi pembayaran. Pesanan Anda akan diproses setelah pembayaran diverifikasi oleh admin."
            class="mt-6"
          />

          <UAlert
            v-if="order.payment_status === 'REJECTED'"
            color="error"
            variant="soft"
            icon="i-heroicons-exclamation-triangle"
            title="Bukti pembayaran ditolak"
            :description="
              order.payment?.rejection_reason || 'Silakan unggah ulang bukti transfer yang benar.'
            "
            class="mt-4"
          />

          <div class="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section class="rounded-lg border border-[#e2e0dc] bg-white p-6">
              <h2 class="text-lg font-semibold text-[#1a1919]">Instruksi pembayaran</h2>
              <p class="mt-2 text-sm leading-relaxed text-[#575654]">
                Transfer tepat sebesar nominal berikut ke rekening tujuan.
              </p>

              <dl class="mt-5 space-y-4 text-sm">
                <div class="rounded-lg bg-[#faf8f4] p-4">
                  <dt class="text-[#575654]">Jumlah transfer</dt>
                  <dd class="mt-1 text-2xl font-semibold text-brand-500">
                    {{ formatRupiah(order.grand_total) }}
                  </dd>
                </div>
                <div v-if="order.payment_account">
                  <dt class="text-[#575654]">Rekening tujuan</dt>
                  <dd class="mt-1 text-[#1a1919]">
                    <span class="block font-semibold">
                      {{ order.payment_account.bank_name }}
                    </span>
                    <span class="mt-1 block font-mono text-base">
                      {{ order.payment_account.account_number }}
                    </span>
                    <span class="mt-1 block">
                      a.n. {{ order.payment_account.account_holder }}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt class="text-[#575654]">Status pembayaran</dt>
                  <dd class="mt-1 font-medium text-[#1a1919]">
                    {{ PAYMENT_STATUS_LABEL[order.payment_status] }}
                  </dd>
                </div>
              </dl>

              <div v-if="canUpload" class="mt-6 border-t border-[#e2e0dc] pt-6">
                <h3 class="text-base font-semibold text-[#1a1919]">Unggah bukti transfer</h3>
                <p class="mt-1 text-sm text-[#575654]">
                  Format JPG, PNG, WEBP, atau PDF. Maksimal 5 MB.
                </p>
                <form class="mt-4 space-y-3" @submit.prevent="uploadProof">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    class="block w-full cursor-pointer rounded-md border border-[#e2e0dc] bg-white px-3 py-2 text-sm text-[#1a1919] file:mr-3 file:rounded file:border-0 file:bg-[#f4e5ea] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-600"
                    aria-label="Pilih file bukti transfer"
                    @change="onFileChange"
                  />
                  <UAlert v-if="fileError" color="error" variant="soft" :title="fileError" />
                  <UAlert
                    v-if="uploadMessage"
                    color="success"
                    variant="soft"
                    :title="uploadMessage"
                  />
                  <UButton
                    type="submit"
                    color="primary"
                    size="lg"
                    block
                    class="justify-center font-semibold"
                    :loading="uploading"
                    :disabled="uploading"
                  >
                    Kirim Bukti Pembayaran
                  </UButton>
                </form>
              </div>

              <UAlert
                v-else-if="order.payment_status === 'WAITING_VERIFICATION'"
                color="info"
                variant="soft"
                title="Bukti pembayaran sedang diverifikasi."
                description="Kamu akan bisa mengunggah ulang jika admin menolak bukti sebelumnya."
                class="mt-6"
              />
              <UAlert
                v-else-if="order.payment_status === 'PAID'"
                color="success"
                variant="soft"
                title="Pembayaran sudah diverifikasi."
                description="Akun portal akan dibuat atau ditautkan oleh admin."
                class="mt-6"
              />
            </section>

            <aside class="h-fit space-y-4">
              <section class="rounded-lg border border-[#e2e0dc] bg-white p-6">
                <h2 class="text-base font-semibold text-[#1a1919]">Ringkasan</h2>
                <dl class="mt-4 space-y-3 text-sm">
                  <div class="flex justify-between gap-4">
                    <dt class="text-[#575654]">Paket</dt>
                    <dd class="text-right font-medium text-[#1a1919]">
                      {{ order.package_name }}
                    </dd>
                  </div>
                  <div class="flex justify-between gap-4">
                    <dt class="text-[#575654]">Harga paket</dt>
                    <dd class="text-[#1a1919]">{{ formatRupiah(order.package_price) }}</dd>
                  </div>
                  <div class="flex justify-between gap-4">
                    <dt class="text-[#575654]">Diskon</dt>
                    <dd class="text-[#1a1919]">
                      {{ formatRupiah(order.voucher) }}
                      <span v-if="order.voucher_code" class="ml-1 font-mono text-xs text-[#575654]">
                        ({{ order.voucher_code }})
                      </span>
                    </dd>
                  </div>
                  <div class="flex justify-between gap-4 border-t border-[#e2e0dc] pt-3">
                    <dt class="font-semibold text-[#1a1919]">Total</dt>
                    <dd class="font-semibold text-[#1a1919]">
                      {{ formatRupiah(order.grand_total) }}
                    </dd>
                  </div>
                </dl>
              </section>

              <section class="rounded-lg border border-[#e2e0dc] bg-white p-6">
                <h2 class="text-base font-semibold text-[#1a1919]">Data pemesan</h2>
                <dl class="mt-4 space-y-2 text-sm">
                  <div>
                    <dt class="text-[#575654]">Nama</dt>
                    <dd class="text-[#1a1919]">{{ order.customer.name }}</dd>
                  </div>
                  <div>
                    <dt class="text-[#575654]">Email</dt>
                    <dd class="break-all text-[#1a1919]">{{ order.customer.email }}</dd>
                  </div>
                  <div>
                    <dt class="text-[#575654]">Telepon</dt>
                    <dd class="text-[#1a1919]">{{ order.customer.phone }}</dd>
                  </div>
                </dl>
              </section>

              <p class="text-xs leading-relaxed text-[#575654]">
                Simpan nomor pesanan ini. Gunakan halaman ini untuk memantau status pembayaran.
              </p>
            </aside>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
