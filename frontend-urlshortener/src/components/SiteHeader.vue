<script setup lang="ts">
// メインサイトとは別アプリのため、遷移は通常のリンク (ページ全体の読み込み) になる
const links = [
  { href: "/works/todo", label: "TODO" },
  { href: "/works/expense", label: "家計簿" },
  { href: "/urlshortener/", label: "URL短縮" },
  { href: "/contact", label: "Contact" },
];
</script>

<template>
  <header class="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
    <div class="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
      <a href="/" class="text-lg font-semibold tracking-tight text-slate-900">Portfolio</a>
      <nav class="flex items-center gap-6 text-sm font-medium text-slate-600">
        <a v-for="link in links" :key="link.href" :href="link.href" class="transition-colors hover:text-slate-900">
          {{ link.label }}
        </a>
      </nav>
    </div>
  </header>
</template>
