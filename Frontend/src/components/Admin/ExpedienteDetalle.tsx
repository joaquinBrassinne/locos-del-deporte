import type { Solicitud } from '../../types/Index';
import { FaIdBadge, FaCheck, FaTimes } from 'react-icons/fa';

interface Props {
  solicitud: Solicitud | null;
  onAprobar: (id: number) => void;
  onRechazar: (id: number) => void;
}

export function ExpedienteDetalle({ solicitud, onAprobar, onRechazar }: Props) {
  if (!solicitud) {
    return (
      <div className="xl:col-span-5 h-full">
        <div className="bg-[#161616] border border-neutral-800 rounded-2xl h-full flex flex-col items-center justify-center text-neutral-600 p-8 text-center shadow-xl">
          <FaIdBadge className="text-6xl mb-4 opacity-50" />
          <p className="text-sm font-medium">Seleccione una solicitud de la cola para visualizar el expediente completo.</p>
        </div>
      </div>
    );
  }

  const datosSelected = JSON.parse(solicitud.datosAdjuntos);

  return (
    <div className="xl:col-span-5 h-full">
      <div className="bg-[#161616] border border-neutral-800 rounded-2xl h-full flex flex-col overflow-hidden shadow-xl">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          
          <div className="p-6 border-b border-neutral-800 bg-neutral-900/30">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-[#E8C766] font-bold tracking-widest uppercase mb-1">Expediente Oficial</p>
                <h2 className="font-sport text-2xl font-bold text-white uppercase tracking-wide leading-tight">
                  Ficha: {solicitud.tipo === 'CLUB' ? datosSelected.nombreInstitucion : datosSelected.nombre}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-neutral-500 font-mono">REF-2026-</p>
                <p className="text-xs font-mono text-neutral-300">0{solicitud.id}9</p>
              </div>
            </div>
          </div>

          {datosSelected.fotos && datosSelected.fotos.length > 0 && (
            <div className="h-48 w-full bg-neutral-900 relative">
              <img src={datosSelected.fotos[0]} alt="Referencia" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161616] to-transparent"></div>
              
              <div className="absolute bottom-[-15px] left-6 right-6 bg-emerald-500 p-3 rounded-lg flex items-center justify-between shadow-lg text-neutral-950">
                <div className="flex items-center gap-2">
                  <FaCheck className="text-lg" />
                  <div>
                    <p className="text-[10px] font-bold uppercase leading-none">Identidad / Documentos</p>
                    <p className="text-sm font-black leading-none mt-1">Verificados</p>
                  </div>
                </div>
                {solicitud.tipo === 'DEPORTISTA' && datosSelected.edad && (
                  <div className="text-right border-l border-emerald-600 pl-3">
                    <p className="text-lg font-black leading-none">{datosSelected.edad}</p>
                    <p className="text-[10px] font-bold uppercase leading-none mt-0.5">Años</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={`px-6 pb-6 border-b border-neutral-800 grid grid-cols-2 gap-4 ${datosSelected.fotos && datosSelected.fotos.length > 0 ? 'pt-8' : 'pt-6'}`}>
            <div>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Teléfono Contacto</p>
              <p className="text-sm text-neutral-200 font-medium">{datosSelected.telefono || 'No provisto'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Email Institucional</p>
              <p className="text-sm text-[#E8C766] font-medium break-all">{datosSelected.email || 'No provisto'}</p>
            </div>
            <div className="col-span-2 mt-2">
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Georreferenciación / Ubicación</p>
              <p className="text-xs text-neutral-300 flex items-start gap-1">
                <span className="text-neutral-500 mt-0.5">📍</span> {datosSelected.coordenadas || datosSelected.direccion || (datosSelected.clubNombre ? `${datosSelected.clubNombre}, Río Tercero` : 'Río Tercero, Córdoba')}
              </p>
            </div>
          </div>

          <div className="p-6 border-b border-neutral-800">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3">
              {solicitud.tipo === 'CLUB' ? 'Descripción Institucional' : 'Trayectoria y Antecedentes'}
            </p>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {datosSelected.descripcion || datosSelected.historia || 'Sin descripción detallada adjunta al formulario original.'}
            </p>
          </div>

          <div className="p-6">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3">
              {solicitud.tipo === 'CLUB' ? 'Instalaciones y Horarios' : 'Logros Deportivos Homologados'}
            </p>
            
            {solicitud.tipo === 'CLUB' ? (
              <div className="space-y-3">
                {datosSelected.horarios && (
                  <div className="bg-neutral-900/50 p-3 rounded-lg border border-neutral-800 flex gap-3">
                    <span className="text-[#E8C766]">🕒</span>
                    <p className="text-xs text-neutral-300">{datosSelected.horarios}</p>
                  </div>
                )}
                <p className="text-xs text-neutral-400 mt-2"><strong>Disciplinas:</strong> {datosSelected.disciplinas}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {datosSelected.logros ? datosSelected.logros.split(/[\n,;]+/).filter(Boolean).map((logro: string, i: number) => (
                  <div key={i} className="bg-neutral-900/50 p-3 rounded-lg border border-neutral-800 flex gap-3 items-start">
                    <span className="text-[#E8C766]">🏆</span>
                    <p className="text-xs text-neutral-300 font-medium leading-tight pt-0.5">{logro.trim()}</p>
                  </div>
                )) : (
                  <p className="text-xs text-neutral-500 italic">No hay logros declarados.</p>
                )}
              </div>
            )}

            <div className="mt-8 space-y-3">
              <button 
                onClick={() => onAprobar(solicitud.id)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                <FaCheck /> Aprobar y Publicar en la Web
              </button>
              <button 
                onClick={() => onRechazar(solicitud.id)}
                className="w-full text-red-500 hover:text-red-400 font-semibold py-3 rounded-lg border border-transparent hover:border-red-900/30 hover:bg-red-500/5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaTimes /> Rechazar con Motivo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}