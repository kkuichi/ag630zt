<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "../../api/index.js";
import { useAuth } from "../../composables/useAuth.js";
import { formatDate } from "../../utils/format.js";

const router = useRouter();
const route = useRoute();
const { getRole, getUserId } = useAuth();

const id = route.params.id;
const report = ref(null);
const employees = ref([]);
const loading = ref(true);
const error = ref("");
const assignedTo = ref(null);
const assigning = ref(false);
const assignSuccess = ref(false);
const marking = ref(false);
const resolutionNote = ref("");

const isManager = computed(() => getRole() === "manažér");

const canMarkDone = computed(() => {
  if (!report.value) return false;
  if (report.value.status === "Vyriešený") return false;
  if (isManager.value) return true;
  return report.value.assigned_to === getUserId();
});

const severityClass = {
  Nízka: "bg-green-100 text-green-700",
  Stredná: "bg-yellow-100 text-yellow-700",
  Vysoká: "bg-orange-100 text-orange-700",
  Kritická: "bg-red-100 text-red-700",
};

const statusClass = {
  Vytvorený: "bg-blue-100 text-blue-700",
  Priradený: "bg-yellow-100 text-yellow-700",
  Vyriešený: "bg-green-100 text-green-700",
};

async function handleMarkDone() {
  marking.value = true;
  try {
    await api.patch(`/api/reports/${id}/done`, { resolutionNote: resolutionNote.value });
    report.value.status = "Vyriešený";
    report.value.resolution_note = resolutionNote.value || null;
  } catch {
    error.value = "Nepodarilo sa označiť záznam ako vyriešený.";
  } finally {
    marking.value = false;
  }
}

async function handleAssign() {
  if (!assignedTo.value) return;
  assigning.value = true;
  assignSuccess.value = false;
  try {
    await api.patch(`/api/reports/${id}/assign`, { assignedTo: assignedTo.value });
    const emp = employees.value.find((e) => e.id === Number(assignedTo.value));
    report.value.assigned_to_name = emp?.full_name || "";
    report.value.status = "Priradený";
    assignSuccess.value = true;
  } catch {
    error.value = "Nepodarilo sa priradiť zamestnanca.";
  } finally {
    assigning.value = false;
  }
}

onMounted(async () => {
  try {
    const { data } = await api.get(`/api/reports/${id}`);
    report.value = data;
    assignedTo.value = data.assigned_to || null;

    if (isManager.value) {
      const empRes = await api.get("/api/users/company");
      employees.value = empRes.data.filter((u) => u.role === "zamestnanec");
    }
  } catch {
    error.value = "Nepodarilo sa načítať záznam.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="max-w-2xl space-y-6">
    <div class="flex items-center gap-3">
      <button @click="router.push('/user/reports')" class="text-sm text-gray-500 hover:text-gray-700">← Späť</button>
      <h1 class="text-xl font-semibold text-gray-800">Detail záznamu</h1>
    </div>

    <div v-if="loading" class="text-sm text-gray-400">Načítavanie...</div>
    <div v-if="error" class="text-sm text-red-600">{{ error }}</div>

    <template v-if="report">
      <!-- Report info -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div class="flex items-start justify-between mb-5">
          <h2 class="text-base font-semibold text-gray-900">{{ report.title }}</h2>
          <div class="flex gap-2">
            <span :class="severityClass[report.severity] || 'bg-gray-100 text-gray-600'" class="px-2 py-1 rounded-full text-xs font-medium">
              {{ report.severity }}
            </span>
            <span :class="statusClass[report.status] || 'bg-gray-100 text-gray-600'" class="px-2 py-1 rounded-full text-xs font-medium">
              {{ report.status }}
            </span>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex justify-between py-3 border-b border-gray-100">
            <span class="text-sm text-gray-500">Nahlásil</span>
            <span class="text-sm font-medium text-gray-900">{{ report.reported_by_name }}</span>
          </div>
          <div class="flex justify-between py-3 border-b border-gray-100">
            <span class="text-sm text-gray-500">Poloha</span>
            <span class="text-sm font-medium text-gray-900">{{ report.location || "-" }}</span>
          </div>
          <div class="flex justify-between py-3 border-b border-gray-100">
            <span class="text-sm text-gray-500">Dátum udalosti</span>
            <span class="text-sm font-medium text-gray-900">{{ formatDate(report.occurred_at) }}</span>
          </div>
          <div class="flex justify-between py-3 border-b border-gray-100">
            <span class="text-sm text-gray-500">Zodpovedný zamestnanec</span>
            <span class="text-sm font-medium text-gray-900">{{ report.assigned_to_name || "-" }}</span>
          </div>
          <div v-if="report.description" class="py-3 border-b border-gray-100">
            <p class="text-sm text-gray-500 mb-1">Popis</p>
            <p class="text-sm text-gray-900 whitespace-pre-line">{{ report.description }}</p>
          </div>
          <div v-if="report.resolution_note" class="py-3">
            <p class="text-sm text-gray-500 mb-1">Poznámka k riešeniu</p>
            <p class="text-sm text-gray-900 whitespace-pre-line">{{ report.resolution_note }}</p>
          </div>
        </div>
      </div>

      <!-- Images -->
      <div v-if="report.images && report.images.length" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Fotografie</h2>
        <div class="grid grid-cols-2 gap-3">
          <a v-for="(url, i) in report.images" :key="i" :href="url" target="_blank">
            <img :src="url" class="w-full h-40 object-cover rounded-lg border border-gray-200 hover:opacity-90 transition-opacity" />
          </a>
        </div>
      </div>

      <!-- Mark as done -->
      <div v-if="canMarkDone" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <p class="text-sm font-semibold text-gray-700 mb-1">Označiť ako vyriešený <span class="text-red-500">*</span></p>
        <textarea
          v-model="resolutionNote"
          placeholder="Zadajte popis riešenia..."
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:outline-none resize-none mb-4"
        />
        <div class="flex justify-end">
          <button
            @click="handleMarkDone"
            :disabled="marking || !resolutionNote.trim()"
            class="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-500 disabled:opacity-50"
          >
            {{ marking ? "Ukladám..." : "Označiť ako vyriešený" }}
          </button>
        </div>
      </div>

      <!-- Assign employee (manager only) -->
      <div v-if="isManager" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Priradiť zamestnanca</h2>

        <div
          v-if="assignSuccess"
          class="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm mb-4"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Zamestnanec bol priradený.
        </div>

        <div class="flex gap-3">
          <select
            v-model="assignedTo"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:outline-none"
          >
            <option :value="null" disabled>Vyberte zamestnanca...</option>
            <option v-for="emp in employees" :key="emp.id" :value="emp.id">{{ emp.full_name }}</option>
          </select>
          <button
            @click="handleAssign"
            :disabled="assigning || !assignedTo"
            class="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            {{ assigning ? "Priraďujem..." : "Priradiť" }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
