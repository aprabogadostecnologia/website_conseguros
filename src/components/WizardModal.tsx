import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle, Shield, Building2, Users2, AlertTriangle, ArrowRight, ArrowLeft } from "lucide-react";
import { ConsultationRequest } from "../types";

interface WizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveConsultation: (req: ConsultationRequest) => void;
}

export default function WizardModal({ isOpen, onClose, onSaveConsultation }: WizardModalProps) {
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [riskConcern, setRiskConcern] = useState("sst");
  const [size, setSize] = useState("mediana");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form errors
  const [errorEmail, setErrorEmail] = useState("");
  const [errorComp, setErrorComp] = useState("");

  const validateStep1 = () => {
    let valid = true;
    if (!companyName.trim()) {
      setErrorComp("El nombre de la empresa es requerido");
      valid = false;
    } else {
      setErrorComp("");
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorEmail("Ingresa un correo electrónico válido");
      valid = false;
    } else {
      setErrorEmail("");
    }

    return valid;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateStep1()) return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    const newRequest: ConsultationRequest = {
      id: "REQ-" + Math.floor(1000 + Math.random() * 9000),
      email: email.trim(),
      timestamp: new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }),
      status: "pending",
      companySize: size.charAt(0).toUpperCase() + size.slice(1),
      riskCategory: getRiskTitle(riskConcern),
      notes: `Diagnóstico automático: Empresa ${companyName}. Preocupación principal: ${getRiskTitle(riskConcern)}.`,
    };

    onSaveConsultation(newRequest);
    setIsSubmitted(true);
  };

  const getRiskTitle = (id: string) => {
    switch (id) {
      case "sst":
        return "SST & Salud Ocupacional";
      case "legal":
        return "Responsabilidad Civil & Legal";
      case "active":
        return "Activos, Incendio & Robo";
      case "cyber":
        return "Ciberseguridad & Datos";
      default:
        return "SST & Salud Ocupacional";
    }
  };

  const handleReset = () => {
    setStep(1);
    setCompanyName("");
    setEmail("");
    setRiskConcern("sst");
    setSize("mediana");
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#070b24]/60 backdrop-blur-md"
      />

      {/* Main modal container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: "spring", duration: 0.55 }}
        className="bg-white rounded-[2.5rem] w-full max-w-2xl relative overflow-hidden shadow-2xl border border-slate-100 flex flex-col z-10 max-h-[90vh] md:max-h-[85vh]"
      >
        {/* Header decoration */}
        <div className="bg-brand-blue text-white px-8 py-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-xs md:text-sm font-bold tracking-widest text-blue-200 uppercase">
            Asesor Virtual Inteligente
          </span>
          <h3 className="text-2xl font-bold tracking-tight">Análisis de Riesgo Proactivo</h3>
          <p className="text-white/80 text-sm mt-1.5">
            Diseñamos y preparamos tu perfil comercial para filtrar tu portafolio ideal en 48 horas.
          </p>
        </div>

        {/* Steps tracker */}
        {!isSubmitted && (
          <div className="flex items-center justify-between px-8 py-4 bg-gray-50 border-b border-gray-100 text-sm shrink-0">
            <span className="text-gray-500">Paso {step} de 4</span>
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    step >= i ? "w-6 bg-brand-blue" : "w-2 bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Dynamic content screen */}
        <div className="p-8 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">¡Analizando tu entorno!</h4>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Hemos generado tu perfil proactivo para <strong>{companyName}</strong>. Un asesor experto se pondrá en contacto contigo en <strong>{email}</strong> con la comparativa del <strong>Top 3 de Colombia</strong>.
                </p>
                <div className="p-4 bg-slate-50 rounded-2xl max-w-sm mx-auto text-left border border-slate-200/60 mb-8 space-y-2">
                  <div className="text-sm text-gray-400 font-bold uppercase tracking-wide">Resumen del Perfil</div>
                  <div className="text-sm"><span className="text-gray-500 font-mono">Empresa:</span> <span className="font-semibold text-gray-800">{companyName}</span></div>
                  <div className="text-sm"><span className="text-gray-500 font-mono">Escala:</span> <span className="font-semibold text-gray-800">{size.charAt(0).toUpperCase() + size.slice(1)} Empresa</span></div>
                  <div className="text-sm"><span className="text-gray-500 font-mono">Foco de Riesgo:</span> <span className="font-semibold text-gray-800">{getRiskTitle(riskConcern)}</span></div>
                </div>
                <button
                  onClick={handleReset}
                  className="bg-brand-blue hover:bg-blue-800 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-blue-200 cursor-pointer"
                >
                  Entendido
                </button>
              </motion.div>
            ) : (
              <div className="min-h-[220px]">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h4 className="text-lg font-bold text-gray-900 mb-1">Comencemos por lo básico</h4>
                    <p className="text-sm text-gray-505 mb-4">Ingresa los datos para que podamos asignar el especialista adecuado a tu sector comercial.</p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Nombre de la Empresa</label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => {
                            setCompanyName(e.target.value);
                            setErrorComp("");
                          }}
                          placeholder="Ej. Mi Compañía S.A.S."
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue font-medium transition-colors"
                        />
                        {errorComp && <p className="text-sm text-rose-500 mt-1">{errorComp}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Correo Corporativo</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setErrorEmail("");
                          }}
                          placeholder="contacto@empresa.com"
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue font-medium transition-colors"
                        />
                        {errorEmail && <p className="text-sm text-rose-500 mt-1">{errorEmail}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h4 className="text-lg font-bold text-gray-900 mb-1">¿Cuál es tu mayor foco de preocupación?</h4>
                    <p className="text-sm text-gray-505 mb-4">Los riesgos varían de acuerdo a tu operación. Elige el primordial:</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: "sst", label: "Salud y Seguridad (SST)", desc: "Exposición a accidentes de colaboradores", icon: Users2 },
                        { id: "legal", label: "Responsabilidad Civil", desc: "Demandas de terceros o clientes", icon: Shield },
                        { id: "active", label: "Activos & Daños", desc: "Incendios, averías mecánicas y robos", icon: Building2 },
                        { id: "cyber", label: "Ciber-Riesgo & Datos", desc: "Pérdida de bases de datos o fraudes", icon: AlertTriangle },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setRiskConcern(item.id)}
                            className={`flex items-start p-4 rounded-2xl border text-left transition-all hover:bg-slate-50 cursor-pointer ${
                              riskConcern === item.id
                                ? "border-brand-blue bg-blue-50/45 ring-1 ring-brand-blue"
                                : "border-gray-200"
                            }`}
                          >
                            <div className={`p-2 rounded-xl mr-3 ${
                              riskConcern === item.id ? "bg-blend-overlay bg-brand-blue text-white" : "bg-slate-100 text-gray-500"
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-gray-900">{item.label}</div>
                              <div className="text-sm text-gray-505 mt-0.5">{item.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h4 className="text-lg font-bold text-gray-900 mb-1">¿Cuál es la escala actual de {companyName}?</h4>
                    <p className="text-sm text-gray-505 mb-4">Nos ayuda a categorizar el volumen e infraestructura para ajustar los deducibles.</p>

                    <div className="space-y-3">
                      {[
                        { id: "micro", label: "Microempresa / Startup", desc: "Menos de 10 colaboradores y operaciones locales sencillas." },
                        { id: "mediana", label: "Mediana Empresa", desc: "Entre 10 y 150 colaboradores. Reclamos logísticos y riesgos laborales moderados." },
                        { id: "corporativo", label: "Corporativo / Industrial", desc: "Más de 150 colaboradores. Operación expandida con altos valores asegurados." },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setSize(item.id)}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all hover:bg-slate-50 cursor-pointer ${
                            size === item.id
                              ? "border-brand-blue bg-blue-50/45 ring-1 ring-brand-blue"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="pr-4">
                            <div className="font-bold text-sm text-gray-900">{item.label}</div>
                            <div className="text-sm text-gray-505 mt-0.5">{item.desc}</div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            size === item.id ? "border-brand-blue bg-brand-blue text-white" : "border-gray-300"
                          }`}>
                            {size === item.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h4 className="text-lg font-bold text-gray-900 mb-1">¡Recomendación Preliminar Listo!</h4>
                    <p className="text-sm text-gray-505">Basado en tus elecciones, esto es lo que Conseguros recomienda para ti:</p>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Nivel de Riesgo Operativo</span>
                        <span className="px-2.5 py-1 text-sm font-extrabold bg-[#FF8A65]/10 text-[#FF8A65] rounded-full">
                          MODERADO - ALTO
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-blue-100 text-brand-blue flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 mr-2">✓</div>
                          <p className="text-sm text-gray-650"><strong className="text-gray-800">Póliza Base Sugerida:</strong> Cobertura Integral de {getRiskTitle(riskConcern)} con deducible preferente para {size} empresa.</p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-blue-100 text-brand-blue flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 mr-2">✓</div>
                          <p className="text-sm text-gray-650"><strong className="text-gray-800">Estrategia Proactiva:</strong> Acompañamiento legal de siniestralidad prioritario (AHORRA hasta un 25% en primas anuales mediante inspecciones físicas preventivas).</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs md:text-sm text-gray-650 leading-relaxed font-semibold">Al hacer clic en "Confirmar y agendar", daremos de alta este perfil comercial y solicitaremos las cotizaciones más competitivas con compañías AAA (Sura, AXA Colpatria, Allianz) de manera totalmente transparente.</p>
                  </motion.div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer controls */}
        {!isSubmitted && (
          <div className="flex items-center justify-between px-8 py-6 bg-slate-50 border-t border-gray-100 rounded-b-[2.5rem] shrink-0">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Atrás
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                onClick={handleNext}
                className="flex items-center bg-brand-blue hover:bg-blue-800 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md shadow-blue-200/50 cursor-pointer"
              >
                Siguiente
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full text-sm font-bold transition-all shadow-lg shadow-emerald-200 cursor-pointer"
              >
                Confirmar y agendar
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
