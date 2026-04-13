import {
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { useRef, useCallback } from "react";

export function useAccueilMotion() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "12%"]), {
    stiffness: 60,
    damping: 20,
  });

  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [1.08, 1]), {
    stiffness: 60,
    damping: 20,
  });

  const rotateX = useSpring(useMotionValue(0), {
    stiffness: 120,
    damping: 20,
  });

  const rotateY = useSpring(useMotionValue(0), {
    stiffness: 120,
    damping: 20,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      rotateX.set(((e.clientY - rect.top - centerY) / centerY) * -3);
      rotateY.set(((e.clientX - rect.left - centerX) / centerX) * 3);
    },
    [rotateX, rotateY],
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return {
    ref,
    y,
    scale,
    rotateX,
    rotateY,
    handleMouseMove,
    handleMouseLeave,
  };
}
