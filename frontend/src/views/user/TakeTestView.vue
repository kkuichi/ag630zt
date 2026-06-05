<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "../../api/index.js";

const router = useRouter();
const route = useRoute();

const assignedTestId = route.params.id;
const test = ref(null);
const loading = ref(true);
const error = ref("");
const submitting = ref(false);

const selectedAnswers = ref({});

const result = ref(null);

const allAnswered = computed(() => {
  if (!test.value) return false;
  return test.value.questions.every((q) => selectedAnswers.value[q.id] != null);
});

onMounted(async () => {
  try {
    const { data } = await api.get(`/api/tests/assigned/${assignedTestId}/take`);
    if (data.status === "Dokončený") {
      error.value = "Tento test ste už absolvovali.";
      return;
    }
    test.value = data;
  } catch {
    error.value = "Nepodarilo sa načítať test.";
  } finally {
    loading.value = false;
  }
});

async function handleSubmit() {
  submitting.value = true;
  try {
    const { data } = await api.post(`/api/tests/assigned/${assignedTestId}/submit`, { answers: selectedAnswers.value });
    result.value = data;
  } catch {
    error.value = "Nepodarilo sa odoslať test.";
  } finally {
    submitting.value = false;
  }
}

function goBack() {
  router.push("/user/elearning/my");
}
</script>

<template>
  <div class="max-w-2xl space-y-6">
    <div class="flex items-center gap-3">
      <button @click="router.push('/user/elearning/my')" class="text-sm text-gray-500 hover:text-gray-700">← Späť</button>
      <h1 class="text-xl font-semibold text-gray-800">Test</h1>
    </div>

    <div v-if="loading" class="text-sm text-gray-400">Načítavanie...</div>
    <div v-if="error" class="text-sm text-red-600">{{ error }}</div>

    <template v-if="test">
      <!-- Test header -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-1">{{ test.name }}</h2>
        <p class="text-sm text-gray-500">{{ test.description }}</p>
      </div>

      <!-- Questions -->
      <div
        v-for="(question, qi) in test.questions"
        :key="question.id"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8"
      >
        <p class="text-sm font-semibold text-gray-800 mb-4">{{ qi + 1 }}. {{ question.question_text }}</p>
        <div class="space-y-3">
          <label
            v-for="answer in question.answers"
            :key="answer.id"
            class="flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors"
            :class="selectedAnswers[question.id] == answer.id
              ? 'border-gray-800 bg-gray-50'
              : 'border-gray-200 hover:border-gray-300'"
          >
            <input
              type="radio"
              :name="`q-${question.id}`"
              :value="answer.id"
              v-model="selectedAnswers[question.id]"
              class="accent-gray-800"
            />
            <span class="text-sm text-gray-700">{{ answer.answer_text }}</span>
          </label>
        </div>
      </div>

      <!-- Submit -->
      <div class="flex justify-end">
        <button
          @click="handleSubmit"
          :disabled="submitting || !allAnswered"
          class="px-6 py-2.5 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50"
        >
          {{ submitting ? "Odosielam..." : "Odoslať test" }}
        </button>
      </div>
      <p v-if="!allAnswered" class="text-xs text-gray-400 text-right">Odpovedzte na všetky otázky pred odoslaním.</p>
    </template>

    <!-- Result popup -->
    <div v-if="result" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-xl p-10 w-full max-w-sm text-center space-y-5">
        <div class="text-5xl font-bold text-gray-900">{{ result.score }} / {{ result.maxScore }}</div>
        <p class="text-base font-semibold text-gray-700">
          {{ result.score === result.maxScore ? 'Výborne! Všetky odpovede správne.' : 'Test bol odoslaný.' }}
        </p>
        <p class="text-sm text-gray-500">
          Správne ste odpovedali na <strong>{{ result.score }}</strong> z <strong>{{ result.maxScore }}</strong> otázok.
        </p>
        <div
          class="text-2xl font-bold"
          :class="result.score / result.maxScore >= 0.5 ? 'text-green-600' : 'text-red-500'"
        >
          {{ Math.round((result.score / result.maxScore) * 100) }} %
        </div>
        <button
          @click="goBack"
          class="w-full py-2.5 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700"
        >
          Späť na moje testy
        </button>
      </div>
    </div>
  </div>
</template>
