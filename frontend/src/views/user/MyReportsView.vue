<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../../api/index.js";
import DataTable from "../../components/DataTable.vue";
import { formatDate } from "../../utils/format.js";

const router = useRouter();
const reports = ref([]);
const loading = ref(true);
const error = ref("");

const columns = [
  { key: "title", label: "Názov" },
  { key: "location", label: "Poloha" },
  { key: "severity", label: "Závažnosť" },
  { key: "status", label: "Stav" },
  { key: "reported_by_name", label: "Nahlásil" },
  { key: "occurred", label: "Dátum" },
];

const statusOrder = { Vytvorený: 0, Priradený: 1, Vyriešený: 2 };

onMounted(async () => {
  try {
    const { data } = await api.get("/api/reports/my");
    reports.value = data
      .map((r) => ({ ...r, occurred: formatDate(r.occurred_at) }))
      .sort((a, b) => {
        const statusDiff = (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0);
        if (statusDiff !== 0) return statusDiff;
        return new Date(b.occurred_at) - new Date(a.occurred_at);
      });
  } catch {
    error.value = "Nepodarilo sa načítať záznamy.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold text-gray-800">Moje incidenty</h1>
    </div>
    <p v-if="error" class="text-sm text-red-600 mb-4">{{ error }}</p>
    <DataTable
      :columns="columns"
      :rows="reports"
      :loading="loading"
      @edit="(id) => router.push(`/user/reports/${id}`)"
      :edit-label="'Detail'"
      :show-delete="false"
    />
  </div>
</template>
