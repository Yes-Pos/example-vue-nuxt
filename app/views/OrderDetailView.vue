<script setup lang="ts">
import { ArrowLeft, LoaderCircle } from 'lucide-vue-next'
import ChangePaymentPanel from '~/components/order/ChangePaymentPanel.vue'
import EdcPayment from '~/components/order/EdcPayment.vue'
import OrderInfo from '~/components/order/OrderInfo.vue'
import OrderItems from '~/components/order/OrderItems.vue'
import OrderStatusBanner from '~/components/order/OrderStatusBanner.vue'
import QrisPayment from '~/components/order/QrisPayment.vue'
import VaPayment from '~/components/order/VaPayment.vue'
import MessageView from '~/views/MessageView.vue'
import { errorMessage } from '~/services/api'
import { getOrder } from '~/services/order.service'
import { useOrdersStore } from '~/stores/orders'
import { orderState } from '~/utils/format'
import type { Order } from '~/types'

const props = defineProps<{ uuid: string }>()
const recentOrders = useOrdersStore()

const order = ref<Order | null>(null)
const error = ref('')
const refreshing = ref(false)

const paymentState = computed(() => (order.value ? orderState(order.value.status) : 'pending'))

// Loads the order when the page opens and when "Cek status" is pressed; the
// status is never polled.
const refresh = async () => {
  refreshing.value = true
  try {
    order.value = await getOrder(props.uuid)
    error.value = ''
  } catch (err) {
    // Keep showing the last known order if a check fails.
    if (!order.value) error.value = errorMessage(err)
  } finally {
    refreshing.value = false
  }
}

onMounted(refresh)
watch(
  () => props.uuid,
  () => {
    order.value = null
    refresh()
  }
)

const onPaymentChanged = (changed: Order) => {
  order.value = changed
  recentOrders.setMethod(changed.uuid, changed.payment_method)
}
</script>

<template>
  <NuxtLink to="/orders" class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
    <ArrowLeft class="size-4" /> Pesanan saya
  </NuxtLink>

  <div v-if="error" class="mt-5">
    <MessageView title="Pesanan tidak dapat dimuat" :message="error">
      <NuxtLink to="/orders" class="btn btn-primary">Lihat pesanan saya</NuxtLink>
    </MessageView>
  </div>
  <div v-else-if="!order" class="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
    <div class="flex flex-col gap-6">
      <div class="h-24 animate-pulse rounded-3xl bg-muted"></div>
      <div class="h-80 animate-pulse rounded-3xl bg-muted"></div>
    </div>
    <div class="h-64 animate-pulse rounded-3xl bg-muted"></div>
  </div>
  <div v-else class="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
    <div class="flex flex-col gap-6">
      <OrderStatusBanner :state="paymentState" :expired-at="order.expired_at" :refreshing="refreshing" @refresh="refresh" />

      <section v-if="paymentState === 'pending'" class="card p-5 sm:p-6">
        <QrisPayment v-if="order.payment_method === 'qris' && order.qr_string" :qr-string="order.qr_string" :total="order.total_payment" :order-uuid="order.uuid" />
        <VaPayment v-else-if="order.payment_method === 'va' && order.payment_no" :order="order" />
        <EdcPayment v-else-if="order.payment_method === 'edc' && order.app_link" :link="order.app_link" :total="order.total_payment" />
        <p v-else class="flex items-center gap-2 text-sm text-muted-foreground">
          <LoaderCircle class="size-4 animate-spin" /> Menyiapkan instruksi pembayaran...
        </p>

        <div class="mt-6 border-t border-border pt-5">
          <ChangePaymentPanel :order="order" @changed="onPaymentChanged" />
        </div>
      </section>

      <OrderItems :items="order.items" :total="order.total_payment" />
    </div>

    <OrderInfo :order="order" />
  </div>
</template>
