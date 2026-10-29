import { FaWheelchair } from 'react-icons/fa';

interface InclusiveCardProps {
  variante: 'club' | 'deportista';
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const InclusiveCard = ({ variante, checked, onChange }: InclusiveCardProps) => {
  const esClub = variante === 'club';

  return (
    <div className="p-6 sm:p-8 rounded-xl bg-[#161616] border border-[#262626] shadow-lg flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
          <FaWheelchair size={18} />
        </div>
        <div className="flex flex-col">
          {esClub && (
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Programa prioritario
            </span>
          )}
          <h3 className="font-sport text-lg text-white uppercase">
            {esClub ? 'Deporte Inclusivo / Adaptado' : 'Deporte Paralímpico / Adaptado'}
          </h3>
        </div>
      </div>

      {esClub && (
        <p className="text-sm text-neutral-300 max-w-3xl">
          Indicá si tu institución cuenta con infraestructura y programas para deporte
          adaptado e inclusivo. Esto se guarda como <code className="text-neutral-400">deporteAdaptado</code> y
          se usa para el filtro de deporte adaptado en el catálogo público.
        </p>
      )}

      <label className="flex items-start gap-4 p-4 rounded-lg bg-[#1f1f1f] hover:bg-[#242424] cursor-pointer transition-colors min-h-[56px]">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-6 h-6 mt-0.5 rounded bg-[#2a2a2a] accent-[#E8C766] cursor-pointer"
        />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">
            {esClub
              ? 'Sí, ofrecemos programas o infraestructura adaptada para personas con discapacidad'
              : 'Practico o compito en modalidad de deporte adaptado / paralímpico'}
          </span>
          <span className="text-xs text-neutral-500 mt-1">Opcional. Default: no marcado.</span>
        </div>
      </label>
    </div>
  );
};

export default InclusiveCard;
