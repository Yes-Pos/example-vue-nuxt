<script setup lang="ts">
import { ImageOff } from 'lucide-vue-next'
import { mediaPath } from '~/utils/format'

const props = defineProps<{ url?: string; token?: string; alt: string }>()

// The shop's own /media proxy first (same origin, always reachable), then the
// URL the API built; a placeholder when neither loads.
const sources = computed(() =>
  [mediaPath(props.token), props.url].filter((source, index, all): source is string => !!source && all.indexOf(source) === index)
)

const attempt = ref(0)
watch(sources, () => (attempt.value = 0))
const src = computed(() => sources.value[attempt.value])
</script>

<template>
  <div class="relative overflow-hidden bg-muted">
    <img v-if="src" :src="src" :alt="alt" loading="lazy" class="size-full object-cover" @error="attempt += 1" />
    <div v-else class="grid size-full place-items-center text-muted-foreground/50">
      <ImageOff class="size-1/4 max-h-10 max-w-10" />
    </div>
  </div>
</template>
