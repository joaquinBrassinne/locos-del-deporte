import { useMap } from 'react-leaflet';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './mapStyles.css';
import type { MapItem } from '../../data/mapData';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '../../utils/geoUtils';
import { createSportMarkerIcon } from './mapIcons';
import InteractiveSportMapController from './InteractiveSportMapController';
import MapFloatingCard from './MapFloatingCard';

interface InteractiveSportMapProps {
  items: MapItem[];
  selectedItem: MapItem | null;
  onSelectItem: (item: MapItem | null) => void;
  onVerDetalle: (item: MapItem) => void;
  fitBoundsTrigger?: number;
  onCenterAll?: () => void;
}

// Barra unificada de controles de mapa: Zoom In, Zoom Out, Centrar en Río Tercero
const UnifiedMapControls = ({ onCenter }: { onCenter?: () => void }) => {
  const map = useMap();

  return (
    <div className="leaflet-top leaflet-left" style={{ top: '16px', left: '16px' }}>
      <div className="leaflet-bar leaflet-control flex flex-col bg-white rounded-lg shadow-lg border border-black/10 overflow-hidden">
        {/* Zoom In */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            map.zoomIn();
          }}
          title="Acercar"
          className="w-8 h-8 flex items-center justify-center bg-white hover:bg-neutral-100 text-neutral-800 font-bold text-lg border-b border-neutral-200 transition-colors cursor-pointer select-none"
        >
          +
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            map.zoomOut();
          }}
          title="Alejar"
          className="w-8 h-8 flex items-center justify-center bg-white hover:bg-neutral-100 text-neutral-800 font-bold text-lg border-b border-neutral-200 transition-colors cursor-pointer select-none"
        >
          −
        </button>

        {/* Centrar Río Tercero */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onCenter) {
              onCenter();
            } else {
              map.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: true });
            }
          }}
          title="Centrar en Río Tercero"
          className="w-8 h-8 flex items-center justify-center bg-white hover:bg-neutral-100 text-blue-600 transition-colors cursor-pointer select-none"
        >
          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export const InteractiveSportMap = ({
  items,
  selectedItem,
  onSelectItem,
  onVerDetalle,
  fitBoundsTrigger = 0,
  onCenterAll,
}: InteractiveSportMapProps) => {
  return (
    <div className="relative w-full h-full min-h-[460px] md:min-h-[540px] rounded-2xl overflow-hidden border border-neutral-800/80 shadow-2xl bg-[#0c0c0c]">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ width: '100%', height: '100%', minHeight: '100%' }}
      >
        {/* Capa de OpenStreetMap estándar nítida */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Controles de Zoom y Centrado en esquina superior izquierda */}
        <UnifiedMapControls onCenter={onCenterAll} />

        {/* Controlador de navegación y centrado */}
        <InteractiveSportMapController
          items={items}
          selectedItem={selectedItem}
          fitBoundsTrigger={fitBoundsTrigger}
        />

        {/* Marcadores interactivos */}
        {items.map((item) => {
          const isSelected = selectedItem?.id === item.id;
          return (
            <Marker
              key={item.id}
              position={item.coordenadas}
              icon={createSportMarkerIcon(item.type, isSelected)}
              eventHandlers={{
                click: () => onSelectItem(item),
              }}
            />
          );
        })}
      </MapContainer>

      {/* Floating Card flotante en la esquina inferior izquierda (idéntico a la maqueta) */}
      {selectedItem && (
        <MapFloatingCard
          item={selectedItem}
          onClose={() => onSelectItem(null)}
          onVerDetalle={onVerDetalle}
        />
      )}
    </div>
  );
};

export default InteractiveSportMap;
