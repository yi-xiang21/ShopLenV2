import { FormFieldType } from '@/share/types/type-form-field';
import type { FormField } from '@/share/types/form-field';
import type { promotion } from '@/pages/Admin/managerPromotion/type/promotion';




export const promotionFields: FormField<promotion>[] = [
  {
    key: 'title',
    label: 'Tiêu đề',
    type: FormFieldType.Input,
    placeholder: 'Nhập tiêu đề khuyến mãi',
    rules: [
      { required: true, message: 'Tiêu đề không được để trống' }
    ],
  },
  {
    key: 'discount_type',
    label: 'Loại giảm giá',
    type: FormFieldType.Select,
    placeholder: 'Chọn loại giảm giá',
    options: [
      { label: 'percent', value: 'percent' },
      { label: 'fixed', value: 'fixed' },
    ],
    rules: [
      { required: true, message: 'Loại giảm giá không được để trống' }
    ],
  },
  {
    key: 'value',
    label: 'Giá trị',
    type: FormFieldType.Input,
    placeholder: 'Nhập giá trị giảm giá',
    rules: [
      { required: true , pattern: /^\d+(\.\d{1,2})?$/, message: 'Giá trị phải là số hợp lệ' }
    ],
  },
  {
    key: 'min_order_value',
    label: 'Giá trị đơn hàng tối thiểu',
    type: FormFieldType.Input,
    placeholder: 'Nhập giá trị đơn hàng tối thiểu',
    rules: [
      { required: true , pattern: /^\d+(\.\d{1,2})?$/, message: 'Giá trị phải là số hợp lệ' }
    ],
  },
  {
      key: 'start_date',
      label: 'Ngày bắt đầu',
      type: FormFieldType.DatePicker,
      placeholder: 'Chọn ngày bắt đầu',
      rules: [
        {
          validator: (formdata: promotion) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const startDate = new Date(formdata.start_date);
          startDate.setHours(0, 0, 0, 0);

          return startDate >= today;},
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
          validator: (formdata: promotion) => {
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
  {
    key:'status',
    label: 'Trạng thái',
    type: FormFieldType.Select,
    placeholder: 'Chọn trạng thái',
    options: [
      { label: 'active', value: 'active' },
      { label: 'inactive', value: 'inactive' },
    ],
    rules: [
      { required: true, message: 'Trạng thái không được để trống' }
    ],
  }
];

