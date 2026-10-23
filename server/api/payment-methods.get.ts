import { defineEventHandler } from 'h3'
import { getPaymentMethods } from '../utils/yespos/payment'
import { respond } from '../utils/yespos/respond'

/** GET /api/payment-methods: methods the client owner activated. */
export default defineEventHandler((event) => respond(event, getPaymentMethods))
