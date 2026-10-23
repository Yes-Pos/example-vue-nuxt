<script setup lang="ts">
import { Building2 } from 'lucide-vue-next'
import CopyButton from '~/components/common/CopyButton.vue'
import { formatRupiah, paymentLabel } from '~/utils/format'
import type { Order } from '~/types'

defineProps<{ order: Order }>()
</script>

<template>
  <div>
    <span class="chip bg-background text-muted-foreground">
      <Building2 class="size-3.5" />
      {{ paymentLabel(order.payment_method, order.payment_channel) }}
    </span>
    <div class="mt-4 rounded-2xl bg-muted/60 p-4">
      <p class="text-xs text-muted-foreground">Nomor Virtual Account</p>
      <div class="mt-1 flex flex-wrap items-center justify-between gap-3">
        <p class="font-mono text-2xl font-semibold tracking-wider tabular-nums">{{ order.payment_no }}</p>
        <CopyButton :value="order.payment_no ?? ''" />
      </div>
      <p v-if="order.payment_name" class="mt-1 text-xs text-muted-foreground">a.n. {{ order.payment_name }}</p>
    </div>
    <div class="mt-3 flex items-center justify-between rounded-2xl bg-muted/60 p-4">
      <div>
        <p class="text-xs text-muted-foreground">Total transfer</p>
        <p class="font-mono text-lg font-semibold tabular-nums">{{ formatRupiah(order.total_payment) }}</p>
      </div>
      <CopyButton :value="String(order.total_payment)" label="Salin jumlah" />
    </div>
    <ol class="mt-5 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
      <li>Buka m-banking, internet banking, atau ATM {{ order.payment_channel?.toUpperCase() }}.</li>
      <li>Pilih menu transfer ke Virtual Account.</li>
      <li>Masukkan nomor VA di atas dan pastikan jumlahnya sesuai.</li>
      <li>Setelah membayar, tekan <span class="font-medium text-foreground">Cek status</span> untuk memperbarui status pesanan.</li>
    </ol>
  </div>
</template>
