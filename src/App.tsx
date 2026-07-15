import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, CheckCircle2, Instagram, Linkedin, Facebook, MessageSquare, ShieldCheck, Heart, Sparkles, Send, Shield, Building2, Scale, ShieldAlert, Car, Stethoscope, ChevronRight, ChevronLeft, HeartPulse, Bike } from "lucide-react";

import { ConsultationRequest } from "./types";
import Navbar from "./components/Navbar";
import WizardModal from "./components/WizardModal";
import EstimatorCalculator from "./components/EstimatorCalculator";
import ProcessSection from "./components/ProcessSection";
import SavedQueries from "./components/SavedQueries";
import QuestionsAndContactSection from "./components/QuestionsAndContactSection";
import SiniestroModal from "./components/SiniestroModal";
import ServiceDetailsModal, { ServiceDetail } from "./components/ServiceDetailsModal";
import HeroWebGLBackground from "./components/HeroWebGLBackground";

// Import new modular Hero slider components
import HeroSlideWelcome from "./components/HeroSlideWelcome";
import HeroSlideVehicles from "./components/HeroSlideVehicles";
import HeroSlideBusiness from "./components/HeroSlideBusiness";
import HeroSlideHealth from "./components/HeroSlideHealth";
import HeroSlideARL from "./components/HeroSlideARL";

