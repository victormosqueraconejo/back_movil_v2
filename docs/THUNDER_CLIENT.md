Thunder Client — Ejemplos rápidos (GET y POST)
=============================================

Instrucciones para crear y ejecutar dos peticiones en Thunder Client (extensión VS Code): una GET y una POST para `caracterizaciones`.

Requisitos
- Tener VS Code con la extensión **Thunder Client** instalada.
- Tener la API corriendo en `http://localhost:9000` (o ajustar la URL al puerto real).

1) Crear GET — Listar caracterizaciones
- Abre la pestaña de Thunder Client en VS Code (ícono rayo).
- Haz clic en `New Request`.
- En la barra superior elige `GET` y en URL escribe:
  `http://localhost:9000/api/caracterizaciones`
- Pulsa `Send`.
- Guarda la petición (opcional): `Save` → elige o crea una colección, por ejemplo `ProyectoCaracterizaciones`.

2) Crear POST — Crear caracterización de prueba
- En Thunder Client haz `New Request`.
- Selecciona `POST` y en URL escribe:
  `http://localhost:9000/api/caracterizaciones`
- Ve a la pestaña `Body` → selecciona `JSON`.
- Pega este JSON de ejemplo como cuerpo:

```
{
  "eventoId": null,
  "fechaRegistro": "2025-12-01T00:00:00.000Z",
  "asesorId": null,
  "tipoDocumento": "CEDULA",
  "numeroDocumento": "TC-0001",
  "primerNombre": "Prueba",
  "primerApellido": "Usuario",
  "fechaNacimiento": "1990-01-01T00:00:00.000Z",
  "genero": "MASCULINO",
  "telefono": "3000000000",
  "tieneCorreo": false
}
```

- (Opcional) Añade cabecera `Content-Type: application/json` en la pestaña `Headers`.
- Pulsa `Send`.
- Deberías recibir una respuesta `201` con el documento creado.

3) Ver la respuesta y reutilizar el `_id`
- En la respuesta del POST copia el campo `_id` y úsalo para hacer GET/PUT/DELETE por id:
  `GET http://localhost:9000/api/caracterizaciones/<ID_AQUI>`

4) Consejos si no responde
- Asegúrate que la API está corriendo (`npm.cmd start`) y que `MONGODB_URI` permite conexiones (si usas Atlas, agrega tu IP).
- Si usas otra URL/puerto, actualiza las URLs en Thunder Client.

Snippet de colección JSON (importar en Thunder Client)
- Puedes importar esta colección en Thunder Client -> Collections -> Import -> Paste JSON.

Pega esto en el import si deseas crear automáticamente las dos peticiones:

```
{
  "version": "1.1",
  "collections": [
    {
      "name": "ProyectoCaracterizaciones",
      "requests": [
        {
          "name": "GET Caracterizaciones",
          "method": "GET",
          "url": "http://localhost:9000/api/caracterizaciones",
          "headers": []
        },
        {
          "name": "POST Caracterizaciones",
          "method": "POST",
          "url": "http://localhost:9000/api/caracterizaciones",
          "headers": [
            { "key": "Content-Type", "value": "application/json" }
          ],
          "body": {
            "type": "json",
            "raw": {
              "eventoId": null,
              "fechaRegistro": "2025-12-01T00:00:00.000Z",
              "asesorId": null,
              "tipoDocumento": "CEDULA",
              "numeroDocumento": "TC-0001",
              "primerNombre": "Prueba",
              "primerApellido": "Usuario"
            }
          }
        }
      ]
    }
  ]
}
```

Fin

Si quieres, puedo:
- generar este archivo de colección ya agregado al repo (para que importes),
- o ejecutar peticiones de prueba aquí con curl/Invoke-RestMethod y pegar las respuestas.

¿Qué prefieres? (importar colección o que ejecute las pruebas aquí y muestre respuestas)
