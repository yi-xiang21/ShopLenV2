import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { historyOrderApi } from '@/pages/User/UserProfile/api/historyOrder_api'; 
import type { HistoryOrder } from '@/pages/User/UserProfile/types/history-oder'; 
import { Package, ChevronRight, ShoppingCart } from 'lucide-react';

import { parseToDayjs } from "@/share/ComponentCustom/FormatTime"; 
import type { NotificationType } from '@/share/ComponentCustom/Notification/Notification';
import Notification from '@/share/ComponentCustom/Notification/Notification';
import {BillingApi} from "@/pages/User/Billing/api/billing_api";
const PurchaseHistory = () => {
  const [orders, setOrders] = useState<HistoryOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const limit = 5;


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

  const formatCurrency = (amount: string | number) => {
    return Number(amount).toLocaleString('vi-VN') + '₫';
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-green-100 text-green-700 uppercase tracking-wider">Hoàn thành</span>;
      case 'cancelled': return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-100 text-red-700 uppercase tracking-wider">Đã hủy</span>;
      case 'refunded': return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-orange-100 text-orange-700 uppercase tracking-wider">Hoàn tiền</span>;
      default: return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-gray-100 text-gray-700 uppercase tracking-wider">{status}</span>;
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
            <div 
              key={order.order_id} 
              className='bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col'
            >
             
              <div className='bg-slate-50 px-5 py-3 border-b border-slate-100 flex justify-between items-center'>
                <div className='flex items-center gap-3'>
                  <Package size={18} className="text-slate-400" />
                  <span className='font-bold text-slate-700'>{order.order_id}</span>
                 
                  <span className='text-xs text-slate-400 hidden sm:inline'>
                    • {parseToDayjs(order.created_at)?.format('HH:mm - DD/MM/YYYY')}
                  </span>
                </div>
                {getStatusBadge(order.status)}
              </div>

              {/* Card Body */}
              <div className='p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                <div className='text-sm text-slate-600 flex flex-col gap-1.5 flex-1'>
                  <p><span className="text-slate-400 w-20 ">Người nhận:</span> <span className="font-semibold text-slate-800">{order.customer_name}</span></p>
                  <p className="line-clamp-1"><span className="text-slate-400 w-20 ">Giao đến:</span> {order.shipping_address || "Không có địa chỉ"}</p>
                </div>

                <div className='flex flex-col items-start sm:items-end w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100'>
                  <span className='text-xs text-slate-400 font-medium mb-0.5'>Tổng thanh toán</span>
                  <span className='text-xl font-extrabold text-rose-600'>{formatCurrency(order.total_amount)}</span>
                  
                  {/* Container cho 2 nút bấm: Mua lại và Xem chi tiết */}
                  <div className='mt-3 flex flex-col sm:flex-row gap-2 w-full sm:w-auto'>
                    <button
                      onClick={() => handleBuyAgain(order.order_id)}
                      className='flex items-center justify-center gap-1.5 px-4 py-2 bg-black text-white! font-semibold text-sm rounded-lg hover:bg-rose-600 transition-colors w-full sm:w-auto hover:cursor-pointer'
                    >
                      <ShoppingCart size={16} /> Mua lại
                    </button>

                    <Link 
                      to={`/profile/purchase-history/order-detail/${order.order_id}`} 
                      className='flex items-center justify-center gap-1 px-4 py-2 bg-blue-50 text-blue-600 font-semibold text-sm rounded-lg hover:bg-blue-100 transition-colors w-full sm:w-auto'
                    >
                      Xem chi tiết <ChevronRight size={16} />
                    </Link>
                  </div>

                </div>
              </div>
            </div>
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