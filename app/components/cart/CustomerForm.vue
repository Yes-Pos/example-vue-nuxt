<script setup lang="ts">
import type { Customer } from '~/types'

const customer = defineModel<Customer>({ required: true })
</script>

<template>
  <section class="card p-4">
    <h2 class="text-sm font-semibold">Data pembeli</h2>
    <div class="mt-3 flex flex-col gap-3">
      <label>
        <span class="label">Nama</span>
        <input v-model="customer.name" class="field" name="name" autocomplete="name" required />
      </label>
      <div class="grid grid-cols-2 gap-3">
        <label>
          <span class="label">No. HP</span>
          <input v-model="customer.phone" class="field" name="phone" type="tel" autocomplete="tel" required />
        </label>
        <label>
          <span class="label">Email</span>
          <input v-model="customer.email" class="field" name="email" type="email" autocomplete="email" required />
        </label>
      </div>
    </div>
  </section>
</template>
