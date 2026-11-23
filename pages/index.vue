<script setup lang="ts">
import pendampinganImage from '~/assets/images/pendampingan.jpg'
import type { PublicPackage } from '~/types/order'

definePageMeta({
  layout: 'public',
})

useHead({
  title: 'Persiapan Karier ke Qatar',
})

const instagramUrl = 'https://www.instagram.com/qatarlokerinfo/'

const heroImage =
  'https://images.unsplash.com/photo-1669300884869-e6e11c67c031?auto=format&fit=crop&w=1920&q=80'

const coreValues = [
  {
    icon: 'i-heroicons-solid-clipboard-document-list',
    title: 'Informasi terstruktur',
    description: 'Persyaratan, dokumen, dan alur kerja dalam satu tempat.',
  },
  {
    icon: 'i-heroicons-solid-user-group',
    title: 'Pendampingan personal',
    description: 'Konsultasi langsung dengan tim, bukan sekadar artikel.',
  },
  {
    icon: 'i-heroicons-solid-chart-bar-square',
    title: 'Proses transparan',
    description: 'Progres pendampingan dapat dipantau dari portal klien.',
  },
]

const { apiFetch } = useApi()

const { data: packageData } = useAsyncData('public-packages', () =>
  apiFetch<{ data: PublicPackage[] }>('/v1/package/public')
)

type PublicFaq = {
  id: string
  question: string
  answer: string
  category: string | null
  sort_order: number
}

const { data: faqData } = useAsyncData('public-faqs', () =>
  apiFetch<{ data: PublicFaq[] }>('/v1/faq/public')
)

const faqs = computed(() => faqData.value?.data ?? [])
const faqKeyword = ref('')
const faqItems = computed(() => {
  const keyword = faqKeyword.value.trim().toLowerCase()
  return faqs.value
    .filter((item) => {
      if (!keyword) return true
      return [item.question, item.answer, item.category ?? ''].some((text) =>
        text.toLowerCase().includes(keyword)
      )
    })
    .map((item) => ({ label: item.question, content: item.answer }))
})

const packages = computed(() => packageData.value?.data ?? [])

