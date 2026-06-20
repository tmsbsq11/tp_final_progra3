# Frontend Oficio

Interfaz web simple (HTML, CSS, JavaScript vanilla) para la API REST de Oficio.

## Requisitos

- Node.js (solo para el servidor de desarrollo con proxy)
- Backend Spring Boot corriendo en `http://localhost:8080`

## Cómo ejecutar

1. Levantá el backend desde la raíz del proyecto:

```bash
mvnw.cmd spring-boot:run
```

2. En otra terminal, levantá el frontend:

```bash
node frontend/server.js
```

3. Abrí en el navegador: **http://localhost:3000**

## Funcionalidades por rol

| Rol | Secciones |
|-----|-----------|
| **Cliente** | Buscar servicios (texto, categoría, zona), reservar (día + horario), ver/cancelar reservas enviadas, reseñas, perfil |
| **Trabajador** | Mis servicios, solicitudes de reserva (aceptar/rechazar), reseñas recibidas, perfil y ubicación |
| **Admin** | CRUD categorías, CRUD usuarios, gestión de servicios, certificación pendiente, reservas, notificaciones |

## Búsqueda de servicios

- Endpoint: `GET /api/servicios/buscar`
- Parámetros opcionales: `idCategoria`, `busqueda`, `lat`, `lng`, `radioKm`
- Si se ingresa una dirección, el frontend geocodifica vía Nominatim (proxy en `/geocode`) y envía `lat`/`lng` al backend

## Reservas

- Crear: `fechaReservada` (LocalDate), `horaInicio` y `horaFin` (LocalTime) del mismo día
- Cliente: `GET /api/servicio_reservas/enviadas/{estado}`, cancelar con `PATCH .../rechazar/{id}` (solo pendientes)
- Trabajador: `GET /api/servicio_reservas/recibidas/{estado}`, aceptar/rechazar con `PATCH .../aceptar|rechazar/{id}`

Los cambios automáticos de estado (finalizar/rechazar por fecha) los maneja el backend.

## Proxy local

El servidor en `server.js` reenvía:

- `/api/*` → backend `:8080`
- `/admin/*` → backend `:8080`
- `/geocode?q=...` → Nominatim (evita CORS y permite User-Agent)

## Limitaciones conocidas

- El registro público solo admite **Cliente** y **Trabajador**; los admins deben existir en la BD
- Si `GET /api/servicios/buscar` devuelve 403 para clientes, el frontend hace fallback a listar todos y filtrar en el navegador (sin filtro geográfico)
- La cancelación de reservas por cliente usa `PATCH /rechazar/{id}`; el backend debe permitir ese rol en esa ruta
