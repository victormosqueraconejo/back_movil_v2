# Documentación de la API - Backend Móvil v2

## Tabla de Contenidos
1. [Autenticación](#autenticación)
2. [Usuarios](#usuarios)
3. [Caracterizaciones](#caracterizaciones)
4. [Seguimientos](#seguimientos)
5. [Eventos](#eventos)
6. [Auditoría](#auditoría)
7. [Parámetros](#parámetros)

---

## Autenticación

La mayoría de los endpoints requieren autenticación mediante **JWT (JSON Web Token)**. Para obtener un token, debes hacer login primero.

### Header de Autenticación

Para endpoints protegidos, incluye el siguiente header en todas las peticiones:

```
Authorization: Bearer <tu_token_jwt>
```

---

## Usuarios

### 1. Login (Obtener Token JWT)

**Método:** `POST`  
**URL:** `/api/login`  
**Autenticación:** No requerida

#### Request Body

```json
{
  "username": "string (requerido)",
  "password": "string (requerido)"
}
```

#### Respuesta Exitosa (200)

```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "uuid-del-usuario",
    "username": "mi_usuario",
    "tipo_documento": "CC",
    "numero_documento": "12345678",
    "nombres": "Juan",
    "apellidos": "Pérez",
    "correo_electronico": "juan@example.com",
    "rol": "ASESOR",
    "estado": "ACTIVO",
    "departamento": "Antioquia",
    "ciudad": "Medellín",
    "fecha_creacion": "2024-01-15T10:30:00.000Z",
    "fecha_actualizacion": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Errores

**400 - Campos faltantes:**
```json
{
  "message": "Debe enviar username y password"
}
```

**401 - Credenciales inválidas:**
```json
{
  "message": "Credenciales inválidas"
}
```

**500 - Error interno:**
```json
{
  "error": "Mensaje de error"
}
```

#### Ejemplo de Request

```bash
curl -X POST http://localhost:9000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan_perez",
    "password": "mi_clave_segura"
  }'
```

---

### 2. Crear Usuario

**Método:** `POST`  
**URL:** `/api/users`  
**Autenticación:** No requerida

#### Request Body

```json
{
  "_id": "string (opcional, UUID generado automáticamente si no se envía)",
  "username": "string (requerido, único)",
  "password": "string (requerido)",
  "tipo_documento": "string (requerido)",
  "numero_documento": "string (requerido)",
  "nombres": "string (requerido)",
  "apellidos": "string (requerido)",
  "correo_electronico": "string (requerido, único)",
  "rol": "string (requerido, enum: 'LIDER' | 'ASESOR' | 'ADMIN')",
  "nacionalidad": "string (opcional)",
  "lider_asignado": "string (opcional, UUID del líder)",
  "departamento": "string (opcional)",
  "ciudad": "string (opcional)",
  "estado": "string (opcional, default: 'ACTIVO', enum: 'ACTIVO' | 'INACTIVO')"
}
```

#### Respuesta Exitosa (201)

```json
{
  "_id": "uuid-generado",
  "username": "juan_perez",
  "tipo_documento": "CC",
  "numero_documento": "12345678",
  "nombres": "Juan",
  "apellidos": "Pérez",
  "correo_electronico": "juan@example.com",
  "rol": "ASESOR",
  "estado": "ACTIVO",
  "departamento": "Antioquia",
  "ciudad": "Medellín",
  "fecha_creacion": "2024-01-15T10:30:00.000Z",
  "fecha_actualizacion": "2024-01-15T10:30:00.000Z",
  "modificado_en": "2024-01-15T10:30:00.000Z",
  "sincronizado": false
}
```

#### Errores

**400 - Campos faltantes:**
```json
{
  "message": "Campos requeridos: username, password, tipo_documento, numero_documento, nombres, apellidos, correo_electronico, rol"
}
```

**500 - Error interno:**
```json
{
  "message": "Mensaje de error"
}
```

#### Ejemplo de Request

```bash
curl -X POST http://localhost:9000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan_perez",
    "password": "clave123",
    "tipo_documento": "CC",
    "numero_documento": "12345678",
    "nombres": "Juan",
    "apellidos": "Pérez",
    "correo_electronico": "juan@example.com",
    "rol": "ASESOR",
    "departamento": "Antioquia",
    "ciudad": "Medellín"
  }'
```

---

### 3. Obtener Todos los Usuarios

**Método:** `GET`  
**URL:** `/api/users`  
**Autenticación:** No requerida

#### Respuesta Exitosa (200)

```json
[
  {
    "_id": "uuid-1",
    "username": "usuario1",
    "nombres": "Juan",
    "apellidos": "Pérez",
    "rol": "ASESOR",
    ...
  },
  {
    "_id": "uuid-2",
    "username": "usuario2",
    "nombres": "María",
    "apellidos": "González",
    "rol": "LIDER",
    ...
  }
]
```

#### Ejemplo de Request

```bash
curl -X GET http://localhost:9000/api/users
```

---

### 4. Obtener Usuario por ID

**Método:** `GET`  
**URL:** `/api/user/:id`  
**Autenticación:** No requerida

#### Parámetros de URL

- `id` (string, requerido): UUID del usuario

#### Respuesta Exitosa (200)

```json
{
  "_id": "uuid-del-usuario",
  "username": "juan_perez",
  "tipo_documento": "CC",
  "numero_documento": "12345678",
  "nombres": "Juan",
  "apellidos": "Pérez",
  "correo_electronico": "juan@example.com",
  "rol": "ASESOR",
  "estado": "ACTIVO",
  ...
}
```

#### Errores

**404 - Usuario no encontrado:**
```json
{
  "message": "Usuario no encontrado"
}
```

#### Ejemplo de Request

```bash
curl -X GET http://localhost:9000/api/user/uuid-del-usuario
```

---

### 5. Actualizar Usuario

**Método:** `PUT`  
**URL:** `/api/user/:id`  
**Autenticación:** No requerida

#### Parámetros de URL

- `id` (string, requerido): UUID del usuario

#### Request Body

Todos los campos son opcionales. Solo envía los campos que deseas actualizar:

```json
{
  "nombres": "string (opcional)",
  "apellidos": "string (opcional)",
  "correo_electronico": "string (opcional)",
  "password": "string (opcional, se hashea automáticamente)",
  "departamento": "string (opcional)",
  "ciudad": "string (opcional)",
  "estado": "string (opcional, enum: 'ACTIVO' | 'INACTIVO')",
  ...
}
```

#### Respuesta Exitosa (200)

```json
{
  "_id": "uuid-del-usuario",
  "username": "juan_perez",
  "nombres": "Juan Carlos",
  "apellidos": "Pérez",
  "modificado_en": "2024-01-15T11:00:00.000Z",
  ...
}
```

#### Errores

**404 - Usuario no encontrado:**
```json
{
  "message": "Usuario no encontrado"
}
```

#### Ejemplo de Request

```bash
curl -X PUT http://localhost:9000/api/user/uuid-del-usuario \
  -H "Content-Type: application/json" \
  -d '{
    "nombres": "Juan Carlos",
    "departamento": "Cundinamarca"
  }'
```

---

### 6. Eliminar Usuario

**Método:** `DELETE`  
**URL:** `/api/user/:id`  
**Autenticación:** No requerida

#### Parámetros de URL

- `id` (string, requerido): UUID del usuario

#### Respuesta Exitosa (200)

```json
{
  "message": "Usuario eliminado"
}
```

#### Errores

**404 - Usuario no encontrado:**
```json
{
  "message": "Usuario no encontrado"
}
```

#### Ejemplo de Request

```bash
curl -X DELETE http://localhost:9000/api/user/uuid-del-usuario
```

---

## Caracterizaciones

**Nota:** Todos los endpoints de caracterizaciones requieren autenticación con token JWT.

### 1. Crear o Actualizar Caracterización

**Método:** `POST`  
**URL:** `/api/caracterizaciones`  
**Autenticación:** Requerida (Bearer Token)

**Nota importante:** Este endpoint funciona como **upsert** (crear o actualizar):
- Si ya existe una caracterización con el mismo `documento`, `tipo_documento` y `evento_id`, **se actualiza** (retorna 200)
- Si es una nueva caracterización del mismo usuario (mismo documento) pero diferente evento, **se crea nueva** y las caracterizaciones anteriores del mismo documento se marcan como `INACTIVO` automáticamente
- La caracterización nueva o actualizada siempre queda con estado `ACTIVO`

#### Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body

```json
{
  "_id": "string (opcional, UUID generado automáticamente)",
  "ciudadano": {
    "documento": "string (requerido)",
    "tipo_documento": "string (requerido)",
    "nombres": "string (opcional)",
    "apellidos": "string (opcional)",
    ...
  },
  "evento_id": "string (requerido, UUID del evento)",
  "asesor_id": "string (requerido, UUID del asesor)",
  "estado": "string (opcional, enum: 'ACTIVO' | 'INACTIVO', default: 'ACTIVO')",
  ...
}
```

#### Respuesta Exitosa

**Cuando se crea una nueva caracterización (201):**
```json
{
  "ok": true,
  "accion": "creada",
  "caracterizacion": {
    "_id": "uuid-generado",
    "ciudadano": {
      "documento": "12345678",
      "tipo_documento": "CC",
      ...
    },
    "evento_id": "uuid-del-evento",
    "asesor_id": "uuid-del-asesor",
    "estado": "ACTIVO",
    "fecha_creacion": "2024-01-15T10:30:00.000Z",
    ...
  }
}
```

**Cuando se actualiza una caracterización existente (200):**
```json
{
  "ok": true,
  "accion": "actualizada",
  "caracterizacion": {
    "_id": "uuid-existente",
    "ciudadano": {
      "documento": "12345678",
      "tipo_documento": "CC",
      ...
    },
    "evento_id": "uuid-del-evento",
    "asesor_id": "uuid-del-asesor",
    "estado": "ACTIVO",
    "fecha_creacion": "2024-01-15T10:30:00.000Z",
    "fecha_actualizacion": "2024-01-20T15:30:00.000Z",
    "modificado_en": "2024-01-20T15:30:00.000Z",
    ...
  }
}
```

#### Comportamiento Especial

1. **Actualización automática**: Si envías un POST con el mismo `documento`, `tipo_documento` y `evento_id` de una caracterización existente, se actualizará en lugar de crear una duplicada.

2. **Desactivación automática**: Si creas una nueva caracterización del mismo usuario (mismo documento) pero en un evento diferente, todas las caracterizaciones anteriores del mismo documento se marcan automáticamente como `INACTIVO` y la nueva queda como `ACTIVO`.

3. **Estado siempre ACTIVO**: La caracterización nueva o actualizada siempre queda con estado `ACTIVO`, independientemente del valor que envíes en el campo `estado`.

#### Errores

**400 - Campos faltantes:**
```json
{
  "ok": false,
  "message": "Campos requeridos: ciudadano.documento, ciudadano.tipo_documento"
}
```

**401 - No autenticado:**
```json
{
  "message": "Token no provisto o formato inválido (use Bearer <token>)"
}
```

#### Ejemplo de Request

```bash
curl -X POST http://localhost:9000/api/caracterizaciones \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "ciudadano": {
      "documento": "12345678",
      "tipo_documento": "CC",
      "nombres": "Pedro",
      "apellidos": "Martínez"
    },
    "evento_id": "uuid-del-evento",
    "asesor_id": "uuid-del-asesor"
  }'
```

---

### 2. Obtener Todas las Caracterizaciones

**Método:** `GET`  
**URL:** `/api/caracterizaciones`  
**Autenticación:** Requerida (Bearer Token)

#### Headers

```
Authorization: Bearer <token>
```

#### Respuesta Exitosa (200)

```json
{
  "ok": true,
  "caracterizaciones": [
    {
      "_id": "uuid-1",
      "ciudadano": { ... },
      "evento_id": "uuid-del-evento",
      "fecha_creacion": "2024-01-15T10:30:00.000Z",
      ...
    },
    {
      "_id": "uuid-2",
      ...
    }
  ]
}
```

#### Ejemplo de Request

```bash
curl -X GET http://localhost:9000/api/caracterizaciones \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 3. Buscar Caracterizaciones por Número de Documento

**Método:** `GET`  
**URL:** `/api/caracterizaciones/documento/:documento`  
**Autenticación:** Requerida (Bearer Token)

#### Parámetros de URL

- `documento` (string, requerido): Número de documento del ciudadano

#### Query Parameters (Opcionales)

- `tipo_documento` (string, opcional): Filtrar por tipo de documento (ej: "CC", "TI", "CE")

#### Respuesta Exitosa (200)

```json
{
  "ok": true,
  "caracterizaciones": [
    {
      "_id": "uuid-1",
      "ciudadano": {
        "documento": "12345678",
        "tipo_documento": "CC",
        "nombres": "Juan Carlos",
        "apellidos": "Pérez Martínez"
      },
      "evento_id": "uuid-del-evento",
      "asesor_id": "uuid-del-asesor",
      "fecha_creacion": "2024-01-15T10:30:00.000Z",
      ...
    },
    {
      "_id": "uuid-2",
      "ciudadano": {
        "documento": "12345678",
        "tipo_documento": "CC",
        ...
      },
      ...
    }
  ]
}
```

#### Errores

**404 - No encontrado:**
```json
{
  "ok": false,
  "message": "No se encontraron caracterizaciones para este documento"
}
```

#### Ejemplo de Request

**Buscar por documento sin filtrar tipo:**
```bash
curl -X GET http://localhost:9000/api/caracterizaciones/documento/12345678 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Buscar por documento y tipo específico:**
```bash
curl -X GET "http://localhost:9000/api/caracterizaciones/documento/12345678?tipo_documento=CC" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 4. Buscar Caracterizaciones por Nombre y Apellido

**Método:** `GET`  
**URL:** `/api/caracterizaciones/buscar`  
**Autenticación:** Requerida (Bearer Token)

#### Query Parameters

- `nombres` (string, opcional): Nombre del ciudadano (busca en primer nombre y segundo nombre, búsqueda parcial, case insensitive)
- `apellidos` (string, opcional): Apellido del ciudadano (busca en primer apellido y segundo apellido, búsqueda parcial, case insensitive)
- `nombre_completo` (string, opcional): Nombre completo del ciudadano (busca en la concatenación de nombres + apellidos, búsqueda parcial, case insensitive)

**Nota:** 
- Debe proporcionar al menos uno de los tres parámetros (`nombres`, `apellidos` o `nombre_completo`).
- Si usas `nombre_completo`, no puedes usar `nombres` o `apellidos` al mismo tiempo (son mutuamente excluyentes).
- La búsqueda busca el texto en cualquier parte del campo nombres/apellidos, por lo que encontrará coincidencias en primer nombre, segundo nombre, primer apellido o segundo apellido.
- `nombre_completo` busca en toda la cadena "nombres apellidos" concatenada.

#### Respuesta Exitosa (200)

```json
{
  "ok": true,
  "caracterizaciones": [
    {
      "_id": "uuid-1",
      "ciudadano": {
        "documento": "12345678",
        "tipo_documento": "CC",
        "nombres": "Juan Carlos",
        "apellidos": "Pérez Martínez"
      },
      "evento_id": "uuid-del-evento",
      "asesor_id": "uuid-del-asesor",
      "fecha_creacion": "2024-01-15T10:30:00.000Z",
      ...
    },
    {
      "_id": "uuid-2",
      "ciudadano": {
        "documento": "87654321",
        "tipo_documento": "CC",
        "nombres": "Juan",
        "apellidos": "Pérez"
      },
      ...
    }
  ],
  "total": 2
}
```

#### Errores

**400 - Parámetros faltantes:**
```json
{
  "ok": false,
  "message": "Debe proporcionar al menos uno de los parámetros: nombres, apellidos o nombre_completo"
}
```

**404 - No encontrado:**
```json
{
  "ok": false,
  "message": "No se encontraron caracterizaciones con los criterios de búsqueda"
}
```

#### Ejemplo de Request

**Buscar solo por nombre:**
```bash
curl -X GET "http://localhost:9000/api/caracterizaciones/buscar?nombres=Juan" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Buscar solo por apellido:**
```bash
curl -X GET "http://localhost:9000/api/caracterizaciones/buscar?apellidos=Pérez" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Buscar por nombre y apellido:**
```bash
curl -X GET "http://localhost:9000/api/caracterizaciones/buscar?nombres=Juan&apellidos=Pérez" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Buscar por nombre completo (todos los nombres y apellidos):**
```bash
curl -X GET "http://localhost:9000/api/caracterizaciones/buscar?nombre_completo=Juan Carlos Pérez" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Nota:** La búsqueda es parcial y case insensitive. Busca el texto en cualquier parte del campo nombres o apellidos, por lo que:
- Si buscas "juan", encontrará "Juan", "JUAN", "Juan Carlos", "Carlos Juan", etc.
- Si buscas "carlos", encontrará "Juan Carlos", "Carlos", "Carlos Alberto", etc.
- Si buscas "martinez", encontrará "Pérez Martínez", "Martínez", "González Martínez", etc.
- Funciona tanto para primer nombre/apellido como para segundo nombre/apellido.
- `nombre_completo` busca en toda la cadena concatenada "nombres apellidos", útil para buscar "Juan Carlos Pérez Martínez" o cualquier parte del nombre completo.

---

### 5. Buscar Caracterizaciones por ID de Evento

**Método:** `GET`  
**URL:** `/api/caracterizaciones/evento/:evento_id`  
**Autenticación:** Requerida (Bearer Token)

#### Parámetros de URL

- `evento_id` (string, requerido): UUID del evento

#### Query Parameters (Opcionales)

- `estado` (string, opcional): Filtrar por estado de la caracterización (`ACTIVO` o `INACTIVO`)

#### Respuesta Exitosa (200)

```json
{
  "ok": true,
  "caracterizaciones": [
    {
      "_id": "uuid-1",
      "ciudadano": {
        "documento": "12345678",
        "tipo_documento": "CC",
        "nombres": "Juan Carlos",
        "apellidos": "Pérez Martínez"
      },
      "evento_id": "uuid-del-evento",
      "asesor_id": "uuid-del-asesor",
      "estado": "ACTIVO",
      "fecha_creacion": "2024-01-15T10:30:00.000Z",
      ...
    },
    {
      "_id": "uuid-2",
      "ciudadano": {
        "documento": "87654321",
        "tipo_documento": "CC",
        "nombres": "María",
        "apellidos": "González"
      },
      "evento_id": "uuid-del-evento",
      "asesor_id": "uuid-del-asesor-2",
      "estado": "ACTIVO",
      ...
    }
  ],
  "total": 2
}
```

#### Errores

**404 - No encontrado:**
```json
{
  "ok": false,
  "message": "No se encontraron caracterizaciones para este evento"
}
```

#### Ejemplo de Request

**Buscar todas las caracterizaciones de un evento:**
```bash
curl -X GET http://localhost:9000/api/caracterizaciones/evento/uuid-del-evento \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Buscar solo las caracterizaciones activas de un evento:**
```bash
curl -X GET "http://localhost:9000/api/caracterizaciones/evento/uuid-del-evento?estado=ACTIVO" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Buscar solo las caracterizaciones inactivas de un evento:**
```bash
curl -X GET "http://localhost:9000/api/caracterizaciones/evento/uuid-del-evento?estado=INACTIVO" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 6. Buscar Caracterizaciones por Nacionalidad

**Método:** `GET`  
**URL:** `/api/caracterizaciones/nacionalidad/:nacionalidad`  
**Autenticación:** Requerida (Bearer Token)

#### Parámetros de URL

- `nacionalidad` (string, requerido): Nacionalidad del ciudadano (búsqueda parcial, case insensitive)

#### Query Parameters (Opcionales)

- `estado` (string, opcional): Filtrar por estado de la caracterización (`ACTIVO` o `INACTIVO`)

#### Respuesta Exitosa (200)

```json
{
  "ok": true,
  "caracterizaciones": [
    {
      "_id": "uuid-1",
      "ciudadano": {
        "documento": "12345678",
        "tipo_documento": "CC",
        "nombres": "Juan Carlos",
        "apellidos": "Pérez Martínez"
      },
      "identidad": {
        "nacionalidad": "COLOMBIANA",
        ...
      },
      "evento_id": "uuid-del-evento",
      "estado": "ACTIVO",
      ...
    },
    {
      "_id": "uuid-2",
      "ciudadano": {
        "documento": "87654321",
        ...
      },
      "identidad": {
        "nacionalidad": "COLOMBIANA",
        ...
      },
      ...
    }
  ],
  "total": 2
}
```

#### Errores

**404 - No encontrado:**
```json
{
  "ok": false,
  "message": "No se encontraron caracterizaciones con esta nacionalidad"
}
```

#### Ejemplo de Request

**Buscar todas las caracterizaciones de una nacionalidad:**
```bash
curl -X GET http://localhost:9000/api/caracterizaciones/nacionalidad/COLOMBIANA \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Buscar solo las activas de una nacionalidad:**
```bash
curl -X GET "http://localhost:9000/api/caracterizaciones/nacionalidad/COLOMBIANA?estado=ACTIVO" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Buscar por nacionalidad (búsqueda parcial):**
```bash
# Buscar "colombiana" encontrará "COLOMBIANA", "colombiana", etc.
curl -X GET "http://localhost:9000/api/caracterizaciones/nacionalidad/colombiana" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Nota:** La búsqueda es parcial y case insensitive. Si buscas "colombiana", encontrará "COLOMBIANA", "colombiana", "Colombiana", etc.

---

### 7. Obtener Caracterización por ID

**Método:** `GET`  
**URL:** `/api/caracterizaciones/:id`  
**Autenticación:** Requerida (Bearer Token)

#### Parámetros de URL

- `id` (string, requerido): UUID de la caracterización

#### Respuesta Exitosa (200)

```json
{
  "ok": true,
  "caracterizacion": {
    "_id": "uuid-de-la-caracterizacion",
    "ciudadano": { ... },
    "evento_id": "uuid-del-evento",
    ...
  }
}
```

#### Errores

**404 - No encontrado:**
```json
{
  "ok": false,
  "message": "No encontrado"
}
```

#### Ejemplo de Request

```bash
curl -X GET http://localhost:9000/api/caracterizaciones/uuid-de-la-caracterizacion \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 8. Actualizar Caracterización

**Método:** `PUT`  
**URL:** `/api/caracterizaciones/:id`  
**Autenticación:** Requerida (Bearer Token)

#### Parámetros de URL

- `id` (string, requerido): UUID de la caracterización

#### Request Body

Todos los campos son opcionales. Solo envía los campos que deseas actualizar:

```json
{
  "ciudadano": { ... },
  "evento_id": "string (opcional)",
  "estado": "string (opcional, enum: 'ACTIVO' | 'INACTIVO')",
  ...
}
```

#### Respuesta Exitosa (200)

```json
{
  "ok": true,
  "caracterizacion": {
    "_id": "uuid-de-la-caracterizacion",
    "modificado_en": "2024-01-15T11:00:00.000Z",
    ...
  }
}
```

#### Ejemplo de Request

```bash
curl -X PUT http://localhost:9000/api/caracterizaciones/uuid-de-la-caracterizacion \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "ciudadano": {
      "nombres": "Pedro Carlos"
    }
  }'
