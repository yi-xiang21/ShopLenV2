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
    key: 'quantity_change',
    label: 'Quantity Change',
    type: FormFieldType.Input,
    rules: [
        { required: true, message: 'Bắt buộc nhập số lượng thay đổi' },
        { pattern: /^-?[0-9]+$/, message: 'Số lượng phải là số nguyên, có thể âm' },
    ],
  },
  {
    key: 'transaction_type',
    label: 'Transaction Type',
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
    key: 'note',
    label: 'Note',
    type: FormFieldType.Input,
  }
];

