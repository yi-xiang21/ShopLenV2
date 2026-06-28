export interface Billing {
  phuong_xa_id: number,
  dia_chi_giao_hang: string,
  ten_nguoi_nhan: string,
  sdt_nguoi_nhan: string,
  phieu_giam_gia_code: string,
  phuong_thuc_thanh_toan: string,
  shipping_method_id: string,
}

export interface shippingMethod 
{
    method_id: string,
    name: string,
    fee: number,
    estimated_time: string
}
export interface City {
  city_code: string;
  city_name: string;
}
export interface Ward {
  ward_code: number;
  ward_name: string;
}