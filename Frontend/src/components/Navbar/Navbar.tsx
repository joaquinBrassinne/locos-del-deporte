import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
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
        </nav>

        {/* Botón hamburguesa mobile */}
        <button
          type="button"
          className="md:hidden text-neutral-400 hover:text-white focus:outline-none p-2"
          aria-label="Menú principal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
