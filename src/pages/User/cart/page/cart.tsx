import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {
  deleteCartItem,
  getCart,
  updateCartItem,
} from "@/pages/User/cart/store/cart_thunck";
import { useEffect } from "react";
import { setLocalCart } from "@/pages/User/cart/store/cart_slice";
import { useNavigate } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";

const Cart = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items: cartItems } = useAppSelector((state) => state.Cart);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getCart());
    }
    const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");

    dispatch(setLocalCart(localCart));
  }, [dispatch, user]);

  const handleDeleteItem = async (variant_id: number) => {
    try {
      if (!user) {
        const updatedCart = cartItems.filter(
          (item) => item.variant_id !== variant_id,
        );

        localStorage.setItem("localCart", JSON.stringify(updatedCart));

        dispatch(setLocalCart(updatedCart));
        return;
      }
      dispatch(deleteCartItem(variant_id));
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  const handleUpdateQuantity = (
    variant_id: number,
    newQuantity: number,
    stock: number,
  ) => {
    if (newQuantity < 1) {
      alert("Số lượng không thể nhỏ hơn 1");
      return;
    }
    if (newQuantity > stock) {
      alert("Số lượng vượt quá số lượng tồn kho");
      return;
    }
    try {
      if (!user) {
        const updatedCart = cartItems.map((item) =>
          item.variant_id === variant_id
            ? { ...item, quantity: newQuantity }
            : item,
        );
        localStorage.setItem("localCart", JSON.stringify(updatedCart));
        dispatch(setLocalCart(updatedCart));
        return;
      }
      dispatch(updateCartItem({ variant_id, quantity: newQuantity }));
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Giỏ hàng của bạn</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4 overflow-auto h-200 no-scrollbar">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.cart_id}
                className="relative isolate overflow-hidden flex justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-0 before:bg-pink-200 before:transition-all before:duration-500 before:ease-out hover:before:w-2/2 hover:cursor-pointer"
              >
                {/* TRÁI: Hình ảnh và Thông tin */}
                <div className="flex items-center gap-5">
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="h-24 w-24 rounded-2xl object-cover bg-gray-50"
                  />

                  <div className="flex flex-col justify-center">
                    <a
                      href={`/detail/${item.product_id}`}
                      className="transition-colors hover:text-rose-400"
                    >
                      {/* Font chữ mảnh (font-light), màu xám đen mượt */}
                      <h2 className="text-[17px] font-light text-gray-700">
                        {item.product_name}
                      </h2>
                    </a>

                    {/* Phân loại hàng (Nếu bạn có data color/size thì thay biến vào đây) */}
                    <p className="mt-0.5 text-[13px] font-light text-gray-400">
                      Màu: {item.color}, Size:
                      {item.size}
                    </p>

                    {/* Giá tiền: Màu hồng pastel nhạt */}
                    <p className="mt-2 text-lg font-medium text-red-600">
                      {Number(item.price).toLocaleString("vi-VN")}₫
                    </p>
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

                  <button
                    className="text-gray-300 transition-colors hover:bg-amber-50 rounded-full p-2 hover:cursor-pointer "
                    onClick={() => handleDeleteItem(item.variant_id || 0)}
                    title="Xóa sản phẩm"
                  >
                    <FaRegTrashAlt />
                  </button>
                </div>
              </div>
            ))
          ) : (
            // ... (phần giỏ hàng trống giữ nguyên)
            <div className="text-center text-gray-500 shadow-sm p-6 rounded-2xl bg-white">
              <p>Giỏ hàng của bạn đang trống.</p>
            </div>
          )}
        </div>

        <div className="h-80 rounded-2xl p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Tóm tắt đơn hàng</h2>
          <div className="flex flex-col justify-around h-full">
            <div className="space-y-3">
              <hr />

              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng</span>
                <span className="text-rose-600">
                  {Number(subtotal).toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <button
                className="
          mt-6
          mb-3
          w-full
          rounded-xl
          py-3
          font-medium
          text-white
          hover:bg-rose-500
          shadow-sm
          bg-rose-300
          hover:cursor-pointer
          "
                onClick={() => navigate("/billing")}
              >
                Thanh toán ngay
              </button>

              <button
                className="
          mt-3
          w-full
          rounded-xl

          shadow-sm
          py-3
        bg-amber-100
          hover:bg-amber-500
          font-medium
          text-amber-200
          hover:cursor-pointer
          "
                onClick={() => (window.location.href = "/shop")}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
