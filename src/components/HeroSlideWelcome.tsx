import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Car, Building2, HeartPulse, ShieldCheck, ArrowRight } from "lucide-react";

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

  const categories = [
    {
      id: 1,
      title: "Auto y moto",
      tagline: "PÓLIZAS DE RIESGO",
      desc: "Protección integral para vehículos particulares y flotas corporativas contra todo riesgo.",
      icon: Car,
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600",
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
      <div className="sticky top-[64px] md:top-[80px] left-0 w-full h-[calc(100vh-64px-114px)] md:h-[calc(100vh-80px-157px)] overflow-hidden flex flex-col justify-center items-center z-10 bg-white">
        {/* Subtle light background radial gradient */}
        <div className="absolute inset-0 bg-radial from-slate-50/50 via-white to-white pointer-events-none" />
        
        {/* Central Layout containing Brand elements */}
        <div className="relative flex flex-col items-center justify-center text-center max-w-4xl px-6">
          {/* Central Logo Silhouette Icon */}
          <div className="relative mb-4 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#121ccf]/5 rounded-full filter blur-2xl w-44 h-44 md:w-72 md:h-72 pointer-events-none animate-pulse" />
            <img 
              src="/images/log%20sin%20fondo.png" 
              alt="Conseguros Logo" 
              className="w-36 h-36 md:w-56 md:h-56 lg:w-64 lg:h-64 object-contain relative z-10 select-none drop-shadow-[0_12px_24px_rgba(18,28,207,0.08)]" 
              referrerPolicy="no-referrer" 
            />
          </div>

          {/* Under Logo Brand Name */}
          <h2 className="text-[#050839] font-black text-lg md:text-2.5xl tracking-[0.3em] uppercase font-sans mt-0.5">
            CONSEGUROS
          </h2>

          {/* Core Headline */}
          <h1 className="font-display font-bold text-slate-700 mt-2 text-sm md:text-lg max-w-xl leading-relaxed tracking-wide">
            Seguros hechos simples, claros y cercanos
          </h1>
        </div>

        {/* THREE SLANTED STATS/METRIC CARDS FLOATING IN SPACE */}
        {/* Card 1: Left-Top */}
        <motion.div
          animate={{ y: [0, -6, 0], rotate: [-6, -7, -6] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "center" }}
          className="hidden md:flex absolute top-[14%] left-[6%] lg:left-[12%] z-25 flex-col items-center justify-center select-none cursor-default text-center"
        >
          <span className="text-4xl lg:text-5.5xl font-black text-[#121ccf] leading-none">+35</span>
          <span className="text-[8px] lg:text-[9.5px] font-extrabold tracking-[0.2em] text-slate-450 uppercase mt-2.5 leading-none">Años de</span>
          <span className="text-[8px] lg:text-[9.5px] font-extrabold tracking-[0.2em] text-slate-450 uppercase leading-none mt-1">Experiencia</span>
        </motion.div>

        {/* Card 2: Right-Top */}
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [8, 7, 8] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          style={{ transformOrigin: "center" }}
          className="hidden md:flex absolute top-[20%] right-[6%] lg:right-[12%] z-25 flex-col items-center justify-center select-none cursor-default text-center"
        >
          <span className="text-4xl lg:text-5.5xl font-black text-[#050839] leading-none">57</span>
          <span className="text-[8px] lg:text-[9.5px] font-extrabold tracking-[0.2em] text-slate-450 uppercase mt-2.5 leading-none">Clientes</span>
          <span className="text-[8px] lg:text-[9.5px] font-extrabold tracking-[0.2em] text-slate-450 uppercase leading-none mt-1">Felices</span>
        </motion.div>

        {/* Card 3: Left-Bottom */}
        <motion.div
          animate={{ y: [0, -5, 0], rotate: [-4, -3, -4] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ transformOrigin: "center" }}
          className="hidden md:flex absolute bottom-[16%] left-[5%] lg:left-[10%] z-25 flex-col items-center justify-center select-none cursor-default text-center"
        >
          <span className="text-4xl lg:text-5.5xl font-black text-[#FF8D36] leading-none">+84</span>
          <span className="text-[8px] lg:text-[9.5px] font-extrabold tracking-[0.2em] text-slate-450 uppercase mt-2.5 leading-none">Procesos</span>
          <span className="text-[8px] lg:text-[9.5px] font-extrabold tracking-[0.2em] text-slate-450 uppercase leading-none mt-1">Exitosos</span>
        </motion.div>
      </div>

      {/* 2. SLIDING BLUE BAR LAYER (Franja Azul #0812CC que sobresale y "cubre" el fondo fijo al hacer scroll) */}
      <div 
        className={`relative z-20 w-full bg-[#0812CC] border-t border-blue-400/20 flex flex-col items-center transition-all duration-500 ${
          isExpanded 
            ? "pb-24 pt-6 md:pt-10 px-4 sm:px-6 md:px-12 lg:px-16 shadow-[0_-24px_50px_rgba(8,18,204,0.3)]" 
            : "py-3 md:py-4 px-4 sm:px-6 md:px-12 lg:px-16"
        }`}
      >
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
          <h2 className="font-display font-extrabold text-white text-3.5xl md:text-5xl lg:text-5.5xl tracking-tight mb-2">
            Conseguros Colombia
          </h2>
          <p className="font-sans font-medium text-blue-100/90 text-sm md:text-lg">
            Seguros hechos simples, claros y cercanos
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
