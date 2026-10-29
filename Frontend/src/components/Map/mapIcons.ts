import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Corrige la resolución de rutas de Vite para los iconos por defecto de Leaflet
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

export type MapItemType = 'CANCHA' | 'CLUB' | 'DEPORTISTA';

export function createSportMarkerIcon(
  type: MapItemType,
  isSelected = false
): L.DivIcon {
  let primaryColor = '#2563eb'; // Club (Azul)
  let innerIconSvg = '';

  if (type === 'CANCHA') {
    primaryColor = '#10b981'; // Canchas / Complejos (Verde esmeralda)
    // Icono de canchas / complejo / deportes
    innerIconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `;
  } else if (type === 'CLUB') {
    primaryColor = '#2563eb'; // Club deportivo (Azul real)
    // Icono de club / escudo / institución
    innerIconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
      </svg>
    `;
  } else {
    primaryColor = '#E8C766'; // Deportista (Oro / Amarillo CrazySports)
    // Icono de deportista / persona
    innerIconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-neutral-950" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    `;
  }

  const width = isSelected ? 40 : 34;
  const height = isSelected ? 50 : 44;
  const ringClass = isSelected
    ? 'ring-4 ring-white/60 shadow-[0_0_20px_rgba(232,199,102,0.9)] scale-110'
    : 'hover:scale-105';

  const html = `
    <div class="relative group cursor-pointer transition-all duration-200 ${ringClass}" style="width: ${width}px; height: ${height}px;">
      <svg width="${width}" height="${height}" viewBox="0 0 34 44" fill="none" xmlns="http://www.w3.org/2000/svg" class="filter drop-shadow-md">
        <!-- Forma de gota / pin -->
        <path d="M17 0C7.61 0 0 7.61 0 17C0 28 17 44 17 44C17 44 34 28 34 17C34 7.61 26.39 0 17 0Z" fill="${primaryColor}"/>
        <!-- Borde sutil -->
        <path d="M17 1C8.16 1 1 8.16 1 17C1 27.2 16.5 42.5 17 43C17.5 42.5 33 27.2 33 17C33 8.16 25.84 1 17 1Z" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
        <!-- Círculo interior para el icono -->
        <circle cx="17" cy="16" r="11" fill="rgba(0,0,0,0.18)"/>
      </svg>
      <!-- Icono centrado -->
      <div class="absolute top-[8px] left-0 right-0 flex items-center justify-center pointer-events-none">
        ${innerIconSvg}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-sport-pin',
    iconSize: [width, height],
    iconAnchor: [width / 2, height],
    popupAnchor: [0, -(height - 6)],
  });
}

// Retrocompatibilidad con ClubMap existente
export function createClubMarkerIcon(isAdaptado: boolean, isSelected = false): L.DivIcon {
  return createSportMarkerIcon(isAdaptado ? 'CANCHA' : 'CLUB', isSelected);
}
