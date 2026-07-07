import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { historyOrderApi } from '@/pages/User/UserProfile/api/historyOrder_api'; 
import type { HistoryOrder } from '@/pages/User/UserProfile/types/history-oder'; 
import { Package, ChevronRight, ShoppingCart } from 'lucide-react';
import type { NotificationType } from '@/share/ComponentCustom/Notification/Notification';
import Notification from '@/share/ComponentCustom/Notification/Notification';
import {BillingApi} from "@/pages/User/Billing/api/billing_api";
import CardOrder from '@/component/CardOrder';
import { useAppDispatch } from '@/app/redux/hooks';
import { getCart } from '../cart/store/cart_thunck';
const PurchaseHistory = () => {
  const [orders, setOrders] = useState<HistoryOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const limit = 5;
   const dispatch = useAppDispatch();


  const [notifyData, setNotifyData] = useState<{
        key: string;
        type: NotificationType;
        title: string;
        message: string;
      } | null>(null);

  const fetchHistoryOrders = async () => {
    try {
      setLoading(true);
      const response = await historyOrderApi.getHistoryOrders(page, limit, 'history');
      if (response.data?.success) {
        setOrders(response.data.data.orders || []);
        setTotal(response.data.data.pagination.total_items || 0);
      }
    } catch (error) {
      console.error("Lỗi khi tải lịch sử đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryOrders();
  }, [page]);

 
  const handleBuyAgain = async (orderId: string) => {
    try {
    
      const response = await BillingApi.postOrderRepurchase(orderId);
      
      if (response.data?.success) {
        setNotifyData({
          key: Date.now().toString(),
          type: 'success',
          title: 'Thành công',
          message: 'Đã thêm các sản phẩm vào giỏ hàng thành công!',
        }); 
        dispatch(getCart());
      }
    } catch (error: any) {
      console.error("Lỗi khi mua lại:", error);
      setNotifyData({
        key: Date.now().toString(),
        type: 'error',
        title: 'Lỗi mua lại',
        message: error.response?.data?.message || 'Có lỗi xảy ra, không thể mua lại đơn hàng này.',
      });
    }
  };



  const totalPages = Math.ceil(total / limit);

  return (
    <section className='space-y-6'>
      {notifyData && (
        <Notification
          key={notifyData.key}
          type={notifyData.type}
          title={notifyData.title}
          message={notifyData.message}
        />
      )}
      <div>
        <p className='text-sm font-bold uppercase tracking-[0.2em] text-[#b95b2d]'>Lịch sử giao dịch</p>
        <h2 className='mt-1 text-3xl font-extrabold text-slate-800'>Đơn hàng đã hoàn tất</h2>
      </div>
      
      <div className='flex flex-col gap-4'>
        {loading ? (
          <div className='flex justify-center items-center py-10'>
            <div className='w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin'></div>
          </div>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <CardOrder 
              key={order.order_id} 
              order={order} 
              actionButtons={
                <>
                
                {order.type != "workshop" && (
                  <button
                    onClick={() => handleBuyAgain(order.order_id)}
                    className='flex items-center justify-center gap-1.5 px-4 py-2 bg-red-300 text-white font-semibold text-sm rounded-lg hover:bg-rose-600 transition-colors w-full sm:w-auto hover:cursor-pointer'
                  >
                    <ShoppingCart size={16} /> Mua lại
                  </button>
                )}
                  <Link 
                    to={`/profile/purchase-history/order-detail/${order.order_id}`} 
                    className='flex items-center justify-center gap-1 px-4 py-2 bg-blue-50 text-blue-600 font-semibold text-sm rounded-lg hover:bg-blue-100 transition-colors w-full sm:w-auto'
                  >
                    Xem chi tiết <ChevronRight size={16} />
                  </Link>
                </>
              } 
            />
          ))
        ) : (
          <div className='flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-slate-300'>
            <Package size={48} className="text-slate-200 mb-3" />
            <p className='text-slate-500 font-medium'>Bạn chưa có đơn hàng nào.</p>
          </div>
        )}

        {!loading && total > limit && (
          <div className='flex items-center justify-center gap-4 mt-4'>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${page === 1 ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Trang trước
            </button>
            <span className='text-sm font-medium text-slate-500'>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${page === totalPages ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Trang sau
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PurchaseHistory;