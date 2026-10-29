import { useCallback, useState } from 'react';
import { enviarSolicitud } from '../services/api';
import { parseCoordinates } from '../utils/geoUtils';
import { esEmailValido, esTelefonoValido, esUrlValida, parseFotosUrls } from '../utils/validators';
import type { ClubFormData, DeportistaFormData, Tipo } from '../types/Index';

interface ClubDraft {
  nombreInstitucion: string;
  direccion: string;
  disciplinasSeleccionadas: string[];
  otrasDisciplinas: string;
  telefono: string;
  email: string;
  sitioWebUrl: string;
  coordenadas: string;
  descripcion: string;
  horarios: string;
  fotosTexto: string; // una URL por línea o separadas por coma
  deporteAdaptado: boolean;
}

interface DeportistaDraft {
  nombre: string;
  edad: string;
  deporte: string;
  clubId: string; // id del <select>, como string hasta el submit
  sitioWebUrl: string;
  telefono: string;
  email: string;
  historia: string;
  logros: string;
  fotosTexto: string;
  deporteAdaptado: boolean;
}

const CLUB_INICIAL: ClubDraft = {
  nombreInstitucion: '',
  direccion: '',
  disciplinasSeleccionadas: [],
  otrasDisciplinas: '',
  telefono: '',
  email: '',
  sitioWebUrl: '',
  coordenadas: '',
  descripcion: '',
  horarios: '',
  fotosTexto: '',
  deporteAdaptado: false,
};

const DEPORTISTA_INICIAL: DeportistaDraft = {
  nombre: '',
  edad: '',
  deporte: '',
  clubId: '',
  sitioWebUrl: '',
  telefono: '',
  email: '',
  historia: '',
  logros: '',
  fotosTexto: '',
  deporteAdaptado: false,
};

type SolicitudErrors = Partial<Record<string, string>>;

