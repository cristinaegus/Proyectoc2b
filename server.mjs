import express from 'express';
import fetch from 'node-fetch';
const app = express();
const PORT = 3000;

// Permitir peticiones desde tu frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Endpoint para la predicción
app.get('/api/prediccion/:municipio', async (req, res) => {
  const municipio = req.params.municipio;
  const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhaXRvci5kb25hZG9AZ21haWwuY29tIiwianRpIjoiOWVkNGFhYzQtNTI3YS00N2YzLTg5NzMtMTNlNGIxMTE4ZDUxIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE3MzU4MDY0NTYsInVzZXJJZCI6IjllZDRhYWM0LTUyN2EtNDdmMy04OTczLTEzZTRiMTExOGQ1MSIsInJvbGUiOiIifQ.vNGn79c-G44_Eu8MnrimYDDfHf0il9jILxXeBE2z1AE'; // Pon aquí tu clave

  const url = `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/${municipio}?api_key=${apiKey}`;
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

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
