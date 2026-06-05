<script setup>
defineProps({ to: String, icon: String, label: String });
</script>

<template>
  <router-link
    :to="to"
    class="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
    exact-active-class="bg-gray-700 text-white"
  >
    <span class="w-4 text-center">{{ icon }}</span>
    {{ label }}
  </router-link>
</template>
