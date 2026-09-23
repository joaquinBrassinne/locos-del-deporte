import { useState, useEffect } from 'react';
import type { Solicitud } from '../types/Index';
import { FaEye, FaCheckCircle, FaIdBadge } from 'react-icons/fa'; // Sumamos íconos
import DetalleModal from './DetalleModal'; // Importamos el modal
import './AdminPanel.css'; 

export function Aceptados() {
    const [aceptados, setAceptados] = useState<Solicitud[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    // Nuevo estado para controlar qué solicitud está abierta en el modal
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<Solicitud | null>(null);

    useEffect(() => {
        const fetchAceptados = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch('http://localhost:8080/api/solicitudes?estado=APROBADO', {
                    headers: { 'Authorization': `Basic ${token}` }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setAceptados(data);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchAceptados();
    }, []);

    if (loading) return <p>Cargando aprobados...</p>;

    return (
        <section className="panel-section">
            <header className="panel-header">
                Perfiles Oficiales
                <span className="badge badge-aprobado">{aceptados.length}</span>
            </header>

            {aceptados.length === 0 ? (
                <div className="empty-state">Aún no hay perfiles aprobados.</div>
            ) : (
                <div>
                    {aceptados.map((solicitud) => {
                        const datos = JSON.parse(solicitud.datosAdjuntos);
                        const isClub = solicitud.tipo === 'CLUB';

                        return (
                            <article key={solicitud.id} className="card" style={{ borderLeft: '4px solid #10b981' }}>
                                <div className="card-title">
                                    {isClub ? datos.nombreInstitucion : datos.nombre}
                                    <span className="badge badge-aprobado">Aprobado</span>
                                </div>
                                
                                <p className="card-detail">
                                    <FaIdBadge style={{ color: '#6b7280', marginRight: '5px' }}/> 
                                    <strong>ID Oficial:</strong> {solicitud.perfilCreadoId}
                                </p>
                                <p className="card-detail">
                                    <FaCheckCircle style={{ color: '#10b981', marginRight: '5px' }}/> 
                                    <strong>Aprobado el:</strong> {new Date(solicitud.fechaRevision || '').toLocaleDateString()}
                                </p>

                                {/* Botón para abrir el modal */}
                                <div className="btn-group" style={{ marginTop: '15px' }}>
                                    <button 
                                        className="btn" 
                                        style={{ background: '#3b82f6', color: 'white', maxWidth: '200px' }}
                                        onClick={() => setSolicitudSeleccionada(solicitud)}
                                    >
                                        <FaEye style={{ marginRight: '5px' }} /> Ver Datos Originales
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            {solicitudSeleccionada && (
                <DetalleModal 
                    solicitud={solicitudSeleccionada} 
                    onClose={() => setSolicitudSeleccionada(null)} 
                />
            )}
        </section>
    );
}