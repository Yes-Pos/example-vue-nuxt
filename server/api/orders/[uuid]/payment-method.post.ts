import { defineEventHandler, getRouterParam, readBody } from 'h3'
import { ApiError } from '../../../utils/yespos/http'
import { changeOrderPayment } from '../../../utils/yespos/order'
import { respond } from '../../../utils/yespos/respond'

/**
 * POST /api/orders/:uuid/payment-method: switches a pending order to another
 * method. YesPOS reuses the buyer saved with the order.
 */
export default defineEventHandler((event) =>
  respond(event, async () => {
    const body = await readBody<{ payment?: string }>(event).catch(() => null)
    if (!body?.payment) throw new ApiError(400, 'Pilih metode pembayaran.')
    return changeOrderPayment(getRouterParam(event, 'uuid') ?? '', body.payment)
  })
)
