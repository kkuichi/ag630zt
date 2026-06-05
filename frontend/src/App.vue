<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isAdminRoute = computed(() => route.path.startsWith("/admin"));
const isUserRoute = computed(() => route.path.startsWith("/user"));
</script>

<template>
  <div v-if="isAdminRoute" class="min-h-screen">
    <router-view />
  </div>
  <div v-else-if="isUserRoute" class="min-h-screen">
    <router-view />
  </div>
  <div v-else class="min-h-screen flex flex-col bg-gray-50">
    <header class="bg-white shadow-sm">
      <nav class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" class="flex items-center gap-2">
          <img src="/images/icon-192.png" alt="BOZP logo" class="w-8 h-8 rounded-md" />
          <span class="text-xl font-semibold text-gray-800">BOZP</span>
        </a>
        <div class="flex gap-6">
          <router-link to="/login" class="text-gray-600 hover:text-gray-900">Prihlásenie</router-link>
        </div>
      </nav>
    </header>

    <main class="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
      <router-view />
    </main>

    <footer class="bg-gray-200 py-6 mt-auto">
      <div class="max-w-6xl mx-auto px-4 text-center text-gray-600 text-sm">© 2026 BOZP. Všetky práva vyhradené.</div>
    </footer>
  </div>
</template>

