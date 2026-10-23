<script setup lang="ts">
const props = defineProps<{ until: string }>()

const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => (timer = setInterval(() => (now.value = Date.now()), 1000)))
onBeforeUnmount(() => clearInterval(timer))

const remaining = computed(() => Math.max(0, new Date(props.until).getTime() - now.value))
const pad = (value: number) => String(value).padStart(2, '0')
const text = computed(
  () =>
    `${pad(Math.floor(remaining.value / 3_600_000))}:${pad(Math.floor((remaining.value % 3_600_000) / 60_000))}:${pad(Math.floor((remaining.value % 60_000) / 1000))}`
)
</script>

<template>
  <span class="font-mono tabular-nums">{{ remaining > 0 ? text : 'Kedaluwarsa' }}</span>
</template>
