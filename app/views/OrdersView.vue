<script setup lang="ts">
import { ChevronRight, Receipt } from 'lucide-vue-next'
import EmptyState from '~/components/common/EmptyState.vue'
import { useOrdersStore } from '~/stores/orders'
import { formatDate, formatRupiah, paymentLabel } from '~/utils/format'

const recentOrders = useOrdersStore()
</script>

<template>
  <h1 class="text-3xl font-semibold tracking-tight">Pesanan saya</h1>
  <p class="mt-1 text-sm text-muted-foreground">Pesanan yang dibuat dari perangkat ini.</p>

  <div class="mt-6">
    <!-- The history lives in localStorage: the server can only render the skeleton. -->
    <ClientOnly>
      <template #fallback>
        <div class="h-40 animate-pulse rounded-3xl bg-muted"></div>
      </template>
    <div v-if="!recentOrders.ready" class="h-40 animate-pulse rounded-3xl bg-muted"></div>
    <EmptyState v-else-if="recentOrders.list.length === 0" :icon="Receipt" title="Belum ada pesanan">
      <NuxtLink to="/" class="btn btn-primary">Mulai belanja</NuxtLink>
    </EmptyState>
    <ul v-else class="card divide-y divide-border p-2">
      <li v-for="order in recentOrders.list" :key="order.uuid">
        <NuxtLink :to="`/orders/${order.uuid}`" class="group flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-background">
          <span class="grid size-10 place-items-center rounded-2xl bg-background text-muted-foreground">
            <Receipt class="size-4" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block font-mono text-sm font-medium">#{{ order.uuid.slice(0, 8).toUpperCase() }}</span>
            <span class="block text-xs text-muted-foreground">{{ formatDate(order.createdAt) }} · {{ paymentLabel(order.method) }}</span>
          </span>
          <span class="font-mono text-sm font-semibold tabular-nums">{{ formatRupiah(order.total) }}</span>
          <ChevronRight class="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </NuxtLink>
      </li>
    </ul>
    </ClientOnly>
  </div>
</template>
