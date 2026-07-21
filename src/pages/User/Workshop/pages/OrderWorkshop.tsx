import { IoHomeOutline } from "react-icons/io5";
import { BillingApi } from "@/pages/User/Billing/api/billing_api";
import { useEffect, useState } from "react";
import type { orderWorkShop, orderWorkShopitems } from "@/pages/User/Workshop/types/order_workshop";
import { useAppSelector } from "@/app/redux/hooks";
import { Modal } from "antd";
import { CiShoppingBasket } from "react-icons/ci";
import { vouchersApi } from "@/pages/Admin/managerVoucher/api/vouchers_api";
import type { voucher } from "@/pages/Admin/managerVoucher/type/vouchers";
import type { NotificationType } from "@/share/ComponentCustom/Notification/Notification";

import Notification from "@/share/ComponentCustom/Notification/Notification";
import { FaCheck } from "react-icons/fa";
import { MdPayments } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import type { Workshop } from "@/pages/Admin/managerWorkshop/types/workshop";
import { WorkshopApi } from "@/pages/Admin/managerWorkshop/api/workShop_api";

const BillingWorkShopPage = () => {
  const navigate = useNavigate();
  const { id, quantity } = useParams<{ id: string; quantity: string }>();
  const [product, setProduct] = useState<Workshop | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVoucherOpen, setIsModalVoucherOpen] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState<number | null>(null);
  const [appliedVoucher, setAppliedVoucher] = useState<voucher | null>(null);

  const { user } = useAppSelector((state) => state.auth);

  const [firstName, setFirstName] = useState<string>(user?.first_name || "");
  const [lastName, setLastName] = useState<string>(user?.last_name || "");
  const [discountCode, setDiscountCode] = useState<voucher[]>([]);
  
  const [notifyData, setNotifyData] = useState<{
      key: string;
      type: NotificationType;
      title: string;
      message: string;
    } | null>(null);

  const [formData, setFormData] = useState({
    dia_chi_nguoi_nhan: "",
    sdt_nguoi_nhan: "",
  });

  useEffect(() => {
      const fetchProductData = async () => {
        try {
          const response = await WorkshopApi.getById(id);
          const productData = response.data?.data.workshop || null;
          setProduct(productData);
        } catch (error) {
          console.error("Lỗi khi tải thông tin workshop:", error);
        }
      };
      if (id) {
        void fetchProductData();
      }
    }, [id]);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await vouchersApi.getMyVouchers();
        const voucher = response.data.data.vouchers.filter((voucher: voucher) => {
          return voucher.discount_type !== "free_ship"
        });
        setDiscountCode(voucher);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };
    fetchVouchers();

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

 
  const orderQty = Number(quantity) || 1;
  const firstSession = product?.sessions?.[0];
  const unitPrice = Number(firstSession?.final_price || firstSession?.price || 0);
  const subtotal = unitPrice * orderQty;

  const showModalUser = () => {
    setIsModalOpen(true);
  };
  const showModalVoucher = () => {
    setIsModalVoucherOpen(true);
  };

  const handleOkUser = () => {
    if (!firstName || !lastName) {
      setNotifyData({
        key: Date.now().toString(),
        type: "error",
        title: "Thiếu thông tin",
        message: "Vui lòng nhập đầy đủ họ và tên!",
      });
      return;
    }
    const phoneToTest = formData.sdt_nguoi_nhan.trim();
    if (!phoneToTest) {
      setNotifyData({
        key: Date.now().toString(),
        type: "error",
        title: "Thiếu thông tin",
        message: "Vui lòng nhập số điện thoại!",
      });
      return;
    }
    if (phoneToTest && !/^\d{10,11}$/.test(phoneToTest)) {
        setNotifyData({
          key: Date.now().toString(),
          type: "error",
          title: "Sai định dạng",
          message: "Vui lòng nhập số điện thoại hợp lệ!",
        });
        return;
      }
    setIsModalOpen(false);
  };

  const handleCancelUser = () => {
    setIsModalOpen(false);
  };
  const handleCancelVoucher = () => {
    setIsModalVoucherOpen(false);
  };

  const handSubmitOrder = async () => {
    try {
      if (!firstSession) {
         setNotifyData({
          key: Date.now().toString(),
          type: "error",
          title: "Lỗi dữ liệu",
          message: "Không tìm thấy thông tin ca học!",
        });
        return;
      }

      const buy_now_item: orderWorkShopitems = {
        variant_id: firstSession.variant_id || 0,
        quantity: orderQty,
      };

      const finalPayload: orderWorkShop = {
        ten_nguoi_nhan: `${firstName || ""} ${lastName || ""}`.trim() || user?.first_name + " " + user?.last_name,
        sdt_nguoi_nhan: formData.sdt_nguoi_nhan || user?.phone_number || "",
        dia_chi_giao_hang: "khong co dia chi",
        phuong_xa_id: null,
        shipping_method_id: null,
        phuong_thuc_thanh_toan: "MOMO",
        phieu_giam_gia_code: appliedVoucher?.code || "",
        buy_now_item: buy_now_item,
      };

      if (!finalPayload.ten_nguoi_nhan || !finalPayload.sdt_nguoi_nhan ) {
        setNotifyData({
          key: Date.now().toString(),
          type: "error",
          title: "Thiếu thông tin",
          message: "Vui lòng nhập đầy đủ thông tin giao hàng!",
        });
        return; 
      }


      const respone = await BillingApi.createOrderBuyNow(finalPayload);
      
      const paymentUrl = respone.data.data.payUrl; 
      if (paymentUrl) {
         window.open(paymentUrl, "_blank");
      }
      
      setNotifyData({
        key: Date.now().toString(),
        type: "success",
        title: "Thành công",
        message: "Đơn hàng đã được tạo thành công!",
      });

      navigate("/billing-success");
      
    } catch (error: any) {
      setNotifyData({
        key: Date.now().toString(),
        type: "error",
        title: "Lỗi",
        message: `Lỗi khi tạo đơn hàng: ${error.response?.data?.message || "Vui lòng thử lại!"}`,
      });
    }
  };

  const handleSelect = (voucherId: number) => {
    setSelectedVoucherId((prevId) => (prevId === voucherId ? null : voucherId));
  };

  const handleApply = async () => {
     if (selectedVoucherId === null) {
      setAppliedVoucher(null);
      setIsModalVoucherOpen(false);
      return; 
    }

    const selectedVoucher = discountCode.find(
      (v) => v.voucher_id === selectedVoucherId
    );
    const minOrderValue = Number(selectedVoucher?.minimum_value || 0);

    if (subtotal < minOrderValue) { 
      setNotifyData({
        key: Date.now().toString(),
        type: "error",
        title: "Lỗi",
        message: `Đơn hàng chưa đạt mức tối thiểu ${minOrderValue.toLocaleString("vi-VN")}₫ để sử dụng voucher này!`,
      });
      return; 
    }

    const payload = { 
      code: selectedVoucher?.code || "", 
      order_value: subtotal ,
      shipping_method_id: null,
    };

    try {
      await vouchersApi.applyVoucher(payload);
      setAppliedVoucher(selectedVoucher || null);
      setIsModalVoucherOpen(false); 
    } catch (error :any) {
     setNotifyData({
        key: Date.now().toString(),
        type: "error",
        title: "Lỗi",
        message: `Lỗi áp dụng voucher: ${error.response?.data?.message || "Vui lòng thử lại!"}`,
      });
    }
  };

  const discountAmount = appliedVoucher
    ? appliedVoucher.discount_type === "percent"
      ? (subtotal * Number(appliedVoucher.value)) / 100
      : Number(appliedVoucher.value)
    : 0;
  
  const totalAmount = Math.max(0, subtotal - discountAmount);

  return (
    <div className="p-4">
      {notifyData && (
        <Notification
          key={notifyData.key}
          type={notifyData.type}
          title={notifyData.title}
          message={notifyData.message}
        />
      )}
      
      {/* Modal Cập nhật thông tin giao hàng */}
      <Modal
        title="Thay đổi thông tin giao hàng"
        open={isModalOpen}
        onOk={handleOkUser}
        onCancel={handleCancelUser}
      >
        <div className="flex flex-col gap-4">
          <label>Họ:</label>
          <input
            type="text"
            placeholder="Nhập họ của bạn"
            className="border border-gray-300 rounded p-2"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <label>Tên:</label>
          <input
            type="text"
            placeholder="Nhập tên của bạn"
            className="border border-gray-300 rounded p-2"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <label>Số Điện Thoại:</label>
          <input
            type="text"
            placeholder="Nhập số điện thoại"
            className="border border-gray-300 rounded p-2"
            value={formData.sdt_nguoi_nhan}
            onChange={(e) =>
              setFormData({ ...formData, sdt_nguoi_nhan: e.target.value })
            }
          />
        </div>
      </Modal>

      {/* Modal Chọn Voucher */}
      <Modal
        title="Chọn Voucher"
        open={isModalVoucherOpen}
        onOk={handleApply}
        onCancel={handleCancelVoucher}
      >
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
          {discountCode.length > 0 ? (
            discountCode.map((voucher) => {
              const isSelected = selectedVoucherId === voucher.voucher_id;
              return (
                <div
                  key={voucher.voucher_id}
                  onClick={() => handleSelect(voucher.voucher_id || 0)}
                  className={`flex items-center justify-between gap-4 shadow rounded-2xl p-4 cursor-pointer transition-all duration-300 ease-out border-2 ${
                    isSelected
                      ? "border-blue-500 bg-blue-50" 
                      : "border-transparent hover:shadow-md bg-white" 
                  }`}
                >
                  <div className="flex flex-col flex-1">
                    <span className="text-[16px] font-medium text-gray-800">
                      {voucher.voucher_name}
                    </span>
                    <span className="mt-0.5 text-[13px] font-light text-gray-500">
                      Mã: <span className="font-semibold text-gray-700">{voucher.code}</span>
                    </span>
                    <span className="mt-1.5 text-[12px] text-gray-500 bg-gray-100 w-fit px-2 py-0.5 rounded-md">
                      Đơn tối thiểu {Number(voucher.minimum_value).toLocaleString("vi-VN")}₫
                      {voucher.max_discount && ` - Giảm tối đa ${Number(voucher.max_discount).toLocaleString("vi-VN")}₫`}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[15px] font-bold text-red-600">
                      {voucher.discount_type === "percent"
                        ? `${Number(voucher.value)}%`
                        : `${Number(voucher.value).toLocaleString("vi-VN")}₫`}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && <FaCheck className="text-white text-xs" />}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center py-4">Không có voucher khả dụng cho đơn hàng này.</p>
          )}
        </div>
      </Modal>

      <div className="mb-8 text-center mt-6">
        <h1 className="text-3xl font-semibold">Hóa Đơn Thanh Toán</h1>
        <p className="text-gray-500 mt-2 text-sm md:text-base">Kiểm tra thông tin và hoàn tất đơn hàng của bạn</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-8 h-full w-full max-w-7xl mx-auto justify-center gap-6 pb-12">
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Block: Thông tin khách hàng */}
          <div className="flex flex-col gap-6 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
              <div className="rounded-full bg-blue-50 p-3 w-fit text-blue-600">
                <IoHomeOutline size={24} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 tracking-tight">Thông tin khách hàng</h2>
            </div>
            <div className="flex flex-col gap-4 px-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <span className="text-[13px] font-medium text-gray-500 mb-1">Họ và tên</span>
                  <span className="text-[15px] font-semibold text-gray-900">
                    {firstName || lastName
                      ? `${firstName} ${lastName}`.trim()
                      : `${user?.first_name} ${user?.last_name}`}
                  </span>
                </div>
                <div className="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <span className="text-[13px] font-medium text-gray-500 mb-1">Số điện thoại</span>
                  <span className="text-[15px] font-semibold text-gray-900">
                    {formData.sdt_nguoi_nhan
                      ? formData.sdt_nguoi_nhan
                      : user?.phone_number}
                  </span>
                </div>
              </div>
              <div>
                <button
                  className="bg-rose-50 text-rose-500 font-medium px-4 py-2 rounded-xl border border-rose-100 hover:bg-rose-500 hover:text-white transition-all duration-300 w-full md:w-auto"
                  onClick={showModalUser}
                >
                  Cập nhật thông tin
                </button>
              </div>
            </div>
          </div>

          {/* Block: Phương thức thanh toán */}
          <div className="flex flex-col gap-6 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
              <div className="rounded-full bg-purple-50 p-3 w-fit text-purple-600">
                <MdPayments size={24} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 tracking-tight">Phương Thức Thanh Toán</h2>
            </div>
            <div className="flex flex-col gap-4 px-2">
              <div className="grid grid-cols-1 gap-4">
                <div
                  className="group relative flex cursor-default items-center justify-between rounded-2xl p-4 transition-all duration-300 ease-out border border-orange-500 bg-orange-50 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-2.5 w-2.5 rounded-full transition-colors duration-300 bg-[#fb923c]"></div>
                    <div className="flex flex-col">
                      <span className="text-[15px] text-gray-900 font-semibold">
                        Ví MOMO (Mặc định)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cột Tóm tắt đơn hàng */}
        <div className="lg:col-span-3">
          <div className="flex flex-col gap-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 lg:sticky lg:top-24 h-fit">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
              <div className="rounded-full bg-rose-50 p-3 w-fit text-rose-500">
                <CiShoppingBasket size={24} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 tracking-tight">Tóm Tắt Đơn Hàng</h2>
            </div>
            
            {/* Thông tin khóa học */}
            <div className="mt-2">
              {product ? (
                <div className="flex flex-col gap-3 overflow-auto max-h-150 pr-2 no-scrollbar">
                  <div className="flex items-center justify-between gap-4 border border-gray-100 shadow-sm rounded-2xl p-4 hover:shadow-md transition-all duration-300 ease-out bg-white">
                    <div className="flex items-center gap-4 w-full">
                      <img
                        src={firstSession?.images?.[0]?.image_url || ""}
                        alt={product.title}
                        className="h-12 w-12 rounded object-cover bg-gray-50 shrink-0"
                      />
                      <div className="flex flex-col gap-1 overflow-hidden w-full">
                        <span className="text-[15px] text-gray-700 transition-colors group-hover:text-gray-900 font-medium line-clamp-2">
                          {product.title}
                        </span>
                        <div className="flex items-center justify-between gap-4">
                          <span className="mt-0.5 text-[13px] font-light text-gray-500">
                            Ca học: {firstSession?.session_name || "Mặc định"} | SL: {orderQty}
                          </span>
                          <div className="flex items-center gap-1.5 text-[14px] font-medium transition-colors text-red-600 whitespace-nowrap">
                            <span>
                              {Number(firstSession?.price || 0).toLocaleString("vi-VN")}₫
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6">Đang tải thông tin khóa học...</p>
              )}
            </div>

            <div className="h-px bg-gray-100 my-2"></div>

            {/* Áp dụng khuyến mãi */}
            <div className="flex items-center justify-between gap-4 py-2">
              <span className="text-[15px] font-medium text-gray-700">Mã giảm giá</span>
              <button
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-3 py-1.5 rounded-full"
                onClick={() => showModalVoucher()}
              >
                {appliedVoucher ? "Đổi mã khác" : "Chọn mã"}
              </button>
            </div>
            
            {/* Tổng kết giá */}
            <div className="flex flex-col gap-3 py-3 border-t border-gray-50 mt-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[15px] text-gray-600">Tạm tính</span>
                <span className="text-[15px] font-medium text-gray-800">
                  {Number(subtotal).toLocaleString("vi-VN")}₫
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-[15px] text-gray-600">Giảm giá</span>
                <span className="text-[15px] font-medium text-green-600">
                  - {Number(discountAmount).toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>
            
            <div className="h-px bg-gray-100 my-1"></div>

            {/* Tổng cộng */}
            <div className="flex items-center justify-between gap-4 py-3">
              <span className="text-[16px] font-semibold text-gray-900">Tổng tiền</span>
              <span className="text-[20px] font-bold text-rose-600">
                {Number(totalAmount).toLocaleString("vi-VN")}₫
              </span>
            </div>
            
            {/* Đặt hàng */}
            <div className="mt-2">
              <button
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-rose-500 py-4 text-[15px] font-semibold text-white shadow-lg shadow-rose-200 transition-all duration-300 hover:bg-rose-600 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={handSubmitOrder}
              >
                Tiến Hành Thanh Toán
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingWorkShopPage;