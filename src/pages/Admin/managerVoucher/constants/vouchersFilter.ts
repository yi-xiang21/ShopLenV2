import type { FilterField } from "@/share/types/filter_param";
import { FormFieldType } from "@/share/types/type-form-field";

export const filterVouchers: FilterField[] = [
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
      { label: 'Phần trăm', value: 'percent' },
      { label: 'Cố định', value: 'fixed' },
    ],
    mode: 'multiple',
  },
  // {
  //   key : 'sort_by',
  //   label: 'Sắp xếp theo',
  //   type: FormFieldType.Select,
  //   placeholder: 'Chọn tiêu chí sắp xếp',
  //   width: 200,
  //   options: [
  //     { label: 'ngày bắt đàu tăng dần ', value: 'start_date_asc' },
  //     { label: 'ngày bắt đầu giảm dần', value: 'start_date_desc' },
  //     { label: 'ngày kết thúc tăng dần', value: 'end_date_asc' },
  //     { label: 'ngày kết thúc giảm dần', value: 'end_date_desc' },
  //   ],
  // }
];
  