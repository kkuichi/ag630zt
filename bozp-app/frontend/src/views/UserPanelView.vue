<script setup>
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import SidebarItem from "../components/SidebarItem.vue";
import { useAuth } from "../composables/useAuth.js";

const router = useRouter();
const route = useRoute();
const { getRole, logout: authLogout } = useAuth();

const role = computed(() => getRole());
const isManager = computed(() => role.value === "manažér");
const isStudent = computed(() => role.value === "študent");

const roleLabel = computed(() => {
  if (isManager.value) return "Manažér";
  if (isStudent.value) return "Študent";
  return "Zamestnanec";
});

const sidebarOpen = ref(false);

watch(
  () => route.path,
  () => {
    sidebarOpen.value = false;
  },
);

function logout() {
  authLogout(router);
}
</script>

<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Mobile backdrop -->
    <div v-if="sidebarOpen" class="fixed inset-0 bg-black/50 z-30 md:hidden" @click="sidebarOpen = false" />

    <!-- Sidebar -->
    <aside
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      class="w-64 bg-gray-900 text-white flex flex-col fixed h-full z-40 transition-transform duration-300 md:translate-x-0"
    >
      <div class="px-6 py-5 border-b border-gray-700 flex items-center justify-between">
        <router-link to="/user" class="flex items-center gap-2.5">
          <img src="/images/icon-192.png" alt="BOZP logo" class="w-8 h-8 rounded-md shrink-0" />
          <div>
            <span class="text-lg font-bold tracking-wide">BOZP</span>
            <span class="block text-xs text-gray-400 mt-0.5">{{ roleLabel }}</span>
          </div>
        </router-link>
        <!-- Close button — mobile only -->
        <button @click="sidebarOpen = false" class="md:hidden text-gray-400 hover:text-white p-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav class="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        <div>
          <SidebarItem to="/user" icon="≡" label="Hlavné menu" />
        </div>
        <!-- Company  -->
        <div>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Spoločnosť</p>
          <SidebarItem to="/user/company" icon="≡" label="Moja spoločnosť" />
        </div>

        <!-- Accounts — managers only -->
        <div v-if="isManager">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Účty</p>
          <SidebarItem to="/user/employees" icon="≡" label="Používatelia" />
          <SidebarItem to="/user/employees/new" icon="+" label="Pridať používateľa" />
        </div>

        <!-- Reports -->
        <div>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Udalosti</p>
          <SidebarItem v-if="isManager" to="/user/reports" icon="≡" label="Incidenty" />
          <SidebarItem to="/user/reports/new" icon="+" label="Nahlásiť incident" />
          <SidebarItem v-if="!isManager && !isStudent" to="/user/reports/my" icon="✓" label="Moje incidenty" />
        </div>

        <!-- eLearning -->
        <div>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">e-Learning</p>
          <SidebarItem v-if="isManager" to="/user/elearning" icon="≡" label="Priradené testy" />
          <SidebarItem v-if="isManager" to="/user/elearning/assign" icon="+" label="Priradiť test" />
          <SidebarItem v-if="!isManager" to="/user/elearning/my" icon="✓" label="Moje testy" />
          <SidebarItem to="/user/elearning/resources" icon="≡" label="Učebné materiály" />
        </div>

        <!-- Settings -->
        <div>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Nastavenia</p>
          <SidebarItem to="/user/profile" icon="⚙" label="Môj profil" />
        </div>
      </nav>

      <div class="px-4 py-4 border-t border-gray-700">
        <button @click="logout" class="w-full text-left text-sm text-gray-400 hover:text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2v1"
            />
          </svg>
          Odhlásiť sa
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 md:ml-64 flex flex-col min-h-screen min-w-0">
      <!-- Mobile top bar — sticky; must NOT be inside an overflow-hidden container -->
      <div class="md:hidden flex items-center gap-3 bg-gray-900 text-white px-4 py-3 sticky -top-px pt-[calc(0.75rem+1px)] z-20 shrink-0">
        <button @click="sidebarOpen = true" class="text-gray-300 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <img src="/images/icon-192.png" alt="BOZP logo" class="w-7 h-7 rounded-md" />
        <span class="font-bold tracking-wide">BOZP</span>
        <span class="text-xs text-gray-400">{{ roleLabel }}</span>
      </div>

      <!-- overflow-x-hidden here so only content clips, not the sticky bar -->
      <div class="flex-1 overflow-x-hidden min-w-0">
        <div class="p-4 md:p-8">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
