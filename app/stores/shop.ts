import { defineStore } from 'pinia'
import { errorMessage } from '~/services/api'
import { getShop, type ShopInfo } from '~/services/shop.service'

/** The shop name and outlet, loaded once for the whole app. */
export const useShopStore = defineStore('shop', {
  state: () => ({ info: null as ShopInfo | null, loading: true, error: '' }),
  actions: {
    async load() {
      this.loading = true
      this.error = ''
      try {
        this.info = await getShop()
      } catch (err) {
        this.error = errorMessage(err)
      } finally {
        this.loading = false
      }
    }
  }
})
