import type { Outlet } from '../../../app/types'
import { shop } from './http'

export const getOutlets = (): Promise<Outlet[]> => shop().client.outlets.list()

/** The outlet the shop sells from: YESPOS_OUTLET_UUID, or the client's first outlet. */
export const getShopOutlet = (): Promise<Outlet> => shop().outlet()
