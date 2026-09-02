# **Historias de Usuario**

A continuación, se presenta una lista detallada de Historias de Usuario (HU) basadas en las especificaciones funcionales descritas para describir las funcionalidades del sistema.

## Autenticación y Gestión de Usuarios

### **HU-01: Gestión de Acceso del Administrador**

Como **Administrador del Software**,  
necesito **un formulario de *login* con credenciales preestablecidas (usuario y contraseña)**,  
para poder **acceder al panel de gestión y administrar los registros de clubes y jugadores**,  
asegurando el control centralizado de la plataforma.

**Criterios de Aceptación:**

* El sistema debe permitir el acceso solo con el usuario y contraseña del administrador ya configurados internamente.  
* Al ingresar las credenciales correctas, el administrador es redirigido al panel de control.  
* En caso de credenciales incorrectas, se muestra un mensaje de error sin revelar detalles de la cuenta.

### **HU-02: Acceso de Jugadores Registrados**

Como **Jugador registrado**,  
necesito **un formulario de *login* que solicite usuario y contraseña**,  
para poder **acceder a mi perfil dentro de la plataforma**,  
ya que mis credenciales serán proporcionadas previamente por el Administrador.

**Criterios de Aceptación:**

* El sistema debe validar el usuario y contraseña proporcionados por el jugador.  
* El acceso debe otorgarse únicamente si el par de credenciales es válido y fue registrado por el administrador.  
* Tras un *login* exitoso, el jugador debe ser dirigido a su área personal o perfil.

### **HU-03: Acceso de Usuarios Comunes**

Como **Usuario Común registrado**,  
necesito **un formulario de *login* que solicite usuario y contraseña**,  
para poder **acceder a mi perfil y funcionalidades específicas de usuario dentro del sitio**.

**Criterios de Aceptación:**

* El sistema debe permitir la autenticación de usuarios comunes a través de sus credenciales.  
* El *login* debe ser distinto al de administradores y jugadores (en términos de roles).  
* El acceso exitoso dirige al usuario a su panel de usuario o página de inicio personalizada.

### **HU-04: Solicitud de Registro para Clubes y Jugadores**

Como **Club o Jugador interesado en formar parte de la plataforma**,  
necesito **un formulario de registro que me permita enviar mis datos al Administrador**,  
para poder **iniciar el proceso de verificación de veracidad y obtener mi registro oficial**.

**Criterios de Aceptación:**

* El formulario debe capturar todos los datos necesarios para la identificación del club o jugador.  
* La información enviada debe ser notificada o almacenada para la revisión del Administrador.  
* El sistema debe mostrar un mensaje de confirmación de envío de datos al solicitante.

### **HU-05: Registro de Usuario Común**

Como **Visitante del sitio**,  
necesito **un formulario de registro simple para crear un perfil**,  
para poder **convertirme en Usuario Común y tener acceso a funcionalidades como guardar favoritos o recibir notificaciones**.

**Criterios de Aceptación:**

* El formulario debe solicitar datos esenciales (ej: nombre, email, contraseña).  
* Tras completar el registro, se crea un perfil de Usuario Común.  
* El sistema puede requerir una verificación de email para completar la cuenta (opcional, pero recomendado).

## Visualización y Exploración de Contenido

### **HU-06: Visualización de Perfiles de Clubes y Jugadores**

Como **Visitante o Usuario del sitio**,  
necesito **ver la información completa y las fotos publicadas por cada Club o Jugador**,  
para poder **conocer sus detalles, ofertas o logros**.

**Criterios de Aceptación:**

* Debe existir una página de perfil dedicada para cada club/jugador.  
* Esta página debe mostrar la información básica proporcionada por la entidad (descripción, contacto, etc.).  
* Se deben visualizar correctamente las imágenes y galerías de fotos cargadas.

### **HU-07: Localización de Clubes Mediante Mapa**

Como **Visitante o Usuario del sitio**,  
necesito **ver la ubicación exacta de un Club en un mapa interactivo (Google Maps o similar)**,  
para poder **saber cómo llegar físicamente al lugar**.

**Criterios de Aceptación:**

* La página de información del club debe integrar un servicio de mapas.  
* El mapa debe mostrar la ubicación del club marcada con un pin o indicador.  
* El usuario debe poder interactuar con el mapa (zoom, desplazamiento).

### **HU-08: Redireccionamiento a Sitio Web del Club (Opción)**

Como **Visitante o Usuario del sitio** y **Club con sitio web propio**,  
necesito **un botón de "Más información" en el perfil del club que me redirija a su página web externa**,  
para poder **acceder a inscripciones o detalles más profundos ofrecidos directamente por el club**,  
siempre y cuando el club haya habilitado esta opción.

**Criterios de Aceptación:**

* El perfil del club debe tener un campo opcional para agregar una URL de sitio web.  
* Si la URL está presente y la opción está activa, se muestra el botón.  
* Al hacer clic, el usuario es dirigido a la URL externa en una nueva pestaña.

### **HU-09: Búsqueda y Filtrado de Contenido Principal**

Como **Visitante o Usuario del sitio**,  
necesito **un buscador principal que me permita filtrar o buscar clubes o jugadores específicos por nombre u otros criterios**,  
para poder **encontrar rápidamente la información que me interesa**.

**Criterios de Aceptación:**

* El buscador debe estar prominentemente ubicado.  
* Debe permitir la búsqueda por texto libre (nombre del club/jugador, deporte, ubicación, etc.).  
* Los resultados deben mostrar una lista filtrada de clubes o jugadores relevantes.

## Funcionalidad Adicional (Opcional)

### **HU-10: Visualización de Agenda de Eventos (Opcional)**

Como **Visitante o Usuario del sitio**,  
necesito **acceder a una agenda centralizada donde pueda ver los eventos que cada club haya agregado, incluyendo fecha y hora**,  
para poder **estar al tanto de torneos, partidos o actividades programadas en la plataforma**.

**Criterios de Aceptación:**

* Debe haber una sección dedicada a la "Agenda de Eventos".  
* Cada evento listado debe mostrar claramente el nombre del club organizador, la fecha y la hora.  
* Debe haber una forma clara de añadir y gestionar estos eventos por parte del Administrador o de los Clubes (según la definición del rol).

