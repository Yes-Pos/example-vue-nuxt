import { defineEventHandler, readBody } from 'h3'
import type { CheckoutRequest } from '../../../app/types'
import { ApiError } from '../../utils/yespos/http'
import { placeOrder } from '../../utils/yespos/order'
import { respond } from '../../utils/yespos/respond'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** POST /api/orders: places an order; prices are looked up on the server. */
export default defineEventHandler((event) =>
  respond(
    event,
    async () => {
      const body = (await readBody<CheckoutRequest>(event).catch(() => null)) as CheckoutRequest | null
      const lines = Array.isArray(body?.lines)
        ? body.lines.filter((line) => typeof line?.productUuid === 'string' && Number.isFinite(line?.quantity))
        : []
      const name = body?.name?.trim() ?? ''
      const email = body?.email?.trim() ?? ''
      const phone = body?.phone?.trim() ?? ''

      if (!lines.length) throw new ApiError(400, 'Keranjang masih kosong.')
      if (!name || !phone) throw new ApiError(400, 'Nama dan nomor HP wajib diisi.')
      if (!EMAIL.test(email)) throw new ApiError(400, 'Email tidak valid.')
      if (!body?.payment) throw new ApiError(400, 'Pilih metode pembayaran.')

      return placeOrder(lines, { name, email, phone }, body.payment)
    },
    201
  )
)
