export interface WishlistItem {
  product_id: number;
  product_name: string;
  status: string;
  min_price: string;
  image_url: string;
  final_price?: string;
}