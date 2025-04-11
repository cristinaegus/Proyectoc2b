export class Pelicula {
  constructor(id, titulo, director, año, pais, genero, calificacion) {
    this.id = this.id.validarId(id);
    this.titulo = this.titulo.validarTitulo(titulo);

    this.director = this.director.validarDirector(director);
    this.estreno = this.estreno.validarEstreno(estreno);
    this.origen = origen;
    this.genero = this.genero.validarGenero(genero);

    this.año = this.año.validarAnio(año);
    this.pais = this.pais.validarPais(pais);
    this.calificacion = this.calificacion.validarCalificacion(calificacion);
  }
  // Validar que el id sea un número entero positivo

  // Validar que el id sea un número entero positivo
  static validarId(id) {
    if (typeof id !== "number" || id <= 0 || !Number.isInteger(id)) {
      throw new Error("El ID debe ser un número entero positivo.");
    }
    return true;
  }
  // Validar que el título no esté vacío y tenga al menos 3 caracteres
  static validarTitulo(titulo) {
    const regex = /^.{3,}$/; // Expresión regular para validar el título
    if (!regex.test(titulo)) {
      throw new Error("El título debe tener al menos 3 caracteres.");
    }
    return true;
  }
  // Validar que el año de estreno sea entre 1900 y la fecha actual (2025)
  static validarAnio(anio) {
    const fechaActual = new Date().getFullYear();
    if (anio < 1900 || anio > fechaActual) {
      throw new Error(
        "El año de estreno debe estar entre 1900 y el año actual."
      );
    }
    return true;
  }

  // Validar que el país y el género tengan forma de Array y contenga valores dentro de los valores
  // aceptables.
  //Crear un método estático que devuelva los países y géneros aceptables.
  static obtenerGeneros() {
    return [
      "Acción",
      "Comedia",
      "Drama",
      "Terror",
      "Ciencia Ficción",
      "Romance",
    ];
  }
  static obtenerPaises() {
    return ["EEUU", "España", "Francia", "Alemania", "Italia", "Reino Unido"];
  }
  static validarPais(pais) {
    const paisesAceptables = Pelicula.obtenerPaises();
    if (
      !Array.isArray(pais) ||
      !pais.every((p) => paisesAceptables.includes(p))
    ) {
      throw new Error("El país debe ser un array con valores aceptables.");
    }
    return true;
  }
  //Validar la calificación como entero entre 0 y 10.
  static validarCalificacion(calificacion) {
    if (
      typeof calificacion !== "number" ||
      calificacion < 0 ||
      calificacion > 10
    ) {
      throw new Error("La calificación debe ser un número entre 0 y 10.");
    }
    return true;
  }
  //Crear un método que devuelva la ficha técnica de la película. (un resumen en una tabla)
  fichaTecnica() {
    return `
      <table border="1">
        <tr><th>ID</th><td>${this.id.validarId}</td></tr>
        <tr><th>Título</th><td>${this.titulo.validarTitulo}</td></tr>
        <tr><th>Director</th><td>${this.director.validarDirector}</td></tr>
        <tr><th>Año</th><td>${this.año.validarAnio}</td></tr>
        <tr><th>Género</th><td>${this.genero.validarGenero}</td></tr>
        <tr><th>País</th><td>${this.pais.validarPais}</td></tr>
        <tr><th>Calificación</th><td>${this.calificacion.validarCalificacion}</td></tr>
      </table>
    `;
  }
}

// Crear un método que devuelva la ficha técnica de la película. (un resumen en una tabla)
// Removed invalid export statement
