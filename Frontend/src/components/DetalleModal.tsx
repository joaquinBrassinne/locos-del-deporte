// src/components/DetalleModal.tsx
import type { Solicitud } from '../types/Index';
import { FaTimes } from 'react-icons/fa';

interface Props {
  solicitud: Solicitud;
  onClose: () => void;
}

export default function DetalleModal({ solicitud, onClose }: Props) {
  // Parseamos el JSON para extraer toda la info del DTO original
  const datos = JSON.parse(solicitud.datosAdjuntos);
  const isClub = solicitud.tipo === 'CLUB';

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Detenemos la propagación para que al hacer clic dentro del modal no se cierre */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <h2 style={{ marginBottom: '0.5rem' }}>Detalles de la Solicitud</h2>
        <span className={`badge ${isClub ? 'badge-club' : 'badge-deportista'}`}>
          {solicitud.tipo}
        </span>
        <span className="badge badge-count" style={{ marginLeft: '10px' }}>
          Estado: {solicitud.estado}
        </span>

        <div className="modal-grid">
          <hr style={{ margin: '10px 0', borderColor: '#f3f4f6' }} />
          
          {isClub ? (
            <>
              <p><strong>Institución:</strong> {datos.nombreInstitucion}</p>
              <p><strong>Dirección:</strong> {datos.direccion}</p>
              {datos.coordenadas && <p><strong>Coordenadas:</strong> {datos.coordenadas}</p>}
              <p><strong>Disciplinas:</strong> {datos.disciplinas}</p>
              <p><strong>Horarios:</strong> {datos.horarios}</p>
              <p><strong>Descripción:</strong> {datos.descripcion}</p>
              <p><strong>Deporte Inclusivo:</strong> {datos.deporteAdaptado ? 'Sí ✅' : 'No ❌'}</p>
            </>
          ) : (
            <>
              <p><strong>Nombre:</strong> {datos.nombre}</p>
              <p><strong>Deporte:</strong> {datos.deporte}</p>
              <p><strong>Edad:</strong> {datos.edad} años</p>
              <p><strong>Historia:</strong> {datos.historia || 'N/A'}</p>
              <p><strong>Logros:</strong> {datos.logros || 'N/A'}</p>
              <p><strong>Deporte Inclusivo:</strong> {datos.deporteAdaptado ? 'Sí ✅' : 'No ❌'}</p>
            </>
          )}

          <hr style={{ margin: '10px 0', borderColor: '#f3f4f6' }} />
          
          <h3 style={{ fontSize: '1.1rem', marginTop: '10px' }}>Contacto & Redes</h3>
          <p><strong>Teléfono:</strong> {datos.telefono || 'No especificado'}</p>
          <p><strong>Email:</strong> {datos.email || 'No especificado'}</p>
          {datos.sitioWebUrl && (
            <p><strong>Sitio Web / Red Social:</strong> <a href={datos.sitioWebUrl} target="_blank" rel="noreferrer" style={{ color: '#3b82f6' }}>{datos.sitioWebUrl}</a></p>
          )}

          {/* Renderizado de Fotos */}
          {datos.fotos && datos.fotos.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              <strong>Archivos Adjuntos (Fotos):</strong>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                {datos.fotos.map((foto: string, index: number) => (
                  <img key={index} src={foto} alt={`Adjunto ${index}`} className="foto-preview" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}