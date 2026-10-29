import { useState, useEffect } from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (valor: string) => void;
  initialValue?: string;
  onChange?: (valor: string) => void;
}

export const SearchBar = ({
  placeholder = 'Buscar por nombre de club o disciplina...',
  onSearch,
  initialValue = '',
  onChange,
}: SearchBarProps) => {
  const [valor, setValor] = useState<string>(initialValue);

  useEffect(() => {
    setValor(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoValor = e.target.value;
    setValor(nuevoValor);
    if (onChange) {
      onChange(nuevoValor);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(valor);
  };

  const handleLimpiar = () => {
    setValor('');
    onSearch('');
    if (onChange) {
      onChange('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-2xl mx-auto flex items-center bg-[#141414] border border-[#262626] rounded-full px-4 py-2.5 sm:py-3 shadow-lg focus-within:border-[#E8C766]/60 focus-within:ring-1 focus-within:ring-[#E8C766]/30 transition-all"
    >
      {/* Icono de Lupa */}
      <div className="pl-1 pr-3 text-neutral-500 shrink-0 pointer-events-none">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Input */}
      <input
        type="text"
        placeholder={placeholder}
        value={valor}
        onChange={handleChange}
        className="w-full bg-transparent text-sm text-neutral-200 placeholder-neutral-500 outline-none pr-3"
      />

      {/* Botón Limpiar */}
      {valor !== '' && (
        <button
          type="button"
          onClick={handleLimpiar}
          className="shrink-0 bg-[#242424] hover:bg-[#303030] text-neutral-300 hover:text-white text-xs px-3 py-1 rounded-full border border-neutral-700/60 transition-colors cursor-pointer select-none font-medium mr-1"
        >
          Limpiar
        </button>
      )}
    </form>
  );
};

export default SearchBar;
