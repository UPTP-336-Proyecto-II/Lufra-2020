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
    } else if (normalizedName.includes('permiso')) {
        await renderPermissionRequests();
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

        if (response.status === 401 || response.status === 419) {
            window.location.href = '/login';
            return;
        }

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
                                    <div style="font-size: 1.1rem; color: var(--text-main); font-weight: 600;">${formatLocalDate(data.Fecha_de_Ingreso)}</div>
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
                            <div class="info-item" style="grid-column: 3; grid-row: 1; grid-column-end: span 2; display: flex; flex-direction: column; gap: 15px;">
                                <div>
                                    <label style="display: block; font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; margin-bottom: 4px;">Cargo Asignado</label>
                                    <div style="font-size: 1.1rem; color: var(--text-main); font-weight: 600;">
                                        ${data.Cargo || data.Nombre_profesión || (data.cargo && (data.cargo.Nombre_profesión || data.cargo.Nombre)) || 'No asignado'}
                                    </div>
                                </div>
                                <div>
                                    <label style="display: block; font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; margin-bottom: 4px;">Teléfono</label>
                                    <div style="font-size: 1.1rem; color: var(--text-main); font-weight: 600;">${data.Telefono_Movil || 'N/A'}</div>
                                </div>
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
    console.log('renderVacations called');
    const container = document.getElementById('content-details');
    container.innerHTML = '<div class="loader-container"><p>Verificando estatus de vacaciones...</p></div>';

    try {
        const response = await fetch('/trabajador/vacations-data', {
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();

        if (response.status === 401 || response.status === 419) {
            window.location.href = '/login';
            return;
        }

        if (!response.ok) throw new Error(data.error || 'Error al obtener datos de vacaciones');

        // Detectar cambio de fecha de ingreso para reiniciar el aviso si es necesario
        const lastDate = localStorage.getItem('vacationLastSeenHireDate');
        if (lastDate && lastDate !== data.fechaIngreso) {
            localStorage.removeItem('vacationNoticeDismissed');
            localStorage.removeItem('vacationRequestSent');
        }
        localStorage.setItem('vacationLastSeenHireDate', data.fechaIngreso);

        // Reset alreadySubmitted if last request was rejected
        if (data.lastRequest && data.lastRequest.Estado === 'Rechazada') {
            localStorage.removeItem('vacationRequestSent');
        }

        let statusHtml = '';
        let formHtml = '';

        // Check seniority (legacy logic carried over)
        const ingreso = parseLocalDateValue(data.fechaIngreso);
        const now = new Date();
        const years = ingreso ? (now - ingreso) / (1000 * 60 * 60 * 24 * 365.25) : 0;

        // Lógica de expiración (si es Pendiente y ya pasó la fecha de inicio)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const requestStart = data.lastRequest ? parseLocalDateValue(data.lastRequest.Fecha_Inicio_Vacaciones) : null;
        const isExpired = data.lastRequest && data.lastRequest.Estado === 'Pendiente' && requestStart && requestStart < today;

        const noActiveRequest = !data.lastRequest || isExpired || !['Pendiente', 'Aceptada'].includes(data.lastRequest.Estado);
        const alreadySubmitted = localStorage.getItem('vacationRequestSent') === 'true';
        const isDismissed = localStorage.getItem('vacationNoticeDismissed') === 'true';

        console.log('Render vacations - years:', years, 'noActiveRequest:', noActiveRequest, 'isExpired:', isExpired);

        if (years < 1) {
            statusHtml = `
                <div class="alert info" style="border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); display: flex; align-items: center; gap: 15px; padding: 20px;">
                    <i class="fas fa-info-circle" style="font-size: 2em; color: var(--primary);"></i>
                    <div>
                        <h5 style="margin:0 0 5px 0; font-size: 1.1em;">Aviso de Antigüedad</h5>
                        <p style="margin:0; font-size: 0.95em;">Podrás solicitar vacaciones después de cumplir tu primer año (Fecha ingreso: <strong>${formatLocalDate(data.fechaIngreso)}</strong>).</p>
                    </div>
                </div>
            `;
        } else if (isExpired) {
            statusHtml = `
                <div class="alert info fade-in" style="border-color:#64748b; background: rgba(148, 163, 184, 0.15); color: #475569; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); display: flex; align-items: center; gap: 15px; padding: 20px; width: fit-content;">
                    <i class="fas fa-history" style="font-size: 2em; color: #64748b;"></i>
                    <div>
                        <h5 style="margin:0 0 5px 0; font-size: 1.1em;">Solicitud Expirada</h5>
                        <p style="margin:0; font-size: 0.95em;">Tu última solicitud no fue respondida a tiempo. Puedes enviar otra solicitud.</p>
                    </div>
                </div>
            `;
            formHtml = `
                <div style="background: var(--card-bg); padding: 25px; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 10px;">
                        <h5 style="margin: 0; color: var(--text-main); font-weight: 600;">Nueva Solicitud</h5>
                        <button id="btn-view-periods" class="btn" style="padding: 6px 12px; font-size: 0.8rem; font-weight: 600; background: rgba(0,0,0,0.03); color: var(--text-main); border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; transition: background 0.2s;">
                            📅 Ver períodos disponibles
                        </button>
                    </div>
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--text-main);">¿Cuándo deseas comenzar tus vacaciones? <span style="color:#e74c3c;">*</span></label>
                        <input type="date" id="vac-start-date" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-color); color: var(--text-main);">
                    </div>
                    <button id="btn-submit-vac" class="primary" style="width: 100%; padding: 15px; font-weight: bold;">
                        Enviar Solicitud al Administrador
                    </button>
                </div>
            `;
        } else if (data.lastRequest && data.lastRequest.Estado === 'Pendiente') {
            statusHtml = `
                <div class="alert warn fade-in" style="border-radius: 10px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.15); display: flex; align-items: center; gap: 15px; padding: 20px; width: fit-content;">
                    <i class="fas fa-hourglass-half" style="font-size: 2em; color: #f59e0b;"></i>
                    <div>
                        <h5 style="margin:0 0 5px 0; font-size: 1.1em;">Solicitud en Trámite</h5>
                        <p style="margin:0; font-size: 0.95em;">Ya tienes una solicitud pendiente para el <strong>${formatLocalDate(data.lastRequest.Fecha_Inicio_Vacaciones)}</strong>. Por favor espera la respuesta del administrador.</p>
                    </div>
                </div>
            `;
            formHtml = `
                <div style="background: var(--card-bg); padding: 25px; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 10px 30px rgba(0,0,0,0.1); opacity: 0.6; pointer-events: none;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 10px;">
                        <h5 style="margin: 0; color: var(--text-main); font-weight: 600;">Nueva Solicitud (Bloqueada)</h5>
                        <button id="btn-view-periods" class="btn" style="padding: 6px 12px; font-size: 0.8rem; font-weight: 600; background: rgba(0,0,0,0.03); color: var(--text-main); border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; transition: background 0.2s; pointer-events: auto;">
                            📅 Ver períodos disponibles
                        </button>
                    </div>
                    <div style="margin-bottom: 15px; padding: 10px; background: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; color: #b45309; font-size: 0.9em; font-weight: 500; border-radius: 0 4px 4px 0;">
                        <i class="fas fa-exclamation-triangle"></i> Aún no puedes realizar una nueva solicitud de vacaciones.
                    </div>
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--text-main);">¿Cuándo deseas comenzar tus vacaciones? <span style="color:#e74c3c;">*</span></label>
                        <input type="date" disabled style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-color); color: var(--text-main);">
                    </div>
                    <button disabled class="primary" style="width: 100%; padding: 15px; font-weight: bold; background: var(--text-muted); cursor: not-allowed;">
                        Enviar Solicitud al Administrador
                    </button>
                </div>
            `;
        } else if (data.lastRequest && data.lastRequest.Estado === 'Aceptada') {
            statusHtml = `
                <div class="alert success fade-in" style="border-color:#34d399; background: rgba(167, 243, 208, 0.25); color: #065f46; border-radius: 10px; box-shadow: 0 4px 15px rgba(52, 211, 153, 0.15); display: flex; align-items: center; gap: 15px; padding: 20px; width: fit-content;">
                    <i class="fas fa-check-circle" style="font-size: 2em; color: #10b981;"></i>
                    <div>
                        <h5 style="margin:0 0 5px 0; font-size: 1.1em;">¡Vacaciones Aprobadas!</h5>
                        <p style="margin:0; font-size: 0.95em;">¡Tus vacaciones han sido aprobadas!</p>
                    </div>
                </div>
            `;
            formHtml = `
                <div style="background: var(--card-bg); padding: 25px; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 10px 30px rgba(0,0,0,0.1); opacity: 0.6; pointer-events: none;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 10px;">
                        <h5 style="margin: 0; color: var(--text-main); font-weight: 600;">Nueva Solicitud (Bloqueada)</h5>
                        <button id="btn-view-periods" class="btn" style="padding: 6px 12px; font-size: 0.8rem; font-weight: 600; background: rgba(0,0,0,0.03); color: var(--text-main); border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; transition: background 0.2s; pointer-events: auto;">
                            📅 Ver períodos disponibles
                        </button>
                    </div>
                    <div style="margin-bottom: 15px; padding: 10px; background: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; color: #b45309; font-size: 0.9em; font-weight: 500; border-radius: 0 4px 4px 0;">
                        <i class="fas fa-exclamation-triangle"></i> Aún no puedes realizar una nueva solicitud de vacaciones.
                    </div>
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--text-main);">¿Cuándo deseas comenzar tus vacaciones? <span style="color:#e74c3c;">*</span></label>
                        <input type="date" disabled style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-color); color: var(--text-main);">
                    </div>
                    <button disabled class="primary" style="width: 100%; padding: 15px; font-weight: bold; background: var(--text-muted); cursor: not-allowed;">
                        Enviar Solicitud al Administrador
                    </button>
                </div>
            `;
        } else if (data.lastRequest && data.lastRequest.Estado === 'Rechazada') {
            const motivoText = data.lastRequest.motivo_rechazo;
            statusHtml = `
                <div class="alert error fade-in" style="border-color:#f87171; background: rgba(254, 202, 202, 0.25); color: #991b1b; border-radius: 10px; box-shadow: 0 4px 15px rgba(248, 113, 113, 0.15); display: flex; align-items: flex-start; gap: 15px; padding: 20px; width: fit-content;">
                    <i class="fas fa-times-circle" style="font-size: 2.2em; color: #ef4444; margin-top: 2px;"></i>
                    <div>
                        <h5 style="margin:0 0 5px 0; font-size: 1.1em;">Solicitud Rechazada</h5>
                        <p style="margin:0 0 8px 0; font-size: 0.95em;">Tu última solicitud ha sido rechazada.</p>
                        ${motivoText ? `
                            <div style="margin-bottom: 8px;">
                                <span class="view-reason-modal-btn" data-reason="${motivoText}" style="cursor:pointer; text-decoration:underline; font-weight:600; font-size:0.9em; display:inline-block; color: #b91c1c;">
                                    Ver motivo del rechazo
                                </span>
                            </div>
                        ` : ''}
                        <p style="margin:0; font-size: 0.9em; opacity: 0.9;">Puedes enviar una nueva solicitud.</p>
                    </div>
                </div>
            `;
            formHtml = `
                <div style="background: var(--card-bg); padding: 25px; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 10px;">
                        <h5 style="margin: 0; color: var(--text-main); font-weight: 600;">Nueva Solicitud</h5>
                        <button id="btn-view-periods" class="btn" style="padding: 6px 12px; font-size: 0.8rem; font-weight: 600; background: rgba(0,0,0,0.03); color: var(--text-main); border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; transition: background 0.2s;">
                            📅 Ver períodos disponibles
                        </button>
                    </div>
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--text-main);">¿Cuándo deseas comenzar tus vacaciones? <span style="color:#e74c3c;">*</span></label>
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
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 10px;">
                        <h5 style="margin: 0; color: var(--text-main); font-weight: 600;">Nueva Solicitud</h5>
                        <button id="btn-view-periods" class="btn" style="padding: 6px 12px; font-size: 0.8rem; font-weight: 600; background: rgba(0,0,0,0.03); color: var(--text-main); border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; transition: background 0.2s;">
                            📅 Ver períodos disponibles
                        </button>
                    </div>
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--text-main);">¿Cuándo deseas comenzar tus vacaciones? <span style="color:#e74c3c;">*</span></label>
                        <input type="date" id="vac-start-date" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-color); color: var(--text-main);">
                    </div>
                    <button id="btn-submit-vac" class="primary" style="width: 100%; padding: 15px; font-weight: bold;">
                        Enviar Solicitud al Administrador
                    </button>
                </div>
            `;
        }

        let historySectionHtml = '';
        if (data.allRequests && data.allRequests.length > 0) {
            historySectionHtml = `
                <div class="content-box" style="margin-top: 30px;">
                    <h4 style="margin-top: 0; color: var(--text-main); border-bottom: 2px solid var(--primary); padding-bottom: 10px;">Historial de Solicitudes</h4>
                    
                    <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
                        <select id="hist-filter-status" style="padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                            <option value="">Todos los Estados</option>
                            <option value="Aceptada">Aceptada</option>
                            <option value="Rechazada">Rechazada</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Expirada">Expirada</option>
                        </select>
                        <input type="date" id="hist-filter-date" style="padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);" title="Filtrar por fecha de inicio">
                    </div>

                    <div id="worker-vacation-history-container">
                        <!-- Table rendered via JS -->
                    </div>
                </div>
            `;
        }

    container.innerHTML = `
        <div class="vacations-module fade-in">
            <div class="tabs" style="display: flex; gap: 8px; margin-bottom: 28px; background: rgba(0,0,0,0.04); padding: 6px; border-radius: 14px; width: fit-content; box-shadow: inset 0 1px 3px rgba(0,0,0,0.08);">
                <button class="vac-tab-btn active" data-tab="solicitudes" style="
                    padding: 10px 28px; border: none;
                    background: var(--primary);
                    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
                    color: white; border-radius: 10px; font-weight: 700; cursor: pointer;
                    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
                    box-shadow: 0 4px 14px rgba(0,0,0,0.18);
                    display: inline-flex; align-items: center; gap: 8px; font-size: 0.95rem; letter-spacing: 0.3px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                    Solicitudes
                </button>
                <button class="vac-tab-btn" data-tab="pagos" style="
                    padding: 10px 28px; border: none;
                    background: transparent; color: var(--text-muted);
                    border-radius: 10px; font-weight: 700; cursor: pointer;
                    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
                    display: inline-flex; align-items: center; gap: 8px; font-size: 0.95rem; letter-spacing: 0.3px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                    Pagos
                </button>
            </div>

            <div id="tab-solicitudes" class="vac-tab-content">
                <div class="content-box">
                    <h4 style="margin-top: 0; color: var(--text-main); border-bottom: 2px solid var(--primary); padding-bottom: 10px;">🏖️ Solicitud de Vacaciones</h4>
                    
                    <div style="margin-top: 15px; display: flex; flex-direction: column; gap: 20px;">
                        ${statusHtml}
                        ${formHtml}
                    </div>
                </div>
                ${historySectionHtml}
            </div>

            <div id="tab-pagos" class="vac-tab-content" style="display: none;">
                <div class="content-box">
                    <h4 style="margin-top: 0; color: var(--text-main); border-bottom: 2px solid var(--primary); padding-bottom: 10px;">🏖️ Historial de Pagos de Vacaciones</h4>
                    <div id="worker-vac-payments-container" style="margin-top: 20px;">
                        <!-- Payment list is rendered dynamically -->
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal para Motivo de Rechazo -->
        <div id="rejection-reason-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000; justify-content:center; align-items:center; opacity:0; transition:opacity 0.3s;">
            <div style="background:var(--card-bg); width:90%; max-width:400px; padding:25px; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.2); transform:translateY(-20px); transition:transform 0.3s;">
                <h4 style="margin-top:0; color:var(--error-color); border-bottom:1px solid var(--border-color); padding-bottom:10px;"><i class="fas fa-exclamation-circle"></i> Motivo del Rechazo</h4>
                <p id="rejection-modal-text" style="color:var(--text-main); font-size:0.95em; line-height:1.5; margin-top:15px; margin-bottom:25px;"></p>
                <div style="text-align:right;">
                    <button id="close-rejection-modal" class="primary" style="padding:10px 20px; font-weight:bold; border-radius:8px;">Cerrar</button>
                </div>
            </div>
        </div>

        <!-- Modal de Periodos Disponibles -->
        <div id="periods-available-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15, 23, 42, 0.45); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index:10000; justify-content:center; align-items:center; opacity:0; transition:opacity 0.3s ease;">
            <div style="background:var(--card-bg); width:92%; max-width:440px; padding:30px; border-radius:20px; border: 1px solid var(--border-color); box-shadow:0 20px 50px rgba(0,0,0,0.15); transform:translateY(-20px); transition:transform 0.3s ease; color: var(--text-main);">
                <h4 style="margin-top:0; color:var(--text-main); border-bottom:2px solid var(--primary); padding-bottom:12px; font-weight:700; display:flex; align-items:center; gap:8px;">
                    📅 Períodos Vacacionales
                </h4>
                
                <!-- Contenido de Períodos -->
                <div id="periods-list-container" style="margin-top:20px; display:flex; flex-direction:column; gap:12px; max-height:240px; overflow-y:auto; padding-right:5px;">
                    <!-- Aquí se inyectan los periodos -->
                </div>
                
                <!-- Cuadrito del próximo periodo vacacional -->
                <div id="next-period-box" style="margin-top:25px; padding:15px; border-radius:12px; border:1px solid var(--border-color); font-size:0.9em;">
                    <!-- Aquí se inyecta el próximo periodo -->
                </div>

                <div style="text-align:right; margin-top:25px;">
                    <button id="close-periods-modal" class="primary" style="padding:10px 24px; font-weight:bold; border-radius:8px; cursor:pointer;">Cerrar</button>
                </div>
            </div>
        </div>
    `;

    // Tab switching logic for Worker vacations
    const tabBtns = container.querySelectorAll('.vac-tab-btn');
    const tabContents = container.querySelectorAll('.vac-tab-content');

    function applyTabActiveStyle(btn, isActive) {
        if (isActive) {
            btn.style.background = 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)';
            btn.style.color = 'white';
            btn.style.boxShadow = '0 4px 14px rgba(0,0,0,0.18)';
            btn.classList.add('active');
        } else {
            btn.style.background = 'transparent';
            btn.style.color = 'var(--text-muted)';
            btn.style.boxShadow = 'none';
            btn.classList.remove('active');
        }
    }

    async function loadWorkerVacationPayments() {
        const payContainer = container.querySelector('#worker-vac-payments-container');
        if (!payContainer) return;
        payContainer.innerHTML = '<div class="loader">Cargando pagos...</div>';
        try {
            const response = await fetch('/trabajador/vacation-payments-data', {
                headers: { 'Accept': 'application/json' }
            });
            const payments = await response.json();
            if (!payments.length) {
                payContainer.innerHTML = '<p style="color:var(--text-muted); text-align:center; font-style:italic; padding:20px;">No tienes pagos de vacaciones registrados.</p>';
                return;
            }

            payContainer.innerHTML = `
                <div style="background: var(--card-bg); border-radius: 12px; border: 1px solid var(--border-color); overflow: hidden; margin-top: 15px;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.93rem;">
                        <thead>
                            <tr style="background: var(--primary); color: white;">
                                <th style="padding: 12px 16px; text-align: left; font-weight:600;">Fecha de Pago</th>
                                <th style="padding: 12px 16px; text-align: center; font-weight:600;">Período</th>
                                <th style="padding: 12px 16px; text-align: right; font-weight:600;">Monto Neto</th>
                                <th style="padding: 12px 16px; text-align: center; font-weight:600;">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${payments.map(p => `
                                <tr style="border-bottom: 1px solid var(--border-color);">
                                    <td style="padding:12px 16px; color:var(--text-main); font-weight:600;">${formatLocalDate(p.fechaPago)}</td>
                                    <td style="padding:12px 16px; color:var(--text-main); text-align:center;">${p.periodo}</td>
                                    <td style="padding:12px 16px; text-align:right; color:var(--success-color, #166534); font-weight:700; font-family:monospace;">Bs. ${parseFloat(p.neto).toFixed(2)}</td>
                                    <td style="padding:12px 16px; text-align:center;">
                                        <a href="/trabajador/vacation-payments/payslip/${p.id}" target="_blank" rel="noopener" style="text-decoration: none; padding: 8px 18px; border-radius: 8px; font-weight:600; background: var(--primary); color: white; display:inline-block; font-size:0.88rem;">Previsualizar recibo</a>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } catch(e) {
            payContainer.innerHTML = `<div class="error">Error al cargar pagos: ${e.message}</div>`;
        }
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            tabBtns.forEach(b => applyTabActiveStyle(b, false));
            tabContents.forEach(c => c.style.display = 'none');
            applyTabActiveStyle(btn, true);
            const targetId = `tab-${btn.dataset.tab}`;
            const targetEl = container.querySelector(`#${targetId}`);
            if (targetEl) targetEl.style.display = 'block';

            if (btn.dataset.tab === 'pagos') {
                loadWorkerVacationPayments();
            }
        });
    });

    if (document.getElementById('btn-submit-vac')) {
        document.getElementById('btn-submit-vac').addEventListener('click', submitVacationRequest);
    }

    const viewPeriodsBtn = document.getElementById('btn-view-periods');
    if (viewPeriodsBtn) {
        viewPeriodsBtn.addEventListener('click', () => showPeriodsModal(data));
    }

        // Lógica del Modal de Rechazo
        const rejectionModal = document.getElementById('rejection-reason-modal');
        const modalText = document.getElementById('rejection-modal-text');
        const closeModalBtn = document.getElementById('close-rejection-modal');

        const openModal = (reason) => {
            modalText.textContent = reason;
            rejectionModal.style.display = 'flex';
            setTimeout(() => {
                rejectionModal.style.opacity = '1';
                rejectionModal.children[0].style.transform = 'translateY(0)';
            }, 10);
        };

        const closeModal = () => {
            rejectionModal.style.opacity = '0';
            rejectionModal.children[0].style.transform = 'translateY(-20px)';
            setTimeout(() => {
                rejectionModal.style.display = 'none';
            }, 300);
        };

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }

        // Event listener principal para abrir modal
        document.querySelectorAll('.view-reason-modal-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                openModal(this.getAttribute('data-reason'));
            });
        });

        // Lógica del historial
        if (data.allRequests && data.allRequests.length > 0) {
            const histContainer = document.getElementById('worker-vacation-history-container');
            const fStatus = document.getElementById('hist-filter-status');
            const fDate = document.getElementById('hist-filter-date');

            const renderHistory = () => {
                const sVal = fStatus.value;
                const dVal = fDate.value;

                const filtered = data.allRequests.filter(r => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const startDate = new Date(r.Fecha_Inicio_Vacaciones);
                    const isExp = r.Estado === 'Pendiente' && startDate < today;
                    const estadoFinal = isExp ? 'Expirada' : r.Estado;

                    if (sVal && estadoFinal !== sVal) return false;
                    if (dVal && r.Fecha_Inicio_Vacaciones !== dVal) return false;
                    return true;
                });

                if (!filtered.length) {
                    histContainer.innerHTML = '<p style="color:var(--text-muted); padding:20px; text-align:center;">No se encontraron solicitudes con estos filtros.</p>';
                    return;
                }

                histContainer.innerHTML = `
                    <div style="overflow-x:auto;">
                        <table class="data-table" style="width: 100%; border-collapse: collapse; min-width: 600px;">
                            <thead>
                                <tr style="background-color: var(--primary); color: white;">
                                    <th style="padding: 12px; border: 1px solid var(--border-color); text-align: left;">Fecha de Solicitud</th>
                                    <th style="padding: 12px; border: 1px solid var(--border-color); text-align: left;">Inicio Solicitado</th>
                                    <th style="padding: 12px; border: 1px solid var(--border-color); text-align: left;">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${filtered.map((r, i) => {
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const startDate = new Date(r.Fecha_Inicio_Vacaciones);
                                    const isExpired = r.Estado === 'Pendiente' && startDate < today;
                                    const estadoFinal = isExpired ? 'Expirada' : r.Estado;
                                    const bgColor = isExpired ? '#94a3b8' : (r.Estado === 'Aceptada' ? 'var(--success-color)' : r.Estado === 'Rechazada' ? 'var(--error-color)' : 'var(--text-muted)');
                                    
                                    return `
                                    <tr style="border-bottom: 1px solid var(--border-color);">
                                        <td style="padding: 12px; border: 1px solid var(--border-color); color: var(--text-main);">${formatLocalDate(r.Fecha_Solicitud)}</td>
                                        <td style="padding: 12px; border: 1px solid var(--border-color); color: var(--text-main); font-weight: 500;">${formatLocalDate(r.Fecha_Inicio_Vacaciones)}</td>
                                        <td style="padding: 12px; border: 1px solid var(--border-color);">
                                            <span style="padding: 6px 14px; border-radius: 20px; font-size: 0.8em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; color: white; background-color: ${bgColor};">
                                                ${estadoFinal}
                                            </span>
                                            ${estadoFinal === 'Rechazada' && r.motivo_rechazo ? `
                                                <div style="margin-top: 8px;">
                                                    <span class="view-reason-modal-btn" data-reason="${r.motivo_rechazo}" style="cursor:pointer; text-decoration:underline; font-weight:600; font-size:0.85em; color: var(--error-color);">
                                                        Ver motivo del rechazo
                                                    </span>
                                                </div>
                                            ` : ''}
                                        </td>
                                    </tr>`;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                `;

                // Re-bind listeners for the history modal buttons
                document.querySelectorAll('.view-reason-modal-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        openModal(this.getAttribute('data-reason'));
                    });
                });
            };

            fStatus.addEventListener('change', renderHistory);
            fDate.addEventListener('change', renderHistory);

            // Render inicial
            renderHistory();
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
            localStorage.setItem('vacationRequestSent', 'true');
            localStorage.removeItem('vacationNoticeSeen');
            if (typeof window.updateVacationBadge === 'function') {
                window.updateVacationBadge();
            }
            showSuccess('¡Solicitud enviada exitosamente!');
            renderVacations();
        } else {
            showError(result.error || 'Debes escoger una fecha futura para tus vacaciones');
        }
    } catch (error) {
        showError('Error de conexión con el servidor.');
    }
}

