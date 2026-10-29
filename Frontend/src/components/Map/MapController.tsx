import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import type { ClubWithCoords } from '../../utils/geoUtils';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '../../utils/geoUtils';

interface MapControllerProps {
  clubs: ClubWithCoords[];
  selectedClub: ClubWithCoords | null;
  fitBoundsTrigger?: number;
}

export const MapController = ({
  clubs,
  selectedClub,
  fitBoundsTrigger = 0,
}: MapControllerProps) => {
  const map = useMap();
  const prevSelectedClubId = useRef<number | null>(null);

  // Asegura que el mapa recalcule su tamaño si cambia el contenedor o dimensiones de la pantalla
  useEffect(() => {
    map.invalidateSize();
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);

  // Si se selecciona un club específico, centrar el mapa suavemente en ese marcador
  useEffect(() => {
    if (selectedClub) {
      prevSelectedClubId.current = selectedClub.id;
      map.flyTo(selectedClub.parsedCoords, 16, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [map, selectedClub]);

  // Centrado inteligente y ajuste automático de bounds
  useEffect(() => {
    // Si acaba de seleccionarse un club individual, no forzar fitBounds global
    if (selectedClub) return;

    if (clubs.length === 0) {
      // Fallback a Río Tercero / Córdoba si no hay clubes con coordenadas
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: true });
    } else if (clubs.length === 1) {
      // Un solo club: centrar directamente con zoom apropiado
      map.setView(clubs[0].parsedCoords, 15, { animate: true });
    } else {
      // Múltiples clubes: ajustar bounds para mostrar todos los marcadores
      const bounds = L.latLngBounds(clubs.map((c) => c.parsedCoords));
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 15,
        animate: true,
      });
    }
  }, [map, clubs, fitBoundsTrigger, selectedClub]);

  return null;
};

export default MapController;
