<script setup lang="ts">
import { Moon, Receipt, ShoppingBag, Store, Sun } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { useShopStore } from '~/stores/shop'
import { useThemeStore } from '~/stores/theme'

defineProps<{ storeName: string }>()

const cart = useCartStore()
const shop = useShopStore()
const theme = useThemeStore()
const outletName = computed(() => shop.info?.outlet.name)
</script>

<template>
  <header class="glass sticky top-0 z-40 border-b border-border">
    <div class="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
      <NuxtLink to="/" class="flex min-w-0 items-center gap-2.5">
        <span class="grid size-9 place-items-center rounded-2xl bg-primary text-primary-foreground">
          <Store class="size-4" />
        </span>
        <span class="min-w-0">
          <span class="block truncate text-sm font-semibold tracking-tight">{{ storeName }}</span>
          <span v-if="outletName" class="block truncate text-xs text-muted-foreground">{{ outletName }}</span>
        </span>
      </NuxtLink>

      <nav class="ml-auto flex items-center gap-1">
        <NuxtLink to="/orders" class="btn-icon" aria-label="Pesanan saya" title="Pesanan saya">
          <Receipt class="size-4" />
        </NuxtLink>
        <button type="button" class="btn-icon" aria-label="Ganti tema" title="Ganti tema" @click="theme.toggle()">
          <Sun v-if="theme.dark" class="size-4" />
          <Moon v-else class="size-4" />
        </button>
        <NuxtLink to="/cart" class="btn btn-primary ml-1 py-2 pr-3 pl-3.5" aria-label="Keranjang">
          <ShoppingBag class="size-4" />
          <span class="hidden sm:inline">Keranjang</span>
          <!-- The cart lives in localStorage: the server can only render 0. -->
          <span class="grid min-w-5 place-items-center rounded-full bg-primary-foreground/15 px-1.5 font-mono text-xs tabular-nums">
            <ClientOnly fallback-tag="span" fallback="0">{{ cart.count }}</ClientOnly>
          </span>
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
