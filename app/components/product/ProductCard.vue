<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import ProductImage from '~/components/common/ProductImage.vue'
import { useCartStore } from '~/stores/cart'
import { formatRupiah } from '~/utils/format'
import { isSoldOut, priceRange } from '~/utils/product'
import type { Product } from '~/types'

const props = defineProps<{ product: Product }>()
const cart = useCartStore()

const variants = computed(() => props.product.variants ?? [])
const soldOut = computed(() => isSoldOut(props.product))
const range = computed(() => priceRange(props.product))

const added = ref(false)

// Products with variants are added from the detail page, where a variant is picked.
const quickAdd = (event: MouseEvent) => {
  event.preventDefault()
  cart.add({
    productUuid: props.product.uuid,
    name: props.product.name,
    price: props.product.price,
    quantity: 1,
    imageToken: props.product.main_image_token,
    imageUrl: props.product.main_image_url
  })
  added.value = true
  setTimeout(() => (added.value = false), 1200)
}
</script>

<template>
  <NuxtLink
    :to="`/products/${product.uuid}`"
    class="group card flex flex-col overflow-hidden p-2 transition-[border-color,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-border-strong"
  >
    <ProductImage
      :url="product.main_image_url"
      :token="product.main_image_token"
      :alt="product.name"
      class="aspect-square rounded-2xl transition-transform duration-500 ease-out group-hover:scale-[1.02]"
    />
    <div class="flex flex-1 flex-col gap-1 px-2 pt-3 pb-2">
      <h3 class="line-clamp-2 text-sm font-medium">{{ product.name }}</h3>
      <p v-if="variants.length" class="text-xs text-muted-foreground">{{ variants.length }} varian</p>
      <div class="mt-auto flex items-end justify-between gap-2 pt-2">
        <p class="font-mono text-sm font-semibold tabular-nums">
          {{ range.min === range.max ? formatRupiah(range.min) : `${formatRupiah(range.min)}+` }}
        </p>
        <span v-if="soldOut" class="chip bg-muted text-muted-foreground">Habis</span>
        <button
          v-else-if="!variants.length"
          type="button"
          class="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground transition-transform outline-none hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
          :aria-label="`Tambah ${product.name} ke keranjang`"
          @click="quickAdd"
        >
          <Plus class="size-4 transition-transform" :class="{ 'rotate-90': added }" />
        </button>
      </div>
    </div>
  </NuxtLink>
</template>
