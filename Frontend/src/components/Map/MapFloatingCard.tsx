import type { MapItem } from '../../data/mapData';

interface MapFloatingCardProps {
  item: MapItem;
  onClose: () => void;
  onVerDetalle: (item: MapItem) => void;
}

export const MapFloatingCard = ({ item, onClose, onVerDetalle }: MapFloatingCardProps) => {
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${item.coordenadas[0]},${item.coordenadas[1]}`;

  let badgeColor = 'text-blue-400';
  let badgeDot = 'bg-blue-500';
  let badgeLabel = 'CLUB DEPORTIVO';

  if (item.type === 'CANCHA') {
    badgeColor = 'text-emerald-400';
    badgeDot = 'bg-emerald-500';
    badgeLabel = 'CANCHA / COMPLEJO';
  } else if (item.type === 'DEPORTISTA') {
    badgeColor = 'text-[#E8C766]';
    badgeDot = 'bg-[#E8C766]';
    badgeLabel = 'DEPORTISTA';
  }

  return (
    <div
      className="absolute bottom-4 left-4 z-[1000] w-[calc(100%-2rem)] max-w-sm sm:w-84 bg-[#141414]/95 backdrop-blur-md border border-neutral-800 rounded-2xl p-4 text-white shadow-2xl animate-fadeIn pointer-events-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Cabecera del Card flotante */}
      <div className="flex items-center justify-between mb-3">
        <div className={`flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase ${badgeColor}`}>
          <span className={`w-2 h-2 rounded-full ${badgeDot}`} />
          <span>{badgeLabel}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-neutral-400 hover:text-white text-xs p-1 rounded-full hover:bg-neutral-800 transition-colors"
          title="Cerrar vista previa"
        >
          ✕
        </button>
      </div>

      {/* Contenido principal */}
      <div className="flex items-start gap-3 mb-4">
        {/* Avatar o Siglas */}
        <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-700/80 flex items-center justify-center font-sport font-bold text-xs text-white shrink-0 overflow-hidden shadow-inner">
          {item.fotoUrl ? (
            <img
              src={item.fotoUrl}
              alt={item.nombre}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <span>{item.siglas || item.nombre.slice(0, 3).toUpperCase()}</span>
          )}
        </div>

        {/* Datos y Tags */}
        <div className="min-w-0 flex-1">
          <h4 className="font-sport font-bold text-sm text-white uppercase leading-snug truncate">
            {item.nombre}
          </h4>
          <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5 truncate">
            <span className="text-[#E8C766] shrink-0">📍</span>
            <span className="truncate">{item.direccion}</span>
          </p>

          {item.disciplinas && item.disciplinas.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.disciplinas.slice(0, 3).map((disc, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-800/90 text-neutral-300 border border-neutral-700"
                >
                  {disc}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2 pt-1 border-t border-neutral-800/70">
        <button
          type="button"
          onClick={() => onVerDetalle(item)}
          className="flex-1 py-2 px-3 rounded-lg bg-[#E8C766] hover:bg-[#f0d27e] text-neutral-950 font-bold text-xs text-center shadow-md transition active:scale-95 cursor-pointer"
        >
          Ver Ficha Completa
        </button>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-3 rounded-lg border border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
        >
          <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span>Cómo llegar</span>
        </a>
      </div>
    </div>
  );
};

export default MapFloatingCard;
