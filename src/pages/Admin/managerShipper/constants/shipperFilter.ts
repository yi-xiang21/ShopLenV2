import { BillingApi } from "@/pages/User/Billing/api/billing_api";
import type { FilterField } from "@/share/types/filter_param";
import { FormFieldType } from "@/share/types/type-form-field";

export const filterShipper: FilterField[] = [
 {
     key: 'working_city_id',
     label: 'Thành phố làm việc',
     type: FormFieldType.SelectFetch,
     fetchOptions: async () => {
       const response = await BillingApi.getLocations();
       const cities = response.data.data.cities;
       return cities.map((city: any) => ({
         label: city.city_name,
         value: city.city_code as string,
       }));
     },
   },
];
  