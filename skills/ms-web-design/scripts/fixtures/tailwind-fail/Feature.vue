<template>
  <article class="rounded-2xl p-6">
    <span class="text-xs uppercase tracking-widest">Field kit</span>
    <img :src="photo" alt="A deckhand logging a reading" class="rounded-xl hover:scale-110" />
    <button type="button" class="rounded-md px-4 py-2 transition-all" @click="open = !open">Log a reading</button>
    <div aria-hidden="true" :class="{ 'animate-bounce': pulse }" class="h-4 w-4 rounded-full"></div>
    <div aria-hidden="true" class="absolute -right-10 top-0 h-40 w-40 bg-gradient-to-br from-violet-500 to-sky-400 blur-[60px]"></div>
  </article>
</template>

<script setup lang="ts">
defineProps<{ photo: string; pulse: boolean }>();
const open = ref(false);
</script>
