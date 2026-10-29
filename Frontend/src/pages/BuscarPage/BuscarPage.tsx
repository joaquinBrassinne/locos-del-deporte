import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useClubes } from '../../hooks/useClubes';
import { useDeportistas } from '../../hooks/useDeportistas';
import SearchBar from '../../components/SearchBar/SearchBar';
import ClubCard from '../../components/ClubCard/ClubCard';
import DeportistaCard from '../../components/DeportistaCard/DeportistaCard';
import ClubDetailModal from '../../components/ClubDetailModal/ClubDetailModal';
import DeportistaDetailModal from '../../components/DeportistaDetailModal/DeportistaDetailModal';
import { normalizeText } from '../../utils/textUtils';
import type { Club, Deportista } from '../../types/Index';

type TabTipo = 'todos' | 'clubes' | 'deportistas';

export const BuscarPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState<string>(initialQuery);
  const [activeTab, setActiveTab] = useState<TabTipo>('todos');

  const {
    clubes,
    loading: loadingClubes,
  } = useClubes();

  const {
    deportistas,
    loading: loadingDeportistas,
  } = useDeportistas();

  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [selectedDeportista, setSelectedDeportista] = useState<Deportista | null>(null);

  // Sincronizar URL search params
  useEffect(() => {
    const qParam = searchParams.get('q');
    if (qParam !== null && qParam !== searchTerm) {
      setSearchTerm(qParam);
    }
  }, [searchParams]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setSearchParams({});
    } else {
      setSearchParams({ q: term });
    }
  };

  // Filtrado insensitivo a mayúsculas, minúsculas y acentos para Clubes
  const clubesFiltrados = useMemo(() => {
    if (!clubes) return [];
    if (searchTerm.trim() === '') return clubes;

    const term = normalizeText(searchTerm);

    return clubes.filter((club) => {
      const normNombre = normalizeText(club.nombreInstitucion || '');
      const normDisciplinas = normalizeText(club.disciplinas || '');
      const normDireccion = normalizeText(club.direccion || '');
      const normDesc = normalizeText(club.descripcion || '');
      const normInstalaciones = club.instalaciones
        ? normalizeText(club.instalaciones.join(' '))
        : '';

      return (
        normNombre.includes(term) ||
        normDisciplinas.includes(term) ||
        normDireccion.includes(term) ||
        normDesc.includes(term) ||
        normInstalaciones.includes(term)
      );
    });
  }, [clubes, searchTerm]);

  // Filtrado insensitivo a mayúsculas, minúsculas y acentos para Deportistas
  const deportistasFiltrados = useMemo(() => {
    if (!deportistas) return [];
    if (searchTerm.trim() === '') return deportistas;

    const term = normalizeText(searchTerm);

    return deportistas.filter((dep) => {
      const normNombre = normalizeText(dep.nombre || '');
      const normDeporte = normalizeText(dep.deporte || '');
      const normSubtitulo = normalizeText(dep.subtitulo || '');
      const normLogros = normalizeText(dep.logros || '');
      const normHistoria = normalizeText(dep.historia || '');
      const normClub = normalizeText(dep.clubNombre || '');
      const normZona = normalizeText(dep.zona || '');

      return (
        normNombre.includes(term) ||
        normDeporte.includes(term) ||
        normSubtitulo.includes(term) ||
        normLogros.includes(term) ||
        normHistoria.includes(term) ||
        normClub.includes(term) ||
        normZona.includes(term)
      );
    });
  }, [deportistas, searchTerm]);

  const totalResultados = clubesFiltrados.length + deportistasFiltrados.length;
  const isLoading = loadingClubes || loadingDeportistas;

  return (
    <div className="bg-[#0c0c0c] text-neutral-200 min-h-screen pb-24">
      {/* Hero Header */}
      <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-10 text-center px-4 overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] bg-[#E8C766]/5 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <span className="block text-xs sm:text-sm font-bold tracking-[0.2em] text-[#E8C766] uppercase mb-2">
            BUSCADOR GENERAL
          </span>

          <h1 className="font-sport font-extrabold uppercase text-4xl sm:text-5xl md:text-6xl tracking-wide leading-none mb-4">
            <span className="text-white">BUSCAR EN EL </span>
            <span className="text-[#E8C766]">DEPORTE</span>
          </h1>

          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Encontrá clubes, disciplinas e historias de deportistas de Río Tercero sin importar mayúsculas, minúsculas o acentos.
          </p>

          {/* Barra de Búsqueda Principal */}
          <div className="mt-8 mb-4">
            <SearchBar
              placeholder="Buscar por nombre de club, deportista o disciplina..."
              initialValue={searchTerm}
              onChange={handleSearchChange}
              onSearch={handleSearchChange}
            />
          </div>
        </div>
      </section>

      {/* Tabs de Filtro: Todos, Clubes, Deportistas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-center justify-center gap-3 border-b border-neutral-900 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('todos')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none ${
              activeTab === 'todos'
                ? 'bg-[#E8C766] text-black shadow-md shadow-[#E8C766]/15 scale-105'
                : 'bg-[#181818] hover:bg-[#242424] text-neutral-300 hover:text-white border border-[#262626]'
            }`}
          >
            Todos ({totalResultados})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('clubes')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none ${
              activeTab === 'clubes'
                ? 'bg-[#E8C766] text-black shadow-md shadow-[#E8C766]/15 scale-105'
                : 'bg-[#181818] hover:bg-[#242424] text-neutral-300 hover:text-white border border-[#262626]'
            }`}
          >
            Clubes ({clubesFiltrados.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('deportistas')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none ${
              activeTab === 'deportistas'
                ? 'bg-[#E8C766] text-black shadow-md shadow-[#E8C766]/15 scale-105'
                : 'bg-[#181818] hover:bg-[#242424] text-neutral-300 hover:text-white border border-[#262626]'
            }`}
          >
            Deportistas ({deportistasFiltrados.length})
          </button>
        </div>
      </section>

      {/* Resultados */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse rounded-2xl bg-[#161616] border border-[#262626] h-80"
              />
            ))}
          </div>
        )}

        {/* Sin resultados */}
        {!isLoading && totalResultados === 0 && (
          <div className="text-center py-20 bg-[#141414] rounded-2xl border border-[#222222] p-8 max-w-lg mx-auto">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-sport font-bold text-xl text-white uppercase tracking-wide mb-1">
              No se encontraron resultados
            </h3>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
              No encontramos coincidencias para "{searchTerm}". Probá buscando por disciplinas como "Fútbol", "Natación", "Básquet" o nombres de instituciones.
            </p>
            <button
              type="button"
              onClick={() => handleSearchChange('')}
              className="px-5 py-2.5 rounded-lg bg-[#E8C766] hover:bg-[#f0d27e] text-neutral-950 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Borrar búsqueda
            </button>
          </div>
        )}

        {/* Sección Clubes */}
        {!isLoading &&
          (activeTab === 'todos' || activeTab === 'clubes') &&
          clubesFiltrados.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6 border-b border-neutral-900 pb-3">
                <h2 className="font-sport font-bold text-2xl text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="text-[#E8C766]">🏛️</span>
                  <span>Clubes e Instituciones ({clubesFiltrados.length})</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubesFiltrados.map((club) => (
                  <ClubCard
                    key={`club-${club.id}`}
                    club={club}
                    onVerMas={(c) => setSelectedClub(c)}
                  />
                ))}
              </div>
            </section>
          )}

        {/* Sección Deportistas */}
        {!isLoading &&
          (activeTab === 'todos' || activeTab === 'deportistas') &&
          deportistasFiltrados.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6 border-b border-neutral-900 pb-3">
                <h2 className="font-sport font-bold text-2xl text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="text-[#E8C766]">🏃</span>
                  <span>Deportistas Destacados ({deportistasFiltrados.length})</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deportistasFiltrados.map((dep) => (
                  <DeportistaCard
                    key={`dep-${dep.id}`}
                    deportista={dep}
                    onVerPerfil={(d) => setSelectedDeportista(d)}
                  />
                ))}
              </div>
            </section>
          )}
      </main>

      {/* Modales de detalle */}
      <ClubDetailModal
        club={selectedClub}
        onClose={() => setSelectedClub(null)}
      />

      <DeportistaDetailModal
        deportista={selectedDeportista}
        onClose={() => setSelectedDeportista(null)}
      />
    </div>
  );
};

export default BuscarPage;
