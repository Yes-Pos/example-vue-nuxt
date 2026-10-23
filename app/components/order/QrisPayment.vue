<script setup lang="ts">
import QRCode from 'qrcode'
import { Download, LoaderCircle, QrCode } from 'lucide-vue-next'
import { formatRupiah } from '~/utils/format'

const props = defineProps<{ qrString: string; total: number; orderUuid: string }>()

const qrImage = ref('')
watch(
  () => props.qrString,
  (qrString) => {
    qrImage.value = ''
    QRCode.toDataURL(qrString, { margin: 1, width: 640, errorCorrectionLevel: 'M' }).then((image) => (qrImage.value = image))
  },
  { immediate: true }
)
</script>

<template>
  <div class="flex flex-col items-center text-center">
    <span class="chip bg-background text-muted-foreground"><QrCode class="size-3.5" /> QRIS</span>
    <div class="mt-4 grid size-68 place-items-center rounded-3xl bg-white p-4 shadow-sm sm:size-80">
      <img v-if="qrImage" :src="qrImage" alt="QR code pembayaran" class="size-full" />
      <LoaderCircle v-else class="size-6 animate-spin text-neutral-400" />
    </div>
    <p class="mt-4 font-mono text-2xl font-semibold tabular-nums">{{ formatRupiah(total) }}</p>
    <p class="mt-1 max-w-xs text-sm text-muted-foreground">Scan dengan aplikasi e-wallet atau m-banking yang mendukung QRIS.</p>
    <a v-if="qrImage" :href="qrImage" :download="`qris-${orderUuid.slice(0, 8)}.png`" class="btn btn-ghost mt-4">
      <Download class="size-4" /> Simpan QR
    </a>
  </div>
</template>
