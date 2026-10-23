<script setup lang="ts">
import type { NuxtError } from '#app'
import MessageView from '~/views/MessageView.vue'

const props = defineProps<{ error: NuxtError }>()
</script>

<template>
  <NuxtLayout>
    <MessageView
      :code="props.error.statusCode"
      :title="props.error.statusCode === 404 ? 'Halaman tidak ditemukan' : 'Terjadi kesalahan'"
      :message="props.error.statusMessage || props.error.message"
    >
      <button type="button" class="btn btn-primary" @click="clearError({ redirect: '/' })">Kembali ke toko</button>
    </MessageView>
  </NuxtLayout>
</template>
