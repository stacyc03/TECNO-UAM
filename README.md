\# TecnoUAM - Sistema de Préstamo de Equipos Tecnológicos



\*\*Universidad:\*\* Universidad Americana (UAM)  

\*\*Carrera:\*\* Ingeniería de Sistemas  

\*\*Asignatura:\*\* Servicios Web



\*\*Integrantes:\*\*

\- Stacy Cerda

\- Rodrigo Paniagua

\- Fernando González



\## Descripción del proyecto



Sistema web desarrollado para el Centro de Capacitación TecnoUAM, que permite administrar el inventario y los préstamos de equipos tecnológicos, como computadoras portátiles, proyectores y tabletas.



La aplicación permite registrar equipos, gestionar préstamos y devoluciones, consultar su disponibilidad y controlar el acceso mediante roles de usuario.



\## Tecnologías utilizadas



\*\*Backend:\*\*

\- Java 21 y Spring Boot 3.3.5

\- Spring Data JPA y Spring Security

\- JWT para autenticación

\- Maven



\*\*Frontend:\*\*

\- React con Vite

\- Axios

\- JavaScript y CSS



\*\*Base de datos:\*\* H2 con persistencia local.



\## Estructura del proyecto



\- `backend/`: API REST, lógica de negocio, persistencia y seguridad.

\- `frontend/`: Interfaz web desarrollada en React.

\- `postman/`: Colección de pruebas de la API.

\- `sql/`: Script SQL de demostración.



\## Instalación y ejecución



\### Backend



1\. Abrir la carpeta `backend` en IntelliJ IDEA.

2\. Cargar las dependencias de Maven.

3\. Configurar las siguientes variables de entorno:



| Variable | Descripción |

|---|---|

| `JWT\_SECRET` | Clave de al menos 32 bytes para firmar los tokens. |

| `ADMIN\_PASSWORD` | Contraseña del administrador. |

| `USER\_PASSWORD` | Contraseña del usuario de consulta. |



4\. Ejecutar la clase `PrestamosApplication`.



El servidor estará disponible en `http://localhost:8080`.



La base de datos H2 se configura automáticamente mediante Spring Data JPA y Hibernate.



\### Frontend



Abrir una terminal dentro de la carpeta `frontend` y ejecutar:



```bash

npm install

npm run dev

```



Acceder desde el navegador a `http://localhost:5173`.



El backend debe estar en ejecución para que la interfaz pueda consultar los datos.



\## Funcionalidades principales



\- Registro, consulta, actualización y eliminación de equipos.

\- Control de disponibilidad mediante los estados DISPONIBLE y PRESTADO.

\- Registro de préstamos y devoluciones.

\- Validación de fechas y campos obligatorios.

\- Restricción de préstamos simultáneos sobre un mismo equipo.

\- Autenticación mediante JWT.

\- Autorización mediante roles ADMIN y USER.

\- Visualización de equipos, búsqueda y filtros desde React.



\## Seguridad y roles



El sistema utiliza Spring Security y JWT para proteger los endpoints.



\- \*\*ADMIN:\*\* Puede consultar y administrar equipos, registrar préstamos y gestionar devoluciones.

\- \*\*USER:\*\* Tiene acceso únicamente a las consultas de equipos y préstamos.



Las contraseñas y la clave JWT se configuran mediante variables de entorno y no se almacenan en el código fuente.



\## Endpoints de la API



| Método | Endpoint | Función |

|---|---|---|

| POST | `/api/auth/login` | Iniciar sesión |

| GET | `/api/equipos` | Listar equipos |

| GET | `/api/equipos/{id}` | Consultar equipo |

| POST | `/api/equipos` | Registrar equipo |

| PUT | `/api/equipos/{id}` | Actualizar equipo |

| DELETE | `/api/equipos/{id}` | Eliminar equipo |

| GET | `/api/prestamos` | Listar préstamos |

| POST | `/api/prestamos` | Registrar préstamo |

| PUT | `/api/prestamos/{id}/devolver` | Registrar devolución |



\## Pruebas con Postman



El proyecto incluye una colección Postman para comprobar las operaciones de la API, la autenticación y las reglas de negocio.



| Código HTTP | Significado |

|---|---|

| 200 | Consulta o actualización correcta |

| 201 | Registro creado |

| 204 | Eliminación correcta |

| 400 | Datos inválidos |

| 401 | Usuario no autenticado |

| 403 | Operación no permitida para el rol |

| 404 | Recurso no encontrado |

| 409 | Conflicto con las reglas de negocio |



\## Integración del sistema



React consume la API REST mediante Axios, utilizando tokens JWT para las solicitudes protegidas. Los equipos mostrados provienen de la base de datos H2 y sus estados se actualizan al registrar préstamos o devoluciones.



La interfaz permite visualizar los equipos registrados, consultar su disponibilidad, realizar búsquedas y actualizar la información obtenida del servidor.