const steps = [
  {
    title: 'Konsultasi Dulu',
    description: 'Daftar akun untuk mulai konsultasi dengan tim Qatar Loker Info.',
  },
  {
    title: 'Review CV',
    description: 'Tim meninjau CV dan pengalamanmu untuk menentukan pendampingan.',
  },
  {
    title: 'Paket Disiapkan',
    description: 'Paket dibuat setelah CV selesai direview.',
  },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative isolate overflow-hidden bg-[#1a1919]">
      <img
        :src="heroImage"
        alt="Panorama Teluk Doha dan Museum of Islamic Art, Qatar"
        width="1920"
        height="1080"
        fetchpriority="high"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-[#00232c]/90 via-[#00232c]/50 to-[#00232c]/25"
        aria-hidden="true"
      />
      <div
        class="public-container relative flex min-h-[calc(100svh-4rem)] flex-col justify-center py-20 lg:min-h-[calc(100svh-4.5rem)] lg:py-28"
      >
        <div class="max-w-2xl text-white">
          <p class="hero-rise text-sm font-medium text-[#e6dcc4]" style="--hero-delay: 60ms">
            Konsultasi Karier Internasional
          </p>
          <h1
            class="hero-rise mt-4 text-4xl font-medium leading-[1.3] sm:text-5xl lg:text-[56px]"
            style="--hero-delay: 140ms"
          >
            Persiapkan Karier Impianmu di Qatar.
          </h1>
          <p
            class="hero-rise mt-6 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg"
            style="--hero-delay: 240ms"
          >
            Temukan informasi dan persiapkan langkah karier internasionalmu bersama Qatar Loker Info
            melalui layanan konsultasi dan pendampingan yang terstruktur.
          </p>
          <div
            class="hero-rise mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            style="--hero-delay: 340ms"
          >
            <UButton
              to="/register"
              size="lg"
              class="h-12 bg-[#7d002a] px-7 text-base font-medium text-white hover:bg-[#650022]"
            >
              Daftar &amp; Review CV
            </UButton>
            <UButton
              href="/#layanan"
              color="neutral"
              variant="ghost"
              size="lg"
              class="h-12 px-7 text-base font-medium text-white ring-1 ring-white/35 ring-inset hover:bg-white/10"
            >
              Lihat Layanan
            </UButton>
          </div>
          <p class="hero-rise mt-5 text-sm text-white/80" style="--hero-delay: 420ms">
            Bukan perusahaan penempatan kerja. Kami membantu persiapan, bukan menjamin penerimaan.
          </p>
        </div>
      </div>
    </section>

    <!-- About -->
    <section id="tentang" class="scroll-mt-24 bg-[#faf8f4] py-20 lg:py-28">
      <div class="public-container">
        <div v-reveal class="mx-auto max-w-3xl text-center">
          <p class="text-sm font-medium text-accent-500">Tentang Kami</p>
          <h2
            class="mt-4 text-4xl font-medium leading-[1.15] text-[#1a1919] sm:text-5xl lg:text-[56px]"
          >
            Pendampingan yang jujur dan terstruktur.
          </h2>
        </div>

        <div class="mt-12 grid items-start gap-10 lg:mt-16 lg:grid-cols-2 lg:gap-14">
          <img
            :src="pendampinganImage"
            alt="Dua orang berdiskusi di depan papan catatan rencana di kantor"
            width="1200"
            height="675"
            loading="lazy"
            v-reveal="{ variant: 'fade' }"
            class="aspect-[4/3] w-full rounded-lg border border-[#e2e0dc] object-cover"
          />
          <div v-reveal="{ delay: 100 }" class="space-y-4 text-base leading-relaxed text-[#575654]">
            <p>
              Qatar Loker Info adalah layanan konsultasi dan pendampingan bagi masyarakat Indonesia
              yang ingin mempersiapkan karier di Qatar. Kami membantu memahami persyaratan,
              menyiapkan dokumen, dan membangun kesiapan menghadapi proses seleksi.
            </p>
            <p>
              Pendekatan kami sederhana: informasi yang jelas, pendampingan yang personal, dan
              proses yang transparan. Kami membantu persiapan, bukan menjamin penerimaan kerja;
              keputusan akhir tetap pada pemberi kerja.
            </p>
            <div class="grid gap-4 pt-2 sm:grid-cols-2">
              <div class="rounded-lg border border-[#e2e0dc] bg-white p-5">
                <p class="text-sm font-semibold text-[#1a1919]">Visi</p>
                <p class="mt-2 text-sm leading-relaxed text-[#575654]">
                  Menjadi platform persiapan kerja ke Qatar yang informatif, transparan, dan mudah
                  diakses.
                </p>
              </div>
              <div class="rounded-lg border border-[#e2e0dc] bg-white p-5">
                <p class="text-sm font-semibold text-[#1a1919]">Misi</p>
                <p class="mt-2 text-sm leading-relaxed text-[#575654]">
                  Menyediakan informasi terstruktur dan pendampingan personal bagi calon pekerja.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Core value -->
    <section aria-labelledby="core-value-title" class="bg-white py-20 lg:py-24">
      <div class="public-container">
        <div v-reveal class="mx-auto max-w-2xl text-center">
          <p class="text-sm font-medium text-accent-500">Core Value</p>
          <h2 id="core-value-title" class="mt-3 text-3xl font-medium text-[#1a1919] sm:text-[42px]">
            Nilai yang kami pegang.
          </h2>
          <p class="mt-4 text-base leading-relaxed text-[#575654]">
            Tiga prinsip yang kami jaga saat menyiapkan dokumen dan mendampingi persiapan kerjamu.
          </p>
        </div>

        <ul class="mt-10 grid gap-6 sm:grid-cols-3">
          <li
            v-for="(item, index) in coreValues"
            :key="item.title"
            v-reveal="index * 80"
            class="rounded-lg border border-[#e2e0dc] bg-white p-7 brand-shadow-sm"
          >
            <UIcon :name="item.icon" class="h-12 w-12 text-brand-500" aria-hidden="true" />
            <h3 class="mt-6 text-[22px] font-semibold leading-snug text-[#1a1919]">
              {{ item.title }}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-[#575654]">
              {{ item.description }}
            </p>
          </li>
        </ul>
      </div>
    </section>

    <!-- Services -->
    <section id="layanan" class="scroll-mt-24 bg-[#faf8f4] py-20 lg:py-28">
      <div class="public-container">
        <div v-reveal class="flex flex-wrap items-end justify-between gap-6">
          <div class="max-w-2xl">
            <p class="text-sm font-medium text-accent-500">Layanan</p>
            <h2 class="mt-3 text-3xl font-medium text-[#1a1919] sm:text-[42px]">
              Pilih layanan sesuai kebutuhanmu.
            </h2>
            <p class="mt-4 text-base leading-relaxed text-[#575654]">
              Setiap layanan punya cakupan yang jelas. Daftar layanan dikelola langsung oleh tim
              Qatar Loker Info melalui CMS dan diperbarui secara berkala.
            </p>
          </div>
          <UButton to="/register" color="primary" variant="soft" class="font-medium">
            Konsultasi dulu
            <template #trailing>
              <UIcon name="i-heroicons-arrow-right" class="h-4 w-4" />
            </template>
          </UButton>
        </div>

        <div
          v-if="!packages.length"
          v-reveal
          class="mt-10 rounded-lg border border-dashed border-[#b1afac] bg-white p-10 text-center"
        >
          <h3 class="text-lg font-semibold text-[#1a1919]">
            Belum ada layanan yang dipublikasikan.
          </h3>
          <p class="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[#575654]">
            Layanan sedang diperbarui di CMS. Hubungi Customer Service untuk informasi terbaru.
          </p>
          <UButton :href="instagramUrl" target="_blank" color="primary" class="mt-6 font-medium">
            Hubungi Customer Service
          </UButton>
        </div>

        <div v-else class="mt-10 grid gap-6 lg:grid-cols-3">
          <article
            v-for="(pkg, index) in packages"
            :key="pkg.id"
            v-reveal="index * 70"
            class="card-lift relative flex flex-col rounded-lg border bg-white p-7"
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
            <h3 class="text-xl font-semibold text-[#1a1919]">{{ pkg.name }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-[#575654]">
              {{ pkg.description }}
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
                variant="outline"
                class="w-full justify-center font-medium"
              >
                Lihat Detail
              </UButton>
            </div>
          </article>
        </div>
        <p class="mt-6 text-xs text-[#575654]">
          Layanan tidak menjanjikan penempatan atau penerimaan kerja.
        </p>
      </div>
    </section>

    <!-- How it works -->
    <section class="bg-white py-20 lg:py-24">
      <div class="public-container">
        <div v-reveal class="max-w-2xl">
          <p class="text-sm font-medium text-accent-500">Alur Kerja</p>
          <h2 class="mt-3 text-3xl font-medium text-[#1a1919] sm:text-[42px]">
            Tiga langkah memulai pendampingan.
          </h2>
        </div>

        <ol class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <li
            v-for="(step, index) in steps"
            :key="step.title"
            v-reveal="index * 70"
            class="relative rounded-lg border border-[#e2e0dc] bg-[#faf8f4] p-6"
          >
            <span
              class="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white"
            >
              {{ index + 1 }}
            </span>
            <h3 class="mt-4 text-base font-medium text-[#1a1919]">{{ step.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-[#575654]">{{ step.description }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="scroll-mt-24 bg-white py-20 lg:py-28">
      <div class="public-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div v-reveal>
          <p class="text-sm font-medium text-accent-500">FAQ</p>
          <h2 class="mt-3 text-3xl font-medium text-[#1a1919] sm:text-[42px]">
            Pertanyaan yang sering diajukan.
          </h2>
          <p class="mt-4 text-base leading-relaxed text-[#575654]">
            Belum menemukan jawaban? Hubungi Customer Service melalui Instagram.
          </p>
          <UButton
            :href="instagramUrl"
            target="_blank"
            color="primary"
            variant="soft"
            class="mt-6 font-medium"
          >
            Hubungi CS
          </UButton>
        </div>
        <div v-reveal="{ delay: 100 }" class="w-full space-y-4">
          <UInput
            v-model="faqKeyword"
            icon="i-heroicons-magnifying-glass"
            placeholder="Cari pertanyaan..."
            size="lg"
            class="w-full"
            aria-label="Cari FAQ"
          />
          <UAccordion
            v-if="faqItems.length"
            :items="faqItems"
            color="primary"
            variant="soft"
            class="w-full"
          />
          <div
            v-else
            class="rounded-lg border border-dashed border-[#e2e0dc] bg-[#faf8f4] p-6 text-sm leading-relaxed text-[#575654]"
          >
            {{
              faqKeyword.trim()
                ? 'Belum ada FAQ yang cocok. Coba kata kunci lain.'
                : 'Belum ada FAQ yang dipublikasikan.'
            }}
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-brand-500">
      <div class="public-container flex flex-col items-center gap-6 py-16 text-center lg:py-20">
        <h2 v-reveal class="max-w-3xl text-3xl font-medium leading-[1.3] text-white sm:text-[42px]">
          Langkah Pertamamu Menuju Karier Internasional Dimulai di Sini.
        </h2>
        <p v-reveal="{ delay: 60 }" class="max-w-xl text-base leading-relaxed text-white/90">
          Mulai dari konsultasi dan review CV. Paket pendampingan disiapkan setelah review selesai.
        </p>
        <div v-reveal="{ delay: 120 }" class="flex flex-wrap justify-center gap-3">
          <UButton
            to="/packages"
            color="neutral"
            variant="solid"
            size="lg"
            class="h-12 bg-white px-7 text-base font-medium text-brand-600 hover:bg-[#f4e5ea]"
          >
            Lihat Paket Layanan
          </UButton>
          <UButton
            to="/login"
            color="neutral"
            variant="ghost"
            size="lg"
            class="h-12 px-7 text-base font-medium text-white hover:bg-white/10"
          >
            Masuk
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>
