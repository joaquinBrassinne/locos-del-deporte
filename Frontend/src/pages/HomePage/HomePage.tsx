import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getClubes, getDeportistas } from '../../services/api';
import type { Club, Deportista } from '../../types/Index';
import DeportistaCard from '../../components/DeportistaCard/DeportistaCard';
import ClubCard from '../../components/ClubCard/ClubCard';

const DISCIPLINAS = [
  'Todos',
  'Fútbol',
  'Básquet',
  'Natación',
  'Atletismo',
  'Vóley',
  'Rugby',
];


export default function HomePage() {
  const [clubes, setClubes] = useState<Club[]>([]);
  const [deportistas, setDeportistas] = useState<Deportista[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pillDeportista, setPillDeportista] = useState<string>('Todos');
  const [pillClub, setPillClub] = useState<string>('Todos');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [clubesData, deportistasData] = await Promise.all([
          getClubes(),
          getDeportistas(),
        ]);
        setClubes(clubesData);
        setDeportistas(deportistasData);
      } catch (err) {
        console.error('Error al cargar datos en la Home:', err);
        setError('No se pudieron cargar los datos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  const disciplinasCount = useMemo(() => {
    const set = new Set<string>();
    clubes.forEach((c) => {
      if (c.disciplinas) {
        c.disciplinas
          .split(',')
          .map((d) => d.trim().toLowerCase())
          .filter(Boolean)
          .forEach((d) => set.add(d));
      }
    });
    return set.size;
  }, [clubes]);


  const normalizar = (texto: string) =>
    texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const deportistasFiltrados = useMemo(() => {
    if (pillDeportista === 'Todos') return deportistas.slice(0, 6);
    return deportistas
      .filter(d => normalizar(d.deporte) === normalizar(pillDeportista))
      .slice(0, 6);
  }, [deportistas, pillDeportista]);

  const clubesFiltrados = useMemo(() => {
    if (pillClub === 'Todos') return clubes.slice(0, 6);
    return clubes
      .filter((c) =>
        c.disciplinas
          ? normalizar(c.disciplinas).includes(normalizar(pillClub))
          : false
      )
      .slice(0, 6);
  }, [clubes, pillClub]);

  return (
    <div className="bg-[#0c0c0c] text-neutral-200 min-h-screen">
      {/* Sección 1: Hero */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 text-center px-4 overflow-hidden">
        {/* Fondo ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E8C766]/5 blur-3xl rounded-full pointer-events-none" />

        {/* Chip de ubicación */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181818] border border-neutral-700/60 mb-8">
          <svg
            className="w-4 h-4 text-[#E8C766]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-sm text-neutral-300 font-medium">
            Río Tercero, Córdoba
          </span>
        </div>

        {/* Heading principal */}
        <h1 className="font-sport uppercase text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6">
          EL DEPORTE DE <span className="text-[#E8C766]">NUESTRA CIUDAD</span>
          <br />
          EN UN SOLO LUGAR
        </h1>

        {/* Subtítulo */}
        <p className="text-neutral-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-10">
          Descubrí deportistas, clubes y espacios deportivos de Río Tercero. Encontrá dónde entrenar,
          conocé historias inspiradoras y conectá con nuestra comunidad deportiva.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Link
            to="/deportistas"
            className="inline-flex items-center gap-2 bg-[#E8C766] hover:bg-[#f3d376] text-neutral-950 font-semibold text-sm px-6 py-3.5 rounded-lg shadow-lg transition active:scale-95"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Explorar Ahora
          </Link>
          <Link
            to="/mapa"
            className="inline-flex items-center gap-2 bg-[#141414] hover:bg-[#1f1f1f] text-white font-semibold text-sm border border-neutral-700/80 px-6 py-3.5 rounded-lg transition active:scale-95"
          >
            <svg
              className="w-4 h-4 text-neutral-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Ver Mapa
          </Link>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-neutral-800/80 pt-10 max-w-3xl mx-auto">
          <div>
            <div className="font-sport font-bold text-3xl sm:text-4xl text-[#E8C766]">
              {loading ? '—' : clubes.length}
            </div>
            <div className="text-xs sm:text-sm text-neutral-400 uppercase tracking-widest mt-1">
              Clubes
            </div>
          </div>
          <div>
            <div className="font-sport font-bold text-3xl sm:text-4xl text-[#E8C766]">
              {loading ? '—' : deportistas.length}
            </div>
            <div className="text-xs sm:text-sm text-neutral-400 uppercase tracking-widest mt-1">
              Deportistas
            </div>
          </div>
          <div>
            <div className="font-sport font-bold text-3xl sm:text-4xl text-[#E8C766]">
              {loading ? '—' : disciplinasCount}
            </div>
            <div className="text-xs sm:text-sm text-neutral-400 uppercase tracking-widest mt-1">
              Disciplinas
            </div>
          </div>
          <div>
            <div className="font-sport font-bold text-3xl sm:text-4xl text-[#E8C766]">
              {loading ? '—' : clubes.filter((c) => c.deporteAdaptado).length}
            </div>
            <div className="text-xs sm:text-sm text-neutral-400 uppercase tracking-widest mt-1">
              Deporte Inclusivo
            </div>
          </div>
        </div>
      </section>

      {/* Sección 2: Deportistas destacados */}
      <section
        id="deportistas"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] border-y border-neutral-900"
      >
        {/* Header exacto a la imagen */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <span className="block text-xs sm:text-sm font-semibold tracking-widest text-[#E8C766] uppercase mb-2">
            CONOCÉ A QUIENES LO DAN TODO
          </span>
          <h2 className="font-sport uppercase text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-wide mb-4">
            DEPORTISTAS DESTACADOS
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            Historias de esfuerzo, sacrificio y pasión. Cada deportista tiene una historia única que
            merece ser contada.
          </p>

          {/* Pills de categorías */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {DISCIPLINAS.map((disc) => (
              <button
                key={disc}
                type="button"
                onClick={() => setPillDeportista(disc)}
                className={
                  pillDeportista === disc
                    ? 'px-5 py-2 rounded-lg text-sm font-semibold bg-[#E8C766] text-neutral-950 transition-colors shadow-sm'
                    : 'px-5 py-2 rounded-lg text-sm font-medium bg-[#181818] text-neutral-300 border border-neutral-800 hover:bg-neutral-800 hover:text-white transition-colors'
                }
              >
                {disc}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de deportistas */}
        {loading ? (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse bg-[#161616] rounded-2xl min-h-[380px]"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-neutral-500 py-12">
            {error}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deportistasFiltrados.map((d) => (
              <DeportistaCard key={d.id} deportista={d} />
            ))}
          </div>
        )}

        {/* Ver todos deportistas */}
        <div className="text-center mt-10">
          <Link
            to="/deportistas"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-[#E8C766] transition-colors group font-medium"
          >
            <span>Ver todos los deportistas</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </section>

      {/* Sección 3: Clubes e Instituciones */}
      <section id="clubes" className="py-20 px-4 sm:px-6 lg:px-8">
        {/* Header exacto a la imagen */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <span className="block text-xs sm:text-sm font-semibold tracking-widest text-[#E8C766] uppercase mb-2">
            LA BASE DEL DEPORTE
          </span>
          <h2 className="font-sport uppercase text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-wide mb-4">
            CLUBES E INSTITUCIONES
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            Los clubes son el corazón del deporte. Espacios de formación, comunidad y valores que
            transforman vidas.
          </p>

          {/* Pills de categorías */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {DISCIPLINAS.map((disc) => (
              <button
                key={disc}
                type="button"
                onClick={() => setPillClub(disc)}
                className={
                  pillClub === disc
                    ? 'px-5 py-2 rounded-lg text-sm font-semibold bg-[#E8C766] text-neutral-950 transition-colors shadow-sm'
                    : 'px-5 py-2 rounded-lg text-sm font-medium bg-[#181818] text-neutral-300 border border-neutral-800 hover:bg-neutral-800 hover:text-white transition-colors'
                }
              >
                {disc}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de clubes */}
        {loading ? (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse rounded-2xl h-48 bg-[#161616]"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-neutral-500 py-12">
            {error}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubesFiltrados.map((c) => (
              <ClubCard key={c.id} club={c} />
            ))}
          </div>
        )}

        {/* Ver todos clubes */}
        <div className="text-center mt-10">
          <Link
            to="/clubes"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-[#E8C766] transition-colors group font-medium"
          >
            <span>Ver todos los clubes</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </section>

      {/* Sección 4: About */}
      <section
        id="sobre-nosotros"
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center border-t border-neutral-900"
      >
        <h2 className="font-sport uppercase text-3xl sm:text-5xl font-bold text-white tracking-wide mb-6">
          SOBRE NOSOTROS
        </h2>
        <p className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
          Deporte Río Tercero nació de la convicción de que el talento está en todos lados,
          pero las oportunidades no. Queremos ser el puente entre deportistas y clubes con
          poca visibilidad y la comunidad que necesita conocer sus historias.
        </p>
      </section>
    </div>
  );
}
