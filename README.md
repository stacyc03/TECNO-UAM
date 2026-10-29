# TecnoUAM - Sistema de Préstamo de Equipos

**Integrantes:**
- Stacy Cerda
- Rodrigo Paniagua
- Fernando González

## Descripción del proyecto

TecnoUAM es una aplicación web desarrollada para gestionar el inventario y los préstamos de equipos tecnológicos del Centro de Capacitación TecnoUAM.

El sistema permite registrar y administrar computadoras portátiles, proyectores y tabletas, consultar su disponibilidad, gestionar préstamos y devoluciones, y controlar las operaciones según los permisos de cada usuario.

La solución utiliza una arquitectura cliente-servidor, con una API REST desarrollada en Spring Boot y una interfaz web construida con React.

## Tecnologías utilizadas

| Componente | Tecnologías |
|---|---|
| Backend | Java 21, Spring Boot 3.3.5, Spring Data JPA, Spring Security |
| Autenticación | JSON Web Token (JWT) |
| Frontend | React, Vite, Axios, JavaScript y CSS |
| Base de datos | H2 Database con persistencia local |
| Gestión de dependencias | Maven y npm |
| Pruebas | Postman |

## Estructura del proyecto

```text
TECNO-UAM/
├── backend/
│   ├── src/main/java/edu/uam/prestamos/
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── data.sql
│   └── pom.xml
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── postman/
├── pruebas/
├── README.md
├── .env.example
└── .gitignore
```

- **backend:** Implementación de la API REST, entidades, repositorios, lógica de negocio y seguridad.
- **frontend:** Interfaz web para consultar y administrar equipos y préstamos.
- **postman:** Colección de solicitudes para verificar los endpoints.
- **pruebas:** Capturas de las pruebas funcionales realizadas.

## Instalación y ejecución

### 1. Backend - Spring Boot

**Requisitos:** JDK 21 y Maven (o Maven Wrapper).

1. Abrir la carpeta `backend` en IntelliJ IDEA.
2. Cargar las dependencias del archivo `pom.xml`.
3. Configurar las variables de entorno:

| Variable | Descripción |
|---|---|
| `JWT_SECRET` | Clave de al menos 32 bytes para firmar los tokens JWT |
| `ADMIN_PASSWORD` | Contraseña de la cuenta ADMIN |
| `USER_PASSWORD` | Contraseña de la cuenta USER |

4. Ejecutar la clase `PrestamosApplication`.

El backend estará disponible en:

`http://localhost:8080`

**Base de datos:** El proyecto utiliza H2 con persistencia local. Hibernate genera y actualiza las tablas automáticamente y el archivo `data.sql` carga equipos de demostración al iniciar la aplicación, sin duplicar los registros existentes.

No es necesario instalar ni configurar PostgreSQL.

### 2. Frontend - React

**Requisitos:** Node.js y npm.

Abrir una terminal dentro de la carpeta `frontend` y ejecutar:

```bash
npm install
npm run dev
```

Ingresar desde el navegador a:

`http://localhost:5173`

El backend debe permanecer en ejecución para que la interfaz pueda acceder a la API.

## Funcionalidades principales

### Gestión de equipos
- Registro, consulta, actualización y eliminación de equipos.
- Código patrimonial único por equipo.
- Control de estados: `DISPONIBLE` y `PRESTADO`.
- Búsqueda, filtrado y visualización del inventario.

### Gestión de préstamos
- Registro de préstamos asociados a un equipo y solicitante.
- Validación de fechas y campos obligatorios.
- Prevención de préstamos simultáneos de un mismo equipo.
- Registro de devoluciones y actualización automática de disponibilidad.
- Restricción de eliminación de equipos con préstamos activos.

### Interfaz web
- Inicio de sesión mediante JWT.
- Panel de inventario con indicadores de equipos registrados, disponibles y prestados.
- Consulta de información real desde la API.
- Operaciones administrativas según el rol del usuario.
- Manejo de estados de carga, errores y listas vacías.

## Seguridad y control de acceso

La autenticación y autorización se implementan mediante Spring Security y JWT.

| Funcionalidad | ADMIN | USER |
|---|---|---|
| Consultar equipos y préstamos | Sí | Sí |
| Registrar y actualizar equipos | Sí | No |
| Eliminar equipos | Sí | No |
| Registrar préstamos | Sí | No |
| Registrar devoluciones | Sí | No |

Las contraseñas y la clave JWT se configuran mediante variables de entorno, evitando almacenarlas directamente en el código fuente.

Las cuentas de prueba son `admin` y `user`, utilizando las contraseñas configuradas al iniciar el backend.

## Endpoints de la API REST

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Autenticar usuario y generar JWT |
| GET | `/api/equipos` | Consultar todos los equipos |
| GET | `/api/equipos/{id}` | Consultar un equipo |
| POST | `/api/equipos` | Registrar equipo |
| PUT | `/api/equipos/{id}` | Actualizar equipo |
| DELETE | `/api/equipos/{id}` | Eliminar equipo permitido |
| GET | `/api/prestamos` | Consultar préstamos |
| POST | `/api/prestamos` | Registrar préstamo |
| PUT | `/api/prestamos/{id}/devolver` | Registrar devolución |

Los endpoints protegidos requieren un token válido mediante el encabezado `Authorization: Bearer <token>`.

## Pruebas funcionales

Las pruebas se realizan mediante Postman para verificar el funcionamiento de la API y el cumplimiento de las reglas de negocio.

| Código HTTP | Resultado |
|---|---|
| 200 OK | Consulta, actualización o devolución exitosa |
| 201 Created | Registro creado correctamente |
| 204 No Content | Eliminación permitida |
| 400 Bad Request | Datos inválidos |
| 401 Unauthorized | Solicitud sin autenticación válida |
| 403 Forbidden | Operación restringida por el rol |
| 404 Not Found | Recurso inexistente |
| 409 Conflict | Conflicto con las reglas de negocio |

La colección de solicitudes se encuentra en la carpeta `postman`. Para ejecutarla, se deben configurar las credenciales de prueba y obtener los tokens correspondientes.

## Integración entre frontend y backend

React utiliza Axios para comunicarse con la API REST de Spring Boot. Las solicitudes protegidas incluyen el token JWT obtenido durante la autenticación.

Los registros se almacenan en H2 y se consultan desde la interfaz, permitiendo visualizar los cambios realizados al registrar, actualizar, prestar o devolver equipos.

La aplicación mantiene separadas las responsabilidades del frontend, la lógica de negocio y la persistencia de datos.
