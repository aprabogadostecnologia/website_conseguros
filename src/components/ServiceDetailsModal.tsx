import { FormEvent, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Building2, 
  Scale, 
  Car, 
  Stethoscope, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  Coins, 
  ShieldCheck, 
  Activity, 
  FileCheck2, 
  ChevronRight,
  TrendingUp,
  HelpCircle
} from "lucide-react";
import { ConsultationRequest } from "../types";
import { SHOW_EMAIL_FIELDS, WHATSAPP_NUMBER } from "../constants";

export interface ServiceDetail {
  id: string;
  name: string;
  shortDesc: string;
  icon: any;
  bulletColor: string;
  borderColor: string;
  bgColor: string;
  badgeBg: string;
  badgeText: string;
  details: {
    coverage: string[];
    premiumBenefits: string[];
    deductibles: string;
    allies: string[];
  };
}

interface ServiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceDetail | null;
  onSaveConsultation: (req: ConsultationRequest) => void;
}

export default function ServiceDetailsModal({ isOpen, onClose, service, onSaveConsultation }: ServiceDetailsModalProps) {
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  if (!service) return null;

  const IconComponent = service.icon;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const newRequest: ConsultationRequest = {
      id: "SVC-" + Math.floor(1000 + Math.random() * 9000),
      email: email,
      timestamp: new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }),
      status: "pending",
      companySize: "Mediana Empresa (Simulación Externa)",
      riskCategory: `Interés en: ${service.name}`,
      notes: `Solicitó portafolio ampliado de cobertura premium para ${service.name}.`,
    };

    onSaveConsultation(newRequest);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setEmail("");
      onClose();
    }, 3000);
  };

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
        className="bg-white rounded-[2.5rem] w-full max-w-4xl relative overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row z-10"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-full transition-colors cursor-pointer"
          aria-label="Cerrar detalles"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        {/* Left column: High-level overview & Interactive forms */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
          <div>
            {/* Header section with branding and icon */}
            <div className="flex items-center space-x-4 mb-6">
              <div className={`w-14 h-14 rounded-2xl ${service.bgColor} ${service.bulletColor} flex items-center justify-center shadow-sm`}>
                <IconComponent className="w-7 h-7" />
              </div>
              <div>
                <span className={`text-xs font-black uppercase tracking-widest ${service.bulletColor} ${service.badgeBg} px-3 py-1 rounded-full`}>
                  {service.badgeText}
                </span>
                <h3 className="text-2xl font-black text-[#0F1740] mt-1.5 leading-tight">{service.name}</h3>
              </div>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              {service.shortDesc}
            </p>

            {/* Coverage listing */}
            <div className="space-y-4 mb-8">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center border-b border-slate-100 pb-2">
                <ShieldCheck className="w-4 h-4 mr-2 text-brand-blue" />
                ¿Qué amparos incluye tu póliza?
              </h4>
              <ul className="grid grid-cols-1 gap-3">
                {service.details.coverage.map((item, index) => (
                  <li key={index} className="flex items-start text-sm text-slate-600 font-medium">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 mr-2.5 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form wrapper */}
          <div className="pt-6 border-t border-slate-100">
            <h5 className="text-sm font-black text-[#0F1740] uppercase tracking-wider mb-3">
              ¿Deseas una propuesta formal personalizada?
            </h5>
            {SHOW_EMAIL_FIELDS ? (
              <>
                <p className="text-xs md:text-sm text-gray-500 mb-4 leading-normal font-medium">
                  Déjanos tu correo y generaremos hoy mismo una propuesta comparativa consolidada con las mejores aseguradoras de Colombia.
                </p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      disabled={saved}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-26 py-3.5 text-sm text-[#0F1740] focus:ring-1 focus:ring-brand-blue outline-none transition-all placeholder:text-gray-400"
                      placeholder="tu@empresa.com"
                    />
                    <button
                      type="submit"
                      disabled={saved}
                      className={`absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-xl text-xs font-black text-white transition-all shadow-xs cursor-pointer ${
                        saved ? "bg-emerald-600" : "bg-brand-blue hover:bg-blue-800"
                      }`}
                    >
                      {saved ? "Enviado ✓" : "Solicitar"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <p className="text-xs md:text-sm text-gray-500 mb-4 leading-normal font-medium">
                  Escríbenos por WhatsApp y generaremos hoy mismo una propuesta comparativa consolidada con las mejores aseguradoras de Colombia.
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola Conseguros, quiero una propuesta personalizada sobre: ${service.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2.5 shadow-md shadow-emerald-100"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.156 5.156 0 11.487 0c3.069.001 5.95 1.192 8.113 3.359s3.355 5.047 3.353 8.117c-.003 6.326-5.157 11.482-11.487 11.482-2.001 0-3.971-.521-5.719-1.517L0 24zm6.59-4.846c1.6.95 3.1 1.45 4.881 1.458 5.176 0 9.385-4.207 9.388-9.392.002-2.511-.973-4.87-2.748-6.649-1.776-1.779-4.137-2.757-6.65-2.759-5.176 0-9.386 4.207-9.389 9.393-.001 1.83.493 3.385 1.477 4.966l-.997 3.642 3.738-.981c.001 0 .001 0 0 0zm10.74-6.853c-.3-.15-1.78-.88-2.05-.98-.28-.1-.47-.15-.67.15-.2.3-.77.98-.95 1.18-.18.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.5-1-.89-1.66-2-1.86-2.3-.2-.3-.02-.47.13-.62.14-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.67-1.62-.92-2.22-.25-.6-.5-.52-.67-.53l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.51s1.08 2.92 1.23 3.12c.15.2 2.13 3.25 5.17 4.56.72.31 1.28.5 1.72.64.73.23 1.39.2 1.92.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.08-.13-.28-.2-.58-.35z"/>
                  </svg>
                  <span>Escríbenos por WhatsApp</span>
                </a>
              </>
            )}
          </div>
        </div>

        {/* Right column: Extra privileges & insurer lists */}
        <div className="w-full md:w-1/2 bg-slate-50/80 p-8 md:p-10 border-l border-slate-100 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
          <div className="space-y-6">
            
            {/* Premium advantages */}
            <div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center border-b border-slate-200/60 pb-2 mb-4">
                <Award className="w-4 h-4 mr-2 text-amber-500" />
                Ventajas & Valores Agregados Premium
              </h4>
              <ul className="space-y-3">
                {service.details.premiumBenefits.map((item, index) => (
                  <li key={index} className="flex items-start text-sm text-slate-600 leading-snug font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2.5 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Deductibles Recommendation */}
            <div className="bg-white rounded-2xl p-4.5 border border-slate-200/60 shadow-3xs space-y-1.5">
              <div className="flex items-center space-x-1.5 text-[#0F1740] text-sm font-black uppercase tracking-wider">
                <Coins className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Estructura de Deducibles</span>
              </div>
              <p className="text-sm text-gray-650 leading-normal font-medium">
                {service.details.deductibles}
              </p>
            </div>
          </div>

          {/* Quick advice note */}
          <div className="pt-6 border-t border-slate-200/60 mt-6 flex items-start space-x-3 text-xs text-slate-500 leading-normal font-medium">
            <span className="bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-black mt-0.5 text-[10px]">INFO</span>
            <p>
              Nuestra mesa de operaciones en Bogotá evalúa cada uno de estos amparos dinámicamente frente a Fasecolda y las mesas técnicas de suscripción para asegurar una tarifa excepcional a tu favor.
            </p>
          </div>

        </div>

      </motion.div>
    </div>
  );
}
