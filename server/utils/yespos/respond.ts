import { setResponseStatus, type H3Event } from 'h3'
import { ApiError } from './http'

/**
 * Runs a BFF handler and answers plain JSON, so the browser's network log shows
 * readable data; errors become { "message": "..." } with the API's status.
 */
export async function respond(event: H3Event, handler: () => Promise<unknown>, status = 200): Promise<unknown> {
  try {
    const data = await handler()
    setResponseStatus(event, status)
    return data
  } catch (err) {
    if (err instanceof ApiError) {
      // A network failure carries status 0, which is not a valid HTTP status.
      setResponseStatus(event, err.status || 502)
      return { message: err.message }
    }
    console.error(err)
    setResponseStatus(event, 500)
    return { message: 'Terjadi kesalahan pada server toko.' }
  }
}
