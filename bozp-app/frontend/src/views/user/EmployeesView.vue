<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../../api/index.js";
import DataTable from "../../components/DataTable.vue";
import { formatDate } from "../../utils/format.js";

const router = useRouter();
const employees = ref([]);
const loading = ref(true);
const error = ref("");

const columns = [
  { key: "pid", label: "PID" },
  { key: "full_name", label: "Meno a priezvisko" },
  { key: "email", label: "Email" },
  { key: "role", label: "Rola" },
  { key: "joined", label: "Registrácia" },
];

async function fetchEmployees() {
  loading.value = true;
  try {
    const { data } = await api.get("/api/users/company");
    employees.value = data.map((e) => ({ ...e, joined: formatDate(e.created_at) }));
  } catch (err) {
    error.value = "Nepodarilo sa načítať zamestnancov.";
  } finally {
    loading.value = false;
  }
}

async function handleDelete(id) {
  if (!confirm("Odstrániť tohto zamestnanca?")) return;
  try {
    await api.delete(`/api/users/${id}`);
    await fetchEmployees();
  } catch {
    error.value = "Nepodarilo sa odstrániť zamestnanca.";
  }
}

onMounted(fetchEmployees);
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold text-gray-800">Používatelia</h1>
      <button @click="router.push('/user/employees/new')" class="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700">
        + Pridať používateľa
      </button>
    </div>
    <p v-if="error" class="text-sm text-red-600 mb-4">{{ error }}</p>
    <DataTable :columns="columns" :rows="employees" :loading="loading" :show-edit="false" :delete-label="'Odstrániť'" @delete="handleDelete" />
  </div>
</template>
