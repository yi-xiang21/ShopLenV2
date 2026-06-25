export interface cart {
  cart_id?: number;
  color?: string;
  variant_id: number;
  quantity: number;
  product_id?: number;
  product_name?: string;
  image_url?: string;
  price?: string;
  size?: string;
  stock_quantity?: number;
  sku?: string;
  slug?: string;
}

export interface CartSync {
    local_cart: cart[];
}
