# Manual del Sistema: Lufra-2020

## Índice
1. Introducción
2. Descripción General del Sistema
3. Requisitos del Sistema
4. Instalación
5. Configuración Inicial
6. Descripción de Funcionalidades Principales
7. Uso del Sistema
8. Gestión de Usuarios
9. Mantenimiento y Actualizaciones
10. Solución de Problemas Frecuentes
11. Contacto y Soporte

---

## 1. Introducción

**Lufra-2020** es un sistema web desarrollado por el Grupo 1 utilizando Laravel como framework principal, junto a tecnologías de frontend como Vue.js, JavaScript, CSS y Blade. Este manual proporciona las instrucciones necesarias para instalar, configurar, operar y mantener el sistema.

## 2. Descripción General del Sistema

El sistema ofrece funcionalidades orientadas a la gestión de información y procesos relacionados con el proyecto Lufra-2020. Se caracteriza por una arquitectura cliente-servidor, interfaz amigable y módulos desarrollados en Vue, además de una robusta API backend en Laravel/PHP.

## 3. Requisitos del Sistema

**Hardware:**
- Procesador Intel o AMD, 1GHz o superior
- 2GB RAM mínimo (recomendado 4GB)
- 500MB de espacio en disco

**Software:**
- PHP ≥ 8.0
- Composer
- Node.js ≥ 14 y npm
- MySQL/MariaDB (u otro compatible con Laravel)
- Servidor web: Apache o Nginx
- Git (opcional, para clonar el repositorio)

## 4. Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/UPTP-336-Proyecto-II/Lufra-2020.git
   cd Lufra-2020
   ```

2. **Instalar dependencias backend:**
   ```bash
   composer install
   ```

3. **Instalar dependencias frontend:**
   ```bash
   npm install
   ```

4. **Copiar archivo de entorno:**
   ```bash
   cp .env.example .env
   ```

## 5. Configuración Inicial

1. **Configurar conexión a base de datos en `.env`:**
   ```
   DB_DATABASE=nombre_base_de_datos
   DB_USERNAME=usuario
   DB_PASSWORD=contraseña
   ```

2. **Generar la clave de la aplicación:**
   ```bash
   php artisan key:generate
   ```

3. **Migrar la base de datos y sembrar datos:**
   ```bash
   php artisan migrate --seed
   ```

4. **Construir los assets front-end:**
   ```bash
   npm run dev
   ```
   (O `npm run build` para producción).

5. **Servir la aplicación:**
   ```bash
   php artisan serve
   ```
   Acceder a: <a href="http://localhost:8000">http://localhost:8000</a>

## 6. Descripción de Funcionalidades Principales

- **Gestión de usuarios:** Creación, edición, eliminación y autenticación.
- **Módulos principales:** Consultar y gestionar datos del proyecto.
- **Panel de administración:** Acceso restringido para usuarios autorizados.
- **Reportes y estadísticas:** Visualización de información relevante.
- **Interfaz dinámica:** Uso de Vue.js para mejorar la experiencia de usuario.

## 7. Uso del Sistema

1. **Ingreso:** Acceda a la URL del sistema y autentíquese.
2. **Navegación:** Utilice el menú principal para explorar los módulos.
3. **Operaciones:** Realice operaciones según el rol de usuario (crear, editar, eliminar registros, etc).
4. **Cerrar sesión:** Utilice la opción correspondiente para salir del sistema.

## 8. Gestión de Usuarios

- Los roles y permisos determinan el acceso a diferentes módulos del sistema.
- Los usuarios administradores pueden gestionar otros usuarios a través del panel de administración.
- Es recomendable asignar contraseñas seguras y actualizar periódicamente la información.

## 9. Mantenimiento y Actualizaciones

- **Actualizaciones de dependencias:**
  ```bash
  composer update
  npm update
  ```
- **Revisión de logs:** Verificar archivos de log en `storage/logs/` para detectar errores.
- **Respaldo:** Realizar backups regulares de la base de datos.

## 10. Solución de Problemas Frecuentes

| Problema | Solución |
|----------|----------|
| No carga el sistema | Verifique la configuración de `.env` y la conexión a base de datos. |
| Error 500 | Revise los logs y permisos de carpetas: `storage` y `bootstrap/cache`. |
| Cambios en frontend no se muestran | Ejecute `npm run dev` y recargue el navegador. |
| Login no funciona | Revise configuraciones de autenticación y migraciones de usuarios. |

## 11. Contacto y Soporte

Para dudas, soporte o reportar problemas, contacte a los responsables del Grupo 1.

---

*Este manual puede ser modificado o ampliado según evolucione el sistema o cambien las necesidades del proyecto.*
