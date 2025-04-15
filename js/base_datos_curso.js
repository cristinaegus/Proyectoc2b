export class Alumno {
  constructor(nombre, apellidos, dni, edad, curso) {
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.dni = Alumno.verifica_dni(dni);
    this.edad = Alumno.verifica_edad(edad);
    this.curso = curso;
  }

  static verifica_edad(edad) {
    edad = parseInt(edad);
    if (edad >= 18 && edad <= 120) {
      return edad;
    } else {
      throw new Error("La edad está fuera del rango");
    }
  }

  static verifica_dni(dni) {
    dni = dni.toUpperCase();
    const expresion = new RegExp("^\\d{8}[A-Z]$");
    if (expresion.test(dni)) {
      return dni;
    } else {
      throw new Error("El DNI no es correcto");
    }
  }
  static cursos = ["1", "2", "3", "4", "5"];
  static poblar_cursos() {
    const selectCurso = document.getElementById("curso");
    Alumno.cursos.forEach((curso) => {
      const option = document.createElement("option");
      option.value = curso;
      option.textContent = curso;
      selectCurso.appendChild(option);
    });
  }
}
const cargar_datos = function () {
  try {
    const nombre = document.getElementById("nombre").value;
    const apellidos = document.getElementById("apellidos").value;
    const dni = document.getElementById("dni").value;
    const edad = document.getElementById("edad").value;
    const curso = document.getElementById("curso").value;

    const alumno = new Alumno(nombre, apellidos, dni, edad, curso);
    console.log(alumno);
    lista_alumnos.push(alumno);
    localStorage.setItem("lista_alumnos", JSON.stringify(lista_alumnos));
  } catch (error) {
    window.alert(error.message);
    console.error(error);
  }
};

const crear_encabezado = function (claves) {
  const tabla = document.getElementById("tabla_alumnos");
  const encabezado = document.createElement("tr");
  claves.forEach((clave) => {
    const th = document.createElement("th");
    th.textContent = clave.charAt(0).toUpperCase() + clave.slice(1);
    encabezado.appendChild(th);
  });
  tabla.appendChild(encabezado);
};

const renderizar_tabla = function () {
  console.log(lista_alumnos);

  // Limpiar la tabla antes de renderizar
  const tabla = document.getElementById("tabla_alumnos");
  tabla.innerHTML = "";

  if (lista_alumnos.length === 0) {
    alert("No hay alumnos para mostrar.");
    return;
  }

  // Crear encabezado dinámico
  crear_encabezado(Object.keys(lista_alumnos[0]));

  // Crear filas dinámicas
  lista_alumnos.forEach((alumno) => {
    let fila = document.createElement("tr");
    Object.values(alumno).forEach((valor) => {
      let celda = document.createElement("td");
      celda.textContent = valor;
      fila.appendChild(celda);
    });
    tabla.appendChild(fila);
    const botonResumen = crear_boton_resumen(alumno);
    const celdaBoton = document.createElement("td");
    celdaBoton.appendChild(botonResumen);
    fila.appendChild(celdaBoton);
  });
};

// Poblar los cursos al cargar la página
document.addEventListener("DOMContentLoaded", Alumno.poblar_cursos);

document.getElementById("carga_datos").addEventListener("click", cargar_datos);

document
  .getElementById("renderiza_tabla")
  .addEventListener("click", renderizar_tabla);
// añade un boton a la derecha de cada fila de la tabla que al pulsarlo cree un resumen de la fila y lo muestre abajo de la tabla
const crear_boton_resumen = function (alumno) {
  const boton = document.createElement("button");
  boton.className = "boton_resumen";
  boton.textContent = "Resumen";
  boton.addEventListener("click", function () {
    const resumen = `Nombre: ${alumno.nombre}, Apellidos: ${alumno.apellidos}, DNI: ${alumno.dni}, Edad: ${alumno.edad}, Curso: ${alumno.curso}`;
    const resumenDiv = document.createElement("div");
    resumenDiv.textContent = resumen;
    resumenDiv.style.marginTop = "10px";
    document.body.appendChild(resumenDiv);
  });
  return boton;
};
let lista_alumnos = JSON.parse(localStorage.getItem("lista_alumnos")) || [];
