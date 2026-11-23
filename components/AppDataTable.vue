<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { checkboxUi } from "~/utils/ui";

type SortOrder = "asc" | "desc";

interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  class?: string;
  headerClass?: string;
}

const props = withDefaults(
  defineProps<{
    columns: TableColumn[];
    rows: unknown[];
    keyword: string;
    sortBy: string;
    sortOrder: SortOrder;
    page: number;
    perPage: number;
    from: number;
    to: number;
    total: number;
    hasPrev: boolean;
    hasNext: boolean;
    /** Jika diisi, label halaman menampilkan "Halaman X dari Y". */
    totalPages?: number;
    searchPlaceholder?: string;
    perPageOptions?: number[];
    emptyTitle?: string;
    /** Tambah kolom checkbox + kontrol pilih semua di baris halaman ini. */
    selectable?: boolean;
    /** Kunci unik per baris untuk seleksi (mis. `code`). */
    rowKey?: string;
    /** Jumlah kolom isi body (empty state colspan). Default: panjang `columns`. Pakai saat slot `#thead` tidak sejajar dengan `columns`. */
    bodyColumnCount?: number;
    /** Kelas tambahan pada elemen `<table>` (mis. `table-fixed w-full`). */
    tableClass?: string;
  }>(),
  {
    searchPlaceholder: "Contoh: ketik kode atau nama untuk mencari...",
    perPageOptions: () => [10, 15, 25, 50],
    emptyTitle: "Tidak ada data.",
    selectable: false,
    rowKey: "code",
    bodyColumnCount: undefined,
    tableClass: "",
  },
);

const selectedKeys = defineModel<string[]>("selectedKeys", { default: () => [] });

const pageRowKeys = computed(() =>
  props.rows
    .map((r) => String((r as Record<string, unknown>)[props.rowKey] ?? ""))
    .filter(Boolean),
);

const allPageSelected = computed(
  () =>
    pageRowKeys.value.length > 0 &&
    pageRowKeys.value.every((k) => selectedKeys.value.includes(k)),
);

const somePageSelected = computed(() =>
  pageRowKeys.value.some((k) => selectedKeys.value.includes(k)),
);

function toggleSelectAll(checked: boolean) {
  if (checked) {
    const set = new Set([...selectedKeys.value, ...pageRowKeys.value]);
    selectedKeys.value = [...set];
    return;
  }
  selectedKeys.value = selectedKeys.value.filter((k) => !pageRowKeys.value.includes(k));
}

const emit = defineEmits<{
  "update:keyword": [value: string];
  "update:sortBy": [value: string];
  "update:sortOrder": [value: SortOrder];
  "update:page": [value: number];
  "update:perPage": [value: number];
}>();

const localKeyword = ref(props.keyword);
let keywordDebounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(
  () => props.keyword,
  (value) => {
    localKeyword.value = value;
  },
);

watch(localKeyword, (value) => {
  if (keywordDebounceTimer) clearTimeout(keywordDebounceTimer);
  keywordDebounceTimer = setTimeout(() => {
    emit("update:keyword", value);
  }, 350);
});

onBeforeUnmount(() => {
  if (keywordDebounceTimer) clearTimeout(keywordDebounceTimer);
});

function toggleSort(key: string) {
  if (props.sortBy !== key) {
    emit("update:sortBy", key);
    emit("update:sortOrder", "asc");
    return;
  }

  if (props.sortOrder === "asc") {
    emit("update:sortOrder", "desc");
    return;
  }

  emit("update:sortBy", "");
  emit("update:sortOrder", "asc");
}

function sortIcon(column: TableColumn): string {
  if (!column.sortable) return "";
  if (props.sortBy !== column.key) return "i-lucide-arrow-up-down";
  return props.sortOrder === "asc"
    ? "i-lucide-arrow-up"
    : "i-lucide-arrow-down";
}

function prevPage() {
  if (!props.hasPrev) return;
  emit("update:page", props.page - 1);
}

