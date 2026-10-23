import { defineEventHandler } from 'h3'
import { useRuntimeConfig } from '#imports'
import { getShopOutlet } from '../utils/yespos/outlet'
import { respond } from '../utils/yespos/respond'

/** GET /api/shop: the shop name and the outlet it sells from. */
export default defineEventHandler((event) =>
  respond(event, async () => ({ store_name: useRuntimeConfig(event).public.storeName, outlet: await getShopOutlet() }))
)
