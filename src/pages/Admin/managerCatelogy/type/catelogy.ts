export interface Category {
    categoryId: number,
    categoryName: string,
    categoryDescription: string,
    categorySlug: string,
    childCategories: Category[],
}