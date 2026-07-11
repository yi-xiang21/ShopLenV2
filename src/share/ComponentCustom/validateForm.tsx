import type { FormField } from "@/share/types/form-field";
const validateForm = <
  T extends Record<string, any>
>(
  values: T,
  fields: FormField<T>[]
) => {
  const errors: Record<string, string> = {};

  fields.forEach((field) => {
    const value = values[field.key];

    field.rules?.forEach((rule) => {
      const isRuleDisabled = typeof rule.disabled === 'function' ? rule.disabled(values) : rule.disabled;

      if(
        rule.required &&
        !isRuleDisabled &&
        (value === undefined || value === null || String(value).trim() === '')
      ) {
        errors[String(field.key)] =
          rule.message || 'Trường này là bắt buộc.';
        return;
      }

      if (
        rule.pattern &&
        !isRuleDisabled &&
        value &&
        !rule.pattern.test(String(value))
      ) {
        errors[String(field.key)] =
          rule.message;
      }

      if (
        !isRuleDisabled &&
        rule.validator &&
        !rule.validator(values)
      ) {
        errors[String(field.key)] =
          rule.message;
      }
    });
  });

  return errors;
};
export default validateForm;