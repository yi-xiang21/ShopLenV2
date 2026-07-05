import { IoHomeOutline } from "react-icons/io5";
import { BillingApi } from "@/pages/User/Billing/api/billing_api";
import { useEffect, useState } from "react";
import type { orderWorkShop, orderWorkShopitems } from "@/pages/User/Workshop/types/order_workshop";
import { useAppSelector } from "@/app/redux/hooks";
import { Button, Modal } from "antd";
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
        setDiscountCode(response.data.data.vouchers);
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

  // Tính toán dữ liệu đơn hàng dựa trên product thay vì cart
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
      console.log("Payload gửi đi:", finalPayload);

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
      console.warn("Chưa chọn voucher");
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
      order_value: subtotal 
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

      <p className="text-xl font-bold">Hóa Đơn Thanh Toán</p>
      
      <div className="grid grid-cols-6 p-4 h-full w-full justify-center gap-4">
        <div className="col-span-4 flex flex-col gap-4">
          
          {/* Block: Thông tin giao hàng */}
          <div className="flex flex-col gap-4 bg-blue-200 rounded-3xl h-auto p-4 shadow-md">
            <div className="flex items-center gap-4">
              <p className="rounded-full bg-white p-2 w-fit text-blue-500">
                <IoHomeOutline />
              </p>
              <h2 className="text-2xl">Thông tin khách hàng</h2>
            </div>
            <div className="flex flex-col gap-2 pr-10 pl-10">
              <div className="flex flex-col gap-2">
                <span>
                  Họ và tên:{" "}
                  <span className="mt-0.5 text-[15px] font-light text-gray-600">
                    {firstName || lastName
                      ? `${firstName} ${lastName}`.trim()
                      : `${user?.first_name} ${user?.last_name}`}
                  </span>
                </span>
                <span>
                  Số điện thoại:{" "}
                  <span className="mt-0.5 text-[15px] font-light text-gray-600">
                    {formData.sdt_nguoi_nhan
                      ? formData.sdt_nguoi_nhan
                      : user?.phone_number}
                  </span>
                </span>
                
              </div>
            </div>
            <div>
              <button
                className="bg-rose-300 text-white p-2 rounded w-full hover:bg-rose-400 hover:shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:cursor-pointer"
                onClick={showModalUser}
              >
                Cập nhật thông tin
              </button>
            </div>
          </div>

          {/* Block: Phương thức thanh toán */}
          <div className="flex flex-col gap-4 bg-purple-100 rounded-3xl h-auto p-4 shadow-md">
            <div className="flex items-center gap-4">
              <p className="rounded-full bg-white p-2 w-fit text-purple-500">
                <MdPayments />
              </p>
              <h2 className="text-2xl">Phương Thức Thanh Toán</h2>
            </div>
            <div className="flex flex-col gap-2 pr-10 pl-10">
              <div className="flex flex-col gap-2">
                <div
                  className="group relative flex cursor-default items-center justify-between rounded-3xl p-4 transition-all duration-300 ease-out border border-transparent bg-[#faeee0] shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-2.5 w-2.5 rounded-full transition-colors duration-300 bg-[#fb923c]"></div>
                    <div className="flex flex-col">
                      <span className="text-[15px] text-gray-700 transition-colors group-hover:text-gray-900 font-semibold">
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
        <div className="col-span-2 bg-white rounded-3xl h-auto p-2 shadow-md">
          <div className="flex flex-col gap-2 rounded-3xl h-auto p-2">
            <div className="flex items-center gap-4">
              <p className="rounded-full p-2 w-fit text-yellow-500">
                <CiShoppingBasket />
              </p>
              <h2 className="text-2xl">Tóm Tắt Đơn Hàng</h2>
            </div>
            
            {/* Thông tin khóa học */}
            <div>
              {product ? (
                <div className="flex flex-col gap-2 overflow-auto h-auto max-h-80 p-2 border-b border-gray-100 pb-4">
                  <div className="flex items-center justify-between gap-4 shadow rounded-2xl p-4 hover:shadow-md transition-all duration-300 ease-out">
                    <div className="flex items-center gap-4 w-full">
                      <img
                        src={firstSession?.images?.[0]?.image_url || ""}
                        alt={product.title}
                        className="h-12 w-12 rounded object-cover bg-gray-50 shrink-0"
                      />
                      <div className="flex flex-col gap-2 overflow-hidden">
                        
                          <span className="text-[15px] text-gray-700 transition-colors group-hover:text-gray-900 truncate font-medium">
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

            {/* Áp dụng khuyến mãi */}
            <div className="flex items-center justify-between gap-4 rounded-2xl p-2 mt-2">
              <span className="text-gray-700">Mã giảm giá</span>
              <span
                className="mt-0.5 text-[15px] font-semibold text-blue-600 hover:cursor-pointer hover:text-blue-800"
                onClick={() => showModalVoucher()}
              >
                {appliedVoucher ? "Đổi Voucher >" : "Chọn Voucher >"}
              </span>
            </div>
            
            {/* Tổng kết giá */}
            <div className="flex flex-col gap-2 p-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[15px] font-medium text-gray-700">Tạm tính</span>
                <span className="text-[15px] font-light text-gray-800">
                  {Number(subtotal).toLocaleString("vi-VN")}₫
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-[15px] font-medium text-gray-700">Giảm giá</span>
                <span className="text-[15px] font-light text-green-600">
                  - {Number(discountAmount).toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>
            
            <hr className="my-2" />

            {/* Tổng cộng */}
            <div className="flex items-center justify-between gap-4 p-2 pb-4">
              <span className="text-[16px] font-bold text-gray-800">Tổng tiền</span>
              <span className="text-[18px] font-bold text-red-600">
                {Number(totalAmount).toLocaleString("vi-VN")}₫
              </span>
            </div>
            
            {/* Đặt hàng */}
            <div>
              <button
              
                className="bg-rose-500 text-white! p-3 rounded-2xl w-full text-lg font-bold hover:bg-rose-600 hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-0.5 hover:cursor-pointer"
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