<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../../api/index.js";

const router = useRouter();

const mode = ref("employee");

const allTests = ref([]);
const allUsers = ref([]);
const form = ref({ testId: "", userId: "", deadline: "" });
const errors = ref({});
const error = ref("");
const loading = ref(true);
const submitting = ref(false);
const success = ref(false);

const filteredTests = computed(() => allTests.value.filter((t) => t.target_group === (mode.value === "employee" ? "employee" : "student")));

const filteredUsers = computed(() => allUsers.value.filter((u) => u.role === (mode.value === "employee" ? "zamestnanec" : "študent")));

const userLabel = computed(() => (mode.value === "employee" ? "Zamestnanec" : "Študent"));

watch(mode, () => {
  form.value = { testId: "", userId: "", deadline: "" };
  errors.value = {};
  error.value = "";
  success.value = false;
});

function validate() {
  errors.value = {};
  if (!form.value.testId) errors.value.testId = "Povinný údaj";
  if (!form.value.userId) errors.value.userId = "Povinný údaj";
  if (!form.value.deadline) errors.value.deadline = "Povinný údaj";
  return Object.keys(errors.value).length === 0;
}

async function handleSubmit() {
  if (!validate()) return;
  submitting.value = true;
  error.value = "";
  try {
    await api.post("/api/tests/assign", {
      testId: form.value.testId,
      employeeId: form.value.userId,
      deadline: form.value.deadline || null,
    });
    success.value = true;
  } catch (e) {
    error.value = e.response?.data?.error || "Niečo sa pokazilo.";
  } finally {
    submitting.value = false;
  }
}

function reset() {
  form.value = { testId: "", userId: "", deadline: "" };
  success.value = false;
  error.value = "";
}

onMounted(async () => {
  try {
    const [testsRes, usersRes] = await Promise.all([api.get("/api/tests"), api.get("/api/users/company")]);
    allTests.value = testsRes.data;
    allUsers.value = usersRes.data;
  } catch {
    error.value = "Nepodarilo sa načítať dáta.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="max-w-2xl">
    <h1 class="text-xl font-semibold text-gray-800 mb-6">Priradiť test</h1>

    <div v-if="loading" class="text-sm text-gray-400">Načítavanie...</div>

    <!-- Success -->
    <div v-else-if="success" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-gray-900">Test bol priradený</p>
          <p class="text-sm text-gray-500">{{ userLabel }} dostane test v sekcii eLearning.</p>
        </div>
      </div>
      <div class="flex gap-3">
        <button @click="reset" class="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50">Priradiť ďalší test</button>
        <button @click="router.push('/user/elearning')" class="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700">
          Zobraziť testy
        </button>
      </div>
    </div>

    <template v-else>
      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
        <!-- Mode toggle -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">Priradiť pre</label>
          <div class="flex gap-3">
            <label
              v-for="opt in [
                { value: 'employee', label: 'Zamestnanec' },
                { value: 'student', label: 'Študent' },
              ]"
              :key="opt.value"
              :class="mode === opt.value ? 'border-gray-800 bg-gray-800 text-white' : 'border-gray-300 text-gray-600 hover:border-gray-400'"
              class="flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg border cursor-pointer text-sm font-medium transition-colors"
            >
              <input type="radio" v-model="mode" :value="opt.value" class="hidden" />
              {{ opt.label }}
            </label>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Test <span class="text-red-500">*</span></label>
          <select
            v-model="form.testId"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:outline-none bg-white"
          >
            <option value="" disabled>Vyberte test</option>
            <option v-for="t in filteredTests" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>
          <p v-if="errors.testId" class="text-xs text-red-500 mt-1">{{ errors.testId }}</p>
          <p v-if="filteredTests.length === 0" class="text-xs text-gray-400 mt-1">Žiadne testy pre túto skupinu.</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ userLabel }} <span class="text-red-500">*</span></label>
          <select
            v-model="form.userId"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:outline-none bg-white"
          >
            <option value="" disabled>Vyberte {{ userLabel.toLowerCase() }}a</option>
            <option v-for="u in filteredUsers" :key="u.id" :value="u.id">{{ u.full_name }}</option>
          </select>
          <p v-if="errors.userId" class="text-xs text-red-500 mt-1">{{ errors.userId }}</p>
          <p v-if="filteredUsers.length === 0" class="text-xs text-gray-400 mt-1">Žiadni používatelia pre túto skupinu.</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Deadline <span class="text-red-500">*</span></label>
          <input
            v-model="form.deadline"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:outline-none appearance-none"
          />
          <p v-if="errors.deadline" class="text-xs text-red-500 mt-1">{{ errors.deadline }}</p>
        </div>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <button
          type="submit"
          :disabled="submitting"
          class="w-full py-2.5 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50"
        >
          {{ submitting ? "Priraďujem..." : "Priradiť test" }}
        </button>
      </form>
    </template>
  </div>
</template>
