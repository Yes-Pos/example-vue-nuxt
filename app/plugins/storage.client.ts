import { useCartStore } from '~/stores/cart'
import { useOrdersStore } from '~/stores/orders'
import { useThemeStore } from '~/stores/theme'

/**
 * Reads localStorage only after hydration, so the server and the first client
 * render match (an empty cart), then the saved cart, orders and theme appear.
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    useCartStore().hydrate()
    useOrdersStore().hydrate()
    useThemeStore().sync()
  })
})
