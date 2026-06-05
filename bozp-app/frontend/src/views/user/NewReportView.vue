<script setup>
import { ref, onBeforeUnmount } from "vue";
import api from "../../api/index.js";

const form = ref({ title: "", location: "", description: "", severity: "Stredná", occurred_at: "" });
const errors = ref({});
const loading = ref(false);
const error = ref("");
const success = ref(false);
const images = ref([]);
const imagePreviews = ref([]);

const severities = ["Nízka", "Stredná", "Vysoká", "Kritická"];

const locations = [
  "V4 - 002 SMART Lab",
  "V4 - 010 Učebňa spracovania veľkých dát",
  "V4 - 011 Laboratórium",
  "V4 - 102 Učebňa inteligentných systémov",
  "V4 - 103 Vývojové pracovisko pre mechatronické systémy",
  "V4 - 108 Laboratórium moderných metód riadenia fyzikálnych systémov",
  "V4 - 109 Laboratórium distribuovaných systémov riadenia",
  "V4 - 112 Intelligent Health Lab",
  "V4 - 113 Laboratórium",
  "V4 - 114 Smart Industry - Industry 4.0",
  "V4 - 116 Laboratórium umelej inteligencie",
  "V4 - 119 Seminárna miestnosť",
  "V4 - 136 Vedúca oddelenia spoločenských vied",
  "V4 - 145 Laboratórium výrobných liniek a rozpoznávania obrazov",
  "V4 - 146 Laboratórium počítačových riadiacich systémov",
  "V4 - 147 Učebňa dátovej analytiky",
  "V4 - 156 Kancelária (doktorandi)",
  "V4 - 157 Sekretariát",
  "V4 - 158 Kancelária vedúceho katedry",
  "V4 - 160 Hospodárka",
  "V4 - 187 Laboratórium strojového učenia",
  "V4 - 188 LIMAD",
  "V4 - 102-147 Chodba 1",
  "V4 - 156-188 Chodba 2",
  "Iné",
];

function handleImages(e) {
  const files = Array.from(e.target.files);
  images.value = files;
  imagePreviews.value = files.map((f) => URL.createObjectURL(f));
}

function removeImage(index) {
  images.value.splice(index, 1);
  imagePreviews.value.splice(index, 1);
}

function validate() {
  errors.value = {};
  if (!form.value.title.trim()) errors.value.title = "Povinný údaj";
  if (!form.value.occurred_at) errors.value.occurred_at = "Povinný údaj";
  if (!form.value.location) errors.value.location = "Povinný údaj";
  return Object.keys(errors.value).length === 0;
}

async function handleSubmit() {
  if (!validate()) return;
  loading.value = true;
  error.value = "";
  try {
    const formData = new FormData();
    formData.append("title", form.value.title);
    formData.append("location", form.value.location);
    formData.append("description", form.value.description);
    formData.append("severity", form.value.severity);
    formData.append("occurred_at", form.value.occurred_at);
    images.value.forEach((file) => formData.append("images", file));

    await api.post("/api/reports", formData);
    form.value = { title: "", location: "", description: "", severity: "Stredná", occurred_at: "" };
    images.value = [];
    imagePreviews.value = [];
    errors.value = {};
    success.value = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (e) {
    error.value = e.response?.data?.error || "Niečo sa pokazilo.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="max-w-2xl">
    <h1 class="text-xl font-semibold text-gray-800 mb-6">Pridať záznam o incidente</h1>

    <div v-if="success" class="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6">
      <div class="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center shrink-0">
        <svg class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p class="text-sm text-green-700 font-medium">Incident bol úspešne odoslaný.</p>
      <button type="button" @click="success = false" class="ml-auto text-green-500 hover:text-green-700 text-lg leading-none">&times;</button>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Názov <span class="text-red-500">*</span></label>
        <input
          v-model="form.title"
          type="text"
          placeholder="Krátky popis incidentu"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:outline-none"
        />
        <p v-if="errors.title" class="text-xs text-red-500 mt-1">{{ errors.title }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Poloha <span class="text-red-500">*</span></label>
        <select
          v-model="form.location"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:outline-none bg-white"
        >
          <option value="" disabled>Vyberte polohu...</option>
          <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
        </select>
        <p v-if="errors.location" class="text-xs text-red-500 mt-1">{{ errors.location }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Dátum a čas <span class="text-red-500">*</span></label>
        <input
          v-model="form.occurred_at"
          type="datetime-local"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:outline-none appearance-none"
        />
        <p v-if="errors.occurred_at" class="text-xs text-red-500 mt-1">{{ errors.occurred_at }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">Závažnosť</label>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <label
            v-for="s in severities"
            :key="s"
            :class="{
              'border-red-600 bg-red-600 text-white': form.severity === s && s === 'Kritická',
              'border-orange-500 bg-orange-500 text-white': form.severity === s && s === 'Vysoká',
              'border-yellow-500 bg-yellow-500 text-white': form.severity === s && s === 'Stredná',
              'border-green-600 bg-green-600 text-white': form.severity === s && s === 'Nízka',
              'border-gray-300 text-gray-600 hover:border-gray-400': form.severity !== s,
            }"
            class="flex items-center justify-center px-4 py-2.5 rounded-lg border cursor-pointer text-sm font-medium transition-colors"
          >
            <input type="radio" v-model="form.severity" :value="s" class="hidden" />
            {{ s }}
          </label>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Popis</label>
        <textarea
          v-model="form.description"
          rows="4"
          placeholder="Podrobný popis toho, čo sa stalo..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:outline-none resize-none"
        />
      </div>

      <!-- Image upload -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Fotografie</label>
        <label
          class="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors"
        >
          <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="text-sm text-gray-500 text-center">Kliknite pre výber alebo odfotografujte</span>
          <span class="text-xs text-gray-400 mt-1">Max. 10 fotografií, každá do 10 MB</span>
          <input type="file" accept="image/*" multiple capture="environment" class="hidden" @change="handleImages" />
        </label>

        <!-- Previews -->
        <div v-if="imagePreviews.length" class="grid grid-cols-3 gap-3 mt-3">
          <div v-for="(src, i) in imagePreviews" :key="i" class="relative">
            <img :src="src" class="w-full h-24 object-cover rounded-lg border border-gray-200" />
            <button
              type="button"
              @click="removeImage(i)"
              class="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="loading"
          class="flex-1 py-2.5 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50"
        >
          {{ loading ? "Odosielanie..." : "Odoslať záznam o incidente" }}
        </button>
      </div>
    </form>
  </div>
</template>