function showPeriodsModal(data) {
    const modal = document.getElementById('periods-available-modal');
    const listContainer = document.getElementById('periods-list-container');
    const nextBox = document.getElementById('next-period-box');
    const closeBtn = document.getElementById('close-periods-modal');

    if (!modal || !listContainer || !nextBox || !closeBtn) return;

    // 1. Calculate periods from hire date
    const hireDate = parseLocalDateValue(data.fechaIngreso);
    const today = new Date();
    const hireYear = hireDate ? hireDate.getFullYear() : today.getFullYear();
    const hireMonth = hireDate ? hireDate.getMonth() : today.getMonth();
    const hireDay = hireDate ? hireDate.getDate() : today.getDate();
    const currentYear = today.getFullYear();

    // Count completed anniversary periods
    let completedPeriodsCount = currentYear - hireYear;
    const anniversaryThisYear = new Date(currentYear, hireMonth, hireDay);
    if (today < anniversaryThisYear) {
        completedPeriodsCount--;
    }
    if (completedPeriodsCount < 0) completedPeriodsCount = 0;

    // Build a helper to check if a request date falls within a period's anniversary range
    // Period i: from anniversary(hireYear+i) to anniversary(hireYear+i+1)
    function getAnniversaryDate(yearOffset) {
        return new Date(hireYear + yearOffset, hireMonth, hireDay);
    }

    // Collect ALL requests (not just active) to determine period statuses correctly
    const allRequests = (data.allRequests || []);



    // Sequential assignment: accepted requests consume periods from oldest to newest,
    // then pending requests consume the next available period
    // Expired pendings (start date < today) don't count
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    // Separate requests by status
    const acceptedRequests = allRequests
        .filter(r => r.Estado === 'Aceptada')
        .sort((a, b) => parseLocalDateValue(a.Fecha_Inicio_Vacaciones) - parseLocalDateValue(b.Fecha_Inicio_Vacaciones));

    const pendingRequests = allRequests
        .filter(r => r.Estado === 'Pendiente' && parseLocalDateValue(r.Fecha_Inicio_Vacaciones) >= todayMidnight)
        .sort((a, b) => parseLocalDateValue(a.Fecha_Inicio_Vacaciones) - parseLocalDateValue(b.Fecha_Inicio_Vacaciones));

    // Assign statuses sequentially:
    // First, accepted requests fill periods from the oldest
    // Then, pending requests fill the next available
    let periods = [];
    let acceptedUsed = 0;
    let pendingUsed = 0;

    for (let i = 0; i < completedPeriodsCount; i++) {
        const startY = hireYear + i;
        const endY = hireYear + i + 1;
        const pName = `${startY} - ${endY}`;

        let status = 'Disponible'; // default: not enjoyed, not requested (red X)

        if (acceptedUsed < acceptedRequests.length) {
            // This period is covered by an accepted request
            status = 'Aceptada';
            acceptedUsed++;
        } else if (pendingUsed < pendingRequests.length) {
            // This period has a pending request
            status = 'Pendiente';
            pendingUsed++;
        }

        periods.push({ name: pName, status });
    }

    // Icons
    const checkIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    const pendingIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="none" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"></circle></svg>`;
    const availableIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;

    // Build HTML for each period
    let html = '';
    for (let i = 0; i < periods.length; i++) {
        const p = periods[i];
        let icon, text, color, bgTint;

        if (p.status === 'Aceptada') {
            icon = checkIcon;
            text = 'Disfrutado';
            color = '#10b981';
            bgTint = 'rgba(16, 185, 129, 0.04)';
        } else if (p.status === 'Pendiente') {
            icon = pendingIcon;
            text = 'Pendiente';
            color = '#f59e0b';
            bgTint = 'rgba(245, 158, 11, 0.06)';
        } else {
            icon = availableIcon;
            text = 'Sin disfrutar';
            color = '#ef4444';
            bgTint = 'rgba(239, 68, 68, 0.03)';
        }

        html += `
            <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:${bgTint}; border-radius:10px; border:1px solid var(--border-color); gap: 10px; transition: background 0.2s;">
                <span style="font-weight:600; font-size:0.95rem; color: var(--text-main);">${p.name}</span>
                <span style="display:inline-flex; align-items:center; gap:6px;">
                    ${icon}
                    <small style="font-size:0.8rem; font-weight:700; color: ${color}; text-transform: uppercase;">${text}</small>
                </span>
            </div>
        `;
    }

    if (completedPeriodsCount === 0) {
        html = `<p style="text-align:center; color:var(--text-muted); font-style:italic;">No hay períodos transcurridos aún.</p>`;
    }

    listContainer.innerHTML = html;

    // 2. Next period box logic — find first period that is NOT 'Aceptada'
    const nextUnenjoyedIndex = periods.findIndex(p => p.status !== 'Aceptada');
    if (nextUnenjoyedIndex !== -1) {
        const nextP = periods[nextUnenjoyedIndex];
        if (nextP.status === 'Pendiente') {
            nextBox.style.background = 'rgba(245, 158, 11, 0.08)';
            nextBox.style.borderColor = 'rgba(245, 158, 11, 0.4)';
            nextBox.style.color = '#b45309';
            nextBox.innerHTML = `
                <div style="font-weight:700; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px; color:#b45309;">Siguiente período (Pendiente de aprobación)</div>
                <div style="font-weight:700; font-size:1.1rem; margin-bottom:4px;">${nextP.name}</div>
                <div style="font-size:0.85em; opacity:0.9;">Tu solicitud para este período está esperando la respuesta del administrador.</div>
            `;
        } else {
            nextBox.style.background = 'rgba(16, 185, 129, 0.08)';
            nextBox.style.borderColor = 'rgba(16, 185, 129, 0.4)';
            nextBox.style.color = '#065f46';
            nextBox.innerHTML = `
                <div style="font-weight:700; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px; color:#065f46;">Siguiente período a solicitar</div>
                <div style="font-weight:700; font-size:1.1rem; margin-bottom:4px;">${nextP.name}</div>
                <div style="font-size:0.85em; opacity:0.9;">Puedes proceder a enviar tu solicitud seleccionando la fecha en el formulario.</div>
            `;
        }
    } else {
        // All periods are enjoyed — show the next future period
        const nextAnniversaryDate = new Date(hireDate);
        nextAnniversaryDate.setFullYear(hireYear + completedPeriodsCount + 1);
        const nextPName = `${hireYear + completedPeriodsCount} - ${hireYear + completedPeriodsCount + 1}`;

        nextBox.style.background = 'rgba(100, 116, 139, 0.08)';
        nextBox.style.borderColor = 'rgba(100, 116, 139, 0.3)';
        nextBox.style.color = '#475569';
        nextBox.innerHTML = `
            <div style="font-weight:700; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px; color:#475569;">Siguiente período (Próximamente)</div>
            <div style="font-weight:700; font-size:1.1rem; margin-bottom:4px;">${nextPName}</div>
            <div style="font-size:0.85em; opacity:0.9;">Estará disponible para solicitar a partir del <strong>${formatLocalDate(nextAnniversaryDate.toISOString().split('T')[0])}</strong> (al cumplir tu siguiente año de antigüedad).</div>
        `;
    }

    // 3. Show modal with animation
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.children[0].style.transform = 'translateY(0)';
    }, 10);

    const closeModal = () => {
        modal.style.opacity = '0';
        modal.children[0].style.transform = 'translateY(-20px)';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    };

    closeBtn.onclick = closeModal;
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
}

