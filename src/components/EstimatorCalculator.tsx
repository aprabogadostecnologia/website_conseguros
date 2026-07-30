import { useState, FormEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Car, 
  Bike, 
  HeartPulse, 
  X, 
  Shield, 
  Coins, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Check,
  MapPin,
  Users,
  Calendar,
  FileText,
  Phone,
  HelpCircle,
  Activity,
  Award,
  Building2,
  ShieldCheck
} from "lucide-react";
import { ConsultationRequest } from "../types";
import { SHOW_EMAIL_FIELDS, WHATSAPP_NUMBER } from "../constants";

interface EstimatorCalculatorProps {
  onSaveConsultation: (req: ConsultationRequest) => void;
}

type QuoteType = "vehiculos" | "salud" | "empresarial" | "arl";

export default function EstimatorCalculator({ onSaveConsultation }: EstimatorCalculatorProps) {
  const [activeQuoteType, setActiveQuoteType] = useState<QuoteType | null>(null);
  
  // Paso del formulario multi-etapa
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Datos comunes de Seguro Canguro (Lead capture pre-cotización)
  const [clientName, setClientName] = useState<string>("");
  const [clientDocumentType, setClientDocumentType] = useState<string>("CC");
  const [clientDocumentNumber, setClientDocumentNumber] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);

  // Selector Carro / Moto dentro del modal de vehículos
  const [vehicleKind, setVehicleKind] = useState<"carro" | "moto">("carro");

  // Estados específicos para simulación Autos
  const [autoValue, setAutoValue] = useState<number>(65); // Millions COP
  const [autoYear, setAutoYear] = useState<number>(2023);
  const [autoCity, setAutoCity] = useState<string>("Bogotá");
  const [autoPlate, setAutoPlate] = useState<string>("");
  const [autoNoPlate, setAutoNoPlate] = useState<boolean>(false);
  const [autoSaved, setAutoSaved] = useState<boolean>(false);

  // Estados específicos para simulación Motos
  const [motoDisplacement, setMotoDisplacement] = useState<string>("125-250");
  const [motoYear, setMotoYear] = useState<number>(2022);
  const [motoUse, setMotoUse] = useState<string>("Particular");
  const [motoPlate, setMotoPlate] = useState<string>("");
  const [motoNoPlate, setMotoNoPlate] = useState<boolean>(false);
  const [motoSaved, setMotoSaved] = useState<boolean>(false);

  // Estados específicos para simulación Salud
  const [saludPlan, setSaludPlan] = useState<string>("Integral");
  const [saludInsured, setSaludInsured] = useState<number>(1);
  const [saludAge, setSaludAge] = useState<string>("31-50");
  const [saludSaved, setSaludSaved] = useState<boolean>(false);

  // Estados específicos para simulación Empresarial
  const [empresaSector, setEmpresaSector] = useState<string>("comercio");
  const [empresaAssets, setEmpresaAssets] = useState<number>(300); // Millions COP
  const [empresaEmployees, setEmpresaEmployees] = useState<number>(15);
  const [empresarialSaved, setEmpresarialSaved] = useState<boolean>(false);

  // Estados específicos para simulación ARL (aportes de ley)
  const [arlRiskClass, setArlRiskClass] = useState<number>(2);
  const [arlEmployees, setArlEmployees] = useState<number>(20);
  const [arlSalary, setArlSalary] = useState<number>(1600000);
  const [arlSaved, setArlSaved] = useState<boolean>(false);

  // Tasas ARL de ley en Colombia por clase de riesgo (I a V)
  const arlRates = [0.522, 1.044, 2.436, 4.35, 8.7];

  const empresaSectorLabels: Record<string, string> = {
    comercio: "Comercio / Oficinas",
    fabrica: "Fábrica / Industria",
    servicios: "Servicios Profesionales",
    construccion: "Construcción / Obra Civil",
  };

  // Mazo 3D de selección: cerrado = apilado con profundidad, abierto = lista desplegada
  const [deckOpen, setDeckOpen] = useState<boolean>(false);

  // Transformaciones de cada fila en estado cerrado (efecto baraja con foco fotográfico):
  // el orden visual del mazo queda invertido al del arreglo (la última tarjeta del
  // arreglo -ARL- termina al frente), así que la nitidez crece del índice 0 al 3.
  const deckClosedFx = [
    { transform: "translateZ(-75px) translateY(20px)", opacity: 0.6, filter: "blur(5px)" },
    { transform: "translateZ(0) translateY(0)", opacity: 0.85, filter: "blur(3px)" },
    { transform: "translateZ(65px) translateY(-30px)", opacity: 1, filter: "blur(1.5px)" },
    { transform: "translateZ(125px) translateY(-68px)", opacity: 1, filter: "blur(0)" },
  ];

  const quoteCards: Array<{ type: QuoteType; title: string; desc: string; iconBg: string; accentText: string; icon: ReactNode }> = [
    {
      type: "vehiculos",
      title: "Auto y Moto",
      desc: "Todo riesgo para carro o moto con grúa y asistencia 24/7.",
      iconBg: "bg-blue-50 text-brand-blue",
      accentText: "text-brand-blue",
      icon: (
        <>
          <Car className="w-6 h-6" />
          <Bike className="w-4 h-4 -ml-1" />
        </>
      ),
    },
    {
      type: "salud",
      title: "Planes de Salud",
      desc: "Prepagada y pólizas con la mejor red médica del país.",
      iconBg: "bg-amber-50 text-amber-600",
      accentText: "text-amber-600",
      icon: <HeartPulse className="w-6 h-6" />,
    },
    {
      type: "empresarial",
      title: "Seguro Empresarial",
      desc: "Multirriesgo, RCE y lucro cesante para tu Pyme.",
      iconBg: "bg-violet-50 text-violet-600",
      accentText: "text-violet-600",
      icon: <Building2 className="w-6 h-6" />,
    },
    {
      type: "arl",
      title: "ARL Empresarial",
      desc: "Optimiza tus aportes de ley con intermediación $0.",
      iconBg: "bg-indigo-50 text-indigo-600",
      accentText: "text-indigo-600",
      icon: <ShieldCheck className="w-6 h-6" />,
    },
  ];

  const resetLeadForm = () => {
    setClientName("");
    setClientDocumentNumber("");
    setClientPhone("");
    setClientEmail("");
    setAutoPlate("");
    setMotoPlate("");
    setAutoNoPlate(false);
    setMotoNoPlate(false);
    setVehicleKind("carro");
    setCurrentStep(1);
  };

  const handleOpenQuoteType = (type: QuoteType) => {
    resetLeadForm();
    setActiveQuoteType(type);
    setCurrentStep(1);
  };

  // General Format COP Helper
  const formatCOP = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Calculations for Autos
  const calculateAutoPremium = () => {
    const annualRate = 0.016; // 1.6% of commercial value
    const basePremium = (autoValue * 1000000) * annualRate;
    const ageFactor = autoYear < 2018 ? 1.25 : autoYear < 2022 ? 1.1 : 1.0;
    
    let cityMultiplier = 1.0;
    if (autoCity === "Bogotá") cityMultiplier = 1.18;
    else if (autoCity === "Medellín") cityMultiplier = 1.12;
    else if (autoCity === "Cali") cityMultiplier = 1.15;
    else if (autoCity === "Barranquilla") cityMultiplier = 1.02;
    else cityMultiplier = 0.90;

    return Math.round((basePremium * ageFactor * cityMultiplier) / 12);
  };

  // Calculations for Motos
  const calculateMotoPremium = () => {
    let baseVal = 75000;
    if (motoDisplacement === "less-125") baseVal = 58000;
    else if (motoDisplacement === "125-250") baseVal = 92000;
    else if (motoDisplacement === "251-600") baseVal = 155000;
    else baseVal = 230000;

    const ageFactor = motoYear < 2019 ? 1.2 : motoYear < 2023 ? 1.05 : 1.0;
    const useMultiplier = motoUse === "Trabajo / Delivery" ? 1.35 : 1.0;

    return Math.round(baseVal * ageFactor * useMultiplier);
  };

  // Calculations for Salud
  const calculateSaludPremium = () => {
    let baseVal = 185000;
    if (saludPlan === "Ambulatorio") baseVal = 85000;
    else if (saludPlan === "Integral") baseVal = 195000;
    else baseVal = 370000; // Global Premium

    let ageFactor = 1.0;
    if (saludAge === "less-30") ageFactor = 0.82;
    else if (saludAge === "31-50") ageFactor = 1.0;
    else if (saludAge === "51-65") ageFactor = 1.48;
    else ageFactor = 2.05;

    return Math.round(baseVal * saludInsured * ageFactor);
  };

  // Calculations for Empresarial
  const calculateEmpresarialPremium = () => {
    const sectorFactors: Record<string, number> = {
      comercio: 1.0,
      servicios: 0.88,
      fabrica: 1.35,
      construccion: 1.55,
    };
    const annualRate = 0.0036; // 0.36% of insured assets per year
    const baseMonthly = (empresaAssets * 1000000 * annualRate) / 12;
    const rcePerEmployee = 3500; // RCE component per employee
    return Math.round(baseMonthly * (sectorFactors[empresaSector] ?? 1) + empresaEmployees * rcePerEmployee);
  };

  // Calculations for ARL (aporte obligatorio mensual de ley)
  const calculateArlContribution = () => {
    const rate = arlRates[arlRiskClass - 1] / 100;
    return Math.round(arlSalary * rate * arlEmployees);
  };

  const handleSaveAutoQuote = (e: FormEvent) => {
    e.preventDefault();
    if (SHOW_EMAIL_FIELDS && !clientEmail) return;

    const estimated = calculateAutoPremium();
    const newRequest: ConsultationRequest = {
      id: "AUTO-" + Math.floor(1000 + Math.random() * 9000),
      email: clientEmail,
      timestamp: new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }),
      status: "pending",
      companySize: `Valor: ${autoValue}M COP`,
      riskCategory: "Seguro de Auto - " + (autoNoPlate ? "Sin Placa (Nuevo)" : `Placa: ${autoPlate.toUpperCase()}`),
      notes: `Simulación Autos - Propietario: ${clientName} (${clientDocumentType}: ${clientDocumentNumber}), Celular: ${clientPhone}. Modelo ${autoYear}, Ciudad: ${autoCity}. Prima Estimada: ${formatCOP(estimated)}/mes.`,
    };

    onSaveConsultation(newRequest);
    setAutoSaved(true);
    setTimeout(() => {
      setAutoSaved(false);
      resetLeadForm();
      setActiveQuoteType(null);
    }, 4000);
  };

  const handleSaveMotoQuote = (e: FormEvent) => {
    e.preventDefault();
    if (SHOW_EMAIL_FIELDS && !clientEmail) return;

    const estimated = calculateMotoPremium();
    const newRequest: ConsultationRequest = {
      id: "MOTO-" + Math.floor(1000 + Math.random() * 9000),
      email: clientEmail,
      timestamp: new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }),
      status: "pending",
      companySize: `Cilindraje: ${motoDisplacement}cc`,
      riskCategory: "Seguro de Moto - " + (motoNoPlate ? "Sin Placa (Nueva)" : `Placa: ${motoPlate.toUpperCase()}`),
      notes: `Simulación Motos - Propietario: ${clientName} (${clientDocumentType}: ${clientDocumentNumber}), Celular: ${clientPhone}. Modelo ${motoYear}, Uso: ${motoUse}. Prima Estimada: ${formatCOP(estimated)}/mes.`,
    };

    onSaveConsultation(newRequest);
    setMotoSaved(true);
    setTimeout(() => {
      setMotoSaved(false);
      resetLeadForm();
      setActiveQuoteType(null);
    }, 4000);
  };

  const handleSaveSaludQuote = (e: FormEvent) => {
    e.preventDefault();
    if (SHOW_EMAIL_FIELDS && !clientEmail) return;

    const estimated = calculateSaludPremium();
    const newRequest: ConsultationRequest = {
      id: "HEALTH-" + Math.floor(1000 + Math.random() * 9000),
      email: clientEmail,
      timestamp: new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }),
      status: "pending",
      companySize: `${saludInsured} asegurados`,
      riskCategory: `Salud Colectiva - Plan ${saludPlan}`,
      notes: `Simulación Salud - Tomador: ${clientName} (${clientDocumentType}: ${clientDocumentNumber}), Celular: ${clientPhone}. Rango edad: ${saludAge}. Prima Estimada: ${formatCOP(estimated)}/mes.`,
    };

    onSaveConsultation(newRequest);
    setSaludSaved(true);
    setTimeout(() => {
      setSaludSaved(false);
      resetLeadForm();
      setActiveQuoteType(null);
    }, 4000);
  };

  const handleSaveEmpresarialQuote = (e: FormEvent) => {
    e.preventDefault();
    if (SHOW_EMAIL_FIELDS && !clientEmail) return;

    const estimated = calculateEmpresarialPremium();
    const newRequest: ConsultationRequest = {
      id: "EMP-" + Math.floor(1000 + Math.random() * 9000),
      email: clientEmail,
      timestamp: new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }),
      status: "pending",
      companySize: `${empresaEmployees} empleados / Activos: ${empresaAssets}M COP`,
      riskCategory: `Seguro Empresarial - ${empresaSectorLabels[empresaSector]}`,
      notes: `Simulación Empresarial - Contacto: ${clientName} (${clientDocumentType}: ${clientDocumentNumber}), Celular: ${clientPhone}. Sector: ${empresaSectorLabels[empresaSector]}. Prima Estimada: ${formatCOP(estimated)}/mes.`,
    };

    onSaveConsultation(newRequest);
    setEmpresarialSaved(true);
    setTimeout(() => {
      setEmpresarialSaved(false);
      resetLeadForm();
      setActiveQuoteType(null);
    }, 4000);
  };

  const handleSaveArlQuote = (e: FormEvent) => {
    e.preventDefault();
    if (SHOW_EMAIL_FIELDS && !clientEmail) return;

    const contribution = calculateArlContribution();
    const newRequest: ConsultationRequest = {
      id: "ARL-" + Math.floor(1000 + Math.random() * 9000),
      email: clientEmail,
      timestamp: new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }),
      status: "pending",
      companySize: `${arlEmployees} empleados (Riesgo Clase ${["I", "II", "III", "IV", "V"][arlRiskClass - 1]})`,
      riskCategory: "Intermediación ARL de Ley ($0)",
      notes: `Simulación ARL - Contacto: ${clientName} (${clientDocumentType}: ${clientDocumentNumber}), Celular: ${clientPhone}. Tasa: ${arlRates[arlRiskClass - 1]}%. Aporte mensual estimado: ${formatCOP(contribution)}. Retorno legal en prevención (9.2%): ${formatCOP(Math.round(contribution * 0.092))}/mes.`,
    };

    onSaveConsultation(newRequest);
    setArlSaved(true);
    setTimeout(() => {
      setArlSaved(false);
      resetLeadForm();
      setActiveQuoteType(null);
    }, 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4" id="cotizacion-selection-container">
      
      {/* Mazo 3D de cards compactas: apiladas en reposo, se despliegan al hover o al tocar */}
      <div className="flex flex-col items-center">
        <div
          onMouseEnter={() => setDeckOpen(true)}
          onMouseLeave={() => setDeckOpen(false)}
          className="flex flex-col items-center w-full"
          style={{ perspective: "500px", transformStyle: "preserve-3d", gap: deckOpen ? "20px" : "0px", transition: "gap 500ms" }}
        >
          {quoteCards.map((card, i) => (
            <div
              key={card.type}
              id={`quote-card-${card.type}`}
              onClick={() => (deckOpen ? handleOpenQuoteType(card.type) : setDeckOpen(true))}
              className="w-full max-w-[620px] bg-white rounded-xl border border-gray-100 p-4 shadow-[0_0_12px_rgba(0,0,0,0.16)] flex items-center gap-4 cursor-pointer hover:border-blue-200"
              style={{
                transition: "transform 500ms, opacity 500ms, filter 500ms, border-color 300ms",
                transitionDelay: `${i * 50}ms`,
                ...(deckOpen
                  ? { transform: "translateZ(0) translateY(0)", opacity: 1, filter: "blur(0)" }
                  : deckClosedFx[i]),
              }}
            >
              <div className={`w-14 h-14 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0`}>
                {card.icon}
              </div>
              <div className="flex-1 text-left min-w-0">
                <h3 className="text-base font-extrabold text-[#0F1740] leading-tight">{card.title}</h3>
                <p className="text-xs text-gray-500 font-medium leading-snug mt-1">{card.desc}</p>
              </div>
              <div className={`flex items-center gap-1 text-xs font-black uppercase tracking-wider shrink-0 ${card.accentText}`}>
                <span className="hidden sm:inline">Cotizar</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 font-semibold mt-8 select-none">
          {deckOpen ? "Elige la categoría que quieres cotizar" : "Pasa el cursor o toca el mazo para ver las categorías"}
        </p>
      </div>

      {/* High-Fidelity Emergent Modals Block (portal a body para escapar del stacking context de la sección) */}
      {createPortal(
      <AnimatePresence>
        {activeQuoteType && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveQuoteType(null)}
              className="fixed inset-0 bg-[#070b24]/65 backdrop-blur-md"
              id="quote-modal-backdrop"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.55 }}
              className="bg-white rounded-[2.5rem] w-full max-w-4xl relative overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row z-10"
              id="quote-modal-box"
            >
              
              {/* Close Button top status */}
              <button
                onClick={() => setActiveQuoteType(null)}
                className="absolute top-5 right-5 z-20 bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-full transition-colors cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* 1. Modal Left Side: Form Controls and Calculations */}
              <div className="w-full md:w-7/12 p-8 md:p-10 space-y-6 max-h-[90vh] md:max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-2xl ${
                      activeQuoteType === "vehiculos" ? "bg-blue-50 text-brand-blue" :
                      activeQuoteType === "salud" ? "bg-amber-50 text-amber-600" :
                      activeQuoteType === "empresarial" ? "bg-violet-50 text-violet-600" :
                      "bg-indigo-50 text-indigo-600"
                    }`}>
                      {activeQuoteType === "vehiculos" && (vehicleKind === "carro" ? <Car className="w-6 h-6" /> : <Bike className="w-6 h-6" />)}
                      {activeQuoteType === "salud" && <HeartPulse className="w-6 h-6" />}
                      {activeQuoteType === "empresarial" && <Building2 className="w-6 h-6" />}
                      {activeQuoteType === "arl" && <ShieldCheck className="w-6 h-6" />}
                    </div>
                    <div>
                      <span className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-[#939BB4]">
                        Paso {currentStep} de 2 • {currentStep === 1 ? "Identificación" : "Riesgo Técnico"}
                      </span>
                      <h3 className="text-xl font-black text-[#0F1740]">
                        {activeQuoteType === "vehiculos" && "Seguro de Auto y Moto Express"}
                        {activeQuoteType === "salud" && "Planes de Salud Express"}
                        {activeQuoteType === "empresarial" && "Seguro Empresarial Express"}
                        {activeQuoteType === "arl" && "Intermediación ARL de Ley"}
                      </h3>
                    </div>
                  </div>
                  
                  {currentStep === 2 && (
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1 cursor-pointer transition-all bg-slate-50 hover:bg-slate-100 py-1.5 px-3 rounded-lg border border-slate-100"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Volver</span>
                    </button>
                  )}
                </div>

                {/* PASO 1: CAPTURA DE LEAD (Común para todos) */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="bg-[#eff2ff] border border-blue-100/60 p-4 rounded-2xl flex items-start space-x-2.5">
                      <Sparkles className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                      <span className="text-xs md:text-sm text-brand-blue leading-relaxed font-semibold">
                        <strong>Verificación de Historial:</strong> Requerimos tus datos oficiales para consultar la base nacional Fasecolda en tiempo real y aplicar tus pólizas con descuento.
                      </span>
                    </div>

                    {/* Nombre */}
                    <div className="space-y-1">
                      <label className="text-xs md:text-sm font-black text-gray-700 uppercase tracking-wider block">
                        Nombre Completo del Propietario / Asegurado
                      </label>
                      <input 
                        type="text" 
                        required 
                        value={clientName} 
                        onChange={(e) => setClientName(e.target.value)} 
                        placeholder="Ej. Julian Esteban Rodríguez"
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-brand-blue focus:bg-white focus:ring-1 focus:ring-brand-blue transition-all"
                      />
                    </div>

                    {/* Document Type & Number */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">
                          Documento
                        </label>
                        <select 
                          value={clientDocumentType} 
                          onChange={(e) => setClientDocumentType(e.target.value)}
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-3 py-3 text-xs text-slate-800 outline-none focus:border-brand-blue focus:bg-white focus:ring-1 focus:ring-brand-blue transition-all cursor-pointer font-bold"
                        >
                          <option value="CC">Cédula Ciudadanía</option>
                          <option value="CE">Cédula Extranjería</option>
                          <option value="NIT">NIT Empresa</option>
                          <option value="PP">Pasaporte</option>
                        </select>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-xs md:text-sm font-black text-gray-700 uppercase tracking-wider block">
                          Número de Identificación
                        </label>
                        <input 
                          type="text" 
                          required 
                          value={clientDocumentNumber} 
                          onChange={(e) => setClientDocumentNumber(e.target.value)} 
                          placeholder="Ej. 1018245903"
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-brand-blue focus:bg-white focus:ring-1 focus:ring-brand-blue transition-all"
                        />
                      </div>
                    </div>

                    {/* Celular y Correo en fila */}
                    <div className={`grid grid-cols-1 ${SHOW_EMAIL_FIELDS ? "md:grid-cols-2" : ""} gap-3`}>
                      <div className="space-y-1">
                        <label className="text-xs md:text-sm font-black text-gray-700 uppercase tracking-wider block">
                          Celular de Contacto
                        </label>
                        <input
                          type="tel"
                          required
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="Ej. 3125556789"
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-brand-blue focus:bg-white focus:ring-1 focus:ring-brand-blue transition-all"
                        />
                      </div>
                      {SHOW_EMAIL_FIELDS && (
                        <div className="space-y-1">
                          <label className="text-xs md:text-sm font-black text-gray-700 uppercase tracking-wider block">
                            Correo Electrónico
                          </label>
                          <input
                            type="email"
                            required
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            placeholder="nombre@ejemplo.com"
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-brand-blue focus:bg-white focus:ring-1 focus:ring-brand-blue transition-all"
                          />
                        </div>
                      )}
                    </div>

                    {!SHOW_EMAIL_FIELDS && (
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola Conseguros, estoy cotizando en la página y prefiero continuar por WhatsApp.")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-100"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.156 5.156 0 11.487 0c3.069.001 5.95 1.192 8.113 3.359s3.355 5.047 3.353 8.117c-.003 6.326-5.157 11.482-11.487 11.482-2.001 0-3.971-.521-5.719-1.517L0 24zm6.59-4.846c1.6.95 3.1 1.45 4.881 1.458 5.176 0 9.385-4.207 9.388-9.392.002-2.511-.973-4.87-2.748-6.649-1.776-1.779-4.137-2.757-6.65-2.759-5.176 0-9.386 4.207-9.389 9.393-.001 1.83.493 3.385 1.477 4.966l-.997 3.642 3.738-.981c.001 0 .001 0 0 0zm10.74-6.853c-.3-.15-1.78-.88-2.05-.98-.28-.1-.47-.15-.67.15-.2.3-.77.98-.95 1.18-.18.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.5-1-.89-1.66-2-1.86-2.3-.2-.3-.02-.47.13-.62.14-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.67-1.62-.92-2.22-.25-.6-.5-.52-.67-.53l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.51s1.08 2.92 1.23 3.12c.15.2 2.13 3.25 5.17 4.56.72.31 1.28.5 1.72.64.73.23 1.39.2 1.92.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.08-.13-.28-.2-.58-.35z"/>
                        </svg>
                        <span>Prefiero escribir por WhatsApp</span>
                      </a>
                    )}

                    {/* Habeas Data Checkbox */}
                    <div className="flex items-start space-x-3 pt-2">
                      <input 
                        type="checkbox" 
                        id="terms" 
                        required
                        checked={termsAccepted} 
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-slate-200 text-brand-blue focus:ring-brand-blue cursor-pointer" 
                      />
                      <label htmlFor="terms" className="text-xs md:text-sm text-gray-500 leading-normal block select-none cursor-pointer">
                        Autorizo la consulta obligatoria de mi historial de siniestros, descuentos grupales y acepto la política de Habeas Data según Ley 1581 de Colombia.
                      </label>
                    </div>

                    <button
                      type="button"
                      disabled={!clientName || !clientDocumentNumber || !clientPhone || (SHOW_EMAIL_FIELDS && !clientEmail) || !termsAccepted}
                      onClick={() => setCurrentStep(2)}
                      className={`w-full py-4 rounded-full text-xs font-black text-white transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer ${
                        clientName && clientDocumentNumber && clientPhone && (!SHOW_EMAIL_FIELDS || clientEmail) && termsAccepted
                          ? "bg-brand-blue hover:bg-blue-800 shadow-blue-100"
                          : "bg-slate-300 shadow-none cursor-not-allowed opacity-60"
                      }`}
                    >
                      <span>Ingresar Datos y Continuar</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* PASO 2: DETALLES DEL RIESGO COBERTURA */}
                {currentStep === 2 && (
                  <div className="space-y-5">

                    {/* SELECTOR CARRO / MOTO (solo para vehículos) */}
                    {activeQuoteType === "vehiculos" && (
                      <div>
                        <label className="text-xs md:text-sm font-bold text-gray-700 flex items-center uppercase tracking-wider mb-2">
                          <Shield className="w-3.5 h-3.5 mr-1 text-slate-400" /> ¿Qué vehículo quieres asegurar?
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setVehicleKind("carro")}
                            className={`py-3 px-4 rounded-2xl flex items-center justify-center space-x-2 border transition-all cursor-pointer text-xs font-extrabold ${
                              vehicleKind === "carro"
                                ? "bg-blue-50/60 border-brand-blue text-brand-blue ring-1 ring-brand-blue"
                                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                            }`}
                          >
                            <Car className="w-4.5 h-4.5" />
                            <span>CARRO</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setVehicleKind("moto")}
                            className={`py-3 px-4 rounded-2xl flex items-center justify-center space-x-2 border transition-all cursor-pointer text-xs font-extrabold ${
                              vehicleKind === "moto"
                                ? "bg-emerald-50/60 border-emerald-600 text-emerald-700 ring-1 ring-emerald-600"
                                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                            }`}
                          >
                            <Bike className="w-4.5 h-4.5" />
                            <span>MOTO</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* AUTOS FORM CONTROLS */}
                    {activeQuoteType === "vehiculos" && vehicleKind === "carro" && (
                      <form onSubmit={handleSaveAutoQuote} className="space-y-4">
                        
                        {/* Placa Input Custom Estilo Colombia */}
                        <div>
                          <label className="text-xs md:text-sm font-bold text-gray-700 flex items-center uppercase tracking-wider mb-2">
                            <FileText className="w-3.5 h-3.5 mr-1 text-slate-400" /> Placa del Automóvil
                          </label>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                            {/* Placa Container */}
                            <div className="relative">
                              <input 
                                type="text"
                                maxLength={7}
                                disabled={autoNoPlate}
                                value={autoPlate}
                                onChange={(e) => setAutoPlate(e.target.value.toUpperCase())}
                                placeholder="Escribe tu placa (Ej. MHX457)"
                                className={`w-full pl-12 pr-4 py-4 text-sm font-extrabold tracking-widest text-[#0F1740] placeholder-gray-300 border rounded-2xl outline-none transition-all uppercase ${
                                  autoNoPlate 
                                    ? "bg-slate-100 border-slate-200 text-slate-400" 
                                    : "bg-amber-50/35 border-amber-300 focus:bg-white focus:ring-1 focus:ring-amber-400"
                                }`}
                              />
                              {/* Colombia Flag Styled Badge inside Input */}
                              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex flex-col space-y-[2px] items-center justify-center bg-yellow-400 border border-amber-500 rounded-sm w-6 h-5 overflow-hidden shadow-2xs">
                                <span className="w-full h-1/2 bg-yellow-400" />
                                <span className="w-full h-1/4 bg-blue-600" />
                                <span className="w-full h-1/4 bg-red-600" />
                              </div>
                            </div>

                            {/* No Plate checkbox */}
                            <label className="flex items-center space-x-2.5 p-3.5 border border-slate-100 bg-slate-50/50 rounded-2xl cursor-pointer hover:bg-slate-50 select-none">
                              <input 
                                type="checkbox"
                                checked={autoNoPlate}
                                onChange={(e) => {
                                  setAutoNoPlate(e.target.checked);
                                  if (e.target.checked) setAutoPlate("");
                                }}
                                className="h-4 w-4 text-brand-blue rounded border-slate-200 cursor-pointer"
                              />
                              <div className="text-xs md:text-sm font-bold text-gray-750">
                                Vehículo 0km / Sin placa aún
                              </div>
                            </label>
                          </div>
                        </div>

                        {/* Vehicle Market Value */}
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="text-xs md:text-sm font-bold text-gray-700 flex items-center uppercase tracking-wider">
                              <Coins className="w-3.5 h-3.5 mr-1 text-slate-400" /> Valor Comercial del Auto
                            </label>
                            <span className="bg-slate-100 text-brand-blue px-2.5 py-0.5 text-xs font-black rounded font-mono">
                              {autoValue}M COP
                            </span>
                          </div>
                          <input
                            type="range"
                            min="15"
                            max="250"
                            step="5"
                            value={autoValue}
                            onChange={(e) => setAutoValue(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                          />
                        </div>

                        {/* Model Year Grid Selection */}
                        <div>
                          <label className="text-xs md:text-sm font-bold text-gray-700 flex items-center uppercase tracking-wider mb-2">
                            <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" /> Año / Modelo
                          </label>
                          <div className="grid grid-cols-4 gap-1.5">
                            {[2026, 2024, 2022, 2018].map((year) => (
                              <button
                                type="button"
                                key={year}
                                onClick={() => setAutoYear(year)}
                                className={`py-1.5 px-1 rounded-xl text-xs font-bold transition-all border ${
                                  autoYear === year 
                                    ? "bg-brand-blue border-brand-blue text-white shadow-xs" 
                                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                {year}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* City Selection */}
                        <div>
                          <label className="text-[10px] font-extrabold text-gray-700 flex items-center uppercase tracking-wider mb-2">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> Ciudad de Tránsito (Riesgo Local)
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {["Bogotá", "Medellín", "Calera / Sabana", "Otras"].map((city) => (
                              <button
                                type="button"
                                key={city}
                                onClick={() => setAutoCity(city)}
                                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border text-center ${
                                  autoCity === city 
                                    ? "border-brand-blue bg-blue-50/50 text-brand-blue font-black ring-1 ring-brand-blue" 
                                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                                }`}
                              >
                                {city}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Submit finalized */}
                        <div className="pt-4 border-t border-slate-100">
                          <button
                            type="submit"
                            disabled={autoSaved || (!autoPlate && !autoNoPlate)}
                            className={`w-full py-4 rounded-full text-xs font-extrabold text-white transition-all shadow-md ${
                              autoSaved ? "bg-emerald-600 shadow-emerald-100" : "bg-brand-blue hover:bg-blue-800 shadow-blue-100 disabled:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                            }`}
                          >
                            {autoSaved ? "¡Guardado exitosamente!" : "Generar Comparación y Registrar Propuesta"}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* MOTOS FORM CONTROLS */}
                    {activeQuoteType === "vehiculos" && vehicleKind === "moto" && (
                      <form onSubmit={handleSaveMotoQuote} className="space-y-4">
                        
                        {/* Placa Input Custom Estilo Colombia */}
                        <div>
                          <label className="text-xs md:text-sm font-bold text-gray-700 flex items-center uppercase tracking-wider mb-2">
                            <FileText className="w-3.5 h-3.5 mr-1 text-slate-400" /> Placa de la Moto
                          </label>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                            {/* Placa Container */}
                            <div className="relative">
                              <input 
                                type="text"
                                maxLength={7}
                                disabled={motoNoPlate}
                                value={motoPlate}
                                onChange={(e) => setMotoPlate(e.target.value.toUpperCase())}
                                placeholder="Escribe la placa (Ej. XYZ12D)"
                                className={`w-full pl-12 pr-4 py-4 text-sm font-extrabold tracking-widest text-[#0F1740] placeholder-gray-300 border rounded-2xl outline-none transition-all uppercase ${
                                  motoNoPlate 
                                    ? "bg-slate-100 border-slate-200 text-slate-400" 
                                    : "bg-emerald-50/35 border-emerald-300 focus:bg-white focus:ring-1 focus:ring-emerald-400"
                                }`}
                              />
                              {/* Colombia Flag Styled Badge inside Input */}
                              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex flex-col space-y-[2px] items-center justify-center bg-yellow-400 border border-amber-500 rounded-sm w-6 h-5 overflow-hidden shadow-2xs">
                                <span className="w-full h-1/2 bg-yellow-400" />
                                <span className="w-full h-1/4 bg-blue-600" />
                                <span className="w-full h-1/4 bg-red-600" />
                              </div>
                            </div>

                            {/* No Plate checkbox */}
                            <label className="flex items-center space-x-2.5 p-3.5 border border-slate-100 bg-slate-50/50 rounded-2xl cursor-pointer hover:bg-slate-50 select-none">
                              <input 
                                type="checkbox"
                                checked={motoNoPlate}
                                onChange={(e) => {
                                  setMotoNoPlate(e.target.checked);
                                  if (e.target.checked) setMotoPlate("");
                                }}
                                className="h-4 w-4 text-[#10b981] rounded border-slate-200 cursor-pointer"
                              />
                              <div className="text-xs md:text-sm font-bold text-gray-700">
                                Moto 0km / Sin placa aún
                              </div>
                            </label>
                          </div>
                        </div>

                        {/* Moto Displacement */}
                        <div>
                          <label className="text-xs md:text-sm font-bold text-gray-700 flex items-center uppercase tracking-wider mb-2">
                            <Activity className="w-3.5 h-3.5 mr-1 text-slate-400" /> Cilindraje de la Motocicleta
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: "less-125", label: "Menos de 125 cc", desc: "Scooters / Urbana" },
                              { id: "125-250", label: "125 cc - 250 cc", desc: "Deportiva / Trabajo" },
                              { id: "251-600", label: "251 cc - 600 cc", desc: "Monocilíndrica / Ruta" },
                              { id: "more-600", label: "Más de 600 cc", desc: "Alto cilindraje" }
                            ].map((item) => (
                              <button
                                type="button"
                                key={item.id}
                                onClick={() => setMotoDisplacement(item.id)}
                                className={`p-2.5 rounded-2xl border text-left transition-all ${
                                  motoDisplacement === item.id 
                                    ? "border-emerald-600 bg-emerald-50/20 ring-1 ring-emerald-600" 
                                    : "border-slate-200 hover:bg-slate-50"
                                }`}
                              >
                                <div className="font-extrabold text-xs text-slate-900">{item.label}</div>
                                <div className="text-[10px] text-emerald-600 font-semibold">{item.desc}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Model Year Select */}
                        <div>
                          <label className="text-xs md:text-sm font-bold text-gray-700 flex items-center uppercase tracking-wider mb-2">
                            <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" /> Año Modelo Moto
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[2026, 2024, 2020].map((year) => (
                              <button
                                type="button"
                                key={year}
                                onClick={() => setMotoYear(year)}
                                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border text-center ${
                                  motoYear === year 
                                    ? "bg-emerald-600 text-white border-emerald-600" 
                                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                                }`}
                              >
                                {year}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Usage Selection */}
                        <div>
                          <label className="text-xs md:text-sm font-bold text-gray-700 flex items-center uppercase tracking-wider mb-2">
                            <Shield className="w-3.5 h-3.5 mr-1 text-slate-400" /> Propósito de Uso
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {["Particular", "Trabajo / Delivery"].map((use) => (
                              <button
                                type="button"
                                key={use}
                                onClick={() => setMotoUse(use)}
                                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border text-center ${
                                  motoUse === use 
                                    ? "bg-emerald-50/50 text-emerald-700 border-emerald-600 font-black ring-1 ring-emerald-600" 
                                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                                }`}
                              >
                                {use}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Submit finalized */}
                        <div className="pt-4 border-t border-slate-100">
                          <button
                            type="submit"
                            disabled={motoSaved || (!motoPlate && !motoNoPlate)}
                            className={`w-full py-4 rounded-full text-xs font-extrabold text-white transition-all shadow-md ${
                              motoSaved ? "bg-emerald-600 shadow-emerald-100" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100 disabled:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                            }`}
                          >
                            {motoSaved ? "¡Guardado exitosamente!" : "Generar Comparación y Registrar Propuesta"}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* SALUD FORM CONTROLS */}
                    {activeQuoteType === "salud" && (
                      <form onSubmit={handleSaveSaludQuote} className="space-y-4">
                        {/* Plan selection */}
                        <div>
                          <label className="text-xs md:text-sm font-bold text-gray-700 flex items-center uppercase tracking-wider mb-2">
                            <Award className="w-3.5 h-3.5 mr-1 text-slate-400" /> Categoría del Plan de Salud
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: "Ambulatorio", label: "Ambulatorio", desc: "Consultas" },
                              { id: "Integral", label: "Integral Vip", desc: "Clínicas Elite" },
                              { id: "Global", label: "Global Star", desc: "Cobertura Mundial" }
                            ].map((item) => (
                              <button
                                type="button"
                                key={item.id}
                                onClick={() => setSaludPlan(item.id)}
                                className={`p-2 rounded-2xl border text-left transition-all ${
                                  saludPlan === item.id 
                                    ? "border-amber-500 bg-amber-50/20 ring-1 ring-amber-500" 
                                    : "border-slate-200 hover:bg-slate-50"
                                }`}
                              >
                                <div className="font-extrabold text-xs text-slate-950">{item.label}</div>
                                <div className="text-xs text-amber-700 font-bold">{item.desc}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Insured quantity */}
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="text-xs md:text-sm font-bold text-gray-700 flex items-center uppercase tracking-wider">
                              <Users className="w-3.5 h-3.5 mr-1 text-slate-400" /> Personas a Asegurar
                            </label>
                            <span className="bg-slate-100 text-amber-700 px-2.5 py-0.5 text-xs font-black rounded font-mono">
                              {saludInsured} {saludInsured === 1 ? "persona" : "personas"}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="8"
                            value={saludInsured}
                            onChange={(e) => setSaludInsured(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
                          />
                        </div>

                        {/* Age Bands */}
                        <div>
                          <label className="text-xs md:text-sm font-bold text-gray-700 flex items-center uppercase tracking-wider mb-2">
                             Rango de Edad del Asegurado Principal
                          </label>
                          <div className="grid grid-cols-4 gap-1.5">
                            {[
                              { id: "less-30", label: "< 30 años" },
                              { id: "31-50", label: "31 - 50" },
                              { id: "51-65", label: "51 - 65" },
                              { id: "more-65", label: "> 65 años" }
                            ].map((item) => (
                              <button
                                type="button"
                                key={item.id}
                                onClick={() => setSaludAge(item.id)}
                                className={`py-2 px-1 rounded-xl text-xs font-extrabold transition-all border text-center ${
                                  saludAge === item.id 
                                    ? "bg-amber-600 text-white border-amber-600" 
                                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Submit finalized */}
                        <div className="pt-4 border-t border-slate-100">
                          <button
                            type="submit"
                            disabled={saludSaved}
                            className={`w-full py-4 rounded-full text-xs font-extrabold text-white transition-all shadow-md ${
                              saludSaved ? "bg-emerald-600 shadow-emerald-100" : "bg-amber-600 hover:bg-amber-700 shadow-amber-100"
                            }`}
                          >
                            {saludSaved ? "¡Guardado exitosamente!" : "Generar Comparación y Registrar Propuesta"}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* EMPRESARIAL FORM CONTROLS */}
                    {activeQuoteType === "empresarial" && (
                      <form onSubmit={handleSaveEmpresarialQuote} className="space-y-4">
                        {/* Sector selection */}
                        <div>
                          <label className="text-xs md:text-sm font-bold text-gray-700 flex items-center uppercase tracking-wider mb-2">
                            <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" /> Sector o Actividad Económica
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: "comercio", label: "Comercio / Oficinas", desc: "Locales y bodegas" },
                              { id: "fabrica", label: "Fábrica / Industria", desc: "Manufactura" },
                              { id: "servicios", label: "Servicios", desc: "Consultorías" },
                              { id: "construccion", label: "Construcción", desc: "Obra civil" }
                            ].map((item) => (
                              <button
                                type="button"
                                key={item.id}
                                onClick={() => setEmpresaSector(item.id)}
                                className={`p-2.5 rounded-2xl border text-left transition-all ${
                                  empresaSector === item.id
                                    ? "border-violet-600 bg-violet-50/20 ring-1 ring-violet-600"
                                    : "border-slate-200 hover:bg-slate-50"
                                }`}
                              >
                                <div className="font-extrabold text-xs text-slate-900">{item.label}</div>
                                <div className="text-[10px] text-violet-600 font-semibold">{item.desc}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Insured Assets Value */}
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="text-xs md:text-sm font-bold text-gray-700 flex items-center uppercase tracking-wider">
                              <Coins className="w-3.5 h-3.5 mr-1 text-slate-400" /> Valor de Activos Asegurables
                            </label>
                            <span className="bg-slate-100 text-violet-700 px-2.5 py-0.5 text-xs font-black rounded font-mono">
                              {empresaAssets}M COP
                            </span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="2000"
                            step="50"
                            value={empresaAssets}
                            onChange={(e) => setEmpresaAssets(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-violet-600"
                          />
                        </div>

                        {/* Employees count */}
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="text-xs md:text-sm font-bold text-gray-700 flex items-center uppercase tracking-wider">
                              <Users className="w-3.5 h-3.5 mr-1 text-slate-400" /> Número de Empleados
                            </label>
                            <span className="bg-slate-100 text-violet-700 px-2.5 py-0.5 text-xs font-black rounded font-mono">
                              {empresaEmployees} {empresaEmployees === 1 ? "empleado" : "empleados"}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="500"
                            value={empresaEmployees}
                            onChange={(e) => setEmpresaEmployees(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-violet-600"
                          />
                        </div>

                        {/* Submit finalized */}
                        <div className="pt-4 border-t border-slate-100">
                          <button
                            type="submit"
                            disabled={empresarialSaved}
                            className={`w-full py-4 rounded-full text-xs font-extrabold text-white transition-all shadow-md ${
                              empresarialSaved ? "bg-emerald-600 shadow-emerald-100" : "bg-violet-600 hover:bg-violet-700 shadow-violet-100"
                            }`}
                          >
                            {empresarialSaved ? "¡Guardado exitosamente!" : "Generar Comparación y Registrar Propuesta"}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* ARL FORM CONTROLS */}
                    {activeQuoteType === "arl" && (
                      <form onSubmit={handleSaveArlQuote} className="space-y-4">
                        {/* Risk class selection */}
                        <div>
                          <label className="text-xs md:text-sm font-bold text-gray-700 flex items-center uppercase tracking-wider mb-2">
                            <Shield className="w-3.5 h-3.5 mr-1 text-slate-400" /> Clase de Riesgo de la Actividad
                          </label>
                          <div className="grid grid-cols-5 gap-1.5">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <button
                                type="button"
                                key={level}
                                onClick={() => setArlRiskClass(level)}
                                className={`py-2 px-1 rounded-xl border text-center transition-all ${
                                  arlRiskClass === level
                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <div className="text-xs font-black">{["I", "II", "III", "IV", "V"][level - 1]}</div>
                                <div className={`text-[9px] font-bold mt-0.5 ${arlRiskClass === level ? "text-indigo-200" : "text-indigo-600"}`}>
                                  {arlRates[level - 1]}%
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Employees count */}
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="text-xs md:text-sm font-bold text-gray-700 flex items-center uppercase tracking-wider">
                              <Users className="w-3.5 h-3.5 mr-1 text-slate-400" /> Número de Trabajadores
                            </label>
                            <span className="bg-slate-100 text-indigo-700 px-2.5 py-0.5 text-xs font-black rounded font-mono">
                              {arlEmployees} {arlEmployees === 1 ? "trabajador" : "trabajadores"}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="200"
                            value={arlEmployees}
                            onChange={(e) => setArlEmployees(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>

                        {/* Average salary */}
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="text-xs md:text-sm font-bold text-gray-700 flex items-center uppercase tracking-wider">
                              <Coins className="w-3.5 h-3.5 mr-1 text-slate-400" /> Salario Promedio Mensual
                            </label>
                            <span className="bg-slate-100 text-indigo-700 px-2.5 py-0.5 text-xs font-black rounded font-mono">
                              {formatCOP(arlSalary)}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1300000"
                            max="8000000"
                            step="100000"
                            value={arlSalary}
                            onChange={(e) => setArlSalary(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>

                        {/* Legal return highlight */}
                        <div className="bg-indigo-50/60 border border-indigo-100 p-4 rounded-2xl flex items-start space-x-2.5">
                          <Sparkles className="w-4.5 h-4.5 text-indigo-600 shrink-0 mt-0.5" />
                          <span className="text-xs md:text-sm text-indigo-800 leading-relaxed font-semibold">
                            <strong>Retorno de Prevención (9.2% de ley):</strong> recuperarías aprox.{" "}
                            <strong>{formatCOP(Math.round(calculateArlContribution() * 0.092))}/mes</strong> en capacitaciones y brigadas. Nuestra intermediación te cuesta $0.
                          </span>
                        </div>

                        {/* Submit finalized */}
                        <div className="pt-4 border-t border-slate-100">
                          <button
                            type="submit"
                            disabled={arlSaved}
                            className={`w-full py-4 rounded-full text-xs font-extrabold text-white transition-all shadow-md ${
                              arlSaved ? "bg-emerald-600 shadow-emerald-100" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
                            }`}
                          >
                            {arlSaved ? "¡Guardado exitosamente!" : "Solicitar Auditoría e Intermediación $0"}
                          </button>
                        </div>
                      </form>
                    )}

                  </div>
                )}

              </div>

              {/* 2. Modal Right Side: Estimation and How to Quote instructions */}
              <div className="w-full md:w-5/12 bg-slate-50 p-8 md:p-10 border-l border-slate-100 flex flex-col justify-between max-h-[90vh] md:max-h-[85vh] overflow-y-auto">
                
                <div className="space-y-6">
                  {/* Estimative Price Label */}
                  {currentStep === 1 ? (
                    <div className="bg-white/85 border border-amber-100 p-5 rounded-[1.8rem] space-y-3.5 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest block mb-1">
                          Calculador de Primas
                        </span>
                        <h4 className="text-sm font-black text-[#0F1740] leading-snug">
                          Tarifas bloqueadas temporalmente
                        </h4>
                        <p className="text-xs md:text-sm text-gray-500 mt-1 leading-normal font-medium">
                          Completa el <strong>Paso 1</strong> para habilitar la simulación en tiempo real y comparar las aseguradoras de Colombia disponibles.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest block mb-2">
                        Estimación Oficial Simulada
                      </span>
                      <div className="text-3xl md:text-4xl font-extrabold text-[#0F1740] tracking-tight">
                        {activeQuoteType === "vehiculos" && formatCOP(vehicleKind === "carro" ? calculateAutoPremium() : calculateMotoPremium())}
                        {activeQuoteType === "salud" && formatCOP(calculateSaludPremium())}
                        {activeQuoteType === "empresarial" && formatCOP(calculateEmpresarialPremium())}
                        {activeQuoteType === "arl" && formatCOP(calculateArlContribution())}
                        <span className="text-xs font-semibold text-slate-400"> /mes*</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-normal">
                        *Estimación media sujeta a verificación RUNT e inspección técnica final.
                      </p>
                    </div>
                  )}

                  {/* Section: ¿Cómo cotizar? (Interactive Guide) */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-extrabold text-[#0F1740] uppercase tracking-wider flex items-center border-b border-slate-200/80 pb-2">
                      <HelpCircle className="w-4 h-4 text-slate-500 mr-1.5 shrink-0" />
                      ¿Cómo es el proceso de cotización?
                    </h4>

                    {/* Step Timeline */}
                    <div className="space-y-4 text-sm">
                      
                      {/* Step 1 */}
                      <div className="flex items-start space-x-3">
                        <div className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                          currentStep === 1 ? "bg-brand-blue text-white" : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {currentStep === 1 ? "1" : <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <p className={`font-bold ${currentStep === 1 ? "text-brand-blue" : "text-slate-900"}`}>Ingreso de Identidad</p>
                          <p className="text-slate-500 text-xs md:text-sm leading-tight mt-0.5">
                            Validamos tus datos básicos y habilitamos las consultas oficiales Fasecolda.
                          </p>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="flex items-start space-x-3">
                        <div className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                          currentStep === 2 ? "bg-brand-blue text-white" : "bg-slate-200 text-[#0F1740]"
                        }`}>
                          2
                        </div>
                        <div>
                          <p className={`font-bold ${currentStep === 2 ? "text-brand-blue" : "text-slate-900"}`}>Parámetros del Riesgo</p>
                          <p className="text-slate-500 text-xs md:text-sm leading-tight mt-0.5">
                            {activeQuoteType === "vehiculos" && "Eliges carro o moto e ingresas placa y datos para calcular tu tarifa."}
                            {activeQuoteType === "salud" && "Eliges el nivel de amparo familiar y rangos de edad requeridos."}
                            {activeQuoteType === "empresarial" && "Defines sector, activos y empleados para estructurar tu multirriesgo."}
                            {activeQuoteType === "arl" && "Configuras clase de riesgo y nómina para auditar tus aportes de ley."}
                          </p>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-[#0F1740] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          3
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Cuadro Comparativo Legal</p>
                          <p className="text-slate-500 text-xs md:text-sm leading-tight mt-0.5">
                            Sincronizamos con Sura, Allianz, HDI y AXA Colpatria para enviarte la propuesta hoy.
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Section: Requisitos Requeridos */}
                  <div className="bg-white rounded-2xl p-4.5 border border-slate-200/60 shadow-3xs space-y-2">
                    <h5 className="text-xs font-extrabold text-[#0F1740] uppercase tracking-wider flex items-center">
                      <FileText className="w-3.5 h-3.5 text-slate-500 mr-1.5 shrink-0" />
                      Documentos requeridos más adelante
                    </h5>
                    <ul className="text-xs text-slate-600 space-y-1.5">
                      {activeQuoteType === "vehiculos" && vehicleKind === "carro" && (
                        <>
                          <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 shrink-0" /> Tarjeta de Propiedad</li>
                          <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 shrink-0" /> Cédula del tomador legítimo</li>
                          <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 shrink-0" /> Inspección digital (Gratis con App broker)</li>
                        </>
                      )}
                      {activeQuoteType === "vehiculos" && vehicleKind === "moto" && (
                        <>
                          <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 shrink-0" /> Tarjeta de matrícula oficial</li>
                          <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 shrink-0" /> Cédula de Ciudadanía del conductor</li>
                          <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 shrink-0" /> Inspección física en serviteca autorizada</li>
                        </>
                      )}
                      {activeQuoteType === "salud" && (
                        <>
                          <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 shrink-0" /> Registros civiles de parentesco</li>
                          <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 shrink-0" /> Declaración básica de preexistencias</li>
                          <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 shrink-0" /> Cédulas de beneficiarios mayores</li>
                        </>
                      )}
                      {activeQuoteType === "empresarial" && (
                        <>
                          <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-violet-500 mr-1.5 shrink-0" /> Cámara de Comercio (menor a 30 días)</li>
                          <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-violet-500 mr-1.5 shrink-0" /> RUT actualizado de la empresa</li>
                          <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-violet-500 mr-1.5 shrink-0" /> Relación de activos e inventarios</li>
                        </>
                      )}
                      {activeQuoteType === "arl" && (
                        <>
                          <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5 shrink-0" /> Planilla PILA del último mes</li>
                          <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5 shrink-0" /> Clasificación de actividad económica (CIIU)</li>
                          <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5 shrink-0" /> Certificado de la ARL actual</li>
                        </>
                      )}
                    </ul>
                  </div>

                </div>

                {/* Bottom Assistance Badge */}
                <div className="pt-6 border-t border-slate-200/60 mt-6 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-[#0F1740]">¿Tienes inquietudes?</p>
                    <p className="text-slate-500">Atención WhatsApp 24/7 en Colombia</p>
                  </div>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body)}

    </div>
  );
}
