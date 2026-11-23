<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import logoSrc from "~/assets/images/logo.png";

const runtime = useRuntimeConfig();
const { isLoggedIn, homePath } = useAuth();

const appName = computed(
  () => (runtime.public.appName as string) || "Qatar Loker Info",
);

const navItems = [
  { label: "Beranda", to: "/" },
  { label: "Tentang Kami", to: "/#tentang" },
  { label: "Paket", to: "/packages" },
  { label: "Layanan", to: "/#layanan" },
  { label: "FAQ", to: "/#faq" },
];

const mobileOpen = ref(false);
const headerScrolled = ref(false);

const instagramUrl = "https://www.instagram.com/qatarlokerinfo/";

function onScroll() {
  headerScrolled.value = window.scrollY > 8;
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    mobileOpen.value = false;
  }
}

onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("keydown", onKeydown);
});

watch(mobileOpen, (open) => {
  if (open) {
    window.addEventListener("keydown", onKeydown);
  } else {
    window.removeEventListener("keydown", onKeydown);
  }
});
</script>

<template>
  <div class="flex min-h-screen flex-col bg-[#faf8f4] text-[#1a1919]">
    <header
      class="public-header sticky top-0 z-40 border-b border-[#e2e0dc] bg-white"
      :class="{ 'is-scrolled': headerScrolled }"
    >
      <div class="public-container flex h-16 items-center justify-between gap-6 lg:h-[72px]">
        <NuxtLink to="/" class="flex shrink-0 items-center gap-2.5">
          <img :src="logoSrc" :alt="appName" class="h-9 w-auto" />
          <span class="text-sm font-semibold tracking-tight text-[#1a1919] sm:text-base">
            {{ appName }}
          </span>
        </NuxtLink>

        <nav class="hidden items-center gap-7 text-sm font-medium text-[#575654] lg:flex">
          <a
            v-for="item in navItems"
            :key="item.to"
            :href="item.to"
            class="transition-colors hover:text-accent-500"
          >
            {{ item.label }}
          </a>
        </nav>

        <div class="hidden items-center gap-3 lg:flex">
          <UButton
            v-if="isLoggedIn"
            :to="homePath"
            color="neutral"
            variant="ghost"
            size="lg"
          >
            Dasbor
          </UButton>
          <UButton
            v-else
            to="/login"
            color="neutral"
            variant="ghost"
            size="lg"
          >
            Masuk
          </UButton>
          <UButton to="/packages" color="primary" size="lg" class="font-semibold">
            Lihat Paket
          </UButton>
        </div>

        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#e2e0dc] text-[#1a1919] lg:hidden"
          :aria-label="mobileOpen ? 'Tutup menu' : 'Buka menu'"
          aria-controls="public-mobile-menu"
          :aria-expanded="mobileOpen"
          @click="mobileOpen = !mobileOpen"
        >
          <UIcon
            :name="mobileOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
            class="h-5 w-5"
          />
        </button>
      </div>

      <Transition name="menu">
        <div
          v-show="mobileOpen"
          id="public-mobile-menu"
          class="brand-shadow-lg absolute inset-x-0 top-full max-h-[calc(100svh-4rem)] overflow-y-auto border-b border-[#e2e0dc] bg-white lg:hidden"
        >
          <nav class="public-container flex flex-col gap-1 py-4">
            <a
              v-for="item in navItems"
              :key="item.to"
              :href="item.to"
              class="rounded-lg px-3 py-3 text-sm font-medium text-[#1a1919] hover:bg-brand-50"
              @click="mobileOpen = false"
            >
              {{ item.label }}
            </a>
            <div class="mt-3 flex flex-col gap-2 border-t border-[#e2e0dc] pt-4">
              <UButton
                :to="isLoggedIn ? homePath : '/login'"
                color="neutral"
                variant="outline"
                size="lg"
                block
                @click="mobileOpen = false"
              >
                {{ isLoggedIn ? "Dasbor" : "Masuk" }}
              </UButton>
              <UButton
                to="/packages"
                color="primary"
                size="lg"
                block
                class="font-semibold"
                @click="mobileOpen = false"
              >
                Lihat Paket
              </UButton>
            </div>
          </nav>
        </div>
      </Transition>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-[#e2e0dc] bg-[#faf8f4] text-[#575654]">
      <div class="public-container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div class="space-y-4">
          <div class="flex items-center gap-2.5">
            <img :src="logoSrc" :alt="appName" class="h-9 w-auto" />
            <span class="text-base font-semibold text-[#1a1919]">{{ appName }}</span>
          </div>
          <p class="max-w-xs text-sm leading-relaxed">
            Platform konsultasi dan pendampingan persiapan kerja ke Qatar.
            Informasi, layanan, dan progres dalam satu tempat.
          </p>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-[#7d002a]">Navigasi</h3>
          <ul class="mt-4 space-y-2.5 text-sm">
            <li><a href="/" class="hover:text-accent-500">Beranda</a></li>
            <li><a href="/#tentang" class="hover:text-accent-500">Tentang Kami</a></li>
            <li><a href="/#faq" class="hover:text-accent-500">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-[#7d002a]">Layanan</h3>
          <ul class="mt-4 space-y-2.5 text-sm">
            <li><a href="/#layanan" class="hover:text-accent-500">CV Review</a></li>
            <li><a href="/#layanan" class="hover:text-accent-500">Practice Interview</a></li>
            <li><a href="/#layanan" class="hover:text-accent-500">Application Assistance</a></li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-[#7d002a]">Hubungi Kami</h3>
          <ul class="mt-4 space-y-2.5 text-sm">
            <li>
              <a :href="instagramUrl" target="_blank" rel="noopener" class="hover:text-accent-500">
                Instagram @qatarlokerinfo
              </a>
            </li>
            <li><a href="/register" class="hover:text-accent-500">Daftar sebagai klien</a></li>
            <li><a href="/login" class="hover:text-accent-500">Masuk ke portal klien</a></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-[#e2e0dc]">
        <div class="public-container flex flex-col gap-2 py-5 text-xs text-[#575654] sm:flex-row sm:items-center sm:justify-between">
          <span>© {{ new Date().getFullYear() }} {{ appName }}. Seluruh hak cipta dilindungi.</span>
          <span>Bukan perusahaan penempatan kerja. Keputusan akhir berada pada pemberi kerja.</span>
        </div>
      </div>
    </footer>
  </div>
</template>
