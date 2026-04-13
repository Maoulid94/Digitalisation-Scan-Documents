import { type ReactNode, useState } from "react";
import { useAccueilMotion } from "../hooks/UseBackgoundImageMotion";
import { BackgroundImage } from "../shared/backgroundImage";
interface Props {
  children: ReactNode;
}

export default function ParallaxLayout({ children }: Props) {
  const { ref, y, scale, rotateX, rotateY, handleMouseMove, handleMouseLeave } =
    useAccueilMotion();

  const [isHovering, setIsHovering] = useState(false);

  return (
    <section
      ref={ref}
      onMouseEnter={() => setIsHovering(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setIsHovering(false);
        handleMouseLeave();
      }}
      style={{ perspective: "1200px" }}
      className={`relative min-h-screen overflow-hidden flex items-center justify-center ${
        isHovering ? "will-change-transform" : ""
      }`}
    >
      {/* Background */}
      <BackgroundImage
        y={y}
        scale={scale}
        rotateX={rotateX}
        rotateY={rotateY}
      />

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-linear-to-b from-white/10 via-white/30 to-black/30 backdrop-blur-[2px] z-0" />

      {/* Page content */}
      <div className="relative z-10 w-full max-w-lg">{children}</div>
    </section>
  );
}
