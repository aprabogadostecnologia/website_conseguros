import React, { useState } from "react";
import { motion } from "motion/react";
import { Building2, ArrowLeft, ShieldCheck, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { ConsultationRequest } from "../types";

interface HeroSlideBusinessProps {
  onBack: () => void;
  onSaveRequest: (req: ConsultationRequest) => void;
}

export default function HeroSlideBusiness({ onBack, onSaveRequest }: HeroSlideBusinessProps) {
  const [businessName, setBusinessName] = useState("");
  const [businessSector, setBusinessSector] = useState("comercio");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [warning, setWarning] = useState<string | null>(null);
  const [result, setResult] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      setWarning("Por favor ingresa el nombre o NIT de la empresa.");
      return;
    }
    if (!businessEmail.trim() || !businessEmail.includes("@")) {
      setWarning("Por favor ingresa un correo corporativo válido.");
      return;
    }
    if (!businessPhone.trim() || businessPhone.length < 7) {
      setWarning("Por favor ingresa un número de celular de contacto.");
      return;
    }

    setWarning(null);

    const generatedId = "EMP-" + Math.floor(100000 + Math.random() * 900000);
    const sectorLabels: Record<string, string> = {
      comercio: "Comercio / Oficinas",
      fabrica: "Fábrica / Manufactura",
      servicios: "Servicios Profesionales",
      construccion: "Construcción / Obra Civil",
    };

    const newReq: ConsultationRequest = {
      id: generatedId,
      email: businessEmail,
      timestamp: new Date().toLocaleDateString("es-CO", {
        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
      }),
      status: "pending",
      riskCategory: "Seguro Empresarial / PYME",
      companySize: sectorLabels[businessSector] || "N/A",
      notes: `Empresa: ${businessName}. Sector: ${sectorLabels[businessSector]}. Celular: ${businessPhone}. Solicitud de póliza integral multirriesgo comercial.`
    };

    onSaveRequest(newReq);
    setResult(true);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 text-left">
      {/* Left Column: Key info list */}
      <div className="w-full lg:w-[42%] bg-slate-950/60 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/20 pointer-events-none" />
        <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/20 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-10 pointer-events-none rounded-[2.5rem]" />

        <button
          onClick={onBack}
          className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-white transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Regresar al Menú Principal
        </button>

        <span className="text-blue-400 font-extrabold text-xs tracking-[0.25em] uppercase block mb-3 relative z-10">
          PROTECCIÓN EMPRESARIAL
        </span>

        <h2 className="text-2xl md:text-3xl text-white font-light mb-4 leading-tight relative z-10">
          Tranquilidad para tu <br className="hidden sm:inline"/> <span className="font-extrabold text-blue-400">Pyme o Negocio</span>
        </h2>

        <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-6 font-semibold relative z-10">
          Estructuramos pólizas comerciales multirriesgo a la medida de tu actividad económica para blindar tu patrimonio, infraestructura y continuidad de negocio.
        </p>

        <div className="space-y-3 mb-6 relative z-10 text-xs md:text-sm text-slate-300">
          <div className="flex items-start space-x-3">
            <span className="text-blue-400 mt-1">✓</span>
            <p className="text-xs font-semibold">
              <strong className="text-white">Multirriesgo Comercial:</strong> Protección integral para oficinas, maquinarias, inventarios y sucursales.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-blue-400 mt-1">✓</span>
            <p className="text-xs font-semibold">
              <strong className="text-white">Responsabilidad Civil (RCE):</strong> Amparo judicial frente a reclamaciones civiles de terceros por daños.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-blue-400 mt-1">✓</span>
            <p className="text-xs font-semibold">
              <strong className="text-white">Lucro Cesante:</strong> Compensación de ingresos mensuales por parálisis operativa tras catástrofes.
            </p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="inline-flex items-center text-xs font-extrabold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-5 py-3 rounded-full border border-white/10 transition-all cursor-pointer"
        >
          Ver otras categorías
        </button>
      </div>

      {/* Right Column: Business Quote Form */}
      <div className="w-full lg:w-[54%]">
        <motion.div
          layout
          className="w-full max-w-lg bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500/10 to-transparent blur-2xl opacity-60 pointer-events-none" />

          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-white/5 pb-3">
                <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4.5 h-4.5 text-blue-400 animate-pulse" />
                  Estructuración Técnica de Póliza
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
                  PYMES & CORPORATIVOS DE COLOMBIA
                </p>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-[11px] text-slate-400 font-black uppercase tracking-wide mb-1.5">
                  Nombre de la Empresa o NIT
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Ej: Inversiones ABC S.A.S. o 900.123.456-1"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* Sector Selector */}
              <div>
                <label className="block text-[11px] text-slate-400 font-black uppercase tracking-wide mb-1.5">
                  Sector o Actividad Económica
                </label>
                <select
                  value={businessSector}
                  onChange={(e) => setBusinessSector(e.target.value)}
                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="comercio">Comercio, Bodegas u Oficinas 🏢</option>
                  <option value="fabrica">Fábrica, Manufactura e Industria ⚙️</option>
                  <option value="servicios">Servicios Profesionales o Consultorías 💼</option>
                  <option value="construccion">Construcción y Obras de Ingeniería 🏗️</option>
                </select>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-[11px] text-slate-400 font-black uppercase tracking-wide mb-1.5">
                  Correo Electrónico Corporativo
                </label>
                <input
                  type="email"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  placeholder="Ej: gerencia@empresa.com"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-[11px] text-slate-400 font-black uppercase tracking-wide mb-1.5">
                  Celular o Teléfono de Contacto
                </label>
                <input
                  type="tel"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  placeholder="Ej: 3156789012"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl text-xs font-black transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-blue-500/25 cursor-pointer uppercase tracking-wider"
              >
                Solicitar Cotización Corporativa
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-black text-white uppercase tracking-wide">
                  ¡Radicado Exitoso!
                </h4>
                <p className="text-[11px] text-slate-400 uppercase tracking-widest mt-1">
                  Estudio de Riesgo Prioritario Iniciado
                </p>
              </div>

              <div className="bg-slate-950/60 p-5 rounded-xl border border-white/5 space-y-3 text-xs text-slate-300">
                <p className="font-bold text-white uppercase text-[10px] text-blue-400 tracking-wider">
                  Siguientes Pasos del Proceso:
                </p>
                <div className="space-y-2 text-left">
                  <p>
                    <strong className="text-white">1. Asignación técnica:</strong> Un ingeniero especialista en riesgos comerciales evaluará el NIT o dirección de tu empresa.
                  </p>
                  <p>
                    <strong className="text-white">2. Comparativo multimarca:</strong> Licitaremos tu póliza ante SURA, Allianz, Seguros Bolívar y AXA Colpatria.
                  </p>
                  <p>
                    <strong className="text-white">3. Presentación formal:</strong> Enviaremos al correo <strong className="text-white">{businessEmail}</strong> el comparativo técnico-médico detallado de deducibles y coberturas.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 text-xs text-blue-300 text-left font-semibold">
                🛡️ Nos pondremos en contacto vía telefónica al <strong className="text-white">{businessPhone}</strong> para refinar la información de inventarios y activos si es necesario.
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setResult(false);
                    setBusinessName("");
                  }}
                  className="py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold border border-white/10 transition-all cursor-pointer"
                >
                  Nueva Cotización
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