function nextPage() {
  if (!props.hasNext) return;
  emit("update:page", props.page + 1);
}

function onPerPageChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit("update:perPage", Number(target.value));
}

const resolvedBodyColumnCount = computed(() => {
  const n = props.bodyColumnCount;
  if (typeof n === "number" && n > 0) return n;
  return props.columns.length;
});

const emptyColspan = computed(
  () => resolvedBodyColumnCount.value + (props.selectable ? 1 : 0),
);

const tableClassMerged = computed(() =>
  ["min-w-full text-left text-sm text-zinc-800", props.tableClass?.trim() ?? ""]
    .filter(Boolean)
    .join(" "),
);
</script>

<template>
  <div class="space-y-3 p-4 sm:p-5">
    <div
      class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
    >
      <UInput
        v-model="localKeyword"
        icon="i-lucide-search"
        :placeholder="searchPlaceholder"
        class="w-full sm:max-w-sm"
        :ui="formInputUi"
      />
      <div class="flex items-center gap-2">
        <span class="text-xs text-zinc-600">Baris per halaman</span>
        <select
          :value="perPage"
          class="w-24 rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-800"
          @change="onPerPageChange"
        >
          <option
            v-for="option in perPageOptions"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
      </div>
    </div>

    <slot name="filters" />

    <div class="overflow-x-auto">
      <table :class="tableClassMerged">
        <slot name="colgroup" />
        <thead
          class="border-b border-zinc-200 bg-zinc-50/80 text-xs font-semibold uppercase tracking-wide text-zinc-600"
        >
          <slot name="thead">
            <tr>
              <th
                v-if="selectable"
                class="w-12 px-4 py-3 sm:px-5"
                scope="col"
              >
                <UCheckbox
                  :model-value="allPageSelected"
                  :indeterminate="somePageSelected && !allPageSelected"
                  aria-label="Pilih semua di halaman ini"
                  :ui="checkboxUi"
                  @update:model-value="toggleSelectAll(Boolean($event))"
                />
              </th>
              <th
                v-for="column in columns"
                :key="column.key"
                class="px-4 py-3 sm:px-5"
                :class="column.headerClass"
              >
                <button
                  v-if="column.sortable"
                  type="button"
                  class="inline-flex items-center gap-1 rounded px-1 py-0.5 transition-colors hover:bg-zinc-100"
                  @click="toggleSort(column.key)"
                >
                  <span>{{ column.label }}</span>
                  <UIcon :name="sortIcon(column)" class="h-3.5 w-3.5" />
                </button>
                <span v-else>{{ column.label }}</span>
              </th>
            </tr>
          </slot>
        </thead>
        <tbody class="divide-y divide-zinc-100">
          <tr v-if="rows.length === 0">
            <td
              :colspan="emptyColspan"
              class="px-4 py-10 text-center text-sm text-zinc-500"
            >
              {{ emptyTitle }}
            </td>
          </tr>
          <slot v-else name="rows" />
        </tbody>
      </table>
    </div>

    <div
      class="flex flex-col gap-3 border-t border-zinc-100 pt-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p class="text-xs text-zinc-600 sm:text-sm">
        Menampilkan {{ from }}-{{ to }} dari {{ total }}
      </p>
      <div class="flex items-center gap-2">
        <UButton
          size="sm"
          color="neutral"
          variant="outline"
          :disabled="!hasPrev"
          @click="prevPage"
        >
          Sebelumnya
        </UButton>
        <span class="text-xs text-zinc-600 sm:text-sm">
          <template
            v-if="totalPages != null && totalPages > 0 && page <= totalPages"
          >
            Halaman {{ page }} dari {{ totalPages }}
          </template>
          <template v-else>Halaman {{ page }}</template>
        </span>
        <UButton
          size="sm"
          color="neutral"
          variant="outline"
          :disabled="!hasNext"
          @click="nextPage"
        >
          Berikutnya
        </UButton>
      </div>
    </div>
  </div>
</template>
