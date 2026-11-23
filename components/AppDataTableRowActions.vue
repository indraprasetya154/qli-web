<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import {
  dataTableRowActionIcon,
  dataTableRowActionMenuContent,
  dataTableRowActionMenuUi,
  dataTableRowActionTriggerButtonUi,
} from "~/utils/ui";

defineProps<{
  items: DropdownMenuItem[][];
  /** Teks untuk pembaca layar, mis. \"Aksi untuk baris kategori CAT-001\" */
  actionAriaLabel: string;
}>();
</script>

<template>
  <div class="inline-flex justify-end" @click.stop>
    <UDropdownMenu
      :items="items"
      :content="dataTableRowActionMenuContent"
      :ui="dataTableRowActionMenuUi"
    >
      <UButton
        type="button"
        color="neutral"
        variant="ghost"
        size="xs"
        square
        :icon="dataTableRowActionIcon"
        :aria-label="actionAriaLabel"
        :ui="dataTableRowActionTriggerButtonUi"
        @click.stop
      />
    </UDropdownMenu>
  </div>
</template>
