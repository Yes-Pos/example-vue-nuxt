import type { ProductCategory, ProductDetail } from '../../../app/types'
import { shop } from './http'

/** Products of the shop outlet, grouped by category. */
export const getProducts = (): Promise<ProductCategory[]> => shop().products()

export const getProduct = (productUuid: string): Promise<ProductDetail> => shop().product(productUuid)
