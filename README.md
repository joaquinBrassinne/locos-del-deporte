# 🏆 CrazySports ("Locos del Deporte")

Plataforma integral (Web, Móvil y Backend) para la **centralización, visibilización y conexión de instituciones deportivas, clubes y deportistas destacados** de la ciudad de **Río Tercero (Córdoba, Argentina)** y su región.

---

## 📌 Tabla de Contenidos

- [Acerca del Proyecto](#-acerca-del-proyecto)
- [Características Principales](#-características-principales)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Estructura del Repositorio](#-estructura-del-repositorio)
- [Stack Tecnológico](#-stack-tecnológico)
- [Roles y Casos de Uso](#-roles-y-casos-de-uso)
- [Flujo de Registro y Aprobación](#-flujo-de-registro-y-aprobación)
- [Documentación de la API REST](#-documentación-de-la-api-rest)
- [Puesta en Marcha (Guía de Instalación)](#-puesta-en-marcha-guía-de-instalación)
  - [Prerrequisitos](#prerrequisitos)
  - [1. Base de Datos (Docker)](#1-base-de-datos-docker)
  - [2. Backend (Spring Boot)](#2-backend-spring-boot)
  - [3. Frontend Web (React + Vite)](#3-frontend-web-react--vite)
  - [4. Aplicación Móvil (React Native + Expo)](#4-aplicación-móvil-react-native--expo)
- [Credenciales de Acceso por Defecto](#-credenciales-de-acceso-por-defecto)
- [Documentación Adicional](#-documentación-adicional)

---

## 🎯 Acerca del Proyecto

**CrazySports** nace como respuesta a la necesidad de otorgar un espacio unificado y moderno a la vibrante comunidad deportiva local. Permite que clubes y atletas dispongan de una vitrina digital institucional para mostrar sus actividades, categorías, instalaciones, logros y datos de contacto, facilitando que los ciudadanos encuentren ofertas deportivas acordes a sus intereses y necesidades.

### Pilares Fundamentales:
- **Inclusión Total:** Fuerte enfoque en **Deportes Adaptados** para personas con discapacidades motrices o cognitivas, así como deportes mentales y estratégicos (ej. ajedrez).
- **Información Oficial y Actualizada:** Contenido gestionado y verificado mediante un flujo de revisión administrativa.
- **Geolocalización Inmediata:** Integración con mapas interactivos para ubicar sedes, canchas y predios en tiempo real.

---

## ✨ Características Principales

- 📰 **Muro Dinámico / Feed de Noticias:** Novedades, anuncios y actividades de las distintas instituciones deportivas.
- 🏢 **Directorio de Clubes:** Catálogo con perfiles institucionales completos, información de contacto, galerías de fotos, redes sociales y disciplinas.
- 🏃 **Catálogo de Atletas y Jugadores Destacados:** Biografías, trayectorias, categorías, estadísticas y material multimedia de deportistas locales.
- 🗺️ **Mapa Interactivo:** Visualización geográfica de sedes y predios con OpenStreetMap / Leaflet a partir de coordenadas GPS.
- 🔍 **Búsqueda Avanzada y Filtros:** Búsqueda en tiempo real por nombre, deporte/disciplina y filtro específico de deporte inclusivo o adaptado.
- 📝 **Sistema de Solicitudes Públicas:** Formulario para que nuevos clubes y deportistas soliciten su incorporación a la plataforma.
- 🛡️ **Panel de Administración (Backoffice):** Moderación de solicitudes (aprobar, observar o rechazar con motivo) y gestión de entidades.

---

## 🏗 Arquitectura del Sistema

El proyecto está diseñado bajo un modelo desacoplado con arquitectura cliente-servidor orientada a servicios REST:

```text
┌────────────────────────────────────────────────────────┐
│                        CLIENTES                        │
│  ┌─────────────────────────┐  ┌─────────────────────┐  │
│  │   🌐 Frontend Web       │  │   📱 App Móvil      │  │
│  │ React 19 + TS + Vite    │  │ React Native + Expo │  │
│  └────────────┬────────────┘  └──────────┬──────────┘  │
└───────────────┼──────────────────────────┼─────────────┘
                │   HTTP / JSON / CORS     │
                └────────────┬─────────────┘
                             ▼
┌────────────────────────────────────────────────────────┐
│                   SERVICIOS BACKEND                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │        ⚙️ Backend REST API (Spring Boot 4)        │  │
│  │   • Java 21 LTS           • Spring Web MVC       │  │
│  │   • Spring Security       • Jakarta Validation   │  │
│  │   • Springdoc OpenAPI     • Swagger UI           │  │
│  └──────────────────────────┬───────────────────────┘  │
└─────────────────────────────┼──────────────────────────┘
                              │   JPA / Hibernate (5432)
                              ▼
┌────────────────────────────────────────────────────────┐
│                      PERSISTENCIA                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │       🐘 PostgreSQL 16 (Docker Container)        │  │
│  │                  Base: locos_deporte             │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

---

## 📂 Estructura del Repositorio

El proyecto se organiza en una estructura monorepo que contiene todas las capas del ecosistema:

```
CrazySports/
├── Android/                    # Aplicación móvil (React Native & Expo SDK 57)
│   ├── assets/                 # Íconos e imágenes de la app móvil
│   ├── app.json                # Configuración de Expo y metadatos
│   ├── App.js / index.js       # Entrada de la app móvil
│   └── package.json            # Dependencias móviles
│
├── Backend/                    # Servidor REST API (Spring Boot 4 & Java 21)
│   ├── src/main/java/com/pp2/crazySports/
│   │   ├── config/             # Seguridad (SecurityConfig), CORS, OpenAPI, Admin Seed
│   │   ├── controller/         # Controladores REST (Club, Deportista, Solicitud, Admin)
│   │   ├── dto/                # Data Transfer Objects (Request/Response)
│   │   ├── exception/          # Manejadores globales de errores y excepciones
│   │   ├── model/              # Entidades JPA (Club, Deportista, Solicitud, Admin)
│   │   ├── repository/         # Interfaces Spring Data JPA
│   │   └── service/            # Lógica de negocio transaccional
│   ├── src/main/resources/     # application.properties (Conexión a BD y config)
│   ├── docker-compose.yml      # Despliegue del contenedor de PostgreSQL
│   └── pom.xml                 # Configuración de dependencias Maven
│
├── Frontend/                   # Cliente Web SPA (React 19 + TypeScript + Vite)
│   ├── public/                 # Recursos públicos y favicon
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ScrollToTop, modales, etc.
│   │   ├── pages/              # Vistas: Home, Clubes, Deportistas, Mapa, Buscar, Solicitud, Login, Admin
│   │   ├── services/           # Servicios HTTP y clientes Axios/Fetch
│   │   ├── types/              # Definiciones de tipos TypeScript e interfaces
│   │   ├── App.tsx             # Enrutamiento con React Router DOM
│   │   └── main.tsx            # Punto de entrada de la aplicación
│   ├── tailwind.config.js      # Configuración de diseño con Tailwind CSS
│   └── package.json            # Dependencias frontend (React, Leaflet, etc.)
│
├── Disenio/                    # Diagramas de modelado UML y arquitectura
│   ├── CasosDeUso/             # Diagramas de casos de uso (PlantUML)
│   ├── DiagramaDeActividad/    # Flujos de actividad
│   ├── DiagramaDeApi/          # Especificaciones visuales y diagramas de API
│   ├── DiagramaDeClases/       # Diagramas de clases de dominio
│   └── DiagramaDeSecuencias/   # Diagramas de interacción de secuencias
│
├── Especificaciones/           # Documentación funcional y de negocio
│   ├── Descripcion del proyecto.md
│   ├── Historias de usuario.md # HUs con criterios de aceptación
│   ├── Modelo de negocios.md
│   ├── Requerimientos Funcionales.md
│   └── Usuarios y Roles.md     # Perfiles y matriz de permisos
│
├── formulario.md               # Guía exhaustiva de payloads y validaciones de formularios
└── README.md                   # Documentación principal del proyecto
```

---

## 🛠 Stack Tecnológico

### Backend
- **Lenguaje:** Java 21 (LTS)
- **Framework:** Spring Boot 4.0.6
- **Módulos Spring:** Spring Web MVC, Spring Data JPA, Spring Security, Spring Validation
- **Base de Datos:** PostgreSQL 16
- **ORM:** Hibernate
- **Documentación de API:** Springdoc OpenAPI / Swagger UI 2.8.9
- **Gestor de Dependencias:** Maven (con Maven Wrapper `mvnw`)
- **Contenerización:** Docker & Docker Compose

### Frontend Web
- **Librería UI:** React 19
- **Lenguaje:** TypeScript 6
- **Empaquetador & Dev Server:** Vite 8
- **Enrutamiento:** React Router DOM 7
- **Estilos:** Tailwind CSS 3 & PostCSS
- **Mapas & Geolocalización:** Leaflet & React-Leaflet
- **Iconos:** React Icons (Feather / Lucide / FontAwesome)
- **Linter:** Oxlint

### Móvil
- **Framework:** React Native 0.86 & Expo SDK 57
- **Plataformas:** Android / iOS / Web

---

## 👥 Roles y Casos de Uso

| Rol | Permisos y Alcance | Principales Casos de Uso |
| :--- | :--- | :--- |
| **Visitante / Usuario Común** | Acceso público sin necesidad de credenciales previas | Consultar perfil de clubes, explorar mapa de sedes, buscar atletas, consultar eventos y enviar solicitudes de registro. |
| **Deportista** | Cuenta validada | Gestionar y actualizar biografía, fotos de perfil, categoría y logros deportivos. |
| **Representante de Club** | Cuenta institucional validada | Administrar ficha del club, predios, disciplinas ofrecidas, datos de contacto, enlaces y actividades. |
| **Administrador** | Control total de moderación y auditoría | Gestionar cola de solicitudes, aprobar altas (generando perfiles automáticamente), rechazar solicitudes con motivo, y auditar datos. |

---

## 🔄 Flujo de Registro y Aprobación

```text
┌─────────────────┐       1. POST /api/solicitudes (JSON)        ┌─────────────────┐
│                 │ ───────────────────────────────────────────► │                 │
│   Solicitante   │                                              │   Backend API   │
│  (Club/Atleta)  │ ◄─────────────────────────────────────────── │  (Spring Boot)  │
│                 │        201 Created (Estado: PENDIENTE)       └────────┬────────┘
└─────────────────┘                                                       │
                                                                 Guarda   │ (Estado PENDIENTE)
                                                                 en BD    ▼
                                                                 ┌─────────────────┐
                                                                 │   PostgreSQL    │
                                                                 └────────▲────────┘
                                                                          │
┌─────────────────┐       2. GET /api/solicitudes (Bandeja)               │ Crea Perfil
│                 │ ◄─────────────────────────────────────────── ┌────────┴────────┐
│  Administrador  │                                              │   Backend API   │
│                 │ ───────────────────────────────────────────► │  (Spring Boot)  │
└─────────────────┘       3. PATCH /api/solicitudes/{id}/aprobar └─────────────────┘
```

| Paso | Actor | Acción | Endpoint / Interacción | Resultado en el Sistema |
| :---: | :--- | :--- | :--- | :--- |
| **1** | Club o Deportista | Completa el formulario público en `/solicitud`. | `POST /api/solicitudes` | Se guarda la solicitud con estado **PENDIENTE**. |
| **2** | Administrador | Inicia sesión en `/login` y consulta la bandeja en `/admin`. | `GET /api/solicitudes?estado=PENDIENTE` | Se listan las solicitudes pendientes de moderación. |
| **3** | Administrador | Valida la información y aprueba la solicitud. | `PATCH /api/solicitudes/{id}/aprobar` | El backend crea automáticamente el perfil (`Club` o `Deportista`) y pasa a **APROBADO**. |
| **4** | Administrador | *(Alternativa)* Rechaza la solicitud indicando motivo. | `PATCH /api/solicitudes/{id}/rechazar?motivo=...` | El estado cambia a **RECHAZADO** con motivo registrado. |
| **5** | Plataforma | Publicación en el catálogo institucional. | Directorio público | La entidad queda activa y visible en `/clubes`, `/deportistas` y `/mapa`. |

---

## 📡 Documentación de la API REST

Cuando el backend se encuentra en ejecución, se puede acceder a la documentación interactiva Swagger:
- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON:** `http://localhost:8080/v3/api-docs`

### Resumen de Endpoints Principales

#### 1. Solicitudes de Registro (`/api/solicitudes`)
- `POST /api/solicitudes`: Envío público de formulario de registro (`CLUB` o `DEPORTISTA`).
- `GET /api/solicitudes`: Listado de solicitudes filtradas por estado (`PENDIENTE`, `APROBADO`, `RECHAZADO`). *(Requiere ADMIN)*
- `GET /api/solicitudes/{id}`: Detalle de una solicitud. *(Requiere ADMIN)*
- `PATCH /api/solicitudes/{id}/aprobar`: Aprueba la solicitud y genera automáticamente la entidad. *(Requiere ADMIN)*
- `PATCH /api/solicitudes/{id}/rechazar?motivo={...}`: Rechaza una solicitud con motivo. *(Requiere ADMIN)*

#### 2. Clubes (`/api/clubes`)
- `GET /api/clubes`: Listar todos los clubes registrados. *(Público)*
- `GET /api/clubes/{id}`: Obtener detalle completo de un club. *(Público)*
- `GET /api/clubes/buscar?nombre={nombre}`: Búsqueda de clubes por nombre. *(Público)*
- `GET /api/clubes/adaptado`: Listar únicamente clubes con oferta de deporte adaptado. *(Público)*
- `POST /api/clubes`: Crear manualmente un club. *(Requiere ADMIN)*
- `PUT /api/clubes/{id}`: Actualizar información de un club.
- `DELETE /api/clubes/{id}`: Eliminar registro de un club. *(Requiere ADMIN)*

#### 3. Deportistas (`/api/deportistas`)
- `GET /api/deportistas`: Listar todos los deportistas. *(Público)*
- `GET /api/deportistas/{id}`: Obtener perfil de un deportista por ID. *(Público)*
- `GET /api/deportistas/buscar?deporte={deporte}`: Búsqueda de deportistas por disciplina. *(Público)*
- `GET /api/deportistas/adaptado`: Listar deportistas de disciplinas adaptadas. *(Público)*
- `POST /api/deportistas`: Registrar deportista. *(Requiere ADMIN)*
- `PUT /api/deportistas/{id}`: Actualizar datos de deportista.
- `DELETE /api/deportistas/{id}`: Eliminar registro de deportista. *(Requiere ADMIN)*

#### 4. Administración Directa (`/api/admin`)
- `POST /api/admin/club/{id}`: Aprobación y alta directa de club.
- `POST /api/admin/deportista/{id}`: Aprobación y alta directa de deportista.
- `PUT /api/admin/rechazar/{id}/{motivo}`: Registro de rechazo explícito.

---

## 🚀 Puesta en Marcha (Guía de Instalación)

### Prerrequisitos
Asegúrate de contar con las siguientes herramientas instaladas en tu equipo:
- **Git**
- **Docker** y **Docker Compose**
- **Java JDK 21**
- **Node.js 20+** y **npm**
- (Opcional para Android) **Expo CLI** o **Expo Go** en tu dispositivo físico.

---

### 1. Base de Datos (Docker)

El backend cuenta con una configuración lista para ejecutar PostgreSQL mediante Docker Compose.

1. Abre una terminal y dirígete a la carpeta `Backend/`:
   ```bash
   cd Backend
   ```
2. Levanta el contenedor de PostgreSQL:
   ```bash
   docker compose up -d
   ```
3. Verifica que el contenedor esté corriendo en el puerto `5432`:
   ```bash
   docker ps
   ```

> **Datos de conexión configurados:**
> - **Host:** `localhost:5432`
> - **Base de datos:** `locos_deporte`
> - **Usuario:** `postgres`
> - **Contraseña:** `locos1234`

---

### 2. Backend (Spring Boot)

1. Estando en el directorio `Backend/`, compila y ejecuta la aplicación:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(En sistemas Windows utiliza `mvnw.cmd spring-boot:run`)*.
2. Al iniciar por primera vez, el componente `AdminCreado` sembrará automáticamente el usuario administrador en la base de datos si no existe.
3. El servidor quedará disponible en: `http://localhost:8080`.

---

### 3. Frontend Web (React + Vite)

1. Abre una nueva terminal y sitúate en la carpeta `Frontend/`:
   ```bash
   cd Frontend
   ```
2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre tu navegador en la URL indicada por Vite (habitualmente `http://localhost:5173`).

---

### 4. Aplicación Móvil (React Native + Expo)

1. En una nueva terminal, dirígete a la carpeta `Android/`:
   ```bash
   cd Android
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el entorno de desarrollo de Expo:
   ```bash
   npx expo start
   ```
4. Escanea el código QR desde la app **Expo Go** en tu teléfono Android/iOS o presiona `a` para abrir en un emulador Android previamente configurado.

---

## 🔑 Credenciales de Acceso por Defecto

Para acceder al panel de administración en el frontend (`/login` → `/admin`):

- **Usuario:** `AdminRoot`
- **Contraseña:** `locos1234`
- **Email:** `admin@crazysports.com`



---

## 📚 Documentación Adicional

En la raíz y carpetas anexas encontrarás documentación detallada:
- 📋 [formulario.md]: Guía y esquemas JSON para el envío de formularios de registro de Clubes y Deportistas.
- 📐 [Disenio/]: Diagramas UML de clases, secuencias, casos de uso y arquitectura de la API.
- 📑 [Especificaciones/]: Historias de usuario, requerimientos funcionales y especificación de roles.

---

## 👥 Equipo de Desarrollo

- **Joaquin Brassinne** [Linkedin](https://www.linkedin.com/in/joaquinbrassinne/)
- **Leonel Lopez** [Linkedin](AGREGUEN LINK ACA)
- **Damian Buscemi** [Linkedin](AGREGUEN LINK ACA)

Proyecto desarrollado para la cátedra de **Práctica Profesionalizante 2 (PP2)** - Tecnicatura Superior en Desarrollo de Software.
Rio Tercero, Córdoba, Argentina.




