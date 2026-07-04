import { useEffect, useState } from "react";
import type { Workshop } from "@/pages/Admin/managerWorkshop/types/workshop";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { FaHeart } from "react-icons/fa";
import { MapPin, Users, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { toggleWishlistThunk } from "@/pages/User/whistlist/store/wishlist_thunck";
import { parseToDayjs } from "@/share/ComponentCustom/FormatTime";

interface CardWorkshopProps {
  data: Workshop; 
}

const CardWorkshop = ({ data }: CardWorkshopProps) => {
  const dispatch = useAppDispatch();
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const sessions = data.sessions || [];
  const firstSession = sessions[0];
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (wishlistItems && data?.product_id) {
      const isFav = wishlistItems.some((item: any) => item.product_id === data.product_id);
      setIsFavorite(isFav);
    }
  }, [wishlistItems, data.product_id]);

  const handleToggleWishlist = async (workshop: Workshop) => {
    try {
      await dispatch(toggleWishlistThunk(workshop.product_id || 0)).unwrap();
      setIsFavorite((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="
      group relative w-90 bg-[#ffffff] rounded-3xl overflow-hidden 
      border border-slate-200 shadow-md transition-all duration-500 
      hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.10)] h-112 text-left flex flex-col
    "
    >
      {/* Wishlist Button */}
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

      {/* Badges Container */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {/* Discount Badge */}
        {firstSession?.discount && (
          <div className="bg-rose-500/95 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center justify-center gap-1 tracking-wide uppercase border border-rose-400/50 w-fit">
            {firstSession.discount.type === "percent"
              ? `Giảm ${firstSession.discount.value}%`
              : `Giảm ${Number(firstSession.discount.value).toLocaleString("vi-VN")}₫`}
          </div>
        )}
      </div>

      {/* Image Carousel */}
      <Link to={`/workshop-detail/${data.workshop_id}`} className="block h-55 p-3 shrink-0">
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
          {firstSession?.images?.map((img: any, index: number) => (
            <SwiperSlide key={img.image_id || index}>
              <img
                src={img.image_url || img.url}
                alt={data.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </SwiperSlide>
          ))}
          {/* Fallback placeholder */}
          {(!firstSession?.images || firstSession.images.length === 0) && (
             <SwiperSlide>
               <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                  Chưa có hình ảnh
               </div>
             </SwiperSlide>
          )}
        </Swiper>
      </Link>

      {/* Content - Bố cục mới */}
      <div className="p-4 pt-2 flex flex-col flex-1">
        {/* Top: Title & Description */}
        <Link to={`/workshop-detail/${data.workshop_id}`}>
          <h3
            className="text-lg font-bold text-slate-800 line-clamp-1 hover:text-violet-500 transition-colors"
            title={data.title}
          >
            {data.title}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-slate-500 line-clamp-2 min-h-10">
          {data.description}
        </p>

        {/* Đường ngang phân cách */}
        <hr className="my-3 border-slate-200 border-dashed" />

        {/* Bottom: Split Layout (Trái/Phải) */}
        <div className="flex items-stretch flex-1">
          
          {/* Cột Trái: Thông tin */}
          <div className="flex flex-col gap-2 w-1/2 pr-3">
            {/* Location */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <MapPin size={14} className="text-blue-500 shrink-0" />
              <span className="line-clamp-1" title={data.location}>{data.location}</span>
            </div>

            {/* Capacity */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Users size={14} className="text-green-500 shrink-0" />
              <span>{firstSession?.booked_slots || 0} / {firstSession?.total_capacity || 0} chỗ</span>
            </div>

            {/* Category */}
            <div className="mt-auto pt-2">
              <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider line-clamp-1 w-fit">
                {data.category_name || "khoa học"}
              </span>
            </div>
          </div>

          {/* Đường dọc phân cách nhẹ */}
          <div className="w-px bg-slate-200"></div>

          {/* Cột Phải: Ngày giờ & Giá tiền */}
          <div className="flex flex-col w-1/2 pl-3 text-right">
            {/* Time Info */}
            <div className="flex flex-col gap-1.5 text-xs text-slate-600 items-end">
              {firstSession?.start_date && (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-slate-700">
                      {parseToDayjs(firstSession.start_date)?.format("DD/MM/YYYY")}
                    </span>
                    <Calendar size={14} className="text-orange-500 shrink-0" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded text-[11px]">
                    <span className="font-medium">
                      {parseToDayjs(firstSession.start_date)?.format("HH:mm")}
                      {firstSession.end_time ? ` - ${parseToDayjs(firstSession.end_time)?.format("HH:mm")}` : ""}
                    </span>
                    <Clock size={12} className="text-blue-400 shrink-0" />
                  </div>
                </>
              )}
            </div>

            {/* Price Info */}
            <div className="mt-auto pt-2 flex justify-end items-center gap-2">
              {firstSession?.discount ? (
                <>
                  <span className="text-xl text-rose-600 tracking-tight font-bold">
                    {Number(firstSession.final_price).toLocaleString("vi-VN")}₫
                  </span>
                  <span className="text-xs text-slate-400 line-through decoration-slate-300">
                    {Number(firstSession.price).toLocaleString("vi-VN")}₫
                  </span>
                </>
              ) : (
                <span className="text-xl text-slate-800 tracking-tight font-bold">
                  {Number(firstSession?.price || 0).toLocaleString("vi-VN")}₫
                </span>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CardWorkshop;