import type { FilterField } from "@/share/types/filter_param";
import { FormFieldType } from "@/share/types/type-form-field";

export const filterPromotions: FilterField[] = [
  {
    key: 'keyword',
    label: 'Tìm kiếm',
    type: FormFieldType.Input,
    placeholder: 'Nhập từ khóa...',
  },
  {
    key : 'discount_types',
    label: 'Loại giảm giá',
    type: FormFieldType.Select,
    placeholder: 'Chọn loại giảm giá',
    width: 200,
    options: [
      { label: 'percent', value: 'percent' },
      { label: 'fixed', value: 'fixed' },
    ],
    mode: 'multiple',
  }
];
  