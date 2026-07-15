import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckSquare, ArrowRight, BookOpen, AlertCircle, FileSpreadsheet, Sparkles } from "lucide-react";
import { AdvisoryStep } from "../types";

export default function ProcessSection() {
  const [activeStepId, setActiveStepId] = useState<string | null>(null);

  const steps: AdvisoryStep[] = [
    {
      id: "step1",
      number: "Paso 01",
      title: "Diligencias el perfil",
      description: "Analizamos tu entorno en 5 minutos para perfilar tus riesgos clave.",
      badgeBg: "bg-[#FFF3EF]",
      textCol: "text-[#FF8A65]",
      accentColor: "#FF8A65",
      icon: "assignment",
      details: [
        "Identificación de clasificación ARL de los colaboradores.",
        "Segmentación geográfica de oficinas, bodegas o depósitos.",
        "Inventario estimado de activos fijos, maquinaria y TI.",
        "Cruces rápidos con siniestralidad histórica empresarial."
      ]
    },
    {
      id: "step_siniestro",
      number: "Paso 02",
      title: "Reportas Siniestros 24/7",
      description: "Activamos protocolos inmediatos de soporte para mitigar impactos financieros.",
      badgeBg: "bg-red-50",
      textCol: "text-red-500",
      accentColor: "#ef4444",
      icon: "gavel",
      details: [
        "Defensa técnica y jurídica in situ en caso de accidentes graves.",
        "Asistencia inmediata para grúas, auxilio vial o médico nacional.",
        "Radicación veloz de reclamación ante aseguradoras en 2 horas.",
        "Seguimiento diario del estatus de reclamación e indemnizaciones."
      ]
    },
    {
      id: "step2",
      number: "Paso 03",
      title: "Analizamos el mercado",
      description: "Cotizamos en paralelo con las aseguradoras AAA más sólidas del país.",
      badgeBg: "bg-[#E8E9FF]",
      textCol: "text-brand-blue",
      accentColor: "#121ccf",
      icon: "search",
      details: [
        "Envío de cotizaciones simultáneas a Sura, AXA Colpatria, Allianz y Mapfre.",
        "Negociación directa de primas en bloque aprovechando nuestro volumen.",
        "Auditoría técnica de deducibles para evitar cobros sorpresa.",
        "Redacción estricta para eliminar cláusulas de exclusión ambiguas."
      ]
    },
    {
      id: "step3",
      number: "Paso 04",
      title: "Filtramos un Top 3",
      description: "Depuramos y seleccionamos exclusivamente las 3 mejores opciones técnicas.",
      badgeBg: "bg-[#F3E5F5]",
      textCol: "text-[#9C27B0]",
      accentColor: "#9C27B0",
      icon: "layers",
      details: [
        "Descarte inmediato de ofertas con garantías de retención excesivas.",
        "Elaboración de un comparativo interactivo cara a cara.",
        "Recepción de asesoría en español directo y sin tecnicismos legales redundantes.",
        "Calificación de solvencia operativa de los talleres de reparación asignados."
      ]
    },
    {
      id: "step4",
      number: "Paso 05",
      title: "Tú decides y gestionamos",
      description: "Eliges la opción perfecta y nosotros nos encargamos del papeleo digital.",
      badgeBg: "bg-[#E8F5E9]",
      textCol: "text-[#4CAF50]",
      accentColor: "#4CAF50",
      icon: "workspace_premium",
      details: [
        "Firma digital segura y ágil sin requerir traslados físicos.",
        "Emisión prioritaria de pólizas y facturas integradas en 24 horas.",
        "Carga automática al módulo de alertas preventivas de renovación.",
        "Acompañamiento legal total e ilimitado en caso de siniestros o reclamos complejos."
      ]
    }
  ];

  const activeStep = steps.find((s) => s.id === activeStepId);

  return (
    <section className="py-16 md:py-20 px-8 md:px-16 bg-surface relative overflow-hidden" id="proceso">
      <style>{`
        @keyframes routeFlow {
          from {
            stroke-dashoffset: 460;
          }
          to {
            stroke-dashoffset: -460;
          }
        }
      `}</style>

      {/* Decorative Organic Connecting Wave for Desktop */}
      <div className="absolute left-[8%] right-[8%] top-[55%] -translate-y-1/2 h-32 hidden lg:block pointer-events-none z-0">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 100" fill="none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="process-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF8A65" />
              <stop offset="25%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#121ccf" />
              <stop offset="75%" stopColor="#9C27B0" />
              <stop offset="100%" stopColor="#4CAF50" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Subtle dashed guiding wave */}
          <path
            d="M 0 50 C 125 -10, 125 110, 250 50 C 375 -10, 375 110, 500 50 C 625 -10, 625 110, 750 50 C 875 -10, 875 110, 1000 50"
            stroke="url(#process-grad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="14 12"
            className="opacity-30"
          />

          {/* Flowing animated light energy runner */}
          <path
            d="M 0 50 C 125 -10, 125 110, 250 50 C 375 -10, 375 110, 500 50 C 625 -10, 625 110, 750 50 C 875 -10, 875 110, 1000 50"
            stroke="url(#process-grad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="100 400"
            filter="url(#glow)"
            className="opacity-90"
            style={{
              animation: "routeFlow 10s linear infinite"
            }}
          />
        </svg>
      </div>

      {/* Decorative Serpentine Connecting Wave for Mobile/Tablet */}
      <div className="absolute left-1/2 top-[18%] bottom-[5%] w-24 -translate-x-1/2 lg:hidden pointer-events-none z-0">
        <svg className="w-full h-full overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 100 1000">
          {/* guiding wave */}
          <path
            d="M 50 0 C 10 100, 90 150, 50 250 C 10 350, 90 400, 50 500 C 10 600, 90 650, 50 750 C 10 850, 90 900, 50 1000"
            stroke="url(#process-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="14 12"
            className="opacity-25"
          />
          {/* glowing runner */}
          <path
            d="M 50 0 C 10 100, 90 150, 50 250 C 10 350, 90 400, 50 500 C 10 600, 90 650, 50 750 C 10 850, 90 900, 50 1000"
            stroke="url(#process-grad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="80 500"
            filter="url(#glow)"
            className="opacity-80"
            style={{
              animation: "routeFlow 14s linear infinite"
            }}
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#FF8A65] font-extrabold tracking-[0.2em] text-sm md:text-base uppercase block mb-4">
            PROCEDIMIENTO CLARO
          </span>
          <h2 className="text-5xl md:text-6xl font-extrabold text-[#0F1740] mb-6 tracking-tight">
            ¿Cómo funciona nuestra asesoría proactiva?
          </h2>
          <p className="text-gray-500 max-w-3xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
            Desde la primera consulta virtual gratuita hasta el acompañamiento legal de siniestralidad. Siempre estamos de tu lado.
          </p>
        </div>

        {/* Steps Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
          {steps.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="bg-white/92 backdrop-blur-md p-8 rounded-[2rem] border border-gray-100/90 shadow-xs flex flex-col items-center text-center relative group transition-all"
            >
              <div className="w-full flex justify-between items-start mb-12">
                <span className="text-[10px] font-extrabold text-gray-400 tracking-widest uppercase">
                  CONSEGUROS
                </span>
                <span className={`px-3 py-1 ${item.badgeBg} ${item.textCol} text-xs font-bold rounded-full`}>
                  {item.number}
                </span>
              </div>
              
              <div className="w-16 h-16 bg-slate-50/80 rounded-2xl flex items-center justify-center mb-6 shadow-xs border border-gray-100/30 group-hover:border-brand-blue/20 transition-all">
                <span className="material-symbols-outlined text-gray-700 text-3xl">
                  {item.icon}
                </span>
              </div>

              <h4 className="text-xl font-bold text-[#0F1740] mb-12 leading-snug">
                {item.title}
              </h4>

              <button
                onClick={() => setActiveStepId(item.id)}
                className="mt-auto text-gray-400 text-sm font-semibold flex items-center hover:text-brand-blue transition-colors group/btn cursor-pointer"
              >
                Ver más detalles 
                <span className="material-symbols-outlined text-sm ml-1 group-hover/btn:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Detail Centered Modal */}
        <AnimatePresence>
          {activeStepId && activeStep && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/40 backdrop-blur-sm"
            >
              {/* Back drop click closer */}
              <div className="absolute inset-0" onClick={() => setActiveStepId(null)} />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 30, stiffness: 220 }}
                className="relative w-full max-w-3xl bg-white max-h-[90vh] md:max-h-[85vh] shadow-2xl rounded-[2.5rem] p-6 md:p-10 flex flex-col justify-between overflow-y-auto z-10"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-6">
                    <div className="flex items-center space-x-3">
                      <span className={`px-4 py-1.5 text-xs font-bold rounded-full ${activeStep.badgeBg} ${activeStep.textCol}`}>
                        {activeStep.number}
                      </span>
                      <h3 className="text-2xl font-extrabold text-[#0F1740] tracking-tight">{activeStep.title}</h3>
                    </div>
                    <button
                      onClick={() => setActiveStepId(null)}
                      className="p-2 rounded-full hover:bg-slate-100 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-base text-gray-600 mb-8 font-medium leading-relaxed">
                    {activeStep.description}
                  </p>

                  <div className="space-y-6">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center select-none">
                      <Sparkles className="w-4.5 h-4.5 mr-1.5 text-brand-blue" />
                      Estructura del proceso Conseguros
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
                      {activeStep.details.map((detail, idx) => (
                        <div
                          key={idx}
                          className="flex items-start bg-slate-50 p-4.5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all duration-300 shadow-3xs"
                        >
                          <div className={`p-1 rounded-lg mr-3 shrink-0 ${activeStep.badgeBg} ${activeStep.textCol} flex items-center justify-center`}>
                            <CheckSquare className="w-4.5 h-4.5" />
                          </div>
                          <span className="text-sm font-semibold text-gray-700 leading-relaxed">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 p-5 rounded-2xl bg-blue-50 border border-blue-100 flex items-start space-x-4 text-brand-blue">
                    <BookOpen className="w-5 w-5 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider">Beneficios Clave</div>
                      <p className="text-xs text-blue-900/85 mt-1.5 leading-relaxed font-medium">
                        Evaluamos riesgos complementarios sin cobro adicional, asegurando que tu PYME adquiera solamente las coberturas requeridas por ley o por sanidad de negocio.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-100 mt-8 flex justify-end">
                  <button
                    onClick={() => setActiveStepId(null)}
                    style={{ backgroundColor: activeStep.accentColor }}
                    className="w-full md:w-auto px-8 py-4 text-white rounded-full font-bold text-sm transition-all text-center flex items-center justify-center space-x-2 hover:brightness-105 active:scale-[0.98]"
                  >
                    <span>Cerrar Detalle</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
