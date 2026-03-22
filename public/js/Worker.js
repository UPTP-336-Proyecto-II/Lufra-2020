/**
 * Worker.js - Modern implementation of the Worker Module for Laravel
 * This script overrides the legacy Sistema.js logic for workers.
 */

/**
 * Overrides the legacy worker module rendering
 * Defined globally to be available as soon as the script is parsed.
 */
window.renderWorkerModuleV2 = async function(name) {
    const contentDetails = document.getElementById('content-details');
    if (!contentDetails) return;

    const normalizedName = name.toLowerCase();

    if (normalizedName.includes('perfil')) {
        await renderProfile();
    } else if (normalizedName.includes('vacaciones')) {
        await renderVacations();
    } else if (normalizedName.includes('historial') || normalizedName.includes('recibo')) {
        await renderPayslipHistory();
    } else {
        contentDetails.innerHTML = `
            <div class="alert warn">
                <h4>Módulo en Construcción</h4>
                <p>El módulo '${name}' está siendo migrado al nuevo sistema.</p>
            </div>
        `;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('Worker Module V2 Initialized');
});

/**
 * Renders the Personal Data / Profile module
 */
async function renderProfile() {
    const container = document.getElementById('content-details');
    container.innerHTML = '<div class="loader-container"><p>Cargando información personal...</p></div>';

    try {
        const response = await fetch('/trabajador/profile-data', {
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Error al cargar el perfil');

        container.innerHTML = `
            <div class="profile-module fade-in">
                <div class="content-box">
                    <h4 style="margin-top: 0; color: var(--text-main); border-bottom: 2px solid var(--primary); padding-bottom: 10px;">👤 Mi Perfil Personal</h4>
                    
                    <div style="background: var(--card-bg); padding: 25px; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 10px 30px rgba(0,0,0,0.1); margin-top: 15px;">
                        <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 25px; border-bottom: 1px solid var(--border-color); padding-bottom: 15px;">
                            <div style="background: var(--primary); color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                                ${data.Nombre_Completo.charAt(0)}
                            </div>
                            <div>
                                <h5 style="margin: 0; color: var(--text-main); font-size: 1.4em;">${data.Nombre_Completo} ${data.Apellidos}</h5>
                                <p style="margin: 0; color: var(--text-muted); font-size: 0.9em;">Información registrada del trabajador</p>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
                            <div class="info-item" style="grid-column: 1; grid-row: 1; display: flex; flex-direction: column; gap: 15px;">
                                <div>
                                    <label style="display: block; font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; margin-bottom: 4px;">Cédula de Identidad</label>
                                    <div style="font-size: 1.1rem; color: var(--text-main); font-weight: 600;">${data.Documento_Identidad}</div>
                                </div>
                                <div>
                                    <label style="display: block; font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; margin-bottom: 4px;">Fecha de Ingreso</label>
                                    <div style="font-size: 1.1rem; color: var(--text-main); font-weight: 600;">${data.Fecha_de_Ingreso}</div>
                                </div>
                            </div>
                            <div class="info-item" style="grid-column: 2; grid-row: 1; display: flex; flex-direction: column; gap: 15px;">
                                <div>
                                    <label style="display: block; font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; margin-bottom: 4px;">Correo Electrónico</label>
                                    <div style="font-size: 1.1rem; color: var(--text-main); font-weight: 600; word-break: break-word;">${data.Correo || 'N/A'}</div>
                                </div>
                                <div>
                                    <label style="display: block; font-size: 0.75rem; text-transform: uppercase; color: var(--primary); font-weight: 700; margin-bottom: 4px;">Dirección de Habitación</label>
                                    <div style="font-size: 1.1rem; color: var(--text-main); font-weight: 600; word-break: break-word;">${data.Direccion || 'N/A'}</div>
                                </div>
                            </div>
                            <div class="info-item" style="grid-column: 3; grid-row: 1; grid-column-end: span 2;">
                                <label style="display: block; font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; margin-bottom: 4px;">Teléfono</label>
                                <div style="font-size: 1.1rem; color: var(--text-main); font-weight: 600;">${data.Telefono_Movil || 'N/A'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        container.innerHTML = `
            <div class="alert error">
                <h5 style="margin-top:0">Error de Conexión</h5>
                <p>${error.message}</p>
                <button class="btn btn-sm" onclick="renderWorkerModuleV2('Mi Perfil')">Reintentar</button>
            </div>
        `;
    }
}

/**
 * Renders the Vacation Request module
 */
async function renderVacations() {
    const container = document.getElementById('content-details');
    container.innerHTML = '<div class="loader-container"><p>Verificando estatus de vacaciones...</p></div>';

    try {
        const response = await fetch('/trabajador/vacations-data', {
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Error al obtener datos de vacaciones');

        let statusHtml = '';
        let formHtml = '';

        // Check seniority (legacy logic carried over)
        const ingreso = new Date(data.fechaIngreso);
        const now = new Date();
        const years = (now - ingreso) / (1000 * 60 * 60 * 24 * 365.25);

        if (years < 1) {
            statusHtml = `
                <div class="alert info">
                    <h5>Aviso de Antigüedad</h5>
                    <p>Podrás solicitar vacaciones después de cumplir tu primer año (Fecha ingreso: ${data.fechaIngreso}).</p>
                </div>
            `;
        } else if (data.lastRequest && data.lastRequest.Estado === 'Pendiente') {
            statusHtml = `
                <div class="alert warn fade-in">
                    <h5 style="margin-top:0;">Solicitud en Trámite</h5>
                    <p>Ya tienes una solicitud pendiente para el <strong>${data.lastRequest.Fecha_Inicio_Vacaciones}</strong>. Por favor espera la respuesta del administrador.</p>
                </div>
            `;
        } else if (data.lastRequest && data.lastRequest.Estado === 'Aceptada') {
            statusHtml = `
                <div class="alert success fade-in">
                    <h5 style="margin-top:0;">¡Vacaciones Aprobadas!</h5>
                    <p>!Tus vacaciones han sido aprobadas!</p>
                </div>
            `;
        } else if (data.lastRequest && data.lastRequest.Estado === 'Rechazada') {
            const motivo = data.lastRequest.motivo_rechazo ? `<p><strong>Motivo del rechazo:</strong> ${data.lastRequest.motivo_rechazo}</p>` : '';
            statusHtml = `
                <div class="alert error fade-in">
                    <h5 style="margin-top:0;">Solicitud Rechazada</h5>
                    <p>Tu solicitud de vacaciones ha sido rechazada.</p>
                    ${motivo}
                    <p>Puedes enviar una nueva solicitud.</p>
                </div>
            `;
            formHtml = `
                <div style="background: var(--card-bg); padding: 25px; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <h5 style="margin-top: 0; margin-bottom: 1.5rem; color: var(--text-main);">Nueva Solicitud</h5>
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--text-main);">¿Cuándo deseas comenzar tus vacaciones?</label>
                        <input type="date" id="vac-start-date" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-color); color: var(--text-main);">
                    </div>
                    <button id="btn-submit-vac" class="primary" style="width: 100%; padding: 15px; font-weight: bold;">
                        Enviar Solicitud al Administrador
                    </button>
                </div>
            `;
        } else {
            formHtml = `
                <div style="background: var(--card-bg); padding: 25px; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <h5 style="margin-top: 0; margin-bottom: 1.5rem; color: var(--text-main);">Nueva Solicitud</h5>
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--text-main);">¿Cuándo deseas comenzar tus vacaciones?</label>
                        <input type="date" id="vac-start-date" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-color); color: var(--text-main);">
                    </div>
                    <button id="btn-submit-vac" class="primary" style="width: 100%; padding: 15px; font-weight: bold;">
                        Enviar Solicitud al Administrador
                    </button>
                </div>
            `;
        }

    container.innerHTML = `
        <div class="vacations-module fade-in">
            <div class="content-box">
                <h4 style="margin-top: 0; color: var(--text-main); border-bottom: 2px solid var(--primary); padding-bottom: 10px;">🏖️ Solicitud de Vacaciones</h4>
                
                <div style="margin-top: 15px;">
                    ${statusHtml}
                    ${formHtml}
                </div>
            </div>
        </div>
    `;

        if (document.getElementById('btn-submit-vac')) {
            document.getElementById('btn-submit-vac').addEventListener('click', submitVacationRequest);
        }

    } catch (error) {
        container.innerHTML = `<div class="alert error"><p>${error.message}</p></div>`;
    }
}

async function submitVacationRequest() {
    const dateInput = document.getElementById('vac-start-date');
    const startDate = dateInput.value;

    if (!startDate) {
        showError('Por favor selecciona una fecha de inicio.');
        return;
    }

    try {
        const response = await fetch('/trabajador/vacations-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({ startDate })
        });

        const result = await response.json();

        if (response.ok) {
            showSuccess('¡Solicitud enviada exitosamente!');
            renderVacations();
        } else {
            showError(result.error || 'Debes escoger una fecha futura para tus vacaciones');
        }
    } catch (error) {
        showError('Error de conexión con el servidor.');
    }
}

/**
 * Renders the Payslip History module
 */
async function renderPayslipHistory() {
    const container = document.getElementById('content-details');
    container.innerHTML = '<div class="loader-container"><p>Cargando historial de pagos...</p></div>';

    try {
        const response = await fetch('/trabajador/payslips-data', {
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'No se pudieron cargar los recibos');

        if (data.length === 0) {
            container.innerHTML = `
                <div class="payslip-module">
                    <h4 style="color: var(--text-main); border-bottom: 2px solid var(--primary); padding-bottom: 10px;">💰 Historial de Recibos</h4>
                    <div class="alert info"><p>No se encontraron recibos de pago registrados en tu historial.</p></div>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="payslip-module fade-in">
                <div class="content-box">
                    <h4 style="margin-top: 0; color: var(--text-main); border-bottom: 2px solid var(--primary); padding-bottom: 10px;">💰 Historial de Recibos de Pago</h4>
                    
                    <div style="margin-top: 20px; border-radius: 12px; border: 1px solid var(--border-color); overflow: hidden; background: transparent;">
                        <table class="data-table" style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background-color: var(--primary); color: white;">
                                    <th style="padding: 12px; border: 1px solid var(--border-color);">Fecha de Pago</th>
                                    <th style="padding: 12px; border: 1px solid var(--border-color);">Período</th>
                                    <th style="padding: 12px; border: 1px solid var(--border-color);">Monto Neto</th>
                                    <th style="padding: 12px; border: 1px solid var(--border-color);">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.map(p => `
                                    <tr style="border-bottom: 1px solid var(--border-color);">
                                        <td style="padding: 12px; border: 1px solid var(--border-color); color: var(--text-main);">${p.fechaPago}</td>
                                        <td style="padding: 12px; border: 1px solid var(--border-color); color: var(--text-main);">${p.periodo}</td>
                                        <td style="padding: 12px; border: 1px solid var(--border-color); font-weight: bold; color: var(--text-main);">Bs. ${p.neto}</td>
                                        <td style="padding: 12px; border: 1px solid var(--border-color);" class="center">
                                            <a href="/trabajador/payslip/${p.id}" target="_blank" class="primary small" style="text-decoration: none; padding: 8px 18px; border-radius: 8px; font-weight:600;">
                                                Descargar PDF
                                            </a>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        container.innerHTML = `<div class="alert error"><p>${error.message}</p></div>`;
    }
}
