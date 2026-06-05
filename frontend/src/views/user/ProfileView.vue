<script setup>
import { ref, onMounted } from "vue";
import api from "../../api/index.js";
import { useAuth } from "../../composables/useAuth.js";
import { formatDate } from "../../utils/format.js";

const { getRole } = useAuth();

const profile = ref({
  full_name: "",
  email: "",
  pid: "",
  role: getRole(),
  company_name: "",
  created_at: "",
});

const passwordForm = ref({ current: "", new: "", confirm: "" });
const passwordErrors = ref({});
const passwordError = ref("");
const loading = ref(false);
const profileLoading = ref(true);
const passwordSuccess = ref(false);

onMounted(async () => {
  try {
    const { data } = await api.get("/api/users/me");
    profile.value = { ...data, created_at: formatDate(data.created_at) };
  } catch {
    // profile stays empty
  } finally {
    profileLoading.value = false;
  }
});

function validatePassword() {
  passwordErrors.value = {};
  if (!passwordForm.value.current) passwordErrors.value.current = "Povinný údaj";
  if (!passwordForm.value.new) passwordErrors.value.new = "Povinný údaj";
  else if (passwordForm.value.new.length < 6) passwordErrors.value.new = "Min 6 znakov";
  if (passwordForm.value.new !== passwordForm.value.confirm) passwordErrors.value.confirm = "Heslá sa nezhodujú";
  return Object.keys(passwordErrors.value).length === 0;
}

async function handlePasswordChange() {
  if (!validatePassword()) return;
  loading.value = true;
  passwordError.value = "";
  passwordSuccess.value = false;
  try {
    await api.post("/api/users/me/password", { current: passwordForm.value.current, newPassword: passwordForm.value.new });
    passwordSuccess.value = true;
    passwordForm.value = { current: "", new: "", confirm: "" };
  } catch (e) {
    passwordError.value = e.response?.data?.error || "Niečo sa pokazilo.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="max-w-2xl space-y-6">
    <h1 class="text-xl font-semibold text-gray-800">Môj profil</h1>

    <!-- Profile info card -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-5">Informácie o účte</h2>
      <div class="space-y-4">
        <div class="flex justify-between items-start gap-4 py-3 border-b border-gray-100">
          <span class="text-sm text-gray-500 shrink-0">Meno a priezvisko</span>
          <span class="text-sm font-medium text-gray-900 text-right break-words min-w-0">{{ profile.full_name || "-" }}</span>
        </div>
        <div class="flex justify-between items-start gap-4 py-3 border-b border-gray-100">
          <span class="text-sm text-gray-500 shrink-0">Email</span>
          <span class="text-sm font-medium text-gray-900 text-right break-words min-w-0">{{ profile.email || "-" }}</span>
        </div>
        <div class="flex justify-between items-start gap-4 py-3 border-b border-gray-100">
          <span class="text-sm text-gray-500 shrink-0">PID</span>
          <code class="text-sm font-mono text-gray-900 text-right break-words min-w-0">{{ profile.pid || "-" }}</code>
        </div>
        <div class="flex justify-between items-start gap-4 py-3 border-b border-gray-100">
          <span class="text-sm text-gray-500 shrink-0">Rola</span>
          <span class="text-sm font-medium text-gray-900 capitalize text-right min-w-0">{{ profile.role || "-" }}</span>
        </div>
        <div class="flex justify-between items-start gap-4 py-3 border-b border-gray-100">
          <span class="text-sm text-gray-500 shrink-0">Spoločnosť</span>
          <span class="text-sm font-medium text-gray-900 text-right break-words min-w-0">{{ profile.company_name || "-" }}</span>
        </div>
        <div class="flex justify-between items-start gap-4 py-3">
          <span class="text-sm text-gray-500 shrink-0">Členom od</span>
          <span class="text-sm text-gray-900 text-right min-w-0">{{ profile.created_at || "-" }}</span>
        </div>
      </div>
    </div>

    <!-- Change password card -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-5">Zmena hesla</h2>

      <div
        v-if="passwordSuccess"
        class="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm mb-4"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Heslo bolo úspešne zmenené.
      </div>

      <form @submit.prevent="handlePasswordChange" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Aktuálne heslo</label>
          <input
            v-model="passwordForm.current"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:outline-none"
          />
          <p v-if="passwordErrors.current" class="text-xs text-red-500 mt-1">{{ passwordErrors.current }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nové heslo</label>
          <input
            v-model="passwordForm.new"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:outline-none"
          />
          <p v-if="passwordErrors.new" class="text-xs text-red-500 mt-1">{{ passwordErrors.new }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Potvrdiť nové heslo</label>
          <input
            v-model="passwordForm.confirm"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:outline-none"
          />
          <p v-if="passwordErrors.confirm" class="text-xs text-red-500 mt-1">{{ passwordErrors.confirm }}</p>
        </div>
        <p v-if="passwordError" class="text-sm text-red-600">{{ passwordError }}</p>
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2.5 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50"
        >
          {{ loading ? "Ukladám..." : "Zmeniť heslo" }}
        </button>
      </form>
    </div>
  </div>
</template>
