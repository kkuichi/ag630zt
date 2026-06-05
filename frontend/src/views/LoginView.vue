<script setup>
import { ref } from "vue";
import api from "../api/index.js";
import { useRouter } from "vue-router";

const router = useRouter();

const pid = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

async function handleSubmit() {
  error.value = "";
  if (!pid.value || !password.value) {
    error.value = "Prosím, zadajte svoje PID a heslo.";
    return;
  }
  loading.value = true;

  try {
    const response = await api.post("/api/auth/login", { pid: pid.value, password: password.value });

    const { token, role } = response.data;

    localStorage.setItem("token", token);

    if (role === "admin") {
      router.push("/admin");
    } else {
      router.push("/user");
    }

    loading.value = false;
  } catch (e) {
    error.value = "Neplatné PID alebo heslo. Prosím, skúste znova.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 mb-2">Prihlásenie</h1>
    <p class="text-gray-600 text-sm mb-6">
      Nemáte účet? <router-link to="/contact" class="text-blue-600 hover:underline">Kontaktujte podporu</router-link> pre vytvorenie nového účtu.
    </p>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="pid" class="block text-sm font-medium text-gray-700 mb-1">PID</label>
        <input
          id="pid"
          v-model="pid"
          type="text"
          autocomplete="username"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Zadajte PID"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Heslo</label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Zadajte heslo"
        />
      </div>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <button
        type="submit"
        :disabled="loading"
        class="w-full py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? "Prihlasovanie..." : "Prihlásiť sa" }}
      </button>
    </form>
  </div>
</template>
