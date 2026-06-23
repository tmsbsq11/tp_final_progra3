#  Oficios TP Final - Backend

Sistema de gestión de servicios y reservas de oficios desarrollado con Spring Boot, JWT y arquitectura REST.

OficiosYa es una plataforma web independiente destinada a facilitar la conexión entre clientes y trabajadores de distintos oficios. El sistema centraliza la búsqueda, contratación y gestión de solicitudes de servicios, proporcionando un entorno digital accesible para ambas partes.

Proyecto organizado para Programación 3.

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

##  Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/tmsbsq11/tp_final_progra3.git
cd tp_final_progra3
