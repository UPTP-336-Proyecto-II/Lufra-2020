# Sistema de Impuestos y Tabuladores Salariales

## Descripción

Este módulo permite gestionar impuestos y tabuladores salariales para la nómina, con cálculo automático de deducciones basado en el impuesto configurado.

## Características

### Impuestos
- **CRUD completo**: Crear, editar, eliminar impuestos
- **Impuesto por defecto**: Se puede establecer un impuesto por defecto que se aplicará automáticamente en los cálculos de nómina
- **Porcentaje**: Cada impuesto tiene un porcentaje que se deduce del devengado
- **Estado activo/inactivo**: Los impuestos se pueden activar o desactivar
- **Cálculo automático**: El sistema calcula automáticamente: **Devengado - Impuesto (%) = Neto**

### Tabuladores Salariales
- **CRUD completo**: Crear, editar, eliminar tabuladores
- **Frecuencias**: Semanal, quincenal, mensual
- **Sueldo base**: Define el sueldo base según el cargo y frecuencia
- **Monedas**: Soporta múltiples monedas (VES, USD, etc.)
- **Estado activo/inactivo**: Los tabuladores se pueden activar o desactivar

## Cálculo de Nómina

### Fórmula
```
Devengado (sueldo bruto)
- Impuesto (% del devengado según impuesto por defecto)
- Otras deducciones (seguridad social, etc.)
= Neto a pagar
```

### Ejemplo
```
Devengado: $1,000.00
Impuesto IVA (16%): -$160.00
Seguridad Social (5%): -$50.00
------------------------
Neto a pagar: $790.00
```

## Recibo de Pago

El recibo PDF muestra:
- **Devengado**: Sueldo bruto antes de deducciones
- **Impuesto**: Nombre del impuesto, porcentaje y monto deducido
- **Otras deducciones**: Si aplican
- **Neto a pagar**: Monto final a pagar al empleado
- **Pagos**: Tabla sin columna "Estado" (solo fecha, método, moneda, referencia e importe)

## Uso

### Gestión de Impuestos

1. Ir a **Impuestos** en el menú lateral
2. Crear un nuevo impuesto con:
   - Nombre (ej: IVA, ISLR, SSO)
   - Código (identificador único)
   - Porcentaje (0-100)
   - Descripción (opcional)
   - **Marcar como "por defecto"** para que se aplique automáticamente

3. El impuesto por defecto se aplicará automáticamente al calcular la nómina

### Gestión de Tabuladores

1. Ir a **Tabuladores Salariales** en el menú lateral
2. Crear un nuevo tabulador con:
   - Nombre descriptivo
   - Cargo (opcional)
   - Frecuencia (semanal, quincenal, mensual)
   - Sueldo base
   - Moneda
   - Descripción (opcional)

3. Los tabuladores se usan como referencia para establecer sueldos según:
   - La frecuencia del período de nómina
   - El cargo del empleado
   - El tipo de contrato

### Asignación de Pagos con Impuestos

Al asignar un pago en **Recibos y Pagos**:
1. El sistema mostrará una lista desplegable de impuestos
2. El impuesto marcado como "por defecto" aparecerá pre-seleccionado
3. Se puede cambiar a otro impuesto o seleccionar "Sin impuesto"
4. El impuesto se guardará asociado al pago

## Migración de Base de Datos

Ejecutar las siguientes migraciones:

```bash
php artisan migrate
```

O usar el script batch incluido:
```bash
migrar_impuestos_tabuladores.bat
```

Esto creará las tablas:
- `impuestos`
- `tabuladores_salariales`

Y agregará las columnas:
- `impuesto_id` a la tabla `pagos`
- `devengado`, `impuesto_monto`, `impuesto_id` a la tabla `recibos`

## Datos de Ejemplo

Para cargar datos de ejemplo, ejecutar:

```bash
mysql -u usuario -p nombre_base_datos < datos_impuestos_tabuladores.sql
```

O desde MySQL Workbench/phpMyAdmin importar el archivo `datos_impuestos_tabuladores.sql`.

## Rutas

### Impuestos
- GET `/impuestos` - Listar impuestos
- POST `/impuestos` - Crear impuesto
- PUT `/impuestos/{id}` - Actualizar impuesto
- DELETE `/impuestos/{id}` - Eliminar impuesto
- POST `/impuestos/{id}/toggle` - Activar/desactivar impuesto

### Tabuladores
- GET `/tabuladores` - Listar tabuladores
- POST `/tabuladores` - Crear tabulador
- PUT `/tabuladores/{id}` - Actualizar tabulador
- DELETE `/tabuladores/{id}` - Eliminar tabulador
- POST `/tabuladores/{id}/toggle` - Activar/desactivar tabulador
- GET `/tabuladores/sueldo` - Obtener sueldo por frecuencia (API)

## Permisos

Solo usuarios con rol de **Administrador** pueden acceder a estas funcionalidades.

## Notas Importantes

- Al marcar un impuesto como "por defecto", automáticamente se desmarca el anterior
- Los impuestos inactivos no aparecen en las listas de selección
- El impuesto por defecto se aplica automáticamente al calcular nóminas
- Los tabuladores pueden tener el mismo cargo pero diferente frecuencia
- La moneda del tabulador debe existir en la tabla de monedas
- El recibo PDF NO muestra el campo "estado" en la tabla de pagos
- El cálculo es: **Devengado - Impuesto(%) - Otras deducciones = Neto**
