import { ProductApi } from "@/pages/Admin/managerProducts/api/products_api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product, Variant } from "@/pages/Admin/managerProducts/type/products";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaHeart } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";

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
        setProduct(productData);

        
        if (productData && productData.category_id) {
            const senddata = {
            category_id: productData.category_id,
            status: "active",
            page: 1,
            limit: 10,
            };
            console.log("Dữ liệu gửi đi:", senddata);
          const relatedResponse = await ProductApi.filter(senddata);
          console.log("Sản phẩm liên quan:", relatedResponse.data?.data.products);
          setRelatedProducts(relatedResponse.data?.data.products || []);
        }

        if (productData && productData.variants?.length > 0) {
          
          setActiveVariant(productData.variants[0]);
          console.log(activeVariant);
          setStock(productData.variants[0].stock_quantity || 0);
          console.log("Số lượng trong kho:", stock);
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
    <div className="w-full h-auto p-4 flex flex-col items-center justify-center gap-3">
      {notifyData && (
        <Notification
          key={notifyData.key}
          type={notifyData.type}
          title={notifyData.title}
          message={notifyData.message}
        />
      )}
      <div className="flex gap-2 w-7xl p-4">
        
        <div className="w-150 p-4">
          
          <div className="overflow-hidden rounded-xl mb-2">
            <img
              src={images[activeImage]?.image_url}
              alt="Main Product"
              className="h-100 w-150 object-cover rounded-xl transition-all duration-300"
            />
          </div>

          {/* Thumbnail Slider */}
          <div className="relative">
            <button className="thumb-prev absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg hover:bg-slate-50">
              ←
            </button>
            <button className="thumb-next absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg hover:bg-slate-50">
              →
            </button>

            <Swiper
              modules={[Navigation]}
              navigation={{ prevEl: ".thumb-prev", nextEl: ".thumb-next" }}
              slidesPerView={5}
              spaceBetween={10}
              className="h-30 w-125  "

            >
              {images.map((img, index) => (
                <SwiperSlide key={index} className="h-30 w-40 ">
                  <img
                    src={img.image_url}
                    onClick={() => setActiveImage(index)}
                    alt={`Thumbnail ${index}`}
                    className={`
                      h-30 w-40 cursor-pointer rounded-xl object-cover border-2 p-1 transition-colors
                      ${activeImage === index ? "border-violet-500" : "border-transparent hover:border-slate-300"}
                    `}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        
        <div className="w-full lg:w-1/2 p-8 relative">
          
         
          <button
            onClick={handleToggleWishlist}
            className="absolute top-8 right-8 z-20 w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all cursor-pointer bg-white border border-slate-100 hover:bg-slate-50"
            title="Thêm vào yêu thích"
          >
            <FaHeart
              className={`transition-colors text-xl ${
                isFavorite ? "text-red-500" : "text-slate-300"
              }`}
            />
          </button>

          <h1 className="text-4xl font-bold text-slate-800 pr-12">
            {product?.product_name}
          </h1>

          <p className="mt-3 text-slate-500">{product?.category_name}</p>

          
          <div className="mt-6">
            {activeVariant?.discount ? (
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-rose-600 tracking-tight">
                  {Number(activeVariant.final_price).toLocaleString("vi-VN")}₫
                </span>
                <span className="text-lg font-medium text-slate-400 line-through decoration-slate-300">
                  {Number(activeVariant.price).toLocaleString("vi-VN")}₫
                </span>
              </div>
            ) : (
              <span className="text-4xl font-extrabold text-slate-800 tracking-tight">
                {Number(activeVariant?.price || 0).toLocaleString("vi-VN")}₫
              </span>
            )}
          </div>

          
          <div className="mt-8">
            <h3 className="mb-3 font-semibold text-slate-800">Màu sắc & Kích thước</h3>
            <div className="flex flex-wrap gap-3">
              {product?.variants.map((variant) => {
                const isSelected = activeVariant?.variant_id === variant.variant_id;
                return (
                  <button
                    key={variant.variant_id}
                    onClick={() => handleSelectVariant(variant)}
                    className={`
                      rounded-full border px-4 py-2 text-sm font-medium transition-all cursor-pointer
                      ${isSelected 
                        ? "border-violet-500 bg-violet-50 text-violet-600 shadow-sm" 
                        : "border-slate-300 text-slate-600 hover:border-violet-400 hover:text-violet-500"}
                    `}
                  >
                    {variant.color} - {variant.size}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-8">
            <h3 className="mb-3 font-semibold text-slate-800">Số lượng trong kho: {stock}</h3>
          </div>

          <div className="mt-8">
            <h3 className="mb-3 mt-8 font-semibold text-slate-800">Số lượng</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                className="w-10 h-10 rounded-2xl shadow  text-slate-600 hover:bg-slate-200 hover:cursor-pointer transition-all"
              >
                -
              </button>
              <input type="text" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="w-16 h-10 text-center rounded-2xl border border-slate-300" >
              </input>
              <button
                onClick={() => setQuantity((prev) => Math.min(prev + 1, stock))}
                className="w-10 h-10 rounded-2xl shadow text-slate-600 hover:bg-slate-200 hover:cursor-pointer transition-all"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-2 font-semibold text-slate-800">Mô tả sản phẩm</h3>
            <p className="leading-7 text-slate-600">{product?.description}</p>
          </div>

          
          <div className="mt-10 flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 rounded-2xl bg-violet-600 py-4 text-white font-semibold hover:bg-violet-700 hover:shadow-lg transition-all cursor-pointer active:scale-[0.98]"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
      <div className="w-full h-auto p-4">
  <h2 className="mb-4 text-2xl font-bold text-slate-800">Sản phẩm liên quan</h2>
  <div className="no-scrollbar flex w-full items-center justify-start gap-8 overflow-x-auto overflow-y-hidden p-10">
    {relatedProducts.map((product) => (
      <div key={product.product_id} className="shrink-0">
        <CardProducts data={product} />
      </div>
    ))}
  </div>
</div>
      
    </div>
  );
};

export default Detail;