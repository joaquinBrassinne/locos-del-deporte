import { FaBuilding, FaRunning } from 'react-icons/fa';
import type { Tipo } from '../../types/Index';

interface TipoTabsProps {
  tipo: Tipo;
  onChange: (tipo: Tipo) => void;
}

export const TipoTabs = ({ tipo, onChange }: TipoTabsProps) => {
  const base =
    'flex-1 sm:flex-initial h-12 px-6 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95';

  return (
    <div className="w-full flex justify-center">
      <div className="inline-flex p-1.5 rounded-xl bg-[#1c1c1c] gap-2 max-w-lg w-full sm:w-auto shadow-inner" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tipo === 'CLUB'}
          onClick={() => onChange('CLUB')}
          className={`${base} ${
            tipo === 'CLUB' ? 'bg-[#E8C766] text-black shadow-md' : 'bg-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <FaBuilding /> SOY UN CLUB / INSTITUCIÓN
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tipo === 'DEPORTISTA'}
          onClick={() => onChange('DEPORTISTA')}
          className={`${base} ${
            tipo === 'DEPORTISTA' ? 'bg-[#E8C766] text-black shadow-md' : 'bg-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <FaRunning /> SOY DEPORTISTA
        </button>
      </div>
    </div>
  );
};

export default TipoTabs;