```

---

### 9. Eliminar Caracterización

**Método:** `DELETE`  
**URL:** `/api/caracterizaciones/:id`  
**Autenticación:** Requerida (Bearer Token)

#### Parámetros de URL

- `id` (string, requerido): UUID de la caracterización

#### Respuesta Exitosa (200)

```json
{
  "ok": true,
  "message": "Eliminado"
}
```

#### Ejemplo de Request

```bash
curl -X DELETE http://localhost:9000/api/caracterizaciones/uuid-de-la-caracterizacion \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Seguimientos

**Nota:** Todos los endpoints de seguimientos requieren autenticación con token JWT.

### 1. Crear Seguimiento

**Método:** `POST`  
**URL:** `/api/seguimientos`  
**Autenticación:** Requerida (Bearer Token)

#### Request Body

```json
{
  "_id": "string (opcional, UUID generado automáticamente)",
  "caracterizacion_id": "string (requerido, UUID de la caracterización)",
  "descripcion": "string (requerido)",
  "resultado": "string (requerido, enum: 'EXITOSO' | 'PENDIENTE' | 'FALLIDO' | 'CANCELADO')",
  "usuario_id": "string (opcional, se usa el usuario del token si no se envía)",
  "fecha_seguimiento": "string (opcional, ISO date)",
  ...
}
```

