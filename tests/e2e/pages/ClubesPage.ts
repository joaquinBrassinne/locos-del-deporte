import { ListadoPage } from './ListadoPage';

/** Pantalla /clubes */
export class ClubesPage extends ListadoPage {
  protected readonly ruta = '/clubes';
  protected readonly apiPath = '/api/clubes';
  protected readonly placeholderBuscador = 'Buscar por nombre de club o disciplina...';
  protected readonly textoSinResultados = /No se encontraron clubes/i;
}
