// Simulación de la carga de datos desde la base de datos con callbacks
/* 
export const baseDatos = function (mapeo_alumnos, callback) {
  console.log("Petición recibida");
  setTimeout(() => {
    let lista_alumnos = JSON.parse(localStorage.getItem("lista_alumnos")) || [];
    let lista_alumnos_mapeada = mapeo_alumnos(lista_alumnos);
    callback(lista_alumnos_mapeada); // ✔️ Enviamos los datos
  }, 8000);
};
 */

// Simulación de la carga de datos desde la base de datos con then y catch o con async await
export const baseDatos = function () {
  return new Promise((resolve, reject) => {
    console.log("Petición recibida");
    setTimeout(() => {
      let lista_alumnos =
        JSON.parse(localStorage.getItem("lista_alumnos")) || [];
      resolve(lista_alumnos); // ✔️ Enviamos los datos
      if (typeof lista_alumnos === "undefined") {
        reject("Error al cargar los datos"); // ✔️ Enviamos el error
      }
    }, 8000);
  });
};
//crear nuevo encabezado con los keys de la lista de alumnos y añadir a la tabla en el
// encabezado de la tabla telefono e email, para que no se repitan utiliza la clase set
// y el metodo add para añadir los nuevos encabezados

const crear_nuevo_encabezado = function (claves) {
  const tabla = document.getElementById("tabla_alumnos");
  const encabezado = document.createElement("tr");
  claves.forEach((clave) => {
    const th = document.createElement("th");
    th.textContent = clave.charAt(0).toUpperCase() + clave.slice(1);
    encabezado.appendChild(th);
  });
  tabla.appendChild(encabezado);
  const thTelefono = document.createElement("th");
  thTelefono.textContent = "Teléfono";
  encabezado.appendChild(thTelefono);
  const thEmail = document.createElement("th");
  thEmail.textContent = "Email";
  encabezado.appendChild(thEmail);
  tabla.appendChild(encabezado);
  return crear_nuevo_encabezado;
};
Set.prototype.keys = function () {
  const keys = [];
  this.forEach((key) => {
    keys.push(key);
  });
  return keys;
}; // ✔️ Método para obtener las claves de un objeto
crear_nuevo_encabezado.prototype = Object.create(Set.prototype);
crear_nuevo_encabezado.prototype.constructor = crear_nuevo_encabezado;
// ✔️ Constructor para crear un nuevo encabezado
// ✔️ Método para obtener las claves de un objeto
// ✔️ Método para obtener los valores de un objeto
crear_nuevo_encabezado.prototype.values = function () {
  const values = [];
  this.forEach((value) => {
    values.push(value);
  });
  return values;
};
// hacer que se renderice la tabla con los nuevos encabezados

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
  crear_nuevo_encabezado(Object.keys(lista_alumnos[0]));
  // añadir a la tabla los nuevos encabezados, telefono y email
  const thTelefono = document.createElement("th");
  thTelefono.textContent = "Teléfono";
  const thEmail = document.createElement("th");
  thEmail.textContent = "Email";
  tabla.appendChild(thTelefono);
  tabla.appendChild(thEmail);
  // hacer que los nuevos encabezados se muestren en la tabla
  const encabezado = document.createElement("tr");
  encabezado.appendChild(thTelefono);
  encabezado.appendChild(thEmail);
  tabla.appendChild(encabezado);

  // Crear filas dinámicas
  lista_alumnos.forEach((alumno) => {
    let fila = document.createElement("tr");
    Object.values(alumno).forEach((valor) => {
      let celda = document.createElement("td");
      celda.textContent = valor;
      fila.appendChild(celda);
    });
    tabla.appendChild(fila);
  });
};
// ordena la tabla a partir de las claves de la lista de alumnos
const ordenar_tabla = function (clave) {
  lista_alumnos.sort((a, b) => {
    if (a[clave] < b[clave]) {
      return -1;
    }
    if (a[clave] > b[clave]) {
      return 1;
    }
    return ordenar_tabla;
  });
  renderizar_tabla();
  // ✔️ Renderizar la tabla después de ordenar
};
