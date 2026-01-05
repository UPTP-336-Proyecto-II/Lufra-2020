# Reapertura Automática de Períodos de Nómina

## Funcionalidad Implementada

El sistema ahora permite **reabrir automáticamente** períodos cerrados cuando se intenta crear un período con el mismo código, con protección contra duplicación de pagos.

## Comportamiento

### 1. Crear Período (Automático)

Cuando se crea un período de nómina:

#### Caso A: Período NO existe
- ✅ Se crea normalmente
- ✅ Estado: "abierto"
- ✅ Mensaje: "Período de nómina creado correctamente"

#### Caso B: Período existe y está CERRADO
- ✅ Se reabre automáticamente
- ✅ Estado cambia de "cerrado" a "abierto"
- ✅ Mensaje: "El período {código} ya existía y estaba cerrado. Se ha reabierto automáticamente."

#### Caso C: Período existe y está ABIERTO
- ❌ No se crea ni se modifica
- ❌ Mensaje de error: "Ya existe un período con ese código ({código}) y está abierto."

### 2. Reabrir Período (Manual)

En la lista de períodos, los períodos cerrados tienen un botón **"Reabrir período"**:

- ✅ Cambia el estado de "cerrado" a "abierto"
- ✅ Permite volver a calcular nómina
- ✅ Permite modificar recibos
- ✅ Mensaje: "El período {código} ha sido reabierto correctamente."

## Protección Contra Duplicación de Pagos

### Regla Principal
**Un empleado NO recibirá múltiples recibos/pagos por el mismo período**

### Cómo Funciona

Cuando se calcula nómina en un período reabierto:

1. ✅ El sistema verifica si el empleado **ya tiene pagos** en ese período
2. ✅ Si tiene pagos → **Se omite** (no se crea nuevo recibo)
3. ✅ Si NO tiene pagos → Se calcula y crea recibo normalmente

### Ejemplo Práctico

```
Período: 2025-12 (cerrado con 10 empleados pagados)

Situación: Se reabre el período y se agregan 3 empleados nuevos

Al calcular nómina:
- 10 empleados originales → ✅ OMITIDOS (ya tienen pagos)
- 3 empleados nuevos → ✅ PROCESADOS (sin pagos)

Resultado: Solo los 3 nuevos reciben recibos
```

## Ejemplos de Uso

### Ejemplo 1: Reapertura Automática

```
1. Usuario intenta crear período mensual de Diciembre 2025
2. Sistema detecta que ya existe período "2025-12" cerrado
3. Sistema reabre automáticamente el período
4. Mensaje: "El período 2025-12 ya existía y estaba cerrado. Se ha reabierto automáticamente."
```

### Ejemplo 2: Reapertura Manual

```
1. Usuario va a "Períodos de Nómina"
2. Ve período "2025-12" con estado "cerrado"
3. Hace clic en botón "Reabrir período"
4. Confirma en el diálogo
5. Período cambia a estado "abierto"
6. Mensaje: "El período 2025-12 ha sido reabierto correctamente."
```

### Ejemplo 3: Prevención de Duplicados

```
1. Usuario intenta crear período "2025-12"
2. Sistema detecta que ya existe y está "abierto"
3. Sistema NO permite crear/reabrir
4. Error: "Ya existe un período con ese código (2025-12) y está abierto."
```

## Interfaz de Usuario

### Vista de Períodos

**Antes:**
```
Estado        | Acciones
abierto       | [Cerrar período]
cerrado       | Cerrado (sin acción)
```

**Ahora:**
```
Estado        | Acciones
abierto       | [Cerrar período]
cerrado       | [Reabrir período]
```

## Ventajas

1. ✅ **No hay duplicados**: Un código de período es único
2. ✅ **Flexibilidad**: Se puede reabrir para hacer correcciones
3. ✅ **Automático**: No requiere intervención manual en caso normal
4. ✅ **Control**: El usuario puede reabrir manualmente si lo necesita
5. ✅ **Histórico**: Se mantiene el mismo período con su historial

## Casos de Uso

