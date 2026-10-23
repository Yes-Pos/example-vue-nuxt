<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import ProductImage from '~/components/common/ProductImage.vue'
import QuantityStepper from '~/components/common/QuantityStepper.vue'
import { useCartStore } from '~/stores/cart'
import { formatRupiah } from '~/utils/format'
import type { CartLine } from '~/types'

defineProps<{ line: CartLine }>()
const cart = useCartStore()
</script>

<template>
  <div class="flex gap-3 p-3">
    <ProductImage :url="line.imageUrl" :token="line.imageToken" :alt="line.name" class="size-16 flex-shrink-0 rounded-2xl sm:size-20" />
    <div class="flex min-w-0 flex-1 flex-col">
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0">
          <NuxtLink :to="`/products/${line.productUuid}`" class="block truncate text-sm font-medium hover:underline">{{ line.name }}</NuxtLink>
          <p v-if="line.variantName" class="text-xs text-muted-foreground">{{ line.variantName }}</p>
        </div>
        <button type="button" class="btn-icon size-8 text-muted-foreground" :aria-label="`Hapus ${line.name}`" @click="cart.remove(line)">
          <Trash2 class="size-4" />
        </button>
      </div>
      <div class="mt-auto flex items-end justify-between gap-2 pt-2">
        <QuantityStepper :value="line.quantity" @change="(value) => cart.setQuantity(line, value)" />
        <p class="font-mono text-sm font-semibold tabular-nums">{{ formatRupiah(line.price * line.quantity) }}</p>
      </div>
    </div>
  </div>
</template>
