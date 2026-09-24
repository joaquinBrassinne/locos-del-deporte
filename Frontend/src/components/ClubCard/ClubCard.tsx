import { useState } from 'react';
import type { Club } from '../../types/Index';
import { repairEncoding, extractBarrio, extractAnioFundacion } from '../../utils/textUtils';

interface ClubCardProps {
  club: Club;
  onVerMas?: (club: Club) => void;
}

const getInstalaciones = (club: Club): string[] => {
  if (club.instalaciones && club.instalaciones.length > 0) {
    return club.instalaciones;
  }

  const items: string[] = [];
  const rawText = `${club.disciplinas || ''} ${club.descripcion || ''}`.toLowerCase();

  if (rawText.includes('fútbol') || rawText.includes('futbol')) {
    items.push('Cancha de fútbol 11');
  }
  if (rawText.includes('básquet') || rawText.includes('basquet')) {
    items.push('Cancha de básquet techada');
  }
  if (rawText.includes('natación') || rawText.includes('natacion')) {
    items.push('Pileta climatizada');
  }
  if (rawText.includes('hockey')) {
    items.push('Cancha de hockey sintética');
  }
  if (rawText.includes('tenis')) {
    items.push('Canchas de polvo de ladrillo');
  }
  if (rawText.includes('atletismo')) {
    items.push('Pista de atletismo');
  }
  if (club.deporteAdaptado) {
    items.push('Instalaciones adaptadas');
  }

  if (items.length > 0 && !items.includes('Vestuarios')) {
    items.push('Vestuarios');
  }

  return items;
};

