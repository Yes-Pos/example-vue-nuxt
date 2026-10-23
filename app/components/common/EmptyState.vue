<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{ icon: Component; title: string; description?: string }>()
</script>

<template>
  <div class="rounded-3xl border border-dashed border-border-strong px-6 py-16 text-center">
    <div class="mx-auto grid size-14 place-items-center rounded-full bg-muted">
      <component :is="icon" class="size-6 text-muted-foreground" />
    </div>
    <p class="mt-4 font-medium">{{ title }}</p>
    <p v-if="description" class="mt-1 text-sm text-muted-foreground">{{ description }}</p>
    <div v-if="$slots.default" class="mt-6"><slot /></div>
  </div>
</template>
