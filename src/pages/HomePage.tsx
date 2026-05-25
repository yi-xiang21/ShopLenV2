
import ParallaxSection from '../component/ParallaxSection'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import HomeBanner1 from '../assets/HomeBanner1.png'
import HomeBanner2 from '../assets/HomeBanner2.png'
import section1 from '../assets/section1.jpg'
import section2 from '../assets/section2.jpg'
import section3 from '../assets/section3.jpg'

const HomePage = () => {
  const bannerImages = [HomeBanner1, HomeBanner2]
  

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

      <ParallaxSection
        image={section3}
      >
        <div>
          <h2>Contact Us</h2>
          <p>Have questions? Get in touch with our team.</p>
        </div>
      </ParallaxSection>
    </div>
  )
}

export default HomePage
