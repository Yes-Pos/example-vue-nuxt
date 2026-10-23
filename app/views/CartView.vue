<script setup lang="ts">
import { ShoppingBag } from 'lucide-vue-next'
import EmptyState from '~/components/common/EmptyState.vue'
import CartLineItem from '~/components/cart/CartLineItem.vue'
import CartSummary from '~/components/cart/CartSummary.vue'
import CustomerForm from '~/components/cart/CustomerForm.vue'
import PaymentMethodPicker from '~/components/cart/PaymentMethodPicker.vue'
import { errorMessage } from '~/services/api'
import { createOrder } from '~/services/order.service'
import { getPaymentMethods } from '~/services/payment.service'
import { useCartStore } from '~/stores/cart'
import { useOrdersStore } from '~/stores/orders'
import { paymentValue } from '~/utils/format'
import type { Customer, PaymentMethod } from '~/types'

const cart = useCartStore()
const recentOrders = useOrdersStore()

const paymentMethods = ref<PaymentMethod[]>([])
const methodsError = ref('')
const payment = ref('')
const customer = ref<Customer>({ name: '', email: '', phone: '' })
const submitting = ref(false)
const error = ref('')

onMounted(async () => {
  try {
    paymentMethods.value = await getPaymentMethods()
    payment.value = paymentMethods.value[0] ? paymentValue(paymentMethods.value[0]) : ''
  } catch (err) {
    methodsError.value = errorMessage(err)
  }
})

const submit = async () => {
  submitting.value = true
  error.value = ''
  try {
    // Only uuids and quantities are sent; the server looks up the prices.
    const order = await createOrder({ ...customer.value, payment: payment.value, lines: cart.checkoutLines() })
    recentOrders.add({ uuid: order.uuid, total: order.total_payment, method: order.payment_method, createdAt: order.created_at })
    cart.clear()
    await navigateTo(`/orders/${order.uuid}`)
  } catch (err) {
    error.value = errorMessage(err)
    // The message sits next to the pay button, which may be off screen.
    await nextTick()
    document.querySelector('[data-checkout-error]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <h1 class="text-3xl font-semibold tracking-tight">Keranjang</h1>

  <div class="mt-6">
    <!-- The cart lives in localStorage: the server can only render the skeleton. -->
    <ClientOnly>
      <template #fallback>
        <div class="h-64 animate-pulse rounded-3xl bg-muted"></div>
      </template>
    <div v-if="!cart.ready" class="h-64 animate-pulse rounded-3xl bg-muted"></div>
    <EmptyState v-else-if="cart.lines.length === 0" :icon="ShoppingBag" title="Keranjang masih kosong" description="Yuk pilih produk favoritmu.">
      <NuxtLink to="/" class="btn btn-primary">Lihat produk</NuxtLink>
    </EmptyState>
    <form v-else class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]" @submit.prevent="submit">
      <section class="card divide-y divide-border p-2" aria-label="Isi keranjang">
        <CartLineItem v-for="line in cart.lines" :key="line.productUuid + (line.variantUuid ?? '')" :line="line" />
      </section>

      <aside class="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
        <CustomerForm v-model="customer" />
        <PaymentMethodPicker v-model="payment" :methods="paymentMethods" :error="methodsError" />
        <CartSummary :count="cart.count" :total="cart.total" :error="error" :submitting="submitting" :disabled="!payment" />
      </aside>
    </form>
    </ClientOnly>
  </div>
</template>
