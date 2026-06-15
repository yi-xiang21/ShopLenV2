import type { FormField } from "@/share/types/form-field";
import { FormFieldType } from "@/share/types/type-form-field";
import { Input, Select } from "antd";
import SelectFetchCustom from "@/share/ComponentCustom/select/SelectFetchCustom";

type DynamicFormProps<T extends object> = {
  fields: FormField<T>[];
  values: T;
  onChange: (key: keyof T, value: unknown) => void;
  disabled?: boolean;
  error?: Record<string, string> ;
};

const DynamicForm = <T extends object>({
  fields,
  values,
  onChange,
  error,
  disabled = false,
}: DynamicFormProps<T>) => {
  const renderField = (field: FormField<T>) => {
    const key = field.key;
    const value = values[key];

    switch (field.type) {
      case FormFieldType.Input:
        return (
          <Input
            placeholder={field.placeholder}
            value={String(value ?? "")}
            onChange={(e) => onChange(key, e.target.value)}
            disabled={disabled}
          />
        );

      case FormFieldType.ImageUpload:
        return (
          <div>
            <input
              className="w-full p-2 border border-gray-300 rounded"
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
            {value && typeof value === "string" && (
              <img
                src={value}
                alt="Preview"
                className="mt-2 max-h-40 object-contain"
              />
            )}
          </div>
        );

      case FormFieldType.TextArea:
        return (
          <Input.TextArea
            placeholder={field.placeholder}
            value={String(value ?? "")}
            onChange={(e) => onChange(key, e.target.value)}
            disabled={disabled}
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
            disabled={disabled}
          />
        );

      case FormFieldType.SelectFetch:
        return (
          <SelectFetchCustom
            placeholder={field.placeholder}
            value={value}
            onChange={(value) => onChange(key, value)}
            fetchOptions={field.fetchOptions}
            disabled={disabled}
          />
        );

      case FormFieldType.InputNumber:
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            value={value !== undefined ? String(value) : ""}
            onChange={(e) => onChange(key, Number(e.target.value))}
            disabled={disabled} // Thêm disabled
          />
        );
      case FormFieldType.InputPassword:
        return (
          <Input.Password
            placeholder={field.placeholder}
            value={String(value ?? "")}
            onChange={(e) => onChange(key, e.target.value)}
            disabled={disabled}
          />
        );
      case FormFieldType.TimePicker:
        return (
          <Input
            type="time"
            placeholder={field.placeholder}
            value={String(value ?? "")}
            onChange={(e) => onChange(key, e.target.value)}
            disabled={disabled}
          />
        );
      case FormFieldType.DatePicker:
        return (
          <Input
            type="date"
            placeholder={field.placeholder}
            value={String(value ?? "")}
            onChange={(e) => onChange(key, e.target.value)}
            disabled={disabled}
          />
        );
      case FormFieldType.Checkbox:
        return (
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(key, e.target.checked)}
            disabled={disabled}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field) => (
        <div key={String(field.key)} className="flex flex-col gap-1">
          <label className="font-medium">{field.label}</label>
          {renderField(field)}
          {error && error[String(field.key)] && (
            <span className="text-red-500 text-sm">
              {error[String(field.key)]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default DynamicForm;
