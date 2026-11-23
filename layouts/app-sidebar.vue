<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import logoSrc from "~/assets/images/logo.png";

const route = useRoute();
const runtime = useRuntimeConfig();
const { clearBreadcrumbs } = useAppLayout();
const { user, displayName, initials, logout, isAdmin, isClient, homePath } =
  useAuth();

const appName = computed(
  () => (runtime.public.appName as string) || "Qatar Loker Info - Admin Panel",
);

const userMenuItems = [
  [
    {
      label: "Keluar",
      icon: "i-heroicons-arrow-right-on-rectangle",
      onSelect: () => {
        void logout();
      },
    },
  ],
];

type NavItem = {
  to: string;
  label: string;
  /** Teks singkat di sidebar tertutup (satu baris); hindari label panjang terpotong aneh. */
  railLabel?: string;
  icon: string;
  match: (path: string) => boolean;
};

function railMenuText(item: NavItem) {
  return item.railLabel ?? item.label;
}

const navSections = computed<{ title: string; items: NavItem[] }[]>(() => {
  if (isClient.value) {
    return [
      {
        title: "Akun",
        items: [
          {
            to: "/client",
            label: "Profil Saya",
            icon: "i-heroicons-user",
            match: (path: string) => path === "/client",
          },
          {
            to: "/client/cv",
            label: "CV Saya",
            icon: "i-heroicons-document-text",
            match: (path: string) => path === "/client/cv",
          },
          {
            to: "/client/offers",
            label: "Penawaran Saya",
            icon: "i-heroicons-document-currency-dollar",
            match: (path: string) => path.startsWith("/client/offers"),
          },
          {
            to: "/client/orders",
            label: "Pesanan Saya",
            icon: "i-heroicons-clipboard-document-list",
            match: (path: string) => path.startsWith("/client/orders"),
          },
        ],
      },
      {
        title: "Layanan",
        items: [
          {
            to: "/packages",
            label: "Lihat Layanan",
            icon: "i-heroicons-briefcase",
            match: (path: string) => path.startsWith("/packages"),
          },
        ],
      },
    ];
  }

  return [
    {
      title: "Menu",
      items: [
        {
          to: "/dashboard",
          label: "Beranda",
          icon: "i-heroicons-squares-2x2",
          match: (path: string) => path === "/dashboard",
        },
      ],
    },
    ...(isAdmin.value
      ? [
          {
            title: "Client Management",
            items: [
              {
                to: "/clients",
                label: "Client List",
                icon: "i-heroicons-users",
                match: (path: string) =>
                  path === "/clients" ||
                  (path.startsWith("/clients/") &&
                    path !== "/clients/create"),
              },
              {
                to: "/clients/create",
                label: "Add Client",
                icon: "i-heroicons-user-plus",
                match: (path: string) => path === "/clients/create",
              },
            ],
          },
        ]
      : []),
    {
      title: "Referensi",
      items: [
        {
          to: "/reference/category",
          label: "Kategori",
          icon: "i-heroicons-tag",
          match: (path: string) => path.startsWith("/reference/category"),
        },
      ],
    },
  ];
});

function navItemClass(item: NavItem) {
  const active = item.match(route.path);
  return active
    ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/90"
    : "text-zinc-700 hover:bg-zinc-200/70 hover:text-zinc-900";
}

onUnmounted(() => {
  clearBreadcrumbs();
});

const isSidebarCollapsed = ref(false);
const isSidebarOpen = ref(false);
const isDesktop = ref(true);
const isSidebarRail = computed(
  () => isDesktop.value && isSidebarCollapsed.value,
);
let mediaQuery: MediaQueryList | null = null;

function syncSidebarWithViewport() {
  if (!mediaQuery) return;
  isDesktop.value = mediaQuery.matches;
  if (isDesktop.value) {
    isSidebarOpen.value = false;
  } else {
    isSidebarCollapsed.value = false;
  }
}

function toggleSidebar() {
  if (isDesktop.value) {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
    return;
  }
  isSidebarOpen.value = !isSidebarOpen.value;
}

onMounted(() => {
  mediaQuery = window.matchMedia("(min-width: 1024px)");
  syncSidebarWithViewport();
  mediaQuery.addEventListener("change", syncSidebarWithViewport);
});

onUnmounted(() => {
  mediaQuery?.removeEventListener("change", syncSidebarWithViewport);
});
</script>

