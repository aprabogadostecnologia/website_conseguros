import { useRef } from "react";

// 6 fotos dispersas a distinta "profundidad": al mover el mouse cada una se
// desplaza a una velocidad distinta según esa profundidad (parallax real).
const BASE = import.meta.env.BASE_URL;

const IMAGES = [
  { src: `${BASE}images/nosotros-cubo-1.png`, top: "4%", left: "2%", size: "34%", rot: -6, depth: 0.35, z: 2 },
  { src: `${BASE}images/nosotros-cubo-2.png`, top: "0%", left: "40%", size: "40%", rot: 4, depth: 0.55, z: 4 },
  { src: `${BASE}images/nosotros-cubo-3.png`, top: "10%", left: "74%", size: "26%", rot: -4, depth: 0.25, z: 1 },
  { src: `${BASE}images/nosotros-cubo-4.png`, top: "48%", left: "6%", size: "36%", rot: 5, depth: 0.45, z: 3 },
  { src: `${BASE}images/nosotros-cubo-5.png`, top: "50%", left: "52%", size: "42%", rot: -3, depth: 0.6, z: 5 },
  { src: `${BASE}images/nosotros-cubo-6.png`, top: "70%", left: "24%", size: "28%", rot: 7, depth: 0.3, z: 2 },
];

export default function NosotrosParallaxGallery() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const depth = IMAGES[i].depth;
      const shiftX = nx * depth * rect.width * 0.06;
      const shiftY = ny * depth * rect.height * 0.06;
      el.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
    });
  };

  const handleMouseLeave = () => {
    itemRefs.current.forEach((el) => {
      if (el) el.style.transform = "translate(0px, 0px)";
    });
  };

  return (
    <div
      ref={sceneRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="nosotros-parallax-scene"
    >
      {IMAGES.map((img, i) => (
        <div
          key={img.src}
          className="nosotros-parallax-item"
          style={{
            top: img.top,
            left: img.left,
            width: img.size,
            height: img.size,
            zIndex: img.z,
            animationDelay: `${i * 0.6}s`,
            ["--rot" as string]: `${img.rot}deg`,
          }}
        >
          <div ref={(el) => { itemRefs.current[i] = el; }} className="nosotros-parallax-item-inner">
            <img src={img.src} alt="" referrerPolicy="no-referrer" />
          </div>
        </div>
      ))}
    </div>
  );
}
