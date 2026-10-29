import { ListadoPage } from './ListadoPage';

/** Pantalla /deportistas */
export class DeportistasPage extends ListadoPage {
  protected readonly ruta = '/deportistas';
  protected readonly apiPath = '/api/deportistas';
  protected readonly placeholderBuscador = 'Buscar deportista por nombre o disciplina...';
  protected readonly textoSinResultados = /No se encontraron deportistas/i;
}
