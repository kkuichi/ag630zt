<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../../api/index.js";
import DataTable from "../../components/DataTable.vue";
import { formatDate } from "../../utils/format.js";

const router = useRouter();
const resources = ref([]);
const loading = ref(true);

const typeLabels = {
  legislation: "Legislatíva",
  regulation: "Nariadenie",
  video: "Video",
  other: "Ostatné",
};

const columns = [
  { key: "title", label: "Názov" },
  { key: "type_label", label: "Typ" },
  { key: "description", label: "Popis" },
  { key: "created", label: "Dátum pridania" },
];

async function fetchResources() {
  loading.value = true;
  const { data } = await api.get("/api/resources");
  resources.value = data.map((r) => ({
    ...r,
    type_label: typeLabels[r.type] || r.type,
    created: formatDate(r.created_at),
  }));
  loading.value = false;
}

function handleEdit(id) {
  router.push(`/admin/resources/edit/${id}`);
}

async function handleDelete(id) {
  if (!confirm("Odstrániť tento materiál?")) return;
  await api.delete(`/api/resources/${id}`);
  await fetchResources();
}

onMounted(fetchResources);
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold text-gray-800">Učebné materiály</h1>
      <button @click="router.push('/admin/resources/add')" class="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700">
        + Pridať materiál
      </button>
    </div>
    <DataTable :columns="columns" :rows="resources" :loading="loading" @edit="handleEdit" @delete="handleDelete" />
  </div>
</template>
