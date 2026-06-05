<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../../api/index.js";
import DataTable from "../../components/DataTable.vue";
import { formatDate } from "../../utils/format.js";

const router = useRouter();
const courses = ref([]);
const loading = ref(true);
const error = ref("");
const confirmId = ref(null);

function mapRow(c) {
  return {
    ...c,
    deadline_fmt: c.deadline ? formatDate(c.deadline) : "—",
    score_fmt: c.score !== null && c.max_score ? `${c.score} / ${c.max_score}` : "-",
  };
}

async function fetchCourses() {
  loading.value = true;
  try {
    const { data } = await api.get("/api/tests/assigned");
    courses.value = data.map(mapRow);
  } catch {
    error.value = "Nepodarilo sa načítať testy.";
  } finally {
    loading.value = false;
  }
}

function handleEdit(id) {
  const course = courses.value.find((c) => c.id === id);
  if (!course || course.status === "Dokončený") return;
  confirmId.value = id;
}

function cancelConfirm() {
  confirmId.value = null;
}

function startTest() {
  const id = confirmId.value;
  confirmId.value = null;
  router.push(`/user/elearning/take/${id}`);
}

onMounted(fetchCourses);

const columns = [
  { key: "name", label: "Test" },
  { key: "status", label: "Stav" },
  { key: "deadline_fmt", label: "Deadline" },
  { key: "score_fmt", label: "Skóre" },
];
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold text-gray-800">Moje testy</h1>
    </div>

    <p v-if="error" class="text-sm text-red-600 mb-4">{{ error }}</p>

    <DataTable :columns="columns" :rows="courses" :loading="loading" :edit-label="'Pokúsiť sa urobiť test'" :show-delete="false" @edit="handleEdit" />

    <!-- Confirm popup -->
    <div v-if="confirmId" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm space-y-5">
        <h2 class="text-base font-semibold text-gray-800">Naozaj chcete začať test?</h2>
        <p class="text-sm text-gray-500">Po začatí testu budete presmerovaní na stránku s otázkami. Test môžete vyplniť len raz.</p>
        <div class="flex gap-3">
          <button @click="cancelConfirm" class="flex-1 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50">Zrušiť</button>
          <button @click="startTest" class="flex-1 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700">Začať test</button>
        </div>
      </div>
    </div>
  </div>
</template>