#### Respuesta Exitosa (201)

```json
{
  "ok": true,
  "seguimiento": {
    "_id": "uuid-generado",
    "caracterizacion_id": "uuid-de-la-caracterizacion",
    "descripcion": "Seguimiento realizado exitosamente",
    "resultado": "EXITOSO",
    "usuario_id": "uuid-del-usuario",
    "fecha_creacion": "2024-01-15T10:30:00.000Z",
    ...
  }
}
```

#### Errores

**400 - Campos faltantes o inválidos:**
```json
{
  "ok": false,
  "message": "Campo requerido: caracterizacion_id"
}
```

```json
{
  "ok": false,
  "message": "resultado debe ser: EXITOSO, PENDIENTE, FALLIDO o CANCELADO"
}
```

#### Ejemplo de Request

```bash
curl -X POST http://localhost:9000/api/seguimientos \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "caracterizacion_id": "uuid-de-la-caracterizacion",
    "descripcion": "Se realizó seguimiento telefónico",
    "resultado": "EXITOSO"
  }'
```

---

### 2. Obtener Todos los Seguimientos

**Método:** `GET`  
**URL:** `/api/seguimientos`  
**Autenticación:** Requerida (Bearer Token)

#### Respuesta Exitosa (200)

```json
{
  "ok": true,
  "seguimientos": [
    {
      "_id": "uuid-1",
      "caracterizacion_id": "uuid-de-la-caracterizacion",
      "descripcion": "...",
      "resultado": "EXITOSO",
      ...
    },
    ...
  ]
}
```

