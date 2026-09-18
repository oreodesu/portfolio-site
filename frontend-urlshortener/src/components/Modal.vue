<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

const props = defineProps<{ open: boolean; title: string; message: string }>();
const emit = defineEmits<{ (e: "close"): void }>();

function handleKey(e: KeyboardEvent) {
  if (e.key === "Escape" && props.open) emit("close");
}

onMounted(() => window.addEventListener("keydown", handleKey));
onUnmounted(() => window.removeEventListener("keydown", handleKey));
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-fade-in"
    @click="emit('close')"
  >
    <div
      class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl animate-scale-in"
      role="alertdialog"
      aria-modal="true"
      @click.stop
    >
      <div class="flex items-start gap-3">
        <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke="currentColor" class="h-5 w-5">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </span>
        <div class="flex-1 pt-0.5">
          <h2 class="text-base font-semibold text-slate-900">{{ title }}</h2>
          <p class="mt-1 text-sm text-slate-600">{{ message }}</p>
        </div>
      </div>
      <div class="mt-5 flex justify-end">
        <button
          type="button"
          class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          @click="emit('close')"
        >
          閉じる
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fade-in 0.15s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.15s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
