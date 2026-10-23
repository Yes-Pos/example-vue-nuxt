<script setup lang="ts">
import OrderDetailView from '~/views/OrderDetailView.vue'

const route = useRoute()
useHead({ title: 'Detail pesanan' })
</script>

<template>
  <OrderDetailView :uuid="String(route.params.uuid ?? '')" />
</template>
