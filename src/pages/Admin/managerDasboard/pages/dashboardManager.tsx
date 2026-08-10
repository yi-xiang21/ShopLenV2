import { DashboardApi } from "@/pages/Admin/managerDasboard/api/dashboard._api";
import { useEffect, useState } from "react";
import type { DashboardOverview } from "../types/dasboard";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,

} from 'recharts';
import {
  DollarSign, ShoppingBag, Users, CalendarDays, TrendingUp, TrendingDown,
  AlertTriangle, Package, Clock, Truck
} from "lucide-react";

// Khởi tạo data mặc định
const defaultDashboardData: DashboardOverview = {

  financial: {
    total_revenue: 0,
    total_cost: 0,
    total_profit: 0,
  },
  revenue: {
    today: 0,
    this_week: 0,
    this_month: 0,
    growth_vs_last_week: 0,
  },
  revenue_chart: [],
  top_orders_today: [],
  orders_count: {
    pending: 0,
    processing: 0,
    shipping: 0,
    completed: 0,
    cancelled: 0,
    growth_vs_last_week: 0,
  },
  workshop_stats: {
    bookings_today: 0,
    upcoming_count: 0,
    growth_vs_last_week: 0,
    top_workshops: [],
  },
  users: {
    active_customers: 0,
    active_shippers: 0,
    new_this_month: 0,
  },
  inventory_alerts: {
    out_of_stock: 0,
    low_stock: 0,
  },
  top_selling_products: [],
};

