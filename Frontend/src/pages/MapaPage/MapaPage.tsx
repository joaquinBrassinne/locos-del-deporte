import { useState, useRef } from 'react';
import { useClubes } from '../../hooks/useClubes';
import type { Club } from '../../types/Index';
import type { MapItem } from '../../data/mapData';
import { buildMapItems } from '../../data/mapData';
import MapaDeportivoSection from '../../components/Map/MapaDeportivoSection';
import FeaturedSpacesCards from '../../components/Map/FeaturedSpacesCards';
import ClubDetailModal from '../../components/ClubDetailModal/ClubDetailModal';

export const MapaPage = () => {
  const { clubes } = useClubes();
  const [selectedItem, setSelectedItem] = useState<MapItem | null>(null);
  const [modalClub, setModalClub] = useState<Club | null>(null);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  const mapItems = buildMapItems(clubes);

  const handleSelectFeaturedSpace = (space: MapItem) => {
    setSelectedItem(space);
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleVerDetalleFeatured = (space: MapItem) => {
    if (space.rawClub) {
      setModalClub(space.rawClub);
    } else {
      const pseudoClub: Club = {
        id: typeof space.id === 'number' ? space.id : 9999,
        nombreInstitucion: space.nombre,
        direccion: space.direccion,
        disciplinas: space.disciplinas.join(', '),
        telefono: 'Contacto de Río Tercero',
        email: 'info@deporteriotercero.com.ar',
        sitioWebUrl: null,
        descripcion: space.descripcion || `${space.nombre} en Río Tercero.`,
        deporteAdaptado: space.deporteAdaptado,
        fotos: space.fotoUrl ? [space.fotoUrl] : [],
        cantidadDeportistas: 50,
        instalaciones: space.type === 'CANCHA' ? ['Canchas', 'Vestuarios', 'Iluminación'] : ['Instalaciones deportivas'],
      };
      setModalClub(pseudoClub);
    }
  };

  return (
    <div className="bg-[#0c0c0c] text-neutral-200 min-h-screen">
      {/* Contenedor Principal del Mapa Deportivo */}
      <div ref={mapSectionRef} className="pt-8 md:pt-12">
        <MapaDeportivoSection
          dbClubs={clubes}
          selectedItem={selectedItem}
          onSelectItem={setSelectedItem}
        />
      </div>

      {/* Espacios y Clubes Destacados (3 cards inferiores según diseño) */}
      <div className="border-t border-neutral-900 bg-[#090909]">
        <FeaturedSpacesCards
          items={mapItems}
          onSelectSpace={handleSelectFeaturedSpace}
          onVerDetalle={handleVerDetalleFeatured}
        />
      </div>

      {/* Sección: Sobre Nosotros */}
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

      {/* Modal de Detalle Completo de Club */}
      <ClubDetailModal
        club={modalClub}
        onClose={() => setModalClub(null)}
      />
    </div>
  );
};

export default MapaPage;
