import validateForm from "@/share/ComponentCustom/validateForm";

export const validateChildren = (
  children: any[],
  childFields: any[],
  path: string = "children" 
) => {
  const errors: Record<string, string> = {};

  children.forEach((child, index) => {

    const currentErrors = validateForm(child, childFields);

    Object.entries(currentErrors).forEach(([key, value]) => {
      errors[`${path}.${index}.${key}`] = value;
    });

  
    if (child.children && Array.isArray(child.children) && child.children.length > 0) {
      Object.assign(
        errors,
        validateChildren(
          child.children,
          childFields,
          `${path}.${index}.children`
        )
      );
    }
  });

  return errors;
};