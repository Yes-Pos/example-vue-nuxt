import { defineEventHandler } from 'h3'
import { getProducts } from '../../utils/yespos/product'
import { respond } from '../../utils/yespos/respond'

/** GET /api/products: the shop outlet's products grouped by category. */
export default defineEventHandler((event) => respond(event, getProducts))