const SERVICES_DATA: ServiceDetail[] = [
  {
    id: "multirriesgo",
    name: "Multirriesgo Comercial y Copropiedades",
    shortDesc: "Asegura la infraestructura física de tu empresa, maquinaria comercial, inventarios y oficinas frente a incendios, sismos u otros desastres naturales catastróficos.",
    bulletColor: "text-amber-600",
    borderColor: "hover:border-amber-300 hover:shadow-amber-50/50",
    bgColor: "bg-amber-50",
    badgeBg: "bg-amber-100/70",
    badgeText: "Patrimonio & Activos",
    icon: Building2,
    details: {
      coverage: [
        "Protección de activos, instalaciones físicas e inventarios",
        "Indemnización de lucro cesante por paro de actividades",
        "Cláusulas dinámicas adaptables a copropiedades (Ley 675)",
        "Amparo por terremotos, temblores de tierra y erupciones",
        "Daños por inundaciones, asonadas o actos malintencionados"
      ],
      premiumBenefits: [
        "Auto-reajuste automático del valor asegurado mensual",
        "Amparo automático de nuevas sucursales adquiridas por 90 días",
        "Gastos adicionales para remoción de escombros de emergencia"
      ],
      deductibles: "Estándar negociado: 10% del valor de la pérdida, con un mínimo de 2 SMMLV para riesgos de sismo y eventos catastróficos.",
      allies: ["Sura", "AXA Colpatria", "Allianz", "Bolívar"]
    }
  },
  {
    id: "rce",
    name: "Responsabilidad Civil Extracontractual",
    shortDesc: "Resguarda el patrimonio de la empresa ante reclamaciones de indemnización de terceros por daños materiales, personales u omisiones de servicio.",
    bulletColor: "text-brand-blue",
    borderColor: "hover:border-blue-300 hover:shadow-blue-50/50",
    bgColor: "bg-blue-50",
    badgeBg: "bg-blue-100/75",
    badgeText: "Jurídico & Legal",
    icon: Scale,
    details: {
      coverage: [
        "Defensa jurídica integral ante demandas de terceros (civil/penal)",
        "Protección para Directores y Administradores (pólizas D&O)",
        "RCE patronal frente a accidentes graves de trabajo",
        "RCE en predios, labores ejecutadas y operaciones logísticas"
      ],
      premiumBenefits: [
        "Honorarios ilimitados de abogados penalistas/civiles contratados",
        "Protección extendida para contratistas y operarios temporales",
        "Fianzas y garantías de caución judicial inmediatas"
      ],
      deductibles: "Estándar negociado: 10% de la reclamación aprobada, con un mínimo de 1 SMMLV por evento.",
      allies: ["SBS Seguros", "Seguros del Estado", "Liberty Seguros"]
    }
  },
  {
    id: "vehiculos",
    name: "Flotas de Vehículos y Transporte",
    shortDesc: "Asegura los automóviles corporativos, conductores oficiales y mercancías transportadas contra pérdidas totales, robos o eventualidades logísticas.",
    bulletColor: "text-emerald-600",
    borderColor: "hover:border-emerald-300 hover:shadow-emerald-50/50",
    bgColor: "bg-emerald-50",
    badgeBg: "bg-emerald-100/80",
    badgeText: "Movilidad & Logística",
    icon: Car,
    details: {
      coverage: [
        "Cobertura nacional para mercancía delicada o peligrosa",
        "Asistencia vehicular preferencial 24/7 y grúas de alto tonelaje",
        "Daños parciales o totales de vehículos corporativos (Todo Riesgo)",
        "Pólizas colectivas de asistencia mecánica y cambio de repuestos"
      ],
      premiumBenefits: [
        "Vehículo utilitario de reemplazo para reparto logístico sin costo",
        "Servicio preferencial en talleres de red autorizada a nivel nacional",
        "Exención tarifaria por no reclamación previa (Bonificación)"
      ],
      deductibles: "Estándar negociado: De 0% a 10% según plan de flota, sin deducible en asistencia básica.",
      allies: ["Sura", "Allianz Seguros", "HDI Seguros"]
    }
  },
  {
    id: "salud",
    name: "SST, ARL & Salud Colectiva",
    shortDesc: "Respaldamos la integridad y el bienestar del recurso más valioso: tus colaboradores. Asesoría integral en sistemas de ARL y planes de salud grupales.",
    bulletColor: "text-rose-600",
    borderColor: "hover:border-rose-300 hover:shadow-rose-50/50",
    bgColor: "bg-rose-50",
    badgeBg: "bg-rose-100/80",
    badgeText: "Humano & Salud",
    icon: Stethoscope,
    details: {
      coverage: [
        "Tarifación preventiva y optimización de clasificaciones de ARL",
        "Planes de medicina prepagada colectiva y planes complementarios",
        "Seguros de vida colectivos para el 100% de la nómina activa",
        "Seguros contra accidentes de trabajo de alta peligrosidad"
      ],
      premiumBenefits: [
        "Deducción tributaria directa del impuesto de renta (100%)",
        "Acompañamiento prioritario en el Comité Paritario (COPASST)",
        "Plataforma digital para monitoreo de bienestar psicológico"
      ],
      deductibles: "Estándar prepagada: Copagos preferenciales mínimos o nulos según la clínica asignada en el plan corporativo.",
      allies: ["Sura", "Colmédica", "Coomeva", "AXA Colpatria"]
    }
  },
  {
    id: "ciberseguridad",
    name: "Pólizas ante Riesgos Cibernéticos",
    shortDesc: "Protección jurídica y por lucro cesante frente a secuestro de servidores (Ransomware), vulneración de bases de datos y sanciones del organismo de vigilancia.",
    bulletColor: "text-indigo-600",
    borderColor: "hover:border-indigo-300 hover:shadow-indigo-50/50",
    bgColor: "bg-indigo-50",
    badgeBg: "bg-indigo-100/80",
    badgeText: "Tecnología & Datos",
    icon: ShieldAlert,
    details: {
      coverage: [
        "Amparo ante pérdidas por secuestro y extorsión digital",
        "Defensa jurídica y multas por investigación de la SIC (Ley 1581)",
        "Gastos de peritaje informático experto y restauración técnica",
        "Pérdida de ingresos por inactividad a raíz de ataques DDOS"
      ],
      premiumBenefits: [
        "Escaneo preventivo técnico trimestral de fallas de seguridad gratis",
        "Acompañamiento en manejo reputacional y relaciones públicas ante fugas"
      ],
      deductibles: "Estándar negociado: 24 horas de interrupción de servicio de deducible de tiempo, o 10% del total amortizado.",
      allies: ["Chubb", "Beazley", "AIG"]
    }
  }
];

const SERVICE_IMAGES: Record<string, string> = {
  multirriesgo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
  rce: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
  vehiculos: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800",
  salud: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
  ciberseguridad: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
};

const slide0Specs = [
  {
    label: "Territorio",
    title: "Cobertura Nacional Colombia 🇨🇴",
    detail: "Atención técnica especializada presencial en Bogotá, Medellín, Cali, Barranquilla y Bucaramanga.",
  },
  {
    label: "Acompañamiento",
    title: "Legal y Técnico Integral",
    detail: "Tercerización de disputas operativas y análisis riguroso de condiciones generales sin recargos.",
  },
  {
    label: "Respaldo",
    title: "Pólizas Certificadas AAA",
    detail: "Garantizamos el pago oportuno estructurando riesgos con las aseguradoras más sólidas.",
  },
  {
    label: "Eficiencia",
    title: "Cotización instantánea",
    detail: "Estimador ágil y preciso integrado en tiempo real con las tarifas oficiales de Fasecolda.",
  },
];

