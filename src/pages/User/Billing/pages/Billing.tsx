import { IoHomeOutline } from "react-icons/io5";
import { BillingApi } from "@/pages/User/Billing/api/billing_api";
import { useEffect, useState } from "react";
import type {
  shippingMethod,
  City,
  Ward,
  Billing,
} from "@/pages/User/Billing/type/billing";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { Modal } from "antd";
import { MdPayments } from "react-icons/md";
import { CiShoppingBasket } from "react-icons/ci";
import { deleteCartItem, updateCartItem } from "@/pages/User/cart/store/cart_thunck";
import { vouchersApi } from "@/pages/Admin/managerVoucher/api/vouchers_api";
import type { voucher } from "@/pages/Admin/managerVoucher/type/vouchers";
import type { NotificationType } from "@/share/ComponentCustom/Notification/Notification";

import Notification from "@/share/ComponentCustom/Notification/Notification";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CardItemOrder from "@/component/CardItemOrder";

const BillingPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items: cartItems } = useAppSelector((state) => state.Cart);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVoucherOpen, setIsModalVoucherOpen] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState<number | null>(null);
  const [appliedVoucher, setAppliedVoucher] = useState<voucher | null>(null);

  const { user } = useAppSelector((state) => state.auth);
  const [shippingMethods, setShippingMethods] = useState<shippingMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<shippingMethod>();
  const [city, setCity] = useState<City[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<number>(0);
  const [firstName, setFirstName] = useState<string>(user?.first_name || "");
  const [lastName, setLastName] = useState<string>(user?.last_name || "");
  const [methodPayment, setMethodPayment] = useState<string>("COD");
  const [discountCode, setDiscountCode] = useState<voucher[]>([]);
  const [notifyData, setNotifyData] = useState<{
    key: string;
    type: NotificationType;
    title: string;
    message: string;
  } | null>(null);
  const [formData, setFormData] = useState<Billing>({
    phuong_xa_id: 0,
    dia_chi_giao_hang: "",
    ten_nguoi_nhan: "",
    sdt_nguoi_nhan: user?.phone_number || "",
    phieu_giam_gia_code: "",
    phuong_thuc_thanh_toan: "",
    shipping_method_id: "",
  });

  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const response = await BillingApi.getShippingMethods();
        const methods = response.data.data;
        setShippingMethods(methods);
        if (methods && methods.length > 0) {
          setSelectedMethod(methods[0]);
        }
      } catch (error) {
        console.error("Error fetching shipping methods:", error);
      }
    };
    const fetchLocations = async () => {
      try {
        const response = await BillingApi.getLocations();
        setCity(response.data.data.cities);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    const fetchVouchers = async () => {
      try {
        const response = await vouchersApi.getMyVouchers();
        setDiscountCode(response.data.data.vouchers);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };
    fetchLocations();
    fetchVouchers();
    fetchShippingMethods();
    
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const fetchWards = async () => {
      try {
        if (selectedCity) {
          const response = await BillingApi.getCityWards(selectedCity);
          setWards(response.data.data.wards);
        }
      } catch (error) {
        console.error("Error fetching wards:", error);
      }
    };
    fetchWards();
  }, [selectedCity]);

  const showModalUser = () => setIsModalOpen(true);
  const showModalVoucher = () => setIsModalVoucherOpen(true);
  const handleCancelUser = () => setIsModalOpen(false);
  const handleCancelVoucher = () => setIsModalVoucherOpen(false);

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
    if (!formData.sdt_nguoi_nhan) {
      setNotifyData({
        key: Date.now().toString(),
        type: "error",
        title: "Thiếu thông tin",
        message: "Vui lòng nhập số điện thoại!",
      });
      return;
    }
    const phoneToTest = formData.sdt_nguoi_nhan.trim();
    if (phoneToTest && !/^\d{10,11}$/.test(phoneToTest)) {
      setNotifyData({
        key: Date.now().toString(),
        type: "error",
        title: "Sai định dạng",
        message: "Vui lòng nhập số điện thoại hợp lệ!",
      });
      return;
    }
    if (!selectedCity || !selectedWard) {
      setNotifyData({
        key: Date.now().toString(),
        type: "error",
        title: "Thiếu thông tin",
        message: "Vui lòng chọn thành phố và phường/xã!",
      });
      return;
    }
    if (!formData.dia_chi_giao_hang) {
      setNotifyData({
        key: Date.now().toString(),
        type: "error",
        title: "Thiếu thông tin",
        message: "Vui lòng nhập địa chỉ giao hàng!",
      });
      return;
    }
    setIsModalOpen(false);
  };

  const handSubmitOrder = async () => {
    try {
      const finalPayload = {
        ...formData,
        ten_nguoi_nhan: formData.ten_nguoi_nhan || `${firstName || ""} ${lastName || ""}`.trim(),
        sdt_nguoi_nhan: formData.sdt_nguoi_nhan || user?.phone_number || "",
        phuong_xa_id: formData.phuong_xa_id || selectedWard,
        dia_chi_giao_hang: formData.dia_chi_giao_hang || "",
        phuong_thuc_thanh_toan: methodPayment,
        shipping_method_id: selectedMethod?.method_id || "",
        phieu_giam_gia_code: appliedVoucher?.code || "",
      };

      if (!finalPayload.ten_nguoi_nhan || !finalPayload.sdt_nguoi_nhan || !finalPayload.phuong_xa_id) {
        setNotifyData({
          key: Date.now().toString(),
          type: "error",
          title: "Thiếu thông tin",
          message: "Vui lòng nhập đầy đủ thông tin giao hàng!",
        });
        return;
      }

      const response = await BillingApi.createBilling(finalPayload);
      if (methodPayment === "MOMO") {
        const paymentUrl = response.data.data.payUrl;
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

  const handleUpdateQuantity = async (
    variantId: number,
    newQuantity: number,
    stockQuantity: number,
  ) => {
    if (newQuantity > stockQuantity) return;
    if (newQuantity < 1) {
      dispatch(deleteCartItem(variantId));
      return;
    }
    try {
      dispatch(
        updateCartItem({ variant_id: variantId, quantity: newQuantity }),
      );
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  const handleSelect = (id: number) => {
    setSelectedVoucherId((prevId) => (prevId === id ? null : id));
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

    // Tính toán Tạm tính để kiểm tra điều kiện
    const currentSubtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );

    if (currentSubtotal < minOrderValue) {
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
      order_value: currentSubtotal,
      shipping_method_id: selectedMethod?.method_id,
    };

    try {
      await vouchersApi.applyVoucher(payload);
      setAppliedVoucher(selectedVoucher || null);
      setIsModalVoucherOpen(false);
    } catch (error: any) {
      setNotifyData({
        key: Date.now().toString(),
        type: "error",
        title: "Lỗi",
        message: `Lỗi áp dụng voucher: ${error.response?.data?.message || "Vui lòng thử lại!"}`,
      });
    }
  };


  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );

  const shippingFee = Number(selectedMethod?.fee || 0);

  
  const discountAmount = appliedVoucher
    ? appliedVoucher.discount_type === "free_ship"? shippingFee 
      : appliedVoucher.discount_type === "percent"
        ? (subtotal * Number(appliedVoucher.value)) / 100
        : Number(appliedVoucher.value)
    : 0;

  
  const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount);


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

      {/* Modal Thay đổi địa chỉ */}
      <Modal
        title="Thay đổi thông tin giao hàng"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOkUser}
        onCancel={handleCancelUser}
      >
        <div className="flex flex-col gap-4">
          <label htmlFor="name">Họ:</label>
          <input
            type="text"
            placeholder="Enter your first name"
            className="border border-gray-300 rounded p-2"
            value={firstName ? firstName : ""}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <label htmlFor="name">Tên:</label>
          <input
            type="text"
            placeholder="Enter your last name"
            className="border border-gray-300 rounded p-2"
            value={lastName ? lastName : ""}
            onChange={(e) => setLastName(e.target.value)}
          />
          <label htmlFor="name"> Số Điện Thoại:</label>
          <input
            type="text"
            placeholder="Enter your phone number"
            className="border border-gray-300 rounded p-2"
            value={formData.sdt_nguoi_nhan ? formData.sdt_nguoi_nhan : ""}
            onChange={(e) =>
              setFormData({ ...formData, sdt_nguoi_nhan: e.target.value })
            }
          />
          <label htmlFor="name">Thành phố:</label>
          <select
            className="border border-gray-300 rounded p-2"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">Chọn thành phố</option>
            {city.map((c) => (
              <option key={c.city_code} value={c.city_code}>
                {c.city_name}
              </option>
            ))}
          </select>
          <select
            className="border border-gray-300 rounded p-2"
            value={selectedWard}
            onChange={(e) => setSelectedWard(parseInt(e.target.value))}
          >
            <option value="">Chọn phường/xã</option>
            {wards.map((ward) => (
              <option key={ward.ward_code} value={ward.ward_code}>
                {ward.ward_name}
              </option>
            ))}
          </select>

          <label htmlFor="address">Địa chỉ giao hàng:</label>
          <input
            type="text"
            placeholder="Enter your address"
            className="border border-gray-300 rounded p-2"
            value={formData.dia_chi_giao_hang}
            onChange={(e) =>
              setFormData({ ...formData, dia_chi_giao_hang: e.target.value })
            }
          />
        </div>
      </Modal>

      {/* Modal Chọn Voucher */}
      <Modal
        title="Chọn Voucher"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalVoucherOpen}
        onOk={handleApply}
        onCancel={handleCancelVoucher}
      >
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto overflow-auto max-h-[300px] p-2">
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
                        : voucher.discount_type === "free_ship" 
                        ? "Free Ship" 
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

      {/* Main Layout */}
      <div className="mb-8 text-center">
        <h1>Hóa Đơn Thanh Toán</h1>
        <p className="text-gray-500 mt-2 text-sm md:text-base">Kiểm tra thông tin và hoàn tất đơn hàng của bạn</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-8 h-full w-full max-w-7xl mx-auto justify-center gap-6 pb-12">
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Thông tin giao hàng */}
          <div className="flex flex-col gap-6 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
              <div className="rounded-full bg-blue-50 p-3 w-fit text-blue-600">
                <IoHomeOutline size={24} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 tracking-tight">Thông tin giao hàng</h2>
            </div>
            <div className="flex flex-col gap-4 px-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <span className="text-[13px] font-medium text-gray-500 mb-1">Họ và tên</span>
                  <span className="text-[15px] font-semibold text-gray-900">
                    {firstName || lastName
                      ? firstName + " " + lastName
                      : `${user?.first_name || ""} ${user?.last_name || ""}`}
                  </span>
                </div>
                <div className="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <span className="text-[13px] font-medium text-gray-500 mb-1">Số điện thoại</span>
                  <span className="text-[15px] font-semibold text-gray-900">
                    {formData.sdt_nguoi_nhan || user?.phone_number || "Chưa cập nhật"}
                  </span>
                </div>
                <div className="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <span className="text-[13px] font-medium text-gray-500 mb-1">Thành phố</span>
                  <span className="text-[15px] font-semibold text-gray-900">
                    {selectedCity ? city.find((c) => c.city_code === selectedCity)?.city_name : "Chưa cập nhật"}
                  </span>
                </div>
                <div className="flex flex-col bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <span className="text-[13px] font-medium text-gray-500 mb-1">Phường/Xã</span>
                  <span className="text-[15px] font-semibold text-gray-900">
                    {selectedWard ? wards.find((w) => w.ward_code === selectedWard)?.ward_name : "Chưa cập nhật"}
                  </span>
                </div>
                <div className="flex flex-col md:col-span-2 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <span className="text-[13px] font-medium text-gray-500 mb-1">Địa chỉ giao hàng</span>
                  <span className="text-[15px] font-semibold text-gray-900 leading-relaxed">
                    {formData.dia_chi_giao_hang || "Chưa cập nhật"}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-2 flex justify-center">
              <button className="button_user px-6 w-fit" onClick={showModalUser}>
                Thay đổi địa chỉ
              </button>
            </div>
          </div>
          
          {/* Phương thức vận chuyển */}
          <div className="flex flex-col gap-6 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
              <div className="rounded-full bg-orange-50 p-3 w-fit text-orange-500">
                <IoHomeOutline size={24} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 tracking-tight">Phương thức vận chuyển</h2>
            </div>
            <div className="flex flex-col gap-4 px-2">
              <div className="flex flex-col gap-3">
                {shippingMethods.map((option) => (
                  <div
                    key={option.method_id}
                    onClick={() => setSelectedMethod(option)}
                    className={`group relative flex cursor-pointer items-center justify-between rounded-3xl p-4 transition-all duration-300 ease-out border hover:-translate-y-0.5 hover:shadow-md ${
                      selectedMethod?.method_id === option.method_id
                        ? "bg-orange-50/60 border-orange-200 shadow-sm"
                        : "bg-white border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-orange-200"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                          selectedMethod?.method_id === option.method_id
                            ? "bg-[#fb923c]"
                            : "bg-transparent"
                        }`}
                      ></div>
                      <div className="flex flex-col">
                        <span className="text-[15px] text-gray-700 transition-colors group-hover:text-gray-900">
                          {option.name}
                        </span>
                        <span className="mt-0.5 text-[13px] font-light text-gray-400">
                          {option.estimated_time}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 text-[14px] font-medium transition-colors ${
                        option.fee ? "text-red-600 group-hover:text-red-700" : "text-gray-700 group-hover:text-orange-500"
                      }`}
                    >
                      <span>
                        {option.fee ? `${Number(option.fee).toLocaleString("vi-VN")}₫` : "Miễn phí"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="flex flex-col gap-6 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
              <div className="rounded-full bg-purple-50 p-3 w-fit text-purple-600">
                <MdPayments size={24} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 tracking-tight">Phương thức thanh toán</h2>
            </div>
            <div className="flex flex-col gap-4 px-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setMethodPayment("COD")}
                  className={`group relative flex cursor-pointer items-center justify-between rounded-3xl p-4 transition-all duration-300 ease-out border hover:-translate-y-0.5 hover:shadow-md ${
                    methodPayment === "COD"
                      ? "bg-orange-50/60 border-orange-200 shadow-sm"
                      : "bg-white border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-orange-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${methodPayment === "COD" ? "bg-[#fb923c]" : "bg-transparent"}`}></div>
                    <div className="flex flex-col">
                      <span className="text-[15px] text-gray-700 transition-colors group-hover:text-gray-900">
                        Thanh toán khi nhận hàng (COD)
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setMethodPayment("MOMO")}
                  className={`group relative flex cursor-pointer items-center justify-between rounded-3xl p-4 transition-all duration-300 ease-out border hover:-translate-y-0.5 hover:shadow-md ${
                    methodPayment === "MOMO"
                      ? "bg-orange-50/60 border-orange-200 shadow-sm"
                      : "bg-white border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-orange-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${methodPayment === "MOMO" ? "bg-[#fb923c]" : "bg-transparent"}`}></div>
                    <div className="flex flex-col">
                      <span className="text-[15px] text-gray-700 transition-colors group-hover:text-gray-900">
                        Momo
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="flex flex-col gap-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 lg:sticky lg:top-24 h-fit">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
              <div className="rounded-full bg-rose-50 p-3 w-fit text-rose-500">
                <CiShoppingBasket size={24} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 tracking-tight">Tóm tắt đơn hàng</h2>
            </div>
            
            {/* Danh sách sản phẩm */}
            <div className="mt-2">
              {cartItems.length > 0 ? (
                <div className="flex flex-col gap-3 overflow-auto max-h-[400px] pr-2 no-scrollbar">
                  {cartItems.map((item) => (
                    <CardItemOrder
                      key={item.cart_id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Giỏ hàng trống</p>
              )}
            </div>
            <div className="h-px bg-gray-100 my-2"></div>

            {/* Áp dụng khuyến mãi */}
            <div className="flex items-center justify-between gap-4 py-2">
              <span className="text-[15px] font-medium text-gray-700">Mã khuyến mãi</span>
              <button
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-3 py-1.5 rounded-full"
                onClick={() => showModalVoucher()}
              >
                {appliedVoucher ? "Đổi mã khác" : "Chọn mã"}
              </button>
            </div>

            <div className="flex flex-col gap-3 py-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[15px] text-gray-500">Tạm tính</span>
                <span className="text-[15px] font-medium text-gray-900">
                  {subtotal.toLocaleString("vi-VN")}₫
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[15px] text-gray-500">Phí vận chuyển</span>
                <span className="text-[15px] font-medium text-gray-900">
                  {shippingFee.toLocaleString("vi-VN")}₫
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[15px] text-gray-500">Giảm giá</span>
                <span className="text-[15px] font-medium text-emerald-600">
                  -{discountAmount.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>

            <div className="h-px bg-gray-100 my-2"></div>

            {/* Tổng cộng */}
            <div className="flex items-center justify-between gap-4 py-2">
              <span className="text-lg font-semibold text-gray-900">Tổng tiền</span>
              <span className="text-2xl font-bold text-rose-600">
                {totalAmount.toLocaleString("vi-VN")}₫
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <button className="button_checkout" onClick={handSubmitOrder}>
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;