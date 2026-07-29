import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { Award, Users, TrendingUp } from "lucide-react";

interface StatProps {
  target: number;
  prefix?: string;
  label: string;
  icon: React.ElementType;
  delay: number;
}

function AnimatedStat({ target, prefix = "", label, icon: Icon, delay }: StatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1600;
    let startTime: number | null = null;
    let frameId: number;

    const timeoutId = setTimeout(() => {
      const step = (timestamp: number) => {
        if (startTime === null) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) frameId = requestAnimationFrame(step);
      };
      frameId = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(frameId);
    };
  }, [isInView, target, delay]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center px-6">
      <div className="w-11 h-11 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-4">
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter tabular-nums">
        {prefix}
        {value.toLocaleString("es-CO")}
      </div>
      <div className="text-blue-100/80 font-extrabold uppercase tracking-[0.2em] text-xs md:text-sm mt-3">
        {label}
      </div>
    </div>
  );
}

export default function TrajectoryStats() {
  return (
    <section className="bg-brand-blue py-14 md:py-16 lg:py-20 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-14">
          <span className="text-blue-200 font-extrabold tracking-[0.25em] text-xs md:text-sm uppercase block">
            Nuestra Trayectoria en Cifras
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y divide-white/10 md:divide-y-0 md:divide-x">
          <AnimatedStat target={35} prefix="+" label="Años de experiencia" icon={Award} delay={0} />
          <AnimatedStat target={5000} prefix="+" label="Vidas protegidas" icon={Users} delay={150} />
          <AnimatedStat target={84} prefix="+" label="Procesos exitosos" icon={TrendingUp} delay={300} />
        </div>
      </div>
    </section>
  );
}
