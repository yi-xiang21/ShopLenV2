import type { Category } from "../pages/Admin/managerCatelogy/type/catelogy";
import { useNavigate } from "react-router-dom";
interface CardCatelogyProps {
  Data: Category;
}

const CardCatelogy = ({ Data }: CardCatelogyProps) => {
  const navigate = useNavigate();
  

  return (
    <a
      onClick={() => navigate(`/shop?categoryId=${Data.id}`)}
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        shadow-md
        hover:shadow-2xl
        transition-all
        duration-500
        w-72
        h-96
        shrink-0
        bg-white
        cursor-pointer
      "
    >
      <img
        src={Data.image_url}
        alt={Data.category_name}
        className="
          w-full
          h-full
          object-cover
          transition-transform
          duration-700
          group-hover:scale-110
        "
      />

      <div
        className="
          absolute
          inset-0
          bg-linear-to-t
          from-black/80
          via-black/20
          to-transparent
        "
      />

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          p-5
          text-white
          transition-all
          duration-500
        "
      >
        <h3
          className="
            text-xl
            font-bold
            mb-2
          "
        >
          {Data.category_name}
        </h3>

        <p
          className="
            text-sm
            text-gray-200
            line-clamp-3
            opacity-0
            translate-y-4
            group-hover:opacity-100
            group-hover:translate-y-0
            transition-all
            duration-500
          "
        >
          {Data.description}
        </p>

        <div
          className="
            mt-4
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            opacity-0
            translate-y-4
            group-hover:opacity-100
            group-hover:translate-y-0
            transition-all
            duration-700
          "
        >
          Xem sản phẩm →
        </div>
      </div>
    </a>
  );
};

export default CardCatelogy;