<template>
  <div class="container-fluid">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h3 class="card-title mb-0"><i class="fas fa-university mr-2"></i>Archivo Banco - Pagos Aceptados</h3>
        <button @click="imprimirArchivo" class="btn btn-primary btn-sm" :disabled="!pagos.length">
          <i class="fas fa-print"></i> Imprimir / PDF
        </button>
      </div>
      <div class="card-body">
        <!-- Filtros de Fecha -->
        <div class="row mb-3">
          <div class="col-md-4">
            <label>Desde</label>
            <input v-model="filtros.desde" type="date" class="form-control" @change="cargarPagos">
          </div>
          <div class="col-md-4">
            <label>Hasta</label>
            <input v-model="filtros.hasta" type="date" class="form-control" @change="cargarPagos">
          </div>
          <div class="col-md-4 d-flex align-items-end">
            <button @click="cargarPagos" class="btn btn-secondary w-100">
              <i class="fas fa-sync"></i> Actualizar
            </button>
          </div>
        </div>

        <!-- Tabla de Pagos -->
        <div v-if="cargando" class="text-center py-4">
          <div class="spinner-border text-primary"></div>
        </div>
        <div v-else-if="pagos.length === 0" class="alert alert-info">
          <i class="fas fa-info-circle"></i> No hay pagos aceptados en el rango seleccionado.
        </div>
        <div v-else>
          <div class="table-responsive">
            <table class="table table-sm table-bordered table-hover">
              <thead class="thead-light">
                <tr>
                  <th>Empleado</th>
                  <th>Número de Cuenta</th>
                  <th class="text-right">Importe</th>
                  <th>Moneda</th>
                  <th>Período</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pago in pagos" :key="pago.created_at">
                  <td>{{ pago.nombre }} {{ pago.apellido }}</td>
                  <td>{{ pago.numero_cuenta || 'N/A' }}</td>
                  <td class="text-right">{{ formatNumber(pago.importe) }}</td>
                  <td>{{ pago.moneda }}</td>
                  <td>{{ pago.periodo }}</td>
                  <td>{{ formatDate(pago.created_at) }}</td>
                </tr>
              </tbody>
              <tfoot class="font-weight-bold">
                <tr>
                  <td colspan="2">Total</td>
                  <td class="text-right">{{ formatNumber(total) }}</td>
                  <td colspan="3"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Resumen -->
          <div class="alert alert-success mt-3">
            <strong><i class="fas fa-check-circle"></i> Resumen:</strong>
            {{ pagos.length }} pago(s) aceptado(s) por un total de {{ formatNumber(total) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Area de impresión oculta -->
    <div id="area-impresion" style="display:none;">
      <div style="font-family: Arial; padding: 20px;">
        <h3>Archivo Banco - Pagos Aceptados</h3>
        <p><strong>Desde:</strong> {{ filtros.desde || 'N/A' }} | <strong>Hasta:</strong> {{ filtros.hasta || 'N/A' }}</p>
        <table border="1" style="width:100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="padding:8px;">Empleado</th>
              <th style="padding:8px;">Cuenta</th>
              <th style="padding:8px;">Importe</th>
              <th style="padding:8px;">Moneda</th>
              <th style="padding:8px;">Período</th>
              <th style="padding:8px;">Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pago in pagos" :key="pago.created_at">
              <td style="padding:8px;">{{ pago.nombre }} {{ pago.apellido }}</td>
              <td style="padding:8px;">{{ pago.numero_cuenta || 'N/A' }}</td>
              <td style="padding:8px;text-align:right;">{{ formatNumber(pago.importe) }}</td>
              <td style="padding:8px;">{{ pago.moneda }}</td>
              <td style="padding:8px;">{{ pago.periodo }}</td>
              <td style="padding:8px;">{{ formatDate(pago.created_at) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:8px;font-weight:bold;">Total</td>
              <td style="padding:8px;text-align:right;font-weight:bold;">{{ formatNumber(total) }}</td>
              <td colspan="3" style="padding:8px;"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArchivoBanco',
  data() {
    return {
      pagos: [],
      total: 0,
      filtros: {
        desde: '',
        hasta: ''
      },
      cargando: false
    };
  },
  mounted() {
    // NO establecer fechas por defecto - mostrar todos los datos
    this.cargarPagos();
  },
  methods: {
    async cargarPagos() {
      this.cargando = true;
      try {
        const params = new URLSearchParams();
        if (this.filtros.desde) params.append('desde', this.filtros.desde);
        if (this.filtros.hasta) params.append('hasta', this.filtros.hasta);

        const response = await axios.get(`/api/archivo-banco?${params.toString()}`);
        this.pagos = response.data.pagos || [];
        this.total = response.data.total || 0;
      } catch (error) {
        this.$toast.fire({ 
          icon: 'error', 
          title: 'Error al cargar pagos',
          text: error.response?.data?.message || error.message
        });
      } finally {
        this.cargando = false;
      }
    },
    imprimirArchivo() {
      const contenido = document.getElementById('area-impresion').innerHTML;
      const ventana = window.open('', '_blank');
      ventana.document.write(`
        <html>
          <head>
            <title>Archivo Banco</title>
            <style>
              body { font-family: Arial; }
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 8px; border: 1px solid #000; }
              @media print {
                button { display: none; }
              }
            </style>
          </head>
          <body>
            ${contenido}
            <div style="margin-top: 20px;">
              <button onclick="window.print()">Imprimir</button>
              <button onclick="window.close()">Cerrar</button>
            </div>
          </body>
        </html>
      `);
      ventana.document.close();
    },
    formatNumber(num) {
      return new Intl.NumberFormat('es-DO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(num || 0);
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-DO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },
    formatDateInput(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
};
</script>
