export interface HistoryOrder {
  order_id: string;
  status: string;
  total_amount: string;
  discount_amount: string;
  customer_name: string;
  shipping_address: string;
  created_at: string;
  payment_method: string;
  payment_status: string;
}

export interface OrderItem {
  item_id: number;
  product_name: string;
  price: string;
  quantity: number;
  sku: string;
  color: string | null;
  size: string | null;
  type_name: string;
  image_url: string;
}

export interface OrderDetailData {
  order_id: string;
  status: string;
  total_amount: string;
  discount_amount: string;
  shipping_fee: string;
  shipping_address: string;
  customer_name: string;
  phone_number: string;
  created_at: string;
  items: OrderItem[];
  payment: {
    payment_method: string;
    payment_status: string;
    reference_code: string;
  };
}


