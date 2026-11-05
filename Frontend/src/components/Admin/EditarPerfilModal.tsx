import { useState } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import { ClubFields } from '../SolicitudForm/ClubFields'; 
import { DeportistaFields } from '../SolicitudForm/DeportistaFields';
import { modificarClub, modificarDeportista } from '../../services/api';
import { parseFotosUrls } from '../../utils/validators';
import type { Club, Deportista, ClubFormData, DeportistaFormData } from '../../types/Index';

interface Props {
  item: Club | Deportista;
  tipo: 'CLUB' | 'DEPORTISTA';
  onClose: () => void;
  onSuccess: () => void;
}

const DISCIPLINAS_DISPONIBLES = [
  'Fútbol', 'Básquet', 'Natación', 'Vóley', 'Tenis', 
  'Hockey', 'Rugby', 'Atletismo', 'Gimnasia', 'Artes Marciales'
];

export function EditarPerfilModal({ item, tipo, onClose, onSuccess }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // === PRECARGA DE DATOS PARA CLUB ===
  const clubInit = item as Club;
  const disciplinasArray = clubInit.disciplinas ? clubInit.disciplinas.split(',').map(d => d.trim()).filter(Boolean) : [];
  
  const [clubForm, setClubForm] = useState({
    nombreInstitucion: clubInit.nombreInstitucion || '',
    direccion: clubInit.direccion || '',
    disciplinasSeleccionadas: disciplinasArray.filter(d => DISCIPLINAS_DISPONIBLES.includes(d)),
    otrasDisciplinas: disciplinasArray.filter(d => !DISCIPLINAS_DISPONIBLES.includes(d)).join(', '),
    telefono: clubInit.telefono || '',
    email: clubInit.email || '',
    sitioWebUrl: clubInit.sitioWebUrl || '',
    coordenadas: clubInit.coordenadas || '',
    descripcion: clubInit.descripcion || '',
    horarios: clubInit.horarios || '',
    fotosTexto: (clubInit.fotos || []).join('\n'),
    deporteAdaptado: clubInit.deporteAdaptado || false
  });

  //PRECARGA DE DATOS PARA DEPORTISTA
  const depInit = item as Deportista;
  const [deportistaForm, setDeportistaForm] = useState({
    nombre: depInit.nombre || '',
    edad: depInit.edad ? String(depInit.edad) : '',
    deporte: depInit.deporte || '',
    clubId: '',
    sitioWebUrl: depInit.sitioWebUrl || '',
    telefono: depInit.telefono || '',
    email: depInit.email || '',
    historia: depInit.historia || '',
    logros: depInit.logros || '',
    fotosTexto: (depInit.fotos || []).join('\n'),
    deporteAdaptado: depInit.deporteAdaptado || false
  });

  //USANDO EL FORMULARIO DE LEO XD
  const updateClubField = (campo: string, valor: any) => setClubForm(prev => ({ ...prev, [campo]: valor }));
  const updateDeportistaField = (campo: string, valor: any) => setDeportistaForm(prev => ({ ...prev, [campo]: valor }));
  
  const toggleDisciplina = (disciplina: string) => {
    setClubForm(prev => {
      const seleccionadas = prev.disciplinasSeleccionadas.includes(disciplina)
        ? prev.disciplinasSeleccionadas.filter(d => d !== disciplina)
        : [...prev.disciplinasSeleccionadas, disciplina];
      return { ...prev, disciplinasSeleccionadas: seleccionadas };
    });
  };

  const handleSave = async () => {
    setSubmitting(true);
    setError(null);
    const token = localStorage.getItem('adminToken') || '';

    try {
      if (tipo === 'CLUB') {
        const disciplinasFinal = [...clubForm.disciplinasSeleccionadas, ...clubForm.otrasDisciplinas.split(',').map(d => d.trim()).filter(Boolean)].join(', ');
        
        const payload: ClubFormData = {
          nombreInstitucion: clubForm.nombreInstitucion,
          direccion: clubForm.direccion,
          disciplinas: disciplinasFinal || null,
          telefono: clubForm.telefono || null,
          email: clubForm.email || null,
          sitioWebUrl: clubForm.sitioWebUrl || null,
          coordenadas: clubForm.coordenadas || null,
          descripcion: clubForm.descripcion || null,
          horarios: clubForm.horarios || null,
          fotos: parseFotosUrls(clubForm.fotosTexto),
          deporteAdaptado: clubForm.deporteAdaptado,
        };
        await modificarClub(item.id, payload, token);

      } else {
        const payload: DeportistaFormData = {
          nombre: deportistaForm.nombre,
          deporte: deportistaForm.deporte,
          edad: Number(deportistaForm.edad),
          historia: deportistaForm.historia || null,
          logros: deportistaForm.logros || null,
          sitioWebUrl: deportistaForm.sitioWebUrl || null,
          telefono: deportistaForm.telefono || null,
          email: deportistaForm.email || null,
          fotos: parseFotosUrls(deportistaForm.fotosTexto),
          deporteAdaptado: deportistaForm.deporteAdaptado,
          clubId: deportistaForm.clubId ? Number(deportistaForm.clubId) : null,
        };
        await modificarDeportista(item.id, payload, token);
      }
      
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error al guardar los cambios.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c0c0c] border border-[#2a2a2a] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        <div className="flex justify-between items-center p-5 border-b border-neutral-800 bg-[#161616]">
          <h2 className="font-sport text-2xl text-white uppercase">
            Editar {tipo === 'CLUB' ? 'Club / Institución' : 'Deportista'}
          </h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-red-500 transition-colors">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {error && (
            <div className="mb-4 p-3 bg-red-950/50 border border-red-500/50 text-red-300 text-sm rounded-lg">
              {error}
            </div>
          )}

          {tipo === 'CLUB' ? (
            <ClubFields form={clubForm} errors={{}} onChange={updateClubField as any} onToggleDisciplina={toggleDisciplina} />
          ) : (
            <DeportistaFields form={deportistaForm} errors={{}} onChange={updateDeportistaField as any} />
          )}
        </div>

        <div className="p-5 border-t border-neutral-800 bg-[#161616] flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg text-sm font-bold bg-[#E8C766] text-black hover:bg-[#f0d27e] transition-all flex items-center gap-2 shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave /> {submitting ? 'Guardando...' : 'Guardar Cambios Oficiales'}
          </button>
        </div>
      </div>
    </div>
  );
}