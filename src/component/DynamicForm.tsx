import type { FormField } from '@/share/types/form-field';
import { FormFieldType } from '@/share/types/type-form-field';
import { Input, Select } from 'antd';

type DynamicFormProps<T extends object> = {
  fields: FormField<T>[];
  values: T;
  onChange: (key: keyof T, value: unknown) => void;
  disabled?: boolean; 
};

const DynamicForm = <T extends object>({
  fields,
  values,
  onChange,
  disabled = false, // Mặc định là false
}: DynamicFormProps<T>) => {
  const renderField = (field: FormField<T>) => {
    const key = field.key;
    const value = values[key];

    switch (field.type) {
      case FormFieldType.Input:
        return (
            <Input
                placeholder={field.placeholder}
                value={String(value ?? '')}
                onChange={(e) => onChange(key, e.target.value)}
                disabled={disabled} // Thêm disabled
            />
        );

    case FormFieldType.ImageUpload:
        return (
            <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => onChange(key, reader.result);
                    reader.readAsDataURL(file);
                  }
                }}
                disabled={disabled}
            />
        );

      case FormFieldType.TextArea:
        return (
          <Input.TextArea
            placeholder={field.placeholder}
            value={String(value ?? '')}
            onChange={(e) => onChange(key, e.target.value)}
            disabled={disabled} // Thêm disabled
          />
        );

      case FormFieldType.Select:
        return (
          <Select
            placeholder={field.placeholder}
            value={value}
            options={field.options}
            onChange={(value) => onChange(key, value)}
            allowClear
            disabled={disabled} // Thêm disabled
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      {fields.map((field) => (
        <div key={String(field.key)} className='flex flex-col gap-1'>
          <label className='font-medium'>
            {field.label}
            {field.required && <span className='text-red-500 ml-1'>*</span>}
          </label>
          {renderField(field)}
        </div>
      ))}
    </div>
  );
};

export default DynamicForm;