import { useState } from 'react';
import type { Deportista } from '../../types/Index';
import { repairEncoding } from '../../utils/textUtils';

interface DeportistaCardProps {
  deportista: Deportista;
  onVerPerfil?: (deportista: Deportista) => void;
}

const parseLogros = (logros: string | null): string[] => {
  if (!logros) return [];
  const lines = logros
    .split(/[\r\n;]+/)
    .map((l) => l.trim().replace(/^[•\-\*]\s*/, ''))
    .filter(Boolean);

  if (lines.length > 1) return lines;

  const commaSeparated = logros
    .split(',')
    .map((l) => l.trim().replace(/^[•\-\*]\s*/, ''))
    .filter(Boolean);

  return commaSeparated.length > 1 ? commaSeparated : lines;
};

const parseHistoria = (historia: string | null): { headline: string; full: string } => {
  if (!historia) return { headline: '', full: '' };
  const trimmed = historia.trim();
  const firstNewline = trimmed.indexOf('\n');
  const firstPeriod = trimmed.indexOf('.');

  let splitIndex = -1;
  if (firstNewline !== -1 && (firstNewline < firstPeriod || firstPeriod === -1)) {
    splitIndex = firstNewline;
  } else if (firstPeriod !== -1) {
    splitIndex = firstPeriod;
  }

  if (splitIndex !== -1 && splitIndex <= 120) {
    return {
      headline: trimmed.slice(0, splitIndex + 1).trim(),
      full: trimmed,
    };
  }

  return {
    headline: trimmed.length > 90 ? `${trimmed.slice(0, 90)}...` : trimmed,
    full: trimmed,
  };
};