#### Ejemplo de Request

```bash
curl -X GET http://localhost:9000/api/seguimientos \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 3. Obtener Seguimientos por Caracterización

**Método:** `GET`  
**URL:** `/api/seguimientos/caracterizacion/:caracterizacion_id`  
**Autenticación:** Requerida (Bearer Token)

#### Parámetros de URL

- `caracterizacion_id` (string, requerido): UUID de la caracterización

#### Respuesta Exitosa (200)

```json
{
  "ok": true,
  "seguimientos": [
    {
      "_id": "uuid-1",
      "caracterizacion_id": "uuid-de-la-caracterizacion",
      "descripcion": "...",
      "resultado": "EXITOSO",
      "fecha_seguimiento": "2024-01-15T10:30:00.000Z",
      ...
    },
    ...
  ]
}
```

#### Ejemplo de Request

```bash
curl -X GET http://localhost:9000/api/seguimientos/caracterizacion/uuid-de-la-caracterizacion \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 4. Obtener Seguimiento por ID

**Método:** `GET`  
**URL:** `/api/seguimientos/:id`  
**Autenticación:** Requerida (Bearer Token)

#### Parámetros de URL

- `id` (string, requerido): UUID del seguimiento

#### Respuesta Exitosa (200)

```json
{
  "ok": true,
  "seguimiento": {
    "_id": "uuid-del-seguimiento",
    "caracterizacion_id": "uuid-de-la-caracterizacion",
    "descripcion": "...",
    "resultado": "EXITOSO",
    ...
  }
}
```

