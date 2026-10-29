import { DisciplinaChips } from './DisciplinaChips';
import { InclusiveCard } from './InclusiveCard';
import { FormField, FormTextArea } from './FormField';

interface ClubDraft {
  nombreInstitucion: string;
  direccion: string;
  disciplinasSeleccionadas: string[];
  otrasDisciplinas: string;
  telefono: string;
  email: string;
  sitioWebUrl: string;
  coordenadas: string;
  descripcion: string;
  horarios: string;
  fotosTexto: string;
  deporteAdaptado: boolean;
}

interface ClubFieldsProps {
  form: ClubDraft;
  errors: Partial<Record<string, string>>;
  onChange: <K extends keyof ClubDraft>(campo: K, valor: ClubDraft[K]) => void;
  onToggleDisciplina: (disciplina: string) => void;
}

export const ClubFields = ({ form, errors, onChange, onToggleDisciplina }: ClubFieldsProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-sport text-xl text-white uppercase">Datos Institucionales Básicos</h2>
          <span className="text-xs font-bold uppercase tracking-wider text-[#E8C766]">* Obligatorio</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            id="club-nombre"
            label="Nombre de la institución"
            required
            placeholder="Ej: Club Atlético Barrio Parque"
            value={form.nombreInstitucion}
            onChange={(e) => onChange('nombreInstitucion', e.target.value)}
            error={errors.nombreInstitucion}
            hint="No puede repetirse: el administrador lo rechazará si ya existe un club con este nombre."
          />
          <FormField
            id="club-direccion"
            label="Dirección física en Río Tercero"
            required
            placeholder="Ej: Av. Córdoba 1234, Ciudad Deportiva"
            value={form.direccion}
            onChange={(e) => onChange('direccion', e.target.value)}
            error={errors.direccion}
          />
        </div>

        <DisciplinaChips seleccionadas={form.disciplinasSeleccionadas} onToggle={onToggleDisciplina} />
        <input
          className="w-full h-12 bg-[#1c1c1c] border border-[#262626] px-4 rounded-lg text-white placeholder:text-neutral-500 text-sm focus:ring-1 focus:ring-[#E8C766]/60 focus:outline-none -mt-2"
          placeholder="Otras disciplinas (separadas por coma, ej: Padel, Ciclismo)"
          value={form.otrasDisciplinas}
          onChange={(e) => onChange('otrasDisciplinas', e.target.value)}
        />

        <FormTextArea
          id="club-descripcion"
          label="Descripción de la institución (opcional)"
          placeholder="Reseña institucional, historia o valores del club..."
          value={form.descripcion}
          onChange={(e) => onChange('descripcion', e.target.value)}
        />
      </div>

      <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
        <h2 className="font-sport text-xl text-white uppercase">Contacto y Ubicación</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            id="club-telefono"
            label="Teléfono de contacto"
            recommended
            type="tel"
            placeholder="+54 9 351 1234567"
            value={form.telefono}
            onChange={(e) => onChange('telefono', e.target.value)}
            error={errors.telefono}
          />
          <FormField
            id="club-email"
            label="Email institucional"
            recommended
            type="email"
            placeholder="contacto@clubriotercero.org"
            value={form.email}
            onChange={(e) => onChange('email', e.target.value)}
            error={errors.email}
            hint="Se usa para notificaciones y para generar el acceso si se aprueba la solicitud."
          />
          <FormField
            id="club-web"
            label="Sitio web o Red Social"
            type="url"
            placeholder="https://www.barrioparque.com"
            value={form.sitioWebUrl}
            onChange={(e) => onChange('sitioWebUrl', e.target.value)}
            error={errors.sitioWebUrl}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            id="club-horarios"
            label="Horarios de atención (opcional)"
            placeholder="Lunes a Sábados de 07:00 a 23:00"
            value={form.horarios}
            onChange={(e) => onChange('horarios', e.target.value)}
          />
          <FormField
            id="club-coords"
            label="Coordenadas para el mapa (opcional)"
            placeholder="-32.1712,-64.3450"
            value={form.coordenadas}
            onChange={(e) => onChange('coordenadas', e.target.value)}
            error={errors.coordenadas}
            hint='Formato "latitud,longitud". Se usa en el Mapa Interactivo.'
          />
        </div>

        <FormTextArea
          id="club-fotos"
          label="Fotos de instalaciones (opcional)"
          placeholder={'Una URL por línea, ej:\nhttps://images.unsplash.com/photo-1574629810360-7efbbe195018'}
          value={form.fotosTexto}
          onChange={(e) => onChange('fotosTexto', e.target.value)}
          hint="Pegá links a imágenes (una por línea o separadas por coma). Las que no sean URL válidas se descartan."
        />
      </div>

      <InclusiveCard
        variante="club"
        checked={form.deporteAdaptado}
        onChange={(checked) => onChange('deporteAdaptado', checked)}
      />
    </div>
  );
};

export default ClubFields;
