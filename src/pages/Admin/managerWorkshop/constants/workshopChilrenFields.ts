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
    label: 'Ngày dien ra',
    type: FormFieldType.DatePicker,
    placeholder: 'Chọn ngày bắt đầu',
    rules: [
            {
              validator: (formdata: WorkshopVariant) => {
              if (!formdata.start_date) return true;
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
    key: 'start_time',
    label: 'Thời gian bắt đầu',
    type: FormFieldType.TimePicker,
    placeholder: 'Chọn thời gian bắt đầu',
    rules: [
        {
            required: true,
            message: 'Thời gian bắt đầu không được để trống.',
        },
        {
            validator: (formdata: WorkshopVariant) => {
                if (!formdata.start_time || !formdata.end_time) return true;
                const startTimeStr = String(formdata.start_time).trim();
                const endTimeStr = String(formdata.end_time).trim();
                
                const startDateTime = new Date(`1970-01-01T${startTimeStr}`);
                const endDateTime = new Date(`1970-01-01T${endTimeStr}`);
                
                if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
                    return startTimeStr < endTimeStr;
                }
                
                return startDateTime < endDateTime;
            },
            message: 'Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.',
        }
    ]
},
{
    key: 'end_time',
    label: 'Thời gian kết thúc',
    type: FormFieldType.TimePicker,
    placeholder: 'Chọn thời gian kết thúc',
    rules: [
        {
            required: true,
            message: 'Thời gian kết thúc không được để trống.',
        },
        {
            validator: (formdata: WorkshopVariant) => {
                if (!formdata.start_time || !formdata.end_time) return true;
                const startTimeStr = String(formdata.start_time).trim();
                const endTimeStr = String(formdata.end_time).trim();
                
                const startDateTime = new Date(`1970-01-01T${startTimeStr}`);
                const endDateTime = new Date(`1970-01-01T${endTimeStr}`);
                
                if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
                    return startTimeStr < endTimeStr;
                }
                
                return startDateTime < endDateTime;
            },
            message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu.',
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
        { label: 'Ngừng hoạt động', value: 'closed' },
        {label: 'hết chỗ', value: 'full' },
        { label: 'Hủy', value: 'cancelled' },
    ],
    disabled:true,

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
    key : 'total_capacity',
    label : 'Sức chứa',
    type : FormFieldType.Input,
    placeholder : 'Nhập sức chứa',
    rules : [
        {
            required: true,
            validator: (formdata:WorkshopVariant) => {
                return !!formdata.total_capacity?.toString().trim();
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
{
    key : 'available_slots',
    label : 'Số chỗ còn trống',
    type : FormFieldType.Input,
    disabled:true,
},
{
    key : 'booked_slots',
    label : 'Số chỗ đã đặt',
    type : FormFieldType.Input,
    disabled:true,
}
];