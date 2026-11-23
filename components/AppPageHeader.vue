<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    description?: string;
    iconName?: string;
    containerClass?: string;
    titleClass?: string;
    descriptionClass?: string;
    actionsClass?: string;
  }>(),
  {
    description: "",
    iconName: "",
    containerClass: "",
    titleClass: "text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl",
    descriptionClass: "mt-1 text-sm text-zinc-600",
    actionsClass: "flex w-full items-center justify-end gap-2 sm:w-auto",
  },
);
</script>

<template>
  <section
    class="relative overflow-hidden rounded-2xl border border-zinc-200/90 bg-white p-5 sm:p-6"
  >
    <div
      v-if="iconName"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 opacity-80"
    />
    <div
      class="relative z-10 flex flex-col gap-3 sm:flex-row sm:justify-between"
      :class="containerClass"
    >
      <div v-if="iconName" class="pointer-events-none absolute -top-15 -left-15">
        <UIcon :name="iconName" class="size-30 opacity-3" />
      </div>
      <div class="self-start">
        <h1 :class="titleClass">{{ title }}</h1>
        <p v-if="$slots.description || description" :class="descriptionClass">
          <slot name="description">
            {{ description }}
          </slot>
        </p>
      </div>
      <div v-if="$slots.actions" :class="actionsClass">
        <slot name="actions" />
      </div>
    </div>
  </section>
</template>
