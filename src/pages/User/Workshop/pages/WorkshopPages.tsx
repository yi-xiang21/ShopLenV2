import Banner from "@/assets/WorkshopPage.png";
import { WorkshopApi } from "@/pages/Admin/managerWorkshop/api/workShop_api";
import type { Workshop } from "@/pages/Admin/managerWorkshop/types/workshop";
import { useFormModal } from "@/share/hook/useFormModal";
import { useCallback, useEffect, useState } from "react";
import { Skeleton, Empty } from "antd";

import CardWorkshop from "@/component/CardWorkshop";

const WorkshopPages = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);

  const {
    currentPage,
    pageSize,
    total,
    setCurrentPage,
    setTotal,
    setLoading,
    loading, 
  } = useFormModal<Workshop>();

  const fetchWorkshops = useCallback(
    async (page: number, limit: number) => {
      try {
        setLoading(true);
        const response = await WorkshopApi.getAll({ 
            page, 
            limit, 
            status: "active"
        });
            
        setWorkshops(response.data?.data?.workshops ?? []);
        setTotal(response.data?.data?.pagination?.total_items ?? 0);
      } catch (error) {
        console.error("Lỗi khi tải danh sách sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    },
    [setTotal, setLoading]
  );

  useEffect(() => {
    void fetchWorkshops(currentPage, pageSize);
  }, [currentPage, pageSize, fetchWorkshops]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pre = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const next = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="bg-slate-50 min-h-screen pb-10">
      {/* Hero Section */}
      <div className="relative w-full h-190 flex items-center justify-center p-4">
        <img
          src={Banner}
          alt="Workshop Banner"
          className="w-full h-full object-cover rounded-2xl shadow-md"
        />
        
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        

          {/* Grid Hiển Thị Data */}
          {loading ? (
            // Trạng thái Loading
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="flex flex-col gap-3">
                  <Skeleton.Image className="w-full h-55 rounded-2xl" active />
                  <Skeleton paragraph={{ rows: 2 }} active />
                </div>
              ))}
            </div>
          ) : workshops.length > 0 ? (
            // Trạng thái Có Data
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-3 gap-6">
              {workshops.map((workshop) => (
                <CardWorkshop key={workshop.workshop_id} data={workshop} />
              ))}
            </div>
          ) : (
            // Trạng thái Trống (Empty)
            <div className="py-20 flex justify-center w-full">
              <Empty 
                description={<span className="text-slate-400">Hiện chưa có khóa học nào</span>} 
              />
            </div>
          )}

          {/* Phân Trang */}
          {workshops.length > 0 && (
            <div className="flex items-center justify-center w-full mt-10">
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
    </div>
  );
};

export default WorkshopPages;