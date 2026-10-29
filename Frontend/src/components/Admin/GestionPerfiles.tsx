import { useState } from 'react';
import { useClubes } from '../../hooks/useClubes';
import { useDeportistas } from '../../hooks/useDeportistas';
import { eliminarClub, eliminarDeportista } from '../../services/api';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { EditarPerfilModal } from './EditarPerfilModal';

export function GestionPerfiles() {
  const { clubes, loading: loadingClubes, cargarTodos: recargarClubes } = useClubes();
  const { deportistas, loading: loadingDep, cargarTodos: recargarDep } = useDeportistas();
  const [tab, setTab] = useState<'CLUB' | 'DEPORTISTA'>('CLUB');
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const token = localStorage.getItem('adminToken') || '';

  const handleDelete = async (id: number, tipo: 'CLUB' | 'DEPORTISTA') => {
    if (!window.confirm(`¿Estás seguro de eliminar este ${tipo.toLowerCase()}? Esta acción es irreversible.`)) return;

    try {
      if (tipo === 'CLUB') {
        await eliminarClub(id, token);
        recargarClubes();
      } else {
        await eliminarDeportista(id, token);
        recargarDep();
      }
    } catch (error: any) {
      alert('Error al eliminar: ' + error.message);
    }
  };

  const handleSuccessEdit = () => {
    setEditingItem(null);
    if (tab === 'CLUB') recargarClubes();
    else recargarDep();
  };

  const loading = tab === 'CLUB' ? loadingClubes : loadingDep;
  const data = tab === 'CLUB' ? clubes : deportistas;

  return (
    <div className="bg-[#161616] border border-neutral-800 rounded-2xl shadow-xl flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/30">
        <h2 className="font-sport text-2xl font-bold text-white uppercase tracking-wide">
          Directorio Oficial
        </h2>
        
        <div className="flex bg-[#0c0c0c] rounded-lg p-1 border border-neutral-800">
          <button 
            onClick={() => setTab('CLUB')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${tab === 'CLUB' ? 'bg-[#E8C766] text-black' : 'text-neutral-400 hover:text-white'}`}
          >
            CLUBES ({clubes.length})
          </button>
          <button 
            onClick={() => setTab('DEPORTISTA')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${tab === 'DEPORTISTA' ? 'bg-[#E8C766] text-black' : 'text-neutral-400 hover:text-white'}`}
          >
            DEPORTISTAS ({deportistas.length})
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <p className="text-neutral-400 text-sm">Cargando directorio...</p>
        ) : data.length === 0 ? (
          <p className="text-neutral-500 italic text-sm">No hay perfiles registrados.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((item: any) => (
              <div key={item.id} className="bg-[#1c1c1c] border border-neutral-800 rounded-xl p-4 flex justify-between items-center hover:border-neutral-600 transition-colors">
                <div>
                  <h3 className="font-sport font-bold text-white uppercase text-lg leading-tight">
                    {tab === 'CLUB' ? item.nombreInstitucion : item.nombre}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    {tab === 'CLUB' ? item.direccion : item.deporte}
                  </p>
                </div>
                
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => setEditingItem(item)}
                    className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
                    title="Modificar"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id, tab)}
                    className="w-9 h-9 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                    title="Eliminar"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingItem && (
        <EditarPerfilModal 
          item={editingItem} 
          tipo={tab} 
          onClose={() => setEditingItem(null)} 
          onSuccess={handleSuccessEdit} 
        />
      )}
    </div>
  );
}