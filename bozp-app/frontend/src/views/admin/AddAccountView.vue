<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../../api/index.js";
import CredentialsCard from "../../components/CredentialsCard.vue";

const router = useRouter();

const form = ref({ fullname: "", email: "", role: "zamestnanec", companyId: "" });
const companies = ref([]);
const loading = ref(false);
const error = ref("");
const errors = ref({});
const result = ref(null);

async function fetchCompanies() {
  const { data } = await api.get("/api/companies");
  companies.value = data;
}

onMounted(fetchCompanies);

watch(
  () => form.value.role,
  (role) => {
    if (role === "admin") form.value.companyId = "";
  },
);

function validate() {
  errors.value = {};
  if (!form.value.fullname.trim()) errors.value.fullname = "Povinný údaj";
  if (!form.value.email.trim()) errors.value.email = "Povinný údaj";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) errors.value.email = "Neplatný email";
  if (form.value.role !== "admin" && !form.value.companyId) errors.value.companyId = "Povinný údaj";
  return Object.keys(errors.value).length === 0;
}

async function handleSubmit() {
  error.value = "";
  if (!validate()) return;

  loading.value = true;
  try {
    const { data } = await api.post("/api/users", {
      fullname: form.value.fullname,
      email: form.value.email,
      role: form.value.role,
      companyId: form.value.role !== "admin" ? form.value.companyId : null,
    });
    result.value = data;
  } catch (e) {
    error.value = e.response?.data?.error || "Nastala chyba.";
  } finally {
    loading.value = false;
  }
}

function reset() {
  form.value = { fullname: "", email: "", role: "zamestnanec", companyId: "" };
  result.value = null;
  error.value = "";
  errors.value = {};
}
</script>

<template>
  <div class="max-w-2xl">
    <h1 class="text-xl font-semibold text-gray-800 mb-6">Pridať používateľa</h1>

    <div v-if="result" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-gray-900">Používateľ vytvorený</p>
          <p class="text-sm text-gray-500">{{ result.user.full_name }} · {{ result.user.role }}</p>
        </div>
      </div>

      <CredentialsCard title="Údaje pre používateľa" :pid="result.user.pid" :plain-password="result.plainPassword" class="mb-6" />

      <div class="flex gap-3">
        <button @click="reset" class="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50">Pridať nového</button>
        <button @click="router.push('/admin/accounts')" class="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700">
          Zobraziť používateľov
        </button>
      </div>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Meno a priezvisko <span class="text-red-500">*</span></label>
        <input
          v-model="form.fullname"
          type="text"
          placeholder="Ján Novák"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-gray-400 focus:outline-none"
        />
        <p v-if="errors.fullname" class="text-xs text-red-500 mt-1">{{ errors.fullname }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-red-500">*</span></label>
        <input
          v-model="form.email"
          type="email"
          placeholder="jan.novak@bozp.sk"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-gray-400 focus:outline-none"
        />
        <p v-if="errors.email" class="text-xs text-red-500 mt-1">{{ errors.email }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">Rola <span class="text-red-500">*</span></label>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <label
            v-for="option in ['admin', 'manažér', 'zamestnanec', 'študent']"
            :key="option"
            :class="form.role === option ? 'border-gray-800 bg-gray-800 text-white' : 'border-gray-300 text-gray-600 hover:border-gray-400'"
            class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer text-sm font-medium transition-colors capitalize"
          >
            <input type="radio" v-model="form.role" :value="option" class="hidden" />
            {{ option }}
          </label>
        </div>
      </div>

      <div v-if="form.role !== 'admin'">
        <label class="block text-sm font-medium text-gray-700 mb-1">Spoločnosť <span class="text-red-500">*</span></label>
        <select
          v-model="form.companyId"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-gray-400 focus:outline-none bg-white"
        >
          <option value="" disabled>Vyberte spoločnosť</option>
          <option v-for="c in companies" :key="c.id" :value="c.id">{{ c.company_name }}</option>
        </select>
        <p v-if="errors.companyId" class="text-xs text-red-500 mt-1">{{ errors.companyId }}</p>
      </div>

      <p class="text-xs text-gray-400 flex items-center gap-1">
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        PID a heslo budú automaticky vygenerované a zobrazené po vytvorení.
      </p>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <button
        type="submit"
        :disabled="loading"
        class="w-full py-2.5 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50"
      >
        {{ loading ? "Vytváranie..." : "Vytvoriť používateľa" }}
      </button>
    </form>
  </div>
</template>
