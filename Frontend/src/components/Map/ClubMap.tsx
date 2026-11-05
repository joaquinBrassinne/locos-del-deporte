import { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import type { Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './mapStyles.css';
import type { ClubWithCoords } from '../../utils/geoUtils';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '../../utils/geoUtils';
import { createClubMarkerIcon } from './mapIcons';
import MapController from './MapController';
import MapPopup from './MapPopup';

interface ClubMapProps {
  clubs: ClubWithCoords[];
  selectedClub: ClubWithCoords | null;
  onSelectClub: (club: ClubWithCoords) => void;
  onVerDetalle: (club: ClubWithCoords) => void;
  fitBoundsTrigger?: number;
}

export const ClubMap = ({
  clubs,
  selectedClub,
  onSelectClub,
  onVerDetalle,
  fitBoundsTrigger = 0,
}: ClubMapProps) => {
  const markerRefs = useRef<Map<number, LeafletMarker>>(new Map());

  // Si se selecciona un club desde el exterior (ej: panel lateral), abrir automáticamente su popup
  useEffect(() => {
    if (selectedClub) {
      const marker = markerRefs.current.get(selectedClub.id);
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedClub]);
  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden bg-[#0a0a0a]">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ width: '100%', height: '100%', minHeight: '100%' }}
      >
        {/* Capa de OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Controles de Zoom en la esquina inferior derecha para evitar colisiones con menús móviles */}
        <ZoomControl position="bottomright" />

        {/* Controlador dinámico de centrado inteligente y animaciones */}
        <MapController
          clubs={clubs}
          selectedClub={selectedClub}
          fitBoundsTrigger={fitBoundsTrigger}
        />

        {/* Marcadores de los clubes con coordenadas válidas */}
        {clubs.map((club) => {
          const isSelected = selectedClub?.id === club.id;
          const isAdaptado = Boolean(club.deporteAdaptado);

          return (
            <Marker
              key={club.id}
              position={club.parsedCoords}
              icon={createClubMarkerIcon(isAdaptado, isSelected)}
              ref={(ref) => {
                if (ref) {
                  markerRefs.current.set(club.id, ref);
                } else {
                  markerRefs.current.delete(club.id);
                }
              }}
              eventHandlers={{
                click: () => onSelectClub(club),
              }}
            >
              <Popup className="custom-dark-popup" maxWidth={360}>
                <MapPopup club={club} onVerDetalle={onVerDetalle} />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default ClubMap;
