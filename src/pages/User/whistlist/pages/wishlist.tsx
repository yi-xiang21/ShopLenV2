import banner from "@/assets/Wishlist.png";
import { useEffect } from "react";
import {
  getWishlistThunk,
  toggleWishlistThunk,
} from "@/pages/User/whistlist/store/wishlist_thunck";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { FaShoppingCart, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { WishlistItem } from "../types/wishlist";


const Wishlist = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(getWishlistThunk());
  }, [dispatch]);

  const removeFromWishlist = (productId: any) => {
    dispatch(toggleWishlistThunk(productId));
  };

  
  const formatCurrencyVND = (price: string | number) => {
  const numericPrice = Number(price);
  
  if (isNaN(numericPrice)) return "0";

  return new Intl.NumberFormat('vi-VN').format(numericPrice);
};
const handleDetail = (item:WishlistItem) => {
  if (item.type_id ===3) {
    navigate(`/workshop-detail/${item.workshop_id}`);
  } else {
    navigate(`/detail/${item.product_id}`);
  }
  
}

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Banner Section */}
        <div className="w-full mb-8">
          <img
            src={banner}
            alt="Wishlist Banner"
            className="w-full h-40 md:h-150 object-cover rounded-2xl shadow-sm"
          />
        </div>

        {/* Wishlist Content */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
            Danh sách yêu thích
          </h1>

          {!wishlistItems || wishlistItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>Bạn chưa có sản phẩm nào trong danh sách yêu thích.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {wishlistItems.map((item) => (
                <div
                  key={item.product_id}
                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border border-gray-100 bg-white gap-4 transition-all duration-300 hover:border-gray-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-5 w-full sm:w-auto">
                    <img
                      src={item.image_url}
                      alt={item.product_name}
                      className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg bg-gray-50 shirk-0 transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base md:text-lg font-medium text-gray-800 line-clamp-2">
                        {item.product_name}
                      </h3>
                      {item.final_price!=item.min_price ? (
                        <p className="text-lg font-semibold text-rose-600">
                          <del className="text-gray-400 mr-2">
                            {formatCurrencyVND(item.min_price)}₫
                          </del>
                          chỉ còn {formatCurrencyVND(item.final_price || 0)}₫
                        </p>
                      ) : (
                        <p className="text-lg font-semibold text-rose-600">
                          {formatCurrencyVND(item.min_price)}₫
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100 mt-2 sm:mt-0">
                    {/* Nút Xóa */}
                    <button
                      onClick={() => removeFromWishlist(item.product_id)}
                      className="group flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 active:scale-95 focus:outline-none"
                    >
                      
                      <FaTrashAlt className="h-4 w-4 transition-transform group-hover:-rotate-12"/>
                      <span className="hidden sm:inline">Xóa</span>
                    </button>

                    {/* Nút Thêm vào giỏ */}
                    <button 
                      onClick={() => handleDetail(item)}
                      className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:scale-95 focus:outline-none"
                    >
                      <FaShoppingCart />
                      <span>xem chi tiet</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
