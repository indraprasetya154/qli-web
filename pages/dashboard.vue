<script setup lang="ts">
definePageMeta({
  layout: 'app-sidebar',
  middleware: ['admin'],
})

const { setBreadcrumbs } = useAppLayout()

setBreadcrumbs([{ title: 'Beranda', href: '/dashboard' }])

useHead({
  title: 'Beranda',
})

const featureShortcuts = [
  {
    title: 'Client Management',
    description: 'Kelola data client dan akun CMS.',
    to: '/clients',
    icon: 'i-heroicons-users',
  },
  {
    title: 'Kategori',
    description: 'Kelola data referensi kategori.',
    to: '/reference/category',
    icon: 'i-heroicons-tag',
  },
]
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col gap-6 p-4 sm:p-6">
    <section>
      <h1 class="text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
        Jalan Pintas Fitur
      </h1>
      <p class="mt-2 text-sm leading-relaxed text-zinc-600 sm:text-[15px]">
        Akses cepat ke fitur utama aplikasi.
      </p>

      <div class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <NuxtLink
          v-for="feature in featureShortcuts"
          :key="feature.to"
          :to="feature.to"
          class="group rounded-xl border border-zinc-200 bg-white p-4 no-underline transition-all duration-200 hover:border-primary-700 hover:bg-primary-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
        >
          <div class="flex items-start gap-3">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 transition-colors group-hover:bg-white/20 group-hover:text-white"
            >
              <UIcon :name="feature.icon" class="size-5" />
            </div>
            <div class="min-w-0">
              <p
                class="text-sm font-semibold text-zinc-900 transition-colors group-hover:text-white"
              >
                {{ feature.title }}
              </p>
              <p
                class="mt-1 text-xs leading-relaxed text-zinc-600 transition-colors group-hover:text-primary-100"
              >
                {{ feature.description }}
              </p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
