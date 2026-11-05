// Validadores de formato para el formulario de Solicitud,
// según "Guía de Datos para Formulario de Registro (CrazySports)".

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^https?:\/\/.+/i;
// Acepta dígitos, espacios, guiones, paréntesis y un '+' inicial opcional (ej: "+54 9 351 1234567").
const TELEFONO_REGEX = /^\+?[\d\s()-]{6,20}$/;

export const esEmailValido = (valor: string): boolean => EMAIL_REGEX.test(valor.trim());

export const esUrlValida = (valor: string): boolean => URL_REGEX.test(valor.trim());

export const esTelefonoValido = (valor: string): boolean => TELEFONO_REGEX.test(valor.trim());

/**
 * Convierte el textarea de "URLs de fotos" (una por línea o separadas por coma)
 * en el array de strings que espera `fotos: List<String>` en el backend.
 * Descarta líneas vacías y filtra las que no tengan forma de URL.
 */
export const parseFotosUrls = (valor: string): string[] =>
  valor
    .split(/[\n,]/)
    .map((url) => url.trim())
    .filter((url) => url.length > 0 && esUrlValida(url));
