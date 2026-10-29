import { useState, useMemo } from 'react';
import { useDeportistas } from '../../hooks/useDeportistas';
import SearchBar from '../../components/SearchBar/SearchBar';
import DeportistaCard from '../../components/DeportistaCard/DeportistaCard';
import DeportistaDetailModal from '../../components/DeportistaDetailModal/DeportistaDetailModal';
import { normalizeText, repairEncoding } from '../../utils/textUtils';
import type { Deportista } from '../../types/Index';

const DISCIPLINAS = [
  'Todos',
  'Fútbol',
  'Básquet',
  'Natación',
  'Atletismo',
  'Vóley',
  'Rugby',
  'Boxeo',
  'Ciclismo',
  'Tenis',
];

export const DeportistasPage = () => {
  const { deportistas: backendDeportistas, loading, error, cargarTodos } = useDeportistas();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [disciplinaSeleccionada, setDisciplinaSeleccionada] = useState<string>('Todos');
  const [soloAdaptado, setSoloAdaptado] = useState<boolean>(false);
  const [selectedDeportista, setSelectedDeportista] = useState<Deportista | null>(null);

  // Lista directamente desde la base de datos (backend)
  const listaBaseDeportistas = useMemo(() => {
    if (!backendDeportistas || backendDeportistas.length === 0) {
      return [];
    }

    // Filtrar entradas inválidas o de test del backend (ej: "TU PAPI")
    const validBackend = backendDeportistas.filter((d) => {
      const nombre = (d.nombre || '').trim().toLowerCase();
      return (
        nombre.length > 1 &&
        !nombre.includes('tu papi') &&
        nombre !== 'string' &&
        nombre !== 'test'
      );
    });

    return validBackend.map((dep) => ({
      ...dep,
      nombre: repairEncoding(dep.nombre),
      deporte: repairEncoding(dep.deporte),
      subtitulo: dep.subtitulo ? repairEncoding(dep.subtitulo) : undefined,
      zona: dep.zona ? repairEncoding(dep.zona) : undefined,
      logros: dep.logros ? repairEncoding(dep.logros) : undefined,
      historia: dep.historia ? repairEncoding(dep.historia) : undefined,
    }));
  }, [backendDeportistas]);

  // Filtrado reactivo en tiempo real por búsqueda, deporte y toggle inclusivo
  const deportistasFiltrados = useMemo(() => {
    return listaBaseDeportistas.filter((deportista) => {
      // 1. Filtro Deporte Inclusivo / Adaptado
      if (soloAdaptado && !deportista.deporteAdaptado) {
        return false;
      }

      // 2. Filtro por Disciplina seleccionada
      if (disciplinaSeleccionada !== 'Todos') {
        const normDisciplina = normalizeText(disciplinaSeleccionada);
        const normDeporte = normalizeText(deportista.deporte || '');
        const normSubtitulo = normalizeText(deportista.subtitulo || '');
        const normHistoria = normalizeText(deportista.historia || '');

        const matchDisciplina =
          normDeporte.includes(normDisciplina) ||
          normSubtitulo.includes(normDisciplina) ||
          normHistoria.includes(normDisciplina);

        if (!matchDisciplina) {
          return false;
        }
      }

      // 3. Filtro por término de búsqueda (nombre, deporte, logros, historia)
      if (searchTerm.trim() !== '') {
        const term = normalizeText(searchTerm);
        const normNombre = normalizeText(deportista.nombre);
        const normDeporte = normalizeText(deportista.deporte || '');
        const normSubtitulo = normalizeText(deportista.subtitulo || '');
        const normLogros = normalizeText(deportista.logros || '');
        const normHistoria = normalizeText(deportista.historia || '');

        const matchSearch =
          normNombre.includes(term) ||
          normDeporte.includes(term) ||
          normSubtitulo.includes(term) ||
          normLogros.includes(term) ||
          normHistoria.includes(term);

        if (!matchSearch) {
          return false;
        }
      }

      return true;
    });
  }, [listaBaseDeportistas, soloAdaptado, disciplinaSeleccionada, searchTerm]);

  const handleResetFiltros = () => {
    setSearchTerm('');
    setDisciplinaSeleccionada('Todos');
    setSoloAdaptado(false);
  };

  return (
    <div className="bg-[#0c0c0c] text-neutral-200 min-h-screen">
      {/* Cabecera / Hero de Deportistas */}
      <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-10 text-center px-4 overflow-hidden">
        {/* Ambient glow de fondo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#E8C766]/5 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Eyebrow badge exacto al diseño */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181818] border border-neutral-700/60 mb-5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#E8C766]" />
            <span className="text-[11px] sm:text-xs font-semibold tracking-widest text-[#E8C766] uppercase">
              CONOCÉ A QUIENES LO DAN TODO
            </span>
          </div>

          {/* Título Principal */}
          <h1 className="font-sport font-extrabold uppercase text-4xl sm:text-5xl md:text-6xl tracking-wide leading-none mb-4">
            <span className="text-white">DEPORTISTAS </span>
            <span className="text-[#E8C766]">DESTACADOS</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Historias de esfuerzo, sacrificio y pasión. Cada deportista tiene una historia única que
            merece ser contada y visibilizada en nuestra comunidad.
          </p>

          {/* Barra de Búsqueda */}
          <div className="mt-8 mb-4">
            <SearchBar
              placeholder="Buscar deportista por nombre o disciplina..."
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

          {/* Toggle Deporte Inclusivo / Adaptado con Badge NUEVO */}
          <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
            <label
              htmlFor="toggle-adaptado"
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              {/* Icono de rayo/inclusión */}
              <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5 group-hover:text-emerald-300 transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z" />
                </svg>
                <span>Deporte Inclusivo / Adaptado</span>
              </span>

              {/* Badge NUEVO verde */}
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 leading-none">
                NUEVO
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

      {/* Grid de Deportistas */}
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

        {/* Estado: Error en conexión con backend (muestra aviso pero permite navegar el catálogo) */}
        {!loading && error && (
          <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-600/30 text-amber-300 text-xs flex items-center justify-between">
            <span>
              Aviso: Mostrando catálogo de deportistas. La sincronización con el servidor reportó: {error}
            </span>
            <button
              type="button"
              onClick={() => cargarTodos()}
              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 rounded border border-amber-500/40 font-semibold cursor-pointer"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Estado: Sin resultados */}
        {!loading && deportistasFiltrados.length === 0 && (
          <div className="text-center py-20 bg-[#141414] rounded-2xl border border-[#222222] p-8 max-w-lg mx-auto">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-sport font-bold text-xl text-white uppercase tracking-wide mb-1">
              No se encontraron deportistas
            </h3>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
              No hay deportistas que coincidan con los filtros aplicados. Intenta buscar con otro término o limpia los filtros.
            </p>
            <button
              type="button"
              onClick={handleResetFiltros}
              className="px-5 py-2.5 rounded-lg bg-[#E8C766] hover:bg-[#f0d27e] text-neutral-950 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Reestablecer todos los filtros
            </button>
          </div>
        )}

        {/* Grid de Tarjetas */}
        {!loading && deportistasFiltrados.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deportistasFiltrados.map((deportista) => (
              <DeportistaCard
                key={deportista.id}
                deportista={deportista}
                onVerPerfil={(d) => setSelectedDeportista(d)}
              />
            ))}
          </div>
        )}

        {/* Botón Ver todos los deportistas */}
        <div className="text-center mt-12 mb-16">
          <button
            type="button"
            onClick={() => {
              handleResetFiltros();
              window.scrollTo({ top: 350, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141414] hover:bg-[#1f1f1f] text-neutral-200 hover:text-white text-xs font-semibold border border-neutral-700/80 hover:border-[#E8C766] transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>Ver todos los deportistas</span>
            <span>→</span>
          </button>
        </div>
      </section>

      {/* Sección SOBRE NOSOTROS (Exacto a la imagen) */}
      <section className="py-20 px-4 text-center max-w-4xl mx-auto border-t border-neutral-900">
        <h2 className="font-sport font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-wider mb-4">
          SOBRE NOSOTROS
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
          Deporte Río Tercero nació de la convicción de que el talento está en todos lados, pero las
          oportunidades no. Queremos ser el puente entre deportistas y clubes con poca visibilidad y
          la comunidad que necesita conocer sus historias.
        </p>
      </section>

      {/* Modal de Detalle de Deportista */}
      <DeportistaDetailModal
        deportista={selectedDeportista}
        onClose={() => setSelectedDeportista(null)}
      />
    </div>
  );
};

export default DeportistasPage;
