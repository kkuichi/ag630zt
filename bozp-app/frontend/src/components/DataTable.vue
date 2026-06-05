<script setup>
defineProps({
  columns: Array,
  rows: Array,
  loading: Boolean,
  editLabel: { type: String, default: "Upraviť" },
  deleteLabel: { type: String, default: "Vymazať" },
  showEdit: { type: Boolean, default: true },
  showDelete: { type: Boolean, default: true },
});
defineEmits(["delete", "edit"]);
</script>

<template>
  <div class="bg-white rounded-lg shadow overflow-hidden w-full">
    <div v-if="loading" class="p-8 text-center text-gray-400">Načítavam...</div>
    <div v-else class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th v-for="col in columns" :key="col.key" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {{ col.label }}
          </th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Akcie</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr v-for="row in rows" :key="row.id" class="hover:bg-gray-50">
          <td v-for="col in columns" :key="col.key" class="px-6 py-4 text-sm text-gray-700">
            {{ row[col.key] ?? "-" }}
          </td>
          <td class="px-6 py-4 text-right space-x-3">
            <button v-if="showEdit" @click="$emit('edit', row.id)" class="text-blue-500 hover:text-blue-700 text-sm">{{ editLabel }}</button>
            <button v-if="showDelete" @click="$emit('delete', row.id)" class="text-red-500 hover:text-red-700 text-sm">{{ deleteLabel }}</button>
          </td>
        </tr>
        <tr v-if="rows.length === 0">
          <td :colspan="columns.length + 1" class="px-6 py-8 text-center text-gray-400 text-sm">Neexistujú žiadne záznamy.</td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>
</template>
