const DISCIPLINAS_DISPONIBLES = [
  'Fútbol',
  'Básquet',
  'Natación',
  'Vóley',
  'Tenis',
  'Hockey',
  'Rugby',
  'Atletismo',
  'Gimnasia',
  'Artes Marciales',
];

interface DisciplinaChipsProps {
  seleccionadas: string[];
  onToggle: (disciplina: string) => void;
}

export const DisciplinaChips = ({ seleccionadas, onToggle }: DisciplinaChipsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">Disciplinas que ofrece</span>
        <span className="text-xs text-neutral-500">Tocá las disciplinas que apliquen</span>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Disciplinas que ofrece">
        {DISCIPLINAS_DISPONIBLES.map((disciplina) => {
          const activa = seleccionadas.includes(disciplina);
          return (
            <button
              key={disciplina}
              type="button"
              aria-pressed={activa}
              onClick={() => onToggle(disciplina)}
              className={`h-10 px-4 rounded-full text-sm font-semibold transition-all ${
                activa
                  ? 'bg-[#E8C766] text-black'
                  : 'bg-[#1c1c1c] text-neutral-300 border border-[#262626] hover:border-neutral-600'
              }`}
            >
              {disciplina}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DisciplinaChips;
