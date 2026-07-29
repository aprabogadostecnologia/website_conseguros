import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, AlertCircle, CheckCircle2, MessageCircle } from "lucide-react";
import { ConsultationRequest } from "../types";

const WHATSAPP_NUMBER = "573057883941";
const WHATSAPP_MESSAGE = "Hola Conseguros, quiero cotizar un seguro de salud colectiva o prepagada. ¿Me pueden ayudar?";

interface HeroSlideHealthProps {
  onBack: () => void;
  onSaveRequest: (req: ConsultationRequest) => void;
}

export default function HeroSlideHealth({ onBack, onSaveRequest }: HeroSlideHealthProps) {
  const [usersCount, setUsersCount] = useState(15);
  const [phone, setPhone] = useState("");
  const [planType, setPlanType] = useState("premium");
  const [warning, setWarning] = useState<string | null>(null);
  const [result, setResult] = useState<boolean>(false);

  // Simple live rate simulation variables
  const ratePerPerson = planType === "premium" ? 138000 : 88000;
  const totalValue = usersCount * ratePerPerson;

  const formattedRate = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(ratePerPerson);
  const formattedTotal = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(totalValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || phone.length < 7) {
      setWarning("Por favor ingresa un número de celular de contacto válido.");
      return;
    }

    setWarning(null);

    const generatedId = "SAL-" + Math.floor(100000 + Math.random() * 900000);
    const planName = planType === "premium" ? "Medicina Prepagada VIP" : "Seguro de Salud Integral Colectivo";

    const newReq: ConsultationRequest = {
      id: generatedId,
      email: `${phone}@conseguros-salud.co`,
      timestamp: new Date().toLocaleDateString("es-CO", {
        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
      }),
      status: "pending",
      riskCategory: "Salud Colectiva / Prepagada",
      companySize: `${usersCount} Asegurados`,
      notes: `Grupo de Salud solicitado para ${usersCount} personas. Plan: ${planName}. Celular de contacto: ${phone}. Estimado mensual por persona: ${formattedRate}. Estimación de prima total: ${formattedTotal} COP/mes.`
    };

    onSaveRequest(newReq);
    setResult(true);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 xl:gap-20 text-left">
      {/* Left Column: Key info list */}
      <div className="w-full lg:w-[40%]">
        <span className="text-teal-400 font-extrabold text-sm xl:text-base tracking-[0.25em] uppercase block mb-3">
          BIENESTAR Y SALUD
        </span>

        <h2 className="text-3xl md:text-4xl xl:text-5xl text-white font-semibold mb-4 leading-tight">
          Salud Colectiva y <br className="hidden sm:inline"/> <span className="font-extrabold text-teal-400">Prepagada Familiar</span>
        </h2>

        <div className="space-y-3 mb-6 text-xs md:text-sm text-slate-300">
          <div className="flex items-start space-x-3">
            <span className="text-teal-400 mt-1">✓</span>
            <p className="text-sm md:text-base xl:text-lg font-bold">
              <strong className="text-white">Clínicas VIP:</strong> Hospitalización en las clínicas más prestigiosas de Colombia.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-teal-400 mt-1">✓</span>
            <p className="text-sm md:text-base xl:text-lg font-bold">
              <strong className="text-white">Especialistas directos:</strong> Consultas sin pasar por médico general, en tiempo récord.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-teal-400 mt-1">✓</span>
            <p className="text-sm md:text-base xl:text-lg font-bold">
              <strong className="text-white">Ahorro tributario:</strong> Pólizas deducibles del impuesto sobre la renta para empresas.
            </p>
          </div>
        </div>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-teal-300 hover:text-white bg-teal-500/10 hover:bg-teal-500/20 border border-teal-400/30 hover:border-teal-400/60 px-4 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all"
        >
          <MessageCircle className="w-4 h-4 md:w-4.5 md:h-4.5" />
          <span>Escríbenos por WhatsApp</span>
        </a>
      </div>

      {/* Right Column: Health Quote Form with live calculator */}
      <div className="w-full lg:w-[56%]">
        <motion.div
          layout
          className="w-full max-w-lg xl:max-w-xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 xl:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-gradient-to-tr from-teal-500/10 to-transparent blur-2xl opacity-60 pointer-events-none" />

          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-white/5 pb-3">
                <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4.5 h-4.5 text-teal-400 animate-pulse" />
                  Estimador de Tarifas Colectivas
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
                  Sura, Colmedica y Medisanitas Aliados
                </p>
              </div>

              {/* Number of users slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] text-slate-400 font-black uppercase tracking-wide">
                    Número de Asegurados (Grupo)
                  </label>
                  <span className="text-xs font-black text-white bg-teal-500/20 border border-teal-500/30 px-2.5 py-0.5 rounded-full">
                    {usersCount} personas
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setUsersCount(Math.max(1, usersCount - 5))}
                    className="w-10 h-10 rounded-xl bg-slate-950/50 border border-white/10 text-white flex items-center justify-center font-black hover:bg-slate-950 transition-colors cursor-pointer"
                  >
                    -5
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={usersCount}
                    onChange={(e) => setUsersCount(parseInt(e.target.value))}
                    className="flex-1 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                  <button
                    type="button"
                    onClick={() => setUsersCount(Math.min(100, usersCount + 5))}
                    className="w-10 h-10 rounded-xl bg-slate-950/50 border border-white/10 text-white flex items-center justify-center font-black hover:bg-slate-950 transition-colors cursor-pointer"
                  >
                    +5
                  </button>
                </div>
              </div>

              {/* Plan Choice */}
              <div>
                <label className="block text-[11px] text-slate-400 font-black uppercase tracking-wide mb-1.5">
                  Tipo de Plan de Salud
                </label>
                <select
                  value={planType}
                  onChange={(e) => setPlanType(e.target.value)}
                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-400"
                >
                  <option value="premium">Medicina Prepagada Completa (Especialistas Directos) ⭐</option>
                  <option value="standard">Póliza de Salud Ambulatoria y Hospitalaria Básica 🏥</option>
                </select>
              </div>

              {/* Real-time Estimate Feedback Box */}
              <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Valor Unitario Estimado</span>
                  <span className="text-sm font-black text-slate-300">{formattedRate} <span className="text-[10px] font-medium text-slate-500">/ p.p.</span></span>
                </div>
                <div className="text-right border-l border-white/5 pl-4">
                  <span className="text-[10px] text-teal-400 font-black uppercase tracking-wider block">Total Grupo Mensual</span>
                  <span className="text-lg font-black text-white">{formattedTotal}</span>
                </div>
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-[11px] text-slate-400 font-black uppercase tracking-wide mb-1.5">
                  Número de Celular de Contacto
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej: 3004567890"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                />
              </div>

              {warning && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-2 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="font-semibold">{warning}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3.5 rounded-xl text-xs font-black transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-teal-500/25 cursor-pointer uppercase tracking-wider"
              >
                Solicitar Propuesta de Salud
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-black text-white uppercase tracking-wide">
                  ¡Propuesta Solicitada!
                </h4>
                <p className="text-[11px] text-slate-400 uppercase tracking-widest mt-1">
                  Cotización de grupo de salud radicada
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                  <span className="text-slate-400">Total Asegurados:</span>
                  <span className="text-white font-black">{usersCount} personas</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                  <span className="text-slate-400">Tipo de Cobertura:</span>
                  <span className="text-teal-300 font-extrabold">{planType === "premium" ? "Medicina Prepagada VIP" : "Salud Ambulatoria Básica"}</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-slate-400 font-bold">Presupuesto Estimado:</span>
                  <span className="text-white font-black text-base">{formattedTotal} COP / mes</span>
                </div>
              </div>

              <div className="p-3 bg-teal-500/5 rounded-xl border border-teal-500/10 text-xs text-teal-300 text-left font-semibold">
                🛡️ Evaluaremos el perfil demográfico básico del grupo y te enviaremos una propuesta formal en PDF con las tasas reales negociadas de Sura, Colmédica y Sanitas al celular <strong className="text-white">{phone}</strong>.
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setResult(false);
                  }}
                  className="py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold border border-white/10 transition-all cursor-pointer"
                >
                  Cambiar Personas
                </button>
                <button
                  type="button"
                  onClick={onBack}
                  className="py-2.5 px-4 bg-brand-blue hover:bg-blue-800 text-white rounded-xl text-xs font-black transition-all cursor-pointer"
                >
                  Regresar al Menú
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
