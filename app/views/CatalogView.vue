<script setup lang="ts">
import { PackageSearch, Search } from 'lucide-vue-next'
import EmptyState from '~/components/common/EmptyState.vue'
import CatalogHero from '~/components/product/CatalogHero.vue'
import CategoryTabs from '~/components/product/CategoryTabs.vue'
import ProductCard from '~/components/product/ProductCard.vue'
import MessageView from '~/views/MessageView.vue'
import { errorMessage } from '~/services/api'
import { getProducts } from '~/services/product.service'
import { useShopStore } from '~/stores/shop'
import { categoryKey } from '~/utils/product'
import type { Product, ProductCategory } from '~/types'

const shop = useShopStore()
const categories = ref<ProductCategory[]>([])
const loading = ref(true)
const error = ref('')
const query = ref('')
const activeCategory = ref('')

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    categories.value = await getProducts()
  } catch (err) {
    error.value = errorMessage(err)
  } finally {
    loading.value = false
  }
}

onMounted(load)

// A product can sit in several categories; "Semua" lists it once.
const allProducts = computed(() => {
  const seen = new Map<string, Product>()
  for (const category of categories.value) {
    for (const product of category.products) seen.set(product.uuid, product)
  }
  return [...seen.values()]
})

const visibleProducts = computed(() => {
  const source = activeCategory.value
    ? (categories.value.find((category) => categoryKey(category) === activeCategory.value)?.products ?? [])
    : allProducts.value
  const term = query.value.trim().toLowerCase()
  return term ? source.filter((product) => product.name.toLowerCase().includes(term)) : source
})
</script>

<template>
  <CatalogHero :outlet-name="shop.info?.outlet.name" />

  <section class="mt-10" aria-labelledby="catalog-title">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 id="catalog-title" class="text-xl font-semibold tracking-tight">Produk</h2>
        <p class="text-xs text-muted-foreground">{{ allProducts.length }} produk tersedia</p>
      </div>
      <label class="relative sm:w-72">
        <span class="sr-only">Cari produk</span>
        <Search class="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
        <input v-model="query" type="search" placeholder="Cari produk..." class="field rounded-full pl-10" />
      </label>
    </div>

    <div v-if="categories.length > 1" class="mt-5"><CategoryTabs v-model="activeCategory" :categories="categories" /></div>

    <div class="mt-6">
      <div v-if="loading" class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        <div v-for="index in 8" :key="index" class="aspect-[3/4] animate-pulse rounded-3xl bg-muted"></div>
      </div>
      <MessageView v-else-if="error" title="Gagal memuat produk" :message="error">
        <button type="button" class="btn btn-primary" @click="load">Coba lagi</button>
      </MessageView>
      <div v-else-if="visibleProducts.length" class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        <ProductCard v-for="product in visibleProducts" :key="product.uuid" :product="product" />
      </div>
      <EmptyState v-else :icon="PackageSearch" title="Produk tidak ditemukan" description="Coba kata kunci atau kategori lain." />
    </div>
  </section>
</template>
