# Sistema de Gestión de Citas Médicas
## API RESTful con Node.js, Express y MySQL

---
## Proyecto realizado y desarrollado por: Nicolas A. Leon D, Erick Ortiz.
## Ingenieria en Sistemas biomedicos / 4to ciclo 
## Progaramacion web y movil.
## 1. Introducción


Este proyecto implementa una API RESTful para la gestión de citas médicas, aplicando principios de desarrollo backend modernos: autenticación JWT, arquitectura MVC, validación de datos y documentación con OpenAPI/Swagger.

---

## 2. Diagrama de Entidad-Relación

```
┌──────────────┐       ┌──────────────┐
│   usuarios   │       │especialidades│
│─────────────│       │─────────────│
│ id (PK)      │       │ id (PK)      │
│ nombre       │       │ nombre       │
│ email        │       │ descripcion  │
│ password     │       │ activo       │
│ rol          │       └──────┬───────┘
│ activo       │              │ 1
└──────┬───────┘              │
       │ 1                    │ N
       ├──────────────────────┤
       │                      │
       │ N                    │
┌──────┴───────┐       ┌──────┴───────┐
│   pacientes  │       │   medicos    │
│─────────────│       │─────────────│
│ id (PK)      │       │ id (PK)      │
│ usuario_id(FK│       │ usuario_id(FK│
│ fecha_nac    │       │especialidad_i│
│ genero       │       │numero_licenci│
│ telefono     │       │ telefono     │
│ direccion    │       │ activo       │
└──────┬───────┘       └──────┬───────┘
       │ 1                    │ 1
       │ N                    │ N
       └──────────┬───────────┘
                  │
           ┌──────┴───────┐
           │    citas     │
           │─────────────│
           │ id (PK)      │
           │ paciente_id  │
           │ medico_id    │
           │ fecha_hora   │
           │ motivo       │
           │ estado       │
           │ notas        │
           └──────────────┘
```

### Relaciones:
| Relación                       | Tipo  |
|-------------------------------|-------|
| usuarios → pacientes          | 1 : 1 |
| usuarios → medicos            | 1 : 1 |
| especialidades → medicos      | 1 : N |
| pacientes → citas             | 1 : N |
| medicos → citas               | 1 : N |

---

## 3. Estructura del Proyecto

```
medical-appointments/
├── package.json
├── .env.example
├── schema.sql
├── postman/
│   └── collection.json
└── src/
    ├── app.js
    ├── config/
    │   └── database.js
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── usuarios.controller.js
    │   ├── especialidades.controller.js
    │   ├── medicos.controller.js
    │   ├── pacientes.controller.js
    │   └── citas.controller.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── usuarios.routes.js
    │   ├── especialidades.routes.js
    │   ├── medicos.routes.js
    │   ├── pacientes.routes.js
    │   └── citas.routes.js
    ├── middlewares/
    │   ├── auth.middleware.js
    │   └── validate.middleware.js
    └── docs/
        └── openapi.yaml
```

---

## 4. Instalación y Configuración

### Requisitos previos
- Node.js 18+
- MySQL 8+

### Pasos

```bash
# 1. Clonar el proyecto
git clone <repositorio>
cd medical-appointments

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales MySQL

# 4. Crear la base de datos
mysql -u root -p < schema.sql

# 5. Iniciar el servidor
npm run dev
```

Servidor en: `http://localhost:3000`  
Swagger UI en: `http://localhost:3000/api/docs`

---

## 5. Endpoints de la API

### Autenticación (pública)
| Método | Ruta              | Descripción          |
|--------|-------------------|----------------------|
| POST   | /api/auth/register | Registro de usuario  |
| POST   | /api/auth/login    | Iniciar sesión (JWT) |
| GET    | /api/auth/me       | Perfil autenticado   |

### Usuarios (admin)
| Método | Ruta              | Descripción         |
|--------|-------------------|---------------------|
| GET    | /api/usuarios     | Listar              |
| GET    | /api/usuarios/:id | Obtener por ID      |
| POST   | /api/usuarios     | Crear               |
| PUT    | /api/usuarios/:id | Actualizar          |
| DELETE | /api/usuarios/:id | Eliminar            |

### Especialidades, Médicos, Pacientes, Citas
Cada entidad expone los mismos 5 endpoints CRUD bajo su prefijo correspondiente (`/api/especialidades`, `/api/medicos`, `/api/pacientes`, `/api/citas`).

---

## 6. Autenticación JWT

1. Hacer `POST /api/auth/login` con email y password.
2. Copiar el `token` del response.
3. En cada petición protegida incluir el header:
   ```
   Authorization: Bearer <token>
   ```

### Roles
| Rol      | Permisos                              |
|----------|---------------------------------------|
| admin    | Acceso total                          |
| medico   | CRUD citas, ver pacientes             |
| paciente | Ver y crear sus citas                 |

---

## 7. Ejemplos de Respuesta JSON

### Login exitoso
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": 1,
      "nombre": "Administrador",
      "email": "admin@medical.com",
      "rol": "admin"
    }
  }
}
```

### Cita creada
```json
{
  "success": true,
  "message": "Cita programada",
  "data": { "id": 5 }
}
```

### Error de validación (422)
```json
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    { "field": "email", "message": "Email inválido" },
    { "field": "password", "message": "Mínimo 6 caracteres" }
  ]
}
```

### No encontrado (404)
```json
{
  "success": false,
  "message": "Cita no encontrada"
}
```

---

## 8. Buenas Prácticas Aplicadas

- **Arquitectura MVC**: separación clara entre controladores, rutas y configuración.
- **RESTful**: verbos HTTP correctos, códigos de estado apropiados (200, 201, 401, 403, 404, 409, 422, 500).
- **Seguridad**: contraseñas con bcrypt (salt rounds = 10), tokens JWT con expiración.
- **Validación**: express-validator en todas las rutas de escritura.
- **Pool de conexiones**: mysql2 con pool para eficiencia.
- **Manejo de errores**: try/catch en todos los controladores.
- **Variables de entorno**: configuración sensible en `.env`.

---

## 9. Tecnologías Utilizadas

| Tecnología        | Versión  | Uso                          |
|-------------------|----------|------------------------------|
| Node.js           | 18+      | Runtime                      |
| Express.js        | 4.18     | Framework HTTP               |
| MySQL             | 8+       | Base de datos                |
| mysql2            | 3.6      | Driver MySQL con Promises     |
| jsonwebtoken      | 9.0      | Autenticación JWT            |
| bcryptjs          | 2.4      | Hash de contraseñas          |
| express-validator | 7.0      | Validación de entradas       |
| swagger-ui-express| 5.0      | Documentación interactiva    |
| dotenv            | 16.3     | Variables de entorno         |

---

*Proyecto Académico — Desarrollo de APIs RESTful Nicolas/Erick*
