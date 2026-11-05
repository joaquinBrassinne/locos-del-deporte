import { Link } from 'react-router-dom';
import type { MapItem } from '../../data/mapData';

interface FeaturedSpacesCardsProps {
  items: MapItem[];
  onSelectSpace: (space: MapItem) => void;
  onVerDetalle: (space: MapItem) => void;
}

export const FeaturedSpacesCards = ({
  items,
  onSelectSpace,
  onVerDetalle,
}: FeaturedSpacesCardsProps) => {
  // Tomamos los 3 primeros espacios destacados de la lista recibida
  const destacados = items.slice(0, 3);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Cabecera de la sección */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h3 className="font-sport font-extrabold uppercase text-2xl sm:text-3xl text-white tracking-wide">
            ESPACIOS Y CLUBES DESTACADOS
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Puntos de entrenamiento y competencia cercanos en la ciudad
          </p>
        </div>

        <Link
          to="/clubes"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#E8C766] hover:text-[#f0d27e] transition-colors group shrink-0"
        >
          <span>Ver todos</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {/* Grid de 3 tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {destacados.map((item) => {
          const isClub = item.type === 'CLUB';
          const badgeDot = isClub ? 'bg-blue-500' : 'bg-emerald-500';
          const badgeText = isClub ? 'Club' : 'Cancha / Complejo';

          return (
            <div
              key={item.id}
              onClick={() => onSelectSpace(item)}
              className="bg-[#141414] hover:bg-[#1a1a1a] border border-neutral-800/80 hover:border-neutral-700/80 rounded-2xl p-5 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
            >
              <div>
                {/* Fila superior: Tipo y Distancia */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
                    <span className={`w-2 h-2 rounded-full ${badgeDot}`} />
                    <span>{badgeText}</span>
                  </div>
                  <span className="text-neutral-500 text-[11px] font-normal">
                    {item.distancia}
                  </span>
                </div>

                {/* Nombre de la institución */}
                <h4 className="font-sport font-bold text-lg text-white uppercase tracking-wide group-hover:text-[#E8C766] transition-colors leading-tight mb-1">
                  {item.nombre}
                </h4>

                {/* Dirección */}
                <p className="text-xs text-neutral-400 mb-4 line-clamp-1">
                  {item.direccion}
                </p>

                {/* Tags de disciplinas */}
                {item.disciplinas && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {item.disciplinas.slice(0, 3).map((disc, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#1e1e1e] text-neutral-300 border border-neutral-800"
                      >
                        {disc}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Fila inferior: Detalle de Sede y Botón Ver detalles */}
              <div className="pt-3 border-t border-neutral-800/70 flex items-center justify-between text-xs">
                <span className="text-neutral-500 text-[11px]">
                  {item.tipoDetalle}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onVerDetalle(item);
                  }}
                  className="text-xs font-bold text-[#E8C766] hover:text-[#f0d27e] transition-colors hover:underline cursor-pointer"
                >
                  Ver detalles
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedSpacesCards;
