# 📋 Guía de Datos para Formulario de Registro (CrazySports)

Este documento detalla los requerimientos, campos obligatorios, campos opcionales, formatos y ejemplos de payload necesarios para enviar una **Solicitud de Registro** tanto para **Clubes** como para **Deportistas**, así como el proceso para la posterior habilitación de acceso a la plataforma una vez aprobada la solicitud por un Administrador.

---

## 🔄 Flujo del Proceso de Registro e Ingreso

1. **Carga y Envío del Formulario:**  
   El solicitante (Representante del Club o Deportista) completa sus datos y los envía a través del endpoint público de solicitudes:
   - `POST /api/solicitudes`
   - Payload:
     ```json
     {
       "tipo": "CLUB" | "DEPORTISTA",
       "datosAdjuntos": "{ ...JSON con los datos del formulario... }"
     }
     ```
2. **Estado de la Solicitud:**  
   La solicitud queda en estado `PENDIENTE` en el panel de administración.
3. **Revisión del Administrador:**  
   El Administrador revisa el expediente en el panel `/admin`.
   - Si es **Aprobada**: Se crea automáticamente el perfil en la base de datos (`Club` o `Deportista`) y se generan/asignan las credenciales de acceso asociadas al correo y teléfono declarados.
   - Si es **Rechazada**: Se registra el motivo del rechazo para notificación.
4. **Ingreso a la Plataforma:**  
   Con la solicitud aprobada, el usuario puede acceder a su perfil o iniciar sesión con sus credenciales institucionales para gestionar su información.

---

## 🏛️ 1. Formulario de Registro para CLUBES

### 📌 Campos y Reglas de Validación

| Campo | Tipo | Obligatorio | Validación / Formato | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| **`nombreInstitucion`** | `String` | ✅ **Sí** | `@NotBlank`, no duplicado | Nombre oficial del club o institución deportiva. |
| **`direccion`** | `String` | ✅ **Sí** | `@NotBlank` | Dirección física de la sede o predio principal. |
| **`email`** | `String` | ⚠️ *Recomendado* | Formato email válido (`club@ejemplo.com`) | Correo de contacto institucional (usado para notificaciones y acceso). |
| **`telefono`** | `String` | ⚠️ *Recomendado* | Numérico o con código de área (ej: `+54 9 351 1234567`) | Teléfono de contacto / administración. |
| **`disciplinas`** | `String` | ⚪ No | Texto separado por comas (ej: `"Fútbol, Básquet, Natación"`) | Deportes y actividades brindadas por la institución. |
| **`coordenadas`** | `String` | ⚪ No | `"latitud,longitud"` (ej: `"-32.1712,-64.3450"`) | Coordenadas GPS para visualización en el **Mapa Interactivo (HU-07)**. |
| **`sitioWebUrl`** | `String` | ⚪ No | Formato URL (`https://...`) | Página web oficial o red social principal. |
| **`descripcion`** | `String` | ⚪ No | Texto libre | Reseña institucional, historia o valores del club. |
| **`horarios`** | `String` | ⚪ No | Texto libre (ej: `"Lunes a Viernes 8:00 - 22:00"`) | Horarios de atención y actividades. |
| **`deporteAdaptado`** | `Boolean` | ⚪ No | `true` o `false` (Default: `false`) | Indica si el club cuenta con infraestructura y programas para deporte adaptado e inclusivo. |
| **`fotos`** | `List<String>` | ⚪ No | Array de URLs válidas de imágenes | Galería fotográfica de instalaciones y actividades. |

---

### 📦 Ejemplo de JSON (`ClubRequestDTO`)
```json
{
  "nombreInstitucion": "Club Atlético Barrio Parque",
  "direccion": "Av. Córdoba 1234, Ciudad Deportiva",
  "email": "contacto@barrioparque.com",
  "telefono": "+54 9 351 555-4321",
  "disciplinas": "Básquet, Natación, Vóley, Gimnasia",
  "coordenadas": "-32.1712,-64.3450",
  "sitioWebUrl": "https://www.barrioparque.com",
  "descripcion": "Institución fundada en 1945 dedicada a la formación integral de atletas y la comunidad.",
  "horarios": "Lunes a Sábados de 07:00 a 23:00",
  "deporteAdaptado": true,
  "fotos": [
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48"
  ]
}
```

---

## 🏃 2. Formulario de Registro para DEPORTISTAS

### 📌 Campos y Reglas de Validación

| Campo | Tipo | Obligatorio | Validación / Formato | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| **`nombre`** | `String` | ✅ **Sí** | `@NotBlank` | Nombre y apellido completo del deportista. |
| **`deporte`** | `String` | ✅ **Sí** | `@NotBlank` | Disciplina principal en la que compite o practica. |
| **`edad`** | `Integer` | ✅ **Sí** | `@Min(value = 1)` | Edad actual (debe ser mayor a 0). |
| **`email`** | `String` | ⚠️ *Recomendado* | Formato email válido (`atleta@ejemplo.com`) | Correo personal del deportista o tutor. |
| **`telefono`** | `String` | ⚠️ *Recomendado* | Numérico o con código de área | Teléfono personal o de contacto de emergencia. |
| **`historia`** | `String` | ⚪ No | Texto libre (admite formato largo) | Trayectoria, orígenes, inicios en la disciplina. |
| **`logros`** | `String` | ⚪ No | Texto libre (admite formato largo) | Campeonatos, títulos, medallas, récords y reconocimientos. |
| **`clubId`** | `Long` | ⚪ No | ID numérico de un Club existente | Club al que pertenece actualmente (o `null` si es independiente). |
| **`deporteAdaptado`** | `Boolean` | ⚪ No | `true` o `false` (Default: `false`) | Indica si practica o compite en modalidad de deporte adaptado / paralímpico. |
| **`sitioWebUrl`** | `String` | ⚪ No | Formato URL (`https://...`) | Perfil de redes sociales (Instagram, LinkedIn, sitio personal). |
| **`fotos`** | `List<String>` | ⚪ No | Array de URLs válidas de imágenes | Fotos de competencia, entrenamientos o retrato del atleta. |

---

### 📦 Ejemplo de JSON (`DeportistaRequestDTO`)
```json
{
  "nombre": "Lucas Gabriel Martínez",
  "deporte": "Natación",
  "edad": 21,
  "email": "lucas.martinez@deporte.com",
  "telefono": "+54 9 351 777-8899",
  "historia": "Comenzó a nadar a los 6 años en la escuela municipal. Integra la selección provincial desde 2022.",
  "logros": "Medalla de Oro 100m Libre Nacional 2024, Récord Provincial 50m Mariposa 2025.",
  "clubId": 1,
  "deporteAdaptado": false,
  "sitioWebUrl": "https://instagram.com/lucasmartinez_swim",
  "fotos": [
    "https://images.unsplash.com/photo-1530549387789-4c1017266635"
  ]
}
```

---

## 🔑 3. Requisitos para el Ingreso una vez Aceptada la Solicitud

Una vez que el administrador hace clic en **Aprobar Solicitud** desde el panel:

1. **Email y Teléfono verificados:**  
   Son el canal principal para la entrega de confirmación y recuperación de credenciales.
2. **Nombre de Usuario y Contraseña:**  
   - El sistema vincula la cuenta de usuario con el perfil creado (`perfilCreadoId`).
   - El usuario podrá iniciar sesión en `/login` para acceder a su panel de gestión:
     - **Clubes:** Editar historia, horarios, fotos, oferta de disciplinas y publicar eventos.
     - **Deportistas:** Actualizar biografía, logros deportivos, club actual y multimedia.
3. **Visibilidad Pública Inmediata:**  
   - Los clubes aprobados se visualizan en `/clubes`, en `/mapa` (si tienen coordenadas) y en los filtros de deporte adaptado (`/adaptado`).
   - Los deportistas aprobados aparecen en `/deportistas`, en el buscador general `/buscar` y en la sección inclusiva.

---

