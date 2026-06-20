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

## Estructura

```
frontend/
├── index.html       # SPA única
├── css/styles.css   # Estilos
├── js/              # Lógica de la aplicación
├── server.js        # Servidor estático + proxy a :8080
└── README.md
```

El proxy evita problemas de CORS con endpoints que no tienen `@CrossOrigin` en el backend (`/api/auth/**`, `/api/servicios/**`).

## Roles y funcionalidades

| Rol | Secciones |
|-----|-----------|
| **Cliente** | Catálogo de servicios, reservas, reseñas, perfil |
| **Trabajador** | Mis servicios (CRUD), perfil, ubicación |
| **Admin** | Categorías, validación de servicios, reservas, notificaciones, usuarios |

El registro público solo permite crear cuentas **Cliente** o **Trabajador**. Los administradores deben existir previamente en la base de datos.

## Autenticación

- Login: `POST /api/auth/login` → devuelve JWT
- El token se guarda en `sessionStorage`
- Tras el login se detecta el rol consultando el perfil correspondiente

## Limitaciones conocidas (backend)

Estas limitaciones vienen del API actual y no se modifican desde el frontend:

- **Trabajador no puede listar reservas** — `/api/servicio_reservas/**` solo admite roles CLIENTE y ADMIN
- **No hay endpoint "mis reservas"** — el cliente filtra por estado y muestra las reservas cuyo `cliente.id` coincide
- **Admin no se registra** desde la UI
- Algunos `@PreAuthorize("hasRol(...)")` tienen un typo y pueden no aplicarse; la seguridad efectiva está en `SecurityConfig`

## Verificación rápida

1. Registrarse como cliente → login → ver servicios → crear reserva
2. Registrarse como trabajador → login → publicar servicio → editar perfil/ubicación
3. Login como admin → gestionar categorías → validar servicios pendientes
