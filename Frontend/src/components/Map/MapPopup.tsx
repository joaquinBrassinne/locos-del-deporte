import type { ClubWithCoords } from '../../utils/geoUtils';
import { repairEncoding } from '../../utils/textUtils';

interface MapPopupProps {
  club: ClubWithCoords;
  onVerDetalle: (club: ClubWithCoords) => void;
}

export const MapPopup = ({ club, onVerDetalle }: MapPopupProps) => {
  const cleanNombre = repairEncoding(club.nombreInstitucion);
  const cleanDireccion = repairEncoding(club.direccion);
  const cleanDescripcion = repairEncoding(club.descripcion);
  const cleanDisciplinas = club.disciplinas ? repairEncoding(club.disciplinas) : '';

  const disciplinasList = cleanDisciplinas
    ? cleanDisciplinas.split(',').map((d) => d.trim()).filter(Boolean)
    : [];

  const validFotos = (club.fotos || []).filter(
    (f) => f && typeof f === 'string' && !f.includes('string') && f.startsWith('http')
  );

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${club.parsedCoords[0]},${club.parsedCoords[1]}`;

  return (
    <div className="w-72 sm:w-80 text-neutral-200 select-text overflow-hidden font-sans">
      {/* Imagen si está disponible */}
      {validFotos.length > 0 && (
        <div className="relative h-28 -mx-4 -mt-3 mb-3 bg-neutral-900 overflow-hidden">
          <img
            src={validFotos[0]}
            alt={cleanNombre}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/30 to-transparent pointer-events-none" />
        </div>
      )}

      {/* Cabecera del popup */}
      <div className="space-y-1 mb-2.5">
        <h4 className="font-sport font-bold text-lg sm:text-xl text-white uppercase tracking-wide leading-tight">
          {cleanNombre}
        </h4>
        <p className="text-xs text-neutral-400 flex items-start gap-1 font-normal leading-snug">
          <span className="text-[#E8C766] shrink-0 mt-0.5">📍</span>
          <span>{cleanDireccion || 'Río Tercero, Córdoba'}</span>
        </p>
      </div>

      {/* Disciplinas */}
      {disciplinasList.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {disciplinasList.slice(0, 4).map((disc, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#E8C766] text-black shadow-sm"
            >
              {disc}
            </span>
          ))}
          {disciplinasList.length > 4 && (
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-800 text-neutral-400 border border-neutral-700">
              +{disciplinasList.length - 4} más
            </span>
          )}
        </div>
      )}

      {/* Badge Deporte Adaptado */}
      {club.deporteAdaptado && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 text-xs font-semibold mb-3">
          <span>♿</span>
          <span>Deporte adaptado e inclusivo</span>
        </div>
      )}

      {/* Descripción breve */}
      {cleanDescripcion && (
        <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed mb-3">
          {cleanDescripcion}
        </p>
      )}

      {/* Acciones */}
      <div className="border-t border-neutral-800 pt-2.5 mt-2 flex items-center justify-between gap-2">
        {/* Cómo llegar enlace externo */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-neutral-400 hover:text-[#E8C766] flex items-center gap-1 transition-colors font-medium py-1 px-2 rounded hover:bg-neutral-800/60"
          title="Ver ruta en Google Maps"
        >
          <span>🧭</span>
          <span>Cómo llegar</span>
        </a>

        {/* Ver detalle (Abre el modal nativo del club) */}
        <button
          type="button"
          onClick={() => onVerDetalle(club)}
          className="px-3.5 py-1.5 rounded-lg bg-[#E8C766] hover:bg-[#f0d27e] text-neutral-950 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
        >
          <span>Ver detalle</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default MapPopup;
