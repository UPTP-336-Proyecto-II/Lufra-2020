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
        const ingreso = new Date(data.fechaIngreso);
        const now = new Date();
        const years = (now - ingreso) / (1000 * 60 * 60 * 24 * 365.25);

        // Lógica de expiración (si es Pendiente y ya pasó la fecha de inicio)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isExpired = data.lastRequest && data.lastRequest.Estado === 'Pendiente' && new Date(data.lastRequest.Fecha_Inicio_Vacaciones) < today;

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
                    <h5 style="margin-top: 0; margin-bottom: 1.5rem; color: var(--text-main);">Nueva Solicitud (Bloqueada)</h5>
                    <div style="margin-bottom: 15px; padding: 10px; background: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; color: #b45309; font-size: 0.9em; font-weight: 500; border-radius: 0 4px 4px 0;">
                        <i class="fas fa-exclamation-triangle"></i> Aún no puedes realizar una nueva solicitud de vacaciones.
                    </div>
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--text-main);">¿Cuándo deseas comenzar tus vacaciones?</label>
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
                    <h5 style="margin-top: 0; margin-bottom: 1.5rem; color: var(--text-main);">Nueva Solicitud (Bloqueada)</h5>
                    <div style="margin-bottom: 15px; padding: 10px; background: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; color: #b45309; font-size: 0.9em; font-weight: 500; border-radius: 0 4px 4px 0;">
                        <i class="fas fa-exclamation-triangle"></i> Aún no puedes realizar una nueva solicitud de vacaciones.
                    </div>
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--text-main);">¿Cuándo deseas comenzar tus vacaciones?</label>
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
            <div class="content-box">
                <h4 style="margin-top: 0; color: var(--text-main); border-bottom: 2px solid var(--primary); padding-bottom: 10px;">🏖️ Solicitud de Vacaciones</h4>
                
                <div style="margin-top: 15px; display: flex; flex-direction: column; gap: 20px;">
                    ${statusHtml}
                    ${formHtml}
                </div>
            </div>
            ${historySectionHtml}
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
    `;

        if (document.getElementById('btn-submit-vac')) {
            document.getElementById('btn-submit-vac').addEventListener('click', submitVacationRequest);
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
                            <tbody>
                                ${data.map(p => `
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
                                `).join('')}
                            </tbody>
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
                const dateA = new Date(a.fechaPago);
                const dateB = new Date(b.fechaPago);
                
                // Fallback para fechas inválidas, aunque no debería ocurrir si vienen de DB
                if (isNaN(dateA)) return 1; 
                if (isNaN(dateB)) return -1;

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
