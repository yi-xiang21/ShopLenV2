import { FormFieldType } from '@/share/types/type-form-field';
import type { FormField } from '@/share/types/form-field';
import type { CategoryFormValues } from '@/pages/Admin/managerCatelogy/type/catelogy';



export const categoryFields: FormField<CategoryFormValues>[] = [
  {
    key: 'category_name',

    label: 'Tên danh mục',

    type: FormFieldType.Input,

    required: true,
  },

  {
    key: 'description',

    label: 'Mô tả',

    type: FormFieldType.TextArea,
  },

  {
    key: 'image_url',

    label: 'URL hình ảnh',
    type: FormFieldType.ImageUpload,
  }

  
];