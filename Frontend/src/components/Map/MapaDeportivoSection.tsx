import { useState, useMemo } from 'react';
import type { Club } from '../../types/Index';
import type { MapItem } from '../../data/mapData';
import { buildMapItems } from '../../data/mapData';
import InteractiveSportMap from './InteractiveSportMap';
import ClubDetailModal from '../ClubDetailModal/ClubDetailModal';
import { normalizeText } from '../../utils/textUtils';

const DISCIPLINAS = [
  'Todas las disciplinas',
  'Fútbol',
  'Básquet',
  'Natación',
  'Atletismo',
  'Vóley',
  'Rugby',
  'Hockey',
  'Tenis',
  'Boxeo',
  'Ciclismo',
  'Deporte Adaptado',
];

interface MapaDeportivoSectionProps {
  dbClubs?: Club[];
  selectedItem?: MapItem | null;
  onSelectItem?: (item: MapItem | null) => void;
  className?: string;
  hideHeader?: boolean;
}

export const MapaDeportivoSection = ({
  dbClubs = [],
  selectedItem: externalSelectedItem,
  onSelectItem: externalOnSelectItem,
  className = '',
  hideHeader = false,
}: MapaDeportivoSectionProps) => {
  // Filtros de categoría (Canchas, Clubes, Deportistas)
  const [showCanchas, setShowCanchas] = useState<boolean>(true);
  const [showClubes, setShowClubes] = useState<boolean>(true);
  const [showDeportistas, setShowDeportistas] = useState<boolean>(true);

  // Filtro de disciplina
  const [disciplinaSeleccionada, setDisciplinaSeleccionada] = useState<string>('Todas las disciplinas');

  // Estado del item seleccionado internamente si no viene de props
  const [internalSelectedItem, setInternalSelectedItem] = useState<MapItem | null>(null);
  const activeSelectedItem = externalSelectedItem !== undefined ? externalSelectedItem : internalSelectedItem;

  const handleSelectItem = (item: MapItem | null) => {
    if (externalOnSelectItem) {
      externalOnSelectItem(item);
    } else {
      setInternalSelectedItem(item);
    }
  };

  // Estado para el modal de detalle
  const [modalClub, setModalClub] = useState<Club | null>(null);
  const [fitBoundsTrigger, setFitBoundsTrigger] = useState<number>(0);

  // Construir todos los items unificados (base + base de datos)
  const allItems = useMemo(() => {
    return buildMapItems(dbClubs);
  }, [dbClubs]);

  // Filtrar según categorías activas y disciplina
  const itemsFiltrados = useMemo(() => {
    return allItems.filter((item) => {
      // 1. Filtro de Categoría
      if (item.type === 'CANCHA' && !showCanchas) return false;
      if (item.type === 'CLUB' && !showClubes) return false;
      if (item.type === 'DEPORTISTA' && !showDeportistas) return false;

      // 2. Filtro de Disciplina
      if (disciplinaSeleccionada !== 'Todas las disciplinas') {
        if (disciplinaSeleccionada === 'Deporte Adaptado') {
          if (!item.deporteAdaptado) return false;
        } else {
          const normFiltro = normalizeText(disciplinaSeleccionada);
          const hasDisciplina = item.disciplinas.some((d) =>
            normalizeText(d).includes(normFiltro)
          );
          const inNombre = normalizeText(item.nombre).includes(normFiltro);
          const inDesc = normalizeText(item.descripcion || '').includes(normFiltro);

          if (!hasDisciplina && !inNombre && !inDesc) {
            return false;
          }
        }
      }

      return true;
    });
  }, [allItems, showCanchas, showClubes, showDeportistas, disciplinaSeleccionada]);

  // Abrir modal de detalles
  const handleVerDetalle = (item: MapItem) => {
    if (item.rawClub) {
      setModalClub(item.rawClub);
    } else {
      // Crear objeto Club compatible para mostrar en el modal
      const pseudoClub: Club = {
        id: typeof item.id === 'number' ? item.id : 9999,
        nombreInstitucion: item.nombre,
        direccion: item.direccion,
        disciplinas: item.disciplinas.join(', '),
        telefono: 'Contacto de Río Tercero',
        email: 'info@deporteriotercero.com.ar',
        sitioWebUrl: null,
        descripcion: item.descripcion || `${item.nombre} en Río Tercero.`,
        deporteAdaptado: item.deporteAdaptado,
        fotos: item.fotoUrl ? [item.fotoUrl] : [],
        cantidadDeportistas: 50,
        instalaciones: item.type === 'CANCHA' ? ['Canchas', 'Vestuarios', 'Iluminación'] : ['Instalaciones deportivas'],
      };
      setModalClub(pseudoClub);
    }
  };

  const handleCenterAll = () => {
    handleSelectItem(null);
    setFitBoundsTrigger((prev) => prev + 1);
  };

  return (
    <section className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {/* Título y Subtítulo */}
      {!hideHeader && (
        <div className="mb-8">
          <h2 className="font-sport uppercase text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-wide mb-2">
            MAPA DEPORTIVO
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base font-normal">
            Explorá canchas, clubes y deportistas de Río Tercero
          </p>
        </div>
      )}

      {/* Fila 1: Botones de Categorías (Pills Amarillas) */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Canchas y Complejos */}
        <button
          type="button"
          onClick={() => setShowCanchas(!showCanchas)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer select-none active:scale-95 ${
            showCanchas
              ? 'bg-[#E8C766] text-black shadow-md'
              : 'bg-[#181818] text-neutral-400 border border-neutral-800 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <span>📍</span>
          <span>Canchas y Complejos</span>
        </button>

        {/* Clubes */}
        <button
          type="button"
          onClick={() => setShowClubes(!showClubes)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer select-none active:scale-95 ${
            showClubes
              ? 'bg-[#E8C766] text-black shadow-md'
              : 'bg-[#181818] text-neutral-400 border border-neutral-800 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <span>🏛️</span>
          <span>Clubes</span>
        </button>

        {/* Deportistas */}
        <button
          type="button"
          onClick={() => setShowDeportistas(!showDeportistas)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer select-none active:scale-95 ${
            showDeportistas
              ? 'bg-[#E8C766] text-black shadow-md'
              : 'bg-[#181818] text-neutral-400 border border-neutral-800 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <span>👥</span>
          <span>Deportistas</span>
        </button>
      </div>

      {/* Fila 2: Carrusel de Disciplinas */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-3">
        {DISCIPLINAS.map((disc) => {
          const isSelected = disciplinaSeleccionada === disc;
          return (
            <button
              key={disc}
              type="button"
              onClick={() => setDisciplinaSeleccionada(disc)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer select-none shrink-0 ${
                isSelected
                  ? 'bg-[#222222] text-white border border-neutral-600 shadow-sm'
                  : 'bg-[#141414] hover:bg-[#1a1a1a] text-neutral-400 hover:text-neutral-200 border border-neutral-800/80'
              }`}
            >
              {disc}
            </button>
          );
        })}
      </div>

      {/* Fila 3: Leyenda de Colores */}
      <div className="flex items-center gap-6 text-xs text-neutral-300 font-medium mb-4 pl-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
          <span>Canchas/Complejos</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
          <span>Clubes</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E8C766]" />
          <span>Deportistas</span>
        </div>
      </div>

      {/* Contenedor del Mapa Interactivo */}
      <div className="w-full h-[480px] sm:h-[540px] md:h-[600px] mb-8">
        <InteractiveSportMap
          items={itemsFiltrados}
          selectedItem={activeSelectedItem}
          onSelectItem={handleSelectItem}
          onVerDetalle={handleVerDetalle}
          fitBoundsTrigger={fitBoundsTrigger}
          onCenterAll={handleCenterAll}
        />
      </div>

      {/* Modal de Detalle */}
      <ClubDetailModal
        club={modalClub}
        onClose={() => setModalClub(null)}
      />
    </section>
  );
};

export default MapaDeportivoSection;
