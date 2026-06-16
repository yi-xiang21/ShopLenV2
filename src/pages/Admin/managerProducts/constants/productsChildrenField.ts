import type { FormField } from "@/share/types/form-field";
import type { Variant } from "@/pages/Admin/managerProducts/type/products";
import { FormFieldType } from "@/share/types/type-form-field";


export const childrenProductsFields: FormField<Variant>[] = [
  {
      key: 'variant_id',

      label: 'ID biến thể',
      type: FormFieldType.Input,
      placeholder: 'ID biến thể',
  },
  { key: 'sku', label: 'Tên biến thể ', type: FormFieldType.Input, rules: [
    {
      required: true,
      validator: (formdata:Variant) => {
        return !!formdata.sku?.trim();
      },
      message: 'Tên biến thể  không được để trống hoặc chỉ chứa khoảng trắng.',
    }
  ],
    placeholder: 'Nhập tên biến thể ' 
},
{
  key: 'slug',
  label: 'Slug',
  type: FormFieldType.Input,
},
  { key: 'price', label: 'Giá', type: FormFieldType.Input, rules: [
    {
      required: true,
      validator: (formdata:Variant) => {
        return !!formdata.price?.trim();
      },
      message: 'Giá không được để trống hoặc chỉ chứa khoảng trắng.',
    }
  ] 
  , placeholder: 'Nhập giá sản phẩm' },
  { key: 'color', label: 'Màu sắc', type: FormFieldType.Input, placeholder: 'Nhập màu sắc' , rules: [
    {
      required: true,
      validator: (formdata:Variant) => {
        return !!formdata.color?.trim();
      },
      message: 'Màu sắc không được để trống hoặc chỉ chứa khoảng trắng.',
    }
  ]},
  { key: 'size', label: 'Kích thước', type: FormFieldType.Input, placeholder: 'Chọn kích thước' , rules: [
    {
      required: true,
      validator: (formdata:Variant) => {
        return !!formdata.size?.trim();
      },
      message: 'Kích thước không được để trống hoặc chỉ chứa khoảng trắng.',
    }
  ]},
  { key: 'images', label: 'Hình ảnh', type: FormFieldType.ImageUpload , rules: [
    {
      required: true,
      validator: (formdata:Variant) => {
        return formdata.images && formdata.images.length > 0;
      },
      message: 'Hình ảnh là bắt buộc.',
    }
  ]},

];