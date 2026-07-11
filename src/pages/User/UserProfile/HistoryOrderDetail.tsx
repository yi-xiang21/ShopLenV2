import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { historyOrderApi } from '@/pages/User/UserProfile/api/historyOrder_api';
import { ArrowLeft, MapPin, CreditCard, PackageOpen } from 'lucide-react';
import type { OrderDetailData } from '@/pages/User/UserProfile/types/history-oder';
import { parseToDayjs } from "@/share/ComponentCustom/FormatTime";


const OrderDetailHistory = () => {
  const navigate=useNavigate();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        if (id) {
          const response = await historyOrderApi.getHistoryOrderDetail(id);

          setOrder(response.data?.data.order );
        }
      } catch (error) {
        console.error("Lỗi tải chi tiết đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  

  const formatCurrency = (amount: string | number) => Number(amount || 0).toLocaleString('vi-VN') + '₫';

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'processing': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Đang xử lý</span>;
      case 'completed': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Hoàn thành</span>;
      case 'cancelled': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Đã hủy</span>;
      default: return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 uppercase">{status || 'UNKNOWN'}</span>;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!order) {
    return <div className="text-center py-10 text-slate-500">Không tìm thấy thông tin đơn hàng!</div>;
  }

  return (
    <section className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-50 transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Chi tiết đơn hàng</h2>
            <p className="text-sm text-slate-500">{order.order_id} {parseToDayjs(order.created_at, 'HH:mm - DD/MM/YYYY')}</p>
          </div>
        </div>
        {getStatusBadge(order.status)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 text-slate-800 font-semibold border-b border-slate-100 pb-3">
            <MapPin size={20} className="text-blue-500" /> Địa chỉ nhận hàng
          </div>
          <div className="text-slate-600 space-y-2 text-sm">
            <p><span className="text-slate-400 w-24 ">Người nhận:</span> <span className="font-medium text-slate-800">{order.customer_name}</span></p>
            <p><span className="text-slate-400 w-24">Điện thoại:</span> <span className="font-medium">{order.phone_number}</span></p>
            <p className="flex"><span className="text-slate-400 w-24 shrink-0">Địa chỉ:</span> <span>{order.shipping_address || "Không có địa chỉ"}</span></p>
          </div>
        </div>

        {/* Box Thông tin thanh toán */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 text-slate-800 font-semibold border-b border-slate-100 pb-3">
            <CreditCard size={20} className="text-purple-500" /> Hình thức thanh toán
          </div>
          <div className="text-slate-600 space-y-2 text-sm">
            {/* Sử dụng ?. an toàn để tránh lỗi crash khi payment bị null */}
            <p><span className="text-slate-400 w-24 ">Phương thức:</span> <span className="font-bold text-slate-700 uppercase">{order.payment?.payment_method || "N/A"}</span></p>
            <p><span className="text-slate-400 w-24 ">Trạng thái:</span> 
              <span className={`font-medium ${order.payment?.payment_status === 'paid' ? 'text-green-600' : 'text-orange-500'}`}>
                {order.payment?.payment_status === 'paid' ? "Đã thanh toán" : "Chưa thanh toán"}
              </span>
            </p>
            <p><span className="text-slate-400 w-24 ">Mã giao dịch:</span> <span>{order.payment?.reference_code || "N/A"}</span></p>
          </div>
        </div>
      </div>

      {/* Box Danh sách sản phẩm */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
  <div className="flex items-center gap-2 text-slate-800 font-semibold p-5 border-b border-slate-100 bg-slate-50">
    <PackageOpen size={20} className="text-amber-500" /> Sản phẩm đã đặt ({order.items?.length || 0})
  </div>
  

  <div className="p-5 flex flex-col gap-4 max-h-100 overflow-y-auto "
  >
    
    {order.items?.map((item) => (
      <div key={item.item_id} className="flex gap-4 items-start py-4 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
        <img src={item.image_url} alt={item.product_name} className="w-20 h-20 shrink-0 object-cover rounded-xl bg-slate-100 border border-slate-200" />
        <div className="flex-1">
          <h4 className="font-semibold text-slate-800 line-clamp-2">{item.product_name}</h4>
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{item.type_name}</span>
            {(item.color || item.size) && (
              <span>Phân loại: {item.color} {item.color && item.size && '|'} {item.size}</span>
            )}
            <span>SKU: {item.sku}</span>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-slate-500">{formatCurrency(item.price)} x {item.quantity}</span>
            <span className="font-bold text-slate-800">{formatCurrency(Number(item.price || 0) * (item.quantity || 0))}</span>
          </div>
        </div>
        
      </div>
      
    ))}
  </div>
</div>

      {/* Box Tổng kết giá tiền */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-end">
        <div className="w-full  space-y-3">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Tổng tiền hàng:</span>
            <span>{formatCurrency(Number(order.total_amount || 0) + Number(order.discount_amount || 0) - Number(order.shipping_fee || 0))}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-600">
            <span>Phí vận chuyển:</span>
            <span>{formatCurrency(order.shipping_fee)}</span>
          </div>
          <div className="flex justify-between text-sm text-green-600">
            <span>Khuyến mãi:</span>
            <span>- {formatCurrency(order.discount_amount)}</span>
          </div>
          <div className="border-t border-slate-200 pt-3 mt-3 flex justify-between items-center">
            <span className="font-semibold text-slate-800">Thành tiền:</span>
            <span className="text-2xl font-extrabold text-rose-600">{formatCurrency(order.total_amount)}</span>
          </div>
        </div>
      </div>

    </section>
  );
};

export default OrderDetailHistory;