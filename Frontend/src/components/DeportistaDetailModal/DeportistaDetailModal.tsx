import { useEffect } from 'react';
import type { Deportista } from '../../types/Index';
import { repairEncoding } from '../../utils/textUtils';

interface DeportistaDetailModalProps {
  deportista: Deportista | null;
  onClose: () => void;
}

export const DeportistaDetailModal = ({ deportista, onClose }: DeportistaDetailModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!deportista) return null;

  const cleanNombre = repairEncoding(deportista.nombre);
  const cleanDeporte = repairEncoding(deportista.deporte);
  const cleanHistoria = repairEncoding(deportista.historia);
  const cleanLogros = repairEncoding(deportista.logros);
  const cleanSubtitulo = repairEncoding(deportista.subtitulo);

  const isAdaptado = Boolean(deportista.deporteAdaptado);

  const validFotos = (deportista.fotos || []).filter(
    (f) => f && !f.includes('string')
  );

  const logrosList = cleanLogros
    ? cleanLogros
        .split(/[\r\n;]+/)
        .map((l) => l.trim().replace(/^[•\-\*]\s*/, ''))
        .filter(Boolean)
    : [];

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
        <div className="relative h-64 w-full bg-neutral-900 overflow-hidden">
          {validFotos.length > 0 ? (
            <img
              src={validFotos[0]}
              alt={cleanNombre}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-[#222] to-[#141414] flex items-center justify-center">
              <span className="font-sport text-6xl text-neutral-600 font-bold uppercase">
                {cleanNombre.slice(0, 2)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/40 to-transparent pointer-events-none" />

          {/* Badges superiores */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-md text-xs font-semibold bg-[#E8C766] text-black shadow-md uppercase">
              {cleanDeporte}
            </span>
            {isAdaptado && (
              <span className="px-3 py-1 rounded-md text-xs font-extrabold bg-[#2dd4bf] text-black shadow-md uppercase">
                Deporte Adaptado
              </span>
            )}
          </div>

          {/* Título sobre imagen */}
          <div className="absolute bottom-4 left-6 right-6 z-10">
            <h2 className="font-sport font-bold text-3xl sm:text-4xl text-white uppercase tracking-wide leading-tight drop-shadow-md">
              {cleanNombre}
            </h2>
            <div className="text-xs sm:text-sm text-neutral-300 flex items-center gap-4 mt-1.5 font-medium">
              <span>📍 {deportista.zona || deportista.clubNombre || 'Río Tercero'}</span>
              {deportista.edad && <span>🎂 {deportista.edad} años</span>}
            </div>
          </div>
        </div>

        {/* Contenido Modal */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Subtítulo o Bajada */}
          {cleanSubtitulo && (
            <div className="bg-[#1f1f1f]/60 p-4 rounded-xl border border-neutral-800 text-sm text-neutral-200 font-medium">
              {cleanSubtitulo}
            </div>
          )}

          {/* Historia Completa */}
          <div>
            <h3 className="text-xs font-semibold text-[#E8C766] uppercase tracking-wider mb-2">
              Historia y Trayectoria
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
              {cleanHistoria || `${cleanNombre} es un destacado exponente del deporte de Río Tercero.`}
            </p>
          </div>

          {/* Logros */}
          {logrosList.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-[#E8C766] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <span>🏆</span>
                <span>Principales Logros y Reconocimientos</span>
              </h3>
              <ul className="space-y-2">
                {logrosList.map((logro, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-lg bg-[#202020] border border-neutral-800 text-xs text-neutral-200 flex items-start gap-2"
                  >
                    <span className="text-[#E8C766] font-bold">•</span>
                    <span>{logro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Galería si hay más fotos */}
          {validFotos.length > 1 && (
            <div>
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                Fotos
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

          {/* Contacto & Redes */}
          <div className="border-t border-neutral-800/80 pt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {deportista.telefono && (
                <a
                  href={`tel:${deportista.telefono}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#222] hover:bg-[#2c2c2c] text-neutral-200 hover:text-white text-xs font-semibold border border-neutral-700/70 transition-colors"
                >
                  <span>📞</span>
                  <span>{deportista.telefono}</span>
                </a>
              )}
              {deportista.email && (
                <a
                  href={`mailto:${deportista.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#222] hover:bg-[#2c2c2c] text-neutral-200 hover:text-white text-xs font-semibold border border-neutral-700/70 transition-colors"
                >
                  <span>✉️</span>
                  <span>{deportista.email}</span>
                </a>
              )}
            </div>

            {deportista.sitioWebUrl && (
              <a
                href={deportista.sitioWebUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E8C766] hover:bg-[#f0d27e] text-neutral-950 text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <span>Ver Perfil / Redes</span>
                <span>↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeportistaDetailModal;
