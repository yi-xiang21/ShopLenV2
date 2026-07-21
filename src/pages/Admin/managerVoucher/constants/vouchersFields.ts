import { FormFieldType } from '@/share/types/type-form-field';
import type { FormField } from '@/share/types/form-field';
import type { voucher } from '../type/vouchers';



export const getVoucherFields = (initialValues?: voucher | null): FormField<voucher>[] => [
  {
    key: 'voucher_id',
    label: 'ID voucher',
    type: FormFieldType.Input,
    disabled: true,
  },
  {
    key: 'code',
    label: 'Mã voucher',
    type: FormFieldType.Input,
    placeholder: 'Nhập mã voucher',
    rules: [
      {
        required: true,
        validator: (formdata:voucher) => {
          return !!formdata.code?.trim();
        },
        message: 'Mã voucher không được để trống hoặc chỉ chứa khoảng trắng.',
      }
    ]
  },
  {
    key: 'voucher_name',
    label: 'Tên voucher',
    type: FormFieldType.Input,
    placeholder: 'Nhập tên voucher',
    rules: [
      {
        required: true,
        validator: (formdata:voucher) => {
          return !!formdata.voucher_name?.trim();
        },
        message: 'Tên voucher không được để trống hoặc chỉ chứa khoảng trắng.',
      }
    ]
  },
  {
    key: 'discount_type',
    label: 'Loại giảm giá',
    type: FormFieldType.Select,
    options: [
      { value: 'percent', label: 'Phần trăm' },
      { value: 'fixed', label: 'Cố định' },
      { value: 'free_ship', label: 'Miễn phí vận chuyển' },
    ],
    rules: [
      {
        required: true,
        message: 'Vui lòng chọn loại giảm giá.'
      }
    ]
  },
  {
    key: 'value',
    label: 'Giá trị giảm giá',
    type: FormFieldType.Input,
    placeholder: 'Nhập giá trị giảm giá',
    rules: [
      {
        required: true,
        validator: (formdata:voucher) => {
          if (formdata.discount_type === 'percent') {
            return formdata.value >= 1 && formdata.value <= 100;
          }
          return !!formdata.value;
        },
        message: 'Giá trị giảm giá phải là từ 1 đến 100.',
        disabled: (formdata:voucher) => formdata.discount_type !== 'percent',
      },
      {
        pattern: /^\d+(\.\d{1,2})?$/,
        message: 'Giá trị giảm giá phải là một số hợp lệ, có thể có tối đa 2 chữ số thập phân.',
      }
    ],
    disabled: (formdata:voucher) => formdata.discount_type === 'free_ship',
  },
  {
    key: 'minimum_value',
    label: 'Giá trị đơn hàng tối thiểu',
    type: FormFieldType.Input,
    placeholder: 'Nhập giá trị tối thiểu',
    rules: [  
      {
        required: true,
        validator: (formdata:voucher) => {
          return !!formdata.minimum_value;    
        },
        message: 'Giá trị tối thiểu không được để trống.',
      },
      {
        pattern: /^\d+(\.\d{1,2})?$/,
        message: 'Giá trị tối thiểu phải là một số hợp lệ, có thể có tối đa 2 chữ số thập phân.',
      }
    ],

  },
  {
    key: 'max_discount',
    label: 'Giá trị giảm tối đa',
    type: FormFieldType.Input,
    placeholder: 'Nhập giá trị giảm tối đa',
    rules: [
      {
        required: true,
        validator: (formdata:voucher) => {
          if (formdata.discount_type === 'percent') {
            return !!formdata.max_discount;
          }
          return true;
        },
        message: 'Giá trị giảm tối đa không được để trống.',disabled: (formdata:voucher) => {
          return formdata.discount_type === 'fixed' || formdata.discount_type === 'free_ship';
        }
      },
      {
        pattern: /^\d+(\.\d{1,2})?$/,
        message: 'Giá trị giảm tối đa phải là một số hợp lệ, có thể có tối đa 2 chữ số thập phân.',
      }
    ],
    disabled: (formdata:voucher) => {
      return formdata.discount_type === 'fixed' || formdata.discount_type === 'free_ship';
    },
  },
  {
    key: 'quantity',
    label: 'Số lượng',
    type: FormFieldType.Input,
    placeholder: 'Nhập số lượng',
    rules: [
      {
        required: true,
        validator: (formdata:voucher) => {
          return !!formdata.quantity;
        },
        message: 'Số lượng không được để trống.',
      },
      {
        pattern: /^\d+$/,
        message: 'Số lượng phải là một số nguyên dương.',
      } 
    ]
  },
  {
    key: 'used_count',
    label: 'Số lượng đã sử dụng',
    type: FormFieldType.Input,
    disabled: true,
  },
  {
    key: 'start_date',
    label: 'Ngày bắt đầu',
    type: FormFieldType.DatePicker,
    placeholder: 'Chọn ngày bắt đầu',
    rules: [
      {
        required: true,
        validator: (formdata:voucher) => {
          if (initialValues?.voucher_id && formdata.start_date === initialValues.start_date) {
            return true;
          }
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const startDate = new Date(formdata.start_date);
          startDate.setHours(0, 0, 0, 0);

          return startDate >= today;
        },
        message: 'Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại.',
      },
      {
        required: true,
        message: 'Ngày bắt đầu không được để trống.',
      }
    ]
  },
  {
    key: 'end_date',
    label: 'Ngày kết thúc',
    type: FormFieldType.DatePicker,
    placeholder: 'Chọn ngày kết thúc',
    rules: [
      {
        required: true,
        validator: (formdata: voucher) => {
  if (!formdata.start_date || !formdata.end_date) {
    return true;
  }

  const startDate = new Date(formdata.start_date);
  const endDate = new Date(formdata.end_date);

  return endDate > startDate;
},
        message: 'Ngày kết thúc phải lớn hơn ngày bắt đầu.',
      },
      {
        required: true,
        message: 'Ngày kết thúc không được để trống.',
      }
    ]
  },
];
     