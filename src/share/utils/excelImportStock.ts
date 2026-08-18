import * as xlsx from 'xlsx';
import { stockApi } from '@/pages/Admin/managerStock/api/stock_api';
import type { stock } from '@/pages/Admin/managerStock/type/stock';


export const downloadStockTemplate = async () => {
  try {
    // Gọi API lấy thông tin tồn kho hiện tại (có thể điều chỉnh limit nếu cần)
    const response = await stockApi.filter({ page: 1, limit: 1000 });
    const inventory = response.data?.data?.inventory || [];

    const templateData: any[] = [];

    // Duyệt qua từng sản phẩm tồn kho để tạo dòng trong file Excel
    inventory.forEach((item: any) => {
      templateData.push({
        "variant_id": item.variant_id,
        "SKU": item.sku || "",
        "Phân loại (Màu - Size)": `${item.color || ""} - ${item.size || ""}`.trim(),
        "Tồn kho khả dụng (Available)": item.available_stock || 0,
        "Tồn kho đang giữ (Reserved)": item.reserved_stock || 0,
        "Tồn kho thực tế (Physical)": item.physical_stock || 0,
        "transaction_type": "nhap_kho", 
        "unit_cost": 0,
        "quantity_change": 0,
        "physical_quantity": "",
        "note": ""
      });
    });

    // Nếu không có sản phẩm nào, tạo 1 dòng mẫu giả định
    if (templateData.length === 0) {
      templateData.push({
        "variant_id": 1,
        "SKU": "SP-001",
        "Phân loại (Màu - Size)": "Đỏ - L",
        "Tồn kho khả dụng (Available)": 100,
        "Tồn kho đang giữ (Reserved)": 5,
        "Tồn kho thực tế (Physical)": 105,
        "transaction_type": "nhap_kho",
        "quantity_change": 10,
        "physical_quantity": "",
        "unit_cost": 0,
        "note": "Nhập kho đợt 1"
      });
    }

    const worksheet = xlsx.utils.json_to_sheet(templateData);
    

    const colWidths = [
      { wch: 10 }, // variant_id
      { wch: 15 }, // SKU
      { wch: 25 }, // Phân loại
      { wch: 25 }, // Available
      { wch: 25 }, // Reserved
      { wch: 25 }, // Physical
      { wch: 20 }, // transaction_type
      { wch: 15 }, // quantity_change
      { wch: 15 }, // physical_quantity
      { wch: 30 }  // note
    ];
    worksheet['!cols'] = colWidths;

    
    const instructionData = [
      { "Cột": "transaction_type", "Giá trị hợp lệ": "nhap_kho", "Ý nghĩa": "Nhập thêm hàng vào kho. Yêu cầu nhập 'quantity_change'." },
      { "Cột": "transaction_type", "Giá trị hợp lệ": "xuat_ban", "Ý nghĩa": "Xuất bán hàng khỏi kho. Yêu cầu nhập 'quantity_change'." },
      { "Cột": "transaction_type", "Giá trị hợp lệ": "kiem_kho", "Ý nghĩa": "Kiểm kê lại kho (đặt lại số lượng thực tế). Yêu cầu nhập 'physical_quantity'." },
      { "Cột": "transaction_type", "Giá trị hợp lệ": "hoan_tra", "Ý nghĩa": "Khách hàng hoàn trả sản phẩm. Yêu cầu nhập 'quantity_change'." }
    ];
    const instructionSheet = xlsx.utils.json_to_sheet(instructionData);
    instructionSheet['!cols'] = [{ wch: 20 }, { wch: 20 }, { wch: 60 }];

    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Stock_Data");
    xlsx.utils.book_append_sheet(workbook, instructionSheet, "Hướng Dẫn");
    
    xlsx.writeFile(workbook, "Stock_Import_Template.xlsx");

  } catch (error) {
    console.error("Lỗi khi tải template Stock:", error);
    throw error;
  }
}; 

export const importStockFromExcel = (file: File): Promise<stock[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = xlsx.read(data, { type: 'binary' });


        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const rawRows = xlsx.utils.sheet_to_json(worksheet) as any[];
        
        const stockPayloads: stock[] = [];

        rawRows.forEach((row) => {
          const variantId = Number(row['variant_id'] || row['ID Biến thể']);
          const transactionType = row['transaction_type'] || row['Loại giao dịch'];
          
          if (!variantId || !transactionType) return; // Bỏ qua nếu thiếu trường bắt buộc

          const stockItem: stock = {
            variant_id: variantId,
            transaction_type: transactionType as stock["transaction_type"],
          };

          const quantityChange = row['quantity_change'] !== undefined && row['quantity_change'] !== "" 
            ? Number(row['quantity_change']) 
            : undefined;
            
          const physicalQuantity = row['physical_quantity'] !== undefined && row['physical_quantity'] !== "" 
            ? Number(row['physical_quantity']) 
            : undefined;

          const hasQuantityChange = quantityChange !== undefined && !isNaN(quantityChange) && quantityChange !== 0;
          const hasPhysicalQuantity = physicalQuantity !== undefined && !isNaN(physicalQuantity);

          // Bỏ qua dòng này nếu không có nhập số liệu thay đổi
          if (!hasQuantityChange && !hasPhysicalQuantity) return;

          if (hasQuantityChange) stockItem.quantity_change = quantityChange;
          if (hasPhysicalQuantity) stockItem.physical_quantity = physicalQuantity;

          const note = String(row['note'] || row['Ghi chú'] || '').trim();
          if (note) stockItem.note = note;

          stockPayloads.push(stockItem);
        });

        resolve(stockPayloads);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);

    reader.readAsBinaryString(file);
  });
};
