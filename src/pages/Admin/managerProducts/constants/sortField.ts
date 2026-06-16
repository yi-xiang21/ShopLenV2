import type { FormField } from "@/share/types/form-field";
import { FormModalMode, type FormModalModeType } from "@/share/types/type-form-mode";


export const getProductFieldsByMode = <T extends object>(
  fields: FormField<T>[],
  mode: FormModalModeType
): FormField<T>[] => {
  if (mode === FormModalMode.VIEW) 
    return fields; 
  
  const excludeKeys = ["product_id", "category_name", "type_name"];

  return fields.filter((field) => !excludeKeys.includes(String(field.key)));
};


export const getVariantFieldsByMode = <T extends object>(
  fields: FormField<T>[],
  mode: FormModalModeType
): FormField<T>[] => {
  if (mode === FormModalMode.VIEW) return fields; // VIEW thì lấy hết

  if (mode === FormModalMode.CREATE) {

    return fields.filter((field) => !["variant_id", "slug"].includes(String(field.key)));
  }

  if (mode === FormModalMode.EDIT) {

    return fields.filter((field) => !["slug"].includes(String(field.key)));
  }

  return fields;
};