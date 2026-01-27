<template>
  <div class="container-fluid">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h3 class="card-title mb-0"><i class="fas fa-file-invoice-dollar mr-2"></i>Obligaciones por Período</h3>
        <button @click="imprimirObligaciones" class="btn btn-primary btn-sm" :disabled="!obligaciones.length">
          <i class="fas fa-print"></i> Imprimir / PDF
        </button>
      </div>
      <div class="card-body">
        <!-- Filtros de Fecha -->
        <div class="row mb-3">
          <div class="col-md-4">
            <label>Desde</label>
            <input v-model="filtros.desde" type="date" class="form-control" @change="cargarObligaciones">
          </div>
          <div class="col-md-4">
            <label>Hasta</label>
            <input v-model="filtros.hasta" type="date" class="form-control" @change="cargarObligaciones">
          </div>
          <div class="col-md-4 d-flex align-items-end">
            <button @click="cargarObligaciones" class="btn btn-secondary w-100">
              <i class="fas fa-sync"></i> Filtrar
            </button>
          </div>
        </div>

        <!-- Tabla de Obligaciones -->
        <div v-if="cargando" class="text-center py-4">
          <div class="spinner-border text-primary"></div>
        </div>
        <div v-else-if="obligaciones.length === 0" class="alert alert-info">
          <i class="fas fa-info-circle"></i> No hay obligaciones en el rango seleccionado.
        </div>
        <div v-else>
          <div class="table-responsive">
            <table class="table table-sm table-bordered table-hover">
              <thead class="thead-light">
                <tr>
                  <th>Período</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th class="text-right">Total Recibos</th>
                  <th class="text-right">Total Bruto</th>
                  <th class="text-right">Total Deducciones</th>
                  <th class="text-right">Total Neto</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="obl in obligaciones" :key="obl.periodo">
                  <td>{{ obl.periodo }}</td>
                  <td>{{ formatDate(obl.fecha_inicio) }}</td>
                  <td>{{ formatDate(obl.fecha_fin) }}</td>
                  <td class="text-right">{{ obl.total_recibos }}</td>
                  <td class="text-right">{{ formatNumber(obl.total_bruto) }}</td>
                  <td class="text-right">{{ formatNumber(obl.total_deducciones) }}</td>
                  <td class="text-right">{{ formatNumber(obl.total_neto) }}</td>
                </tr>
              </tbody>
              <tfoot class="font-weight-bold">
                <tr>
                  <td colspan="3">TOTAL</td>
                  <td class="text-right">{{ totales.total_recibos }}</td>
                  <td class="text-right">{{ formatNumber(totales.total_bruto) }}</td>
                  <td class="text-right">{{ formatNumber(totales.total_deducciones) }}</td>
                  <td class="text-right">{{ formatNumber(totales.total_neto) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Resumen -->
          <div class="alert alert-success mt-3">
            <strong><i class="fas fa-check-circle"></i> Resumen:</strong>
            {{ obligaciones.length }} período(s) | 
            {{ totales.total_recibos }} recibos | 
            Total Neto: {{ formatNumber(totales.total_neto) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Area de impresión oculta -->
    <div id="area-impresion-obligaciones" style="display:none;">
      <div style="font-family: Arial; padding: 20px;">
        <h3>Obligaciones por Período</h3>
        <p><strong>Desde:</strong> {{ filtros.desde || 'N/A' }} | <strong>Hasta:</strong> {{ filtros.hasta || 'N/A' }}</p>
        <p class="text-muted small">Generado el {{ fechaHoraActual() }}</p>
        <table border="1" style="width:100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="padding:8px;">Período</th>
              <th style="padding:8px;">Inicio</th>
              <th style="padding:8px;">Fin</th>
              <th style="padding:8px;text-align:right;">Total Recibos</th>
              <th style="padding:8px;text-align:right;">Total Bruto</th>
              <th style="padding:8px;text-align:right;">Total Deducciones</th>
              <th style="padding:8px;text-align:right;">Total Neto</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="obl in obligaciones" :key="obl.periodo">
              <td style="padding:8px;">{{ obl.periodo }}</td>
              <td style="padding:8px;">{{ formatDate(obl.fecha_inicio) }}</td>
              <td style="padding:8px;">{{ formatDate(obl.fecha_fin) }}</td>
              <td style="padding:8px;text-align:right;">{{ obl.total_recibos }}</td>
              <td style="padding:8px;text-align:right;">{{ formatNumber(obl.total_bruto) }}</td>
              <td style="padding:8px;text-align:right;">{{ formatNumber(obl.total_deducciones) }}</td>
              <td style="padding:8px;text-align:right;">{{ formatNumber(obl.total_neto) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr style="font-weight:bold;">
              <td colspan="3" style="padding:8px;">TOTAL</td>
              <td style="padding:8px;text-align:right;">{{ totales.total_recibos }}</td>
              <td style="padding:8px;text-align:right;">{{ formatNumber(totales.total_bruto) }}</td>
              <td style="padding:8px;text-align:right;">{{ formatNumber(totales.total_deducciones) }}</td>
              <td style="padding:8px;text-align:right;">{{ formatNumber(totales.total_neto) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Obligaciones',
  data() {
    return {
      obligaciones: [],
      totales: {
        total_recibos: 0,
        total_bruto: 0,
        total_deducciones: 0,
        total_neto: 0
      },
      filtros: {
        desde: '',
        hasta: ''
      },
      cargando: false
    };
  },
  mounted() {
    // NO establecer fechas por defecto - mostrar todos los datos
    this.cargarObligaciones();
  },
  methods: {
    async cargarObligaciones() {
      this.cargando = true;
      try {
        const params = new URLSearchParams();
        if (this.filtros.desde) params.append('desde', this.filtros.desde);
        if (this.filtros.hasta) params.append('hasta', this.filtros.hasta);

        const response = await axios.get(`/api/obligaciones?${params.toString()}`);
        this.obligaciones = response.data.obligaciones || [];
        this.totales = response.data.totales || {
          total_recibos: 0,
          total_bruto: 0,
          total_deducciones: 0,
          total_neto: 0
        };
      } catch (error) {
        this.$toast.fire({ 
          icon: 'error', 
          title: 'Error al cargar obligaciones',
          text: error.response?.data?.message || error.message
        });
      } finally {
        this.cargando = false;
      }
    },
    imprimirObligaciones() {
      const contenido = document.getElementById('area-impresion-obligaciones').innerHTML;
      const ventana = window.open('', '_blank');
      ventana.document.write(`
        <html>
          <head>
            <title>Obligaciones por Período</title>
            <style>
              body { font-family: Arial; margin: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 8px; border: 1px solid #000; }
              th { background-color: #f0f0f0; }
              .text-right { text-align: right; }
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
    },
    fechaHoraActual() {
      const now = new Date();
      return now.toLocaleString('es-DO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>
