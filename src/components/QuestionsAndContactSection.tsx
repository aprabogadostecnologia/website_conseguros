import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, 
  CheckCircle2, 
  Phone, 
  Clock,
  ChevronDown,
  HelpCircle
} from "lucide-react";
import { ConsultationRequest } from "../types";

interface QuestionsAndContactSectionProps {
  onSaveConsultation: (req: ConsultationRequest) => void;
}

export default function QuestionsAndContactSection({ onSaveConsultation }: QuestionsAndContactSectionProps) {
  // Contact state
  const [contactEmail, setContactEmail] = useState("");
  const [successMailMsg, setSuccessMailMsg] = useState(false);
  
  // FAQ state
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!contactEmail.trim() || !contactEmail.includes("@")) {
      return;
    }

    const newReq: ConsultationRequest = {
      id: "CONS-" + Math.floor(1000 + Math.random() * 9000),
      email: contactEmail.trim(),
      timestamp: new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }),
      status: "pending",
      companySize: "No especificada (Contacto)",
      riskCategory: "Evaluación Integral Solicitada",
      notes: "Enviado desde el formulario de Contacto",
    };

    onSaveConsultation(newReq);
    setSuccessMailMsg(true);
    setContactEmail("");

    // Hide message after 5.5 seconds
    setTimeout(() => {
      setSuccessMailMsg(false);
    }, 5500);
  };

  const faqData = [
    {
      question: "¿Qué tipo de empresas atienden en Conseguros?",
      answer: "Atendemos desde pequeñas y medianas empresas (Pymes) que inician su formalización, hasta grandes corporaciones multinacionales. Diseñamos programas de seguros adaptados a la matriz de riesgos específica de cada sector industrial."
    },
    {
      question: "¿Cómo funciona el proceso de cotización y estructuración?",
      answer: "Analizamos en detalle tus pólizas vigentes, identificamos brechas de cobertura o sobrecostos, diseñamos un pliego de condiciones a medida y salimos a negociar con las principales aseguradoras de Colombia para conseguir las mejores tasas y deducibles del mercado."
    },
    {
      question: "¿La intermediación de seguros tiene algún costo para mi empresa?",
      answer: "No, la asesoría, administración de pólizas, atención de siniestros y acompañamiento legal de Conseguros no representa ningún costo adicional ni incremento en tus primas. Las comisiones del corretaje son asumidas directamente por las compañías de seguros elegidas."
    },
    {
      question: "¿Cómo es el soporte en caso de un siniestro corporativo?",
      answer: "Contamos con un equipo exclusivo de indemnizaciones y siniestros que te acompaña 24/7. Te ayudamos a recolectar las pruebas, estructurar la reclamación técnica y jurídica, y presionamos la liquidación oportuna ante la aseguradora para proteger la caja de tu empresa."
    },
    {
      question: "¿Tienen cobertura técnica a nivel nacional?",
      answer: "Sí, operamos en todo el territorio colombiano. Brindamos soporte técnico presencial o virtual para inspecciones de riesgos corporativos, capacitaciones de prevención y entrega de garantías en cualquier departamento o ciudad principal."
    }
  ];

  const toggleFaq = (index: number) => {
    setActiveFaqIndex(activeFaqIndex === index ? null : index);
  };

  return (
    <section className="py-14 md:py-16 px-8 md:px-16 bg-slate-50 relative overflow-hidden" id="contacto">
      {/* Elegante Divisor Curvo Superior (Transición orgánica desde ProcessSection blanco) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] select-none pointer-events-none transform rotate-180 z-20">
        <svg className="relative block w-[calc(100%+1.3px)] h-[40px] md:h-[64px]" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M0,32 C300,110 900,-10 1200,68 L1200,120 L0,120 Z"
            className="fill-white"
          ></path>
        </svg>
      </div>

      {/* Elegante Divisor Curvo Inferior (Transición orgánica hacia el Footer azul de Conseguros) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] select-none pointer-events-none z-20">
        <svg className="relative block w-[calc(100%+1.3px)] h-[40px] md:h-[64px]" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M0,32 C300,110 900,-10 1200,68 L1200,120 L0,120 Z"
            className="fill-[#121ccf]"
          ></path>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* FAQ Column (Left Side) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-brand-blue font-extrabold text-[11px] tracking-widest uppercase block mb-2">
                RESOLVEMOS TUS DUDAS
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-[#0F1740] tracking-tight leading-tight">
                Preguntas Frecuentes
              </h3>
              <p className="text-sm md:text-base text-gray-500 font-semibold mt-2 max-w-xl">
                Descubre cómo optimizamos las coberturas y administramos los riesgos de tu empresa de forma ágil y transparente.
              </p>
            </div>

            <div className="space-y-3.5 mt-6">
              {faqData.map((faq, idx) => {
                const isOpen = activeFaqIndex === idx;
                return (
                  <div 
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-100 shadow-3xs overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full text-left px-5 py-4.5 flex items-center justify-between gap-4 font-bold text-gray-800 text-sm md:text-base focus:outline-none hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle className={`w-5 h-5 shrink-0 transition-colors duration-300 ${isOpen ? "text-brand-blue" : "text-slate-400"}`} />
                        <span>{faq.question}</span>
                      </div>
                      <ChevronDown 
                        className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-brand-blue" : ""}`} 
                      />
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-gray-500 font-semibold leading-relaxed border-t border-slate-50">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Card Column (Right Side) */}
          <div className="lg:col-span-5 bg-white rounded-[3rem] p-8 md:p-10 border border-slate-150 shadow-md flex flex-col justify-between">
            
            {/* Header inside the contact card */}
            <div className="mb-8 text-center">
              <span className="text-brand-blue font-extrabold text-[11px] tracking-widest uppercase block mb-2">
                ¿TIENES INQUIETUDES?
              </span>
              <h3 className="text-3xl font-black text-[#0F1740] tracking-tight leading-tight mb-3">
                ¡Hablemos!
              </h3>
              <p className="text-xs md:text-sm text-gray-500 font-semibold leading-relaxed">
                Estamos listos para apoyarte a estructurar y cotizar las pólizas para tu empresa con un corredor corporativo asignado.
              </p>
            </div>

            {/* Decorative visual or micro indicators */}
            <div className="space-y-4 mb-8">
              {/* Contact Box 1: Support Hour */}
              <div className="flex items-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0 mr-4 shadow-3xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900 uppercase">Horario de Atención</h4>
                  <p className="text-[11px] md:text-xs text-gray-500 font-semibold mt-0.5">Lunes a Viernes 8:00 AM - 6:00 PM</p>
                </div>
              </div>

              {/* Contact Box 2: Emergency Line */}
              <div className="flex items-center p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mr-4 shadow-3xs">
                  <Phone className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-emerald-800 uppercase">Soporte WhatsApp 24/7</h4>
                  <p className="text-[11px] md:text-xs text-emerald-600 font-bold mt-0.5">+57 3057883941 • Bogotá, CO</p>
                </div>
              </div>
            </div>

            {/* Form Area */}
            <form onSubmit={handleContactSubmit} className="space-y-3.5">
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wide text-center">
                Ingresa tu Email Corporativo
              </label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 hover:border-gray-300 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue rounded-2xl pl-5 pr-12 py-4 text-sm font-semibold text-gray-900 outline-none transition-all placeholder:text-gray-400"
                  placeholder="ejemplo@empresa.com"
                />
                <button
                  type="submit"
                  className="absolute right-2.5 top-2.5 bottom-2.5 w-10 h-10 rounded-xl bg-brand-blue hover:bg-blue-800 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer"
                  aria-label="Registrar asesoría"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-gray-400 leading-normal text-center">
                Al agendar, autorizas el tratamiento de tus datos corporativos de acuerdo a las leyes de Habeas Data en Colombia.
              </p>
            </form>

            {/* Success prompt inside Card */}
            <AnimatePresence>
              {successMailMsg && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="mt-5 p-4.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-emerald-900 text-sm font-bold mb-0.5">¡Agenda Registrada!</strong>
                    Hemos guardado tu requerimiento de forma local. Un corredor corporativo te contactará pronto.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </div>
    </section>
  );
}
