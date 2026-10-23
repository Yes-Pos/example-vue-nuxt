import { defineStore } from 'pinia'
import type { CartLine, CheckoutLine } from '~/types'
import { readStorage, writeStorage } from './storage'

const KEY = 'yespos-cart'

const lineKey = (line: Pick<CartLine, 'productUuid' | 'variantUuid'>) => `${line.productUuid}:${line.variantUuid ?? ''}`

/**
 * The shopping cart, kept in localStorage so it survives a reload. It is read
 * after hydration (plugins/storage.client.ts); `ready` tells views when.
 */
export const useCartStore = defineStore('cart', {
  state: () => ({ lines: [] as CartLine[], ready: false }),
  getters: {
    count: (state) => state.lines.reduce((sum, line) => sum + line.quantity, 0),
    total: (state) => state.lines.reduce((sum, line) => sum + line.price * line.quantity, 0)
  },
  actions: {
    hydrate() {
      this.lines = readStorage(KEY, [])
      this.ready = true
    },
    add(line: CartLine) {
      const existing = this.lines.find((item) => lineKey(item) === lineKey(line))
      if (existing) existing.quantity += line.quantity
      else this.lines.push(line)
      this.save()
    },
    setQuantity(line: CartLine, quantity: number) {
      if (quantity <= 0) return this.remove(line)
      const item = this.lines.find((candidate) => lineKey(candidate) === lineKey(line))
      if (item) item.quantity = quantity
      this.save()
    },
    remove(line: CartLine) {
      this.lines = this.lines.filter((item) => lineKey(item) !== lineKey(line))
      this.save()
    },
    clear() {
      this.lines = []
      this.save()
    },
    /** What checkout sends: no prices, the server looks them up. */
    checkoutLines(): CheckoutLine[] {
      return this.lines.map(({ productUuid, variantUuid, quantity }) => ({ productUuid, variantUuid, quantity }))
    },
    save() {
      writeStorage(KEY, this.lines)
    }
  }
})
