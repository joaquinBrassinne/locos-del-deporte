import { useState } from 'react';
import type { Deportista } from '../../types/Index';

interface DeportistaCardProps {
  deportista: Deportista;
}

const getInitials = (text: string): string => {
  if (!text) return '';
  const parts = text.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

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

  if (splitIndex !== -1 && splitIndex <= 100) {
    return {
      headline: trimmed.slice(0, splitIndex + 1).trim(),
      full: trimmed,
    };
  }

  return {
    headline: trimmed.length > 80 ? `${trimmed.slice(0, 80)}...` : trimmed,
    full: trimmed,
  };
};

export const DeportistaCard = ({ deportista }: DeportistaCardProps) => {
  const [mostrarHistoria, setMostrarHistoria] = useState(false);

  const logros = parseLogros(deportista.logros);
  const { headline, full: fullHistoria } = parseHistoria(deportista.historia);
  const hasPhoto = deportista.fotos && deportista.fotos.length > 0 && Boolean(deportista.fotos[0]);

  return (
    <article className="rounded-2xl bg-[#161616] border border-[#262626] overflow-hidden flex flex-col justify-between hover:border-[#E8C766]/40 transition-all duration-300 group">
      <div>
        {/* Header con Imagen */}
        <div className="relative h-60 w-full overflow-hidden bg-neutral-900">
          {hasPhoto ? (
            <img
              src={deportista.fotos[0]}
              alt={deportista.nombre}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
              <span className="font-sport text-5xl text-neutral-600 uppercase select-none">
                {getInitials(deportista.nombre)}
              </span>
            </div>
          )}

          {/* Badge Deporte / Inclusivo superior izquierdo */}
          <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2">
            <span className="px-3 py-1 rounded-md text-xs font-semibold bg-[#E8C766] text-neutral-950 shadow-md">
              {deportista.deporte}
            </span>
            {deportista.deporteAdaptado && (
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-black/75 text-[#E8C766] backdrop-blur-sm border border-[#E8C766]/30">
                Inclusivo
              </span>
            )}
          </div>

          {/* Gradiente oscuro inferior para contraste del texto */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/50 to-transparent pointer-events-none" />

          {/* Nombre y Ubicación sobre la imagen */}
          <div className="absolute bottom-3 left-4 right-4 z-10">
            <h3 className="font-sport font-bold text-2xl text-white uppercase tracking-wide leading-tight drop-shadow-md">
              {deportista.nombre}
            </h3>
            <p className="text-xs text-neutral-300 flex items-center gap-1.5 mt-1 font-medium">
              <span className="text-[#E8C766]">📍</span>
              <span>
                {deportista.clubNombre
                  ? `${deportista.clubNombre} – Río Tercero`
                  : 'Río Tercero'}
              </span>
            </p>
          </div>
        </div>

        {/* Cuerpo de la Tarjeta */}
        <div className="p-5 space-y-4">
          {/* Bajada / Tagline descriptiva */}
          {headline && (
            <p className="text-sm text-neutral-300 font-medium leading-snug">
              {headline}
            </p>
          )}

          {/* Sección de Logros */}
          {logros.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#E8C766] uppercase tracking-wider">
                <span>🏆</span>
                <span>Logros</span>
              </div>
              <ul className="text-xs text-neutral-300 space-y-1 pl-1">
                {logros.map((logro, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-tight">
                    <span className="text-neutral-500">•</span>
                    <span>{logro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Botón desplegable Leer mi historia */}
          {fullHistoria && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setMostrarHistoria(!mostrarHistoria)}
                className="text-xs font-semibold text-[#E8C766] hover:text-[#f0d27e] inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{mostrarHistoria ? '⌃' : '⌄'}</span>
                <span>{mostrarHistoria ? 'Ocultar historia' : 'Leer mi historia'}</span>
              </button>

              {mostrarHistoria && (
                <div className="mt-2.5 p-3 rounded-lg bg-[#111111] border border-neutral-800 text-xs text-neutral-300 leading-relaxed max-h-40 overflow-y-auto">
                  {fullHistoria}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pie de la tarjeta: Redes Sociales y Ver Perfil */}
      <div className="px-5 pb-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between mt-2">
        {/* Ícono Instagram o Web */}
        {deportista.sitioWebUrl ? (
          <a
            href={deportista.sitioWebUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-[#E8C766] transition-colors p-1"
            title="Sitio Web / Instagram"
          >
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
          </a>
        ) : (
          <span className="text-neutral-600 p-1">
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
        )}

        {/* Enlace Ver Perfil */}
        <a
          href={deportista.sitioWebUrl || '/deportistas'}
          target={deportista.sitioWebUrl ? '_blank' : undefined}
          rel={deportista.sitioWebUrl ? 'noopener noreferrer' : undefined}
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors font-medium"
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
      </div>
    </article>
  );
};

export default DeportistaCard;
