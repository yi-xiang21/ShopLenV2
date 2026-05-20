import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

type ParallaxSectionProps = {
  image: string | null,
  children?: React.ReactNode,
}

const ParallaxSection = ({
  image,
  children
}: ParallaxSectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null)

  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const sectionY = useTransform(sectionProgress, [0, 1], ['-16%', '16%'])

  return (
    <motion.section
      ref={sectionRef}
      className='relative w-full h-65 overflow-hidden snap-start snap-always px-6 py-16 text-left md:px-10 md:h-screen'
    >
      <motion.img
        src={image || undefined}
        style={{ y: sectionY }}
        className='absolute inset-x-0 -top-[16%] h-[132%] w-full object-cover will-change-transform'
      />
      <div className='absolute inset-0 ' />
      <div className='relative z-10 flex h-full flex-col justify-center'>
        {children}
      </div>
    </motion.section>
  )
}

export default ParallaxSection
