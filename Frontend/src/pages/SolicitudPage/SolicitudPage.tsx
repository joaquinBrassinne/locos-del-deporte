import { FaPaperPlane, FaShieldAlt } from 'react-icons/fa';
import { useSolicitudForm } from '../../hooks/useSolicitudForm';
import { TipoTabs } from '../../components/SolicitudForm/TipoTabs';
import { FeedbackBanner } from '../../components/SolicitudForm/FeedbackBanner';
import { ClubFields } from '../../components/SolicitudForm/ClubFields';
import { DeportistaFields } from '../../components/SolicitudForm/DeportistaFields';

export default function SolicitudPage() {
  const {
    tipo,
    cambiarTipo,
    clubForm,
    deportistaForm,
    updateClubField,
    updateDeportistaField,
    toggleDisciplina,
    errors,
    submitting,
    success,
    serverError,
    cerrarBanner,
    handleSubmit,
  } = useSolicitudForm();

  return (
    <div className="w-full bg-[#0c0c0c] py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col gap-2 text-center items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#1c1c1c] border border-[#E8C766]/30">
            <span className="w-2 h-2 rounded-full bg-[#E8C766] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#E8C766]">
              Sumate a la comunidad
            </span>
          </div>

          <h1 className="font-sport text-3xl sm:text-4xl text-white uppercase tracking-tight">
            SOLICITUD DE <span className="text-[#E8C766]">REGISTRO</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl text-center">
            Visibilizá tu institución deportiva o trayectoria atlética en Río Tercero. Tu
            solicitud queda como <strong className="text-neutral-200">PENDIENTE</strong> hasta
            que un administrador la revise desde el panel de administración.
          </p>
        </div>

        <TipoTabs tipo={tipo} onChange={cambiarTipo} />

        {success && (
          <FeedbackBanner
            variant="success"
            title="¡Solicitud enviada con éxito!"
            message="Quedó registrada como PENDIENTE. Si el administrador la aprueba, se crea tu perfil automáticamente y recibís tus credenciales de acceso al correo y teléfono que declaraste — revisá que estén bien escritos."
            onClose={cerrarBanner}
          />
        )}

        {serverError && (
          <FeedbackBanner
            variant="error"
            title="No pudimos enviar la solicitud"
            message={serverError}
            onClose={cerrarBanner}
          />
        )}

        <form
          className="flex flex-col gap-10"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {tipo === 'CLUB' ? (
            <ClubFields
              form={clubForm}
              errors={errors}
              onChange={updateClubField}
              onToggleDisciplina={toggleDisciplina}
            />
          ) : (
            <DeportistaFields form={deportistaForm} errors={errors} onChange={updateDeportistaField} />
          )}

          <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4 max-w-lg">
              <div className="w-12 h-12 rounded-lg bg-[#1f1f1f] flex items-center justify-center shrink-0">
                <FaShieldAlt className="text-[#E8C766]" size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">
                  Auditoría Municipal y Comunitaria
                </span>
                <span className="text-xs text-neutral-500">
                  Al enviar confirmás la veracidad de los datos suministrados.
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto min-w-[280px] h-14 px-8 rounded-xl bg-[#E8C766] text-black font-sport text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#f0d27e] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FaPaperPlane />
              <span>{submitting ? 'ENVIANDO...' : 'ENVIAR SOLICITUD DE REGISTRO'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