export const ClubCard = ({ club, onVerMas }: ClubCardProps) => {
  const [mostrarHistoria, setMostrarHistoria] = useState(false);

  const cleanNombre = repairEncoding(club.nombreInstitucion);
  const cleanDireccion = repairEncoding(club.direccion);
  const cleanDescripcion = repairEncoding(club.descripcion);
  const cleanHorarios = repairEncoding(club.horarios);

  const barrio = extractBarrio(cleanDireccion);
  const anio = extractAnioFundacion(club);

  const hasPhoto =
    club.fotos &&
    club.fotos.length > 0 &&
    Boolean(club.fotos[0]) &&
    !club.fotos[0].includes('string');

  const rawDisciplinas = club.disciplinas ? repairEncoding(club.disciplinas) : '';
  const disciplinasList = rawDisciplinas
    ? rawDisciplinas.split(',').map((d) => d.trim()).filter(Boolean)
    : [];

  const instalaciones = getInstalaciones(club);
  const maxInstalacionesVisibles = 2;
  const visiblesInstalaciones = instalaciones.slice(0, maxInstalacionesVisibles);
  const restantesInstalaciones = Math.max(0, instalaciones.length - maxInstalacionesVisibles);

  return (
    <article className="rounded-2xl bg-[#161616] border border-[#262626] overflow-hidden flex flex-col justify-between hover:border-[#E8C766]/50 transition-all duration-300 group shadow-lg shadow-black/40">
      <div>
        {/* Header con Foto del Club o Cubo Isométrico 3D */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#121212]">
          {/* Badges superiores sobre la imagen */}
          <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-start justify-between gap-2 pointer-events-none">
            {/* Pills de Disciplinas */}
            <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
              {disciplinasList.slice(0, 3).map((disc, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded text-xs font-semibold bg-[#E8C766] text-neutral-950 shadow-sm leading-none"
                >
                  {disc}
                </span>
              ))}
              {club.deporteAdaptado && (
                <span className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 backdrop-blur-sm leading-none">
                  Deporte Adaptado
                </span>
              )}
            </div>

            {/* Badge Verificado */}
            <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm flex items-center gap-1 shrink-0 pointer-events-auto shadow-sm">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Verificado</span>
            </div>
          </div>

          {/* Imagen o Icono 3D */}
          {hasPhoto ? (
            <div className="w-full h-full relative">
              <img
                src={club.fotos[0]}
                alt={cleanNombre}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/30 to-transparent pointer-events-none" />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-[#1c1c1c] to-[#121212] flex items-center justify-center relative">
              <div className="w-24 h-24 rounded-full bg-[#E8C766]/5 blur-2xl absolute pointer-events-none" />
              {/* Cubo Isométrico 3D */}
              <svg
                className="w-14 h-14 text-neutral-600/90 group-hover:text-neutral-500 transition-colors"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
            </div>
          )}
        </div>

        {/* Cuerpo de la Tarjeta */}
        <div className="p-5 space-y-3.5">
          {/* Título de la Institución */}
          <div>
            <h3 className="font-sport font-bold text-2xl text-white uppercase tracking-wide leading-tight group-hover:text-[#E8C766] transition-colors">
              {cleanNombre}
            </h3>

            {/* Ubicación y Fundación */}
            <div className="text-xs text-neutral-400 flex items-center gap-3 mt-1.5 font-medium">
              <span className="flex items-center gap-1">
                <span className="text-neutral-400">📍</span>
                <span>{barrio || cleanDireccion || 'Río Tercero'}</span>
              </span>
              {anio && (
                <span className="flex items-center gap-1 text-neutral-400">
                  <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Desde {anio}</span>
                </span>
              )}
            </div>
          </div>

          {/* Descripción */}
          {cleanDescripcion ? (
            <p className="text-xs md:text-sm text-neutral-300 font-normal leading-relaxed line-clamp-2">
              {cleanDescripcion}
            </p>
          ) : (
            <p className="text-xs text-neutral-500 italic">
              Institución deportiva registrada en Río Tercero.
            </p>
          )}

          {/* Instalaciones */}
          {visiblesInstalaciones.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>INSTALACIONES</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {visiblesInstalaciones.map((inst, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-[#202020] text-neutral-300 text-xs border border-neutral-800 font-medium"
                  >
                    {inst}
                  </span>
                ))}
                {restantesInstalaciones > 0 && (
                  <span className="px-2.5 py-1 rounded-md bg-[#202020] text-neutral-400 text-xs border border-neutral-800 font-medium">
                    +{restantesInstalaciones} más
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Horarios */}
          {cleanHorarios && (
            <div className="text-xs text-neutral-400 flex items-center gap-2 pt-1">
              <svg className="w-3.5 h-3.5 text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="truncate">{cleanHorarios}</span>
            </div>
          )}

          {/* Desplegable Nuestra historia */}
          {cleanDescripcion && (
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => setMostrarHistoria(!mostrarHistoria)}
                className="text-xs font-semibold text-[#E8C766] hover:text-[#f0d27e] inline-flex items-center gap-1 transition-colors cursor-pointer select-none"
              >
                <span>{mostrarHistoria ? '⌃' : '⌄'}</span>
                <span>{mostrarHistoria ? 'Ocultar historia' : 'Nuestra historia'}</span>
              </button>

              {mostrarHistoria && (
                <div className="mt-2.5 p-3 rounded-lg bg-[#111111] border border-neutral-800 text-xs text-neutral-300 leading-relaxed max-h-40 overflow-y-auto space-y-2">
                  <p>{cleanDescripcion}</p>
                  <div className="text-[11px] text-neutral-400 border-t border-neutral-800/80 pt-2 space-y-1">
                    {cleanDireccion && <div><strong>Dirección:</strong> {cleanDireccion}</div>}
                    {cleanHorarios && <div><strong>Horarios de atención:</strong> {cleanHorarios}</div>}
                    {club.telefono && <div><strong>Teléfono:</strong> {club.telefono}</div>}
                    {club.email && <div><strong>Email:</strong> {club.email}</div>}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pie de la tarjeta: Contacto y Ver más */}
      <div className="px-5 py-3.5 border-t border-neutral-800/80 flex items-center justify-between mt-2 bg-[#131313]/60">
        {/* Contacto: Mail y Teléfono */}
        <div className="flex items-center gap-2 text-neutral-400">
          {club.email ? (
            <a
              href={`mailto:${club.email}`}
              className="p-1.5 hover:text-[#E8C766] transition-colors rounded hover:bg-neutral-800/60"
              title={`Enviar correo a ${club.email}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          ) : (
            <span className="p-1.5 text-neutral-600 cursor-not-allowed" title="Sin email disponible">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
          )}

          {club.telefono ? (
            <a
              href={`tel:${club.telefono}`}
              className="p-1.5 hover:text-[#E8C766] transition-colors rounded hover:bg-neutral-800/60"
              title={`Llamar a ${club.telefono}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
          ) : (
            <span className="p-1.5 text-neutral-600 cursor-not-allowed" title="Sin teléfono disponible">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </span>
          )}
        </div>

        {/* Ver más */}
        {onVerMas ? (
          <button
            type="button"
            onClick={() => onVerMas(club)}
            className="text-xs text-neutral-300 hover:text-white flex items-center gap-1 transition-colors font-medium cursor-pointer group-hover:text-[#E8C766]"
          >
            <span>Ver más</span>
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
            href={club.sitioWebUrl || '#'}
            target={club.sitioWebUrl ? '_blank' : undefined}
            rel={club.sitioWebUrl ? 'noopener noreferrer' : undefined}
            className="text-xs text-neutral-300 hover:text-white flex items-center gap-1 transition-colors font-medium cursor-pointer group-hover:text-[#E8C766]"
          >
            <span>Ver más</span>
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

export default ClubCard;
