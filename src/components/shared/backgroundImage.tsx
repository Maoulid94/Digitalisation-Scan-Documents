import { motion } from "framer-motion";

interface Props {
  y: any;
  scale: any;
  rotateX: any;
  rotateY: any;
}

export function BackgroundImage({ y, scale, rotateX, rotateY }: Props) {
  return (
    <motion.div
      style={{ y, scale, rotateX, rotateY }}
      className="absolute inset-0 -z-10"
    >
      <img
        src="/images/Digitalisation-bg-1.png"
        alt="background"
        className="w-full h-full object-cover object-center"
        draggable={false}
      />
    </motion.div>
  );
}
