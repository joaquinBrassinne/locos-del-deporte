import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');
  const navigate = useNavigate();

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(quickSearch.trim())}`);
      setQuickSearch('');
      setMenuAbierto(false);
    } else {
      navigate('/buscar');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0e0e0e]/95 backdrop-blur border-b border-[#262626]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo izquierda */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-[#E8C766] group-hover:bg-[#f0d27e] transition-colors flex items-center justify-center font-sport font-bold text-black text-xl">
            RT
          </div>
          <div className="flex flex-col">
            <span className="font-sport font-bold text-white uppercase text-xl leading-none tracking-wide">
              DEPORTE
            </span>
            <span className="text-xs text-neutral-400 font-sans leading-none mt-1">
              Río Tercero
            </span>
          </div>
        </Link>

        {/* Links desktop */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? 'text-white font-semibold border-b-2 border-[#E8C766] pb-1 transition-colors'
                : 'text-neutral-400 hover:text-white pb-1 transition-colors'
            }
          >
            Inicio
          </NavLink>

          <NavLink
            to="/deportistas"
            className={({ isActive }) =>
              isActive
                ? 'text-white font-semibold border-b-2 border-[#E8C766] pb-1 transition-colors'
                : 'text-neutral-400 hover:text-white pb-1 transition-colors'
            }
          >
            Deportistas
          </NavLink>

          <NavLink
            to="/clubes"
            className={({ isActive }) =>
              isActive
                ? 'text-white font-semibold border-b-2 border-[#E8C766] pb-1 transition-colors'
                : 'text-neutral-400 hover:text-white pb-1 transition-colors'
            }
          >
            Clubes
          </NavLink>

          <NavLink
            to="/mapa"
            className={({ isActive }) =>
              isActive
                ? 'text-white font-semibold border-b-2 border-[#E8C766] pb-1 transition-colors inline-flex items-center gap-1.5'
                : 'text-neutral-400 hover:text-white pb-1 transition-colors inline-flex items-center gap-1.5'
            }
          >
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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Mapa
          </NavLink>

          <NavLink
            to="/buscar"
            className={({ isActive }) =>
              isActive
                ? 'text-white font-semibold border-b-2 border-[#E8C766] pb-1 transition-colors inline-flex items-center gap-1.5'
                : 'text-neutral-400 hover:text-white pb-1 transition-colors inline-flex items-center gap-1.5'
            }
          >
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
            Buscar
          </NavLink>

          <NavLink
            to="/solicitud"
            className={({ isActive }) =>
              isActive
                ? 'text-white font-semibold border-b-2 border-[#E8C766] pb-1 transition-colors'
                : 'text-neutral-400 hover:text-white pb-1 transition-colors'
            }
          >
            Inscribirme
          </NavLink>
        </nav>

        {/* Botón hamburguesa mobile */}
        <button
          type="button"
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="md:hidden text-neutral-400 hover:text-white focus:outline-none p-2 rounded-lg hover:bg-neutral-800/60"
          aria-label="Menú principal"
        >
          {menuAbierto ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Menú desplegable mobile */}
      {menuAbierto && (
        <div className="md:hidden bg-[#121212] border-b border-[#262626] px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          {/* Input de búsqueda rápido en mobile */}
          <form onSubmit={handleQuickSearchSubmit} className="relative mb-4">
            <input
              type="text"
              placeholder="Buscar clubes o deportistas..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-neutral-700 rounded-full px-4 py-2.5 text-xs text-neutral-200 placeholder-neutral-500 outline-none focus:border-[#E8C766]"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#E8C766]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          <div className="flex flex-col space-y-2 text-sm font-medium">
            <NavLink
              to="/"
              end
              onClick={() => setMenuAbierto(false)}
              className={({ isActive }) =>
                isActive
                  ? 'px-3 py-2 rounded-lg bg-[#1c1c1c] text-[#E8C766] font-semibold'
                  : 'px-3 py-2 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white'
              }
            >
              Inicio
            </NavLink>

            <NavLink
              to="/deportistas"
              onClick={() => setMenuAbierto(false)}
              className={({ isActive }) =>
                isActive
                  ? 'px-3 py-2 rounded-lg bg-[#1c1c1c] text-[#E8C766] font-semibold'
                  : 'px-3 py-2 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white'
              }
            >
              Deportistas
            </NavLink>

            <NavLink
              to="/clubes"
              onClick={() => setMenuAbierto(false)}
              className={({ isActive }) =>
                isActive
                  ? 'px-3 py-2 rounded-lg bg-[#1c1c1c] text-[#E8C766] font-semibold'
                  : 'px-3 py-2 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white'
              }
            >
              Clubes
            </NavLink>

            <NavLink
              to="/mapa"
              onClick={() => setMenuAbierto(false)}
              className={({ isActive }) =>
                isActive
                  ? 'px-3 py-2 rounded-lg bg-[#1c1c1c] text-[#E8C766] font-semibold flex items-center gap-2'
                  : 'px-3 py-2 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white flex items-center gap-2'
              }
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Mapa
            </NavLink>

            <NavLink
              to="/buscar"
              onClick={() => setMenuAbierto(false)}
              className={({ isActive }) =>
                isActive
                  ? 'px-3 py-2 rounded-lg bg-[#1c1c1c] text-[#E8C766] font-semibold flex items-center gap-2'
                  : 'px-3 py-2 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white flex items-center gap-2'
              }
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscar
            </NavLink>

            <NavLink
              to="/solicitud"
              onClick={() => setMenuAbierto(false)}
              className={({ isActive }) =>
                isActive
                  ? 'px-3 py-2 rounded-lg bg-[#1c1c1c] text-[#E8C766] font-semibold'
                  : 'px-3 py-2 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white'
              }
            >
              Inscribirme
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
