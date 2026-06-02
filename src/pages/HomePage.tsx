
import ParallaxSection from '../component/ParallaxSection'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import HomeBanner1 from '../assets/HomeBanner1.png'
import HomeBanner2 from '../assets/HomeBanner2.png'
import section1 from '../assets/section1.jpg'
import section2 from '../assets/section2.jpg'
import { useRef, useState } from 'react'
import CurvedItem from '../component/CurvedSrollItems'
export interface Item {
  id: number;
  name: string;
  content: string;
}

const items: Item[] = [
  { id: 1, name: 'Item 1' ,content:"Nội dung chi tiết của Item 1: abcsdsds"},
  { id: 2, name: 'Item 2' ,content:"Nội dung chi tiết của Item 2: def"},
  { id: 3, name: 'Item 3' ,content:"Nội dung chi tiết của Item 3: ghi"},
  { id: 4, name: 'Item 4' ,content:"Nội dung chi tiết của Item 4: jkl"},
  { id: 5, name: 'Item 5' ,content:"Nội dung chi tiết của Item 5: mno"},
  { id: 6, name: 'Item 6' ,content:"Nội dung chi tiết của Item 6: pqr"},
  {id: 7, name: 'Item 7' ,content:"Nội dung chi tiết của Item 7: stu"},
];

const HomePage = () => {
  const bannerImages = [HomeBanner1, HomeBanner2]
  //test 3d
   const containerRef = useRef<HTMLDivElement | null>(null);
  
  const [activeIndex, setActiveIndex] = useState(0);
  //ket thuc test 3d
  

  return (
    <div >
      <div
        className='w-full h-65 overflow-hidden snap-start snap-always md:h-full'
      >
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          effect='fade'
          loop
          speed={900}
          pagination={{
            clickable: true,
            dynamicBullets: true,
            renderBullet: (_, className) => `<span class="${className}"></span>`,
          }}
          spaceBetween={0}
          slidesPerView={1}
          className='homepage-swiper h-65 w-full overflow-hidden md:h-screen'
        >
          {bannerImages.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image} alt={`Banner ${index + 1}`} className='h-full w-full object-cover' />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
       <section className='h-200 flex flex-col justify-center items-center bg-red-300' >

          <h2 >Welcome to Our Store</h2>
          <p>Discover the best products at unbeatable prices.</p>
          <div className='mt-4 bg-amber-800 h-150 w-250 ' >

          </div>
      </section>
       <section
        ref={containerRef}
        className="flex flex-col overflow-y-auto overflow-x-hidden relative h-200 w-full pt-50 pb-40 p-10 no-scrollbar"
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

        <div 

          className="sticky bottom-50 right-20 flex justify-end  z-50"
        >
          <div>
          <p className="text-lg">
            {items[activeIndex]?.content}
          </p>
          </div>
        </div>
     
      </section>
      <ParallaxSection
        image={section1}
      >
        <div>
          <h2>Our Products</h2>
          <p>Explore our wide range of high-quality products.</p>
        </div>
      </ParallaxSection>

      <ParallaxSection
        image={section2}
      >
        <div>
          <h2>Special Offers</h2>
          <p>Check out our latest deals and discounts.</p>
        </div>
      </ParallaxSection>
    </div>
  )
}

export default HomePage
