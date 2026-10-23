import { defineEventHandler, getRouterParam } from 'h3'
import { getProduct } from '../../utils/yespos/product'
import { respond } from '../../utils/yespos/respond'

/** GET /api/products/:uuid: one product of the shop outlet. */
export default defineEventHandler((event) => respond(event, () => getProduct(getRouterParam(event, 'uuid') ?? '')))
