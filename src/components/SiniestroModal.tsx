import { useState, ElementType } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Car, 
  Flame, 
  Stethoscope, 
  Scale, 
  ShieldAlert, 
  Phone, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare, 
  HelpCircle,
  ExternalLink,
  ChevronRight
} from "lucide-react";

interface SiniestroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SiniestroType {
  id: string;
  name: string;
  description: string;
  icon: ElementType;
  color: string;
  bgColor: string;
  insurances: {
    name: string;
    description: string;
  }[];
  steps: string[];
  contacts: {
    agency: string;
    phone: string;
    type: "urgencia" | "atencion" | "conseguros";
  }[];
}

export default function SiniestroModal({ isOpen, onClose }: SiniestroModalProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedInsuranceIndex, setSelectedInsuranceIndex] = useState<number | null>(null);

  const siniestroTypes: SiniestroType[] = [
    {
      id: "automovil",
      name: "Accidente de Tránsito / Vehículos",
      description: "Colisiones, averías en vía de autos corporativos o transportadores oficiales.",
      icon: Car,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      insurances: [
        { name: "Póliza Todo Riesgo Autos", description: "Cubre daños propios, pérdidas totales y robo del vehículo de la empresa." },
        { name: "Responsabilidad Civil Contractual (RCC)", description: "Obligatorio para vehículos de transporte de pasajeros o mercancías mercantiles." },
        { name: "Seguro Obligatorio de Accidentes de Tránsito (SOAT)", description: "Cubre gastos médicos inmediatos para todos los lesionados en el accidente de tránsito." }
      ],
      steps: [
        "Mantenga la calma, encienda luces de parqueo y ponga los triángulos de seguridad.",
        "Verifique si hay heridos. Si los hay, llame inmediatamente al 123 y absténgase de moverlos.",
        "Tome registros fotográficos detallados de los carros, las placas, la señalización vial y el entorno.",
        "No asuma culpas ni firme acuerdos monetarios amigables. Deje que el inspector oficial designe el croquis.",
        "Comuníquese de inmediato con la aseguradora antes de desplazar o transferir el vehículo en grúas externas."
      ],
      contacts: [
        { agency: "Conseguros Urgencias Viales", phone: "+57 (310) 555-0199", type: "conseguros" },
        { agency: "Seguros SURA Col.", phone: "#434 o 01 8000 51 8888", type: "urgencia" },
        { agency: "AXA Colpatria", phone: "#247 o 01 8000 513 000", type: "urgencia" },
        { agency: "Allianz Seguros", phone: "#265 o 01 8000 514 400", type: "urgencia" },
        { agency: "Mapfre Colombia", phone: "#324 o 01 8000 970 020", type: "urgencia" }
      ]
    },
    {
      id: "salud_sst",
      name: "Accidente Laboral o Incapacidad SST",
      description: "Colaborador lesionado durante horario u operación oficial u urgencia médica.",
      icon: Stethoscope,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      insurances: [
        { name: "Administradora de Riesgos Laborales (ARL)", description: "Cubre atención médica al 100%, prestaciones por incapacidad laboral permanente o temporal." },
        { name: "Póliza de Salud Colectiva (Medicina Prepagada)", description: "Acceso prioritario a clínicas privadas de alto nivel y especialistas sin cuotas moderadoras." },
        { name: "Seguro de Vida Grupo", description: "Ampara el núcleo familiar en caso de invalidez accidental o fallecimiento del empleado." }
      ],
      steps: [
        "Preste los primeros auxilios básicos. Si es grave, remita inmediatamente al empleado a la clínica de convenio ARL más cercana.",
        "Notifique de inmediato al jefe directo del trabajador y al encargado de SST (Seguridad y Salud en el Trabajo).",
        "Reporte el accidente a la ARL correspondiente diligenciando el formulario FURAT dentro de las 48 horas hábiles.",
        "Mantenga guardados todos los soportes médicos, historias clínicas pioneras y órdenes de medicamentos.",
        "Remita una copia del radicado FURAT a Conseguros para realizar el seguimiento de incapacidades y reembolsos."
      ],
      contacts: [
        { agency: "Soporte Conseguros SST", phone: "+57 (312) 444-0280", type: "conseguros" },
        { agency: "ARL SURA", phone: "01 8000 511 414", type: "urgencia" },
        { agency: "ARL Positiva", phone: "01 8000 111 170", type: "urgencia" },
        { agency: "ARL Bolívar", phone: "01 8000 123 322", type: "urgencia" },
        { agency: "ARL Seguros Alfa", phone: "01 8000 122 532", type: "urgencia" }
      ]
    },
    {
      id: "daños_materiales",
      name: "Incendio, Robo o Daños Físicos",
      description: "Inundaciones, averías de maquinaria, incendios o robos en oficinas, locales o bodegas.",
      icon: Flame,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      insurances: [
        { name: "Seguro Multirriesgo PYME / Copropiedad", description: "Ampara toda la estructura física, maquinaria, inventario e incremento en costos de operación." },
        { name: "Póliza de Manejo, Sustracción y Hurto", description: "Respalda las pérdidas de efectivo, inventario comercial o herramientas tecnológicas por robo." },
        { name: "Rotura de Maquinaria y Equipo Electrónico", description: "Cubre daños internos repentinos en servidores informáticos, redes o maquinaria de producción." }
      ],
      steps: [
        "En caso de incendio o derrumbe, evacúe la edificación de inmediato y notifique a los Bomberos (119).",
        "En caso de robo, comuníquese con la Policía Nacional (123) y exija la preservación de la escena para huellas.",
        "Tome fotos amplias de los daños, cerraduras forzadas, techos caídos u oficinas inundadas para el perito.",
        "Radique la denuncia formal del hurto ante la Fiscalía General de la Nación antes de 24 horas y exija copia física.",
        "Elabore un inventario inicial detallado indicando referencias, marcas y valores de adquisición con facturas."
      ],
      contacts: [
        { agency: "Conseguros Siniestros Operaciones", phone: "+57 (310) 555-0199", type: "conseguros" },
        { agency: "Allianz Colombia Siniestros", phone: "#265", type: "urgencia" },
        { agency: "Seguros Bolívar", phone: "01 8000 123 322", type: "urgencia" },
        { agency: "SURA Empresas", phone: "#434", type: "urgencia" },
        { agency: "AXA Colpatria Empresas", phone: "#247", type: "urgencia" }
      ]
    },
    {
      id: "responsabilidad_civil",
      name: "Demandas de Clientes / Responsabilidad Civil",
      description: "Reclamaciones de terceros por daños causados durante la prestación de sus servicios.",
      icon: Scale,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      insurances: [
        { name: "Responsabilidad Civil Extracontractual (RCE)", description: "Resguarda el patrimonio de la empresa por reclamos de indemnización y perjuicios materiales o físicos a terceros." },
        { name: "Responsabilidad Civil Civil Profesional", description: "Cubre errores, omisiones, negligencias o fallas técnicas en servicios de consultoría, salud o ingeniería." },
        { name: "Póliza de Directores y Administradores (D&O)", description: "Protege el patrimonio personal de los directivos clave ante demandas de accionistas o reguladores." }
      ],
      steps: [
        "Absténgase de asumir culpas, negociar sumas de dinero o emitir declaraciones escritas de responsabilidad.",
        "Solicite al reclamante que formalice su queja de forma escrita con los soportes de los perjuicios sufridos.",
        "Recopile las bitácoras de trabajo, contratos asociados, actas de entrega, correos electrónicos y fichas técnicas.",
        "Comparta el expediente consolidado con el área jurídica de Conseguros para preparar el radicado.",
        "Espere la designación y directrices del abogado asignado oficialmente por la compañía de seguros."
      ],
      contacts: [
        { agency: "Conseguros Apoyo Jurídico", phone: "+57 (315) 333-0450", type: "conseguros" },
        { agency: "Seguros SURA Jurídicos", phone: "#434", type: "atencion" },
        { agency: "Chubb Seguros S.A.", phone: "01 8000 911 161", type: "atencion" },
        { agency: "Liberty Seguros", phone: "#015 o 01 8000 113 340", type: "atencion" }
      ]
    },
    {
      id: "ciberseguridad",
      name: "Ataques Informáticos / Fuga de Datos",
      description: "Servidores secuestrados (Ransomware), robo de bases de datos de clientes o estafas online.",
      icon: ShieldAlert,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      insurances: [
        { name: "Seguro de Riesgo Cibernético (Cyber)", description: "Cubre rescates, forenses de datos, multas de la SIC (Superindustria), defensa legal y pérdida de ingresos." },
        { name: "Infidelidad y Riesgros Financieros (BBB)", description: "Ampara estafas, suplantación o robos electrónicos ejecutados por empleados o terceros maliciosos." }
      ],
      steps: [
        "Desconecte de forma física el cable de red o apague el Wi-Fi de los equipos afectados, pero NO apague los servidores.",
        "Identifique el alcance preliminar (ej. si afecta ERP, bases de datos o solamente correos corporativos).",
        "No intente negociar con los secuestradores informáticos ni haga clic en enlaces de rescate.",
        "Notifique inmediatamente al Oficial de Protección de Datos Personales para coordinar la alerta a la SIC.",
        "Tenga a la mano la póliza cibernética para habilitar la atención forense de contingencia de urgencia en menos de 2 horas."
      ],
      contacts: [
        { agency: "Conseguros Ciber-Urgente", phone: "+57 (310) 555-0199", type: "conseguros" },
        { agency: "SURA Central de Ciber-Riesgo", phone: "#434", type: "urgencia" },
        { agency: "Chubb Cyber Response", phone: "01 8000 911 161", type: "urgencia" },
        { agency: "Allianz Incident Room", phone: "#265", type: "urgencia" }
      ]
    }
  ];

  const handleSelectType = (id: string) => {
    setSelectedType(id);
    setSelectedInsuranceIndex(0); // auto-select first recommended insurance
  };

  const currentSiniestro = siniestroTypes.find(t => t.id === selectedType);

  // Generate dynamic WhatsApp link for Colombia with custom accident description
  const getWhatsAppLink = () => {
    let text = "Hola Conseguros, acabo de tener una emergencia y necesito su asesoría prioritaria.";
    if (currentSiniestro) {
      text = `Hola Conseguros, necesito asistencia prioritaria para un siniestro del tipo: *${currentSiniestro.name}*. Agradezco de antemano el contacto de un corredor.`;
      if (selectedInsuranceIndex !== null && currentSiniestro.insurances[selectedInsuranceIndex]) {
        text += ` Específicamente sobre la cobertura: *${currentSiniestro.insurances[selectedInsuranceIndex].name}*.`;
      }
    }
    return `https://wa.me/573105550199?text=${encodeURIComponent(text)}`;
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
        className="bg-white rounded-[2.5rem] w-full max-w-4xl relative overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row z-10 h-[90vh] md:h-[75vh]"
      >
        
        {/* Left Column - Incident Picker */}
        <div className="w-full md:w-2/5 bg-slate-50 border-r border-gray-150 p-6 flex flex-col h-1/2 md:h-full justify-between">
          <div>
            <div className="flex items-center space-x-2 text-rose-600 mb-4">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">Centro de Asistencia de Siniestros</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#0F1740] mb-2 leading-tight">¿Tienes una emergencia de seguros?</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Selecciona el tipo de suceso o accidente que presentó tu empresa. Te guiaremos paso a paso con números inmediatos de atención.
            </p>

            <div className="space-y-2.5 max-h-[50%] md:max-h-[38vh] overflow-y-auto pr-1">
              {siniestroTypes.map((item) => {
                const Icon = item.icon;
                const isSelected = item.id === selectedType;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectType(item.id)}
                    className={`w-full flex items-center p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "border-[#121ccf] bg-blue-50/50 ring-1 ring-[#121ccf]"
                        : "border-gray-200 bg-white hover:bg-slate-100/50"
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl mr-3 shrink-0 ${item.bgColor} ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-grow">
                      <div className="text-xs font-extrabold text-gray-900 leading-tight">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 ml-1" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-150 mt-4 flex items-center justify-between text-[11px] text-gray-400">
            <span className="font-semibold">Líneas habilitadas 24/7 en Colombia</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
        </div>

        {/* Right Column - Actionable Steps & Hotlines */}
        <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-between h-1/2 md:h-full overflow-y-auto">
          
          {/* Close button on top-right */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-gray-500 hover:text-gray-900 transition-all z-10 cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>

          <AnimatePresence mode="wait">
            {currentSiniestro ? (
              <motion.div
                key={currentSiniestro.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 flex-grow flex flex-col justify-between"
              >
                <div>
                  <div className="border-b pb-4">
                    <span className="text-xs font-bold text-gray-450 uppercase tracking-widest block mb-1">Diagnóstico del Siniestro</span>
                    <h4 className="text-xl font-extrabold text-[#0F1740]">{currentSiniestro.name}</h4>
                  </div>

                  {/* Insurance Selector */}
                  <div className="mt-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">1. Selecciona la Póliza Afectada que necesitas:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentSiniestro.insurances.map((ins, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedInsuranceIndex(idx)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            selectedInsuranceIndex === idx
                              ? "border-[#121ccf] bg-blue-50/20 ring-1 ring-[#121ccf]"
                              : "border-gray-200 hover:bg-slate-50"
                          }`}
                        >
                          <div className="font-bold text-xs text-slate-800 flex items-center">
                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${selectedInsuranceIndex === idx ? "bg-[#121ccf]" : "bg-gray-400"}`} />
                            {ins.name}
                          </div>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">{ins.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Steps/Guidelines */}
                  <div className="mt-5 bg-slate-50 p-4.5 rounded-2xl border border-slate-200/60">
                    <h5 className="text-xs md:text-sm font-bold text-[#0F1740] uppercase tracking-wider mb-2.5 flex items-center">
                      <span className="w-5 h-5 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center mr-1.5">✓</span>
                      Pasos obligatorios a seguir inmediatamente:
                    </h5>
                    <ul className="space-y-1.5 text-xs text-gray-650 font-medium">
                      {currentSiniestro.steps.map((stepMsg, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-brand-blue font-bold mr-1.5">{idx + 1}.</span>
                          <span className="leading-normal">{stepMsg}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Telephone numbers of insurers */}
                  <div className="mt-5">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">2. Comunícate con tu Aseguradora o Corredor:</label>
                    <div className="flex flex-wrap gap-2">
                      {currentSiniestro.contacts.map((contact, idx) => (
                        <a
                          key={idx}
                          href={`tel:${contact.phone.replace(/[\s#]/g, "")}`}
                          className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            contact.type === "conseguros"
                              ? "bg-blue-600/10 text-brand-blue border-blue-200 hover:bg-blue-600/15"
                              : "bg-white text-gray-700 hover:bg-slate-100 border-gray-200"
                          }`}
                        >
                          <Phone className="w-3.5 h-3.5 text-gray-450 shrink-0" />
                          <span className="text-xs">{contact.agency}:</span>
                          <span className="font-mono font-bold text-gray-900 border-b border-dashed border-gray-400 pb-0.5">{contact.phone}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom CTA buttons - WhatsApp & Emergency support */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex-grow bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-full text-xs font-extrabold transition-all shadow-md shadow-emerald-100 text-center flex items-center justify-center gap-2"
                  >
                    {/* Simplified Messenger/WhatsApp SVG representation */}
                    <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.156 5.156 0 11.487 0c3.069.001 5.95 1.192 8.113 3.359s3.355 5.047 3.353 8.117c-.003 6.326-5.157 11.482-11.487 11.482-2.001 0-3.971-.521-5.719-1.517L0 24zm6.59-4.846c1.6.95 3.1 1.45 4.881 1.458 5.176 0 9.385-4.207 9.388-9.392.002-2.511-.973-4.87-2.748-6.649-1.776-1.779-4.137-2.757-6.65-2.759-5.176 0-9.386 4.207-9.389 9.393-.001 1.83.493 3.385 1.477 4.966l-.997 3.642 3.738-.981c.001 0 .001 0 0 0zm10.74-6.853c-.3-.15-1.78-.88-2.05-.98-.28-.1-.47-.15-.67.15-.2.3-.77.98-.95 1.18-.18.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.5-1-.89-1.66-2-1.86-2.3-.2-.3-.02-.47.13-.62.14-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.67-1.62-.92-2.22-.25-.6-.5-.52-.67-.53l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.51s1.08 2.92 1.23 3.12c.15.2 2.13 3.25 5.17 4.56.72.31 1.28.5 1.72.64.73.23 1.39.2 1.92.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.08-.13-.28-.2-.58-.35z"/>
                    </svg>
                    <span>Asistente de Emergencia (WhatsApp)</span>
                  </a>
                  
                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-gray-700 px-6 py-3.5 rounded-full text-xs font-bold transition-all"
                  >
                    Entendido, salir
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-16 h-full space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-rose-500 border border-rose-100">
                  <ShieldAlert className="w-8 h-8 animate-pulse" />
                </div>
                <h4 className="text-lg font-bold text-[#0F1740]">Por favor, selecciona una categoría</h4>
                <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                  Elige a la izquierda el tipo de eventualidad que estás experimentando para brindarte los pasos jurídicos aconsejados y las números de contacto directos.
                </p>
              </div>
            )}
          </AnimatePresence>

        </div>

      </motion.div>
    </div>
  );
}
