import { FormFieldType } from '@/share/types/type-form-field';
import type { FormField } from '@/share/types/form-field';
import type { productPromotion } from '@/pages/Admin/managerPromotion/type/promotion';
import { ProductApi } from '@/pages/Admin/managerProducts/api/products_api';
import type { Product } from '@/pages/Admin/managerProducts/type/products';
export const promotionChildrenFields: FormField<productPromotion>[] = [
    {
        key: 'product_id',
        label: 'sản phẩm áp dụng',
        type: FormFieldType.SelectFetch,
        fetchOptions: async () => {
            try {
                const response = await ProductApi.getAll(1, 1000);
                const products = response.data?.data?.products || [];
                return products.map((product: Product) => ({
                    label: product.product_name,
                    value: product.product_id,
                }));
            } catch (error) {
                console.error('Error fetching products:', error);
                return [];
            }
        },
    }
];