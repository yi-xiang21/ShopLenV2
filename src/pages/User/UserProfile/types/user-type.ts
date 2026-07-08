export type user = {
  avatar: string;
  user_id: string;
  username: string;
  email: string;
  phone_number: string;
  role: string;
  first_name: string;
  last_name: string;
  loyalty_points?: number,
}
import type { OrderStatusValue } from '@/pages/Admin/managerOrder/type/order';

export interface orderUser {
  order_id: string;
  status: OrderStatusValue;
  total_amount: string;
  discount_amount: string;
  customer_name: string;
  shipping_address: string;
}
