import type { FormFieldType } from "./type-form-field";

export interface FormField<T> {
  key: keyof T;

  label: string;

  type: FormFieldType;

  placeholder?: string;

  required?: boolean;

  options?: {
    label: string;
    value: string | number;
  }[];
  fetchOptions?: () => Promise<{ label: string; value: string | number }[]>;
}