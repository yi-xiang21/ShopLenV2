export interface Category {
    categoryId: number,
    categoryName: string,
    categoryDescription: string,
    categorySlug: string,
    categoryImage: string,
    childCategories: Category[],
}