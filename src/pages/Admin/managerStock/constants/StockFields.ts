import { FormFieldType } from '@/share/types/type-form-field';
import type { FormField } from '@/share/types/form-field';
import type { stock } from '@/pages/Admin/managerStock/type/stock';
import { TRANSACTION_TYPE } from '@/pages/Admin/managerStock/type/stock';





export const stockFields: FormField<stock>[] = [
  {
    key: 'variant_id',
    label: 'Variant ID',
    type: FormFieldType.Input,
    disabled: true,
  },
  
  {
    key: 'transaction_type',
    label: 'Loại giao dịch',
    type: FormFieldType.Select,
    options: [
      
      ...TRANSACTION_TYPE.map((item) => ({
        label: item.label,
        value: item.value,
      })),
    ],
    rules: [{ required: true, message: 'Bắt buộc chọn loại giao dịch' }],
  },
  {
    key:'unit_cost',
    label: 'Giá Nhập',
    type: FormFieldType.Input,
    rules: [
      { required: true, message: 'Bắt buộc nhập giá nhập' ,disabled: (values) => values?.transaction_type !== 'nhap_kho'},
      { pattern: /^[0-9]+$/, message: 'Giá nhập phải là số nguyên dương' },
    ],
    disabled: (values) => values?.transaction_type !== 'nhap_kho',
  },
  {
    key: 'quantity_change',
    label: 'số lượng thay đổi',
    type: FormFieldType.Input,
    rules: [
        { required: true, message: 'Bắt buộc nhập số lượng thay đổi' ,disabled: (values) => values?.transaction_type === 'kiem_kho'},
        { pattern: /^-?[0-9]+$/, message: 'Số lượng phải là số nguyên, có thể âm' },
    ],
    disabled: (values) => values?.transaction_type === 'kiem_kho',
  },
  {
    key: 'physical_quantity',
    label: 'số lượng vật lý',
    type: FormFieldType.Input,
    rules: [
        { required: true, message: 'Bắt buộc nhập số lượng vật lý' , disabled: (values) => values?.transaction_type !== 'kiem_kho'},
        { pattern: /^[0-9]+$/, message: 'Số lượng phải là số nguyên dương' },
    ],
    disabled: (values) => values?.transaction_type !== 'kiem_kho',
  },
  {
    key: 'note',
    label: 'Note',
    type: FormFieldType.Input,
  }
];

