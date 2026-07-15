import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowRight, ShieldCheck, Mail, ClipboardSignature, Check, ShieldAlert } from "lucide-react";
import { ConsultationRequest } from "../types";

interface NavbarProps {
  onOpenWizard: () => void;
  onSaveConsultation: (req: ConsultationRequest) => void;
  onOpenSiniestro: () => void;
}

export default function Navbar({ onOpenWizard, onSaveConsultation, onOpenSiniestro }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScroll = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header className="w-full py-3.5 px-8 md:px-16 flex items-center justify-between bg-white border-b border-gray-50 sticky top-0 z-45 shadow-2xs backdrop-blur-md bg-white/95">
        {/* Logo */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} 
          className="flex items-center cursor-pointer select-none pl-3 md:pl-8" 
          data-purpose="logo-container"
        >
          <img 
            src="/images/conegurosSinFondo.png" 
            alt="Conseguros" 
            className="h-11 md:h-15 w-auto object-contain transition-transform hover:scale-[1.03]" 
            referrerPolicy="no-referrer" 
          />
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-gray-650 font-bold" data-purpose="main-navigation">
          <button onClick={() => handleScroll("cotizar")} className="hover:text-brand-blue transition-colors cursor-pointer text-[14px] md:text-[15px]">
            Cotiza
          </button>
          <button onClick={() => handleScroll("nuestros-servicios")} className="hover:text-brand-blue transition-colors cursor-pointer text-[14px] md:text-[15px]">
            Servicios
          </button>
          <button onClick={() => handleScroll("proceso")} className="hover:text-brand-blue transition-colors cursor-pointer text-[14px] md:text-[15px]">
            Proceso
          </button>
          <button onClick={() => handleScroll("nosotros")} className="hover:text-brand-blue transition-colors cursor-pointer text-[14px] md:text-[15px]">
            Nosotros
          </button>
          <button onClick={() => handleScroll("contacto")} className="hover:text-brand-blue transition-colors cursor-pointer text-[14px] md:text-[15px]">
            Contácto
          </button>
        </nav>

        {/* Header CTA */}
        <div className="hidden lg:flex items-center space-x-3" data-purpose="header-cta">
          <button
            onClick={onOpenSiniestro}
            className="group relative overflow-hidden bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white px-4.5 py-2.5 rounded-full font-black tracking-wide text-[11px] cursor-pointer flex items-center shadow-[0_4px_14px_rgba(244,63,94,0.3)] hover:shadow-[0_6px_18px_rgba(244,63,94,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-rose-450/20 animate-attention"
          >
            {/* Sliding Gloss Shine Line on Hover */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[none] transition-transform duration-1000 ease-out-in" style={{ transform: "translateX(-100%)", transition: "transform 0.6s ease" }} />
            <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
            
            <span className="relative flex h-1.5 w-1.5 mr-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-85"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
            </span>
            <ShieldAlert className="w-3.5 h-3.5 mr-1 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
            <span className="relative z-10">¿Tuviste un siniestro?</span>
          </button>

          <button
            onClick={onOpenWizard}
            className="bg-brand-blue text-white px-5 py-2.5 rounded-full font-extrabold hover:bg-blue-800 transition-all text-xs cursor-pointer shadow-md shadow-blue-105 active:scale-[0.98]"
          >
            Agenda tú asesoría
          </button>
        </div>

        {/* Mobile Hamburger & Urgencia Button */}
        <div className="lg:hidden flex items-center space-x-2">
          <button
            onClick={onOpenSiniestro}
            className="group relative overflow-hidden bg-gradient-to-r from-rose-500 to-red-650 text-white px-4 py-2 rounded-full font-bold tracking-wider text-xs cursor-pointer shadow-[0_3px_12px_rgba(244,63,94,0.3)] active:scale-[0.95] flex items-center space-x-1.5 border border-rose-400/25 transition-all animate-attention"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-85"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-wider">Urgencia</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100 text-[#0F1740] transition-colors border border-gray-100/30"
            aria-label="Menú móvil"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Slide Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="relative w-72 bg-white h-full p-6 flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between border-b pb-5 mb-6">
                  <div className="text-xl font-extrabold tracking-tight text-[#0F1740]">
                    <img 
                      src="/images/conegurosSinFondo.png" 
                      alt="Conseguros" 
                      className="h-11 w-auto object-contain" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col space-y-5">
                  <button
                    onClick={() => handleScroll("cotizar")}
                    className="w-full text-left text-base md:text-lg font-black text-gray-800 py-2 hover:text-brand-blue transition-colors"
                  >
                    Cotiza
                  </button>
                  <button
                    onClick={() => handleScroll("nuestros-servicios")}
                    className="w-full text-left text-base md:text-lg font-black text-gray-800 py-2 hover:text-brand-blue transition-colors"
                  >
                    Servicios
                  </button>
                  <button
                    onClick={() => handleScroll("proceso")}
                    className="w-full text-left text-base md:text-lg font-black text-gray-800 py-2 hover:text-brand-blue transition-colors"
                  >
                    Proceso
                  </button>
                  <button
                    onClick={() => handleScroll("nosotros")}
                    className="w-full text-left text-base md:text-lg font-black text-gray-800 py-2 hover:text-brand-blue transition-colors"
                  >
                    Nosotros
                  </button>
                  <button
                    onClick={() => handleScroll("contacto")}
                    className="w-full text-left text-base md:text-lg font-black text-gray-800 py-2 hover:text-brand-blue transition-colors"
                  >
                    Contácto
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenSiniestro();
                    }}
                    className="w-full text-left text-sm font-extrabold text-rose-650 py-2 hover:text-rose-700 transition-colors flex items-center"
                  >
                    <span className="relative flex h-2 w-2 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-450 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                    </span>
                    <span>Reportar Siniestro</span>
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenWizard();
                  }}
                  className="w-full bg-brand-blue hover:bg-blue-850 text-white py-3.5 rounded-full font-bold text-xs transition-all shadow-lg"
                >
                  Agenda tú asesoría
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


    </>
  );
}
