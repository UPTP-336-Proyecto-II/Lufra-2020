# Migración de Rutas a Controladores

## 📋 Estado Actual

### ✅ Controladores Creados

1. **PerfilController** - Gestión de perfil de usuario
2. **NominaController** - Gestión de períodos de nómina
3. **EmpleadoController** - Gestión de empleados
4. **ContratoController** - CRUD de contratos
5. **RecibosPagosController** - Gestión de recibos y pagos

### 📄 Archivo Creado

- `routes/web_clean.php` - Versión limpia con solo definiciones de rutas

## 🎯 Objetivo

Mover TODA la lógica de negocio desde `routes/web.php` a controladores dedicados, dejando en `web.php` solo las definiciones de rutas.

## 📝 Pasos para Completar la Migración

### Paso 1: Crear Controladores Faltantes

#### DepartamentoController
```php
php artisan make:controller DepartamentoController
```
**Métodos necesarios:**
- `index()` - Lista departamentos
- `store()` - Crea departamento
- `update()` - Actualiza departamento
- `destroy()` - Elimina departamento

#### ConceptoPagoController
```php
php artisan make:controller ConceptoPagoController
```
**Métodos necesarios:**
- `index()` - Lista conceptos
- `store()` - Crea concepto
- `update()` - Actualiza concepto
- `destroy()` - Elimina concepto

#### MetodoPagoController
```php
php artisan make:controller MetodoPagoController
```
**Métodos necesarios:**
- `index()` - Lista métodos
- `store()` - Crea método
- `update()` - Actualiza método
- `destroy()` - Elimina método

#### MonedaController
```php
php artisan make:controller MonedaController
```
**Métodos necesarios:**
- `index()` - Lista monedas
- `store()` - Crea moneda
- `update()` - Actualiza moneda
- `destroy()` - Elimina moneda

### Paso 2: Completar Controladores Existentes

#### EmpleadoController
Agregar métodos faltantes:
- `crear(Request $request)` - Crear empleado
- `editar(Request $request)` - Editar empleado
- `eliminar(Request $request)` - Eliminar empleado
- `cambiarPassword(Request $request)` - Cambiar contraseña
- `asignarDepartamento(Request $request)` - Asignar departamento

#### RecibosPagosController
Agregar métodos faltantes:
- `reportes(Request $request)` - Generar reportes
- `asignarPago(Request $request)` - Asignar pago a recibo
- `aceptar($pagoId)` - Aceptar pago
- `rechazar($pagoId)` - Rechazar pago

### Paso 3: Completar PayrollController

Agregar métodos:
- `createPeriod(Request $request)` - Crear período
- `closePeriod(Request $request)` - Cerrar período
- `generarArchivoBanco($periodoId)` - Archivo banco
- `generarObligaciones($periodoId)` - Obligaciones
- `generarReciboPDF($reciboId)` - Recibo PDF

### Paso 4: Reemplazar web.php

Una vez todos los controladores estén completos:

```bash
# Hacer backup
cp routes/web.php routes/web_backup.php

# Reemplazar con versión limpia
cp routes/web_clean.php routes/web.php
```

### Paso 5: Actualizar Vistas

Asegurar que todas las vistas usen variables del controlador:
- ✅ `nominas.blade.php` - Ya actualizado
- ⚠️ `empleados.blade.php` - Necesita actualización
- ⚠️ `recibos_pagos.blade.php` - Necesita actualización
- ⚠️ `contratos.blade.php` - Necesita actualización
- ⚠️ `departamentos.blade.php` - Necesita actualización
- ⚠️ `conceptos.blade.php` - Necesita actualización
- ⚠️ `metodos.blade.php` - Necesita actualización
- ⚠️ `monedas.blade.php` - Necesita actualización

## 📊 Progreso

### Controladores
- [x] PerfilController ✅
- [x] NominaController ✅
- [x] EmpleadoController ✅ (completo)
- [x] ContratoController ✅
- [x] RecibosPagosController ✅ (completo)
- [x] DepartamentoController ✅
- [x] ConceptoPagoController ✅
- [x] MetodoPagoController ✅
- [x] MonedaController ✅
- [x] PayrollController ✅ (completo)

### Rutas
- [x] Authentication ✅
- [x] Perfil ✅
- [x] Nóminas ✅
- [x] Empleados ✅
- [x] Contratos ✅
- [x] Recibos y Pagos ✅
- [x] Notificaciones ✅
- [x] Settings ✅
- [x] Departamentos ✅
- [x] Conceptos de pago ✅
- [x] Métodos de pago ✅
- [x] Monedas ✅
- [x] PDFs y reportes ✅

### Vistas
- [x] nominas.blade.php (100%)
- [ ] empleados.blade.php (80%)
- [ ] recibos_pagos.blade.php (60%)
- [ ] contratos.blade.php (60%)
- [ ] departamentos.blade.php (0%)
- [ ] conceptos.blade.php (0%)
- [ ] metodos.blade.php (0%)
- [ ] monedas.blade.php (0%)

## 🎯 Beneficios al Completar

1. **Código más limpio** - Rutas legibles y organizadas
2. **Fácil mantenimiento** - Lógica centralizada en controladores
3. **Mejor testeo** - Controladores pueden ser testeados unitariamente
4. **Escalabilidad** - Fácil agregar nuevas funcionalidades
5. **Estándar Laravel** - Sigue las mejores prácticas del framework

## 📝 Ejemplo de Migración

### Antes (en web.php):
```php
Route::get('/departamentos', function(){
    $role = DB::table('rol_usuario')
        ->join('roles','roles.id','=','rol_usuario.rol_id')
        ->where('rol_usuario.user_id', auth()->id())
        ->value('roles.nombre');
    if ($role !== 'administrador') { abort(403); }
    
    $deptos = DB::table('departamentos')->orderBy('nombre')->get();
    return view('departamentos', compact('deptos'));
})->name('departamentos.view');
```

### Después:

**routes/web.php:**
```php
Route::get('/departamentos', [DepartamentoController::class, 'index'])->name('departamentos.view');
```

**DepartamentoController.php:**
```php
public function index()
{
    // Verificar rol
    $role = DB::table('rol_usuario')
        ->join('roles','roles.id','=','rol_usuario.rol_id')
        ->where('rol_usuario.user_id', auth()->id())
        ->value('roles.nombre');
    
    if ($role !== 'administrador') {
        abort(403);
    }
    
    $deptos = DB::table('departamentos')->orderBy('nombre')->get();
    return view('departamentos', compact('deptos'));
}
```

## 🚀 Siguiente Paso Inmediato

1. **Revisar** el archivo `routes/web_clean.php`
2. **Crear** los controladores faltantes
3. **Mover** la lógica de cada ruta a su controlador
4. **Probar** cada funcionalidad después de migrarla
5. **Actualizar** las vistas para usar variables del controlador
6. **Reemplazar** `web.php` cuando todo esté listo

## ⚠️ Importante

- **NO reemplazar `web.php` hasta que todos los controladores estén listos**
- **Probar cada funcionalidad después de migrarla**
- **Mantener backup del `web.php` original**
- **Actualizar las vistas gradualmente**

---

Última actualización: 2025-12-09
