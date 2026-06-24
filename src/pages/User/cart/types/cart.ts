export interface cart {
  variant_id: number;
  quantity: number;
}

export interface CartSync {
    local_cart: cart[];
}