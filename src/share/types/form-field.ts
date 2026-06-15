import type { FormFieldType } from "./type-form-field";
import type { ValidationRule } from "./validate-form";

export interface FormField<T> {
  key: keyof T;

  label: string;

  type: FormFieldType;

  placeholder?: string;


  options?: {
    label: string;
    value: string | number;
  }[];
  fetchOptions?: () => Promise<{ label: string; value: string | number }[]>;
  rules?: ValidationRule[];
  
}