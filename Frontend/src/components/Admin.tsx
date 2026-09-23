// src/components/Admin.tsx
import { useState, useEffect } from 'react';
import type { Solicitud } from '../types/Index';
import './AdminPanel.css';
import { FaEye } from 'react-icons/fa';
import DetalleModal from './DetalleModal';

export function Admin() {
    const [pendientes, setPendientes] = useState<Solicitud[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<Solicitud | null>(null);

    const basicAuth = localStorage.getItem('adminToken');

    useEffect(() => {
        const fetchPendientes = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/solicitudes?estado=PENDIENTE', {
                    headers: { 'Authorization': `Basic ${basicAuth}` }
                });
                if (!response.ok) throw new Error('Error al obtener solicitudes');
                const data = await response.json();
                setPendientes(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPendientes();
    }, []);

    const handleAprobar = async (id: number) => {
        if (!window.confirm('¿Aprobar esta solicitud y crear el perfil oficial?')) return;
        try {
            const res = await fetch(`http://localhost:8080/api/solicitudes/${id}/aprobar`, {
                method: 'PATCH',
                headers: { 'Authorization': `Basic ${basicAuth}` }
            });
            if (!res.ok) throw new Error('Error al aprobar');
            setPendientes(prev => prev.filter(sol => sol.id !== id));
            // Acá podrías disparar un evento para que el componente "Aceptados" se actualice solo
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleRechazar = async (id: number) => {
        const motivo = window.prompt('Motivo del rechazo (Opcional):');
        if (motivo === null) return;
        try {
            const url = `http://localhost:8080/api/solicitudes/${id}/rechazar${motivo ? `?motivo=${encodeURIComponent(motivo)}` : ''}`;
            const res = await fetch(url, {
                method: 'PATCH',
                headers: { 'Authorization': `Basic ${basicAuth}` }
            });
            if (!res.ok) throw new Error('Error al rechazar');
            setPendientes(prev => prev.filter(sol => sol.id !== id));
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (loading) return <p>Cargando pendientes...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <section className="panel-section">
            <header className="panel-header">
                Bandeja de Entrada
                <span className="badge badge-count">{pendientes.length}</span>
            </header>

            {pendientes.length === 0 ? (
                <div className="empty-state">¡Todo al día! No hay solicitudes pendientes</div>
            ) : (
                <div>
                    {pendientes.map((solicitud) => {
                        const datos = JSON.parse(solicitud.datosAdjuntos);
                        const isClub = solicitud.tipo === 'CLUB';

                        return (
                            <article key={solicitud.id} className="card">
                                <div className="card-title">
                                    {isClub ? datos.nombreInstitucion : datos.nombre}
                                    <span className={`badge ${isClub ? 'badge-club' : 'badge-deportista'}`}>
                                        {solicitud.tipo}
                                    </span>
                                </div>
                                
                                <p className="card-detail">📅 <strong>Enviado:</strong> {new Date(solicitud.fechaEnvio || '').toLocaleDateString()}</p>
                                {isClub ? (
                                    <p className="card-detail">📍 <strong>Dirección:</strong> {datos.direccion}</p>
                                ) : (
                                    <p className="card-detail">🏅 <strong>Deporte:</strong> {datos.deporte}</p>
                                )}

                                <div className="btn-group">
                                    <button className="btn btn-approve" onClick={() => handleAprobar(solicitud.id)}>
                                        Aprobar
                                    </button>
                                    <button className="btn btn-reject" onClick={() => handleRechazar(solicitud.id)}>
                                        Rechazar
                                    </button>
                                    <button className="btn" style={{ background: '#3b82f6', color: 'white' }} onClick={() => setSolicitudSeleccionada(solicitud)}><FaEye style={{ marginRight: '5px' }} /> Detalles
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