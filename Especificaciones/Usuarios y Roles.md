***PERFILES DE USUARIO Y ROLES DEL PROYECTO***

**1\. Actor: Usuario comun**

| ID | Caso de Uso | Precondiciones | Flujo Principal (Resumen) | Flujo Alternativo (Resumen) |
| :---- | :---- | :---- | :---- | :---- |
| **CU-01** | **Consultar Perfil de Club** | Ninguna (Acceso público). | 1\. Usuario ingresa al directorio. 2\. Selecciona un club. 3\. El sistema despliega historia, deportes y calendarios. | 3a. El club seleccionado no tiene información cargada. El sistema muestra un mensaje de "Información no disponible". |
| **CU-02** | **Búsqueda de Deportistas** | Ninguna. | 1\. Usuario ingresa criterios en el buscador. 2\. El sistema filtra la base de datos. 3\. Se muestra lista de resultados con nombre y ubicación. | 2a. No hay resultados que coincidan con los criterios. El sistema notifica al usuario que no se encontraron resultados. |
| **CU-03** | **Gestionar Interacciones** | Usuario debe haber iniciado sesión. | 1\. Usuario  solicita suscripción. 2\. El sistema valida el estado de la sesión. 3\. Se registra la interacción | 2a. La sesión del usuario ha caducado. El sistema redirige al login. |

**2\. Actor: Representante de Club**

| ID | Caso de Uso | Precondiciones | Flujo Principal (Resumen) | Flujo Alternativo (Resumen) |
| :---- | :---- | :---- | :---- | :---- |
| **CU-04** | **Gestionar Perfil Institucional** | Cuenta de Club activa y verificada. | 1\. Representante accede al panel de control. 2\. Edita texto de historia o sube fotos. 3\. Guarda cambios. | 3a. El formato de la foto subida es incorrecto. El sistema muestra un error y pide subir otro archivo. |
| **CU-05** | **Administrar Oferta Deportiva** | Sesión activa en el panel de Club. | 1\. Se selecciona "Añadir Deporte". 2\. Se completan campos (categorías, coach, requisitos). 3\. El sistema publica la oferta en el perfil público. | 2a. Faltan campos obligatorios por completar. El sistema resalta los campos faltantes y no permite el registro. |
| **CU-06(opcional)** | **Publicar Eventos y Resultados** | Perfil de Club completo. | 1\. Se crea evento en el calendario | 2a. no se pudo crear el evento, el sistema muestra un mensaje de error |

**3\. Actor: Deportista**

| ID | Caso de Uso | Precondiciones | Flujo Principal (Resumen) | Flujo Alternativo (Resumen) |
| :---- | :---- | :---- | :---- | :---- |
| **CU-07** | **Crear perfil** | Cuenta de Deportista creada. | 1\. Deportista accede a "Mi Perfil". 2\. Sube biografía y archivos multimedia | 2a. El archivo multimedia subido esta en un formato incorrecto. El sistema rechaza el archivo y notifica los formatos admitidos |
| **CU-08** | **Borrar perfil** | Cuenta de Deportista creada. | 1\.  el deportista accede al perfil. 2\. busca  publicación 3\. Selecciona el botón de borrar 4\. se borró la publicación | 4a. no se pudo borrar la publicacion, el sistema notifica el error y dice que lo intente nuevamente |
| **CU-09** | **Modificar perfil** | Cuenta de Deportista creada. | 1\.  el deportista accede al perfil. 2\. busca  publicación 3\. Selecciona el botón de editar 4\. el deportista modifica la publicación 5\. presiona el botón de guardar cambios 6\. se guardo la modificación | 5a. no se pudieron guardar los cambios por limite de tiempo, el sistema muestra un cartel que el tiempo de modificación es de x días |

**4\. Actor: Administrador**

| ID | Caso de Uso | Precondiciones | Flujo Principal (Resumen) | Flujo Alternativo (Resumen) |
| :---- | :---- | :---- | :---- | :---- |
| **CU-10** | **Registrar club** | Solicitudes de publicación pendientes. | 1\. Admin revisa la cola de pendientes. 2\. registra el club o jugador en el sistema 3\. el sistema genera un nombre de usuario y una contraseña  | 2a. no se pudo registrar el club o jugador, el sistema lanza un mensaje de que no se pudo registrar el club o jugador |
| **CU-11** | **Gestión de Usuarios** | Acceso al Panel Maestro. | 1\. Admin busca usuario por ID o correo. 2\. Ajusta permisos o aplica sanciones (ban/borrado). 3\. Sistema registra el log de la acción. | 2a. El Admin intenta modificar sus propios permisos. El sistema muestra una advertencia y no permite la auto-modificación de permisos de alto nivel. |
| **CU-12** | **Generar Reportes** | Datos de tráfico acumulados. | 1\. Admin selecciona periodo y tipo de métrica. 2\. Sistema procesa analíticas de visitas e interacciones. 3\. Se genera reporte | 2a. No hay datos disponibles para el periodo seleccionado. El sistema muestra un mensaje de "Sin datos para el rango". |