<template>
  <div class="flex h-dvh min-h-0 flex-col bg-[#FAFAFA]">
    <header
      class="relative z-30 flex h-14 shrink-0 items-center gap-2 border-b border-zinc-200/70 bg-[#FAFAFA] px-3 sm:gap-3 sm:px-4"
    >
      <UButton
        color="primary"
        variant="ghost"
        size="sm"
        square
        :aria-label="
          isDesktop
            ? isSidebarCollapsed
              ? 'Tampilkan sidebar'
              : 'Sembunyikan sidebar'
            : isSidebarOpen
              ? 'Tutup sidebar'
              : 'Buka sidebar'
        "
        @click="toggleSidebar"
      >
        <UIcon name="i-heroicons-bars-3-20-solid" class="size-5" />
      </UButton>

      <NuxtLink
        :to="homePath"
        class="flex min-w-0 flex-1 items-center gap-2 no-underline"
      >
        <img
          :src="logoSrc"
          :alt="appName"
          width="32"
          height="32"
          class="size-8 shrink-0 rounded-md bg-white object-contain p-0.5 ring-1 ring-zinc-200"
          decoding="async"
        />
        <span class="min-w-0 flex-1 truncate text-sm font-semibold text-zinc-900">
          {{ appName }}
        </span>
      </NuxtLink>

      <div class="ml-auto flex shrink-0 items-center gap-2">
        <UDropdownMenu
          :items="userMenuItems"
          :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
        >
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            class="gap-2 rounded-lg"
            :aria-label="`Menu pengguna ${displayName}`"
          >
            <UAvatar
              size="sm"
              :text="initials"
              :alt="displayName"
              :ui="{ root: 'bg-zinc-200 ring-1 ring-zinc-300 text-zinc-700' }"
            />
            <span class="hidden text-left sm:block">
              <span class="block max-w-[10rem] truncate text-sm font-medium text-zinc-900">
                {{ displayName }}
              </span>
              <span class="block max-w-[10rem] truncate text-[10px] text-zinc-500">
                {{ user?.email }}
              </span>
            </span>
            <UIcon
              name="i-heroicons-chevron-up-down-20-solid"
              class="hidden size-4 shrink-0 text-zinc-400 sm:block"
            />
          </UButton>
        </UDropdownMenu>
      </div>
    </header>

    <UDashboardGroup
      unit="px"
      storage-key="app-sidebar-layout"
      class="min-h-0 flex-1"
      :ui="{
        /* Tema default memakai fixed inset-0; pakai flow normal di bawah header */
        base: 'relative z-0 flex min-h-0 flex-1 overflow-hidden',
      }"
    >
      <UDashboardSidebar
        id="app-main"
        v-model:open="isSidebarOpen"
        v-model:collapsed="isSidebarCollapsed"
        class="app-sidebar-shell"
        collapsible
        :collapsed-size="96"
        :resizable="false"
        :min-size="300"
        :default-size="300"
        :max-size="300"
        :menu="{ overlay: false }"
        :ui="{
          root: 'h-full !min-h-0 overflow-hidden border-e border-zinc-200/70 bg-[#FAFAFA] text-zinc-900 transition-[width,transform,opacity] duration-300 ease-in-out will-change-[width,transform,opacity] data-[collapsed=true]:opacity-100',
          content:
            'app-mobile-sidebar-content shadow-none ring-0 sm:shadow-none sm:ring-0',
          body: 'min-h-0 flex-1 gap-0 overflow-y-auto bg-[#FAFAFA] py-3',
        }"
      >
        <div
          class="flex flex-col"
          :class="isSidebarRail ? 'w-full gap-3 pt-1' : 'gap-6'"
        >
          <div
            v-for="section in navSections"
            :key="section.title"
            :class="isSidebarRail ? 'flex w-full min-w-0 flex-col items-stretch' : ''"
          >
            <p
              v-if="!isSidebarRail"
              class="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500"
            >
              {{ section.title }}
            </p>
            <nav
              class="flex flex-col gap-0.5"
              :class="isSidebarRail ? 'w-full min-w-0 items-stretch px-1' : ''"
              :aria-label="section.title"
            >
              <NuxtLink
                v-for="item in section.items"
                :key="item.to"
                :to="item.to"
                :title="item.label"
                class="flex min-w-0 gap-2 rounded-md text-sm font-medium no-underline transition-colors"
                :class="[
                  navItemClass(item),
                  isSidebarRail
                    ? 'h-[4.5rem] w-full max-w-full shrink-0 flex-col items-center justify-center gap-1 self-stretch rounded-xl px-1 py-0 text-center'
                    : 'h-14 w-full shrink-0 items-center px-2',
                ]"
              >
                <UIcon :name="item.icon" class="size-5 shrink-0 opacity-90" />
                <span
                  v-if="!isSidebarRail"
                  class="min-w-0 flex-1 text-inherit leading-snug line-clamp-2"
                  >{{ item.label }}</span
                >
                <span
                  v-else
                  class="block w-full min-w-0 max-w-full truncate px-0.5 text-center text-[10px] font-medium leading-none text-inherit"
                >
                  {{ railMenuText(item) }}
                </span>
              </NuxtLink>
            </nav>
          </div>
        </div>
      </UDashboardSidebar>

      <UDashboardPanel
        :ui="{
          root: '!min-h-0 min-h-0 flex-1 bg-[#FAFAFA]',
          body: 'min-h-0 flex-1 flex-col gap-4 overflow-y-auto bg-white p-4 sm:gap-6 sm:p-6',
        }"
      >
        <template #body>
          <div class="min-h-0 flex-1">
            <slot />
          </div>
        </template>
      </UDashboardPanel>
    </UDashboardGroup>
  </div>
</template>
