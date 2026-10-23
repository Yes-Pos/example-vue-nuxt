<script setup lang="ts">
import { ArrowLeftRight, LoaderCircle, TriangleAlert } from 'lucide-vue-next'
import PaymentMethodPicker from '~/components/cart/PaymentMethodPicker.vue'
import { errorMessage } from '~/services/api'
import { changeOrderPayment } from '~/services/order.service'
import { getPaymentMethods } from '~/services/payment.service'
import type { Order, PaymentMethod } from '~/types'

const props = defineProps<{ order: Order }>()
const emit = defineEmits<{ changed: [order: Order] }>()

const open = ref(false)
const methods = ref<PaymentMethod[]>([])
const loadError = ref('')
const selected = ref('')
const saving = ref(false)
const error = ref('')

const current = computed(() => `${props.order.payment_method}:${props.order.payment_channel ?? ''}`)

// Methods are loaded only when the buyer wants to switch.
const show = async () => {
  open.value = true
  error.value = ''
  selected.value = current.value
  if (methods.value.length) return
  try {
    methods.value = await getPaymentMethods()
  } catch (err) {
    loadError.value = errorMessage(err)
  }
}

const confirm = async () => {
  saving.value = true
  error.value = ''
  try {
    // The buyer saved with the order is reused by YesPOS; nothing to fill in again.
    emit('changed', await changeOrderPayment(props.order.uuid, selected.value))
    open.value = false
  } catch (err) {
    error.value = errorMessage(err)
  } finally {
    saving.value = false
  }
}

// Picking the current method again renews its payment (e.g. an expired VA).
const label = computed(() => (selected.value === current.value ? 'Buat ulang tagihan' : 'Gunakan metode ini'))
</script>

<template>
  <button v-if="!open" type="button" class="btn btn-ghost w-full" @click="show">
    <ArrowLeftRight class="size-4" /> Ganti metode pembayaran
  </button>
  <div v-else class="flex flex-col gap-3">
    <PaymentMethodPicker v-if="methods.length || loadError" v-model="selected" :methods="methods" :error="loadError" />
    <div v-else class="flex h-32 items-center justify-center rounded-3xl bg-muted text-sm text-muted-foreground">
      <LoaderCircle class="mr-2 size-4 animate-spin" /> Memuat metode pembayaran...
    </div>

    <p class="px-1 text-xs text-muted-foreground">Tagihan lama tetap berlaku sampai kedaluwarsa; bayar dengan salah satunya saja.</p>

    <p v-if="error" class="flex gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive" role="alert">
      <TriangleAlert class="size-3.5 flex-shrink-0" />
      {{ error }}
    </p>

    <div class="grid grid-cols-2 gap-2">
      <button type="button" class="btn btn-ghost" :disabled="saving" @click="open = false">Batal</button>
      <button type="button" class="btn btn-primary" :disabled="saving || !selected || !methods.length" @click="confirm">
        <template v-if="saving"><LoaderCircle class="size-4 animate-spin" /> Memproses...</template>
        <template v-else>{{ label }}</template>
      </button>
    </div>
  </div>
</template>
