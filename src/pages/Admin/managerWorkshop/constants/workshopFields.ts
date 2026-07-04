import { FormFieldType } from '@/share/types/type-form-field';
import type { FormField } from '@/share/types/form-field';
import type { Workshop } from '@/pages/Admin/managerWorkshop/types/workshop';
import { getLeafCategories } from '../../managerCatelogy/constants/getParentCate';
import { categoryApi } from '../../managerCatelogy/api/cate_api';




export const workshopFields: FormField<Workshop>[] = [
  {
    key: 'title',
    label: 'Tiêu đề',
    type: FormFieldType.Input,
    placeholder: 'Nhập tiêu đề workshop',
    rules: [
      { required: true, message: 'Tiêu đề không được để trống' }
    ],
  },
  {
    key: 'description',
    label: 'Mô tả',
    type: FormFieldType.TextArea,
    placeholder: 'Nhập mô tả workshop',
    rules: [
      { required: true, message: 'Mô tả không được để trống' }
    ],
  },
  {
    key: 'location',
    label: 'Địa điểm',
    type: FormFieldType.Input,
    placeholder: 'Nhập địa điểm workshop',
    rules: [
      { required: true, message: 'Địa điểm không được để trống' }
    ],
  },
  {
    key: 'category_id',
    label: 'Danh mục',
    placeholder: 'Chọn danh mục workshop',
    type: FormFieldType.SelectFetch,
        fetchOptions: async () => {
      try {
        const response = await categoryApi.getAll(1, 1000);
    
        return getLeafCategories(
          response.data?.data?.categories || []
        );
      } catch (error) {
        console.error(error);
        return [];
      }
    },
        rules: [
          {
            required: true,
            validator: (formdata:Workshop) => {
              return !!formdata.category_id;
            },
            message: 'Danh mục là bắt buộc.', 
    
            }
          ]
  },{
    key: 'status',
    label: 'Trạng thái',
    type: FormFieldType.Select,
    placeholder: 'Chọn trạng thái workshop',
    options: [
      { label: 'Hoạt động', value: 'active' },
      { label: 'Không hoạt động', value: 'inactive' },
    ],
    rules: [
      { required: true, message: 'Trạng thái không được để trống' }
    ],

  }
];

