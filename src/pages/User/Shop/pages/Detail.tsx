import { ProductApi } from "@/pages/Admin/managerProducts/api/products_api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product, Variant } from "@/pages/Admin/managerProducts/type/products";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaHeart } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { ShoppingCart, Tag, Box, Info, Ticket } from "lucide-react";

import { toggleWishlistThunk } from "@/pages/User/whistlist/store/wishlist_thunck"; 
import CardProducts from "@/component/CardProducts";
import Notification, { type NotificationType } from "@/share/ComponentCustom/Notification/Notification";
import { addToCart } from "../../cart/store/cart_thunck";
import { addToLocalCart } from "../../cart/store/cart_slice";

const Detail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeVariant, setActiveVariant] = useState<Variant | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [stock, setStock] = useState<number>(0);
  
  const dispatch = useAppDispatch(); 
  const { user } = useAppSelector((state) => state.auth);
  const [notifyData, setNotifyData] = useState<{
      key: string;
      type: NotificationType;
      title: string;
      message: string;
    } | null>(null);

  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        
        const response = await ProductApi.getById(id);
        const productData = response.data?.data.product || null;
        console.log("Chi tiết sản phẩm:", productData);
        if(productData.product_status !== "active"){
          setNotifyData({
            key: Date.now().toString(),
            type: "warning",
            title: "Cảnh báo",
            message: "Sản phẩm này hiện không khả dụng.",
          });
          return;
        }
        setProduct(productData);

        if (productData && productData.category_id) {
            const senddata = {
            category_id: productData.category_id,
            status: "active",
            page: 1,
            limit: 10,
            };
          const relatedResponse = await ProductApi.filter(senddata);
          setRelatedProducts(relatedResponse.data?.data.products || []);
        }

        if (productData && productData.variants?.length > 0) {
          setActiveVariant(productData.variants[0]);
          setStock(productData.variants[0].stock_quantity || 0);
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin sản phẩm:", error);
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

  const images = product?.variants?.flatMap((variant) => variant.images || []) || [];

  const handleSelectVariant = (variant: Variant) => {
    setActiveVariant(variant);
    setStock(variant.stock_quantity || 0);
    setQuantity(1); 

    if (variant.images && variant.images.length > 0) {
      const firstImageUrl = variant.images[0].image_url;
      const imageIndex = images.findIndex((img) => img.image_url === firstImageUrl);
      
      if (imageIndex !== -1) {
        setActiveImage(imageIndex);
      }
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      dispatch(addToLocalCart({
        product_id: Number(product?.product_id),
        variant_id: Number(activeVariant?.variant_id),
        quantity: quantity,
        image_url: activeVariant?.images[0]?.image_url || "",
        product_name: product?.product_name || "",
        price: String(activeVariant?.final_price) || "0",
        size: activeVariant?.size || "",
        color: activeVariant?.color || "",
        stock_quantity: activeVariant?.stock_quantity || 0,
      }));
      setNotifyData({
        key: Date.now().toString(),
        type: "success",
        title: "Thành công",
        message: "Đã thêm sản phẩm vào giỏ hàng.",
      });
      return;
    }
    
    if (!activeVariant) return;
    if (quantity > stock) {
      setNotifyData({
        key: Date.now().toString(),
        type: "warning",
        title: "Lỗi",
        message: "Số lượng vượt quá số lượng trong kho.",
      });
      return;
    }
    
    try {
      const payload = {
        variant_id: Number(activeVariant.variant_id),
        quantity: quantity,
      };
      void dispatch(addToCart(payload)).unwrap();
      setNotifyData({
        key: Date.now().toString(),
        type: "success",
        title: "Thành công",
        message: "Đã thêm sản phẩm vào giỏ hàng.",
      });
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
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

  return (
    <div className="w-full min-h-screen bg-slate-50 py-8 px-4 flex flex-col items-center">
      {notifyData && (
        <Notification
          key={notifyData.key}
          type={notifyData.type}
          title={notifyData.title}
          message={notifyData.message}
        />
      )}
      
      
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row">
        
        
        <div className="w-full lg:w-1/2 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col">
          {/* Main Image */}
          <div className="overflow-hidden rounded-2xl mb-4 relative aspect-square bg-slate-100 flex items-center justify-center">
            {images[activeImage]?.image_url ? (
              <img
                src={images[activeImage]?.image_url}
                alt="Main Product"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <span className="text-slate-400">Chưa có hình ảnh</span>
            )}
            
          
            {activeVariant?.discount && (
               <div className="absolute top-4 left-4 z-10 bg-rose-500 text-white font-bold px-3 py-1.5 rounded-full text-xs shadow-md">
                 Giảm {activeVariant.discount.type === 'percent' ? `${activeVariant.discount.value}%` : `${Number(activeVariant.discount.value).toLocaleString('vi-VN')}đ`}
               </div>
            )}
          </div>

        
          {images.length > 0 && (
            <div className="relative mt-auto">
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
          
        
          <button
            onClick={handleToggleWishlist}
            className="absolute top-6 right-6 lg:top-10 lg:right-10 z-20 w-12 h-12 rounded-full shadow-sm flex items-center justify-center transition-all cursor-pointer bg-slate-50 border border-slate-100 hover:bg-rose-50 hover:border-rose-100"
            title="Thêm vào yêu thích"
          >
            <FaHeart className={`transition-colors text-2xl ${isFavorite ? "text-rose-500" : "text-slate-300"}`} />
          </button>

      
          <div className="pr-16">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-violet-100 text-violet-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                {product?.category_name || "Sản phẩm"}
              </span>
              <span className="text-slate-400 text-sm flex items-center gap-1">
                <Tag size={14} /> ID: {product?.product_id}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-800 leading-tight mb-6">
              {product?.product_name}
            </h1>
          </div>

        
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

         
          <div className="mb-8">
            <h3 className="mb-3 font-semibold text-slate-800 flex items-center gap-2">
              <Box size={18} className="text-violet-500"/>
              Màu sắc & Kích thước
            </h3>
            <div className="flex flex-wrap gap-3">
              {product?.variants?.map((variant) => {
                const isSelected = activeVariant?.variant_id === variant.variant_id;
                const isOutOfStock = variant.stock_quantity === 0;

                return (
                  <button
                    key={variant.variant_id}
                    onClick={() => !isOutOfStock && handleSelectVariant(variant)}
                    disabled={isOutOfStock}
                    className={`
                      rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-all
                      ${isOutOfStock ? "opacity-50 bg-slate-100 border-slate-200 cursor-not-allowed line-through" : "cursor-pointer"}
                      ${isSelected && !isOutOfStock
                        ? "border-violet-500 bg-violet-50 text-violet-700 shadow-sm" 
                        : "border-slate-200 text-slate-600 hover:border-violet-300"}
                    `}
                  >
                    {variant.color} - {variant.size}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-auto border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Số lượng</h3>
              <span className={`text-sm font-medium ${stock > 0 ? "text-green-600" : "text-rose-500"}`}>
                {stock > 0 ? `Trong kho: ${stock}` : "Hết hàng"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
            
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl h-14 w-full sm:w-auto p-1">
                <button
                  onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                  disabled={quantity <= 1 || stock === 0}
                  className="w-12 h-full rounded-xl flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-50 transition-all font-bold text-xl"
                >
                  −
                </button>
                <input 
                  type="text" 
                  value={stock === 0 ? 0 : quantity} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 1 && val <= stock) setQuantity(val);
                  }}
                  readOnly={stock === 0}
                  className="w-16 h-full text-center font-bold text-lg text-slate-800 bg-transparent outline-none" 
                />
                <button
                  onClick={() => setQuantity((prev) => Math.min(prev + 1, stock))}
                  disabled={quantity >= stock || stock === 0}
                  className="w-12 h-full rounded-xl flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-50 transition-all font-bold text-xl"
                >
                  +
                </button>
              </div>

              {/* Nút Thêm vào giỏ */}
              <button
                onClick={handleAddToCart}
                disabled={stock === 0}
                className={`
                  button_user flex gap-2 items-center justify-center w-full 
                  ${stock === 0  
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                    : "bg-violet-600 text-white hover:bg-violet-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"}
                `}
              >
                <ShoppingCart size={22} />
                {stock === 0 ? "Tạm hết hàng" : "Thêm vào giỏ hàng"}
              </button>
            </div>
          </div>
          
        </div>
      </div>

      <div className="w-full max-w-7xl mt-6 flex flex-col gap-6">
        
        {/* Description */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-4 border-b border-slate-100 flex items-center gap-2">
            <Info className="text-violet-500" /> Mô tả sản phẩm
          </h2>
          <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-p:text-slate-600 whitespace-pre-wrap">
            {product?.description || "Sản phẩm chưa có mô tả."}
          </div>
        </div>

      
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              Sản phẩm liên quan
            </h2>
            <div className="flex w-full items-stretch justify-start gap-6 overflow-x-auto pb-4 no-scrollbar snap-x">
              {relatedProducts.map((relatedProd) => (
                <div key={relatedProd.product_id} className="shrink-0 w-70 snap-start">
                  <CardProducts data={relatedProd} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Detail;