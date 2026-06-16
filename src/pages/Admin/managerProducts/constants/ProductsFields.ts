import { FormFieldType } from '@/share/types/type-form-field';
import type { FormField } from '@/share/types/form-field';
import type { Product } from '@/pages/Admin/managerProducts/type/products';
import { categoryApi } from '@/pages/Admin/managerCatelogy/api/cate_api';

export const productFields: FormField<Product>[] = [
  {
      key: 'product_id',

      label: 'ID sản phẩm',
      type: FormFieldType.Input,

      placeholder: 'ID sản phẩm',
  },
  {
      key: 'product_name',

      label: 'Tên sản phẩm',

      type: FormFieldType.Input,

      placeholder: 'Nhập tên sản phẩm',

      rules: [
        {
          required: true,
          validator: (formdata:Product) => {
          return !!formdata.product_name?.trim();
          },
          message: 'Tên không được để trống hoặc chỉ chứa khoảng trắng.',
        }
      ]
    },

  {
    key: 'type_id',

    label: 'Loại sản phẩm',

    placeholder: 'Chọn loại sản phẩm',

    type: FormFieldType.Select,
    options: [
      { label: 'Len cuộn', value: 1 },
      { label: 'Công cụ', value: 2 },
    ], 

    rules: [
      {
        required: true,

        validator: (formdata:Product) => {
          return !!formdata.type_id;
        },

        message: 'Loại sản phẩm là bắt buộc.',
        }
      ]
    
  },

  {
    key: 'category_id',
    label: 'Danh mục',
    placeholder: 'Chọn danh mục',
    type: FormFieldType.SelectFetch,
    fetchOptions: async () => {
      try {
        const response = await categoryApi.getAll(1, 1000);
        console.log("Danh mục nhận được từ API:", response.data?.data?.categories);
        return response.data?.data?.categories.map((category: { id: number; category_name: string }) => ({
          label: category.category_name,
          value: category.id,
        }));
      }
      catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
        return [];
      }
    },
    rules: [
      {
        required: true,
        validator: (formdata:Product) => {
          return !!formdata.category_id;
        },
        message: 'Danh mục là bắt buộc.', 

        }
      ]
  },
  {
    key: 'description',
    label: 'Mô tả',
    placeholder: 'Nhập mô tả sản phẩm',
    type: FormFieldType.TextArea,
    rules: [
      {
        required: true,
        validator: (formdata:Product) => {
          return !!formdata.description?.trim();
        },
        message: 'Mô tả không được để trống hoặc chỉ chứa khoảng trắng.',
      }
    ],
  },
  {
    key: 'product_status',
    label: 'Trạng thái sản phẩm',
    placeholder: 'Chọn trạng thái sản phẩm',
    type: FormFieldType.Select,
    options: [
      { label: 'active', value: 'active' },
      { label: 'inactive', value: 'inactive' },
    ],
    rules: [
      {
        required: true,
        validator: (formdata:Product) => {
          return !!formdata.product_status?.trim();
        },
        message: 'Trạng thái sản phẩm không được để trống hoặc chỉ chứa khoảng trắng.',
      }
    ],
  }
  
];