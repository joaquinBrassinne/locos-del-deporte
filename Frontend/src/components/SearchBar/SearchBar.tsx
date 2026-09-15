import { useState } from 'react';

interface SearchBarProps {
  placeholder: string;
  onSearch: (valor: string) => void;
}

export const SearchBar = ({ placeholder, onSearch }: SearchBarProps) => {
  const [valor, setValor] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(valor);
  };

  const handleLimpiar = () => {
    setValor('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder={placeholder}
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />
      <button type="submit">Buscar</button>
      {valor !== '' && (
        <button type="button" onClick={handleLimpiar}>
          Limpiar
        </button>
      )}
    </form>
  );
};

export default SearchBar;
