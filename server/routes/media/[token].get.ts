import { createError, defineEventHandler, getRouterParam, setResponseHeader } from 'h3'
import { mediaBaseUrl } from '../../utils/yespos/http'

/**
 * GET /media/:token: product images served from the shop's own origin. They are
 * fetched from YESPOS_API_BASE_URL, so they load even when the URLs the API
 * builds (from the backend HOST setting) are not reachable from the browser.
 */
export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token') ?? ''
  if (!/^[\w.-]+$/.test(token)) throw createError({ statusCode: 400, statusMessage: 'Token gambar tidak valid.' })
  const upstream = await fetch(`${mediaBaseUrl()}/${token}`).catch(() => null)
  const contentType = upstream?.headers.get('content-type') ?? ''
  if (!upstream?.ok || !contentType.startsWith('image/')) {
    throw createError({ statusCode: 404, statusMessage: 'Gambar tidak ditemukan.' })
  }
  setResponseHeader(event, 'Content-Type', contentType)
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600')
  return Buffer.from(await upstream.arrayBuffer())
})
