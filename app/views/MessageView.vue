<script setup lang="ts">
import { TriangleAlert } from 'lucide-vue-next'

// A full-page notice: setup problems and errors.
withDefaults(defineProps<{ title: string; message?: string; code?: string | number; tone?: 'error' | 'warning' }>(), { tone: 'error' })
</script>

<template>
  <div class="card mx-auto max-w-xl p-8 text-center">
    <div
      class="mx-auto grid size-12 place-items-center rounded-full"
      :class="tone === 'warning' ? 'bg-warning/15 text-warning' : 'bg-destructive/15 text-destructive'"
    >
      <TriangleAlert class="size-5" />
    </div>
    <p v-if="code" class="mt-4 font-mono text-xs text-muted-foreground">{{ code }}</p>
    <h1 class="mt-1 text-lg font-semibold tracking-tight">{{ title }}</h1>
    <p v-if="message" class="mt-1 text-sm text-muted-foreground">{{ message }}</p>
    <div v-if="$slots.default" class="mt-6"><slot /></div>
  </div>
</template>
