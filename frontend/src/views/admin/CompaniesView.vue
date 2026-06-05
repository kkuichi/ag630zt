<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../../api/index.js";
import DataTable from "../../components/DataTable.vue";
import { formatDate } from "../../utils/format.js";

const router = useRouter();
const companies = ref([]);
const loading = ref(true);

const columns = [
  { key: "company_name", label: "Názov spoločnosti" },
  { key: "ico", label: "IČO" },
  { key: "address", label: "Adresa" },
  { key: "manager_name", label: "Manažér" },
  { key: "created", label: "Dátum vytvorenia" },
];

async function fetchCompanies() {
  loading.value = true;
  const { data } = await api.get("/api/companies");
  companies.value = data.map((c) => ({ ...c, created: formatDate(c.created_at) }));
  loading.value = false;
}

async function handleDelete(id) {
  if (!confirm("Odstrániť túto spoločnosť?")) return;
  await api.delete(`/api/companies/${id}`);
  await fetchCompanies();
}

onMounted(fetchCompanies);
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold text-gray-800">Spoločnosti</h1>
      <button @click="router.push('/admin/companies/add')" class="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700">
        + Pridať spoločnosť
      </button>
    </div>
    <DataTable :columns="columns" :rows="companies" :loading="loading" @delete="handleDelete" :show-edit="false" />
  </div>
</template>
