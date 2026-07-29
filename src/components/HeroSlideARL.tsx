import React, { useState } from "react";
import { motion } from "motion/react";
import { ShieldCheck, ArrowLeft, Sparkles, AlertCircle, CheckCircle2, MessageCircle } from "lucide-react";
import { ConsultationRequest } from "../types";

const WHATSAPP_NUMBER = "573057883941";
const WHATSAPP_MESSAGE = "Hola Conseguros, quiero información sobre la intermediación ARL sin costo para mi empresa. ¿Me pueden ayudar?";

interface HeroSlideARLProps {
  onBack: () => void;
  onSaveRequest: (req: ConsultationRequest) => void;
}

export default function HeroSlideARL({ onBack, onSaveRequest }: HeroSlideARLProps) {
  const [riskClass, setRiskClass] = useState<number>(2);
  const [employees, setEmployees] = useState<number>(35);
  const [averageSalary, setAverageSalary] = useState<number>(1600000);
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [warning, setWarning] = useState<string | null>(null);
  const [result, setResult] = useState<boolean>(false);

  // ARL Law Constants in Colombia
  const riskRates = [0.522, 1.044, 2.436, 4.350, 8.700];
  const activeRate = riskRates[riskClass - 1];
  
  // Calculations
  const unitContribution = averageSalary * (activeRate / 100);
  const totalMonthlyContribution = unitContribution * employees;
  const safetyFundRetorno = totalMonthlyContribution * 0.38; // 9.2% legal training return

  const formattedCurrency = (val: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(val);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || phone.length < 7) {
      setWarning("Por favor ingresa un número de celular de contacto válido.");
      return;
    }

    setWarning(null);

    const generatedId = "ARL-" + Math.floor(100000 + Math.random() * 900000);

    const newReq: ConsultationRequest = {
      id: generatedId,
      email: `${phone}@conseguros-arl.co`,
      timestamp: new Date().toLocaleDateString("es-CO", {
        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
      }),
      status: "pending",
      riskCategory: "Intermediación ARL",
      companySize: `${employees} Empleados (Riesgo ${riskClass})`,
      notes: `Solicitud de intermediación técnica ARL de ley para empresa de ${employees} trabajadores. Riesgo clase ${riskClass} (${activeRate}%). Celular: ${phone}. Aporte mensual estimado: ${formattedCurrency(totalMonthlyContribution)}. Retorno legal estimado en capacitación: ${formattedCurrency(safetyFundRetorno)}/mes.`
    };

    onSaveRequest(newReq);
    setResult(true);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 xl:gap-20 text-left">
      {/* Left Column: Key info list */}
      <div className="w-full lg:w-[40%]">
        <span className="text-indigo-400 font-extrabold text-sm xl:text-base tracking-[0.25em] uppercase block mb-3">
          SERVICIOS TÉCNICOS DE LEY
        </span>

        <h2 className="text-3xl md:text-4xl xl:text-5xl text-white font-semibold mb-4 leading-tight">
          Intermediación ARL <br className="hidden sm:inline"/> <span className="font-extrabold text-indigo-400">Sin Costo ($0)</span>
        </h2>

        <div className="space-y-3 mb-6 text-xs md:text-sm text-slate-300">
          <div className="flex items-start space-x-3">
            <span className="text-indigo-400 mt-1">✓</span>
            <p className="text-sm md:text-base xl:text-lg font-bold">
              <strong className="text-white">Retorno de Prevención:</strong> Recupera y reinvierte el <strong className="text-white">38% de tus aportes obligatorios</strong> en capacitaciones y brigadas de emergencia.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-indigo-400 mt-1">✓</span>
            <p className="text-sm md:text-base xl:text-lg font-bold">
              <strong className="text-white">Auditoría de Clasificación:</strong> Evaluamos si estás pagando de más por clasificaciones incorrectas de tasas ante el Ministerio.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-indigo-400 mt-1">✓</span>
            <p className="text-sm md:text-base xl:text-lg font-bold">
              <strong className="text-white">Acompañamiento Técnico:</strong> Diseñamos y auditamos el SG-SST y coordinamos directamente con Sura, Colpatria o Positiva.
            </p>
          </div>
        </div>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-400/30 hover:border-indigo-400/60 px-4 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all"
        >
          <MessageCircle className="w-4 h-4 md:w-4.5 md:h-4.5" />
          <span>Escríbenos por WhatsApp</span>
        </a>
      </div>

      {/* Right Column: Interactive ARL Rate Simulator Card */}
      <div className="w-full lg:w-[56%]">
        <motion.div
          layout
          className="w-full max-w-lg xl:max-w-xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 xl:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-500/10 to-transparent blur-2xl opacity-60 pointer-events-none" />

          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-white/5 pb-2.5">
                <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
                  Simulador de Aportes ARL de Ley
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
                  Auditoría técnica de aportes obligatorios
                </p>
              </div>

              {/* Risk Class Selector Buttons */}
              <div>
                <label className="block text-[10px] text-slate-400 font-black uppercase tracking-wide mb-1.5">
                  Clase de Riesgo de tu Actividad
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setRiskClass(level)}
                      className={`py-2 px-1 rounded-lg border text-center transition-all cursor-pointer text-xs font-extrabold ${
                        riskClass === level
                          ? "bg-indigo-500/20 border-indigo-400 text-white shadow-lg shadow-indigo-500/10"
                          : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      <div className="text-[10px] text-slate-400 font-semibold mb-0.5">Clase</div>
                      <div className="text-xs font-black">{["I", "II", "III", "IV", "V"][level - 1]}</div>
                      <div className="text-[8px] font-medium text-indigo-300 mt-0.5">{riskRates[level - 1]}%</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Employees Slider */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-wide">
                      Empleados
                    </label>
                    <span className="text-[10px] font-black text-white">{employees} trab.</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="200"
                    value={employees}
                    onChange={(e) => setEmployees(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-black uppercase tracking-wide mb-1">
                    Salario Promedio COP
                  </label>
                  <input
                    type="number"
                    value={averageSalary}
                    onChange={(e) => setAverageSalary(Math.max(1300000, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-400 font-mono"
                  />
                </div>
              </div>

              {/* Calculated Estimator Grid */}
              <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5 space-y-2.5">
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Aporte Promedio Unitario:</span>
                  <span className="text-xs text-slate-200 font-black font-mono">{formattedCurrency(unitContribution)} <span className="text-[9px] font-medium text-slate-400">/ mes</span></span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-0.5">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Aporte Total Mensual:</span>
                    <span className="text-sm font-black text-white font-mono">{formattedCurrency(totalMonthlyContribution)}</span>
                  </div>
                  <div className="border-l border-white/5 pl-3">
                    <span className="text-[9px] text-emerald-400 font-black uppercase block">Retorno en Prevención:</span>
                    <span className="text-sm font-black text-[#10b981] font-mono">{formattedCurrency(safetyFundRetorno)}</span>
                  </div>
                </div>
              </div>

              {/* 
              <div>
                <label className="block text-[11px] text-slate-400 font-black uppercase tracking-wide mb-1.5">
                  Número de Celular para Auditoría Express
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej: 3201234567"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                />
              </div> 
              */}
        

              {/*-nombre de empresa */}
              <div>
                <label className="block text-[11px] text-slate-400 font-black uppercase tracking-wide mb-1.5">
                  Nombre de la Empresa
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Ej: Empresa S.A.S"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
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
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3.5 rounded-xl text-xs font-black transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-indigo-500/25 cursor-pointer uppercase tracking-wider"
              >
                Solicitar Intermediación Técnica $0 de Ley
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-black text-white uppercase tracking-wide">
                  ¡Auditoría Radicada!
                </h4>
                <p className="text-[11px] text-slate-400 uppercase tracking-widest mt-1">
                  Estudio de optimización de tasas de ley
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                  <span className="text-slate-400">Riesgo Auditado:</span>
                  <span className="text-white font-black">Clase {["I", "II", "III", "IV", "V"][riskClass - 1]} ({activeRate}%)</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                  <span className="text-slate-400">Total Trabajadores:</span>
                  <span className="text-white font-black">{employees} empleados</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                  <span className="text-slate-400">Aporte Estimado:</span>
                  <span className="text-white font-mono">{formattedCurrency(totalMonthlyContribution)} COP / mes</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-emerald-400 font-bold">Retorno de Capacitación:</span>
                  <span className="text-emerald-400 font-black text-sm">{formattedCurrency(safetyFundRetorno)} COP / mes</span>
                </div>
              </div>

              <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 text-xs text-indigo-300 text-left font-semibold">
                🛡️ Evaluaremos tu afiliación ARL actual frente a SURA, Positiva y Seguros Bolívar. Nos pondremos en contacto vía telefónica al <strong className="text-white">{phone}</strong> para formalizar tu intermediación $0 de ley.
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setResult(false);
                  }}
                  className="py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold border border-white/10 transition-all cursor-pointer"
                >
                  Recalcular
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
