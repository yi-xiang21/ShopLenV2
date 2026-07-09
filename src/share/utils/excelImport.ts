import * as xlsx from 'xlsx';
import { categoryApi } from '@/pages/Admin/managerCatelogy/api/cate_api';
import { getLeafCategories } from '@/pages/Admin/managerCatelogy/constants/getParentCate';


export const importProductsFromExcel = (file: File, imageMap: Record<string, string> = {}): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        
        const workbook = xlsx.read(data, { type: 'binary' });

        
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

       
        const rawRows = xlsx.utils.sheet_to_json(worksheet) as any[];

        // Dùng Map để nhóm các biến thể có cùng tên sản phẩm
        const productsMap = new Map<string, any>();

        rawRows.forEach((row) => {
          const productName = row['product_name'] || row['Tên sản phẩm'];
          const imageUrl = row['image_url'] || row['URL Ảnh'];
          if (!productName) return; // Bỏ qua nếu không có tên sản phẩm

          const price = Number(row['price'] || row['Giá'] || 0);
          const color = String(row['color'] || row['Màu sắc'] || '');
          const size = String(row['size'] || row['Kích thước'] || '');
          // Hỗ trợ nhập nhiều ảnh cách nhau bằng dấu phẩy
          const rawUrls = imageUrl ? String(imageUrl).split(',') : [];
          const images = rawUrls
            .map(url => url.trim())
            .filter(url => url !== '')
            .map((url, index) => {
               // Nếu người dùng chọn file ảnh tải lên kèm, ta sẽ đổi tên file thành chuỗi base64
               const matchedBase64 = imageMap[url];
               return { 
                 image_url: matchedBase64 || url, 
                 sort_order: 1 + index 
               };
            });

          const variant = {
            price: price,
            color: color,
            size: size,
            images: images,
          };

          if (productsMap.has(productName)) {
            const existingProduct = productsMap.get(productName)!;
            
            // Tìm xem biến thể đã tồn tại chưa (dựa trên màu sắc và kích thước)
            const existingVariant = existingProduct.variants.find(
              (v: any) => v.color === color && v.size === size
            );

            if (existingVariant) {
              // Biến thể đã tồn tại, gộp thêm danh sách ảnh vào
              const currentLength = existingVariant.images.length;
              const newImages = variant.images.map((img: any, idx: number) => ({
                ...img,
                sort_order: currentLength + 1 + idx
              }));
              existingVariant.images = existingVariant.images.concat(newImages);
            } else {
              // Chưa có biến thể này -> tạo mới biến thể
              existingProduct.variants.push(variant);
            }
          } else {
            // Chưa có sản phẩm -> Tạo mới
            
            const newProduct = {
              type_id: Number(row['type_id'] || row['ID Loại']) || undefined,
              category_id: Number(row['category_id'] || row['ID Danh mục']) || undefined,
              product_name: productName,
              description: row['description'] || row['Mô tả'] || '',
              product_status: row['product_status'] || row['Trạng thái'] || 'active',
              variants: [variant],
              
            };
            productsMap.set(productName, newProduct);
          }
        });

        resolve(Array.from(productsMap.values()));
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);

    reader.readAsBinaryString(file);
  });
};

export const downloadProductTemplate = async () => {
    const templateData = [
        {
            "type_id": 1,
            "category_id": 2,
            "product_name": "Cuộn len Cotton Milk 50g",
            "description": "Len sợi mềm mại, an toàn cho da em bé.",
            "product_status": "active",
            "image_url": "https://example.com/images/len-red.jpg, https://example.com/images/len-red-2.jpg",
            "price": 15000,
            "color": "Đỏ",
            "size": "50g"
        },
        {
            "type_id": 1,
            "category_id": 2,
            "product_name": "Cuộn len Cotton Milk 50g",
            "description": "Len sợi mềm mại, an toàn cho da em bé.",
            "product_status": "active",
            "image_url": "https://example.com/images/len-blue.jpg",
            "price": 15000,
            "color": "Xanh dương",
            "size": "50g"
        }
    ];

    const worksheet = xlsx.utils.json_to_sheet(templateData);
    

    const colWidths = [
      { wch: 10 }, // type_id
      { wch: 15 }, // category_id
      { wch: 30 }, // product_name
      { wch: 40 }, // description
      { wch: 15 }, // product_status
      { wch: 50 }, // image_url
      { wch: 15 }, // price
      { wch: 15 }, // color
      { wch: 15 }  // size
    ];
    worksheet['!cols'] = colWidths;

    // Lấy danh mục để tạo sheet Hướng dẫn
    let categoriesData = [];
    try {

        const res = await categoryApi.getAll(1, 1000);
        const categories = res.data?.data?.categories || [];
        
        const leafCats = getLeafCategories(categories);
        categoriesData = leafCats.map((cat: any) => ({
            "ID Danh mục (category_id)": cat.value,
            "Tên danh mục": cat.label || "Danh mục"
        }));
    } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
        categoriesData = [
            { "ID Danh mục (category_id)": "Lỗi tải", "Tên danh mục": "Vui lòng xem danh mục trên hệ thống" }
        ];
    }
    
   
    const typeInstructionData = [
        { "ID Phân loại (type_id)": 1, "Tên phân loại": "Sản phẩm / Len" },
        { "ID Phân loại (type_id)": 2, "Tên phân loại": "Công cụ / Phụ kiện" }
    ];

    const instructionSheet = xlsx.utils.json_to_sheet(categoriesData);
    xlsx.utils.sheet_add_json(instructionSheet, [{ "ID Danh mục (category_id)": "", "Tên danh mục": "" }], { skipHeader: true, origin: -1 });
    xlsx.utils.sheet_add_json(instructionSheet, typeInstructionData, { origin: -1 });
    instructionSheet['!cols'] = [{ wch: 25 }, { wch: 40 }];

    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Template");
    xlsx.utils.book_append_sheet(workbook, instructionSheet, "Hướng Dẫn");
    
    xlsx.writeFile(workbook, "Product_Import_Template.xlsx");
};
