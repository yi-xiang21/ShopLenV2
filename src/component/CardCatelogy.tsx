import type { Category } from "../pages/Admin/managerCatelogy/type/catelogy";

interface CardCatelogyProps {
  Data: Category;
}
const CardCatelogy = ({ Data }: CardCatelogyProps) => {
  return (
    <a className="group relative overflow-hidden rounded-2xl shrink-0 shadow-lg h-80 w-70  md:h-100 md:w-90" href={`/category/${Data.categorySlug}`}>
      <img src={Data.categoryImage} className="h-full w-full object-cover" />

      <div
        className="
      absolute
      inset-x-0
      bottom-0
      translate-y-[20%]
      bg-white/95
      p-2
      transition-transform duration-500
      group-hover:translate-y-0
    "
      >
        <h1>{Data.categoryName}</h1>  
      </div>

      <div
        className="
      absolute bottom-0 left-0 right-0
      translate-y-full
      bg-white
      p-4
      transition-transform duration-500
      group-hover:translate-y-0
    "
      >
        <h1>{Data.categoryName}</h1>

        <p>{Data.categoryDescription}</p>
      </div>
    </a>
  );
};

export default CardCatelogy;
