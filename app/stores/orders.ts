import { defineStore } from 'pinia'
import type { RecentOrder } from '~/types'
import { readStorage, writeStorage } from './storage'

const KEY = 'yespos-orders'

/** Orders placed from this browser, newest first (the API lists every order of the client). */
export const useOrdersStore = defineStore('orders', {
  state: () => ({ list: [] as RecentOrder[], ready: false }),
  actions: {
    hydrate() {
      this.list = readStorage(KEY, [])
      this.ready = true
    },
    add(order: RecentOrder) {
      this.list = [order, ...this.list.filter((item) => item.uuid !== order.uuid)].slice(0, 20)
      writeStorage(KEY, this.list)
    },
    /** Records a changed payment method of an order placed here. */
    setMethod(uuid: string, method: string) {
      const order = this.list.find((item) => item.uuid === uuid)
      if (!order) return
      order.method = method
      writeStorage(KEY, this.list)
    }
  }
})
