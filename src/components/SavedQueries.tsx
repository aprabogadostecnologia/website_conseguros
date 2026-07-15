import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FolderHeart, Calendar, Trash2 } from "lucide-react";
import { ConsultationRequest } from "../types";

interface SavedQueriesProps {
  requests: ConsultationRequest[];
  onClear: () => void;
  onRemove: (id: string) => void;
}

export default function SavedQueries({ requests, onClear, onRemove }: SavedQueriesProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#0F1740] hover:bg-brand-blue text-white p-4 rounded-full shadow-2xl flex items-center space-x-2 transition-all hover:scale-105 relative group cursor-pointer border border-[#1d265a]"
        >
          <FolderHeart className="w-5 h-5" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-sm font-bold whitespace-nowrap">
            Mis Solicitudes
          </span>
          {requests.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5.5 h-5.5 bg-rose-500 rounded-full font-bold text-xs text-white flex items-center justify-center animate-pulse">
              {requests.length}
            </span>
          )}
        </button>
      </div>

      {/* Floating sliding drawer panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
            {/* Backdrop click closer */}
            <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 200 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl rounded-l-3xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b pb-5 mb-5">
                  <div className="flex items-center space-x-2 text-[#0F1740]">
                    <Calendar className="w-5 h-5 text-brand-blue" />
                    <h3 className="text-lg font-extrabold">Historial de Gestiones</h3>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-xs font-bold text-gray-400 hover:text-gray-900 bg-slate-100 hover:bg-slate-200 px-3/5 py-1.5 rounded-full transition-colors"
                  >
                    Cerrar✕
                  </button>
                </div>

                <p className="text-sm text-gray-550 mb-4 font-semibold">
                  Aquí puedes ver las cotizaciones simuladas y asesorías registradas localmente en este dispositivo:
                </p>

                {requests.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-gray-100 bg-slate-50/50">
                    <p className="text-sm text-gray-400 font-semibold mb-2">No tienes solicitudes guardadas</p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Utiliza nuestro cotizador inteligente de seguros o el asistente virtual de riesgo para registrar tu primera asesoría.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                    {requests.map((req) => (
                      <div
                        key={req.id}
                        className="bg-[#fcfdfe] p-4 rounded-2xl border border-blue-50/70 hover:border-blue-100 transition-all flex flex-col justify-between"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-mono font-bold bg-blue-50 text-brand-blue/90 px-2 py-0.5 rounded-md">
                            {req.id}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">{req.timestamp}</span>
                        </div>
                        <div className="text-sm font-extrabold text-[#0F1740] mb-1">
                          {req.riskCategory}
                        </div>
                        {req.companySize && (
                          <div className="text-xs text-gray-500 mb-2">
                            <span className="font-semibold text-gray-400">Escala:</span> {req.companySize}
                          </div>
                        )}
                        <p className="text-sm text-gray-700 bg-slate-50/80 p-2.5 rounded-xl leading-normal border border-slate-100">
                          {req.notes}
                        </p>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                          <span className="flex items-center text-xs font-bold text-amber-600">
                            <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
                            Pendiente por Agente
                          </span>
                          <button
                            onClick={() => onRemove(req.id)}
                            className="p-1 rounded-lg text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                            title="Eliminar historial"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {requests.length > 0 && (
                <div className="pt-6 border-t mt-4">
                  <button
                    onClick={onClear}
                    className="w-full bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-gray-500 py-3 rounded-full font-bold text-xs transition-all flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Limpiar todo el historial</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
