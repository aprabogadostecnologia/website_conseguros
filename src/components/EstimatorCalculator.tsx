import { useState, FormEvent } from "react";
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
  Info, 
  Calendar,
  FileText,
  Phone,
  HelpCircle,
  TrendingUp,
  Activity,
  Award
} from "lucide-react";
import { ConsultationRequest } from "../types";

interface EstimatorCalculatorProps {
  onSaveConsultation: (req: ConsultationRequest) => void;
}

type QuoteType = "autos" | "motos" | "salud";

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

  const resetLeadForm = () => {
    setClientName("");
    setClientDocumentNumber("");
    setClientPhone("");
    setClientEmail("");
    setAutoPlate("");
    setMotoPlate("");
    setAutoNoPlate(false);
    setMotoNoPlate(false);
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

  const handleSaveAutoQuote = (e: FormEvent) => {
    e.preventDefault();
    if (!clientEmail) return;

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
    if (!clientEmail) return;

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
    if (!clientEmail) return;

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

  return (
    <div className="max-w-6xl mx-auto px-4" id="cotizacion-selection-container">
      
      {/* 3 Main Choice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Autos Card */}
        <motion.div 
          whileHover={{ y: -8 }}
          className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xs hover:border-blue-300 hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300 flex flex-col justify-between"
          id="quote-card-autos"
        >
          <div>
            <div className="w-16 h-16 rounded-[1.3rem] bg-blue-50 text-brand-blue flex items-center justify-center mb-6">
              <Car className="w-8 h-8" />
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-blue-50 text-brand-blue text-xs md:text-sm font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
                Vehículos
              </span>
              <span className="bg-slate-100 text-slate-600 text-xs md:text-sm font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
                Todo Riesgo
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-[#0F1740] mb-3">Seguro de Autos</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Indemnización completa por robo total, daños colaterales de terceros y asistencia de viaje con grúa gratis en todo el territorio colombiano.
            </p>
            
            <div className="border-t border-slate-100 pt-5 space-y-3 mb-8">
              <div className="flex items-center text-xs font-semibold text-gray-600">
                <Check className="w-4 h-4 text-brand-blue mr-2 shrink-0" />
                Deducibles altamente flexibles
              </div>
              <div className="flex items-center text-xs font-semibold text-gray-600">
                <Check className="w-4 h-4 text-brand-blue mr-2 shrink-0" />
                Vehículo de reemplazo por accidente
              </div>
              <div className="flex items-center text-xs font-semibold text-gray-600">
                <Check className="w-4 h-4 text-brand-blue mr-2 shrink-0" />
                Descuentos por no reclamación
              </div>
            </div>
          </div>

          <button
            onClick={() => handleOpenQuoteType("autos")}
            className="w-full bg-brand-blue hover:bg-blue-800 text-white font-extrabold py-4 px-6 rounded-full text-xs transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-blue-100 cursor-pointer"
          >
            <span>Quiero cotizar Autos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Motos Card */}
        <motion.div 
          whileHover={{ y: -8 }}
          className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xs hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-50/50 transition-all duration-300 flex flex-col justify-between"
          id="quote-card-motos"
        >
          <div>
            <div className="w-16 h-16 rounded-[1.3rem] bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
              <Bike className="w-8 h-8" />
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-emerald-50 text-emerald-600 text-xs md:text-sm font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
                Dos Ruedas
              </span>
              <span className="bg-slate-100 text-slate-600 text-xs md:text-sm font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
                Protección 24/7
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-[#0F1740] mb-3">Seguro de Motos</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Respaldamos tu pasión y herramienta de trabajo. Amparo integral contra hurto calificado y daños accidentales a terceros en vías públicas.
            </p>
            
            <div className="border-t border-slate-100 pt-5 space-y-3 mb-8">
              <div className="flex items-center text-xs font-semibold text-gray-600">
                <Check className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                Amparo de robo y pérdida total
              </div>
              <div className="flex items-center text-xs font-semibold text-gray-600">
                <Check className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                Asistencia en carretera y grúa
              </div>
              <div className="flex items-center text-xs font-semibold text-gray-600">
                <Check className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                Gastos médicos urgentes incluidos
              </div>
            </div>
          </div>

          <button
            onClick={() => handleOpenQuoteType("motos")}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 px-6 rounded-full text-xs transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-100 cursor-pointer"
          >
            <span>Quiero cotizar Motos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Salud Card */}
        <motion.div 
          whileHover={{ y: -8 }}
          className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xs hover:border-amber-300 hover:shadow-xl hover:shadow-amber-50/50 transition-all duration-300 flex flex-col justify-between"
          id="quote-card-salud"
        >
          <div>
            <div className="w-16 h-16 rounded-[1.3rem] bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
              <HeartPulse className="w-8 h-8" />
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-amber-50 text-amber-600 text-xs md:text-sm font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
                Bienestar
              </span>
              <span className="bg-slate-100 text-slate-600 text-xs md:text-sm font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
                Prepagada / Póliza
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-[#0F1740] mb-3">Planes de Salud</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Acceso directo e inmediato a la más selecta red de médicos de Colombia, habitación individual hospitalaria y cobertura en urgencias internacionales.
            </p>
            
            <div className="border-t border-slate-100 pt-5 space-y-3 mb-8">
              <div className="flex items-center text-xs font-semibold text-gray-600">
                <Check className="w-4 h-4 text-amber-600 mr-2 shrink-0" />
                Especialistas sin orden médica previa
              </div>
              <div className="flex items-center text-xs font-semibold text-gray-600">
                <Check className="w-4 h-4 text-amber-600 mr-2 shrink-0" />
                Atención preferencial clínicas elite
              </div>
              <div className="flex items-center text-xs font-semibold text-gray-600">
                <Check className="w-4 h-4 text-amber-600 mr-2 shrink-0" />
                Asistencia médica a domicilio 24/7
              </div>
            </div>
          </div>

          <button
            onClick={() => handleOpenQuoteType("salud")}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold py-4 px-6 rounded-full text-xs transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-amber-100 cursor-pointer"
          >
            <span>Quiero cotizar Salud</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

      </div>


      {/* High-Fidelity Emergent Modals Block */}
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
                      activeQuoteType === "autos" ? "bg-blue-50 text-brand-blue" :
                      activeQuoteType === "motos" ? "bg-emerald-50 text-emerald-600" :
                      "bg-amber-50 text-amber-600"
                    }`}>
                      {activeQuoteType === "autos" && <Car className="w-6 h-6" />}
                      {activeQuoteType === "motos" && <Bike className="w-6 h-6" />}
                      {activeQuoteType === "salud" && <HeartPulse className="w-6 h-6" />}
                    </div>
                    <div>
                      <span className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-[#939BB4]">
                        Paso {currentStep} de 2 • {currentStep === 1 ? "Identificación" : "Riesgo Técnico"}
                      </span>
                      <h3 className="text-xl font-black text-[#0F1740]">
                        {activeQuoteType === "autos" && "Seguro de Autos Express"}
                        {activeQuoteType === "motos" && "Seguro de Motos Express"}
                        {activeQuoteType === "salud" && "Planes de Salud Express"}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                    </div>

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
                      disabled={!clientName || !clientDocumentNumber || !clientPhone || !clientEmail || !termsAccepted}
                      onClick={() => setCurrentStep(2)}
                      className={`w-full py-4 rounded-full text-xs font-black text-white transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer ${
                        clientName && clientDocumentNumber && clientPhone && clientEmail && termsAccepted
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
                    
                    {/* AUTOS FORM CONTROLS */}
                    {activeQuoteType === "autos" && (
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
                    {activeQuoteType === "motos" && (
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
                        {activeQuoteType === "autos" && formatCOP(calculateAutoPremium())}
                        {activeQuoteType === "motos" && formatCOP(calculateMotoPremium())}
                        {activeQuoteType === "salud" && formatCOP(calculateSaludPremium())}
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
                            {activeQuoteType === "autos" && "Calculas tarifas del auto ingresando la placa, valor y ciudad de tránsito."}
                            {activeQuoteType === "motos" && "Configuras cilindraje y propósito de uso para optimizar deducciones."}
                            {activeQuoteType === "salud" && "Eliges el nivel de amparo familiar y rangos de edad requeridos."}
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
                      {activeQuoteType === "autos" && (
                        <>
                          <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 shrink-0" /> Tarjeta de Propiedad</li>
                          <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 shrink-0" /> Cédula del tomador legítimo</li>
                          <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 shrink-0" /> Inspección digital (Gratis con App broker)</li>
                        </>
                      )}
                      {activeQuoteType === "motos" && (
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
      </AnimatePresence>

    </div>
  );
}
