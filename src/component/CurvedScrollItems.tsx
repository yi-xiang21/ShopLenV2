import { useRef, type RefObject } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import type { Item } from '../pages/HomePage';

//test 3d

interface CurvedItemProps {
  item: Item;
  index: number;
  containerRef: RefObject<HTMLDivElement | null>;
  setActiveIndex: (index: number) => void; 
}

const CurvedItem = ({ item, index, containerRef, setActiveIndex }:CurvedItemProps) => {
  const itemRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: itemRef,
    container: containerRef as unknown as RefObject<HTMLElement | null>,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 0.5, 1], [-250, 150, -250]);
  const scale = useTransform(scrollYProgress, [0, 0.4, 1], [0.75, 1.1, 0.75]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [0, 1, 1, 1, 0]
  );
  
  // 3. Lắng nghe sự thay đổi của scrollYProgress
  // Nếu giá trị nằm trong khoảng giữa (0.45 đến 0.55), ta xem như thẻ đang "Active"
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.45 && latest < 0.55) {
      setActiveIndex(index); // Cập nhật thẻ đang active
    }
  });

  return (
    <motion.div
      ref={itemRef}
      style={{
        x,
        scale,
        opacity,
        marginTop: index === 0 ? '0px' : '-110px', 
        background: '#fbbf24',
        borderRadius: '1rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        textAlign: 'center',
        width: '300px',
        marginLeft: '100px',
        position: 'relative',
        zIndex: 10 - index,
        padding: '0px',
      }}
    >
      <h3 className="text-xl font-bold text-amber-900 h-90 flex items-center justify-center">
        {item.name}
      </h3>
    </motion.div>
  );
};
export default CurvedItem;