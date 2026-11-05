import { FaSignOutAlt, FaRegClock, FaCheck, FaUsers } from 'react-icons/fa';

interface Props {
  pendientesCount: number;
  filtro: 'Todos' | 'CLUB' | 'DEPORTISTA';
  setFiltro: (tipo: 'Todos' | 'CLUB' | 'DEPORTISTA') => void;
  onLogout: () => void;
}

export function AdminHeader({ pendientesCount, filtro, setFiltro, onLogout }: Props) {
  return (
    <header className="p-6 lg:p-8 pb-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#161616] p-5 rounded-2xl border border-neutral-800 shadow-lg">
        <div>
          <h2 className="text-2xl lg:text-3xl font-sport font-bold text-white uppercase tracking-wide flex items-center gap-2">
            PANEL DE ADMINISTRACIÓN
          </h2>
          <p className="text-xs text-neutral-400 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E8C766]"></span> 
            MODO AUDITORÍA / ADMIN — Revisión ciudadana
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800">
            <div className="w-8 h-8 rounded-full bg-[#E8C766] flex items-center justify-center text-black font-bold">A</div>
            <div className="text-xs">
              <p className="text-white font-semibold">deportes@riotercero.gov.ar</p>
              <p className="text-emerald-400">Nivel 4 - Auditor Titular</p>
            </div>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-neutral-400 hover:text-red-400 border border-neutral-800 hover:border-red-500/30 hover:bg-red-500/10 transition-all cursor-pointer">
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-neutral-900/50 border border-[#E8C766]/30 p-4 rounded-xl flex justify-between items-end border-b-2 border-b-[#E8C766]">
          <div>
            <p className="text-[10px] text-[#E8C766] font-bold tracking-widest uppercase mb-1">Bandeja de Entrada</p>
            <div className="text-4xl font-sport font-bold text-white">{pendientesCount < 10 ? `0${pendientesCount}` : pendientesCount}</div>
            <p className="text-xs text-neutral-500">pendientes de revisión</p>
          </div>
          <FaRegClock className="text-[#E8C766] text-2xl mb-1 opacity-80" />
        </div>
        <div className="bg-neutral-900/50 border border-emerald-500/30 p-4 rounded-xl flex justify-between items-end border-b-2 border-b-emerald-500">
          <div>
            <p className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase mb-1">Impacto Mensual</p>
            <div className="text-4xl font-sport font-bold text-white">24</div>
            <p className="text-xs text-neutral-500">aprobadas este mes</p>
          </div>
          <FaCheck className="text-emerald-500 text-2xl mb-1 opacity-80" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-6">
        {(['Todos', 'CLUB', 'DEPORTISTA'] as const).map(tipo => (
          <button 
            key={tipo}
            onClick={() => setFiltro(tipo)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${filtro === tipo ? 'bg-[#E8C766] text-black border-[#E8C766]' : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-600'}`}
          >
            {tipo === 'Todos' ? 'Todos' : tipo === 'CLUB' ? 'Clubes' : 'Deportistas'}
          </button>
        ))}
      </div>
    </header>
  );
}