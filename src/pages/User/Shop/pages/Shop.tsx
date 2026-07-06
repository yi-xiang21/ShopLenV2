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
import { useSearchParams } from "react-router-dom";
import catSliderAnimation from '@/assets/animation/Cat playing animation.json';
import Lottie from "lottie-react";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");

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
        
        // Dùng if (categoryId) sẽ an toàn hơn để loại bỏ cả null hoặc chuỗi rỗng
        if (categoryId) {
          cleanedFilters.category_id = categoryId;
        }

        if (Object.keys(cleanedFilters).length > 0) {
          const dataToSend = {
            ...cleanedFilters,
            status: "active",
            page,
            limit,
          };

          response = await ProductApi.filter(dataToSend);

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
  const LottieComponent = Lottie as any;

  return (
    <>
      <div className="w-full h-100 flex items-center justify-center p-4">
        <div className="absolute left-10 top-107 w-50 mt-10 z-20">
          <LottieComponent.default
            animationData={catSliderAnimation}
            loop
            autoplay
          />
        </div>
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

        <div className="w-full h-full bg-white col-span-3 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="w-full h-auto p-4 flex items-center gap-2 border-b border-gray-50">
            <Button
              type={filters.sort_price === "asc" ? "primary" : "default"}
              onClick={sortByPriceAsc}
            >
              Giá tăng dần
            </Button>
          </div>

          {/* CHÚ Ý: Bắt đầu khu vực Grid 3 cột chứa Sản phẩm */}
          <div className="w-full h-auto p-5 grid grid-cols-3 gap-3 flex-grow">
            {products.length > 0 ? (
              products.map((product) => (
                <CardProducts key={product.product_id} data={product} />
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500 py-10">
                Không tìm thấy sản phẩm nào phù hợp.
              </div>
            )}
          </div>
          {/* Kết thúc Grid sản phẩm */}

          {/* CHÚ Ý: Đã đưa khối Phân Trang ra ngoài Grid 3 cột */}
          {products.length > 0 && (
            <div className="flex items-center justify-center w-full py-6">
              <button
                className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                  currentPage <= 1 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                }`}
                disabled={currentPage <= 1}
                onClick={pre}
              >
                Trang trước
              </button>

              <span className="mx-6 font-medium text-slate-600">
                Trang {currentPage} / {totalPages}
              </span>

              <button
                className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                  currentPage >= totalPages 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                }`}
                disabled={currentPage >= totalPages}
                onClick={next}
              >
                Trang tiếp
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Shop;