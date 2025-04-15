// filepath: c:\Users\egusq\C2BCurso\Proyectoc2b\js\pelicula.js
export class Pelicula {
  constructor(
    id,
    titulo,
    director,
    estreno,
    origen,
    genero,
    calificacion,
    reparto = []
  ) {
    this.id = id;
    this.titulo = Pelicula.validarTitulo(titulo);
    this.director = Pelicula.validarDirector(director);
    this.estreno = Pelicula.validarEstreno(estreno);
    this.origen = origen;
    this.genero = genero;
    this.calificacion = calificacion;
    this.reparto = reparto;
  }

  static getPaises() {
    return this.paises;
  }
  static setPaises(paises) {
    this.paises = paises;
  }
  static getPelicula() {
    return this.pelicula;
  }
  static setPelicula(pelicula) {
    this.pelicula = pelicula;
  }
  static paises = ["Argentina", "Brasil", "Chile", "México", "España"];

  static inicializarPaises() {
    poblarSelector("pais", this.getPaises());
  }
  static getCalificaciones() {
    return ["A", "B", "C", "D", "E"];
  }
  static calificaciones = ["A", "B", "C", "D", "E"];

  static getCalificacionesConst() {
    return this.calificaciones;
  }

  static getGeneros() {
    return ["Acción", "Comedia", "Drama", "Terror", "Ciencia Ficción"];
  }

  static validarTitulo(titulo) {
    if (titulo.length > 100) {
      throw new Error(`El título es demasiado largo. Sólo 100 caracteres`);
    } else {
      return titulo;
    }
  }

  static validarDirector(director) {
    if (director.length > 50) {
      throw new Error(
        `El nombre del director es demasiado largo. Sólo 50 caracteres`
      );
    } else {
      return director;
    }
  }

  static validarEstreno(estreno) {
    estreno = parseInt(estreno);
    let esteanio = new Date().getFullYear();
    if (estreno < 1800 || estreno > esteanio) {
      throw new Error(`El año ${estreno} no es correcto`);
    } else {
      return estreno;
    }
  }
}
