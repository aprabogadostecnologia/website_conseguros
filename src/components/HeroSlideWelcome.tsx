import { useState, useEffect, useMemo } from "react";
import type { CSSProperties } from "react";
import { motion } from "motion/react";
import { Car, Building2, HeartPulse, ShieldCheck, ArrowRight, TrendingUp, Zap, MessageCircle } from "lucide-react";

interface HeroSlideWelcomeProps {
  onSelectSlide: (index: number) => void;
  onScrollToContact: () => void;
}

export default function HeroSlideWelcome({ onSelectSlide, onScrollToContact }: HeroSlideWelcomeProps) {
  const [scrollY, setScrollY] = useState(0);

  // Monitor the scroll position to control the parallax/reveal effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Thresholds for animations
  // We determine if we are scrolled past 40px to trigger the expansion
  const isExpanded = scrollY > 40;

  // Floating particle field for the blue bar background: each particle gets its own
  // randomized CSS custom properties, generated once and reused across re-renders.
  const particles = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => {
      const isAccent = Math.random() < 0.18;
      const size = Math.round(4 + Math.random() * 22);
      const color = isAccent
        ? `rgba(255, 141, 54, ${(0.25 + Math.random() * 0.35).toFixed(2)})`
        : `rgba(255, 255, 255, ${(0.12 + Math.random() * 0.3).toFixed(2)})`;

      return {
        id: i,
        style: {
          "--top": `${Math.round(Math.random() * 100)}%`,
          "--left": `${Math.round(Math.random() * 100)}%`,
          "--size": `${size}px`,
          "--tx": `${Math.round((Math.random() - 0.5) * 90)}px`,
          "--ty": `${Math.round((Math.random() - 0.5) * 70)}px`,
          "--tz": `${Math.round((Math.random() - 0.5) * 160)}px`,
          "--rot": `${Math.round(Math.random() * 180 - 90)}deg`,
          "--duration": `${(8 + Math.random() * 10).toFixed(1)}s`,
          "--delay": `${(-(Math.random() * 14)).toFixed(1)}s`,
          "--particle-color": color,
        } as CSSProperties,
      };
    });
  }, []);

  const categories = [
    {
      id: 1,
      title: "Auto y moto",
      tagline: "PÓLIZAS DE RIESGO",
      desc: "Protección integral para vehículos particulares y flotas corporativas contra todo riesgo.",
      icon: Car,
      image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=600",
      badgeText: "Movilidad",
      accentGlow: "from-blue-500/10 to-transparent",
      bgColor: "bg-[#2480e6]",
    },
    {
      id: 3,
      title: "Salud",
      tagline: "PÓLIZAS DE RIESGO",
      desc: "Medicina prepagada y seguros de salud colectivos para tu bienestar y el de tus seres queridos.",
      icon: HeartPulse,
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600",
      badgeText: "Bienestar",
      accentGlow: "from-rose-500/10 to-transparent",
      bgColor: "bg-[#42328a]",
    },
    {
      id: 2,
      title: "Empresarial",
      tagline: "PÓLIZAS DE RIESGO",
      desc: "Blindaje de infraestructura física, multirriesgo comercial y responsabilidad civil integral.",
      icon: Building2,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600",
      badgeText: "Patrimonio",
      accentGlow: "from-emerald-500/10 to-transparent",
      bgColor: "bg-[#0c2340]",
    },
    {
      id: 4,
      title: "ARL",
      tagline: "PÓLIZAS DE RIESGO",
      desc: "Optimización de clasificaciones y asesoría de ley sin costo adicional para empresas.",
      icon: ShieldCheck,
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600",
      badgeText: "SST & Ley",
      accentGlow: "from-amber-500/10 to-transparent",
      bgColor: "bg-[#804f10]",
    },
  ];

  return (
    <div 
      id="parallax-hero-container" 
      className="relative w-full bg-white select-none overflow-visible"
      style={{ minHeight: "145vh" }}
    >
      {/* 1. STICKY BACKGROUND LAYER (Fondo Principal con la marca)
          Responsive viewport height calculation ensuring the blue bar sits beautifully at the bottom of the screen with no clipping! */}
      <div className="sticky top-[64px] md:top-[80px] left-0 w-full h-[max(360px,min(calc(100vh-64px-134px),720px))] md:h-[max(480px,min(calc(100vh-80px-185px),820px))] overflow-hidden flex flex-col justify-center items-center z-10 bg-white">
        {/* Subtle light background radial gradient */}
        <div className="absolute inset-0 bg-radial from-slate-50/50 via-white to-white pointer-events-none" />
        
        {/* Central Layout containing Brand elements */}
        <div className="relative flex flex-col items-center justify-center text-center max-w-4xl xl:max-w-5xl px-6">
          {/* Central Logo Silhouette Icon */}
          <div className="relative mb-4 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#121ccf]/5 rounded-full filter blur-2xl w-64 h-64 md:w-96 md:h-96 xl:w-[28rem] xl:h-[28rem] pointer-events-none animate-pulse" />
            <img
              src="/images/log%20sin%20fondo.png"
              alt="Conseguros Logo"
              className="w-52 h-52 md:w-80 md:h-80 lg:w-88 lg:h-88 xl:w-[22rem] xl:h-[22rem] object-contain relative z-10 select-none drop-shadow-[0_12px_24px_rgba(18,28,207,0.08)]"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Core Headline */}
          <h1 className="font-display font-bold text-slate-700 mt-4 text-sm md:text-lg xl:text-xl max-w-xl xl:max-w-2xl leading-relaxed tracking-wide">
            Seguros hechos simples, claros y cercanos
          </h1>
        </div>

        {/* STATS/METRIC CARDS: ALIGNED FLOATING COLUMN ON THE LEFT SIDE */}
        <div className="hidden md:flex absolute left-[5%] lg:left-[10%] xl:left-[12%] top-1/2 -translate-y-1/2 z-25 flex-col items-center gap-10 lg:gap-14">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center select-none cursor-default text-center"
          >
            <span className="text-5xl lg:text-6xl xl:text-7xl font-black text-[#121ccf] leading-none">+35</span>
            <span className="text-[9px] lg:text-[11px] xl:text-xs font-extrabold tracking-[0.2em] text-slate-500 uppercase mt-2.5 leading-none">Años de</span>
            <span className="text-[9px] lg:text-[11px] xl:text-xs font-extrabold tracking-[0.2em] text-slate-500 uppercase leading-none mt-1">Experiencia</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="flex flex-col items-center justify-center select-none cursor-default text-center"
          >
            <span className="text-4xl lg:text-5xl xl:text-6xl font-black text-[#050839] leading-none">+5.000</span>
            <span className="text-[9px] lg:text-[11px] xl:text-xs font-extrabold tracking-[0.2em] text-slate-500 uppercase mt-2.5 leading-none">Vidas</span>
            <span className="text-[9px] lg:text-[11px] xl:text-xs font-extrabold tracking-[0.2em] text-slate-500 uppercase leading-none mt-1">Protegidas</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="flex flex-col items-center justify-center select-none cursor-default text-center"
          >
            <span className="text-5xl lg:text-6xl xl:text-7xl font-black text-[#FF8D36] leading-none">+84</span>
            <span className="text-[9px] lg:text-[11px] xl:text-xs font-extrabold tracking-[0.2em] text-slate-500 uppercase mt-2.5 leading-none">Procesos</span>
            <span className="text-[9px] lg:text-[11px] xl:text-xs font-extrabold tracking-[0.2em] text-slate-500 uppercase leading-none mt-1">Exitosos</span>
          </motion.div>
        </div>

        {/* QUICK-QUOTE CTA: FLOATING COLUMN ON THE RIGHT SIDE */}
        <div className="hidden md:flex absolute right-[5%] lg:right-[10%] xl:right-[12%] top-1/2 -translate-y-1/2 z-25 flex-col items-stretch gap-4 w-60 lg:w-72 xl:w-80">
          {/* Social-proof stats, stacked above the CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-3 mb-1"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-3.5 bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl px-5 py-4 xl:py-5 shadow-sm"
            >
              <div className="w-12 h-12 xl:w-14 xl:h-14 rounded-xl bg-[#121ccf]/8 text-[#121ccf] flex items-center justify-center shrink-0">
                <HeartPulse className="w-6 h-6 xl:w-7 xl:h-7" />
              </div>
              <div className="text-left">
                <span className="block text-1xl xl:text-2xl font-black text-[#050839] leading-none">+10.000 millones</span>
                <span className="block text-[10px] xl:text-xs font-extrabold tracking-[0.12em] text-slate-500 uppercase mt-1.5 leading-tight">
                  Protegidos
                </span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="flex items-center gap-3.5 bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl px-5 py-4 xl:py-5 shadow-sm"
            >
              <div className="w-12 h-12 xl:w-14 xl:h-14 rounded-xl bg-[#FF8D36]/10 text-[#FF8D36] flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 xl:w-7 xl:h-7" />
              </div>
              <div className="text-left">
                <span className="block text-2xl xl:text-3xl font-black text-[#050839] leading-none">$80.000.000</span>
                <span className="block text-[10px] xl:text-xs font-extrabold tracking-[0.12em] text-slate-500 uppercase mt-1.5 leading-tight">
                  Ahorro Pyme anual
                </span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <button
              onClick={() => document.getElementById("cotizar")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full group bg-[#FF8D36] hover:bg-[#f07f26] text-white px-5 py-4 rounded-2xl shadow-xl shadow-orange-500/25 flex items-center gap-3 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
            >
              <Zap className="w-5 h-5 shrink-0" />
              <span className="text-left leading-tight">
                <span className="block text-[10px] font-extrabold uppercase tracking-widest opacity-90">Cotiza en</span>
                <span className="block text-sm font-black uppercase tracking-wide">2 minutos</span>
              </span>
              <ArrowRight className="w-4 h-4 ml-auto shrink-0 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          >
            <a
              href="https://wa.me/573210000000?text=Hola%20Conseguros%2C%20quiero%20cotizar%20un%20seguro"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white border border-emerald-200 hover:border-emerald-300 text-emerald-700 px-5 py-4 rounded-2xl shadow-lg shadow-emerald-500/10 flex items-center gap-3 transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5 shrink-0 text-emerald-500" />
              <span className="text-left leading-tight">
                <span className="block text-sm font-black">WhatsApp directo</span>
                <span className="block text-[10px] font-bold text-emerald-500/80 uppercase tracking-wider mt-0.5">Respuesta inmediata</span>
              </span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* 2. SLIDING BLUE BAR LAYER (Franja Azul #0812CC que sobresale y "cubre" el fondo fijo al hacer scroll) */}
      <div 
        className={`relative z-20 w-full bg-[#0812CC] border-t border-blue-400/20 flex flex-col items-center transition-all duration-500 ${
          isExpanded 
            ? "pb-24 pt-6 md:pt-10 px-4 sm:px-6 md:px-12 lg:px-16 shadow-[0_-24px_50px_rgba(8,18,204,0.3)]" 
            : "pt-3 pb-8 md:pt-4 md:pb-11 px-4 sm:px-6 md:px-12 lg:px-16"
        }`}
      >
        {/* Ambient floating particle field */}
        <div className="hero-particle-field">
          {particles.map((p) => (
            <span key={p.id} className="hero-particle" style={p.style} />
          ))}
        </div>

        {/* Accent visual top rail bar */}
        <div className={`w-12 h-1 bg-blue-300/35 rounded-full pointer-events-none transition-all duration-500 ${
          isExpanded ? "mb-5 md:mb-7" : "mb-2 md:mb-3"
        }`} />

        {/* Brand Text Header within the Blue Bar:
            This part collapses/fades when scroll position is 0, keeping the focus strictly on the categories
            which are positioned high up and visible instantly on page load. When the user scrolls, this header
            reveals itself smoothly and slides into place. */}
        <div 
          className="text-center transition-all duration-500 ease-out overflow-hidden"
          style={{
            maxHeight: isExpanded ? "220px" : "0px",
            opacity: isExpanded ? 1 : 0,
            marginBottom: isExpanded ? "2.5rem" : "0rem",
            transform: isExpanded ? "translateY(0)" : "translateY(15px)"
          }}
        >
          <h2 className="font-display font-extrabold text-white text-3xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight mb-2">
            Compara. Elige. Asegúrate.
          </h2>
          <p className="font-sans font-medium text-blue-100/90 text-sm md:text-lg">
              Comparamos por ti entre 13+ aseguradoras de Colombia y te acompañamos en cada paso, desde la cotización hasta el siniestro. Así de simple debería ser un seguro.
          </p>
        </div>

        {/* CATEGORIES GRID CONTAINER (Highly responsive) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full max-w-7xl mx-auto">
          {categories.map((cat) => {
            const Icon = cat.icon;
            
            return (
              <div
                key={cat.id}
                onClick={() => onSelectSlide(cat.id)}
                className={`relative overflow-hidden rounded-2xl md:rounded-[2rem] border border-white/10 ${cat.bgColor} cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 ease-out flex flex-col justify-between group p-3.5 sm:p-5 hover:border-white/20 select-none ${
                  isExpanded 
                    ? "h-[220px] sm:h-[260px] md:h-[300px] scale-102" 
                    : "h-[90px] sm:h-[110px] md:h-[125px] scale-100"
                }`}
              >
                {/* Background Image with elegant darkness and scale hover - STRICTLY STATIC EFFECT */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:scale-105 group-hover:opacity-35 transition-all duration-700 pointer-events-none"
                />
                
                {/* Gradient overlay inside each card to ensure high-contrast readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none" />

                {/* Ambient glow accent from the bottom corner */}
                <div className={`absolute inset-0 bg-gradient-to-tr ${cat.accentGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                {/* Top Row: Floating Pill Badge mimicking the official Conseguros screenshot */}
                <div className={`relative z-10 self-start bg-white/95 rounded-md md:rounded-lg py-0.5 md:py-1 px-1.5 md:px-2.5 flex items-center gap-1 md:gap-1.5 shadow-md transition-all duration-300 ${
                  isExpanded ? "translate-y-0 opacity-100" : "translate-y-0 opacity-100"
                }`}>
                  <Icon className="w-2.5 h-2.5 md:w-3 md:h-3 text-[#0812CC]" />
                  <span className="text-[6.5px] md:text-[7.5px] font-extrabold text-slate-800 tracking-wider uppercase leading-none">
                    {cat.tagline}
                  </span>
                </div>

                {/* Bottom Content Area */}
                <div className="relative z-10 text-left mt-auto w-full">
                  <span className={`text-[6.5px] md:text-[8px] font-extrabold text-blue-300 uppercase tracking-widest block mb-0.5 leading-none transition-all duration-300 ${
                    isExpanded ? "opacity-100" : "opacity-0 md:opacity-75"
                  }`}>
                    {cat.badgeText}
                  </span>
                  <h3 className="text-xs sm:text-sm md:text-lg lg:text-xl font-black text-white leading-tight mb-0.5 sm:mb-1">
                    {cat.title}
                  </h3>

                  {/* Smooth expandable text reveal on Scroll */}
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isExpanded ? "max-h-24 opacity-100 mt-1 sm:mt-2" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-[10px] md:text-xs text-slate-300 leading-relaxed font-semibold line-clamp-3">
                      {cat.desc}
                    </p>
                  </div>

                  {/* Dynamic CTA Button triggering on expand state or hover */}
                  <div className={`transition-all duration-500 flex items-center justify-between ${
                    isExpanded ? "mt-2 sm:mt-4 opacity-100 h-auto" : "mt-0 opacity-0 h-0 overflow-hidden"
                  }`}>
                    <div className="inline-flex items-center gap-1 sm:gap-1.5 py-1 sm:py-1.5 md:py-2 px-3 sm:px-4 rounded-full bg-[#FF8D36] text-white shadow-md shadow-orange-500/25 transition-transform duration-300 group-hover:scale-105">
                      <span className="text-[8px] md:text-[10px] font-black uppercase tracking-wider">COTIZAR</span>
                      <ArrowRight className="w-2.5 h-2.5 md:w-3 md:h-3 shrink-0" />
                    </div>
                  </div>

                  {/* Little indicator chevron or arrow for compact state in mobile */}
                  <div className={`flex items-center text-[8px] sm:text-[9px] font-extrabold text-blue-200 mt-0.5 transition-all duration-300 ${
                    isExpanded ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-auto"
                  }`}>
                    <span className="uppercase tracking-wider">Ver más</span>
                    <ArrowRight className="w-2.5 h-2.5 ml-1 animate-pulse" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
