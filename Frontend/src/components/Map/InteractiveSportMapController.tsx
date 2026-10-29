import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import type { MapItem } from '../../data/mapData';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '../../utils/geoUtils';

interface InteractiveSportMapControllerProps {
  items: MapItem[];
  selectedItem: MapItem | null;
  fitBoundsTrigger?: number;
}

export const InteractiveSportMapController = ({
  items,
  selectedItem,
  fitBoundsTrigger = 0,
}: InteractiveSportMapControllerProps) => {
  const map = useMap();
  const prevSelectedId = useRef<string | number | null>(null);

  // Asegurar recálculo de tamaño dinámico
  useEffect(() => {
    map.invalidateSize();
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [map]);

  // Si se selecciona un item, centrar suavemente en sus coordenadas con zoom adecuado
  useEffect(() => {
    if (selectedItem) {
      prevSelectedId.current = selectedItem.id;
      map.flyTo(selectedItem.coordenadas, 15, {
        duration: 1.0,
        easeLinearity: 0.25,
      });
    }
  }, [map, selectedItem]);

  // Centrado inteligente en los marcadores de Río Tercero
  useEffect(() => {
    if (selectedItem) return;

    // Filtrar marcadores que pertenecen al área de Río Tercero
    const rioTerceroItems = items.filter(
      (i) =>
        i.coordenadas[0] <= -32.1 &&
        i.coordenadas[0] >= -32.25 &&
        i.coordenadas[1] <= -64.05 &&
        i.coordenadas[1] >= -64.2
    );

    const targetItems = rioTerceroItems.length > 0 ? rioTerceroItems : items;

    if (targetItems.length === 0) {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: true });
    } else if (targetItems.length === 1) {
      map.setView(targetItems[0].coordenadas, 14, { animate: true });
    } else {
      const bounds = L.latLngBounds(targetItems.map((i) => i.coordenadas));
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 14.5,
        animate: true,
      });
    }
  }, [map, items, fitBoundsTrigger, selectedItem]);

  return null;
};

export default InteractiveSportMapController;
