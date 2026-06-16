import { FormFieldType } from '@/share/types/type-form-field';
import type { FormField } from '@/share/types/form-field';
import type { account } from '../type/account';



export const accountFields: FormField<account>[] = [
  {
      key: 'username',

      label: 'Tên đăng nhập',

      type: FormFieldType.Input,

      placeholder: 'Nhập tên username',

      rules: [
        {
          required: true,
          validator: (formdata:account) => {
          return !!formdata.username?.trim();
          },
          message: 'Tên không được để trống hoặc chỉ chứa khoảng trắng.',
        }
      ]
    },

  {
    key: 'first_name',

    label: 'Tên',

    placeholder: 'Nhập tên',

    type: FormFieldType.Input,
    
  },

  {
    key: 'last_name',
    label: 'Họ',
    placeholder: 'Nhập họ',
    type: FormFieldType.Input,
  },
  {
    key: 'email',
    label: 'Email',
    placeholder: 'Nhập email',
    type: FormFieldType.Input,
    rules: [
      {
        required: true,
        validator: (formdata:account) => {
          return !!formdata.email?.trim();
        },
        message: 'Email không được để trống hoặc chỉ chứa khoảng trắng.',
      },
      {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Email không hợp lệ.',
      },
    ],
  },
  {
    key: 'password',
    label: 'Mật khẩu',
    placeholder: 'Nhập mật khẩu',
    type: FormFieldType.InputPassword,
    rules: [
      {
        required: true,
        validator: (formdata:account) => {
          return !!formdata.password?.trim();
        },
        message: 'Mật khẩu không được để trống hoặc chỉ chứa khoảng trắng.',
      },
      {
        pattern: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
        message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm cả chữ và số.',
      },
    ],
  },
  {
    key: 'phone_number',
    label: 'Số điện thoại',
    placeholder: 'Nhập số điện thoại',
    type: FormFieldType.Input,
    rules: [
      {
        required: true,
        validator: (formdata:account) => {
          return !!formdata.phone_number?.trim();
        },
        message: 'Số điện thoại không được để trống hoặc chỉ chứa khoảng trắng.',
      },
      {
        pattern: /^\d{10}$/,
        message: 'Số điện thoại phải có 10 chữ số.',
      },
    ],
    
  },
  {
    key: 'status',
    label: 'Trạng thái',
    type: FormFieldType.Select,
    options: [
      { label: 'Hoạt động', value: 'active' },
      { label: 'Không hoạt động', value: 'inactive' },
    ],
  },
  {
    key: 'role',
    label: 'Vai trò',
    type: FormFieldType.Select,
    options: [
      { label: 'Khách hàng', value: 'customer' },
      { label: 'Quản trị viên', value: 'admin' },
    ],
  }
  
];