#### Ejemplo de Request

```bash
curl -X GET http://localhost:9000/api/seguimientos/uuid-del-seguimiento \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 5. Actualizar Seguimiento

**Método:** `PUT`  
**URL:** `/api/seguimientos/:id`  
**Autenticación:** Requerida (Bearer Token)

#### Parámetros de URL

- `id` (string, requerido): UUID del seguimiento

#### Request Body

```json
{
  "descripcion": "string (opcional)",
  "resultado": "string (opcional, enum: 'EXITOSO' | 'PENDIENTE' | 'FALLIDO' | 'CANCELADO')",
  ...
}
```

#### Respuesta Exitosa (200)

```json
{
  "ok": true,
  "seguimiento": {
    "_id": "uuid-del-seguimiento",
    "modificado_en": "2024-01-15T11:00:00.000Z",
    ...
  }
}
```

#### Ejemplo de Request

```bash
curl -X PUT http://localhost:9000/api/seguimientos/uuid-del-seguimiento \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "resultado": "FALLIDO",
    "descripcion": "No se pudo contactar al ciudadano"
  }'
```

---

### 6. Eliminar Seguimiento

**Método:** `DELETE`  
**URL:** `/api/seguimientos/:id`  
**Autenticación:** Requerida (Bearer Token)

#### Parámetros de URL

- `id` (string, requerido): UUID del seguimiento

#### Respuesta Exitosa (200)

```json
{
  "ok": true,
  "message": "Eliminado"
}
```

#### Ejemplo de Request

```bash
curl -X DELETE http://localhost:9000/api/seguimientos/uuid-del-seguimiento \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Eventos

