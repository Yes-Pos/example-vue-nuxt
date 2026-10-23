<script setup lang="ts">
import ProductDetailView from '~/views/ProductDetailView.vue'

const route = useRoute()
</script>

<template>
  <ProductDetailView :uuid="String(route.params.uuid ?? '')" />
</template>
