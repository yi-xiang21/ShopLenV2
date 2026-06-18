import {useEffect, useState } from "react";
import type {
  Product,
  Variant,
  image,
} from "@/pages/Admin/managerProducts/type/products";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";


import { FaHeart, FaCartPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { toggleWishlistThunk } from "@/pages/User/whistlist/store/wishlist_thunck";

interface CardProductsProps {
  data: Product;
}

const CardProducts = ({ data }: CardProductsProps) => {
  const dispatch = useAppDispatch();
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const variants: Variant[] = data.variants || [];
  const firstVariant = variants[0];
  const [isFavorite, setIsFavorite] = useState(false);
  // 1. Ép tất cả các giá về kiểu Number một cách an toàn
  const prices = variants.map((variant) => Number(variant.price || 0));

  // 2. Lấy Min Max (Có bắt trường hợp mảng rỗng để không bị lỗi Infinity)
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  useEffect(() => {
    if (wishlistItems && data?.product_id) {
     
      const isFav = wishlistItems.some((item: any) => item.product_id === data.product_id);

      setIsFavorite(isFav);
    }
  }, [wishlistItems, data.product_id]);

  const handleToggleWishlist = async (product: any) => {
    try {
     await dispatch(toggleWishlistThunk(product.product_id)).unwrap();
     setIsFavorite((prev) => !prev);
  } catch (error) {
     console.log(error)
  }
      
  };
  return (

    <div
      className="
      group relative w-75 bg-[#ffffff] rounded-3xl overflow-hidden 
      border border-slate-200 shadow-md transition-all duration-500 
      hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.10)] h-112 text-left
    "
    >
      <button
        onClick={() => handleToggleWishlist(data)}
        className="
        absolute top-4 right-4 z-20 w-10 h-10 rounded-full backdrop-blur-sm 
        shadow-md flex items-center justify-center transition-all cursor-pointer bg-white/50 hover:bg-white
      "
      >
        <FaHeart
          className={`transition-colors ${
            isFavorite ? "text-red-500" : "text-slate-400"
          }`}
        />
      </button>

      <Link to={`/product/${data.product_id}`} className="block h-45 p-3">
        <Swiper
          modules={[Pagination, Autoplay, EffectFade]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          effect="fade"
          loop
          speed={800}
          pagination={{ clickable: true, dynamicBullets: true }}
          className="
          h-full rounded-[20px] overflow-hidden 
          [--swiper-pagination-color:#d8b4fe] [--swiper-pagination-bullet-inactive-color:#d1d5db]
        "
        >
          {firstVariant?.images?.map((img: image, index: number) => (
            <SwiperSlide key={img.image_id || index}>
              <img
                src={img.image_url}
                alt={data.product_name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Link>

      {/* Content */}
      <div className="p-4 pt-2 flex flex-col">
        {/* Title - Bấm vào tên để chuyển trang */}
        <Link to={`/product/${data.product_id}`}>
          <h3
            className="text-lg font-semibold text-slate-800 line-clamp-1 hover:text-violet-500 transition-colors"
            title={data.product_name}
          >
            {data.product_name}
          </h3>
        </Link>

        
        <p className="mt-1 text-sm text-slate-500 line-clamp-2">
          {data.description}
        </p>

       
        <div className="mt-2 text-xl font-bold text-violet-500">
          {minPrice === maxPrice ? (
            // Nếu các biến thể có giá bằng nhau (hoặc chỉ có 1 biến thể) -> Hiển thị 1 giá
            `${minPrice.toLocaleString("vi-VN")}₫`
          ) : (
            // Nếu có nhiều giá khác nhau -> Hiển thị từ Min đến Max
            `${minPrice.toLocaleString("vi-VN")}₫ - ${maxPrice.toLocaleString("vi-VN")}₫`
          )}
        </div>

        
        <div className="mt-2 flex items-center gap-2">
          <div className="z-20 bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full w-fit">
            {data.category_name}
          </div>
        </div>

        
        <div className="mt-5 flex gap-3">
          <button
            
            className="
            flex-1 h-12 rounded-xl bg-linear-to-r from-violet-300 to-pink-300 
            text-slate-800 font-semibold flex items-center justify-center gap-2 
            transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer
          "
          >
            <FaCartPlus />
            <span>Thêm vào giỏ</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardProducts;