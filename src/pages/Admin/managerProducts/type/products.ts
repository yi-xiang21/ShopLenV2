export interface image  {
    image_id?: number,
    image_url: string,
    sort_order: number
}
export interface Variant {
    variant_id?: number,
    sku: string,
    slug?: string,
    price: string,
    color: string,
    size: string,
    images: image[]
}
export interface Product {
    product_id?: number,
    type_id?: number,
    category_id?: number,
    product_name: string,
    description: string,
    product_status: string,
    category_name?: string,
    type_name?: string,
    variants: Variant[]
}