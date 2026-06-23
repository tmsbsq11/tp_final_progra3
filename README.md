#  Oficios TP Final 

Sistema de gestión de servicios y reservas de oficios desarrollado con Spring Boot, JWT y arquitectura REST.

OficiosYa es una plataforma web independiente destinada a facilitar la conexión entre clientes y trabajadores de distintos oficios. El sistema centraliza la búsqueda, contratación y gestión de solicitudes de servicios, proporcionando un entorno digital accesible para ambas partes.

Proyecto organizado para Programación 3.

---

##  Integrantes del grupo

- Julian Anchoverri
- Tomas Corrado Busquets
- Pedro Gabriel Fernandez Raya

---

##  Tecnologías utilizadas

### Backend
- Java 17+
- Spring Boot
- Spring Security + JWT
- JPA / Hibernate
- Maven
- MySQL / PostgreSQL
- Railway

### Frontend
- Node.js
- JavaScript
- CSS
- HTML
---

##  Funcionalidades principales

- Registro y login de usuarios
- Gestión de servicios
- Solicitud y aprobación de reservas
- Notificaciones automáticas

---
### Estructura general del proyecto
El proyecto sigue una arquitectura en capas basada en Spring Boot, organizada por dominio.

```text
com.grupo3.oficio
│
├── controller //Endpoints REST
│   └── (REST Controllers)
│
├── model //Entidades JPA y DTOs
│   ├── reseñas
│   ├── reservas
│   ├── trabajos
│   ├── users
│   ├── Categoria
│   ├── Notificacion
│   └── NotificacionDTO
│
├── repository //Interaccion con la bdd
│   ├── users
│   ├── servicio
│   ├── reservas
│   ├── CategoriaRepository
│   ├── NotificacionRepository
│   └── ReseniaRepository
│
├── service //Logica de negocio de la app
│   ├── users
│   ├── servicio
│   ├── reservas
│   ├── CategoriaService
│   ├── EmailService
│   ├── NotificacionService
│   └── ReseniaService
│
├── utils
│   ├── auth //Auth Controller, JWT Filter y service ,y Security Config
│   ├── enums
│   ├── geo //GeocodingService y GeoUtils
│   └── exceps
│
└── OficioApplication.java
```
---
###  Usuarios

- Clientes, trabajadores y administradores
- Autenticación con JWT
- Roles: `CLIENTE`, `TRABAJADOR`, `ADMIN`

---

###  Servicios

- Publicación de servicios por trabajadores
- Búsqueda de servicios disponibles

---

###  Reservas

- Creación de reservas por clientes
- Estados: `PENDIENTE`, `APROBADO`, `RECHAZADO`, `CANCELADO`
- Gestión de aprobación por trabajadores

---

###  Notificaciones

- Notificación automática por cambios de estado en reservas
- Notificación automática por creacion de resenias hacia tu perfil
  
---

##  Seguridad

Autenticación basada en JWT con control de acceso por roles.

### Accesos por endpoint:

- `/api/auth/**` → público
- `/api/clientes/**` → CLIENTE / ADMIN
- `/api/trabajadores/**` → TRABAJADOR / ADMIN
- `/api/servicios/**` → TRABAJADOR / ADMIN
- `/api/reservas/**` → CLIENTE / TRABAJADOR (según operación)

---
## Limitaciones del proyecto

Teniamos la intencion de agregar una api mail y una api para verificar DNI pero por problemas tecnicos solo quedo la estructura de la api mail para notificaciones

---
### Enlaces al despliegue
Frontend - https://front-tpfp3.vercel.app/
Backend - https://spring-boot-backend-production-ebe2.up.railway.app/
---
### Configuracion necesaria
---
##  Instalación y ejecución

---
### 1. Clonar el repositorio

```bash
git clone https://github.com/tmsbsq11/tp_final_progra3.git
cd tp_final_progra3
```
### 2. Configurar la base de datos

### 3. Variables de Entorno
### Ejemplos de requests y responses
---

### Usuarios de prueba
---
### Enlace presentacion oral
---
