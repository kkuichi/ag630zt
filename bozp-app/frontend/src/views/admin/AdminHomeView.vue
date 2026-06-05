<script setup>
import { computed } from "vue";
import { useAuth } from "../../composables/useAuth.js";

const { getFullName } = useAuth();
const name = computed(() => getFullName() ?? "");

const now = new Date();
const hour = now.getHours();
const greeting = computed(() => {
  if (hour < 12) return "Dobré ráno";
  if (hour < 18) return "Dobrý deň";
  return "Dobrý večer";
});
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">{{ greeting }}, {{ name }} 👋</h1>
      <p class="text-sm text-gray-500 mt-1">Ste prihlásený ako <span class="font-medium text-gray-700">administrátor</span>.</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        to="/admin/companies"
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
          <p class="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">Spoločnosti</p>
          <p class="text-xs text-gray-500 mt-0.5">Správa registrovaných spoločností</p>
        </div>
      </router-link>

      <router-link
        to="/admin/accounts"
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
          <p class="text-xs text-gray-500 mt-0.5">Správa používateľských účtov</p>
        </div>
      </router-link>

      <router-link
        to="/admin/elearning"
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
          <p class="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">Testy</p>
          <p class="text-xs text-gray-500 mt-0.5">Správa e-learningových testov</p>
        </div>
      </router-link>

      <router-link
        to="/admin/resources"
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
          <p class="text-xs text-gray-500 mt-0.5">Správa učebných materiálov</p>
        </div>
      </router-link>

      <router-link
        to="/admin/companies/add"
        class="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow group"
      >
        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">Pridať spoločnosť</p>
          <p class="text-xs text-gray-500 mt-0.5">Registrácia novej spoločnosti do systému</p>
        </div>
      </router-link>

      <router-link
        to="/admin/accounts/add"
        class="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow group"
      >
        <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">Pridať používateľa</p>
          <p class="text-xs text-gray-500 mt-0.5">Vytvorenie nového používateľského účtu</p>
        </div>
      </router-link>

      <router-link
        to="/admin/elearning/add"
        class="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow group"
      >
        <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">Vytvoriť test</p>
          <p class="text-xs text-gray-500 mt-0.5">Vytvorenie nového testu</p>
        </div>
      </router-link>

      <router-link
        to="/admin/resources/add"
        class="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow group"
      >
        <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors">Pridať učebný materiál</p>
          <p class="text-xs text-gray-500 mt-0.5">Pridanie učebného materiálu</p>
        </div>
      </router-link>
    </div>
  </div>
</template>
