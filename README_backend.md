# Guía rápida: Backend seguro para predicción AEMET

## ¿Qué hace este backend?
Este backend actúa como intermediario entre tu frontend y la API de AEMET. Así:
- **Protege tu API key**: La clave nunca se expone al navegador ni a GitHub.
- **Evita problemas de CORS**: El navegador solo pide datos al backend local.
- **Simplifica la petición**: El frontend solo necesita saber el municipio, el backend se encarga de todo.

---

## ¿Cómo funciona la petición?

1. **El usuario selecciona un municipio en el frontend**
2. El frontend hace una petición a:
   ```
   http://localhost:3000/api/prediccion/{codigo_municipio}
   ```
3. El backend (`server.mjs`) recibe la petición y:
   - Usa la API key guardada en el propio archivo (¡no en el frontend!)
   - Hace la petición a la API de AEMET:
     ```
     https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/{codigo_municipio}?api_key=TU_API_KEY_AQUI
     ```
   - Recibe la URL de los datos reales y hace una segunda petición para obtener la predicción.
   - Devuelve el JSON de la predicción al frontend.

---

## ¿Dónde se guarda la API key?
La clave se guarda **solo** en el archivo `server.mjs`:
```js
const apiKey = 'TU_API_KEY_AQUI';
```
Nunca se expone en el frontend ni se sube a GitHub.

---

## ¿Por qué es seguro?
- El navegador nunca ve la clave.
- El archivo `server.mjs` puede estar en `.gitignore` si lo deseas.
- Solo el backend puede acceder a la API de AEMET.

---

## ¿Cómo ejecutar?
1. Instala dependencias:
   ```bash
   npm install express node-fetch
   ```
2. Ejecuta el backend:
   ```bash
   node server.mjs
   ```
3. Abre el frontend y haz la petición normalmente.

---

## Diagrama de flujo

Frontend (HTML/JS) → Backend (server.mjs) → API AEMET

- El usuario pide datos → El backend consulta la API → El backend responde al frontend

---

## ¿Qué ventajas tiene?
- Seguridad: la clave nunca se expone
- Facilidad: el frontend no necesita saber nada de la API
- Compatibilidad: sin problemas de CORS

---

## Ejemplo de endpoint en el backend
```js
app.get('/api/prediccion/:municipio', async (req, res) => {
  const municipio = req.params.municipio;
  const apiKey = 'TU_API_KEY_AQUI';
  // ...petición a AEMET...
});
```

---

## Recomendaciones
- No subas la API key a repositorios públicos.
- Cambia la clave si crees que se ha expuesto.
- Usa variables de entorno en producción para mayor seguridad.
