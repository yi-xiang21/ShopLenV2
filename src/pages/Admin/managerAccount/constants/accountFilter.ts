import type { FilterField } from "@/share/types/filter_param";
import { FormFieldType } from "@/share/types/type-form-field";

export const filterAccount: FilterField[] = [
  {
    key: 'keyword',
    label: 'Tìm kiếm',
    type: FormFieldType.Input,
    placeholder: 'Nhập từ khóa...',
  },
  {
    key : 'roles',
    label: 'Vai trò',
    type: FormFieldType.Select,
    placeholder: 'Chọn vai trò',
    width: 200,
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'customer', value: 'customer' },
    ],
    mode: 'multiple',
  },
  {
    key: 'statuses',
    label: 'Trạng thái',
    type: FormFieldType.Select,
    placeholder: 'Chọn trạng thái',
    width: 200,
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
    mode: 'multiple',
  },
];
  