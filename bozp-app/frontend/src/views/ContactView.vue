<template>
  <div>
    <div class="text-center mb-6">
      <h1 class="text-4xl font-extrabold text-gray-900 mb-3">Spojte sa s nami</h1>
      <p class="text-gray-500 max-w-lg mx-auto">
        Máte otázku alebo záujem o registráciu vašej spoločnosti? Vyplňte formulár nižšie alebo nás kontaktujte priamo.
      </p>
    </div>

    <div class="grid lg:grid-cols-3 gap-10">
      <aside class="space-y-6">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 class="font-semibold text-gray-900 mb-5">Kontaktné informácie</h2>
          <ul class="space-y-5">
            <li class="flex items-start gap-3">
              <div class="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Adresa</p>
                <p class="text-sm text-gray-800">Námestie osloboditeľov 1<br />040 01 Košice, Slovensko</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">E-mail</p>
                <a href="mailto:bozp@fei.tuke.sk" class="text-sm text-gray-800 hover:text-blue-600 transition-colors">kontakt@bozp.sk</a>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Telefón</p>
                <a href="tel:+421556023511" class="text-sm text-gray-800 hover:text-blue-600 transition-colors">+421 900 123 456 </a>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-9 h-9 bg-yellow-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Úradné hodiny</p>
                <p class="text-sm text-gray-800">Po – Pi: 8:00 – 16:00<br />So – Ne: Zatvorené</p>
              </div>
            </li>
          </ul>
        </div>
      </aside>

      <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div
          v-if="submitted"
          class="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm mb-6"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Vaša žiadosť o registráciu bola odoslaná. Čoskoro sa vám ozveme!</span>
        </div>

        <div class="mb-8">
          <p class="font-semibold text-gray-900">Registrácia spoločnosti</p>
          <p class="text-xs text-gray-400 mt-0.5">Vyplňte údaje o vašej spoločnosti a ozveme sa vám.</p>
        </div>

        <div class="space-y-5">
          <div class="grid sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Váš e-mail <span class="text-red-500">*</span></label>
              <input
                v-model="form.email"
                type="email"
                placeholder="meno@priklad.sk"
                class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Kontaktná osoba <span class="text-red-500">*</span></label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Meno a priezvisko"
                class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Názov spoločnosti <span class="text-red-500">*</span></label>
              <input
                v-model="form.companyName"
                type="text"
                placeholder="Acme s.r.o."
                class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">IČO</label>
              <input
                v-model="form.companyId"
                type="text"
                placeholder="12345678"
                class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Telefónne číslo</label>
              <input
                v-model="form.phone"
                type="tel"
                placeholder="+421 900 000 000"
                class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Odvetvie / Sektor</label>
              <input
                v-model="form.industry"
                type="text"
                placeholder="napr. Stavebníctvo, Zdravotníctvo…"
                class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Doplňujúce informácie</label>
            <textarea
              v-model="form.message"
              rows="2"
              placeholder="Akékoľvek ďalšie informácie o vašej spoločnosti alebo požiadavkách…"
              class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
            />
          </div>

          <button
            type="button"
            :disabled="!canSubmit"
            @click="handleSubmit"
            class="w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :class="canSubmit ? 'bg-gray-900 text-white hover:bg-gray-700 cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
          >
            Odoslať žiadosť o registráciu
          </button>

          <div class="flex items-start gap-1.5 text-xs text-gray-400">
            <svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Odoslaním žiadosti o registráciu súhlasíte so spracovaním vašich osobných údajov v súvislosti s touto žiadosťou.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const submitted = ref(false);

const form = ref({
  email: "",
  name: "",
  message: "",
  companyName: "",
  companyId: "",
  phone: "",
  industry: "",
});

const canSubmit = computed(() => !!form.value.email && !!form.value.name && !!form.value.companyName);

function handleSubmit() {
  if (!canSubmit.value) return;
  submitted.value = true;
  form.value = { email: "", name: "", message: "", companyName: "", companyId: "", phone: "", industry: "" };
}
</script>
