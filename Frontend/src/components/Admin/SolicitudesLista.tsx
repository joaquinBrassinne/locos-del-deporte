import type { Solicitud } from '../../types/Index';
import { FaRegClock, FaEye } from 'react-icons/fa';

interface Props {
  solicitudes: Solicitud[];
  selectedId?: number;
  loading: boolean;
  onSelect: (solicitud: Solicitud) => void;
  onAprobar: (id: number) => void;
  onRechazar: (id: number) => void;
}

export function SolicitudesLista({ solicitudes, selectedId, loading, onSelect, onAprobar, onRechazar }: Props) {
  return (
    <div className="xl:col-span-7 flex flex-col h-full">
      <div className="flex justify-between items-end mb-4">
        <h3 className="font-sport font-bold text-lg text-white uppercase">Cola de Solicitudes Recientes</h3>
        <span className="text-xs text-neutral-500">Mostrando {solicitudes.length}</span>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 no-scrollbar">
        {loading && <p className="text-neutral-500 text-sm">Cargando...</p>}
        {!loading && solicitudes.length === 0 && <p className="text-neutral-500 text-sm italic">No hay solicitudes para mostrar.</p>}
        
        {solicitudes.map((sol) => {
          const datos = JSON.parse(sol.datosAdjuntos);
          const isClub = sol.tipo === 'CLUB';
          const isSelected = selectedId === sol.id;

          return (
            <article 
              key={sol.id} 
              className={`bg-[#161616] rounded-xl p-5 border transition-all cursor-pointer ${isSelected ? 'border-[#E8C766] shadow-lg shadow-[#E8C766]/5' : 'border-neutral-800 hover:border-neutral-600'}`}
              onClick={() => onSelect(sol)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-neutral-800 text-neutral-300 text-[10px] font-bold rounded flex items-center gap-1">
                    {isClub ? '🏢 CLUB' : '🏃 DEPORTISTA'}
                  </span>
                  {datos.deporteAdaptado && (
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded border border-emerald-500/20">
                      ▲ DEPORTE ADAPTADO
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                  <FaRegClock /> {new Date(sol.fechaEnvio || '').toLocaleDateString()}
                </span>
              </div>

              <h4 className="font-sport text-xl text-white font-bold tracking-wide uppercase">{isClub ? datos.nombreInstitucion : datos.nombre}</h4>
              <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
                <span className="text-neutral-500">📍</span> {isClub ? datos.direccion : (datos.clubNombre || 'Deportista Independiente')}
              </p>

              <div className="flex flex-wrap gap-2 mt-4 mb-5">
                {(isClub ? (datos.disciplinas?.split(',') || []) : [datos.deporte]).slice(0, 3).map((tag: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded text-[10px] text-neutral-300 font-medium">
                    {tag.trim()}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-neutral-800">
                <button className="flex-1 flex justify-center items-center gap-2 text-xs font-semibold text-neutral-300 hover:text-white py-2 cursor-pointer">
                  <FaEye /> Ver Detalle
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onRechazar(sol.id); }}
                  className="flex-1 text-xs font-semibold text-red-500 hover:text-red-400 py-2 transition-colors cursor-pointer"
                >
                  ✕ Rechazar
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onAprobar(sol.id); }}
                  className="flex-[1.5] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded shadow-lg shadow-emerald-900/20 transition-transform active:scale-95 cursor-pointer"
                >
                  ✓ Aprobar
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}