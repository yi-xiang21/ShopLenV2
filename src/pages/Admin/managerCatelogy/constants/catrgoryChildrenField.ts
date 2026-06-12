import type { FormField } from "@/share/types/form-field";
import type { categoryChildren } from "../type/catelogy";
import { FormFieldType } from "@/share/types/type-form-field";


export const childCategoryFields: FormField<categoryChildren>[] = [
  { key: 'category_name', label: 'Tên danh mục con', type: FormFieldType.Input, required: true },
  { key: 'description', label: 'Mô tả', type: FormFieldType.TextArea },
];