### ¿Cuándo se reabre automáticamente?
- Al crear un nuevo período con las mismas fechas
- El sistema detecta código duplicado
- El período anterior estaba cerrado

### ¿Cuándo se reabre manualmente?
- Necesitas corregir datos de un período cerrado
- Olvidaste procesar algunos recibos
- Hubo un error en el cálculo
- Necesitas agregar/modificar pagos

### ¿Qué pasa después de reabrir?
- ✅ Se puede ejecutar "Calcular nómina" nuevamente
- ✅ Se pueden modificar recibos **sin pagos**
- ✅ Se pueden agregar pagos para empleados nuevos
- ⚠️ Empleados con pagos existentes NO se recalculan
- ✅ Se debe cerrar nuevamente cuando esté listo

## Flujo Recomendado

```
1. Crear período → Estado: abierto
2. Calcular nómina → Generar recibos
3. Asignar pagos → Procesar pagos
4. Cerrar período → Estado: cerrado
5. (Si se necesita procesar empleados adicionales)
   - Reabrir período → Estado: abierto
   - Calcular nómina → Solo empleados sin pagos
   - Asignar pagos nuevos
   - Cerrar período → Estado: cerrado
```

## Casos de Uso Reales

### Caso 1: Empleados Nuevos
```
Situación: Se cerró el período y luego se contrataron 2 empleados

Solución:
1. Reabrir período "2025-12"
2. Calcular nómina
   - 50 empleados originales → OMITIDOS (ya tienen pagos)
   - 2 empleados nuevos → PROCESADOS
3. Asignar pagos a los 2 nuevos
4. Cerrar período nuevamente
```

### Caso 2: Error en un Empleado
```
Situación: Se cerró el período pero 1 empleado no recibió pago

Solución:
1. Reabrir período "2025-12"
2. Calcular nómina
   - 49 empleados con pagos → OMITIDOS
   - 1 empleado sin pago → PROCESADO
3. Asignar pago al empleado faltante
4. Cerrar período nuevamente
```

### Caso 3: Corrección de Datos
```
Situación: Hay un error en el sueldo de un empleado ya pagado

Importante: NO se puede recalcular empleados con pagos

Opciones:
1. Ajuste manual: Crear pago manual de ajuste
2. Eliminar el pago existente → Recalcular → Asignar nuevo pago
```

## Notas Importantes

- ⚠️ Un período abierto permite modificaciones
- ⚠️ Un período cerrado NO permite modificaciones (hasta reabrirlo)
- ⚠️ Solo puede haber UN período con el mismo código
- ⚠️ Reabrir un período permite calcular nómina para empleados SIN pagos
- ✅ **Protección anti-duplicados**: Empleados con pagos NO se recalculan
- ✅ Los recibos y pagos existentes se mantienen intactos
- ✅ La reapertura es reversible (se puede cerrar de nuevo)
- ✅ Ideal para procesar empleados que se agregaron después del cierre

## Lógica de Protección

### Al Calcular Nómina en Período Reabierto:

```php
Para cada empleado activo:
  1. ¿Tiene pagos en este período?
     SÍ → Omitir (no calcular)
     NO → Calcular recibo normal
```

### Consulta de Verificación:
```sql
SELECT COUNT(*) FROM pagos
JOIN recibos ON pagos.recibo_id = recibos.id
WHERE recibos.periodo_nomina_id = [periodo]
  AND recibos.empleado_id = [empleado]
```

Si COUNT > 0 → Empleado YA tiene pago → No calcular

## Rutas Implementadas

- `POST /nominas/periodo/crear` - Crear/Reabrir automático
- `POST /nominas/periodo/cerrar` - Cerrar período
- `POST /nominas/periodo/reabrir` - Reabrir manual

## Validaciones

### Al crear período:
1. Verifica si existe código
2. Si existe y está cerrado → Reabre
3. Si existe y está abierto → Error
4. Si no existe → Crea nuevo

### Al reabrir manualmente:
1. Verifica que el período exista
2. Verifica que esté cerrado
3. Cambia estado a "abierto"
