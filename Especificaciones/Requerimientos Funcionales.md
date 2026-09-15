# Requerimientos Funcionales del Sistema

A continuación, se detallan las especificaciones funcionales que el sistema debe cumplir. Estos requerimientos definen lo que el software debe hacer para satisfacer las necesidades de los distintos tipos de usuarios (Administrador, Club/Jugador registrado, y Usuario común).

# 1\. Gestión de Acceso y Autenticación

## 1.1 Acceso de Administrador (Login Admin)

El sistema debe permitir el inicio de sesión exclusivo para el Administrador o Administradores del software mediante credenciales preestablecidas.

* **Propósito:** Asegurar la gestión y el control de los procesos de registro y verificación de clubes y jugadores.  
* **Detalle:** El software contará con un usuario y contraseña fijos para el acceso administrativo.

## 1.2 Acceso de Jugadores Registrados (Login para Jugadores)

El sistema debe permitir que los jugadores registrados inicien sesión utilizando credenciales únicas proporcionadas previamente por el Administrador.

* **Propósito:** Otorgar acceso personalizado a la plataforma a los jugadores validados.  
* **Detalle:** Se solicitará al jugador su usuario y contraseña. El proceso de registro y asignación de credenciales es responsabilidad del Administrador.

## 1.3 Acceso de Usuarios Comunes (Login para Usuario)

El sistema debe permitir que los usuarios comunes inicien sesión utilizando sus credenciales personales.

* **Propósito:** Permitir el acceso a un perfil personalizado y a funcionalidades específicas para usuarios que no son clubes ni jugadores registrados por la administración.  
* **Detalle:** Se requerirá el usuario y la contraseña establecidos por el usuario durante su proceso de registro.

# 2\. Proceso de Registro

## 2.1 Solicitud de Registro de Club o Jugador

El sistema debe ofrecer una funcionalidad para que una entidad (Club o Jugador) envíe una solicitud de registro formal al Administrador.

* **Propósito:** Recolectar la información necesaria para iniciar el proceso de validación e incorporación de nuevos clubes o jugadores a la plataforma.  
* **Detalle:** El solicitante deberá ingresar sus datos, los cuales serán enviados al Administrador para su revisión y verificación de autenticidad antes de la aprobación y registro definitivo.

## 2.2 Registro de Usuario Común

El sistema debe permitir a los usuarios comunes registrarse en la plataforma para crear un perfil personal.

* **Propósito:** Permitir a cualquier visitante establecer una cuenta para acceder a funcionalidades de usuario.  
* **Detalle:** Se solicitarán los datos necesarios al usuario para la creación de su perfil.

# 3\. Visualización y Consulta de Información

## 3.1 Visualización de Información de Clubes y Jugadores

El sistema debe mostrar la información detallada y el material fotográfico proporcionado por cada Club o Jugador registrado.

* **Propósito:** Servir como un escaparate de la información relevante de los clubes registrados.  
* **Detalle:** Se presentará la información que el Club o Jugador haya decidido publicar en su perfil.

## 3.2 Geolocalización de Clubes

El sistema debe mostrar la ubicación geográfica de los clubes registrados mediante la integración de un servicio de mapas externos (ej. Google Maps).

* **Propósito:** Facilitar a los usuarios la localización física precisa de los clubes.  
* **Detalle:** Se integrará un mapa que señalará la ubicación exacta del club.

## 3.3 Redireccionamiento a Sitios Web de Clubes

El sistema debe incluir una opción de redireccionamiento a la página web oficial del club, en caso de que disponga de una.

* **Propósito:** Ofrecer un acceso directo a información más detallada, como procesos de inscripción, que se manejen externamente.  
* **Detalle:** Dentro de la sección de información del club, se mostrará un botón etiquetado como "Más información", que ejecutará la redirección si el club ha activado y proporcionado el enlace correspondiente.

## 3.4 Funcionalidad de Búsqueda

El sistema debe incluir un motor de búsqueda principal que permita a los usuarios o visitantes filtrar o buscar entidades específicas (Clubes o Jugadores).

* **Propósito:** Mejorar la navegabilidad y la capacidad de los usuarios para encontrar rápidamente la información deseada.  
* **Detalle:** La búsqueda se ejecutará en función del texto ingresado por el usuario

# 4\. Funcionalidades Adicionales (Opcional)

## 4.1 Agenda de Eventos

El sistema podría incluir una agenda para la visualización de eventos organizados por los clubes registrados.

* **Propósito:** Centralizar y hacer visibles los eventos relevantes para la comunidad.  
* **Detalle:** Los clubes podrán agregar eventos con su respectiva fecha y hora. La implementación de esta funcionalidad está sujeta a la disponibilidad de tiempo y la carga de trabajo del equipo de desarrollo.

