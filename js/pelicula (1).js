class Pelicula {
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
    //this.id = Pelicula.validarId(id);
    this.titulo = Pelicula.validarTitulo(titulo);
    this.director = Pelicula.validarDirector(director);
    this.estreno = Pelicula.validarEstreno(estreno);
    this.origen = origen;
    this.genero = genero;
    this.calificacion = calificacion;
    this.reparto = reparto;
  }

  static paises = ["EEUU", "Portugal", "España", "Francia", "Italia"];

  static getPaises() {
    return Pelicula.paises;
  }

  static generos = ["Terror", "Drama", "Comedia", "Aventuras", "Bélica"];

  static getGeneros() {
    return Pelicula.generos;
  }

  // Encapsulamiento del id
  set id(id_nuevo) {
    const expresion = new RegExp("^([a-z]{2}\\d{7})$");
    //const expresion = /^[a-z]{2}\d{7}$/i;
    if (!expresion.test(id_nuevo)) {
      throw new Error(`El id es incorrecto`);
    } else {
      this._id = id_nuevo;
    }
  }

  get id() {
    return this._id;
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
    console.log(esteanio);
    if ((estreno < 1800) | (estreno > new Date().getFullYear())) {
      throw new Error(`El año ${estreno} no es correcto`);
    } else {
      return estreno;
    }
  }

  /*   static validarId(id) {
    const expresion = new RegExp("^([a-z]{2}\\d{7})$");
    //const expresion = /^[a-z]{2}\d{7}$/i;
    if (!expresion.test(id)) {
      throw new Error(`El id es incorrecto`);
    } else {
      return id;
    }
  } */
}
export { Pelicula };
