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
