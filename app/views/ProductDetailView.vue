<script setup lang="ts">
import { ArrowLeft, Check, ShoppingBag, Zap } from 'lucide-vue-next'
import ProductImage from '~/components/common/ProductImage.vue'
import QuantityStepper from '~/components/common/QuantityStepper.vue'
import VariantPicker from '~/components/product/VariantPicker.vue'
import MessageView from '~/views/MessageView.vue'
import { errorMessage } from '~/services/api'
import { getProduct } from '~/services/product.service'
import { useCartStore } from '~/stores/cart'
import { formatRupiah } from '~/utils/format'
import { isSoldOut } from '~/utils/product'
import type { ProductDetail } from '~/types'

const props = defineProps<{ uuid: string }>()
const cart = useCartStore()

const product = ref<ProductDetail | null>(null)
const loading = ref(true)
const error = ref('')
const variantUuid = ref('')
const quantity = ref(1)
const added = ref(false)

const load = async (productUuid: string) => {
  loading.value = true
  error.value = ''
  try {
    product.value = await getProduct(productUuid)
  } catch (err) {
    error.value = errorMessage(err)
  } finally {
    loading.value = false
  }
}

// Client-side only, so the request shows in the network log.
onMounted(() => load(props.uuid))
watch(() => props.uuid, load)

useHead(() => ({ title: product.value?.name }))

const variants = computed(() => product.value?.variants ?? [])
const inStock = (stock: number) => !product.value?.track_stock || stock > 0

// Preselect the first variant that can be bought.
watch(
  variants,
  (list) => {
    if (list.length && !list.some((variant) => variant.uuid === variantUuid.value)) {
      variantUuid.value = (list.find((variant) => inStock(variant.current_stock)) ?? list[0])!.uuid
    }
  },
  { immediate: true }
)

const variant = computed(() => variants.value.find((item) => item.uuid === variantUuid.value))
const price = computed(() => (variant.value ? variant.value.price : (product.value?.price ?? 0)))
const stock = computed(() => (variant.value ? variant.value.current_stock : (product.value?.current_stock ?? 0)))
const canBuy = computed(
  () => !!product.value && !isSoldOut(product.value) && inStock(stock.value) && (!variants.value.length || !!variant.value)
)
const maxQuantity = computed(() => (product.value?.track_stock ? Math.max(1, Math.floor(stock.value)) : 999))
// A variant with its own photo shows it; otherwise the product photo.
const imageToken = computed(() => variant.value?.main_image_token || product.value?.main_image_token)
const imageUrl = computed(() => (variant.value?.main_image_token ? variant.value.main_image_url : product.value?.main_image_url))

const addToCart = () => {
  if (!product.value) return
  cart.add({
    productUuid: product.value.uuid,
    variantUuid: variant.value?.uuid,
    name: product.value.name,
    variantName: variant.value?.name,
    price: price.value,
    quantity: quantity.value,
    imageToken: imageToken.value,
    imageUrl: imageUrl.value
  })
  added.value = true
  setTimeout(() => (added.value = false), 1500)
}

const buyNow = () => {
  addToCart()
  navigateTo('/cart')
}
</script>

<template>
  <NuxtLink to="/" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
    <ArrowLeft class="size-4" /> Kembali ke produk
  </NuxtLink>

  <div v-if="loading" class="mt-5 grid gap-6 lg:grid-cols-2 lg:gap-10">
    <div class="aspect-square animate-pulse rounded-3xl bg-muted"></div>
    <div class="flex flex-col gap-3">
      <div class="h-8 w-2/3 animate-pulse rounded-full bg-muted"></div>
      <div class="h-6 w-1/3 animate-pulse rounded-full bg-muted"></div>
      <div class="mt-4 h-32 animate-pulse rounded-3xl bg-muted"></div>
    </div>
  </div>
  <div v-else-if="error || !product" class="mt-5">
    <MessageView title="Produk tidak dapat dimuat" :message="error">
      <NuxtLink to="/" class="btn btn-primary">Kembali ke toko</NuxtLink>
    </MessageView>
  </div>
  <div v-else class="mt-5 grid gap-6 lg:grid-cols-2 lg:gap-10">
    <div class="card p-2">
      <ProductImage :url="imageUrl" :token="imageToken" :alt="product.name" class="aspect-square rounded-2xl" />
    </div>

    <div class="flex flex-col">
      <div v-if="product.categories.length" class="flex flex-wrap gap-1.5">
        <span v-for="category in product.categories" :key="category" class="chip border border-border text-muted-foreground">{{ category }}</span>
      </div>
      <h1 class="mt-3 text-3xl font-semibold tracking-tight">{{ product.name }}</h1>
      <p class="mt-2 font-mono text-2xl font-semibold tabular-nums">{{ formatRupiah(price) }}</p>
      <p class="mt-1 text-xs text-muted-foreground">
        per {{ product.unit }}
        <template v-if="product.track_stock">· {{ inStock(stock) ? `stok ${stock}` : 'stok habis' }}</template>
      </p>

      <p v-if="product.description" class="mt-5 text-sm leading-6 text-muted-foreground">{{ product.description }}</p>

      <div v-if="variants.length" class="mt-6">
        <VariantPicker v-model="variantUuid" :variants="variants" :track-stock="product.track_stock" />
      </div>

      <div class="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-muted/60 p-3.5">
        <div>
          <p class="text-xs text-muted-foreground">Jumlah</p>
          <p class="font-mono text-sm font-semibold tabular-nums">{{ formatRupiah(price * quantity) }}</p>
        </div>
        <QuantityStepper :value="quantity" :max="maxQuantity" @change="(value) => (quantity = value)" />
      </div>

      <div class="mt-4 grid grid-cols-2 gap-2">
        <button type="button" class="btn btn-ghost py-3" :disabled="!canBuy" @click="addToCart">
          <template v-if="added"><Check class="size-4 text-success" /> Ditambahkan</template>
          <template v-else><ShoppingBag class="size-4" /> Keranjang</template>
        </button>
        <button type="button" class="btn btn-primary py-3" :disabled="!canBuy" @click="buyNow">
          <Zap class="size-4" /> Beli sekarang
        </button>
      </div>
      <p v-if="!canBuy" class="mt-3 text-center text-xs text-muted-foreground">Produk ini sedang tidak tersedia.</p>
    </div>
  </div>
</template>
