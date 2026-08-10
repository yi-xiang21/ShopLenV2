export const TRANSACTION_TYPE = [
  { label: 'Nhập kho (Stock In)', value: 'nhap_kho' },
  { label: 'Xuất kho (Stock Out)', value: 'xuat_ban' },
  { label: 'Kiểm kho (Stock Check)', value: 'kiem_kho' },
  {
    label: 'Hoàn trả (Stock refund)', value: 'hoan_tra'
  }

] as const;
export type transaction_type = typeof TRANSACTION_TYPE[number]["value"];

export interface stock {
  variant_id: number;
  quantity_change?: number;
  physical_quantity?: number;
  transaction_type?: transaction_type;
  unit_cost?: number;
  note?: string;
  sku?: string;
  reference_code?: string;
}


export interface StockHistoryItem {
  created_at : string;
  history_id : string;
  note : string;
  quantity_change :number;
  reference_code :string | null;
  new_stock : number;
  unit_cost : number;
  total_cost : number;
  transaction_type : transaction_type;
}

export interface StockHistory {
  sku: string;
  history: StockHistoryItem[];
}


