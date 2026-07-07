import React from 'react';
import { Package } from 'lucide-react';
import { parseToDayjs } from "@/share/ComponentCustom/FormatTime"; 
import type { HistoryOrder } from '@/pages/User/UserProfile/types/history-oder';

interface CardOrderProps {
  order: HistoryOrder;
  actionButtons?: React.ReactNode;
}

const formatCurrency = (amount: string | number) => {
  return Number(amount).toLocaleString('vi-VN') + '₫';
};

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed': return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-green-100 text-green-700 uppercase tracking-wider">Hoàn thành</span>;
    case 'cancelled': return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-100 text-red-700 uppercase tracking-wider">Đã hủy</span>;
    case 'refunded': return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-orange-100 text-orange-700 uppercase tracking-wider">Hoàn tiền</span>;
    case 'pending': return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">Chờ xác nhận</span>;
    case 'processing': return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-yellow-100 text-yellow-700 uppercase tracking-wider">Đang xử lý</span>;
    case 'shipping': return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-100 text-purple-700 uppercase tracking-wider">Đang giao hàng</span>;
    default: return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-gray-100 text-gray-700 uppercase tracking-wider">{status}</span>;
  }
};

const CardOrder = ({ order, actionButtons }: CardOrderProps) => {
  return (
    <div className='bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col'>
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
          
          {/* Container cho nút bấm */}
          <div className='mt-3 flex flex-col sm:flex-row gap-2 w-full sm:w-auto'>
            {actionButtons}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardOrder;
