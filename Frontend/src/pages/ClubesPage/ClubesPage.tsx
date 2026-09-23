import { useState } from 'react';
import { useClubes } from '../../hooks/useClubes';
import SearchBar from '../../components/SearchBar/SearchBar';
import ClubCard from '../../components/ClubCard/ClubCard';

export const ClubesPage = () => {
  const { clubes, loading, error, buscar, filtrarAdaptado, cargarTodos } = useClubes();
  const [soloAdaptado, setSoloAdaptado] = useState<boolean>(false);

  const handleSearch = (valor: string) => {
    if (valor.trim() === '') {
      if (soloAdaptado) {
        filtrarAdaptado();
      } else {
        cargarTodos();
      }
    } else {
      buscar({ nombre: valor });
    }
  };

  const handleToggleAdaptado = () => {
    const nuevoEstado = !soloAdaptado;
    setSoloAdaptado(nuevoEstado);
    if (nuevoEstado) {
      filtrarAdaptado();
    } else {
      cargarTodos();
    }
  };

  return (
    <main>
      <h1>Clubes</h1>
      <SearchBar placeholder="Buscar clubes..." onSearch={handleSearch} />
      <button type="button" onClick={handleToggleAdaptado}>
        Deporte Adaptado
      </button>

      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && clubes.length === 0 && <p>No se encontraron clubes.</p>}

      {!loading && !error && clubes.length > 0 && (
        <section>
          {clubes.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </section>
      )}
    </main>
  );
};

export default ClubesPage;
