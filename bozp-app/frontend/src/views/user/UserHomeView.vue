<script setup>
import { computed } from "vue";
import { useAuth } from "../../composables/useAuth.js";

const { getFullName, getRole } = useAuth();

const name = computed(() => getFullName() ?? "");
const role = computed(() => getRole());
const isManager = computed(() => role.value === "manažér");
const isStudent = computed(() => role.value === "študent");

const roleLabel = computed(() => {
  if (isManager.value) return "manažér";
  if (isStudent.value) return "študent";
  return "zamestnanec";
});

const now = new Date();
const hour = now.getHours();
const greeting = computed(() => {
  if (hour < 10) return "Dobré ráno";
  if (hour < 18) return "Dobrý deň";
  return "Dobrý večer";
});
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">{{ greeting }}, {{ name }} 👋</h1>
      <p class="text-sm text-gray-500 mt-1">
        Ste prihlásený ako <span class="font-medium text-gray-700">{{ roleLabel }}</span
        >.
      </p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        to="/user/company"
        class="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow group"
      >
        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">Moja spoločnosť</p>
          <p class="text-xs text-gray-500 mt-0.5">Informácie o spoločnosti</p>
        </div>
      </router-link>

      <!-- Účty — managers only -->
      <router-link
        v-if="isManager"
        to="/user/employees"
        class="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow group"
      >
        <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">Používatelia</p>
          <p class="text-xs text-gray-500 mt-0.5">Prehľad všetkých zamestnancov a študentov</p>
        </div>
      </router-link>

      <router-link
        v-if="isManager"
        to="/user/reports"
        class="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow group"
      >
        <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-gray-800 group-hover:text-red-600 transition-colors">Incidenty</p>
          <p class="text-xs text-gray-500 mt-0.5">Prehľad všetkých nahlásených incidentov</p>
        </div>
      </router-link>

      <router-link
        v-if="!isManager && !isStudent"
        to="/user/reports/my"
        class="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow group"
      >
        <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-gray-800 group-hover:text-red-600 transition-colors">Moje incidenty</p>
          <p class="text-xs text-gray-500 mt-0.5">Moje priradené incidenty</p>
        </div>
      </router-link>

      <router-link
        v-if="isManager"
        to="/user/elearning"
        class="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow group"
      >
        <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">Priradené testy</p>
          <p class="text-xs text-gray-500 mt-0.5">Správa priradených e-learningových testov</p>
        </div>
      </router-link>

      <router-link
        v-if="!isManager"
        to="/user/elearning/my"
        class="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow group"
      >
        <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">Moje testy</p>
          <p class="text-xs text-gray-500 mt-0.5">Vaše priradené e-learningové testy</p>
        </div>
      </router-link>

      <router-link
        to="/user/elearning/resources"
        class="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow group"
      >
        <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors">Učebné materiály</p>
          <p class="text-xs text-gray-500 mt-0.5">Odkazy na legislatívu, nariadenia a videá</p>
        </div>
      </router-link>

      <router-link
        v-if="isManager"
        to="/user/employees/new"
        class="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow group"
      >
        <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">Pridať používateľa</p>
          <p class="text-xs text-gray-500 mt-0.5">Vytvorenie nového účtu pre zamestnanca alebo študenta</p>
        </div>
      </router-link>

      <router-link
        to="/user/reports/new"
        class="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow group"
      >
        <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-gray-800 group-hover:text-red-600 transition-colors">Nahlásiť incident</p>
          <p class="text-xs text-gray-500 mt-0.5">Vytvorenie záznamu o novom incidente</p>
        </div>
      </router-link>

      <router-link
        v-if="isManager"
        to="/user/elearning/assign"
        class="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow group"
      >
        <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">Priradiť test</p>
          <p class="text-xs text-gray-500 mt-0.5">Priradenie testu zamestnancovi alebo študentovi</p>
        </div>
      </router-link>

      <!-- Nastavenia — all roles -->
      <router-link
        to="/user/profile"
        class="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow group"
      >
        <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-gray-800 group-hover:text-gray-600 transition-colors">Môj profil</p>
          <p class="text-xs text-gray-500 mt-0.5">Informácie o účte a zmena hesla</p>
        </div>
      </router-link>
    </div>
  </div>
</template>
