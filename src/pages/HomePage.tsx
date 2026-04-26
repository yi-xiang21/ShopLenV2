import { motion } from 'motion/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import HomeBanner1 from '../assets/HomeBanner1.png'
import HomeBanner2 from '../assets/HomeBanner2.png'

const HomePage = () => {
  const bannerImages = [HomeBanner1, HomeBanner2]

  return (
    <div className='snap-y snap-mandatory overflow-y-scroll scroll-smooth'>
      <motion.section
        className='w-full h-65 overflow-hidden snap-start snap-always md:h-full'
        initial={{ opacity: 0, y: 70 }}
        viewport={{ amount: 0.35, once: false }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
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
      </motion.section>

      <motion.section
        className='w-full h-65 overflow-hidden snap-start snap-always rounded-lg bg-amber-50 px-6 py-16 text-left md:px-10 md:h-screen'
        initial={{ opacity: 0, y: 70 }}
        viewport={{ amount: 0.35, once: false }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className='flex h-full flex-col justify-center'>
          <h2 className='text-2xl font-semibold text-amber-900 md:text-4xl'>San pham moi</h2>
          <p className='mt-4 text-amber-800 md:text-lg'>
            Noi dung section nay se truot len va mo dan khi ban cuon toi.
          </p>
        </div>
      </motion.section>

      <motion.section
        className='w-full h-65 overflow-hidden snap-start snap-always rounded-lg bg-slate-100 px-6 py-16 text-left md:px-10 md:h-screen'
        initial={{ opacity: 0, x: -100 }}
        viewport={{ amount: 0.35, once: false }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className='flex h-full flex-col justify-center'>
          <h2 className='text-2xl font-semibold text-slate-900 md:text-4xl'>Workshop noi bat</h2>
          <p className='mt-4 text-slate-700 md:text-lg'>
            Khi section ben tren vuot qua, section nay se tiep tuc truot len voi hieu ung an hien mo dan.
          </p>
        </div>
      </motion.section>
    </div>
  )
}

export default HomePage
