import { useEffect, useState } from "react";
import { historyWorkshopApi } from "@/pages/User/UserProfile/api/historyWorkshop_api";
import type { historyWorkshop } from "@/pages/User/UserProfile/types/history_workshop";
import { Pagination, Spin } from "antd";
import CardHistoryWorkshop from "@/component/CardHistoryWorkshop";
import { useFormModal } from "@/share/hook/useFormModal";

const UserWorkshop = () => {
  const [ongoingWorkshops, setOngoingWorkshops] = useState<historyWorkshop[]>([]);
  const [upcomingWorkshops, setUpcomingWorkshops] = useState<historyWorkshop[]>([]);
  const [pastWorkshops, setPastWorkshops] = useState<historyWorkshop[]>([]);
  
  const {
    currentPage,
    total ,
    loading: pastLoading,
    setCurrentPage,
    setTotal ,
    setLoading: setPastLoading,
  } = useFormModal<historyWorkshop>();

  const [initLoading, setInitLoading] = useState(true);

  const fetchOngoing = async () => {
    try {
      const res = await historyWorkshopApi.getHistoryWorkshop({ limit: 50, status: "ongoing" });
      setOngoingWorkshops(res.data?.data?.workshops ?? res.data?.data ?? []);
    } catch (error) {
      console.error("Lỗi khi tải workshop đang diễn ra:", error);
    }
  };

  const fetchUpcoming = async () => {
    try {
      const res = await historyWorkshopApi.getHistoryWorkshop({ limit: 50, status: "upcoming" });
      setUpcomingWorkshops(res.data?.data?.workshops ?? res.data?.data ?? []);
    } catch (error) {
      console.error("Lỗi khi tải workshop sắp diễn ra:", error);
    }
  };

  const fetchPast = async (page: number) => {
    try {
      setPastLoading(true);
      const res = await historyWorkshopApi.getHistoryWorkshop({ page, limit: 4, status: "past" });
      setPastWorkshops(res.data?.data?.workshops ?? res.data?.data ?? []);
      setTotal(res.data?.data?.pagination?.total_records ?? res.data?.data?.pagination?.total_items ?? 0);
    } catch (error) {
      console.error("Lỗi khi tải workshop đã kết thúc:", error);
    } finally { 
      setPastLoading(false);
    }
  };

  useEffect(() => {
    const initFetch = async () => {
      setInitLoading(true);
      await Promise.all([fetchOngoing(), fetchUpcoming(), fetchPast(1)]);
      setInitLoading(false);
    };
    void initFetch();
  }, []);

  const handlePastPageChange = (page: number) => {
    setCurrentPage(page);
    void fetchPast(page);
  };

  if (initLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <section className="space-y-8 pb-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b95b2d]">Workshop</p>
        <h2 className="mt-2 text-3xl font-semibold text-[#1f1935]">Các khóa học của bạn</h2>
      </div>
      

      {/* Đang diễn ra */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#1f1935] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Đang diễn ra
        </h3>
        {ongoingWorkshops.length === 0 ? (
          <p className="text-gray-500 italic text-sm">Không có khóa học nào đang diễn ra.</p>
        ) : (
          <div className="flex flex-col gap-4 max-h-90 overflow-y-auto pr-2 custom-scrollbar">
            {ongoingWorkshops.map((workshop, index) => (
              <CardHistoryWorkshop key={`ongoing-${workshop.order_id}-${index}`} workshop={workshop} />
            ))}
          </div>
        )}
      </div>

      {/* Sắp diễn ra */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <h3 className="text-xl font-semibold text-[#1f1935] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          Sắp diễn ra
        </h3>
        {upcomingWorkshops.length === 0 ? (
          <p className="text-gray-500 italic text-sm">Không có khóa học nào sắp diễn ra.</p>
        ) : (
          <div className="flex flex-col gap-4 max-h-90 overflow-y-auto pr-2 custom-scrollbar">
            {upcomingWorkshops.map((workshop, index) => (
              <CardHistoryWorkshop key={`upcoming-${workshop.order_id}-${index}`} workshop={workshop} />
            ))}
          </div>
        )}
      </div>

      {/* Đã kết thúc */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <h3 className="text-xl font-semibold text-[#1f1935] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-400"></span>
          Đã kết thúc
        </h3>
        {pastWorkshops.length === 0 ? (
          <p className="text-gray-500 italic text-sm">Không có khóa học nào đã kết thúc.</p>
        ) : (
          <div className="space-y-6">
            <Spin spinning={pastLoading}>
              <div className="flex flex-col gap-4">
                {pastWorkshops.map((workshop, index) => (
                  <CardHistoryWorkshop 
                    key={`past-${workshop.order_id}-${index}`} 
                    workshop={workshop} 
                    isPast={true} 
                  />
                ))}
              </div>
            </Spin>
            
            
              <div className="flex justify-end mt-6">
                <Pagination
                  current={currentPage}
                  pageSize={4}
                  total={total}
                  onChange={handlePastPageChange}
                  showSizeChanger={false}
                />
              </div>
          
          </div>
        )}
      </div>
    </section>
  );
};

export default UserWorkshop;
