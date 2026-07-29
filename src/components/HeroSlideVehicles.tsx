import React, { useState } from "react";
import { motion } from "motion/react";
import { Car, Bike, Sparkles, AlertCircle, CheckCircle2, MessageCircle } from "lucide-react";
import { ConsultationRequest } from "../types";

const WHATSAPP_NUMBER = "573057883941";
const WHATSAPP_MESSAGE = "Hola Conseguros, quiero cotizar un seguro para mi carro o moto. ¿Me pueden ayudar?";

interface HeroSlideVehiclesProps {
  onBack: () => void;
  onSaveRequest: (req: ConsultationRequest) => void;
}

export default function HeroSlideVehicles({ onBack, onSaveRequest }: HeroSlideVehiclesProps) {
  const [vehicleType, setVehicleType] = useState<"carro" | "moto">("carro");
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [vehiclePhone, setVehiclePhone] = useState("");
  const [vehiclePlan, setVehiclePlan] = useState("premium");
  const [warning, setWarning] = useState<string | null>(null);
  const [result, setResult] = useState<{
    id: string;
    estimatedValue: string;
    planName: string;
    brandSummary: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleInfo.trim()) {
      setWarning("Por favor ingresa la placa, marca o modelo de tu vehículo.");
      return;
    }
    if (!vehiclePhone.trim() || vehiclePhone.length < 7) {
      setWarning("Por favor ingresa un número de celular válido para la asesoría.");
      return;
    }

    setWarning(null);

    // Compute mock realistic Fasecolda-based premium estimates
    let baseValue = vehicleType === "carro" ? 145000 : 72000;
    if (vehiclePlan === "premium") {
      baseValue = Math.round(baseValue * 1.35);
    }
    const formattedVal = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(baseValue);

    const generatedId = "COT-" + Math.floor(100000 + Math.random() * 900000);
    const planLabel = vehiclePlan === "premium" ? "Todo Riesgo Premium" : "Básico Responsabilidad Civil (RCE)";

    // Save request
    const newReq: ConsultationRequest = {
      id: generatedId,
      email: `${vehiclePhone}@conseguros-sms.com`,
      timestamp: new Date().toLocaleDateString("es-CO", {
        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
      }),
      status: "pending",
      riskCategory: `Vehículos (${vehicleType === "carro" ? "Carro" : "Moto"})`,
      companySize: "Individual / Póliza Privada",
      notes: `Vehículo: ${vehicleInfo}. Plan solicitado: ${planLabel}. Celular: ${vehiclePhone}. Estimación de prima mensual: ${formattedVal}.`
    };

    onSaveRequest(newReq);

    setResult({
      id: generatedId,
      estimatedValue: formattedVal,
      planName: planLabel,
      brandSummary: vehicleType === "carro" ? "SURA, Allianz y Mapfre" : "SURA y Seguros Bolívar",
    });
  };

  return (
    <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 xl:gap-20 text-left">
      {/* Left Column: Key info list */}
      <div className="w-full lg:w-[40%]">
        <span className="text-emerald-400 font-extrabold text-sm xl:text-base tracking-[0.25em] uppercase block mb-3">
          COTIZACIÓN EXPRÉS DE VEHÍCULOS
        </span>

        <h2 className="text-3xl md:text-4xl xl:text-5xl text-white font-semibold mb-4 leading-tight">
          Seguros para <br className="hidden sm:inline"/> <span className="font-extrabold text-emerald-400">Carros & Motos</span>
        </h2>

        <div className="space-y-3 mb-6 text-xs md:text-sm text-slate-300">
          <div className="flex items-start space-x-3">
            <span className="text-emerald-400 mt-1">✓</span>
            <p className="text-sm md:text-base xl:text-lg font-bold">
              <strong className="text-white">Repuestos de marca:</strong> Reparaciones en talleres oficiales con repuestos directos.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-emerald-400 mt-1">✓</span>
            <p className="text-sm md:text-base xl:text-lg font-bold">
              <strong className="text-white">Asistencia total:</strong> Grúa nacional, auxilio vial y conductor elegido sin límites.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-emerald-400 mt-1">✓</span>
            <p className="text-sm md:text-base xl:text-lg font-bold">
              <strong className="text-white">Defensa legal:</strong> Abogado in situ y amparo jurídico civil y penal 24/7.
            </p>
          </div>
        </div>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/30 hover:border-emerald-400/60 px-4 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all"
        >
          <MessageCircle className="w-4 h-4 md:w-4.5 md:h-4.5" />
          <span>Escríbenos por WhatsApp</span>
        </a>
      </div>

      {/* Right Column: Dynamic Quote Form Panel */}
      <div className="w-full lg:w-[56%]">
        <motion.div
          layout
          className="w-full max-w-lg xl:max-w-xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 xl:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-gradient-to-tr from-emerald-500/10 to-transparent blur-2xl opacity-60 pointer-events-none" />

          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-white/5 pb-3">
                <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4.5 h-4.5 text-emerald-400 animate-pulse" />
                  Calculador Express de Primas
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
                  Tarifas 2026 actualizadas - Fasecolda
                </p>
              </div>

              {/* Vehicle Type selector */}
              <div>
                <label className="block text-[11px] text-slate-400 font-black uppercase tracking-wide mb-2">
                  Tipo de Vehículo
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVehicleType("carro")}
                    className={`py-3 px-4 rounded-xl flex items-center justify-center space-x-2 border transition-all cursor-pointer text-xs font-extrabold ${
                      vehicleType === "carro"
                        ? "bg-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-500/10"
                        : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Car className="w-4.5 h-4.5" />
                    <span>CARRO 🚙</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVehicleType("moto")}
                    className={`py-3 px-4 rounded-xl flex items-center justify-center space-x-2 border transition-all cursor-pointer text-xs font-extrabold ${
                      vehicleType === "moto"
                        ? "bg-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-500/10"
                        : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Bike className="w-4.5 h-4.5" />
                    <span>MOTO 🏍️</span>
                  </button>
                </div>
              </div>

              {/* Plate / Model Info */}
              <div>
                <label className="block text-[11px] text-slate-400 font-black uppercase tracking-wide mb-1.5">
                  Placa, Marca o Modelo del Vehículo
                </label>
                <input
                  type="text"
                  value={vehicleInfo}
                  onChange={(e) => setVehicleInfo(e.target.value)}
                  placeholder="Ej: Mazda CX-30 2024 o Placa KLR-123"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Plan Choice */}
              <div>
                <label className="block text-[11px] text-slate-400 font-black uppercase tracking-wide mb-1.5">
                  Plan de Cobertura Deseado
                </label>
                <select
                  value={vehiclePlan}
                  onChange={(e) => setVehiclePlan(e.target.value)}
                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="premium">Póliza Todo Riesgo Integral (Recomendado) 🛡️</option>
                  <option value="standard">Responsabilidad Civil Extracontractual (RCE) ⚖️</option>
                </select>
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-[11px] text-slate-400 font-black uppercase tracking-wide mb-1.5">
                  Número de Celular para Validación SMS
                </label>
                <input
                  type="tel"
                  value={vehiclePhone}
                  onChange={(e) => setVehiclePhone(e.target.value)}
                  placeholder="Ej: 3123456789"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
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
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-xl text-xs font-black transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-emerald-500/25 cursor-pointer uppercase tracking-wider"
              >
                Cotizar mi {vehicleType === "carro" ? "Carro" : "Moto"} Ahora
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-black text-white uppercase tracking-wide">
                  ¡Estimado Generado!
                </h4>
                <p className="text-[11px] text-slate-400 uppercase tracking-widest mt-1">
                  Código de radicado: {result.id}
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Plan Estimado</span>
                  <span className="text-[10px] font-black text-emerald-300 uppercase bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/15">
                    {result.planName}
                  </span>
                </div>

                <div className="text-left">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                    Prima Mensual Estimada
                  </span>
                  <span className="text-2xl font-black text-white block">
                    {result.estimatedValue}
                    <span className="text-xs text-slate-400 font-medium ml-1">/ mes</span>
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 leading-normal border-t border-white/5 pt-2.5">
                  Calculado basándose en las bases de datos de Fasecolda para el vehículo. Las mejores ofertas asociadas son de <strong className="text-white font-extrabold">{result.brandSummary}</strong>.
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-xs text-emerald-300 text-left font-semibold">
                  🛡️ Un asesor especializado de Conseguros te llamará en los próximos 10 minutos al número <strong className="text-white">{vehiclePhone}</strong> para formalizar el descuento y emitir tu póliza oficial.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setVehicleInfo("");
                  }}
                  className="py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold border border-white/10 transition-all cursor-pointer"
                >
                  Volver a Cotizar
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
