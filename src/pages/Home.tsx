import ParallaxSection from "../component/ParallaxSection";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import HomeBanner1 from "../assets/HomeBanner1.png";
import HomeBanner2 from "../assets/HomeBanner2.png";
import WokShopHome from "../assets/WorkShopHome.png";
import section1 from "../assets/section1.jpg";
import { useEffect,  useState } from "react";
import Catelogy from "../component/CardCatelogy";
import type { Category } from "../pages/Admin/managerCatelogy/type/catelogy";
import { Skeleton } from "antd";
import { categoryApi } from "./Admin/managerCatelogy/api/cate_api";
import { ProductApi } from "./Admin/managerProducts/api/products_api";
import CardProducts from "@/component/CardProducts";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import dogAnimation from '@/assets/animation/Corgi with blue balloon.json';
import catYarnAnimation from '@/assets/animation/playing cat.json';
import { FaArrowUp } from "react-icons/fa";



const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<any[]>([]);
  const [productTop, setProductTop] = useState<any[]>([]);
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
       const response = await categoryApi.getAll(1, 1000);
        const categories = response.data.data.categories;
        setCategories(categories);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await ProductApi.getAll(1, 1000);

        const allProducts = response.data?.data?.products || [];

      const activeProducts = allProducts.filter((product: any) => product.product_status === "active");
      setProducts(activeProducts)
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchTopSellingProducts = async () => {
      setLoading(true);
      try {
        const response = await ProductApi.getProductsTopSelling();
        const topSellingProducts = response.data?.data?.products || [];
        setProductTop(topSellingProducts);
      }
      catch (error) {
        console.error("Lỗi khi lấy sản phẩm bán chạy:", error);
      }
      finally {
        setLoading(false);
      }
    };
    void fetchCategories();
    void fetchProducts();
    void fetchTopSellingProducts();
  }, []);

  
  const bannerImages = [HomeBanner1, HomeBanner2];
  const LottieComponent = Lottie as any;


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
        <h1>Sản Phẩm Bán Chạy</h1>
        <p>Khám phá những sản phẩm được yêu thích nhất của chúng tôi.</p>
        <div className="flex flex-col justify-center items-center md:h-180">
          <div className="h-auto w-full overflow-x-auto overflow-y-hidden  flex items-center p-10 justify-start gap-8 md:w-full md:h-170 no-scrollbar">
            {loading ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : (
              productTop.map((product) => (
                <div key={product.product_id} className="shrink-0">
                  <CardProducts data={product} />
                </div>
              ))
            )}
          </div>
          
        </div>
        <div className="absolute top-250 w-50 mt-10 z-20">
          <LottieComponent.default
                          animationData={dogAnimation}
                          loop
                          autoplay
                        />
        </div>
          
      </div>

      {/* workshop */}
      <div className="text-center h-full mt-20">
        <h1>Chương Trình Workshop Hấp Dẫn</h1>
        <p className="pb-10">
          trải nghiệm tự tay tạo ra các sản phẩm xinh xắn với đội ngũ nhân viên
          hướng dẫn chuyên nghiệp của chúng mình
        </p>
        <ParallaxSection image={WokShopHome}>
          <div className="flex justify-center items-end h-full mt-50">
            <button className="button_user" onClick={() => navigate('/workshop')}>
              Tham Gia Workshop Ngay
            </button>
          </div>
        </ParallaxSection>
      </div>

      {/* san pham ban chay */}
      <section className="text-center h-full mt-20">
         <h1>Các Sản Phẩm Nổi bật</h1>
        <p className="pb-10">Các dòng sản phẩm đa dạng với nhu cầu của bạn</p>
        <div className="flex flex-col justify-center items-center md:h-180">
          <div className="h-auto w-full overflow-x-auto overflow-y-hidden  flex items-center p-10 justify-start gap-8 md:w-full md:h-170 no-scrollbar">
            {loading ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : (
              products.map((product) => (
                <div key={product.product_id} className="shrink-0">
                  <CardProducts data={product} />
                </div>
              ))
            )}
          </div>
          <button className="button_user" onClick={() => navigate('/shop')}>
            Xem Sản Phẩm
          </button>
        </div>
      </section>

      {/* danh muc san pham */}
      <section className="h-140 flex flex-col justify-center items-center md:h-180">
        <h1>Các Danh Mục Của Chúng Tôi</h1>
        <p>khám phá các sản phẩm với cách danh mục bạn muốn.</p>
        <div className="h-100 w-full overflow-x-auto overflow-y-hidden flex items-center p-10 justify-start gap-8 md:w-full md:h-120 no-scrollbar">
          {loading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
            categories.map((category) => (
              <Catelogy  
                Data={category} 
                
               />
            ))
          )}
        </div>
      </section>

      
      <div className="absolute right-10 top-720 w-50 mt-10 z-20">
          <LottieComponent.default
                          animationData={catYarnAnimation}
                          loop
                          autoplay
                        />
        </div>
      {/* Niềm tin chất lượng */}
      <ParallaxSection image={section1}>
        <div className="text-center px-4">
          <h1 className="text-white text-4xl font-bold mb-4 drop-shadow-lg">Cam Kết Chất Lượng & Uy Tín</h1>
          <p className="text-white text-lg max-w-2xl mx-auto drop-shadow-md">
            Mỗi sản phẩm tại Shop Len đều được tuyển chọn kỹ lưỡng từ những chất liệu cao cấp nhất, mang đến sự an tâm tuyệt đối và trải nghiệm đan len tuyệt vời cho mọi khách hàng.
          </p>
        </div>
      </ParallaxSection>

      {/* Nút cuộn lên đầu trang */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 flex items-center justify-center p-3 md:p-4 rounded-full bg-rose-300 text-white shadow-lg shadow-rose-200 hover:bg-rose-400 hover:cursor-pointer hover:-translate-y-1 transition-all duration-300 ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <FaArrowUp className="w-5 h-5" />
      </button>
    </div>
    
  );
};

export default HomePage;
