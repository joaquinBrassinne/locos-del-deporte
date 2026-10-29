import { useState } from 'react';
import { useDeportistas } from '../../hooks/useDeportistas';
import SearchBar from '../../components/SearchBar/SearchBar';
import DeportistaCard from '../../components/DeportistaCard/DeportistaCard';

export const DeportistasPage = () => {
  const { deportistas, loading, error, buscar, filtrarAdaptado, cargarTodos } = useDeportistas();
  const [soloAdaptado, setSoloAdaptado] = useState<boolean>(false);

  const handleSearch = (valor: string) => {
    if (valor.trim() === '') {
      if (soloAdaptado) {
        filtrarAdaptado();
      } else {
        cargarTodos();
      }
    } else {
      buscar(valor);
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
      <h1>Deportistas</h1>
      <SearchBar placeholder="Buscar por deporte..." onSearch={handleSearch} />
      <button type="button" onClick={handleToggleAdaptado}>
        Deporte Inclusivo
      </button>

      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && deportistas.length === 0 && <p>No se encontraron deportistas.</p>}

      {!loading && !error && deportistas.length > 0 && (
        <section>
          {deportistas.map((deportista) => (
            <DeportistaCard key={deportista.id} deportista={deportista} />
          ))}
        </section>
      )}
    </main>
  );
};

export default DeportistasPage;