## ✅ Checklist Rápido de Validación antes del Envío

- [ ] ¿El nombre de la institución o deportista no está vacío?
- [ ] ¿La dirección física (para clubes) está completa?
- [ ] ¿El correo electrónico y teléfono son válidos para recibir el acceso?
- [ ] ¿La edad del deportista es un número entero positivo mayor a 0?
- [ ] Si se especificaron coordenadas para el club, ¿tienen el formato `"lat,long"`? (Ej: `"-32.1712,-64.3450"`).
- [ ] Si se incluyeron fotos, ¿son enlaces URL válidos y accesibles?
- [ ] ¿Se especificó si aplica a la categoría de **Deporte Adaptado**?


## EJEMPLOS DE PETICION EN SWAGGER

```json 
{
  "tipo": "CLUB",
  "datosAdjuntos": "{\"nombreInstitucion\":\"Club Sportivo 9 de Julio\",\"direccion\":\"Av. San Martín 350, Río Tercero\",\"telefono\":\"03571-400000\",\"email\":\"club9@example.com\",\"disciplinas\":\"Básquet, Fútbol, Tenis, Gimnasia\",\"descripcion\":\"Institución social y deportiva emblemática de Río Tercero, con destacada trayectoria en básquet nacional y divisiones formativas.\",\"horarios\":\"Lunes a Sábado 08:00 - 22:00\",\"deporteAdaptado\":false,\"coordenadas\":\"-32.1735,-64.1155\",\"fotos\":[\"https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80\"]}"
}


{
  "tipo": "CLUB",
  "datosAdjuntos": "{\"nombreInstitucion\":\"Club Atlético Río Tercero\",\"direccion\":\"Int. Dellagiovanna 250, Río Tercero\",\"telefono\":\"03571-430000\",\"email\":\"cart@example.com\",\"disciplinas\":\"Fútbol, Bochas, Patín, Vóley\",\"descripcion\":\"Club decano de la ciudad, centrado en el desarrollo integral del fútbol infantil, juvenil y actividades sociales de la comunidad.\",\"horarios\":\"Lunes a Domingo 07:00 - 21:00\",\"deporteAdaptado\":false,\"coordenadas\":\"-32.1780,-64.1185\",\"fotos\":[\"https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80\"]}"
}

{
  "tipo": "CLUB",
  "datosAdjuntos": "{\"nombreInstitucion\":\"Polideportivo Municipal\",\"direccion\":\"Av. Gral Savio y Río Bamba, Río Tercero\",\"telefono\":\"03571-420000\",\"email\":\"polideportivo@riotercero.gob.ar\",\"disciplinas\":\"Pista Atletismo, Natatorio, Canchas, Atletismo\",\"descripcion\":\"Principal predio deportivo municipal dotado de pista de atletismo reglamentaria, natatorio olímpico climatizado y canchas multideporte.\",\"horarios\":\"Lunes a Domingo 06:00 - 22:00\",\"deporteAdaptado\":true,\"coordenadas\":\"-32.1685,-64.1195\",\"fotos\":[\"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80\"]}"
}

{
  "tipo": "DEPORTISTA",
  "datosAdjuntos": "{\"nombre\":\"Martina López\",\"deporte\":\"Natación\",\"edad\":21,\"historia\":\"Inició su camino en la natación a los 6 años en Río Tercero. Especializada en aguas abiertas y pruebas de fondo, ha representado a la provincia de Córdoba en múltiples competencias nacionales y regionales con destacados podios.\",\"logros\":\"• Campeona Provincial Aguas Abiertas 2022, 2023, 2024\\n• 3º puesto Campeonato Nacional Juvenil\",\"sitioWebUrl\":\"https://instagram.com/martinalopez.natacion\",\"deporteAdaptado\":false,\"fotos\":[\"https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80\"]}"
}


{
  "tipo": "DEPORTISTA",
  "datosAdjuntos": "{\"nombre\":\"Carlos Méndez\",\"deporte\":\"Boxeo\",\"edad\":23,\"historia\":\"Comenzó su entrenamiento de boxeo a los 14 años en el gimnasio barrial del sur de la ciudad. Con disciplina y constancia, se consagró campeón provincial en la categoría welter y sueña con dar el salto al profesionalismo.\",\"logros\":\"• Campeón Regional Amateur 2023\\n• Mejor peleador juvenil de Córdoba 2022\",\"sitioWebUrl\":\"https://instagram.com/carlosmendez_box\",\"deporteAdaptado\":false,\"fotos\":[\"https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80\"]}"
}


{
  "tipo": "DEPORTISTA",
  "datosAdjuntos": "{\"nombre\":\"Lucía Fernández\",\"deporte\":\"Atletismo\",\"edad\":20,\"historia\":\"Velocista destacada en pruebas de 100 y 200 metros llanos. Entrena a diario en la pista municipal de atletismo y es una de las grandes promesas del deporte cordobés con proyección internacional.\",\"logros\":\"• Récord Provincial 100m (11.85s)\\n• Medalla de oro Juegos Evita 2023\",\"sitioWebUrl\":\"https://instagram.com/luciafernandez.run\",\"deporteAdaptado\":false,\"fotos\":[\"https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=800&q=80\"]}"
}

{
  "tipo": "DEPORTISTA",
  "datosAdjuntos": "{\"nombre\":\"Diego Ramírez\",\"deporte\":\"Ciclismo\",\"edad\":26,\"historia\":\"Apasionado por las dos ruedas desde su infancia, compite tanto en circuitos de ruta como en demandantes carreras de mountain bike por las sierras de Córdoba, acumulando múltiples triunfos en la categoría elite.\",\"logros\":\"• 2º puesto Vuelta de Río Tercero 2021\\n• Campeón MTB categoría elite regional\",\"sitioWebUrl\":\"https://instagram.com/diegoramirez.bike\",\"deporteAdaptado\":false,\"fotos\":[\"https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80\"]}"
}

{
  "tipo": "DEPORTISTA",
  "datosAdjuntos": "{\"nombre\":\"Ana Torres\",\"deporte\":\"Vóley\",\"edad\":19,\"historia\":\"Jugadora clave en su club y capitana de la selección juvenil provincial. Su altura, potencia en el remate y visión táctica la posicionan como una referente de la disciplina en la región.\",\"logros\":\"• Selección Provincial Juvenil 2023-2024\\n• MVP Torneo Regional Sub-18\",\"sitioWebUrl\":\"https://instagram.com/anatorres.voley\",\"deporteAdaptado\":false,\"fotos\":[\"https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80\"]}"
}


{
  "tipo": "DEPORTISTA",
  "datosAdjuntos": "{\"nombre\":\"Tomás Aguirre\",\"deporte\":\"Rugby\",\"edad\":24,\"historia\":\"Líder nato dentro y fuera de la cancha, Tomás defiende los colores del rugby local desde las categorías infantiles, transmitiendo los valores de respeto, camaradería y esfuerzo.\",\"logros\":\"• Capitán Tortugas Rugby Club\\n• Seleccionado Unión Cordobesa de Rugby\",\"sitioWebUrl\":\"https://instagram.com/tomasaguirre.rugby\",\"deporteAdaptado\":false,\"fotos\":[\"https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80\"]}"
}

{
  "tipo": "DEPORTISTA",
  "datosAdjuntos": "{\"nombre\":\"Facundo Arregui\",\"deporte\":\"Paranatación\",\"edad\":27,\"historia\":\"Ejemplo de resiliencia y superación continua. Ha llevado la bandera argentina a los podios más importantes del deporte adaptado mundial, inspirando a cientos de jóvenes con discapacidad a sumarse a la práctica deportiva.\",\"logros\":\"• Medallista Parapanamericano Santiago 2023\\n• Representante Selección Nacional en París 2024\",\"sitioWebUrl\":\"https://instagram.com/facundoarregui.para\",\"deporteAdaptado\":true,\"fotos\":[\"https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=800&q=80\"]}"
}


---