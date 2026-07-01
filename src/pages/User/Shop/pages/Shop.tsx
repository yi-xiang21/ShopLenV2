import Banner from "@/assets/BannerShop.png";
import CardProducts from "@/component/CardProducts";
import FilterShop from "@/component/FilterShop";
import { categoryApi } from "@/pages/Admin/managerCatelogy/api/cate_api";
import type { Category } from "@/pages/Admin/managerCatelogy/type/catelogy";
import { ProductApi } from "@/pages/Admin/managerProducts/api/products_api";
import type { Product } from "@/pages/Admin/managerProducts/type/products";
import { useFormModal } from "@/share/hook/useFormModal";
import { Button } from "antd";
import { useCallback, useEffect, useState } from "react";
import {  useSearchParams } from "react-router-dom";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  console.log("Category ID from state:", categoryId);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});

  const {
    loading,
    currentPage,
    pageSize,
    total,
    setCurrentPage,
    setTotal,
    setLoading,
  } = useFormModal<Product>();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAll(1, 1000);
        setCategories(response.data?.data?.categories || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách danh mục:", error);
      }
    };
    void fetchCategories();
  }, []);

  const fetchProducts = useCallback(
    async (
      page: number,
      limit: number,
      currentFilters: Record<string, any>,
    ) => {
      try {
        setLoading(true);
        let response;
       
          const cleanedFilters = Object.fromEntries(
            Object.entries(currentFilters).filter(([_, value]) => {
              if (Array.isArray(value)) return value.length > 0;
              return value !== null && value !== undefined && value !== "";
            }),
          );
          if (categoryId!=undefined) {
            cleanedFilters.category_id = categoryId;
          }

          if (Object.keys(cleanedFilters).length > 0) {
            const dataToSend = {
              ...cleanedFilters,
              status: "active",
              page,
              limit,
            };
            console.log("Sending filter data:", dataToSend);
            response = await ProductApi.filter(dataToSend);
            console.log("Filtered products response:", response.data);
          } else {
            response = await ProductApi.getAll(page, limit);
            response.data.data.products = response.data.data.products.filter(
              (product: Product) => product.product_status === "active",
            );
          }
        setProducts(response.data?.data?.products ?? []);
        setTotal(response.data?.data?.pagination?.total_items ?? 0);
      } catch (error) {
        console.error("Lỗi khi tải danh sách sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    },
    [setTotal, setLoading, categoryId],
  );

  useEffect(() => {
    void fetchProducts(currentPage, pageSize, filters);
  }, [currentPage, pageSize, filters, fetchProducts, categoryId]);

 

  const handleFilterSubmit = async (data: any) => {
  // Tạo bản sao của URL hiện tại
  const newParams = new URLSearchParams(searchParams);

  if (data.category_id) {
    newParams.set("categoryId", data.category_id);
  } else {
    newParams.delete("categoryId"); // Chỉ xóa mỗi categoryId nếu user bấm Reset
  }
  
  setSearchParams(newParams); // Cập nhật URL một cách an toàn

  setFilters({
    min_price: data.min_price,
    max_price: data.max_price,
    type_ids: data.type_ids,
  });
  
  setCurrentPage(1);
};

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pre = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const next = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const sortByPriceAsc = () => {
    setCurrentPage(1); // Chuyển về trang 1
    setFilters((prevFilters) => ({
      ...prevFilters,
      sort_price: "asc",
    }));
  };



  return (
    <>
      <div className="w-full h-100 flex items-center justify-center p-4">
        <img
          src={Banner}
          alt="Banner"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="w-full h-auto grid grid-cols-4 gap-2 p-4">
        <FilterShop
          onSubmit={handleFilterSubmit}
          loading={loading}
          categories={categories}
          initialCategoryId={categoryId}
        />

        <div className="w-full h-full bg-white col-span-3 rounded-xl shadow-sm border border-gray-100">
          <div className="w-full h-auto p-2 flex items-center gap-2">
            <Button
              type={filters.sort_price === "asc" ? "primary" : "default"}
              onClick={sortByPriceAsc}
            >
              Giá tăng dần
            </Button>

          </div>

          <div className="w-full h-auto p-5 grid grid-cols-3 gap-3">
            {products.length > 0 ? (
              products.map((product) => (
                <CardProducts key={product.product_id} data={product} />
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500 py-10">
                Không tìm thấy sản phẩm nào phù hợp.
              </div>
            )}

            <div className="flex items-center justify-center w-full h-full col-span-3 mt-4">
              <button
                className={`px-4 py-2 rounded-md mr-2 ${currentPage <= 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"}`}
                disabled={currentPage <= 1}
                onClick={pre}
              >
                truớc
              </button>

              <span className="mx-4 font-medium">
                Trang {currentPage} / {totalPages}
              </span>

              <button
                className={`px-4 py-2 rounded-md ml-2 ${currentPage >= totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"}`}
                disabled={currentPage >= totalPages}
                onClick={next}
              >
                kế tiếp
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
