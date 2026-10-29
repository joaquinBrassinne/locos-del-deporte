import { useEffect } from 'react';
import type { Club } from '../../types/Index';
import { repairEncoding, extractBarrio, extractAnioFundacion } from '../../utils/textUtils';

interface ClubDetailModalProps {
  club: Club | null;
  onClose: () => void;
}

export const ClubDetailModal = ({ club, onClose }: ClubDetailModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!club) return null;

  const cleanNombre = repairEncoding(club.nombreInstitucion);
  const cleanDireccion = repairEncoding(club.direccion);
  const cleanDescripcion = repairEncoding(club.descripcion);
  const cleanHorarios = repairEncoding(club.horarios);
  const cleanDisciplinas = club.disciplinas ? repairEncoding(club.disciplinas) : '';
  const barrio = extractBarrio(cleanDireccion);
  const anio = extractAnioFundacion(club);

  const disciplinasList = cleanDisciplinas
    ? cleanDisciplinas.split(',').map((d) => d.trim()).filter(Boolean)
    : [];

  const validFotos = (club.fotos || []).filter((f) => f && !f.includes('string'));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#161616] border border-[#2a2a2a] rounded-2xl shadow-2xl text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-neutral-300 hover:text-white border border-neutral-700/50 flex items-center justify-center transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Portada / Header Modal */}
        <div className="relative h-60 w-full bg-neutral-900 overflow-hidden">
          {validFotos.length > 0 ? (
            <img
              src={validFotos[0]}
              alt={cleanNombre}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-[#222] to-[#141414] flex items-center justify-center">
              <svg
                className="w-20 h-20 text-neutral-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/40 to-transparent pointer-events-none" />

          {/* Badges superiores */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
            {disciplinasList.map((disc, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-md text-xs font-semibold bg-[#E8C766] text-black shadow-md"
              >
                {disc}
              </span>
            ))}
            {club.deporteAdaptado && (
              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 backdrop-blur-sm">
                Deporte Inclusivo
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm flex items-center gap-1">
              ✓ Verificado
            </span>
          </div>

          {/* Título sobre imagen */}
          <div className="absolute bottom-4 left-6 right-6 z-10">
            <h2 className="font-sport font-bold text-3xl sm:text-4xl text-white uppercase tracking-wide leading-tight drop-shadow-md">
              {cleanNombre}
            </h2>
            <div className="text-xs sm:text-sm text-neutral-300 flex items-center gap-4 mt-1.5 font-medium">
              <span>📍 {cleanDireccion || `${barrio}, Río Tercero`}</span>
              {anio && <span>📅 Fundado en {anio}</span>}
            </div>
          </div>
        </div>

        {/* Contenido Modal */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Descripción */}
          <div>
            <h3 className="text-xs font-semibold text-[#E8C766] uppercase tracking-wider mb-2">
              Sobre la Institución
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {cleanDescripcion || `${cleanNombre} es una institución deportiva de Río Tercero.`}
            </p>
          </div>

          {/* Instalaciones */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <span>🏛️</span>
              <span>Instalaciones</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {(club.instalaciones && club.instalaciones.length > 0
                ? club.instalaciones
                : ['Vestuarios', 'Instalaciones deportivas']
              ).map((inst, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-[#202020] text-neutral-200 text-xs border border-neutral-700/60 font-medium"
                >
                  {inst}
                </span>
              ))}
            </div>
          </div>

          {/* Horarios */}
          {cleanHorarios && (
            <div className="bg-[#1c1c1c] border border-neutral-800 rounded-xl p-4 flex items-start gap-3">
              <span className="text-xl">🕒</span>
              <div>
                <div className="text-xs text-neutral-400 uppercase font-semibold">Horarios de Actividades</div>
                <div className="text-sm text-white font-medium mt-0.5">
                  {cleanHorarios}
                </div>
              </div>
            </div>
          )}

          {/* Galería adicional si hay más fotos */}
          {validFotos.length > 1 && (
            <div>
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                Galería de Fotos
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {validFotos.map((foto, idx) => (
                  <img
                    key={idx}
                    src={foto}
                    alt={`${cleanNombre} foto ${idx + 1}`}
                    className="w-full h-28 object-cover rounded-lg border border-neutral-800"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Contacto & Enlaces */}
          <div className="border-t border-neutral-800/80 pt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {club.telefono && (
                <a
                  href={`tel:${club.telefono}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#222] hover:bg-[#2c2c2c] text-neutral-200 hover:text-white text-xs font-semibold border border-neutral-700/70 transition-colors"
                >
                  <span>📞</span>
                  <span>{club.telefono}</span>
                </a>
              )}
              {club.email && (
                <a
                  href={`mailto:${club.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#222] hover:bg-[#2c2c2c] text-neutral-200 hover:text-white text-xs font-semibold border border-neutral-700/70 transition-colors"
                >
                  <span>✉️</span>
                  <span>{club.email}</span>
                </a>
              )}
            </div>

            {club.sitioWebUrl && (
              <a
                href={club.sitioWebUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E8C766] hover:bg-[#f0d27e] text-neutral-950 text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <span>Visitar Sitio Web</span>
                <span>↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetailModal;