const DashboardManager = () => {
  const [dashboardData, setDashboardData] = useState<DashboardOverview>(defaultDashboardData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await DashboardApi.getAll();
        if (response.data?.data) {
          setDashboardData(response.data.data);
        }
        console.log("Dashboard data fetched:", response.data?.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Hàm format tiền tệ
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Hàm render thẻ tăng trưởng (Xanh/Đỏ)
  const renderGrowthBadge = (growth: number) => {
    const isPositive = growth >= 0;
    return (
      <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {Math.abs(growth)}% so với tuần trước
      </div>
    );
  };

  // Nếu đang loading thì hiển thị skeleton (Tùy chọn)
  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tổng quan hệ thống</h1>
          <p className="text-sm text-slate-500">Cập nhật dữ liệu kinh doanh và hoạt động của bạn</p>
        </div>
      </div>

      {/* ================= 1. BỘ THẺ KPI ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Doanh thu tháng này */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 hover:shadow-md transition-shadow duration-300 ">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Doanh thu tháng này</span>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <DollarSign size={20} />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800">{formatCurrency(dashboardData.revenue.this_month)}</h2>
          {renderGrowthBadge(dashboardData.revenue.growth_vs_last_week)}
        </div>

        {/* Tổng đơn hàng (Lấy ví dụ đơn Completed) */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Đơn hàng thành công</span>
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ShoppingBag size={20} />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800">{dashboardData.orders_count.completed}</h2>
          {renderGrowthBadge(dashboardData.orders_count.growth_vs_last_week)}
        </div>

        {/* Khách hàng */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Khách hàng hoạt động</span>
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <Users size={20} />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800">{dashboardData.users.active_customers}</h2>
          <div className="text-xs text-slate-500">
            <span className="font-semibold text-purple-600">+{dashboardData.users.new_this_month}</span> khách mới tháng này
          </div>
        </div>

        {/* Workshop sắp tới */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Workshop sắp khai giảng</span>
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
              <CalendarDays size={20} />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800">{dashboardData.workshop_stats.upcoming_count}</h2>
          <div className="text-xs text-slate-500">
            Hôm nay có: <span className="font-semibold text-orange-600">{dashboardData.workshop_stats.bookings_today}</span> lượt đặt
          </div>
        </div>
      </div>

      {/* ================= 1.1. FINANCIAL OVERVIEW ================= */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Tổng quan doanh thu từ đơn hàng</h3>
            <p className="text-sm text-slate-500">Tổng hợp doanh thu, chi phí và lợi nhuận để nhìn nhanh hiệu quả kinh doanh.</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
            <div className="text-sm text-slate-500 mb-2">Tổng doanh thu</div>
            <div className="text-2xl font-extrabold text-slate-800">
              {formatCurrency(dashboardData.financial.total_revenue)}
            </div>
            <div className="mt-3 text-xs text-slate-500">
              Doanh thu tích lũy từ các đơn hoàn tất
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
            <div className="text-sm text-slate-500 mb-2">Tổng chi phí</div>
            <div className="text-2xl font-extrabold text-slate-800">
              {formatCurrency(dashboardData.financial.total_cost)}
            </div>
            <div className="mt-3 text-xs text-slate-500">
              Chi phí gốc để tạo ra doanh thu hiện tại
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
            <div className="text-sm text-slate-500 mb-2">Lợi nhuận</div>
            <div className="text-2xl font-extrabold text-emerald-600">
              {formatCurrency(dashboardData.financial.total_profit)}
            </div>
            <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
              {dashboardData.financial.total_profit >= 0 ? (
                <TrendingUp size={12} className="text-emerald-600" />
              ) : (
                <TrendingDown size={12} className="text-rose-600" />
              )}
              {dashboardData.financial.total_cost > 0
                ? `${((dashboardData.financial.total_profit / dashboardData.financial.total_cost) * 100).toFixed(1)}% so với chi phí`
                : 'Chưa có dữ liệu chi phí'}
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. BIỂU ĐỒ & THÔNG SỐ VẬN HÀNH ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Biểu đồ Doanh thu (Chiếm 2 cột) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Biểu đồ doanh thu 7 ngày qua</h3>
          <div className="flex-1 min-h-75">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.revenue_chart} margin={{ top: 10, right: 10, left: 30, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(val) => {
                    // Cắt chỉ lấy ngày tháng (VD: 2026-07-06 -> 06/07)
                    const dateObj = new Date(val);
                    return `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;

                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(val) => formatCurrency(Number(val || 0))}
                />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value || 0)), "Doanh thu"]}
                  labelFormatter={(label) => `Ngày: ${label}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>


        <div className="flex flex-col gap-6">
          {/* Trạng thái đơn hàng */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Trạng thái đơn hàng</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="p-2 bg-amber-50 text-amber-500 rounded-lg"><Clock size={16} /></div>
                  <span className="font-medium">Chờ xác nhận</span>
                </div>
                <span className="font-bold text-lg text-slate-800">{dashboardData.orders_count.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><Package size={16} /></div>
                  <span className="font-medium">Đang xử lý</span>
                </div>
                <span className="font-bold text-lg text-slate-800">{dashboardData.orders_count.processing}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg"><Truck size={16} /></div>
                  <span className="font-medium">Đang giao</span>
                </div>
                <span className="font-bold text-lg text-slate-800">{dashboardData.orders_count.shipping}</span>
              </div>
            </div>
          </div>

          {/* Cảnh báo kho hàng */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle size={18} className="text-rose-500" /> Cảnh báo tồn kho
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-rose-600 mb-1">{dashboardData.inventory_alerts.out_of_stock}</span>
                <span className="text-xs font-semibold text-rose-700 uppercase">Hết hàng</span>
              </div>
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-orange-600 mb-1">{dashboardData.inventory_alerts.low_stock}</span>
                <span className="text-xs font-semibold text-orange-700 uppercase">Sắp hết</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* DANH SÁCH BÁN CHẠY*/}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Sản phẩm */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Sản phẩm bán chạy nhất</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-sm text-slate-500">
                  <th className="pb-3 font-medium">Xếp hạng</th>
                  <th className="pb-3 font-medium">Tên sản phẩm</th>
                  <th className="pb-3 font-medium text-right">Đã bán</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.top_selling_products.map((item, index) => (
                  <tr key={index} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                    <td className="py-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-amber-100 text-amber-600' : index === 1 ? 'bg-slate-200 text-slate-600' : index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-400'}`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-3 font-medium text-slate-700">{item.product_name}</td>
                    <td className="py-3 text-right font-bold text-blue-600">{item.total_sold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {dashboardData.top_selling_products.length === 0 && (
              <div className="text-center py-6 text-slate-500 text-sm">Chưa có dữ liệu sản phẩm bán chạy</div>
            )}
          </div>
        </div>

        {/* Có thể thêm Top Workshop hoặc Đơn hàng gần đây vào cột 2 này (Tùy chỉnh sau) */}
        <div className="rounded-2xl flex flex-col gap-4  justify-center text-center">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 text-start">  Top đơn hàng trong tuần</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-sm text-slate-500">
                    <th className="pb-3 font-medium">Xếp hạng</th>
                    <th className="pb-3 font-medium">Mã đơn hàng</th>
                    <th className="pb-3 font-medium">Tên khách hàng</th>
                    <th className="pb-3 font-medium text-right">Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.top_orders_today.map((item, index) => (
                    <tr key={index} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                      <td className="py-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-amber-100 text-amber-600' : index === 1 ? 'bg-slate-200 text-slate-600' : index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-400'}`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-3 font-medium text-slate-700">{item.order_id}</td>
                      <td className="py-3 font-medium text-slate-700">{item.customer_name}</td>
                      <td className="py-3 text-right font-bold text-red-500">{formatCurrency(item.total_amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {dashboardData.top_selling_products.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-sm">Chưa có dữ liệu sản phẩm bán chạy</div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 text-start">  Top Workshop nổi bật trong tuần</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-sm text-slate-500">
                    <th className="pb-3 font-medium">Xếp hạng</th>
                    <th className="pb-3 font-medium w-50">Tên workshop</th>
                    <th className="pb-3 font-medium text-right">Tổng số lượng đăng ký</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.workshop_stats.top_workshops.map((item, index) => (
                    <tr key={index} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                      <td className="py-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-amber-100 text-amber-600' : index === 1 ? 'bg-slate-200 text-slate-600' : index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-400'}`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-3 font-medium text-slate-700">{item.title}</td>
                      <td className="py-3 font-medium text-slate-700 text-right">{item.total_bookings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {dashboardData.workshop_stats.top_workshops.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-sm">Chưa có dữ liệu Workshop</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardManager;