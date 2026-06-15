import ParallaxSection from "../component/ParallaxSection";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import HomeBanner1 from "../assets/HomeBanner1.png";
import HomeBanner2 from "../assets/HomeBanner2.png";
import WokShopHome from "../assets/WorkShopHome.png";
import section1 from "../assets/section1.jpg";
import { useRef, useState } from "react";
import Catelogy from "../component/CardCatelogy";
import CurvedItem from "../component/CurvedScrollItems";
import type { Category } from "../pages/Admin/managerCatelogy/type/catelogy";
export interface Item {
  id: number;
  name: string;
  content: string;
img?: string;
}
const items: Item[] = [
  { id: 1, name: "Item 1", content: "Nội dung chi tiết của Item 1: abcsdsds" ,img:HomeBanner1}, 
  { id: 2, name: "Item 2", content: "Nội dung chi tiết của Item 2: def" ,img:HomeBanner2},
  { id: 3, name: "Item 3", content: "Nội dung chi tiết của Item 3: ghi" ,img:section1},
  { id: 4, name: "Item 4", content: "Nội dung chi tiết của Item 4: jkl" ,img:HomeBanner1},
  { id: 5, name: "Item 5", content: "Nội dung chi tiết của Item 5: mno" ,img:HomeBanner2},
  { id: 6, name: "Item 6", content: "Nội dung chi tiết của Item 6: pqr" ,img:section1},
  { id: 7, name: "Item 7", content: "Nội dung chi tiết của Item 7: stu" ,img:HomeBanner1},
];

// Dữ liệu giả lập cho các danh mục sau nay thay bang tan stack api
const Data: Category[] = [
  {
    id: "1",
    category_name: "Điện thoại",
    description:
      "Các loại điện thoại thông minh từ các thương hiệu hàng đầu.",
    slug: "dien-thoai",
    image_url: HomeBanner1,
    children: [],
  },
  {
    id: "2",
    category_name: "Laptop",
    description: "Các loại laptop phục vụ cho công việc và giải trí.",
    slug: "laptop",
    image_url: HomeBanner2,
    children: [],
  }
  
];

  

const HomePage = () => {
  const bannerImages = [HomeBanner1, HomeBanner2];
  //test 3d
  const containerRef = useRef<HTMLElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  //ket thuc test 3d

  return (
    <div>
        {/* Banner */}
      <div className="w-full h-65 overflow-hidden snap-start snap-always md:h-full">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          effect="fade"
          loop
          speed={900}
          pagination={{
            clickable: true,
            dynamicBullets: true,
            renderBullet: (_, className) =>
              `<span class="${className}"></span>`,
          }}
          spaceBetween={0}
          slidesPerView={1}
          className="homepage-swiper h-65 w-full overflow-hidden md:h-screen"
        >
          {bannerImages.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image}
                alt={`Banner ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
          {/* sp deal */}
      <div className="text-center h-full mt-10">
        <h1>Các Sản Phẩm Nổi bật</h1>
        <p className="pb-10">Các dòng sản phẩm đa dạng với nhu cầu của bạn</p>
        <section
          ref={containerRef}
          className="flex flex-col overflow-y-auto overflow-x-hidden relative h-200 w-full pt-50 pb-40 p-10 no-scrollbar"
          style={{
            background: `url(${items[activeIndex]?.img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            
          }
          }
        >
          {items.map((item, index) => (
            <CurvedItem
              key={item.id}
              item={item}
              index={index}
              containerRef={containerRef}
              setActiveIndex={setActiveIndex}
            />
          ))}

          <div className="sticky bottom-50 right-20 flex justify-end  z-50">
            <div>
              <p className="text-lg">{items[activeIndex]?.content}</p>
            </div>
          </div>
        </section>
      </div>

          {/* workshop */}
      <div className="text-center h-full mt-20">
        <h1 >Chương Trình Workshop Hấp Dẫn</h1>
        <p className="pb-10">
          trải nghiệm tự tay tạo ra các sản phẩm xinh xắn với đội ngũ nhân viên
          hướng dẫn chuyên nghiệp của chúng mình
        </p>
        <ParallaxSection image={WokShopHome}>
          <div className="flex justify-center items-end h-full mt-50">
            <button className="button_user">Tham Gia Workshop Ngay</button>
          </div>
        </ParallaxSection>
      </div>

      {/* san pham ban chay */}
      <div className="text-center h-full mt-20">
          <h1>Sản Phẩm Bán Chạy</h1>
          <p>Khám phá những sản phẩm được yêu thích nhất của chúng tôi.</p>
          <ParallaxSection image={""}>
            <div className="flex flex-col items-center justify-around h-full bg-red-700">
                <div className="grid grid-cols-3 gap-4 mb-10 md:grid-cols-6 h w-full px-6 md:px-10 bg-yellow-800">
                    // thay bang sp tan stack api sau nay
                </div>
              <button className="button_user">Xem Sản Phẩm Bán Chạy</button>
            </div>
        </ParallaxSection>
        </div>
      
      
      {/* danh muc san pham */}
      <section className="h-140 flex flex-col justify-center items-center md:h-180">
        <h1>Các Danh Mục Của Chúng Tôi</h1>
        <p>khám phá các sản phẩm với cách danh mục bạn muốn.</p>
        <div className="h-100 w-full overflow-x-auto overflow-y-hidden flex items-center p-10 justify-start gap-8 md:w-full md:h-120 no-scrollbar">
          {Data.map((item) => (
            <Catelogy key={item.id} Data={item} />
          ))}
        </div>
      </section>

    {/* email đăng ký nhận tin */}
      <ParallaxSection image={section1}>
        <div className="text-center">
          <h1>Our Products</h1>
          <p>Explore our wide range of high-quality products.</p>
        </div>
      </ParallaxSection>
    </div>
  );
};

export default HomePage;
