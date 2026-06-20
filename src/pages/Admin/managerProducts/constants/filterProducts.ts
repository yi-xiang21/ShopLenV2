import type { FilterField } from "@/share/types/filter_param";
import { FormFieldType } from "@/share/types/type-form-field";
import { categoryApi } from "../../managerCatelogy/api/cate_api";

export const filterProducts: FilterField[] = [
  {
    key: 'keyword',
    label: 'Tìm kiếm',
    type: FormFieldType.Input,
    placeholder: 'Nhập từ khóa...',
  },
  {
    key: 'type_ids',
    label: 'Loại sản phẩm',
    type: FormFieldType.Select,
    placeholder: 'Chọn loại sản phẩm',
    options: [
      { label: 'Len cuộn', value: 1 },
        { label: 'Công cụ', value: 2 },
    ],
    mode: 'multiple',
  },
  {
    key: 'category_ids', 
    label: 'Danh mục',
    type: FormFieldType.SelectFetch, 
    placeholder: 'Chọn danh mục',
    width: 200,
    fetchOptions: async () => {
      try {
      const response = await categoryApi.getAll(1, 1000);
      const categories = response.data?.data?.categories || [];
      return categories.flatMap((parent: { children: any[] }) => 
        parent.children.map((child: { id: number; category_name: string }) => ({
          label: child.category_name,
          value: child.id,
        }))
      );
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
      return [];
    }
    },
    mode: 'multiple',
  },
  {
    key: 'status',
    label: 'Trạng thái',
    type: FormFieldType.Select,
    placeholder: 'Chọn trạng thái',
    width: 200,
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
];
  