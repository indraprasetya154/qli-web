<script setup lang="ts">
const runtime = useRuntimeConfig()
const appName = computed(
  () => (runtime.public.appName as string) || 'Qatar Loker Info - Admin Panel'
)

defineProps<{
  title: string
  subtitle: string
}>()
</script>

<template>
  <div class="min-h-dvh bg-[#faf8f4] text-[#1a1919] lg:grid lg:grid-cols-[minmax(0,1fr)_30rem]">
    <aside
      class="hidden flex-col justify-between bg-[#7d002a] p-10 text-[#faf8f4] lg:flex"
    >
      <p class="text-sm font-semibold tracking-tight">
        {{ appName }}
      </p>
      <div class="max-w-sm">
        <p class="text-3xl font-medium leading-[1.3]">
          Kelola data operasional dari satu tempat.
        </p>
        <p class="mt-4 text-sm leading-relaxed text-[#f4e5ea]">
          Masuk untuk membuka dashboard, referensi, dan modul lain di aplikasi.
        </p>
      </div>
      <p class="text-xs text-[#f4e5ea]">
        Akses internal
      </p>
    </aside>

    <main class="flex min-h-dvh items-center justify-center px-4 py-10 sm:px-8">
      <div class="w-full max-w-md">
        <p class="mb-6 text-sm font-semibold tracking-tight text-[#7d002a] lg:hidden">
          {{ appName }}
        </p>

        <div
          class="rounded-lg border border-[#e2e0dc] bg-white p-6 sm:p-8"
        >
          <h1 class="text-2xl font-medium leading-[1.3] text-[#1a1919]">
            {{ title }}
          </h1>
          <p class="mt-2 text-sm leading-relaxed text-[#575654]">
            {{ subtitle }}
          </p>

          <div class="mt-6">
            <slot />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
