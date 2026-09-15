import type { Club } from '../../types';

interface ClubCardProps {
  club: Club;
}

export const ClubCard = ({ club }: ClubCardProps) => {
  return (
    <article>
      {club.fotos && club.fotos.length > 0 && (
        <img src={club.fotos[0]} alt={club.nombreInstitucion} />
      )}
      <h2>{club.nombreInstitucion}</h2>
      <p>Dirección: {club.direccion}</p>
      {club.disciplinas && <p>Disciplinas: {club.disciplinas}</p>}
      {club.telefono && <p>Teléfono: {club.telefono}</p>}
      {club.email && <p>Email: {club.email}</p>}
      {club.deporteAdaptado && <p>Deporte Inclusivo</p>}
      <p>Cantidad de deportistas: {club.cantidadDeportistas}</p>
      {club.sitioWebUrl && (
        <a href={club.sitioWebUrl} target="_blank" rel="noreferrer">
          Sitio Web
        </a>
      )}
    </article>
  );
};

export default ClubCard;
