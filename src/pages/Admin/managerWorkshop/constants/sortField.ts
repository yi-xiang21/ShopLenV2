import type { FormField } from "@/share/types/form-field";
import { FormModalMode, type FormModalModeType } from "@/share/types/type-form-mode";


export const getWorkshopFieldsByMode = <T extends object>(
  fields: FormField<T>[],
  mode: FormModalModeType
): FormField<T>[] => {
  if (mode === FormModalMode.VIEW) 
    return fields; 
  
  const excludeKeys = ["workshop_id","sku","slug","variant_id"];

  return fields.filter((field) => !excludeKeys.includes(String(field.key)));
};

