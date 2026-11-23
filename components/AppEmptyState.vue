<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Judul singkat di bawah ilustrasi */
    title?: string;
    /** Penjelasan tambahan */
    description?: string;
  }>(),
  {
    title: "",
    description: "",
  },
);
</script>

<template>
  <div
    class="flex flex-col items-center justify-center px-6 py-10 text-center sm:py-12"
    role="status"
  >
    <div
      class="relative mb-6 h-36 w-48 shrink-0 sm:h-40 sm:w-52"
      aria-hidden="true"
    >
      <div
        class="absolute inset-x-2 top-10 h-20 rounded-full bg-primary-500/12 blur-2xl"
      />
      <svg
        class="relative mx-auto h-full w-full drop-shadow-sm"
        viewBox="0 0 220 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="36"
          y="38"
          width="118"
          height="92"
          rx="10"
          class="fill-white stroke-zinc-200"
          stroke-width="2"
        />
        <rect
          x="52"
          y="24"
          width="118"
          height="92"
          rx="10"
          class="fill-zinc-50 stroke-zinc-200/90"
          stroke-width="2"
        />
        <path
          d="M52 44h118M52 60h92M52 76h104M52 92h78"
          class="stroke-zinc-200"
          stroke-width="2.25"
          stroke-linecap="round"
        />
        <rect
          x="68"
          y="10"
          width="118"
          height="92"
          rx="10"
          class="fill-white stroke-zinc-300"
          stroke-width="2"
        />
        <path
          d="M84 34h76M84 50h56M84 66h68M84 82h48"
          class="stroke-zinc-200"
          stroke-width="2"
          stroke-linecap="round"
        />
        <g class="text-primary-500">
          <circle
            cx="158"
            cy="112"
            r="22"
            fill="white"
            stroke="currentColor"
            stroke-width="2.25"
            opacity="0.92"
          />
          <path
            d="M174 128l20 18"
            stroke="currentColor"
            stroke-width="3.5"
            stroke-linecap="round"
            opacity="0.92"
          />
        </g>
        <circle cx="158" cy="112" r="6" class="fill-primary-500/25" />
      </svg>
    </div>

    <p
      v-if="title"
      class="max-w-sm text-sm font-semibold tracking-tight text-zinc-900 sm:text-base"
    >
      {{ title }}
    </p>
    <p
      v-if="description"
      class="max-w-md text-sm leading-relaxed text-zinc-600"
      :class="title ? 'mt-2' : ''"
    >
      {{ description }}
    </p>
    <div v-if="$slots.default" class="mt-5 w-full max-w-sm">
      <slot />
    </div>
  </div>
</template>
