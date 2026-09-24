import { useState, useMemo } from 'react';
import { useClubes } from '../../hooks/useClubes';
import SearchBar from '../../components/SearchBar/SearchBar';
import ClubCard from '../../components/ClubCard/ClubCard';
import ClubDetailModal from '../../components/ClubDetailModal/ClubDetailModal';
import { normalizeText } from '../../utils/textUtils';
import type { Club } from '../../types/Index';

const DISCIPLINAS = [
  'Todos',
  'Fútbol',
  'Básquet',
  'Natación',
  'Atletismo',
  'Vóley',
  'Rugby',
  'Hockey',
  'Tenis',
  'Pádel',
];

export const ClubesPage = () => {
  const { clubes, loading, error, cargarTodos } = useClubes();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [disciplinaSeleccionada, setDisciplinaSeleccionada] = useState<string>('Todos');
  const [soloAdaptado, setSoloAdaptado] = useState<boolean>(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  // Filtrado reactivo en tiempo real únicamente sobre los datos reales del backend
  const clubesFiltrados = useMemo(() => {
    if (!clubes || clubes.length === 0) return [];

    return clubes.filter((club) => {
      // 1. Filtro Deporte Inclusivo / Adaptado
      if (soloAdaptado && !club.deporteAdaptado) {
        return false;
      }

      // 2. Filtro por Disciplina seleccionada
      if (disciplinaSeleccionada !== 'Todos') {
        const normDisciplina = normalizeText(disciplinaSeleccionada);
        const normClubDisciplinas = normalizeText(club.disciplinas || '');
        const normClubDesc = normalizeText(club.descripcion || '');
        const normClubNombre = normalizeText(club.nombreInstitucion || '');

        const matchDisciplina =
          normClubDisciplinas.includes(normDisciplina) ||
          normClubDesc.includes(normDisciplina) ||
          normClubNombre.includes(normDisciplina);

        if (!matchDisciplina) {
          return false;
        }
      }

      // 3. Filtro por término de búsqueda (nombre, disciplina, dirección o descripción)
      if (searchTerm.trim() !== '') {
        const term = normalizeText(searchTerm);
        const normNombre = normalizeText(club.nombreInstitucion || '');
        const normDisciplinas = normalizeText(club.disciplinas || '');
        const normDireccion = normalizeText(club.direccion || '');
        const normDesc = normalizeText(club.descripcion || '');

        const matchSearch =
          normNombre.includes(term) ||
          normDisciplinas.includes(term) ||
          normDireccion.includes(term) ||
          normDesc.includes(term);

        if (!matchSearch) {
          return false;
        }
      }

      return true;
    });
  }, [clubes, soloAdaptado, disciplinaSeleccionada, searchTerm]);

  const handleResetFiltros = () => {
    setSearchTerm('');
    setDisciplinaSeleccionada('Todos');
    setSoloAdaptado(false);
  };

  return (
    <div className="bg-[#0c0c0c] text-neutral-200 min-h-screen pb-24">
      {/* Cabecera / Hero de Clubes */}
      <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-10 text-center px-4 overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#E8C766]/5 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Eyebrow */}
          <span className="block text-xs sm:text-sm font-bold tracking-[0.2em] text-[#E8C766] uppercase mb-2">
            LA BASE DEL DEPORTE
          </span>

          {/* Título Principal */}
          <h1 className="font-sport font-extrabold uppercase text-4xl sm:text-5xl md:text-6xl text-white tracking-wide leading-none mb-3">
            CLUBES E INSTITUCIONES
          </h1>

          {/* Subtítulo */}
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Los clubes son el corazón del deporte. Espacios de formación, comunidad y valores que
            transforman vidas.
          </p>

          {/* Barra de Búsqueda */}
          <div className="mt-8 mb-4">
            <SearchBar
              placeholder="Buscar por nombre de club o disciplina..."
              initialValue={searchTerm}
              onChange={(val) => setSearchTerm(val)}
              onSearch={(val) => setSearchTerm(val)}
            />
          </div>
        </div>
      </section>

      {/* Barra de Filtros y Toggle de Inclusión */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-neutral-900">
          {/* Pills de Disciplinas */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {DISCIPLINAS.map((disc) => {
              const isSelected = disciplinaSeleccionada === disc;
              return (
                <button
                  key={disc}
                  type="button"
                  onClick={() => setDisciplinaSeleccionada(disc)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer select-none shrink-0 ${
                    isSelected
                      ? 'bg-[#E8C766] text-black shadow-md shadow-[#E8C766]/15 scale-105'
                      : 'bg-[#181818] hover:bg-[#242424] text-neutral-300 hover:text-white border border-[#262626]'
                  }`}
                >
                  {disc}
                </button>
              );
            })}
          </div>

          {/* Toggle Deporte Inclusivo / Adaptado */}
          <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
            <label
              htmlFor="toggle-adaptado"
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              {/* Icono de inclusión */}
              <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5 group-hover:text-emerald-300 transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z" />
                </svg>
                <span>Deporte Inclusivo / Adaptado</span>
              </span>

              {/* Interruptor Switch */}
              <div
                onClick={() => setSoloAdaptado(!soloAdaptado)}
                className={`relative w-11 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                  soloAdaptado ? 'bg-emerald-500' : 'bg-[#222222] border border-neutral-700/60'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                    soloAdaptado ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </label>
          </div>
        </div>
      </section>

      {/* Grid de Clubes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Estado: Cargando inicial */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse rounded-2xl bg-[#161616] border border-[#262626] h-96 flex flex-col justify-between p-5"
              >
                <div className="w-full h-44 bg-neutral-800 rounded-xl mb-4" />
                <div className="space-y-2">
                  <div className="h-6 bg-neutral-800 rounded w-3/4" />
                  <div className="h-4 bg-neutral-850 rounded w-1/2" />
                  <div className="h-10 bg-neutral-850 rounded w-full" />
                </div>
                <div className="h-8 bg-neutral-800 rounded-lg w-full mt-4" />
              </div>
            ))}
          </div>
        )}

        {/* Estado: Error en conexión con backend */}
        {!loading && error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-600/30 text-red-300 text-xs flex items-center justify-between">
            <span>Error al cargar clubes desde el servidor: {error}</span>
            <button
              type="button"
              onClick={() => cargarTodos()}
              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded border border-red-500/40 font-semibold"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Estado: Sin resultados */}
        {!loading && !error && clubesFiltrados.length === 0 && (
          <div className="text-center py-20 bg-[#141414] rounded-2xl border border-[#222222] p-8 max-w-lg mx-auto">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-sport font-bold text-xl text-white uppercase tracking-wide mb-1">
              No se encontraron clubes
            </h3>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
              No hay instituciones que coincidan con los filtros aplicados o no hay clubes registrados actualmente en el sistema.
            </p>
            {(searchTerm !== '' || disciplinaSeleccionada !== 'Todos' || soloAdaptado) && (
              <button
                type="button"
                onClick={handleResetFiltros}
                className="px-5 py-2.5 rounded-lg bg-[#E8C766] hover:bg-[#f0d27e] text-neutral-950 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Reestablecer todos los filtros
              </button>
            )}
          </div>
        )}

        {/* Grid de Tarjetas con datos reales del backend */}
        {!loading && !error && clubesFiltrados.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubesFiltrados.map((club) => (
              <ClubCard
                key={club.id}
                club={club}
                onVerMas={(c) => setSelectedClub(c)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modal de Detalle */}
      <ClubDetailModal
        club={selectedClub}
        onClose={() => setSelectedClub(null)}
      />
    </div>
  );
};

export default ClubesPage;
