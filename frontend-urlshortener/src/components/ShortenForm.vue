<script setup lang="ts">
import { ref } from "vue";
import { createLink } from "../api";
import Modal from "./Modal.vue";

const emit = defineEmits<{ (e: "created"): void }>();

const url = ref("");
const modal = ref<{ title: string; message: string } | null>(null);

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

async function handleSubmit() {
  const trimmed = url.value.trim();

  if (!trimmed) {
    modal.value = { title: "入力エラー", message: "短縮したいURLを入力してください。" };
    return;
  }
  if (!isValidUrl(trimmed)) {
    modal.value = { title: "入力エラー", message: "http:// または https:// から始まる正しいURLを入力してください。" };
    return;
  }

  try {
    await createLink(trimmed);
    url.value = "";
    emit("created");
  } catch (e) {
    modal.value = {
      title: "エラー",
      message: e instanceof Error ? e.message : "短縮に失敗しました。時間をおいて再度お試しください。",
    };
  }
}
</script>

<template>
  <div>
    <form class="flex gap-2" @submit.prevent="handleSubmit">
      <input
        v-model="url"
        type="url"
        placeholder="https://example.com/very/long/path"
        class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
      />
      <button
        type="submit"
        class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
      >
        短縮する
      </button>
    </form>

    <Modal
      :open="modal !== null"
      :title="modal?.title ?? ''"
      :message="modal?.message ?? ''"
      @close="modal = null"
    />
  </div>
</template>
