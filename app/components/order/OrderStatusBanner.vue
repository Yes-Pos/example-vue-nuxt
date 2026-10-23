<script setup lang="ts">
import { CircleCheck, CircleX, Clock, RefreshCw } from 'lucide-vue-next'
import Countdown from '~/components/common/Countdown.vue'
import type { OrderState } from '~/types'

const props = defineProps<{ state: OrderState; expiredAt?: string; refreshing: boolean }>()
const emit = defineEmits<{ refresh: [] }>()

const banners = {
  pending: { icon: Clock, title: 'Menunggu pembayaran', text: 'Selesaikan pembayaran sebelum batas waktu.', tone: 'bg-warning/15 text-warning' },
  paid: { icon: CircleCheck, title: 'Pembayaran berhasil', text: 'Terima kasih! Pesananmu sedang diproses.', tone: 'bg-success/15 text-success' },
  failed: { icon: CircleX, title: 'Pembayaran tidak berhasil', text: 'Pembayaran gagal atau kedaluwarsa.', tone: 'bg-destructive/15 text-destructive' }
}
const banner = computed(() => banners[props.state])
</script>

<template>
  <section class="card flex items-start gap-4 p-5">
    <div class="grid size-12 flex-shrink-0 place-items-center rounded-full" :class="banner.tone">
      <component :is="banner.icon" class="size-6" />
    </div>
    <div class="min-w-0 flex-1">
      <h1 class="text-lg font-semibold tracking-tight">{{ banner.title }}</h1>
      <p class="text-sm text-muted-foreground">{{ banner.text }}</p>
      <p v-if="state === 'pending' && expiredAt" class="mt-2 text-xs text-muted-foreground">Sisa waktu <Countdown :until="expiredAt" /></p>
    </div>
    <!-- The status is checked only on request, not polled. -->
    <button type="button" class="btn btn-ghost flex-shrink-0 px-3.5 py-2" :disabled="refreshing" @click="emit('refresh')">
      <RefreshCw class="size-4" :class="{ 'animate-spin': refreshing }" />
      <span>{{ refreshing ? 'Mengecek...' : 'Cek status' }}</span>
    </button>
  </section>
</template>
