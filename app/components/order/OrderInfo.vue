<script setup lang="ts">
import { formatDate, paymentLabel } from '~/utils/format'
import type { Order } from '~/types'

const props = defineProps<{ order: Order }>()

const rows = computed(() =>
  [
    { label: 'No. pesanan', value: props.order.uuid.slice(0, 8).toUpperCase(), mono: true },
    { label: 'Tanggal', value: formatDate(props.order.created_at) },
    { label: 'Pembayaran', value: paymentLabel(props.order.payment_method, props.order.payment_channel) },
    { label: 'Status', value: props.order.status, mono: true },
    { label: 'Bayar sebelum', value: props.order.expired_at ? formatDate(props.order.expired_at) : '' },
    { label: 'Ref. iPaymu', value: props.order.reference_ipaymu ?? '', mono: true }
  ].filter((row) => row.value)
)
</script>

<template>
  <aside class="card h-fit p-5 lg:sticky lg:top-24">
    <h2 class="text-sm font-semibold">Info pesanan</h2>
    <dl class="mt-3 flex flex-col gap-2.5 text-sm">
      <div v-for="row in rows" :key="row.label" class="flex justify-between gap-3">
        <dt class="text-muted-foreground">{{ row.label }}</dt>
        <dd :class="row.mono ? 'font-mono text-xs' : ''">{{ row.value }}</dd>
      </div>
    </dl>

    <h2 class="mt-5 border-t border-border pt-4 text-sm font-semibold">Pembeli</h2>
    <dl v-if="order.customer?.name" class="mt-3 flex flex-col gap-2.5 text-sm">
      <div class="flex justify-between gap-3">
        <dt class="text-muted-foreground">Nama</dt>
        <dd class="truncate">{{ order.customer.name }}</dd>
      </div>
      <div class="flex justify-between gap-3">
        <dt class="text-muted-foreground">Email</dt>
        <dd class="truncate">{{ order.customer.email }}</dd>
      </div>
      <div class="flex justify-between gap-3">
        <dt class="text-muted-foreground">No. HP</dt>
        <dd class="font-mono text-xs">{{ order.customer.phone }}</dd>
      </div>
    </dl>
    <p v-else class="mt-2 text-xs text-muted-foreground">Data pembeli belum tersimpan untuk pesanan ini.</p>

    <NuxtLink to="/" class="btn btn-ghost mt-5 w-full">Belanja lagi</NuxtLink>
  </aside>
</template>
