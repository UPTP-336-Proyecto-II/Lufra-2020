# Resumen de Cambios - Sistema de Impuestos con Cálculo de Nómina

## Cambios Implementados

### ✅ 1. Cálculo de Nómina Actualizado

**Antes:**
- Salario bruto
- Deducciones (impuesto + seguridad social)
- Neto

**Ahora:**
```
Devengado (sueldo bruto del empleado)
- Impuesto (% configurado en impuesto por defecto)
- Otras deducciones (seguridad social, etc.)
= Neto a pagar
```

### ✅ 2. Cambios en Base de Datos

**Tabla `recibos`** - Nuevos campos:
- `devengado` (decimal 12,2) - Sueldo bruto antes de deducciones
- `impuesto_monto` (decimal 12,2) - Monto del impuesto deducido
- `impuesto_id` (foreign key) - Referencia al impuesto aplicado

**Tabla `pagos`** - Nuevo campo:
- `impuesto_id` (foreign key) - Impuesto asociado al pago

**Nuevas tablas:**
- `impuestos` - Gestión de tipos de impuestos
- `tabuladores_salariales` - Sueldos base por frecuencia

### ✅ 3. Recibo PDF Actualizado

**Cambios en la sección "Detalle":**
- ✅ Muestra "Devengado" en lugar de "Salario bruto"
- ✅ Muestra impuesto con nombre y porcentaje: "Impuesto IVA (16%): -$160.00"
- ✅ Muestra "Neto a pagar" como resultado final

**Cambios en la tabla "Pagos":**
- ❌ **Eliminada** columna "Estado" 
- ✅ Solo muestra: Fecha, Método, Moneda, Referencia, Importe

**Eliminado:**
- ❌ Línea "Estado: calculado (aprobado)" al final del recibo

### ✅ 4. Cálculo Automático con Impuesto Por Defecto

El método `PayrollController::calculate()` ahora:
1. Busca el impuesto marcado como "por defecto"
2. Aplica su porcentaje al devengado
3. Calcula: `Neto = Devengado - (Devengado × Impuesto%) - Otras deducciones`
4. Guarda el impuesto_id en el recibo

### ✅ 5. Gestión de Impuestos

**Funcionalidades:**
- Crear, editar, eliminar impuestos
- Establecer un impuesto como "por defecto"
- Activar/desactivar impuestos
- Solo UN impuesto puede ser "por defecto" a la vez

**Ejemplo de impuestos:**
- IVA (16%) - Por defecto ✓
- ISLR (3%)
- SSO (4%)

### ✅ 6. Gestión de Tabuladores Salariales

**Funcionalidades:**
- Crear tabuladores por frecuencia (semanal, quincenal, mensual)
- Asignar sueldo base según cargo
- Filtrar por frecuencia
- Soporte multi-moneda

**Ejemplo de tabuladores:**
- Gerente Mensual: $5,000 USD
- Gerente Quincenal: $2,500 USD
- Operador Semanal: $200 USD

## Archivos Modificados

### Migraciones
- ✅ `2025_12_11_000000_create_impuestos_table.php` (nueva)
- ✅ `2025_12_11_000001_create_tabuladores_salariales_table.php` (nueva)
- ✅ `2025_12_11_000002_add_impuesto_to_pagos.php` (nueva)
- ✅ `2025_12_11_000003_add_devengado_impuesto_to_recibos.php` (nueva)

### Controladores
- ✅ `ImpuestosController.php` (nuevo)
- ✅ `TabuladoresController.php` (nuevo)
- ✅ `PayrollController.php` (modificado - método calculate)
- ✅ `RecibosPagosController.php` (modificado - asignarPago)

### Modelos
- ✅ `Recibo.php` (agregados campos devengado, impuesto_monto, impuesto_id)

### Vistas
- ✅ `impuestos.blade.php` (nueva)
- ✅ `tabuladores.blade.php` (nueva)
- ✅ `recibo_pdf.blade.php` (modificada - muestra devengado, impuesto y quita estado)
- ✅ `recibos_pagos.blade.php` (agregada columna impuesto)
- ✅ `layouts.blade.php` (agregados enlaces en menú)

### Rutas
- ✅ `web.php` (agregadas rutas para impuestos y tabuladores)

### Scripts
- ✅ `migrar_impuestos_tabuladores.bat` (ejecutar migraciones)
- ✅ `datos_impuestos_tabuladores.sql` (datos de ejemplo)

### Documentación
- ✅ `IMPUESTOS_TABULADORES.md` (guía completa)

## Ejemplo de Flujo Completo

### 1. Configuración Inicial
```
1. Ir a "Impuestos"
2. Crear impuesto "IVA" con 16%
3. Marcar como "por defecto"
4. Ir a "Tabuladores Salariales"
5. Crear tabulador "Gerente Mensual" con $5,000 USD
```

### 2. Cálculo de Nómina
```
1. Crear período de nómina (mensual)
2. Calcular nómina
3. Sistema aplica automáticamente:
   - Devengado: $5,000.00
   - IVA (16%): -$800.00
   - Seguridad Social (5%): -$250.00
   - Neto: $3,950.00
```

### 3. Recibo Generado (PDF)
```
DETALLE:
Devengado                    $5,000.00
Impuesto IVA (16%)             -$800.00
Otras deducciones              -$250.00
--------------------------------
Neto a pagar                 $3,950.00

PAGOS:
Fecha      | Método        | Moneda | Referencia | Importe
10/12/2025 | Transferencia | USD    | TRX-12345  | $3,950.00
```

## Instalación

```bash
# 1. Ejecutar migraciones
migrar_impuestos_tabuladores.bat

# 2. Cargar datos de ejemplo (opcional)
mysql -u root -p nombre_bd < datos_impuestos_tabuladores.sql

# 3. Limpiar caché
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

## Verificación

✅ Impuestos se pueden crear/editar/eliminar
✅ Tabuladores se pueden crear/editar/eliminar
✅ Recibo PDF muestra devengado e impuesto correctamente
✅ Recibo PDF NO muestra columna "Estado" en pagos
✅ Recibo PDF NO muestra línea de estado al final
✅ Cálculo de nómina usa impuesto por defecto
✅ Neto = Devengado - Impuesto(%) - Otras deducciones
