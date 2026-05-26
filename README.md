# Manual de Sistema – Lufra-2020

## Índice

1. [Introducción](#introducción)
2. [Arquitectura General](#arquitectura-general)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Estructura de Carpetas](#estructura-de-carpetas)
5. [Instalación y Despliegue](#instalación-y-despliegue)
6. [Base de Datos](#base-de-datos)
7. [Configuración](#configuración)
8. [Descripción de Módulos / Componentes](#descripción-de-módulos--componentes)
9. [Procedimientos de Mantenimiento](#procedimientos-de-mantenimiento)
10. [Seguridad](#seguridad)
11. [Respaldo y Recuperación](#respaldo-y-recuperación)
12. [Actualizaciones](#actualizaciones)
13. [Soporte y Contacto](#soporte-y-contacto)

---

## Introducción

Este documento describe la estructura, componentes, configuración, y mantenimiento del sistema **Lufra-2020**. Es una guía dirigida a administradores, desarrolladores y personal técnico encargado del soporte y evolución del sistema.

## Arquitectura General

El sistema está basado en una arquitectura web cliente-servidor con separación de frontend (Vue.js, JavaScript, TypeScript, CSS) y backend (PHP, Blade). La persistencia de datos utiliza MySQL (ajustar según corresponda).

### Diagrama General

```
Usuario <–––> Frontend (Vue.js) <–––> Backend (PHP/Laravel) <–––> Base de Datos (MySQL)
```

## Tecnologías Utilizadas

- **Frontend:** Vue.js, JavaScript, TypeScript, CSS
- **Backend:** PHP (Laravel o framework usado), Blade (plantillas)
- **Base de datos:** MySQL
- **Gestor de dependencias:** Composer, npm/yarn
- **Control de versiones:** Git/GitHub

## Estructura de Carpetas

Ejemplo típico:
```
/src                # Código fuente frontend
/resources/views    # Vistas Blade (backend)
/public             # Archivos públicos y estáticos
/routes             # Definición de rutas backend
/app                # Lógica de negocio backend
/config             # Configuración general del sistema
/database           # Migraciones y seeds
```

## Instalación y Despliegue

### Requisitos previos

- PHP 7.4 o superior
- Composer
- Node.js y npm
- MySQL

### Pasos generales

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/UPTP-336-Proyecto-II/Lufra-2020.git
   ```
2. Instalar dependencias backend:
   ```bash
   composer install
   ```
3. Instalar dependencias frontend:
   ```bash
   npm install
   ```
4. Configurar variables de entorno (`.env`)
5. Ejecutar migraciones de base de datos:
   ```bash
   php artisan migrate
   ```
6. Compilar archivos frontend:
   ```bash
   npm run build
   ```
7. Iniciar el servidor de desarrollo:
   ```bash
   php artisan serve
   ```

## Base de Datos

- **Modelo relacional:** (adecuar según tu modelo, agregar diagrama ER si es posible)
- Tablas más importantes:
  - `users`: Usuarios del sistema
  - `roles`: Roles y permisos
  - [Agregar otras tablas según el dominio]
- Se recomienda hacer respaldo periódico de la base de datos.

## Configuración

- Personalización de variables en el archivo `.env`:
  - Conexiones a base de datos
  - Configuración de correo
  - Claves y tokens de seguridad
- Para cambios de rutas, modificar en `/routes`

## Descripción de Módulos / Componentes

### 1. Autenticación de usuarios
- Login/Logout, recuperación de contraseña, gestión de sesiones

### 2. Gestión de usuarios y roles
- CRUD de usuarios, asignación de roles y permisos

### 3. Generación de reportes
- Listados, descargas en PDF/Excel (si aplica)

### 4. Otros módulos específicos
- [Módulos según lo diseñado en Lufra-2020; describir uno a uno brevemente]

## Procedimientos de Mantenimiento

- Actualización de dependencias:
  - Backend: `composer update`
  - Frontend: `npm update`
- Limpieza de cachés:
  ```bash
  php artisan cache:clear
  php artisan config:cache
  ```

## Seguridad

- Uso de HTTPS y configuración segura en producción
- Restringir acceso a rutas administrativas
- Buenas prácticas para contraseñas y manejo de tokens

## Respaldo y Recuperación

- Procedimiento recomendado para respaldar la base de datos:
  ```bash
  mysqldump -u usuario -p basededatos > backup.sql
  ```
- Para restaurar:
  ```bash
  mysql -u usuario -p basededatos < backup.sql
  ```

## Actualizaciones

- Antes de actualizar, respalde código y base de datos
- Siga el flujo habitual: pull en `main/master`, migraciones, compilación de frontend, pruebas manuales

## Soporte y Contacto

- Email: soporte@lufra2020.com
- Documentación extendida: [Wiki del repositorio, si existe]

---

_Manual preparado por Grupo 1 - UPTP-336 Proyecto II_

