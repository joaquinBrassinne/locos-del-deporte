import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Solicitud } from '../../types/Index';
import { AdminSidebar } from '../../components/Admin/AdminSidebar';
import { AdminHeader } from '../../components/Admin/AdminHeader';
import { SolicitudesLista } from '../../components/Admin/SolicitudesLista';
import { ExpedienteDetalle } from '../../components/Admin/ExpedienteDetalle';
import { GestionPerfiles } from '../../components/Admin/GestionPerfiles'; // <-- NUEVO

export default function AdminPage() {
  const navigate = useNavigate();
  // Estado para controlar qué pantalla vemos (Solicitudes pendientes vs Directorio oficial)
  const [vistaActiva, setVistaActiva] = useState<'solicitudes' | 'gestion'>('solicitudes');
  
  const [pendientes, setPendientes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Solicitud | null>(null);
  const [filtro, setFiltro] = useState<'Todos' | 'CLUB' | 'DEPORTISTA'>('Todos');

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
        if (data.length > 0) setSelected(data[0]); 
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (vistaActiva === 'solicitudes') {
      fetchPendientes();
    }
  }, [basicAuth, vistaActiva]);

  const handleAprobar = async (id: number) => {
    if (!window.confirm('¿Aprobar esta solicitud y publicar el perfil oficial?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/solicitudes/${id}/aprobar`, {
        method: 'PATCH',
        headers: { 'Authorization': `Basic ${basicAuth}` }
      });
      if (!res.ok) throw new Error('Error al aprobar');
      setPendientes(prev => prev.filter(sol => sol.id !== id));
      if (selected?.id === id) setSelected(null);
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
      if (selected?.id === id) setSelected(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const filtrados = pendientes.filter(p => filtro === 'Todos' || p.tipo === filtro);

  return (
    <div className="flex h-screen bg-[#0c0c0c] text-neutral-200 font-sans overflow-hidden">
      <AdminSidebar vistaActiva={vistaActiva} setVistaActiva={setVistaActiva} />

      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <AdminHeader 
          pendientesCount={pendientes.length}
          filtro={filtro}
          setFiltro={setFiltro}
          onLogout={handleLogout}
        />

        {error && vistaActiva === 'solicitudes' && (
          <div className="mx-6 mt-4 p-3 bg-red-950/40 border border-red-600/30 text-red-300 text-xs rounded-lg">
            {error}
          </div>
        )}

        <div className="px-6 lg:px-8 pb-8 flex-1 flex flex-col min-h-0 mt-4">
          {vistaActiva === 'solicitudes' ? (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full min-h-0">
              <SolicitudesLista 
                solicitudes={filtrados}
                selectedId={selected?.id}
                loading={loading}
                onSelect={setSelected}
                onAprobar={handleAprobar}
                onRechazar={handleRechazar}
              />
              <ExpedienteDetalle 
                solicitud={selected}
                onAprobar={handleAprobar}
                onRechazar={handleRechazar}
              />
            </div>
          ) : (
            /* NUEVA VISTA DE GESTIÓN */
            <div className="h-full min-h-0">
              <GestionPerfiles />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}