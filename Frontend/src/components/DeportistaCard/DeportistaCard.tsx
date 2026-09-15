import type { Deportista } from '../../types';

interface DeportistaCardProps {
  deportista: Deportista;
}

export const DeportistaCard = ({ deportista }: DeportistaCardProps) => {
  return (
    <article>
      {deportista.fotos && deportista.fotos.length > 0 && (
        <img src={deportista.fotos[0]} alt={deportista.nombre} />
      )}
      <h2>{deportista.nombre}</h2>
      <p>Deporte: {deportista.deporte}</p>
      {deportista.edad !== undefined && deportista.edad !== null && (
        <p>Edad: {deportista.edad}</p>
      )}
      {deportista.historia && <p>Historia: {deportista.historia}</p>}
      {deportista.logros && <p>Logros: {deportista.logros}</p>}
      {deportista.clubNombre && <p>Club: {deportista.clubNombre}</p>}
      {deportista.deporteAdaptado && <p>Deporte Inclusivo</p>}
      {deportista.sitioWebUrl && (
        <a href={deportista.sitioWebUrl} target="_blank" rel="noreferrer">
          Sitio Web
        </a>
      )}
    </article>
  );
};

export default DeportistaCard;
