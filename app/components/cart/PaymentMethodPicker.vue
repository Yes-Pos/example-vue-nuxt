<script setup lang="ts">
import { Building2, CreditCard, QrCode } from 'lucide-vue-next'
import { paymentValue } from '~/utils/format'
import type { PaymentMethod, PaymentMethodCode } from '~/types'

const props = withDefaults(defineProps<{ methods: PaymentMethod[]; error?: string }>(), { error: '' })
const value = defineModel<string>({ default: '' })

const groups = computed(() => {
  const by = (code: PaymentMethodCode) => props.methods.filter((method) => method.payment_method === code)
  return [
    { key: 'qris', title: 'QRIS', hint: 'Scan dengan e-wallet atau m-banking', icon: QrCode, methods: by('qris') },
    { key: 'va', title: 'Virtual Account', hint: 'Transfer ke nomor VA bank', icon: Building2, methods: by('va') },
    { key: 'edc', title: 'Kartu (EDC)', hint: 'Bayar dengan kartu debit/kredit', icon: CreditCard, methods: by('edc') }
  ].filter((group) => group.methods.length)
})
</script>

<template>
  <section class="card p-4">
    <h2 class="text-sm font-semibold">Metode pembayaran</h2>
    <p v-if="error" class="mt-3 rounded-2xl bg-destructive/10 px-3 py-2 text-xs text-destructive">{{ error }}</p>
    <p v-else-if="groups.length === 0" class="mt-3 rounded-2xl bg-warning/10 px-3 py-2 text-xs text-warning">
      Belum ada metode pembayaran aktif. Pemilik toko perlu mengaktifkannya di dashboard YesPOS.
    </p>
    <div class="mt-3 flex flex-col gap-3">
      <fieldset v-for="group in groups" :key="group.key">
        <legend class="flex items-center gap-1.5 px-1 text-xs text-muted-foreground">
          <component :is="group.icon" class="size-3.5" />
          {{ group.title }} · {{ group.hint }}
        </legend>
        <div class="mt-1.5 grid gap-1.5" :class="group.key === 'va' ? 'grid-cols-3' : 'grid-cols-1'">
          <label
            v-for="method in group.methods"
            :key="paymentValue(method)"
            class="flex cursor-pointer items-center justify-center rounded-2xl border px-3 py-2.5 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
            :class="value === paymentValue(method) ? 'border-foreground bg-background' : 'border-border hover:border-border-strong'"
          >
            <input v-model="value" type="radio" name="payment" :value="paymentValue(method)" class="sr-only" />
            {{ method.name }}
          </label>
        </div>
      </fieldset>
    </div>
  </section>
</template>
