<script setup>
import { ref, onMounted } from "vue";
import api from "../../api/index.js";
import { formatDate } from "../../utils/format.js";

const company = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const res = await api.get("/api/companies/my");
    company.value = res.data;
  } catch (err) {
    error.value = "Nepodarilo sa načítať informácie o spoločnosti.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="max-w-2xl space-y-6">
    <h1 class="text-xl font-semibold text-gray-800">Moja spoločnosť</h1>

    <div v-if="loading" class="text-sm text-gray-400">Načítavanie...</div>

    <div v-if="error" class="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
      {{ error }}
    </div>

    <template v-if="company">
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-5">Informácie o spoločnosti</h2>
        <div class="space-y-4">
          <div class="flex justify-between items-start gap-4 py-3 border-b border-gray-100">
            <span class="text-sm text-gray-500 shrink-0">Názov spoločnosti</span>
            <span class="text-sm font-medium text-gray-900 text-right wrap-break-word min-w-0">{{ company.company_name || "-" }}</span>
          </div>
          <div class="flex justify-between items-start gap-4 py-3 border-b border-gray-100">
            <span class="text-sm text-gray-500 shrink-0">IČO</span>
            <span class="text-sm font-medium text-gray-900 text-right wrap-break-word min-w-0">{{ company.ico || "-" }}</span>
          </div>
          <div class="flex justify-between items-start gap-4 py-3 border-b border-gray-100">
            <span class="text-sm text-gray-500 shrink-0">Adresa</span>
            <span class="text-sm font-medium text-gray-900 text-right wrap-break-word min-w-0">{{ company.address || "-" }}</span>
          </div>
          <div class="flex justify-between items-start gap-4 py-3 border-b border-gray-100">
            <span class="text-sm text-gray-500 shrink-0">Manažér</span>
            <span class="text-sm font-medium text-gray-900 text-right wrap-break-word min-w-0">{{ company.manager_name || "-" }}</span>
          </div>
          <div class="flex justify-between items-start gap-4 py-3 border-b border-gray-100">
            <span class="text-sm text-gray-500 shrink-0">Počet zamestnancov</span>
            <span class="text-sm font-medium text-gray-900 text-right wrap-break-word min-w-0">{{ company.employee_count ?? "-" }}</span>
          </div>
          <div class="flex justify-between items-start gap-4 py-3">
            <span class="text-sm text-gray-500 shrink-0">Registrácia</span>
            <span class="text-sm text-gray-900 text-right min-w-0">{{ formatDate(company.created_at) }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
