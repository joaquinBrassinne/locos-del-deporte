import { useState } from 'react';
import type { Club } from '../../types/Index';

interface ClubCardProps {
  club: Club;
}

const getInitials = (text: string): string => {
  if (!text) return '';
  const parts = text.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const getInstalaciones = (disciplinasStr: string | null): string[] => {
  const items: string[] = [];
  if (disciplinasStr) {
    const d = disciplinasStr.toLowerCase();
    if (d.includes('fútbol')) items.push('Cancha de fútbol 11');
    if (d.includes('básquet')) items.push('Cancha de básquet techada');
    if (d.includes('natación')) items.push('Pileta semiolímpica');
    if (d.includes('tenis')) items.push('Canchas de polvo');
    if (d.includes('vóley')) items.push('Cancha de vóley');
    if (d.includes('atletismo')) items.push('Pista de atletismo');
  }
  items.push('Vestuarios');
  if (items.length < 3) items.push('Gimnasio de pesas');
  return items;
};

export const ClubCard = ({ club }: ClubCardProps) => {
  const [mostrarHistoria, setMostrarHistoria] = useState(false);

  const hasPhoto = club.fotos && club.fotos.length > 0 && Boolean(club.fotos[0]);
  const disciplinasList = club.disciplinas
    ? club.disciplinas.split(',').map((d) => d.trim()).filter(Boolean)
    : [];
  const instalaciones = getInstalaciones(club.disciplinas);
  const visiblesInstalaciones = instalaciones.slice(0, 3);
  const restantesInstalaciones = instalaciones.length - visiblesInstalaciones.length;

  return (
    <article className="rounded-2xl bg-[#161616] border border-[#262626] overflow-hidden flex flex-col justify-between hover:border-[#E8C766]/40 transition-all duration-300 group">
      <div>
        {/* Header con Foto del Club */}
        <div className="relative h-60 w-full overflow-hidden bg-neutral-900">
          {hasPhoto ? (
            <img
              src={club.fotos[0]}
              alt={club.nombreInstitucion}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
              <span className="font-sport text-5xl text-neutral-600 uppercase select-none">
                {getInitials(club.nombreInstitucion)}
              </span>
            </div>
          )}

          {/* Barra superior sobre la foto: Disciplinas + Verificado */}
          <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between gap-2">
            {/* Pills de Disciplinas */}
            <div className="flex flex-wrap items-center gap-1.5">
              {disciplinasList.slice(0, 3).map((disc, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#E8C766] text-neutral-950 shadow-md"
                >
                  {disc}
                </span>
              ))}
              {club.deporteAdaptado && (
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-black/75 text-[#E8C766] backdrop-blur-sm border border-[#E8C766]/30">
                  Inclusivo
                </span>
              )}
            </div>

            {/* Badge Verificado */}
            <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm flex items-center gap-1 shrink-0">
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

          {/* Gradiente oscuro inferior */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/50 to-transparent pointer-events-none" />

          {/* Nombre y Ubicación sobre la imagen */}
          <div className="absolute bottom-3 left-4 right-4 z-10">
            <h3 className="font-sport font-bold text-2xl text-white uppercase tracking-wide leading-tight drop-shadow-md">
              {club.nombreInstitucion}
            </h3>
            <div className="text-xs text-neutral-300 flex items-center gap-3 mt-1 font-medium">
              <span className="flex items-center gap-1">
                <span className="text-[#E8C766]">📍</span>
                <span>{club.direccion || 'Río Tercero'}</span>
              </span>
              <span className="flex items-center gap-1 text-neutral-400">
                <span>🗓️</span>
                <span>{`Club Fundado`}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Cuerpo de la Tarjeta */}
        <div className="p-5 space-y-4">
          {/* Descripción */}
          <p className="text-sm text-neutral-300 font-medium leading-snug">
            {club.descripcion ||
              'Club histórico de la ciudad con amplia trayectoria formando deportistas.'}
          </p>

          {/* Instalaciones */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              <span>🏛️</span>
              <span>Instalaciones</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {visiblesInstalaciones.map((inst, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-[#202020] text-neutral-300 text-xs border border-neutral-800"
                >
                  {inst}
                </span>
              ))}
              {restantesInstalaciones > 0 && (
                <span className="px-2.5 py-1 rounded-md bg-[#202020] text-neutral-400 text-xs border border-neutral-800">
                  +{restantesInstalaciones} más
                </span>
              )}
            </div>
          </div>

          {/* Horarios */}
          <div className="text-xs text-neutral-400 flex items-center gap-2 pt-1">
            <span>🕒</span>
            <span>
              {club.horarios || 'Lunes a Viernes 8:00-22:00, Sábados 9:00-20:00'}
            </span>
          </div>

          {/* Desplegable Nuestra historia */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setMostrarHistoria(!mostrarHistoria)}
              className="text-xs font-semibold text-[#E8C766] hover:text-[#f0d27e] inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{mostrarHistoria ? '⌃' : '⌄'}</span>
              <span>{mostrarHistoria ? 'Ocultar historia' : 'Nuestra historia'}</span>
            </button>

            {mostrarHistoria && (
              <div className="mt-2.5 p-3 rounded-lg bg-[#111111] border border-neutral-800 text-xs text-neutral-300 leading-relaxed max-h-40 overflow-y-auto">
                {club.descripcion ||
                  `${club.nombreInstitucion} es una institución dedicada al desarrollo deportivo y social de Río Tercero, brindando contención y disciplinas para toda la comunidad.`}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pie de la tarjeta: Ver más */}
      <div className="px-5 pb-4 pt-3 border-t border-neutral-800/80 flex items-center justify-end mt-2">
        <a
          href={club.sitioWebUrl || '/clubes'}
          target={club.sitioWebUrl ? '_blank' : undefined}
          rel={club.sitioWebUrl ? 'noopener noreferrer' : undefined}
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors font-medium"
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
      </div>
    </article>
  );
};

export default ClubCard;
