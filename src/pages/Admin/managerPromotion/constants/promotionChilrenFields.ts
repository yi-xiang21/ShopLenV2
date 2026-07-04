import { FormFieldType } from '@/share/types/type-form-field';
import type { FormField } from '@/share/types/form-field';
import type { productPromotion } from '@/pages/Admin/managerPromotion/type/promotion';
import { ProductApi } from '@/pages/Admin/managerProducts/api/products_api';
import type { Product } from '@/pages/Admin/managerProducts/type/products';
import {WorkshopApi} from "@/pages/Admin/managerWorkshop/api/workShop_api";
import type { Workshop } from '../../managerWorkshop/types/workshop';
export const promotionChildrenFields: FormField<productPromotion>[] = [
    {
        key: 'product_id',
        label: 'sản phẩm áp dụng',
        type: FormFieldType.SelectFetch,
        fetchOptions: async () => {
            try {
                const response = await ProductApi.getAll(1, 1000);
                const products = response.data?.data?.products || [];
                const response2 = await WorkshopApi.getAll({page:1,limit:1000});
                const workshops = response2.data?.data?.workshops || [];
                const combinedOptions = [
                    ...products.map((product: Product) => ({
                        label: product.product_name,
                        value: product.product_id,
                    })),
                    ...workshops.map((workshop: Workshop) => ({
                        label: workshop.title,
                        value: workshop.product_id,
                    })),
                ];
                return combinedOptions;
            } catch (error) {
                console.error('Error fetching products:', error);
                return [];
            }
        },
    }
];