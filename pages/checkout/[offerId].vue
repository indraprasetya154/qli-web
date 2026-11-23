<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch, watchEffect } from 'vue'
import type { ClientDetail } from '~/types/client'
import type { PackageOffer } from '~/types/offer'
import type { PublicOrder, PublicPaymentAccount } from '~/types/order'
import { apiFetchErrorMessage } from '~/utils/apiFormat'
import { formatDateTimeDmyHm } from '~/utils/dateFormat'
import { isOfferOrderable, OFFER_STATUS_LABEL, offerStatusColor } from '~/utils/offer'
import { formatRupiah, rememberOrderEmail } from '~/utils/order'

definePageMeta({ layout: 'app-sidebar', middleware: ['client'] })

const { setBreadcrumbs } = useAppLayout()
setBreadcrumbs([
  { title: 'Profil Saya', href: '/client' },
  { title: 'Penawaran Saya', href: '/client/offers' },
  { title: 'Checkout' },
])
useHead({ title: 'Checkout Pesanan' })

const route = useRoute()
const offerId = computed(() => String(route.params.offerId ?? ''))
const { apiFetch, apiPost } = useApi()
const { user } = useAuth()

const {
  data: offerData,
  pending: offerPending,
  error: offerError,
} = useAsyncData(`checkout-offer-${offerId.value}`, () =>
  apiFetch<{ data: PackageOffer }>(`/v1/package-offer/me/${offerId.value}`)
)

const {
  data: accountData,
  pending: accountPending,
  error: accountError,
} = useAsyncData('checkout-accounts', () =>
  apiFetch<{ data: PublicPaymentAccount[] }>('/v1/payment-account/public')
)

const offer = computed(() => offerData.value?.data)
const accounts = computed(() => accountData.value?.data ?? [])
const loading = computed(() => offerPending.value || accountPending.value)
const loadError = computed(() => apiFetchErrorMessage(offerError.value || accountError.value))
const orderable = computed(() => (offer.value ? isOfferOrderable(offer.value) : false))

const form = reactive({
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  payment_account_id: '',
})

watchEffect(() => {
  if (user.value?.email) form.customer_email = user.value.email
})

onMounted(async () => {
  try {
    const response = await apiFetch<{ data: ClientDetail }>('/v1/client/me')
    if (!form.customer_name) form.customer_name = response.data.full_name ?? ''
    if (!form.customer_phone) form.customer_phone = response.data.phone_number ?? ''
  } catch {
    // Prefill opsional; form tetap bisa diisi manual.
  }
})

const submitting = ref(false)
const errorMessage = ref('')

const selectedAccount = computed(() =>
  accounts.value.find((account) => account.id === form.payment_account_id)
)

type VoucherPreview = {
  offer_id?: string
  code: string
  description: string | null
  discount_type: 'FIXED' | 'PERCENTAGE'
  discount_value: number
  package_price: number
  discount_amount: number
  grand_total: number
}

const voucherCode = ref('')
const appliedVoucher = ref<VoucherPreview | null>(null)
const voucherLoading = ref(false)
const voucherError = ref('')

const packagePrice = computed(
  () => appliedVoucher.value?.package_price ?? Number(offer.value?.price ?? 0)
)
const discountAmount = computed(() => appliedVoucher.value?.discount_amount ?? 0)
const grandTotal = computed(() => appliedVoucher.value?.grand_total ?? packagePrice.value)

watch(voucherCode, () => {
  if (appliedVoucher.value) {
    appliedVoucher.value = null
    voucherError.value = ''
  }
})

const canSubmit = computed(
  () =>
    orderable.value &&
    Boolean(form.customer_name.trim()) &&
    Boolean(form.customer_email.trim()) &&
    Boolean(form.customer_phone.trim()) &&
    Boolean(form.payment_account_id)
)

async function applyVoucher() {
  voucherError.value = ''
  const code = voucherCode.value.trim().toUpperCase()
  if (!code) {
    voucherError.value = 'Masukkan kode voucher terlebih dahulu.'
    return
  }

  voucherLoading.value = true
  try {
    const response = await apiPost<{ data: VoucherPreview }>('/v1/voucher/validate', {
      offer_id: offerId.value,
      code,
    })
    appliedVoucher.value = response.data
    voucherCode.value = response.data.code
  } catch (e) {
    appliedVoucher.value = null
    voucherError.value = apiFetchErrorMessage(e)
  } finally {
    voucherLoading.value = false
  }
}

function removeVoucher() {
  appliedVoucher.value = null
  voucherCode.value = ''
  voucherError.value = ''
}

function validate(): string {
  if (!orderable.value) return 'Penawaran ini sudah tidak berlaku.'
  if (!form.customer_name.trim()) return 'Nama lengkap wajib diisi.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email.trim())) {
    return 'Format email tidak valid.'
  }
  if (!/^[0-9+][0-9\s-]{7,19}$/.test(form.customer_phone.trim())) {
    return 'Nomor telepon tidak valid.'
  }
  if (!form.payment_account_id) return 'Pilih rekening tujuan transfer.'
  return ''
}

function newIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `order-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

// Satu kunci per sesi halaman & penawaran; retry setelah timeout memakai kunci sama.
const idempotencyKey = ref('')
watch(
  offerId,
  () => {
    idempotencyKey.value = newIdempotencyKey()
  },
  { immediate: true }
)

async function submit() {
  errorMessage.value = validate()
  if (errorMessage.value) return
  if (!offer.value) return

  submitting.value = true
  try {
    const response = await apiPost<{ data: PublicOrder }>('/v1/order', {
      offer_id: offer.value.id,
      customer_name: form.customer_name.trim(),
      customer_email: form.customer_email.trim(),
      customer_phone: form.customer_phone.trim(),
      payment_account_id: form.payment_account_id,
      voucher_code: voucherCode.value.trim() || undefined,
      idempotency_key: idempotencyKey.value,
    })

    rememberOrderEmail(response.data.order_number, response.data.customer.email)
    await navigateTo(`/order/${response.data.order_number}`)
  } catch (e) {
    errorMessage.value = apiFetchErrorMessage(e)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col gap-6 p-4 sm:p-6">
    <div v-if="loading" class="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]" aria-busy="true">
      <USkeleton class="h-80 w-full rounded-2xl bg-zinc-100" />
      <USkeleton class="h-64 w-full rounded-2xl bg-zinc-100" />
    </div>

    <AppEmptyState
      v-else-if="loadError || !offer"
      title="Checkout tidak tersedia."
      :description="loadError || 'Penawaran tidak ditemukan. Paket dipilih setelah review CV.'"
    >
      <div class="flex flex-wrap justify-center gap-2">
        <UButton to="/client/offers" color="primary" size="sm">Lihat Penawaran Saya</UButton>
        <UButton to="/packages" color="neutral" variant="outline" size="sm">Lihat Paket</UButton>
      </div>
    </AppEmptyState>

    <template v-else>
      <AppPageHeader
        :title="offer.package?.name ?? 'Checkout Pesanan'"
        description="Periksa penawaran, pilih rekening, lalu buat pesanan."
        icon-name="i-heroicons-shopping-bag"
        container-class="items-center"
        description-class="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-600"
      >
        <template #actions>
          <UBadge :color="offerStatusColor(offer.status)" variant="subtle" size="sm">
            {{ OFFER_STATUS_LABEL[offer.status] }}
          </UBadge>
        </template>
      </AppPageHeader>

      <UAlert
        v-if="!orderable"
        color="warning"
        variant="soft"
        title="Penawaran ini tidak dapat dipesan."
        description="Penawaran sudah kedaluwarsa, dibatalkan, atau sudah dipakai. Lihat penawaran lain yang masih aktif."
      >
        <template #actions>
          <UButton to="/client/offers" color="warning" variant="outline" size="sm" class="mt-3">
            Buka Penawaran Saya
          </UButton>
        </template>
      </UAlert>

      <form class="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]" @submit.prevent="submit">
        <div class="space-y-6">
          <section class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
            <h2 class="text-sm font-semibold text-zinc-900">Data diri</h2>
            <div class="mt-4 grid gap-4 sm:grid-cols-2">
              <UFormField label="Nama lengkap" required class="sm:col-span-2">
                <UInput
                  v-model="form.customer_name"
                  autocomplete="name"
                  placeholder="Nama sesuai identitas"
                  class="w-full"
                  :disabled="!orderable"
                />
              </UFormField>
              <UFormField
                label="Email"
                required
                hint="Mengikuti email akun. Hubungi admin jika perlu diubah."
              >
                <UInput
                  v-model="form.customer_email"
                  type="email"
                  readonly
                  class="w-full bg-zinc-50"
                />
              </UFormField>
              <UFormField label="Nomor telepon / WhatsApp" required>
                <UInput
                  v-model="form.customer_phone"
                  type="tel"
                  autocomplete="tel"
                  placeholder="08123456789"
                  class="w-full"
                  :disabled="!orderable"
                />
              </UFormField>
            </div>
          </section>

          <section class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
            <h2 class="text-sm font-semibold text-zinc-900">Rekening tujuan</h2>
            <p class="mt-2 text-sm text-zinc-600">
              Instruksi transfer tampil setelah pesanan dibuat.
            </p>

            <div
              v-if="accounts.length === 0"
              class="mt-4 rounded-lg border border-dashed border-zinc-300 p-4 text-sm text-zinc-600"
            >
              Belum ada rekening aktif. Hubungi Customer Service sebelum melanjutkan pembayaran.
            </div>

            <fieldset v-else class="mt-4 space-y-3" :disabled="!orderable">
              <legend class="sr-only">Pilih rekening tujuan transfer</legend>
              <label
                v-for="account in accounts"
                :key="account.id"
                class="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors"
                :class="
                  form.payment_account_id === account.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-zinc-200 bg-white hover:border-zinc-300'
                "
              >
                <input
                  v-model="form.payment_account_id"
                  type="radio"
                  name="payment_account"
                  :value="account.id"
                  class="mt-1 h-4 w-4 accent-primary-600"
                />
                <span class="min-w-0">
                  <span class="block text-sm font-semibold text-zinc-900">
                    {{ account.bank_name }}
                  </span>
                  <span class="mt-1 block font-mono text-sm text-zinc-900">
                    {{ account.account_number }}
                  </span>
                  <span class="mt-0.5 block text-xs text-zinc-500">
                    a.n. {{ account.account_holder }}
                  </span>
                </span>
              </label>
            </fieldset>
          </section>

          <section class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
            <h2 class="text-sm font-semibold text-zinc-900">Kode voucher</h2>
            <p class="mt-2 text-sm text-zinc-600">
              Opsional. Masukkan kode untuk melihat potongan.
            </p>
            <div class="mt-4 flex flex-col gap-2 sm:flex-row">
              <UInput
                v-model="voucherCode"
                placeholder="HEMAT10"
                class="w-full font-mono uppercase sm:flex-1"
                aria-label="Kode voucher"
                :disabled="!orderable"
              />
              <UButton
                color="neutral"
                variant="outline"
                class="justify-center"
                :loading="voucherLoading"
                :disabled="voucherLoading || !orderable"
                @click="applyVoucher"
              >
                Terapkan
              </UButton>
            </div>
            <p v-if="voucherError" class="mt-2 text-sm text-red-700">{{ voucherError }}</p>
            <div
              v-if="appliedVoucher"
              class="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-primary-50 p-3 text-sm"
            >
              <span class="text-zinc-900">
                Voucher <strong>{{ appliedVoucher.code }}</strong> dipakai. Potongan
                {{ formatRupiah(appliedVoucher.discount_amount) }}.
              </span>
              <UButton color="neutral" variant="ghost" size="xs" @click="removeVoucher">
                Hapus
              </UButton>
            </div>
          </section>

          <UAlert v-if="errorMessage" color="error" variant="soft" :title="errorMessage" />
        </div>

        <aside
          class="h-fit space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 lg:sticky lg:top-4"
        >
          <div>
            <h2 class="text-sm font-semibold text-zinc-900">Ringkasan penawaran</h2>
            <p class="mt-1 text-xs text-zinc-500">
              Berlaku sampai
              {{ offer.expires_at ? formatDateTimeDmyHm(offer.expires_at) : 'tanpa batas waktu' }}
            </p>
            <ul v-if="offer.package?.features?.length" class="mt-3 space-y-2 text-sm text-zinc-700">
              <li
                v-for="feature in offer.package.features"
                :key="feature"
                class="flex items-start gap-2"
              >
                <UIcon name="i-heroicons-check" class="mt-0.5 size-4 shrink-0 text-primary-600" />
                {{ feature }}
              </li>
            </ul>
            <p
              v-if="offer.notes"
              class="mt-3 whitespace-pre-wrap rounded-lg bg-zinc-50 p-3 text-sm text-zinc-700"
            >
              {{ offer.notes }}
            </p>
          </div>

          <dl class="space-y-3 border-t border-zinc-100 pt-4 text-sm">
            <div class="flex justify-between gap-4">
              <dt class="text-zinc-500">Harga penawaran</dt>
              <dd class="text-zinc-900">{{ formatRupiah(packagePrice) }}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-zinc-500">Diskon</dt>
              <dd class="text-zinc-900">{{ formatRupiah(discountAmount) }}</dd>
            </div>
            <div v-if="appliedVoucher" class="flex justify-between gap-4">
              <dt class="text-zinc-500">Kode voucher</dt>
              <dd class="font-mono text-zinc-900">{{ appliedVoucher.code }}</dd>
            </div>
            <div class="flex justify-between gap-4 border-t border-zinc-100 pt-3">
              <dt class="font-semibold text-zinc-900">Total bayar</dt>
              <dd class="text-lg font-semibold text-primary-600">{{ formatRupiah(grandTotal) }}</dd>
            </div>
          </dl>

          <div class="rounded-lg bg-zinc-50 p-3 text-xs leading-relaxed text-zinc-600">
            <p class="font-medium text-zinc-900">Rekening dipilih</p>
            <p v-if="selectedAccount" class="mt-1">
              {{ selectedAccount.bank_name }} · {{ selectedAccount.account_number }}
            </p>
            <p v-else class="mt-1">Belum dipilih.</p>
          </div>

          <UButton
            type="submit"
            color="primary"
            size="lg"
            block
            class="justify-center"
            :loading="submitting"
            :disabled="!canSubmit || submitting"
          >
            Buat Pesanan
          </UButton>
          <p class="text-xs leading-relaxed text-zinc-500">
            Nominal akhir dihitung ulang oleh sistem.
          </p>
        </aside>
      </form>
    </template>
  </div>
</template>
