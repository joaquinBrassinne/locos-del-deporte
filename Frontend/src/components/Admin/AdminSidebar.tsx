import { Link } from 'react-router-dom';
import { FaChartLine, FaRegClock, FaUsers, FaArrowLeft } from 'react-icons/fa';

interface Props {
  vistaActiva: 'solicitudes' | 'gestion';
  setVistaActiva: (vista: 'solicitudes' | 'gestion') => void;
}

export function AdminSidebar({ vistaActiva, setVistaActiva }: Props) {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#121212] border-r border-neutral-800 p-5">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-lg bg-[#E8C766] flex items-center justify-center font-sport font-bold text-black text-xl">
          RT
        </div>
        <div>
          <h1 className="font-sport font-bold text-white uppercase leading-none tracking-wide text-sm">ADMIN PANEL</h1>
          <span className="text-[10px] text-neutral-400 font-sans leading-none">RÍO TERCERO</span>
        </div>
      </div>

      <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">Gestión Institucional</div>
      
      <nav className="flex-1 space-y-1">
        <button 
          onClick={() => setVistaActiva('solicitudes')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${vistaActiva === 'solicitudes' ? 'font-bold bg-[#E8C766]/10 text-[#E8C766] border border-[#E8C766]/20' : 'font-medium text-neutral-400 hover:bg-neutral-800/50'}`}
        >
          <FaRegClock /> Solicitudes de Espacios
        </button>
        
        <button 
          onClick={() => setVistaActiva('gestion')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${vistaActiva === 'gestion' ? 'font-bold bg-[#E8C766]/10 text-[#E8C766] border border-[#E8C766]/20' : 'font-medium text-neutral-400 hover:bg-neutral-800/50'}`}
        >
          <FaUsers /> Gestión de Perfiles
        </button>
      </nav>

      <div className="mt-auto pt-5 border-t border-neutral-800">
        <Link to="/" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-400 hover:text-white transition-colors">
          <FaArrowLeft /> Volver al Sitio Público
        </Link>
      </div>
    </aside>
  );
}