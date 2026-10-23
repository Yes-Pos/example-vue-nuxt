import { Shop, YesposError, type ShopOptions } from '@yespos/client'

/** The SDK's error type; kept under the old name so the routes stay unchanged. */
export { YesposError as ApiError } from '@yespos/client'

/** Server-only settings from .env (never sent to the browser). */
export const env = () => process.env

const baseUrl = () => (env().YESPOS_API_BASE_URL || '').replace(/\/+$/, '')

/** Public URL of an uploaded image (GET /media/:token needs no login). */
export const mediaBaseUrl = () => `${baseUrl()}/media`

let instance: Shop | undefined

/**
 * The shop, built from .env. The SDK signs every request with the client
 * secret, so this module must stay on the server.
 */
export function shop(): Shop {
  if (instance) return instance
  const key = env().YESPOS_CLIENT_KEY || ''
  const secret = env().YESPOS_CLIENT_SECRET || ''
  if (!baseUrl() || !key || !secret) {
    throw new YesposError(500, 'Set YESPOS_API_BASE_URL, YESPOS_CLIENT_KEY dan YESPOS_CLIENT_SECRET di .env')
  }

  const { YESPOS_EDC_APP_CODE, YESPOS_EDC_TERMINAL_CODE, YESPOS_EDC_MERCHANT_CODE } = env()
  const edc =
    YESPOS_EDC_APP_CODE && YESPOS_EDC_TERMINAL_CODE && YESPOS_EDC_MERCHANT_CODE
      ? { app_code: YESPOS_EDC_APP_CODE, terminal_code: YESPOS_EDC_TERMINAL_CODE, merchant_code: YESPOS_EDC_MERCHANT_CODE }
      : null
  const options: ShopOptions = {
    outletUuid: env().YESPOS_OUTLET_UUID,
    notifyUrl: env().YESPOS_NOTIFY_URL,
    edc,
    messages: { outletNotFound: 'Outlet toko tidak ditemukan. Periksa YESPOS_OUTLET_UUID.' }
  }
  instance = new Shop({ baseUrl: baseUrl(), key, secret }, options)
  return instance
}