export const DeportistaCard = ({ deportista, onVerPerfil }: DeportistaCardProps) => {
  const [mostrarHistoria, setMostrarHistoria] = useState(false);

  const cleanNombre = repairEncoding(deportista.nombre);
  const cleanDeporte = repairEncoding(deportista.deporte);
  const cleanHistoria = repairEncoding(deportista.historia);
  const cleanLogros = repairEncoding(deportista.logros);
  const cleanSubtitulo = repairEncoding(deportista.subtitulo);

  const logros = parseLogros(cleanLogros);
  const { headline, full: fullHistoria } = parseHistoria(cleanHistoria);

  const hasPhoto =
    deportista.fotos &&
    deportista.fotos.length > 0 &&
    Boolean(deportista.fotos[0]) &&
    !deportista.fotos[0].includes('string');

  const isAdaptado = Boolean(deportista.deporteAdaptado);

  const zonaText =
    deportista.zona ||
    (deportista.clubNombre
      ? `${deportista.clubNombre} · Río Tercero`
      : 'Centro · Río Tercero');

  return (
    <article className="rounded-2xl bg-[#161616] border border-[#262626] overflow-hidden flex flex-col justify-between hover:border-[#E8C766]/50 transition-all duration-300 group shadow-lg shadow-black/40">
      <div>
        {/* Header con Foto del Deportista */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#121212]">
          {/* Badges superiores sobre la imagen */}
          <div className="absolute top-3.5 left-3.5 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
            <span
              className={`px-2.5 py-1 rounded text-xs font-bold uppercase shadow-sm leading-none tracking-wide ${
                isAdaptado
                  ? 'bg-[#E8C766] text-neutral-950'
                  : 'bg-[#E8C766] text-neutral-950'
              }`}
            >
              {cleanDeporte}
            </span>

            {isAdaptado && (
              <span className="px-2 py-0.5 rounded text-xs font-extrabold bg-[#2dd4bf] text-neutral-950 uppercase shadow-sm leading-none flex items-center gap-1">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                ADAPTADO
              </span>
            )}
          </div>

          {/* Imagen o Placeholder */}
          {hasPhoto ? (
            <div className="w-full h-full relative">
              <img
                src={deportista.fotos[0]}
                alt={cleanNombre}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/30 to-transparent pointer-events-none" />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-[#1c1c1c] to-[#121212] flex items-center justify-center relative">
              <div className="w-24 h-24 rounded-full bg-[#E8C766]/5 blur-2xl absolute pointer-events-none" />
              <div className="w-16 h-16 rounded-full bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center text-neutral-400 font-sport font-bold text-2xl uppercase">
                {cleanNombre.slice(0, 2)}
              </div>
            </div>
          )}
        </div>

        {/* Cuerpo de la Tarjeta */}
        <div className="p-5 space-y-3.5">
          {/* Nombre y Ubicación */}
          <div>
            <h3
              className={`font-sport font-bold text-2xl uppercase tracking-wide leading-tight transition-colors ${
                isAdaptado
                  ? 'text-white group-hover:text-[#2dd4bf]'
                  : 'text-white group-hover:text-[#E8C766]'
              }`}
            >
              {cleanNombre}
            </h3>

            <div className="text-xs text-neutral-400 flex items-center gap-1.5 mt-1.5 font-medium">
              <span className={isAdaptado ? 'text-[#2dd4bf]' : 'text-[#E8C766]'}>📍</span>
              <span>{zonaText}</span>
            </div>
          </div>

          {/* Bajada / Tagline descriptiva */}
          <p className="text-xs md:text-sm text-neutral-300 font-normal leading-relaxed line-clamp-2">
            {cleanSubtitulo || headline || 'Deportista destacado de la comunidad de Río Tercero.'}
          </p>

          {/* Sección de Logros */}
          {logros.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div
                className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${
                  isAdaptado ? 'text-[#2dd4bf]' : 'text-[#E8C766]'
                }`}
              >
                <span>🏆</span>
                <span>Logros</span>
              </div>
              <ul className="text-xs text-neutral-300 space-y-1 pl-1 leading-snug">
                {logros.slice(0, 3).map((logro, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-neutral-500">•</span>
                    <span>{logro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Botón desplegable Leer mi historia */}
          {fullHistoria && (
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => setMostrarHistoria(!mostrarHistoria)}
                className={`text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer select-none ${
                  isAdaptado
                    ? 'text-[#2dd4bf] hover:text-[#5eead4]'
                    : 'text-[#E8C766] hover:text-[#f0d27e]'
                }`}
              >
                <span>{mostrarHistoria ? '⌃' : '⌄'}</span>
                <span>{mostrarHistoria ? 'Ocultar historia' : 'Leer mi historia'}</span>
              </button>

              {mostrarHistoria && (
                <div className="mt-2.5 p-3 rounded-lg bg-[#111111] border border-neutral-800 text-xs text-neutral-300 leading-relaxed max-h-40 overflow-y-auto space-y-2">
                  <p>{fullHistoria}</p>
                  <div className="text-[11px] text-neutral-400 border-t border-neutral-800/80 pt-2 space-y-1">
                    {deportista.edad && <div><strong>Edad:</strong> {deportista.edad} años</div>}
                    {deportista.clubNombre && <div><strong>Club / Institución:</strong> {deportista.clubNombre}</div>}
                    {deportista.email && <div><strong>Email:</strong> {deportista.email}</div>}
                    {deportista.telefono && <div><strong>Teléfono:</strong> {deportista.telefono}</div>}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pie de la tarjeta: Redes Sociales y Ver Perfil */}
      <div className="px-5 py-3.5 border-t border-neutral-800/80 flex items-center justify-between mt-2 bg-[#131313]/60">
        {/* Íconos de redes o contacto */}
        <div className="flex items-center gap-2 text-neutral-400">
          {deportista.sitioWebUrl ? (
            <a
              href={deportista.sitioWebUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:text-[#E8C766] transition-colors rounded hover:bg-neutral-800/60"
              title="Sitio web o perfil de red social"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
            </a>
          ) : (
            <span className="p-1.5 text-neutral-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
            </span>
          )}

          {/* Ícono de Instagram / Perfil secundario */}
          <span className="p-1.5 text-neutral-600">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </span>
        </div>

        {/* Enlace Ver Perfil */}
        {onVerPerfil ? (
          <button
            type="button"
            onClick={() => onVerPerfil(deportista)}
            className={`text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              isAdaptado
                ? 'text-[#2dd4bf] hover:text-white'
                : 'text-neutral-300 hover:text-white group-hover:text-[#E8C766]'
            }`}
          >
            <span>Ver perfil</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </button>
        ) : (
          <a
            href={deportista.sitioWebUrl || '#'}
            target={deportista.sitioWebUrl ? '_blank' : undefined}
            rel={deportista.sitioWebUrl ? 'noopener noreferrer' : undefined}
            className={`text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              isAdaptado
                ? 'text-[#2dd4bf] hover:text-white'
                : 'text-neutral-300 hover:text-white group-hover:text-[#E8C766]'
            }`}
          >
            <span>Ver perfil</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        )}
      </div>
    </article>
  );
};

export default DeportistaCard;
