/**
 * Admin.js - Módulo Administrativo Refactorizado para Laravel
 */

(function () {
    // Cache de elementos del DOM comunes
    let contentHeader, contentDetails;
    let permissionRequestsCache = null;

    function init() {
        contentHeader = document.getElementById('content-header');
        contentDetails = document.getElementById('content-details');
    }

    // --- Email Validation Helpers ---
    if (!window.allowedEmailDomains) window.allowedEmailDomains = new Set(['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com']);

    function extractDomain(email) {
        if (!email || typeof email !== 'string') return '';
        const parts = email.split('@');
        return parts.length === 2 ? parts[1].toLowerCase() : '';
    }

    function validateEmailFormat(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validateEmailDomain(email) {
        const d = extractDomain(email);
        if (!d) return false;
        if (window.allowedEmailDomains && window.allowedEmailDomains.size) return window.allowedEmailDomains.has(d);
        return true;
    }

    // --- Global UI Helpers ---
    function showInlineError(el, msg) {
        if (!el) return;
        el.style.borderColor = '#e74c3c';

        let tParent = el.parentElement;
        if (tParent.style.display === 'flex') tParent = tParent.parentElement;

        let helper = tParent.querySelector('.inline-helper');
        if (helper) {
            helper.textContent = msg;
            helper.style.display = 'block';
        } else {
            const span = document.createElement('div');
            span.className = 'inline-helper';
            span.style.color = '#e74c3c';
            span.style.fontSize = '0.8em';
            span.style.marginTop = '4px';
            span.style.fontWeight = '500';
            span.textContent = msg;
            tParent.appendChild(span);
        }

        const smallTag = tParent.querySelector('small');
        if (smallTag) smallTag.style.display = 'none';
    }

    function clearInlineError(el) {
        if (!el) return;
        el.style.borderColor = 'var(--border-color)';

        let tParent = el.parentElement;
        if (tParent.style.display === 'flex') tParent = tParent.parentElement;

        let helper = tParent.querySelector('.inline-helper');
        if (helper) {
            helper.style.display = 'none';
        }

        const smallTag = tParent.querySelector('small');
        if (smallTag) smallTag.style.display = 'block';
    }

    /**
     * Punto de entrada principal para renderizar módulos administrativos
     */
    async function renderAdminModuleV2(moduleName) {
        if (!contentDetails) init();

        const name = moduleName.toLowerCase();

        // 1. Registro de Trabajadores
        if (name.includes('registro') && name.includes('trabajador')) {
            return renderWorkerRegistration();
        }

        // 2. Pago de Nómina
        if (name.includes('pago') && name.includes('nómina')) {
            return renderPayrollPayment();
        }

        // 3. Panel de permisos
        if (name.includes('permiso') || (name.includes('panel') && name.includes('permisos'))) {
            return renderAdminPermissionsPanel();
        }

        // 4. Tipos de Nómina (compatibilidad antigua)
        if (name.includes('tipo') && name.includes('nomina')) {
            return renderTipoNominaModule();
        }

        // 5. Gestión de Conceptos
        if (name.includes('concept')) {
            return renderConceptosModule();
        }

        // 5. Gestión de Cargos
        if (name.includes('cargo')) {
            return renderCargosModule();
        }

        // 6. Panel de Vacaciones
        if (name.includes('panel') && name.includes('vacaciones')) {
            return renderAdminVacations();
        }

        contentDetails.innerHTML = `<div class="alert-info">Módulo "${moduleName}" en proceso de migración v2.</div>`;
    }

    const keywordsDiarios = ['dias laborables', 'días laborables', 'dias no laborados', 'días no laborados', 'faltas', 'inasistencias', 'vacaciones', 'bono vacacional', 'permiso no remunerado', 'utilidades', 'bono de produccion', 'bono de asistencia', 'sueldo', 'salario', 'dias de descanso', 'días de descanso', 'dia de descanso', 'día de descanso'];

    function getConceptAmount(c, salario, totalAsig = 0) {
        const nombre = (c.Nombre_Concepto || '').toLowerCase();
        const codigo = (c.Codigo || '').toUpperCase();

        const isDaily = keywordsDiarios.some(kw => nombre.includes(kw.toLowerCase()));
        if (isDaily && salario > 0) return salario / 30;

        // Retenciones Legales dinámicas basas en Ingresos Totales (totalAsig)
        // El usuario requiere que si no hay conceptos de ingreso agregados (totalAsig = 0),
        // las retenciones sean 0, sin usar el salario base como fallback.
        const baseMensualCalculo = totalAsig * 2; 

        if (codigo === 'IVSS' || nombre.includes('seguro social')) {
            const sueldoSemanal = (Math.min(baseMensualCalculo, 650) * 12) / 52;
            return sueldoSemanal * 0.04;
        }
        if (codigo === 'SPF' || nombre.includes('prest. de empleo')) {
            const sueldoSemanal = (Math.min(baseMensualCalculo, 650) * 12) / 52;
            return sueldoSemanal * 0.005;
        }
        if (codigo === 'FAOV' || nombre.includes('ahorro habitacional')) {
            // FAOV es 1% de los ingresos totales del periodo
            return totalAsig * 0.01;
        }

        return parseFloat(c.Monto) || 0;
    }

    // --- Helpers de API ---
    async function apiFetch(endpoint, options = {}) {
        const prefix = window.adminApiPrefix || '/administrativo';
        const url = `${prefix}${endpoint}`;
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json'
        };

        // Agregar token CSRF si está disponible
        const token = document.querySelector('meta[name="csrf-token"]');
        if (token) {
            defaultHeaders['X-CSRF-TOKEN'] = token.content;
        }

        try {
            const res = await fetch(url, {
                ...options,
                headers: { ...defaultHeaders, ...options.headers }
            });

                if (res.status === 401 || res.status === 419 || res.status === 0) {
                    window.location.href = '/login';
                    return new Promise(() => {}); // Silencia cualquier modal de error posterior
                }

                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data.message || data.error || 'Error en la petición');
                return data;
        } catch (e) {
            console.error(`API Error (${endpoint}):`, e);
            throw e;
        }
    }

    // --- Safe POST helper: checks session alive before sending state-changing requests ---
    async function safePost(endpoint, body = null, extraOptions = {}) {
        const opts = { method: 'POST', headers: { 'Content-Type': 'application/json' }, ...extraOptions };
        if (body !== null) {
            opts.body = (typeof body === 'string') ? body : JSON.stringify(body);
        }
        return await apiFetch(endpoint, opts);
    }

    // --- Helpers de Paginación (cliente) ---
    const TABLE_PAGE_SIZE = 10;

    function paginateItems(items, page, perPage = TABLE_PAGE_SIZE) {
        const total = items.length;
        const totalPages = Math.max(1, Math.ceil(total / perPage));
        const current = Math.min(Math.max(1, page || 1), totalPages);
        return { items: items.slice((current - 1) * perPage, current * perPage), current, totalPages, total };
    }

    function renderPaginationHTML(cls, current, totalPages, total, perPage = TABLE_PAGE_SIZE) {
        if (totalPages <= 1) return '';
        const btn = (page, label, opts = {}) => `<button type="button" class="${cls}" data-page="${page}" ${opts.disabled ? 'disabled' : ''} style="min-width:34px; height:34px; padding:0 10px; border-radius:8px; border:1px solid var(--border-color); background:${opts.active ? 'var(--primary)' : 'var(--card-bg)'}; color:${opts.active ? 'white' : 'var(--text-main)'}; cursor:${opts.disabled ? 'default' : 'pointer'}; opacity:${opts.disabled ? '0.45' : '1'}; font-weight:600;">${label}</button>`;
        const ellipsis = '<span style="color:var(--text-muted); padding:0 2px;">…</span>';

        let start = Math.max(1, current - 2);
        const end = Math.min(totalPages, start + 4);
        start = Math.max(1, end - 4);

        const pages = [];
        if (start > 1) { pages.push(btn(1, '1')); if (start > 2) pages.push(ellipsis); }
        for (let p = start; p <= end; p++) pages.push(btn(p, String(p), { active: p === current }));
        if (end < totalPages) { if (end < totalPages - 1) pages.push(ellipsis); pages.push(btn(totalPages, String(totalPages))); }

        const from = (current - 1) * perPage + 1;
        const to = Math.min(total, current * perPage);
        return `
            <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px; margin-top:16px;">
                <span style="color:var(--text-muted); font-size:0.9em;">Mostrando ${from}–${to} de ${total}</span>
                <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                    ${btn(current - 1, '‹', { disabled: current === 1 })}
                    ${pages.join('')}
                    ${btn(current + 1, '›', { disabled: current === totalPages })}
                </div>
            </div>`;
    }

    function attachPaginationListeners(root, cls, onPage) {
        (root || document).querySelectorAll(`.${cls}`).forEach(b => {
            b.addEventListener('click', () => { if (!b.disabled) onPage(parseInt(b.dataset.page, 10)); });
        });
    }

    // --- Módulo: Registro de Trabajadores ---
    async function renderWorkerRegistration() {
        contentDetails.innerHTML = '<div class="loader">Cargando módulo de trabajadores...</div>';

        try {
            // Cargar datos necesarios en paralelo
            const [cData, nData, tData, wData] = await Promise.all([
                apiFetch('/cargos'),
                apiFetch('/education-levels'),
                apiFetch('/types-nomina'),
                apiFetch('/workers')
            ]);

            const cargos = cData.cargos || [];
            const niveles = nData.niveles || [];
            const tiposNomina = (tData.tipos || []).filter(t => {
                const freq = String(t.Frecuencia || '').trim().toLowerCase();
                return freq !== 'mensual' && freq !== 'mixta';
            });
            let allWorkersSource = wData.workers || [];

            contentDetails.innerHTML = `
                <div class="worker-registration">
                    <div class="content-box">
                        <h4 style="margin-top: 0; color: var(--text-main); border-bottom: 2px solid var(--primary); padding-bottom: 10px;">Gestión de Trabajadores</h4>
                        
                        <!-- Mini Analytics Row -->
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
                            <div class="chart-container" style="margin-bottom:0; display:flex; align-items:center; justify-content:space-between;">
                                <div><h6 style="margin:0; color:var(--text-muted);">Total Personal</h6><span style="font-size:1.5em; font-weight:bold; color: var(--text-main);">${allWorkersSource.length}</span></div>
                                <div style="width:60px; height:60px;"><canvas id="worker-mini-chart"></canvas></div>
                            </div>
                        </div>

                        <!-- Filtros de búsqueda (en vivo) -->
                        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:15px; margin-top:10px;">
                            <div style="display:flex; flex-direction:column; gap:6px;">
                                <label style="font-weight:600; color: var(--text-main);">Buscar</label>
                                <input id="w-filter-search" type="text" placeholder="Nombre, apellido o cédula..." style="width:100%; box-sizing:border-box; padding:10px; border:1px solid var(--border-color); border-radius:10px; background: var(--bg-color); color: var(--text-main);">
                            </div>
                            <div style="display:flex; flex-direction:column; gap:6px;">
                                <label style="font-weight:600; color: var(--text-main);">Cargo</label>
                                <select id="w-filter-cargo" style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:10px; background: var(--bg-color); color: var(--text-main);">
                                    <option value="">Todos</option>
                                    ${cargos.map(c => `<option value="${c.Id_Cargo}">${c.Nombre_profesión}</option>`).join('')}
                                </select>
                            </div>
                            <div style="display:flex; flex-direction:column; gap:6px;">
                                <label style="font-weight:600; color: var(--text-main);">Tipo de nómina</label>
                                <select id="w-filter-tipo" style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:10px; background: var(--bg-color); color: var(--text-main);">
                                    <option value="">Todos</option>
                                    ${tiposNomina.map(t => `<option value="${t.Id_TipoNomina || t.Id_Tipo_Nomina}">${t.Frecuencia}</option>`).join('')}
                                </select>
                            </div>
                            <div style="display:flex; flex-direction:column; gap:6px;">
                                <label style="font-weight:600; color: var(--text-main);">Estado</label>
                                <select id="w-filter-estado" style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:10px; background: var(--bg-color); color: var(--text-main);">
                                    <option value="">Todos</option>
                                    <option value="Activo">Activos</option>
                                    <option value="Inactivo">Inactivos</option>
                                </select>
                            </div>
                        </div>

                        <div id="workers-table-container" style="margin-top:20px;">
                            ${renderWorkersTableHTML(allWorkersSource)}
                        </div>

                        <div style="margin-top: 25px; border-top: 1px solid var(--border-color); padding-top: 20px; text-align: center;">
                            <button id="add-worker-btn" class="primary">➕ Registrar Nuevo Trabajador</button>
                            <div id="worker-msg" style="font-weight: bold; font-family: sans-serif; margin-top: 10px;"></div>
                        </div>
                    </div>

                    <!-- Formulario (Oculto inicialmente, debajo de la tabla) -->
                    <div id="worker-form-container" style="display: none; background: var(--card-bg); padding: 25px; border-radius: 12px; border: 1px solid var(--border-color); margin-top: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.15);">
                        <h5 id="worker-form-title" style="margin-top:0; color: var(--text-main); font-size: 1.25em; border-bottom: 2px solid var(--primary); padding-bottom:10px; margin-bottom:20px;">Datos del Trabajador</h5>
                        <form id="worker-form">
                            <input type="hidden" id="w-id-trabajador">
                            
                            <!-- Sección 1: Información Personal -->
                            <div class="form-section" style="margin-bottom: 30px; padding: 20px; border: 1px solid var(--border-color); border-radius: 10px; background: rgba(0,0,0,0.02);">
                                <h6 style="margin-top:0; margin-bottom:20px; color: var(--primary); display:flex; align-items:center; gap:8px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> Información Personal</h6>
                                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                                    <div><label class="form-label">Nombres <span class="required">*</span></label><input type="text" id="w-nombres" required class="only-letters"></div>
                                    <div><label class="form-label">Apellidos <span class="required">*</span></label><input type="text" id="w-apellidos" required class="only-letters"></div>
                                    
                                    <div>
                                        <label class="form-label">Documento de identidad <span class="required">*</span></label>
                                        <div style="display:flex; gap:5px;">
                                            <select id="w-cedula-prefix" style="width:70px;"><option value="V-">V-</option><option value="E-">E-</option><option value="P-">P-</option><option value="G-">G-</option></select>
                                            <input type="text" id="w-cedula-num" required class="only-numbers" placeholder="12345678" maxlength="8" style="flex:1;">
                                        </div>
                                        <small id="w-cedula-helper" style="color:var(--text-muted); font-size:0.75em;">7 a 8 dígitos.</small>
                                    </div>
                                    <div><label class="form-label">Fecha de nacimiento <span class="required">*</span></label><input type="date" id="w-fecha-nac" required></div>
                                    
                                    <div><label class="form-label">Género <span class="required">*</span></label><select id="w-genero" required><option value="">Seleccione...</option><option value="M">Masculino</option><option value="F">Femenino</option></select></div>
                                    <div><label class="form-label">Estado civil <span class="required">*</span></label><select id="w-estado-civil" required><option value="">Seleccione...</option><option value="Soltero/a">Soltero/a</option><option value="Casado/a">Casado/a</option><option value="Divorciado/a">Divorciado/a</option><option value="Viudo/a">Viudo/a</option></select></div>
                                    
                                    <div><label class="form-label">Correo electrónico</label><input type="email" id="w-correo"></div>
                                    <div>
                                        <label class="form-label">Teléfono móvil <span class="required">*</span></label>
                                        <div style="display:flex; gap:5px;">
                                            <select id="w-telef-prefix" style="width:90px;"><option value="">---</option><option value="0412">0412</option><option value="0414">0414</option><option value="0416">0416</option><option value="0424">0424</option><option value="0426">0426</option></select>
                                            <input type="text" id="w-telef-num" class="only-numbers" placeholder="1234567" maxlength="7" style="flex:1;">
                                        </div>
                                        <small style="color:var(--text-muted); font-size:0.75em;">Exactamente 7 dígitos después del prefijo.</small>
                                    </div>
                                    <div style="grid-column: 1 / -1;"><label class="form-label">Dirección <span class="required">*</span></label><input type="text" id="w-direccion" maxlength="255" style="width:100%;"></div>
                                </div>
                            </div>

                            <!-- Sección 2: Información Laboral -->
                            <div class="form-section" style="margin-bottom: 30px; padding: 20px; border: 1px solid var(--border-color); border-radius: 10px; background: rgba(0,0,0,0.02);">
                                <h6 style="margin-top:0; margin-bottom:20px; color: var(--primary); display:flex; align-items:center; gap:8px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg> Información Laboral</h6>
                                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                                    <div>
                                        <label class="form-label">Cargo <span class="required">*</span></label>
                                        <div style="display:flex; gap:8px; align-items:center;">
                                            <select id="w-cargo" required style="flex:1;"><option value="">Seleccione...</option>${cargos.filter(c => { const estado = String(c.Estado || c.estado || '').trim().toLowerCase(); return estado !== 'inactivo' && estado !== 'inactive'; }).map(c => `<option value="${c.Id_Cargo}">${c.Nombre_profesión}</option>`).join('')}</select>
                                            <button type="button" id="w-add-cargo-btn" class="primary" title="Registrar nuevo cargo" style="flex-shrink:0; width:30px; height:30px; padding:0; font-size:0.85em; line-height:1;">➕</button>
                                        </div>
                                    </div>
                                    <div><label class="form-label">Nivel educativo <span class="required">*</span></label><select id="w-nivel" required><option value="">Seleccione...</option>${niveles.map(n => `<option value="${n.Id_Nivel_Educativo}">${n.Nombre_Nivel}</option>`).join('')}</select></div>
                                    <div style="grid-column: 1 / -1;"><label class="form-label">Fecha de ingreso <span class="required">*</span></label><input type="date" id="w-fecha-ingreso" required></div>
                                </div>
                            </div>

                             <!-- Sección 3: Contrato -->
                             <div class="form-section" style="margin-bottom: 30px; padding: 20px; border: 1px solid var(--border-color); border-radius: 10px; background: rgba(0,0,0,0.02);">
                                <h6 style="margin-top:0; margin-bottom:20px; color: var(--primary); display:flex; align-items:center; gap:8px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> Contrato</h6>
                                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                                    <div><label class="form-label">Tipo de nómina <span class="required">*</span></label><select id="w-tipo-nomina" required><option value="">Seleccione...</option>${tiposNomina.map(t => `<option value="${t.Id_TipoNomina || t.Id_Tipo_Nomina}">${t.Frecuencia}</option>`).join('')}</select></div>
                                    <div><label class="form-label">Estado <span class="required">*</span></label><select id="w-estado" required><option value="">Seleccione...</option><option value="Activo">Activo</option><option value="Inactivo">Inactivo</option></select></div>
                                    <div style="grid-column: 1 / -1;"><label class="form-label">Observaciones</label><textarea id="w-observaciones" style="width:100%; height:80px; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);"></textarea></div>
                                </div>
                            </div>

                            <div style="margin-top:25px; display:flex; gap:15px; justify-content: flex-end;">
                                <button type="button" id="cancel-worker-btn" class="secondary" style="height: 45px; padding: 0 30px;">Cancelar</button>
                                <button type="submit" class="primary" style="min-width: 180px; height: 45px; font-weight: bold; background: #10a87a;">💾 Guardar Trabajador</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;

            setupWorkerListeners(allWorkersSource, cargos, niveles, tiposNomina);

        } catch (e) {
            contentDetails.innerHTML = `<div class="error">Error cargando trabajadores: ${e.message}</div>`;
        }
    }

    function renderWorkersTableHTML(workers) {
        if (!workers.length) return '<p class="center" style="color: var(--text-muted); padding:30px;">No hay trabajadores registrados.</p>';
        return `
            <div class="content-box" style="border:none; padding:0; background:transparent;">
                <table class="data-table" style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: var(--primary); color: white;">
                            <th style="padding: 12px; border: 1px solid var(--border-color);">Nombre</th>
                            <th style="padding: 12px; border: 1px solid var(--border-color);">Cédula</th>
                            <th style="padding: 12px; border: 1px solid var(--border-color);">Cargo</th>
                            <th style="padding: 12px; border: 1px solid var(--border-color);">Estado</th>
                            <th style="padding: 12px; border: 1px solid var(--border-color);">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${workers.map(w => `
                            <tr style="border-bottom: 1px solid var(--border-color);">
                                <td style="padding: 10px; border: 1px solid var(--border-color); color: var(--text-main);">${w.Nombre_Completo} ${w.Apellidos}</td>
                                <td style="padding: 10px; border: 1px solid var(--border-color); font-weight: 600; color: var(--text-main);">${w.Documento_Identidad}</td>
                                <td style="padding: 10px; border: 1px solid var(--border-color); color: var(--text-main);">${w.Cargo || '-'}</td>
                                <td style="padding: 10px; border: 1px solid var(--border-color);">
                                    <span style="padding: 6px 14px; border-radius: 20px; font-size: 0.8em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
                                        background-color: ${w.Contrato_Estado === 'Activo' ? 'var(--success-color)' : 'var(--error-color)'}; color: white;">
                                        ${w.Contrato_Estado || 'Sin contrato'}
                                    </span>
                                </td>
                                <td style="padding: 10px; border: 1px solid var(--border-color);">
                                    <button class="btn-edit-worker primary small" data-id="${w.Id_Trabajador}">Editar</button>
                                    <button class="btn-toggle-worker secondary small" data-id="${w.Id_Trabajador}" data-estado="${w.Contrato_Estado}">
                                        ${w.Contrato_Estado === 'Activo' ? 'Desactivar' : 'Activar'}
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    // --- Modal: Registrar Nuevo Cargo (desde el formulario de trabajador) ---
    function showCreateCargoModal(cargos) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay modal-info';
            overlay.innerHTML = `
                <div class="modal-content" style="max-width: 550px; width: 60%;">
                    <button class="modal-close-x" type="button">✖</button>
                    <div class="modal-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                        <h3 class="modal-title" style="margin:0;">Registrar Nuevo Cargo</h3>
                    </div>
                    <div class="modal-body" style="overflow-x:hidden;">
                        <form id="modal-cargo-form" style="padding-top:10px;">
                            <div style="display:grid; grid-template-columns:1fr; gap:20px;">
                                <div>
                                    <label style="display:block; font-weight:600; margin-bottom:6px; color: var(--text-main);">Nombre del Cargo <span style="color:#e74c3c;">*</span></label>
                                    <input type="text" id="modal-cargo-nombre" maxlength="100" style="width:80%; box-sizing:border-box; padding:8px 10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                </div>
                                <div>
                                    <label style="display:block; font-weight:600; margin-bottom:6px; color: var(--text-main);">Área Administrativa <span style="color:#e74c3c;">*</span></label>
                                    <input type="text" id="modal-cargo-area" maxlength="100" style="width:80%; box-sizing:border-box; padding:8px 10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                </div>
                            </div>
                            <div id="modal-cargo-error" style="display:none; margin-top:12px; color:#e74c3c; font-size:0.9em;"></div>
                            <div style="margin-top:20px; display:flex; gap:10px; justify-content: flex-end;">
                                <button type="button" class="modal-btn modal-cancel">Cancelar</button>
                                <button type="submit" class="modal-btn modal-ok" style="min-width:140px;">Guardar Cargo</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);
            overlay.offsetWidth; // Force reflow for animation
            overlay.classList.add('modal-show');

            const nombreEl = overlay.querySelector('#modal-cargo-nombre');
            const areaEl = overlay.querySelector('#modal-cargo-area');
            const errorEl = overlay.querySelector('#modal-cargo-error');
            const modalForm = overlay.querySelector('#modal-cargo-form');
            const submitBtn = overlay.querySelector('.modal-ok');
            nombreEl.focus();

            function close(result) {
                overlay.classList.remove('modal-show');
                resolve(result);
                setTimeout(() => overlay.remove(), 300);
            }

            function showFormError(msg) {
                errorEl.textContent = msg;
                errorEl.style.display = 'block';
            }

            overlay.querySelector('.modal-close-x').addEventListener('click', () => close(null));
            overlay.querySelector('.modal-cancel').addEventListener('click', () => close(null));
            overlay.addEventListener('click', (e) => { if (e.target === overlay) close(null); });

            modalForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                errorEl.style.display = 'none';

                const nombre = (nombreEl.value || '').trim();
                const area = (areaEl.value || '').trim();

                if (!nombre) return showFormError('El nombre del cargo es obligatorio.');
                if (!area) return showFormError('El área administrativa es obligatoria.');
                if (cargos.some(c => String(c.Nombre_profesión || '').trim().toLowerCase() === nombre.toLowerCase())) {
                    return showFormError('Ya existe un cargo con este nombre.');
                }

                submitBtn.disabled = true;
                submitBtn.textContent = 'Guardando...';
                try {
                    const data = await safePost('/cargos', { Nombre_profesión: nombre, Area: area });
                    close({ Id_Cargo: data.id, Nombre_profesión: nombre, Area: area, Estado: 'Activo' });
                } catch (err) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Guardar Cargo';
                    const errorMessage = String(err.message || '').toLowerCase();
                    if (/duplicate entry|nombre[_ ]profes[ií]on|already exists|ya existe/.test(errorMessage)) {
                        showFormError('Ya existe un cargo con este nombre.');
                    } else {
                        showFormError(err.message || 'Error al guardar el cargo.');
                    }
                }
            });
        });
    }

    function setupWorkerListeners(workers, cargos, niveles, tiposNomina) {
        const formContainer = document.getElementById('worker-form-container');
        const addBtn = document.getElementById('add-worker-btn');
        const cancelBtn = document.getElementById('cancel-worker-btn');
        const form = document.getElementById('worker-form');

        // Botón ➕ junto al campo Cargo: abre modal para registrar un nuevo cargo
        const addCargoBtn = document.getElementById('w-add-cargo-btn');
        if (addCargoBtn) {
            addCargoBtn.addEventListener('click', async () => {
                const nuevoCargo = await showCreateCargoModal(cargos);
                if (!nuevoCargo) return;

                cargos.push(nuevoCargo);

                const cargoSelect = document.getElementById('w-cargo');
                if (cargoSelect) {
                    const opt = document.createElement('option');
                    opt.value = nuevoCargo.Id_Cargo;
                    opt.textContent = nuevoCargo.Nombre_profesión;
                    cargoSelect.appendChild(opt);
                    cargoSelect.value = String(nuevoCargo.Id_Cargo);
                }

                showSuccess('Cargo registrado correctamente');
            });
        }

        let oldFechaIngreso = null;

        // Input restrictions and error displays
        const iCedulaPrefix = document.getElementById('w-cedula-prefix');
        const iCedulaHelper = document.getElementById('w-cedula-helper');
        const iCedulaNum = document.getElementById('w-cedula-num');
        if (iCedulaPrefix && iCedulaHelper && iCedulaNum) {
            iCedulaPrefix.addEventListener('change', () => {
                if (iCedulaPrefix.value === 'E-') {
                    iCedulaHelper.textContent = '9 a 10 dígitos.';
                    iCedulaNum.placeholder = '1234567890';
                    iCedulaNum.maxLength = 10;
                } else {
                    iCedulaHelper.textContent = '7 a 8 dígitos.';
                    iCedulaNum.placeholder = '12345678';
                    iCedulaNum.maxLength = 8;
                    if (iCedulaNum.value.length > 8) {
                        iCedulaNum.value = iCedulaNum.value.substring(0, 8);
                    }
                }
            });
        }

        form.querySelectorAll('.only-numbers').forEach(input => {
            input.addEventListener('keypress', (e) => {
                const char = String.fromCharCode(e.which);
                if (!/[0-9]/.test(char) && !e.ctrlKey && !e.metaKey && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                    e.preventDefault();
                    let msg = '';
                    if (input.id === 'w-cedula-num') msg = 'El documento solo puede contener números.';
                    if (input.id === 'w-telef-num') msg = 'Este campo solo puede contener números.';
                    if (msg) {
                        showInlineError(input, msg);
                        setTimeout(() => clearInlineError(input), 2000);
                    }
                }
            });
            input.addEventListener('input', (e) => {
                const v = e.target.value;
                if (/[^0-9]/.test(v)) {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    let msg = '';
                    if (input.id === 'w-cedula-num') msg = 'El documento solo puede contener números.';
                    if (input.id === 'w-telef-num') msg = 'Este campo solo puede contener números.';
                    if (msg) {
                        showInlineError(input, msg);
                        setTimeout(() => clearInlineError(input), 2000);
                    }
                } else {
                    if (input.id === 'w-cedula-num' || input.id === 'w-telef-num') clearInlineError(input);
                }
            });
        });
        form.querySelectorAll('.only-letters').forEach(input => {
            input.addEventListener('keypress', (e) => {
                const char = String.fromCharCode(e.which);
                if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(char) && !e.ctrlKey && !e.metaKey && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                    e.preventDefault();
                    const msg = input.id === 'w-nombres' ? 'El nombre solo puede contener letras.' : (input.id === 'w-apellidos' ? 'El apellido solo puede contener letras.' : '');
                    if (msg) {
                        showInlineError(input, msg);
                        setTimeout(() => clearInlineError(input), 2000);
                    }
                }
            });
            input.addEventListener('input', (e) => {
                const v = e.target.value;
                if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(v)) {
                    e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                    const msg = input.id === 'w-nombres' ? 'El nombre solo puede contener letras.' : (input.id === 'w-apellidos' ? 'El apellido solo puede contener letras.' : '');
                    if (msg) {
                        showInlineError(input, msg);
                        setTimeout(() => clearInlineError(input), 2000);
                    }
                } else {
                    if (input.id === 'w-nombres' || input.id === 'w-apellidos') clearInlineError(input);
                }
            });
        });

        const iCorreo = document.getElementById('w-correo');
        if (iCorreo) {
            const checkCorreo = () => {
                const v = iCorreo.value.trim();
                if (!v) {
                    clearInlineError(iCorreo);
                } else if (!v.includes('@')) {
                    showInlineError(iCorreo, 'Tu dirección de correo electrónico debe contener @.');
                } else if (!validateEmailFormat(v)) {
                    showInlineError(iCorreo, 'Formato de correo inválido');
                } else if (!validateEmailDomain(v)) {
                    showInlineError(iCorreo, 'Dominio no permitido (ej: gmail.com)');
                } else {
                    clearInlineError(iCorreo);
                    iCorreo.style.borderColor = '#2ecc71';
                }
            };
            iCorreo.addEventListener('input', checkCorreo);
            iCorreo.addEventListener('blur', checkCorreo);
        }

        const iNac = document.getElementById('w-fecha-nac');
        const iIngreso = document.getElementById('w-fecha-ingreso');
        const todayStr = new Date().toISOString().split('T')[0];

        if (iNac) {
            iNac.max = todayStr;
            iNac.addEventListener('change', () => {
                const v = iNac.value;
                if (!v) { clearInlineError(iNac); return; }
                const vParts = v.split('-');
                const date = new Date(vParts[0], vParts[1] - 1, vParts[2]);
                const today = new Date();
                today.setHours(23, 59, 59, 999);
                if (date > today) {
                    showInlineError(iNac, 'La fecha de nacimiento no puede ser futura.');
                } else {
                    let age = today.getFullYear() - date.getFullYear();
                    const m = today.getMonth() - date.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;
                    if (age < 18) {
                        showInlineError(iNac, 'El trabajador debe ser mayor de edad.');
                    } else {
                        clearInlineError(iNac);
                    }
                }
            });
        }
        if (iIngreso) {
            iIngreso.max = todayStr;
            const checkIngreso = () => {
                const v = iIngreso.value;
                const vNac = iNac ? iNac.value : null;
                
                if (!v) { clearInlineError(iIngreso); return; }
                
                const vParts = v.split('-');
                const hireDate = new Date(vParts[0], vParts[1] - 1, vParts[2]);
                const today = new Date();
                today.setHours(23, 59, 59, 999);
                
                if (hireDate > today) {
                    showInlineError(iIngreso, 'La fecha de ingreso no puede ser futura.');
                } else if (vNac && new Date(v) <= new Date(vNac)) {
                    showInlineError(iIngreso, 'La fecha de ingreso del trabajador no puede ser menor o igual a su fecha de nacimiento.');
                } else {
                    clearInlineError(iIngreso);
                }
            };
            iIngreso.addEventListener('change', checkIngreso);
            if (iNac) iNac.addEventListener('change', checkIngreso);
        }

        addBtn.addEventListener('click', () => {
            const isVisible = formContainer.style.display === 'block';
            formContainer.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) formContainer.scrollIntoView({ behavior: 'smooth' });
            form.reset();
            form.querySelectorAll('input, select, textarea').forEach(el => clearInlineError(el));
            document.getElementById('w-id-trabajador').value = '';
            document.getElementById('worker-form-title').innerText = 'Datos del Trabajador (Registro)';
        });

        cancelBtn.addEventListener('click', () => {
            formContainer.style.display = 'none';
            form.querySelectorAll('input, select, textarea').forEach(el => clearInlineError(el));
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('w-id-trabajador').value;

            // --- VALIDACIONES ---
            const ciPrefix = document.getElementById('w-cedula-prefix').value;
            const ciNum = document.getElementById('w-cedula-num').value;
            
            if (ciPrefix === 'E-') {
                if (ciNum.length < 9 || ciNum.length > 10) {
                    return showError('Para prefijo Extranjero (E-), el documento debe tener entre 9 y 10 dígitos.');
                }
            } else {
                if (ciNum.length < 7 || ciNum.length > 8) {
                    return showError('La cédula debe tener entre 7 y 8 dígitos.');
                }
            }

            const tPrefix = document.getElementById('w-telef-prefix').value;
            const tNum = document.getElementById('w-telef-num').value;
            if (!tNum) {
                showInlineError(document.getElementById('w-telef-num'), 'El teléfono móvil es obligatorio.');
                return showError('El teléfono móvil es obligatorio.');
            }
            if (tNum && tNum.length !== 7) {
                showInlineError(document.getElementById('w-telef-num'), 'El número de teléfono debe tener exactamente 7 dígitos después del prefijo.');
                return showError('El número de teléfono debe tener exactamente 7 dígitos después del prefijo.');
            }

            const direccionVal = document.getElementById('w-direccion').value.trim();
            if (!direccionVal) {
                showInlineError(document.getElementById('w-direccion'), 'La dirección es obligatoria.');
                return showError('La dirección es obligatoria.');
            }

            // Validación de Correo (Whitelist de Dominios y Formato)
            const emailValue = document.getElementById('w-correo').value.trim();
            if (emailValue) {
                if (!emailValue.includes('@')) {
                    return showError('Tu dirección de correo electrónico debe contener @.');
                }
                if (!validateEmailFormat(emailValue)) {
                    return showError('Formato de correo inválido');
                }
                if (!validateEmailDomain(emailValue)) {
                    return showError('Dominio no permitido (ej: gmail.com)');
                }
            }

            // Validación de Edad (18+) y obligatoriedad de Fecha de Nacimiento
            const birthValue = document.getElementById('w-fecha-nac').value;
            if (!birthValue) {
                showInlineError(document.getElementById('w-fecha-nac'), 'La fecha de nacimiento es obligatoria.');
                return showError('La fecha de nacimiento es obligatoria.');
            }
            if (birthValue) {
                const bParts = birthValue.split('-');
                const birthDate = new Date(bParts[0], bParts[1] - 1, bParts[2]);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

                if (age < 18) {
                    return showError('El trabajador debe ser mayor de 18 años.');
                }
            }

            // Validación de Fecha de Ingreso (No futura y no menor a nacimiento)
            const hireValue = document.getElementById('w-fecha-ingreso').value;
            const hParts = hireValue.split('-');
            const hireDate = new Date(hParts[0], hParts[1] - 1, hParts[2]);
            const now = new Date();
            now.setHours(23, 59, 59, 999); 

            if (hireDate > now) {
                showInlineError(document.getElementById('w-fecha-ingreso'), 'La fecha de ingreso no puede ser futura.');
                return showError('La fecha de ingreso no puede ser futura.');
            }
            if (birthValue && new Date(hireValue) <= new Date(birthValue)) {
                showInlineError(document.getElementById('w-fecha-ingreso'), 'La fecha de ingreso del trabajador no puede ser menor o igual a su fecha de nacimiento.');
                return showError('La fecha de ingreso del trabajador no puede ser menor o igual a su fecha de nacimiento.');
            }
            
            const civStatus = document.getElementById('w-estado-civil').value;
            if (!civStatus) {
                showInlineError(document.getElementById('w-estado-civil'), 'El estado civil es obligatorio.');
                return showError('El estado civil es obligatorio.');
            }

            // Género obligatorio
            const generoVal = document.getElementById('w-genero').value;
            if (!generoVal) {
                showInlineError(document.getElementById('w-genero'), 'El género es obligatorio.');
                return showError('El género es obligatorio.');
            }

            // Estado del contrato obligatorio
            const estadoContratoVal = document.getElementById('w-estado').value;
            if (!estadoContratoVal) {
                showInlineError(document.getElementById('w-estado'), 'El estado del contrato es obligatorio.');
                return showError('El estado del contrato es obligatorio.');
            }

            // Reconstruir CI y Teléfono
            const ci = document.getElementById('w-cedula-prefix').value + ciNum;
            let tel = tPrefix ? (tPrefix + '-' + tNum) : tNum;

            const payload = {
                Nombre_Completo: document.getElementById('w-nombres').value,
                Apellidos: document.getElementById('w-apellidos').value,
                Documento_Identidad: ci,
                Fecha_Nacimiento: birthValue,
                Genero: document.getElementById('w-genero').value,
                Estado_Civil: document.getElementById('w-estado-civil').value,
                Correo: document.getElementById('w-correo').value,
                Telefono_Movil: tel,
                Direccion: document.getElementById('w-direccion').value,
                Id_Cargo: parseInt(document.getElementById('w-cargo').value),
                Id_Nivel_Educativo: parseInt(document.getElementById('w-nivel').value),
                Id_Tipo_Nomina: parseInt(document.getElementById('w-tipo-nomina').value),
                Fecha_de_Ingreso: hireValue,
                Estado: document.getElementById('w-estado').value,
                Observaciones: document.getElementById('w-observaciones').value
            };

            try {
                const endpoint = id ? `/workers/${id}` : '/workers';
                await safePost(endpoint, payload);
                showSuccess(id ? 'Trabajador actualizado con éxito' : 'Trabajador registrado con éxito');
                renderWorkerRegistration();
            } catch (e) {
                showError(e.message);
            }
        });

        const attachWorkerRowListeners = () => {
        document.querySelectorAll('.btn-edit-worker').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const w = workers.find(x => String(x.Id_Trabajador) === String(id));
                if (w) {
                    const setFieldValue = (fieldId, value) => {
                        const field = document.getElementById(fieldId);
                        if (!field) return;
                        field.value = value ?? '';
                    };

                    document.getElementById('w-id-trabajador').value = w.Id_Trabajador ?? '';
                    setFieldValue('w-nombres', w.Nombre_Completo);
                    setFieldValue('w-apellidos', w.Apellidos);

                    // Parse CI
                    const ciParts = (w.Documento_Identidad || '').split('-');
                    if (ciParts.length === 2) {
                        setFieldValue('w-cedula-prefix', ciParts[0] + '-');
                        setFieldValue('w-cedula-num', ciParts[1]);
                    } else {
                        setFieldValue('w-cedula-prefix', '');
                        setFieldValue('w-cedula-num', w.Documento_Identidad || '');
                    }

                    setFieldValue('w-fecha-nac', w.Fecha_Nacimiento);
                    setFieldValue('w-genero', w.Genero);
                    setFieldValue('w-estado-civil', w.Estado_Civil);
                    setFieldValue('w-correo', w.Correo);

                    if (w.Telefono_Movil) {
                        if (w.Telefono_Movil.includes('-')) {
                            const tParts = w.Telefono_Movil.split('-');
                            setFieldValue('w-telef-prefix', tParts[0]);
                            setFieldValue('w-telef-num', tParts[1]);
                        } else {
                            setFieldValue('w-telef-prefix', '');
                            setFieldValue('w-telef-num', w.Telefono_Movil);
                        }
                    } else {
                        setFieldValue('w-telef-prefix', '');
                        setFieldValue('w-telef-num', '');
                    }

                    setFieldValue('w-direccion', w.Direccion);
                    setFieldValue('w-cargo', w.Id_Cargo);
                    const cargoSelect = document.getElementById('w-cargo');
                    if (cargoSelect && w.Id_Cargo && !Array.from(cargoSelect.options).some(opt => opt.value === String(w.Id_Cargo))) {
                        const currentCargo = cargos.find(x => String(x.Id_Cargo) === String(w.Id_Cargo));
                        if (currentCargo) {
                            const opt = document.createElement('option');
                            opt.value = currentCargo.Id_Cargo;
                            opt.textContent = `${currentCargo.Nombre_profesión} (Desactivado)`;
                            opt.selected = true;
                            opt.disabled = true;
                            cargoSelect.appendChild(opt);
                        }
                    }
                    setFieldValue('w-nivel', w.Id_Nivel_Educativo);
                    setFieldValue('w-tipo-nomina', w.Id_Tipo_Nomina);
                    setFieldValue('w-fecha-ingreso', w.Fecha_de_Ingreso);
                    setFieldValue('w-estado', w.Contrato_Estado);
                    setFieldValue('w-observaciones', w.Observaciones);

                    document.getElementById('worker-form-title').textContent = 'Editar Trabajador';
                    formContainer.style.display = 'block';
                    formContainer.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        document.querySelectorAll('.btn-toggle-worker').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const estado = btn.dataset.estado;
                const action = estado === 'Activo' ? 'deactivate' : 'activate';

                const confirmed = await showConfirm(`¿Desea ${action === 'activate' ? 'activar' : 'desactivar'} este trabajador?`);
                if (!confirmed) return;

                try {
                    await safePost(`/workers/${id}/${action}`);
                    showSuccess(`Trabajador ${action === 'activate' ? 'activado' : 'desactivado'} correctamente`);
                    renderWorkerRegistration();
                } catch (e) {
                    showError(e.message);
                }
            });
        });
        };

        // Filtros en vivo de la tabla de trabajadores
        const workerFilters = { search: '', cargo: '', tipo: '', estado: '' };

        const filterWorkers = () => workers.filter(w => {
            const s = workerFilters.search;
            const fullName = `${w.Nombre_Completo || ''} ${w.Apellidos || ''}`.toLowerCase();
            const cedula = String(w.Documento_Identidad || '').toLowerCase();
            const matchesSearch = !s || fullName.includes(s) || cedula.includes(s);
            const matchesCargo = !workerFilters.cargo || String(w.Id_Cargo) === workerFilters.cargo;
            const matchesTipo = !workerFilters.tipo || String(w.Id_Tipo_Nomina) === workerFilters.tipo;
            const matchesEstado = !workerFilters.estado || (workerFilters.estado === 'Activo' ? w.Contrato_Estado === 'Activo' : w.Contrato_Estado !== 'Activo');
            return matchesSearch && matchesCargo && matchesTipo && matchesEstado;
        });

        // Paginación de la tabla de trabajadores
        let workersPage = 1;
        const workersTableContainer = document.getElementById('workers-table-container');
        const refreshWorkersTable = () => {
            if (!workersTableContainer) return;
            const filtered = filterWorkers();
            const pg = paginateItems(filtered, workersPage);
            workersPage = pg.current;
            workersTableContainer.innerHTML = renderWorkersTableHTML(pg.items) + renderPaginationHTML('workers-page-btn', pg.current, pg.totalPages, pg.total);
            attachWorkerRowListeners();
            attachPaginationListeners(workersTableContainer, 'workers-page-btn', (p) => { workersPage = p; refreshWorkersTable(); });
        };
        refreshWorkersTable();

        // Enganchar filtros (filtrado en vivo: input/change → re-render inmediato)
        const wFilterSearch = document.getElementById('w-filter-search');
        const wFilterCargo = document.getElementById('w-filter-cargo');
        const wFilterTipo = document.getElementById('w-filter-tipo');
        const wFilterEstado = document.getElementById('w-filter-estado');

        if (wFilterSearch) wFilterSearch.addEventListener('input', () => {
            workerFilters.search = wFilterSearch.value.trim().toLowerCase();
            workersPage = 1;
            refreshWorkersTable();
        });
        if (wFilterCargo) wFilterCargo.addEventListener('change', () => {
            workerFilters.cargo = wFilterCargo.value;
            workersPage = 1;
            refreshWorkersTable();
        });
        if (wFilterTipo) wFilterTipo.addEventListener('change', () => {
            workerFilters.tipo = wFilterTipo.value;
            workersPage = 1;
            refreshWorkersTable();
        });
        if (wFilterEstado) wFilterEstado.addEventListener('change', () => {
            workerFilters.estado = wFilterEstado.value;
            workersPage = 1;
            refreshWorkersTable();
        });

        // Initialize Mini Chart
        setTimeout(() => {
            const ctx = document.getElementById('worker-mini-chart');
            if (ctx && typeof Chart !== 'undefined') {
                new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: [workers.filter(w => w.Contrato_Estado === 'Activo').length, workers.filter(w => w.Contrato_Estado !== 'Activo').length],
                            backgroundColor: ['#10a87a', '#6b7280'],
                            borderWidth: 0
                        }]
                    },
                    options: { cutout: '70%', plugins: { tooltip: { enabled: false } } }
                });
            }
        }, 100);
    }

    // --- Módulo: Panel de Vacaciones ---
    async function renderAdminVacations(showHistoryAfter = false) {
        contentDetails.innerHTML = '<div class="loader">Cargando módulo de vacaciones...</div>';
        try {
            const [data, wData] = await Promise.all([
                apiFetch('/vacations'),
                apiFetch('/workers')
            ]);
            let requests = data.requests || [];
            let workers = (wData.workers || []).filter(w => w.Contrato_Estado === 'Activo');
            // Filter workers > 1 year
            let eligibleWorkers = workers.filter(w => {
                if (!w.Fecha_de_Ingreso) return false;
                const hireParts = w.Fecha_de_Ingreso.split('-');
                const hire = new Date(hireParts[0], hireParts[1] - 1, hireParts[2]);
                const now = new Date();
                const years = (now - hire) / (1000 * 60 * 60 * 24 * 365.25);
                return years >= 1;
            });

            contentDetails.innerHTML = `
                <div class="vacation-panel">
                    <h4 style="color: var(--text-main); border-bottom: 2px solid var(--primary); padding-bottom: 10px; margin-bottom: 25px;">Panel de Gestión de Vacaciones</h4>
                    
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
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin: 20px 0;">
                            <div class="chart-container" style="margin-bottom:0; display:flex; flex-direction:column; align-items:center; padding: 15px;">
                                <h5 style="margin:0 0 0 0; color:var(--text-muted); font-size: 1.3em;">Distribución de Solicitudes</h5>
                                <div style="width:100%; height:10px;"><canvas id="vacation-main-chart"></canvas></div>
                            </div>
                        </div>

                        <div class="filters" style="margin: 20px 0; display: flex; gap: 15px; align-items: center; flex-wrap: wrap;">
                            <label style="color: var(--text-main); font-weight: 600;">Ordenar por:</label>
                            <select id="sort-field" style="padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-color); color: var(--text-main);">
                                <option value="Fecha_Solicitud">Fecha de Solicitud</option>
                                <option value="Fecha_Inicio_Vacaciones">Fecha de Inicio</option>
                                <option value="Estado">Estado</option>
                            </select>
                            <select id="sort-direction" style="padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-color); color: var(--text-main);">
                                <option value="desc">Más reciente primero</option>
                                <option value="asc">Más antiguo primero</option>
                            </select>
                            <input type="text" id="search-worker" placeholder="Buscar trabajador..." style="padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-color); color: var(--text-main); flex: 1; min-width: 200px;">
                        </div>

                        <div id="vacation-list">
                            ${renderVacationsTableHTML(requests, false)}
                        </div>
                    </div>

                    <div id="tab-pagos" class="vac-tab-content" style="display: none;">

                        <!-- Botón Crear Nuevo Pago — mismo estilo que "Registrar Nuevo Trabajador" -->
                        <div style="margin-bottom: 25px; padding-top: 5px;">
                            <button id="btn-show-create-vac-payment" class="primary" style="
                                padding: 12px 28px; font-weight: 700; border-radius: 10px;
                                font-size: 0.98rem; letter-spacing: 0.3px;
                                display: inline-flex; align-items: center; gap: 10px;
                                box-shadow: 0 4px 14px rgba(0,0,0,0.18);
                                transition: all 0.25s cubic-bezier(0.4,0,0.2,1);">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                                Crear Nuevo Pago de Vacaciones
                            </button>
                        </div>

                        <!-- Formulario de pago (oculto inicialmente) -->
                        <div id="vacation-payment-form-container" style="display: none; background: var(--card-bg); padding: 30px; border-radius: 14px; border: 1px solid var(--border-color); box-shadow: 0 10px 40px rgba(0,0,0,0.1); margin-bottom: 25px;">
                            <h4 style="margin-top: 0; color: var(--text-main); border-bottom: 2px solid var(--primary); padding-bottom: 12px; margin-bottom: 28px; font-size: 1.2rem;">
                                Procesar Pago de Vacaciones
                            </h4>

                            <div class="payroll-form">
                                <!-- Sección 1: Datos del trabajador -->
                                <div style="padding: 20px; border: 1px solid var(--border-color); border-radius: 10px; background: rgba(0,0,0,0.02); margin-bottom: 24px;">
                                    <h6 style="margin: 0 0 18px 0; color: var(--primary); font-size: 0.95rem; display: flex; align-items: center; gap: 8px;">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        Datos del Trabajador
                                    </h6>
                                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px;">
                                        <div class="form-row">
                                            <label style="display:block; font-weight:600; margin-bottom:8px; color: var(--text-main); font-size:0.9rem;">Seleccionar Trabajador <span style="color:#e74c3c;">*</span></label>
                                            <select id="vp-worker" style="width:100%; padding:11px 12px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main); font-size:0.95rem;">
                                                <option value="">Seleccione trabajador...</option>
                                                ${eligibleWorkers.map(w => `<option value="${w.Id_Trabajador}">${w.Documento_Identidad} - ${w.Nombre_Completo} ${w.Apellidos}</option>`).join('')}
                                            </select>
                                        </div>
                                        <div class="form-row">
                                            <label style="display:block; font-weight:600; margin-bottom:8px; color: var(--text-main); font-size:0.9rem;">Fecha de Ingreso</label>
                                            <input type="text" id="vp-hire-date" readonly placeholder="— Seleccione trabajador —" style="width:100%; padding:11px 12px; border-radius:8px; border:1px solid var(--border-color); background: rgba(0,0,0,0.04); color: var(--text-muted); cursor: not-allowed; font-size:0.95rem; box-sizing:border-box;">
                                        </div>
                                        <div class="form-row">
                                            <label style="display:block; font-weight:600; margin-bottom:8px; color: var(--text-main); font-size:0.9rem;">Salario Mensual (Bs.) <span style="color:#e74c3c;">*</span></label>
                                            <input type="number" id="vp-salario" min="130" step="0.01" placeholder="Mínimo 130.00" style="width:100%; padding:11px 12px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main); font-size:0.95rem; box-sizing:border-box;">
                                            <small style="color:var(--text-muted); font-size:0.78rem; margin-top:4px; display:block;">No puede ser menor a Bs. 130.00</small>
                                        </div>
                                    </div>
                                </div>

                                <!-- Sección 2: Período vacacional -->
                                <div style="padding: 20px; border: 1px solid var(--border-color); border-radius: 10px; background: rgba(0,0,0,0.02); margin-bottom: 24px;">
                                    <h6 style="margin: 0 0 18px 0; color: var(--primary); font-size: 0.95rem; display: flex; align-items: center; gap: 8px;">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                        Período Vacacional
                                    </h6>
                                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px;">
                                        <div class="form-row">
                                            <label style="display:block; font-weight:600; margin-bottom:8px; color: var(--text-main); font-size:0.9rem;">Año de Pago <span style="color:#e74c3c;">*</span></label>
                                            <select id="vp-year" style="width:100%; padding:11px 12px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main); font-size:0.95rem;">
                                                <option value="">Seleccione trabajador primero...</option>
                                            </select>
                                        </div>
                                        <div class="form-row">
                                            <label style="display:block; font-weight:600; margin-bottom:8px; color: var(--text-main); font-size:0.9rem;">Días de Vacaciones</label>
                                            <input type="text" id="vp-dias-vac" readonly placeholder="—" style="width:100%; padding:11px 12px; border-radius:8px; border:1px solid var(--border-color); background: rgba(0,0,0,0.04); color: var(--text-muted); cursor: not-allowed; font-size:0.95rem; box-sizing:border-box; font-weight:600; text-align:center;">
                                        </div>
                                        <div class="form-row">
                                            <label style="display:block; font-weight:600; margin-bottom:8px; color: var(--text-main); font-size:0.9rem;">Días de Bono Vacacional</label>
                                            <input type="text" id="vp-dias-bono" readonly placeholder="—" style="width:100%; padding:11px 12px; border-radius:8px; border:1px solid var(--border-color); background: rgba(0,0,0,0.04); color: var(--text-muted); cursor: not-allowed; font-size:0.95rem; box-sizing:border-box; font-weight:600; text-align:center;">
                                        </div>
                                    </div>
                                </div>

                                <!-- Sección 3: Resumen -->
                                <div style="padding: 20px; border: 1px solid var(--border-color); border-radius: 10px; background: rgba(0,0,0,0.02); margin-bottom: 24px;">
                                    <h6 style="margin: 0 0 18px 0; color: var(--primary); font-size: 0.95rem; display: flex; align-items: center; gap: 8px;">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                        Resumen del Pago
                                    </h6>
                                    <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
                                        <thead>
                                            <tr style="background: var(--primary); color: white;">
                                                <th style="padding: 12px 16px; text-align: left; border-radius: 8px 0 0 0; font-weight:600;">Concepto</th>
                                                <th style="padding: 12px 16px; text-align: center; font-weight:600;">Días</th>
                                                <th style="padding: 12px 16px; text-align: right; border-radius: 0 8px 0 0; font-weight:600;">Monto (Bs.)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr style="border-bottom: 1px solid var(--border-color);">
                                                <td style="padding: 13px 16px; color: var(--text-main); font-weight: 500;">Días de vacaciones</td>
                                                <td id="vp-td-dias-vac" style="padding: 13px 16px; text-align: center; color: var(--text-main); font-weight: 600;">—</td>
                                                <td id="vp-td-monto-vac" style="padding: 13px 16px; text-align: right; color: var(--text-main); font-weight: 600; font-family: monospace; font-size: 1rem;">—</td>
                                            </tr>
                                            <tr style="border-bottom: 1px solid var(--border-color);">
                                                <td style="padding: 13px 16px; color: var(--text-main); font-weight: 500;">Bono vacacional</td>
                                                <td id="vp-td-dias-bono" style="padding: 13px 16px; text-align: center; color: var(--text-main); font-weight: 600;">—</td>
                                                <td id="vp-td-monto-bono" style="padding: 13px 16px; text-align: right; color: var(--text-main); font-weight: 600; font-family: monospace; font-size: 1rem;">—</td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr style="background: rgba(0,0,0,0.04); border-top: 2px solid var(--border-color);">
                                                <td colspan="2" style="padding: 14px 16px; text-align: right; font-weight: 700; color: var(--text-main); font-size: 1rem;">Total Asignaciones:</td>
                                                <td id="vp-td-total" style="padding: 14px 16px; text-align: right; font-weight: 800; font-size: 1.15rem; color: var(--success-color, #166534); font-family: monospace;">Bs. —</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                <!-- Botones de acción -->
                                <div style="display: flex; gap: 15px; justify-content: flex-end; align-items: center; padding-top: 8px;">
                                    <button id="btn-cancel-vac-payment" class="secondary" style="padding: 12px 28px; font-weight: 700; border-radius: 10px; font-size: 0.95rem;">
                                        Cancelar
                                    </button>
                                    <button id="btn-process-vac-payment" class="primary" style="
                                        padding: 12px 28px; font-weight: 700; border-radius: 10px; font-size: 0.95rem;
                                        display: inline-flex; align-items: center; gap: 10px;
                                        box-shadow: 0 4px 14px rgba(0,0,0,0.18);">
                                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        Confirmar y procesar pago
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Historial -->
                        <div style="margin-bottom: 15px;">
                            <button id="toggle-vac-payments-history" class="secondary" style="padding: 10px 22px; font-weight: 700; border-radius: 10px; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 8px;">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.53"/></svg>
                                Mostrar historial de pagos
                            </button>
                        </div>

                        <div id="vac-payments-history-container" style="display: none; margin-top: 20px;">
                            <h5 style="color: var(--text-main); margin-bottom: 15px; font-size: 1.05rem;">Historial de Pagos de Vacaciones</h5>
                            
                            <!-- Filtros del Historial -->
                            <div style="background: var(--card-bg); border-radius: 10px; border: 1px solid var(--border-color); padding: 18px; margin-bottom: 20px;">
                                <div style="display: grid; gap: 14px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
                                    <div style="display: flex; flex-direction: column; gap: 6px;">
                                        <label style="font-weight: 600; color: var(--text-main); font-size: 0.85rem;">Buscar</label>
                                        <input type="text" id="search-vac-payment" placeholder="Buscar por documento o nombre..." style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 10px; background: var(--bg-color); color: var(--text-main); font-size: 0.9rem;">
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 6px;">
                                        <label style="font-weight: 600; color: var(--text-main); font-size: 0.85rem;">Año Pagado</label>
                                        <select id="filter-vac-year" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 10px; background: var(--bg-color); color: var(--text-main); font-size: 0.9rem;">
                                            <option value="">Todos</option>
                                        </select>
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 6px;">
                                        <label style="font-weight: 600; color: var(--text-main); font-size: 0.85rem;">Fecha de Registro</label>
                                        <input type="date" id="filter-vac-date" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 10px; background: var(--bg-color); color: var(--text-main); font-size: 0.9rem;">
                                    </div>
                                    <div style="display: flex; flex-direction: column; gap: 6px;">
                                        <label style="font-weight: 600; color: var(--text-main); font-size: 0.85rem;">Estatus</label>
                                        <select id="filter-vac-status" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 10px; background: var(--bg-color); color: var(--text-main); font-size: 0.9rem;">
                                            <option value="">Todos</option>
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="Publicado">Publicado</option>
                                            <option value="Anulado">Anulado</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div style="background: var(--card-bg); border-radius: 12px; border: 1px solid var(--border-color); overflow: hidden;">
                                <div style="overflow-x: auto;">
                                    <table style="width: 100%; border-collapse: collapse; font-size: 0.93rem; min-width: 900px;">
                                        <thead>
                                            <tr style="background: var(--primary); color: white;">
                                                <th style="padding: 12px 16px; text-align: center; width: 42px;">
                                                    <input id="vac-history-select-all" type="checkbox" style="width:18px; height:18px; cursor:pointer;">
                                                </th>
                                                <th style="padding: 12px 16px; text-align: left; font-weight:600;">Documento</th>
                                                <th style="padding: 12px 16px; text-align: left; font-weight:600;">Trabajador</th>
                                                <th style="padding: 12px 16px; text-align: center; font-weight:600;">Año pagado</th>
                                                <th style="padding: 12px 16px; text-align: right; font-weight:600;">Total (Bs.)</th>
                                                <th style="padding: 12px 16px; text-align: center; font-weight:600;">Fecha de registro</th>
                                                <th style="padding: 12px 16px; text-align: center; font-weight:600;">Visualización</th>
                                                <th style="padding: 12px 16px; text-align: center; font-weight:600;">Acciones</th>
                                                <th style="padding: 12px 16px; text-align: center; font-weight:600;">Estatus</th>
                                            </tr>
                                        </thead>
                                        <tbody id="vac-payments-tbody">
                                            <tr><td colspan="9" style="padding: 30px; color: var(--text-muted); text-align: center; font-style:italic;">No hay pagos registrados.</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Acciones en Lote -->
                            <div id="vac-history-bulk-actions" style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:12px; margin-top:18px;">
                                <div style="color:var(--text-muted); font-size:0.92em;">Recibos seleccionados: <span id="vac-history-selected-count">0</span></div>
                                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                                    <button id="vac-history-bulk-publish" style="display:none; padding:10px 16px; border-radius:10px; border:none; background:var(--success-color, #10b981); color:white; cursor:pointer; font-weight:700;">Publicar todos</button>
                                    <button id="vac-history-bulk-annul" style="display:none; padding:10px 16px; border-radius:10px; border:none; background:#e74c3c; color:white; cursor:pointer; font-weight:700;">Anular todos</button>
                                    <button id="vac-history-bulk-revert" style="display:none; padding:10px 16px; border-radius:10px; border:none; background:#f39c12; color:white; cursor:pointer; font-weight:700;">Revertir todos</button>
                                </div>
                            </div>
                            <div id="vac-history-bulk-progress" style="display:none; width:100%; height:10px; background:rgba(255,255,255,0.08); border-radius:10px; overflow:hidden; margin-top:10px;">
                                <div id="vac-history-bulk-progress-bar" style="width:0%; height:100%; background:var(--success-color); transition:width 0.24s ease;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Attach workers data to the panel so the setup function can use it
            document.querySelector('.vacation-panel').dataset.workers = JSON.stringify(eligibleWorkers);


            setupVacationListeners(requests, showHistoryAfter); // Pass requests and flag
        } catch (e) {
            contentDetails.innerHTML = `<div class="error">Error: ${e.message}</div>`;
        }
    }

    function renderVacationsTableHTML(requests, isFiltered = false) {
        if (!requests.length) {
            const message = isFiltered
                ? '<p class="center" style="color: var(--text-muted); padding: 40px;">Este trabajador no tiene una solicitud registrada.</p>'
                : '<p class="center" style="color: var(--text-muted); padding: 40px;">No hay solicitudes de vacaciones registradas en el sistema.</p>';
            return message;
        }
        return `
            <div class="content-box" style="margin-top: 10px; border:none; padding:0; background:transparent;">
                <table class="data-table" style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: var(--primary); color: white;">
                            <th style="padding: 12px; border: 1px solid var(--border-color);">Fecha</th>
                            <th style="padding: 12px; border: 1px solid var(--border-color);">Trabajador</th>
                            <th style="padding: 12px; border: 1px solid var(--border-color);">Inicio</th>
                            <th style="padding: 12px; border: 1px solid var(--border-color);">Estado</th>
                            <th style="padding: 12px; border: 1px solid var(--border-color);">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${requests.map(r => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const startDate = new Date(r.Fecha_Inicio_Vacaciones);
                            const isExpired = r.Estado === 'Pendiente' && startDate < today;
                            
                            return `
                            <tr style="border-bottom: 1px solid var(--border-color);">
                                <td style="padding: 10px; border: 1px solid var(--border-color); color: var(--text-main);">${formatLocalDate(r.Fecha_Solicitud)}</td>
                                <td style="padding: 10px; border: 1px solid var(--border-color); font-weight: 600; color: var(--text-main);">${r.Nombre_Completo} ${r.Apellidos}</td>
                                <td style="padding: 10px; border: 1px solid var(--border-color); color: var(--text-main);">${formatLocalDate(r.Fecha_Inicio_Vacaciones)}</td>
                                <td style="padding: 10px; border: 1px solid var(--border-color);">
                                    <span style="padding: 6px 14px; border-radius: 20px; font-size: 0.8em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
                                        color: white; background-color: ${isExpired ? '#94a3b8' : (r.Estado === 'Aceptada' ? 'var(--success-color)' : r.Estado === 'Rechazada' ? 'var(--error-color)' : 'var(--text-muted)')};">
                                        ${isExpired ? 'Expirada' : r.Estado}
                                    </span>
                                </td>
                                <td style="padding: 10px; border: 1px solid var(--border-color);">
                                    ${isExpired ? '<span style="color:var(--text-muted); font-style:italic;">Expirada</span>' : (
                                        r.Estado === 'Pendiente' ? `
                                            <button class="btn-vac-status primary small" data-id="${r.Id_Solicitud}" data-status="Aceptada">Aprobar</button>
                                            <button class="btn-vac-status primary small" data-id="${r.Id_Solicitud}" data-status="Rechazada" style="background-color: var(--error-color);">Rechazar</button>
                                        ` : (r.Estado === 'Aceptada' ? `
                                            <button class="btn-vac-status secondary small" data-id="${r.Id_Solicitud}" data-status="Pendiente">Revertir</button>
                                        ` : '-')
                                    )}
                                </td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    function setupVacationListeners(requests, showHistoryAfter = false) {
        // Tab switching logic
        const tabBtns = document.querySelectorAll('.vac-tab-btn');
        const tabContents = document.querySelectorAll('.vac-tab-content');

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

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => applyTabActiveStyle(b, false));
                tabContents.forEach(c => c.style.display = 'none');
                applyTabActiveStyle(btn, true);
                const targetId = `tab-${btn.dataset.tab}`;
                document.getElementById(targetId).style.display = 'block';
            });
        });

        // History toggle logic
        const toggleHistoryBtn = document.getElementById('toggle-vac-payments-history');
        const historyContainer = document.getElementById('vac-payments-history-container');
        const showCreateFormBtn = document.getElementById('btn-show-create-vac-payment');
        const formContainer = document.getElementById('vacation-payment-form-container');
        const cancelFormBtn = document.getElementById('btn-cancel-vac-payment');

        const tbody = document.getElementById('vac-payments-tbody');
        const searchInput = document.getElementById('search-vac-payment');
        const filterYear = document.getElementById('filter-vac-year');
        const filterDate = document.getElementById('filter-vac-date');
        const filterStatus = document.getElementById('filter-vac-status');
        const selectAllCheckbox = document.getElementById('vac-history-select-all');
        const selectedCount = document.getElementById('vac-history-selected-count');
        const bulkPublishBtn = document.getElementById('vac-history-bulk-publish');
        const bulkAnnulBtn = document.getElementById('vac-history-bulk-annul');
        const bulkRevertBtn = document.getElementById('vac-history-bulk-revert');
        const bulkProgress = document.getElementById('vac-history-bulk-progress');
        const bulkProgressBar = document.getElementById('vac-history-bulk-progress-bar');

        let selectedIds = new Set();
        let allPayments = [];

        function formatVacationPeriodLabel(year) {
            const parsed = Number(year);
            if (!parsed || Number.isNaN(parsed)) return '—';
            return `Período ${parsed - 1} → ${parsed}`;
        }

        function getVisiblePayments() {
            const term = searchInput ? searchInput.value.toLowerCase().trim() : '';
            const yVal = filterYear ? filterYear.value : '';
            const dVal = filterDate ? filterDate.value : '';
            const sVal = filterStatus ? filterStatus.value : '';

            return allPayments.filter(p => {
                const name = `${p.Nombre_Completo || ''} ${p.Apellidos || ''}`.toLowerCase();
                const doc = (p.Documento_Identidad || '').toLowerCase();
                const matchesSearch = !term || name.includes(term) || doc.includes(term);
                const matchesYear = !yVal || String(p.payment_year) === String(yVal);

                let matchesDate = true;
                if (dVal) {
                    const pDateStr = p.created_at ? p.created_at.split(' ')[0] : '';
                    matchesDate = pDateStr === dVal;
                }

                const matchesStatus = !sVal || (p.status || 'Pendiente') === sVal;
                return matchesSearch && matchesYear && matchesDate && matchesStatus;
            });
        }

        function getSelectedPayments() {
            const visible = getVisiblePayments();
            return visible.filter(p => selectedIds.has(String(p.id)));
        }

        function updateSelectAllCheckbox() {
            if (!selectAllCheckbox) return;
            const checkboxes = Array.from(tbody.querySelectorAll('.vac-history-select-row'));
            if (!checkboxes.length) {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = false;
                return;
            }
            const checkedCount = checkboxes.filter(cb => cb.checked).length;
            selectAllCheckbox.checked = checkedCount === checkboxes.length;
            selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
        }

        function updateBulkControls() {
            const selected = getSelectedPayments();
            if (selectedCount) selectedCount.textContent = selected.length;

            if (!selected.length) {
                if (bulkPublishBtn) bulkPublishBtn.style.display = 'none';
                if (bulkAnnulBtn) bulkAnnulBtn.style.display = 'none';
                if (bulkRevertBtn) bulkRevertBtn.style.display = 'none';
                return;
            }

            const statuses = selected.map(p => p.status || 'Pendiente');
            const allPending = statuses.every(s => s === 'Pendiente');
            const allPublishedOrAnnulled = statuses.every(s => s === 'Publicado' || s === 'Anulado');

            let allReversible = allPublishedOrAnnulled;
            if (allPublishedOrAnnulled) {
                allReversible = selected.every(p => {
                    const refTime = p.published_at || p.annulled_at || null;
                    if (!refTime) return false;
                    const diffMs = Date.now() - new Date(refTime).getTime();
                    return diffMs >= 0 && diffMs < (24 * 60 * 60 * 1000);
                });
            }

            if (bulkPublishBtn) bulkPublishBtn.style.display = allPending ? 'inline-block' : 'none';
            if (bulkAnnulBtn) bulkAnnulBtn.style.display = allPending ? 'inline-block' : 'none';
            if (bulkRevertBtn) bulkRevertBtn.style.display = allReversible ? 'inline-block' : 'none';
        }

        function renderPaymentsTable(list) {
            if (!tbody) return;
            if (!list.length) {
                tbody.innerHTML = '<tr><td colspan="9" style="padding:30px; text-align:center; color:var(--text-muted); font-style:italic;">No hay pagos registrados.</td></tr>';
                updateBulkControls();
                updateSelectAllCheckbox();
                return;
            }

            tbody.innerHTML = list.map(p => {
                const statusLabel = p.status || 'Pendiente';
                let statusColor = '#f39c12';
                if (statusLabel === 'Publicado') statusColor = 'var(--success-color, #10b981)';
                if (statusLabel === 'Anulado') statusColor = '#e74c3c';

                const isPending = statusLabel === 'Pendiente';
                const refTime = p.published_at || p.annulled_at || null;
                let reversible = false;
                let remainingLabel = '';
                if (refTime) {
                    try {
                        const refDate = new Date(refTime);
                        const diffMs = Date.now() - refDate.getTime();
                        reversible = diffMs >= 0 && diffMs < (24 * 60 * 60 * 1000);
                        if (reversible) {
                            const remainingMs = (24 * 60 * 60 * 1000) - diffMs;
                            const hours = Math.floor(remainingMs / (60 * 60 * 1000));
                            const mins = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
                            remainingLabel = `${hours}h ${mins}m`;
                        }
                    } catch (e) { reversible = false; }
                }

                const actionButtons = isPending ? `
                    <button class="btn-vac-publish primary small" data-id="${p.id}" style="padding:8px 14px; border-radius:8px; background:var(--success-color, #10b981); color:white; border:none; cursor:pointer; min-width:90px; font-weight:600;">Publicar</button>
                    <button class="btn-vac-annul secondary small" data-id="${p.id}" style="padding:8px 14px; border-radius:8px; background:#e74c3c; color:white; border:none; cursor:pointer; min-width:90px; font-weight:600;">Anular</button>
                ` : `
                    <button class="btn-vac-revert" data-id="${p.id}" ${reversible ? '' : 'disabled'} title="Revertir a Pendiente (disponible 24 horas)" style="padding:8px 14px; border-radius:8px; background:${reversible ? '#f0f0f0' : '#95a5a6'}; color:${reversible ? '#2c3e50' : '#666'}; border:1px solid rgba(0,0,0,0.06); cursor:${reversible ? 'pointer' : 'not-allowed'}; min-width:90px; font-weight:600;">Revertir</button>
                    ${reversible ? `<div style="font-size:0.78em; color: var(--text-muted); margin-top:4px;">Expira en ${remainingLabel}</div>` : ''}
                `;

                const checked = selectedIds.has(String(p.id)) ? 'checked' : '';

                return `
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding:12px 16px; text-align:center;">
                            <input class="vac-history-select-row" type="checkbox" data-id="${p.id}" ${checked} style="width:18px; height:18px; cursor:pointer;">
                        </td>
                        <td style="padding:12px 16px; color:var(--text-main); font-weight:600;">${p.Documento_Identidad || '\u2014'}</td>
                        <td style="padding:12px 16px; color:var(--text-main);">${p.Nombre_Completo || ''} ${p.Apellidos || ''}</td>
                        <td style="padding:12px 16px; color:var(--text-main); text-align:center; font-weight:600;">${formatVacationPeriodLabel(p.payment_year)}</td>
                        <td style="padding:12px 16px; text-align:right; color:var(--success-color, #166534); font-weight:700; font-family:monospace;">Bs. ${parseFloat(p.total).toFixed(2)}</td>
                        <td style="padding:12px 16px; text-align:center; color:var(--text-muted); font-size:0.85rem;">${p.created_at ? new Date(p.created_at).toLocaleDateString('es-VE') : '\u2014'}</td>
                        <td style="padding:12px 16px; text-align:center;"><a href="${window.adminApiPrefix || '/administrativo'}/vacation-payments/payslip/${p.id}" target="_blank" rel="noopener" style="text-decoration: none; padding: 8px 18px; border-radius: 8px; font-weight:600; background: var(--primary); color: white; display:inline-block; font-size:0.88rem;">Previsualizar recibo</a></td>
                        <td style="padding:12px 16px; text-align:center;">
                            <div style="display:flex; gap:8px; justify-content:center; align-items:center; flex-direction:column;">
                                <div style="display:flex; gap:8px; justify-content:center; align-items:center;">
                                    ${actionButtons}
                                </div>
                            </div>
                        </td>
                        <td style="padding:12px 16px; text-align:center;">
                            <span style="display:inline-block; padding:6px 12px; border-radius:999px; font-size:0.82em; font-weight:700; background:${statusColor}; color:white; min-width:90px; text-align:center;">
                                ${statusLabel}
                            </span>
                        </td>
                    </tr>
                `;
            }).join('');

            tbody.querySelectorAll('.vac-history-select-row').forEach(cb => {
                cb.addEventListener('change', () => {
                    const id = String(cb.dataset.id);
                    if (cb.checked) {
                        selectedIds.add(id);
                    } else {
                        selectedIds.delete(id);
                    }
                    updateSelectAllCheckbox();
                    updateBulkControls();
                });
            });

            tbody.querySelectorAll('.btn-vac-publish').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.id;
                    const confirmed = await showConfirm('¿Desea publicar este recibo de vacaciones?');
                    if (!confirmed) return;
                    try {
                        await safePost(`/vacation-payments/${id}/status`, { action: 'publish' });
                        showSuccess('Recibo publicado con éxito');
                        await reloadVacHistory();
                        if (vpWorker && vpWorker.value) vpWorker.dispatchEvent(new Event('change'));
                    } catch(e) { showError(e.message); }
                });
            });

            tbody.querySelectorAll('.btn-vac-annul').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.id;
                    const confirmed = await showConfirm('¿Desea anular este recibo de vacaciones?');
                    if (!confirmed) return;
                    try {
                        await safePost(`/vacation-payments/${id}/status`, { action: 'annul' });
                        showSuccess('Recibo anulado con éxito');
                        await reloadVacHistory();
                        if (vpWorker && vpWorker.value) vpWorker.dispatchEvent(new Event('change'));
                    } catch(e) { showError(e.message); }
                });
            });

            tbody.querySelectorAll('.btn-vac-revert').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.id;
                    const confirmed = await showConfirm('¿Desea revertir este recibo de vacaciones a Pendiente?');
                    if (!confirmed) return;
                    try {
                        await safePost(`/vacation-payments/${id}/status`, { action: 'revert' });
                        showSuccess('Acción revertida con éxito');
                        await reloadVacHistory();
                        if (vpWorker && vpWorker.value) vpWorker.dispatchEvent(new Event('change'));
                    } catch(e) { showError(e.message); }
                });
            });

            updateSelectAllCheckbox();
            updateBulkControls();
        }

        function applyFilters() {
            const visible = getVisiblePayments();
            renderPaymentsTable(visible);
        }

        function bindHistoryControls() {
            if (searchInput) searchInput.addEventListener('input', applyFilters);
            if (filterYear) filterYear.addEventListener('change', applyFilters);
            if (filterDate) filterDate.addEventListener('change', applyFilters);
            if (filterStatus) filterStatus.addEventListener('change', applyFilters);

            if (selectAllCheckbox) {
                selectAllCheckbox.addEventListener('change', () => {
                    const visible = getVisiblePayments();
                    visible.forEach(p => {
                        if (selectAllCheckbox.checked) {
                            selectedIds.add(String(p.id));
                        } else {
                            selectedIds.delete(String(p.id));
                        }
                    });
                    tbody.querySelectorAll('.vac-history-select-row').forEach(cb => {
                        cb.checked = selectedIds.has(String(cb.dataset.id));
                    });
                    updateBulkControls();
                });
            }

            const runBulkAction = async (action, successMsg) => {
                const selected = getSelectedPayments();
                if (!selected.length) return;
                const ids = selected.map(p => p.id);
                if (bulkProgress) bulkProgress.style.display = 'block';
                if (bulkProgressBar) bulkProgressBar.style.width = '0%';
                [bulkPublishBtn, bulkAnnulBtn, bulkRevertBtn].forEach(btn => { if (btn) btn.disabled = true; });

                try {
                    for (let i = 0; i < ids.length; i++) {
                        await safePost(`/vacation-payments/${ids[i]}/status`, { action });
                        if (bulkProgressBar) bulkProgressBar.style.width = `${Math.round(((i + 1) / ids.length) * 100)}%`;
                    }
                    showSuccess(successMsg);
                    selectedIds.clear();
                    if (selectAllCheckbox) selectAllCheckbox.checked = false;
                    await reloadVacHistory();
                    if (vpWorker && vpWorker.value) vpWorker.dispatchEvent(new Event('change'));
                } catch(e) {
                    showError(e.message);
                } finally {
                    if (bulkProgress) bulkProgress.style.display = 'none';
                    if (bulkProgressBar) bulkProgressBar.style.width = '0%';
                    [bulkPublishBtn, bulkAnnulBtn, bulkRevertBtn].forEach(btn => { if (btn) btn.disabled = false; });
                }
            };

            if (bulkPublishBtn) bulkPublishBtn.addEventListener('click', () => runBulkAction('publish', 'Recibos publicados en lote correctamente.'));
            if (bulkAnnulBtn) bulkAnnulBtn.addEventListener('click', () => runBulkAction('annul', 'Recibos anulados en lote correctamente.'));
            if (bulkRevertBtn) bulkRevertBtn.addEventListener('click', () => runBulkAction('revert', 'Recibos revertidos en lote correctamente.'));
        }

        async function reloadVacHistory() {
            if (!tbody) return;
            tbody.innerHTML = '<tr><td colspan="9" style="padding:20px; text-align:center; color:var(--text-muted);">Cargando...</td></tr>';
            try {
                const pData = await apiFetch('/vacation-payments');
                allPayments = pData.payments || [];

                if (filterYear) {
                    const currentYear = filterYear.value;
                    const uniqueYears = [...new Set(allPayments.map(p => p.payment_year))].sort((a, b) => b - a);
                    let yOpts = '<option value="">Todos</option>';
                    uniqueYears.forEach(y => {
                        yOpts += `<option value="${y}">${formatVacationPeriodLabel(y)}</option>`;
                    });
                    filterYear.innerHTML = yOpts;
                    if (currentYear && uniqueYears.includes(Number(currentYear))) {
                        filterYear.value = currentYear;
                    }
                }

                selectedIds.clear();
                if (selectAllCheckbox) selectAllCheckbox.checked = false;
                renderPaymentsTable(getVisiblePayments());
            } catch (e) {
                tbody.innerHTML = `<tr><td colspan="9" style="padding:20px; text-align:center; color:var(--error-color);">Error cargando historial: ${e.message}</td></tr>`;
            }
        }

        bindHistoryControls();
        reloadVacHistory();

        if (showCreateFormBtn && formContainer) {
            showCreateFormBtn.addEventListener('click', () => {
                formContainer.style.display = 'block';
                if (historyContainer) historyContainer.style.display = 'none';
                if (toggleHistoryBtn) {
                    toggleHistoryBtn.textContent = 'Mostrar historial de pagos';
                    toggleHistoryBtn.classList.replace('secondary', 'primary');
                }
                formContainer.scrollIntoView({ behavior: 'smooth' });
            });
        }

        if (cancelFormBtn && formContainer) {
            cancelFormBtn.addEventListener('click', () => {
                formContainer.style.display = 'none';
            });
        }

        if (toggleHistoryBtn && historyContainer) {
            toggleHistoryBtn.addEventListener('click', async () => {
                if (historyContainer.style.display === 'none') {
                    historyContainer.style.display = 'block';
                    // Update button text and icon
                    toggleHistoryBtn.innerHTML = `
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        Ocultar historial de pagos
                    `;
                    if (formContainer) formContainer.style.display = 'none';

                    // Load payment history
                    reloadVacHistory();
                } else {
                    historyContainer.style.display = 'none';
                    toggleHistoryBtn.innerHTML = `
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.53"/></svg>
                        Mostrar historial de pagos
                    `;
                }
            });
        }

        // --- Vacation Payment Form Logic ---
        const vpWorker = document.getElementById('vp-worker');
        const vpHireDate = document.getElementById('vp-hire-date');
        const vpSalario = document.getElementById('vp-salario');
        const vpYear = document.getElementById('vp-year');
        const vpDiasVac = document.getElementById('vp-dias-vac');
        const vpDiasBono = document.getElementById('vp-dias-bono');

        // Summary Table Cells
        const tdDiasVac = document.getElementById('vp-td-dias-vac');
        const tdMontoVac = document.getElementById('vp-td-monto-vac');
        const tdDiasBono = document.getElementById('vp-td-dias-bono');
        const tdMontoBono = document.getElementById('vp-td-monto-bono');
        const tdTotal = document.getElementById('vp-td-total');

        const panelDataStr = document.querySelector('.vacation-panel')?.dataset.workers;
        let eligibleWorkers = [];
        if (panelDataStr) {
            try { eligibleWorkers = JSON.parse(panelDataStr); } catch(e) {}
        }

        function calculateVacationTotals() {
            const workerSelected = vpWorker && vpWorker.value;
            const yearSelected = vpYear && vpYear.value;

            if (!workerSelected || !yearSelected) {
                // Reset to em-dash display
                if (vpDiasVac) vpDiasVac.value = '';
                if (vpDiasBono) vpDiasBono.value = '';
                if (tdDiasVac) tdDiasVac.textContent = '—';
                if (tdMontoVac) tdMontoVac.textContent = '—';
                if (tdDiasBono) tdDiasBono.textContent = '—';
                if (tdMontoBono) tdMontoBono.textContent = '—';
                if (tdTotal) tdTotal.textContent = 'Bs. —';
                return;
            }

            // Get hire year from stored attribute
            const hireYear = parseInt(vpHireDate.dataset.hireYear || '0');
            const selectedYear = parseInt(yearSelected);

            // Validate Salario — enforce minimum 130
            let salario = parseFloat(vpSalario ? vpSalario.value : '0');
            if (isNaN(salario) || salario < 130) {
                // Don't auto-correct, just don't compute
                if (tdDiasVac) tdDiasVac.textContent = '—';
                if (tdMontoVac) tdMontoVac.textContent = '—';
                if (tdDiasBono) tdDiasBono.textContent = '—';
                if (tdMontoBono) tdMontoBono.textContent = '—';
                if (tdTotal) tdTotal.textContent = 'Bs. —';
                if (vpSalario) vpSalario.style.borderColor = '#e74c3c';
                return;
            }
            if (vpSalario) vpSalario.style.borderColor = 'var(--border-color)';

            // Calculation: year 1 = 15 days, +1 each subsequent year, max 30
            // difference = selectedYear - hireYear (e.g., 2024 - 2023 = 1 → 15 días)
            const difference = selectedYear - hireYear;
            const days = Math.min(30, 15 + (difference - 1));

            if (vpDiasVac) vpDiasVac.value = `${days} días`;
            if (vpDiasBono) vpDiasBono.value = `${days} días`;

            if (tdDiasVac) tdDiasVac.textContent = days;
            if (tdDiasBono) tdDiasBono.textContent = days;

            const salarioDiario = salario / 30;
            const montoVac = salarioDiario * days;
            const montoBono = salarioDiario * days;
            const total = montoVac + montoBono;

            if (tdMontoVac) tdMontoVac.textContent = montoVac.toFixed(2);
            if (tdMontoBono) tdMontoBono.textContent = montoBono.toFixed(2);
            if (tdTotal) tdTotal.textContent = `Bs. ${total.toFixed(2)}`;
        }

        if (vpWorker) {
            vpWorker.addEventListener('change', async () => {
                const workerId = vpWorker.value;
                if (!workerId) {
                    if (vpHireDate) { vpHireDate.value = ''; vpHireDate.dataset.hireYear = ''; }
                    if (vpYear) vpYear.innerHTML = '<option value="">Seleccione trabajador primero...</option>';
                    calculateVacationTotals();
                    return;
                }

                const worker = eligibleWorkers.find(w => String(w.Id_Trabajador) === String(workerId));
                if (worker && worker.Fecha_de_Ingreso) {
                    // Show hire date as readable text
                    const [hy, hm, hd] = worker.Fecha_de_Ingreso.split('-');
                    const hireYear = parseInt(hy);
                    const readableDate = new Date(parseInt(hy), parseInt(hm)-1, parseInt(hd)).toLocaleDateString('es-VE', {day:'2-digit', month:'long', year:'numeric'});
                    if (vpHireDate) {
                        vpHireDate.value = readableDate;
                        vpHireDate.dataset.hireYear = hireYear;
                    }

                    const currentYear = new Date().getFullYear();

                    // Fetch already-paid years from API
                    let paidYears = [];
                    try {
                        const paidData = await apiFetch(`/vacation-payments/paid-years/${workerId}`);
                        paidYears = paidData.paid_years || [];
                    } catch (e) {
                        // If endpoint fails, proceed without filtering
                        console.warn('No se pudieron obtener años pagados:', e.message);
                    }

                    // Build year options excluding already-paid years
                    let opts = '<option value="">Seleccione el año a pagar...</option>';
                    let hasOptions = false;
                    for (let y = hireYear + 1; y <= currentYear; y++) {
                        if (!paidYears.includes(y)) {
                            opts += `<option value="${y}">Período ${y-1} → ${y} (Año ${y - hireYear})</option>`;
                            hasOptions = true;
                        }
                    }
                    if (!hasOptions) {
                        opts += '<option value="" disabled>— Todos los años han sido pagados —</option>';
                    }
                    if (vpYear) vpYear.innerHTML = opts;
                    calculateVacationTotals();
                }
            });
        }

        if (vpYear) vpYear.addEventListener('change', calculateVacationTotals);
        if (vpSalario) {
            vpSalario.addEventListener('input', calculateVacationTotals);
            vpSalario.addEventListener('blur', () => {
                const val = parseFloat(vpSalario.value);
                if (!isNaN(val) && val < 130) {
                    vpSalario.style.borderColor = '#e74c3c';
                    showError('El salario mensual no puede ser menor a Bs. 130.00');
                } else {
                    vpSalario.style.borderColor = 'var(--border-color)';
                }
            });
        }

        // Process payment button — placeholder (no action yet, receipt format pending)
        const processBtn = document.getElementById('btn-process-vac-payment');
        if (processBtn) {
            processBtn.addEventListener('click', async () => {
                if (!vpWorker || !vpWorker.value) return showError('Seleccione un trabajador.');
                if (!vpYear || !vpYear.value) return showError('Seleccione el año de pago.');
                const salario = parseFloat(vpSalario ? vpSalario.value : '0');
                if (isNaN(salario) || salario < 130) return showError('El salario mensual debe ser al menos Bs. 130.00');

                const hireYear = parseInt(vpHireDate.dataset.hireYear || '0');
                const selectedYear = parseInt(vpYear.value);
                const difference = selectedYear - hireYear;
                const days = Math.min(30, 15 + (difference - 1));
                const salarioDiario = salario / 30;
                const montoVac = salarioDiario * days;
                const montoBono = salarioDiario * days;
                const total = montoVac + montoBono;

                    try {
                        await safePost('/vacation-payments', {
                            Id_Trabajador: parseInt(vpWorker.value),
                            payment_year: selectedYear,
                            salario_mensual: salario,
                            dias_vacaciones: days,
                            dias_bono: days,
                            monto_vacaciones: parseFloat(montoVac.toFixed(2)),
                            monto_bono: parseFloat(montoBono.toFixed(2)),
                            total: parseFloat(total.toFixed(2)),
                        });

                        showSuccess('✅ Pago de vacaciones registrado correctamente.');
                        document.getElementById('vacation-payment-form-container').style.display = 'none';

                        // Refresh the panel and show history
                        renderAdminVacations(true);
                    } catch (e) {
                        showError(e.message);
                    }
            });
        }

        // Initialize Chart
        setTimeout(() => {
            const ctx = document.getElementById('vacation-main-chart');
            if (ctx && typeof Chart !== 'undefined') {
                const isDark = document.body.classList.contains('dark-mode');
                const textColor = isDark ? '#ffffff' : '#333333';

                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Pendientes', 'Aceptadas', 'Rechazadas'],
                        datasets: [{
                            label: 'Solicitudes',
                            data: [
                                requests.filter(r => r.Estado === 'Pendiente').length,
                                requests.filter(r => r.Estado === 'Aceptada').length,
                                requests.filter(r => r.Estado === 'Rechazada').length
                            ],
                            backgroundColor: [
                                isDark ? '#444' : '#999',
                                isDark ? '#666' : '#444',
                                isDark ? '#222' : '#111'
                            ],
                            borderRadius: 6
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        plugins: { legend: { display: false } },
                        scales: {
                            x: { display: false },
                            y: {
                                grid: { display: false },
                                ticks: { color: textColor, font: { weight: '600' } }
                            }
                        }
                    }
                });
            }
        }, 100);

        // Sorting and filtering functionality
        const sortField = document.getElementById('sort-field');
        const sortDirection = document.getElementById('sort-direction');
        const searchWorker = document.getElementById('search-worker');

        // Function to update sort-direction options based on sort-field
        function updateSortDirectionOptions() {
            const field = sortField.value;
            const currentValue = sortDirection.value;
            if (field === 'Estado') {
                sortDirection.innerHTML = `
                    <option value="Todas">Todas</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Rechazado">Rechazado</option>
                `;
                // Set default if current is not valid
                if (!['Todas', 'Pendiente', 'Aprobado', 'Rechazado'].includes(currentValue)) {
                    sortDirection.value = 'Todas';
                } else {
                    sortDirection.value = currentValue;
                }
            } else {
                sortDirection.innerHTML = `
                    <option value="desc">Más reciente primero</option>
                    <option value="asc">Más antiguo primero</option>
                `;
                // Set default if current is not valid
                if (!['desc', 'asc'].includes(currentValue)) {
                    sortDirection.value = 'desc';
                } else {
                    sortDirection.value = currentValue;
                }
            }
        }

        // Initial update
        updateSortDirectionOptions();

        // Paginación de la tabla de solicitudes de vacaciones
        let vacationsPage = 1;
        let lastVacationsSig = '';

        function updateTable() {
            const field = sortField.value;
            const dir = sortDirection.value;
            const searchTerm = searchWorker.value.toLowerCase().trim();

            let filtered = requests.filter(r => {
                const fullName = `${r.Nombre_Completo} ${r.Apellidos}`.toLowerCase();
                const matchesSearch = searchTerm === '' || fullName.includes(searchTerm) || r.Documento_Identidad.toLowerCase().includes(searchTerm);
                let matches = matchesSearch;
                if (field === 'Estado' && dir !== 'Todas') {
                    const statusMap = { 'Pendiente': 'Pendiente', 'Aprobado': 'Aceptada', 'Rechazado': 'Rechazada' };
                    matches = matches && r.Estado === statusMap[dir];
                }
                return matches;
            });

            let sorted;
            if (field === 'Estado') {
                // When filtering by status, sort by date desc by default
                sorted = [...filtered].sort((a, b) => new Date(b.Fecha_Solicitud) - new Date(a.Fecha_Solicitud));
            } else {
                sorted = [...filtered].sort((a, b) => {
                    let valA, valB;
                    if (field === 'Fecha_Solicitud' || field === 'Fecha_Inicio_Vacaciones') {
                        valA = new Date(a[field]);
                        valB = new Date(b[field]);
                    } else {
                        valA = a[field];
                        valB = b[field];
                    }
                    if (valA < valB) return dir === 'asc' ? -1 : 1;
                    if (valA > valB) return dir === 'asc' ? 1 : -1;
                    return 0;
                });
            }
            // Reiniciar a la página 1 cuando cambia la búsqueda u ordenamiento
            const vacSig = `${field}|${dir}|${searchTerm}`;
            if (vacSig !== lastVacationsSig) { lastVacationsSig = vacSig; vacationsPage = 1; }

            const vacPg = paginateItems(sorted, vacationsPage);
            vacationsPage = vacPg.current;
            const vacationListEl = document.getElementById('vacation-list');
            vacationListEl.innerHTML = renderVacationsTableHTML(vacPg.items, searchTerm !== '') + renderPaginationHTML('vacations-page-btn', vacPg.current, vacPg.totalPages, vacPg.total);
            attachPaginationListeners(vacationListEl, 'vacations-page-btn', (p) => { vacationsPage = p; updateTable(); });
            // Re-attach listeners for status buttons
            document.querySelectorAll('.btn-vac-status').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.id;
                    const status = btn.dataset.status;
                    if (status === 'Rechazada') {
                        // Mostrar modal para motivo
                        showModal({
                            type: 'warning',
                            title: 'Motivo del Rechazo',
                            message: 'Por favor, indique el motivo del rechazo de la solicitud.',
                            html: '<textarea id="rejection-reason" placeholder="Escriba el motivo..." style="width:100%; height:80px; padding:8px; border:1px solid #ccc; border-radius:4px; resize: vertical;"></textarea>',
                            okText: 'Rechazar',
                            cancelText: 'Cancelar'
                        }).then(async (result) => {
                                if (result) {
                                const reason = document.getElementById('rejection-reason')?.value || '';
                                try {
                                    await safePost(`/vacations/${id}/status`, { status, reason });
                                    showSuccess('Solicitud rechazada con éxito');
                                    renderAdminVacations();
                                } catch (e) {
                                    showError(e.message);
                                }
                            }
                        });
                    } else {
                        try {
                            await safePost(`/vacations/${id}/status`, { status });
                            showSuccess(status === 'Pendiente' ? 'Acción revertida exitosamente' : `Solicitud ${status.toLowerCase()} con éxito`);
                            renderAdminVacations();
                        } catch (e) {
                            showError(e.message);
                        }
                    }
                });
            });
        }

        sortField.addEventListener('change', () => {
            updateSortDirectionOptions();
            updateTable();
        });
        sortDirection.addEventListener('change', updateTable);
        searchWorker.addEventListener('input', updateTable);
        // Initial update
        updateTable();

        // Status buttons are re-attached inside updateTable() whenever the content changes

        if (showHistoryAfter) {
            // Find the button with data-tab="pagos"
            const pagosBtn = Array.from(tabBtns).find(b => b.dataset.tab === 'pagos');
            if (pagosBtn) {
                tabBtns.forEach(b => applyTabActiveStyle(b, false));
                tabContents.forEach(c => c.style.display = 'none');
                applyTabActiveStyle(pagosBtn, true);
                const targetId = `tab-${pagosBtn.dataset.tab}`;
                const targetEl = document.getElementById(targetId);
                if (targetEl) targetEl.style.display = 'block';
            }

            // Click the history button to show history
            const toggleHistoryBtn = document.getElementById('toggle-vac-payments-history');
            const historyContainer = document.getElementById('vac-payments-history-container');
            if (toggleHistoryBtn && historyContainer && historyContainer.style.display === 'none') {
                toggleHistoryBtn.click();
            }
        }
    }

    async function renderAdminPermissionsPanel() {
        if (!contentDetails) init();
        contentDetails.innerHTML = '<div class="loader">Cargando panel de permisos...</div>';

        function getLocalPermissionRequests() {
            try {
                const raw = localStorage.getItem('workerPermissionRequests');
                const saved = raw ? JSON.parse(raw) : [];
                return Array.isArray(saved) ? saved : [];
            } catch (e) {
                console.warn('Error leyendo solicitudes locales de permisos:', e);
                return [];
            }
        }

        function saveLocalPermissionRequests(requests) {
            try {
                localStorage.setItem('workerPermissionRequests', JSON.stringify(Array.isArray(requests) ? requests : []));
            } catch (e) {
                console.warn('Error guardando solicitudes locales de permisos:', e);
            }
        }

        function clearLocalPermissionHistoryOnce() {
            try {
                const clearedMarker = localStorage.getItem('workerPermissionHistoryCleared');
                if (!clearedMarker && localStorage.getItem('workerPermissionRequests')) {
                    localStorage.removeItem('workerPermissionRequests');
                    localStorage.setItem('workerPermissionHistoryCleared', '1');
                    permissionRequestsCache = [];
                    console.info('Historial antiguo de permisos limpiado automáticamente.');
                }
            } catch (e) {
                console.warn('No se pudo limpiar el historial local de permisos:', e);
            }
        }

        clearLocalPermissionHistoryOnce();

        function chooseBestWorkerName(nameA, nameB) {
            const a = String(nameA || '').trim();
            const b = String(nameB || '').trim();
            if (a && a !== 'Desconocido' && a.length >= b.length) return a;
            if (b && b !== 'Desconocido') return b;
            return a || b || '';
        }

        function setLocalPermissionRequest(updatedRequest) {
            try {
                const requests = getLocalPermissionRequests();
                const updatedId = getPermissionRequestId(updatedRequest);
                const index = requests.findIndex(r => getPermissionRequestId(r) === updatedId);
                const existing = index !== -1 ? requests[index] : {};
                const status = updatedRequest.Estatus || updatedRequest.Estado || existing.Estatus || existing.Estado;
                const mergedRequest = {
                    ...existing,
                    ...updatedRequest,
                    Trabajador: chooseBestWorkerName(existing.Trabajador, updatedRequest.Trabajador),
                    Nombre: chooseBestWorkerName(existing.Nombre, updatedRequest.Nombre),
                    Nombres: chooseBestWorkerName(existing.Nombres, updatedRequest.Nombres),
                    Apellidos: chooseBestWorkerName(existing.Apellidos, updatedRequest.Apellidos),
                    Nombre_Completo: chooseBestWorkerName(existing.Nombre_Completo, updatedRequest.Nombre_Completo),
                    Nombre_Trabajador: chooseBestWorkerName(existing.Nombre_Trabajador, updatedRequest.Nombre_Trabajador),
                    Estatus: status,
                    Estado: status
                };
                if (index === -1) {
                    requests.push(mergedRequest);
                } else {
                    requests[index] = mergedRequest;
                }
                saveLocalPermissionRequests(requests);
            } catch (e) {
                console.warn('Error actualizando solicitud local de permisos:', e);
            }
        }

        function mergePermissionRequests(remoteRequests) {
            const localRequests = getLocalPermissionRequests();
            const mergedMap = new Map();

            (remoteRequests || []).forEach(remote => {
                const id = getPermissionRequestId(remote);
                if (!id) return;
                mergedMap.set(id, { ...remote });
            });

            localRequests.forEach(local => {
                const id = getPermissionRequestId(local);
                if (!id) return;
                if (mergedMap.has(id)) {
                    const remote = mergedMap.get(id);
                    const merged = { ...local, ...remote };
                    merged.Trabajador = chooseBestWorkerName(local.Trabajador, remote.Trabajador);
                    merged.Nombre = chooseBestWorkerName(local.Nombre, remote.Nombre);
                    merged.Nombres = chooseBestWorkerName(local.Nombres, remote.Nombres);
                    merged.Apellidos = chooseBestWorkerName(local.Apellidos, remote.Apellidos);
                    merged.Nombre_Completo = chooseBestWorkerName(local.Nombre_Completo, remote.Nombre_Completo);
                    merged.Nombre_Trabajador = chooseBestWorkerName(local.Nombre_Trabajador, remote.Nombre_Trabajador);
                    mergedMap.set(id, merged);
                } else {
                    mergedMap.set(id, { ...local });
                }
            });

            const merged = Array.from(mergedMap.values());
            const sorted = merged.sort((a, b) => new Date(b.Fecha || b.FechaInicio || b.Fecha_Inicio || 0) - new Date(a.Fecha || a.FechaInicio || a.Fecha_Inicio || 0));
            saveLocalPermissionRequests(sorted);
            return sorted;
        }

        function canonicalKey(key) {
            return String(key || '').replace(/[^a-z0-9]/gi, '').toLowerCase();
        }

        function getRequestField(request, ...keys) {
            if (!request || typeof request !== 'object') return undefined;

            const normalized = {};
            function collect(obj) {
                if (!obj || typeof obj !== 'object') return;
                Object.keys(obj).forEach(key => {
                    const normalizedKey = canonicalKey(key);
                    if (!(normalizedKey in normalized)) {
                        normalized[normalizedKey] = obj[key];
                    }
                    const value = obj[key];
                    if (value && typeof value === 'object' && !Array.isArray(value)) {
                        collect(value);
                    }
                });
            }
            collect(request);

            for (const key of keys) {
                const value = normalized[canonicalKey(key)];
                if (value !== undefined && value !== null && String(value).trim() !== '') {
                    return value;
                }
            }
            return undefined;
        }

        function getPermissionRequestId(request) {
            const id = getRequestField(request,
                'id', 'Id_Solicitud', 'IdSolicitud', 'idSolicitud', 'Id',
                'Solicitud_Id', 'SolicitudId', 'solicitudid',
                'request_id', 'requestid'
            );
            return id !== undefined && id !== null ? String(id) : '';
        }

        function getRequestWorkerName(r) {
            const explicitFullName = getRequestField(r,
                'Nombre_Completo', 'Nombre_completo', 'NombreCompleto', 'Nombre completo',
                'Nombre_Trabajador', 'trabajador_nombre',
                'FullName', 'fullName', 'full_name', 'full name',
                'WorkerName', 'workerName', 'worker_name'
            );

            const first = getRequestField(r,
                'Nombre', 'Nombres', 'nombre', 'nombres',
                'FirstName', 'firstname', 'first_name'
            );
            const last = getRequestField(r,
                'Apellidos', 'Apellido', 'apellidos', 'apellido',
                'LastName', 'lastname', 'last_name'
            );

            if (explicitFullName && String(explicitFullName).trim() !== '') {
                const full = String(explicitFullName).trim();
                const hasSpace = /\s+/.test(full);
                if (hasSpace) return full;
                if (last && String(last).trim() && !full.toLowerCase().includes(String(last).trim().toLowerCase())) {
                    return `${full} ${String(last).trim()}`.trim();
                }
                if (first && String(first).trim() && !full.toLowerCase().includes(String(first).trim().toLowerCase())) {
                    return `${String(first).trim()} ${full}`.trim();
                }
                if (first || last) {
                    return [first || full, last || full].filter(Boolean).join(' ').trim();
                }
                return full;
            }

            const composed = [first, last].filter(Boolean).join(' ').trim();
            if (composed) return composed;

            const fallbackWorker = getRequestField(r,
                'Trabajador', 'trabajador', 'Nombre_Trabajador', 'trabajador_nombre',
                'Worker', 'worker'
            );
            if (fallbackWorker && String(fallbackWorker).trim() !== '') {
                const fallback = String(fallbackWorker).trim();
                if (last && fallback.split(/\s+/).length === 1 && !fallback.toLowerCase().includes(String(last).trim().toLowerCase())) {
                    return `${fallback} ${String(last).trim()}`.trim();
                }
                return fallback;
            }

            return 'Desconocido';
        }

        function getRequestWorkerCedula(r) {
            return getRequestField(r,
                'Cedula', 'cedula',
                'Documento_Identidad', 'documento_identidad',
                'Documento', 'documento',
                'DocumentoIdentidad', 'documentoidentidad',
                'worker_cedula', 'trabajador_cedula', 'cedula_trabajador',
                'documentoidentidad', 'documento_identidad'
            ) || '-';
        }

        function formatLocalDateTimeString(value) {
            if (!value) return '-';
            const date = new Date(value);
            if (isNaN(date.getTime())) return value;
            const pad = num => String(num).padStart(2, '0');
            const day = pad(date.getDate());
            const month = pad(date.getMonth() + 1);
            const year = date.getFullYear();
            const hours = pad(date.getHours());
            const minutes = pad(date.getMinutes());
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        }

        async function loadPermissionRequests() {
            try {
                const data = await apiFetch('/permission-requests');
                if (data && Array.isArray(data.requests)) {
                    permissionRequestsCache = mergePermissionRequests(data.requests);
                    return permissionRequestsCache;
                }
            } catch (err) {
                console.warn('Error cargando solicitudes de permisos desde API:', err);
            }
            permissionRequestsCache = mergePermissionRequests([]);
            return permissionRequestsCache;
        }

        if (window.currentActiveModule && window.currentActiveModule !== 'Panel de Permisos') return;

        const requests = await loadPermissionRequests();
        if (!requests.length) {
            contentDetails.innerHTML = `
                <div class="permissions-panel">
                    <h4 style="margin-top:0; color: var(--text-main); border-bottom: 2px solid var(--primary); padding-bottom: 10px;">Panel de permisos</h4>
                    <div class="alert-info" style="background: rgba(52, 152, 219, 0.1); color: var(--text-main); padding: 15px; border-radius: 8px; border-left: 4px solid #3498db; margin-top: 20px;">No hay solicitudes de permisos registradas.</div>
                </div>
            `;
            return;
        }

        contentDetails.innerHTML = `
            <div class="permissions-panel">
                <h4 style="margin-top:0; color: var(--text-main); border-bottom: 2px solid var(--primary); padding-bottom: 10px;">Panel de Permisos</h4>
                <p>Gestiona las solicitudes de permisos laborales de los trabajadores.</p>
                <div style="overflow-x:auto; margin-top:22px;">
                    <table id="admin-perm-table" style="width:100%; border-collapse:collapse;">
                        <thead>
                            <tr style="background: var(--primary); color:#fff;">
                                <th style="padding:12px; text-align:left;">Cédula</th>
                                <th style="padding:12px; text-align:left;">Trabajador</th>
                                <th style="padding:12px; text-align:left;">Fecha inicio</th>
                                <th style="padding:12px; text-align:left;">Fecha fin</th>
                                <th style="padding:12px; text-align:left;">Motivos</th>
                                <th style="padding:12px; text-align:left;">Estatus</th>
                                <th style="padding:12px; text-align:left;">Remuneración</th>
                                <th style="padding:12px; text-align:left;">Acciones</th>
                            </tr>
                            <tr style="background:rgba(0,0,0,0.04);">
                                <td style="padding:6px;"><input id="ap-f-cedula" placeholder="Filtrar..." style="width:100%;padding:5px;border-radius:5px;border:1px solid var(--border-color);font-size:0.82rem;background:var(--bg-color);color:var(--text-main);"></td>
                                <td style="padding:6px;"><input id="ap-f-nombre" placeholder="Filtrar..." style="width:100%;padding:5px;border-radius:5px;border:1px solid var(--border-color);font-size:0.82rem;background:var(--bg-color);color:var(--text-main);"></td>
                                <td style="padding:6px;"><input id="ap-f-inicio" type="date" style="width:100%;padding:5px;border-radius:5px;border:1px solid var(--border-color);font-size:0.82rem;background:var(--bg-color);color:var(--text-main);"></td>
                                <td style="padding:6px;"><input id="ap-f-fin" type="date" style="width:100%;padding:5px;border-radius:5px;border:1px solid var(--border-color);font-size:0.82rem;background:var(--bg-color);color:var(--text-main);"></td>
                                <td style="padding:6px;text-align:center;font-size:0.82rem;color:var(--text-muted);">Sin filtro</td>
                                <td style="padding:6px;"><select id="ap-f-estatus" style="width:100%;padding:5px;border-radius:5px;border:1px solid var(--border-color);font-size:0.82rem;background:var(--bg-color);color:var(--text-main);"><option value="">Todos</option><option value="Pendiente">Pendiente</option><option value="Aprobado">Aprobado</option><option value="Rechazado">Rechazado</option><option value="Expirado">Expirado</option></select></td>
                                <td style="padding:6px;"><select id="ap-f-remun" style="width:100%;padding:5px;border-radius:5px;border:1px solid var(--border-color);font-size:0.82rem;background:var(--bg-color);color:var(--text-main);"><option value="">Todas</option><option value="Sí">Sí</option><option value="No">No</option></select></td>
                                <td style="padding:6px;text-align:center;font-size:0.82rem;color:var(--text-muted);">Sin filtro</td>
                            </tr>
                        </thead>
                        <tbody id="admin-perm-tbody"></tbody>
                    </table>
                </div>
            </div>
        `;

        // Store all rows data for filtering
        const allRequests = requests.slice();

        function renderAdminPermissionsTable(list) {
            const tbody = document.getElementById('admin-perm-tbody');
            if (!tbody) return;
            if (!list || list.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" style="padding:20px; text-align:center; color:var(--text-muted);">No hay solicitudes que coincidan con los filtros.</td></tr>';
                return;
            }
            tbody.innerHTML = list.map(r => {
                const status = getRequestField(r, 'Estatus', 'Estado', 'status') || 'Pendiente';
                const endDate = r.FechaFin || r.Fecha_Fin || r.Fecha_Final || '';
                const isExpired = status === 'Pendiente' && endDate && new Date(endDate).getTime() < Date.now();
                const statusFinal = isExpired ? 'Expirado' : status;
                const requestId = getPermissionRequestId(r);
                return `
                <tr style="border-bottom:1px solid var(--border-color); background: var(--card-bg);">
                    <td style="padding:12px; vertical-align:top;">${getRequestWorkerCedula(r)}</td>
                    <td style="padding:12px; vertical-align:top;">${getRequestWorkerName(r)}</td>
                    <td style="padding:12px; vertical-align:top;">${formatLocalDateTimeString(r.FechaInicio || r.Fecha_Inicio || '')}</td>
                    <td style="padding:12px; vertical-align:top;">${formatLocalDateTimeString(r.FechaFin || r.Fecha_Fin || r.Fecha_Final || '')}</td>
                    <td style="padding:12px; vertical-align:top;">
                        <button class="btn-view-motive" data-motivo="${(getRequestField(r, 'Motivo', 'motivo', 'Reason', 'reason') || '').replace(/"/g, '&quot;')}" style="background:#3498db;border:none;color:#fff;padding:6px 10px;border-radius:6px;cursor:pointer;">Ver motivo de la solicitud</button>
                        ${statusFinal === 'Rechazado' && (r.Motivo_Rechazo || r.motivo_rechazo) ? `
                            <button class="btn-view-rejection" data-reason="${(r.Motivo_Rechazo || r.motivo_rechazo).replace(/"/g, '&quot;')}" style="margin-top:8px; display:inline-flex; align-items:center; gap:6px; padding:6px 10px; border:none; background:#f87171; color:#fff; border-radius:6px; cursor:pointer;">Ver motivo de rechazo</button>
                        ` : ''}
                    </td>
                    <td style="padding:12px; vertical-align:top;"><span style="padding:5px 10px; border-radius:999px; background:${statusFinal === 'Aprobado' ? '#2ecc71' : statusFinal === 'Rechazado' ? '#e74c3c' : statusFinal === 'Expirado' ? '#94a3b8' : '#f39c12'}; color:#fff; font-weight:700;">${statusFinal}</span></td>
                    <td style="padding:12px; vertical-align:top; font-weight:600;">${statusFinal === 'Aprobado' ? (getRequestField(r, 'Remuneracion', 'remuneracion', 'Remuneración', 'remuneration') || '-') : ''}</td>
                    <td style="padding:12px; vertical-align:top;">
                        ${statusFinal === 'Pendiente' ? `
                            <button class="btn-permission-action" data-id="${requestId}" data-action="approve" style="margin-right:6px; background:#2ecc71; border:none; color:#fff; padding:7px 12px; border-radius:8px; cursor:pointer;">Aprobar</button>
                            <button class="btn-permission-action" data-id="${requestId}" data-action="reject" style="background:#e74c3c; border:none; color:#fff; padding:7px 12px; border-radius:8px; cursor:pointer;">Rechazar</button>
                        ` : '-'}
                    </td>
                </tr>`;
            }).join('');
            attachAdminPermissionListeners();
        }

        function applyAdminFilters() {
            const fCedula = (document.getElementById('ap-f-cedula')?.value || '').toLowerCase();
            const fNombre = (document.getElementById('ap-f-nombre')?.value || '').toLowerCase();
            const fInicio = document.getElementById('ap-f-inicio')?.value || '';
            const fFin = document.getElementById('ap-f-fin')?.value || '';
            const fEstatus = document.getElementById('ap-f-estatus')?.value || '';
            const fRemun = document.getElementById('ap-f-remun')?.value || '';

            const filtered = allRequests.filter(r => {
                const cedula = getRequestWorkerCedula(r).toLowerCase();
                const nombre = getRequestWorkerName(r).toLowerCase();
                const inicio = (r.FechaInicio || r.Fecha_Inicio || '');
                const fin = (r.FechaFin || r.Fecha_Fin || r.Fecha_Final || '');
                const status = getRequestField(r, 'Estatus', 'Estado', 'status') || 'Pendiente';
                const endDate = fin;
                const statusFinal = status === 'Pendiente' && endDate && new Date(endDate).getTime() < Date.now() ? 'Expirado' : status;
                const remun = getRequestField(r, 'Remuneracion', 'remuneracion', 'Remuneración', 'remuneration') || '';

                return (!fCedula || cedula.includes(fCedula))
                    && (!fNombre || nombre.includes(fNombre))
                    && (!fInicio || inicio.startsWith(fInicio))
                    && (!fFin || fin.startsWith(fFin))
                    && (!fEstatus || statusFinal === fEstatus)
                    && (!fRemun || remun === fRemun);
            });
            renderAdminPermissionsTable(filtered);
        }

        ['ap-f-cedula','ap-f-nombre','ap-f-inicio','ap-f-fin','ap-f-estatus','ap-f-remun'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', applyAdminFilters);
        });

        renderAdminPermissionsTable(allRequests);

        function attachAdminPermissionListeners() {
            document.querySelectorAll('.btn-view-motive').forEach(btn => {
                btn.addEventListener('click', () => {
                    const motivo = btn.dataset.motivo || 'No se registró un motivo.';
                    showModal({
                        type: 'info',
                        title: 'Motivo de la solicitud',
                        html: `
                            <div style="padding: 12px 0; font-size: 0.95rem; line-height: 1.7; color: var(--text-main);">
                                <p style="margin:0 0 12px; font-weight:600; color: var(--text-main);">Motivo registrado:</p>
                                <div style="background: rgba(52, 152, 219, 0.1); padding: 16px; border-radius: 12px; border: 1px solid rgba(52, 152, 219, 0.25); color: var(--text-main); white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word;">${motivo}</div>
                            </div>
                        `,
                        okText: 'Cerrar'
                    });
                });
            });
            document.querySelectorAll('.btn-view-rejection').forEach(btn => {
                btn.addEventListener('click', () => {
                    const reason = btn.dataset.reason || 'No se especificó un motivo.';
                    showModal({
                        type: 'info',
                        title: 'Motivo del rechazo',
                        html: `
                            <div style="padding: 12px 0; font-size: 0.95rem; line-height: 1.7; color: var(--text-main);">
                                <p style="margin:0 0 12px; font-weight:600; color: var(--text-main);">Motivo registrado:</p>
                                <div style="background: rgba(248, 113, 113, 0.12); padding: 16px; border-radius: 12px; border: 1px solid rgba(248, 113, 113, 0.25); color: var(--text-main); white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word;">${reason}</div>
                            </div>
                        `,
                        okText: 'Cerrar'
                    });
                });
            });
            document.querySelectorAll('.btn-permission-action').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const action = btn.dataset.action;
                const status = action === 'approve' ? 'Aprobado' : 'Rechazado';
                if (action === 'approve') {
                    const isRemunerated = await new Promise((resolve) => {
                        let resolved = false;
                        showModal({
                            type: 'info',
                            title: 'Aprobar permiso',
                            html: `
                                <div style="font-size:1.1rem; text-align:center; padding:10px 0;">¿Este permiso debe ser remunerado?</div>
                                <div style="display:flex; justify-content:center; gap:15px; margin-top:20px;">
                                    <button id="custom-rem-yes" style="background:#2ecc71; color:#fff; border:none; padding:10px 20px; border-radius:8px; font-weight:bold; font-size:1rem; cursor:pointer;">Sí</button>
                                    <button id="custom-rem-no" style="background:#e74c3c; color:#fff; border:none; padding:10px 20px; border-radius:8px; font-weight:bold; font-size:1rem; cursor:pointer;">No</button>
                                </div>
                                <style>.modal-show .modal-footer { display: none !important; }</style>
                            `,
                            okText: 'Ok'
                        }).then(() => {
                            if (!resolved) resolve(null);
                        });

                        document.getElementById('custom-rem-yes')?.addEventListener('click', () => {
                            resolved = true;
                            document.querySelector('.modal-show .modal-close-x')?.click();
                            resolve('Sí');
                        });
                        document.getElementById('custom-rem-no')?.addEventListener('click', () => {
                            resolved = true;
                            document.querySelector('.modal-show .modal-close-x')?.click();
                            resolve('No');
                        });
                    });

                    if (!isRemunerated) return;

                    btn.disabled = true;
                    try {
                        await safePost(`/permission-requests/${id}/status`, { status: 'Aprobado', remuneracion: isRemunerated });
                    } catch (e) {
                        console.warn('No se pudo actualizar el backend de permisos', e);
                    }
                    const request = permissionRequestsCache && permissionRequestsCache.find(r => getPermissionRequestId(r) === String(id));
                    if (request) {
                        request.Estatus = 'Aprobado';
                        request.Estado = 'Aprobado';
                        request.Remuneracion = isRemunerated;
                        request.remuneracion = isRemunerated;
                        setLocalPermissionRequest(request);
                    }
                    await showModal({
                        type: 'success',
                        title: 'Permiso aprobado',
                        html: `<p>Este permiso ha sido aprobado${isRemunerated === 'Sí' ? ' y será remunerado.' : '.'}</p>`,
                        okText: 'Aceptar'
                    });
                } else if (action === 'reject') {
                    const confirmed = await showModal({
                        type: 'warning',
                        title: 'Motivo del Rechazo',
                        html: `
                            <p style="margin:0 0 14px; font-size:0.95rem; color: var(--text-main);">Por favor, indique el motivo del rechazo de la solicitud.</p>
                            <textarea id="permission-rejection-reason" placeholder="Escribe el motivo aquí..." style="width:100%; min-height:120px; padding:12px; border:1px solid var(--border-color); border-radius:10px; background:var(--bg-color); color:var(--text-main); resize:vertical;"></textarea>
                        `,
                        okText: 'Rechazar',
                        cancelText: 'Cancelar'
                    });
                    if (!confirmed) return;
                    const reason = document.getElementById('permission-rejection-reason')?.value.trim();
                    if (!reason) {
                        showError('Debes indicar el motivo del rechazo antes de continuar.');
                        return;
                    }
                    btn.disabled = true;
                    try {
                        await safePost(`/permission-requests/${id}/status`, { status: 'Rechazado', reason: reason });
                    } catch (e) {
                        console.warn('No se pudo actualizar el backend de permisos', e);
                    }
                    const request = permissionRequestsCache && permissionRequestsCache.find(r => getPermissionRequestId(r) === String(id));
                    if (request) {
                        request.Estatus = status;
                        request.Estado = status;
                        request.Motivo_Rechazo = reason;
                        request.motivo_rechazo = reason;
                        setLocalPermissionRequest(request);
                    }
                    await showModal({
                        type: 'success',
                        title: 'Permiso rechazado',
                        html: '<p>Este permiso ha sido rechazado correctamente.</p>',
                        okText: 'Aceptar'
                    });
                } else {
                    if (!await showConfirm(`¿Desea aprobar esta solicitud de permiso?`)) return;
                    btn.disabled = true;
                    try {
                        await safePost(`/permission-requests/${id}/status`, { status: status });
                    } catch (e) {
                        console.warn('No se pudo actualizar el backend de permisos', e);
                    }
                    const request = permissionRequestsCache && permissionRequestsCache.find(r => getPermissionRequestId(r) === String(id));
                    if (request) {
                        request.Estatus = status;
                        request.Estado = status;
                        setLocalPermissionRequest(request);
                    }
                    await showModal({
                        type: 'success',
                        title: status === 'Aprobado' ? 'Permiso aprobado' : status === 'Rechazado' ? 'Permiso rechazado' : 'Solicitud actualizada',
                        html: `<p>Este permiso ha sido ${status.toLowerCase()} correctamente.</p>`,
                        okText: 'Aceptar'
                    });
                }
                renderAdminPermissionsPanel();
            });
        });
    }
}

    // --- Módulo: Pago de Nómina ---
    async function renderPayrollPayment() {
        contentDetails.innerHTML = '<div class="loader">Iniciando módulo de pago...</div>';
        try {
            const [wData, cData] = await Promise.all([
                apiFetch('/workers'),
                apiFetch('/concepts')
            ]);

            // Solo trabajadores activos
            const workers = (wData.workers || []).filter(w => w.Contrato_Estado === 'Activo');
            const concepts = (cData.conceptos || []).filter(c => {
                const estado = String(c.Estado || c.estado || '').trim().toLowerCase();
                return estado !== 'inactivo' && estado !== 'inactive';
            });
            let addedConcepts = [];
            const now = new Date();
            const todayLocal = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

            contentDetails.innerHTML = `
                <div class="payroll-payment">
                    <div class="content-box">
                        <h4 style="margin-top: 0; color: var(--text-main); border-bottom: 2px solid var(--primary); padding-bottom: 10px;">Procesar Pago de Nómina</h4>

                        <div class="tabs" style="display:flex; gap:8px; margin:16px 0 22px 0;">
                            <button id="pay-tab-crear-btn" class="pay-tab-btn active" style="padding:10px 18px; border-radius:10px; border:none; background:linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%); color:white; font-weight:700; cursor:pointer;">Crear recibos</button>
                            <button id="pay-tab-ver-btn" class="pay-tab-btn" style="padding:10px 18px; border-radius:10px; border:none; background:transparent; color:var(--text-muted); font-weight:700; cursor:pointer;">Ver recibos</button>
                        </div>

                        <div class="payroll-form" style="background: var(--card-bg); padding:25px; border-radius:12px; border: 1px solid var(--border-color); box-shadow:0 10px 30px rgba(0,0,0,0.1);">
                            <div id="p-selected-payroll-banner" style="display:none; margin-bottom:22px; padding:18px 20px; border-radius:14px; background: rgba(37, 126, 241, 0.08); border:1px solid rgba(37,126,241,0.18); color: var(--text-main);">
                                <div style="display:flex; flex-wrap:wrap; gap:16px; align-items:center; justify-content:space-between;">
                                    <div style="min-width:240px;">
                                        <span style="display:block; color: var(--text-muted); font-size:0.95rem;">Nómina seleccionada</span>
                                        <strong id="p-selected-payroll-type" style="display:block; margin-top:4px; font-size:1.05rem; font-weight:700;">--</strong>
                                        <span id="p-selected-payroll-count" style="display:block; margin-top:6px; color: var(--text-muted); font-size:0.92rem;">0 trabajadores activos</span>
                                    </div>
                                    <button id="p-view-payroll-workers" type="button" style="padding:12px 18px; border-radius:10px; background: var(--primary); color:white; border:none; cursor:pointer; font-weight:700;">Ver trabajadores</button>
                                </div>
                                <p style="margin:12px 0 0 0; color: var(--text-muted);">Se tomarán en cuenta los trabajadores activos de esta nómina para la generación por lotes.</p>
                            </div>
                            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:25px; margin-bottom:30px;">
                                    <div class="form-row" id="p-worker-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color: var(--text-main);">Seleccionar Trabajador <span style="color:#e74c3c;">*</span></label>
                                    <select id="p-worker" required style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                        <option value="">Seleccione trabajador...</option>
                                    </select>
                                </div>
                                <div class="form-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color: var(--text-main);">Año de Nómina <span style="color:#e74c3c;">*</span></label>
                                    <select id="p-year" required style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                        ${(() => {
                                            const currentYear = new Date().getFullYear();
                                            let opts = "";
                                            for(let y = currentYear - 5; y <= currentYear + 5; y++) {
                                                opts += `<option value="${y}" ${y === currentYear ? 'selected' : ''}>${y}</option>`;
                                            }
                                            return opts;
                                        })()}
                                    </select>
                                </div>
                                <div class="form-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color: var(--text-main);">Salario Base (Bs.) <span style="color:#e74c3c;">*</span></label>
                                    <input type="number" id="p-salario" value="130" min="0" step="0.01" required style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                </div>
                                <div class="form-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color: var(--text-main);">Fecha de Pago <span style="color:#e74c3c;">*</span></label>
                                    <input type="date" id="p-fecha" value="${todayLocal}" required style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                </div>
                                <div class="form-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color: var(--text-main);">Período de Nómina <span style="color:#e74c3c;">*</span></label>
                                    <select id="p-periodo" required style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                        <option value="">Seleccione periodo...</option>
                                    </select>
                                </div>
                                <div class="form-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color: var(--text-muted); font-size:0.9em;">Desde:</label>
                                    <input type="date" id="p-fecha-desde" readonly style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: rgba(0,0,0,0.05); color: var(--text-main); cursor: not-allowed;">
                                </div>
                                <div class="form-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color: var(--text-muted); font-size:0.9em;">Hasta:</label>
                                    <input type="date" id="p-fecha-hasta" readonly style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: rgba(0,0,0,0.05); color: var(--text-main); cursor: not-allowed;">
                                </div>
                            </div>

                            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; border-top: 1px solid var(--border-color); padding-top:20px; margin-bottom:15px;">
                                <h5 style="color: var(--text-main); margin:0;">Conceptos base</h5>
                                <button id="btn-prorrateos" type="button" style="display:none; align-items:center; gap:8px; padding:8px 16px; border-radius:20px; border:1.5px solid #f59e0b; background:rgba(245,158,11,0.10); color:#f59e0b; font-weight:700; font-size:0.88rem; cursor:pointer; transition:all 0.2s; white-space:nowrap;" title="Trabajadores que ingresaron dentro del rango del periodo (después del inicio) — no se cuentan en la nómina base">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                    Prorrateos
                                    <span id="badge-prorrateos" style="background:#f59e0b; color:#fff; border-radius:999px; padding:1px 8px; font-size:0.82rem; font-weight:800; min-width:20px; text-align:center;">0</span>
                                </button>
                            </div>
                            <div style="display:flex; gap:15px; margin-bottom:25px; align-items: flex-end;">
                                <div style="flex:2;">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color: var(--text-muted); font-size:0.9em;">Seleccionar Concepto <span style="color:#e74c3c;">*</span></label>
                                    <select id="p-add-concept" required style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                        <option value="">Seleccionar...</option>
                                        ${concepts.map(c => `<option value="${c.Id_Concepto}">${c.Nombre_Concepto} (${c.Tipo})</option>`).join('')}
                                    </select>
                                </div>
                                <div style="flex:1;">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color: var(--text-muted); font-size:0.9em;">Cantidad <span style="color:#e74c3c;">*</span></label>
                                    <input type="number" id="p-concept-qty" value="1" min="1" step="0.5" required style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                </div>
                                <button id="btn-add-concept-to-list" class="primary" style="height:42px;">Agregar</button>
                            </div>

                            <div id="added-concepts-container" style="min-height:100px; border:1px solid var(--border-color); border-radius:12px; padding:15px; margin-bottom:25px; background: var(--card-bg);">
                                <p class="text-muted center" style="margin-top:25px;">No hay conceptos base agregados.</p>
                            </div>

                            <div id="incidence-panel" style="background: var(--card-bg); border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:18px; margin-bottom:25px; box-shadow: 0 4px 10px rgba(0,0,0,0.04);">
                                <div style="display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; margin-bottom:16px;">
                                    <div>
                                        <h5 style="margin:0; color: var(--text-main);">Incidencias o variaciones (conceptos individuales)</h5>
                                        <p style="margin:6px 0 0 0; color: var(--text-muted); font-size:0.95rem; max-width:640px;">Selecciona uno o varios trabajadores de la nómina para asignar conceptos individuales dentro del periodo seleccionado.</p>
                                    </div>
                                    <button id="p-select-incidence-workers" type="button" style="padding:10px 18px; border-radius:10px; background: var(--primary); color:white; border:none; cursor:pointer; font-weight:700; white-space:nowrap;">Seleccionar trabajadores</button>
                                </div>
                                <div id="p-selected-incidence-workers-container" style="min-height:100px; border:1px solid var(--border-color); border-radius:12px; padding:14px; background: rgba(255,255,255,0.03);">
                                    <p class="text-muted center" style="margin-top:15px;">No hay trabajadores con incidencias seleccionados.</p>
                                </div>
                            </div>

                            <div style="display:flex; flex-direction:column; gap:12px;">
                                <!-- Conceptos base -->
                                <div class="totals" style="background: var(--card-bg); border: 1px solid var(--border-color); color: var(--text-main); padding:18px; border-radius:12px; box-shadow: 0 4px 10px rgba(0,0,0,0.04);">
                                    <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:0.95em; border-bottom:1px solid var(--border-color); padding-bottom:8px;">
                                        <span style="color: var(--text-muted);">Salario Base:</span>
                                        <span id="t-base" style="font-weight:700; color: var(--text-main);">Bs. 130,00</span>
                                    </div>
                                    <div style="overflow:auto; margin-top:16px;">
                                        <table style="width:100%; border-collapse:collapse; min-width:440px;">
                                            <thead>
                                                <tr style="background: var(--bg-color); color: var(--text-main); font-weight:700;">
                                                    <th style="text-align:left; padding:12px 14px; border-bottom:1px solid var(--border-color);">Concepto</th>
                                                    <th style="text-align:right; padding:12px 14px; border-bottom:1px solid var(--border-color);">Unitario</th>
                                                    <th style="text-align:right; padding:12px 14px; border-bottom:1px solid var(--border-color);">Trabajadores en nómina</th>
                                                    <th style="text-align:right; padding:12px 14px; border-bottom:1px solid var(--border-color);">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style="padding:12px 14px; color: var(--text-main);">Asignaciones base</td>
                                                    <td id="t-asignaciones" style="padding:12px 14px; color: var(--text-main); text-align:right;">Bs. 0,00</td>
                                                    <td id="t-base-workers" style="padding:12px 14px; color: var(--text-main); text-align:right;">0</td>
                                                    <td id="t-asignaciones-total" style="padding:12px 14px; color: var(--text-main); text-align:right;">Bs. 0,00</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:12px 14px; color: var(--text-main);">Deducciones base</td>
                                                    <td id="t-deducciones" style="padding:12px 14px; color: var(--text-main); text-align:right;">Bs. 0,00</td>
                                                    <td id="t-base-workers-2" style="padding:12px 14px; color: var(--text-main); text-align:right;">0</td>
                                                    <td id="t-deducciones-total" style="padding:12px 14px; color: var(--text-main); text-align:right;">Bs. 0,00</td>
                                                </tr>
                                            </tbody>
                                            <tfoot>
                                                <tr style="border-top:2px solid var(--border-color); font-weight:700;">
                                                    <td colspan="3" style="padding:12px 14px; text-align:right; color: var(--text-main);">Total conceptos base</td>
                                                    <td id="t-neto" style="padding:12px 14px; text-align:right; color: var(--text-main);">Bs. 0,00</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>

                                <!-- Panel de cálculo de prorrateos -->
                                <div id="prorrateo-calc-spacer" style="display:none; height:8px;"></div>
                                <div id="prorrateo-calc-panel" class="totals" style="display:none; background: var(--card-bg); border: 1px solid var(--border-color); color: var(--text-main); padding:18px; border-radius:12px; box-shadow: 0 4px 10px rgba(0,0,0,0.04);">
                                    <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:0.95em; border-bottom:1px solid var(--border-color); padding-bottom:8px;">
                                        <span style="font-weight:700; color: var(--text-main);">Prorrateos (Resumen)</span>
                                    </div>
                                    <div style="overflow:auto; margin-top:16px;">
                                        <table style="width:100%; border-collapse:collapse; min-width:440px;">
                                            <thead>
                                                <tr style="background: var(--bg-color); color: var(--text-main); font-weight:700;">
                                                    <th style="text-align:left; padding:12px 14px; border-bottom:1px solid var(--border-color);">Concepto</th>
                                                    <th style="text-align:right; padding:12px 14px; border-bottom:1px solid var(--border-color);">Unitario</th>
                                                    <th style="text-align:right; padding:12px 14px; border-bottom:1px solid var(--border-color);">Trabajadores prorrateados</th>
                                                    <th style="text-align:right; padding:12px 14px; border-bottom:1px solid var(--border-color);">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style="padding:12px 14px; color: var(--text-main);">Asignaciones(P)</td>
                                                    <td id="t-prorrateo-asignaciones" style="padding:12px 14px; color: var(--text-main); text-align:right;">Bs. 0,00</td>
                                                    <td id="t-prorrateo-workers" style="padding:12px 14px; color: var(--text-main); text-align:right;">0</td>
                                                    <td id="t-prorrateo-asignaciones-total" style="padding:12px 14px; color: var(--text-main); text-align:right;">Bs. 0,00</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:12px 14px; color: var(--text-main);">Deducciones(P)</td>
                                                    <td id="t-prorrateo-deducciones" style="padding:12px 14px; color: var(--text-main); text-align:right;">Bs. 0,00</td>
                                                    <td id="t-prorrateo-workers-2" style="padding:12px 14px; color: var(--text-main); text-align:right;">0</td>
                                                    <td id="t-prorrateo-deducciones-total" style="padding:12px 14px; color: var(--text-main); text-align:right;">Bs. 0,00</td>
                                                </tr>
                                            </tbody>
                                            <tfoot>
                                                <tr style="border-top:2px solid var(--border-color); font-weight:700;">
                                                    <td colspan="3" style="padding:12px 14px; text-align:right; color: var(--text-main);">Total prorrateos</td>
                                                    <td id="t-prorrateo-neto" style="padding:12px 14px; text-align:right; color: var(--text-main);">Bs. 0,00</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>

                                <!-- Separador y Conceptos individuales (incidencias) -->
                                <div style="height:8px;"></div>
                                <div style="background: var(--card-bg); border:1px solid var(--border-color); border-radius:12px; padding:16px;">
                                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                                        <h5 style="margin:0; color: var(--text-main); font-size:0.95rem;">Conceptos individuales (incidencias)</h5>
                                    </div>
                                    <div style="display:flex; flex-direction:column; gap:8px;">
                                        <div style="display:flex; justify-content:space-between; font-size:0.95em;">
                                            <span>Asignaciones individuales (I):</span>
                                            <span id="t-inc-asignaciones">Bs. 0,00</span>
                                        </div>
                                        <div style="display:flex; justify-content:space-between; font-size:0.95em;">
                                            <span>Deducciones individuales (I):</span>
                                            <span id="t-inc-deducciones" style="color:#ffb8b8;">Bs. 0,00</span>
                                        </div>
                                        <div style="display:flex; justify-content:space-between; font-size:1.05em; font-weight:700; border-top:1px solid var(--border-color); padding-top:10px;">
                                            <span>Total conceptos individuales:</span>
                                            <span id="t-inc-total">Bs. 0,00</span>
                                        </div>
                                    </div>
                                </div>

                                <div style="height:8px;"></div>
                                <div style="background: var(--card-bg); border:1px solid var(--border-color); border-radius:12px; padding:16px;">
                                    <div style="overflow:auto;">
                                        <table style="width:100%; border-collapse:collapse; min-width:420px;">
                                            <thead>
                                                <tr style="background: rgba(255,255,255,0.03); color: var(--text-main); font-weight:700;">
                                                    <th style="text-align:left; padding:12px 14px; border-bottom:1px solid var(--border-color);">Asignaciones totales</th>
                                                    <th style="text-align:left; padding:12px 14px; border-bottom:1px solid var(--border-color);">Deducciones totales</th>
                                                    <th style="text-align:right; padding:12px 14px; border-bottom:1px solid var(--border-color);">Monto neto</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td id="t-total-asignaciones" style="padding:12px 14px; color: var(--text-main);">Bs. 0,00</td>
                                                    <td id="t-total-deducciones" style="padding:12px 14px; color: var(--text-main);">Bs. 0,00</td>
                                                    <td id="t-total-neto" style="padding:12px 14px; color: var(--text-main); text-align:right; font-weight:700;">Bs. 0,00</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div style="margin-top:18px;">
                                <button id="btn-generate-pay" class="primary" style="width:100%; padding:18px; font-size:1.1em; text-transform:uppercase; letter-spacing:1px;">
                                    Confirmar y generar recibos
                                </button>
                            </div>
                        </div>
                        <div id="admin-payslips-history" style="display:none; margin-top:20px;"></div>
                    </div>
                </div>
            `;

            setupPayrollListeners(workers, concepts, addedConcepts);

        } catch (e) {
            contentDetails.innerHTML = `<div class="error">Error: ${e.message}</div>`;
        }
    }

    function setupPayrollListeners(workers, allConcepts, addedConcepts) {
        const addBtn = document.getElementById('btn-add-concept-to-list');
        const conceptSelect = document.getElementById('p-add-concept');
        const salaryInput = document.getElementById('p-salario');
        const yearSelect = document.getElementById('p-year');
        const periodSelect = document.getElementById('p-periodo');
        const dateFromInput = document.getElementById('p-fecha-desde');
        const dateToInput = document.getElementById('p-fecha-hasta');
        const paymentDateInput = document.getElementById('p-fecha');
        const generateBtn = document.getElementById('btn-generate-pay');
        let selectedPayrollType = '';
        let incidenceWorkers = [];
        let lastBaseAssignmentsTotal = 0;
        let lastBaseDeductionsTotal = 0;
        let lastProrrateoAssignmentsTotal = 0;
        let lastProrrateoDeductionsTotal = 0;
        const incidenceConceptsByWorker = {};
        const incidenceTotalsByWorker = {};

        const calculateIncidenceTotals = (concepts, salario) => {
            const totals = { assignments: 0, deductions: 0 };
            const assignmentBase = concepts.reduce((sum, c) => {
                if (String(c.Tipo || '').toLowerCase() === 'deducción') return sum;
                const aux = Math.max(1, Number(c.Auxiliar || 1) || 1);
                return sum + getConceptAmount(c, salario, 0) * aux;
            }, 0);
            concepts.forEach(c => {
                const aux = Math.max(1, Number(c.Auxiliar || 1) || 1);
                const total = getConceptAmount(c, salario, assignmentBase) * aux;
                if (String(c.Tipo || '').toLowerCase() === 'deducción') {
                    totals.deductions += total;
                } else {
                    totals.assignments += total;
                }
            });
            return totals;
        };

        const getIncidenceTotalsForWorker = (workerId) => {
            const selected = incidenceConceptsByWorker[String(workerId)] || [];
            // If we have a cached total (set when modal edited), prefer it to avoid
            // recomputing with different salary contexts that may yield 0.
            const cached = incidenceTotalsByWorker[String(workerId)];
            if (cached && selected.length > 0) {
                try { console.log('[incidencias] usando cache de totales', workerId, cached); } catch (e) {}
                return cached;
            }
            const worker = workers.find(w => String(w.Id_Trabajador) === String(workerId));
            const salario = worker ? parseFloat(worker.Sueldo_Mensual || 0) : parseFloat(salaryInput.value) || 0;
            const totals = calculateIncidenceTotals(selected, salario);
            try {
                console.log('[incidencias] Totales para trabajador', workerId, { salario, selectedCount: selected.length, totals });
            } catch (e) {}
            // store a cached copy for quick panel update
            incidenceTotalsByWorker[String(workerId)] = totals;
            return totals;
        };

        // Lógica de Periodos Automáticos
        // Generador de semanas: devuelve array de {start, end, label}
        function generateWeeklyPeriods(year) {
            const firstJan = new Date(year, 0, 1);
            // encontrar el primer lunes en o después del 1 de enero
            const firstMonday = new Date(firstJan);
            const day = firstMonday.getDay();
            const diff = (day === 1) ? 0 : ((8 - day) % 7);
            firstMonday.setDate(firstMonday.getDate() + diff);

            const weeks = [];
            for (let i = 0; i < 52; i++) {
                const start = new Date(firstMonday);
                start.setDate(firstMonday.getDate() + i * 7);
                const end = new Date(start);
                end.setDate(start.getDate() + 6);
                const s = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
                const e = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;
                weeks.push({ start: s, end: e });
            }
            return weeks;
        }

        function populatePeriodsForWorker(worker) {
            // worker: object from workers list; uses worker.Frecuencia (e.g., 'Semanal' o 'Quincenal')
            const year = parseInt(yearSelect.value) || new Date().getFullYear();
            periodSelect.innerHTML = '<option value="">Seleccione periodo...</option>';
            if (!worker) return;

            const freq = (worker.Frecuencia || '').toLowerCase();
            if (freq.includes('seman') || freq.includes('semana')) {
                const weeks = generateWeeklyPeriods(year);
                weeks.forEach((w, idx) => {
                    const label = `Semana ${idx + 1} (${w.start} - ${w.end})`;
                    const opt = document.createElement('option');
                    opt.value = `${w.start}|${w.end}`;
                    opt.textContent = label;
                    periodSelect.appendChild(opt);
                });
            } else {
                const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                months.forEach(m => {
                    const o1 = document.createElement('option');
                    o1.value = `1ra Quincena ${m}`;
                    o1.textContent = `1ra Quincena ${m}`;
                    periodSelect.appendChild(o1);
                    const o2 = document.createElement('option');
                    o2.value = `2da Quincena ${m}`;
                    o2.textContent = `2da Quincena ${m}`;
                    periodSelect.appendChild(o2);
                });
            }
        }

        function populatePeriodsForPayrollType(type) {
            const year = parseInt(yearSelect.value) || new Date().getFullYear();
            periodSelect.innerHTML = '<option value="">Seleccione periodo...</option>';
            const t = String(type || '').toLowerCase();

            const appendSemiMonthly = () => {
                const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                months.forEach(m => {
                    const o1 = document.createElement('option');
                    o1.value = `1ra Quincena ${m}`;
                    o1.textContent = `1ra Quincena ${m}`;
                    periodSelect.appendChild(o1);
                    const o2 = document.createElement('option');
                    o2.value = `2da Quincena ${m}`;
                    o2.textContent = `2da Quincena ${m}`;
                    periodSelect.appendChild(o2);
                });
            };

            const appendWeekly = () => {
                const weeks = generateWeeklyPeriods(year);
                weeks.forEach((w, idx) => {
                    const label = `Semana ${idx + 1} (${w.start} - ${w.end})`;
                    const opt = document.createElement('option');
                    opt.value = `${w.start}|${w.end}`;
                    opt.textContent = label;
                    periodSelect.appendChild(opt);
                });
            };

            if (!t || t === 'todos') {
                appendSemiMonthly();
                appendWeekly();
                return;
            }

            if (t.includes('seman')) {
                appendWeekly();
            } else {
                appendSemiMonthly();
            }
        }

        const updatePeriodDates = () => {
            const v = periodSelect.value;
            if (!v) {
                dateFromInput.value = '';
                dateToInput.value = '';
                return;
            }

            // If value contains '|' it's a weekly option with start|end
            if (v.indexOf('|') !== -1) {
                const parts = v.split('|');
                dateFromInput.value = parts[0];
                dateToInput.value = parts[1];
                validatePaymentDate();
                return;
            }

            const year = parseInt(yearSelect.value) || new Date().getFullYear();
            const monthsMap = {
                "Enero": 0, "Febrero": 1, "Marzo": 2, "Abril": 3, "Mayo": 4, "Junio": 5,
                "Julio": 6, "Agosto": 7, "Septiembre": 8, "Octubre": 9, "Noviembre": 10, "Diciembre": 11
            };

            let monthName = "";
            let isFirstHalf = v.startsWith("1ra");

            for (let m in monthsMap) {
                if (v.includes(m)) {
                    monthName = m;
                    break;
                }
            }

            if (monthName) {
                const monthIdx = monthsMap[monthName];
                let dFrom, dTo;
                if (isFirstHalf) {
                    dFrom = new Date(year, monthIdx, 1);
                    dTo = new Date(year, monthIdx, 15);
                } else {
                    dFrom = new Date(year, monthIdx, 16);
                    dTo = new Date(year, monthIdx + 1, 0); // Last day of month
                }

                const factor = (n) => String(n).padStart(2, '0');
                dateFromInput.value = `${year}-${factor(monthIdx + 1)}-${factor(dFrom.getDate())}`;
                dateToInput.value = `${year}-${factor(monthIdx + 1)}-${factor(dTo.getDate())}`;

                // Trigger validation for payment date after period update
                validatePaymentDate();
            }
        };

        periodSelect.addEventListener('change', () => {
            updatePeriodDates();
            updateTotals();
        });
        yearSelect.addEventListener('change', updatePeriodDates);

        // Validaciones en Tiempo Real
        function validateSalary() {
            const val = parseFloat(salaryInput.value) || 0;
            if (val < 130) {
                showInlineError(salaryInput, 'El salario base no puede ser menor a 130 bs.');
                return false;
            } else {
                clearInlineError(salaryInput);
                return true;
            }
        }

        function validatePaymentDate() {
            if (!paymentDateInput.value || !dateToInput.value) return true;

            const pParts = paymentDateInput.value.split('-');
            const payDate = new Date(pParts[0], pParts[1] - 1, pParts[2]);

            const tParts = dateToInput.value.split('-');
            const toDate = new Date(tParts[0], tParts[1] - 1, tParts[2]);

            if (payDate <= toDate) {
                showInlineError(paymentDateInput, 'La fecha de pago debe ser futura a la fecha del periodo seleccionado.');
                return false;
            } else {
                clearInlineError(paymentDateInput);
                return true;
            }
        }

        function getEligiblePayrollWorkers(type) {
            const payrollType = (type || selectedPayrollType || 'Todos').toString();
            const periodValue = periodSelect.value;
            const dates = getPeriodDates(periodValue);
            return (workers || []).filter(w => {
                if (!w) return false;
                if (payrollType && payrollType !== 'Todos' && String(w.Frecuencia || '').toLowerCase() !== payrollType.toLowerCase()) {
                    return false;
                }
                if (!w.Fecha_de_Ingreso) return false;
                if (!dates.end) return true;
                const hireParts = String(w.Fecha_de_Ingreso).split('-');
                if (hireParts.length !== 3) return false;
                const hireDate = new Date(hireParts[0], hireParts[1] - 1, hireParts[2]);
                const endParts = dates.end.split('-');
                const periodEnd = new Date(endParts[0], endParts[1] - 1, endParts[2]);
                return hireDate <= periodEnd;
            });
        }

        // Devuelve trabajadores que ingresaron DESPUÉS de la fecha DESDE pero dentro del periodo
        // (ingreso exactamente en fecha DESDE = trabajador normal, no prorrateo)
        function getProrrateoWorkers(type) {
            const periodValue = periodSelect.value;
            const dates = getPeriodDates(periodValue);
            if (!dates.start || !dates.end) return [];
            const startParts = dates.start.split('-');
            const endParts = dates.end.split('-');
            const periodStart = new Date(startParts[0], startParts[1] - 1, startParts[2]);
            const periodEnd = new Date(endParts[0], endParts[1] - 1, endParts[2]);
            return getEligiblePayrollWorkers(type).filter(w => {
                if (!w.Fecha_de_Ingreso) return false;
                const hireParts = String(w.Fecha_de_Ingreso).split('-');
                if (hireParts.length !== 3) return false;
                const hireDate = new Date(hireParts[0], hireParts[1] - 1, hireParts[2]);
                // Prorrateo: ingresó DESPUÉS del inicio del periodo (no el mismo día) y antes o en la fecha fin
                return hireDate > periodStart && hireDate <= periodEnd;
            });
        }

        // Trabajadores normales de nómina (excluye los de prorrateo)
        function getBasePayrollWorkers(type) {
            const prorrateoIds = new Set(getProrrateoWorkers(type).map(w => String(w.Id_Trabajador)));
            return getEligiblePayrollWorkers(type).filter(w => !prorrateoIds.has(String(w.Id_Trabajador)));
        }

        function getActivePayrollWorkerCount() {
            return getBasePayrollWorkers().length;
        }

        // Actualiza visibilidad y contador del botón Prorrateos
        function updateProrrateoButton() {
            const btn = document.getElementById('btn-prorrateos');
            const badge = document.getElementById('badge-prorrateos');
            if (!btn || !badge) return;
            const prorrateoList = getProrrateoWorkers();
            const count = prorrateoList.length;
            badge.textContent = count;
            btn.style.display = count > 0 ? 'inline-flex' : 'none';
        }

        function getCurrentIncidenceSummaryTotals() {
            return incidenceWorkers.reduce((acc, w) => {
                const totals = getIncidenceTotalsForWorker(w.Id_Trabajador);
                acc.assignments += totals.assignments;
                acc.deductions += totals.deductions;
                return acc;
            }, { assignments: 0, deductions: 0 });
        }

        function formatDeductionAmount(value) {
            const num = Number(value || 0);
            return num === 0 ? 'Bs. 0.00' : `Bs. -${Math.abs(num).toFixed(2)}`;
        }

        function updatePayrollSummaryTotals() {
            const incidenceSummary = getCurrentIncidenceSummaryTotals();
            const totalAssignments = lastBaseAssignmentsTotal + lastProrrateoAssignmentsTotal + incidenceSummary.assignments;
            const totalDeductions = lastBaseDeductionsTotal + lastProrrateoDeductionsTotal + incidenceSummary.deductions;
            const totalNet = totalAssignments - totalDeductions;
            const totalAsigEl = document.getElementById('t-total-asignaciones');
            const totalDeduEl = document.getElementById('t-total-deducciones');
            const totalNetEl = document.getElementById('t-total-neto');
            if (totalAsigEl) totalAsigEl.textContent = `Bs. ${totalAssignments.toFixed(2)}`;
            if (totalDeduEl) totalDeduEl.textContent = formatDeductionAmount(totalDeductions);
            if (totalNetEl) totalNetEl.textContent = `Bs. ${totalNet.toFixed(2)}`;
        }

        function validateWorkerHireDate() {
            const workerId = document.getElementById('p-worker').value;
            const period = document.getElementById('p-periodo').value;
            const workerSelect = document.getElementById('p-worker');

            if (!workerId || !period) {
                clearInlineError(workerSelect);
                return true;
            }

            const w = workers.find(x => String(x.Id_Trabajador) === String(workerId));
            if (!w || !w.Fecha_de_Ingreso) {
                clearInlineError(workerSelect);
                return true;
            }

            const dates = getPeriodDates(period);
            if (!dates.end) {
                clearInlineError(workerSelect);
                return true;
            }

            const hireParts = w.Fecha_de_Ingreso.split('-');
            const hireDate = new Date(hireParts[0], hireParts[1] - 1, hireParts[2]);

            const periodEndParts = dates.end.split('-');
            const periodEnd = new Date(periodEndParts[0], periodEndParts[1] - 1, periodEndParts[2]);

            if (hireDate > periodEnd) {
                showInlineError(workerSelect, `El trabajador ingresó el ${w.Fecha_de_Ingreso}. No se puede pagar un período que terminó antes de su fecha de ingreso.`);
                return false;
            } else {
                clearInlineError(workerSelect);
                return true;
            }
        }

        salaryInput.addEventListener('input', () => {
            validateSalary();
            updateTotals();
        });

        paymentDateInput.addEventListener('change', validatePaymentDate);

        // Pre-validate if initial values exist (e.g. reload)
        setTimeout(() => validateSalary(), 100);

        // Pre-validate if initial values exist (e.g. reload)
        setTimeout(() => validateSalary(), 100);

        function updateTotals() {
            const salario = parseFloat(salaryInput.value) || 0;
            let asig = 0;
            let dedu = 0;

            // Paso 1: Calcular Asignaciones (Ingreso Bruto)
            addedConcepts.forEach(c => {
                if (c.Tipo !== 'Deducción') {
                    const montoUnitario = getConceptAmount(c, salario); // Pasa 0 en totalAsig para el primer pase
                    let qty = 1;
                    if (c.aux) {
                        const match = String(c.aux).match(/(\d+(\.\d+)?)/);
                        if (match) qty = parseFloat(match[0]);
                    }
                    asig += (montoUnitario * qty);
                }
            });

            // Paso 2: Calcular Deducciones (Usando el total de asignaciones para retenciones de ley)
            addedConcepts.forEach(c => {
                if (c.Tipo === 'Deducción') {
                    const montoUnitario = getConceptAmount(c, salario, asig);
                    let qty = 1;
                    if (c.aux) {
                        const match = String(c.aux).match(/(\d+(\.\d+)?)/);
                        if (match) qty = parseFloat(match[0]);
                    }
                    dedu += (montoUnitario * qty);
                }
            });

            const activePayrollWorkers = getActivePayrollWorkerCount();
            const asignacionesTotal = asig * activePayrollWorkers;
            const deduccionesTotal = dedu * activePayrollWorkers;
            const baseNetoTotal = asignacionesTotal - deduccionesTotal;

            document.getElementById('t-base').textContent = `Bs. ${salario.toFixed(2)}`;
            document.getElementById('t-asignaciones').textContent = `Bs. ${asig.toFixed(2)}`;
            document.getElementById('t-base-workers').textContent = activePayrollWorkers;
            document.getElementById('t-asignaciones-total').textContent = `Bs. ${asignacionesTotal.toFixed(2)}`;
            document.getElementById('t-deducciones').textContent = `Bs. -${dedu.toFixed(2)}`;
            document.getElementById('t-base-workers-2').textContent = activePayrollWorkers;
            document.getElementById('t-deducciones-total').textContent = formatDeductionAmount(deduccionesTotal);
            document.getElementById('t-neto').textContent = `Bs. ${baseNetoTotal.toFixed(2)}`;

            lastBaseAssignmentsTotal = asignacionesTotal;
            lastBaseDeductionsTotal = deduccionesTotal;

            // Prorrateo calculations
            const prorrateoWorkers = getProrrateoWorkers();
            const prorrateoCount = prorrateoWorkers.length;

            let prorrateoAsigTotal = 0;
            let prorrateoDeduTotal = 0;

            prorrateoWorkers.forEach(w => {
                const wTotals = getProrrateoTotalsForWorker(w.Id_Trabajador);
                prorrateoAsigTotal += wTotals.asig;
                prorrateoDeduTotal += wTotals.dedu;
            });

            const prorrateoNetTotal = prorrateoAsigTotal - prorrateoDeduTotal;

            const prrPanel = document.getElementById('prorrateo-calc-panel');
            const prrSpacer = document.getElementById('prorrateo-calc-spacer');
            if (prrPanel && prrSpacer) {
                if (prorrateoCount > 0) {
                    prrPanel.style.display = 'block';
                    prrSpacer.style.display = 'block';
                } else {
                    prrPanel.style.display = 'none';
                    prrSpacer.style.display = 'none';
                }
            }

            const unitAsigPrr = prorrateoCount > 0 ? (prorrateoAsigTotal / prorrateoCount) : 0;
            const unitDeduPrr = prorrateoCount > 0 ? (prorrateoDeduTotal / prorrateoCount) : 0;

            const tPrrAsig = document.getElementById('t-prorrateo-asignaciones');
            const tPrrWorkers = document.getElementById('t-prorrateo-workers');
            const tPrrAsigTotal = document.getElementById('t-prorrateo-asignaciones-total');
            const tPrrDedu = document.getElementById('t-prorrateo-deducciones');
            const tPrrWorkers2 = document.getElementById('t-prorrateo-workers-2');
            const tPrrDeduTotal = document.getElementById('t-prorrateo-deducciones-total');
            const tPrrNeto = document.getElementById('t-prorrateo-neto');

            if (tPrrAsig) tPrrAsig.textContent = `Bs. ${unitAsigPrr.toFixed(2)}`;
            if (tPrrWorkers) tPrrWorkers.textContent = prorrateoCount;
            if (tPrrAsigTotal) tPrrAsigTotal.textContent = `Bs. ${prorrateoAsigTotal.toFixed(2)}`;
            if (tPrrDedu) tPrrDedu.textContent = `Bs. -${unitDeduPrr.toFixed(2)}`;
            if (tPrrWorkers2) tPrrWorkers2.textContent = prorrateoCount;
            if (tPrrDeduTotal) tPrrDeduTotal.textContent = formatDeductionAmount(prorrateoDeduTotal);
            if (tPrrNeto) tPrrNeto.textContent = `Bs. ${prorrateoNetTotal.toFixed(2)}`;

            lastProrrateoAssignmentsTotal = prorrateoAsigTotal;
            lastProrrateoDeductionsTotal = prorrateoDeduTotal;

            updatePayrollSummaryTotals();
            updateProrrateoButton();

            // Re-re-renderizar conceptos para actualizar montos mostrados si el ingreso bruto (asig) o salario cambió
            renderAddedConcepts(addedConcepts, updateTotals, asig);
        }

        // Helper: Get dates from period
        function getPeriodDates(period) {
            if (!period || typeof period !== 'string') return { start: '', end: '' };
            // weekly values are encoded as 'YYYY-MM-DD|YYYY-MM-DD'
            if (period.indexOf('|') !== -1) {
                const parts = period.split('|');
                return { start: parts[0], end: parts[1] };
            }

            const year = parseInt(yearSelect.value) || new Date().getFullYear();
            const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

            for (let i = 0; i < 12; i++) {
                if (period.includes(months[i])) {
                    if (period.includes("1ra")) {
                        return { start: `${year}-${String(i + 1).padStart(2, '0')}-01`, end: `${year}-${String(i + 1).padStart(2, '0')}-15` };
                    } else {
                        const lastDay = new Date(year, i + 1, 0).getDate();
                        return { start: `${year}-${String(i + 1).padStart(2, '0')}-16`, end: `${year}-${String(i + 1).padStart(2, '0')}-${lastDay}` };
                    }
                }
            }
            return { start: '', end: '' };
        }

        // Automatic Mandatory Concepts
        async function triggerMandatoryConcepts() {
            const workerId = document.getElementById('p-worker').value;
            const period = document.getElementById('p-periodo').value;
            if (!workerId || !period) return;

            // Validate worker hire date before proceeding
            if (!validateWorkerHireDate()) {
                return;
            }

            const w = workers.find(x => String(x.Id_Trabajador) === String(workerId));
            if (!w) return;

            const dates = getPeriodDates(period);
            const salario = parseFloat(salaryInput.value) || 0;

            // Simple logic: add IVSS, SPF, FAOV if missing
            const mandatoryCodigos = ['IVSS', 'SPF', 'FAOV'];

            // Calculate Mondays
            let lunes = 4;
            if (dates.start && dates.end) {
                let start = new Date(dates.start + 'T00:00:00');
                let end = new Date(dates.end + 'T23:59:59');
                lunes = 0;
                while (start <= end) {
                    if (start.getDay() === 1) lunes++;
                    start.setDate(start.getDate() + 1);
                }
                if (lunes === 0) lunes = 2; // Failover
            }

            const sueldoSemanal = (Math.min(salario, 650) * 12) / 52;

            mandatoryCodigos.forEach(cod => {
                if (!addedConcepts.some(c => c.Codigo === cod)) {
                    let c = { Codigo: cod, Tipo: 'Deducción' };
                    if (cod === 'IVSS') {
                        c.Nombre_Concepto = 'Seguro Social Obligatorio (4%)';
                        c.Monto = sueldoSemanal * 0.04;
                        c.aux = `${lunes} Lunes`;
                    } else if (cod === 'SPF') {
                        c.Nombre_Concepto = 'Régimen Prest. de Empleo (0.5%)';
                        c.Monto = sueldoSemanal * 0.005;
                        c.aux = `${lunes} Lunes`;
                    } else if (cod === 'FAOV') {
                        c.Nombre_Concepto = 'Ahorro Habitacional (1%)';
                        c.Monto = salario * 0.01;
                        c.aux = '1%';
                    }
                    addedConcepts.push(c);
                }
            });
            renderAddedConcepts(addedConcepts, updateTotals);
            updateTotals();
        }

        // Populate worker select based on payroll type
        const populateWorkerSelect = (type) => {
            const workerSelect = document.getElementById('p-worker');
            if (!workerSelect) return;
            const t = (type || '').toString();
            const opts = ['<option value="">Seleccione trabajador...</option>'];
            const filtered = getEligiblePayrollWorkers(t);
            filtered.forEach(w => {
                opts.push(`<option value="${w.Id_Trabajador}">${w.Documento_Identidad} - ${w.Nombre_Completo} ${w.Apellidos}</option>`);
            });
            workerSelect.innerHTML = opts.join('');
            const currentValue = workerSelect.value;
            if (currentValue && !filtered.some(w => String(w.Id_Trabajador) === String(currentValue))) {
                workerSelect.value = '';
                validateWorkerHireDate();
            }
        };

        const showPayrollWorkersModal = async () => {
            const t = selectedPayrollType || 'Todos';
            const payrollTypeText = t === 'Todos' ? 'Todos los trabajadores' : `Nómina ${t.toLowerCase()}`;
            const items = getEligiblePayrollWorkers(t);

            const modalHtml = `
                <div style="display:flex; flex-direction:column; gap:16px;">
                    <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center; justify-content:space-between;">
                        <div style="display:flex; flex-direction:column; gap:6px;">
                            <span style="font-size:0.95rem; color: var(--text-muted);">Tipo de nómina</span>
                            <strong style="font-size:1rem; color: var(--text-main);">${payrollTypeText}</strong>
                        </div>
                        <div style="font-weight:700; color: var(--text-main);">Total: <span id="p-payroll-worker-count">${items.length}</span></div>
                    </div>
                    <div style="background:rgba(37,126,241,0.07); border:1px solid rgba(37,126,241,0.18); border-radius:10px; padding:12px 16px; font-size:0.9rem; color:var(--text-muted);">
                        💡 Los montos se calculan con base en el salario individual de cada trabajador y los conceptos base agregados al formulario.
                    </div>
                    <input id="payroll-worker-search" type="text" placeholder="Buscar por cédula o nombre..." style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                    <div style="max-height:60vh; overflow:auto; border:1px solid var(--border-color); border-radius:12px; background: var(--card-bg);">
                        <table style="width:100%; border-collapse:collapse; min-width:750px;">
                            <thead>
                                <tr style="background: rgba(255,255,255,0.03); color: var(--text-main); font-weight:700; position:sticky; top:0; z-index:1;">
                                    <th style="text-align:left; padding:12px 14px; border-bottom:1px solid var(--border-color);">Cédula</th>
                                    <th style="text-align:left; padding:12px 14px; border-bottom:1px solid var(--border-color);">Nombre completo</th>
                                    <th style="text-align:left; padding:12px 14px; border-bottom:1px solid var(--border-color);">Tipo</th>
                                    <th style="text-align:right; padding:12px 14px; border-bottom:1px solid var(--border-color);">Sal. Base</th>
                                    <th style="text-align:right; padding:12px 14px; border-bottom:1px solid var(--border-color); color:#4ade80;">Asignaciones</th>
                                    <th style="text-align:right; padding:12px 14px; border-bottom:1px solid var(--border-color); color:#f87171;">Deducciones</th>
                                    <th style="text-align:right; padding:12px 14px; border-bottom:1px solid var(--border-color);">Neto</th>
                                </tr>
                            </thead>
                            <tbody id="payroll-workers-table-body"></tbody>
                            <tfoot id="payroll-workers-table-foot"></tfoot>
                        </table>
                    </div>
                </div>
            `;

            const modalPromise = showModal({
                title: `Trabajadores en ${payrollTypeText}`,
                html: modalHtml,
                okText: 'Cerrar',
                modalStyle: 'width:98%; max-width:1100px;'
            });

            const modalRoot = document.querySelector('.modal-show');
            const searchInput = modalRoot?.querySelector('#payroll-worker-search');
            const countNode = modalRoot?.querySelector('#p-payroll-worker-count');
            const tbody = modalRoot?.querySelector('#payroll-workers-table-body');
            const tfoot = modalRoot?.querySelector('#payroll-workers-table-foot');

            // Calculate payroll totals for a single worker using current form concepts
            const calcWorkerTotals = (w) => {
                const sal = parseFloat(w.Sueldo_Mensual) || parseFloat(salaryInput.value) || 0;
                const isProrrateo = getProrrateoWorkers().some(pw => String(pw.Id_Trabajador) === String(w.Id_Trabajador));
                const rawConcepts = [];

                if (isProrrateo) {
                    (prorrateoConceptsByWorker[String(w.Id_Trabajador)] || []).forEach(c => rawConcepts.push({ ...c }));
                } else {
                    addedConcepts.forEach(c => rawConcepts.push({ ...c }));
                }
                // Include individual incidences
                (incidenceConceptsByWorker[String(w.Id_Trabajador)] || []).forEach(c => rawConcepts.push({ ...c }));

                // Pass 1: Assignments
                let asig = 0;
                rawConcepts.forEach(c => {
                    if (c.Tipo !== 'Deducción') {
                        const mu = getConceptAmount(c, sal, 0);
                        let q = 1;
                        const auxVal = c.aux || c.Auxiliar || c.aux_qty || '';
                        if (auxVal && String(auxVal).match(/(\d+(\.\d+)?)/)) q = parseFloat(String(auxVal).match(/(\d+(\.\d+)?)/)[0]);
                        asig += mu * q;
                    }
                });

                // Pass 2: Deductions
                let dedu = 0;
                rawConcepts.forEach(c => {
                    if (c.Tipo === 'Deducción') {
                        const mu = getConceptAmount(c, sal, asig);
                        let q = 1;
                        const auxVal = c.aux || c.Auxiliar || c.aux_qty || '';
                        if (auxVal && String(auxVal).match(/(\d+(\.\d+)?)/)) q = parseFloat(String(auxVal).match(/(\d+(\.\d+)?)/)[0]);
                        dedu += mu * q;
                    }
                });

                return { sal, asig, dedu, neto: asig - dedu };
            };

            const renderTable = (searchTerm = '') => {
                if (!tbody || !countNode) return;
                const term = String(searchTerm || '').trim().toLowerCase();
                const filtered = items.filter(w => {
                    const fullname = `${w.Nombre_Completo || ''} ${w.Apellidos || ''}`.toLowerCase();
                    const cedula = String(w.Documento_Identidad || '').toLowerCase();
                    return !term || fullname.includes(term) || cedula.includes(term);
                });
                countNode.textContent = filtered.length;

                let grandAsig = 0, grandDedu = 0, grandNeto = 0;

                tbody.innerHTML = filtered.map(w => {
                    const { sal, asig, dedu, neto } = calcWorkerTotals(w);
                    grandAsig += asig;
                    grandDedu += dedu;
                    grandNeto += neto;
                    const netoColor = neto >= 0 ? '#4ade80' : '#f87171';
                    return `
                        <tr style="border-bottom:1px solid var(--border-color);">
                            <td style="padding:11px 14px; color: var(--text-main); white-space:nowrap;">${w.Documento_Identidad || '-'}</td>
                            <td style="padding:11px 14px; color: var(--text-main);">${w.Nombre_Completo || ''} ${w.Apellidos || ''}</td>
                            <td style="padding:11px 14px; color: var(--text-muted); white-space:nowrap;">${w.Frecuencia || ''}</td>
                            <td style="padding:11px 14px; color: var(--text-main); text-align:right; white-space:nowrap;">Bs. ${sal.toFixed(2)}</td>
                            <td style="padding:11px 14px; color:#4ade80; text-align:right; white-space:nowrap; font-weight:600;">Bs. ${asig.toFixed(2)}</td>
                            <td style="padding:11px 14px; color:#f87171; text-align:right; white-space:nowrap; font-weight:600;">Bs. -${dedu.toFixed(2)}</td>
                            <td style="padding:11px 14px; color:${netoColor}; text-align:right; white-space:nowrap; font-weight:700;">Bs. ${neto.toFixed(2)}</td>
                        </tr>
                    `;
                }).join('') || '<tr><td colspan="7" style="padding:16px 14px; color: var(--text-muted);">No se encontró ningún trabajador.</td></tr>';

                // Render totals footer
                if (tfoot) {
                    tfoot.innerHTML = `
                        <tr style="border-top:2px solid var(--border-color); background:rgba(255,255,255,0.04); font-weight:700;">
                            <td colspan="3" style="padding:13px 14px; color:var(--text-main); text-align:right;">Totales (${filtered.length} trabajadores)</td>
                            <td style="padding:13px 14px; color:var(--text-main); text-align:right;">—</td>
                            <td style="padding:13px 14px; color:#4ade80; text-align:right;">Bs. ${grandAsig.toFixed(2)}</td>
                            <td style="padding:13px 14px; color:#f87171; text-align:right;">Bs. -${grandDedu.toFixed(2)}</td>
                            <td style="padding:13px 14px; color:${grandNeto >= 0 ? '#4ade80' : '#f87171'}; text-align:right;">Bs. ${grandNeto.toFixed(2)}</td>
                        </tr>
                    `;
                }
            };

            if (searchInput) {
                searchInput.addEventListener('input', () => renderTable(searchInput.value));
            }
            renderTable();
            await modalPromise;
        };

        const getActivePayrollWorkers = () => {
            return getEligiblePayrollWorkers();
        };

        const showIncidenceWorkersModal = async () => {
            const items = getActivePayrollWorkers();
            const payrollTypeText = selectedPayrollType === 'Todos' ? 'Todos los trabajadores' : `Nómina ${selectedPayrollType.toLowerCase()}`;
            const selectedWorkerIds = new Set(incidenceWorkers.map(w => String(w.Id_Trabajador)));

            const modalHtml = `
                <div style="display:flex; flex-direction:column; gap:16px;">
                    <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center; justify-content:space-between;">
                        <div style="display:flex; flex-direction:column; gap:6px;">
                            <span style="font-size:0.95rem; color: var(--text-muted);">Tipo de nómina</span>
                            <strong style="font-size:1rem; color: var(--text-main);">${payrollTypeText}</strong>
                        </div>
                        <div style="font-weight:700; color: var(--text-main);">Total: <span id="p-incidence-worker-count">${items.length}</span></div>
                    </div>
                    <input id="incidence-worker-search" type="text" placeholder="Buscar por cédula o nombre..." style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                    <div style="max-height:68vh; overflow:auto; border:1px solid var(--border-color); border-radius:12px; background: var(--card-bg);">
                        <table style="width:100%; border-collapse:collapse; min-width:680px;">
                            <thead>
                                <tr style="background: rgba(255,255,255,0.03); color: var(--text-main); font-weight:700;">
                                    <th style="width:44px; text-align:left; padding:12px 14px; border-bottom:1px solid var(--border-color);"></th>
                                    <th style="text-align:left; padding:12px 14px; border-bottom:1px solid var(--border-color);">Cédula</th>
                                    <th style="text-align:left; padding:12px 14px; border-bottom:1px solid var(--border-color);">Nombre completo</th>
                                    <th style="text-align:left; padding:12px 14px; border-bottom:1px solid var(--border-color);">Tipo</th>
                                </tr>
                            </thead>
                            <tbody id="incidence-workers-modal-body"></tbody>
                        </table>
                    </div>
                </div>
            `;

            const modalPromise = showModal({
                title: 'Seleccionar trabajadores con incidencias',
                html: modalHtml,
                okText: 'Guardar selecciones',
                cancelText: 'Cancelar',
                modalClass: 'incidence-worker-modal',
                modalStyle: 'width:92%; max-width:900px;'
            });

            const modalRoot = document.querySelector('.modal-show');
            const searchInput = modalRoot?.querySelector('#incidence-worker-search');
            const countNode = modalRoot?.querySelector('#p-incidence-worker-count');
            const tbody = modalRoot?.querySelector('#incidence-workers-modal-body');

            const renderTable = (searchTerm = '') => {
                if (!tbody || !countNode) return;
                const term = String(searchTerm || '').trim().toLowerCase();
                const filtered = items.filter(w => {
                    const fullname = `${w.Nombre_Completo || ''} ${w.Apellidos || ''}`.toLowerCase();
                    const cedula = String(w.Documento_Identidad || '').toLowerCase();
                    return !term || fullname.includes(term) || cedula.includes(term);
                });
                countNode.textContent = filtered.length;
                tbody.innerHTML = filtered.map(w => {
                    const checked = selectedWorkerIds.has(String(w.Id_Trabajador));
                    return `
                        <tr style="border-bottom:1px solid var(--border-color);">
                            <td style="padding:12px 14px; color: var(--text-main);">
                                <input type="checkbox" value="${w.Id_Trabajador}" ${checked ? 'checked' : ''} style="width:16px; height:16px;">
                            </td>
                            <td style="padding:12px 14px; color: var(--text-main);">${w.Documento_Identidad || '-'}</td>
                            <td style="padding:12px 14px; color: var(--text-main);">${w.Nombre_Completo || ''} ${w.Apellidos || ''}</td>
                            <td style="padding:12px 14px; color: var(--text-muted);">${w.Frecuencia || ''}</td>
                        </tr>
                    `;
                }).join('') || '<tr><td colspan="4" style="padding:16px 14px; color: var(--text-muted);">No se encontró ningún trabajador.</td></tr>';
            };

            if (tbody) {
                tbody.addEventListener('change', (event) => {
                    const target = event.target;
                    if (!(target instanceof HTMLInputElement)) return;
                    if (target.type !== 'checkbox') return;
                    const workerId = String(target.value);
                    if (target.checked) {
                        selectedWorkerIds.add(workerId);
                    } else {
                        selectedWorkerIds.delete(workerId);
                    }
                });
            }

            if (searchInput) {
                searchInput.addEventListener('input', () => renderTable(searchInput.value));
            }
            renderTable();

            const shouldSave = await modalPromise;
            if (!shouldSave || !tbody) return;

            incidenceWorkers = items.filter(w => selectedWorkerIds.has(String(w.Id_Trabajador)));
            renderIncidenceWorkersPanel();
        };

        const renderIncidenceWorkersPanel = () => {
            const container = document.getElementById('p-selected-incidence-workers-container');
            if (!container) return;
            const formatAmount = (value) => Number(value || 0).toFixed(2);
            const formatDeduction = (value) => {
                const num = Number(value || 0);
                return num === 0 ? 'Bs. 0.00' : `Bs. -${Math.abs(num).toFixed(2)}`;
            };
            const formatSigned = (value) => {
                const num = Number(value || 0);
                return num < 0 ? `Bs. -${Math.abs(num).toFixed(2)}` : `Bs. ${num.toFixed(2)}`;
            };
            const totalSummary = incidenceWorkers.reduce((acc, w) => {
                const totals = getIncidenceTotalsForWorker(w.Id_Trabajador);
                acc.assignments += totals.assignments;
                acc.deductions += totals.deductions;
                return acc;
            }, { assignments: 0, deductions: 0 });
            if (!incidenceWorkers.length) {
                container.innerHTML = '<p class="text-muted center" style="margin-top:15px;">No hay trabajadores con incidencias seleccionados.</p>';
                const incAsigEl = document.getElementById('t-inc-asignaciones');
                const incDeduEl = document.getElementById('t-inc-deducciones');
                const incTotalEl = document.getElementById('t-inc-total');
                if (incAsigEl) incAsigEl.textContent = 'Bs. 0.00';
                if (incDeduEl) incDeduEl.textContent = 'Bs. 0.00';
                if (incTotalEl) incTotalEl.textContent = 'Bs. 0.00';
                updatePayrollSummaryTotals();
                return;
            }
            container.innerHTML = `
                <div style="overflow:auto;">
                    <table style="width:100%; border-collapse:collapse; min-width:420px;">
                        <thead>
                            <tr style="background: rgba(255,255,255,0.03); color: var(--text-main); font-weight:700;">
                                <th style="text-align:left; padding:12px 14px; border-bottom:1px solid var(--border-color);">Cédula</th>
                                <th style="text-align:left; padding:12px 14px; border-bottom:1px solid var(--border-color);">Nombre completo</th>
                                <th style="text-align:right; padding:12px 14px; border-bottom:1px solid var(--border-color);">Asignaciones (I)</th>
                                <th style="text-align:right; padding:12px 14px; border-bottom:1px solid var(--border-color);">Deducciones (I)</th>
                                <th style="text-align:center; padding:12px 14px; border-bottom:1px solid var(--border-color);">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${incidenceWorkers.map(w => {
                                const totals = getIncidenceTotalsForWorker(w.Id_Trabajador);
                                try { console.log('[incidencias] renderIncidenceWorkersPanel fila', String(w.Id_Trabajador), totals); } catch(e) {}
                                return `
                                <tr style="border-bottom:1px solid var(--border-color);">
                                    <td style="padding:12px 14px; color: var(--text-main);">${w.Documento_Identidad || '-'}</td>
                                    <td style="padding:12px 14px; color: var(--text-main);">${w.Nombre_Completo || ''} ${w.Apellidos || ''}</td>
                                    <td style="padding:12px 14px; color: var(--text-main); text-align:right;">Bs. ${formatAmount(totals.assignments)}</td>
                                    <td style="padding:12px 14px; color: var(--text-main); text-align:right;">${formatDeduction(totals.deductions)}</td>
                                    <td style="padding:12px 14px; display:flex; justify-content:center; align-items:center; gap:10px; flex-wrap:wrap;">
                                        <button class="primary p-incidence-load-btn" data-id="${w.Id_Trabajador}" type="button" style="padding:8px 14px; border-radius:8px;">Cargar incidencias</button>
                                        <button class="secondary p-incidence-remove-btn" data-id="${w.Id_Trabajador}" type="button" style="padding:8px 14px; border-radius:8px; background:transparent; border:1px solid var(--border-color); color: var(--text-main);">Eliminar del panel</button>
                                    </td>
                                </tr>
                            `}).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            const incAsigEl = document.getElementById('t-inc-asignaciones');
            const incDeduEl = document.getElementById('t-inc-deducciones');
            const incTotalEl = document.getElementById('t-inc-total');
            if (incAsigEl) incAsigEl.textContent = `Bs. ${formatAmount(totalSummary.assignments)}`;
            if (incDeduEl) incDeduEl.textContent = formatDeduction(totalSummary.deductions);
            if (incTotalEl) incTotalEl.textContent = formatSigned(totalSummary.assignments - totalSummary.deductions);
            updatePayrollSummaryTotals();
            container.querySelectorAll('.p-incidence-remove-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.id;
                    incidenceWorkers = incidenceWorkers.filter(w => String(w.Id_Trabajador) !== String(id));
                    delete incidenceConceptsByWorker[String(id)];
                    delete incidenceTotalsByWorker[String(id)];
                    renderIncidenceWorkersPanel();
                });
            });

            container.querySelectorAll('.p-incidence-load-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.id;
                    const worker = incidenceWorkers.find(w => String(w.Id_Trabajador) === String(id));
                    if (!worker) return;
                    showIncidenceReceiptModal(worker);
                });
            });
        };

        const showIncidenceReceiptModal = async (worker) => {
            const workerKey = String(worker.Id_Trabajador);
            let selectedConcepts = incidenceConceptsByWorker[workerKey] || [];
            const salario = parseFloat(document.getElementById('p-salario')?.value || 0) || 0;
            const formatAmount = (value) => Number(value || 0).toFixed(2);

            const getCurrentModalRoot = () => {
                const modals = document.querySelectorAll('.modal-show');
                return modals[modals.length - 1] || null;
            };

            const getConceptRowTotals = (c, totalAsig) => {
                const aux = Math.max(1, Number(c.Auxiliar || 1) || 1);
                const unit = getConceptAmount(c, salario, totalAsig);
                const total = unit * aux;
                const isDeduction = String(c.Tipo || '').toLowerCase() === 'deducción';
                return { aux, total, isDeduction };
            };

            const renderConceptsTable = () => {
                const modalRoot = getCurrentModalRoot();
                const body = modalRoot?.querySelector('#p-incidence-concepts-body');
                if (!body) return;

                if (!selectedConcepts.length) {
                    body.innerHTML = `
                        <tr>
                            <td colspan="6" style="padding:20px 16px; color: var(--text-muted); text-align:center;">No hay conceptos agregados.</td>
                        </tr>
                    `;
                    return;
                }

                const assignmentBase = selectedConcepts.reduce((sum, c) => {
                    if (String(c.Tipo || '').toLowerCase() === 'deducción') return sum;
                    const aux = Math.max(1, Number(c.Auxiliar || 1) || 1);
                    return sum + getConceptAmount(c, salario, 0) * aux;
                }, 0);

                const rows = selectedConcepts.map((c, index) => {
                    const { aux, total, isDeduction } = getConceptRowTotals(c, assignmentBase);
                    return `
                        <tr style="border-bottom:1px solid var(--border-color);">
                            <td style="padding:12px 14px; color: var(--text-main);">${c.Codigo || '-'}</td>
                            <td style="padding:12px 14px; color: var(--text-main);">${c.Nombre_Concepto || '-'}</td>
                            <td style="padding:12px 14px; color: var(--text-main);">
                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    data-index="${index}"
                                    class="p-incidence-aux-input"
                                    value="${aux}"
                                    placeholder="1"
                                    style="width:80px; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);"
                                />
                            </td>
                            <td class="p-incidence-amount-cell p-incidence-assignment-cell" style="padding:12px 14px; color: var(--text-main); text-align:right;">${isDeduction ? '' : formatAmount(total)}</td>
                            <td class="p-incidence-amount-cell p-incidence-deduction-cell" style="padding:12px 14px; color: var(--text-main); text-align:right;">${isDeduction ? '-' + formatAmount(total) : ''}</td>
                            <td style="padding:12px 14px; text-align:center;">
                                <button type="button" class="p-incidence-concept-remove" data-index="${index}" style="border:none; background: rgba(255,77,77,0.12); cursor:pointer; color: var(--error-color); font-size:1.1rem; width:34px; height:34px; border-radius:8px; display:inline-flex; align-items:center; justify-content:center; transition: background 0.2s;">🗑</button>
                            </td>
                        </tr>
                    `;
                });

                const totals = selectedConcepts.reduce((acc, c) => {
                    const { total, isDeduction } = getConceptRowTotals(c, assignmentBase);
                    if (isDeduction) {
                        acc.deductions += total;
                    } else {
                        acc.assignments += total;
                    }
                    return acc;
                }, { assignments: 0, deductions: 0 });

                body.innerHTML = rows.join('') + `
                    <tr style="border-top:2px solid var(--border-color); background: rgba(255,255,255,0.04); font-weight:700;">
                        <td colspan="3" style="padding:14px 16px; text-align:right; color: var(--text-main);">Totales</td>
                        <td style="padding:14px 16px; text-align:right; color: var(--text-main);">${formatAmount(totals.assignments)}</td>
                        <td style="padding:14px 16px; text-align:right; color: var(--text-main);">-${formatAmount(totals.deductions)}</td>
                        <td></td>
                    </tr>
                    <tr style="background: rgba(255,255,255,0.02); font-weight:700;">
                        <td colspan="3" style="padding:14px 16px; text-align:right; color: var(--text-main);">Total incidencias</td>
                        <td colspan="2" style="padding:14px 16px; text-align:right; color: ${totals.assignments - totals.deductions >= 0 ? '#8bf7a0' : '#ff9fa6'};">
                            ${totals.assignments - totals.deductions >= 0 ? '+' : '-'}Bs. ${formatAmount(Math.abs(totals.assignments - totals.deductions))}
                        </td>
                        <td></td>
                    </tr>
                `;

                body.querySelectorAll('.p-incidence-aux-input').forEach(input => {
                    input.addEventListener('input', (event) => {
                        const target = event.target;
                        if (!(target instanceof HTMLInputElement)) return;
                        const idx = Number(target.dataset.index);
                        if (Number.isNaN(idx) || !selectedConcepts[idx]) return;
                        const value = Math.max(1, Number(target.value) || 1);
                        target.value = value;
                        selectedConcepts[idx].Auxiliar = value;
                        incidenceConceptsByWorker[workerKey] = selectedConcepts;
                        try {
                            incidenceTotalsByWorker[workerKey] = calculateIncidenceTotals(selectedConcepts, salario);
                        } catch (e) {}
                        renderConceptsTable();
                    });
                });

                body.querySelectorAll('.p-incidence-concept-remove').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const idx = Number(btn.dataset.index);
                        if (Number.isNaN(idx) || !selectedConcepts[idx]) return;
                        selectedConcepts.splice(idx, 1);
                        incidenceConceptsByWorker[workerKey] = selectedConcepts;
                        try {
                            incidenceTotalsByWorker[workerKey] = calculateIncidenceTotals(selectedConcepts, salario);
                        } catch (e) {}
                        renderConceptsTable();
                    });
                });

                // Keep the incidence panel totals in sync when the receipt modal changes.
                renderIncidenceWorkersPanel();
            };

            const modalHtml = `
                <div style="display:flex; flex-direction:column; gap:18px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
                        <div>
                            <h3 style="margin:0; font-size:1rem; color: var(--text-main);">Panel de incidencias</h3>
                            <p style="margin:6px 0 0 0; color: var(--text-muted);">${worker.Nombre_Completo || ''} ${worker.Apellidos || ''} — ${worker.Documento_Identidad || '-'}</p>
                        </div>
                        <button id="p-incidence-add-concept" type="button" style="padding:10px 16px; border-radius:10px; border:none; background:linear-gradient(135deg, #2bcbba, #14a085); color:white; font-weight:700; cursor:pointer;">Agregar concepto</button>
                    </div>
                    <div style="overflow:auto; border:1px solid var(--border-color); border-radius:12px; background: var(--card-bg);">
                        <table style="width:100%; border-collapse:collapse; min-width:760px;">
                            <thead>
                                <tr style="background: rgba(255,255,255,0.03); color: var(--text-main); font-weight:700;">
                                    <th style="text-align:left; padding:14px 16px; border-bottom:1px solid var(--border-color);">COD</th>
                                    <th style="text-align:left; padding:14px 16px; border-bottom:1px solid var(--border-color);">Concepto</th>
                                    <th style="text-align:left; padding:14px 16px; border-bottom:1px solid var(--border-color);">Auxiliar</th>
                                    <th style="text-align:right; padding:14px 16px; border-bottom:1px solid var(--border-color);">Asignación</th>
                                    <th style="text-align:right; padding:14px 16px; border-bottom:1px solid var(--border-color);">Deducción</th>
                                    <th style="text-align:center; padding:14px 16px; border-bottom:1px solid var(--border-color);">Acción</th>
                                </tr>
                            </thead>
                            <tbody id="p-incidence-concepts-body">
                                <tr>
                                    <td colspan="5" style="padding:20px 16px; color: var(--text-muted); text-align:center;">No hay conceptos agregados.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

            const modalPromise = showModal({
                title: `Cargar incidencias para ${worker.Nombre_Completo || ''} ${worker.Apellidos || ''}`,
                html: modalHtml,
                okText: 'Cerrar',
                modalClass: 'incidence-receipt-modal',
                modalStyle: 'width:92%; max-width:900px;'
            });

            renderConceptsTable();

            const modalRoot = document.querySelector('.modal-show');
            const addBtn = modalRoot?.querySelector('#p-incidence-add-concept');
            if (addBtn) {
                addBtn.addEventListener('click', async () => {
                    try {
                        const conceptsData = await apiFetch('/concepts');
                        const allConcepts = (conceptsData.conceptos || []).filter(c => String(c.Estado || '').trim().toLowerCase() === 'activo');
                        const currentIds = new Set(selectedConcepts.map(c => String(c.Id_Concepto)));
                        let tempSelectedIds = new Set(currentIds);

                        const renderConceptSelectionTable = (filter = '') => {
                            const selectionRoot = getCurrentModalRoot();
                            const body = selectionRoot?.querySelector('#p-incidence-concept-selector-body');
                            if (!body) return;
                            const term = String(filter || '').trim().toLowerCase();
                            const filtered = allConcepts.filter(c => {
                                if (!term) return true;
                                const code = String(c.Codigo || '').toLowerCase();
                                const name = String(c.Nombre_Concepto || '').toLowerCase();
                                const type = String(c.Tipo || '').toLowerCase();
                                return code.includes(term) || name.includes(term) || type.includes(term);
                            });
                            body.innerHTML = filtered.map(c => `
                                <tr style="border-bottom:1px solid var(--border-color);">
                                    <td style="padding:12px 14px; color: var(--text-main);">
                                        <input type="checkbox" value="${c.Id_Concepto}" ${tempSelectedIds.has(String(c.Id_Concepto)) ? 'checked' : ''} style="width:16px; height:16px;">
                                    </td>
                                    <td style="padding:12px 14px; color: var(--text-main);">${c.Codigo || '-'}</td>
                                    <td style="padding:12px 14px; color: var(--text-main);">${c.Nombre_Concepto || '-'}</td>
                                    <td style="padding:12px 14px; color: var(--text-muted);">${c.Tipo || '-'}</td>
                                    <td style="padding:12px 14px; color: var(--text-main); text-align:right;">${Number(c.Monto || 0).toFixed(2)}</td>
                                </tr>
                            `).join('') || '<tr><td colspan="5" style="padding:16px 14px; color: var(--text-muted); text-align:center;">No hay conceptos activos.</td></tr>';
                        };

                        const selectionModalHtml = `
                            <div style="display:flex; flex-direction:column; gap:18px;">
                                <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center; justify-content:space-between;">
                                    <div>
                                        <p style="margin:0; color: var(--text-muted);">Selecciona los conceptos que se aplicarán como incidencias.</p>
                                    </div>
                                    <input id="p-incidence-concept-search" type="text" placeholder="Buscar código, nombre o tipo..." style="width:260px; padding:10px 14px; border-radius:10px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                </div>
                                <div style="overflow:auto; border:1px solid var(--border-color); border-radius:12px; background: var(--card-bg); max-height:60vh;">
                                    <table style="width:100%; border-collapse:collapse; min-width:700px;">
                                        <thead>
                                            <tr style="background: rgba(255,255,255,0.03); color: var(--text-main); font-weight:700;">
                                                <th style="width:44px; text-align:left; padding:12px 14px; border-bottom:1px solid var(--border-color);"></th>
                                                <th style="text-align:left; padding:12px 14px; border-bottom:1px solid var(--border-color);">COD</th>
                                                <th style="text-align:left; padding:12px 14px; border-bottom:1px solid var(--border-color);">Concepto</th>
                                                <th style="text-align:left; padding:12px 14px; border-bottom:1px solid var(--border-color);">Tipo</th>
                                                <th style="text-align:right; padding:12px 14px; border-bottom:1px solid var(--border-color);">Monto</th>
                                            </tr>
                                        </thead>
                                        <tbody id="p-incidence-concept-selector-body"></tbody>
                                    </table>
                                </div>
                            </div>
                        `;

                        const selectionModalPromise = showModal({
                            title: 'Seleccionar conceptos de incidencia',
                            html: selectionModalHtml,
                            okText: 'Guardar conceptos',
                            cancelText: 'Cancelar',
                            modalClass: 'incidence-concept-selector-modal',
                            modalStyle: 'width:92%; max-width:900px;'
                        });

                        renderConceptSelectionTable();
                        const selectionRoot = getCurrentModalRoot();
                        const searchInput = selectionRoot?.querySelector('#p-incidence-concept-search');
                        const tableBody = selectionRoot?.querySelector('#p-incidence-concept-selector-body');

                        if (searchInput) {
                            searchInput.addEventListener('input', () => renderConceptSelectionTable(searchInput.value));
                        }

                        if (tableBody) {
                            tableBody.addEventListener('change', (event) => {
                                const target = event.target;
                                if (!(target instanceof HTMLInputElement)) return;
                                if (target.type !== 'checkbox') return;
                                const id = String(target.value);
                                if (target.checked) {
                                    tempSelectedIds.add(id);
                                } else {
                                    tempSelectedIds.delete(id);
                                }
                            });
                        }

                        const shouldSave = await selectionModalPromise;
                        if (!shouldSave) return;

                                selectedConcepts = allConcepts
                            .filter(c => tempSelectedIds.has(String(c.Id_Concepto)))
                            .map(c => ({ ...c, Auxiliar: selectedConcepts.find(sc => String(sc.Id_Concepto) === String(c.Id_Concepto))?.Auxiliar || 1 }));
                        incidenceConceptsByWorker[workerKey] = selectedConcepts;
                        try { incidenceTotalsByWorker[workerKey] = calculateIncidenceTotals(selectedConcepts, salario); } catch (e) {}
                        renderConceptsTable();
                        renderIncidenceWorkersPanel();
                    } catch (error) {
                        showError(error.message || 'Error al cargar conceptos');
                    }
                });
            }

            await modalPromise;
            // Actualizar fila específica del panel con los totales calculados
            try {
                const workerKeyAfter = String(worker.Id_Trabajador);
                const sel = incidenceConceptsByWorker[workerKeyAfter] || [];
                const salarioAfter = parseFloat(document.getElementById('p-salario')?.value || 0) || 0;
                const totalsAfter = calculateIncidenceTotals(sel, salarioAfter);
                const containerAfter = document.getElementById('p-selected-incidence-workers-container');
                if (containerAfter) {
                    const btn = containerAfter.querySelector(`button.p-incidence-load-btn[data-id="${workerKeyAfter}"]`);
                    if (btn) {
                        const row = btn.closest('tr');
                        if (row) {
                            const tds = Array.from(row.querySelectorAll('td'));
                            // columnas: 0 cedula,1 nombre,2 asignaciones,3 deducciones,4 acciones
                                if (tds[2]) tds[2].textContent = `Bs. ${Number(totalsAfter.assignments || 0).toFixed(2)}`;
                                if (tds[3]) tds[3].textContent = `Bs. -${Number(totalsAfter.deductions || 0).toFixed(2)}`;
                        }
                    }
                }
            } catch (e) { console.error(e); }
            // Forzar re-render global para asegurar consistencia
            renderIncidenceWorkersPanel();
        };

        const payrollWorkersButton = document.getElementById('p-view-payroll-workers');
        if (payrollWorkersButton) {
            payrollWorkersButton.addEventListener('click', showPayrollWorkersModal);
        }

        const incidenceWorkersButton = document.getElementById('p-select-incidence-workers');
        if (incidenceWorkersButton) {
            incidenceWorkersButton.addEventListener('click', showIncidenceWorkersModal);
        }

        const prorrateoConceptsByWorker = {};

        function getProrrateoTotalsForWorker(workerId) {
            const concepts = prorrateoConceptsByWorker[String(workerId)] || [];
            const salario = parseFloat(salaryInput.value) || 0;
            const w = workers.find(x => String(x.Id_Trabajador) === String(workerId));
            const sal = w ? parseFloat(w.Sueldo_Mensual || salario) : salario;

            // Paso 1: asignaciones brutas
            let asig = 0;
            concepts.forEach(c => {
                if (String(c.Tipo || '').toLowerCase() !== 'deducción') {
                    const qty = Math.max(1, Number(c.aux_qty || 1));
                    asig += getConceptAmount(c, sal, 0) * qty;
                }
            });
            // Paso 2: deducciones
            let dedu = 0;
            concepts.forEach(c => {
                if (String(c.Tipo || '').toLowerCase() === 'deducción') {
                    const qty = Math.max(1, Number(c.aux_qty || 1));
                    dedu += getConceptAmount(c, sal, asig) * qty;
                }
            });
            return { asig, dedu };
        }

        function renderProrrateoConceptsPanel(workerId, container, allConcepts, onUpdate) {
            const concepts = prorrateoConceptsByWorker[String(workerId)] || [];
            const w = workers.find(x => String(x.Id_Trabajador) === String(workerId));
            const sal = w ? parseFloat(w.Sueldo_Mensual || 0) : (parseFloat(salaryInput.value) || 0);

            // Calcular bruto para mostrar en deducciones porcentuales
            let bruto = 0;
            concepts.forEach(c => {
                if (String(c.Tipo || '').toLowerCase() !== 'deducción') {
                    bruto += getConceptAmount(c, sal, 0) * Math.max(1, Number(c.aux_qty || 1));
                }
            });

            if (!concepts.length) {
                container.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:18px 0; margin:0;">No hay conceptos cargados para este trabajador.</p>';
                return;
            }
            container.innerHTML = concepts.map((c, idx) => {
                const monto = getConceptAmount(c, sal, bruto) * Math.max(1, Number(c.aux_qty || 1));
                const isDedu = String(c.Tipo || '').toLowerCase() === 'deducción';
                return `<div style="display:flex; align-items:center; justify-content:space-between; padding:9px 12px; border-bottom:1px solid var(--border-color); gap:10px; font-size:0.92rem;">
                    <div style="flex:1; min-width:0;">
                        <span style="font-weight:600; color:var(--text-main);">${c.Nombre_Concepto || ''}</span>
                        <span style="color:var(--text-muted); font-size:0.83rem; margin-left:6px;">(${c.aux_qty || 1} Unid.)</span>
                    </div>
                    <span style="color:${isDedu ? '#f87171' : '#4ade80'}; font-weight:700; white-space:nowrap;">${isDedu ? '- ' : '+ '}Bs. ${monto.toFixed(2)}</span>
                    <button data-pidx="${idx}" class="prr-rm-concept" style="background:none; border:none; color:#f87171; cursor:pointer; font-size:1.1rem; padding:0 4px;" title="Quitar">✖</button>
                </div>`;
            }).join('');

            container.querySelectorAll('.prr-rm-concept').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = parseInt(btn.dataset.pidx);
                    const list = prorrateoConceptsByWorker[String(workerId)] || [];
                    list.splice(idx, 1);
                    prorrateoConceptsByWorker[String(workerId)] = list;
                    renderProrrateoConceptsPanel(workerId, container, allConcepts, onUpdate);
                    if (typeof onUpdate === 'function') onUpdate();
                });
            });
        }

        const showProrrateoConceptsModal = async (w) => {
            const wId = String(w.Id_Trabajador);
            if (!prorrateoConceptsByWorker[wId]) prorrateoConceptsByWorker[wId] = [];

            const modalHtml = `
                <div style="display:flex; flex-direction:column; gap:16px;">
                    <div style="background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.25); border-radius:10px; padding:12px 16px; font-size:0.9rem; color:var(--text-main);">
                        <strong style="color:#f59e0b;">Trabajador:</strong> ${w.Nombre_Completo || ''} ${w.Apellidos || ''} &nbsp;|&nbsp;
                        <strong style="color:#f59e0b;">Cédula:</strong> ${w.Documento_Identidad || ''} &nbsp;|&nbsp;
                        <strong style="color:#f59e0b;">Ingresó:</strong> ${w.Fecha_de_Ingreso || ''}
                    </div>
                    <div style="display:flex; gap:12px; align-items:flex-end; margin-bottom:5px;">
                        <div style="flex:2; min-width:160px;">
                            <label style="display:block; font-weight:600; margin-bottom:6px; color:var(--text-muted); font-size:0.88em;">Concepto <span style="color:#e74c3c;">*</span></label>
                            <select id="prr-concept-sel" style="width:100%; padding:9px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-color); color:var(--text-main); font-size:0.92rem;">
                                <option value="">Seleccionar...</option>
                                ${(allConcepts || []).map(c => `<option value="${c.Id_Concepto}">${c.Nombre_Concepto} (${c.Tipo})</option>`).join('')}
                            </select>
                        </div>
                        <div style="flex:1; min-width:80px;">
                            <label style="display:block; font-weight:600; margin-bottom:6px; color:var(--text-muted); font-size:0.88em;">Cantidad</label>
                            <input type="number" id="prr-concept-qty" value="1" min="1" step="0.5"
                                style="width:100%; padding:9px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-color); color:var(--text-main); font-size:0.92rem;">
                        </div>
                        <div style="flex-shrink:0;">
                            <button id="prr-concept-add" type="button" class="primary"
                                style="height:38px; padding:0 18px; border-radius:8px; font-weight:700; cursor:pointer; white-space:nowrap;">
                                + Agregar
                            </button>
                        </div>
                    </div>
                    <div id="prr-concepts-list" style="min-height:80px; border:1px solid var(--border-color); border-radius:10px; overflow:hidden; background:var(--card-bg);"></div>
                    <div id="prr-totals-bar" style="display:flex; gap:18px; justify-content:flex-end; padding:10px 14px; background:rgba(245,158,11,0.06); border-radius:10px; font-size:0.92rem; font-weight:600;">
                        <span>Asignaciones: <span id="prr-t-asig" style="color:#4ade80;">Bs. 0.00</span></span>
                        <span>Deducciones: <span id="prr-t-dedu" style="color:#f87171;">Bs. 0.00</span></span>
                    </div>
                </div>
            `;

            const refreshTotals = () => {
                const t = getProrrateoTotalsForWorker(wId);
                const asigEl = document.getElementById('prr-t-asig');
                const deduEl = document.getElementById('prr-t-dedu');
                if (asigEl) asigEl.textContent = `Bs. ${t.asig.toFixed(2)}`;
                if (deduEl) deduEl.textContent = `Bs. ${t.dedu.toFixed(2)}`;
            };

            const modalPromise = showModal({
                title: `Prorratear conceptos — ${w.Nombre_Completo || ''} ${w.Apellidos || ''}`,
                html: modalHtml,
                okText: 'Listo',
                modalStyle: 'max-width:680px; width:97%;'
            });

            // Wire after render
            setTimeout(() => {
                const listContainer = document.getElementById('prr-concepts-list');
                if (listContainer) {
                    renderProrrateoConceptsPanel(wId, listContainer, allConcepts, refreshTotals);
                }
                refreshTotals();

                const addBtn = document.getElementById('prr-concept-add');
                if (addBtn) {
                    addBtn.addEventListener('click', () => {
                        const sel = document.getElementById('prr-concept-sel');
                        const qtyInput = document.getElementById('prr-concept-qty');
                        const cid = sel ? sel.value : '';
                        const qty = parseFloat(qtyInput ? qtyInput.value : 1) || 1;
                        if (!cid) return;
                        const found = (allConcepts || []).find(c => String(c.Id_Concepto) === String(cid));
                        if (!found) return;
                        const list = prorrateoConceptsByWorker[wId] || [];
                        const existing = list.findIndex(c => String(c.Id_Concepto) === String(cid));
                        if (existing >= 0) {
                            list[existing].aux_qty = qty;
                        } else {
                            const copy = Object.assign({}, found);
                            copy.aux_qty = qty;
                            list.push(copy);
                        }
                        prorrateoConceptsByWorker[wId] = list;
                        if (listContainer) renderProrrateoConceptsPanel(wId, listContainer, allConcepts, refreshTotals);
                        refreshTotals();
                        if (sel) sel.value = '';
                        if (qtyInput) qtyInput.value = 1;
                    });
                }
            }, 50);

            await modalPromise;
        };

        const prorrateoBtn = document.getElementById('btn-prorrateos');
        if (prorrateoBtn) {
            const renderProrrateoModal = () => {
                const prorrateoList = getProrrateoWorkers();
                const periodValue = periodSelect.value;
                const dates = getPeriodDates(periodValue);

                const buildTableRows = () => prorrateoList.length === 0
                    ? `<tr><td colspan="6" style="padding:16px 14px; color:var(--text-muted);">No hay trabajadores en prorrateo.</td></tr>`
                    : prorrateoList.map(w => {
                        const wId = String(w.Id_Trabajador);
                        const t = getProrrateoTotalsForWorker(wId);
                        return `<tr style="border-bottom:1px solid var(--border-color);" data-wid="${wId}">
                            <td style="padding:11px 12px; color:var(--text-main); white-space:nowrap;">${w.Documento_Identidad || '-'}</td>
                            <td style="padding:11px 12px; color:var(--text-main);">${w.Nombre_Completo || ''} ${w.Apellidos || ''}</td>
                            <td style="padding:11px 12px; color:#f59e0b; font-weight:600; white-space:nowrap;">${w.Fecha_de_Ingreso || '-'}</td>
                            <td style="padding:11px 12px; color:#4ade80; font-weight:600; text-align:right; white-space:nowrap;" id="prr-asig-${wId}">Bs. ${t.asig.toFixed(2)}</td>
                            <td style="padding:11px 12px; color:#f87171; font-weight:600; text-align:right; white-space:nowrap;" id="prr-dedu-${wId}">Bs. ${t.dedu.toFixed(2)}</td>
                            <td style="padding:11px 12px; text-align:center; white-space:nowrap;">
                                <button class="btn-prorratear-worker" data-wid="${wId}"
                                    style="padding:7px 12px; border-radius:8px; background:linear-gradient(135deg,#f59e0b,#d97706); color:white; border:none; font-weight:700; font-size:0.82rem; cursor:pointer; white-space:nowrap;">
                                    ⚖ Prorratear conceptos base
                                </button>
                            </td>
                        </tr>`;
                    }).join('');

                const modalHtml = `
                    <div style="display:flex; flex-direction:column; gap:16px;">
                        <div style="background:rgba(245,158,11,0.09); border:1px solid rgba(245,158,11,0.3); border-radius:10px; padding:14px 16px; color:var(--text-main); font-size:0.93rem; display:flex; gap:10px; align-items:flex-start;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.2" style="flex-shrink:0; margin-top:1px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            <div>
                                <strong style="color:#f59e0b;">Trabajadores en prorrateo</strong><br>
                                Estos trabajadores ingresaron dentro del rango del periodo (después de <strong>${dates.start || '—'}</strong> y antes o en <strong>${dates.end || '—'}</strong>).
                                Aparecen en la nómina e incidencias, pero <strong>no</strong> se cuentan en "Trabajadores en nómina" de los conceptos base.
                            </div>
                        </div>
                        <div style="overflow:auto; border:1px solid var(--border-color); border-radius:12px; background:var(--card-bg);">
                            <table id="prr-main-table" style="width:100%; border-collapse:collapse; min-width:720px;">
                                <thead>
                                    <tr style="background:rgba(245,158,11,0.06); color:var(--text-main); font-weight:700;">
                                        <th style="text-align:left; padding:12px 12px; border-bottom:1px solid var(--border-color);">Cédula</th>
                                        <th style="text-align:left; padding:12px 12px; border-bottom:1px solid var(--border-color);">Nombre completo</th>
                                        <th style="text-align:left; padding:12px 12px; border-bottom:1px solid var(--border-color);">Fecha de ingreso</th>
                                        <th style="text-align:right; padding:12px 12px; border-bottom:1px solid var(--border-color);">Asignaciones (P)</th>
                                        <th style="text-align:right; padding:12px 12px; border-bottom:1px solid var(--border-color);">Deducciones (P)</th>
                                        <th style="text-align:center; padding:12px 12px; border-bottom:1px solid var(--border-color);">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="prr-main-tbody">
                                    ${buildTableRows()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;

                showModal({
                    title: `Prorrateos (${prorrateoList.length})`,
                    html: modalHtml,
                    okText: 'Cerrar',
                    modalStyle: 'max-width:900px; width:98%;'
                }).then(() => {});

                // Attach listeners after DOM renders
                setTimeout(() => {
                    document.querySelectorAll('.btn-prorratear-worker').forEach(btn => {
                        btn.addEventListener('click', async () => {
                            const wId = btn.dataset.wid;
                            const w = prorrateoList.find(x => String(x.Id_Trabajador) === String(wId));
                            if (!w) return;
                            await showProrrateoConceptsModal(w);
                            // After sub-modal closes, refresh totals in main table
                            const t = getProrrateoTotalsForWorker(String(w.Id_Trabajador));
                            const asigEl = document.getElementById(`prr-asig-${w.Id_Trabajador}`);
                            const deduEl = document.getElementById(`prr-dedu-${w.Id_Trabajador}`);
                            if (asigEl) asigEl.textContent = `Bs. ${t.asig.toFixed(2)}`;
                            if (deduEl) deduEl.textContent = `Bs. ${t.dedu.toFixed(2)}`;
                            updateTotals();
                        });
                    });
                }, 50);
            };

            prorrateoBtn.addEventListener('click', renderProrrateoModal);
        }

        // Show intro selection screen before showing the payroll form
        const showPayrollIntro = () => {
            // hide form initially (use local query to avoid TDZ issues)
            const formElLocal = document.querySelector('.payroll-form');
            if (formElLocal) formElLocal.style.display = 'none';
            let intro = document.getElementById('pay-create-intro');
            if (!intro) {
                intro = document.createElement('div');
                intro.id = 'pay-create-intro';
                intro.style.marginBottom = '18px';
                intro.innerHTML = `
                    <div style="background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent); border:1px solid var(--border-color); padding:28px; border-radius:12px; display:flex; gap:18px; align-items:center; justify-content:space-between;">
                        <div style="flex:1;">
                            <h3 style="margin:0 0 6px 0; color:var(--text-main);">Procesar Nómina</h3>
                            <p style="margin:0; color:var(--text-muted);">Seleccione el tipo de nómina para filtrar los trabajadores disponibles.</p>
                        </div>
                        <div style="display:flex; gap:12px;">
                            <button data-type="Semanal" class="pay-intro-btn" style="padding:12px 18px; border-radius:10px; background:linear-gradient(135deg, #2bcbba, #14a085); color:white; border:none; font-weight:700; cursor:pointer;">Nómina semanal</button>
                            <button data-type="Quincenal" class="pay-intro-btn" style="padding:12px 18px; border-radius:10px; background:linear-gradient(135deg, #5a9bf6, #2d6cdf); color:white; border:none; font-weight:700; cursor:pointer;">Nómina quincenal</button>
                            <button data-type="Todos" class="pay-intro-btn" style="padding:12px 18px; border-radius:10px; background:transparent; border:1px solid var(--border-color); color:var(--text-main); font-weight:700; cursor:pointer;">Todos los trabajadores</button>
                        </div>
                    </div>
                `;
                formElLocal && formElLocal.parentNode.insertBefore(intro, formElLocal);
                // attach handlers
                intro.querySelectorAll('.pay-intro-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const t = btn.dataset.type || 'Todos';
                        selectedPayrollType = t;
                        incidenceWorkers = [];
                        populateWorkerSelect(t);
                        populatePeriodsForPayrollType(t);
                        const payrollTypeText = t === 'Todos' ? 'Todos los trabajadores' : `Nómina ${t.toLowerCase()}`;
                        const payrollBanner = document.getElementById('p-selected-payroll-banner');
                        const workerRow = document.getElementById('p-worker-row');
                        const selectedPayrollTypeEl = document.getElementById('p-selected-payroll-type');
                        const selectedPayrollCount = document.getElementById('p-selected-payroll-count');
                        const filteredWorkers = (workers || []).filter(w => {
                            if (t === 'Todos') return true;
                            return String(w.Frecuencia || '').toLowerCase() === String(t).toLowerCase();
                        });
                        if (selectedPayrollTypeEl) selectedPayrollTypeEl.textContent = payrollTypeText;
                        if (selectedPayrollCount) selectedPayrollCount.textContent = `${filteredWorkers.length} trabajador${filteredWorkers.length === 1 ? '' : 'es'} activo${filteredWorkers.length === 1 ? '' : 's'}`;
                        if (payrollBanner) payrollBanner.style.display = 'block';
                        if (workerRow) workerRow.style.display = 'none';
                        renderIncidenceWorkersPanel();
                        updateTotals();
                        // remove intro and show form
                        intro.remove();
                        if (formElLocal) formElLocal.style.display = 'block';
                        formElLocal && formElLocal.scrollIntoView({ behavior: 'smooth' });
                    });
                });
            } else {
                intro.style.display = 'block';
            }
        };

        // show intro by default when loading the module
        showPayrollIntro();

        document.getElementById('p-worker').addEventListener('change', (e) => {
            addedConcepts.length = 0; // Limpiar lista al cambiar trabajador
            const w = workers.find(x => String(x.Id_Trabajador) === String(e.target.value));
            if (w) {
                salaryInput.value = w.Sueldo_Mensual || 130;
                populatePeriodsForWorker(w);
            } else {
                populatePeriodsForPayrollType(selectedPayrollType || 'Todos');
            }
            validateWorkerHireDate();
            triggerMandatoryConcepts();
            updateTotals();
        });

        yearSelect.addEventListener('change', () => {
            // Si hay trabajador seleccionado, repoblar períodos para el nuevo año
            const workerId = document.getElementById('p-worker').value;
            const w = workers.find(x => String(x.Id_Trabajador) === String(workerId));
            if (w) {
                populatePeriodsForWorker(w);
            } else {
                populatePeriodsForPayrollType(selectedPayrollType || 'Todos');
            }
            updatePeriodDates();
        });
        document.getElementById('p-periodo').addEventListener('change', () => {
            // Clear inline error as soon as user picks a period
            clearInlineError(document.getElementById('p-periodo'));
            validateWorkerHireDate();
            triggerMandatoryConcepts();
            updateTotals();
        });

        addBtn.addEventListener('click', () => {
            const cid = conceptSelect.value;
            const qty = parseFloat(document.getElementById('p-concept-qty').value) || 1;
            if (!cid) return;
            const concept = JSON.parse(JSON.stringify(allConcepts.find(c => String(c.Id_Concepto) === String(cid))));
            if (concept) {
                const existingIndex = addedConcepts.findIndex(c => String(c.Id_Concepto) == String(cid));
                if (existingIndex >= 0) {
                    addedConcepts[existingIndex].aux = `${qty} Unid.`;
                } else {
                    concept.aux = `${qty} Unid.`;
                    addedConcepts.push(concept);
                }
                renderAddedConcepts(addedConcepts, updateTotals);
                updateTotals();
                // Clear inline error shown when no concept added
                clearInlineError(document.getElementById('p-add-concept'));
            }
        });

        salaryInput.addEventListener('input', updateTotals);

        generateBtn.addEventListener('click', async () => {
            generateBtn.disabled = true;
            const workerId = document.getElementById('p-worker').value;
            const selectedWorkers = selectedPayrollType
                ? getEligiblePayrollWorkers(selectedPayrollType)
                : (workerId ? [(workers || []).find(x => String(x.Id_Trabajador) === String(workerId))].filter(Boolean) : []);

            if (!selectedWorkers.length) {
                generateBtn.disabled = false;
                return showError('No hay trabajadores activos para esta nómina seleccionada.');
            }

            const salario = parseFloat(salaryInput.value) || 0;
            const fecha = document.getElementById('p-fecha').value;
            const periodo = document.getElementById('p-periodo').value;
            const periodoLabel = document.getElementById('p-periodo').selectedOptions[0]?.textContent || `${periodo} ${yearSelect.value}`;
            const dates = getPeriodDates(periodo);

            // Validar que se haya seleccionado un periodo
            if (!periodo) {
                generateBtn.disabled = false;
                showInlineError(document.getElementById('p-periodo'), 'Seleccione un período.');
                return showError('Seleccione un período.');
            }

            // Validar que exista al menos un concepto agregado (sólo si no es nómina por lote, o si hay conceptos base definidos)
            if ((!addedConcepts || addedConcepts.length === 0) && !selectedPayrollType) {
                generateBtn.disabled = false;
                showInlineError(document.getElementById('p-add-concept'), 'Agregue al menos un concepto.');
                return showError('Agregue al menos un concepto.');
            }

            if (!fecha) {
                generateBtn.disabled = false;
                return showError('Indique la fecha de pago');
            }

            // Validación: Salario Base mínimo 130
            if (!validateSalary()) {
                generateBtn.disabled = false;
                return showError('El salario base no puede ser menor a 130 bs.');
            }

            // Validación: Fecha de Pago > Periodo Fin
            if (!validatePaymentDate()) {
                generateBtn.disabled = false;
                return showError('La fecha de pago debe ser futura al periodo a pagar');
            }

            // Validación: Fecha de ingreso del trabajador (si hay trabajador individual seleccionado)
            if (workerId && !validateWorkerHireDate()) {
                generateBtn.disabled = false;
                return showError('No se puede procesar el pago porque la fecha de ingreso del trabajador es posterior al período seleccionado');
            }

            const confirmed = await showConfirm(`¿Está seguro de procesar los pagos para esta nómina?`);
            if (!confirmed) {
                generateBtn.disabled = false;
                return;
            }

            let payloadData;
            if (selectedPayrollType) {
                // Batch submission
                let totalNetoBatch = 0;
                const recibos = selectedWorkers.map(w => {
                    const isProrrateo = getProrrateoWorkers().some(pw => String(pw.Id_Trabajador) === String(w.Id_Trabajador));
                    const sal = parseFloat(w.Sueldo_Mensual) || salario;

                    // 1. Gather all concepts
                    const rawConcepts = [];
                    if (isProrrateo) {
                        const pConcepts = prorrateoConceptsByWorker[String(w.Id_Trabajador)] || [];
                        pConcepts.forEach(c => {
                            rawConcepts.push({ ...c });
                        });
                    } else {
                        addedConcepts.forEach(c => {
                            rawConcepts.push({ ...c });
                        });
                    }

                    const incConcepts = incidenceConceptsByWorker[String(w.Id_Trabajador)] || [];
                    incConcepts.forEach(c => {
                        rawConcepts.push({ ...c });
                    });

                    // 2. Two-pass calculation of amounts
                    let asig = 0;
                    const calculatedConcepts = [];

                    // Pass 1: Asignaciones
                    rawConcepts.forEach(c => {
                        if (c.Tipo !== 'Deducción') {
                            const mu = getConceptAmount(c, sal, 0);
                            let q = 1;
                            const auxVal = c.aux || c.Auxiliar || c.aux_qty || '';
                            if (auxVal && String(auxVal).match(/(\d+(\.\d+)?)/)) {
                                q = parseFloat(String(auxVal).match(/(\d+(\.\d+)?)/)[0]);
                            }
                            const total = mu * q;
                            asig += total;
                            calculatedConcepts.push({
                                ...c,
                                Monto_Unitario: mu,
                                Cantidad: q,
                                Monto: total
                            });
                        }
                    });

                    // Pass 2: Deducciones
                    rawConcepts.forEach(c => {
                        if (c.Tipo === 'Deducción') {
                            const mu = getConceptAmount(c, sal, asig);
                            let q = 1;
                            const auxVal = c.aux || c.Auxiliar || c.aux_qty || '';
                            if (auxVal && String(auxVal).match(/(\d+(\.\d+)?)/)) {
                                q = parseFloat(String(auxVal).match(/(\d+(\.\d+)?)/)[0]);
                            }
                            const total = mu * q;
                            calculatedConcepts.push({
                                ...c,
                                Monto_Unitario: mu,
                                Cantidad: q,
                                Monto: total
                            });
                        }
                    });

                    const workerTotalAsig = calculatedConcepts.reduce((sum, c) => c.Tipo !== 'Deducción' ? sum + c.Monto : sum, 0);
                    const workerTotalDedu = calculatedConcepts.reduce((sum, c) => c.Tipo === 'Deducción' ? sum + c.Monto : sum, 0);
                    const workerNeto = workerTotalAsig - workerTotalDedu;

                    totalNetoBatch += workerNeto;

                    return {
                        trabajadorId: w.Id_Trabajador,
                        trabajador: `${w.Nombre_Completo} ${w.Apellidos}`,
                        cedula: w.Documento_Identidad,
                        salarioBase: sal,
                        neto: workerNeto,
                        conceptos: calculatedConcepts
                    };
                });

                payloadData = {
                    fechaPago: fecha,
                    periodo: periodoLabel,
                    fechaInicio: dates.start,
                    fechaFin: dates.end,
                    salarioBase: salario,
                    neto: totalNetoBatch,
                    isBatch: true,
                    tipoNomina: selectedPayrollType,
                    recibos: recibos
                };
            } else {
                // Single worker submission (legacy)
                let asig = 0, dedu = 0;
                addedConcepts.forEach(c => {
                    if (c.Tipo !== 'Deducción') {
                        const mu = getConceptAmount(c, salario);
                        let q = 1;
                        if (c.aux && String(c.aux).match(/(\d+(\.\d+)?)/)) q = parseFloat(String(c.aux).match(/(\d+(\.\d+)?)/)[0]);
                        asig += (mu * q);
                    }
                });
                addedConcepts.forEach(c => {
                    if (c.Tipo === 'Deducción') {
                        const mu = getConceptAmount(c, salario, asig);
                        let q = 1;
                        if (c.aux && String(c.aux).match(/(\d+(\.\d+)?)/)) q = parseFloat(String(c.aux).match(/(\d+(\.\d+)?)/)[0]);
                        dedu += (mu * q);
                    }
                });
                const netoFinal = asig - dedu;

                const w = selectedWorkers[0];
                payloadData = {
                    fechaPago: fecha,
                    periodo: periodoLabel,
                    fechaInicio: dates.start,
                    fechaFin: dates.end,
                    salarioBase: salario,
                    neto: netoFinal,
                    trabajadorId: w.Id_Trabajador,
                    trabajador: `${w.Nombre_Completo} ${w.Apellidos}`,
                    cedula: w.Documento_Identidad,
                    conceptos: addedConcepts.map(c => {
                        const mu = getConceptAmount(c, salario, asig);
                        let q = 1;
                        if (c.aux) {
                            const match = String(c.aux).match(/(\d+(\.\d+)?)/);
                            if (match) q = parseFloat(match[0]);
                        }
                        return {
                            ...c,
                            Monto: mu,
                            Monto_Unitario: mu,
                            Cantidad: q
                        };
                    })
                };
            }

            const payload = { data: payloadData };

            try {
                await safePost('/payroll/pay', payload);
                showSuccess('Recibos generados con éxito');
                renderPayrollPayment();
            } catch (e) {
                showError(e.message);
            } finally {
                generateBtn.disabled = false;
            }
        });

        // Admin: Pestañas para Crear / Ver recibos
        const payTabCrearBtn = document.getElementById('pay-tab-crear-btn');
        const payTabVerBtn = document.getElementById('pay-tab-ver-btn');
        const historyContainer = document.getElementById('admin-payslips-history');
        const payrollFormEl = document.querySelector('.payroll-form');

        // Add a small "Escoger nómina a procesar." button inside payroll form to reopen the intro
        if (payrollFormEl) {
            let backBtn = payrollFormEl.querySelector('#payback-to-intro');
            if (!backBtn) {
                backBtn = document.createElement('button');
                backBtn.id = 'payback-to-intro';
                backBtn.type = 'button';
                backBtn.textContent = 'Escoger nómina a procesar.';
                backBtn.style.cssText = 'display:inline-block; margin-bottom:12px; padding:8px 12px; border-radius:8px; background:transparent; border:1px solid rgba(255,255,255,0.04); color:var(--text-muted); cursor:pointer; font-weight:600;';
                payrollFormEl.insertBefore(backBtn, payrollFormEl.firstChild);
                backBtn.addEventListener('click', (e) => {
                    const payrollBanner = document.getElementById('p-selected-payroll-banner');
                    const workerRow = document.getElementById('p-worker-row');
                    if (payrollBanner) payrollBanner.style.display = 'none';
                    if (workerRow) workerRow.style.display = 'block';
                    selectedPayrollType = '';
                    incidenceWorkers = [];
                    renderIncidenceWorkersPanel();
                    showPayrollIntro();
                });
            }
        }

        async function renderAdminPayslips(list) {
            if (!historyContainer) return;
            if (!list || !list.length) {
                historyContainer.innerHTML = '<div style="padding:20px; color:var(--text-muted);">No hay recibos para mostrar.</div>';
                historyContainer.style.display = 'block';
                return;
            }

            const selectedIds = new Set();

            const isRowReversible = (r) => {
                const refTime = r.published_at || r.annulled_at || null;
                if (!refTime) return false;
                const diffMs = Date.now() - new Date(refTime).getTime();
                return diffMs >= 0 && diffMs < 24 * 60 * 60 * 1000;
            };

            const getSelectedRows = () => {
                return list.filter(r => selectedIds.has(String(r.id)));
            };

            const updateBulkControls = () => {
                const selected = getSelectedRows();
                const bulkApproveBtn = historyContainer.querySelector('#admin-history-bulk-approve');
                const bulkAnnulBtn = historyContainer.querySelector('#admin-history-bulk-annul');
                const bulkRevertBtn = historyContainer.querySelector('#admin-history-bulk-revert');
                const selectedCount = selected.length;

                if (!bulkApproveBtn || !bulkAnnulBtn || !bulkRevertBtn) return;

                if (!selectedCount) {
                    bulkApproveBtn.style.display = 'none';
                    bulkAnnulBtn.style.display = 'none';
                    bulkRevertBtn.style.display = 'none';
                    return;
                }

                const allPending = selected.every(r => (r.status || 'Pendiente') === 'Pendiente');
                const allReversible = selected.every(r => ['Publicado', 'Anulado'].includes(r.status) && isRowReversible(r));

                if (allPending) {
                    bulkApproveBtn.style.display = 'inline-flex';
                    bulkAnnulBtn.style.display = 'inline-flex';
                    bulkRevertBtn.style.display = 'none';
                } else if (allReversible) {
                    bulkApproveBtn.style.display = 'none';
                    bulkAnnulBtn.style.display = 'none';
                    bulkRevertBtn.style.display = 'inline-flex';
                } else {
                    bulkApproveBtn.style.display = 'none';
                    bulkAnnulBtn.style.display = 'none';
                    bulkRevertBtn.style.display = 'none';
                }
            };

            const renderRowHtml = (r) => {
                const statusLabel = r.status || 'Pendiente';
                const statusColor = statusLabel === 'Publicado' ? 'var(--success-color)' : (statusLabel === 'Anulado' ? 'var(--error-color)' : '#f39c12');
                const isPending = statusLabel === 'Pendiente';

                const refTime = r.published_at || r.annulled_at || null;
                let reversible = false;
                let remainingLabel = '';
                if (refTime) {
                    try {
                        const refDate = new Date(refTime);
                        const diffMs = Date.now() - refDate.getTime();
                        reversible = diffMs >= 0 && diffMs < (24 * 60 * 60 * 1000);
                        if (reversible) {
                            const remainingMs = (24 * 60 * 60 * 1000) - diffMs;
                            const hours = Math.floor(remainingMs / (60 * 60 * 1000));
                            const mins = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
                            remainingLabel = `${hours}h ${mins}m`;
                        }
                    } catch (e) { reversible = false; }
                }

                const actionButtons = isPending ? `
                        <button class="btn-approve-pay primary small" data-id="${r.id}" style="padding:8px 14px; border-radius:8px; background:var(--success-color); color:white; border:none; cursor:pointer; min-width:110px;">Aprobar</button>
                        <button class="btn-annul-pay secondary small" data-id="${r.id}" style="padding:8px 14px; border-radius:8px; background:#e74c3c; color:white; border:none; cursor:pointer; min-width:110px;">Anular</button>
                    ` : `
                        <button class="btn-revert-pay" data-id="${r.id}" ${reversible ? '' : 'disabled'} title="Revertir a Pendiente (disponible 24 horas)" style="padding:8px 14px; border-radius:8px; background:${reversible ? '#f0f0f0' : '#95a5a6'}; color:${reversible ? '#2c3e50' : '#666'}; border:1px solid rgba(0,0,0,0.06); cursor:pointer; min-width:110px;">Revertir</button>
                        ${reversible ? `<span style="font-size:0.82em; color: var(--text-muted); margin-left:4px;">Expira en ${remainingLabel}</span>` : ''}
                    `;

                const checked = selectedIds.has(String(r.id)) ? 'checked' : '';

                let previewButtonHtml = '';
                if (r.isBatch) {
                    const recibosDataStr = encodeURIComponent(JSON.stringify(r.recibos || []));
                    previewButtonHtml = `<button class="primary btn-preview-batch" data-id="${r.id}" data-recibos="${recibosDataStr}" style="padding: 8px 18px; border-radius: 8px; font-weight:600; background: var(--primary); color: white; border:none; cursor:pointer;">Previsualizar recibos</button>`;
                } else {
                    previewButtonHtml = `<a class="primary" href="${window.adminApiPrefix || '/administrativo'}/payroll/payslip/${r.id}" target="_blank" rel="noopener" style="text-decoration: none; padding: 8px 18px; border-radius: 8px; font-weight:600; background: var(--primary); color: white; display:inline-block;">Previsualizar recibo</a>`;
                }

                return `
                <tr style="border-bottom:1px solid var(--border-color);">
                    <td style="padding:10px; text-align:center;">
                        <input class="admin-history-select-row" type="checkbox" data-id="${r.id}" ${checked} style="width:18px; height:18px; cursor:pointer;">
                    </td>
                    <td style="padding:10px; text-align:center;">${r.tipoNomina || '-'}</td>
                    <td style="padding:10px; text-align:center;">${(new Date(r.fechaPago)).toLocaleDateString('es-VE')}</td>
                    <td style="padding:10px; text-align:center;">${r.periodo}</td>
                    <td style="padding:10px; text-align:right; font-family:monospace;">Bs. ${parseFloat(r.neto || 0).toFixed(2)}</td>
                    <td style="padding:10px; text-align:center;">${previewButtonHtml}</td>
                    <td style="padding:10px; text-align:center;">
                        <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap; align-items:center;">
                            ${actionButtons}
                        </div>
                    </td>
                    <td style="padding:10px; text-align:center;">
                        <span style="display:inline-block; padding:6px 12px; border-radius:999px; font-size:0.85em; font-weight:700; background:${statusColor}; color:white; min-width:100px;">
                            ${statusLabel}
                        </span>
                    </td>
                </tr>
            `;
            };

            let historyPage = 1;

            historyContainer.innerHTML = `
                <div style="background: var(--card-bg); border-radius:10px; border:1px solid var(--border-color); padding:18px;">
                    <div style="display:grid; gap:14px; margin-bottom:18px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
                        <div style="display:flex; flex-direction:column; gap:6px;">
                            <label style="font-weight:600; color: var(--text-main);">Buscar</label>
                            <input id="admin-history-search" type="text" placeholder="Cédula, trabajador o periodo" style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:10px; background: var(--bg-color); color: var(--text-main);">
                        </div>
                        <div style="display:flex; flex-direction:column; gap:6px;">
                            <label style="font-weight:600; color: var(--text-main);">Tipo de nómina</label>
                            <select id="admin-history-type" style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:10px; background: var(--bg-color); color: var(--text-main);">
                                <option value="">Todos</option>
                                <option value="Semanal">Nómina semanal</option>
                                <option value="Quincenal">Nómina quincenal</option>
                            </select>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:6px;">
                            <label style="font-weight:600; color: var(--text-main);">Estatus</label>
                            <select id="admin-history-status" style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:10px; background: var(--bg-color); color: var(--text-main);">
                                <option value="">Todos</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Publicado">Publicado</option>
                                <option value="Anulado">Anulado</option>
                            </select>
                        </div>
                    </div>
                    <div style="overflow-x:auto;">
                        <table style="width:100%; border-collapse:collapse; min-width:940px;">
                            <thead>
                                <tr style="background:var(--primary); color:white;">
                                    <th style="padding:10px; text-align:center; width:42px;"> 
                                        <input id="admin-history-select-all" type="checkbox" style="width:18px; height:18px; cursor:pointer;">
                                    </th>
                                    <th style="padding:10px; text-align:center;">Tipo de nómina</th>
                                    <th style="padding:10px; text-align:center;">Fecha de pago</th>
                                    <th style="padding:10px; text-align:center;">Período</th>
                                    <th style="padding:10px; text-align:right;">Monto neto</th>
                                    <th style="padding:10px; text-align:center;">Visualización</th>
                                    <th style="padding:10px; text-align:center;">Acciones</th>
                                    <th style="padding:10px; text-align:center;">Estatus</th>
                                </tr>
                            </thead>
                            <tbody id="admin-history-table-body"></tbody>
                        </table>
                    </div>
                    <div id="admin-history-pagination"></div>
                    <div id="admin-history-bulk-actions" style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:12px; margin-top:18px;">
                        <div style="color:var(--text-muted); font-size:0.92em;">Recibos seleccionados: <span id="admin-history-selected-count">0</span></div>
                        <div style="display:flex; gap:10px; flex-wrap:wrap;">
                            <button id="admin-history-bulk-approve" style="display:none; padding:10px 16px; border-radius:10px; border:none; background:var(--success-color); color:white; cursor:pointer; font-weight:700;">Aprobar todos</button>
                            <button id="admin-history-bulk-annul" style="display:none; padding:10px 16px; border-radius:10px; border:none; background:#e74c3c; color:white; cursor:pointer; font-weight:700;">Anular todos</button>
                            <button id="admin-history-bulk-revert" style="display:none; padding:10px 16px; border-radius:10px; border:none; background:#f39c12; color:white; cursor:pointer; font-weight:700;">Revertir todos</button>
                        </div>
                    </div>
                    <div id="admin-history-bulk-progress" style="display:none; width:100%; height:10px; background:rgba(255,255,255,0.08); border-radius:10px; overflow:hidden; margin-top:10px;">
                        <div id="admin-history-bulk-progress-bar" style="width:0%; height:100%; background:var(--success-color); transition:width 0.24s ease;"></div>
                    </div>
                </div>
            `;

            const searchInput = historyContainer.querySelector('#admin-history-search');
            const typeSelect = historyContainer.querySelector('#admin-history-type');
            const statusSelect = historyContainer.querySelector('#admin-history-status');
            const tableBody = historyContainer.querySelector('#admin-history-table-body');
            const selectedCount = historyContainer.querySelector('#admin-history-selected-count');
            const selectAllCheckbox = historyContainer.querySelector('#admin-history-select-all');
            const bulkApproveBtn = historyContainer.querySelector('#admin-history-bulk-approve');
            const bulkAnnulBtn = historyContainer.querySelector('#admin-history-bulk-annul');
            const bulkRevertBtn = historyContainer.querySelector('#admin-history-bulk-revert');
            const bulkProgress = historyContainer.querySelector('#admin-history-bulk-progress');
            const bulkProgressBar = historyContainer.querySelector('#admin-history-bulk-progress-bar');

            const getVisibleRows = () => {
                const searchValue = searchInput.value.trim().toLowerCase();
                const typeValue = (typeSelect && typeSelect.value) ? typeSelect.value : '';
                const statusValue = statusSelect.value;

                return list.filter(r => {
                    const matchesSearch = !searchValue || [r.cedula, r.trabajador, r.periodo].some(value => (value || '').toString().toLowerCase().includes(searchValue));
                    const matchesType = !typeValue || (r.tipoNomina || '').toString() === typeValue;
                    const matchesStatus = !statusValue || r.status === statusValue;
                    return matchesSearch && matchesType && matchesStatus;
                });
            };

            const refreshTable = () => {
                const visibleRows = getVisibleRows();
                const pg = paginateItems(visibleRows, historyPage);
                historyPage = pg.current;
                tableBody.innerHTML = pg.items.map(renderRowHtml).join('');
                const pagContainer = historyContainer.querySelector('#admin-history-pagination');
                if (pagContainer) {
                    pagContainer.innerHTML = renderPaginationHTML('admin-history-page-btn', pg.current, pg.totalPages, pg.total);
                    attachPaginationListeners(pagContainer, 'admin-history-page-btn', (p) => { historyPage = p; refreshTable(); });
                }
                attachHistoryActionListeners();
                attachRowCheckboxListeners();
                updateSelectAllCheckbox();
                updateBulkControls();
                if (selectedCount) selectedCount.textContent = getSelectedRows().length;
            };

            const applyFilters = () => {
                historyPage = 1;
                refreshTable();
            };

            const updateSelectAllCheckbox = () => {
                if (!selectAllCheckbox) return;
                const checkboxes = Array.from(historyContainer.querySelectorAll('.admin-history-select-row'));
                if (!checkboxes.length) {
                    selectAllCheckbox.checked = false;
                    selectAllCheckbox.indeterminate = false;
                    return;
                }
                const checkedCount = checkboxes.filter(cb => cb.checked).length;
                selectAllCheckbox.checked = checkedCount === checkboxes.length;
                selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
            };

            const attachRowCheckboxListeners = () => {
                historyContainer.querySelectorAll('.admin-history-select-row').forEach(cb => {
                    cb.addEventListener('change', () => {
                        const id = String(cb.dataset.id);
                        if (cb.checked) {
                            selectedIds.add(id);
                        } else {
                            selectedIds.delete(id);
                        }
                        if (selectedCount) selectedCount.textContent = getSelectedRows().length;
                        updateSelectAllCheckbox();
                        updateBulkControls();
                    });
                });
            };

            const attachSelectAllListener = () => {
                if (!selectAllCheckbox) return;
                selectAllCheckbox.addEventListener('change', () => {
                    const visibleChecks = historyContainer.querySelectorAll('.admin-history-select-row');
                    visibleChecks.forEach(cb => {
                        cb.checked = selectAllCheckbox.checked;
                        const id = String(cb.dataset.id);
                        if (selectAllCheckbox.checked) {
                            selectedIds.add(id);
                        } else {
                            selectedIds.delete(id);
                        }
                    });
                    if (selectedCount) selectedCount.textContent = getSelectedRows().length;
                    updateBulkControls();
                });
            };

            const runBulkAction = async (action, successMessage) => {
                const selected = getSelectedRows();
                if (!selected.length) return;
                const ids = selected.map(r => r.id);
                bulkProgress.style.display = 'block';
                bulkProgressBar.style.width = '0%';
                [bulkApproveBtn, bulkAnnulBtn, bulkRevertBtn].forEach(btn => { if (btn) btn.disabled = true; });

                try {
                    for (let i = 0; i < ids.length; i++) {
                        await safePost(`/payroll/${ids[i]}/status`, { action });
                        if (bulkProgressBar) bulkProgressBar.style.width = `${Math.round(((i + 1) / ids.length) * 100)}%`;
                    }
                    showSuccess(successMessage);
                    const data = await apiFetch('/payroll/history');
                    await renderAdminPayslips(data || []);
                } catch (e) {
                    showError(e.message);
                } finally {
                    bulkProgress.style.display = 'none';
                    if (bulkProgressBar) bulkProgressBar.style.width = '0%';
                    [bulkApproveBtn, bulkAnnulBtn, bulkRevertBtn].forEach(btn => { if (btn) btn.disabled = false; });
                }
            };

            searchInput.addEventListener('input', applyFilters);
            if (typeSelect) typeSelect.addEventListener('change', applyFilters);
            statusSelect.addEventListener('change', applyFilters);

            const attachHistoryActionListeners = () => {
                historyContainer.querySelectorAll('.btn-approve-pay').forEach(btn => {
                    btn.addEventListener('click', async () => {
                        const id = btn.dataset.id;
                        btn.disabled = true;
                        try {
                            await safePost(`/payroll/${id}/status`, { action: 'publish' });
                            showSuccess('Recibos aprobados correctamente.');
                            const data = await apiFetch('/payroll/history');
                            await renderAdminPayslips(data || []);
                        } catch (e) {
                            showError(e.message);
                            btn.disabled = false;
                        }
                    });
                });

                historyContainer.querySelectorAll('.btn-annul-pay').forEach(btn => {
                    btn.addEventListener('click', async () => {
                        const id = btn.dataset.id;
                        btn.disabled = true;
                        try {
                            await safePost(`/payroll/${id}/status`, { action: 'annul' });
                            showSuccess('Recibos anulados correctamente.');
                            const data = await apiFetch('/payroll/history');
                            await renderAdminPayslips(data || []);
                        } catch (e) {
                            showError(e.message);
                            btn.disabled = false;
                        }
                    });
                });

                historyContainer.querySelectorAll('.btn-revert-pay').forEach(btn => {
                    btn.addEventListener('click', async () => {
                        const id = btn.dataset.id;
                        if (btn.disabled) return;
                        btn.disabled = true;
                        try {
                            await safePost(`/payroll/${id}/status`, { action: 'revert' });
                            showSuccess('Recibos revertidos a "Pendiente".');
                            const data = await apiFetch('/payroll/history');
                            await renderAdminPayslips(data || []);
                        } catch (e) {
                            showError(e.message);
                            btn.disabled = false;
                        }
                    });
                });

                historyContainer.querySelectorAll('.btn-preview-batch').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.dataset.id;
                        let recibos = [];
                        try {
                            recibos = JSON.parse(decodeURIComponent(btn.dataset.recibos));
                        } catch (e) {}

                        const modalOverlay = document.createElement('div');
                        modalOverlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:9999;';
                        
                        let workerOptions = recibos.map(rc => `<option value="${rc.trabajadorId}">${rc.trabajador} (${rc.cedula})</option>`).join('');

                        modalOverlay.innerHTML = `
                            <div style="background:var(--card-bg, white); padding:24px; border-radius:12px; width:100%; max-width:400px; box-shadow:0 10px 25px rgba(0,0,0,0.2);">
                                <h3 style="margin-top:0; color:var(--text-main);">Previsualizar Recibos</h3>
                                <p style="color:var(--text-muted); font-size:0.95em; margin-bottom:16px;">Seleccione cómo desea visualizar los recibos de este lote.</p>
                                
                                <div style="display:flex; flex-direction:column; gap:16px;">
                                    <a href="${window.adminApiPrefix || '/administrativo'}/payroll/payslip/${id}?all=true" target="_blank" rel="noopener" style="text-decoration:none; display:block; padding:12px; text-align:center; background:var(--primary); color:white; border-radius:8px; font-weight:bold;">
                                        Ver todos consolidados
                                    </a>
                                    
                                    <div style="border-top:1px solid var(--border-color); padding-top:16px;">
                                        <label style="display:block; margin-bottom:8px; font-weight:600; color:var(--text-main);">O ver recibo individual:</label>
                                        <input type="text" id="batch-preview-search" placeholder="Buscar trabajador o cédula..." style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); margin-bottom:8px; background:var(--bg-color, white); color:var(--text-main, black); box-sizing:border-box;">
                                        <select id="batch-preview-worker-select" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); margin-bottom:12px; background:var(--bg-color, white); color:var(--text-main, black); box-sizing:border-box;">
                                            ${workerOptions}
                                        </select>
                                        <button id="btn-open-individual-receipt" style="width:100%; padding:10px; background:var(--secondary, #34495e); color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">
                                            Ver recibo individual
                                        </button>
                                    </div>
                                </div>
                                <button id="btn-close-preview-modal" style="margin-top:20px; width:100%; padding:10px; background:transparent; border:1px solid var(--border-color); border-radius:8px; cursor:pointer; color:var(--text-main);">
                                    Cancelar
                                </button>
                            </div>
                        `;
                        
                        document.body.appendChild(modalOverlay);

                        const searchInput = modalOverlay.querySelector('#batch-preview-search');
                        const selectEl = modalOverlay.querySelector('#batch-preview-worker-select');

                        searchInput.addEventListener('input', (e) => {
                            const val = e.target.value.toLowerCase();
                            const filtered = recibos.filter(rc => 
                                (rc.trabajador || '').toLowerCase().includes(val) || 
                                (rc.cedula || '').toLowerCase().includes(val)
                            );
                            selectEl.innerHTML = filtered.map(rc => `<option value="${rc.trabajadorId}">${rc.trabajador} (${rc.cedula})</option>`).join('');
                        });
                        
                        modalOverlay.querySelector('#btn-close-preview-modal').addEventListener('click', () => {
                            document.body.removeChild(modalOverlay);
                        });
                        
                        modalOverlay.querySelector('#btn-open-individual-receipt').addEventListener('click', () => {
                            const workerId = modalOverlay.querySelector('#batch-preview-worker-select').value;
                            if (workerId) {
                                window.open(`${window.adminApiPrefix || '/administrativo'}/payroll/payslip/${id}?worker_id=${workerId}`, '_blank');
                            }
                        });
                    });
                });
            };

            const attachBulkActionListeners = () => {
                if (bulkApproveBtn) bulkApproveBtn.addEventListener('click', async () => await runBulkAction('publish', 'Recibos aprobados correctamente.'));
                if (bulkAnnulBtn) bulkAnnulBtn.addEventListener('click', async () => await runBulkAction('annul', 'Recibos anulados correctamente.'));
                if (bulkRevertBtn) bulkRevertBtn.addEventListener('click', async () => await runBulkAction('revert', 'Recibos revertidos a Pendiente.'));
            };

            attachHistoryActionListeners();
            attachSelectAllListener();
            attachBulkActionListeners();
            refreshTable();
            historyContainer.style.display = 'block';

        }

        function applyPayTabActive(btn, isActive) {
            if (!btn) return;
            if (isActive) {
                btn.style.background = 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)';
                btn.style.color = 'white';
                btn.style.boxShadow = '0 6px 18px rgba(0,0,0,0.18)';
                btn.classList.add('active');
            } else {
                btn.style.background = 'transparent';
                btn.style.color = 'var(--text-muted)';
                btn.style.boxShadow = 'none';
                btn.classList.remove('active');
            }
        }

        if (payTabCrearBtn) {
            payTabCrearBtn.addEventListener('click', () => {
                applyPayTabActive(payTabCrearBtn, true);
                applyPayTabActive(payTabVerBtn, false);
                if (historyContainer) historyContainer.style.display = 'none';
                // show intro selection if present
                const intro = document.getElementById('pay-create-intro');
                if (intro) {
                    intro.style.display = 'block';
                } else {
                    // if intro was dismissed, ensure form is visible
                    if (payrollFormEl) payrollFormEl.style.display = 'block';
                }
            });
        }

        if (payTabVerBtn) {
            payTabVerBtn.addEventListener('click', async () => {
                applyPayTabActive(payTabCrearBtn, false);
                applyPayTabActive(payTabVerBtn, true);
                if (payrollFormEl) payrollFormEl.style.display = 'none';
                // ensure intro screen (if present) does not appear in Ver recibos
                const introEl = document.getElementById('pay-create-intro');
                if (introEl) introEl.style.display = 'none';
                if (!historyContainer) return;
                historyContainer.innerHTML = '<div style="padding:18px; color:var(--text-muted);">Cargando recibos...</div>';
                historyContainer.style.display = 'block';
                try {
                    const data = await apiFetch('/payroll/history');
                    await renderAdminPayslips(data || []);
                } catch (e) {
                    historyContainer.innerHTML = `<div style="padding:18px; color:var(--error-color);">Error cargando recibos: ${e.message}</div>`;
                }
            });
        }
    }

    function renderConceptsTableHTML(concepts) {
        if (!concepts.length) return '<p class="center" style="color: var(--text-muted); padding:30px;">No hay conceptos registrados.</p>';
        return `
            <table class="data-table" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: var(--primary); color: white;">
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Nombre</th>
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Tipo</th>
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Monto</th>
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Estado</th>
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${concepts.map(c => `
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 10px; border: 1px solid var(--border-color); font-weight: 600; color: var(--text-main);">${c.Nombre_Concepto}</td>
                            <td style="padding: 10px; border: 1px solid var(--border-color); color: var(--text-main);">${c.Tipo}</td>
                            <td style="padding: 10px; border: 1px solid var(--border-color); color: var(--text-main);">Bs. ${parseFloat(c.Monto || 0).toFixed(2)}</td>
                            <td style="padding: 10px; border: 1px solid var(--border-color);">
                                <span style="padding: 4px 10px; border-radius: 12px; font-size: 0.8em; font-weight: 700; 
                                    background: ${c.Estado === 'Activo' ? 'var(--success-color)' : 'var(--error-color)'}; color: white;">
                                    ${c.Estado || 'Activo'}
                                </span>
                            </td>
                            <td style="padding: 10px; border: 1px solid var(--border-color);">
                                <button class="btn-edit-concept primary small" data-id="${c.Id_Concepto}">Editar</button>
                                <button class="btn-toggle-concept secondary small" data-id="${c.Id_Concepto}" data-status="${c.Estado}">
                                    ${c.Estado === 'Activo' ? 'Desactivar' : 'Activar'}
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    function renderAddedConcepts(list, onRemove, totalAsig = 0) {
        const container = document.getElementById('added-concepts-container');
        const salario = parseFloat(document.getElementById('p-salario')?.value || 0);

        if (!list.length) {
            container.innerHTML = '<p class="text-muted" style="text-align:center; margin-top:35px;">No hay conceptos base agregados.</p>';
            if (onRemove && totalAsig === 0) {
                // Si no hay lista y venimos de un evento que requiere actualizar totales (como al seleccionar un trabajador)
                // Pero evitamos recursión infinita solo llamando si realmente hay algo que limpiar y no estamos ya en asig=0
                // En la práctica, updateTotals llama a renderAddedConcepts, por lo que debemos tener cuidado.
            }
            return;
        }

        container.innerHTML = list.map((c, i) => {
            const montoUnitario = getConceptAmount(c, salario, totalAsig);

            let qty = 1;
            if (c.aux) {
                const match = String(c.aux).match(/(\d+(\.\d+)?)/);
                if (match) qty = parseFloat(match[0]);
            }
            const totalRow = montoUnitario * qty;

            return `
                <div style="display:flex; justify-content:space-between; padding:12px 8px; border-bottom:1px solid rgba(255,255,255,0.05); align-items:center; transition: background 0.2s;">
                    <div style="flex:1;">
                        <span style="font-weight:600; color:var(--text-main); font-size:1.05em;">${c.Nombre_Concepto}</span>
                        ${c.aux ? `<span style="font-size:0.9em; color:var(--text-muted); margin-left:12px; font-style:italic;">(${c.aux})</span>` : ''}
                    </div>
                    <div style="text-align:right; display:flex; align-items:center; gap:20px;">
                        <span style="font-family:'Courier New', monospace; font-weight:800; font-size:1.25em; color:${c.Tipo === 'Deducción' ? '#ff8080' : '#80ff80'}; text-shadow: 0 0 10px rgba(0,0,0,0.2);">
                            ${c.Tipo === 'Deducción' ? '-' : '+'} Bs. ${totalRow.toFixed(2)}
                        </span>
                        <button class="btn-remove-concept" data-index="${i}" style="color:#ff4d4d; border:none; background:none; cursor:pointer; font-weight:bold; font-size:1.5em; padding:0 5px; line-height:1;">&times;</button>
                    </div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.btn-remove-concept').forEach(btn => {
            btn.addEventListener('click', () => {
                list.splice(btn.dataset.index, 1);
                renderAddedConcepts(list, onRemove, totalAsig);
                if (onRemove) onRemove();
            });
        });
    }

    // --- Módulo: Gestión de Conceptos ---
    async function renderConceptosModule() {
        contentDetails.innerHTML = '<div class="loader">Cargando conceptos...</div>';
        try {
            const data = await apiFetch('/concepts');
            const concepts = data.conceptos || [];

            contentDetails.innerHTML = `
                <div class="conceptos-module">
                    <div class="content-box">
                        <h4 style="margin-top: 0; color: var(--text-main); border-bottom: 2px solid var(--primary); padding-bottom: 10px;">Gestión de Conceptos de Nómina</h4>
                        
                        <div id="concepts-list" style="margin-top: 20px;">
                            ${renderConceptsTableHTML(concepts)}
                        </div>
 
                        <div style="margin-top:25px; text-align:center; padding-top:20px; border-top:1px solid var(--border-color);">
                            <button id="add-concept-btn" class="primary">➕ Nuevo Concepto</button>
                        </div>
                        
                        <div id="concept-form-container" style="display:none; background: var(--card-bg); padding:25px; border-radius:12px; margin-top:25px; border:1px solid var(--border-color); box-shadow:0 8px 30px rgba(0,0,0,0.1);">
                            <h5 id="concept-form-title" style="margin-top:0; color: var(--text-main); border-bottom: 1px solid var(--border-color); padding-bottom:10px; margin-bottom:20px;">Configurar Concepto</h5>
                            <form id="concept-form">
                                <input type="hidden" id="c-id">
                                <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                                    <div><label style="display:block; font-weight:600; margin-bottom:6px; color: var(--text-main);">Nombre del Concepto <span style="color:#e74c3c;">*</span></label><input type="text" id="c-nombre" required style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);"></div>
                                    <div><label style="display:block; font-weight:600; margin-bottom:6px; color: var(--text-main);">Tipo <span style="color:#e74c3c;">*</span></label><select id="c-tipo" required style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);"><option value="Asignación">Asignación</option><option value="Deducción">Deducción</option><option value="Bonificación">Bonificación</option></select></div>
                                    <div><label style="display:block; font-weight:600; margin-bottom:6px; color: var(--text-main);">Monto sugerido (Bs.) <span style="color:#e74c3c;">*</span></label><input type="number" id="c-monto" step="0.01" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);"></div>
                                    <div><label style="display:block; font-weight:600; margin-bottom:6px; color: var(--text-main);">Código de Referencia <span style="color:#e74c3c;">*</span></label><input type="text" id="c-codigo" required style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);"></div>
                                </div>
                                <div style="margin-top:20px; display:flex; gap:10px; justify-content: flex-end;">
                                    <button type="button" id="cancel-concept-btn" class="secondary">Cancelar</button>
                                    <button type="submit" class="primary" style="min-width:120px;">Guardar Concepto</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;

            setupConceptListeners(concepts);
        } catch (e) {
            contentDetails.innerHTML = `<div class="error">Error: ${e.message}</div>`;
        }
    }

    function setupConceptListeners(concepts) {
        const addBtn = document.getElementById('add-concept-btn');
        const cancelBtn = document.getElementById('cancel-concept-btn');
        const formContainer = document.getElementById('concept-form-container');
        const form = document.getElementById('concept-form');

        addBtn.addEventListener('click', () => {
            const isVisible = formContainer.style.display === 'block';
            formContainer.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) formContainer.scrollIntoView({ behavior: 'smooth' });
            form.reset();
            document.getElementById('c-id').value = '';
            document.getElementById('concept-form-title').innerText = 'Registrar Nuevo Concepto';
        });

        cancelBtn.addEventListener('click', () => { formContainer.style.display = 'none'; });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('c-id').value;
            const nombreEl = document.getElementById('c-nombre');
            const tipoEl = document.getElementById('c-tipo');
            const montoEl = document.getElementById('c-monto');
            const codigoEl = document.getElementById('c-codigo');

            const nombre = (nombreEl.value || '').trim();
            const tipo = (tipoEl.value || '').trim();
            const monto = parseFloat(montoEl.value) || 0;
            const codigo = (codigoEl.value || '').trim();

            // Validaciones básicas
            if (!nombre) { showInlineError(nombreEl, 'El nombre del concepto es obligatorio.'); return showError('El nombre del concepto es obligatorio.'); }
            if (!tipo) { showInlineError(tipoEl, 'El tipo es obligatorio.'); return showError('El tipo es obligatorio.'); }
            if (!codigo) { showInlineError(codigoEl, 'El código de referencia es obligatorio.'); return showError('El código de referencia es obligatorio.'); }

            // Monto: obligatorio salvo para tipos auto-calculados (p.ej. días laborados/descanso/no laborado)
            const autoCalcPattern = /(d[ií]a[s]?\s*labor|laborad|no\s*labor|descans)/i;
            if (!autoCalcPattern.test(tipo)) {
                if (!monto || isNaN(monto) || monto <= 0) {
                    showInlineError(montoEl, 'El monto es obligatorio para este tipo de concepto.');
                    return showError('El monto es obligatorio para este tipo de concepto.');
                }
            } else {
                // limpiar error si existía
                clearInlineError(montoEl);
            }

            // Unicidad case-insensitive (excluir el mismo id si es edición)
            const lowerNombre = nombre.toLowerCase();
            const lowerCodigo = codigo.toLowerCase();
            const others = (concepts || []).filter(x => String(x.Id_Concepto) !== String(id));
            if (others.some(o => (o.Nombre_Concepto || '').toLowerCase() === lowerNombre)) {
                showInlineError(nombreEl, 'Ya existe un concepto con ese nombre.');
                return showError('Ya existe un concepto con ese nombre.');
            }
            if (others.some(o => (o.Codigo || '').toLowerCase() === lowerCodigo)) {
                showInlineError(codigoEl, 'Ya existe un concepto con ese código.');
                return showError('Ya existe un concepto con ese código.');
            }

            const payload = {
                Nombre_Concepto: nombre,
                Tipo: tipo,
                Monto: monto,
                Codigo: codigo
            };
            try {
                const endpoint = id ? `/concepts/${id}` : '/concepts';
                await safePost(endpoint, payload);
                showSuccess(id ? 'Concepto actualizado' : 'Concepto registrado');
                renderConceptosModule();
            } catch (e) { showError(e.message); }
        });

        const attachConceptRowListeners = () => {
        document.querySelectorAll('.btn-edit-concept').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const c = concepts.find(x => String(x.Id_Concepto) === String(id));
                if (c) {
                    document.getElementById('c-id').value = c.Id_Concepto;
                    document.getElementById('c-nombre').value = c.Nombre_Concepto;
                    document.getElementById('c-tipo').value = c.Tipo;
                    document.getElementById('c-monto').value = c.Monto;
                    document.getElementById('c-codigo').value = c.Codigo || '';
                    document.getElementById('concept-form-title').innerText = 'Editar Concepto';
                    formContainer.style.display = 'block';
                    formContainer.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        document.querySelectorAll('.btn-toggle-concept').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const status = btn.dataset.status;
                const action = status === 'Activo' ? 'desactivar' : 'activar';

                const confirmed = await showConfirm(`¿Desea ${action} este concepto?`);
                if (!confirmed) return;

                try {
                    await safePost(`/concepts/${id}/toggle`);
                    const past = action === 'activar' ? 'activado' : 'desactivado';
                    showSuccess(`Concepto ${past} correctamente`);
                    renderConceptosModule();
                } catch (e) { showError(e.message); }
            });
        });
        };

        // Paginación de la tabla de conceptos
        let conceptsPage = 1;
        const conceptsListContainer = document.getElementById('concepts-list');
        const refreshConceptsTable = () => {
            if (!conceptsListContainer) return;
            const pg = paginateItems(concepts, conceptsPage);
            conceptsPage = pg.current;
            conceptsListContainer.innerHTML = renderConceptsTableHTML(pg.items) + renderPaginationHTML('concepts-page-btn', pg.current, pg.totalPages, pg.total);
            attachConceptRowListeners();
            attachPaginationListeners(conceptsListContainer, 'concepts-page-btn', (p) => { conceptsPage = p; refreshConceptsTable(); });
        };
        refreshConceptsTable();
    }

    function renderNominaTableHTML(tipos) {
        if (!tipos.length) return '<p class="center" style="color: var(--text-muted); padding:30px;">No hay tipos de nómina registrados.</p>';
        return `
            <table class="data-table" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: var(--primary); color: white;">
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Nombre / Frecuencia</th>
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Estado</th>
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${tipos.map(t => `
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 10px; border: 1px solid var(--border-color); font-weight: 600; color: var(--text-main);">${t.Frecuencia}</td>
                            <td style="padding: 10px; border: 1px solid var(--border-color);">
                                <span style="padding: 4px 10px; border-radius: 12px; font-size: 0.8em; font-weight: 700; 
                                    background: ${t.Estado === 'Activo' ? 'var(--success-color)' : 'var(--error-color)'}; color: white;">
                                    ${t.Estado || 'Activo'}
                                </span>
                            </td>
                            <td style="padding: 10px; border: 1px solid var(--border-color);">
                                <button class="btn-edit-nomina primary small" data-id="${t.Id_Tipo_Nomina}">Editar</button>
                                <button class="btn-toggle-nomina secondary small" data-id="${t.Id_Tipo_Nomina}" data-status="${t.Estado}">
                                    ${t.Estado === 'Activo' ? 'Desactivar' : 'Activar'}
                                </button>
                                <button class="btn-delete-nomina" data-id="${t.Id_Tipo_Nomina}" style="background-color: var(--error-color); color: white; padding: 6px 10px; border-radius: 8px; margin-left: 5px; cursor: pointer; border:none;" title="Eliminar permanentemente">🗑️</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // --- Módulo: Tipos de Nómina ---
    async function renderTipoNominaModule() {
        contentDetails.innerHTML = '<div class="loader">Cargando tipos de nómina...</div>';
        try {
            const data = await apiFetch('/types-nomina');
            let tipos = (data.tipos || []).filter(t => {
                const freq = String(t.Frecuencia || '').trim().toLowerCase();
                return freq !== 'mensual' && freq !== 'mixta';
            });

            contentDetails.innerHTML = `
                <div class="tipos-nomina">
                    <div class="content-box">
                        <h4 style="margin-top: 0; color: var(--text-main); border-bottom: 2px solid var(--primary); padding-bottom: 10px;">Gestión de Tipos de Nómina</h4>
                        
                        <div id="nomina-list" style="margin-top:20px;">
                            ${renderNominaTableHTML(tipos)}
                        </div>

                        <div style="margin-top:25px; text-align:center; padding-top:20px; border-top:1px solid var(--border-color);">
                            <button id="add-tn-btn" class="primary">➕ Crear Nuevo Tipo</button>
                        </div>
                        
                        <div id="tn-form-container" style="display:none; background: var(--card-bg); padding:25px; border-radius:12px; margin-top:25px; border:1px solid var(--border-color); box-shadow:0 8px 30px rgba(0,0,0,0.1);">
                            <h5 id="tn-form-title" style="margin-top:0; color: var(--text-main); border-bottom: 1px solid var(--border-color); padding-bottom:10px; margin-bottom:20px;">Detalle de Nómina</h5>
                            <form id="tn-form">
                                <input type="hidden" id="tn-id">
                                
                                <div style="margin-bottom:15px;">
                                    <label style="display:block; font-weight:600; margin-bottom:6px; color: var(--text-main);">Tipo / Frecuencia</label>
                                    <select id="tn-freq-select" required style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                        <option value="Semanal">Semanal</option>
                                        <option value="Quincenal" selected>Quincenal</option>
                                        <option value="Bonificación">Bonificación</option>
                                    </select>
                                </div>

                                <div id="tn-bono-name-container" style="display:none; margin-bottom:15px;">
                                    <label style="display:block; font-weight:600; margin-bottom:6px; color: var(--text-main);">Nombre de la Bonificación</label>
                                    <input type="text" id="tn-bono-name" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);" placeholder="Ej: Bono de Productividad">
                                </div>

                                <div style="margin-top:20px; display:flex; gap:10px; justify-content: flex-end;">
                                    <button type="button" id="cancel-tn-btn" class="secondary">Cancelar</button>
                                    <button type="submit" class="primary">Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;

            const addBtn = document.getElementById('add-tn-btn');
            const formContainer = document.getElementById('tn-form-container');
            const form = document.getElementById('tn-form');

            addBtn.addEventListener('click', () => {
                const isVisible = formContainer.style.display === 'block';
                formContainer.style.display = isVisible ? 'none' : 'block';
                if (!isVisible) formContainer.scrollIntoView({ behavior: 'smooth' });
                form.reset();
                document.getElementById('tn-id').value = '';
                document.getElementById('tn-form-title').innerText = 'Registrar Nuevo Tipo de Nómina';
                document.getElementById('tn-bono-name-container').style.display = 'none';
            });

            document.getElementById('cancel-tn-btn').addEventListener('click', () => { formContainer.style.display = 'none'; });

            const freqSelect = document.getElementById('tn-freq-select');
            const bonoContainer = document.getElementById('tn-bono-name-container');
            const bonoInput = document.getElementById('tn-bono-name');

            freqSelect.addEventListener('change', () => {
                bonoContainer.style.display = freqSelect.value === 'Bonificación' ? 'block' : 'none';
                if (freqSelect.value !== 'Bonificación') bonoInput.value = '';
            });

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const id = document.getElementById('tn-id').value;
                let frecuencia = freqSelect.value;

                if (frecuencia === 'Bonificación') {
                    frecuencia = bonoInput.value.trim();
                    if (!frecuencia) return showError('Debe indicar el nombre de la bonificación');
                }

                // Restricción: No permitir crear dos tipos de nómina con el mismo nombre
                const isDuplicate = tipos.some(t => t.Frecuencia.toLowerCase() === frecuencia.toLowerCase() && String(t.Id_Tipo_Nomina) !== String(id));
                if (isDuplicate) {
                    return showError('Ya existe un tipo de nómina con ese nombre.');
                }

                const payload = {
                    Frecuencia: frecuencia
                };

                try {
                    const endpoint = id ? `/types-nomina/${id}` : '/types-nomina';
                    await safePost(endpoint, payload);
                    showSuccess(id ? 'Tipo de nómina actualizado' : 'Tipo de nómina registrado');
                    renderTipoNominaModule();
                } catch (e) { showError(e.message); }
            });

            document.querySelectorAll('.btn-edit-nomina').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.id;
                    const t = tipos.find(x => String(x.Id_Tipo_Nomina) === String(id));
                    if (t) {
                        document.getElementById('tn-id').value = t.Id_Tipo_Nomina;
                        const standard = ["Semanal", "Quincenal", "Mensual", "Mixta"];
                        if (standard.includes(t.Frecuencia)) {
                            document.getElementById('tn-freq-select').value = t.Frecuencia;
                            document.getElementById('tn-bono-name-container').style.display = 'none';
                        } else {
                            document.getElementById('tn-freq-select').value = 'Bonificación';
                            document.getElementById('tn-bono-name').value = t.Frecuencia;
                            document.getElementById('tn-bono-name-container').style.display = 'block';
                        }
                        document.getElementById('tn-form-title').innerText = 'Editar Tipo de Nómina';
                        formContainer.style.display = 'block';
                        formContainer.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });

            document.querySelectorAll('.btn-toggle-nomina').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.id;
                    const status = btn.dataset.status;
                    const action = status === 'Activo' ? 'desactivar' : 'activar';

                    const confirmed = await showConfirm(`¿Desea ${action} este tipo de nómina?`);
                    if (!confirmed) return;

                        try {
                        await safePost(`/types-nomina/${id}/toggle`);
                        showSuccess(`Tipo de nómina ${action}ado correctamente`);
                        renderTipoNominaModule();
                    } catch (e) { showError(e.message); }
                });
            });

            document.querySelectorAll('.btn-delete-nomina').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.id;
                    const confirmed = await showConfirm(`¿Está seguro de ELIMINAR PERMANENTEMENTE este tipo de nómina?\nEsta acción no se puede deshacer y el registro desaparecerá de la base de datos.`);
                    if (!confirmed) return;

                        try {
                        await safePost(`/types-nomina/${id}/delete`);
                        showSuccess(`Registro eliminado de la base de datos`);
                        renderTipoNominaModule();
                    } catch (e) { showError(e.message); }
                });
            });
        } catch (e) { contentDetails.innerHTML = `<div class="error">Error: ${e.message}</div>`; }
    }

    function renderCargosTableHTML(cargos, selectedCargoIds = new Set(), workerCounts = {}) {
        if (!cargos.length) return '<p class="center" style="color: var(--text-muted); padding:30px;">No hay cargos registrados.</p>';
        return `
            <table class="data-table" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: var(--primary); color: white;">
                        <th style="padding: 12px; border: 1px solid var(--border-color); width: 60px; text-align:center;"><input type="checkbox" class="cargo-select-all" /></th>
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Cargo / Profesión</th>
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Área</th>
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Estado</th>
                        <th style="padding: 12px; border: 1px solid var(--border-color);">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${cargos.map(c => {
                        const count = workerCounts[String(c.Id_Cargo)] || 0;
                        const isChecked = selectedCargoIds.has(String(c.Id_Cargo));
                        return `
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 10px; border: 1px solid var(--border-color); text-align:center;">
                                <input type="checkbox" class="cargo-select-row" data-id="${c.Id_Cargo}" ${isChecked ? 'checked' : ''} />
                            </td>
                            <td style="padding: 10px; border: 1px solid var(--border-color); font-weight: 600; color: var(--text-main);">${c.Nombre_profesión}</td>
                            <td style="padding: 10px; border: 1px solid var(--border-color); color: var(--text-main);">${c.Area || 'N/A'}</td>
                            <td style="padding: 10px; border: 1px solid var(--border-color);">
                                <span style="padding: 4px 10px; border-radius: 12px; font-size: 0.8em; font-weight: 700; background: ${c.Estado === 'Activo' ? 'var(--success-color)' : 'var(--error-color)'}; color: white;">
                                    ${c.Estado || 'Activo'}
                                </span>
                            </td>
                            <td style="padding: 10px; border: 1px solid var(--border-color);">
                                <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center; align-items:center;">
                                    <button class="btn-edit-cargo primary small" data-id="${c.Id_Cargo}">Editar</button>
                                    <button class="btn-view-cargo-workers secondary small" data-id="${c.Id_Cargo}" data-name="${String(c.Nombre_profesión || '').replace(/"/g, '&quot;')}">
                                        Ver trabajadores <span style="margin-left:6px; background: rgba(255,255,255,0.18); color: #fff; padding:2px 8px; border-radius:999px; font-size:0.78em;">${count}</span>
                                    </button>
                                    <button class="btn-toggle-cargo secondary small" data-id="${c.Id_Cargo}" data-status="${c.Estado}">
                                        ${c.Estado === 'Activo' ? 'Desactivar' : 'Activar'}
                                    </button>
                                </div>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        `;
    }

    function renderCargoWorkersTableHTML(workers) {
        if (!workers.length) {
            return '<div style="padding:16px; color: var(--text-main);">No hay trabajadores asignados a este cargo actualmente.</div>';
        }

        return `
            <div style="overflow-x:auto; margin-top: 12px;">
                <table style="width:100%; border-collapse:collapse;">
                    <thead>
                        <tr style="background: var(--primary); color:#fff;">
                            <th style="padding:10px; border:1px solid var(--border-color); text-align:left;">Cédula</th>
                            <th style="padding:10px; border:1px solid var(--border-color); text-align:left;">Nombre</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${workers.map(w => `
                            <tr>
                                <td style="padding:10px; border:1px solid var(--border-color); color: var(--text-main);">${w.Documento_Identidad || '-'}</td>
                                <td style="padding:10px; border:1px solid var(--border-color); color: var(--text-main);">${(w.Nombre_Completo || '').trim()} ${(w.Apellidos || '').trim()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    async function cargoHasAssignedWorkers(cargoId) {
        try {
            const response = await apiFetch('/workers');
            let workers = [];
            if (Array.isArray(response)) {
                workers = response;
            } else if (response && Array.isArray(response.workers)) {
                workers = response.workers;
            }
            return workers.some(w => String(w.Id_Cargo) === String(cargoId));
        } catch (e) {
            console.warn('Error al verificar trabajadores por cargo:', e.message);
            return false;
        }
    }

    async function showCargoWorkersModal(cargoId, cargoName) {
        try {
            const response = await apiFetch('/workers');
            let workers = [];
            if (Array.isArray(response)) {
                workers = response;
            } else if (response && Array.isArray(response.workers)) {
                workers = response.workers;
            }

            const cargoWorkers = workers.filter(w => String(w.Id_Cargo) === String(cargoId));
            const html = `
                <div style="font-size:0.95rem; line-height:1.6; color: var(--text-main);">
                    <p style="margin:0 0 14px; font-weight:600; color: var(--text-main);">Visualizar trabajadores que posean este cargo.</p>
                    ${renderCargoWorkersTableHTML(cargoWorkers)}
                </div>
            `;

            await showModal({
                type: 'info',
                title: `Trabajadores del cargo: ${cargoName || ''}`,
                html,
                okText: 'Cerrar'
            });
        } catch (e) {
            showError(e.message || 'No se pudo cargar la lista de trabajadores.');
        }
    }

    let cargoWorkerCountCache = {};
    let disabledAreasMap = {};
    let currentSelectedArea = null;

    function getAreaMetaByName(areaName) {
        const normalized = String(areaName || '').trim().toLowerCase();
        if (!normalized) return null;
        if (disabledAreasMap[areaName]) return disabledAreasMap[areaName];
        return Object.values(disabledAreasMap).find(meta => String(meta.area || '').trim().toLowerCase() === normalized) || null;
    }

    async function loadCargoWorkerCounts() {
        try {
            const response = await apiFetch('/workers');
            let workers = [];
            if (Array.isArray(response)) {
                workers = response;
            } else if (response && Array.isArray(response.workers)) {
                workers = response.workers;
            }
            const counts = {};
            workers.forEach(w => {
                const cargoId = String(w.Id_Cargo || '');
                if (!cargoId) return;
                counts[cargoId] = (counts[cargoId] || 0) + 1;
            });
            return counts;
        } catch (e) {
            console.warn('No se pudieron obtener los trabajadores para conteo:', e.message);
            return {};
        }
    }

    function attachCargoRowListeners(cargos, container, selectedCargoIds = new Set(), updateCargoBulkControls = () => {}) {
        const root = container || document;
        root.querySelectorAll('.btn-edit-cargo').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const c = cargos.find(x => String(x.Id_Cargo) === String(id));
                if (c) {
                    document.getElementById('car-id').value = c.Id_Cargo;
                    document.getElementById('car-nombre').value = c.Nombre_profesión;
                    document.getElementById('car-area').value = c.Area || '';
                    document.getElementById('cargo-form-title').innerText = 'Editar Cargo';
                    document.getElementById('cargo-form-container').style.display = 'block';
                    document.getElementById('cargo-form-container').scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        root.querySelectorAll('.btn-toggle-cargo').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (btn.disabled || btn.dataset.busy === 'true') return;
                btn.dataset.busy = 'true';
                btn.disabled = true;
                const originalText = btn.textContent;
                btn.textContent = 'Cargando...';

                try {
                    const id = btn.dataset.id;
                    const status = btn.dataset.status;
                    const action = status === 'Activo' ? 'desactivar' : 'activar';

                    if (status === 'Activo') {
                        const hasAssigned = await cargoHasAssignedWorkers(id);
                        if (hasAssigned) {
                            await showModal({
                                type: 'warning',
                                title: 'Cargo en uso',
                                message: 'No puedes desactivar este cargo porque está siendo utilizado por algún trabajador.',
                                okText: 'Cerrar'
                            });
                            return;
                        }
                    }

                    const confirmed = await showConfirm(`¿Desea ${action} este cargo?`);
                    if (!confirmed) return;
                    await safePost(`/cargos/${id}/toggle`);
                    const past = action === 'activar' ? 'activado' : 'desactivado';
                    showSuccess(`Cargo ${past} correctamente`);
                    renderCargosModule();
                } catch (e) {
                    showError(e.message);
                } finally {
                    btn.dataset.busy = 'false';
                    btn.disabled = false;
                    btn.textContent = originalText;
                }
            });
        });

        root.querySelectorAll('.btn-view-cargo-workers').forEach(btn => {
            btn.addEventListener('click', async () => {
                const cargoId = btn.dataset.id;
                const cargoName = btn.dataset.name || '';
                await showCargoWorkersModal(cargoId, cargoName);
            });
        });

        const selectAll = root.querySelector('.cargo-select-all');
        const rows = Array.from(root.querySelectorAll('.cargo-select-row'));

        rows.forEach(row => {
            row.addEventListener('change', () => {
                const id = String(row.dataset.id);
                if (row.checked) {
                    selectedCargoIds.add(id);
                } else {
                    selectedCargoIds.delete(id);
                }
                if (selectAll) {
                    const checkedCount = rows.filter(r => r.checked).length;
                    selectAll.checked = checkedCount === rows.length && rows.length > 0;
                    selectAll.indeterminate = checkedCount > 0 && checkedCount < rows.length;
                }
                updateCargoBulkControls();
            });
        });

        if (selectAll) {
            selectAll.addEventListener('change', () => {
                const checked = selectAll.checked;
                rows.forEach(row => {
                    row.checked = checked;
                    const id = String(row.dataset.id);
                    if (checked) selectedCargoIds.add(id);
                    else selectedCargoIds.delete(id);
                });
                updateCargoBulkControls();
            });
        }
    }

    // --- Módulo: Gestión de Cargos ---
    async function renderCargosModule() {
        contentDetails.innerHTML = '<div class="loader">Cargando módulo de Cargos y Departamentos...</div>';

        try {
            // Cargamos lista completa de cargos (para la pestaña Cargos) y áreas para la pestaña Departamentos
            const [cData, aData] = await Promise.all([
                apiFetch('/cargos'),
                apiFetch('/cargos/areas')
            ]);

            const cargos = cData.cargos || [];
            const areas = aData.areas || [];
            const workerCounts = await loadCargoWorkerCounts();

            const areaMeta = areas.reduce((acc, area) => {
                const areaCargos = cargos.filter(c => String(c.Area || '') === String(area));
                const activeCount = areaCargos.filter(c => String(c.Estado || '').toLowerCase() === 'activo').length;
                const workerCount = areaCargos.reduce((sum, c) => sum + (workerCounts[String(c.Id_Cargo)] || 0), 0);
                acc[area] = {
                    area,
                    totalCargos: areaCargos.length,
                    activeCount,
                    workerCount,
                    disabled: areaCargos.length > 0 && activeCount === 0
                };
                return acc;
            }, {});

            disabledAreasMap = areaMeta;
            currentSelectedArea = null;

            const areasListHTML = areas.length ? areas.map(area => {
                const meta = areaMeta[area] || { workerCount: 0, disabled: false };
                const statusLabel = meta.disabled ? 'Desactivada' : 'Activada';
                const actionLabel = meta.disabled ? 'Reactivar área' : 'Desactivar área';
                return `
                    <div class="area-row" data-area="${area.replace(/"/g, '&quot;')}" style="display:flex; justify-content:space-between; align-items:center; padding:12px; border:1px solid var(--border-color); border-radius:8px; margin-bottom:8px; background: var(--card-bg);">
                        <div style="display:flex; flex-direction:column; gap:4px;">
                            <strong style="color: var(--text-main);">${area}</strong>
                            <span style="font-size:0.92em; color: var(--text-muted);">Trabajadores: ${meta.workerCount} · Estado: ${statusLabel}</span>
                        </div>
                        <div style="display:flex; gap:8px; align-items:center;">
                            <button class="btn-view-area-cargos secondary small" data-area="${area.replace(/"/g, '&quot;')}" style="white-space:nowrap;">Ver cargos</button>
                            <button class="btn-disable-area secondary small" data-area="${area.replace(/"/g, '&quot;')}">
                                ${actionLabel}
                            </button>
                        </div>
                    </div>
                `;
            }).join('') : '<p class="center" style="color:var(--text-muted);">No hay áreas registradas.</p>';

            contentDetails.innerHTML = `
                <div class="cargos-module">
                    <div class="content-box">
                        <h4 style="margin-top: 0; color: var(--text-main); border-bottom: 2px solid var(--primary); padding-bottom: 10px;">Gestión de Cargos</h4>

                        <div style="display:flex; gap:10px; align-items:center; margin-top:15px;">
                            <button id="tab-cargos" class="primary small">Cargos</button>
                            <button id="tab-departamentos" class="secondary small">Departamentos</button>
                            <div style="margin-left:auto; display:flex; gap:8px; align-items:center;">
                                <label style="font-size:0.9em; color:var(--text-muted);">Ordenar:</label>
                                <select id="sort-cargos" style="padding:6px; border-radius:6px;">
                                    <option value="name_asc">Nombre ↑</option>
                                    <option value="name_desc">Nombre ↓</option>
                                </select>
                            </div>
                        </div>

                        <div id="tab-content" style="margin-top:20px;">
                            <div id="cargos-tab">
                                <div id="cargo-filters" style="display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:12px; margin-bottom:16px;">
                                    <label style="display:flex; flex-direction:column; gap:8px; color:var(--text-main); font-size:0.95em;">
                                        Cargo / Profesión
                                        <input id="filter-cargo-nombre" type="text" placeholder="Buscar cargo..." style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                    </label>
                                    <label style="display:flex; flex-direction:column; gap:8px; color:var(--text-main); font-size:0.95em;">
                                        Área
                                        <input id="filter-cargo-area" type="text" placeholder="Filtrar por área..." style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                    </label>
                                    <label style="display:flex; flex-direction:column; gap:8px; color:var(--text-main); font-size:0.95em;">
                                        Estado
                                        <select id="filter-cargo-status" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                            <option value="">Todos</option>
                                            <option value="activo">Activo</option>
                                            <option value="inactivo">Inactivo</option>
                                        </select>
                                    </label>
                                </div>
                                <div id="cargo-table-container">${renderCargosTableHTML(cargos)}</div>
                            </div>
                            <div id="cargo-bulk-actions" style="display:none; margin-top:18px; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
                                <div style="color:var(--text-muted); font-size:0.92em;">Cargos seleccionados: <span id="cargo-selected-count">0</span></div>
                                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                                    <button id="cargo-bulk-activate" style="display:none; padding:10px 16px; border-radius:10px; border:none; background:var(--success-color); color:white; cursor:pointer; font-weight:700;">Activar todos</button>
                                    <button id="cargo-bulk-deactivate" style="display:none; padding:10px 16px; border-radius:10px; border:none; background:#e74c3c; color:white; cursor:pointer; font-weight:700;">Desactivar todos</button>
                                </div>
                            </div>
                            <div id="cargo-bulk-progress" style="display:none; margin-top:15px;">
                                <div id="cargo-bulk-progress-label" style="color: var(--text-main); font-size:0.95em; margin-bottom:6px;">Procesando cargos...</div>
                                <div style="width:100%; background: rgba(255,255,255,0.1); border-radius:999px; height: 14px; overflow:hidden;">
                                    <div id="cargo-bulk-progress-bar" style="width:0%; height:100%; background: var(--success-color); transition: width 0.2s ease;"></div>
                                </div>
                            </div>
                            <div id="departamentos-tab" style="display:none;">
                                <div id="areas-list">
                                    ${areasListHTML}
                                </div>
                                <div id="area-cargos-container" style="margin-top:16px;"></div>
                            </div>
                        </div>

                        <div style="margin-top:25px; text-align:center; padding-top:20px; border-top:1px solid var(--border-color);">
                            <button id="add-cargo-btn" class="primary">➕ Nuevo Cargo</button>
                        </div>

                        <div id="cargo-form-container" style="display:none; background: var(--card-bg); padding:25px; border-radius:12px; margin-top:25px; border:1px solid var(--border-color); box-shadow:0 8px 30px rgba(0,0,0,0.1);">
                            <h5 id="cargo-form-title" style="margin-top:0; color: var(--text-main); border-bottom: 1px solid var(--border-color); padding-bottom:10px; margin-bottom:20px;">Configurar Cargo</h5>
                            <form id="cargo-form">
                                <input type="hidden" id="car-id">
                                <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                                    <div>
                                        <label style="display:block; font-weight:600; margin-bottom:6px; color: var(--text-main);">Nombre del Cargo <span style="color:#e74c3c;">*</span></label>
                                        <input type="text" id="car-nombre" required style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                    </div>
                                    <div>
                                        <label style="display:block; font-weight:600; margin-bottom:6px; color: var(--text-main);">Área Administrativa <span style="color:#e74c3c;">*</span></label>
                                        <input type="text" id="car-area" required style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border-color); background: var(--bg-color); color: var(--text-main);">
                                    </div>
                                </div>
                                <div style="margin-top:20px; display:flex; gap:10px; justify-content: flex-end;">
                                    <button type="button" id="cancel-cargo-btn" class="secondary">Cancelar</button>
                                    <button type="submit" class="primary" style="min-width:120px;">Guardar Cargo</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;

            setupCargoListeners(cargos);
            setupAreaListeners(cargos);
        } catch (e) {
            contentDetails.innerHTML = `<div class="error">Error: ${e.message}</div>`;
        }
    }

    function setupCargoListeners(cargos) {
        const addBtn = document.getElementById('add-cargo-btn');
        const formContainer = document.getElementById('cargo-form-container');
        const form = document.getElementById('cargo-form');

        const tabCargos = document.getElementById('tab-cargos');
        const tabDeps = document.getElementById('tab-departamentos');
        const cargosTab = document.getElementById('cargos-tab');
        const depsTab = document.getElementById('departamentos-tab');
        const sortSelect = document.getElementById('sort-cargos');

        let selectedCargoIds = new Set();
        let cargoWorkerCounts = {};

        const getSelectedCargoItems = () => cargos.filter(c => selectedCargoIds.has(String(c.Id_Cargo)));
        const getBulkActionsContainer = () => document.getElementById('cargo-bulk-actions');
        const getSelectedCountLabel = () => document.getElementById('cargo-selected-count');
        const getBulkActivateBtn = () => document.getElementById('cargo-bulk-activate');
        const getBulkDeactivateBtn = () => document.getElementById('cargo-bulk-deactivate');
        const getCargoTableContainer = () => document.getElementById('cargo-table-container');

        const cargoFilters = {
            nombre: '',
            area: '',
            estado: ''
        };

        const filterCargos = () => cargos.filter(c => {
            const nombre = String(c.Nombre_profesión || '').toLowerCase();
            const area = String(c.Area || '').toLowerCase();
            const estado = String(c.Estado || '').toLowerCase();

            const matchesNombre = !cargoFilters.nombre || nombre.includes(cargoFilters.nombre);
            const matchesArea = !cargoFilters.area || area.includes(cargoFilters.area);
            const matchesEstado = !cargoFilters.estado || estado === cargoFilters.estado;

            return matchesNombre && matchesArea && matchesEstado;
        });

        const updateCargoFilters = () => {
            const nombreInput = document.getElementById('filter-cargo-nombre');
            const areaInput = document.getElementById('filter-cargo-area');
            const statusInput = document.getElementById('filter-cargo-status');
            if (!nombreInput || !areaInput || !statusInput) return;

            cargoFilters.nombre = String(nombreInput.value || '').trim().toLowerCase();
            cargoFilters.area = String(areaInput.value || '').trim().toLowerCase();
            cargoFilters.estado = String(statusInput.value || '').trim().toLowerCase();
        };

        const updateCargoBulkControls = () => {
            const selected = getSelectedCargoItems();
            const container = getBulkActionsContainer();
            const selectedCountLabel = getSelectedCountLabel();
            const activateBtn = getBulkActivateBtn();
            const deactivateBtn = getBulkDeactivateBtn();

            if (!container || !selectedCountLabel || !activateBtn || !deactivateBtn) return;

            const selectedCount = selected.length;
            selectedCountLabel.textContent = selectedCount;

            const allInactive = selectedCount > 0 && selected.every(c => String(c.Estado || '').toLowerCase() !== 'activo');
            const allActive = selectedCount > 0 && selected.every(c => String(c.Estado || '').toLowerCase() === 'activo');
            const noneAssigned = selected.every(c => (cargoWorkerCounts[String(c.Id_Cargo)] || 0) === 0);

            const showActivate = allInactive;
            const showDeactivate = allActive && noneAssigned;

            container.style.display = selectedCount > 0 ? 'flex' : 'none';
            activateBtn.style.display = showActivate ? 'inline-flex' : 'none';
            deactivateBtn.style.display = showDeactivate ? 'inline-flex' : 'none';
        };

        let cargoPage = 1;
        let lastCargoFilterSig = JSON.stringify(cargoFilters);

        const refreshCargosTable = () => {
            const cargoTableContainer = getCargoTableContainer();
            if (!cargoTableContainer) return;
            const filteredCargos = filterCargos();

            // Reiniciar a la página 1 cuando cambian los filtros
            const sig = JSON.stringify(cargoFilters);
            if (sig !== lastCargoFilterSig) { lastCargoFilterSig = sig; cargoPage = 1; }

            const pg = paginateItems(filteredCargos, cargoPage);
            cargoPage = pg.current;
            cargoTableContainer.innerHTML = renderCargosTableHTML(pg.items, selectedCargoIds, cargoWorkerCounts) + renderPaginationHTML('cargo-page-btn', pg.current, pg.totalPages, pg.total);
            attachCargoRowListeners(pg.items, cargoTableContainer, selectedCargoIds, updateCargoBulkControls);
            attachPaginationListeners(cargoTableContainer, 'cargo-page-btn', (p) => { cargoPage = p; refreshCargosTable(); });
            updateCargoBulkControls();
        };

        const runCargoBulkAction = async (action) => {
            const selected = getSelectedCargoItems();
            if (!selected.length) return;

            const progressContainer = document.getElementById('cargo-bulk-progress');
            const progressBar = document.getElementById('cargo-bulk-progress-bar');
            const progressLabel = document.getElementById('cargo-bulk-progress-label');

            if (action === 'deactivate') {
                cargoWorkerCounts = await loadCargoWorkerCounts();
                cargoWorkerCountCache = cargoWorkerCounts;
                const hasAssigned = selected.some(c => (cargoWorkerCounts[String(c.Id_Cargo)] || 0) > 0);
                if (hasAssigned) {
                    await showModal({
                        type: 'warning',
                        title: 'Cargo en uso',
                        message: 'No puedes desactivar este cargo porque está siendo utilizado por algún trabajador.',
                        okText: 'Cerrar'
                    });
                    return;
                }
            }

            if (progressContainer && progressBar && progressLabel) {
                progressContainer.style.display = 'block';
                progressBar.style.width = '0%';
                progressLabel.textContent = `Procesando 0 de ${selected.length}...`;
            }

            try {
                for (let i = 0; i < selected.length; i++) {
                    const cargo = selected[i];
                    await safePost(`/cargos/${cargo.Id_Cargo}/toggle`);
                    if (progressBar && progressLabel) {
                        const percent = Math.round(((i + 1) / selected.length) * 100);
                        progressBar.style.width = `${percent}%`;
                        progressLabel.textContent = `Procesando ${i + 1} de ${selected.length}...`;
                    }
                }
                showSuccess(action === 'activate' ? 'Cargos activados correctamente' : 'Cargos desactivados correctamente');
                renderCargosModule();
            } catch (e) {
                showError(e.message);
            } finally {
                if (progressContainer) {
                    setTimeout(() => {
                        progressContainer.style.display = 'none';
                    }, 300);
                }
            }
        };

        function showCargosTab() { currentSelectedArea = null; cargosTab.style.display = 'block'; depsTab.style.display = 'none'; tabCargos.className = 'primary small'; tabDeps.className = 'secondary small'; }
        function showDepsTab() { currentSelectedArea = null; cargosTab.style.display = 'none'; depsTab.style.display = 'block'; tabCargos.className = 'secondary small'; tabDeps.className = 'primary small'; }

        if (tabCargos) tabCargos.addEventListener('click', showCargosTab);
        if (tabDeps) tabDeps.addEventListener('click', showDepsTab);

        const filterNombreInput = document.getElementById('filter-cargo-nombre');
        const filterAreaInput = document.getElementById('filter-cargo-area');
        const filterStatusInput = document.getElementById('filter-cargo-status');

        const onFilterChange = () => {
            updateCargoFilters();
            refreshCargosTable();
        };

        if (filterNombreInput) filterNombreInput.addEventListener('input', onFilterChange);
        if (filterAreaInput) filterAreaInput.addEventListener('input', onFilterChange);
        if (filterStatusInput) filterStatusInput.addEventListener('change', onFilterChange);

        if (addBtn) {
            addBtn.addEventListener('click', async () => {
                if (currentSelectedArea) {
                    const currentMeta = getAreaMetaByName(currentSelectedArea);
                    if (currentMeta && currentMeta.disabled) {
                        await showModal({
                            type: 'warning',
                            title: 'Área desactivada',
                            message: 'No puedes agregar nuevos cargos a esta area porque se encuentra desactivada.',
                            okText: 'Aceptar'
                        });
                        return;
                    }
                }

                const isVisible = formContainer.style.display === 'block';
                formContainer.style.display = isVisible ? 'none' : 'block';
                if (!isVisible) formContainer.scrollIntoView({ behavior: 'smooth' });
                form.reset();
                document.getElementById('car-id').value = '';
                if (currentSelectedArea) {
                    document.getElementById('car-area').value = currentSelectedArea;
                }
                document.getElementById('cargo-form-title').innerText = 'Registrar Nuevo Cargo';
            });
        }

        const bulkActivateBtn = document.getElementById('cargo-bulk-activate');
        const bulkDeactivateBtn = document.getElementById('cargo-bulk-deactivate');
        if (bulkActivateBtn) {
            bulkActivateBtn.addEventListener('click', async () => {
                if (bulkActivateBtn.disabled || bulkActivateBtn.dataset.busy === 'true') return;
                bulkActivateBtn.dataset.busy = 'true';
                bulkActivateBtn.disabled = true;
                try {
                    await runCargoBulkAction('activate');
                } finally {
                    bulkActivateBtn.dataset.busy = 'false';
                    bulkActivateBtn.disabled = false;
                }
            });
        }
        if (bulkDeactivateBtn) {
            bulkDeactivateBtn.addEventListener('click', async () => {
                if (bulkDeactivateBtn.disabled || bulkDeactivateBtn.dataset.busy === 'true') return;
                bulkDeactivateBtn.dataset.busy = 'true';
                bulkDeactivateBtn.disabled = true;
                try {
                    await runCargoBulkAction('deactivate');
                } finally {
                    bulkDeactivateBtn.dataset.busy = 'false';
                    bulkDeactivateBtn.disabled = false;
                }
            });
        }

        const cancelBtn = document.getElementById('cancel-cargo-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => { formContainer.style.display = 'none'; });
        }

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const id = document.getElementById('car-id').value;
                const nombreEl = document.getElementById('car-nombre');
                const areaEl = document.getElementById('car-area');
                const nombre = (nombreEl.value || '').trim();
                const area = (areaEl.value || '').trim();

                if (!nombre) { showInlineError(nombreEl, 'El nombre del cargo es obligatorio.'); return showError('El nombre del cargo es obligatorio.'); }
                if (!area) { showInlineError(areaEl, 'El área administrativa es obligatoria.'); return showError('El área administrativa es obligatoria.'); }

                if (!id) {
                    const areaMeta = getAreaMetaByName(area);
                    if (areaMeta && areaMeta.disabled) {
                        await showModal({
                            type: 'warning',
                            title: 'Área desactivada',
                            message: 'No puedes agregar nuevos cargos a esta area porque se encuentra desactivada.',
                            okText: 'Aceptar'
                        });
                        return;
                    }
                }

                const payload = { Nombre_profesión: nombre, Area: area };
                try {
                    const endpoint = id ? `/cargos/${id}` : '/cargos';
                    await safePost(endpoint, payload);
                    showSuccess(id ? 'Cargo actualizado' : 'Cargo registrado');
                    renderCargosModule();
                } catch (e) {
                    const errorMessage = String(e.message || '').toLowerCase();
                    if (/duplicate entry|nombre[_ ]profes[ií]on|already exists|ya existe/.test(errorMessage)) {
                        await showModal({
                            type: 'warning',
                            title: 'Nombre inválido',
                            message: 'No puedes llamar así a este cargo porque ya existe un cargo con este nombre.',
                            okText: 'Aceptar'
                        });
                        return;
                    }
                    showError(e.message);
                }
            });
        }

        refreshCargosTable();

        loadCargoWorkerCounts().then(counts => {
            cargoWorkerCounts = counts;
            cargoWorkerCountCache = counts;
            refreshCargosTable();
        });
    }

    function setupAreaListeners(cargos) {
        document.querySelectorAll('.btn-view-area-cargos').forEach(btn => {
            btn.addEventListener('click', async () => {
                const area = btn.dataset.area;
                currentSelectedArea = area;
                const areaMeta = getAreaMetaByName(area);
                const container = document.getElementById('area-cargos-container');
                container.innerHTML = '<div class="loader">Cargando cargos del área...</div>';
                try {
                    const data = await apiFetch(`/cargos?area=${encodeURIComponent(area)}`);
                    const cargosInArea = data.cargos || [];
                    const areaActionLabel = areaMeta && areaMeta.disabled ? 'Reactivar área' : 'Desactivar área';
                    container.innerHTML = `
                        <div style="display:flex; gap:8px; align-items:center; margin-bottom:12px; flex-wrap:wrap;">
                            <button id="back-to-areas" class="secondary small">← Volver a áreas</button>
                            <h5 style="margin:0;">Cargos en: ${area}</h5>
                            <span style="margin-left:auto; color:var(--text-muted); font-size:0.95em;">Trabajadores en área: ${areaMeta ? areaMeta.workerCount : 0} · Estado: ${areaMeta && areaMeta.disabled ? 'Desactivada' : 'Activada'}</span>
                        </div>
                        <div style="margin-bottom:16px; display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                            <button id="area-disable-btn" class="secondary small">
                                ${areaActionLabel}
                            </button>
                        </div>
                        ${renderCargosTableHTML(cargosInArea, new Set(), cargoWorkerCountCache)}
                    `;

                    document.getElementById('back-to-areas').addEventListener('click', () => {
                        currentSelectedArea = null;
                        document.getElementById('area-cargos-container').innerHTML = '';
                    });

                    const disableAreaBtn = document.getElementById('area-disable-btn');
                    if (disableAreaBtn) {
                        disableAreaBtn.addEventListener('click', async () => {
                            if (!areaMeta) return;
                            const reactivating = areaMeta.disabled;

                            if (!reactivating && areaMeta.workerCount > 0) {
                                await showModal({
                                    type: 'warning',
                                    title: 'Área con trabajadores',
                                    message: 'No puedes desactivar esta area porque aún hay trabajadores asignados a esta area.',
                                    okText: 'Aceptar'
                                });
                                return;
                            }

                            const areaCargos = cargosInArea.filter(c => String(c.Area || '') === String(area));
                            if (reactivating) {
                                const inactiveCargos = areaCargos.filter(c => String(c.Estado || '').toLowerCase() !== 'activo');
                                if (!inactiveCargos.length) {
                                    await showModal({
                                        type: 'info',
                                        title: 'Área activada',
                                        message: 'Esta area ya está activada.',
                                        okText: 'Aceptar'
                                    });
                                    return;
                                }
                                if (!await showConfirm(`¿Desea reactivar todos los cargos en el área ${area}?`)) return;
                                try {
                                    for (const cargo of inactiveCargos) {
                                        await safePost(`/cargos/${cargo.Id_Cargo}/toggle`);
                                    }
                                    showSuccess('Área reactivada correctamente');
                                    renderCargosModule();
                                } catch (e) {
                                    showError(e.message);
                                }
                                return;
                            }

                            const areaActiveCargos = areaCargos.filter(c => String(c.Estado || '').toLowerCase() === 'activo');
                            if (!areaActiveCargos.length) {
                                await showModal({
                                    type: 'info',
                                    title: 'Área desactivada',
                                    message: 'Esta area ya está desactivada.',
                                    okText: 'Aceptar'
                                });
                                return;
                            }

                            if (!await showConfirm(`¿Desea desactivar todos los cargos en el área ${area}?`)) return;

                            try {
                                for (const cargo of areaActiveCargos) {
                                    await safePost(`/cargos/${cargo.Id_Cargo}/toggle`);
                                }
                                showSuccess('Área desactivada correctamente');
                                renderCargosModule();
                            } catch (e) {
                                showError(e.message);
                            }
                        });
                    }

                    attachCargoRowListeners(cargosInArea, container, new Set(), () => {});
                } catch (e) {
                    container.innerHTML = `<div class="error">Error: ${e.message}</div>`;
                }
            });
        });

        document.querySelectorAll('.btn-disable-area').forEach(btn => {
            btn.addEventListener('click', async () => {
                const area = btn.dataset.area;
                if (!area) return;
                const areaMeta = getAreaMetaByName(area);
                if (!areaMeta) return;

                const reactivating = areaMeta.disabled;
                const actionLabel = reactivating ? 'reactivar' : 'desactivar';

                if (!reactivating && areaMeta.workerCount > 0) {
                    await showModal({
                        type: 'warning',
                        title: 'Área con trabajadores',
                        message: 'No puedes desactivar esta area porque aún hay trabajadores asignados a esta area.',
                        okText: 'Aceptar'
                    });
                    return;
                }

                const areaCargos = cargos.filter(c => String(c.Area || '') === String(area));
                const targetCargos = areaCargos.filter(c => reactivating ? String(c.Estado || '').toLowerCase() !== 'activo' : String(c.Estado || '').toLowerCase() === 'activo');
                if (!targetCargos.length) {
                    await showModal({
                        type: 'info',
                        title: `Área ${reactivating ? 'activada' : 'desactivada'}`,
                        message: `Esta area ya está ${reactivating ? 'activada' : 'desactivada'}.`,
                        okText: 'Aceptar'
                    });
                    return;
                }

                if (!await showConfirm(`¿Desea ${actionLabel} todos los cargos en el área ${area}?`)) return;
                try {
                    for (const cargo of targetCargos) {
                        await safePost(`/cargos/${cargo.Id_Cargo}/toggle`);
                    }
                    showSuccess(`Área ${reactivating ? 'reactivada' : 'desactivada'} correctamente`);
                    renderCargosModule();
                } catch (e) {
                    showError(e.message);
                }
            });
        });
    }

    // Exponer globalmente
    window.renderAdminModuleV2 = renderAdminModuleV2;

})();