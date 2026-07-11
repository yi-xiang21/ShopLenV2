import { WorkshopApi } from "@/pages/Admin/managerWorkshop/api/workShop_api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Workshop, WorkshopVariant } from "@/pages/Admin/managerWorkshop/types/workshop";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaHeart } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { MapPin, Users, Calendar, Clock, Ticket, Tag, CheckCircle2, AlertCircle } from "lucide-react";

import { toggleWishlistThunk } from "@/pages/User/whistlist/store/wishlist_thunck"; 

import { parseToDayjs } from "@/share/ComponentCustom/FormatTime";

const DetailWorkshop = () => {
  const navigation = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Workshop | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeVariant, setActiveVariant] = useState<WorkshopVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [stock, setStock] = useState<number>(0);
  const dispatch = useAppDispatch(); 

  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await WorkshopApi.getById(id);
        const productData = response.data?.data.workshop || null;
        setProduct(productData);

        if (productData && productData.sessions?.length > 0) {
          const firstSession = productData.sessions[0];
          setActiveVariant(firstSession);
          setStock(firstSession.available_slots || 0);
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin workshop:", error);
      }
    };
    if (id) {
      void fetchProductData();
    }
  }, [id]);

  useEffect(() => {
    if (wishlistItems && product?.product_id) {
      const isFav = wishlistItems.some((item: any) => item.product_id === product.product_id);
      setIsFavorite(isFav);
    }
  }, [wishlistItems, product?.product_id]);

  const images = product?.sessions?.flatMap((session) => session.images || []) || [];

  const handleSelectVariant = (variant: WorkshopVariant) => {
    setActiveVariant(variant);
    setStock(variant.available_slots || 0);
    setQuantity(1); 

    if (variant.images && variant.images.length > 0) {
      const firstImageUrl = variant.images[0].image_url;
      const imageIndex = images.findIndex((img) => img.image_url === firstImageUrl);
      
      if (imageIndex !== -1) {
        setActiveImage(imageIndex);
      }
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    try {
      await dispatch(toggleWishlistThunk(product.product_id || 0)).unwrap();
      setIsFavorite((prev) => !prev);
    } catch (error) {
      console.error("Lỗi khi toggle wishlist:", error);
    }
  };

  
  const renderVariantStatus = (status: string) => {
    switch (status) {
      case "open": return <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-semibold border border-green-200">Mở đăng ký</span>;
      case "full": return <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded text-xs font-semibold border border-orange-200">Đã đầy</span>;
      case "closed": return <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs font-semibold border border-red-200">Đã đóng</span>;
      default: return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 py-8 px-4 flex flex-col items-center">

      
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row">
        
        \
        <div className="w-full lg:w-1/2 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col">
          {/* Main Image */}
          <div className="overflow-hidden rounded-2xl mb-4 relative aspect-4/3 bg-slate-100 flex items-center justify-center">
            {images[activeImage]?.image_url ? (
              <img
                src={images[activeImage]?.image_url}
                alt="Main Product"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <span className="text-slate-400">Chưa có hình ảnh</span>
            )}
            
            {/* Trạng thái lớp học (overall) */}
            <div className="absolute top-4 left-4 z-10">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm ${product?.status === 'active' ? 'bg-blue-500' : 'bg-slate-400'}`}>
                {product?.status === 'active' ? 'Đang hoạt động' : 'Tạm ngưng'}
              </span>
            </div>
          </div>

          {/* Thumbnail Slider */}
          {images.length > 0 && (
            <div className="relative mt-1">
              <button className="thumb-prev absolute left-0 top-1/2 z-10 -translate-y-1/2 -ml-3 rounded-full bg-white p-2 shadow-md border border-slate-100 hover:bg-slate-50 text-slate-600">
                ←
              </button>
              <button className="thumb-next absolute right-0 top-1/2 z-10 -translate-y-1/2 -mr-3 rounded-full bg-white p-2 shadow-md border border-slate-100 hover:bg-slate-50 text-slate-600">
                →
              </button>

              <Swiper
                modules={[Navigation]}
                navigation={{ prevEl: ".thumb-prev", nextEl: ".thumb-next" }}
                slidesPerView={5}
                spaceBetween={12}
                className="px-4 py-1"
              >
                {images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <div 
                      onClick={() => setActiveImage(index)}
                      className={`
                        aspect-square cursor-pointer rounded-xl overflow-hidden border-2 p-0.5 transition-all
                        ${activeImage === index ? "border-violet-500 opacity-100" : "border-transparent opacity-60 hover:opacity-100 hover:border-slate-300"}
                      `}
                    >
                      <img src={img.image_url} alt={`Thumb ${index}`} className="w-full h-full object-cover rounded-lg" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>

      
        <div className="w-full lg:w-1/2 p-6 lg:p-10 relative flex flex-col">
          
          {/* Nút Yêu thích */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-6 right-6 lg:top-10 lg:right-10 z-20 w-12 h-12 rounded-full shadow-sm flex items-center justify-center transition-all cursor-pointer bg-slate-50 border border-slate-100 hover:bg-rose-50 hover:border-rose-100"
            title="Thêm vào yêu thích"
          >
            <FaHeart className={`transition-colors text-2xl ${isFavorite ? "text-rose-500" : "text-slate-300"}`} />
          </button>

          {/* Tiêu đề & Danh mục */}
          <div className="pr-16">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-violet-100 text-violet-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                {product?.category_name || "Khóa học"}
              </span>
              <span className="text-slate-400 text-sm flex items-center gap-1">
                <Tag size={14} /> ID: {product?.workshop_id}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-800 leading-tight mb-4">
              {product?.title}
            </h1>
            
            {/* Địa điểm */}
            <div className="flex items-start gap-2 text-slate-600 bg-blue-50 p-3 rounded-xl border border-blue-100 mb-6">
              <MapPin size={20} className="text-blue-500 mt-0.5 shrink-0" />
              <span className="font-medium text-sm lg:text-base leading-snug">{product?.location}</span>
            </div>
          </div>

          {/* Giá tiền */}
          <div className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Chi phí tham gia</h3>
            {activeVariant?.discount ? (
              <div>
                <div className="flex flex-wrap items-end gap-3 mb-2">
                  <span className="text-4xl font-black text-rose-600 tracking-tight">
                    {Number(activeVariant.final_price).toLocaleString("vi-VN")}₫
                  </span>
                  <span className="text-lg font-semibold text-slate-400 line-through decoration-slate-300 mb-1">
                    {Number(activeVariant.price).toLocaleString("vi-VN")}₫
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-700 px-3 py-1 rounded-md text-xs font-bold">
                  <Ticket size={14} />
                  {activeVariant.discount.voucher_name || 
                   (activeVariant.discount.type === 'percent' ? `Giảm ${activeVariant.discount.value}%` : `Giảm ${activeVariant.discount.value}đ`)}
                </div>
              </div>
            ) : (
              <span className="text-4xl font-black text-slate-800 tracking-tight">
                {Number(activeVariant?.price || 0).toLocaleString("vi-VN")}₫
              </span>
            )}
          </div>

          {/* Lịch học (Sessions) */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-800">Chọn lịch học</h3>
              <span className="text-sm text-slate-500">Có {product?.sessions.length || 0} ca học</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product?.sessions.map((variant) => {
                const isSelected = activeVariant?.variant_id === variant.variant_id;
                const isAvailable = variant.status === "open" && (variant.available_slots || 0) > 0;
                
                return (
                  <button
                    key={variant.variant_id}
                    onClick={() => isAvailable && handleSelectVariant(variant)}
                    disabled={!isAvailable}
                    className={`
                      relative flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all
                      ${!isAvailable ? "opacity-60 bg-slate-50 border-slate-200 cursor-not-allowed" : "cursor-pointer"}
                      ${isSelected ? "border-violet-500 bg-violet-50 shadow-md" : "border-slate-200 hover:border-violet-300"}
                    `}
                  >
                 
                    {isSelected && <CheckCircle2 className="absolute top-3 right-3 text-violet-600" size={20} />}
                    
                    <div className="flex items-center gap-2 mb-2 w-full pr-6">
                      <span className="font-bold text-slate-800 line-clamp-1">{variant.session_name}</span>
                    </div>

                    <div className="flex flex-col gap-1.5 text-sm w-full">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar size={14} className="text-orange-500" />
                        <span>{parseToDayjs(variant.start_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock size={14} className="text-blue-500" />
                        <span>{parseToDayjs(`1970-01-01T${variant.start_time}`, "HH:mm")} - {parseToDayjs(`1970-01-01T${variant.end_time}`, "HH:mm")}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 w-full flex items-center justify-between">
                      {renderVariantStatus(variant.status)}
                      {variant.sku && <span className="text-xs text-slate-400 font-mono">{variant.sku}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Users size={18} className="text-green-600" />
                Thông tin chỗ ngồi
              </h3>
              <div className="text-sm text-slate-600 flex items-center gap-4">
                <span>Tổng: <strong>{activeVariant?.total_capacity || 0}</strong></span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span>Đã đăng ký: <strong className="text-orange-600">{activeVariant?.booked_slots || 0}</strong></span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span>Còn trống: <strong className="text-green-600">{stock}</strong></span>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:items-end">
              <h3 className="font-semibold text-slate-800 text-sm">Số lượng vé</h3>
              <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-xl p-1 shadow-sm w-fit">
                <button
                  onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                  disabled={quantity <= 1 || stock === 0}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-all font-bold"
                >
                  −
                </button>
                <input 
                  type="text" 
                  value={stock === 0 ? 0 : quantity} 
                  readOnly
                  className="w-12 h-8 text-center font-bold text-slate-800 bg-transparent outline-none" 
                />
                <button
                  onClick={() => setQuantity((prev) => Math.min(prev + 1, stock))}
                  disabled={quantity >= stock || stock === 0}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-all font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          
          <div className="mt-auto flex items-center justify-center">
            {stock === 0 || activeVariant?.status !== 'open' ? (
              <button disabled className="w-full rounded-2xl bg-slate-300 py-4 text-white font-bold text-lg flex items-center justify-center gap-2 cursor-not-allowed">
                <AlertCircle size={20} />
                Ca học này đã kín chỗ hoặc đã đóng
              </button>
            ) : (
              <button 
                 onClick={() => navigation(`/workshop-billing/${id}/${quantity}`)}
                className="button_user w-full"
              >
                Đăng ký ngay suất học
              </button>
            )}
          </div>

        </div>
      </div>

     
      <div className="w-full max-w-7xl mt-6 bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-4 border-b border-slate-100">Thông tin chi tiết khóa học</h2>
        <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-p:text-slate-600 whitespace-pre-wrap">
          {product?.description}
        </div>
      </div>

    </div>
  );
};

export default DetailWorkshop;