export const useSolicitudForm = () => {
  const [tipo, setTipo] = useState<Tipo>('CLUB');
  const [clubForm, setClubForm] = useState<ClubDraft>(CLUB_INICIAL);
  const [deportistaForm, setDeportistaForm] = useState<DeportistaDraft>(DEPORTISTA_INICIAL);
  const [errors, setErrors] = useState<SolicitudErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const cambiarTipo = useCallback((nuevoTipo: Tipo) => {
    setTipo(nuevoTipo);
    setErrors({});
    setServerError(null);
  }, []);

  const updateClubField = useCallback(<K extends keyof ClubDraft>(campo: K, valor: ClubDraft[K]) => {
    setClubForm((prev) => ({ ...prev, [campo]: valor }));
  }, []);

  const updateDeportistaField = useCallback(
    <K extends keyof DeportistaDraft>(campo: K, valor: DeportistaDraft[K]) => {
      setDeportistaForm((prev) => ({ ...prev, [campo]: valor }));
    },
    []
  );

  const toggleDisciplina = useCallback((disciplina: string) => {
    setClubForm((prev) => {
      const yaEsta = prev.disciplinasSeleccionadas.includes(disciplina);
      return {
        ...prev,
        disciplinasSeleccionadas: yaEsta
          ? prev.disciplinasSeleccionadas.filter((d) => d !== disciplina)
          : [...prev.disciplinasSeleccionadas, disciplina],
      };
    });
  }, []);

  const resetear = useCallback(() => {
    setClubForm(CLUB_INICIAL);
    setDeportistaForm(DEPORTISTA_INICIAL);
    setErrors({});
  }, []);

  const cerrarBanner = useCallback(() => {
    setSuccess(false);
    setServerError(null);
  }, []);

  /**
   * Validaciones según la "Guía de Datos para Formulario de Registro":
   * - Obligatorios: @NotBlank en nombre/dirección (club) y nombre/deporte/edad (deportista).
   * - Recomendados (email, teléfono): si se completan, deben tener formato válido;
   *   no son obligatorios porque el backend no los exige, pero son el canal de acceso
   *   una vez aprobada la solicitud, así que avisamos si el formato está mal.
   * - coordenadas / sitioWebUrl / fotos: opcionales, pero validados en formato si se llenan.
   */
  const validar = useCallback((): SolicitudErrors => {
    const nuevosErrores: SolicitudErrors = {};

    if (tipo === 'CLUB') {
      if (!clubForm.nombreInstitucion.trim()) {
        nuevosErrores.nombreInstitucion = 'Ingresá el nombre de la institución.';
      }
      if (!clubForm.direccion.trim()) {
        nuevosErrores.direccion = 'Ingresá la dirección física en Río Tercero.';
      }
      if (clubForm.email.trim() && !esEmailValido(clubForm.email)) {
        nuevosErrores.email = 'El email no tiene un formato válido.';
      }
      if (clubForm.telefono.trim() && !esTelefonoValido(clubForm.telefono)) {
        nuevosErrores.telefono = 'Revisá el formato del teléfono (ej: +54 9 351 1234567).';
      }
      if (clubForm.sitioWebUrl.trim() && !esUrlValida(clubForm.sitioWebUrl)) {
        nuevosErrores.sitioWebUrl = 'La URL debe empezar con http:// o https://.';
      }
      if (clubForm.coordenadas.trim() && !parseCoordinates(clubForm.coordenadas)) {
        nuevosErrores.coordenadas = 'Formato esperado: "latitud,longitud" (ej: -32.1712,-64.3450).';
      }
    } else {
      if (!deportistaForm.nombre.trim()) {
        nuevosErrores.nombre = 'Ingresá el nombre completo.';
      }
      if (!deportistaForm.deporte.trim()) {
        nuevosErrores.deporte = 'Ingresá el deporte que practica.';
      }
      if (!deportistaForm.edad.trim()) {
        nuevosErrores.edad = 'La edad es obligatoria.';
      } else if (!Number.isInteger(Number(deportistaForm.edad)) || Number(deportistaForm.edad) < 1) {
        nuevosErrores.edad = 'La edad debe ser un número entero mayor a 0.';
      }
      if (deportistaForm.email.trim() && !esEmailValido(deportistaForm.email)) {
        nuevosErrores.email = 'El email no tiene un formato válido.';
      }
      if (deportistaForm.telefono.trim() && !esTelefonoValido(deportistaForm.telefono)) {
        nuevosErrores.telefono = 'Revisá el formato del teléfono (ej: +54 9 351 1234567).';
      }
      if (deportistaForm.sitioWebUrl.trim() && !esUrlValida(deportistaForm.sitioWebUrl)) {
        nuevosErrores.sitioWebUrl = 'La URL debe empezar con http:// o https://.';
      }
    }

    return nuevosErrores;
  }, [tipo, clubForm, deportistaForm]);

  const handleSubmit = useCallback(async () => {
    const nuevosErrores = validar();
    setErrors(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      setSuccess(false);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      if (tipo === 'CLUB') {
        const disciplinasFinal = [
          ...clubForm.disciplinasSeleccionadas,
          ...clubForm.otrasDisciplinas
            .split(',')
            .map((d) => d.trim())
            .filter(Boolean),
        ].join(', ');

        const payload: ClubFormData = {
          nombreInstitucion: clubForm.nombreInstitucion.trim(),
          direccion: clubForm.direccion.trim(),
          disciplinas: disciplinasFinal || null,
          telefono: clubForm.telefono.trim() || null,
          email: clubForm.email.trim() || null,
          sitioWebUrl: clubForm.sitioWebUrl.trim() || null,
          coordenadas: clubForm.coordenadas.trim() || null,
          descripcion: clubForm.descripcion.trim() || null,
          horarios: clubForm.horarios.trim() || null,
          fotos: parseFotosUrls(clubForm.fotosTexto),
          deporteAdaptado: clubForm.deporteAdaptado,
        };

        await enviarSolicitud('CLUB', payload);
      } else {
        const payload: DeportistaFormData = {
          nombre: deportistaForm.nombre.trim(),
          deporte: deportistaForm.deporte.trim(),
          edad: Number(deportistaForm.edad),
          historia: deportistaForm.historia.trim() || null,
          logros: deportistaForm.logros.trim() || null,
          sitioWebUrl: deportistaForm.sitioWebUrl.trim() || null,
          telefono: deportistaForm.telefono.trim() || null,
          email: deportistaForm.email.trim() || null,
          fotos: parseFotosUrls(deportistaForm.fotosTexto),
          deporteAdaptado: deportistaForm.deporteAdaptado,
          clubId: deportistaForm.clubId ? Number(deportistaForm.clubId) : null,
        };

        await enviarSolicitud('DEPORTISTA', payload);
      }

      setSuccess(true);
      resetear();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error de conexión con el servidor.');
    } finally {
      setSubmitting(false);
    }
  }, [tipo, clubForm, deportistaForm, validar, resetear]);

  return {
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
  };
};
