<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../../api/index.js";

const resources = ref([]);
const loading = ref(true);
const error = ref("");

const typeConfig = {
  legislation: {
    label: "Legislatíva a zákony",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`,
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    iconBg: "bg-blue-100 text-blue-600",
  },
  regulation: {
    label: "Nariadenia a predpisy",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>`,
    color: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    iconBg: "bg-amber-100 text-amber-600",
  },
  video: {
    label: "Inštruktážne videá",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    iconBg: "bg-red-100 text-red-600",
  },
  other: {
    label: "Ostatné materiály",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>`,
    color: "bg-gray-50 border-gray-200",
    badge: "bg-gray-100 text-gray-700",
    iconBg: "bg-gray-100 text-gray-600",
  },
};

const typeOrder = ["legislation", "regulation", "video", "other"];

const grouped = computed(() => {
  return typeOrder
    .map((type) => ({
      type,
      config: typeConfig[type],
      items: resources.value.filter((r) => r.type === type),
    }))
    .filter((g) => g.items.length > 0);
});

onMounted(async () => {
  try {
    const res = await api.get("/api/resources");
    resources.value = res.data;
  } catch (err) {
    error.value = "Nepodarilo sa načítať materiály.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Učebné materiály</h1>
      <p class="text-sm text-gray-500 mt-1">Legislatíva, predpisy a inštruktážne videá k BOZP</p>
    </div>

    <div v-if="loading" class="text-gray-500 text-sm">Načítavam...</div>

    <div v-else-if="error" class="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
      {{ error }}
    </div>

    <div v-else-if="grouped.length === 0" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <div class="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
      <p class="text-gray-500 font-medium">Žiadne materiály</p>
      <p class="text-gray-400 text-sm mt-1">Momentálne tu nie sú žiadne výukové materiály.</p>
    </div>

    <div v-else class="space-y-8">
      <div v-for="group in grouped" :key="group.type">
        <div class="flex items-center gap-2 mb-3">
          <div :class="[group.config.iconBg, 'w-8 h-8 rounded-lg flex items-center justify-center shrink-0']" v-html="group.config.icon"></div>
          <h2 class="text-base font-semibold text-gray-700">{{ group.config.label }}</h2>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <a
            v-for="item in group.items"
            :key="item.id"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            :class="[group.config.color, 'border rounded-xl p-4 flex flex-col gap-2 hover:shadow-md transition-shadow group']"
          >
            <div class="flex items-start justify-between gap-2">
              <span class="font-medium text-gray-800 text-sm group-hover:text-blue-700 transition-colors leading-snug">{{ item.title }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 text-gray-400 shrink-0 mt-0.5 group-hover:text-blue-500 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </div>
            <p v-if="item.description" class="text-xs text-gray-500 leading-relaxed line-clamp-2">{{ item.description }}</p>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