**Nota:** Todos los endpoints de eventos requieren autenticación con token JWT.

### 1. Crear Evento

**Método:** `POST`  
**URL:** `/api/eventos`  
**Autenticación:** Requerida (Bearer Token)

#### Request Body

```json
{
  "_id": "string (opcional, UUID generado automáticamente)",
  "nombre": "string (requerido)",
  "ciudad": "string (requerido)",
  "departamento": "string (requerido)",
  "fecha_inicio": "string (requerido, ISO date)",
  "fecha_fin": "string (requerido, ISO date)",
  ...
}
```

#### Respuesta Exitosa (201)

```json
{
  "ok": true,
  "evento": {
    "_id": "uuid-generado",
    "nombre": "Feria de Empleo 2024",
    "ciudad": "Medellín",
    "departamento": "Antioquia",
    "fecha_inicio": "2024-02-01T08:00:00.000Z",
    "fecha_fin": "2024-02-03T18:00:00.000Z",
    "fecha_creacion": "2024-01-15T10:30:00.000Z",
    ...
  }
}
```

#### Errores

**400 - Campos faltantes:**
```json
{
  "ok": false,
  "message": "Campos requeridos: nombre, ciudad, departamento, fecha_inicio, fecha_fin"
}
```

#### Ejemplo de Request

