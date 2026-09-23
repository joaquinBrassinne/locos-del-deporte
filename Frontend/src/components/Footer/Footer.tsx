import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0b0b0b] border-t border-neutral-800/80 pt-16 pb-12 text-sm text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid 3 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          {/* Columna Explorar */}
          <div>
            <h3 className="font-sport uppercase text-white font-semibold tracking-wider text-base mb-4">
              Explorar
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/deportistas" className="hover:text-[#E8C766] transition-colors">
                  Deportistas
                </Link>
              </li>
              <li>
                <Link to="/clubes" className="hover:text-[#E8C766] transition-colors">
                  Clubes
                </Link>
              </li>
              <li>
                <Link to="/mapa" className="hover:text-[#E8C766] transition-colors">
                  Mapa
                </Link>
              </li>
              <li>
                <Link to="/buscar" className="hover:text-[#E8C766] transition-colors">
                  Buscador
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna Participar */}
          <div>
            <h3 className="font-sport uppercase text-white font-semibold tracking-wider text-base mb-4">
              Participar
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/solicitud" className="hover:text-[#E8C766] transition-colors">
                  Registrar Club
                </Link>
              </li>
              <li>
                <span className="text-neutral-500">
                  Sugerir Deportista (próximamente)
                </span>
              </li>
            </ul>
          </div>

          {/* Columna Contacto */}
          <div>
            <h3 className="font-sport uppercase text-white font-semibold tracking-wider text-base mb-4">
              Contacto
            </h3>
            <div className="space-y-2.5">
              <p>
                <a
                  href="mailto:contacto@deporteriotercero.com.ar"
                  className="hover:text-[#E8C766] transition-colors"
                >
                  contacto@deporteriotercero.com.ar
                </a>
              </p>
              <p className="text-neutral-500">
                Río Tercero, Córdoba, Argentina
              </p>
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="border-t border-neutral-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Izquierda */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E8C766] flex items-center justify-center font-sport font-bold text-black text-sm">
              RT
            </div>
            <span className="font-sport font-bold text-white uppercase text-base tracking-wide">
              DEPORTE{' '}
              <span className="text-neutral-400 font-sans text-xs normal-case">
                Río Tercero
              </span>
            </span>
          </div>

          {/* Centro */}
          <div>
            Hecho con <span className="text-[#E8C766]">💛</span> para el deporte
          </div>

          {/* Derecha */}
          <div className="text-neutral-500 text-xs sm:text-sm">
            2026 – Todos los derechos reservados
          </div>
        </div>
      </div>
    </footer>
  );
}
