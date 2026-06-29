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
    sdt_nguoi_nhan: "",
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

  const handleCancelUser = () => {
    setIsModalOpen(false);
  };
  const handleCancelVoucher = () => {
    setIsModalVoucherOpen(false);
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

      
      const respone = await BillingApi.createBilling(finalPayload);
      console.log("Đơn hàng đã được tạo thành công:", respone.data);
      
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
    if (newQuantity > stockQuantity) {
      return;
    }
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

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );

  const handleSelect = (id:number) => {
    
    setSelectedVoucherId((prevId) => (prevId === id ? null : id));
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
    console.log("Payload gửi lên API để áp dụng voucher:", payload);

    try {
      const response = await vouchersApi.applyVoucher(payload);
      console.log("Áp dụng voucher thành công:", response.data);
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
            value={firstName ? firstName : " "}
            onChange={(e) => setFirstName(e.target.value)}
          ></input>
          <label htmlFor="name">Tên:</label>
          <input
            type="text"
            placeholder="Enter your last name"
            className="border border-gray-300 rounded p-2"
            value={lastName ? lastName : " "}
            onChange={(e) => setLastName(e.target.value)}
          ></input>
          <label htmlFor="name"> Số Điện Thoại:</label>
          <input
            type="text"
            placeholder="Enter your phone number"
            className="border border-gray-300 rounded p-2"
            value={formData.sdt_nguoi_nhan? formData.sdt_nguoi_nhan :" "}
            onChange={(e) =>
              setFormData({ ...formData, sdt_nguoi_nhan: e.target.value })
            }
          ></input>
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

      <Modal
        title="Chọn Voucher"
        closable={{ "aria-label": "Custom Close Button" }}
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
                  ? "border-blue-500 bg-blue-50" // Style khi được chọn
                  : "border-transparent hover:shadow-md bg-white" // Style mặc định
              }`}
            >
              <div className="flex flex-col flex-1">
                <span className="text-[16px] font-medium text-gray-800">
                  {voucher.voucher_name}
                </span>
                <span className="mt-0.5 text-[13px] font-light text-gray-500">
                  Mã: <span className="font-semibold text-gray-700">{voucher.code}</span>
                </span>
                
                {/* Hiển thị thêm thông tin từ cấu trúc dữ liệu thực tế */}
                <span className="mt-1.5 text-[12px] text-gray-500 bg-gray-100 w-fit px-2 py-0.5 rounded-md">
                  Đơn tối thiểu {Number(voucher.minimum_value).toLocaleString("vi-VN")}₫
                  {voucher.max_discount && ` - Giảm tối đa ${Number(voucher.max_discount).toLocaleString("vi-VN")}₫`}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[15px] font-bold text-red-600">
                  {/* Lưu ý: Dựa vào ảnh, discount_type là 'percent' */}
                  {voucher.discount_type === "percent"
                    ? `${Number(voucher.value)}%`
                    : `${Number(voucher.value).toLocaleString("vi-VN")}₫`}
                </span>
                
                {/* Nút check (Radio style) để báo hiệu đã chọn */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <FaCheck />
                  )}
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
        <div className=" col-span-4 flex flex-col gap-4">
          {/* thong tin giao hang */}
          <div className="flex flex-col gap-4 bg-blue-200 rounded-3xl h-auto p-4 shadow-md">
            <div className="flex items-center gap-4">
              <p className="rounded-full bg-white p-2 w-fit text-blue-500">
                <IoHomeOutline />
              </p>
              <h2 className="text-2xl">Thông tin giao hàng</h2>
            </div>
            <div className="flex flex-col gap-2 pr-10 pl-10">
              <div className="flex flex-col gap-2">
                <span>
                  Họ và tên :{" "}
                  <span className="mt-0.5 text-15 font-light text-gray-600">
                    {firstName || lastName
                      ? firstName + " " + lastName
                      : `${user?.first_name} ${user?.last_name}`}
                  </span>
                </span>
                <span>
                  Số điện thoại :{" "}
                  <span className="mt-0.5 text-15 font-light text-gray-600">
                    {formData.sdt_nguoi_nhan
                      ? formData.sdt_nguoi_nhan
                      : user?.phone_number}
                  </span>
                </span>
                <span>
                  Thành phố :{" "}
                  <span className="mt-0.5 text-15 font-light text-gray-600">
                    {selectedCity
                      ? city.find((c) => c.city_code === selectedCity)
                          ?.city_name
                      : ""}
                  </span>
                </span>
                <span>
                  Phường/Xã :{" "}
                  <span className="mt-0.5 text-15 font-light text-gray-600">
                    {selectedWard
                      ? wards.find((w) => w.ward_code === selectedWard)
                          ?.ward_name
                      : ""}
                  </span>
                </span>
                <span>
                  Địa chỉ giao hàng :
                  <span className="text-15 font-light text-gray-600">
                    {formData.dia_chi_giao_hang}
                  </span>
                </span>
              </div>
            </div>
            <div>
              <button
                className="bg-rose-300 text-white p-2 rounded w-full hover:bg-rose-400 hover:shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:cursor-pointer"
                onClick={showModalUser}
              >
                Thay đổi địa chỉ
              </button>
            </div>
          </div>
          {/*  phuong thuc van chuyen */}
          <div className="flex flex-col gap-4 bg-yellow-200 rounded-3xl h-auto p-4 shadow-md">
            <div className="flex items-center gap-4">
              <p className="rounded-full bg-white p-2 w-fit text-yellow-500">
                <IoHomeOutline />
              </p>
              <h2 className="text-2xl">Phương Thức Vận Chuyển</h2>
            </div>
            <div className="flex flex-col gap-2 pr-10 pl-10">
              <div className="flex flex-col gap-2">
                {shippingMethods.map((option) => {
                  return (
                    <div
                      key={option.method_id}
                      onClick={() => setSelectedMethod(option)}
                      className={`
              group relative flex cursor-pointer items-center justify-between rounded-3xl p-4 
              transition-all duration-300 ease-out border border-transparent
              hover:-translate-y-0.5 hover:shadow-md
              ${
                selectedMethod?.method_id === option.method_id
                  ? "bg-[#faeee0] shadow-sm"
                  : "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-orange-200"
              }
            `}
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
                          option.fee
                            ? "text-red-600 group-hover:text-red-700"
                            : "text-gray-700 group-hover:text-orange-500"
                        }`}
                      >
                        <span>
                          {option.fee
                            ? `${Number(option.fee).toLocaleString("vi-VN")}₫`
                            : "Miễn phí"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* phuong thuc thanh toan */}
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
                  onClick={() => setMethodPayment("COD")}
                  className={`group relative flex cursor-pointer items-center justify-between rounded-3xl p-4 
              transition-all duration-300 ease-out border border-transparent
              hover:-translate-y-0.5 hover:shadow-md ${
                methodPayment == "COD"
                  ? "bg-[#faeee0] shadow-sm"
                  : "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-orange-200"
              } `}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                        methodPayment === "COD"
                          ? "bg-[#fb923c]"
                          : "bg-transparent"
                      }`}
                    ></div>
                    <div className="flex flex-col">
                      <span className="text-[15px] text-gray-700 transition-colors group-hover:text-gray-900">
                        Thanh toán khi nhận hàng (COD)
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setMethodPayment("MOMO")}
                  className={`group relative flex cursor-pointer items-center justify-between rounded-3xl p-4 
              transition-all duration-300 ease-out border border-transparent
              hover:-translate-y-0.5 hover:shadow-md ${
                methodPayment == "MOMO"
                  ? "bg-[#faeee0] shadow-sm"
                  : "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-orange-200"
              } `}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                        methodPayment === "MOMO"
                          ? "bg-[#fb923c]"
                          : "bg-transparent"
                      }`}
                    ></div>
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

        <div className=" col-span-2  bg-white rounded-3xl h-auto p-2 shadow-md">
          <div className="flex flex-col gap-2 rounded-3xl h-auto p-2 ">
            <div className="flex items-center gap-4 ">
              <p className="rounded-full p-2 w-fit text-yellow-500">
                <CiShoppingBasket />
              </p>
              <h2 className="text-2xl">Tóm Tắt Đơn Hàng</h2>
            </div>
            {/* danh sach san pham */}
            <div>
              {cartItems.length > 0 ? (
                <div className="flex flex-col gap-2 overflow-auto h-80 p-2">
                  {cartItems.map((item) => (
                    <div
                      key={item.cart_id}
                      className="flex items-center justify-between gap-4 shadow rounded-2xl p-4 hover:shadow-md transition-all duration-300 ease-out"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="h-12 w-12 rounded object-cover bg-gray-50"
                        />
                        <div className="flex flex-col">
                          <span className="text-[15px] text-gray-700 transition-colors group-hover:text-gray-900">
                            {item.product_name}
                          </span>
                          <span className="mt-0.5 text-[13px] font-light text-gray-400">
                            Màu: {item.color}, Size: {item.size}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center rounded-full border border-rose-100 bg-white px-3 py-1.5 shadow-sm">
                          <button
                            className="px-2 text-gray-400 transition-colors hover:text-rose-400"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.variant_id || 0,
                                item.quantity - 1,
                                item.stock_quantity || 0,
                              )
                            }
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm font-light text-gray-600">
                            {item.quantity}
                          </span>
                          <button
                            className="px-2 text-gray-400 transition-colors hover:text-rose-400"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.variant_id || 0,
                                item.quantity + 1,
                                item.stock_quantity || 0,
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[14px] font-medium transition-colors text-red-600">
                        <span>
                          {Number(
                            item.price || 0 * item.quantity,
                          ).toLocaleString("vi-VN")}
                          ₫
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Giỏ hàng trống</p>
              )}
            </div>
            <hr></hr>

            {/* ap dung khuyen mai */}
            <div className="flex items-center justify-between gap-4  rounded-2xl p-2 ">
              <span> Giảm giá áp dụng</span>
              <span
                className="mt-0.5 text-15 font-light text-black hover:cursor-pointer hover:text-red-700"
                onClick={() => showModalVoucher()}
              >
                chọn voucher {">"}
              </span>
            </div>
            {/* tong ket gia  */}
            <div className="flex items-center justify-between gap-4  rounded-2xl p-2 ">
              <span className="text-[15px] font-medium text-gray-700">
                Tạm tính
              </span>
              <span className="mt-0.5 text-15 font-light text-red-600">
                {Number(subtotal).toLocaleString("vi-VN")}₫
              </span>
            </div>
            <div className="flex items-center justify-between gap-4  rounded-2xl p-2 ">
              <span className="text-[15px] font-medium text-gray-700">
                Phí vận chuyển
              </span>
              <span className="mt-0.5 text-15 font-light text-red-600">
                {Number(selectedMethod?.fee || 0).toLocaleString("vi-VN")}₫
              </span>
            </div>
            <div className="flex items-center justify-between gap-4  rounded-2xl p-2">
              <span className="text-[15px] font-medium text-gray-700">
                Giảm giá
              </span>
              <span className="mt-0.5 text-15 font-light text-red-600">
                {appliedVoucher
                  ? appliedVoucher.discount_type === "percent"
                    ? `${appliedVoucher.value}%`
                    : `${Number(appliedVoucher.value).toLocaleString("vi-VN")}₫`
                  : "0₫"}
              </span>
              
            </div>
            <hr></hr>

            {/* tong cong */}
            <div className="flex items-center justify-between gap-4  rounded-2xl p-2">
              <span className="text-[15px] font-medium text-gray-700">
                Tổng tiền
              </span>
              <span className="mt-0.5 text-15 font-light text-red-600">
                {Number(
                  subtotal +
                    Number(selectedMethod?.fee || 0) -
                    (appliedVoucher
                      ? appliedVoucher.discount_type === "percent"
                        ? (subtotal * appliedVoucher.value) / 100
                        : appliedVoucher.value
                      : 0),
                ).toLocaleString("vi-VN")}
                ₫
              </span>
            </div>
            <hr></hr>
            <div>
              <button
                className="bg-rose-300 text-white p-2 rounded w-full hover:bg-rose-400 hover:shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:cursor-pointer"
                onClick={handSubmitOrder}
              >
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