```bash
curl -X POST http://localhost:9000/api/eventos \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Feria de Empleo 2024",
    "ciudad": "Medellín",
    "departamento": "Antioquia",
    "fecha_inicio": "2024-02-01T08:00:00.000Z",
    "fecha_fin": "2024-02-03T18:00:00.000Z"
  }'
```

---

### 2. Listar Eventos

**Método:** `GET`  
**URL:** `/api/eventos`  
**Autenticación:** Requerida (Bearer Token)

#### Respuesta Exitosa (200)

```json
{
  "ok": true,
  "eventos": [
    {
      "_id": "uuid-1",
      "nombre": "Feria de Empleo 2024",
      "ciudad": "Medellín",
      "departamento": "Antioquia",
      "fecha_inicio": "2024-02-01T08:00:00.000Z",
      "fecha_fin": "2024-02-03T18:00:00.000Z",
      ...
    },
    ...
  ]
}
```

#### Ejemplo de Request

```bash
curl -X GET http://localhost:9000/api/eventos \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 3. Obtener Evento por ID

**Método:** `GET`  
**URL:** `/api/eventos/:id`  
**Autenticación:** Requerida (Bearer Token)

#### Parámetros de URL

- `id` (string, requerido): UUID del evento

#### Respuesta Exitosa (200)

```json
{
  "ok": true,
  "evento": {
    "_id": "uuid-del-evento",
    "nombre": "Feria de Empleo 2024",
    "ciudad": "Medellín",
    "departamento": "Antioquia",
    ...
  }
}
```

#### Ejemplo de Request

```bash
curl -X GET http://localhost:9000/api/eventos/uuid-del-evento \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 4. Actualizar Evento

**Método:** `PUT`  
**URL:** `/api/eventos/:id`  
**Autenticación:** Requerida (Bearer Token)

#### Parámetros de URL

- `id` (string, requerido): UUID del evento

#### Request Body

```json
{
  "nombre": "string (opcional)",
  "ciudad": "string (opcional)",
  "departamento": "string (opcional)",
  "fecha_inicio": "string (opcional, ISO date)",
  "fecha_fin": "string (opcional, ISO date)",
  ...
}
```

#### Respuesta Exitosa (200)

```json
{
  "ok": true,
  "evento": {
    "_id": "uuid-del-evento",
    "modificado_en": "2024-01-15T11:00:00.000Z",
    ...
  }
}
```

#### Ejemplo de Request

```bash
curl -X PUT http://localhost:9000/api/eventos/uuid-del-evento \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Feria de Empleo 2024 - Actualizada"
  }'
```

---

### 5. Eliminar Evento

**Método:** `DELETE`  
**URL:** `/api/eventos/:id`  
**Autenticación:** Requerida (Bearer Token)

#### Parámetros de URL

- `id` (string, requerido): UUID del evento

#### Respuesta Exitosa (200)

```json
{
  "ok": true,
  "message": "Eliminado"
}
```

#### Ejemplo de Request

```bash
curl -X DELETE http://localhost:9000/api/eventos/uuid-del-evento \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Auditoría

**Nota:** Todos los endpoints de auditoría requieren autenticación con token JWT.

### 1. Crear Registro de Auditoría

**Método:** `POST`  
**URL:** `/api/auditoria`  
**Autenticación:** Requerida (Bearer Token)

#### Request Body

El body puede contener cualquier estructura de datos según el modelo de auditoría:

```json
{
  "accion": "string",
  "usuario_id": "string",
  "documento_id": "string",
  "fecha": "string (ISO date)",
  "detalles": {},
  ...
}
```

#### Respuesta Exitosa (201)

```json
{
  "ok": true,
  "data": {
    "_id": "uuid-generado",
    "accion": "CREAR_CARACTERIZACION",
    "usuario_id": "uuid-del-usuario",
    "fecha": "2024-01-15T10:30:00.000Z",
    ...
  }
}
```

#### Ejemplo de Request

```bash
curl -X POST http://localhost:9000/api/auditoria \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "accion": "CREAR_CARACTERIZACION",
    "usuario_id": "uuid-del-usuario",
    "documento_id": "uuid-del-documento",
    "fecha": "2024-01-15T10:30:00.000Z"
  }'
```

---

### 2. Listar Auditorías

**Método:** `GET`  
**URL:** `/api/auditoria`  
**Autenticación:** Requerida (Bearer Token)

#### Respuesta Exitosa (200)

Retorna las últimas 200 auditorías ordenadas por fecha descendente:

```json
{
  "ok": true,
  "data": [
    {
      "_id": "uuid-1",
      "accion": "CREAR_CARACTERIZACION",
      "usuario_id": "uuid-del-usuario",
      "fecha": "2024-01-15T10:30:00.000Z",
      ...
    },
    ...
  ]
}
```

#### Ejemplo de Request

```bash
curl -X GET http://localhost:9000/api/auditoria \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 3. Obtener Auditorías por Documento

**Método:** `GET`  
**URL:** `/api/auditoria/documento/:documento_id`  
**Autenticación:** Requerida (Bearer Token)

#### Parámetros de URL

- `documento_id` (string, requerido): ID del documento

#### Respuesta Exitosa (200)

```json
{
  "ok": true,
  "data": [
    {
      "_id": "uuid-1",
      "accion": "CREAR_CARACTERIZACION",
      "documento_id": "uuid-del-documento",
      "fecha": "2024-01-15T10:30:00.000Z",
      ...
    },
    ...
  ]
}
```

