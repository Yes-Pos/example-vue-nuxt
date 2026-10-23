<script setup lang="ts">
import { Check, Copy } from 'lucide-vue-next'

const props = withDefaults(defineProps<{ value: string; label?: string }>(), { label: 'Salin' })
const copied = ref(false)

const copy = async () => {
  try {
    await navigator.clipboard.writeText(props.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    // Clipboard can be blocked; the value stays selectable on the page.
  }
}
</script>

<template>
  <button type="button" class="btn btn-ghost px-3 py-1.5 text-xs" aria-live="polite" @click="copy">
    <template v-if="copied"><Check class="size-3.5 text-success" /> Tersalin</template>
    <template v-else><Copy class="size-3.5" /> {{ label }}</template>
  </button>
</template>
