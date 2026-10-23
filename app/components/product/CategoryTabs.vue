<script setup lang="ts">
import { categoryKey } from '~/utils/product'
import type { ProductCategory } from '~/types'

defineProps<{ categories: ProductCategory[] }>()
const active = defineModel<string>({ default: '' })

const tabClass = (selected: boolean) =>
  `rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
    selected ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
  }`
</script>

<template>
  <div class="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Kategori">
    <div class="inline-flex gap-1 rounded-full border border-border bg-card p-1">
      <button type="button" role="tab" :aria-selected="active === ''" :class="tabClass(active === '')" @click="active = ''">Semua</button>
      <button
        v-for="category in categories"
        :key="categoryKey(category)"
        type="button"
        role="tab"
        :aria-selected="active === categoryKey(category)"
        :class="tabClass(active === categoryKey(category))"
        @click="active = categoryKey(category)"
      >
        {{ category.category_name }}
        <span class="ml-1 font-mono text-xs opacity-60">{{ category.products.length }}</span>
      </button>
    </div>
  </div>
</template>
