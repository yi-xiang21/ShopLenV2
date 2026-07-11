import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vouchersApi } from '@/pages/Admin/managerVoucher/api/vouchers_api';
import type { voucher } from '@/pages/Admin/managerVoucher/type/vouchers';
import { Spin } from 'antd';
import { Ticket, ArrowLeft, ReceiptText } from 'lucide-react';
import Notification from '@/share/ComponentCustom/Notification/Notification';
import VoucherCard from '../../../component/VoucherCard';

const UserMyVoucher = () => {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState<voucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notifyData, setNotifyData] = useState<{
    key: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchMyVouchers = async () => {
      try {
        setLoading(true);
        const response = await vouchersApi.getMyVouchers();
        setVouchers(response.data?.data?.vouchers || []);
      } catch (error: any) {
        setNotifyData({
          key: Date.now().toString(),
          type: 'error',
          title: 'Lỗi',
          message: error.response?.data?.message || 'Không thể tải danh sách voucher.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMyVouchers();
  }, []);

  return (
    <div className="w-full flex flex-col gap-6 relative">
      {notifyData && (
        <Notification
          key={notifyData.key}
          type={notifyData.type as any}
          title={notifyData.title}
          message={notifyData.message}
        />
      )}

      <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ReceiptText className="text-blue-500" size={24} />
            Kho Voucher Của Tôi
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">Quản lý các mã giảm giá bạn đã thu thập</p>
        </div>
      </div>

      {/* Voucher List */}
      <Spin spinning={loading}>
        {vouchers.length > 0 ? (
          <div className="flex flex-col gap-5">
            {vouchers.map((v: voucher) => (
              <VoucherCard key={v.voucher_id} voucher={v} />
            ))}
          </div>
        ) : (
          !loading && (
            <div className="py-16 bg-white rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center">
              <div className="p-5 bg-slate-50 rounded-full mb-4">
                <Ticket size={48} className="text-slate-300" />
              </div>
              <p className="text-slate-700 text-lg font-bold mb-1">Kho voucher trống</p>
              <p className="text-slate-500 text-sm text-center max-w-sm mb-6">
                Bạn chưa có voucher nào trong kho. Hãy quay lại cửa hàng để đổi thêm voucher nhé!
              </p>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-xl hover:bg-blue-600 transition-colors shadow-sm hover:shadow-blue-200 hover:shadow-md cursor-pointer"
              >
                Khám phá ngay
              </button>
            </div>
          )
        )}
      </Spin>
    </div>
  );
};

export default UserMyVoucher;
