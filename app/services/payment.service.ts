import type { PaymentMethod } from '~/types'
import { api } from './api'

export const getPaymentMethods = async () => (await api.get<PaymentMethod[]>('/payment-methods')).data
