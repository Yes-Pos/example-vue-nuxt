<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { formatRupiah } from '~/utils/format'
import type { ProductVariant } from '~/types'

const props = defineProps<{ variants: ProductVariant[]; trackStock: boolean }>()
const value = defineModel<string>({ default: '' })

const available = (variant: ProductVariant) => !props.trackStock || variant.current_stock > 0
</script>

<template>
  <fieldset>
    <legend class="label">Pilih varian</legend>
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
      <label
        v-for="option in variants"
        :key="option.uuid"
        class="relative flex cursor-pointer flex-col rounded-2xl border px-3.5 py-2.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
        :class="[
          value === option.uuid ? 'border-foreground bg-background' : 'border-border hover:border-border-strong',
          available(option) ? '' : 'cursor-not-allowed opacity-45'
        ]"
      >
        <input v-model="value" type="radio" name="variant" :value="option.uuid" :disabled="!available(option)" class="sr-only" />
        <span class="text-sm font-medium">{{ option.name }}</span>
        <span class="font-mono text-xs text-muted-foreground tabular-nums">{{ available(option) ? formatRupiah(option.price) : 'Habis' }}</span>
        <span v-if="value === option.uuid" class="absolute top-2 right-2 grid size-4 place-items-center rounded-full bg-foreground text-background">
          <Check class="size-2.5" />
        </span>
      </label>
    </div>
  </fieldset>
</template>