function getWorkerPermissionRequestsFromStorage() {
    try {
        const rawData = localStorage.getItem('workerPermissionRequests');
        const parsed = rawData ? JSON.parse(rawData) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.warn('Error cargando solicitudes de permisos desde storage:', e);
        return [];
    }
}

function saveWorkerPermissionRequestsToStorage(requests) {
    try {
        localStorage.setItem('workerPermissionRequests', JSON.stringify(Array.isArray(requests) ? requests : []));
    } catch (e) {
        console.warn('Error guardando solicitudes de permisos en storage:', e);
    }
}

function formatWorkerDateTime(value) {
    if (!value) return '-';
    const date = parseLocalDateValue(value);
    if (!date || isNaN(date.getTime())) return value;
    const pad = num => String(num).padStart(2, '0');
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function parseLocalDateValue(value) {
    if (!value) return null;
    const str = String(value).trim();
    const parts = str.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
    if (parts) {
        const year = parseInt(parts[1], 10);
        const month = parseInt(parts[2], 10) - 1;
        const day = parseInt(parts[3], 10);
        const hours = parseInt(parts[4] || '0', 10);
        const minutes = parseInt(parts[5] || '0', 10);
        const seconds = parseInt(parts[6] || '0', 10);
        return new Date(year, month, day, hours, minutes, seconds);
    }
    const timestamp = Date.parse(str);
    return Number.isNaN(timestamp) ? null : new Date(timestamp);
}

function formatLocalDate(value) {
    if (!value) return '';
    const date = parseLocalDateValue(value);
    if (!date || isNaN(date.getTime())) return value;
    const pad = num => String(num).padStart(2, '0');
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function getCsrfToken() {
    const token = document.querySelector('meta[name="csrf-token"]');
    return token ? token.content : null;
}

function showFieldError(el, msg) {
    if (!el) return;
    el.style.borderColor = '#e74c3c';
    const parent = el.parentElement;
    let helper = parent.querySelector('.inline-helper');
    if (!helper) {
        helper = document.createElement('div');
        helper.className = 'inline-helper';
        helper.style.color = '#e74c3c';
        helper.style.fontSize = '0.85em';
        helper.style.marginTop = '6px';
        helper.style.fontWeight = '600';
        parent.appendChild(helper);
    }
    helper.textContent = msg;
    helper.style.display = 'block';
}

function clearFieldError(el) {
    if (!el) return;
    el.style.borderColor = 'var(--border-color)';
    const parent = el.parentElement;
    const helper = parent.querySelector('.inline-helper');
    if (helper) {
        helper.style.display = 'none';
    }
}

async function renderPermissionRequests() {
    const container = document.getElementById('content-details');
    container.innerHTML = '<div class="loader-container"><p>Cargando solicitudes de permisos...</p></div>';

    try {
        const profileResponse = await fetch('/trabajador/profile-data', { headers: { 'Accept': 'application/json' } });
        const profileData = await profileResponse.json();

        if (profileResponse.status === 401 || profileResponse.status === 419) {
            window.location.href = '/login';
            return;
        }

        if (!profileResponse.ok) throw new Error(profileData.error || 'No se pudo cargar la información de trabajador');

        const profileFirst = profileData.Nombre_Completo || profileData.nombre_completo || profileData.Nombre || profileData.nombre || profileData.FullName || profileData.fullName || profileData.name || '';
        const profileLast = profileData.Apellidos || profileData.apellidos || profileData.LastName || profileData.last_name || '';
        let workerName = profileFirst.trim();
        if (profileLast && workerName && !workerName.toLowerCase().includes(profileLast.toLowerCase())) {
            workerName = `${workerName} ${profileLast}`.trim();
        }
        if (!workerName) {
            workerName = profileData.Trabajador || profileData.trabajador || '';
        }
        const workerDocument = profileData.Cedula || profileData.cedula || profileData.Documento_Identidad || profileData.documento_identidad || profileData.Documento || profileData.documento || '';
        const hireDate = profileData.FechaIngreso || profileData.fechaIngreso || profileData.Fecha_de_Ingreso || profileData.fecha_de_ingreso;

        function getWorkerPermissionRequestId(request) {
            if (!request || typeof request !== 'object') return '';
            return String(request.id || request.Id || request.Id_Solicitud || request.IdSolicitud || request.request_id || request.requestId || request.requestid || request.solicitud_id || request.solicitudId || '').trim();
        }

        let requests = getWorkerPermissionRequestsFromStorage();

        try {
            const response = await fetch('/trabajador/permission-requests', { headers: { 'Accept': 'application/json' } });
            if (response.ok) {
                const apiData = await response.json();
                if (Array.isArray(apiData.requests)) {
                    const remoteRequests = apiData.requests;
                    const remoteById = new Map(remoteRequests.map(rr => [getWorkerPermissionRequestId(rr), rr]));
                    const localById = new Map(requests.map(l => [getWorkerPermissionRequestId(l), l]));
                    requests = [
                        ...remoteRequests,
                        ...requests.filter(local => !remoteById.has(getWorkerPermissionRequestId(local)))
                    ];
                    saveWorkerPermissionRequestsToStorage(requests);
                }
            }
        } catch (err) {
            console.warn('No se pudo cargar solicitudes de permisos desde API, usando datos locales.', err);
        }

        requests = (requests || [])
            .filter(r => {
                const rDoc = String(r.Cedula || r.cedula || r.Documento_Identidad || r.documento_identidad || '').trim();
                if (workerDocument && rDoc && rDoc === String(workerDocument).trim()) return true;
                const rName = String(r.Nombre_Completo || r.Trabajador || r.Nombre_Trabajador || r.Nombre || '').trim().toLowerCase();
                return workerName && rName === workerName.toLowerCase();
            })
            .sort((a, b) => new Date(b.Fecha || b.FechaInicio || b.Fecha_Inicio || '') - new Date(a.Fecha || a.FechaInicio || a.Fecha_Inicio || ''));

        if (window.currentActiveModule && window.currentActiveModule !== 'Solicitud de Permisos') return;

        container.innerHTML = `
            <div class="permissions-module fade-in">
                <div class="content-box">
                    <div style="display:flex; justify-content:space-between; align-items:center; gap:14px; flex-wrap:wrap;">
                        <div>
                            <h4 style="margin-top:0; color: var(--text-main); border-bottom: 2px solid var(--primary); padding-bottom: 10px;">📝 Solicitud de Permisos</h4>
                            <p style="margin:0; color: var(--text-muted);">Envía una solicitud de permiso al administrador y revisa tu historial.</p>
                        </div>
                        <button id="btn-new-permission" class="primary" style="padding:12px 18px; font-weight:700; border-radius:12px;">Nueva solicitud</button>
                    </div>

                    <div id="permission-form-container" style="display:none; margin-top:28px; background: var(--card-bg); padding:24px; border-radius:16px; border:1px solid var(--border-color); box-shadow:0 20px 50px rgba(0,0,0,0.08);">
                        <h5 style="margin:0 0 18px; font-weight:700; color: var(--text-main);">Completa tu solicitud</h5>
                        <form id="permission-request-form">
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:18px;">
                                <label style="display:flex; align-items:center; justify-content:space-between; gap:10px; font-weight:600; color: var(--text-main);">
                                    <span>Fecha y hora de inicio <span style="color:#e74c3c;">*</span></span>
                                    <button type="button" class="permission-help-btn" data-help="start" style="border:none; background:transparent; color:var(--primary); cursor:pointer; font-size:1rem; width:28px; height:28px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center;">?</button>
                                </label>
                                <input id="perm-start" type="datetime-local" style="width:100%; padding:12px; border:1px solid var(--border-color); border-radius:10px; background:var(--bg-color); color:var(--text-main);">
                                <label style="display:flex; align-items:center; justify-content:space-between; gap:10px; font-weight:600; color: var(--text-main);">
                                    <span>Fecha y hora de fin <span style="color:#e74c3c;">*</span></span>
                                    <button type="button" class="permission-help-btn" data-help="end" style="border:none; background:transparent; color:var(--primary); cursor:pointer; font-size:1rem; width:28px; height:28px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center;">?</button>
                                </label>
                                <input id="perm-end" type="datetime-local" style="width:100%; padding:12px; border:1px solid var(--border-color); border-radius:10px; background:var(--bg-color); color:var(--text-main);">
                            </div>
                            <div style="margin-bottom:18px;">
                                <label style="display:block; font-weight:600; color: var(--text-main); margin-bottom:8px;">Motivo <span style="color:#e74c3c;">*</span></label>
                                <textarea id="perm-reason" rows="4" placeholder="Describe brevemente por qué necesitas el permiso" style="width:100%; padding:14px; border:1px solid var(--border-color); border-radius:10px; background:var(--bg-color); color:var(--text-main);"></textarea>
                            </div>
                            <div style="display:flex; justify-content:flex-end; gap:12px; flex-wrap:wrap;">
                                <button type="button" id="btn-cancel-permission" class="btn" style="padding:12px 18px; border:1px solid var(--border-color); border-radius:10px; background:transparent; color:var(--text-main);">Cerrar</button>
                                <button type="submit" class="primary" style="padding:12px 18px; border-radius:10px; font-weight:700;">Enviar solicitud</button>
                            </div>
                        </form>
                    </div>

                    <div style="margin-top:26px; display:flex; gap:20px; flex-wrap:wrap; align-items:center;">
                        <div style="padding: 10px 15px; background: rgba(46, 204, 113, 0.1); border-radius: 8px; border: 1px solid rgba(46, 204, 113, 0.3); color: var(--text-main); font-weight: 600;">
                            Permisos justificados: <span style="color: #2ecc71; font-size: 1.1rem;">${requests.filter(r => getRequestStatus(r) === 'Aprobado' && (r.Remuneracion || r.remuneracion) === 'Sí').length}</span>
                        </div>
                        <div style="padding: 10px 15px; background: rgba(231, 76, 60, 0.1); border-radius: 8px; border: 1px solid rgba(231, 76, 60, 0.3); color: var(--text-main); font-weight: 600;">
                            Permisos no justificados: <span style="color: #e74c3c; font-size: 1.1rem;">${requests.filter(r => getRequestStatus(r) === 'Aprobado' && (r.Remuneracion || r.remuneracion) === 'No').length}</span>
                        </div>
                    </div>
                </div>

                <div class="content-box" style="margin-top:24px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                        <h4 style="margin:0; color: var(--text-main);">Historial de solicitudes</h4>
                    </div>
                    <div id="permission-history-table" style="margin-top:18px; overflow-x:auto;">
                        <table style="width:100%; border-collapse:collapse;">
                            <thead>
                                <tr style="background: var(--primary); color:#fff;">
                                    <th style="padding:14px; text-align:left;">Fecha de envío</th>
                                    <th style="padding:14px; text-align:left;">Fecha inicio</th>
                                    <th style="padding:14px; text-align:left;">Fecha fin</th>
                                    <th style="padding:14px; text-align:left;">Motivos</th>
                                    <th style="padding:14px; text-align:left;">Remuneración</th>
                                    <th style="padding:14px; text-align:left;">Estatus</th>
                                </tr>
                                <tr style="background: rgba(0,0,0,0.03);">
                                    <td style="padding:8px;"><input type="date" id="filter-envio" style="width:100%; padding:6px; border-radius:6px; border:1px solid var(--border-color); font-size:0.85rem; background:var(--bg-color); color:var(--text-main);"></td>
                                    <td style="padding:8px;"><input type="date" id="filter-inicio" style="width:100%; padding:6px; border-radius:6px; border:1px solid var(--border-color); font-size:0.85rem; background:var(--bg-color); color:var(--text-main);"></td>
                                    <td style="padding:8px;"><input type="date" id="filter-fin" style="width:100%; padding:6px; border-radius:6px; border:1px solid var(--border-color); font-size:0.85rem; background:var(--bg-color); color:var(--text-main);"></td>
                                    <td style="padding:8px; text-align:center; font-size:0.85rem; color:var(--text-muted);">Sin filtro</td>
                                    <td style="padding:8px;">
                                        <select id="filter-remun" style="width:100%; padding:6px; border-radius:6px; border:1px solid var(--border-color); font-size:0.85rem; background:var(--bg-color); color:var(--text-main);">
                                            <option value="">Todas</option>
                                            <option value="Sí">Sí</option>
                                            <option value="No">No</option>
                                        </select>
                                    </td>
                                    <td style="padding:8px;">
                                        <select id="filter-estatus" style="width:100%; padding:6px; border-radius:6px; border:1px solid var(--border-color); font-size:0.85rem; background:var(--bg-color); color:var(--text-main);">
                                            <option value="">Todos</option>
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="Aprobado">Aprobado</option>
                                            <option value="Rechazado">Rechazado</option>
                                            <option value="Expirado">Expirado</option>
                                        </select>
                                    </td>
                                </tr>
                            </thead>
                            <tbody id="permission-history-body"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        const formContainer = document.getElementById('permission-form-container');
        const newRequestButton = document.getElementById('btn-new-permission');
        const cancelRequestButton = document.getElementById('btn-cancel-permission');
        const requestForm = document.getElementById('permission-request-form');
        const historyBody = document.getElementById('permission-history-body');
        const startInput = document.getElementById('perm-start');
        const endInput = document.getElementById('perm-end');

        // Filter elements
        const filterEnvio = document.getElementById('filter-envio');
        const filterInicio = document.getElementById('filter-inicio');
        const filterFin = document.getElementById('filter-fin');
        const filterRemun = document.getElementById('filter-remun');
        const filterEstatus = document.getElementById('filter-estatus');

        function getRequestStatus(request) {
            return request?.Estatus || request?.Estado || request?.status || 'Pendiente';
        }

        function getRequestEndDate(request) {
            return request?.FechaFin || request?.Fecha_Fin || request?.Fecha_Final || request?.endDate || '';
        }

        function isRequestExpired(request) {
            const status = getRequestStatus(request);
            const endDate = getRequestEndDate(request);
            return status === 'Pendiente' && endDate && new Date(endDate).getTime() < Date.now();
        }

        function initPermissionFieldHelp() {
            document.querySelectorAll('.permission-help-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const helpType = btn.dataset.help;
                    const helpText = helpType === 'start'
                        ? 'Indique una fecha de inicio al menos 10 minutos pasados la hora actual (para dar tiempo a recibir una respuesta del Administrador).'
                        : 'Señale la fecha y hora en la cual considera que culminará su ausencia.';
                    const title = helpType === 'start' ? 'Ayuda: Fecha y hora de inicio' : 'Ayuda: Fecha y hora de fin';

                    showModal({
                        type: 'info',
                        title,
                        html: `<p style="margin:0; line-height:1.7;">${helpText}</p>`,
                        okText: 'Cerrar'
                    });
                });
            });
        }

        function validateStartField() {
            const value = startInput.value;
            if (!value) {
                showFieldError(startInput, 'La fecha de inicio es obligatoria.');
                return 'La fecha de inicio es obligatoria.';
            }
            clearFieldError(startInput);
            const selected = new Date(value);
            const minStart = new Date(Date.now() + 10 * 60 * 1000);
            if (selected < new Date()) {
                showFieldError(startInput, 'La fecha y hora no pueden ser en el pasado.');
                return 'La fecha y hora de inicio no pueden ser en el pasado.';
            }
            if (selected <= minStart) {
                showFieldError(startInput, 'Se requieren al menos 10 minutos de anticipación.');
                return 'La solicitud debe hacerse con al menos 10 minutos de anticipación respecto a la hora actual.';
            }
            if (hireDate && new Date(value) < new Date(hireDate)) {
                showFieldError(startInput, `No puede ser anterior al ingreso (${formatLocalDate(hireDate.split('T')[0])}).`);
                return `La solicitud no puede comenzar antes de tu fecha de ingreso (${formatLocalDate(hireDate.split('T')[0])}).`;
            }
            return '';
        }

        function validateEndField() {
            const endValue = endInput.value;
            if (!endValue) {
                showFieldError(endInput, 'La fecha de fin es obligatoria.');
                return 'La fecha de fin es obligatoria.';
            }
            clearFieldError(endInput);
            const startValue = startInput.value;
            if (startValue) {
                const startDate = new Date(startValue);
                const endDate = new Date(endValue);
                if (endDate <= startDate) {
                    showFieldError(endInput, 'Debe ser posterior a la fecha de inicio.');
                    return 'La fecha y hora de fin deben ser estrictamente posteriores a la fecha y hora de inicio.';
                }
            }
            return '';
        }

        startInput.addEventListener('input', () => {
            validateStartField();
            validateEndField();
        });
        endInput.addEventListener('input', validateEndField);

        function renderHistory(list) {
            if (!Array.isArray(list) || list.length === 0) {
                historyBody.innerHTML = '<tr><td colspan="4" style="padding:16px; text-align:center; color:var(--text-muted);">No hay solicitudes registradas.</td></tr>';
                return;
            }

            historyBody.innerHTML = list.map(item => {
                const status = getRequestStatus(item);
                const isExpired = isRequestExpired(item);
                const estadoFinal = isExpired ? 'Expirado' : status;
                const bgColor = isExpired ? '#94a3b8' : (status === 'Aprobado' ? '#2ecc71' : status === 'Rechazado' ? '#e74c3c' : '#f39c12');
                return `
                <tr style="border-bottom:1px solid var(--border-color); background: var(--card-bg);">
                    <td style="padding:14px; vertical-align:top; font-weight:600;">${formatLocalDate(item.Fecha || item.FechaSolicitud || item.Fecha_Solicitud || '')}</td>
                    <td style="padding:14px; vertical-align:top;">${formatWorkerDateTime(item.FechaInicio || item.Fecha_Inicio || '')}</td>
                    <td style="padding:14px; vertical-align:top;">${formatWorkerDateTime(item.FechaFin || item.Fecha_Fin || '')}</td>
                    <td style="padding:14px; vertical-align:top;">
                        <button class="view-motive-btn" data-motive="${(item.Motivo || item.motivo || '-').replace(/"/g, '&quot;')}" style="display:inline-flex; align-items:center; gap:6px; padding:7px 12px; border:none; background:#3498db; color:#fff; border-radius:999px; cursor:pointer; font-size:0.86rem; font-weight:700;">Ver motivo de la solicitud</button>
                        ${estadoFinal === 'Rechazado' && (item.Motivo_Rechazo || item.motivo_rechazo) ? `
                            <button class="view-rejection-reason" data-reason="${(item.Motivo_Rechazo || item.motivo_rechazo).replace(/"/g, '&quot;')}" style="margin-top:8px; display:inline-flex; align-items:center; gap:6px; padding:7px 12px; border:none; background:#f87171; color:#fff; border-radius:999px; cursor:pointer; font-size:0.86rem; font-weight:700;">Ver motivo de rechazo</button>
                        ` : ''}
                    </td>
                    <td style="padding:14px; vertical-align:top; font-weight:600; color:var(--text-main);">
                        ${status === 'Aprobado' ? (item.Remuneracion || item.remuneracion || '-') : ''}
                    </td>
                    <td style="padding:14px; vertical-align:top;"><span style="padding:6px 12px; border-radius:999px; background:${bgColor}; color:#fff; font-weight:700;">${estadoFinal}</span></td>
                </tr>
            `;
            }).join('');
        }

        function updateHistory() {
            const envioVal = filterEnvio?.value || '';
            const inicioVal = filterInicio?.value || '';
            const finVal = filterFin?.value || '';
            const remunVal = filterRemun?.value || '';
            const statusVal = filterEstatus?.value || '';

            const filtered = requests.filter(item => {
                // Convert stored date string to local YYYY-MM-DD to handle timezone offsets
                function toLocalISODate(dateStr) {
                    if (!dateStr) return '';
                    const d = new Date(dateStr);
                    if (isNaN(d.getTime())) return dateStr.split('T')[0] || '';
                    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                }
                const rawEnvio = item.Fecha || item.FechaSolicitud || item.Fecha_Solicitud || '';
                const matchesEnvio = !envioVal || toLocalISODate(rawEnvio) === envioVal;
                const matchesInicio = !inicioVal || (item.FechaInicio || item.Fecha_Inicio || '').startsWith(inicioVal);
                const matchesFin = !finVal || (item.FechaFin || item.Fecha_Fin || '').startsWith(finVal);
                
                const rVal = (item.Remuneracion || item.remuneracion);
                const matchesRemun = !remunVal || rVal === remunVal;
                
                const status = getRequestStatus(item);
                const estadoFinal = isRequestExpired(item) ? 'Expirado' : status;
                const matchesStatus = !statusVal || estadoFinal === statusVal;

                return matchesEnvio && matchesInicio && matchesFin && matchesRemun && matchesStatus;
            });
            renderHistory(filtered);
            attachRejectionReasonListeners();
        }

        initPermissionFieldHelp();

        [filterEnvio, filterInicio, filterFin, filterRemun, filterEstatus].forEach(el => {
            if (el) el.addEventListener('input', updateHistory);
        });

        function attachRejectionReasonListeners() {
            document.querySelectorAll('.view-rejection-reason').forEach(btn => {
                btn.addEventListener('click', () => {
                    const reason = btn.dataset.reason || 'No se especificó el motivo del rechazo.';
                    showModal({
                        type: 'info',
                        title: 'Motivo del rechazo',
                        html: `
                            <div style="padding: 12px 0; font-size: 0.95rem; line-height: 1.7; color: var(--text-main);">
                                <div style="background: rgba(248, 113, 113, 0.12); padding: 16px; border-radius: 14px; border: 1px solid rgba(248, 113, 113, 0.25); color: var(--text-main); word-break: break-word; overflow-wrap: break-word; white-space: pre-wrap;">${reason}</div>
                            </div>
                        `,
                        okText: 'Cerrar'
                    });
                });
            });
            document.querySelectorAll('.view-motive-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const motive = btn.dataset.motive || 'No se especificó el motivo.';
                    showModal({
                        type: 'info',
                        title: 'Motivo de la solicitud',
                        html: `
                            <div style="padding: 12px 0; font-size: 0.95rem; line-height: 1.7; color: var(--text-main);">
                                <div style="background: rgba(52, 152, 219, 0.12); padding: 16px; border-radius: 14px; border: 1px solid rgba(52, 152, 219, 0.25); color: var(--text-main); word-break: break-word; overflow-wrap: break-word; white-space: pre-wrap;">${motive}</div>
                            </div>
                        `,
                        okText: 'Cerrar'
                    });
                });
            });
        }

        newRequestButton.addEventListener('click', () => {
            formContainer.style.display = 'block';
            newRequestButton.style.display = 'none';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        cancelRequestButton.addEventListener('click', () => {
            formContainer.style.display = 'none';
            newRequestButton.style.display = 'inline-flex';
        });

        requestForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const startValue = document.getElementById('perm-start').value;
            const endValue = document.getElementById('perm-end').value;
            const reasonValue = document.getElementById('perm-reason').value.trim();

            const startDate = new Date(startValue);
            const endDate = new Date(endValue);
            const firstAllowedDate = hireDate ? new Date(hireDate) : null;
            const startError = validateStartField();
            const endError = validateEndField();

            if (!startValue || !endValue || !reasonValue || startError || endError) {
                let errorHtml = '<div style="text-align: left;">';
                if (!startValue || !endValue || !reasonValue) {
                    errorHtml += '<p style="margin-bottom: 8px;"><strong>Faltan campos por completar:</strong> Asegúrate de llenar la fecha de inicio, la fecha de fin y el motivo.</p>';
                }
                if (startError) {
                    errorHtml += `<p style="margin-bottom: 8px; color: var(--error-color);"><strong>Error en fecha de inicio:</strong> ${startError}</p>`;
                }
                if (endError) {
                    errorHtml += `<p style="margin-bottom: 8px; color: var(--error-color);"><strong>Error en fecha de fin:</strong> ${endError}</p>`;
                }
                errorHtml += '</div>';
                
                showModal({ type: 'error', title: 'Solicitud Inválida', html: errorHtml, okText: 'Entendido' });
                return;
            }

            const newRequest = {
                id: `perm-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
                Fecha: (() => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`; })(),
                FechaInicio: startValue,
                FechaFin: endValue,
                Motivo: reasonValue,
                Estatus: 'Pendiente',
                Remuneracion: 'Pendiente',
                Estado: 'Pendiente',
                Trabajador: workerName,
                Nombre_Completo: workerName,
                Nombre: profileData.Nombre || profileData.nombre || '',
                Apellidos: profileLast,
                Cedula: workerDocument
            };

            try {
                const csrfToken = getCsrfToken();
                const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
                if (csrfToken) headers['X-CSRF-TOKEN'] = csrfToken;

                await fetch('/trabajador/permission-requests', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(newRequest)
                });
            } catch (err) {
                console.warn('No se pudo enviar la solicitud al backend, guardando localmente.', err);
            }

            const localRequests = getWorkerPermissionRequestsFromStorage();
            saveWorkerPermissionRequestsToStorage([newRequest, ...localRequests]);
            showModal({ type: 'success', title: 'Solicitud enviada', html: '<p>Tu solicitud de permiso ha sido registrada. Puedes ver su estado en el historial.</p>', okText: 'Aceptar' });
            renderPermissionRequests();
        });

        // Filters are registered via the forEach loop above

        updateHistory();
    } catch (error) {
        container.innerHTML = `<div class="alert error"><p>No se pudo cargar el módulo de permisos. ${error.message}</p></div>`;
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

        if (response.status === 401 || response.status === 419) {
            window.location.href = '/login';
            return;
        }

        if (!response.ok) throw new Error(data.error || 'No se pudieron cargar los recibos');

        if (window.currentActiveModule && window.currentActiveModule !== 'Historial de Pagos y Recibos' && window.currentActiveModule !== 'Historial de Recibos') return;

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
                    
                    <div class="filters" style="margin: 20px 0; display: flex; gap: 15px; align-items: center; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 200px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: var(--text-main); font-size: 0.9em;">Buscar por Periodo:</label>
                            <input type="text" id="pay-search" placeholder="Ej: Enero 2026, 15/01/2026..." style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-color); color: var(--text-main); box-sizing: border-box;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: var(--text-main); font-size: 0.9em;">Ordenar por Fecha:</label>
                            <select id="pay-sort" style="padding: 10px; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-color); color: var(--text-main); min-width: 180px; box-sizing: border-box;">
                                <option value="desc">Más reciente primero</option>
                                <option value="asc">Más antiguo primero</option>
                            </select>
                        </div>
                    </div>

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
                            <tbody id="payslips-table-body"></tbody>
                        </table>
                        <div id="no-results-msg" style="display:none; padding: 30px; text-align: center; color: var(--text-muted); font-style: italic;">
                            No se encontraron recibos que coincidan con la búsqueda.
                        </div>
                    </div>
                </div>
            </div>
        `;

        const tableBody = document.getElementById('payslips-table-body');
        const searchInput = document.getElementById('pay-search');
        const sortSelect = document.getElementById('pay-sort');
        const noResultsMsg = document.getElementById('no-results-msg');

        function renderTable(list) {
            if (list.length === 0) {
                tableBody.innerHTML = '';
                noResultsMsg.style.display = 'block';
                return;
            }
            noResultsMsg.style.display = 'none';
            tableBody.innerHTML = list.map(p => `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 12px; border: 1px solid var(--border-color); color: var(--text-main);">${formatLocalDate(p.fechaPago)}</td>
                    <td style="padding: 12px; border: 1px solid var(--border-color); color: var(--text-main);">${p.periodo}</td>
                    <td style="padding: 12px; border: 1px solid var(--border-color); font-weight: bold; color: var(--text-main);">Bs. ${p.neto}</td>
                    <td style="padding: 12px; border: 1px solid var(--border-color);" class="center">
                        <a href="/trabajador/payslip/${p.id}" target="_blank" class="primary small" style="text-decoration: none; padding: 8px 18px; border-radius: 8px; font-weight:600;">
                            Descargar PDF
                        </a>
                    </td>
                </tr>
            `).join('');
        }

        function updateTable() {
            const term = searchInput.value.toLowerCase().trim();
            const sortOrder = sortSelect.value;

            // Filtrar
            const filtered = data.filter(p => {
                const matchPeriod = (p.periodo || '').toLowerCase().includes(term);
                const matchDate = (p.fechaPago || '').toLowerCase().includes(term);
                return matchPeriod || matchDate;
            });

            // Ordenar
            filtered.sort((a, b) => {
                const dateA = parseLocalDateValue(a.fechaPago);
                const dateB = parseLocalDateValue(b.fechaPago);
                
                // Fallback para fechas inválidas, aunque no debería ocurrir si vienen de DB
                if (!dateA || isNaN(dateA)) return 1; 
                if (!dateB || isNaN(dateB)) return -1;

                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            });

            renderTable(filtered);
        }

        // Event Listeners
        searchInput.addEventListener('input', updateTable);
        sortSelect.addEventListener('change', updateTable);

        // Renderizado inicial
        updateTable();

    } catch (error) {
        container.innerHTML = `<div class="alert error"><p>${error.message}</p></div>`;
    }
}
