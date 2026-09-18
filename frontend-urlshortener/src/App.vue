<script setup lang="ts">
import { onMounted, ref } from "vue";
import SiteHeader from "./components/SiteHeader.vue";
import ShortenForm from "./components/ShortenForm.vue";
import LoadError from "./components/LoadError.vue";
import { Link, fetchLinks } from "./api";

const links = ref<Link[]>([]);
const loadError = ref(false);
const copiedCode = ref<string | null>(null);

async function load() {
  loadError.value = false;
  try {
    links.value = await fetchLinks();
  } catch {
    loadError.value = true;
  }
}

async function copyShortUrl(link: Link) {
  const url = link.short_url ?? `${window.location.origin}/s/${link.code}`;

  try {
    await navigator.clipboard.writeText(url);
    copiedCode.value = link.code;
    setTimeout(() => {
      if (copiedCode.value === link.code) copiedCode.value = null;
    }, 1500);
  } catch {
    // クリップボードAPIが使えない環境では何もしない (機能自体はおまけなので致命的ではない)
  }
}

onMounted(load);
</script>

<template>
  <SiteHeader />

  <div class="mx-auto min-h-screen max-w-2xl px-6 py-12">
    <a href="/" class="text-sm text-slate-500 transition hover:text-slate-900">&larr; Portfolio トップへ戻る</a>

    <p class="mt-6 text-sm font-medium uppercase tracking-wide text-emerald-600">Works</p>
    <h1 class="mt-2 text-2xl font-bold text-slate-900">URL短縮サービス</h1>
    <p class="mt-1 text-sm text-slate-500">PHP + MySQL / Vue3</p>

    <LoadError v-if="loadError" message="一覧の取得に失敗しました。" @retry="load" />

    <ShortenForm class="mt-6" @created="load" />

    <ul class="mt-6 space-y-2">
      <li
        v-for="link in links"
        :key="link.id"
        class="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm"
      >
        <div class="flex shrink-0 gap-2">
          <button
            type="button"
            class="rounded-md border border-emerald-600 px-2.5 py-1 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50"
            @click="copyShortUrl(link)"
          >
            コピー
          </button>
          <a
            :href="link.original_url"
            target="_blank"
            rel="noreferrer"
            class="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
          >
            サイトに遷移
          </a>
        </div>
        <span class="font-medium text-emerald-700">/s/{{ link.code }}</span>
        <span v-if="copiedCode === link.code" class="text-xs font-medium text-emerald-600">コピーしました</span>
        <span class="flex-1 truncate text-slate-500">{{ link.original_url }}</span>
        <span class="text-xs text-slate-400">{{ link.click_count }} clicks</span>
      </li>
      <li
        v-if="links.length === 0"
        class="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-400"
      >
        まだ短縮したURLがありません
      </li>
    </ul>
  </div>

  <footer class="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
    &copy; {{ new Date().getFullYear() }} Portfolio
  </footer>
</template>
