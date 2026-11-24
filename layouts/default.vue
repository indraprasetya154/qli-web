<script setup lang="ts">
const runtime = useRuntimeConfig()
const appName = computed(
  () => (runtime.public.appName as string) || 'Qatar Loker Info - Admin Panel'
)
</script>

<template>
  <div class="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
    <header class="border-b border-zinc-200/80 bg-white shadow-sm">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div class="flex items-center gap-2">
          <span class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-sm font-semibold text-white">
            N
          </span>
          <span class="text-sm font-semibold tracking-tight text-zinc-900">
            {{ appName }}
          </span>
        </div>
        <nav class="flex items-center gap-3 text-xs text-zinc-600">
          <NuxtLink to="/dashboard" class="hover:text-zinc-900">
            Dashboard
          </NuxtLink>
        </nav>
      </div>
    </header>

    <main class="mx-auto flex w-full max-w-6xl flex-1 px-4 py-6">
      <slot />
    </main>

    <footer class="border-t border-zinc-200/80 bg-white">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-xs text-zinc-500">
        <span>© {{ new Date().getFullYear() }} {{ appName }}</span>
        <span>Nuxt 4 · Nuxt UI · Tailwind CSS</span>
      </div>
    </footer>
  </div>
</template>
