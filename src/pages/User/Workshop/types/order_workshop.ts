export interface orderWorkShopitems {
  variant_id: number;
  quantity: number;
}

export interface orderWorkShop {
  ten_nguoi_nhan: string;
    sdt_nguoi_nhan: string;
    dia_chi_giao_hang: string;
    phuong_xa_id?: null;
    shipping_method_id?: null;
    phuong_thuc_thanh_toan: "MOMO";
    phieu_giam_gia_code?: string;
  buy_now_item: orderWorkShopitems;
}