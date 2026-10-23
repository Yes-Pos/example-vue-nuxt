import { defineEventHandler, getRouterParam } from 'h3'
import { ApiError } from '../../../utils/yespos/http'
import { getOrder } from '../../../utils/yespos/order'
import { respond } from '../../../utils/yespos/respond'

/** GET /api/orders/:uuid: one order with its payment details. */
export default defineEventHandler((event) =>
  respond(event, async () => {
    try {
      return await getOrder(getRouterParam(event, 'uuid') ?? '')
    } catch (err) {
      // The API answers an unknown order with 400 "record not found".
      if (err instanceof ApiError && (err.status === 400 || err.status === 404)) throw new ApiError(404, 'Pesanan tidak ditemukan.')
      throw err
    }
  })
)
