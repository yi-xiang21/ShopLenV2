import type { Category } from "@/pages/Admin/managerCatelogy/type/catelogy";

export const getParentCategories = (categories: Category[]) => {
  const parents: Category[] = [];

  const traverse = (nodes: Category[]) => {
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        parents.push(node);
        traverse(node.children);
      }
    });
  };

  traverse(categories);

  return parents;
};

export const getLeafCategories = (categories: any[]) => {
  const result: { label: string; value: number }[] = [];

  const traverse = (nodes: any[], isRoot: boolean) => {
    nodes.forEach((node) => {
      if (!node.children || node.children.length === 0) {
        // Chỉ lấy những danh mục lá không phải là danh mục gốc (isRoot = false)
        if (!isRoot) {
          result.push({
            label: node.category_name,
            value: node.id || node.category_id,
          });
        }
      } else {
        traverse(node.children, false);
      }
    });
  };

  traverse(categories, true);

  return result;
};