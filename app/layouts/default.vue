<script setup lang="ts">
import AppFooter from '~/components/layout/AppFooter.vue'
import AppHeader from '~/components/layout/AppHeader.vue'
import { useShopStore } from '~/stores/shop'
import MessageView from '~/views/MessageView.vue'

const storeName = useRuntimeConfig().public.storeName as string
const shop = useShopStore()

useHead({ titleTemplate: (title) => (title ? `${title} · ${storeName}` : storeName) })

// Client-side, so /api/shop shows in the network log like the other requests.
onMounted(() => shop.load())
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader :store-name="storeName" />

    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <MessageView v-if="shop.error" tone="warning" title="Toko belum siap" :message="shop.error">
        <div class="flex flex-col items-center gap-3">
          <button type="button" class="btn btn-primary" @click="shop.load()">Coba lagi</button>
          <p class="text-xs text-muted-foreground">Lihat README.md untuk cara mengisi file <code class="font-mono">.env</code>.</p>
        </div>
      </MessageView>
      <slot v-else />
    </main>

    <AppFooter :store-name="storeName" />
  </div>
</template>
