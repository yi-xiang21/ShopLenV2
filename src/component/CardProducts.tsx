import React, { useState } from "react";
import type {
  Product,
  Variant,
  image,
} from "@/pages/Admin/managerProducts/type/products";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";

import { FaHeart, FaCartPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

interface CardProductsProps {
  data: Product;
}

const CardProducts = ({ data }: CardProductsProps) => {
  const variants: Variant[] = data.variants || [];
  const firstVariant = variants[0];

  const [isFavorite, setIsFavorite] = useState(false);

  const handleToggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsFavorite((prev) => !prev);
  };
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("add to cart", data.product_id);
  }

  return (
    <Link to={`/product/${data.product_id}`}
      className="
      group
      relative
      w-[300px]
      bg-[#ffffff]
      rounded-[24px]
      overflow-hidden
      border
      border-slate-200
      shadow-md
      transition-all
      duration-500
      hover:-translate-y-1
      hover:shadow-[0_15px_40px_rgba(0,0,0,0.10)]
    "
    >
      {/* Badge */}

      {/* Wishlist */}
      <button
        onClick={handleToggleWishlist}
        className="
        absolute
        top-4
        right-4
        z-20
        w-10
        h-10
        rounded-full
        backdrop-blur-sm
        shadow-md
        flex
        items-center
        justify-center
        transition-all
        cursor-pointer
      "
      >
        <FaHeart
          className={`transition-colors ${
            isFavorite ? "text-red-500" : "text-slate-400"
          }`}
        />
      </button>

      {/* Slider */}
      <div className="h-[260px] p-3">
        <Swiper
          modules={[Pagination, Autoplay, EffectFade]}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          effect="fade"
          loop
          speed={800}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          className="
          h-full
          rounded-[20px]
          overflow-hidden
          [--swiper-pagination-color:#d8b4fe]
          [--swiper-pagination-bullet-inactive-color:#d1d5db]
        "
        >
          {firstVariant?.images?.map((img: image, index: number) => (
            <SwiperSlide key={img.image_id || index}>
              <img
                src={img.image_url}
                alt={data.product_name}
                className="
                  w-full
                  h-full
                  object-cover
                  transition-transform
                  duration-1000
                  group-hover:scale-105
                "
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Content */}
      <div className="p-4 pt-2 flex flex-col">
        {/* Title */}
        <h3
          className="
          text-lg
          font-semibold
          text-slate-800
          line-clamp-2
        "
          title={data.product_name}
        >
          {data.product_name}
        </h3>

        {/* Description */}
        <p
          className="
          mt-1
          text-sm
          text-slate-500
          line-clamp-2
        "
        >
          {data.description}
        </p>

        {/* Price */}
        <div
          className="
          mt-2
          text-xl
          font-bold
          text-violet-500
        "
        >
          {Number(firstVariant?.price || 0).toLocaleString("vi-VN")}₫
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div
            className="
          z-20
          bg-pink-300
          text-white
          text-xs
          font-medium
          px-3
          py-1
          rounded-full
          w-fit
        "
          >
            {data.type_name}
          </div>
          <div
            className="
          z-20
          bg-blue-500
          text-white
          text-xs
          font-medium
          px-3
          py-1
          rounded-full
          w-fit
        "
          >
            {data.category_name}
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          

          <button
            onClick={handleAddToCart}
            className="
            flex-1
            h-12
            rounded-xl
            bg-gradient-to-r
            from-violet-300
            to-pink-300
            text-slate-800
            font-semibold
            flex
            items-center
            justify-center
            gap-2
            transition-all
            hover:scale-[1.02]
            hover:shadow-lg
            cursor-pointer
          "
          >
            <FaCartPlus />
            <span>Thêm vào giỏ</span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CardProducts;
