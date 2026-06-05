<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../../api/index.js";

const router = useRouter();

const form = ref({
  name: "",
  description: "",
  targetGroup: "employee",
});

const questions = ref([createQuestion()]);

const loading = ref(false);
const error = ref("");
const errors = ref({});
const success = ref(false);

function createQuestion() {
  return {
    question_text: "",
    answers: [
      { answer_text: "", is_correct: true },
      { answer_text: "", is_correct: false },
      { answer_text: "", is_correct: false },
      { answer_text: "", is_correct: false },
    ],
  };
}

function addQuestion() {
  questions.value.push(createQuestion());
}

function removeQuestion(index) {
  if (questions.value.length > 1) questions.value.splice(index, 1);
}

function setCorrect(qIndex, aIndex) {
  questions.value[qIndex].answers.forEach((a, i) => {
    a.is_correct = i === aIndex;
  });
}

function validate() {
  errors.value = {};
  if (!form.value.name.trim()) errors.value.name = "Povinné";
  if (!form.value.description.trim()) errors.value.description = "Povinné";
  questions.value.forEach((q, qi) => {
    if (!q.question_text.trim()) errors.value[`q_${qi}`] = "Povinné";
    q.answers.forEach((a, ai) => {
      if (!a.answer_text.trim()) errors.value[`q_${qi}_a_${ai}`] = "Povinné";
    });
  });
  return Object.keys(errors.value).length === 0;
}

async function handleSubmit() {
  error.value = "";
  if (!validate()) return;
  loading.value = true;
  try {
    await api.post("/api/tests", {
      name: form.value.name,
      description: form.value.description,
      targetGroup: form.value.targetGroup,
      questions: questions.value,
    });
    success.value = true;
  } catch (e) {
    error.value = e.response?.data?.error || "Nastala chyba.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="max-w-2xl">
    <h1 class="text-xl font-semibold text-gray-800 mb-6">Pridať test</h1>

    <!-- Success -->
    <div v-if="success" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-gray-900">Test vytvorený</p>
          <p class="text-sm text-gray-500">{{ form.name }}</p>
        </div>
      </div>
      <div class="flex gap-3">
        <button
          @click="
            success = false;
            form = { name: '', description: '', targetGroup: 'employee' };
            questions = [createQuestion()];
          "
          class="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50"
        >
          Pridať nový
        </button>
        <button @click="router.push('/admin/elearning')" class="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700">
          Zobraziť testy
        </button>
      </div>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Test info -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Názov testu <span class="text-red-500">*</span></label>
          <input
            v-model="form.name"
            type="text"
            placeholder="BOZP základy"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-gray-400 focus:outline-none"
          />
          <p v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Popis <span class="text-red-500">*</span></label>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Krátky popis testu..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-gray-400 focus:outline-none resize-none"
          />
          <p v-if="errors.description" class="text-xs text-red-500 mt-1">{{ errors.description }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">Určený pre <span class="text-red-500">*</span></label>
          <div class="flex gap-3">
            <label
              v-for="opt in [
                { value: 'employee', label: 'Zamestnanec' },
                { value: 'student', label: 'Študent' },
              ]"
              :key="opt.value"
              :class="
                form.targetGroup === opt.value ? 'border-gray-800 bg-gray-800 text-white' : 'border-gray-300 text-gray-600 hover:border-gray-400'
              "
              class="flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg border cursor-pointer text-sm font-medium transition-colors"
            >
              <input type="radio" v-model="form.targetGroup" :value="opt.value" class="hidden" />
              {{ opt.label }}
            </label>
          </div>
        </div>
      </div>

      <!-- Questions -->
      <div v-for="(q, qi) in questions" :key="qi" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Otázka {{ qi + 1 }}</h2>
          <button v-if="questions.length > 1" type="button" @click="removeQuestion(qi)" class="text-xs text-red-400 hover:text-red-600">
            Odstrániť
          </button>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Otázka <span class="text-red-500">*</span></label>
          <input
            v-model="q.question_text"
            type="text"
            placeholder="Čo znamená BOZP?"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-gray-400 focus:outline-none"
          />
          <p v-if="errors[`q_${qi}`]" class="text-xs text-red-500 mt-1">{{ errors[`q_${qi}`] }}</p>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700"
            >Odpovede <span class="text-xs text-gray-400 font-normal">(vyberte správnu odpoveď)</span></label
          >
          <div v-for="(a, ai) in q.answers" :key="ai" class="flex items-center gap-3">
            <input
              type="radio"
              :name="`correct_${qi}`"
              :checked="a.is_correct"
              @change="setCorrect(qi, ai)"
              class="accent-gray-800 mt-0.5 shrink-0"
            />
            <input
              v-model="a.answer_text"
              type="text"
              :placeholder="`Možnosť ${ai + 1}`"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-gray-400 focus:outline-none"
            />
            <p v-if="errors[`q_${qi}_a_${ai}`]" class="text-xs text-red-500">{{ errors[`q_${qi}_a_${ai}`] }}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        @click="addQuestion"
        class="w-full py-2.5 border border-dashed border-gray-300 text-sm text-gray-500 rounded-xl hover:border-gray-400 hover:text-gray-700 transition-colors"
      >
        + Pridať otázku
      </button>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <button
        type="submit"
        :disabled="loading"
        class="w-full py-2.5 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50"
      >
        {{ loading ? "Vytváranie..." : "Vytvoriť test" }}
      </button>
    </form>
  </div>
</template>
