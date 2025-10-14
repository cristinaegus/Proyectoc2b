import express from 'express';
import fetch from 'node-fetch';
import { execFile } from 'child_process';
const app = express();
const PORT = 3100; // Puerto diferente al 3000

// Permitir peticiones desde tu frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Endpoint para la predicción de playa
app.get('/api/prediccion/playa/:id_playa', async (req, res) => {
  const idPlaya = req.params.id_playa;
  const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZ3VzcXVpemFjcmlzdGluYUBnbWFpbC5jb20iLCJqdGkiOiJhZWU5MDNiMy02YWFhLTQ4YTMtOWI5ZC03ODY4ZGViNzYzM2MiLCJpc3MiOiJBRU1FVCIsImlhdCI6MTc0NTE0MDQyNCwidXNlcklkIjoiYWVlOTAzYjMtNmFhYS00OGEzLTliOWQtNzg2OGRlYjc2MzNjIiwicm9sZSI6IiJ9.6LVOyHsmTQ3Zj763bDS_qhxV03gnD0N5H5LRLvri4cQ'; // Pon aquí tu clave

  const url = `https://opendata.aemet.es/opendata/api/prediccion/especifica/playa/${idPlaya}?api_key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!data.datos) {
      return res.status(500).json({ error: 'No se encontró la propiedad datos' });
    }
    const datosResponse = await fetch(data.datos);
    const datos = await datosResponse.json();
    res.json(datos);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Ejemplo para obtener la predicción de una playa
const idPlaya = 303102; // Cambia por el ID_PLAYA que necesites

fetch(`http://localhost:3100/api/prediccion/playa/${idPlaya}`)
  .then(response => {
    if (!response.ok) throw new Error('Error en la respuesta del backend');
    return response.json();
  })
  .then(data => {
    console.log('Predicción de la playa:', data);
    // Aquí puedes procesar y mostrar los datos en tu web
  })
  .catch(error => {
    console.error('Error al obtener la predicción:', error);
  });

// Endpoint que ejecuta el script Python
app.get('/api/informe/playa/:id_playa', (req, res) => {
  const idPlaya = req.params.id_playa;
  // Ejecuta el script Python y pasa el idPlaya como argumento
  execFile('python', ['c:/Users/egusq/C2BCurso/Proyectoc2b/informe_playas.py', idPlaya], (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ error: stderr || error.toString() });
      return;
    }
    // Puedes devolver el resultado como texto o procesarlo si es JSON
    res.send(stdout);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend de playas escuchando en http://localhost:${PORT}`);
});
