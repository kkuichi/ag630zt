<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import api from "../../api/index.js";
import DataTable from "../../components/DataTable.vue";
import { useAuth } from "../../composables/useAuth.js";
import { formatDate } from "../../utils/format.js";

const router = useRouter();
const { getRole } = useAuth();
const isManager = computed(() => getRole() === "manažér");

const courses = ref([]);
const loading = ref(true);
const error = ref("");

const editingId = ref(null);
const editDeadline = ref("");
const saving = ref(false);

const columns = computed(() => {
  const base = [
    { key: "name", label: "Test" },
    { key: "status", label: "Stav" },
    { key: "deadline_fmt", label: "Deadline" },
    { key: "score_fmt", label: "Skóre" },
  ];
  if (isManager.value) base.splice(1, 0, { key: "user_display", label: "Používateľ" });
  return base;
});

function mapRow(c) {
  return {
    ...c,
    deadline_fmt: c.deadline ? formatDate(c.deadline) : "—",
    score_fmt: c.score !== null && c.max_score ? `${c.score} / ${c.max_score}` : "-",
    user_display: c.employee_name ? `${c.employee_name} (${c.employee_role})` : null,
  };
}

async function fetchCourses() {
  loading.value = true;
  try {
    const { data } = await api.get("/api/tests/assigned");
    courses.value = data.map(mapRow);
  } catch {
    error.value = "Nepodarilo sa načítať kurzy.";
  } finally {
    loading.value = false;
  }
}

function openEdit(id) {
  const row = courses.value.find((c) => c.id === id);
  editingId.value = id;
  editDeadline.value = row?.deadline ? row.deadline.split("T")[0] : "";
}

function closeEdit() {
  editingId.value = null;
  editDeadline.value = "";
}

async function handleSaveDeadline() {
  saving.value = true;
  try {
    await api.patch(`/api/tests/assigned/${editingId.value}`, { deadline: editDeadline.value || null });
    closeEdit();
    await fetchCourses();
  } catch {
    error.value = "Nepodarilo sa uložiť zmeny.";
  } finally {
    saving.value = false;
  }
}

async function handleDelete(id) {
  if (!confirm("Odstrániť priradenie kurzu?")) return;
  try {
    await api.delete(`/api/tests/assigned/${id}`);
    await fetchCourses();
  } catch {
    error.value = "Nepodarilo sa odstrániť priradenie.";
  }
}

onMounted(fetchCourses);
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold text-gray-800">Priradané testy</h1>
      <button
        v-if="isManager"
        @click="router.push('/user/elearning/assign')"
        class="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700"
      >
        + Priradiť test
      </button>
    </div>

    <p v-if="error" class="text-sm text-red-600 mb-4">{{ error }}</p>

    <DataTable :columns="columns" :rows="courses" :loading="loading" @edit="openEdit" @delete="handleDelete" />

    <div v-if="editingId" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm space-y-5">
        <h2 class="text-base font-semibold text-gray-800">Zmeniť deadline</h2>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
          <input
            v-model="editDeadline"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:outline-none"
          />
        </div>
        <div class="flex gap-3">
          <button @click="closeEdit" class="flex-1 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50">Zrušiť</button>
          <button
            @click="handleSaveDeadline"
            :disabled="saving"
            class="flex-1 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            {{ saving ? "Ukladám..." : "Uložiť" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
