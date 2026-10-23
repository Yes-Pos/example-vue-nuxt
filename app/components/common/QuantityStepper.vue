<script setup lang="ts">
import { Minus, Plus } from 'lucide-vue-next'

withDefaults(defineProps<{ value: number; min?: number; max?: number }>(), { min: 1, max: 999 })
const emit = defineEmits<{ change: [value: number] }>()

const buttonClass =
  'grid size-7 place-items-center rounded-full transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:text-muted-foreground/50 disabled:hover:bg-transparent'
</script>

<template>
  <div class="inline-flex items-center gap-0.5 rounded-full border border-border bg-background p-0.5">
    <button type="button" :class="buttonClass" aria-label="Kurangi" :disabled="value <= min" @click="emit('change', value - 1)">
      <Minus class="size-3" />
    </button>
    <span class="min-w-6 text-center font-mono text-sm font-semibold tabular-nums">{{ value }}</span>
    <button type="button" :class="buttonClass" aria-label="Tambah" :disabled="value >= max" @click="emit('change', value + 1)">
      <Plus class="size-3" />
    </button>
  </div>
</template>
