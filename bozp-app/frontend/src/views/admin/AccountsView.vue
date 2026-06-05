<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../../api/index.js";
import DataTable from "../../components/DataTable.vue";
import { formatDate } from "../../utils/format.js";

const router = useRouter();
const accounts = ref([]);
const loading = ref(true);

const columns = [
  { key: "pid", label: "PID" },
  { key: "full_name", label: "Meno a priezvisko" },
  { key: "email", label: "Email" },
  { key: "role", label: "Rola" },
  { key: "company_name", label: "Názov spoločnosti" },
  { key: "created", label: "Dátum vytvorenia" },
];

async function fetchAccounts() {
  loading.value = true;
  const { data } = await api.get("/api/users");
  accounts.value = data.map((a) => ({ ...a, created: formatDate(a.created_at) }));
  loading.value = false;
}

async function handleDelete(id) {
  if (!confirm("Odstrániť tohto používateľa?")) return;
  await api.delete(`/api/users/${id}`);
  await fetchAccounts();
}

onMounted(fetchAccounts);
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold text-gray-800">Účty</h1>
      <button @click="router.push('/admin/accounts/add')" class="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700">
        + Pridať používateľa
      </button>
    </div>

    <DataTable :columns="columns" :rows="accounts" :loading="loading" @delete="handleDelete" :show-edit="false" />
  </div>
</template>
