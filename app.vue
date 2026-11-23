<template>
  <UApp class="min-h-screen">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import logo from '~/assets/images/logo.png'

useHead({
  link: [{ rel: 'icon', type: 'image/png', href: logo }]
})
</script>
