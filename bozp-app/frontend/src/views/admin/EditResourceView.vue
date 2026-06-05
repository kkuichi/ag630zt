<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "../../api/index.js";

const router = useRouter();
const route = useRoute();
const id = route.params.id;

const form = ref({ title: "", description: "", url: "", type: "legislation" });
const loading = ref(false);
const fetchLoading = ref(true);
const error = ref("");
const errors = ref({});
const success = ref(false);

function validate() {
  errors.value = {};
  if (!form.value.title.trim()) errors.value.title = "Povinné";
  if (!form.value.url.trim()) errors.value.url = "Povinné";
  if (!form.value.type) errors.value.type = "Povinné";
  return Object.keys(errors.value).length === 0;
}

async function handleSubmit() {
  error.value = "";
  if (!validate()) return;
  loading.value = true;
  try {
    await api.put(`/api/resources/${id}`, form.value);
    success.value = true;
  } catch (e) {
    error.value = e.response?.data?.error || "Nastala chyba.";
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  try {
    const { data } = await api.get(`/api/resources/${id}`);
    form.value = { title: data.title, description: data.description || "", url: data.url, type: data.type };
  } catch {
    error.value = "Materiál sa nepodarilo načítať.";
  } finally {
    fetchLoading.value = false;
  }
});
</script>

<template>
  <div class="max-w-lg">
    <h1 class="text-xl font-semibold text-gray-800 mb-6">Upraviť materiál</h1>

    <div v-if="fetchLoading" class="text-gray-500 text-sm">Načítavam...</div>

    <!-- Success -->
    <div v-else-if="success" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-gray-900">Materiál uložený</p>
          <p class="text-sm text-gray-500">{{ form.title }}</p>
        </div>
      </div>
      <button @click="router.push('/admin/resources')" class="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700">
        Späť na zoznam
      </button>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Názov <span class="text-red-500">*</span></label>
        <input
          v-model="form.title"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-gray-400 focus:outline-none"
        />
        <p v-if="errors.title" class="text-xs text-red-500 mt-1">{{ errors.title }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Typ <span class="text-red-500">*</span></label>
        <select
          v-model="form.type"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-gray-400 focus:outline-none bg-white"
        >
          <option value="legislation">Legislatíva a zákony</option>
          <option value="regulation">Nariadenia a predpisy</option>
          <option value="video">Inštruktážne video</option>
          <option value="other">Ostatné</option>
        </select>
        <p v-if="errors.type" class="text-xs text-red-500 mt-1">{{ errors.type }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">URL odkaz <span class="text-red-500">*</span></label>
        <input
          v-model="form.url"
          type="url"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-gray-400 focus:outline-none"
        />
        <p v-if="errors.url" class="text-xs text-red-500 mt-1">{{ errors.url }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Popis <span class="text-gray-400 font-normal text-xs">(nepovinné)</span></label>
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-gray-400 focus:outline-none resize-none"
        />
      </div>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <div class="flex gap-3">
        <button type="button" @click="router.push('/admin/resources')" class="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50">
          Zrušiť
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="flex-1 py-2.5 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50"
        >
          {{ loading ? "Ukladám..." : "Uložiť zmeny" }}
        </button>
      </div>
    </form>
  </div>
</template>