#### Ejemplo de Request

```bash
curl -X GET http://localhost:9000/api/auditoria/documento/uuid-del-documento \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Parámetros

**Nota:** Todos los endpoints de parámetros requieren autenticación con token JWT.

### 1. Crear Parámetro

**Método:** `POST`  
**URL:** `/api/parametros`  
**Autenticación:** Requerida (Bearer Token)

#### Request Body

```json
{
  "tipo": "string",
  "codigo": "string",
  "nombre": "string",
  "padre_codigo": "string (opcional)",
  "activo": "boolean (opcional)",
  ...
}
```

#### Respuesta Exitosa (201)

```json
{
  "ok": true,
  "data": {
    "_id": "uuid-generado",
    "tipo": "DEPARTAMENTO",
    "codigo": "05",
    "nombre": "Antioquia",
    "activo": true,
    ...
  }
}
```

#### Ejemplo de Request

```bash
curl -X POST http://localhost:9000/api/parametros \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "DEPARTAMENTO",
    "codigo": "05",
    "nombre": "Antioquia",
    "activo": true
  }'
```

---

### 2. Listar Todos los Parámetros

**Método:** `GET`  
**URL:** `/api/parametros`  
**Autenticación:** Requerida (Bearer Token)

#### Respuesta Exitosa (200)

Retorna todos los parámetros almacenados en la base de datos, ordenados por tipo y nombre:

```json
{
  "ok": true,
  "data": [
    {
      "_id": "uuid-1",
      "tipo": "DEPARTAMENTO",
      "codigo": "05",
      "nombre": "Antioquia",
      "padre_codigo": null
    },
    {
      "_id": "uuid-2",
      "tipo": "DEPARTAMENTO",
      "codigo": "11",
      "nombre": "Bogotá D.C.",
      "padre_codigo": null
    },
    {
      "_id": "uuid-3",
      "tipo": "CIUDAD",
      "codigo": "05001",
      "nombre": "Medellín",
      "padre_codigo": "05"
    },
    ...
  ],
  "total": 150
}
```

#### Ejemplo de Request

```bash
curl -X GET http://localhost:9000/api/parametros \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 3. Obtener Parámetros por Tipo

**Método:** `GET`  
**URL:** `/api/parametros/tipo/:tipo`  
**Autenticación:** Requerida (Bearer Token)

#### Parámetros de URL

- `tipo` (string, requerido): Tipo de parámetro (ej: "DEPARTAMENTO", "CIUDAD", etc.)

#### Respuesta Exitosa (200)

```json
{
  "ok": true,
  "data": [
    {
      "_id": "uuid-1",
      "tipo": "DEPARTAMENTO",
      "codigo": "05",
      "nombre": "Antioquia",
      ...
    },
    {
      "_id": "uuid-2",
      "tipo": "DEPARTAMENTO",
      "codigo": "11",
      "nombre": "Bogotá D.C.",
      ...
    }
  ]
}
```

#### Ejemplo de Request

```bash
curl -X GET http://localhost:9000/api/parametros/tipo/DEPARTAMENTO \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 4. Obtener Parámetros por Tipo y Padre (Jerárquico)

**Método:** `GET`  
**URL:** `/api/parametros/tipo/:tipo/padre/:padre_codigo`  
**Autenticación:** Requerida (Bearer Token)

#### Parámetros de URL

- `tipo` (string, requerido): Tipo de parámetro
- `padre_codigo` (string, requerido): Código del parámetro padre

#### Respuesta Exitosa (200)

```json
{
  "ok": true,
  "data": [
    {
      "_id": "uuid-1",
      "tipo": "CIUDAD",
      "codigo": "05001",
      "nombre": "Medellín",
      "padre_codigo": "05",
      ...
    },
    {
      "_id": "uuid-2",
      "tipo": "CIUDAD",
      "codigo": "05002",
      "nombre": "Bello",
      "padre_codigo": "05",
      ...
    }
  ]
}
```

#### Ejemplo de Request

```bash
curl -X GET http://localhost:9000/api/parametros/tipo/CIUDAD/padre/05 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Códigos de Estado HTTP

- **200**: OK - Operación exitosa
- **201**: Created - Recurso creado exitosamente
- **400**: Bad Request - Error en los datos enviados
- **401**: Unauthorized - No autenticado o token inválido/expirado
- **404**: Not Found - Recurso no encontrado
- **500**: Internal Server Error - Error interno del servidor

---

## Notas Importantes

1. **Tokens JWT**: Los tokens tienen una expiración por defecto de 8 horas. Configura `JWT_EXPIRES_IN` en las variables de entorno para cambiarlo.

2. **Formato de Fechas**: Usa formato ISO 8601 para todas las fechas (ej: `"2024-01-15T10:30:00.000Z"`).

3. **UUIDs**: Los IDs se generan automáticamente como UUIDs si no se proporcionan en el body.

4. **Base URL**: Reemplaza `http://localhost:9000` con la URL de tu servidor en producción.

5. **Variables de Entorno**: Asegúrate de configurar `JWT_SECRET` en producción para mayor seguridad.

