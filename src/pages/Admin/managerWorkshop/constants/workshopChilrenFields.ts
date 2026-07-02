import { FormFieldType } from '@/share/types/type-form-field';
import type { FormField } from '@/share/types/form-field';
import type { WorkshopVariant } from '@/pages/Admin/managerWorkshop/types/workshop';
export const workshopChildrenFields: FormField<WorkshopVariant>[] = [
{
    key: 'variant_id',
    label: 'ID biến thể',
    type: FormFieldType.Input,
    placeholder: 'ID biến thể',
},
{ key: 'sku', label: 'Tên biến thể ', type: FormFieldType.Input},
{
    key: 'slug',
    label: 'Slug',
    type: FormFieldType.Input,
},
{ key: 'price', label: 'Giá', type: FormFieldType.Input, rules: [
    {
        required: true,
        message: 'Giá không được để trống hoặc chỉ chứa khoảng trắng.',
    },
    {
        pattern: /^\d+(\.\d{1,2})?$/,
        message: 'Giá phải là một số hợp lệ, có thể có tối đa 2 chữ số thập phân.',
    }
]
, placeholder: 'Nhập giá sản phẩm' },
{ key: 'images', label: 'Hình ảnh', type: FormFieldType.ImageUpload , rules: [
    {
        required: true,
        validator: (formdata:WorkshopVariant) => {
            return formdata.images && formdata.images.length > 0;
        }
        ,
        message: 'Hình ảnh là bắt buộc.',
    }
]
},
{
    key: 'start_date',
    label: 'Ngày bắt đầu',
    type: FormFieldType.DatePicker,
    placeholder: 'Chọn ngày bắt đầu',
    rules: [
            {
              validator: (formdata: WorkshopVariant) => {
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
              validator: (formdata: WorkshopVariant) => {
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
    key : 'status',
    label : 'Trạng thái',
    type : FormFieldType.Select,
    placeholder : 'Chọn trạng thái',
    options : [
        { label: 'Hoạt động', value: 'open' },
        { label: 'Ngừng hoạt động', value: 'close' },
        { label: 'Đầy', value: 'full' },
    ],
    rules : [
        {
            required: true,
            validator: (formdata:WorkshopVariant) => {
                return !!formdata.status;
            }
            ,
            message: 'Trạng thái là bắt buộc.',
        }
    ]
},
{
    key : 'session_name',
    label : 'Tên phiên',
    type : FormFieldType.Input,
    placeholder : 'Nhập tên phiên',
    rules : [
        {
            required: true,
            validator: (formdata:WorkshopVariant) => {
                return !!formdata.session_name?.trim();
            }
            ,
            message: 'Tên phiên không được để trống hoặc chỉ chứa khoảng trắng.',
        }
    ]
},
{
    key : 'capacity',
    label : 'Sức chứa',
    type : FormFieldType.Input,
    placeholder : 'Nhập sức chứa',
    rules : [
        {
            required: true,
            validator: (formdata:WorkshopVariant) => {
                return !!formdata.capacity;
            }
            ,
            message: 'Sức chứa là bắt buộc.',
        },
        {
            pattern: /^\d+$/,
            message: 'Sức chứa phải là một số nguyên dương.',
        }
    ]
},
];