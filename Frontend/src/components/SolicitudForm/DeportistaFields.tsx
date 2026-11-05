import { useClubes } from '../../hooks/useClubes';
import { InclusiveCard } from './InclusiveCard';
import { FormField, FormTextArea } from './FormField';

interface DeportistaDraft {
  nombre: string;
  edad: string;
  deporte: string;
  clubId: string;
  sitioWebUrl: string;
  telefono: string;
  email: string;
  historia: string;
  logros: string;
  fotosTexto: string;
  deporteAdaptado: boolean;
}

interface DeportistaFieldsProps {
  form: DeportistaDraft;
  errors: Partial<Record<string, string>>;
  onChange: <K extends keyof DeportistaDraft>(campo: K, valor: DeportistaDraft[K]) => void;
}

export const DeportistaFields = ({ form, errors, onChange }: DeportistaFieldsProps) => {
  // clubId es Long en el backend: el <select> se completa con clubes reales,
  // no con texto libre. Deportistas sin club quedan como independientes (clubId: null).
  const { clubes, loading: cargandoClubes } = useClubes();

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-sport text-xl text-white uppercase">Ficha del Atleta</h2>
          <span className="text-xs font-bold uppercase tracking-wider text-[#E8C766]">* Obligatorio</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <FormField
              id="ath-nombre"
              label="Nombre completo"
              required
              placeholder="Ej: Lucas Gabriel Martínez"
              value={form.nombre}
              onChange={(e) => onChange('nombre', e.target.value)}
              error={errors.nombre}
            />
          </div>
          <FormField
            id="ath-edad"
            label="Edad"
            required
            type="number"
            min={1}
            max={100}
            placeholder="Ej: 21"
            value={form.edad}
            onChange={(e) => onChange('edad', e.target.value)}
            error={errors.edad}
          />
          <FormField
            id="ath-deporte"
            label="Deporte que practica"
            required
            placeholder="Ej: Natación, Tenis adaptado"
            value={form.deporte}
            onChange={(e) => onChange('deporte', e.target.value)}
            error={errors.deporte}
          />

          <div className="flex flex-col gap-1">
            <label htmlFor="ath-club" className="text-sm font-semibold text-white">
              Club de pertenencia (opcional)
            </label>
            <select
              id="ath-club"
              value={form.clubId}
              onChange={(e) => onChange('clubId', e.target.value)}
              className="w-full h-12 bg-[#1c1c1c] border border-[#262626] px-4 rounded-lg text-white text-sm focus:ring-1 focus:ring-[#E8C766]/60 focus:outline-none"
            >
              <option value="">
                {cargandoClubes ? 'Cargando clubes...' : 'Deportista independiente'}
              </option>
              {clubes.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.nombreInstitucion}
                </option>
              ))}
            </select>
          </div>

          <FormField
            id="ath-web"
            label="Instagram / Red Social (opcional)"
            type="url"
            placeholder="https://instagram.com/lucasmartinez_swim"
            value={form.sitioWebUrl}
            onChange={(e) => onChange('sitioWebUrl', e.target.value)}
            error={errors.sitioWebUrl}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            id="ath-telefono"
            label="Teléfono personal"
            recommended
            type="tel"
            placeholder="+54 9 351 777-8899"
            value={form.telefono}
            onChange={(e) => onChange('telefono', e.target.value)}
            error={errors.telefono}
          />
          <FormField
            id="ath-email"
            label="Email personal"
            recommended
            type="email"
            placeholder="lucas.martinez@deporte.com"
            value={form.email}
            onChange={(e) => onChange('email', e.target.value)}
            error={errors.email}
            hint="Se usa para notificaciones y para generar el acceso si se aprueba la solicitud."
          />
        </div>

        <FormTextArea
          id="ath-historia"
          label="Historia o trayectoria deportiva (opcional)"
          placeholder="Trayectoria, orígenes, inicios en la disciplina..."
          value={form.historia}
          onChange={(e) => onChange('historia', e.target.value)}
        />

        <FormTextArea
          id="ath-logros"
          label="Logros y títulos destacados (opcional)"
          placeholder="Campeonatos, títulos, medallas, récords y reconocimientos..."
          value={form.logros}
          onChange={(e) => onChange('logros', e.target.value)}
        />

        <FormTextArea
          id="ath-fotos"
          label="Fotos de competencia (opcional)"
          placeholder={'Una URL por línea, ej:\nhttps://images.unsplash.com/photo-1530549387789-4c1017266635'}
          value={form.fotosTexto}
          onChange={(e) => onChange('fotosTexto', e.target.value)}
          hint="Pegá links a imágenes (una por línea o separadas por coma). Las que no sean URL válidas se descartan."
        />
      </div>

      <InclusiveCard
        variante="deportista"
        checked={form.deporteAdaptado}
        onChange={(checked) => onChange('deporteAdaptado', checked)}
      />
    </div>
  );
};

export default DeportistaFields;
