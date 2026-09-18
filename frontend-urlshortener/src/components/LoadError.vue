<script setup lang="ts">
defineProps<{ message: string }>();
const emit = defineEmits<{ (e: "retry"): void }>();
</script>

<template>
  <div class="mt-6 flex items-center justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
    <span>{{ message }}</span>
    <button
      type="button"
      class="shrink-0 rounded-md border border-amber-300 px-3 py-1 text-xs font-medium text-amber-800 transition hover:bg-amber-100"
      @click="emit('retry')"
    >
      再読み込み
    </button>
  </div>
</template>