const slide2Specs = [
  {
    label: "Asesoría de Ley",
    title: "Cero costo adicional ($0)",
    detail: "La estructuración técnica es financiada por la aseguradora elegida, sin tocar tu presupuesto.",
  },
  {
    label: "Clasificación",
    title: "Optimización de riesgos",
    detail: "Reclasificamos centros de trabajo incorrectos ante el Ministerio para reducir las tasas vigentes.",
  },
  {
    label: "Soporte Activo",
    title: "Comités COPASST + Higiene",
    detail: "Apoyos directos en planes de prevención, capacitación técnica y auditorías de salud.",
  },
];

export default function App() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isSiniestroOpen, setIsSiniestroOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);
  const [savedRequests, setSavedRequests] = useState<ConsultationRequest[]>([]);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [activeSpecIndex, setActiveSpecIndex] = useState(0);
  const [activeArlSpecIndex, setActiveArlSpecIndex] = useState(0);
  const [autosPlanType, setAutosPlanType] = useState<"full" | "standard">("full");
  const [motosCilindraje, setMotosCilindraje] = useState<"baja" | "alta">("alta");
  const [saludGroupSize, setSaludGroupSize] = useState<number>(15);
  const [arlEmployees, setArlEmployees] = useState<number>(35);
  const [arlRiskClass, setArlRiskClass] = useState<number>(2);
  const [arlAverageSalary, setArlAverageSalary] = useState<number>(1600000);
  const [arlInteractiveTab, setArlInteractiveTab] = useState<"calculator" | "standards">("calculator");
  const [selectedArlBrandId, setSelectedArlBrandId] = useState<string>("sura");
  const [arlCheckedStandards, setArlCheckedStandards] = useState<Record<string, boolean>>({
    std1: true,
    std2: false,
    std3: false,
    std4: false,
  });

  // New interactive quotation states for the 4 slides
  const [heroVehicleType, setHeroVehicleType] = useState<"carro" | "moto">("carro");
  const [heroVehicleInfo, setHeroVehicleInfo] = useState("");
  const [heroVehiclePhone, setHeroVehiclePhone] = useState("");
  const [heroVehiclePlan, setHeroVehiclePlan] = useState("premium");
  const [heroVehicleResult, setHeroVehicleResult] = useState<string | null>(null);

  const [heroBusinessName, setHeroBusinessName] = useState("");
  const [heroBusinessSector, setHeroBusinessSector] = useState("comercio");
  const [heroBusinessEmail, setHeroBusinessEmail] = useState("");
  const [heroBusinessPhone, setHeroBusinessPhone] = useState("");
  const [heroBusinessResult, setHeroBusinessResult] = useState<boolean>(false);

  const [heroHealthUsers, setHeroHealthUsers] = useState(10);
  const [heroHealthPhone, setHeroHealthPhone] = useState("");
  const [heroHealthResult, setHeroHealthResult] = useState<boolean>(false);

  const handleHeroNext = () => {
    setCurrentHeroSlide((prev) => (prev === 0 ? 1 : (prev === 4 ? 1 : prev + 1)));
  };
  const handleHeroPrev = () => {
    setCurrentHeroSlide((prev) => (prev === 0 ? 4 : (prev === 1 ? 4 : prev - 1)));
  };

  const handleScrollToContact = () => {
    setIsWizardOpen(false);
    const element = document.getElementById("contacto");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        const input = element.querySelector("input[type='email']");
        if (input) {
          (input as HTMLInputElement).focus();
        }
      }, 850);
    }
  };

  const triggerQuote = (type: "autos" | "motos" | "salud" | "arl" | string) => {
    if (type === "autos" || type === "motos" || type === "vehiculos") {
      if (type === "motos") setHeroVehicleType("moto");
      else setHeroVehicleType("carro");
      setCurrentHeroSlide(1);
    } else if (type === "empresarial" || type === "multirriesgo" || type === "rce") {
      setCurrentHeroSlide(2);
    } else if (type === "salud") {
      setCurrentHeroSlide(3);
    } else if (type === "arl") {
      setCurrentHeroSlide(4);
    }
    // Scroll smoothly to top of main/hero area
    const heroEl = document.querySelector("main");
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Load from local storage
  useEffect(() => {
    const localData = localStorage.getItem("conseguros_requests");
    if (localData) {
      try {
        setSavedRequests(JSON.parse(localData));
      } catch (e) {
        console.error("No se pudo cargar consultas de localStorage", e);
      }
    }
  }, []);

  // Auto-rotación deshabilitada - el usuario cambia con el click

  // Save consultation helper
  const handleSaveRequest = (req: ConsultationRequest) => {
    const updated = [req, ...savedRequests];
    setSavedRequests(updated);
    localStorage.setItem("conseguros_requests", JSON.stringify(updated));
  };

  const handleClearRequests = () => {
    setSavedRequests([]);
    localStorage.removeItem("conseguros_requests");
  };

  const handleRemoveRequest = (id: string) => {
    const filtered = savedRequests.filter((item) => item.id !== id);
    setSavedRequests(filtered);
    localStorage.setItem("conseguros_requests", JSON.stringify(filtered));
  };

  return (
    <div className="min-h-screen bg-white font-sans text-brand-dark flex flex-col justify-between selection:bg-brand-blue selection:text-white antialiased">
      
      {/* 1. Header Toolbar */}
      <Navbar 
        onOpenWizard={handleScrollToContact} 
        onSaveConsultation={handleSaveRequest} 
        onOpenSiniestro={() => setIsSiniestroOpen(true)}
      />

      {/* 2. Hero Presentation Area */}
      <main className={`relative bg-white ${currentHeroSlide === 0 ? "overflow-visible" : "overflow-hidden px-4 sm:px-8 md:px-16 h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] min-h-[620px] flex flex-col justify-between pt-4 pb-20 md:pb-24"}`}>
        {/* Kinetic WebGL background backdrop */}
        {currentHeroSlide !== 0 && (
          <HeroWebGLBackground activeSlide={currentHeroSlide} />
        )}

        {/* Ambient overlay wrapper with dark gradient mask */}
        {currentHeroSlide !== 0 && (
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60 pointer-events-none z-0" />
        )}

        <div className={`relative z-10 w-full ${currentHeroSlide === 0 ? "" : "flex-1 flex items-center"}`}>
          <AnimatePresence mode="wait">
            {currentHeroSlide === 0 && (
              <motion.div
                key="slide-welcome"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                className="w-full"
              >
                <HeroSlideWelcome
                  onSelectSlide={(index) => setCurrentHeroSlide(index)}
                  onScrollToContact={handleScrollToContact}
                />
              </motion.div>
            )}

            {currentHeroSlide === 1 && (
              <motion.div
                key="slide-vehicles"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                className="w-full"
              >
                <HeroSlideVehicles
                  onBack={() => setCurrentHeroSlide(0)}
                  onSaveRequest={handleSaveRequest}
                />
              </motion.div>
            )}

            {currentHeroSlide === 2 && (
              <motion.div
                key="slide-business"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                className="w-full"
              >
                <HeroSlideBusiness
                  onBack={() => setCurrentHeroSlide(0)}
                  onSaveRequest={handleSaveRequest}
                />
              </motion.div>
            )}

            {currentHeroSlide === 3 && (
              <motion.div
                key="slide-health"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                className="w-full"
              >
                <HeroSlideHealth
                  onBack={() => setCurrentHeroSlide(0)}
                  onSaveRequest={handleSaveRequest}
                />
              </motion.div>
            )}

            {currentHeroSlide === 4 && (
              <motion.div
                key="slide-arl"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                className="w-full"
              >
                <HeroSlideARL
                  onBack={() => setCurrentHeroSlide(0)}
                  onSaveRequest={handleSaveRequest}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Dot & Text Indicators - Only show when NOT on slide 0 */}
        {currentHeroSlide !== 0 && (
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center mt-4 md:mt-6 gap-6 md:gap-10 relative z-10 border-t border-white/10 pt-4 w-full">
            <div className="flex flex-wrap items-center gap-3 md:gap-4 justify-center">
              {/* Opción de Volver al Inicio */}
              <button
                onClick={() => setCurrentHeroSlide(0)}
                className="py-2.5 px-5 rounded-full flex items-center space-x-2 transition-all cursor-pointer text-xs md:text-sm text-brand-blue hover:text-white font-bold bg-blue-500/10 hover:bg-brand-blue/30 border border-brand-blue/30 shadow-lg shadow-blue-500/5 hover:scale-102"
              >
                <span className="text-xs font-black text-brand-blue">← 01</span>
                <span>Inicio</span>
              </button>

              {[
                { id: 1, tag: "02", name: "Carro & Moto", icon: Car, bg: "hover:border-emerald-500/30 hover:bg-emerald-500/5", textColor: "hover:text-emerald-400" },
                { id: 2, tag: "03", name: "Empresarial", icon: Building2, bg: "hover:border-blue-500/30 hover:bg-blue-500/5", textColor: "hover:text-blue-400" },
                { id: 3, tag: "04", name: "Salud", icon: HeartPulse, bg: "hover:border-teal-500/30 hover:bg-teal-500/5", textColor: "hover:text-teal-400" },
                { id: 4, tag: "05", name: "ARL", icon: ShieldCheck, bg: "hover:border-indigo-500/30 hover:bg-indigo-500/5", textColor: "hover:text-indigo-400" }
              ].filter((slide) => slide.id !== currentHeroSlide).map((slide) => {
                const IconComponent = slide.icon;
                return (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentHeroSlide(slide.id)}
                    className={`py-2 px-4 rounded-2xl flex items-center space-x-3 transition-all cursor-pointer text-xs md:text-sm text-slate-300 font-semibold bg-slate-900/40 border border-white/5 ${slide.bg} ${slide.textColor} hover:scale-102`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] font-black text-slate-500 block leading-none mb-0.5">{slide.tag}</span>
                      <span className="font-bold">{slide.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex space-x-2.5 justify-center">
              <button
                onClick={handleHeroPrev}
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
                aria-label="Presentación anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleHeroNext}
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
                aria-label="Siguiente presentación"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Elegantes Olas al Final del Hero (Estilo Footer) */}
        {currentHeroSlide !== 0 && (
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] select-none pointer-events-none z-20">
            <svg className="relative block w-[calc(100%+1.3px)] h-[40px] md:h-[64px]" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              {/* Soft background wave layer */}
              <path 
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3v80H0V0C26.9,8.75,53.05,22,79.54,34c61.64,28,125,51.34,198.85,58.33A516.86,516.86,0,0,0,321.39,56.44Z" 
                className="fill-[#121ccf]/10"
              ></path>
              {/* Front main wave layer */}
              <path 
                d="M985.66,92.83C906.67,72,823.78,31,743.84,15.61c-82.26-15.65-168.13-14.64-250.45.39-57.84,11.73-114,31.07-172,41.86A516.86,516.86,0,0,1,0,34V120H1200V95.83C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
                className="fill-[#121ccf]"
              ></path>
            </svg>
          </div>
        )}
      </main>



      {/* 4. "Why Choose Us" section with statistical numeric metrics */}
      <section className="px-8 md:px-16 bg-white pt-10 md:pt-14 lg:pt-16 pb-16 md:pb-20 lg:pb-24" id="nosotros">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 items-center gap-16 lg:gap-32 mb-16 md:mb-20">
            
            {/* Left Column Content */}
            <div className="text-left flex flex-col justify-center">
              <span className="text-brand-blue font-extrabold text-[11px] md:text-xs tracking-[0.25em] uppercase block mb-4">
                ¿QUIÉNES SOMOS?
              </span>
              <h2 className="font-light text-gray-900 mb-10 text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight lg:tracking-tighter">
                ¿Por qué <span className="block font-extrabold text-[#0F1740] mt-1">escogernos?</span>
              </h2>
              <p className="text-gray-500 text-lg md:text-xl leading-relaxed font-semibold mb-10">
                Trabajamos cada día para acompañar a las medianas empresas de Colombia en la gestión de sus seguros y servicios relacionados de forma integral.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center font-black text-sm shrink-0 mr-4 mt-1 shadow-2xs">✓</div>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed"><strong className="text-gray-800 block mb-0.5 text-base font-bold">Transparencia Total:</strong> Sin costos imprevistos u ocultos. Conoce al instante el desglose exacto de tus primas de seguros en un clic.</p>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center font-black text-sm shrink-0 mr-4 mt-1 shadow-2xs">✓</div>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed"><strong className="text-gray-800 block mb-0.5 text-base font-bold">Cercanía y Acompañamiento:</strong> Olvídate de los contestadores y llamadas interminables en espera. Respuesta directa y priorizada por nuestro equipo.</p>
                </div>
              </div>
            </div>

            {/* Right Side Illustration */}
            <div className="flex justify-center items-center">
              <div className="relative max-w-4xl w-full flex justify-center">
                <div className="absolute -top-4 right-4 bg-white/90 px-4.5 py-2.5 rounded-full text-xs font-bold text-brand-blue tracking-wide border border-[#121ccf]/10 shadow-3xs flex items-center z-10 backdrop-blur-xs">
                  <Sparkles className="w-4.5 h-4.5 mr-2" />
                  Valores Conseguros
                </div>
                <img
                  alt="Nuestros valores"
                  referrerPolicy="no-referrer"
                  className="max-w-4xl w-full h-auto object-contain select-none drop-shadow-md transition-transform hover:scale-[1.02] duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAa3WsT5q8FymJv29-q8h2LM-eCDqKHS5jnnWsTfacPKcyH1PAm1IYGrfM8L41RKIXUvWPd0EwALYj4lAvYxb-KzkjUsT3F2yHSfTOXEoCiJwdUMWgnqbLsj8pMJP_SLZwR2YPszH-OI1lgZ73dOYgeeHpT_nrktHfNhSmXMhBOH-CFP8qJGs5yASLJzltSm59s1xyluL4-u3fB3AD0tgNdZsASEXfDuLKPOY9Sac1zBgRjmpmooyPynOEsx5dfYhVdIydAwR3E7IE"
                />
              </div>
            </div>

          </div>

          {/* Core Numerical Stats counters */}
          <div className="mt-32 mb-16 text-center">
            <span className="text-brand-blue font-extrabold tracking-[0.25em] text-xs md:text-sm uppercase block mb-3">
              Nuestra Trayectoria en Cifras
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-[#0f1740] tracking-tight max-w-2xl mx-auto leading-tight">
              Resultados reales de un equipo comprometido con tu tranquilidad
            </h3>
            <p className="text-xs md:text-sm text-gray-500 max-w-xl mx-auto mt-3 leading-relaxed">
              La experiencia acumulada y la satisfacción de nuestros asegurados respaldan la excelencia e integridad de cada una de nuestras asesorías.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 text-center">
            
            <motion.div 
              whileHover={{ scale: 1.03 }} 
              className="space-y-2 py-4 md:py-6 transition-all duration-300"
            >
              <div className="text-7xl md:text-8xl lg:text-9xl font-black text-brand-blue tracking-tighter">
                +35
              </div>
              <div className="text-slate-600 font-extrabold uppercase tracking-[0.2em] text-xs md:text-sm">
                Años de experiencia
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="space-y-2 py-4 md:py-6 transition-all duration-300"
            >
              <div className="text-7xl md:text-8xl lg:text-9xl font-black text-[#0f1740] tracking-tighter">
                57
              </div>
              <div className="text-slate-600 font-extrabold uppercase tracking-[0.2em] text-xs md:text-sm">
                Clientes felices
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="space-y-2 py-4 md:py-6 transition-all duration-300"
            >
              <div className="text-7xl md:text-8xl lg:text-9xl font-black text-[#FF8A65] tracking-tighter">
                +84
              </div>
              <div className="text-slate-600 font-extrabold uppercase tracking-[0.2em] text-xs md:text-sm">
                Procesos exitosos
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 4.5 "Nuestros Servicios de Cobertura" Section */}
      <section className="py-16 md:py-20 lg:py-24 px-8 md:px-16 bg-white" id="nuestros-servicios">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="text-brand-blue font-extrabold tracking-[0.25em] text-sm md:text-base uppercase block mb-4">
              NUESTRAS COBERTURAS
            </span>
            <h2 className="text-5xl md:text-6xl font-extrabold text-[#0F1740] mb-6 tracking-tight">
              Soluciones Integrales para proteger tu operación
            </h2>
            <p className="text-gray-500 max-w-3xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
              Nos especializamos en blindar cada pilar de tu mediana empresa en Colombia. Analizamos e interactuamos directamente con las mejores coberturas del mercado.
            </p>
          </div>

          {/* Services Accordion Container */}
          <div className="services-accordion-container mb-16">
            {SERVICES_DATA.map((srv) => {
              const IconComponent = srv.icon;
              const imgUrl = SERVICE_IMAGES[srv.id] || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800";
              
              return (
                <div 
                  key={srv.id}
                  onClick={() => setSelectedService(srv)}
                  className="service-accordion-card group"
                >
                  {/* Background Image */}
                  <img 
                    src={imgUrl} 
                    alt={srv.name} 
                    className="service-accordion-img animate-shimmer"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  {/* Vertical Collapsed Title (Only visible when NOT hovered on desktop) */}
                  <div className="service-accordion-collapsed-title">
                    {srv.badgeText}
                  </div>

                  {/* Floating Center Badge / Icon */}
                  <div className="service-accordion-center-badge">
                    <IconComponent className="w-8 h-8 md:w-11 md:h-11" />
                  </div>

                  {/* Content (slides up and becomes visible on hover) */}
                  <div className="service-accordion-content w-full bg-gradient-to-t from-slate-950 via-[#0F1740]/90 to-transparent pt-12 text-white">
                    <span className="inline-block bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-3">
                      {srv.badgeText}
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-white mb-2 leading-tight drop-shadow-sm">
                      {srv.name}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-4 max-w-md line-clamp-3 md:line-clamp-none">
                      {srv.shortDesc}
                    </p>
                    
                    {/* Tiny visual list of items for desktop only */}
                    <div className="hidden md:block mb-5">
                      <ul className="space-y-1.5">
                        {srv.details.coverage.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-center text-xs text-slate-200">
                            <span className="w-1 h-1 rounded-full bg-brand-blue mr-2 shrink-0 animate-pulse" />
                            <span className="truncate">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedService(srv);
                      }}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-brand-dark hover:bg-slate-100 hover:text-brand-blue font-extrabold text-xs transition-all pointer-events-auto cursor-pointer"
                    >
                      <span>Ver detalles de póliza</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Extra Promo Wizard Card as a beautiful ribbon banner */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-8 rounded-[2.5rem] border border-dashed border-blue-200 bg-blue-50/20 hover:border-brand-blue hover:shadow-xl hover:shadow-blue-50/30 transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
              <div className="w-14 h-14 rounded-2xl bg-brand-blue text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-100 animate-pulse">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0F1740] mb-1">¿Necesitas asesoría altamente especializada?</h3>
                <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                  ¿Tienes riesgos complejos o condiciones no estándar? Realicemos una simulación interactiva completa de tus necesidades específicas para guiarte de forma personalizada.
                </p>
              </div>
            </div>
            <button 
              onClick={handleScrollToContact}
              className="px-6 py-4 rounded-full bg-brand-blue hover:bg-blue-800 text-white text-xs font-extrabold transition-all shadow-md shadow-blue-200 cursor-pointer shrink-0"
            >
              Comenzar Asistente de Seguros
            </button>
          </motion.div>

        </div>
      </section>

      {/* 5. "Cotiza" Section with Dynamic Premium Calculator */}
      <section className="py-20 md:py-24 px-8 md:px-16 bg-slate-50/70 relative overflow-hidden" id="cotizar">
        {/* Elegante Divisor Curvo Superior */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] select-none pointer-events-none transform rotate-180 z-20">
          <svg className="relative block w-[calc(100%+1.3px)] h-[40px] md:h-[64px]" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3v80H0V0C26.9,8.75,53.05,22,79.54,34c61.64,28,125,51.34,198.85,58.33A516.86,516.86,0,0,0,321.39,56.44Z" 
              className="fill-white"
            ></path>
          </svg>
        </div>

        {/* Elegante Divisor Curvo Inferior */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] select-none pointer-events-none z-20">
          <svg className="relative block w-[calc(100%+1.3px)] h-[40px] md:h-[64px]" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3v80H0V0C26.9,8.75,53.05,22,79.54,34c61.64,28,125,51.34,198.85,58.33A516.86,516.86,0,0,0,321.39,56.44Z" 
              className="fill-white"
            ></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="text-center mb-12">
            <span className="text-brand-blue font-extrabold tracking-[0.25em] text-sm md:text-base uppercase block mb-4">
              PRODUCTOS COMPETITIVOS
            </span>
            <h2 className="text-5xl md:text-6xl font-extrabold text-[#0F1740] mb-6 tracking-tight">
              Diseña la cobertura ideal para tu empresa
            </h2>
            <p className="text-gray-500 max-w-3xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
              Ajusta tus parámetros operativos para obtener una estimación inmediata. Nuestro cotizador te filtra deducibles óptimos de manera proactiva.
            </p>
          </div>

          {/* Interactive Calculator Block */}
          <EstimatorCalculator onSaveConsultation={handleSaveRequest} />

        </div>
      </section>

      {/* 6. "Proceso" section containing Steps and Modal Details drawer */}
      <ProcessSection />

      {/* 7 & 8. Unified FAQ & Contact section */}
      <QuestionsAndContactSection onSaveConsultation={handleSaveRequest} />

      {/* 9. Branded Footer */}
      <footer className="bg-brand-blue py-16 px-8 md:px-16 text-white border-t border-[#1b25cd]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
          
          {/* Col 1: Logo & Tagline (takes 5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center md:items-start select-none">
            <img 
              src="/images/conegurosSinFondo.png" 
              alt="Conseguros" 
              className="h-16 md:h-22 w-auto object-contain brightness-0 invert transition-transform hover:scale-[1.01]" 
              referrerPolicy="no-referrer" 
            />
            <p className="mt-4 text-sm text-blue-200/80 font-medium max-w-sm text-center md:text-left leading-relaxed">
              Soluciones integrales de seguros para blindar cada pilar de tu mediana empresa en Colombia. Protectores de tu tranquilidad y continuidad operacional.
            </p>
          </div>

          {/* Col 2: Enlaces Rápidos (takes 3 cols) */}
          <div className="md:col-span-3 flex flex-col items-center md:items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200/60 mb-4 select-none">
              Navegación
            </span>
            <ul className="space-y-3 text-sm text-blue-100 font-semibold text-center md:text-left">
              <li>
                <button onClick={() => {
                  const el = document.getElementById("cotizar");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }} className="hover:text-white transition-colors cursor-pointer">
                  Cotiza Tu Seguro
                </button>
              </li>
              <li>
                <button onClick={() => {
                  const el = document.getElementById("nuestros-servicios");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }} className="hover:text-white transition-colors cursor-pointer">
                  Servicios y Coberturas
                </button>
              </li>
              <li>
                <button onClick={() => {
                  const el = document.getElementById("proceso");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }} className="hover:text-white transition-colors cursor-pointer">
                  Nuestro Proceso
                </button>
              </li>
              <li>
                <button onClick={() => {
                  const el = document.getElementById("nosotros");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }} className="hover:text-white transition-colors cursor-pointer">
                  Conócenos
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Socials / Location info (takes 4 cols) */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200/60 mb-4 select-none">
              Contacto y Redes
            </span>
            <div className="flex space-x-4 mb-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/20 hover:border-white hover:bg-white/10 text-white flex items-center justify-center transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/20 hover:border-white hover:bg-white/10 text-white flex items-center justify-center transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/20 hover:border-white hover:bg-white/10 text-white flex items-center justify-center transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
            <div className="text-xs text-blue-100 font-semibold space-y-1.5 text-center md:text-left">
              <p>📍 AK 15 #88-66, piso 2, Bogotá, Col</p>
              <p>📧 contacto@conseguros.com</p>
            </div>
          </div>

        </div>
        
        <div className="max-w-7xl mx-auto border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-blue-200/70 font-semibold space-y-2 sm:space-y-0">
          <div>
            &copy; {new Date().getFullYear()} Conseguros S.A.S. Todos los derechos reservados. Supervigilado por la Superintendencia Financiera de Colombia.
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition-colors">Términos del Servicio</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Tratamiento de Datos</a>
          </div>
        </div>
      </footer>



      {/* 11. Multi-Step Advisor Wizard dialog */}
      <AnimatePresence>
        {isWizardOpen && (
          <WizardModal
            isOpen={isWizardOpen}
            onClose={() => setIsWizardOpen(false)}
            onSaveConsultation={handleSaveRequest}
          />
        )}
      </AnimatePresence>

      {/* 12. Claims / Incidents Emergency Center Modal */}
      <AnimatePresence>
        {isSiniestroOpen && (
          <SiniestroModal
            isOpen={isSiniestroOpen}
            onClose={() => setIsSiniestroOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 13. Service Details Modal */}
      <AnimatePresence>
        {selectedService && (
          <ServiceDetailsModal
            isOpen={!!selectedService}
            onClose={() => setSelectedService(null)}
            service={selectedService}
            onSaveConsultation={handleSaveRequest}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
