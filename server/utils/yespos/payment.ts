import type { PaymentMethod } from '../../../app/types'
import { shop } from './http'

/** Payment methods the client owner activated; EDC only when its terminal is configured. */
export const getPaymentMethods = (): Promise<PaymentMethod[]> => shop().paymentMethods()
