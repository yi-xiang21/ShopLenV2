import {useEffect, useState } from "react";
import type {
  Product,
  Variant,
  image,
} from "@/pages/Admin/managerProducts/type/products";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";


import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { toggleWishlistThunk } from "@/pages/User/whistlist/store/wishlist_thunck";

interface CardProductsProps {
  data: Product;
  compactMobile?: boolean;
}

const CardProducts = ({ data, compactMobile = false }: CardProductsProps) => {
  const dispatch = useAppDispatch();
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const variants: Variant[] = data.variants || [];
  const firstVariant = variants[0];
  const [isFavorite, setIsFavorite] = useState(false);
  const discountValue = firstVariant?.discount?.value || 0;
  const cardSizeClass = compactMobile
    ? "w-full h-86 sm:w-64 sm:h-100 md:w-72 md:h-108 lg:w-75 lg:h-112"
    : "w-64 sm:w-72 md:w-75 h-100 sm:h-108 md:h-112";
  const imageHeightClass = compactMobile
    ? "h-38 sm:h-48 md:h-52 lg:h-55"
    : "h-48 sm:h-52 md:h-55";


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
      className={`${cardSizeClass} group relative bg-[#ffffff] rounded-3xl overflow-hidden border border-slate-200 shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.10)] text-left`}
    >
      <button
        onClick={() => handleToggleWishlist(data)}
        className="
        absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full backdrop-blur-sm 
        shadow-md flex items-center justify-center transition-all cursor-pointer bg-white/50 hover:bg-white
      "
      >
        <FaHeart
          className={`transition-colors ${
            isFavorite ? "text-red-500" : "text-slate-400"
          }`}
        />
      </button>
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 w-full text-white text-xs font-medium p-2 rounded-full ">
       {firstVariant?.discount && (
        <div className="absolute top-1 left-1 z-20 flex items-center justify-center pointer-events-none">
          <div className="bg-rose-500/95 backdrop-blur-sm text-white text-[10px] sm:text-[11px] font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm flex items-center gap-1 tracking-wide uppercase border border-rose-400/50">
            {firstVariant.discount.type === "percent"
              ? `Giảm ${discountValue}%`
              : `Giảm ${Number(discountValue).toLocaleString("vi-VN")}₫`}
          </div>
        </div>
      )}
      </div>

      <Link to={`/detail/${data.product_id}`} className={`block ${imageHeightClass} p-2 sm:p-3`}>
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
      <div className="p-3 sm:p-4 pt-2 flex flex-col">
        {/* Title - Bấm vào tên để chuyển trang */}
        <Link to={`/detail/${data.product_id}`}>
          <h3
            className={`${compactMobile ? "text-sm sm:text-base md:text-lg" : "text-base sm:text-lg"} font-semibold text-slate-800 line-clamp-1 hover:text-violet-500 transition-colors`}
            title={data.product_name}
          >
            {data.product_name}
          </h3>
        </Link>

        
        <p className={`${compactMobile ? "mt-1 text-[11px] sm:text-xs md:text-sm h-12 sm:h-14 md:h-15" : "mt-1 text-xs sm:text-sm h-14 sm:h-15"} text-slate-500 line-clamp-3 leading-5`}>
          {data.description}
        </p>

       
        <div className="mt-2 sm:mt-3 flex flex-col justify-center">
          {firstVariant?.discount ? (
            <div className="flex items-baseline gap-2.5">
              {/* Giá sau giảm */}
              <span className={`${compactMobile ? "text-lg sm:text-xl md:text-2xl" : "text-xl sm:text-2xl"} text-rose-600 tracking-tight`}>
                {Number(firstVariant.final_price).toLocaleString("vi-VN")}₫
              </span>
              {/* Giá gốc bị gạch ngang */}
              <span className={`${compactMobile ? "text-[11px] sm:text-xs md:text-sm" : "text-xs sm:text-sm"} f text-slate-400 line-through decoration-slate-300`}>
                {Number(firstVariant.price).toLocaleString("vi-VN")}₫
              </span>
            </div>
          ) : (
            <div className="flex items-baseline">
              {/* Giá hiển thị bình thường khi không có thẻ giảm */}
              <span className={`${compactMobile ? "text-lg sm:text-xl md:text-2xl" : "text-xl sm:text-2xl"} text-slate-800 tracking-tight`}>
                {Number(firstVariant?.price || 0).toLocaleString("vi-VN")}₫
              </span>
            </div>
          )}
        </div>

        
        <div className="mt-2 flex items-center gap-2">
          <div className={`${compactMobile ? "text-[10px] sm:text-[11px] md:text-xs px-2 sm:px-2.5" : "text-[11px] sm:text-xs px-2.5 sm:px-3"} z-20 bg-blue-500 text-white font-medium py-1 rounded-full w-fit`}>
            {data.category_name}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CardProducts;