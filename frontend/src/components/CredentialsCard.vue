<script setup>
defineProps({
  title: { type: String, default: "Prihlasovacie údaje - uložte si ich" },
  pid: String,
  plainPassword: String,
});

function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
}
</script>

<template>
  <div class="bg-amber-50 border border-amber-200 rounded-xl p-5">
    <p class="text-sm font-semibold text-amber-800 mb-3">{{ title }}</p>
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-xs text-amber-700 font-medium">PID</span>
        <div class="flex items-center gap-2">
          <code class="text-sm font-mono text-amber-900">{{ pid }}</code>
          <button @click="copyToClipboard(pid)" class="text-xs text-amber-600 hover:text-amber-800">skopírovať</button>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-xs text-amber-700 font-medium">Heslo</span>
        <div class="flex items-center gap-2">
          <code class="text-sm font-mono text-amber-900">{{ plainPassword }}</code>
          <button @click="copyToClipboard(plainPassword)" class="text-xs text-amber-600 hover:text-amber-800">skopírovať</button>
        </div>
      </div>
    </div>
    <p class="text-xs text-amber-600 mt-3">Tieto údaje sa znovu nezobrazia.</p>
  </div>
</template>
