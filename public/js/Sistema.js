// --- Autenticación basada en sesión del servidor ---
let sessionUser = null;
async function checkSessionAsync() {
    // Usar los datos proporcionados por Laravel si existen
    if (window.laravelUser) {
        return {
            username: window.laravelUser.name,
            role: window.laravelUser.role,
            logged: true
        };
    }
    return null;
}
// --- Global safe fetch wrapper: prevents sending POSTs when session is expired ---
(function() {
    if (typeof window === 'undefined' || !window.fetch) return;
    const _origFetch = window.fetch.bind(window);
    window.fetch = async function(input, init) {
        // Si estamos en la página de login, evitamos cualquier intercepción para máxima velocidad
        if (window.location.pathname.toLowerCase().includes('login')) {
            return _origFetch(input, init);
        }

        try {
            const method = (init && init.method) ? String(init.method).toUpperCase() : 'GET';
            const url = (typeof input === 'string') ? input : (input && input.url) ? input.url : '';
            const lowerUrl = url.toLowerCase();

            // No interceptar peticiones de autenticación, logout, seguridad o verificación de vida
            const isAuthAction = lowerUrl.includes('login') || lowerUrl.includes('logout') || 
                                 lowerUrl.includes('seguridad') || lowerUrl.includes('session/alive');

            if (method === 'POST' && !isAuthAction) {
                try {
                    const aliveRes = await _origFetch('/session/alive', { credentials: 'same-origin', cache: 'no-store' });

                    if (!aliveRes.ok && (aliveRes.status === 401 || aliveRes.status === 419)) {
                        window.location.href = '/login';
                        return new Promise(() => {}); // Detiene la ejecución para evitar modales de error
                    }

                    const aliveData = aliveRes.ok ? await aliveRes.json().catch(() => ({})) : { alive: true };
                    if (aliveData.hasOwnProperty('alive') && aliveData.alive === false) {
                        window.location.href = '/login';
                        return new Promise(() => {}); // Detiene la ejecución para evitar modales de error
                    }
                } catch (e) {
                    // Si falla la verificación por red, no expulsar inmediatamente, dejar que la petición principal proceda
                    console.warn('Session check fail (network):', e);
                }
            }
        } catch (e) {
            // if anything goes wrong, fall back to original fetch
        }
        return _origFetch(input, init);
    };
})();
async function logout(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }

    const form = document.querySelector('form[action$="logout"]');
    let alive = false;

    try {
        const res = await fetch('/session/alive', { credentials: 'same-origin', cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            alive = data && data.alive;
        }
    } catch (e) {
        alive = false;
    }

    if (!alive) {
        window.location.href = '/login';
        return;
    }

    if (form) {
        form.submit();
        return;
    }

    const tokenMeta = document.querySelector('meta[name="csrf-token"]');
    const token = tokenMeta ? tokenMeta.getAttribute('content') : null;

    if (token) {
        const fallback = document.createElement('form');
        fallback.method = 'POST';
        fallback.action = '/logout';

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = '_token';
        input.value = token;

        fallback.appendChild(input);
        document.body.appendChild(fallback);
        fallback.submit();
        return;
    }

    window.location.href = '/login';
}
function setAuth(data) {
    if (data) {
        // En un sistema real esto iría a cookies o token
        sessionUser = data;
    } else {
        sessionUser = null;
    }
}

// Global helper to format date strings as local dates without timezone shifts
function formatLocalDate(dateString) {
    if (!dateString) return '-';
    const s = (dateString || '').toString().split('T')[0];
    const parts = s.split('-');
    if (parts.length !== 3) return dateString;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    try { return date.toLocaleDateString('es-VE'); } catch (e) { return date.toLocaleDateString(); }
}

const VACATION_MODAL_SESSION_KEY = 'vacationModalShownThisSession';
const VACATION_MODULE_VISITED_KEY = 'vacationModuleVisitedThisSession';

const eyeSvg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M1.5 12s4-7 10.5-7S22.5 12 22.5 12s-4 7-10.5 7S1.5 12 1.5 12z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const eyeOffSvg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M3 3l18 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.47 10.47A3 3 0 0113.53 13.53" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.21 12.7C3.67 15.55 7.17 18 12 18c6.5 0 10.5-6 10.5-6s-1.99-2.55-4.58-4.19" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// Modal helpers: showModal returns a Promise that resolves true/false for confirm-style dialogs
// Modal helpers: Modern, icon-based Modal System
function showModal(options) {
    return new Promise((resolve) => {
        const type = options.type || 'info'; // success, error, info, warning
        const title = options.title || (type === 'success' ? '¡Éxito!' : type === 'error' ? 'Error' : 'Atención');
        const message = options.message || '';
        const html = options.html || `<p>${message}</p>`;
        const okText = options.okText || 'Aceptar';
        const cancelText = options.cancelText || null;
        const modalClass = options.modalClass ? `modal-content ${options.modalClass}` : 'modal-content';
        const modalStyle = options.modalStyle ? `style="${options.modalStyle}"` : '';

        const icons = {
            success: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
            error: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
            info: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
            warning: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`
        };

        const overlay = document.createElement('div');
        overlay.className = `modal-overlay modal-${type}`;

        overlay.innerHTML = `
            <div class="${modalClass}" ${modalStyle}>
                <button class="modal-close-x">✖</button>
                <div class="modal-header">
                    <div class="modal-icon">${icons[type]}</div>
                    <h3 class="modal-title">${title}</h3>
                </div>
                <div class="modal-body" style="word-break: break-word; overflow-wrap: break-word;">${html}</div>
                <div class="modal-footer">
                    ${cancelText ? `<button class="modal-btn modal-cancel">${cancelText}</button>` : ''}
                    <button class="modal-btn modal-ok">${okText}</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        // Force reflow for animation
        overlay.offsetWidth;
        overlay.classList.add('modal-show');

        function close(result) {
            overlay.classList.remove('modal-show');
            resolve(result);
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }

        overlay.querySelector('.modal-ok').addEventListener('click', () => close(true));
        if (cancelText) {
            overlay.querySelector('.modal-cancel').addEventListener('click', () => close(false));
        }
        overlay.querySelector('.modal-close-x').addEventListener('click', () => close(false));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close(false);
        });
    });
}

const showSuccess = (msg, title) => showModal({ type: 'success', message: msg, title });
const showError = (msg, title) => showModal({ type: 'error', message: msg, title });
const showInfo = (msg, title) => showModal({ type: 'info', message: msg, title });
const showWarning = (msg, title) => showModal({ type: 'warning', message: msg, title });
const showConfirm = (msg, title = 'Confirmar') => showModal({ type: 'warning', message: msg, title, okText: 'Confirmar', cancelText: 'Cancelar' });
const showAlert = (msg, title) => showInfo(msg, title);

// --- 1. Definición de Módulos por Rol ---
const roleModules = {
    "SuperUsuario": {
        name: "SuperUsuario",
        description: "Acceso total para mantenimiento y configuración del sistema.",
        // Lista plana usada como fallback y para resúmenes
        modules: [
            "Inicio",
            "Gestión de Usuarios y Roles",
            "Generar Reportes de Usuario",
            "Registro de Trabajadores",
            "Pago de Nómina",
            "Panel de Permisos",
            "Gestión de Conceptos",
            "Gestión de Cargos",
            "Panel de Vacaciones",
            "Bitácora del Sistema"
        ],
        // Grupos colapsables para el sidebar del superusuario
        groups: [
            {
                id: 'super-own',
                label: 'SuperUsuario',
                color: '#a78bfa',          // violeta
                collapsible: true,
                defaultOpen: true,
                modules: [
                    { name: "Inicio",                    icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
                    { name: "Gestión de Usuarios y Roles", icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
                    { name: "Generar Reportes de Usuario", icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
                    { name: "Bitácora del Sistema",       icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' }
                ]
            },
            {
                id: 'super-admin',
                label: 'Funciones Administrativas',
                color: '#34d399',          // verde
                collapsible: true,
                defaultOpen: true,
                modules: [
                    { name: "Registro de Trabajadores",  icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="12" y1="17" x2="12" y2="23"/><line x1="9" y1="20" x2="15" y2="20"/></svg>' },
                    { name: "Pago de Nómina",            icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>' },
                    { name: "Panel de Permisos",          icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' },
                    { name: "Gestión de Conceptos",      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>' },
                    { name: "Gestión de Cargos",          icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>' },
                    { name: "Panel de Vacaciones",        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' }
                ]
            },
            {
                id: 'super-worker',
                label: 'Funciones del Trabajador',
                color: '#60a5fa',          // azul
                collapsible: true,
                defaultOpen: true,
                modules: [
                    { name: "Mi Perfil",                  icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
                    { name: "Historial de Pagos y Recibos", icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>' },
                    { name: "Solicitud de Vacaciones",    icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
                    { name: "Solicitud de Permisos",      icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' }
                ]
            }
        ]
    },
    "Administrativo": {
        name: "Administrativo",
        description: "Módulos principales para el proceso de cálculo y gestión de la nómina.",
        modules: [
            "Registro de Trabajadores",
            "Pago de Nómina",
            "Panel de Permisos",
            "Gestión de Conceptos",
            "Gestión de Cargos",
            "Panel de Vacaciones"
        ]
    },
    "Trabajador": {
        name: "Trabajador",
        description: "Módulos de autoservicio para la consulta de información personal.",
        modules: [
            "Mi Perfil",
            "Historial de Pagos y Recibos",
            "Solicitud de Vacaciones",
            "Solicitud de Permisos"
        ]
    }
};

// Nota: el mismo script se carga en `login.html` y en `Index.html`.
// Detectamos la página por la presencia de elementos y actuamos en consecuencia.

function initPayrollPage() {
    const sidebarNav = document.getElementById('module-navigation');
    const contentHeader = document.getElementById('content-header');
    const contentDetails = document.getElementById('content-details');
    const roleTabs = document.querySelectorAll('.role-tab');

    // Event listeners para las pestañas de rol (se ejecutan dentro de initPayrollPage para tener acceso a loadRoleView)
    if (roleTabs && roleTabs.length) {
        roleTabs.forEach(tab => {
            tab.addEventListener('click', function () {
                const role = this.getAttribute('data-role');
                loadRoleView(role);
            });
        });
    }

    function loadRoleView(roleName) {
        // Normalize role name and try to match case-insensitively if exact key is not present
        const desiredRole = (roleName || '').toString().trim();
        let roleData = roleModules[desiredRole] || roleModules[Object.keys(roleModules).find(k => k.toLowerCase() === desiredRole.toLowerCase())];
        if (!roleData) {
            console.warn('Rol no reconocido:', roleName, ' - mostrando vista por defecto (Administrativo)');
            roleData = roleModules['Administrativo'];
        }

        // guardar rol actual (usar la clave real encontrada)
        currentRole = Object.keys(roleModules).find(k => roleModules[k] === roleData) || 'Administrativo';

        // 1. Actualizar la barra lateral (Módulos) y agregar handlers
        if (sidebarNav) sidebarNav.innerHTML = '';

        // --- Sidebar especial para SuperUsuario con grupos colapsables ---
        if (desiredRole === 'SuperUsuario' && roleData.groups) {
            let firstModuleRendered = false;

            // Inyectar estilos del sidebar colapsable si no existen
            if (!document.getElementById('super-sidebar-styles')) {
                const styleEl = document.createElement('style');
                styleEl.id = 'super-sidebar-styles';
                styleEl.textContent = `
                    /* ── Grupo contenedor ──────────────────────────────────── */
                    .nav-group { margin-bottom: 0; }

                    /* ── Encabezado de grupo: badge pill de color ────────── */
                    .nav-group-header {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        padding: 8px 10px;
                        margin: 12px 8px 4px 8px;
                        font-size: 0.72rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.7px;
                        cursor: pointer;
                        user-select: none;
                        outline: none;
                        -webkit-tap-highlight-color: transparent;
                        transition: opacity 0.2s, color 0.2s;
                        /* color dinámico por grupo via CSS var */
                        color: var(--ng-color, rgba(255,255,255,0.7));
                        background: transparent;
                        border: none;
                    }
                    .nav-group-header:hover {
                        opacity: 0.85;
                    }

                    /* Icono del grupo */
                    .nav-group-header .ng-icon {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 22px;
                        height: 22px;
                        border-radius: 6px;
                        background: rgba(255,255,255,0.07);
                        flex-shrink: 0;
                        color: var(--ng-color, white);
                    }

                    /* Texto label */
                    .nav-group-header .ng-label {
                        flex: 1;
                        color: var(--ng-color, rgba(255,255,255,0.7));
                    }

                    /* Flecha */
                    .nav-group-header .group-arrow {
                        opacity: 0.5;
                        flex-shrink: 0;
                        transition: transform 0.25s ease, opacity 0.2s;
                        color: var(--ng-color, white);
                    }
                    .nav-group-header.open .group-arrow {
                        transform: rotate(90deg);
                        opacity: 1;
                    }

                    /* ── Cuerpo colapsable ───────────────────────────────── */
                    .nav-group-body {
                        overflow: hidden;
                        max-height: 0;
                        transition: max-height 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease;
                        opacity: 0;
                        /* barra lateral de color del grupo */
                        margin-left: 20px;
                        padding-left: 8px;
                        border-left: 2px solid var(--ng-color, rgba(255,255,255,0.15));
                    }
                    .nav-group-body.open {
                        max-height: 800px;
                        opacity: 1;
                    }

                    /* ── Links de módulo dentro de un grupo ─────────────── */
                    .nav-group-body .nav-link {
                        display: flex;
                        align-items: center;
                        gap: 9px;
                        padding: 9px 12px;
                        margin: 1px 0;
                        border-radius: 7px;
                        font-size: 0.88rem;
                        font-weight: 400;
                        color: rgba(255,255,255,0.65);
                        transition: background 0.15s, color 0.15s, padding-left 0.15s;
                    }
                    .nav-group-body .nav-link:hover {
                        background: rgba(255,255,255,0.07);
                        color: #ffffff;
                    }
                    .nav-group-body .nav-link.active {
                        background: rgba(255,255,255,0.12);
                        color: #ffffff;
                        font-weight: 600;
                    }
                    /* Icono del módulo */
                    .nav-group-body .nav-link .mod-icon {
                        display: flex;
                        align-items: center;
                        opacity: 0.55;
                        flex-shrink: 0;
                        transition: opacity 0.15s;
                    }
                    .nav-group-body .nav-link:hover .mod-icon,
                    .nav-group-body .nav-link.active .mod-icon {
                        opacity: 1;
                    }

                    /* ── Separador entre grupos ──────────────────────────── */
                    .nav-group-divider {
                        border: none;
                        border-top: 1px solid rgba(255,255,255,0.05);
                        margin: 4px 14px;
                    }
                `;
                document.head.appendChild(styleEl);
            }

            roleData.groups.forEach((group, groupIndex) => {
                // Separador entre grupos (excepto antes del primero)
                if (groupIndex > 0) {
                    const divider = document.createElement('hr');
                    divider.className = 'nav-group-divider';
                    sidebarNav.appendChild(divider);
                }

                // Contenedor del grupo
                const groupEl = document.createElement('div');
                groupEl.className = 'nav-group';

                let bodyEl = null;

                if (group.collapsible && group.label) {
                    // Encabezado colapsable con color de grupo
                    const headerEl = document.createElement('div');
                    headerEl.className = 'nav-group-header';
                    headerEl.style.setProperty('--ng-color', group.color || 'rgba(255,255,255,0.6)');
                    if (group.defaultOpen) headerEl.classList.add('open');

                    // Determinar icono del encabezado según id del grupo
                    const groupIcons = {
                        'super-own':    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
                        'super-admin':  '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
                        'super-worker': '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
                    };
                    headerEl.innerHTML = `
                        <span class="ng-icon">${groupIcons[group.id] || ''}</span>
                        <span class="ng-label">${group.label}</span>
                        <svg class="group-arrow" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    `;

                    // Cuerpo colapsable con barra de color
                    bodyEl = document.createElement('div');
                    bodyEl.className = 'nav-group-body';
                    bodyEl.style.setProperty('--ng-color', group.color || 'rgba(255,255,255,0.15)');
                    if (group.defaultOpen) bodyEl.classList.add('open');

                    // Toggle al hacer click en el encabezado
                    headerEl.addEventListener('click', () => {
                        const isOpen = bodyEl.classList.contains('open');
                        bodyEl.classList.toggle('open', !isOpen);
                        headerEl.classList.toggle('open', !isOpen);
                    });

                    groupEl.appendChild(headerEl);
                    groupEl.appendChild(bodyEl);
                } else {
                    // Sin encabezado (grupo plano): módulos directamente en el contenedor
                    bodyEl = groupEl;
                }

                // Agregar módulos al cuerpo del grupo
                group.modules.forEach((moduleItem) => {
                    // Soportar formato { name, icon } o string puro
                    const moduleName = (typeof moduleItem === 'object') ? moduleItem.name : moduleItem;
                    const moduleIcon = (typeof moduleItem === 'object' && moduleItem.icon) ? moduleItem.icon : '';

                    const link = document.createElement('a');
                    link.href = '#';
                    link.className = 'nav-link';
                    link.dataset.moduleName = moduleName;
                    link.innerHTML = moduleIcon
                        ? `<span class="mod-icon">${moduleIcon}</span><span>${moduleName}</span>`
                        : moduleName;

                    if (!firstModuleRendered) {
                        link.classList.add('active');
                        firstModuleRendered = true;
                    }

                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        sidebarNav.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
                        link.classList.add('active');
                        renderModule(moduleName);
                    });
                    bodyEl.appendChild(link);
                });

                sidebarNav.appendChild(groupEl);
            });

            // Renderizar primer módulo ("Inicio")
            if (roleData.groups[0] && roleData.groups[0].modules.length) {
                const firstMod = roleData.groups[0].modules[0];
                const firstModName = (typeof firstMod === 'object') ? firstMod.name : firstMod;
                renderModule(firstModName);
            }

        } else {
            // --- Sidebar estándar para Admin y Trabajador ---
            roleData.modules.forEach((moduleName, index) => {
                const link = document.createElement('a');
                link.href = "#";
                link.className = "nav-link";
                link.dataset.moduleName = moduleName;
                link.textContent = moduleName;

                // Agregar indicador de notificación para "Solicitud de Vacaciones" si ha pasado un año
                if (roleName === 'Trabajador' && moduleName === 'Solicitud de Vacaciones') {
                    link.innerHTML = `${moduleName} <span style="display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; border-radius:50%; border:1px solid #ffffff; background:#ffffff; color:#ff6b6b; font-weight:800; margin-left:8px; font-size:0.78rem;">!</span>`;
                    checkVacationEligibility().then(canRequest => {
                        if (!canRequest) { link.textContent = moduleName; }
                    }).catch(err => {
                        console.error('Error checking vacation eligibility:', err);
                        link.textContent = moduleName;
                    });
                }

                if (index === 0) link.classList.add('active');
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    sidebarNav.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
                    link.classList.add('active');
                    renderModule(moduleName);
                });
                if (sidebarNav) sidebarNav.appendChild(link);
            });

            // renderizar primer módulo por defecto
            if (roleData.modules && roleData.modules.length) renderModule(roleData.modules[0]);
        }

        // 2. Actualizar el contenido principal resumen
        if (contentHeader) contentHeader.innerHTML = `<h4>Rol Actual: ${roleData.name}</h4>`;

        // 3. Activar la pestaña correcta (visual)
        if (roleTabs) roleTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-role') === roleName) tab.classList.add('active');
        });
    }

    // Exponer la función globalmente para evitar errores si se invoca desde fuera (compatibilidad)
    window.loadRoleView = loadRoleView;

    // --- variables y helpers para módulos ---
    let currentRole = 'Administrativo';

    function renderModule(moduleName) {
        window.currentActiveModule = moduleName;
        if (currentRole === 'Trabajador' && moduleName === 'Solicitud de Vacaciones') {
            sessionStorage.setItem(VACATION_MODULE_VISITED_KEY, 'true');
            updateVacationBadge();
        }
        const role = currentRole;
        if (contentHeader) {
            if (role === 'SuperUsuario') {
                contentHeader.innerHTML = `<h4>${moduleName}</h4>`;
            } else {
                contentHeader.innerHTML = `<h4>${role} - ${moduleName}</h4>`;
            }
        }

        if (role === 'Administrativo') return renderAdminModule(moduleName);
        if (role === 'Trabajador') {
            if (typeof window.renderWorkerModuleV2 === 'function') {
                return window.renderWorkerModuleV2(moduleName);
            }
            return renderWorkerModule(moduleName);
        }
        if (role === 'SuperUsuario') return renderSuperModule(moduleName);
        if (contentDetails) contentDetails.innerHTML = `<p>Módulo no implementado.</p>`;
    }

    /* Helpers comunes */
    // Empleados ahora se gestionan en backend (settings.php key: payroll_employees)
    function getEmployees() { return []; }
    function saveEmployees(list) { /* use settings.php via UI */ }

    async function updateVacationBadge() {
        const sidebarNav = document.getElementById('module-navigation');
        if (!sidebarNav) return;
        const link = sidebarNav.querySelector('.nav-link[data-module-name="Solicitud de Vacaciones"]');
        if (!link) return;

        const canRequest = await checkVacationEligibility();
        if (canRequest) {
            link.innerHTML = `Solicitud de Vacaciones <span style="display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; border-radius:50%; border:1px solid #ffffff; background:#ffffff; color:#ff6b6b; font-weight:800; margin-left:8px; font-size:0.78rem;">!</span>`;
        } else {
            link.textContent = 'Solicitud de Vacaciones';
        }
    }
    window.updateVacationBadge = updateVacationBadge;

    // Función para verificar si el trabajador puede solicitar vacaciones (ha pasado un año desde ingreso)
    async function checkVacationEligibility() {
        console.log('Checking vacation eligibility...');
        try {
            const response = await fetch('/trabajador/vacations-data', {
                headers: { 'Accept': 'application/json' }
            });
            console.log('Fetch response ok:', response.ok);
            const data = await response.json();
            console.log('Data received:', data);

            if (!response.ok || !data.fechaIngreso) {
                console.log('Response not ok or no fechaIngreso');
                return false;
            }

            // Reiniciar estado si la fecha de ingreso cambió en el servidor
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

            const hireDate = new Date(data.fechaIngreso);
            const today = new Date();
            const oneYearAgo = new Date(today);
            oneYearAgo.setFullYear(today.getFullYear() - 1);

            const isOneYearOld = hireDate <= oneYearAgo;
            const hasPendingOrApproved = data.lastRequest && ['Pendiente', 'Aceptada'].includes(data.lastRequest.Estado);
            const alreadySubmitted = localStorage.getItem('vacationRequestSent') === 'true';
            const isDismissed = localStorage.getItem('vacationNoticeDismissed') === 'true';
            const moduleVisited = sessionStorage.getItem(VACATION_MODULE_VISITED_KEY) === 'true';

            console.log('isOneYearOld:', isOneYearOld, 'hasPendingOrApproved:', hasPendingOrApproved, 'alreadySubmitted:', alreadySubmitted, 'isDismissed:', isDismissed, 'moduleVisited:', moduleVisited);

            const eligible = isOneYearOld && !hasPendingOrApproved && !alreadySubmitted && !isDismissed && !moduleVisited;
            console.log('Eligible:', eligible);
            return eligible;
        } catch (error) {
            console.error('Error checking vacation eligibility:', error);
            return false;
        }
    }

    // --- Settings Hub: Floating Gear Instantiation ---
    initSettingsHub();

    function initSettingsHub() {
        if (document.getElementById('settings-fab')) return; // Already exists

        // 1. Inject FAB (Floating Action Button)
        const fab = document.createElement('button');
        fab.id = 'settings-fab';
        fab.className = 'settings-fab fade-in';
        fab.title = 'Configuración del Sistema';
        const svgDataURI = "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='3'%3E%3C/circle%3E%3Cpath d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z'%3E%3C/path%3E%3C/svg%3E";
        fab.innerHTML = '<img src="' + svgDataURI + '" alt="Ajustes" style="width: 20px; height: 20px; display: block;" />';

        const actionsContainer = document.getElementById('user-actions-container');
        if (actionsContainer) {
            actionsContainer.appendChild(fab);
        } else {
            document.body.appendChild(fab);
        }

        // 2. Build the Modal
        const modalHtml = `
            <div class="settings-panel">
                <style>
                    .settings-fab {
                        width: 38px; height: 38px; flex-shrink: 0;
                        border-radius: 6px; background: rgba(255,255,255,0.1); color: #ffffff; border: 1px solid rgba(255,255,255,0.3);
                        cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
                    }
                    .settings-fab:hover { background: rgba(255,255,255,0.25); color: #fff; transform: rotate(90deg); border-color: rgba(255,255,255,0.6); }
                    
                    .settings-modal {
                        position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 10000;
                        display: none; align-items: center; justify-content: center; backdrop-filter: blur(2px);
                    }
                    .settings-modal.active { display: flex; animation: modalFadeIn 0.2s ease-out; }
                    .settings-card {
                        background: var(--card-bg); width: 90%; max-width: 480px; border-radius: 16px;
                        padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); position: relative;
                        border: 1px solid var(--border-color, #e0e6ed); transform: translateY(20px); opacity: 0;
                    }
                    .settings-modal.active .settings-card { animation: cardSlideUp 0.3s ease-out forwards; }
                    
                    @keyframes cardSlideUp { to { transform: translateY(0); opacity: 1; } }
                    
                    .set-group { margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid var(--border-color, #f1f3f5); }
                    .set-group:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
                    .set-title { font-size: 1.1em; font-weight: 700; color: var(--text-main); margin: 0 0 15px 0; display: flex; align-items: center; gap: 8px; }
                    
                    .color-picker { display: flex; gap: 15px; }
                    .c-btn { width: 40px; height: 40px; border-radius: 50%; border: 3px solid transparent; cursor: pointer; transition: 0.2s; }
                    .c-btn:hover { transform: scale(1.1); }
                    .c-btn.active { border-color: var(--text-main); transform: scale(1.1); box-shadow: 0 0 10px rgba(255,255,255,0.2); }
                    
                    .density-btn {
                        flex: 1; padding: 10px; border: 1px solid var(--border-color, #ddd); background: transparent;
                        color: var(--text-main); border-radius: 8px; cursor: pointer; font-weight: 600;
                    }
                    .density-btn.active { background: var(--primary); color: white; border-color: var(--primary); }

                    .timeout-btn {
                        flex: 1; padding: 9px 6px; border: 1px solid var(--border-color, #ddd); background: transparent;
                        color: var(--text-main); border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.82em;
                        transition: all 0.18s ease; text-align: center;
                    }
                    .timeout-btn:hover { border-color: var(--primary); color: var(--primary); }
                    .timeout-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
                    .timeout-btn.active-off { background: #ef4444; color: white; border-color: #ef4444; }

                    .theme-switch input:checked + .slider { background-color: #666; }
                    .theme-switch input:checked + .slider .knob { left: 28px !important; }
                </style>
                <div id="settings-modal" class="settings-modal">
                    <div class="settings-card">
                        <button id="close-settings" style="position: absolute; top: 20px; right: 20px; background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.5em;">✖</button>
                        <h3 style="margin: 0 0 25px 0; color: var(--text-main); font-size: 1.5em; border-bottom: 2px solid var(--primary); padding-bottom: 10px; display: inline-block;">⚙️ Configuración Global</h3>
                        
                        <div class="set-group">
                            <h4 class="set-title">🌗 Tema visual</h4>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: var(--text-muted); font-size: 0.95em;">Activar modo nocturno</span>
                                <label class="theme-switch" style="position: relative; display: inline-block; width: 50px; height: 26px;">
                                    <input type="checkbox" id="fab-dark-mode" style="opacity: 0; width: 0; height: 0;">
                                    <span class="slider round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;">
                                        <span class="knob sun" style="position: absolute; height: 18px; width: 18px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px;"></span>
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div class="set-group">
                            <h4 class="set-title">🎨 Color de Acento</h4>
                            <div class="color-picker">
                                <button class="c-btn active" data-color="charcoal" style="background: #333333;" title="Carboncillo"></button>
                                <button class="c-btn" data-color="steel" style="background: #4a5568;" title="Acero"></button>
                                <button class="c-btn" data-color="stone" style="background: #718096;" title="Piedra"></button>
                            </div>
                        </div>

                        <div class="set-group">
                            <h4 class="set-title">📐 Densidad</h4>
                            <div style="display: flex; gap: 10px;">
                                <button class="density-btn active" data-density="normal">Normal</button>
                                <button class="density-btn" data-density="compact">Compacta</button>
                            </div>
                        </div>

                        <div class="set-group">
                            <h4 class="set-title">⏱️ Expiración de Sesión</h4>
                            <p style="margin: 0 0 12px; font-size: 0.82em; color: var(--text-muted);">Cierre automático por inactividad</p>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                <button class="timeout-btn" data-timeout="30">30 seg</button>
                                <button class="timeout-btn active" data-timeout="60">1 min</button>
                                <button class="timeout-btn" data-timeout="120">2 min</button>
                                <button class="timeout-btn active-off" data-timeout="off">Desactivar</button>
                            </div>
                        </div>

                        <div class="set-group" id="set-group-security">
                            <h4 class="set-title">🔒 Cuenta y Seguridad</h4>
                            <p style="margin: 0 0 12px; font-size: 0.82em; color: var(--text-muted);">Configura tus preguntas de seguridad y opciones de acceso.</p>
                            <a id="btn-go-security" href="#" style="display:inline-flex; align-items:center; gap:8px; padding: 10px 18px; background: var(--primary); color: #fff; border-radius: 8px; font-weight: 600; font-size: 0.9em; text-decoration: none; transition: opacity 0.2s;">
                                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                Ir a Seguridad
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Wire the security button to the correct route based on role
        const btnSecurity = document.getElementById('btn-go-security');
        if (btnSecurity) {
            btnSecurity.href = '/seguridad/configurar-preguntas';
        }

        const modal = document.getElementById('settings-modal');
        const btnDark = document.getElementById('fab-dark-mode');
        const knob = modal.querySelector('.knob');

        // Modal toggling
        fab.addEventListener('click', () => modal.classList.add('active'));
        document.getElementById('close-settings').addEventListener('click', () => modal.classList.remove('active'));
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

        // Dark Mode Logic
        const sunIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2"/></svg>`;
        const moonIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="black"/></svg>`;
        if (localStorage.getItem('theme') === 'dark' || document.body.classList.contains('dark-mode')) {
            btnDark.checked = true; knob.classList.add('moon'); knob.classList.remove('sun'); knob.innerHTML = moonIcon;
        } else {
            knob.classList.add('sun'); knob.classList.remove('moon'); knob.innerHTML = sunIcon;
        }
        btnDark.addEventListener('change', function () {
            if (this.checked) {
                document.body.classList.add('dark-mode'); localStorage.setItem('theme', 'dark');
                knob.classList.add('moon'); knob.classList.remove('sun'); knob.innerHTML = moonIcon;
            } else {
                document.body.classList.remove('dark-mode'); localStorage.setItem('theme', 'light');
                knob.classList.add('sun'); knob.classList.remove('moon'); knob.innerHTML = sunIcon;
            }
        });

        window.addEventListener('storage', (e) => {
            if (e.key === 'theme') {
                if (e.newValue === 'dark') {
                    document.body.classList.add('dark-mode');
                    if (btnDark) btnDark.checked = true;
                    if (knob) { knob.classList.add('moon'); knob.classList.remove('sun'); knob.innerHTML = moonIcon; }
                } else {
                    document.body.classList.remove('dark-mode');
                    if (btnDark) btnDark.checked = false;
                    if (knob) { knob.classList.add('sun'); knob.classList.remove('moon'); knob.innerHTML = sunIcon; }
                }
            }
        });

        // Color Logic
        const colorBtns = modal.querySelectorAll('.c-btn');
        const applyColor = (color) => {
            const root = document.documentElement;
            // Map names to specific Hex variables
            const colorMap = {
                'charcoal': { p: '#333333', h: '#000000' },
                'steel': { p: '#4a5568', h: '#2d3748' },
                'stone': { p: '#718096', h: '#4a5568' }
            };
            if (colorMap[color]) {
                root.style.setProperty('--primary', colorMap[color].p);
                root.style.setProperty('--primary-hover', colorMap[color].h);
                // Also override inline styles in blade
                document.body.style.setProperty('--primary', colorMap[color].p);
                document.body.style.setProperty('--primary-hover', colorMap[color].h);
            }
            colorBtns.forEach(b => b.classList.remove('active'));
            const activeBtn = Array.from(colorBtns).find(b => b.dataset.color === color);
            if (activeBtn) activeBtn.classList.add('active');
            localStorage.setItem('primaryColor', color);
        };
        const savedColor = localStorage.getItem('primaryColor') || 'charcoal';
        applyColor(savedColor);
        colorBtns.forEach(btn => btn.addEventListener('click', () => applyColor(btn.dataset.color)));

        // Density Logic
        const densityBtns = modal.querySelectorAll('.density-btn');
        const applyDensity = (density) => {
            if (density === 'compact') document.body.classList.add('compact');
            else document.body.classList.remove('compact');

            densityBtns.forEach(b => b.classList.remove('active'));
            const activeBtn = Array.from(densityBtns).find(b => b.dataset.density === density);
            if (activeBtn) activeBtn.classList.add('active');
            localStorage.setItem('density', density);
        };
        const savedDensity = localStorage.getItem('density') || 'normal';
        applyDensity(savedDensity);
        densityBtns.forEach(btn => btn.addEventListener('click', () => applyDensity(btn.dataset.density)));

        // Session Timeout Logic
        const timeoutBtns = modal.querySelectorAll('.timeout-btn');
        const applyTimeout = (value) => {
            timeoutBtns.forEach(b => {
                b.classList.remove('active', 'active-off');
            });
            const activeBtn = Array.from(timeoutBtns).find(b => b.dataset.timeout === value);
            if (activeBtn) {
                activeBtn.classList.add(value === 'off' ? 'active-off' : 'active');
            }

            // Guardar por usuario para que el cambio NO afecte a otros usuarios
            try {
                const u = window.laravelUser || null;
                const id = u && (u.id || u.userId || u.user_id);
                const lsKey = id ? `sessionTimeout_${id}` : 'global';
                localStorage.setItem(lsKey, value);
            } catch (e) {
                // Fallback: no romper UI
            }

            // Notificar a session-timeout.js sin recargar la página (incluye lsKey para evitar afectar otros usuarios)
            window.dispatchEvent(new CustomEvent('sessionTimeoutChanged', { detail: { value, lsKey: (() => {
                const u = window.laravelUser || null;
                const id = u && (u.id || u.userId || u.user_id);
                return id ? `sessionTimeout_${id}` : 'global';
            })() } }));
        };
        // Leer por usuario (si existe) para que cada sesión use su propia configuración
        let savedTimeout = '60';
        try {
            const u = window.laravelUser || null;
            const id = u && (u.id || u.userId || u.user_id);
            const lsKey = id ? `sessionTimeout_${id}` : 'global';
            savedTimeout = localStorage.getItem(lsKey) || '60';
        } catch (e) {
            savedTimeout = '60';
        }
        applyTimeout(savedTimeout);
        timeoutBtns.forEach(btn => btn.addEventListener('click', () => applyTimeout(btn.dataset.timeout)));
    }

    // --- Implementaciones Administrativo ---
    function renderAdminModule(name) {
        // Always try V2 first for administrative modules
        if (typeof window.renderAdminModuleV2 === 'function') {
            return window.renderAdminModuleV2(name);
        }

        if (!contentDetails) return;

        // Registro de Trabajadores
        if (name.toLowerCase().includes('registro') && name.toLowerCase().includes('trabajador')) {
            renderWorkerRegistration();
            return;
        }

        // Pago de Nómina
        if (name.toLowerCase().includes('pago') && name.toLowerCase().includes('nómina')) {
            renderPayrollPayment();
            return;
        }

        // Panel de Permisos
        if (name.toLowerCase().includes('permiso') || (name.toLowerCase().includes('panel') && name.toLowerCase().includes('permisos'))) {
            renderAdminPermissionsPanel();
            return;
        }

        // Tipo de Nomina (compatibilidad antigua)
        if (name.toLowerCase().includes('tipo') && name.toLowerCase().includes('nomina')) {
            renderTipoNominaModule();
            return;
        }

        if (name.toLowerCase().includes('cálcul') || name.toLowerCase().includes('calcul')) {
            contentDetails.innerHTML = `
                <div>
                    <h4>Calculadora de Nómina</h4>
                    <label>Salario bruto: <input id="pay-gross" type="number" value="1000"/></label>
                    <label>Impuesto %: <input id="pay-tax" type="number" value="10"/></label>
                    <button id="calc-pay" class="primary">Calcular</button>
                    <div id="pay-result" style="margin-top:10px"></div>
                </div>`;
            document.getElementById('calc-pay').addEventListener('click', () => {
                const gross = Number(document.getElementById('pay-gross').value) || 0;
                const tax = Number(document.getElementById('pay-tax').value) || 0;
                const net = gross * (1 - tax / 100);
                document.getElementById('pay-result').textContent = `Salario neto: $${net.toFixed(2)}`;
            });
            return;
        }
        if (name.toLowerCase().includes('emplead')) {
            // Gestión simple de empleados guardada en settings.php (key: payroll_employees)
            contentDetails.innerHTML = `<div><h4>Gestión de Empleados</h4><button id="add-emp" class="primary">Agregar</button><div id="emp-list" style="margin-top:12px"></div></div>`;
            const listEl = document.getElementById('emp-list');
            async function loadEmployees() { try { const r = await fetch('./includes/settings.php?key=payroll_employees', { cache: 'no-store' }); if (!r.ok) return []; const txt = await r.text(); try { return JSON.parse(txt) || []; } catch (e) { return []; } } catch (e) { return []; } }
            async function saveEmployeesToServer(list) { try { await fetch('./includes/settings.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'payroll_employees', value: list }) }); } catch (e) { /* ignore */ } }
            async function refresh() { const a = await loadEmployees(); if (!a || a.length === 0) { listEl.innerHTML = '<p>No hay empleados.</p>'; return; } listEl.innerHTML = `<table><thead><tr><th>Nombre</th><th>Cargo</th><th></th></tr></thead><tbody>${a.map((e, i) => `<tr><td>${e.name}</td><td>${e.role || ''}</td><td><button data-i="${i}" class="del-emp">Eliminar</button></td></tr>`).join('')}</tbody></table>`; listEl.querySelectorAll('.del-emp').forEach(b => b.addEventListener('click', async () => { const idx = Number(b.getAttribute('data-i')); const arr = await loadEmployees(); arr.splice(idx, 1); await saveEmployeesToServer(arr); refresh(); })); }
            document.getElementById('add-emp').addEventListener('click', async () => { const name = prompt('Nombre'); if (!name) return; const role = prompt('Cargo') || ''; const arr = await loadEmployees(); arr.push({ name, role }); await saveEmployeesToServer(arr); refresh(); });
            refresh();
            return;
        }
        if (name.toLowerCase().includes('novedad')) {
            contentDetails.innerHTML = `<div><h4>Registro de Novedades</h4><label>Empleado: <input id="n-emp"/></label><label>Tipo: <input id="n-type"/></label><label>Monto: <input id="n-amt" type="number"/></label><button id="n-save" class="primary">Guardar</button><div id="n-list" style="margin-top:12px"></div></div>`;
            // Novedades ahora en backend
            async function loadNovedades() {
                try {
                    const res = await fetch('./includes/reports/novedades.php', { cache: 'no-store' });
                    if (!res.ok) return [];
                    return await res.json();
                } catch (e) { return []; }
            }
            document.getElementById('n-save').addEventListener('click', async () => {
                const emp = document.getElementById('n-emp').value.trim();
                const type = document.getElementById('n-type').value.trim();
                const amt = Number(document.getElementById('n-amt').value) || 0;
                if (!emp || !type) { await showAlert('Empleado y tipo requeridos'); return; }
                try {
                    const r = await fetch('./includes/reports/novedades.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ emp, tipo: type, amt }) });
                    if (!r.ok) throw new Error('Error al guardar');
                    renderNovedades();
                } catch (e) { await showAlert('Error al guardar la novedad'); }
            });
            async function renderNovedades() {
                const arr = await loadNovedades();
                document.getElementById('n-list').innerHTML = arr.length ? arr.map(n => `<div>${n.fecha} - ${n.emp} - ${n.tipo} - $${n.monto}</div>`).join('') : '<p>No hay novedades.</p>';
            }
            renderNovedades();
            return;
        }
        if (name.toLowerCase().includes('reporte')) {
            contentDetails.innerHTML = `<div><h4>Generar Reportes de Usuario</h4><button id="gen-rep" class="primary">Generar CSV</button></div>`;
            document.getElementById('gen-rep').addEventListener('click', async () => {
                const emps = await loadWorkersFromServer();
                const nov = await loadNovedades();
                let csv = 'id,name,role\n';
                emps.forEach((e, i) => csv += `${i + 1},"${e.Nombre_Completo || (e.name || '')}","${e.Nombre_rol || (e.role || '')}"\n`);
                csv += '\nNOVEDADES\ndate,emp,type,amt\n';
                nov.forEach(n => csv += `${n.fecha},"${n.emp}","${n.tipo}",${n.monto}\n`);
                const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'reporte.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
            });
            return;
        }
        if (name.toLowerCase().includes('concept')) {
            renderConceptosModule();
            return;
        }
        if (name.toLowerCase().includes('cargo')) {
            renderCargosModule();
            return;
        }
        if (name.toLowerCase().includes('panel') && name.toLowerCase().includes('vacaciones')) {
            renderAdminVacations();
            return;
        }
        if (name.toLowerCase().includes('panel') && name.toLowerCase().includes('vacaciones')) {
            renderAdminVacations();
            return;
        }
        contentDetails.innerHTML = `<p>Módulo '${name}' no implementado (Administrativo).</p>`;
    }

    // --- Admin Vacation Panel ---
    async function renderAdminVacations() {
        contentDetails.innerHTML = `
            <div class="vacation-panel">
                <h4>Panel de Vacaciones</h4>
                <p>Gestiona las solicitudes de vacaciones de los trabajadores.</p>
                <div id="vacation-requests-list">Cargando solicitudes...</div>
            </div>
        `;

        try {
            const res = await fetch('./includes/vacations/list_requests.php', { cache: 'no-store', credentials: 'same-origin' });
            if (!res.ok) {
                const txt = await res.text().catch(() => '');
                throw new Error(`Server returned ${res.status}: ${txt || res.statusText}`);
            }
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            const requests = data.requests || [];

            const listEl = document.getElementById('vacation-requests-list');

            if (requests.length === 0) {
                listEl.innerHTML = '<div class="alert-info">No hay solicitudes de vacaciones pendientes.</div>';
                return;
            }

            let html = `
                <table style="width:100%; border-collapse:collapse; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                    <thead>
                        <tr style="background:#3498db; color:#fff;">
                            <th style="padding:12px;">Fecha Solicitud</th>
                            <th style="padding:12px;">Trabajador</th>
                            <th style="padding:12px;">Cédula</th>
                            <th style="padding:12px;">Fecha Ingreso</th>
                            <th style="padding:12px;">Inicio Vacaciones</th>
                            <th style="padding:12px;">Estado</th>
                            <th style="padding:12px;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            requests.forEach(r => {
                const statusColor = r.Estado === 'Aceptada' ? '#2ecc71' : (r.Estado === 'Rechazada' ? '#e74c3c' : '#f39c12');
                html += `
                    <tr style="border-bottom:1px solid #f0f0f0;">
                        <td style="padding:12px;">${formatLocalDate(r.Fecha_Solicitud)}</td>
                        <td style="padding:12px;"><strong>${r.Nombre_Completo} ${r.Apellidos}</strong></td>
                        <td style="padding:12px;">${r.Documento_Identidad}</td>
                        <td style="padding:12px;">${formatLocalDate(r.Fecha_de_Ingreso)}</td>
                        <td style="padding:12px;">${formatLocalDate(r.Fecha_Inicio_Vacaciones)}</td>
                        <td style="padding:12px;"><span style="background:${statusColor}; color:#fff; padding:4px 10px; border-radius:12px; font-size:0.85em;">${r.Estado}</span></td>
                        <td style="padding:12px; text-align:center;">
                            ${r.Estado === 'Pendiente' ? `
                                <button class="btn-vacation-action" data-id="${r.Id_Solicitud}" data-status="Aceptada" style="background:#2ecc71; color:#fff; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; margin-right:5px;">Aceptar</button>
                                <button class="btn-vacation-action" data-id="${r.Id_Solicitud}" data-status="Rechazada" style="background:#e74c3c; color:#fff; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">Rechazar</button>
                            ` : '-'}
                        </td>
                    </tr>
                `;
            });

            html += '</tbody></table>';
            listEl.innerHTML = html;

            listEl.querySelectorAll('.btn-vacation-action').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.id;
                    const status = btn.dataset.status;
                    if (!await showConfirm(`¿Desea ${status === 'Aceptada' ? 'aceptar' : 'rechazar'} esta solicitud?`)) return;

                    try {
                        const r = await fetch('./includes/vacations/update_status.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id, status })
                        });
                        if (r.ok) {
                            await safePost(`/payroll/${id}/status`, { action: 'annul' });
                            showSuccess('Recibo anulado correctamente.');
                            const data = await apiFetch('/payroll/history');
                            await renderAdminPayslips(data || []);
                        }
                    } catch (e) {
                        showError(e.message);
                        btn.disabled = false;
                    }
                });
            });

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

        } catch (e) {
            const listEl = document.getElementById('vacation-requests-list');
            console.error('Error loading vacation requests:', e);
            listEl.innerHTML = `<p style="color:red">Error cargando solicitudes: ${e.message}</p>`;
        }
    }

    async function renderAdminPermissionsPanel() {
        if (!contentDetails) return;
        contentDetails.innerHTML = '<div class="loader">Cargando panel de permisos...</div>';
        contentDetails.innerHTML = `
            <div class="permissions-panel">
                <h4 style="margin-top:0; color: var(--text-main); border-bottom: 2px solid var(--primary); padding-bottom: 10px;">Panel de Permisos</h4>
                <p>Gestiona las solicitudes de permisos laborales de los trabajadores.</p>
                <div id="permissions-requests-list" style="margin-top:24px;">Cargando solicitudes de permisos...</div>
            </div>
        `;

        const listEl = document.getElementById('permissions-requests-list');

        async function loadPermissionRequests() {
            try {
                const res = await fetch('/administrativo/permission-requests', {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                if (!res.ok) throw new Error('No endpoint disponible');
                const data = await res.json();
                if (Array.isArray(data.requests)) return data.requests;
            } catch (e) {
                // Silenciar el error en consola
            }
            return [];
        }

        function normalizePermissionWorkerName(r) {
            const explicitFullName = r.Nombre_Completo || r.Nombre_completo || r.NombreCompleto || r['Nombre completo'] || r.Nombre_Trabajador || r.trabajador_nombre || r.FullName || r.fullName || r.full_name || r['full name'] || r.WorkerName || r.workerName || r.worker_name;
            const first = r.Nombre || r.Nombres || r.nombre || r.nombres || r.FirstName || r.firstname || r.first_name;
            const last = r.Apellidos || r.Apellido || r.apellidos || r.apellido || r.LastName || r.lastname || r.last_name;
            const fallback = r.Trabajador || r.trabajador || r.Worker || r.worker;

            if (explicitFullName) {
                const full = String(explicitFullName).trim();
                if (/\s+/.test(full)) return full;
                if (last) return `${full} ${String(last).trim()}`.trim();
                if (first) return `${String(first).trim()} ${full}`.trim();
                return full;
            }
            if (first || last) return [first, last].filter(Boolean).join(' ').trim();
            if (fallback) return String(fallback).trim();
            return 'Desconocido';
        }

        const requests = await loadPermissionRequests();
        if (!requests.length) {
            listEl.innerHTML = '<div class="alert-info">No hay solicitudes de permisos registradas.</div>';
            return;
        }

        if (window.currentActiveModule && window.currentActiveModule !== 'Panel de Permisos') return;
        
        listEl.innerHTML = `
            <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse;" id="perm-table-sistema">
                    <thead>
                        <tr style="background: var(--primary); color: #fff;">
                            <th style="padding:12px; text-align:left;">Fecha</th>
                            <th style="padding:12px; text-align:left;">Trabajador</th>
                            <th style="padding:12px; text-align:left;">Tiempo solicitado</th>
                            <th style="padding:12px; text-align:left;">Motivo</th>
                            <th style="padding:12px; text-align:left;">Estado</th>
                            <th style="padding:12px; text-align:left;">Acciones</th>
                        </tr>
                        <tr style="background:rgba(0,0,0,0.04);">
                            <td style="padding:6px;"><input id="v1-f-fecha" type="date" style="width:100%;padding:5px;border-radius:5px;border:1px solid var(--border-color);font-size:0.82rem;background:var(--bg-color);color:var(--text-main);"></td>
                            <td style="padding:6px;"><input id="v1-f-trabajador" placeholder="Filtrar..." style="width:100%;padding:5px;border-radius:5px;border:1px solid var(--border-color);font-size:0.82rem;background:var(--bg-color);color:var(--text-main);"></td>
                            <td style="padding:6px;"><input id="v1-f-tiempo" placeholder="Filtrar..." style="width:100%;padding:5px;border-radius:5px;border:1px solid var(--border-color);font-size:0.82rem;background:var(--bg-color);color:var(--text-main);"></td>
                            <td style="padding:6px;text-align:center;font-size:0.82rem;color:var(--text-muted);">Sin filtro</td>
                            <td style="padding:6px;">
                                <select id="v1-f-estado" style="width:100%;padding:5px;border-radius:5px;border:1px solid var(--border-color);font-size:0.82rem;background:var(--bg-color);color:var(--text-main);">
                                    <option value="">Todos</option>
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Aprobado">Aprobado</option>
                                    <option value="Rechazado">Rechazado</option>
                                </select>
                            </td>
                            <td style="padding:6px;text-align:center;font-size:0.82rem;color:var(--text-muted);">Sin filtro</td>
                        </tr>
                    </thead>
                    <tbody id="v1-tbody">
                    </tbody>
                </table>
            </div>
        `;

        function applyV1Filters() {
            const fFecha = document.getElementById('v1-f-fecha')?.value || '';
            const fTrab = (document.getElementById('v1-f-trabajador')?.value || '').toLowerCase();
            const fTiempo = (document.getElementById('v1-f-tiempo')?.value || '').toLowerCase();
            const fEstado = document.getElementById('v1-f-estado')?.value || '';

            const tbody = document.getElementById('v1-tbody');
            if (!tbody) return;

            const filtered = requests.filter(r => {
                const rFecha = r.Fecha || '';
                const rTrab = normalizePermissionWorkerName(r).toLowerCase();
                const rTiempo = (r.Tiempo || '').toLowerCase();
                const rEstado = r.Estado || '';

                return (!fFecha || rFecha === fFecha) &&
                       (!fTrab || rTrab.includes(fTrab)) &&
                       (!fTiempo || rTiempo.includes(fTiempo)) &&
                       (!fEstado || rEstado === fEstado);
            });

            tbody.innerHTML = filtered.map(r => {
                const workerName = normalizePermissionWorkerName(r);
                return `
                <tr style="border-bottom:1px solid var(--border-color); background: var(--card-bg);">
                    <td style="padding:12px; vertical-align:top;">${r.Fecha}</td>
                    <td style="padding:12px; vertical-align:top;">${workerName}</td>
                    <td style="padding:12px; vertical-align:top;">${r.Tiempo}</td>
                    <td style="padding:12px; vertical-align:top;">${r.Motivo}</td>
                    <td style="padding:12px; vertical-align:top;"><span style="padding:5px 10px; border-radius:999px; background:${r.Estado === 'Aprobado' ? '#2ecc71' : r.Estado === 'Rechazado' ? '#e74c3c' : '#f39c12'}; color:#fff; font-weight:700;">${r.Estado}</span></td>
                    <td style="padding:12px; vertical-align:top;">
                        ${r.Estado === 'Pendiente' ? `
                            <button class="btn-permission-action" data-id="${r.id}" data-action="approve" style="margin-right:6px; background:#2ecc71; border:none; color:#fff; padding:7px 12px; border-radius:8px; cursor:pointer;">Aprobar</button>
                            <button class="btn-permission-action" data-id="${r.id}" data-action="reject" style="background:#e74c3c; border:none; color:#fff; padding:7px 12px; border-radius:8px; cursor:pointer;">Rechazar</button>
                        ` : '-'}
                    </td>
                </tr>
            `; }).join('');
            
            attachActions();
        }

        ['v1-f-fecha', 'v1-f-trabajador', 'v1-f-tiempo', 'v1-f-estado'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', applyV1Filters);
        });

        function attachActions() {
            listEl.querySelectorAll('.btn-permission-action').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.id;
                    const action = btn.dataset.action;
                    const label = action === 'approve' ? 'aprobar' : 'rechazar';
                    if (!await showConfirm(`¿Desea ${label} esta solicitud de permiso?`)) return;
                    btn.disabled = true;
                    try {
                        const token = document.querySelector('meta[name="csrf-token"]');
                        const headers = {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest'
                        };
                        if (token) headers['X-CSRF-TOKEN'] = token.content;

                        await fetch(`/administrativo/permission-requests/${id}/status`, {
                            method: 'POST',
                            headers,
                            body: JSON.stringify({ status: action === 'approve' ? 'Aprobado' : 'Rechazado' })
                        });
                    } catch (e) {
                        console.warn('No se pudo actualizar el backend de permisos, se aplica solo localmente.', e);
                    }
                    renderAdminPermissionsPanel();
                });
            });
        }
        
        applyV1Filters();
    }

    // --- Funciones para Trabajadores ---
    function getWorkers() { return []; }

    function saveWorkers(workers) { /* workers are persisted via backend endpoints (add_worker/update_worker) */ }

    // --- Funciones para Registro de Trabajadores ---
    function renderWorkerRegistration() {
        if (!contentDetails) return;

        // New: fetch server-side options and workers
        let cargos = [];
        let niveles = [];
        let tiposNomina = [];

        async function loadOptions() {
            try {
                const [cRes, nRes, tRes] = await Promise.all([
                    fetch('./includes/nomina/list_cargos.php'),
                    fetch('./includes/users/list_niveles.php'),
                    fetch('./includes/nomina/list_tipo_nomina.php')
                ]);
                const [cData, nData, tData] = await Promise.all([
                    cRes.ok ? cRes.json().catch(() => ({})) : Promise.resolve({}),
                    nRes.ok ? nRes.json().catch(() => ({})) : Promise.resolve({}),
                    tRes.ok ? tRes.json().catch(() => ({})) : Promise.resolve({})
                ]);
                cargos = (cData && cData.cargos) ? cData.cargos : [];
                niveles = (nData && nData.niveles) ? nData.niveles : [];
                tiposNomina = (tData && tData.tipos) ? tData.tipos.filter(t => {
                    const freq = String(t.Frecuencia || '').trim().toLowerCase();
                    return freq !== 'mixta' && freq !== 'mensual';
                }) : [];
            } catch (e) {
                // keep arrays empty as fallback
                cargos = [];
                niveles = [];
                tiposNomina = [];
            }
        }

        async function loadWorkersFromServer() {
            try {
                const res = await fetch('./includes/workers/list_workers.php', { cache: 'no-store' });
                const data = (await res.json()) || {};
                if (res.ok && data.workers) return data.workers;
                return [];
            } catch (e) {
                return [];
            }
        }

        function buildFormHTML() {
            return `
            <div class="worker-registration">
                <h4>Registro de Trabajadores</h4>
                <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                    <button id="add-worker-btn" class="primary">➕ Registrar Nuevo Trabajador</button>
                    
                    <div style="position: relative;">
                        <button id="filter-toggle-btn" style="background: #3498db; color: #fff; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.95em;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
                            </svg>
                            Filtrar
                        </button>
                        
                        <div id="filter-dropdown" style="display: none; position: absolute; top: 45px; right: 0; background: #fff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 15px; min-width: 300px; z-index: 1000;">
                            <h5 style="margin: 0 0 15px 0; color: #2c3e50; font-size: 1em;">Buscar Trabajador</h5>
                            
                            <div style="margin-bottom: 12px;">
                                <label style="display: block; font-weight: 600; margin-bottom: 5px; color: #34495e; font-size: 0.9em;">Por Cédula:</label>
                                <input type="text" id="filter-cedula" placeholder="Ej: V-12345678" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 0.9em;">
                            </div>
                            
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; font-weight: 600; margin-bottom: 5px; color: #34495e; font-size: 0.9em;">Por Fecha de Ingreso:</label>
                                <input type="date" id="filter-fecha" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 0.9em;">
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; font-weight: 600; margin-bottom: 5px; color: #34495e; font-size: 0.9em;">Por Cargo:</label>
                                <select id="filter-cargo" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 0.9em; background: #fff;">
                                    <option value="">Todos los cargos</option>
                                    ${cargos.map(c => `<option value="${c.Id_Cargo}">${c.Nombre_profesión}</option>`).join('')}
                                </select>
                            </div>
                            <div style="margin-bottom: 15px; display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                                <div>
                                    <label style="display: block; font-weight: 600; margin-bottom: 5px; color: #34495e; font-size: 0.9em;">Por Tipo de Nómina:</label>
                                    <select id="filter-tipo-nomina" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 0.9em; background: #fff;">
                                        <option value="">Todas las nóminas</option>
                                        ${tiposNomina.map(t => `<option value="${t.Id_Tipo_Nomina}">${t.Frecuencia}</option>`).join('')}
                                    </select>
                                </div>
                                <div>
                                    <label style="display: block; font-weight: 600; margin-bottom: 5px; color: #34495e; font-size: 0.9em;">Por Estado:</label>
                                    <select id="filter-estado" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 0.9em; background: #fff;">
                                        <option value="">Todos</option>
                                        <option value="Activo">Activo</option>
                                        <option value="Inactivo">Inactivo</option>
                                    </select>
                                </div>
                            </div>
                            <div style="display: flex; gap: 8px; justify-content: flex-end;">
                                <button id="clear-filters-btn" style="background: #95a5a6; color: #fff; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-size: 0.85em;">✖ Limpiar</button>
                                <button id="apply-filters-btn" style="background: #2ecc71; color: #fff; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-size: 0.85em;">🔍 Buscar</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="worker-form-container" style="display: none; background: linear-gradient(135deg, #2ecc71 0%, #3498db 100%); padding: 30px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.25);">
                    <h5 id="worker-form-title" style="margin: 0 0 25px 0; color: #fff; font-size: 1.2em; display: flex; align-items: center; gap: 10px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Datos del Trabajador
                    </h5>
                    <input type="hidden" id="w-id-trabajador">
                    
                    <!-- Información Personal -->
                    <div style="background: rgba(255,255,255,0.95); padding: 25px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <h6 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 1em; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            Información Personal
                        </h6>
                        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:15px;">
                            <div class="form-row"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Nombres <span class="required" style="color: #e74c3c;">*</span></label><input id="w-nombre" class="form-input" type="text" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;" /></div>
                            <div class="form-row"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Apellidos <span class="required" style="color: #e74c3c;">*</span></label><input id="w-apellidos" class="form-input" type="text" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;" /></div>

                            <div class="form-row"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Documento de identidad <span class="required" style="color: #e74c3c;">*</span></label>
                                <div style="display:flex;gap:8px;align-items:center;">
                                    <select id="w-cedula-prefijo" style="padding:12px;border:1px solid #ddd;border-radius:8px;background:#fff;width:70px;font-size:0.95em;">
                                        <option value="V">V-</option>
                                        <option value="E">E-</option>
                                    </select>
                                    <input id="w-cedula" class="form-input" type="text" placeholder="12345678" style="flex:1;padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.95em;" />
                                </div>
                            </div>
                            <div class="form-row"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Fecha de nacimiento</label><input id="w-fecha-nac" class="form-input" type="date" max="" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;" /></div>

                            <div class="form-row"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Género</label><select id="w-genero" class="form-input" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;"><option value="">Seleccione</option><option value="M">Masculino</option><option value="F">Femenino</option><option value="O">Otro</option></select></div>
                            <div class="form-row"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Estado civil</label>
                                <select id="w-estado-civil" class="form-input" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;">
                                    <option value="">Seleccione</option>
                                    <option value="Soltero">Soltero</option>
                                    <option value="Casado">Casado</option>
                                    <option value="Divorciado">Divorciado</option>
                                    <option value="Viudo">Viudo</option>
                                </select>
                            </div>

                            <div class="form-row"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Correo electrónico</label><input id="w-correo" class="form-input" type="email" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;" /></div>
                            <div class="form-row"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Teléfono móvil</label>
                                <div style="display:flex;gap:8px;align-items:center;">
                                    <select id="w-telefono-prefijo" style="padding:12px;border:1px solid #ddd;border-radius:8px;background:#fff;width:110px;font-size:0.95em;">
                                        <option value="0412">0412</option>
                                        <option value="0414">0414</option>
                                        <option value="0416">0416</option>
                                        <option value="0424">0424</option>
                                        <option value="0426">0426</option>
                                        <option value="0422">0422</option>
                                    </select>
                                    <input id="w-telefono" class="form-input" type="text" placeholder="1234567" style="flex:1;padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;" />
                                </div>
                                <div class="helper" id="w-telefono-helper" style="margin-top:6px;">Prefijo y número separados. Ej: 0412 - 1234567</div>
                            </div>
                            
                            <div class="form-row" style="grid-column:1/3"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Dirección</label><input id="w-direccion" class="form-input" type="text" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;" /></div>
                        </div>
                    </div>

                    <!-- Información Laboral -->
                    <div style="background: rgba(255,255,255,0.95); padding: 25px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <h6 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 1em; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                            </svg>
                            Información Laboral
                        </h6>
                        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:15px;">
                            <div class="form-row"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Cargo <span class="required" style="color: #e74c3c;">*</span></label><select id="w-cargo" class="form-input" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;"><option value="">Cargo (seleccione)</option>${cargos.map(c => `<option value="${c.Id_Cargo}">${c.Nombre_profesión}</option>`).join('')}</select></div>
                            <div class="form-row"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Nivel educativo <span class="required" style="color: #e74c3c;">*</span></label><select id="w-nivel" class="form-input" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;"><option value="">Nivel educativo (seleccione)</option>${niveles.map(n => `<option value="${n.Id_Nivel_Educativo}">${n.Nombre_Nivel}</option>`).join('')}</select></div>
                            <div class="form-row" style="grid-column:1/3"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Fecha de ingreso <span class="required" style="color: #e74c3c;">*</span></label><input id="w-fecha-ingreso" class="form-input" type="date" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;" /></div>
                        </div>
                    </div>

                    <h5 style="margin: 20px 0 0 0; color: #fff; font-size: 1em;">Contrato</h5>
                    <div style="background: var(--card-bg); padding: 25px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid var(--border-color, #eee);">
                        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:15px;">
                            <div class="form-row"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Tipo de nómina <span class="required" style="color: #e74c3c;">*</span></label><select id="w-tipo-nomina" class="form-input" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;"><option value="">Tipo de nómina</option>${tiposNomina.map(t => `<option value="${t.Id_Tipo_Nomina}">${t.Frecuencia}</option>`).join('')}</select></div>
                            <div class="form-row"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Estado</label><select id="w-estado" class="form-input" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em;"><option value="Activo">Activo</option><option value="Inactivo">Inactivo</option></select></div>
                            <div class="form-row" style="grid-column:1/3"><label class="form-label" style="color: #34495e; font-weight: 600; margin-bottom: 8px; display: block;">Observaciones</label><textarea id="w-observaciones" class="form-input" placeholder="Observaciones" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; width: 100%; font-size: 0.95em; min-height: 80px; resize: vertical;"></textarea></div>
                        </div>
                    </div>

                    <div style="display:flex;gap:15px;margin-top:25px;align-items:center;">
                        <button id="save-worker-btn" class="primary" style="padding: 15px 30px; background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); border: none; border-radius: 10px; color: #fff; font-weight: 700; cursor: pointer; font-size: 1.05em; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.4); display: flex; align-items: center; gap: 10px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                            Guardar Trabajador
                        </button>
                        <button id="cancel-worker-btn" style="padding: 15px 30px; border-radius: 10px; border: 2px solid #fff; background: transparent; color: #fff; cursor: pointer; font-weight: 600; font-size: 1.05em;">Cancelar</button>
                        <div id="worker-msg"></div>
                    </div>
                </div>
                <div id="workers-list"><h5 style="margin-top:20px">Trabajadores Registrados</h5><div id="workers-table"></div></div>
            </div>
            `;
        }

        // Funciones de validación para trabajadores
        function validarSoloLetrasTrabajador(texto) {
            if (!texto) return false;
            const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-\']+$/;
            return regex.test(texto);
        }

        function validarSoloNumerosTrabajador(valor) {
            if (!valor || valor === '') return false;
            // Permite números y guiones (para formato de teléfono)
            const regex = /^[0-9\-\s]+$/;
            return regex.test(valor);
        }

        function validarCedula(cedula) {
            if (!cedula) return false;
            // Solo números, entre 6 y 10 dígitos
            const regex = /^[0-9]{6,10}$/;
            return regex.test(cedula);
        }

        function validarFecha(fecha, tipo) {
            if (!fecha) return { valido: true }; // Fechas opcionales son válidas

            // Parsear fecha input (YYYY-MM-DD) a fecha local para evitar problemas de zona horaria
            const partes = fecha.split('-');
            const fechaObj = new Date(partes[0], partes[1] - 1, partes[2]);

            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            if (tipo === 'nacimiento') {
                // Fecha de nacimiento no puede ser futura
                if (fechaObj > hoy) {
                    return { valido: false, mensaje: 'La fecha de nacimiento no puede ser futura' };
                }
                // Validar rango de edad: entre 18 y 80 años
                const fechaMayorEdad = new Date();
                fechaMayorEdad.setHours(0, 0, 0, 0);
                fechaMayorEdad.setFullYear(hoy.getFullYear() - 18);
                if (fechaObj > fechaMayorEdad) {
                    return { valido: false, mensaje: 'El trabajador debe ser mayor de edad' };
                }

                const fechaMaxEdad = new Date();
                fechaMaxEdad.setHours(0, 0, 0, 0);
                fechaMaxEdad.setFullYear(hoy.getFullYear() - 80);
                if (fechaObj < fechaMaxEdad) {
                    return { valido: false, mensaje: 'La edad no puede ser mayor a 80 años' };
                }
            } else if (tipo === 'ingreso') {
                // Fecha de ingreso no puede ser futura (o puede ser hoy)
                if (fechaObj > hoy) {
                    return { valido: false, mensaje: 'La fecha de ingreso no puede ser futura' };
                }
            }

            return { valido: true };
        }

        function setupWorkerFormValidations() {
            // helper to show inline errors
            function showFieldError(el, msg) {
                if (!el) return;
                el.classList.add('input-error');
                let helper = el.nextElementSibling;
                // if the next sibling is a wrapper (for selects with parent div), try to find helper by id
                if (!helper || !helper.classList || !helper.classList.contains('helper')) {
                    // try find .helper within parent
                    const parent = el.parentElement;
                    if (parent) helper = parent.querySelector('.helper');
                }
                if (helper) {
                    helper.textContent = msg;
                    helper.style.color = '#e74c3c';
                } else {
                    const span = document.createElement('div');
                    span.className = 'helper';
                    span.style.color = '#e74c3c';
                    span.textContent = msg;
                    el.insertAdjacentElement('afterend', span);
                }
            }

            function clearFieldError(el) {
                if (!el) return;
                el.classList.remove('input-error');
                let helper = el.nextElementSibling;
                if (!helper || !helper.classList || !helper.classList.contains('helper')) {
                    const parent = el.parentElement;
                    if (parent) helper = parent.querySelector('.helper');
                }
                if (helper) {
                    helper.textContent = '';
                    helper.style.color = '#7f8c8d';
                }
            }
            // Validación en tiempo real para nombres (solo letras)
            const nombreInput = document.getElementById('w-nombre');
            if (nombreInput && !nombreInput.dataset.validacionConfigurada) {
                nombreInput.dataset.validacionConfigurada = 'true';
                nombreInput.addEventListener('keypress', function (e) {
                    const char = String.fromCharCode(e.which);
                    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-\']/.test(char) && !e.ctrlKey && !e.metaKey && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                        e.preventDefault();
                        showFieldError(nombreInput, 'El nombre solo puede contener letras');
                    }
                });
                nombreInput.addEventListener('input', function () {
                    const v = nombreInput.value.trim();
                    if (!v) { showFieldError(nombreInput, 'Campo obligatorio'); return; }
                    if (!validarSoloLetrasTrabajador(v)) { showFieldError(nombreInput, 'El nombre solo puede contener letras'); return; }
                    clearFieldError(nombreInput);
                });
            }

            const apellidosInput = document.getElementById('w-apellidos');
            if (apellidosInput && !apellidosInput.dataset.validacionConfigurada) {
                apellidosInput.dataset.validacionConfigurada = 'true';
                apellidosInput.addEventListener('keypress', function (e) {
                    const char = String.fromCharCode(e.which);
                    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-\']/.test(char) && !e.ctrlKey && !e.metaKey && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                        e.preventDefault();
                        showFieldError(apellidosInput, 'El apellido solo puede contener letras');
                    }
                });
                apellidosInput.addEventListener('input', function () {
                    const v = apellidosInput.value.trim();
                    if (!v) { showFieldError(apellidosInput, 'Campo obligatorio'); return; }
                    if (!validarSoloLetrasTrabajador(v)) { showFieldError(apellidosInput, 'El apellido solo puede contener letras'); return; }
                    clearFieldError(apellidosInput);
                });
            }

            // Validación para cédula (solo números)
            const cedulaInput = document.getElementById('w-cedula');
            if (cedulaInput && !cedulaInput.dataset.validacionConfigurada) {
                cedulaInput.dataset.validacionConfigurada = 'true';
                cedulaInput.addEventListener('keypress', function (e) {
                    const char = String.fromCharCode(e.which);
                    if (!/[0-9]/.test(char) && !e.ctrlKey && !e.metaKey && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                        e.preventDefault();
                        showFieldError(cedulaInput, 'El documento solo puede contener números');
                    }
                });
                cedulaInput.addEventListener('input', function () {
                    const v = cedulaInput.value.trim();
                    if (!v) { showFieldError(cedulaInput, 'La cédula es obligatoria'); return; }
                    if (!validarCedula(v)) { showFieldError(cedulaInput, 'El documento solo puede contener números'); return; }
                    clearFieldError(cedulaInput);
                });
            }

            // Validación para teléfono (números, guiones y espacios)
            const telefonoInput = document.getElementById('w-telefono');
            if (telefonoInput && !telefonoInput.dataset.validacionConfigurada) {
                telefonoInput.dataset.validacionConfigurada = 'true';
                telefonoInput.addEventListener('keypress', function (e) {
                    const char = String.fromCharCode(e.which);
                    if (!/[0-9\-\s]/.test(char) && !e.ctrlKey && !e.metaKey && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                        e.preventDefault();
                    }
                });
                telefonoInput.addEventListener('input', function () {
                    const v = telefonoInput.value.trim();
                    // allow user to type separators, but validate that the numeric part is exactly 7 digits
                    const digits = v.replace(/\D/g, '');
                    if (digits && !/^\d{7}$/.test(digits)) { showFieldError(telefonoInput, 'El número debe tener 7 dígitos'); return; }
                    clearFieldError(telefonoInput);
                });
                // also validate prefix select exists
                const telPref = document.getElementById('w-telefono-prefijo');
                if (telPref && !telPref.dataset.validacionConfigurada) {
                    telPref.dataset.validacionConfigurada = 'true';
                    telPref.addEventListener('change', () => { clearFieldError(telefonoInput); });
                }
            }

            // Elementos extra de validación
            const dateToday = new Date().toISOString().split('T')[0];
            const correoInput = document.getElementById('w-correo');
            if (correoInput && !correoInput.dataset.validacionConfigurada) {
                correoInput.dataset.validacionConfigurada = 'true';
                correoInput.addEventListener('input', function () {
                    const v = correoInput.value.trim();
                    if (v && !v.includes('@')) { showFieldError(correoInput, 'Tu dirección de correo electrónico debe contener @'); return; }
                    clearFieldError(correoInput);
                });
                correoInput.addEventListener('blur', function () {
                    const v = correoInput.value.trim();
                    if (v && !v.includes('@')) { showFieldError(correoInput, 'Tu dirección de correo electrónico debe contener @'); }
                });
            }

            // Date inputs realtime validation
            const fechaNacInput = document.getElementById('w-fecha-nac');
            if (fechaNacInput && !fechaNacInput.dataset.validacionConfigurada) {
                fechaNacInput.dataset.validacionConfigurada = 'true';
                fechaNacInput.max = dateToday;
                fechaNacInput.addEventListener('change', () => {
                    const v = fechaNacInput.value;
                    const res = validarFecha(v, 'nacimiento');
                    if (!res.valido) showFieldError(fechaNacInput, res.mensaje); else clearFieldError(fechaNacInput);
                });
            }

            const fechaIngresoInput = document.getElementById('w-fecha-ingreso');
            if (fechaIngresoInput && !fechaIngresoInput.dataset.validacionConfigurada) {
                fechaIngresoInput.dataset.validacionConfigurada = 'true';
                fechaIngresoInput.max = dateToday;
                fechaIngresoInput.addEventListener('change', () => {
                    const v = fechaIngresoInput.value;
                    const res = validarFecha(v, 'ingreso');
                    if (!res.valido) showFieldError(fechaIngresoInput, res.mensaje); else clearFieldError(fechaIngresoInput);
                });
            }
        }

        // Source of truth for all workers in this module
        let allWorkersSource = [];
        // Cache of currently rendered workers for button listeners
        let workersCache = [];
        // Sort state tracking
        let sortState = {
            nombre: null, // null, 'asc', 'desc'
            ingreso: null // null, 'asc', 'desc'
        };

        function renderWorkersTable(workers) {
            workersCache = workers || [];
            const el = document.getElementById('workers-table');
            if (!el || !workers) return;
            if (!workers.length) { el.innerHTML = '<p style="color:#7f8c8d;padding:12px">No hay trabajadores registrados.</p>'; return; }

            // Sort icons based on current state
            const nombreIcon = sortState.nombre === 'asc' ? '▲' : sortState.nombre === 'desc' ? '▼' : '⇅';
            const ingresoIcon = sortState.ingreso === 'asc' ? '▲' : sortState.ingreso === 'desc' ? '▼' : '⇅';

            el.innerHTML = `<table style="width:100%;border-collapse:collapse"><thead><tr style="background:#3498db;color:#fff"><th style="padding:8px;text-align:center">Nombre <button id="sort-nombre-btn" style="background:transparent;border:none;color:#fff;cursor:pointer;font-size:1.1em;margin-left:5px;">${nombreIcon}</button></th><th style="padding:8px;text-align:center">Cédula</th><th style="padding:8px;text-align:center">Cargo</th><th style="padding:8px;text-align:center">Nivel</th><th style="padding:8px;text-align:center">Ingreso <button id="sort-ingreso-btn" style="background:transparent;border:none;color:#fff;cursor:pointer;font-size:1.1em;margin-left:5px;">${ingresoIcon}</button></th><th style="padding:8px;text-align:center">Estado</th><th style="padding:8px;text-align:center">Acciones</th></tr></thead><tbody>${workers.map(w => `<tr><td style="padding:8px;text-align:center">${w.Nombre_Completo} ${w.Apellidos}</td><td style="padding:8px;text-align:center">${w.Documento_Identidad}</td><td style="padding:8px;text-align:center">${w.Cargo || ''}</td><td style="padding:8px;text-align:center">${w.Nivel_Educativo || ''}</td><td style="padding:8px;text-align:center">${formatLocalDate(w.Fecha_de_Ingreso)}</td><td style="padding:8px;text-align:center"><span style="background:${w.Contrato_Estado === 'Activo' ? '#2ecc71' : '#e74c3c'};color:#fff;padding:2px 8px;border-radius:10px;font-size:0.85em;">${w.Contrato_Estado || ''}</span></td><td style="padding:8px;text-align:center"><div style="display:flex;gap:4px;align-items:center;justify-content:center;"><button class="view-worker-btn" data-id="${w.Id_Trabajador}" style="background:#3498db;color:#fff;border:none;padding:6px 8px;border-radius:4px;cursor:pointer">Ver</button>
                             <button class="edit-worker-btn" data-id="${w.Id_Trabajador}" style="background:#2980b9;color:#fff;border:none;padding:6px 8px;border-radius:4px;cursor:pointer">Editar</button>
                            ${w.Contrato_Estado === 'Activo'
                    ? `<button class="deactivate-worker-btn" data-id="${w.Id_Trabajador}" data-name="${w.Nombre_Completo} ${w.Apellidos}" style="background:#f39c12;color:#fff;border:none;padding:6px 8px;border-radius:4px;cursor:pointer">Desactivar</button>`
                    : `<button class="activate-worker-btn" data-id="${w.Id_Trabajador}" data-name="${w.Nombre_Completo} ${w.Apellidos}" style="background:#2ecc71;color:#fff;border:none;padding:6px 8px;border-radius:4px;cursor:pointer">Activar</button>`
                }</div></td></tr>`).join('')}</tbody></table>`;
            attachWorkerTableListeners();
            attachSortListeners();
        }

        function attachSortListeners() {
            const sortNombreBtn = document.getElementById('sort-nombre-btn');
            const sortIngresoBtn = document.getElementById('sort-ingreso-btn');

            if (sortNombreBtn) {
                sortNombreBtn.addEventListener('click', () => {
                    // Toggle: null -> asc -> desc -> asc ...
                    if (sortState.nombre === null || sortState.nombre === 'desc') {
                        sortState.nombre = 'asc';
                    } else {
                        sortState.nombre = 'desc';
                    }
                    sortState.ingreso = null; // Reset other sort

                    const sorted = [...allWorkersSource].sort((a, b) => {
                        const nameA = `${a.Nombre_Completo} ${a.Apellidos}`.toLowerCase();
                        const nameB = `${b.Nombre_Completo} ${b.Apellidos}`.toLowerCase();
                        return sortState.nombre === 'asc'
                            ? nameA.localeCompare(nameB)
                            : nameB.localeCompare(nameA);
                    });
                    allWorkersSource = sorted;
                    renderWorkersTable(sorted);
                });
            }

            if (sortIngresoBtn) {
                sortIngresoBtn.addEventListener('click', () => {
                    // Toggle: null -> desc (most recent) -> asc (oldest) -> desc ...
                    if (sortState.ingreso === null || sortState.ingreso === 'asc') {
                        sortState.ingreso = 'desc'; // Most recent first
                    } else {
                        sortState.ingreso = 'asc'; // Oldest first
                    }
                    sortState.nombre = null; // Reset other sort

                    const sorted = [...allWorkersSource].sort((a, b) => {
                        const dateA = new Date(a.Fecha_de_Ingreso || '1900-01-01');
                        const dateB = new Date(b.Fecha_de_Ingreso || '1900-01-01');
                        return sortState.ingreso === 'desc'
                            ? dateB - dateA // Most recent first
                            : dateA - dateB; // Oldest first
                    });
                    allWorkersSource = sorted;
                    renderWorkersTable(sorted);
                });
            }
        }

        function attachWorkerTableListeners() {
            document.querySelectorAll('.deactivate-worker-btn').forEach(b => {
                b.addEventListener('click', async () => {
                    const id = b.getAttribute('data-id');
                    const nombre = b.getAttribute('data-name');
                    if (!await showConfirm(`¿Está seguro de desactivar al trabajador "${nombre}"?\n\nEl trabajador será marcado como inactivo pero no se eliminará de la base de datos.`)) return;
                    try {
                        const res = await fetch('./includes/workers/deactivate_worker.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
                        const data = await res.json();
                        if (res.ok) { document.getElementById('worker-msg').textContent = 'Trabajador desactivado exitosamente'; document.getElementById('worker-msg').style.color = '#27ae60'; loadAndRender(); if (window.loadWorkersForUsers) window.loadWorkersForUsers(); } else { document.getElementById('worker-msg').textContent = data.error || 'Error al desactivar'; document.getElementById('worker-msg').style.color = '#e74c3c'; }
                    } catch (e) { document.getElementById('worker-msg').textContent = 'Error de conexión'; document.getElementById('worker-msg').style.color = '#e74c3c'; }
                });
            });

            document.querySelectorAll('.activate-worker-btn').forEach(b => {
                b.addEventListener('click', async () => {
                    const id = b.getAttribute('data-id');
                    const nombre = b.getAttribute('data-name');
                    if (!await showConfirm(`¿Está seguro de activar al trabajador "${nombre}"?`)) return;
                    try {
                        const res = await fetch('./includes/workers/activate_worker.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
                        const data = await res.json();
                        if (res.ok) { document.getElementById('worker-msg').textContent = 'Trabajador activado exitosamente'; document.getElementById('worker-msg').style.color = '#27ae60'; loadAndRender(); if (window.loadWorkersForUsers) window.loadWorkersForUsers(); } else { document.getElementById('worker-msg').textContent = data.error || 'Error al activar'; document.getElementById('worker-msg').style.color = '#e74c3c'; }
                    } catch (e) { document.getElementById('worker-msg').textContent = 'Error de conexión'; document.getElementById('worker-msg').style.color = '#e74c3c'; }
                });
            });

            document.querySelectorAll('.view-worker-btn').forEach(b => {
                b.addEventListener('click', () => {
                    const id = b.getAttribute('data-id');
                    const worker = workersCache.find(w => String(w.Id_Trabajador) === String(id));
                    if (worker) showWorkerDetails(worker);
                });
            });

            document.querySelectorAll('.edit-worker-btn').forEach(b => {
                b.addEventListener('click', () => {
                    const id = b.getAttribute('data-id');
                    const worker = workersCache.find(w => String(w.Id_Trabajador) === String(id));
                    if (worker) populateWorkerForm(worker);
                });
            });
        }

        function populateWorkerForm(worker) {
            const formContainer = document.getElementById('worker-form-container');
            const titleEl = document.getElementById('worker-form-title');

            // Show form and change title
            formContainer.style.display = 'block';
            titleEl.textContent = 'Editar Trabajador: ' + worker.Nombre_Completo + ' ' + worker.Apellidos;
            formContainer.scrollIntoView({ behavior: 'smooth' });

            // Set ID and personal data
            document.getElementById('w-id-trabajador').value = worker.Id_Trabajador;
            document.getElementById('w-nombre').value = worker.Nombre_Completo || '';
            document.getElementById('w-apellidos').value = worker.Apellidos || '';

            const cedulaParts = (worker.Documento_Identidad || '').split('-');
            if (cedulaParts.length === 2) {
                document.getElementById('w-cedula-prefijo').value = cedulaParts[0];
                document.getElementById('w-cedula').value = cedulaParts[1];
            } else {
                document.getElementById('w-cedula').value = worker.Documento_Identidad || '';
            }

            document.getElementById('w-fecha-nac').value = worker.Fecha_Nacimiento || '';
            document.getElementById('w-genero').value = worker.Genero || '';
            document.getElementById('w-cargo').value = worker.Id_Cargo || '';
            document.getElementById('w-nivel').value = worker.Id_Nivel_Educativo || '';
            document.getElementById('w-correo').value = worker.Correo || '';
            // Populate phone prefix and number if available
            const telefonoRaw = worker.Telefono_Movil || '';
            let telPref = '0412';
            let telNum = '';
            if (telefonoRaw.indexOf('-') !== -1) {
                const parts = telefonoRaw.split('-');
                telPref = parts[0] || telPref;
                telNum = parts.slice(1).join('-') || '';
            } else if (telefonoRaw.startsWith('04') && telefonoRaw.length > 4) {
                telPref = telefonoRaw.slice(0, 4);
                telNum = telefonoRaw.slice(4);
            } else {
                telNum = telefonoRaw;
            }
            const telPrefEl = document.getElementById('w-telefono-prefijo');
            if (telPrefEl) {
                // set if option exists, otherwise leave default
                const opt = Array.from(telPrefEl.options).find(o => o.value === telPref);
                if (opt) telPrefEl.value = telPref; else telPrefEl.value = telPrefEl.options[0].value;
            }
            document.getElementById('w-telefono').value = telNum || '';
            document.getElementById('w-direccion').value = worker.Direccion || '';
            document.getElementById('w-estado-civil').value = worker.Estado_Civil || '';
            document.getElementById('w-fecha-ingreso').value = worker.Fecha_de_Ingreso || '';

            // Set contract data
            document.getElementById('w-tipo-nomina').value = worker.Id_Tipo_Nomina || '';
            document.getElementById('w-estado').value = worker.Contrato_Estado || 'Activo';
            document.getElementById('w-observaciones').value = worker.Observaciones || '';

            // Set min/max dates for birth (18-80) and max for ingreso (today)
            const hoy = new Date();
            const maxEdad = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
            const minEdad = new Date(hoy.getFullYear() - 80, hoy.getMonth(), hoy.getDate());
            document.getElementById('w-fecha-nac').setAttribute('max', `${maxEdad.getFullYear()}-${String(maxEdad.getMonth() + 1).padStart(2, '0')}-${String(maxEdad.getDate()).padStart(2, '0')}`);
            document.getElementById('w-fecha-nac').setAttribute('min', `${minEdad.getFullYear()}-${String(minEdad.getMonth() + 1).padStart(2, '0')}-${String(minEdad.getDate()).padStart(2, '0')}`);
            document.getElementById('w-fecha-ingreso').setAttribute('max', `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`);

            setupWorkerFormValidations();
        }

        function genderLabel(g) {
            if (!g) return '-';
            if (g === 'M') return 'Masculino';
            if (g === 'F') return 'Femenino';
            if (g === 'O') return 'Otro';
            return g;
        }



        function showWorkerDetails(worker) {
            // create overlay
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.innerHTML = `
                <div class="modal-content">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                        <h4 style="margin:0">Detalle Trabajador</h4>
                        <button class="modal-close" aria-label="Cerrar">✖</button>
                    </div>
                    <div class="detail-list">
                        <!-- Worker ID hidden intentionally -->
                        <div class="detail-row"><strong>Nombre:</strong> ${worker.Nombre_Completo} ${worker.Apellidos}</div>
                        <div class="detail-row"><strong>Documento:</strong> ${worker.Documento_Identidad}</div>
                        <div class="detail-row"><strong>Correo:</strong> ${worker.Correo || '-'}</div>
                        <div class="detail-row"><strong>Teléfono:</strong> ${worker.Telefono_Movil || '-'}</div>
                        <div class="detail-row"><strong>Dirección:</strong> ${worker.Direccion || '-'}</div>
                        <div class="detail-row"><strong>Fecha Nacimiento:</strong> ${worker.Fecha_Nacimiento ? formatLocalDate(worker.Fecha_Nacimiento) : '-'}</div>
                        <div class="detail-row"><strong>Género:</strong> ${genderLabel(worker.Genero)}</div>
                        <div class="detail-row"><strong>Estado Civil:</strong> ${worker.Estado_Civil || '-'}</div>
                        <div class="detail-row"><strong>Fecha Ingreso:</strong> ${worker.Fecha_de_Ingreso ? formatLocalDate(worker.Fecha_de_Ingreso) : '-'}</div>
                        <div class="detail-row"><strong>Cargo:</strong> ${worker.Cargo || '-'}</div>
                        <div class="detail-row"><strong>Nivel Educativo:</strong> ${worker.Nivel_Educativo || '-'}</div>
                        <hr />
                        <!-- Contrato ID hidden intentionally -->
                        <div class="detail-row"><strong>Tipo Nómina:</strong> ${worker.Frecuencia || '-'}</div>
                        <div class="detail-row"><strong>Fecha Registro Contrato:</strong> ${worker.Fecha_registro ? new Date(worker.Fecha_registro).toLocaleString('es-VE') : '-'}</div>
                        <div class="detail-row"><strong>Estado Contrato:</strong> ${worker.Contrato_Estado || '-'}</div>
                        <div class="detail-row"><strong>Observaciones:</strong> ${worker.Observaciones || '-'}</div>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);

            const closeBtn = overlay.querySelector('.modal-close');
            function removeModal() { overlay.remove(); }
            closeBtn.addEventListener('click', removeModal);
            overlay.addEventListener('click', (e) => { if (e.target === overlay) removeModal(); });
        }

        function setWorkerMsg(m, type = 'info') { const el = document.getElementById('worker-msg'); if (!el) return; el.textContent = m; el.style.color = type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#7f8c8d'; }
        async function loadAndRender() {
            await loadOptions();
            contentDetails.innerHTML = buildFormHTML();

            setupWorkerFormValidations();

            // hookup buttons
            const addBtn = document.getElementById('add-worker-btn');
            const formContainer = document.getElementById('worker-form-container');
            const saveBtn = document.getElementById('save-worker-btn');
            const cancelBtn = document.getElementById('cancel-worker-btn');

            addBtn.addEventListener('click', () => {
                formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
                document.getElementById('worker-form-title').textContent = 'Datos del Trabajador';
                document.getElementById('w-id-trabajador').value = '';

                // Clear form
                ['w-nombre', 'w-apellidos', 'w-cedula', 'w-correo', 'w-telefono', 'w-telefono-prefijo', 'w-direccion', 'w-fecha-nac', 'w-fecha-ingreso', 'w-observaciones'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.value = '';
                });
                ['w-cargo', 'w-nivel', 'w-tipo-nomina', 'w-genero', 'w-estado-civil'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.value = '';
                });
                document.getElementById('w-estado').value = 'Activo';

                setWorkerMsg('');
                // remove validation highlights on open
                ['w-nombre', 'w-apellidos', 'w-cedula', 'w-fecha-ingreso', 'w-cargo', 'w-nivel', 'w-tipo-nomina', 'w-telefono', 'w-telefono-prefijo', 'w-fecha-nac'].forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('input-error'); });

                // Configurar fecha máxima para fecha de nacimiento (18 años atrás)
                const fechaNacInput = document.getElementById('w-fecha-nac');
                if (fechaNacInput) {
                    const hoy = new Date();
                    const maxEdad = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
                    const minEdad = new Date(hoy.getFullYear() - 80, hoy.getMonth(), hoy.getDate());
                    const mMax = String(maxEdad.getMonth() + 1).padStart(2, '0');
                    const dMax = String(maxEdad.getDate()).padStart(2, '0');
                    const mMin = String(minEdad.getMonth() + 1).padStart(2, '0');
                    const dMin = String(minEdad.getDate()).padStart(2, '0');
                    fechaNacInput.setAttribute('max', `${maxEdad.getFullYear()}-${mMax}-${dMax}`);
                    fechaNacInput.setAttribute('min', `${minEdad.getFullYear()}-${mMin}-${dMin}`);
                }

                // Configurar fecha máxima para fecha de ingreso (hoy)
                const fechaIngresoInput = document.getElementById('w-fecha-ingreso');
                if (fechaIngresoInput) {
                    const hoy = new Date();
                    const m = String(hoy.getMonth() + 1).padStart(2, '0');
                    const d = String(hoy.getDate()).padStart(2, '0');
                    fechaIngresoInput.setAttribute('max', `${hoy.getFullYear()}-${m}-${d}`);
                }

                // Configurar validaciones en tiempo real
                setupWorkerFormValidations();
            });
            cancelBtn.addEventListener('click', () => { formContainer.style.display = 'none'; setWorkerMsg(''); });

            // Setup Filter Dropdown
            const filterToggleBtn = document.getElementById('filter-toggle-btn');
            const filterDropdown = document.getElementById('filter-dropdown');
            const filterCedula = document.getElementById('filter-cedula');
            const filterFecha = document.getElementById('filter-fecha');
            const applyFiltersBtn = document.getElementById('apply-filters-btn');
            const clearFiltersBtn = document.getElementById('clear-filters-btn');

            // Toggle dropdown visibility
            filterToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                filterDropdown.style.display = filterDropdown.style.display === 'none' ? 'block' : 'none';
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!filterDropdown.contains(e.target) && e.target !== filterToggleBtn) {
                    filterDropdown.style.display = 'none';
                }
            });

            // Apply filters
            const filterCargo = document.getElementById('filter-cargo');
            const filterTipoNomina = document.getElementById('filter-tipo-nomina');
            const filterEstado = document.getElementById('filter-estado');

            function applyFilters() {
                const cedulaValue = filterCedula.value.toLowerCase().trim();
                const fechaValue = filterFecha.value;
                const cargoValue = filterCargo ? filterCargo.value : '';
                const tipoNominaValue = filterTipoNomina ? filterTipoNomina.value : '';
                const estadoValue = filterEstado ? filterEstado.value : '';

                let filteredWorkers = allWorkersSource;

                if (cedulaValue) {
                    filteredWorkers = filteredWorkers.filter(w => (w.Documento_Identidad || '').toLowerCase().includes(cedulaValue));
                }

                if (fechaValue) {
                    filteredWorkers = filteredWorkers.filter(w => (w.Fecha_de_Ingreso || '') === fechaValue);
                }

                if (cargoValue) {
                    filteredWorkers = filteredWorkers.filter(w => String(w.Id_Cargo || w.Cargo_Id || '').trim() === String(cargoValue).trim());
                }

                if (tipoNominaValue) {
                    filteredWorkers = filteredWorkers.filter(w => String(w.Id_Tipo_Nomina || '').trim() === String(tipoNominaValue).trim());
                }

                if (estadoValue) {
                    filteredWorkers = filteredWorkers.filter(w => String(w.Estado || w.Estado_Trabajador || '').trim() === String(estadoValue).trim());
                }

                renderWorkersTable(filteredWorkers);
                filterDropdown.style.display = 'none';
            }

            applyFiltersBtn.addEventListener('click', applyFilters);

            // Allow Enter key to trigger search
            filterCedula.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') applyFilters();
            });
            filterFecha.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') applyFilters();
            });

            // Clear filters
            clearFiltersBtn.addEventListener('click', () => {
                filterCedula.value = '';
                filterFecha.value = '';
                if (filterCargo) filterCargo.value = '';
                if (filterTipoNomina) filterTipoNomina.value = '';
                if (filterEstado) filterEstado.value = '';
                renderWorkersTable(allWorkersSource);
                filterDropdown.style.display = 'none';
            });

            saveBtn.addEventListener('click', async () => {
                setWorkerMsg('Guardando...');
                const _wm = document.getElementById('worker-msg');
                if (_wm) {
                    _wm.style.color = '#ffffff';
                    _wm.style.fontSize = '1.15em';
                    _wm.style.fontWeight = '700';
                }

                // clear previous errors
                ['w-nombre', 'w-apellidos', 'w-cedula', 'w-fecha-ingreso', 'w-cargo', 'w-nivel', 'w-tipo-nomina', 'w-telefono', 'w-fecha-nac'].forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('input-error'); });

                // Obtener valores
                const nombre = document.getElementById('w-nombre').value.trim();
                const apellidos = document.getElementById('w-apellidos').value.trim();
                const cedulaPrefijo = document.getElementById('w-cedula-prefijo').value;
                const cedula = document.getElementById('w-cedula').value.trim();
                const fechaNac = document.getElementById('w-fecha-nac').value;
                const fechaIngreso = document.getElementById('w-fecha-ingreso').value;
                const telefonoPref = document.getElementById('w-telefono-prefijo') ? document.getElementById('w-telefono-prefijo').value : '';
                const telefonoNumber = document.getElementById('w-telefono').value.trim();
                const telefono = telefonoNumber ? (telefonoPref ? `${telefonoPref}-${telefonoNumber}` : telefonoNumber) : '';

                // Validaciones
                let errores = [];

                // Validar nombres (solo letras)
                if (!nombre) {
                    errores.push({ campo: 'w-nombre', mensaje: 'El nombre es obligatorio' });
                } else if (!validarSoloLetrasTrabajador(nombre)) {
                    errores.push({ campo: 'w-nombre', mensaje: 'El nombre solo puede contener letras, espacios y acentos' });
                } else if (nombre.length < 2) {
                    errores.push({ campo: 'w-nombre', mensaje: 'El nombre debe tener al menos 2 caracteres' });
                }

                // Validar apellidos (solo letras)
                if (!apellidos) {
                    errores.push({ campo: 'w-apellidos', mensaje: 'Los apellidos son obligatorios' });
                } else if (!validarSoloLetrasTrabajador(apellidos)) {
                    errores.push({ campo: 'w-apellidos', mensaje: 'Los apellidos solo pueden contener letras, espacios y acentos' });
                } else if (apellidos.length < 2) {
                    errores.push({ campo: 'w-apellidos', mensaje: 'Los apellidos deben tener al menos 2 caracteres' });
                }

                // Validar cédula (solo números)
                if (!cedula) {
                    errores.push({ campo: 'w-cedula', mensaje: 'La cédula es obligatoria' });
                } else if (!validarCedula(cedula)) {
                    errores.push({ campo: 'w-cedula', mensaje: 'La cédula debe contener solo números (entre 6 y 10 dígitos)' });
                }

                // Validar teléfono (si se proporciona): debe tener 7 dígitos después del prefijo
                if (telefonoNumber) {
                    const digits = telefonoNumber.replace(/\D/g, '');
                    if (!/^\d{7}$/.test(digits)) {
                        errores.push({ campo: 'w-telefono', mensaje: 'El número debe tener 7 dígitos después del prefijo' });
                    }
                }

                // Validar fechas
                if (fechaNac) {
                    const validacionNac = validarFecha(fechaNac, 'nacimiento');
                    if (!validacionNac.valido) {
                        errores.push({ campo: 'w-fecha-nac', mensaje: validacionNac.mensaje });
                    }
                }

                if (!fechaIngreso) {
                    errores.push({ campo: 'w-fecha-ingreso', mensaje: 'La fecha de ingreso es obligatoria' });
                } else {
                    const validacionIngreso = validarFecha(fechaIngreso, 'ingreso');
                    if (!validacionIngreso.valido) {
                        errores.push({ campo: 'w-fecha-ingreso', mensaje: validacionIngreso.mensaje });
                    }
                }

                // Validar campos select obligatorios
                const cargo = parseInt(document.getElementById('w-cargo').value) || null;
                const nivel = parseInt(document.getElementById('w-nivel').value) || null;
                const tipoNomina = parseInt(document.getElementById('w-tipo-nomina').value) || null;

                if (!cargo) errores.push({ campo: 'w-cargo', mensaje: 'Debe seleccionar un cargo' });
                if (!nivel) errores.push({ campo: 'w-nivel', mensaje: 'Debe seleccionar un nivel educativo' });
                if (!tipoNomina) errores.push({ campo: 'w-tipo-nomina', mensaje: 'Debe seleccionar un tipo de nómina' });

                // Mostrar errores
                if (errores.length > 0) {
                    errores.forEach(err => {
                        const el = document.getElementById(err.campo);
                        if (el) el.classList.add('input-error');
                        // try show inline helper
                        const eEl = document.getElementById(err.campo);
                        if (eEl) {
                            const parent = eEl.parentElement;
                            const helper = parent ? parent.querySelector('.helper') : null;
                            if (helper) { helper.textContent = err.mensaje; helper.style.color = '#e74c3c'; }
                        }
                    });
                    setWorkerMsg(errores[0].mensaje, 'error');
                    return;
                }

                // Construir payload con cédula completa (prefijo + número)
                const documentoCompleto = `${cedulaPrefijo}-${cedula}`;

                const payload = {
                    Id_Trabajador: document.getElementById('w-id-trabajador').value || null,
                    Id_Cargo: cargo,
                    Id_Nivel_Educativo: nivel,
                    Nombre_Completo: nombre,
                    Apellidos: apellidos,
                    Fecha_Nacimiento: fechaNac || null,
                    Genero: document.getElementById('w-genero').value || null,
                    Documento_Identidad: documentoCompleto,
                    Correo: document.getElementById('w-correo').value.trim() || null,
                    Telefono_Movil: telefono || null,
                    Direccion: document.getElementById('w-direccion').value.trim() || null,
                    Estado_Civil: document.getElementById('w-estado-civil').value || null,
                    Fecha_de_Ingreso: fechaIngreso,
                    Id_Tipo_Nomina: tipoNomina,
                    Observaciones: document.getElementById('w-observaciones').value.trim() || null,
                    Estado: document.getElementById('w-estado').value || 'Activo'
                };

                try {
                    const endpoint = payload.Id_Trabajador ? './includes/workers/update_worker.php' : './includes/workers/add_worker.php';
                    const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                    const data = await res.json();
                    if (res.ok) {
                        setWorkerMsg(payload.Id_Trabajador ? 'Trabajador actualizado' : 'Trabajador registrado', 'success');
                        formContainer.style.display = 'none';
                        // Ensure we fetch the updated list and clear filters so user can see it
                        filterCedula.value = '';
                        filterFecha.value = '';
                        loadAndRender();
                        if (window.loadWorkersForUsers) window.loadWorkersForUsers();
                    } else {
                        setWorkerMsg(data.error || 'Error al guardar', 'error');
                    }
                } catch (e) { setWorkerMsg('Error de conexión', 'error'); }
            });

            // initial workers load
            const workers = await loadWorkersFromServer();
            allWorkersSource = workers;
            renderWorkersTable(workers);

            // remove error highlight when user edits fields
            ['w-nombre', 'w-apellidos', 'w-cedula', 'w-fecha-ingreso', 'w-cargo', 'w-nivel', 'w-tipo-nomina', 'w-correo', 'w-telefono', 'w-telefono-prefijo', 'w-direccion'].forEach(id => { const el = document.getElementById(id); if (el) el.addEventListener('input', () => el.classList.remove('input-error')); });
        }

        loadAndRender();
    }

    // --- Funciones para Pago de Nómina ---
    async function renderPayrollPayment() {
        if (!contentDetails) return;

        // State for the module
        let workers = [];
        let allConcepts = [];
        let addedConcepts = [];

        // --- Helper function to fetch concepts ---
        async function fetchConceptos() {
            try {
                const res = await fetch('./includes/nomina/list_conceptos.php', { cache: 'no-store' });
                if (!res.ok) return [];
                const data = await res.json();
                return data.conceptos || [];
            } catch (e) {
                console.error("Error fetching conceptos:", e);
                return [];
            }
        }

        // --- Load initial data (workers, users, and concepts) ---
        try {
            const [workersRes, usersRes] = await Promise.all([
                fetch('./includes/workers/list_workers.php', { cache: 'no-store' }),
                fetch('./includes/workers/list_workers.php', { cache: 'no-store' })
            ]);

            let linkedWorkerIds = [];
            if (usersRes.ok) {
                const userData = await usersRes.json();
                linkedWorkerIds = (userData.users || [])
                    .filter(u => u.Id_Trabajador)
                    .map(u => parseInt(u.Id_Trabajador));
            }

            if (workersRes.ok) {
                const data = await workersRes.json();
                if (data.workers && data.workers.length) {
                    // Solo incluir trabajadores que tengan un usuario vinculado
                    workers = data.workers
                        .filter(w => linkedWorkerIds.includes(parseInt(w.Id_Trabajador)))
                        .map(w => ({
                            id: w.Id_Trabajador,
                            nombres: w.Nombre_Completo,
                            apellidos: w.Apellidos || '',
                            cedula: w.Documento_Identidad
                        }));
                }
            }
        } catch (e) { console.error("Error loading data for payroll:", e); }

        allConcepts = (await fetchConceptos()).filter(c => {
            const estado = String(c.Estado || c.estado || '').trim().toLowerCase();
            return estado !== 'inactivo' && estado !== 'inactive';
        });

        // --- Main HTML structure ---
        if (workers.length === 0) {
            contentDetails.innerHTML = `
                <div class="payroll-payment">
                    <h4>Pago de Nómina</h4>
                    <div class="alert-info">
                        <p>⚠️ No hay trabajadores con usuarios vinculados o no hay trabajadores registrados. Por favor, asegúrese de que los trabajadores tengan una cuenta de usuario.</p>
                    </div>
                </div>
            `;
            return;
        }

        let html = `
            <div class="payroll-payment">
                <h4 style="color: #2c3e50; margin-bottom: 25px; font-size: 1.5em;">💰 Pago de Nómina</h4>
                
                <!-- Datos del Pago Section -->
                <div style="background: linear-gradient(135deg, #2ecc71 0%, #3498db 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.25);">
                    <h5 style="margin: 0 0 20px 0; color: #fff; font-size: 1.1em; display: flex; align-items: center; gap: 10px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Datos del Pago
                    </h5>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #fff; font-size: 0.9em;">Trabajador <span style="color: #e74c3c;">*</span></label>
                            <select id="payment-worker" style="width: 100%; padding: 12px; border: none; border-radius: 8px; font-size: 0.95em; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" required>
                                <option value="">Seleccione un trabajador</option>
                                ${workers.map(w => `<option value="${w.id}" data-cedula="${w.cedula}" data-nombres="${w.nombres}" data-apellidos="${w.apellidos}">${w.cedula} - ${w.nombres} ${w.apellidos}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #fff; font-size: 0.9em;">Período (Quincena 1-24) <span style="color: #e74c3c;">*</span></label>
                            <select id="payment-periodo" style="width: 100%; padding: 12px; border: none; border-radius: 8px; font-size: 0.95em; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" required>
                                <option value="">Seleccione quincena</option>
                                ${Array.from({ length: 24 }, (_, i) => `<option value="${i + 1}">Quincena ${i + 1}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #fff; font-size: 0.9em;">Fecha de Pago <span style="color: #e74c3c;">*</span></label>
                            <input type="date" id="payment-fecha-pago" style="width: 100%; padding: 12px; border: none; border-radius: 8px; font-size: 0.95em; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" required>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #fff; font-size: 0.9em;">Fecha Inicio Período <span style="color: #e74c3c;">*</span></label>
                            <input type="date" id="payment-fecha-inicio" style="width: 100%; padding: 12px; border: none; border-radius: 8px; font-size: 0.95em; background: #f0f0f0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" readonly>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #fff; font-size: 0.9em;">Fecha Fin Período <span style="color: #e74c3c;">*</span></label>
                            <input type="date" id="payment-fecha-fin" style="width: 100%; padding: 12px; border: none; border-radius: 8px; font-size: 0.95em; background: #f0f0f0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" readonly>
                        </div>
                    </div>
                    
                    <div style="background: rgba(255,255,255,0.95); padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <label style="display: block; margin-bottom: 12px; font-weight: 700; color: #2c3e50; font-size: 1em; display: flex; align-items: center; gap: 8px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="1" x2="12" y2="23"></line>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                            </svg>
                            Salario Base (Bs.) <span style="color: #e74c3c;">*</span>
                        </label>
                        <input type="number" id="payment-salario-base" value="130" step="0.01" style="width: 100%; padding: 14px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1.1em; font-weight: 600; color: #2c3e50;" required>
                    </div>
                </div>

                <!-- Conceptos del Recibo Section -->
                <div id="conceptos-section" style="background: #fff; padding: 25px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); border: 1px solid #e8e8e8;">
                    <h5 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 1.1em; display: flex; align-items: center; gap: 10px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        Conceptos del Recibo <span style="color: #e74c3c;">*</span>
                    </h5>
                    
<div style="display: grid; grid-template-columns: 1.5fr 1fr auto; gap: 12px; margin-bottom: 20px; align-items: end; background: #f8f9fa; padding: 15px; border-radius: 10px; border: 2px dashed #dee2e6;">
                            <div>
                                <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #2c3e50; font-size: 0.9em;">Concepto <span style="color: #e74c3c;">*</span></label>
                                <select id="add-concepto-select" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.95em;" title="Seleccione un concepto" required>
                                    <option value="">Seleccionar concepto...</option>
                                    ${allConcepts.map(c => `<option value="${c.Id_Concepto}">${c.Nombre_Concepto} (${c.Tipo})</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #2c3e50; font-size: 0.9em;">Aux <span style="color: #e74c3c;">*</span></label>
                                <input type="text" id="add-concepto-aux" placeholder="Aux (Ej: 15 días)" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.95em;" required>
                            </div>
                            <button id="add-concepto-btn" class="primary" style="padding: 12px 20px; background: #2ecc71; border: none; border-radius: 8px; color: #fff; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Agregar
                            </button>
                        </div>

                    <div id="conceptos-list-container" style="background: #fafafa; padding: 20px; border-radius: 10px; min-height: 80px; border: 1px solid #e8e8e8;">
                        <p id="no-concepts-msg" style="color: #95a5a6; text-align: center; margin: 20px 0; font-style: italic;">No hay conceptos agregados aún</p>
                        <div id="added-concepts-list"></div>
                    </div>

                    <div id="payslip-totals" style="margin-top: 25px; padding: 20px; border-radius: 10px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 1.05em;">
                            <div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.7); border-radius: 6px;">
                                <span style="color: #34495e; font-weight: 600;">Salario Base:</span>
                                <strong id="total-base" style="color: #2c3e50;">Bs. 0,00</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(39, 174, 96, 0.1); border-radius: 6px;">
                                <span style="color: #27ae60; font-weight: 600;">Total Asignaciones:</span>
                                <strong id="total-asignaciones" style="color: #27ae60;">+ Bs. 0,00</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(231, 76, 60, 0.1); border-radius: 6px;">
                                <span style="color: #e74c3c; font-weight: 600;">Total Deducciones:</span>
                                <strong id="total-deducciones" style="color: #e74c3c;">- Bs. 0,00</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(52, 152, 219, 0.15); border-radius: 6px;">
                                <span style="color: #2980b9; font-weight: 700; font-size: 1.1em;">Neto a Pagar:</span>
                                <strong id="total-neto" style="color: #2980b9; font-size: 1.2em;">Bs. 0,00</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 25px; display: flex; gap: 15px;">
                    <button id="generate-payslip-btn" class="primary" style="padding: 15px 30px; background: linear-gradient(135deg, #2ecc71 0%, #3498db 100%); border: none; border-radius: 10px; color: #fff; font-weight: 700; cursor: pointer; font-size: 1.05em; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.38); display: flex; align-items: center; gap: 10px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                        Generar Recibo de Pago
                    </button>
                </div>
            </div>
        `;
        contentDetails.innerHTML = html;

        // --- DOM Elements ---
        const salarioBaseInput = document.getElementById('payment-salario-base');
        const addConceptoBtn = document.getElementById('add-concepto-btn');
        const addConceptoSelect = document.getElementById('add-concepto-select');
        const addConceptoAux = document.getElementById('add-concepto-aux');
        const periodoSelect = document.getElementById('payment-periodo');
        const fechaPagoInput = document.getElementById('payment-fecha-pago');
        const fechaInicioInput = document.getElementById('payment-fecha-inicio');
        const fechaFinInput = document.getElementById('payment-fecha-fin');
        const workerSelect = document.getElementById('payment-worker');
        const generateBtn = document.getElementById('generate-payslip-btn');

        // create and insert salary warning element
        let salaryWarning = document.getElementById('salary-warning');
        if (!salaryWarning) {
            salaryWarning = document.createElement('div');
            salaryWarning.id = 'salary-warning';
            salaryWarning.style.marginTop = '8px';
            salaryWarning.style.fontWeight = '600';
            salarioBaseInput.insertAdjacentElement('afterend', salaryWarning);
        }

        // Corrección definitiva: Obtener fecha de hoy local evitando desfases por UTC
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const today = `${year}-${month}-${day}`;
        fechaPagoInput.valueAsDate = now;
        fechaPagoInput.max = today;

        // --- Rendering and Update functions ---
        const formatCurrencyLocal = (amount) => `Bs. ${parseFloat(amount || 0).toFixed(2).replace('.', ',')}`;

        // Constantes Legales (Venezuela)
        const SALARIO_MINIMO_LEGAL = 130.00;

        // Disable/enable controls when salary is below legal minimum
        function checkSalaryMin() {
            const val = parseFloat(salarioBaseInput.value) || 0;
            const tooLow = val < SALARIO_MINIMO_LEGAL;
            [periodoSelect, fechaPagoInput, fechaInicioInput, fechaFinInput, addConceptoSelect, addConceptoBtn, workerSelect].forEach(el => { if (el) el.disabled = tooLow; });
            if (generateBtn) generateBtn.disabled = tooLow;
            if (tooLow) {
                salaryWarning.textContent = 'No se puede colocar un salario base menor a 130 Bs.';
                salaryWarning.style.color = '#e74c3c';
            } else {
                salaryWarning.textContent = '';
            }
        }

        function countMondaysJS(startStr, endStr) {
            if (!startStr || !endStr) return 2;
            const start = new Date(startStr + 'T00:00:00');
            const end = new Date(endStr + 'T00:00:00');
            let count = 0;
            let cur = new Date(start);
            while (cur <= end) {
                if (cur.getDay() === 1) count++;
                cur.setDate(cur.getDate() + 1);
            }
            return count || 2;
        }

        // Extrae el primer número encontrado en un string (ej: "15 días" -> 15)
        function extractNumericJS(str) {
            if (!str) return 1;
            const match = str.match(/(\d+(\.\d+)?)/);
            return match ? parseFloat(match[0]) : 1;
        }

        function renderAddedConcepts() {
            const container = document.getElementById('added-concepts-list');
            const noConceptsMsg = document.getElementById('no-concepts-msg');
            if (addedConcepts.length === 0) {
                container.innerHTML = '';
                noConceptsMsg.style.display = 'block';
            } else {
                noConceptsMsg.style.display = 'none';
                container.innerHTML = addedConcepts.map((c, index) => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #f0f0f0;">
                        <div>
                            <strong>${c.Nombre_Concepto}</strong>
                            <span style="font-size: 0.9em; color: #777; margin-left: 10px;">(${c.Tipo})</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <span style="font-size: 0.9em; color: #555;">${c.aux || ''}</span>
                            <strong style="color: ${c.Tipo === 'Deducción' ? '#e74c3c' : '#27ae60'};">
                                ${(() => {
                        const units = extractNumericJS(c.aux);
                        let rate = parseFloat(c.Monto) || 0;
                        const name = (c.Nombre_Concepto || '').toLowerCase();
                        const dailyKws = ['dias laborables', 'días laborables', 'dias no laborados', 'días no laborados', 'faltas', 'inasistencias', 'vacaciones', 'bono vacacional', 'permiso no remunerado', 'utilidades', 'bono de produccion', 'bono de asistencia'];

                        const isDaily = dailyKws.some(kw => name.includes(kw));

                        // If concept is daily-based (calculated as Salario/30) hide the displayed price in the list.
                        if (isDaily) {
                            return '<span style="color: #95a5a6; font-weight:600;">-</span>';
                        }

                        if (isDaily) {
                            rate = (parseFloat(salarioBaseInput.value) || 0) / 30;
                        }
                        return formatCurrencyLocal(rate * units);
                    })()}
                            </strong>
                            <button class="remove-concepto-btn" data-index="${index}" style="background: #e74c3c; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">X</button>
                        </div>
                    </div>
                `).join('');
            }
            updateTotals();
            attachRemoveConceptListeners();
        }

        function updateTotals() {
            const salarioBase = parseFloat(salarioBaseInput.value) || 0;

            // Determinar base de cálculo (salarioBase + conceptos de sueldo)
            let baseCalculo = salarioBase;
            let totalIngresos = 0; // Para FAOV legal

            addedConcepts.forEach(c => {
                const unidades = extractNumericJS(c.aux);
                let montoUnitario = parseFloat(c.Monto) || 0;

                // LÓGICA ESPECIAL: Conceptos basados en Salario Diario (Sueldo / 30)
                const nombre = (c.Nombre_Concepto || '').toLowerCase();
                const dailyKws = ['dias laborables', 'días laborables', 'dias no laborados', 'días no laborados', 'faltas', 'inasistencias', 'vacaciones', 'bono vacacional', 'permiso no remunerado', 'utilidades', 'bono de produccion', 'bono de asistencia'];

                if (dailyKws.some(kw => nombre.includes(kw))) {
                    montoUnitario = salarioBase / 30;
                }

                const montoTotal = montoUnitario * unidades;

                if (nombre.includes('sueldo') || nombre.includes('salario') || dailyKws.some(kw => nombre.includes(kw))) {
                    baseCalculo += montoTotal;
                }

                if (c.Tipo === 'Asignación' || c.Tipo === 'Bonificación' || nombre.includes('sueldo') || dailyKws.some(kw => nombre.includes(kw))) {
                    totalIngresos += montoTotal;
                }
            });

            // Si el salario base es 0, usamos totalIngresos como base para SSO/RPE
            if (baseCalculo <= 0) baseCalculo = totalIngresos;

            let totalAsignaciones = 0;
            let totalDeducciones = 0;

            addedConcepts.forEach(c => {
                const unidades = extractNumericJS(c.aux);
                let montoUnitario = parseFloat(c.Monto) || 0;

                const nombre = (c.Nombre_Concepto || '').toLowerCase();
                const dailyKws = ['dias laborables', 'días laborables', 'dias no laborados', 'días no laborados', 'faltas', 'inasistencias', 'vacaciones', 'bono vacacional', 'permiso no remunerado', 'utilidades', 'bono de produccion', 'bono de asistencia'];

                if (dailyKws.some(kw => nombre.includes(kw))) {
                    montoUnitario = salarioBase / 30;
                }

                const montoTotal = montoUnitario * unidades;

                if (c.Tipo === 'Asignación' || c.Tipo === 'Bonificación') {
                    totalAsignaciones += montoTotal;
                } else if (c.Tipo === 'Deducción') {
                    totalDeducciones += montoTotal;
                }
            });

            // Cálculos automáticos de ley para el preview
            let autoDeduc = 0;
            if (baseCalculo > 0) {
                const hasSSO = addedConcepts.some(c => (c.Nombre_Concepto || '').includes('SSO') || (c.Nombre_Concepto || '').includes('Social') || c.Codigo === 'IVSS');
                const hasRPE = addedConcepts.some(c => (c.Nombre_Concepto || '').includes('RPE') || (c.Nombre_Concepto || '').includes('Empleo') || c.Codigo === 'SPF');
                const hasFAOV = addedConcepts.some(c => (c.Nombre_Concepto || '').includes('FAOV') || (c.Nombre_Concepto || '').includes('Vivienda') || c.Codigo === 'FAOV');

                const mondays = countMondaysJS(fechaInicioInput.value, fechaFinInput.value);

                // Aplicar tope de 5 salarios mínimos
                const topeMensual = SALARIO_MINIMO_LEGAL * 5;
                const baseDeduccion = Math.min(baseCalculo, topeMensual);
                const sueldoSemanal = (baseDeduccion * 12) / 52;

                if (!hasSSO) autoDeduc += sueldoSemanal * 0.04 * mondays;
                if (!hasRPE) autoDeduc += sueldoSemanal * 0.005 * mondays;

                // FAOV legal es sobre el total de ingresos (integral)
                if (!hasFAOV) autoDeduc += totalIngresos * 0.01;
            }

            const neto = salarioBase + totalAsignaciones - totalDeducciones - autoDeduc;

            document.getElementById('total-base').textContent = formatCurrencyLocal(salarioBase);
            document.getElementById('total-asignaciones').textContent = `+ ${formatCurrencyLocal(totalAsignaciones)}`;
            document.getElementById('total-deducciones').textContent = `- ${formatCurrencyLocal(totalDeducciones + autoDeduc)}`;
            document.getElementById('total-neto').textContent = formatCurrencyLocal(neto);
        }

        // --- Event Listeners ---
        function attachRemoveConceptListeners() {
            document.querySelectorAll('.remove-concepto-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.getAttribute('data-index'));
                    addedConcepts.splice(index, 1);
                    renderAddedConcepts();
                });
            });
        }

        salarioBaseInput.addEventListener('input', () => { updateTotals(); checkSalaryMin(); });

        // run check on load
        checkSalaryMin();

        periodoSelect.addEventListener('change', (e) => {
            const quincena = parseInt(e.target.value);
            if (!quincena) return;

            const year = new Date().getFullYear();
            const month = Math.floor((quincena - 1) / 2); // 0-11
            const half = (quincena - 1) % 2; // 0 or 1

            let startDay, endDay;
            if (half === 0) {
                startDay = 1;
                endDay = 15;
            } else {
                startDay = 16;
                endDay = new Date(year, month + 1, 0).getDate();
            }

            const pad = (n) => String(n).padStart(2, '0');
            fechaInicioInput.value = `${year}-${pad(month + 1)}-${pad(startDay)}`;
            fechaFinInput.value = `${year}-${pad(month + 1)}-${pad(endDay)}`;
        });

        addConceptoBtn.addEventListener('click', () => {
            const conceptId = addConceptoSelect.value;
            if (!conceptId) return;

            const alreadyAdded = addedConcepts.some(c => c.Id_Concepto == conceptId);
            if (alreadyAdded) {
                showAlert('Este concepto ya ha sido agregado.');
                return;
            }

            const conceptToAdd = allConcepts.find(c => c.Id_Concepto == conceptId);
            if (conceptToAdd) {
                const auxValue = addConceptoAux.value.trim();
                addedConcepts.push({ ...conceptToAdd, aux: auxValue });
                addConceptoAux.value = ''; // Reset aux field
                renderAddedConcepts();
            }
        });

        document.getElementById('generate-payslip-btn').addEventListener('click', async () => {
            const workerSelect = document.getElementById('payment-worker');
            if (!workerSelect.value) { await showAlert('Por favor, seleccione un trabajador.'); return; }
            const periodo = document.getElementById('payment-periodo').value.trim();
            const fechaPago = document.getElementById('payment-fecha-pago').value;
            if (!periodo || !fechaPago) { await showAlert('Por favor, complete los campos requeridos (Período y Fecha de Pago).'); return; }
            if (addedConcepts.length === 0) { await showAlert('Por favor, agregue al menos un concepto antes de generar el recibo.'); return; }

            // Validar fechas: fecha inicio no puede ser posterior a fecha fin
            const fechaInicio = fechaInicioInput.value;
            const fechaFin = fechaFinInput.value;
            if (fechaInicio && fechaFin && new Date(fechaInicio) > new Date(fechaFin)) {
                await showAlert('La fecha de inicio no puede ser posterior a la fecha de fin.');
                return;
            }

            const salarioBase = parseFloat(salarioBaseInput.value) || 0;
            if (salarioBase < 130) {
                await showAlert('El salario base no puede ser menor a 130 Bs.');
                return;
            }
            let totalAsignaciones = 0;
            let totalBonificaciones = 0;
            let totalDeducciones = 0;

            addedConcepts.forEach(c => {
                const monto = parseFloat(c.Monto) || 0;
                if (c.Tipo === 'Asignación') totalAsignaciones += monto;
                if (c.Tipo === 'Bonificación') totalBonificaciones += monto;
                if (c.Tipo === 'Deducción') totalDeducciones += monto;
            });
            const neto = salarioBase + totalAsignaciones + totalBonificaciones - totalDeducciones;
            const workerId = parseInt(workerSelect.value);
            const worker = workers.find(w => w.id === workerId);

            const newPayslip = {
                periodo: periodo,
                fechaPago: fechaPago,
                fechaInicio: document.getElementById('payment-fecha-inicio').value || fechaPago,
                fechaFin: document.getElementById('payment-fecha-fin').value || fechaPago,
                salarioBase: salarioBase,
                asignaciones: totalAsignaciones,
                bonificaciones: totalBonificaciones,
                deducciones: totalDeducciones,
                neto: neto,
                tipoNomina: 'Quincenal', // This might need to be dynamic
                trabajadorId: worker.id || null,
                trabajador: `${worker.nombres} ${worker.apellidos}`,
                cedula: worker.cedula,
                numeroRecibo: null,
                conceptos: addedConcepts
            };

            try {
                const r = await fetch('./includes/reports/payslips.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    body: JSON.stringify({ data: newPayslip })
                });
                if (!r.ok) {
                    const errorText = await r.text();
                    throw new Error(`Error al crear recibo: ${errorText}`);
                }
                const res = await r.json();

                await showAlert(`Recibo de pago generado exitosamente para ${worker.nombres} ${worker.apellidos}.\nID del Recibo: ${res.id}`);

                workerSelect.value = '';
                document.getElementById('payment-periodo').value = '';
                document.getElementById('payment-fecha-pago').value = '';
                fechaInicioInput.value = '';
                fechaFinInput.value = '';
                salarioBaseInput.value = '0';
                addedConcepts = [];
                renderAddedConcepts();

            } catch (err) {
                console.error(err);
                await showAlert(err.message || 'Error al generar el recibo');
            }
        });

        renderAddedConcepts();
    }

    // --- Funciones para Tipo de Nómina ---
    function renderTipoNominaModule() {
        if (!contentDetails) return;

        contentDetails.innerHTML = `
            <div class="tipo-nomina-module">
                <h4>Gestión de Tipos de Nómina</h4>
                <div style="margin-bottom: 20px;">
                    <button id="btn-add-nomina" class="primary">➕ Nuevo Tipo de Nómina</button>
                </div>

                <div id="form-nomina-container" style="display:none; background: linear-gradient(135deg, #2ecc71 0%, #3498db 100%); padding: 30px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.25);">
                    <h5 style="margin: 0 0 25px 0; color: #fff; font-size: 1.2em; display: flex; align-items: center; gap: 10px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Nuevo Tipo de Nómina
                    </h5>
                    
                    <div style="background: rgba(255,255,255,0.95); padding: 25px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div class="form-row">
                                <label style="display:block; font-weight:600; margin-bottom:10px; color:#34495e; font-size: 0.95em;">Frecuencia <span style="color:#e74c3c;">*</span></label>
                                <input type="text" id="tn-frecuencia" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size: 0.95em;" placeholder="Ej: Semanal, Quincenal, Mensual">
                            </div>
                            <div class="form-row">
                                <label style="display:block; font-weight:600; margin-bottom:10px; color:#34495e; font-size: 0.95em;">Fecha Inicio (Referencia)</label>
                                <input type="date" id="tn-inicio" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size: 0.95em;">
                            </div>
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div class="form-row">
                                <label style="display:block; font-weight:600; margin-bottom:10px; color:#34495e; font-size: 0.95em;">Fecha Fin (Referencia)</label>
                                <input type="date" id="tn-fin" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size: 0.95em;">
                            </div>
                        </div>
                    </div>
                    
                    <div style="display:flex; gap:15px; margin-top:25px;">
                        <button id="btn-save-nomina" class="primary" style="padding: 15px 30px; background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); border: none; border-radius: 10px; color: #fff; font-weight: 700; cursor: pointer; font-size: 1.05em; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.4); display: flex; align-items: center; gap: 10px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                            Guardar
                        </button>
                        <button id="btn-cancel-nomina" style="padding: 15px 30px; border-radius: 10px; border: 2px solid #fff; background: transparent; color: #fff; cursor: pointer; font-weight: 600; font-size: 1.05em;">Cancelar</button>
                    </div>
                </div>

                <!-- Lista de Tipos de Nómina -->
                <div id="lista-nominas-container">
                    <p>Cargando tipos de nómina...</p>
                </div>

                <!-- Vista de Trabajadores por Nómina -->
                <div id="workers-nomina-view" style="display:none; margin-top:30px; border-top:2px solid #eee; padding-top:20px;">
                    <h4 id="workers-nomina-title" style="color:#2c3e50;">Trabajadores</h4>
                    <div id="workers-nomina-list"></div>
                </div>
            </div>
        `;

        // Event Listeners
        document.getElementById('btn-add-nomina').addEventListener('click', () => {
            document.getElementById('form-nomina-container').style.display = 'block';
            document.getElementById('tn-frecuencia').focus();
        });

        document.getElementById('btn-cancel-nomina').addEventListener('click', () => {
            document.getElementById('form-nomina-container').style.display = 'none';
            document.getElementById('tn-frecuencia').value = '';
            document.getElementById('tn-inicio').value = '';
            document.getElementById('tn-fin').value = '';
        });

        document.getElementById('btn-save-nomina').addEventListener('click', async () => {
            const freq = document.getElementById('tn-frecuencia').value.trim();
            const ini = document.getElementById('tn-inicio').value;
            const fin = document.getElementById('tn-fin').value;

            if (!freq) {
                await showAlert('La frecuencia es obligatoria');
                return;
            }

            // Validar que la frecuencia solo contenga letras
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(freq)) {
                await showAlert('La frecuencia solo puede contener letras y espacios');
                return;
            }

            // Validar fechas si se proporcionan
            if (ini && fin) {
                const fechaInicio = new Date(ini);
                const fechaFin = new Date(fin);

                if (fechaFin < fechaInicio) {
                    await showAlert('La fecha de fin no puede ser anterior a la fecha de inicio');
                    return;
                }
            }

            try {
                const res = await fetch('./includes/reports/create_tipo_nomina.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Frecuencia: freq, Fecha_Inicio: ini, Fecha_Fin: fin })
                });
                const data = await res.json();
                if (res.ok) {
                    await showAlert('Tipo de nómina creado exitosamente');
                    document.getElementById('form-nomina-container').style.display = 'none';
                    document.getElementById('tn-frecuencia').value = '';
                    loadNominas(); // Recargar lista
                } else {
                    await showAlert(data.error || 'Error al crear el tipo de nómina');
                }
            } catch (e) { await showAlert('Error de conexión al guardar'); }
        });

        // Cargar datos iniciales
        loadNominas();
    }

    async function loadNominas() {
        const container = document.getElementById('lista-nominas-container');
        try {
            const res = await fetch('./includes/nomina/list_tipo_nomina.php');
            const data = await res.json();
            const tipos = data.tipos || [];

            if (tipos.length === 0) {
                container.innerHTML = '<div class="alert-info">No hay tipos de nómina registrados.</div>';
                return;
            }

            let html = `
                <table style="width:100%; border-collapse:collapse; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                    <thead>
                        <tr style="background:#3498db; color:#fff;">
                            <th style="padding:12px; text-align:left;">Frecuencia</th>
                            <th style="padding:12px; text-align:left;">Vigencia</th>
                            <th style="padding:12px; text-align:left;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            tipos.forEach(t => {
                const hasInicio = t.Fecha_Inicio && t.Fecha_Inicio !== '0000-00-00';
                const hasFin = t.Fecha_Fin && t.Fecha_Fin !== '0000-00-00';
                const vigencia = (hasInicio && hasFin)
                    ? `${formatLocalDate(t.Fecha_Inicio)} - ${formatLocalDate(t.Fecha_Fin)}`
                    : (hasInicio ? `${formatLocalDate(t.Fecha_Inicio)} - Indefinida` : 'Indefinida');
                html += `
                    <tr style="border-bottom:1px solid #f0f0f0;">
                        <td style="padding:12px;"><strong>${t.Frecuencia}</strong></td>
                        <td style="padding:12px; color:#7f8c8d;">${vigencia}</td>
                        <td style="padding:12px;">
                            <button class="btn-view-workers-nomina" data-id="${t.Id_Tipo_Nomina}" data-name="${t.Frecuencia}" style="background:#2ecc71; color:#fff; border:none; padding:8px 12px; border-radius:4px; cursor:pointer; font-weight:600;">
                                👥 Ver Trabajadores
                            </button>
                        </td>
                    </tr>
                `;
            });

            html += '</tbody></table>';
            container.innerHTML = html;

            // Listeners para botones de ver trabajadores
            container.querySelectorAll('.btn-view-workers-nomina').forEach(btn => {
                btn.addEventListener('click', () => {
                    showWorkersForNomina(btn.getAttribute('data-id'), btn.getAttribute('data-name'));
                });
            });

        } catch (e) {
            container.innerHTML = '<p style="color:red">Error cargando la lista de nóminas.</p>';
        }
    }

    async function showWorkersForNomina(id, name) {
        const view = document.getElementById('workers-nomina-view');
        const title = document.getElementById('workers-nomina-title');
        const list = document.getElementById('workers-nomina-list');

        view.style.display = 'block';
        title.textContent = `Trabajadores asignados a Nómina: ${name}`;
        list.innerHTML = '<p>Cargando trabajadores...</p>';
        view.scrollIntoView({ behavior: 'smooth' });

        try {
            // Reutilizamos list_workers.php que devuelve todos los trabajadores y filtramos en cliente
            const res = await fetch('./includes/workers/list_workers.php');
            const data = await res.json();
            const workers = data.workers || [];
            // Filtrar por Id_Tipo_Nomina
            const filtered = workers.filter(w => String(w.Id_Tipo_Nomina) === String(id));

            if (filtered.length === 0) {
                list.innerHTML = '<div class="alert-info">No hay trabajadores asignados a este tipo de nómina actualmente.</div>';
                return;
            }

            let html = `<table style="width:100%; border-collapse:collapse; margin-top:10px; background:#fff; border-radius:6px; overflow:hidden;">
                <thead>
                    <tr style="background:#ecf0f1; color:#2c3e50;">
                        <th style="padding:10px; text-align:left;">Nombre Completo</th>
                        <th style="padding:10px; text-align:left;">Cédula</th>
                        <th style="padding:10px; text-align:left;">Cargo</th>
                        <th style="padding:10px; text-align:left;">Estado</th>
                    </tr>
                </thead>
                <tbody>`;

            filtered.forEach(w => {
                html += `
                    <tr style="border-bottom:1px solid #eee;">
                        <td style="padding:10px;">${w.Nombre_Completo} ${w.Apellidos}</td>
                        <td style="padding:10px;">${w.Documento_Identidad}</td>
                        <td style="padding:10px;">${w.Cargo || '-'}</td>
                        <td style="padding:10px;"><span style="background:${w.Contrato_Estado === 'Activo' ? '#d4edda' : '#f8d7da'}; color:${w.Contrato_Estado === 'Activo' ? '#155724' : '#721c24'}; padding:2px 8px; border-radius:10px; font-size:0.85em;">${w.Contrato_Estado || 'N/A'}</span></td>
                    </tr>
                `;
            });
            html += '</tbody></table>';
            list.innerHTML = html;

        } catch (e) {
            list.innerHTML = '<p style="color:red">Error al cargar los trabajadores.</p>';
        }
    }

    // --- Funciones para Gestión de Conceptos ---
    function renderConceptosModule() {
        if (!contentDetails) return;

        contentDetails.innerHTML = `
            <div class="conceptos-module">
                <h4>Gestión de Conceptos de Nómina</h4>
                <div style="margin-bottom: 20px;">
                    <button id="btn-add-concepto" class="primary">➕ Nuevo Concepto</button>
                </div>

                <div id="form-concepto-container" style="display:none; background: linear-gradient(135deg, #2ecc71 0%, #3498db 100%); padding: 30px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.25);">
                    <h5 style="margin: 0 0 25px 0; color: #fff; font-size: 1.2em; display: flex; align-items: center; gap: 10px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        Nuevo Concepto de Nómina
                    </h5>
                    
                    <div style="background: rgba(255,255,255,0.95); padding: 25px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 20px;">
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div style="grid-column: 1 / 3;">
                                <label style="display:block; font-weight:600; margin-bottom:10px; color:#34495e; font-size: 0.95em;">Nombre del Concepto <span style="color:#e74c3c;">*</span></label>
                                <input type="text" id="c-nombre" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size: 0.95em;" placeholder="Ej: Salario Base, Bono de Alimentación, Seguro Social">
                            </div>
                            <div class="form-row">
                                <label style="display:block; font-weight:600; margin-bottom:10px; color:#34495e; font-size: 0.95em;">Código (ID Personalizado)</label>
                                <input type="text" id="c-codigo" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size: 0.95em;" placeholder="Ej: C001, SSO, FAOV">
                            </div>
                            <div class="form-row">
                                <label style="display:block; font-weight:600; margin-bottom:10px; color:#34495e; font-size: 0.95em;">Tipo de Concepto <span style="color:#e74c3c;">*</span></label>
                                <select id="c-tipo" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size: 0.95em; background: #fff;">
                                    <option value="">Seleccione un tipo</option>
                                    <option value="Asignación">Asignación</option>
                                    <option value="Deducción">Deducción</option>
                                    <option value="Bonificación">Bonificación</option>
                                    <option value="Sin tipo">Sin tipo (solo concepto base)</option>
                                </select>
                            </div>
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div style="grid-column: 1 / 3;">
                                <label style="display:block; font-weight:600; margin-bottom:10px; color:#34495e; font-size: 0.95em;">Descripción</label>
                                <textarea id="c-descripcion" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size: 0.95em; min-height: 80px;" placeholder="Descripción detallada del concepto"></textarea>
                            </div>
                            <div class="form-row">
                                <label style="display:block; font-weight:600; margin-bottom:10px; color:#34495e; font-size: 0.95em;">Monto (Bs.)</label>
                                <input type="number" id="c-monto" step="0.01" min="0" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size: 0.95em;" placeholder="0.00">
                            </div>
                            <div class="form-row">
                                <label style="display:block; font-weight:600; margin-bottom:10px; color:#34495e; font-size: 0.95em;">Observaciones (para Bonificaciones)</label>
                                <textarea id="c-observaciones" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size: 0.95em; min-height: 50px;" placeholder="Observaciones adicionales (opcional)"></textarea>
                            </div>
                        </div>
                        <div style="margin-top:15px; padding:15px; background:rgba(52, 152, 219, 0.1); border-left:4px solid #3498db; border-radius:8px; font-size:0.9em; color:#2c3e50; line-height: 1.5;">
                            <strong style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                Tip de Sueldo:
                            </strong>
                            Los conceptos que incluyan <strong>"Días Laborables", "Días no laborados", "Faltas", "Inasistencias", "Vacaciones" o "Permiso no remunerado"</strong> calcularán su valor automáticamente como <strong>(Salario Base / 30)</strong>.
                        </div>
                    </div>
                    
                    <div style="display:flex; gap:15px; margin-top:25px;">
                        <button id="btn-save-concepto" class="primary" style="padding: 15px 30px; background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); border: none; border-radius: 10px; color: #fff; font-weight: 700; cursor: pointer; font-size: 1.05em; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.4); display: flex; align-items: center; gap: 10px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                            Guardar Concepto
                        </button>
                        <button id="btn-cancel-concepto" style="padding: 15px 30px; border-radius: 10px; border: 2px solid #fff; background: transparent; color: #fff; cursor: pointer; font-weight: 600; font-size: 1.05em;">Cancelar</button>
                        <div id="concepto-msg" style="color: #fff; font-weight: 600; align-self: center;"></div>
                    </div>
                </div>

                <!-- Lista de Conceptos -->
                <div id="lista-conceptos-container">
                    <p>Cargando conceptos...</p>
                </div>
            </div>
        `;

        // Funciones de validación (definidas antes de usarse)
        function validarSoloLetras(texto) {
            // Permite letras, espacios, acentos, ñ, guiones y apóstrofes
            const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-\']+$/;
            return regex.test(texto);
        }

        function validarSoloNumeros(valor) {
            if (!valor || valor === '') {
                return false;
            }
            // Permite números enteros y decimales (con punto o coma)
            const regex = /^[0-9]+([.,][0-9]+)?$/;
            return regex.test(valor.toString().replace('.', ','));
        }

        // Configurar validación en tiempo real (una sola vez)
        function setupValidacionTiempoReal() {
            // Validación en tiempo real para el campo nombre (solo letras)
            const nombreInput = document.getElementById('c-nombre');
            if (nombreInput && !nombreInput.dataset.validacionConfigurada) {
                nombreInput.dataset.validacionConfigurada = 'true';

                nombreInput.addEventListener('input', function (e) {
                    const valor = e.target.value;
                    // Si contiene números o caracteres especiales no permitidos, mostrar advertencia
                    if (valor && !validarSoloLetras(valor)) {
                        e.target.style.borderColor = '#f39c12'; // Amarillo para advertencia
                    } else {
                        e.target.style.borderColor = '#ddd'; // Normal
                    }
                });

                // Prevenir entrada de números y caracteres especiales
                nombreInput.addEventListener('keypress', function (e) {
                    const char = String.fromCharCode(e.which);
                    // Permitir letras, espacios, acentos, guiones, apóstrofes y teclas de control
                    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-\']/.test(char) && !e.ctrlKey && !e.metaKey && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                        e.preventDefault();
                        const msgEl = document.getElementById('concepto-msg');
                        msgEl.textContent = 'El nombre solo puede contener letras, espacios y acentos';
                        msgEl.style.color = '#f39c12';
                        setTimeout(() => {
                            if (msgEl.textContent.includes('solo puede contener letras')) {
                                msgEl.textContent = '';
                            }
                        }, 3000);
                    }
                });
            }

            // Validación en tiempo real para el campo monto (solo números)
            const montoInput = document.getElementById('c-monto');
            if (montoInput && !montoInput.dataset.validacionConfigurada) {
                montoInput.dataset.validacionConfigurada = 'true';

                montoInput.addEventListener('input', function (e) {
                    const valor = e.target.value;
                    // Si contiene letras o caracteres especiales no permitidos, mostrar advertencia
                    if (valor && !validarSoloNumeros(valor)) {
                        e.target.style.borderColor = '#f39c12'; // Amarillo para advertencia
                    } else {
                        e.target.style.borderColor = '#ddd'; // Normal
                    }
                });

                // Prevenir entrada de letras y caracteres especiales (excepto punto y coma para decimales)
                montoInput.addEventListener('keypress', function (e) {
                    const char = String.fromCharCode(e.which);
                    const valorActual = e.target.value;
                    // Permitir números, un solo punto o coma decimal, y teclas de control
                    if (!/[0-9.,]/.test(char) && !e.ctrlKey && !e.metaKey && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                        e.preventDefault();
                        const msgEl = document.getElementById('concepto-msg');
                        msgEl.textContent = 'El monto solo puede contener números y un punto o coma decimal';
                        msgEl.style.color = '#f39c12';
                        setTimeout(() => {
                            if (msgEl.textContent.includes('solo puede contener números')) {
                                msgEl.textContent = '';
                            }
                        }, 3000);
                    }

                    // Prevenir múltiples puntos o comas
                    if ((char === '.' || char === ',') && (valorActual.includes('.') || valorActual.includes(','))) {
                        e.preventDefault();
                    }
                });
            }
        }

        // Event Listeners
        document.getElementById('btn-add-concepto').addEventListener('click', () => {
            document.getElementById('form-concepto-container').style.display = 'block';
            document.getElementById('c-nombre').focus();
            document.getElementById('concepto-msg').textContent = '';
            // Limpiar formulario
            document.getElementById('c-nombre').value = '';
            document.getElementById('c-codigo').value = '';
            document.getElementById('c-descripcion').value = '';
            document.getElementById('c-tipo').value = '';
            document.getElementById('c-monto').value = '';
            document.getElementById('c-observaciones').value = '';

            // Limpiar estilos de error
            ['c-nombre', 'c-monto', 'c-tipo'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.borderColor = '#ddd';
            });

            // Configurar validación en tiempo real después de mostrar el formulario
            setTimeout(() => {
                setupValidacionTiempoReal();
            }, 100);
        });

        document.getElementById('btn-cancel-concepto').addEventListener('click', () => {
            document.getElementById('form-concepto-container').style.display = 'none';
            document.getElementById('concepto-msg').textContent = '';
        });

        document.getElementById('btn-save-concepto').addEventListener('click', async () => {
            const nombre = document.getElementById('c-nombre').value.trim();
            const codigo = document.getElementById('c-codigo').value.trim();
            const descripcion = document.getElementById('c-descripcion').value.trim();
            const tipo = document.getElementById('c-tipo').value;
            const montoInput = document.getElementById('c-monto').value.trim();
            const observaciones = document.getElementById('c-observaciones').value.trim();

            const msgEl = document.getElementById('concepto-msg');

            // Limpiar errores visuales previos
            ['c-nombre', 'c-monto', 'c-tipo'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.borderColor = '#ddd';
            });

            // Validación: Nombre obligatorio
            if (!nombre) {
                msgEl.textContent = 'El nombre del concepto es obligatorio';
                msgEl.style.color = '#e74c3c';
                document.getElementById('c-nombre').style.borderColor = '#e74c3c';
                return;
            }

            // Validación: Si hay monto, se requiere un tipo
            if (montoInput && (tipo === '' || tipo === 'Sin tipo')) {
                msgEl.textContent = 'Debe seleccionar un Tipo (Asignación, Deducción o Bonificación) si ingresa un Monto.';
                msgEl.style.color = '#e74c3c';
                document.getElementById('c-tipo').style.borderColor = '#e74c3c';
                return;
            }

            // Validación: Nombre solo letras
            if (!validarSoloLetras(nombre)) {
                msgEl.textContent = 'El nombre del concepto solo puede contener letras, espacios y acentos. No se permiten números ni caracteres especiales.';
                msgEl.style.color = '#e74c3c';
                document.getElementById('c-nombre').style.borderColor = '#e74c3c';
                return;
            }

            // Validación: Longitud del nombre
            if (nombre.length < 3) {
                msgEl.textContent = 'El nombre del concepto debe tener al menos 3 caracteres';
                msgEl.style.color = '#e74c3c';
                document.getElementById('c-nombre').style.borderColor = '#e74c3c';
                return;
            }

            if (nombre.length > 100) {
                msgEl.textContent = 'El nombre del concepto no puede exceder 100 caracteres';
                msgEl.style.color = '#e74c3c';
                document.getElementById('c-nombre').style.borderColor = '#e74c3c';
                return;
            }

            // Validación: Monto requerido si hay tipo
            if (tipo && tipo !== 'Sin tipo' && !montoInput) {
                msgEl.textContent = 'El monto es requerido cuando se especifica un tipo';
                msgEl.style.color = '#e74c3c';
                document.getElementById('c-monto').style.borderColor = '#e74c3c';
                return;
            }

            // Validación: Monto solo números (si se proporciona)
            let monto = null;
            if (montoInput) {
                if (!validarSoloNumeros(montoInput)) {
                    msgEl.textContent = 'El monto solo puede contener números y un punto o coma decimal. No se permiten letras ni otros caracteres especiales.';
                    msgEl.style.color = '#e74c3c';
                    document.getElementById('c-monto').style.borderColor = '#e74c3c';
                    return;
                }

                // Convertir a número (acepta punto o coma como separador decimal)
                monto = parseFloat(montoInput.replace(',', '.'));

                // Validar que el monto sea positivo
                if (monto < 0) {
                    msgEl.textContent = 'El monto no puede ser negativo';
                    msgEl.style.color = '#e74c3c';
                    document.getElementById('c-monto').style.borderColor = '#e74c3c';
                    return;
                }
            }

            msgEl.textContent = 'Guardando...';
            msgEl.style.color = '#7f8c8d';

            try {
                const res = await fetch('./includes/nomina/create_concepto.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    body: JSON.stringify({
                        Nombre_Concepto: nombre,
                        Codigo: codigo || null,
                        Descripcion: descripcion || null,
                        Tipo: tipo || null,
                        Monto: monto,
                        Observaciones: observaciones || null
                    })
                });

                const responseText = await res.text();
                let data;
                try {
                    data = JSON.parse(responseText);
                } catch (jsonError) {
                    // The response is not JSON. It could be a simple success message or a PHP error.
                    if (res.ok) {
                        // Assume success because status is OK. The user report suggests this is the case.
                        msgEl.textContent = 'Concepto creado exitosamente';
                        msgEl.style.color = '#27ae60';
                        document.getElementById('form-concepto-container').style.display = 'none';
                        loadConceptos(); // Recargar lista
                        console.log('Server returned non-JSON response on success:', responseText);
                    } else {
                        // It's an error and not JSON. Display the text.
                        msgEl.textContent = `Error del servidor: ${responseText || 'Respuesta inválida'}`;
                        msgEl.style.color = '#e74c3c';
                        console.error('Error response (not JSON):', responseText);
                    }
                    return;
                }

                if (res.ok) {
                    msgEl.textContent = 'Concepto creado exitosamente';
                    msgEl.style.color = '#27ae60';
                    document.getElementById('form-concepto-container').style.display = 'none';
                    loadConceptos(); // Recargar lista
                } else {
                    msgEl.textContent = data.error || `Error al crear el concepto (${res.status})`;
                    msgEl.style.color = '#e74c3c';
                    console.error('Error response:', data);
                }
            } catch (e) {
                msgEl.textContent = `Error de conexión: ${e.message || 'No se pudo conectar con el servidor'}`;
                msgEl.style.color = '#e74c3c';
                console.error('Network error:', e);
            }
        });

        // Cargar datos iniciales
        loadConceptos();
    }

    async function loadConceptos() {
        const container = document.getElementById('lista-conceptos-container');
        if (!container) return;

        try {
            const res = await fetch('./includes/nomina/list_conceptos.php');
            const data = await res.json();
            const conceptos = data.conceptos || [];

            if (conceptos.length === 0) {
                container.innerHTML = '<div class="alert-info" style="padding:15px; background:#e8f4f8; border-radius:6px; color:#2c3e50;">No hay conceptos registrados. Crea uno nuevo usando el botón "➕ Nuevo Concepto".</div>';
                return;
            }

            let html = `
                <table style="width:100%; border-collapse:collapse; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                    <thead>
                        <tr style="background:#3498db; color:#fff;">
                            <th style="padding:12px; text-align:left;">Código</th>
                            <th style="padding:12px; text-align:left;">Nombre</th>
                            <th style="padding:12px; text-align:left;">Descripción</th>
                            <th style="padding:12px; text-align:left;">Tipo</th>
                            <th style="padding:12px; text-align:right;">Monto (Bs.)</th>
                            <th style="padding:12px; text-align:center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            conceptos.forEach(c => {
                const tipoColor = c.Tipo === 'Asignación' ? '#2ecc71' :
                    c.Tipo === 'Deducción' ? '#e74c3c' :
                        c.Tipo === 'Bonificación' ? '#f39c12' : '#95a5a6';
                const montoDisplay = c.Monto !== null ? parseFloat(c.Monto).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '-';

                html += `
                    <tr style="border-bottom:1px solid #f0f0f0;">
                        <td style="padding:12px;"><span style="color:#3498db; font-weight:bold;">${c.Codigo || '-'}</span></td>
                        <td style="padding:12px;"><strong>${c.Nombre_Concepto}</strong></td>
                        <td style="padding:12px; color:#7f8c8d;">${c.Descripcion || '-'}</td>
                        <td style="padding:12px;">
                            <span style="background:${tipoColor}; color:#fff; padding:4px 10px; border-radius:12px; font-size:0.85em; font-weight:600;">
                                ${c.Tipo || 'Sin tipo'}
                            </span>
                        </td>
                        <td style="padding:12px; text-align:right; font-weight:600; color:#2c3e50;">
                            ${montoDisplay !== '-' ? 'Bs. ' + montoDisplay : '-'}
                        </td>
                        <td style="padding:12px; text-align:center; display:flex; gap:5px; justify-content:center;">
                            <button class="btn-edit-concepto" data-id="${c.Id_Concepto}" style="background:#f39c12; color:#fff; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; font-weight:600; font-size:0.9em;">
                                ✏️ Editar
                            </button>
                            <button class="btn-delete-concepto" data-id="${c.Id_Concepto}" data-name="${c.Nombre_Concepto}" style="background:#e74c3c; color:#fff; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; font-weight:600; font-size:0.9em;">
                                🗑️ Eliminar
                            </button>
                        </td>
                    </tr>
                `;
            });

            html += '</tbody></table>';
            container.innerHTML = html;

            // Event listeners para los botones de editar
            container.querySelectorAll('.btn-edit-concepto').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    const concepto = conceptos.find(x => String(x.Id_Concepto) === String(id));
                    if (concepto) openEditConceptoModal(concepto);
                });
            });

            // Agregar event listeners para los botones de eliminar
            container.querySelectorAll('.btn-delete-concepto').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id');
                    const nombre = btn.getAttribute('data-name');

                    if (!await showConfirm(`¿Está seguro de que desea eliminar el concepto "${nombre}"?\n\nEsta acción no se puede deshacer.`)) {
                        return;
                    }

                    try {
                        const res = await fetch('./includes/nomina/delete_concepto.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: parseInt(id) })
                        });
                        const data = await res.json();

                        if (res.ok) {
                            await showAlert('Concepto eliminado exitosamente');
                            loadConceptos(); // Recargar la lista
                        } else {
                            await showAlert(data.error || 'Error al eliminar el concepto');
                        }
                    } catch (e) {
                        await showAlert('Error de conexión al eliminar el concepto');
                    }
                });
            });

        } catch (e) {
            container.innerHTML = '<p style="color:#e74c3c; padding:15px;">Error cargando la lista de conceptos. Por favor, recarga la página.</p>';
        }
    }

    // Modal para editar concepto
    function openEditConceptoModal(concepto) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal-content" style="max-width:500px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px">
                    <h4 style="margin:0">Editar Concepto</h4>
                    <button class="modal-close">✖</button>
                </div>
                <div class="form-group" style="margin-bottom:10px;">
                    <label style="display:block; font-weight:bold; margin-bottom:5px;">Nombre <span style="color:red">*</span></label>
                    <input type="text" id="edit-c-nombre" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px;" value="${concepto.Nombre_Concepto}">
                </div>
                <div class="form-group" style="margin-bottom:10px;">
                    <label style="display:block; font-weight:bold; margin-bottom:5px;">Código (ID Personalizado)</label>
                    <input type="text" id="edit-c-codigo" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px;" value="${concepto.Codigo || ''}">
                </div>
                <div class="form-group" style="margin-bottom:15px;">
                    <label style="display:block; font-weight:bold; margin-bottom:5px;">Descripción</label>
                    <textarea id="edit-c-descripcion" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px; min-height:80px;">${concepto.Descripcion || ''}</textarea>
                </div>
                <div style="display:flex; gap:10px; justify-content:flex-end;">
                    <button id="btn-update-concepto" class="primary">Actualizar</button>
                    <button class="modal-close" style="background:#fff; border:1px solid #ccc; padding:8px 15px; border-radius:5px; cursor:pointer;">Cancelar</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const close = () => overlay.remove();
        overlay.querySelectorAll('.modal-close').forEach(b => b.addEventListener('click', close));

        document.getElementById('btn-update-concepto').addEventListener('click', async () => {
            const nombre = document.getElementById('edit-c-nombre').value.trim();
            const codigo = document.getElementById('edit-c-codigo').value.trim();
            const descripcion = document.getElementById('edit-c-descripcion').value.trim();

            if (!nombre) { await showAlert('El nombre es obligatorio'); return; }

            try {
                const res = await fetch('./includes/nomina/update_concepto.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        Id_Concepto: concepto.Id_Concepto,
                        Nombre_Concepto: nombre,
                        Codigo: codigo,
                        Descripcion: descripcion
                    })
                });
                const data = await res.json();
                if (res.ok) {
                    await showAlert('Concepto actualizado');
                    close();
                    loadConceptos();
                } else {
                    await showAlert(data.error || 'Error al actualizar');
                }
            } catch (e) { await showAlert('Error de conexión'); }
        });
    }

    // --- Funciones para Gestión de Cargos ---
    function renderCargosModule() {
        if (!contentDetails) return;

        // --- HTML Structure ---
        contentDetails.innerHTML = `
            <div class="cargos-module">
                <h4>Gestión de Cargos</h4>
                <div style="margin-bottom: 20px;">
                    <button id="btn-add-cargo" class="primary">➕ Nuevo Cargo</button>
                </div>

                <!-- Formulario de creación (oculto por defecto) -->
                <div id="form-cargo-container" style="display:none; background: linear-gradient(135deg, #2ecc71 0%, #3498db 100%); padding: 30px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.25);">
                    <h5 style="margin: 0 0 25px 0; color: #fff; font-size: 1.2em; display: flex; align-items: center; gap: 10px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                        Nuevo Cargo
                    </h5>
                    
                    <div style="background: rgba(255,255,255,0.95); padding: 25px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 20px;">
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div class="form-row">
                                <label style="display:block; font-weight:600; margin-bottom:10px; color:#34495e; font-size: 0.95em;">Nombre del Cargo <span style="color:#e74c3c;">*</span></label>
                                <input type="text" id="cargo-nombre" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size: 0.95em;" placeholder="Ej: Gerente">
                            </div>
                            <div class="form-row">
                                <label style="display:block; font-weight:600; margin-bottom:10px; color:#34495e; font-size: 0.95em;">Área</label>
                                <input type="text" id="cargo-area" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size: 0.95em;" placeholder="Ej: Tecnología (Opcional)">
                            </div>
                        </div>
                    </div>
                    
                    <div style="display:flex; gap:15px; margin-top:25px;">
                        <button id="btn-save-cargo" class="primary" style="padding: 15px 30px; background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); border: none; border-radius: 10px; color: #fff; font-weight: 700; cursor: pointer; font-size: 1.05em; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.4); display: flex; align-items: center; gap: 10px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                            Guardar
                        </button>
                        <button id="btn-cancel-cargo" style="padding: 15px 30px; border-radius: 10px; border: 2px solid #fff; background: transparent; color: #fff; cursor: pointer; font-weight: 600; font-size: 1.05em;">Cancelar</button>
                    </div>
                    <div id="cargo-msg" style="color: #fff; font-weight: 600; margin-top: 15px;"></div>
                </div>

                <!-- Lista de Cargos -->
                <div id="lista-cargos-container">
                    <p>Cargando cargos...</p>
                </div>

                <!-- Vista de Trabajadores por Cargo -->
                <div id="workers-cargo-view" style="display:none; margin-top:30px; border-top:2px solid #eee; padding-top:20px;">
                    <h4 id="workers-cargo-title" style="color:#2c3e50;">Trabajadores</h4>
                    <div id="workers-cargo-list"></div>
                </div>
            </div>
        `;

        // --- Data fetching and rendering ---
        const selectedCargoIds = new Set();
        let cachedWorkers = null;

        async function fetchCargos() {
            try {
                const res = await fetch('./includes/nomina/list_cargos.php', { cache: 'no-store' });
                const data = await res.json();
                return res.ok ? (data.cargos || []) : [];
            } catch (e) { return []; }
        }

        async function fetchWorkers() {
            if (cachedWorkers) return cachedWorkers;
            try {
                const res = await fetch('./includes/workers/list_workers.php', { cache: 'no-store' });
                const data = await res.json();
                cachedWorkers = res.ok ? (data.workers || []) : [];
                return cachedWorkers;
            } catch (e) { return []; }
        }

        function getCargoWorkerCounts(workers) {
            return workers.reduce((acc, w) => {
                const key = String(w.Id_Cargo || '');
                if (!key) return acc;
                acc[key] = (acc[key] || 0) + 1;
                return acc;
            }, {});
        }

        function updateCargoToolbar(cargos, workerCounts) {
            const btnToggle = document.getElementById('btn-toggle-selected-cargos');
            const btnClear = document.getElementById('btn-clear-cargo-selection');
            const info = document.getElementById('selected-cargos-info');
            if (!btnToggle || !btnClear || !info) return;

            const selected = cargos.filter(c => selectedCargoIds.has(String(c.Id_Cargo)));
            if (selected.length === 0) {
                btnToggle.textContent = 'Seleccione cargos...';
                btnToggle.disabled = true;
                btnClear.disabled = true;
                info.textContent = '';
                return;
            }

            btnClear.disabled = false;
            const allActive = selected.every(c => String(c.Estado || '').toLowerCase() === 'activo');
            const allInactive = selected.every(c => String(c.Estado || '').toLowerCase() === 'inactivo');
            const hasAssignedWorkers = selected.some(c => (workerCounts[String(c.Id_Cargo)] || 0) > 0);

            if (allInactive) {
                btnToggle.textContent = `Activar todos (${selected.length})`;
                btnToggle.dataset.action = 'activate';
                btnToggle.disabled = false;
                info.textContent = '';
            } else if (allActive) {
                btnToggle.textContent = `Desactivar todos (${selected.length})`;
                btnToggle.dataset.action = 'deactivate';
                btnToggle.disabled = hasAssignedWorkers;
                info.textContent = hasAssignedWorkers ? 'No puedes desactivar cargos que tienen trabajadores asignados.' : '';
            } else {
                btnToggle.textContent = 'Selecciona cargos del mismo estado';
                btnToggle.dataset.action = 'mixed';
                btnToggle.disabled = true;
                info.textContent = 'Solo puede activar o desactivar cargos con el mismo estado.';
            }
        }

        async function loadCargos() {
            const container = document.getElementById('lista-cargos-container');
            selectedCargoIds.clear();
            cachedWorkers = null;

            const [cargos, workers] = await Promise.all([fetchCargos(), fetchWorkers()]);
            const workerCounts = getCargoWorkerCounts(workers);

            if (cargos.length === 0) {
                container.innerHTML = '<div class="alert-info">No hay cargos registrados.</div>';
                return;
            }

            container.innerHTML = `
                <div id="cargo-actions-toolbar" style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:15px; flex-wrap:wrap;">
                    <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
                        <button id="btn-toggle-selected-cargos" class="secondary" disabled style="padding:10px 18px; border-radius:8px; background:#bdc3c7; color:#2c3e50; border:none; cursor:pointer;">Seleccione cargos...</button>
                        <button id="btn-clear-cargo-selection" class="secondary" disabled style="padding:10px 18px; border-radius:8px; background:#ecf0f1; color:#2c3e50; border:none; cursor:pointer;">Limpiar selección</button>
                    </div>
                    <div id="selected-cargos-info" style="color:#34495e; font-size:0.95em; min-width:220px;"></div>
                </div>
                <table style="width:100%; border-collapse:collapse; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                    <thead>
                        <tr style="background:#3498db; color:#fff;">
                            <th style="padding:12px; text-align:center; width:60px;"><input type="checkbox" id="select-all-cargos" /></th>
                            <th style="padding:12px; text-align:left;">Cargo</th>
                            <th style="padding:12px; text-align:left;">Área</th>
                            <th style="padding:12px; text-align:center;">Estado</th>
                            <th style="padding:12px; text-align:center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cargos.map(cargo => {
                            const count = workerCounts[String(cargo.Id_Cargo)] || 0;
                            const status = cargo.Estado ? cargo.Estado : 'Activo';
                            const statusColor = String(status).toLowerCase() === 'activo' ? '#2ecc71' : '#e74c3c';
                            return `
                            <tr style="border-bottom:1px solid #f0f0f0;">
                                <td style="padding:12px; text-align:center;"><input type="checkbox" class="select-cargo-checkbox" data-id="${cargo.Id_Cargo}" data-status="${status}" /></td>
                                <td style="padding:12px;"><strong>${cargo.Nombre_profesión}</strong></td>
                                <td style="padding:12px; color:#7f8c8d;">${cargo.Area || '-'}</td>
                                <td style="padding:12px; text-align:center;"><span style="display:inline-block; padding:6px 10px; border-radius:999px; background:${statusColor}; color:#fff; font-size:0.9em;">${status}</span></td>
                                <td style="padding:12px; text-align:center; display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
                                    <button class="btn-view-workers-cargo" data-id="${cargo.Id_Cargo}" data-name="${cargo.Nombre_profesión}" style="background:#2ecc71; color:#fff; border:none; padding:8px 12px; border-radius:4px; cursor:pointer; display:flex; align-items:center; gap:8px;">
                                        👥 Ver Trabajadores <span style="background:rgba(255,255,255,0.22); padding:2px 8px; border-radius:999px; font-size:0.85em;">${count}</span>
                                    </button>
                                    <button class="btn-delete-cargo" data-id="${cargo.Id_Cargo}" data-name="${cargo.Nombre_profesión}" style="background:#e74c3c; color:#fff; border:none; padding:8px 12px; border-radius:4px; cursor:pointer;">
                                        🗑️ Eliminar
                                    </button>
                                </td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            `;

            const selectAll = container.querySelector('#select-all-cargos');
            const toggleBtn = document.getElementById('btn-toggle-selected-cargos');
            const clearBtn = document.getElementById('btn-clear-cargo-selection');

            const updateSelectionState = () => {
                const checkboxes = Array.from(container.querySelectorAll('.select-cargo-checkbox'));
                selectedCargoIds.clear();
                checkboxes.forEach(chk => {
                    if (chk.checked) selectedCargoIds.add(String(chk.dataset.id));
                });
                const allChecked = checkboxes.length > 0 && checkboxes.every(chk => chk.checked);
                if (selectAll) selectAll.checked = allChecked;
                updateCargoToolbar(cargos, workerCounts);
            };

            container.querySelectorAll('.select-cargo-checkbox').forEach(chk => {
                chk.addEventListener('change', updateSelectionState);
            });

            if (selectAll) {
                selectAll.addEventListener('change', () => {
                    const checked = selectAll.checked;
                    container.querySelectorAll('.select-cargo-checkbox').forEach(chk => { chk.checked = checked; });
                    updateSelectionState();
                });
            }

            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    selectedCargoIds.clear();
                    container.querySelectorAll('.select-cargo-checkbox').forEach(chk => { chk.checked = false; });
                    updateCargoToolbar(cargos, workerCounts);
                    if (selectAll) selectAll.checked = false;
                });
            }

            if (toggleBtn) {
                toggleBtn.addEventListener('click', async () => {
                    const action = toggleBtn.dataset.action;
                    const selected = cargos.filter(c => selectedCargoIds.has(String(c.Id_Cargo)));
                    if (!selected.length) return;

                    const assignedCargo = selected.find(c => (workerCounts[String(c.Id_Cargo)] || 0) > 0);
                    if (action === 'deactivate' && assignedCargo) {
                        await showAlert('No puedes desactivar este cargo porque está siendo utilizado por algún trabajador.');
                        return;
                    }
                    if (action === 'mixed') {
                        return;
                    }

                    const confirmMessage = action === 'activate'
                        ? `¿Desea activar ${selected.length} cargo(s)?`
                        : `¿Desea desactivar ${selected.length} cargo(s)?`;
                    if (!await showConfirm(confirmMessage)) return;

                    for (const cargo of selected) {
                        const res = await fetch(`/cargos/${cargo.Id_Cargo}/toggle`, {
                            method: 'POST',
                            credentials: 'same-origin'
                        });
                        if (!res.ok) {
                            const data = await res.json().catch(() => ({}));
                            await showAlert(data.error || `Error al actualizar el cargo ${cargo.Nombre_profesión}.`);
                            return;
                        }
                    }

                    selectedCargoIds.clear();
                    await showAlert(`Los cargos seleccionados han sido ${action === 'activate' ? 'activados' : 'desactivados'} correctamente.`);
                    await loadCargos();
                });
            }

            container.querySelectorAll('.btn-view-workers-cargo').forEach(btn => {
                btn.addEventListener('click', () => {
                    showWorkersForCargo(btn.dataset.id, btn.dataset.name);
                });
            });
            container.querySelectorAll('.btn-delete-cargo').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.id;
                    const name = btn.dataset.name;
                    if (!await showConfirm(`¿Está seguro de que desea eliminar el cargo "${name}"?\n\nEsta acción no se puede deshacer.`)) return;

                    try {
                        const res = await fetch('./includes/nomina/delete_cargo.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: parseInt(id) })
                        });
                        const data = await res.json();
                        if (res.ok) {
                            await loadCargos(); // Refresh list
                        } else {
                            await showAlert(data.error || 'Error al eliminar el cargo.');
                        }
                    } catch (e) {
                        await showAlert('Error de conexión al eliminar el cargo.');
                    }
                });
            });
        }

        async function showWorkersForCargo(cargoId, cargoName) {
            const view = document.getElementById('workers-cargo-view');
            const title = document.getElementById('workers-cargo-title');
            const list = document.getElementById('workers-cargo-list');

            view.style.display = 'block';
            title.textContent = `Trabajadores con el cargo: ${cargoName}`;
            list.innerHTML = '<p>Cargando trabajadores...</p>';
            view.scrollIntoView({ behavior: 'smooth' });

            try {
                const workers = await fetchWorkers();
                const filteredWorkers = workers.filter(w => String(w.Id_Cargo) === String(cargoId));

                if (filteredWorkers.length === 0) {
                    list.innerHTML = '<div class="alert-info">No hay trabajadores asignados a este cargo actualmente.</div>';
                    return;
                }

                list.innerHTML = `<table style="width:100%; border-collapse:collapse; margin-top:10px; background:#fff; border-radius:6px; overflow:hidden;">
                <thead>
                    <tr style="background:#ecf0f1; color:#2c3e50;">
                        <th style="padding:10px; text-align:left;">Nombre Completo</th>
                        <th style="padding:10px; text-align:left;">Cédula</th>
                        <th style="padding:10px; text-align:left;">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredWorkers.map(w => `
                        <tr style="border-bottom:1px solid #eee;">
                            <td style="padding:10px;">${w.Nombre_Completo} ${w.Apellidos}</td>
                            <td style="padding:10px;">${w.Documento_Identidad}</td>
                            <td style="padding:10px;"><span style="background:${w.Contrato_Estado === 'Activo' ? '#d4edda' : '#f8d7da'}; color:${w.Contrato_Estado === 'Activo' ? '#155724' : '#721c24'}; padding:2px 8px; border-radius:10px;">${w.Contrato_Estado}</span></td>
                        </tr>
                    `).join('')}
                </tbody></table>`;
            } catch (e) {
                list.innerHTML = '<p style="color:red">Error al cargar los trabajadores.</p>';
            }
        }

        // --- Attach main event listeners ---
        document.getElementById('btn-add-cargo').addEventListener('click', () => {
            document.getElementById('form-cargo-container').style.display = 'block';
            document.getElementById('cargo-nombre').focus();
        });

        document.getElementById('btn-cancel-cargo').addEventListener('click', () => {
            document.getElementById('form-cargo-container').style.display = 'none';
            document.getElementById('cargo-nombre').value = '';
            document.getElementById('cargo-area').value = '';
        });

        document.getElementById('btn-save-cargo').addEventListener('click', async () => {
            const nombre = document.getElementById('cargo-nombre').value.trim();
            const area = document.getElementById('cargo-area').value.trim();
            const msgEl = document.getElementById('cargo-msg');

            if (!nombre) {
                msgEl.textContent = 'El nombre del cargo es obligatorio.';
                msgEl.style.color = '#e74c3c';
                return;
            }

            msgEl.textContent = 'Guardando...';
            msgEl.style.color = '#7f8c8d';

            try {
                const res = await fetch('./includes/nomina/create_cargo.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre: nombre, area: area || null })
                });
                const data = await res.json();
                if (res.ok) {
                    msgEl.textContent = '';
                    document.getElementById('cargo-nombre').value = '';
                    document.getElementById('cargo-area').value = '';
                    document.getElementById('form-cargo-container').style.display = 'none';
                    loadCargos(); // Refresh list
                    await showAlert('Cargo creado exitosamente');
                } else {
                    msgEl.textContent = data.error || 'Error al guardar el cargo.';
                    msgEl.style.color = '#e74c3c';
                }
            } catch (e) {
                msgEl.textContent = 'Error de conexión.';
                msgEl.style.color = '#e74c3c';
            }
        });

        // --- Initial Load ---
        loadCargos();
    }

    // --- Funciones para Recibos de Pago (ahora servidas desde backend) ---
    let serverPayslips = [];
    async function initializePayslipData() {
        try {
            console.log('Fetching payslips from API...');
            const res = await fetch('./includes/reports/payslips.php', { credentials: 'same-origin', cache: 'no-store' });
            console.log('API response status:', res.status, res.ok);
            if (!res.ok) {
                console.log('API response not ok, setting empty array');
                serverPayslips = [];
                return;
            }
            const rows = (await res.json()) || [];
            serverPayslips = rows.map(r => {
                let d = {};
                if (r.Data) {
                    try { d = typeof r.Data === 'string' ? JSON.parse(r.Data) : r.Data; } catch(e) { d = {}; }
                }
                return {
                    id: r.Id_Payslip || d.id || null,
                    fechaPago: d.fechaPago ? d.fechaPago : (r.Fecha_Pago || null),
                    periodo: d.periodo ? d.periodo : '',
                    trabajador: d.trabajador ? d.trabajador : '',
                    trabajadorId: d.trabajadorId ? d.trabajadorId : (r.Id_Trabajador || null),
                    cedula: d.cedula ? d.cedula : null,
                    salarioBase: d.salarioBase ? d.salarioBase : (r.Salario_Base || 0),
                    asignaciones: d.asignaciones ? d.asignaciones : 0,
                    bonificaciones: d.bonificaciones ? d.bonificaciones : 0,
                    deducciones: d.deducciones ? d.deducciones : 0,
                    neto: d.neto ? d.neto : (r.Neto || 0),
                    numeroRecibo: d.numeroRecibo ? d.numeroRecibo : null,
                    fechaInicio: d.fechaInicio ? d.fechaInicio : null,
                    fechaFin: d.fechaFin ? d.fechaFin : null,
                    conceptos: d.conceptos ? d.conceptos : []
                };
            });

            // Deduplicación de seguridad por ID antes de asignar al estado global
            const seenIds = new Set();
            serverPayslips = serverPayslips.filter(p => {
                if (!p.id) return true;
                const isDuplicate = seenIds.has(p.id);
                seenIds.add(p.id);
                return !isDuplicate;
            });

            console.log('Processed payslips:', serverPayslips);
        } catch (e) {
            console.log('Error in initializePayslipData:', e);
            serverPayslips = [];
        }
    }

    function getPayslips() {
        try {
            return serverPayslips || [];
        } catch (e) {
            return [];
        }
    }

    function groupPayslipsByPeriod(payslips) {
        const grouped = {};
        payslips.forEach(payslip => {
            if (!grouped[payslip.periodo]) {
                grouped[payslip.periodo] = [];
            }
            grouped[payslip.periodo].push(payslip);
        });
        return grouped;
    }
    function formatCurrency(amount) {
        // Formato en bolívares venezolanos
        if (amount === null || amount === undefined || isNaN(amount)) {
            return 'Bs. 0,00';
        }
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) {
            return 'Bs. 0,00';
        }
        // Formato: Bs. 1.234,56
        const parts = numAmount.toFixed(2).split('.');
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return 'Bs. ' + integerPart + ',' + parts[1];
    }

    function formatDate(dateString) {
        if (!dateString) return '-';
        const s = (dateString || '').toString().split('T')[0];
        const parts = s.split('-');
        if (parts.length !== 3) return dateString;
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const date = new Date(year, month, day);
        try {
            return date.toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) {
            return date.toLocaleDateString();
        }
    }

    function formatCurrencyVenezuela(amount) {
        // Formato venezolano: 1.234,56 (sin símbolo, para usar en PDF)
        if (amount === null || amount === undefined || isNaN(amount) || amount === '') {
            return '0,00';
        }
        try {
            const numAmount = parseFloat(amount);
            if (isNaN(numAmount)) {
                return '0,00';
            }
            // Formato simple: separar miles con punto y decimales con coma
            const parts = numAmount.toFixed(2).split('.');
            const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return integerPart + ',' + parts[1];
        } catch (e) {
            console.warn('Error formateando moneda:', e, 'Valor:', amount);
            // Fallback simple
            const numAmount = parseFloat(amount) || 0;
            return numAmount.toFixed(2).replace('.', ',');
        }
    }

    function formatDateShort(dateString) {
        if (!dateString) return 'N/A';
        try {
            // Prefer parsing YYYY-MM-DD or YYYY-MM-DD HH:MM:SS/T variants to avoid UTC shifts.
            const s = (dateString || '').toString().split('T')[0].split(' ')[0];
            const parts = s.split('-');
            if (parts.length === 3) {
                const year = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10);
                const day = parseInt(parts[2], 10);
                if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                    return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
                }
            }
            // Fallback: try creating Date and format as local date
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'N/A';
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } catch (e) {
            return 'N/A';
        }
    }

    /**
     * Legacy renderPayslipHistory - Delegated to Worker.js V2
     */
    async function renderPayslipHistory() {
        if (typeof window.renderWorkerModuleV2 === 'function') {
            return window.renderWorkerModuleV2('Historial de Recibos');
        }
        if (contentDetails) contentDetails.innerHTML = '<p class="error">Módulo de recibos no disponible.</p>';
    }

    // --- Implementaciones Trabajador ---
    function renderWorkerModule(name) {
        if (!contentDetails) return;

        // Always try V2 first
        if (typeof window.renderWorkerModuleV2 === 'function') {
            return window.renderWorkerModuleV2(name);
        }

        // Fallback for non-migrated segments if any
        if (name.toLowerCase().includes('vacaciones')) {
            return renderWorkerVacationRequest();
        }

        contentDetails.innerHTML = `<p>El módulo '${name}' está siendo migrado.</p>`;
    }

    async function renderWorkerVacationRequest() {
        if (typeof window.renderWorkerModuleV2 === 'function') {
            return window.renderWorkerModuleV2('Vacaciones');
        }
        if (contentDetails) contentDetails.innerHTML = '<p class="error">Módulo de vacaciones no disponible.</p>';
    }

    // Helper para renderizar pagos en el perfil (reutilizable)
    async function renderProfilePays(workerId, workerCedula) {
        const listEl = document.getElementById('perfil-pagos-list');
        if (!listEl) return;
        try {
            await initializePayslipData();
            const pays = getPayslips();
            const myPays = pays.filter(p => (p.trabajadorId && String(p.trabajadorId) === String(workerId)) || (!p.trabajadorId && String(p.cedula) === String(workerCedula)));
            if (!myPays.length) { listEl.innerHTML = '<p style="color:#7f8c8d">No tiene recibos registrados.</p>'; return; }
            listEl.innerHTML = `<table style="width:100%;border-collapse:collapse"><thead><tr style="background:#ecf0f1"><th style="padding:6px">Fecha</th><th style="padding:6px">Período</th><th style="padding:6px">Neto</th><th style="padding:6px"></th></tr></thead><tbody>${myPays.map(p => `<tr><td style="padding:6px">${formatDate(p.fechaPago)}</td><td style="padding:6px">${p.periodo}</td><td style="padding:6px">${formatCurrency(p.neto)}</td><td style="padding:6px"><button class="perfil-download" data-pid="${p.id}" style="background:#3498db;color:#fff;border:none;padding:6px 8px;border-radius:4px;cursor:pointer">📄 Descargar</button></td></tr>`).join('')}</tbody></table>`;
            listEl.querySelectorAll('.perfil-download').forEach(b => b.addEventListener('click', () => {
                const pid = b.getAttribute('data-pid');
                if (pid) window.open(`/administrativo/payroll/payslip/${pid}`, '_blank');
            }));
        } catch (e) { console.warn('Error renderProfilePays', e); listEl.innerHTML = '<p style="color:#e74c3c">Error al cargar historial.</p>'; }
    }

    // --- Implementaciones SuperUsuario ---
    function renderSuperModule(name) {
        if (!contentDetails) return;

        const n = name.toLowerCase();

        // Delegar módulos del trabajador al renderizador de trabajador
        const workerModules = [
            'mi perfil', 'perfil',
            'historial de pagos', 'historial',
            'solicitud de vacaciones',
            'solicitud de permisos'
        ];
        const isWorkerModule = workerModules.some(kw => n.includes(kw));
        if (isWorkerModule) {
            if (typeof window.renderWorkerModuleV2 === 'function') {
                return window.renderWorkerModuleV2(name);
            }
            contentDetails.innerHTML = `<div class="alert-info">Módulo de trabajador no disponible.</div>`;
            return;
        }

        // Delegar módulos administrativos al superusuario con prefijo propio
        const adminModules = [
            'registro', 'trabajador',
            'pago', 'nómina', 'nomina',
            'permiso',
            'concept',
            'cargo',
            'vacaciones'
        ];
        const isAdminModule = adminModules.some(kw => n.includes(kw));
        if (isAdminModule) {
            window.adminApiPrefix = '/superusuario/admin';
            if (typeof window.renderAdminModuleV2 === 'function') {
                return window.renderAdminModuleV2(name);
            }
            return;
        }
        // Restaurar prefijo cuando se usan módulos propios del superusuario
        window.adminApiPrefix = '/administrativo';

        if (n === 'inicio') { renderSuperUsuarioInicio(); return; }
        if (n.includes('usuarios')) { renderSuperUserView(); return; }
        if (n.includes('reportes')) { renderSuperReports(); return; }
        if (n.includes('bitácora') || n.includes('bitacora') || n.includes('registros del sistema')) {
            renderBitacoraView(); return;
        }
        if (n.includes('configur')) {
            const key = 'payroll_global_config';
            function loadGlobalCfg() { return fetch('./includes/settings.php?key=' + encodeURIComponent(key)).then(r => r.ok ? r.text().then(t => { try { return JSON.parse(t); } catch (e) { return {}; } }) : {}).catch(() => ({})); }
            loadGlobalCfg().then(cfg => {
                contentDetails.innerHTML = `<div><h4>Configuración Global</h4><textarea id="global-cfg" style="width:100%;height:220px">${JSON.stringify(cfg, null, 2)}</textarea><div style="margin-top:8px"><button id="save-global" class="primary">Guardar</button></div></div>`;
                fetch('./includes/settings.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: key, value: v }) })
                    .then(async r => { if (r.ok) await showAlert('Guardado'); else await showAlert('Error al guardar'); })
                    .catch(async () => await showAlert('Error al guardar'));
            });
            return;
        }
        if (n.includes('logs')) {
            const key = 'payroll_logs';
            fetch('./includes/settings.php?key=' + encodeURIComponent(key)).then(r => r.ok ? r.text() : Promise.resolve('[]')).then(text => {
                let logs = [];
                try { logs = JSON.parse(text) || []; } catch (e) { logs = []; }
                contentDetails.innerHTML = `<div><h4>Logs</h4>${logs.length ? logs.map(l => `<div>${l}</div>`).join('') : '<p>No hay logs.</p>'}<div style="margin-top:10px"><button id="download-logs" class="primary">Descargar</button></div></div>`;
                document.getElementById('download-logs').addEventListener('click', () => { const arr = logs; const blob = new Blob([arr.join('\n')], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'logs.txt'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); });
            }).catch(() => { contentDetails.innerHTML = `<div><h4>Logs</h4><p>No hay logs.</p></div>`; });
            return;
        }
        if (n.includes('respaldo')) {
            contentDetails.innerHTML = `<div><h4>Respaldo de Base de Datos (simulado)</h4><button id="export-db" class="primary">Exportar JSON</button></div>`;
            document.getElementById('export-db').addEventListener('click', async () => {
                try {
                    const [usersRes, workersRes, novRes] = await Promise.all([
                        fetch('./includes/workers/list_workers.php'),
                        fetch('./includes/workers/list_workers.php'),
                        fetch('./includes/reports/novedades.php')
                    ]);
                    const users = usersRes.ok ? await usersRes.json() : {};
                    const workers = workersRes.ok ? (await workersRes.json()).workers : [];
                    const novedades = novRes.ok ? await novRes.json() : [];
                    const dump = { users, employees: workers, novedades };
                    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'backup.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
                } catch (e) { await showAlert('Error generando respaldo'); }
            });
            return;
        }

        contentDetails.innerHTML = `<p>Módulo '${name}' no implementado (SuperUsuario).</p>`;
    }

    // --- Inicio / Dashboard (SuperUsuario) ---
    async function renderSuperUsuarioInicio() {
        if (!contentDetails) return;
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';

        contentDetails.innerHTML = `
            <div id="su-dashboard" class="fade-in" style="font-family: 'Inter', sans-serif;">
                <!-- Grid de Tarjetas de Métricas Operativas -->
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:24px; margin-bottom:32px;">
                    <!-- Tarjeta 1: Vacaciones Hoy -->
                    <div id="dash-card-vacations" class="dash-card" style="background:var(--card-bg, #fff); border:1px solid var(--border-color); border-radius:20px; padding:26px; display:flex; align-items:center; gap:20px; box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05); transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); cursor:pointer; position:relative; overflow:hidden;">
                        <div style="position:absolute; top:0; left:0; right:0; height:4px; background:#f59e0b;"></div>
                        <div style="background: rgba(245, 158, 11, 0.1); color: #f59e0b; width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: transform 0.2s ease;">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="8" width="18" height="12" rx="2" ry="2"></rect>
                                <path d="M16 8V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3"></path>
                                <line x1="12" y1="8" x2="12" y2="20"></line>
                            </svg>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:4px; text-align: left;">
                            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase; letter-spacing:.8px;">Trabajadores en Vacaciones Hoy</span>
                            <span id="dash-vacations-val" style="font-size:2.2rem; font-weight:800; color:var(--text-main); line-height: 1.1;">—</span>
                            <span id="dash-vacations-sub" style="font-size:0.78rem; color:var(--text-muted); font-weight:500;">Cargando información...</span>
                        </div>
                    </div>

                    <!-- Tarjeta 2: Permiso Hoy -->
                    <div id="dash-card-permits" class="dash-card" style="background:var(--card-bg, #fff); border:1px solid var(--border-color); border-radius:20px; padding:26px; display:flex; align-items:center; gap:20px; box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05); transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); cursor:pointer; position:relative; overflow:hidden;">
                        <div style="position:absolute; top:0; left:0; right:0; height:4px; background:#ef4444;"></div>
                        <div style="background: rgba(239, 68, 68, 0.1); color: #ef4444; width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: transform 0.2s ease;">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                <circle cx="12" cy="16" r="1"></circle>
                                <line x1="12" y1="12" x2="12" y2="14"></line>
                            </svg>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:4px; text-align: left;">
                            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase; letter-spacing:.8px;">Trabajadores de Permiso Hoy</span>
                            <span id="dash-permits-val" style="font-size:2.2rem; font-weight:800; color:var(--text-main); line-height: 1.1;">—</span>
                            <span id="dash-permits-sub" style="font-size:0.78rem; color:var(--text-muted); font-weight:500;">Cargando información...</span>
                        </div>
                    </div>

                    <!-- Tarjeta 3: Personal Operativo -->
                    <div id="dash-card-operativos" class="dash-card" style="background:var(--card-bg, #fff); border:1px solid var(--border-color); border-radius:20px; padding:26px; display:flex; align-items:center; gap:20px; box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05); transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); cursor:pointer; position:relative; overflow:hidden;">
                        <div style="position:absolute; top:0; left:0; right:0; height:4px; background:#10b981;"></div>
                        <div style="background: rgba(16, 185, 129, 0.1); color: #10b981; width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: transform 0.2s ease;">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:4px; text-align: left;">
                            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase; letter-spacing:.8px;">Personal Operativo</span>
                            <span id="dash-operativos-val" style="font-size:2.2rem; font-weight:800; color:var(--text-main); line-height: 1.1;">—</span>
                            <span id="dash-operativos-sub" style="font-size:0.78rem; color:var(--text-muted); font-weight:500;">Cargando información...</span>
                        </div>
                    </div>
                </div>

                <!-- Documentación Reciente del Sistema -->
                <div style="background:var(--card-bg, #fff); border:1px solid var(--border-color); border-radius:20px; padding:30px; box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05); margin-top: 32px; transition: all 0.3s ease;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 24px; flex-wrap: wrap; gap:12px;">
                        <div style="text-align: left;">
                            <h5 style="margin:0 0 4px 0; color:var(--text-main); font-weight:700; font-size:1.15rem; display:flex; align-items:center; gap:10px;">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                Documentación Reciente del Sistema
                            </h5>
                            <span style="font-size:0.8rem; color:var(--text-muted); font-weight:500;">Recibos de nómina generados, constancias y actas de auditoría recientes</span>
                        </div>
                        <button id="dash-view-all-docs" class="secondary" style="padding:8px 16px; font-size:0.85rem; border-radius:10px; border:1px solid var(--border-color); background:transparent; color:var(--text-main); cursor:pointer; font-weight:600; display:flex; align-items:center; gap:6px; transition: all 0.2s;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                            Ver Bitácora Completa
                        </button>
                    </div>
                    <div id="dash-docs-list" style="display:flex; flex-direction:column; gap:14px;">
                        <div style="padding:40px; text-align:center; color:var(--text-muted);">
                            <div class="loader" style="margin: 0 auto 12px; border: 3px solid rgba(167, 139, 250, 0.1); border-top-color: #a78bfa; width: 28px; height: 28px; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
                            Cargando archivos del sistema...
                        </div>
                    </div>
                </div>
            </div>

            <!-- Estilo premium para Dashboard -->
            <style>
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .dash-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.08) !important;
                }
                .dash-card:hover svg {
                    transform: scale(1.1);
                }
                .doc-row {
                    display:flex; 
                    align-items:center; 
                    justify-content:space-between; 
                    padding:16px 20px; 
                    background:var(--bg-color, #f9fafb); 
                    border-radius:14px; 
                    border: 1px solid var(--border-color); 
                    font-size:0.9rem; 
                    transition:all 0.2s ease;
                    gap: 16px;
                }
                .doc-row:hover {
                    transform: translateX(4px);
                    border-color: #a78bfa;
                    background: var(--card-bg, #ffffff);
                    box-shadow: 0 4px 12px rgba(167, 139, 250, 0.05);
                }
                .badge-doc {
                    font-size: 0.72rem; 
                    padding: 4px 10px; 
                    border-radius: 12px; 
                    font-weight: 700; 
                    text-transform: uppercase; 
                    letter-spacing: 0.3px;
                }
                .btn-doc-preview {
                    padding: 6px 14px; 
                    font-size: 0.8rem; 
                    border-radius: 8px; 
                    border: 1px solid var(--border-color); 
                    background: var(--card-bg, #fff); 
                    color: var(--text-main); 
                    cursor: pointer; 
                    font-weight: 600; 
                    transition: all 0.2s;
                }
                .btn-doc-preview:hover {
                    background: #a78bfa;
                    color: white;
                    border-color: #a78bfa;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                @keyframes scaleUp {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes scaleDown {
                    from { transform: scale(1); opacity: 1; }
                    to { transform: scale(0.9); opacity: 0; }
                }
            </style>
        `;

        // Función interna para mostrar el modal de previsualización
        function showDocumentDetailsModal(doc) {
            document.getElementById('doc-details-modal')?.remove();

            const modal = document.createElement('div');
            modal.id = 'doc-details-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.25s ease-out;
            `;

            modal.innerHTML = `
                <div style="background: var(--card-bg, #fff); border: 1px solid var(--border-color); border-radius: 20px; width: 90%; max-width: 550px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); overflow: hidden; animation: scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);">
                    <!-- Modal Header -->
                    <div style="background: #a78bfa; padding: 20px; color: white; display: flex; align-items: center; justify-content: space-between;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            ${doc.icon.replace('width="24" height="24"', 'width="28" height="28"').replace('stroke="#ef4444"', 'stroke="white"').replace('stroke="#6366f1"', 'stroke="white"').replace('stroke="#10b981"', 'stroke="white"').replace('stroke="#f59e0b"', 'stroke="white"').replace('stroke="#3b82f6"', 'stroke="white"')}
                            <h5 style="margin: 0; font-size: 1.15rem; font-weight: 700; color: white;">Previsualización de Documento</h5>
                        </div>
                        <button id="modal-close-btn" style="background: transparent; border: none; color: white; font-size: 1.5rem; cursor: pointer; line-height: 1;">&times;</button>
                    </div>
                    <!-- Modal Body -->
                    <div style="padding: 24px; display: flex; flex-direction: column; gap: 16px; text-align: left;">
                        <div>
                            <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;">Nombre de Archivo</span>
                            <h4 style="margin: 4px 0 0 0; color: var(--text-main); font-weight: 700; font-size: 1.1rem; word-break: break-all;">${doc.name}</h4>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background: var(--bg-color, #f9fafb); padding: 14px; border-radius: 12px; border: 1px solid var(--border-color);">
                            <div>
                                <span style="font-size: 0.7rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Tipo</span>
                                <div style="font-weight: 600; color: var(--text-main); margin-top:2px;">${doc.type} (${doc.size})</div>
                            </div>
                            <div>
                                <span style="font-size: 0.7rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Emitido Por</span>
                                <div style="font-weight: 600; color: var(--text-main); margin-top:2px;">@${doc.user}</div>
                            </div>
                            <div>
                                <span style="font-size: 0.7rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Fecha de Creación</span>
                                <div style="font-weight: 600; color: var(--text-main); margin-top:2px;">${doc.date}</div>
                            </div>
                            <div>
                                <span style="font-size: 0.7rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Estado</span>
                                <div style="font-weight: 600; color: #10b981; margin-top:2px; display:flex; align-items:center; gap:4px;">
                                    <span style="width: 6px; height: 6px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
                                    Registrado en Auditoría
                                </div>
                            </div>
                        </div>
                        <div>
                            <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;">Detalles de la Acción</span>
                            <p style="margin: 4px 0 0 0; color: var(--text-main); font-size: 0.9rem; line-height: 1.5; background: var(--bg-color, #f9fafb); padding: 12px; border-radius: 10px; border: 1px solid var(--border-color); max-height: 120px; overflow-y: auto;">${doc.details}</p>
                        </div>
                    </div>
                    <!-- Modal Footer -->
                    <div style="background: var(--bg-color, #f9fafb); padding: 16px 24px; border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end; gap: 12px;">
                        <button id="modal-cancel-btn" style="padding: 8px 16px; border-radius: 8px; border: 1px solid var(--border-color); background: transparent; color: var(--text-main); font-weight: 600; cursor: pointer;">Cerrar</button>
                        <button id="modal-download-btn" style="padding: 8px 16px; border-radius: 8px; border: none; background: #a78bfa; color: white; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            Descargar Copia
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            const close = () => {
                modal.style.animation = 'fadeOut 0.2s ease-in';
                modal.querySelector('div').style.animation = 'scaleDown 0.2s ease-in';
                setTimeout(() => modal.remove(), 180);
            };

            document.getElementById('modal-close-btn').onclick = close;
            document.getElementById('modal-cancel-btn').onclick = close;
            document.getElementById('modal-download-btn').onclick = () => {
                const btn = document.getElementById('modal-download-btn');
                const oldHtml = btn.innerHTML;
                btn.disabled = true;
                btn.style.opacity = 0.7;
                btn.innerHTML = 'Descargando...';
                
                setTimeout(() => {
                    btn.innerHTML = '¡Completado!';
                    btn.style.background = '#10b981';
                    
                    const blob = new Blob([`Documento: ${doc.name}\nGenerado por: ${doc.user}\nFecha: ${doc.date}\nAcción: ${doc.action}\nDetalles: ${doc.details}`], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = doc.name.replace('.pdf', '_copia.txt').replace('.csv', '_copia.txt').replace('.log', '_copia.txt');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                    setTimeout(() => {
                        btn.disabled = false;
                        btn.style.opacity = 1;
                        btn.style.background = '#a78bfa';
                        btn.innerHTML = oldHtml;
                    }, 1000);
                }, 800);
            };

            modal.onclick = (e) => {
                if (e.target === modal) close();
            };
        }

        try {
            // ─── UNA sola llamada al endpoint centralizado ──────────────────────
            const res = await fetch('/superusuario/dashboard-metrics', {
                headers: { 'X-CSRF-TOKEN': csrfToken, 'Accept': 'application/json' }
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            const personal  = data.personal  || {};
            const sistema   = data.sistema   || {};
            const nomina    = data.nomina    || {};
            const auditoria = data.auditoria || {};

            // ─── TARJETA 1: Vacaciones Hoy ───────────────────────────────────────
            const vacHoyCount = personal.vacaciones_hoy ?? 0;
            document.getElementById('dash-vacations-val').textContent = vacHoyCount;
            document.getElementById('dash-vacations-sub').textContent = vacHoyCount === 1
                ? '1 trabajador ausente por vacaciones'
                : `${vacHoyCount} trabajadores ausentes por vacaciones`;

            // ─── TARJETA 2: Permisos Hoy ─────────────────────────────────────────
            const permHoyCount = personal.permisos_hoy ?? 0;
            document.getElementById('dash-permits-val').textContent = permHoyCount;
            document.getElementById('dash-permits-sub').textContent = permHoyCount === 1
                ? '1 ausencia justificada activa'
                : `${permHoyCount} ausencias justificadas activas`;

            // ─── TARJETA 3: Personal Operativo ───────────────────────────────────
            const operativoCount = personal.personal_operativo ?? 0;
            const totalWorkers   = personal.total_trabajadores ?? 0;
            document.getElementById('dash-operativos-val').textContent = operativoCount;
            document.getElementById('dash-operativos-sub').textContent =
                `Activos de un total de ${totalWorkers} registrados`;

            // ─── INDICADOR EXTRA: alerta de permisos sin soporte ─────────────────
            const sinSoporte = auditoria.permisos_sin_soporte ?? 0;
            if (sinSoporte > 0) {
                const cardPermits = document.getElementById('dash-card-permits');
                if (cardPermits) {
                    const badge = document.createElement('div');
                    badge.title = `${sinSoporte} permiso(s) activo(s) sin soporte digital adjunto`;
                    badge.style.cssText = `
                        position:absolute; top:14px; right:14px;
                        background:#ef4444; color:#fff;
                        border-radius:50%; width:20px; height:20px;
                        display:flex; align-items:center; justify-content:center;
                        font-size:0.7rem; font-weight:800; z-index:2;
                        box-shadow: 0 2px 6px rgba(239,68,68,0.4);
                    `;
                    badge.textContent = sinSoporte;
                    cardPermits.appendChild(badge);
                }
            }

            // ─── CLICKS en tarjetas ──────────────────────────────────────────────
            document.getElementById('dash-card-vacations')?.addEventListener('click', () => {
                document.querySelector('.nav-link[data-module-name="Vacaciones del Personal"]')?.click();
            });
            document.getElementById('dash-card-permits')?.addEventListener('click', () => {
                document.querySelector('.nav-link[data-module-name="Permisos de Trabajadores"]')?.click();
            });
            document.getElementById('dash-card-operativos')?.addEventListener('click', () => {
                document.querySelector('.nav-link[data-module-name="Registro de Trabajadores"]')?.click();
            });

            // ─── SECCIÓN: Auditoría / Documentación Reciente ────────────────────
            const logs = auditoria.ultimos_logs || [];

            function formatLogDate(dateStr) {
                if (!dateStr) return '—';
                const dateObj = new Date(dateStr);
                const dToday = new Date();
                const dYesterday = new Date();
                dYesterday.setDate(dYesterday.getDate() - 1);
                const timeStr = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                if (dateObj.toDateString() === dToday.toDateString()) return `Hoy, ${timeStr}`;
                if (dateObj.toDateString() === dYesterday.toDateString()) return `Ayer, ${timeStr}`;
                return `${dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${timeStr}`;
            }

            const documentItems = logs.map((l, index) => {
                const action  = l.accion   || '';
                const details = l.detalles || '';
                const dateFormatted = formatLogDate(l.hora);

                let docName = '', docType = '', docSize = '', docIcon = '';

                if (action.includes('Nómina') || action.includes('Pago')) {
                    docType = 'PDF'; docSize = '148 KB';
                    const mb = details.match(/lote '([^']+)'/) || details.match(/para '([^']+)'/);
                    docName = mb
                        ? `Recibo_Nomina_${mb[1].replace(/\s+/g, '_')}.pdf`
                        : `Recibo_Pago_${l.id || index}.pdf`;
                    docIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;
                } else if (action.includes('Vacaci')) {
                    docType = 'PDF'; docSize = '112 KB';
                    const mw = details.match(/para '([^']+)'/) || details.match(/de '([^']+)'/);
                    docName = mw
                        ? `Constancia_Vacaciones_${mw[1].replace(/\s+/g, '_')}.pdf`
                        : `Constancia_Vacacional_${l.id || index}.pdf`;
                    docIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><circle cx="12" cy="14" r="3"></circle></svg>`;
                } else if (action.includes('Permis')) {
                    docType = 'PDF'; docSize = '95 KB';
                    const mw = details.match(/para '([^']+)'/) || details.match(/de '([^']+)'/);
                    docName = mw
                        ? `Comprobante_Permiso_${mw[1].replace(/\s+/g, '_')}.pdf`
                        : `Comprobante_Permiso_${l.id || index}.pdf`;
                    docIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M9 15l2 2 4-4"></path></svg>`;
                } else if (action.includes('Reporte') || action.includes('Exportar')) {
                    docType = 'CSV'; docSize = '210 KB';
                    docName = `Reporte_Auditoria_${l.id || index}.csv`;
                    docIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line><line x1="8" y1="9" x2="10" y2="9"></line></svg>`;
                } else {
                    docType = 'ACTA'; docSize = '45 KB';
                    docName = `Acta_${action.replace(/\s+/g, '_')}_${l.id || index}.log`;
                    docIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;
                }

                return { name: docName, type: docType, size: docSize, user: l.usuario || 'Sistema',
                         date: dateFormatted, action, details, icon: docIcon };
            });

            const docsListContainer = document.getElementById('dash-docs-list');
            if (docsListContainer) {
                if (documentItems.length === 0) {
                    docsListContainer.innerHTML = '<div style="padding:24px; text-align:center; color:var(--text-muted);">No hay documentación reciente generada.</div>';
                } else {
                    docsListContainer.innerHTML = documentItems.map((doc, idx) => {
                        const [bc, bb] = doc.type === 'PDF'
                            ? ['#ef4444', 'rgba(239,68,68,0.1)']
                            : doc.type === 'CSV'
                                ? ['#3b82f6', 'rgba(59,130,246,0.1)']
                                : ['#6366f1', 'rgba(99,102,241,0.1)'];
                        return `
                            <div class="doc-row">
                                <div style="display:flex; align-items:center; gap:16px; flex:1; text-align:left; overflow:hidden;">
                                    <div style="background:${bb}; width:44px; height:44px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                                        ${doc.icon}
                                    </div>
                                    <div style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                                        <div style="font-weight:700; color:var(--text-main); font-size:0.92rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${doc.name}">${doc.name}</div>
                                        <div style="font-size:0.78rem; color:var(--text-muted); margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                                            Generado por: <span style="font-weight:600; color:var(--text-main);">@${doc.user}</span> • ${doc.action}
                                        </div>
                                    </div>
                                </div>
                                <div style="display:flex; align-items:center; gap:16px; flex-shrink:0;">
                                    <span class="badge-doc" style="background:${bb}; color:${bc};">${doc.type}</span>
                                    <span style="font-size:0.78rem; color:var(--text-muted); font-family:monospace; white-space:nowrap;">${doc.date}</span>
                                    <button class="btn-doc-preview" data-idx="${idx}">Previsualizar</button>
                                </div>
                            </div>
                        `;
                    }).join('');

                    docsListContainer.querySelectorAll('.btn-doc-preview').forEach(btn => {
                        btn.addEventListener('click', e => {
                            const selectedDoc = documentItems[e.target.getAttribute('data-idx')];
                            if (selectedDoc) showDocumentDetailsModal(selectedDoc);
                        });
                    });
                }
            }

            // Enlazar botón "Ver Bitácora Completa"
            document.getElementById('dash-view-all-docs')?.addEventListener('click', () => {
                document.querySelector('.nav-link[data-module-name="Bitácora del Sistema"]')?.click();
            });

        } catch (e) {
            console.error('Error cargando el Dashboard de Superusuario', e);
            if (contentDetails) {
                contentDetails.innerHTML = `<div style="padding:40px; text-align:center; color:#ef4444; font-weight:600;">
                    Hubo un problema al inicializar el Dashboard del Superusuario.
                </div>`;
            }
        }
    }



    // --- Bitácora del Sistema (SuperUsuario) ---
    async function renderBitacoraView() {
        if (!contentDetails) return;
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';

        contentDetails.innerHTML = `
            <div id="bitacora-app" class="fade-in" style="font-family: 'Inter', sans-serif;">
                <!-- Header con estadísticas modernizado -->
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:20px; margin-bottom:28px;">
                    <!-- Total Card -->
                    <div id="bita-stat-total" style="background:var(--card-bg, #fff); border:1px solid var(--border-color); border-radius:16px; padding:20px; display:flex; align-items:center; gap:20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s;">
                        <div style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:4px; text-align: left;">
                            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase; letter-spacing:.8px;">Total Registros</span>
                            <span id="stat-total-val" style="font-size:1.8rem; font-weight:800; color:var(--text-main); line-height: 1.1;">—</span>
                        </div>
                    </div>
                    <!-- Hoy Card -->
                    <div id="bita-stat-today" style="background:var(--card-bg, #fff); border:1px solid var(--border-color); border-radius:16px; padding:20px; display:flex; align-items:center; gap:20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s;">
                        <div style="background: rgba(16, 185, 129, 0.1); color: #10b981; width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:4px; text-align: left;">
                            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase; letter-spacing:.8px;">Hoy</span>
                            <span id="stat-today-val" style="font-size:1.8rem; font-weight:800; color:#10b981; line-height: 1.1;">—</span>
                        </div>
                    </div>
                    <!-- Usuarios Activos Card -->
                    <div id="bita-stat-users" style="background:var(--card-bg, #fff); border:1px solid var(--border-color); border-radius:16px; padding:20px; display:flex; align-items:center; gap:20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s;">
                        <div style="background: rgba(139, 92, 246, 0.1); color: #8b5cf6; width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:4px; text-align: left;">
                            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase; letter-spacing:.8px;">Usuarios Activos</span>
                            <span id="stat-users-val" style="font-size:1.8rem; font-weight:800; color:#8b5cf6; line-height: 1.1;">—</span>
                        </div>
                    </div>
                </div>

                <!-- Barra de filtros modernizada y extendida -->
                <div style="display:flex; gap:16px; flex-wrap:wrap; align-items:center; margin-bottom:24px; background:var(--card-bg,#fff); border:1px solid var(--border-color); border-radius:16px; padding:20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    <div style="display:flex; align-items:center; gap:12px; flex:1; min-width:260px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px 16px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input id="bita-search" type="text" placeholder="Buscar por usuario, acción, detalles, IP..." style="border:none; outline:none; background:transparent; font-size:0.95rem; color:var(--text-main); width:100%; font-family: inherit;">
                    </div>
                    <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
                        <!-- Selector de Fechas -->
                        <div style="display:flex; align-items:center; gap:8px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 10px; padding: 8px 12px;">
                            <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Desde</span>
                            <input id="bita-date-start" type="date" style="border:none; outline:none; background:transparent; font-size:0.88rem; color:var(--text-main); font-family: inherit; cursor:pointer;">
                        </div>
                        <div style="display:flex; align-items:center; gap:8px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 10px; padding: 8px 12px;">
                            <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Hasta</span>
                            <input id="bita-date-end" type="date" style="border:none; outline:none; background:transparent; font-size:0.88rem; color:var(--text-main); font-family: inherit; cursor:pointer;">
                        </div>

                        <select id="bita-action-filter" style="border:1px solid var(--border-color); border-radius:10px; padding:10px 16px; background:var(--card-bg,#fff); color:var(--text-main); font-size:0.92rem; min-width:180px; font-family: inherit; cursor: pointer; outline: none;">
                            <option value="">Todas las acciones</option>
                            <option value="Inicio de Sesión">Inicio de Sesión</option>
                            <option value="Pago de Nómina">Pago de Nómina</option>
                            <option value="Pago de Vacaciones">Pago de Vacaciones</option>
                            <option value="Gestión de Vacaciones">Gestión de Vacaciones</option>
                            <option value="Solicitud de Vacaciones">Solicitud de Vacaciones</option>
                            <option value="Solicitud de Permiso">Solicitud de Permiso</option>
                            <option value="Gestión de Permisos">Gestión de Permisos</option>
                            <option value="Preguntas de Seguridad">Preguntas de Seguridad</option>
                            <option value="Recuperación de Contraseña">Recuperación de Contraseña</option>
                            <option value="Restablecer Clave (Admin)">Restablecer Clave (Admin)</option>
                            <option value="Limpiar Preguntas (Admin)">Limpiar Preguntas (Admin)</option>
                        </select>
                        <button id="bita-refresh-btn" title="Actualizar" class="primary" style="padding:10px 20px; font-size:0.92rem; font-weight:600; border-radius:10px;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                            Actualizar
                        </button>
                        <button id="bita-export-btn" title="Exportar CSV" class="secondary" style="padding:10px 20px; font-size:0.92rem; font-weight:600; border-radius:10px; border:1px solid var(--border-color); background:var(--card-bg);">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            Exportar CSV
                        </button>
                    </div>
                </div>

                <!-- Tabla -->
                <div style="background:var(--card-bg,#fff); border:1px solid var(--border-color); border-radius:16px; overflow:hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    <div id="bita-table-container" style="overflow-x:auto;">
                        <div style="padding:60px; text-align:center; color:var(--text-muted);">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="display:block; margin:0 auto 16px; opacity:.5;"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                            Cargando registros de la bitácora...
                        </div>
                    </div>
                </div>

                <!-- Paginación -->
                <div id="bita-pagination" style="display:flex; justify-content:center; gap:8px; margin-top:20px; align-items:center; flex-wrap:wrap;"></div>

                <!-- Pie -->
                <div id="bita-footer" style="margin-top:16px; font-size:0.85rem; color:var(--text-muted); text-align:right; display:none; font-weight: 500;">
                    Mostrando <span id="bita-count" style="color:var(--text-main); font-weight:700;">0</span> registros (máx. 500)
                </div>
            </div>
        `;

        let allLogs = [];
        let currentPage = 1;
        const pageSize = 15;

        function getActionBadge(action) {
            const isDark = document.body.classList.contains('dark-mode');
            const colorsLight = {
                'Inicio de Sesión': { bg: 'rgba(59, 130, 246, 0.1)', color: '#1d4ed8', border: 'rgba(59, 130, 246, 0.2)' },
                'Pago de Nómina': { bg: 'rgba(16, 185, 129, 0.1)', color: '#065f46', border: 'rgba(16, 185, 129, 0.2)' },
                'Pago de Vacaciones': { bg: 'rgba(16, 185, 129, 0.1)', color: '#059669', border: 'rgba(16, 185, 129, 0.2)' },
                'Gestión de Vacaciones': { bg: 'rgba(245, 158, 11, 0.1)', color: '#b45309', border: 'rgba(245, 158, 11, 0.2)' },
                'Solicitud de Vacaciones': { bg: 'rgba(234, 179, 8, 0.1)', color: '#a16207', border: 'rgba(234, 179, 8, 0.2)' },
                'Solicitud de Permiso': { bg: 'rgba(139, 92, 246, 0.1)', color: '#6d28d9', border: 'rgba(139, 92, 246, 0.2)' },
                'Gestión de Permisos': { bg: 'rgba(168, 85, 247, 0.1)', color: '#7e22ce', border: 'rgba(168, 85, 247, 0.2)' },
                'Preguntas de Seguridad': { bg: 'rgba(239, 68, 68, 0.1)', color: '#b91c1c', border: 'rgba(239, 68, 68, 0.2)' },
                'Recuperación de Contraseña': { bg: 'rgba(249, 115, 22, 0.1)', color: '#c2410c', border: 'rgba(249, 115, 22, 0.2)' },
                'Restablecer Clave (Admin)': { bg: 'rgba(236, 72, 153, 0.1)', color: '#be185d', border: 'rgba(236, 72, 153, 0.2)' },
                'Limpiar Preguntas (Admin)': { bg: 'rgba(244, 63, 94, 0.1)', color: '#e11d48', border: 'rgba(244, 63, 94, 0.2)' },
                'Gestión de Usuarios': { bg: 'rgba(99, 102, 241, 0.1)', color: '#4338ca', border: 'rgba(99, 102, 241, 0.2)' },
                'Gestión de Trabajadores': { bg: 'rgba(20, 184, 166, 0.1)', color: '#0f766e', border: 'rgba(20, 184, 166, 0.2)' },
                'Gestión de Cargos': { bg: 'rgba(6, 182, 212, 0.1)', color: '#0e7490', border: 'rgba(6, 182, 212, 0.2)' },
                'Gestión de Conceptos': { bg: 'rgba(217, 119, 6, 0.1)', color: '#b45309', border: 'rgba(217, 119, 6, 0.2)' },
                'Cierre de Sesión': { bg: 'rgba(100, 116, 139, 0.1)', color: '#475569', border: 'rgba(100, 116, 139, 0.2)' }
            };
            const colorsDark = {
                'Inicio de Sesión': { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' },
                'Pago de Nómina': { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
                'Pago de Vacaciones': { bg: 'rgba(5, 150, 105, 0.15)', color: '#6ee7b7', border: 'rgba(5, 150, 105, 0.3)' },
                'Gestión de Vacaciones': { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
                'Solicitud de Vacaciones': { bg: 'rgba(234, 179, 8, 0.15)', color: '#fef08a', border: 'rgba(234, 179, 8, 0.3)' },
                'Solicitud de Permiso': { bg: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', border: 'rgba(139, 92, 246, 0.3)' },
                'Gestión de Permisos': { bg: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' },
                'Preguntas de Seguridad': { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'rgba(239, 68, 68, 0.3)' },
                'Recuperación de Contraseña': { bg: 'rgba(249, 115, 22, 0.15)', color: '#fb923c', border: 'rgba(249, 115, 22, 0.3)' },
                'Restablecer Clave (Admin)': { bg: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', border: 'rgba(236, 72, 153, 0.3)' },
                'Limpiar Preguntas (Admin)': { bg: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', border: 'rgba(244, 63, 94, 0.3)' },
                'Gestión de Usuarios': { bg: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: 'rgba(99, 102, 241, 0.3)' },
                'Gestión de Trabajadores': { bg: 'rgba(20, 184, 166, 0.15)', color: '#2dd4bf', border: 'rgba(20, 184, 166, 0.3)' },
                'Gestión de Cargos': { bg: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', border: 'rgba(6, 182, 212, 0.3)' },
                'Gestión de Conceptos': { bg: 'rgba(217, 119, 6, 0.15)', color: '#fbbf24', border: 'rgba(217, 119, 6, 0.3)' },
                'Cierre de Sesión': { bg: 'rgba(100, 116, 139, 0.15)', color: '#94a3b8', border: 'rgba(100, 116, 139, 0.3)' }
            };
            const palette = isDark ? colorsDark : colorsLight;
            const c = palette[action] || (isDark ? { bg: 'rgba(255,255,255,0.05)', color: '#9ca3af', border: 'rgba(255,255,255,0.1)' } : { bg: 'rgba(0,0,0,0.05)', color: '#4b5563', border: 'rgba(0,0,0,0.1)' });
            return `<span style="display:inline-block; background:${c.bg}; color:${c.color}; border: 1px solid ${c.border}; padding:4px 12px; border-radius:30px; font-size:0.78rem; font-weight:600; white-space:nowrap; letter-spacing:0.3px;">${action}</span>`;
        }

        function formatLogDate(dateStr) {
            if (!dateStr) return '—';
            try {
                const d = new Date(dateStr);
                return d.toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: 'numeric' })
                    + ' ' + d.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            } catch (e) { return dateStr; }
        }

        function renderTable(logs) {
            const container = document.getElementById('bita-table-container');
            if (!container) return;
            const countEl = document.getElementById('bita-count');
            const footer = document.getElementById('bita-footer');

            // 1. Filtrar dinámicamente por Rango de Fechas
            const dateStartVal = document.getElementById('bita-date-start')?.value;
            const dateEndVal = document.getElementById('bita-date-end')?.value;
            let filteredLogs = [...logs];

            if (dateStartVal) {
                const start = new Date(dateStartVal + 'T00:00:00');
                filteredLogs = filteredLogs.filter(l => l.created_at && new Date(l.created_at) >= start);
            }
            if (dateEndVal) {
                const end = new Date(dateEndVal + 'T23:59:59');
                filteredLogs = filteredLogs.filter(l => l.created_at && new Date(l.created_at) <= end);
            }

            if (countEl) countEl.textContent = filteredLogs.length;
            if (footer) footer.style.display = 'block';

            if (!filteredLogs.length) {
                container.innerHTML = `<div style="padding:60px; text-align:center; color:var(--text-muted);">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="display:block; margin:0 auto 16px; opacity:.4;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    <p style="font-weight:600; font-size:1.05rem; margin:0 0 6px; color:var(--text-main);">Sin registros encontrados</p>
                    <p style="font-size:0.88rem; margin:0;">Prueba ajustando los filtros de búsqueda o fechas.</p>
                </div>`;
                document.getElementById('bita-pagination').innerHTML = '';
                return;
            }

            // 2. Calcular Paginación
            const totalItems = filteredLogs.length;
            const totalPages = Math.ceil(totalItems / pageSize) || 1;
            if (currentPage > totalPages) currentPage = totalPages;
            if (currentPage < 1) currentPage = 1;

            const startIndex = (currentPage - 1) * pageSize;
            const paginatedLogs = filteredLogs.slice(startIndex, startIndex + pageSize);

            container.innerHTML = `
                <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
                    <thead>
                        <tr style="background:var(--bg-color); border-bottom:1.5px solid var(--border-color);">
                            <th style="padding:14px 18px; font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); letter-spacing:.8px; white-space:nowrap;">ID</th>
                            <th style="padding:14px 18px; font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); letter-spacing:.8px; white-space:nowrap;">Fecha y Hora</th>
                            <th style="padding:14px 18px; font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); letter-spacing:.8px; white-space:nowrap;">Usuario</th>
                            <th style="padding:14px 18px; font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); letter-spacing:.8px; white-space:nowrap;">Acción</th>
                            <th style="padding:14px 18px; font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); letter-spacing:.8px;">Detalles</th>
                            <th style="padding:14px 18px; font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); letter-spacing:.8px; white-space:nowrap;">IP</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${paginatedLogs.map((log, idx) => {
                            const rowId = log.Id_Log || `temp-${idx}`;
                            return `
                                <tr class="bita-row" data-id="${rowId}" style="border-bottom:1px solid var(--border-color); transition:background .15s; cursor:pointer;" onmouseover="this.style.background='rgba(0,0,0,0.02)'" onmouseout="this.style.background=''">
                                    <td style="padding:14px 18px; color:var(--text-muted); font-family:monospace; font-size:0.8rem; font-weight:600;">${log.Id_Log || idx + 1}</td>
                                    <td style="padding:14px 18px; color:var(--text-muted); white-space:nowrap; font-family:monospace; font-size:0.82rem;">${formatLogDate(log.created_at)}</td>
                                    <td style="padding:14px 18px; font-weight:600; color:var(--text-main); white-space:nowrap;">${log.username || '—'}</td>
                                    <td style="padding:14px 18px;">${getActionBadge(log.action || '—')}</td>
                                    <td style="padding:14px 18px; max-width:250px;">
                                        <div style="display:flex; align-items:center; gap:12px; justify-content:space-between;">
                                            <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:var(--text-main); font-weight: 500; flex:1;" title="${log.details || ''}">
                                                ${log.details || '—'}
                                            </span>
                                            <button style="display:inline-flex; align-items:center; gap:6px; padding:6px 10px; border-radius:6px; background:var(--bg-color); border:1px solid var(--border-color); color:var(--text-main); font-size:0.75rem; font-weight:700; cursor:pointer; flex-shrink:0; transition:all 0.2s; pointer-events:none;" onmouseover="this.style.borderColor='var(--primary)'; this.style.color='var(--primary)'" onmouseout="this.style.borderColor='var(--border-color)'; this.style.color='var(--text-main)'">
                                                Ver Más <svg class="chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="transition:transform 0.2s;"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                            </button>
                                        </div>
                                    </td>
                                    <td style="padding:14px 18px; color:var(--text-muted); font-family:monospace; font-size:0.82rem; white-space:nowrap;">${log.ip_address || '—'}</td>
                                </tr>
                                <tr id="bita-details-${rowId}" style="display:none; background:rgba(0,0,0,0.01); border-bottom:1px solid var(--border-color);">
                                    <td colspan="6" style="padding:20px 24px; text-align:left !important;">
                                        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:20px; font-size:0.88rem; line-height:1.6;">
                                            <div style="text-align: left;">
                                                <div style="font-weight:700; color:var(--text-main); margin-bottom:8px; font-size:0.95rem; border-bottom:1px dashed var(--border-color); padding-bottom:4px;">Dispositivo y Auditoría</div>
                                                <div style="color:var(--text-muted);"><strong style="color:var(--text-main);">Dirección IP:</strong> ${log.ip_address || '—'}</div>
                                                <div style="color:var(--text-muted);"><strong style="color:var(--text-main);">Fecha Servidor:</strong> ${formatLogDate(log.created_at)}</div>
                                                <div style="color:var(--text-muted);"><strong style="color:var(--text-main);">Operador:</strong> ${log.username || '—'}</div>
                                            </div>
                                            <div style="text-align: left;">
                                                <div style="font-weight:700; color:var(--text-main); margin-bottom:12px; font-size:0.95rem; border-bottom:1px dashed var(--border-color); padding-bottom:4px;">Resumen del Evento</div>
                                                
                                                <div style="background:var(--bg-color); border:1px solid var(--border-color); border-radius:12px; padding:16px; display:flex; flex-direction:column; gap:12px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                                                    
                                                    <div style="display:flex; align-items:center; gap:12px;">
                                                        <div style="width:38px; height:38px; border-radius:10px; background:rgba(59, 130, 246, 0.1); color:#3b82f6; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                                        </div>
                                                        <div style="flex:1;">
                                                            <div style="font-weight:800; color:var(--text-main); font-size:0.95rem; letter-spacing:0.2px;">${log.action || 'Acción del Sistema'}</div>
                                                            <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; font-weight:600; letter-spacing:0.5px;">Mensaje de Auditoría</div>
                                                        </div>
                                                    </div>

                                                    <div style="background:var(--card-bg); border-radius:8px; padding:14px; border:1px solid var(--border-color); font-size:0.88rem; color:var(--text-main); line-height:1.6; font-weight:500;">
                                                        ${log.details || 'No hay detalles adicionales.'}
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            `;

            // Vincular Clic en Fila (Accordion)
            container.querySelectorAll('.bita-row').forEach(row => {
                row.addEventListener('click', () => {
                    const rowId = row.getAttribute('data-id');
                    const detailsRow = document.getElementById(`bita-details-${rowId}`);
                    const chevron = row.querySelector('.chevron-icon');
                    const btnText = row.querySelector('button');
                    
                    if (detailsRow) {
                        const isOpen = detailsRow.style.display !== 'none';
                        detailsRow.style.display = isOpen ? 'none' : 'table-row';
                        
                        if (chevron) {
                            chevron.style.transform = isOpen ? 'none' : 'rotate(180deg)';
                        }
                        
                        if (btnText) {
                            if (isOpen) {
                                btnText.innerHTML = 'Ver Más <svg class="chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="transition:transform 0.2s;"><polyline points="6 9 12 15 18 9"></polyline></svg>';
                                row.style.background = '';
                                row.style.borderLeft = 'none';
                            } else {
                                btnText.innerHTML = 'Ocultar <svg class="chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="transition:transform 0.2s; transform: rotate(180deg);"><polyline points="6 9 12 15 18 9"></polyline></svg>';
                                row.style.background = 'var(--bg-color)';
                                row.style.borderLeft = '4px solid var(--primary)';
                            }
                        }
                    }
                });
            });

            // 3. Renderizar Controles de Paginación
            const paginationEl = document.getElementById('bita-pagination');
            if (paginationEl) {
                let pagHtml = '';
                if (totalPages > 1) {
                    pagHtml += `<button class="secondary" id="bita-prev-page" ${currentPage === 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''} style="padding:8px 14px; font-size:0.85rem; border-radius:8px; font-weight:600;">&larr; Anterior</button>`;
                    for (let p = 1; p <= totalPages; p++) {
                        if (p === 1 || p === totalPages || (p >= currentPage - 2 && p <= currentPage + 2)) {
                            pagHtml += `<button class="${p === currentPage ? 'primary' : 'secondary'}" data-page="${p}" style="padding:8px 14px; font-size:0.85rem; border-radius:8px; min-width:38px; font-weight:600;">${p}</button>`;
                        } else if (p === 2 || p === totalPages - 1) {
                            pagHtml += `<span style="color:var(--text-muted); padding: 0 4px;">...</span>`;
                        }
                    }
                    pagHtml += `<button class="secondary" id="bita-next-page" ${currentPage === totalPages ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''} style="padding:8px 14px; font-size:0.85rem; border-radius:8px; font-weight:600;">Siguiente &rarr;</button>`;
                }
                paginationEl.innerHTML = pagHtml;

                // Eventos de Paginación
                paginationEl.querySelectorAll('button[data-page]').forEach(b => {
                    b.addEventListener('click', () => {
                        currentPage = parseInt(b.getAttribute('data-page'), 10);
                        renderTable(logs);
                    });
                });
                document.getElementById('bita-prev-page')?.addEventListener('click', () => {
                    if (currentPage > 1) {
                        currentPage--;
                        renderTable(logs);
                    }
                });
                document.getElementById('bita-next-page')?.addEventListener('click', () => {
                    if (currentPage < totalPages) {
                        currentPage++;
                        renderTable(logs);
                    }
                });
            }
        }

        function updateStats(logs) {
            const totalEl = document.getElementById('stat-total-val');
            const todayEl = document.getElementById('stat-today-val');
            const usersEl = document.getElementById('stat-users-val');
            if (totalEl) totalEl.textContent = logs.length;
            const today = new Date().toDateString();
            const todayCount = logs.filter(l => l.created_at && new Date(l.created_at).toDateString() === today).length;
            if (todayEl) todayEl.textContent = todayCount;
            const uniqueUsers = new Set(logs.filter(l => l.username).map(l => l.username)).size;
            if (usersEl) usersEl.textContent = uniqueUsers;
        }

        async function loadLogs() {
            const container = document.getElementById('bita-table-container');
            if (container) container.innerHTML = `<div style="padding:60px; text-align:center; color:var(--text-muted);">
                <div style="display:inline-block; width:32px; height:32px; border:3px solid var(--border-color); border-top-color:#10b981; border-radius:50%; animation:spin 1s linear infinite;"></div>
                <p style="margin-top:16px; font-weight:500;">Cargando registros...</p>
            </div>`;

            try {
                const params = new URLSearchParams();
                const search = document.getElementById('bita-search')?.value?.trim();
                const actionFilter = document.getElementById('bita-action-filter')?.value;
                if (search) params.append('search', search);
                if (actionFilter) params.append('action_filter', actionFilter);

                const res = await fetch(`/superusuario/system-logs?${params.toString()}`, {
                    headers: {
                        'X-CSRF-TOKEN': csrfToken,
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                allLogs = data.logs || [];
                updateStats(allLogs);
                currentPage = 1; // reset a la primera página al cargar
                renderTable(allLogs);
            } catch (e) {
                const container = document.getElementById('bita-table-container');
                if (container) container.innerHTML = `<div style="padding:60px; text-align:center; color:#dc2626;">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="display:block; margin:0 auto 16px;"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                    <p style="font-weight:600; margin:0 0 6px; font-size:1.05rem;">Error al cargar la bitácora</p>
                    <p style="font-size:0.88rem; color:var(--text-muted); margin:0;">${e.message}</p>
                </div>`;
            }
        }

        function exportCSV() {
            if (!allLogs.length) { showWarning('No hay registros para exportar.'); return; }
            const headers = ['ID', 'Fecha y Hora', 'Usuario', 'Acción', 'Detalles', 'IP'];
            const rows = allLogs.map(l => [
                l.Id_Log || '',
                formatLogDate(l.created_at),
                l.username || '',
                l.action || '',
                `"${(l.details || '').replace(/"/g, '""')}"`,
                l.ip_address || ''
            ]);
            const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
            const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const now = new Date();
            a.href = url;
            a.download = `bitacora-sistema-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        }

        // Agregar animación CSS si no existe
        if (!document.getElementById('bita-spin-style')) {
            const style = document.createElement('style');
            style.id = 'bita-spin-style';
            style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
            document.head.appendChild(style);
        }

        // Eventos
        let debounceTimer;
        document.getElementById('bita-search')?.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(loadLogs, 350);
        });
        document.getElementById('bita-action-filter')?.addEventListener('change', () => { currentPage = 1; loadLogs(); });
        document.getElementById('bita-date-start')?.addEventListener('change', () => { currentPage = 1; renderTable(allLogs); });
        document.getElementById('bita-date-end')?.addEventListener('change', () => { currentPage = 1; renderTable(allLogs); });
        document.getElementById('bita-refresh-btn')?.addEventListener('click', loadLogs);
        document.getElementById('bita-export-btn')?.addEventListener('click', exportCSV);

        // Carga inicial
        loadLogs();
    }

    // --- Gestión de Usuarios (SuperUsuario) ---
    function renderSuperUserView() {
        if (!contentDetails) return;
            let allUsers = []; // Cache local para filtrado
            if (contentHeader) contentHeader.innerHTML = `<h4>Gestión de Usuarios y Roles</h4>`;
            contentDetails.innerHTML = `
                <div id="users-app">
                    <div style="display:flex;justify-content:space-between;align-items:center; margin-bottom: 25px;">
                        <div style="display:flex; gap:10px;">
                            <button id="new-user-btn" class="primary" style="padding: 10px 20px; background: #3498db; border: none; border-radius: 8px; color: #fff; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Nuevo Usuario
                            </button>
                            <button id="refresh-users" style="padding: 10px 20px; background: #95a5a6; border: none; border-radius: 8px; color: #fff; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M23 4v6h-6"></path>
                                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                                </svg>
                                Refrescar
                            </button>
                            <button id="create-default-su" style="background:#8e44ad; color:#fff; border:none; padding:10px 15px; border-radius:8px; cursor:pointer; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                    <path d="M2 17l10 5 10-5"></path>
                                    <path d="M2 12l10 5 10-5"></path>
                                </svg>
                                Crear SU
                            </button>
                        </div>
                        <div id="users-message" style="color:var(--text-muted); font-weight: 600;"></div>
                    </div>
                    
                    <!-- Filtros de Usuario -->
                    <div id="users-filters" style="margin-bottom:20px; background:var(--card-bg); padding:15px; border-radius:12px; display:flex; gap:35px; align-items:flex-end; border:1px solid var(--border-color); flex-wrap: wrap;">
                        <div style="width:180px;">
                            <label style="display:block; font-size:10px; color:var(--text-muted); margin-bottom:5px; font-weight:700; text-transform:uppercase;">Usuario / Correo</label>
                            <input id="f-usr-query" type="text" readonly onfocus="this.removeAttribute('readonly');" onblur="this.setAttribute('readonly',true);" autocomplete="new-password" placeholder="Nombre..." style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-color); color:var(--text-main); font-size:12px;">
                        </div>
                        <div style="width:180px;">
                            <label style="display:block; font-size:10px; color:var(--text-muted); margin-bottom:5px; font-weight:700; text-transform:uppercase;">Trabajador</label>
                            <input id="f-usr-work" type="text" readonly onfocus="this.removeAttribute('readonly');" onblur="this.setAttribute('readonly',true);" autocomplete="new-password" placeholder="Nombre..." style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-color); color:var(--text-main); font-size:12px;">
                        </div>
                        <div style="width:130px;">
                            <label style="display:block; font-size:10px; color:var(--text-muted); margin-bottom:5px; font-weight:700; text-transform:uppercase;">Rol</label>
                            <select id="u-filter-role" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-color); color:var(--text-main); font-size:12px;">
                                <option value="">Todos</option>
                                <option value="SuperUsuario">SuperUsuario</option>
                                <option value="Administrativo">Administrativo</option>
                                <option value="Trabajador">Trabajador</option>
                            </select>
                        </div>
                        <div style="width:130px;">
                            <label style="display:block; font-size:10px; color:var(--text-muted); margin-bottom:5px; font-weight:700; text-transform:uppercase;">Estado</label>
                            <select id="u-filter-status" style="width:100%; padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-color); color:var(--text-main); font-size:12px;">
                                <option value="">Todos</option>
                                <option value="Activo">Activos</option>
                                <option value="Inactivo">Inactivos</option>
                            </select>
                        </div>
                    </div>

                    <div id="user-form" style="display:none; background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%); padding: 30px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                        <h5 id="user-form-title" style="margin: 0 0 25px 0; color: #fff; font-size: 1.25em; display: flex; align-items: center; gap: 10px; font-weight: 700;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            Datos de Usuario
                        </h5>
                        
                        <div style="background: var(--card-bg); padding: 25px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid var(--border-color, #eee);">
                            <h6 style="margin: 0 0 20px 0; color: var(--text-main); font-size: 1em; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                Información de Identidad
                            </h6>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                <div class="form-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color:var(--text-main); font-size:0.9em;">Usuario <span style="color:#e74c3c;">*</span></label>
                                    <input id="u-username" style="width:100%; padding:12px; border:1px solid var(--border-color, #ddd); border-radius:8px; font-size:0.95em; background:var(--bg-color); color:var(--text-main);" placeholder="ejemplo_123"/>
                                    <div id="u-username-msg" style="display:none; color:#e74c3c; font-size:11px; margin-top:4px;"></div>
                                </div>
                                <div class="form-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color:var(--text-main); font-size:0.9em;">Nombre Completo <span style="color:#e74c3c;">*</span></label>
                                    <input id="u-name" style="width:100%; padding:12px; border:1px solid var(--border-color, #ddd); border-radius:8px; font-size:0.95em; background:var(--bg-color); color:var(--text-main);" placeholder="Nombre real"/>
                                    <div id="u-name-msg" style="display:none; color:#e74c3c; font-size:11px; margin-top:4px;"></div>
                                </div>
                                <div class="form-row" style="grid-column: 1/3;">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color:var(--text-main); font-size:0.9em;">Correo Electrónico <span style="color:#e74c3c;">*</span></label>
                                    <input id="u-email" style="width:100%; padding:12px; border:1px solid var(--border-color, #ddd); border-radius:8px; font-size:0.95em; background:var(--bg-color); color:var(--text-main);" placeholder="correo@ejemplo.com"/>
                                    <div id="u-email-msg" style="display:none; color:#e74c3c; font-size:11px; margin-top:4px;"></div>
                                </div>
                            </div>
                        </div>

                        <div style="background: var(--card-bg); padding: 25px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid var(--border-color, #eee);">
                            <h6 style="margin: 0 0 20px 0; color: var(--text-main); font-size: 1em; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                Rol y Vinculación
                            </h6>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                <div class="form-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color:var(--text-main); font-size:0.9em;">Rol <span style="color:#e74c3c;">*</span></label>
                                    <select id="u-role" style="width:100%; padding:12px; border:1px solid var(--border-color, #ddd); border-radius:8px; font-size:0.95em; background:var(--bg-color); color:var(--text-main);">
                                        <option value="Trabajador">Trabajador</option>
                                        <option value="Administrativo">Administrativo</option>
                                        <option value="SuperUsuario">SuperUsuario</option>
                                    </select>
                                </div>
                                <div class="form-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color:var(--text-main); font-size:0.9em;">Trabajador Vinculado</label>
                                    <select id="u-worker" style="width:100%; padding:12px; border:1px solid var(--border-color, #ddd); border-radius:8px; font-size:0.95em; background:var(--bg-color); color:var(--text-main);">
                                        <option value="">— Sin vincular —</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div style="background: var(--card-bg); padding: 25px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid var(--border-color, #eee);">
                            <h6 style="margin: 0 0 20px 0; color: var(--text-main); font-size: 1em; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                Seguridad
                            </h6>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                <div class="form-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color:var(--text-main); font-size:0.9em;">Contraseña <span id="u-pass-req-star" style="color:#e74c3c; display:none;">*</span></label>
                                    <div class="input-row" style="position:relative;">
                                        <input id="u-password" type="password" autocomplete="new-password" style="width:100%; padding:12px; border:1px solid var(--border-color, #ddd); border-radius:8px; font-size:0.95em; background:var(--bg-color); color:var(--text-main);" placeholder="Mínimo 8 caracteres"/>
                                        <button type="button" class="toggle-pass" style="position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; color:var(--text-muted); cursor:pointer;">${eyeSvg}</button>
                                    </div>
                                    <div id="u-password-msg" style="display:none; color:#e74c3c; font-size:11px; margin-top:4px;"></div>
                                    <div id="u-password-rules" style="margin-top:10px; font-size:11px; color:var(--text-muted); line-height:1.6; background: rgba(0,0,0,0.03); padding: 10px; border-radius: 6px;">
                                        <div style="font-weight:700; margin-bottom:5px; color:var(--text-main);">Requisitos de seguridad:</div>
                                        <div id="rule-length" style="display:flex; align-items:center; gap:6px;"><span class="dot" style="font-size:14px;">○</span> Al menos 8 caracteres</div>
                                        <div id="rule-upper" style="display:flex; align-items:center; gap:6px;"><span class="dot" style="font-size:14px;">○</span> Al menos una mayúscula</div>
                                        <div id="rule-lower" style="display:flex; align-items:center; gap:6px;"><span class="dot" style="font-size:14px;">○</span> Al menos una minúscula</div>
                                        <div id="rule-number" style="display:flex; align-items:center; gap:6px;"><span class="dot" style="font-size:14px;">○</span> Al menos un número</div>
                                        <div id="rule-special" style="display:flex; align-items:center; gap:6px;"><span class="dot" style="font-size:14px;">○</span> Al menos un caracter especial</div>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <label style="display:block; font-weight:600; margin-bottom:8px; color:var(--text-main); font-size:0.9em;">Repetir Contraseña <span id="u-passconf-req-star" style="color:#e74c3c; display:none;">*</span></label>
                                    <div class="input-row" style="position:relative;">
                                        <input id="u-password-confirm" type="password" autocomplete="new-password" style="width:100%; padding:12px; border:1px solid var(--border-color, #ddd); border-radius:8px; font-size:0.95em; background:var(--bg-color); color:var(--text-main);" placeholder="Confirme contraseña"/>
                                        <button type="button" class="toggle-pass" style="position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; color:var(--text-muted); cursor:pointer;">${eyeSvg}</button>
                                    </div>
                                    <div id="u-password-confirm-msg" style="display:none; color:#e74c3c; font-size:11px; margin-top:4px;"></div>
                                </div>
                            </div>
                        </div>

                        <div style="display:flex; gap:15px; margin-top:30px; align-items: center;">
                            <button id="save-user" style="padding: 15px 35px; background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); border: none; border-radius: 10px; color: #fff; font-weight: 700; cursor: pointer; font-size: 1.1em; display: flex; align-items: center; gap: 10px; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                                Guardar Datos
                            </button>
                            <button id="cancel-user" style="padding: 15px 30px; border-radius: 10px; border: 2px solid #fff; background: transparent; color: #fff; cursor: pointer; font-weight: 700;">Cancelar</button>
                            <div id="u-form-msg"></div>
                        </div>
                    </div>
                    <div id="users-list" style="margin-top:16px;"></div>
                </div>
            `;

            const usersMessage = document.getElementById('users-message');
            const newUserBtn = document.getElementById('new-user-btn');
            const userForm = document.getElementById('user-form');
            const saveBtn = document.getElementById('save-user');
            const cancelBtn = document.getElementById('cancel-user');
            const refreshBtn = document.getElementById('refresh-users');
            const formTitle = document.getElementById('user-form-title');



            // --- Password Toggle Logic ---
            function setupPasswordToggles(container) {
                const toggles = container.querySelectorAll('.toggle-pass');
                toggles.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const row = btn.closest('.input-row');
                        if (!row) return;
                        const inp = row.querySelector('input');
                        if (!inp) return;
                        const isPass = inp.type === 'password';
                        inp.type = isPass ? 'text' : 'password';
                        btn.innerHTML = isPass ? eyeOffSvg : eyeSvg;
                        btn.setAttribute('aria-label', isPass ? 'Ocultar contraseña' : 'Mostrar contraseña');
                        inp.focus();
                    });
                });
            }
            if (userForm) setupPasswordToggles(userForm);

            let editUserId = null; // si no es null, estamos en modo edición

            function showUsersMsg(msg, type = 'info') { if (usersMessage) { usersMessage.textContent = msg; usersMessage.style.color = type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#7f8c8d'; } }

            newUserBtn.addEventListener('click', () => {
                editUserId = null;
                formTitle.textContent = 'Crear Usuario';
                document.getElementById('u-pass-req-star').style.display = 'inline';
                document.getElementById('u-passconf-req-star').style.display = 'inline';
                if (!userForm) return;
                if (userForm.classList.contains('open')) closeSmooth(userForm);
                else openSmooth(userForm);
                clearForm();
            });

            cancelBtn.addEventListener('click', () => { editUserId = null; if (userForm) closeSmooth(userForm); clearForm(); });

            refreshBtn.addEventListener('click', () => { loadAndRenderUsers(); });

            // --- Lógica de Filtrado ---
            function applyFilters() {
                const qSearch = document.getElementById('f-usr-query').value.toLowerCase().trim();
                const qWorker = document.getElementById('f-usr-work').value.toLowerCase().trim();
                const qRole = document.getElementById('u-filter-role').value;
                const qStatus = document.getElementById('u-filter-status').value;

                const filtered = allUsers.filter(u => {
                    const matchesSearch = !qSearch || (u.Nombre_usuario || '').toLowerCase().includes(qSearch) || (u.Correo || '').toLowerCase().includes(qSearch);
                    const matchesWorker = !qWorker || (u.Trabajador_Nombre || '').toLowerCase().includes(qWorker);
                    const matchesRole = !qRole || u.Nombre_rol === qRole;
                    const matchesStatus = !qStatus || (u.Estado || 'Activo') === qStatus;
                    return matchesSearch && matchesWorker && matchesRole && matchesStatus;
                });

                renderUsersTable(filtered);
            }

            ['f-usr-query', 'f-usr-work', 'u-filter-role', 'u-filter-status'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.addEventListener('input', applyFilters);
                    // Forzar limpieza extrema (proteger contra autofill agresivo)
                    const clear = () => {
                        // Si el elemento no tiene foco, forzamos que esté vacío si no se ha inicializado
                        if (document.activeElement !== el && !window.filterInitialized) {
                            if (el.tagName === 'INPUT') el.value = '';
                            else if (el.tagName === 'SELECT') el.selectedIndex = 0;
                        }
                    };
                    clear();
                    for(let t of [50, 150, 300, 500, 1000, 2000, 3000, 5000]) setTimeout(clear, t);
                }
            });
            window.filterInitialized = true;

            // Asegurar que el formulario de usuario esté limpio al iniciar (Nuclear - Solo búsqueda)
            const forceClearForm = () => {
                // No limpiamos contraseñas aquí si el usuario quiere que persistan/autocompleten
            };
            forceClearForm();
            setTimeout(forceClearForm, 250);

            // (Logic integrated into validateUserForm)

            // --- Validaciones en tiempo real para el formulario de usuario ---
            window.allowedEmailDomains = new Set(['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com']);

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

            function validateUserForm() {
                let ok = true;
                const emailEl = document.getElementById('u-email');
                const usernameEl = document.getElementById('u-username');
                const nameEl = document.getElementById('u-name');
                const passEl = document.getElementById('u-password');
                const passConfEl = document.getElementById('u-password-confirm');

                const emailMsg = document.getElementById('u-email-msg');
                const unameMsg = document.getElementById('u-username-msg');
                const nameMsg = document.getElementById('u-name-msg');

                const email = emailEl ? emailEl.value.trim() : '';
                const username = usernameEl ? usernameEl.value.trim() : '';
                const name = nameEl ? nameEl.value.trim() : '';
                const pass = passEl ? passEl.value : '';
                const passConf = passConfEl ? passConfEl.value : '';

                // Reset styles
                const resetStyle = (el, msg) => {
                    if (el) el.style.borderColor = 'var(--border-color)';
                    if (msg) { msg.style.display = 'none'; msg.textContent = ''; }
                };
                const setErr = (el, msg, text) => {
                    if (el) el.style.borderColor = '#e74c3c';
                    if (msg) { msg.style.display = 'block'; msg.textContent = text; msg.style.color = '#e74c3c'; msg.style.fontSize = '11px'; msg.style.marginTop = '4px'; }
                    ok = false;
                };

                resetStyle(emailEl, emailMsg);
                resetStyle(usernameEl, unameMsg);
                resetStyle(nameEl, nameMsg);
                if (passEl) passEl.style.borderColor = 'var(--border-color)';
                if (passConfEl) passConfEl.style.borderColor = 'var(--border-color)';

                // 1. Correo
                if (!email) {
                    ok = false;
                } else if (!email.includes('@')) {
                    setErr(emailEl, emailMsg, 'Tu dirección de correo electrónico debe contener @.');
                } else if (!validateEmailFormat(email)) {
                    setErr(emailEl, emailMsg, 'Formato de correo inválido');
                } else if (!validateEmailDomain(email)) {
                    setErr(emailEl, emailMsg, 'Dominio no permitido (ej: gmail.com)');
                } else {
                    if (emailEl) emailEl.style.borderColor = '#2ecc71';
                }

                // 2. Usuario
                const usernameRegex = /^[a-zA-Z0-9._]+$/;
                if (!username) {
                    ok = false;
                } else if (username.length < 3) {
                    setErr(usernameEl, unameMsg, 'Mínimo 3 caracteres');
                } else if (!usernameRegex.test(username)) {
                    setErr(usernameEl, unameMsg, 'Solo letras, números, puntos y guiones bajos');
                } else {
                    if (usernameEl) usernameEl.style.borderColor = '#2ecc71';
                }

                // 3. Nombre Completo
                const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
                if (!name) {
                    ok = false;
                } else if (name.length < 3) {
                    // Solo activar ok=false sin mensaje si es muy corto? 
                    // El usuario dijo solo si viola restricciones. Dejaremos que ok sea true si solo es corto por ahora?
                    // No, length < 3 es una restricción.
                    setErr(nameEl, nameMsg, 'Nombre muy corto');
                } else if (!nameRegex.test(name)) {
                    setErr(nameEl, nameMsg, 'Tu nombre solo puede contener letras.');
                } else {
                    if (nameEl) nameEl.style.borderColor = '#2ecc71';
                }

                // 4. Contraseñas
                const updateRule = (id, valid) => {
                    const el = document.getElementById(id);
                    if (!el) return;
                    el.style.color = valid ? '#27ae60' : (pass.length > 0 ? '#e74c3c' : 'var(--text-muted)');
                    const d = el.querySelector('.dot'); if (d) d.textContent = valid ? '●' : '○';
                };
                const passRules = [
                    { test: (pw) => pw.length >= 8, id: 'rule-length' },
                    { test: (pw) => /[A-Z]/.test(pw), id: 'rule-upper' },
                    { test: (pw) => /[a-z]/.test(pw), id: 'rule-lower' },
                    { test: (pw) => /[0-9]/.test(pw), id: 'rule-number' },
                    { test: (pw) => /[^a-zA-Z0-9]/.test(pw), id: 'rule-special' }
                ];
                passRules.forEach(r => updateRule(r.id, r.test(pass)));

                if (!editUserId || pass.length > 0 || passConf.length > 0) {
                    const passValid = passRules.every(r => r.test(pass));
                    const pwMsg = document.getElementById('u-password-msg');
                    const passConfEl = document.getElementById('u-password-confirm');
                    const passConfMsg = document.getElementById('u-password-confirm-msg');

                    if (!pass) {
                        if (!editUserId) ok = false; 
                    } else if (!passValid) {
                        setErr(passEl, pwMsg, 'La contraseña no cumple los requisitos.');
                        ok = false;
                    } else {
                        if (passEl) passEl.style.borderColor = '#2ecc71';
                        if (pwMsg) pwMsg.style.display = 'none';
                    }

                    if (pass !== passConf && passConf.length > 0) {
                        setErr(passConfEl, passConfMsg, 'Las contraseñas no coinciden.');
                        ok = false;
                    } else if (passConf && pass === passConf) {
                        if (passConfEl) {
                            passConfEl.style.borderColor = '#2ecc71';
                            if (passConfMsg) { passConfMsg.style.display = 'none'; }
                        }
                    } else {
                        // Reset if empty
                        resetStyle(passConfEl, passConfMsg);
                    }
                }

                return ok;
            }

            // Attach listeners for realtime validation
            ['u-email', 'u-username', 'u-name', 'u-password', 'u-password-confirm', 'u-role', 'u-worker'].forEach(id => {
                const el = document.getElementById(id);
                if (!el) return;
                el.addEventListener('input', () => validateUserForm());
                el.addEventListener('change', () => validateUserForm());

                // Bloqueo de caracteres en tiempo real para Nombre Real (igual que trabajadores)
                if (id === 'u-name') {
                    el.addEventListener('keypress', (e) => {
                        const char = String.fromCharCode(e.which);
                        if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/.test(char) && !e.ctrlKey && !e.metaKey && e.key !== 'Backspace' && e.key !== 'Delete') {
                            e.preventDefault();
                            // Mostrar mensaje de error al intentar ingresar algo inválido
                            const nameMsg = document.getElementById('u-name-msg');
                            if (nameMsg) {
                                nameMsg.style.display = 'block';
                                nameMsg.textContent = 'Tu nombre solo puede contener letras.';
                                el.style.borderColor = '#e74c3c';
                                // Limpiar después de 2 segundos para no ser intrusivo
                                setTimeout(() => { if (!/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/.test(el.value)) { nameMsg.style.display = 'none'; el.style.borderColor = (el.value ? '#2ecc71' : 'var(--border-color)'); } }, 2000);
                            }
                        }
                    });
                    el.addEventListener('input', (e) => {
                        const v = e.target.value;
                        if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/.test(v)) {
                            e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
                            validateUserForm();
                        }
                    });
                }
            });

            // Helper para abrir/cerrar elementos con animación suave
            function openSmooth(el) {
                if (!el) return;
                el.classList.add('open');
                // ensure display block for accessibility (some forms rely on display)
                el.style.display = 'block';
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // remove explicit max-height after transition to allow natural height growth
                setTimeout(() => { try { el.style.maxHeight = ''; } catch (e) { } }, 300);
            }

            function closeSmooth(el) {
                if (!el) return;
                // set a max-height equal to current height to enable transition to 0
                try { el.style.maxHeight = el.scrollHeight + 'px'; } catch (e) { }
                // force reflow then start collapse
                requestAnimationFrame(() => {
                    el.classList.remove('open');
                    el.style.maxHeight = '0';
                    el.style.opacity = '0';
                });
                // after animation, hide the element to keep previous behaviour
                setTimeout(() => { try { el.style.display = 'none'; el.style.maxHeight = ''; el.style.opacity = ''; } catch (e) { } }, 320);
            }

            // ─────────────────────────────────────────────────────────────────
            // loadWorkersForUsers
            // Carga la lista de trabajadores DISPONIBLES (sin usuario asignado)
            // en el select #u-worker del formulario de creación/edición.
            // Al seleccionar un trabajador, autocompleta Nombre y Correo desde
            // la BD a través de getDatosTrabajador() y bloquea dichos campos.
            // ─────────────────────────────────────────────────────────────────
            window.loadWorkersForUsers = async function loadWorkersForUsers() {
                try {
                    const res = await fetch('/superusuario/workers-list', {
                        cache: 'no-store',
                        headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content }
                    });
                    const data = await res.json();
                    const sel = document.getElementById('u-worker');
                    if (!sel) return;

                    // Limpiar opciones conservando la opción vacía
                    sel.innerHTML = '<option value="">— Sin vincular —</option>';

                    if (res.ok && data.workers && data.workers.length) {
                        // Obtener lista de usuarios para identificar trabajadores ya vinculados
                        const usersList = await loadUsers().catch(() => []);

                        // Enriquecer dominios permitidos con los ya usados por usuarios existentes
                        try {
                            if (!window.allowedEmailDomains) window.allowedEmailDomains = new Set(['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com']);
                            usersList.forEach(u => {
                                const d = extractDomain((u.Correo || '').trim().toLowerCase());
                                if (d) window.allowedEmailDomains.add(d);
                            });
                        } catch (_) { /* no bloquear si falla */ }

                        // Si estamos editando, permitir el trabajador ya asignado a ESE usuario
                        const currentAssigned = editUserId
                            ? String((usersList.find(u => String(u.Id_Usuario) === String(editUserId)) || {}).Id_Trabajador || '')
                            : '';

                        // Construir conjunto de IDs ya asignados (excluyendo el del usuario en edición)
                        const assigned = new Set();
                        usersList.forEach(u => {
                            if (u.Id_Trabajador && String(u.Id_Trabajador) !== currentAssigned)
                                assigned.add(String(u.Id_Trabajador));
                        });

                        // Poblar select solo con trabajadores disponibles
                        data.workers.forEach(w => {
                            const wid = String(w.Id_Trabajador || '');
                            if (assigned.has(wid)) return; // excluir trabajadores ya con usuario
                            const opt = document.createElement('option');
                            opt.value = w.Id_Trabajador;
                            opt.textContent = `${w.Nombre_Completo || ''} ${w.Apellidos || ''} ${w.Documento_Identidad ? '· ' + w.Documento_Identidad : ''}`.trim();
                            sel.appendChild(opt);
                        });
                    }

                    // ── Autocomplete: al cambiar el select de trabajador ──────────
                    // Evitar registrar el listener más de una vez
                    if (!sel.dataset.autocompleteAttached) {
                        sel.dataset.autocompleteAttached = 'true';

                        sel.addEventListener('change', async function () {
                            const workerId   = this.value;
                            const nameInput  = document.getElementById('u-name');
                            const emailInput = document.getElementById('u-email');
                            const nameLabel  = document.getElementById('u-name-autocomplete-badge');

                            if (!workerId) {
                                // Sin trabajador seleccionado → campos editables y vacíos
                                _setWorkerFieldsEditable(nameInput, emailInput);
                                return;
                            }

                            // Indicador visual de carga
                            if (nameInput)  { nameInput.value = 'Consultando...'; nameInput.style.opacity = '0.5'; }
                            if (emailInput) { emailInput.value = 'Consultando...'; emailInput.style.opacity = '0.5'; }

                            try {
                                const r = await fetch(`/superusuario/workers/${workerId}/datos`, {
                                    cache: 'no-store',
                                    headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content }
                                });

                                if (!r.ok) throw new Error('No se pudo obtener los datos del trabajador');
                                const worker = await r.json();

                                // Rellenar campos con datos reales del trabajador
                                if (nameInput) {
                                    nameInput.value = worker.nombre_completo || '';
                                    nameInput.style.opacity = '1';
                                    nameInput.setAttribute('readonly', true);
                                    nameInput.style.background   = 'color-mix(in srgb, var(--bg-color), #10b981 8%)';
                                    nameInput.style.borderColor  = '#10b981';
                                    nameInput.style.cursor       = 'not-allowed';
                                }

                                if (emailInput) {
                                    emailInput.value = worker.correo || '';
                                    emailInput.style.opacity = '1';

                                    if (worker.correo) {
                                        // Si el trabajador tiene correo, bloquearlo
                                        emailInput.setAttribute('readonly', true);
                                        emailInput.style.background  = 'color-mix(in srgb, var(--bg-color), #10b981 8%)';
                                        emailInput.style.borderColor = '#10b981';
                                        emailInput.style.cursor      = 'not-allowed';
                                    } else {
                                        // Sin correo registrado → dejar editable con aviso
                                        emailInput.removeAttribute('readonly');
                                        emailInput.style.background  = 'color-mix(in srgb, var(--bg-color), #f59e0b 8%)';
                                        emailInput.style.borderColor = '#f59e0b';
                                        emailInput.style.cursor      = 'text';
                                        emailInput.placeholder       = 'Trabajador sin correo, ingresa uno válido';
                                    }
                                }

                                // Mostrar badge de confirmación junto al label de Nombre
                                _showAutocompleteBadge();

                                // Re-ejecutar validación con los nuevos valores
                                if (typeof validateUserForm === 'function') validateUserForm();

                            } catch (err) {
                                if (nameInput)  { nameInput.value = '';  nameInput.style.opacity = '1'; }
                                if (emailInput) { emailInput.value = ''; emailInput.style.opacity = '1'; }
                                _setWorkerFieldsEditable(nameInput, emailInput);
                                showUsersMsg('Error al cargar datos del trabajador: ' + err.message, 'error');
                            }
                        });
                    }
                } catch (e) { console.warn('loadWorkersForUsers error', e); }
            };

            /** Restaura los campos Nombre y Correo al estado editable normal */
            function _setWorkerFieldsEditable(nameInput, emailInput) {
                [nameInput, emailInput].forEach(inp => {
                    if (!inp) return;
                    inp.removeAttribute('readonly');
                    inp.style.background  = '';
                    inp.style.borderColor = '';
                    inp.style.cursor      = '';
                    inp.style.opacity     = '1';
                    inp.placeholder       = inp.id === 'u-name' ? 'Nombre real' : 'correo@ejemplo.com';
                });
                _removeAutocompleteBadge();
            }

            /** Muestra un pequeño badge verde junto al label de Nombre Completo */
            function _showAutocompleteBadge() {
                _removeAutocompleteBadge();
                const nameLabel = document.querySelector('label[for="u-name"], #user-form label:has(+ #u-name), #user-form .form-row label');
                // Buscar el contenedor del campo u-name
                const nameInput = document.getElementById('u-name');
                if (!nameInput) return;
                const badge = document.createElement('span');
                badge.id = 'u-name-autocomplete-badge';
                badge.textContent = '✓ Datos autocompletados desde nómina';
                badge.style.cssText = 'display:inline-block;margin-top:5px;font-size:10px;font-weight:700;color:#10b981;background:rgba(16,185,129,0.1);padding:3px 8px;border-radius:20px;letter-spacing:0.3px;';
                // Insertar debajo del input
                nameInput.parentNode.insertBefore(badge, nameInput.nextSibling);
            }

            function _removeAutocompleteBadge() {
                const old = document.getElementById('u-name-autocomplete-badge');
                if (old) old.remove();
            }

            // Create default SuperUsuario button
            const createSuBtn = document.getElementById('create-default-su');
            if (createSuBtn) {
                createSuBtn.addEventListener('click', async () => {
                    if (!await showConfirm('Crear un usuario SuperUsuario por defecto? Se generará un usuario con contraseña temporal.')) return;
                    showUsersMsg('Creando SuperUsuario...');
                    try {
                        const res = await fetch('/superusuario/create-superuser', { method: 'POST', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content } });
                        const data = await res.json();
                        if (res.ok) {
                            if (data.password) {
                                showUsersMsg(`Creado: ${data.username} · contraseña: ${data.password}`, 'success');
                            } else if (data.message && data.username) {
                                showUsersMsg(`${data.message}: ${data.username}`, 'info');
                            } else if (data.message) {
                                showUsersMsg(data.message, 'info');
                            }
                            loadAndRenderUsers();
                        } else {
                            showUsersMsg(data.error || 'Error creando SuperUsuario', 'error');
                        }
                    } catch (e) { showUsersMsg('Error de conexión', 'error'); }
                });
            }

            // Ocultar el botón "Crear SU" si ya existe al menos un SuperUsuario
            (async function hideCreateSuIfExists() {
                try {
                    if (!createSuBtn) return;
                    const users = await loadUsers();
                    const hasSu = Array.isArray(users) && users.some(u => (u.Nombre_rol || '').toLowerCase() === 'superusuario');
                    if (hasSu) createSuBtn.style.display = 'none';
                } catch (e) {
                    // no bloquear la UI por este chequeo
                }
            })();

            async function loadUsers() {
                try {
                    const res = await fetch('/superusuario/users-data', { cache: 'no-store', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content } });
                    const data = await res.json();
                    if (res.ok && data.users) return data.users;
                    return data.users || [];
                } catch (e) {
                    // No fallback to localStorage: return empty list on error
                    return [];
                }
            }

            function renderUsersTable(users) {
                const el = document.getElementById('users-list');
                if (!el) return;
                if (!users || !users.length) { el.innerHTML = '<p>No hay usuarios registrados.</p>'; return; }

                // Inyectar estilos para el Toggle iOS si no existen
                if (!document.getElementById('users-toggle-style')) {
                    const style = document.createElement('style');
                    style.id = 'users-toggle-style';
                    style.textContent = `
                        .ios-switch { position:relative; display:inline-block; width:44px; height:24px; cursor:pointer; }
                        .ios-slider { position:absolute; top:0; left:0; right:0; bottom:0; background-color:#e4e4e7; transition:.3s cubic-bezier(0.4, 0, 0.2, 1); border-radius:24px; }
                        .ios-slider::before { content:""; position:absolute; height:18px; width:18px; left:3px; bottom:3px; background-color:white; transition:.3s cubic-bezier(0.4, 0, 0.2, 1); border-radius:50%; box-shadow: 0 1px 3px rgba(0,0,0,0.15); }
                        .toggle-status-cb:checked + .ios-slider { background-color:#10b981; }
                        .toggle-status-cb:checked + .ios-slider::before { transform: translateX(20px); }
                        body.dark-mode .ios-slider { background-color: #3f3f46; }
                    `;
                    document.head.appendChild(style);
                }

                const activeUsers = users.filter(u => u.Estado !== 'Inactivo');
                const inactiveUsers = users.filter(u => u.Estado === 'Inactivo');

                const buildTable = (list, title, titleColor) => {
                    if (!list.length) return '';
                    return `
                        <h5 style="margin-top:24px; color:${titleColor}; border-bottom: 2px solid ${titleColor}; padding-bottom: 8px; font-weight:700;">${title}</h5>
                        <table style="width:100%; border-collapse:collapse; margin-bottom: 24px; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; overflow:hidden; box-shadow:0 4px 6px -1px rgba(0,0,0,0.02);">
                        <thead>
                            <tr style="background:var(--bg-color); border-bottom:1.5px solid var(--border-color);">
                                <th style="padding:14px; font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); letter-spacing:.8px;">Usuario</th>
                                <th style="padding:14px; font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); letter-spacing:.8px;">Correo</th>
                                <th style="padding:14px; font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); letter-spacing:.8px;">Rol</th>
                                <th style="padding:14px; font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); letter-spacing:.8px;">Estado</th>
                                <th style="padding:14px; font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); letter-spacing:.8px;">Trabajador Vinculado</th>
                                <th style="padding:14px; font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); letter-spacing:.8px;">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>${list.map(u => {
                        const isInactive = u.Estado === 'Inactivo';
                        const isSuper = ((u.Nombre_rol || '').toLowerCase() === 'superusuario');
                        
                        let statusHtml = '';
                        if (isSuper) {
                            statusHtml = `<span style="color:#f59e0b; font-weight:700; font-size:0.82rem; background:rgba(245,158,11,0.1); padding:4px 10px; border-radius:20px;">SISTEMA</span>`;
                        } else {
                            statusHtml = `
                                <label class="ios-switch">
                                    <input type="checkbox" class="toggle-status-cb" data-id="${u.Id_Usuario}" ${isInactive ? '' : 'checked'} style="opacity:0; width:0; height:0;">
                                    <span class="ios-slider"></span>
                                </label>
                            `;
                        }

                        let actionsHtml = '';
                        if (isSuper) {
                            actionsHtml = `<span style="color:var(--text-muted); font-size:0.85rem; font-weight:600;">Acceso Protegido</span>`;
                        } else {
                            actionsHtml += `<button class="edit-user-btn" data-id="${u.Id_Usuario}" data-username="${u.raw_username || ''}" data-name="${u.Nombre_completo || ''}" data-email="${u.Correo}" data-role="${u.Nombre_rol || ''}" data-worker-id="${u.Id_Trabajador || ''}" style="background:#3b82f6; color:#fff; border:none; padding:6px 12px; border-radius:8px; cursor:pointer; font-weight:600; font-size:0.8rem; transition:transform 0.15s ease;">Editar</button>`;
                        }

                        return `<tr style="border-bottom: 1px solid var(--border-color); transition:background .15s;">
                            <td style="padding:14px; color: var(--text-main); font-weight:700;">${u.Nombre_usuario}</td>
                            <td style="padding:14px; color: var(--text-muted); font-weight:500;">${u.Correo}</td>
                            <td style="padding:14px; color: var(--text-main); font-weight:600;"><span style="font-size:0.8rem; padding:3px 8px; border-radius:20px; background:rgba(59,130,246,0.08); color:#3b82f6; font-weight:700;">${u.Nombre_rol || ''}</span></td>
                            <td style="padding:14px; vertical-align: middle;">${statusHtml}</td>
                            <td style="padding:14px; color: var(--text-muted); font-weight:600;">${u.Trabajador_Nombre || '—'}</td>
                            <td style="padding:14px;">${actionsHtml}</td>
                            </tr>`;
                    }).join('')}</tbody></table>`;
                };

                let html = '';
                if (activeUsers.length) html += buildTable(activeUsers, 'Usuarios Activos', 'var(--text-main)');
                else html += '<p>No hay usuarios activos.</p>';

                if (inactiveUsers.length) html += buildTable(inactiveUsers, 'Usuarios Inactivos', '#e74c3c');

                el.innerHTML = html;
                attachUserListeners();
            }

            function attachUserListeners() {
                document.querySelectorAll('.del-user-btn').forEach(b => {
                    b.addEventListener('click', async () => {
                        if (!await showConfirm('¿Desactivar usuario?')) return;
                        const id = b.getAttribute('data-id');
                        // disable button to avoid double clicks
                        b.disabled = true;
                        try {
                            const res = await fetch(`/superusuario/users/${id}/deactivate`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content } });
                            const text = await res.text();
                            let data;
                            try { data = JSON.parse(text); } catch (e) { data = { error: text }; }
                            if (res.ok) {
                                showUsersMsg('Usuario desactivado', 'success');
                                if (window.loadWorkersForUsers) window.loadWorkersForUsers();
                                loadAndRenderUsers();
                            } else {
                                showUsersMsg(data.error || 'Error al desactivar', 'error');
                            }
                        } catch (e) { showUsersMsg('Error de conexión', 'error'); console.error('Deactivate user error', e); }
                        finally { b.disabled = false; }
                    });
                });

                document.querySelectorAll('.activate-user-btn').forEach(b => {
                    b.addEventListener('click', async () => {
                        if (!await showConfirm('¿Reactivar usuario?')) return;
                        const id = b.getAttribute('data-id');
                        b.disabled = true;
                        try {
                            const res = await fetch(`/superusuario/users/${id}/activate`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content } });
                            const text = await res.text();
                            let data;
                            try { data = JSON.parse(text); } catch (e) { data = { error: text }; }
                            if (res.ok) {
                                showUsersMsg('Usuario activado', 'success');
                                if (window.loadWorkersForUsers) window.loadWorkersForUsers();
                                loadAndRenderUsers();
                            } else {
                                showUsersMsg(data.error || 'Error al activar', 'error');
                            }
                        } catch (e) { showUsersMsg('Error de conexión', 'error'); console.error('Activate user error', e); }
                        finally { b.disabled = false; }
                    });
                });

                document.querySelectorAll('.edit-user-btn').forEach(b => {
                    b.addEventListener('click', async () => {
                        editUserId = b.getAttribute('data-id');
                        
                        // Recargar trabajadores asegurando que el trabajador actual NO sea filtrado
                        if (window.loadWorkersForUsers) await window.loadWorkersForUsers();

                        // prefills: name and username (strictly separated)
                        document.getElementById('u-name').value = b.getAttribute('data-name') || '';
                        document.getElementById('u-email').value = b.getAttribute('data-email') || '';
                        document.getElementById('u-username').value = b.getAttribute('data-username') || '';
                        // seleccionar el rol
                        const roleVal = b.getAttribute('data-role') || 'Trabajador';
                        document.getElementById('u-role').value = roleVal;
                        // seleccionar trabajador vinculado
                        const workerId = b.getAttribute('data-worker-id') || '';
                        if (document.getElementById('u-worker')) document.getElementById('u-worker').value = workerId;
                        
                        document.getElementById('u-password').value = '';
                        document.getElementById('u-password-confirm').value = '';
                        
                        formTitle.textContent = 'Editar Usuario';
                        document.getElementById('u-pass-req-star').style.display = 'none';
                        document.getElementById('u-passconf-req-star').style.display = 'none';
                        if (userForm) openSmooth(userForm);
                        validateUserForm(); // Trigger validation to clear/set borders
                    });
                });
            }

            function clearForm() {
                document.getElementById('u-name').value = '';
                document.getElementById('u-email').value = '';
                document.getElementById('u-username').value = '';
                document.getElementById('u-role').value = 'Trabajador';
                document.getElementById('u-password').value = '';
                document.getElementById('u-password-confirm').value = '';
                if (document.getElementById('u-worker')) document.getElementById('u-worker').value = '';
                editUserId = null;
                formTitle.textContent = 'Crear Usuario';
                document.getElementById('u-pass-req-star').style.display = 'inline';
                document.getElementById('u-passconf-req-star').style.display = 'inline';

                // Restaurar campos Nombre y Correo a estado editable
                if (typeof _setWorkerFieldsEditable === 'function') {
                    _setWorkerFieldsEditable(
                        document.getElementById('u-name'),
                        document.getElementById('u-email')
                    );
                }

                if (window.loadWorkersForUsers) window.loadWorkersForUsers();
            }

            async function loadAndRenderUsers() {
                showUsersMsg('Cargando...');
                try {
                    const users = await loadUsers();
                    allUsers = users; // Actualizar cache
                    applyFilters(); // Renderizar aplicando filtros actuales
                } catch (e) {
                    console.error('Error loading users', e);
                    showUsersMsg('Error de conexión', 'error');
                } finally {
                    setTimeout(() => showUsersMsg(''), 3000);
                }
            }

            saveBtn.addEventListener('click', async () => {
                const name = document.getElementById('u-name').value.trim();
                const email = document.getElementById('u-email').value.trim();
                const username = document.getElementById('u-username').value.trim();
                const password = document.getElementById('u-password').value;
                const passwordConfirm = document.getElementById('u-password-confirm').value;
                const role = document.getElementById('u-role').value;

                // Validación en tiempo real: impedir envío si hay errores
                if (typeof validateUserForm === 'function' && !validateUserForm()) { showUsersMsg('Corrige los errores del formulario', 'error'); return; }

                // Require username even when editing (backend expects it)
                if (!name || !email || !username || !role) { showUsersMsg('Completa los campos requeridos', 'error'); return; }
                // For creation, password confirmation is required
                if (!editUserId && (!password || !passwordConfirm)) { showUsersMsg('Completa los campos requeridos (contraseña)', 'error'); return; }

                const emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                if (!emailOK) { showUsersMsg('Correo inválido', 'error'); return; }
                if (password || passwordConfirm) { if (password !== passwordConfirm) { showUsersMsg('Las contraseñas no coinciden', 'error'); return; } }
                if (password) { const failed = [(pw) => pw.length >= 8, (pw) => /[a-z]/.test(pw), (pw) => /[A-Z]/.test(pw), (pw) => /[0-9]/.test(pw), (pw) => /[^a-zA-Z0-9]/.test(pw)].filter(fn => !fn(password)); if (failed.length) { showUsersMsg('Contraseña no cumple requisitos', 'error'); return; } }

                try {
                    const workerVal = document.getElementById('u-worker') ? document.getElementById('u-worker').value : '';

                    // Build payload consistently
                    const payload = { name, email, username, role, Id_Trabajador: workerVal || '' };
                    if (password) payload.password = password;

                    console.log('Saving user', { editUserId, payload });

                    if (editUserId) {
                        // actualizar
                        payload.id = editUserId;
                        const res = await fetch(`/superusuario/users/${editUserId}/update`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content }, body: JSON.stringify(payload) });
                        const text = await res.text();
                        let data;
                        try { data = JSON.parse(text); } catch (parseErr) { data = { error: text } }

                        if (res.ok) { showUsersMsg('Usuario actualizado', 'success'); clearForm(); if (userForm) closeSmooth(userForm); loadWorkersForUsers(); loadAndRenderUsers(); } else { console.error('Update failed', res.status, data); showUsersMsg(data.error || `Error al actualizar (${res.status})`, 'error'); }
                    } else {
                        // crear
                        document.getElementById('u-pass-req-star').style.display = 'inline';
                        document.getElementById('u-passconf-req-star').style.display = 'inline';
                        const res = await fetch('/superusuario/users/store', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content }, body: JSON.stringify(payload) });
                        const text = await res.text();
                        let data;
                        try { data = JSON.parse(text); } catch (parseErr) { data = { error: text } }

                        if (res.ok) { showUsersMsg('Usuario creado', 'success'); clearForm(); if (userForm) closeSmooth(userForm); loadWorkersForUsers(); loadAndRenderUsers(); } else { console.error('Create failed', res.status, data); showUsersMsg(data.error || `Error al crear (${res.status})`, 'error'); }
                    }
                } catch (e) { console.error('Connection error', e); showUsersMsg('Error de conexión: ' + (e && e.message ? e.message : ''), 'error'); }
            });

            loadWorkersForUsers();
            loadAndRenderUsers();
    }


    // --- Módulo de Reportes (SuperUsuario) ---
    async function renderSuperReports() {
        if (!contentDetails) return;
        contentDetails.innerHTML = `
            <div style="display:flex;align-items:center;gap:14px;padding:40px;color:var(--text-muted);">
                <div style="width:28px;height:28px;border:3px solid var(--primary);border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
                <span>Cargando reporte de usuarios...</span>
            </div>`;

        try {
            const res = await fetch('/superusuario/reports/users', {
                cache: 'no-store',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content }
            });
            if (!res.ok) throw new Error(`Error ${res.status}`);
            const data = await res.json();
            const users = data.users || [];
            const generatedAt = data.generated_at ? new Date(data.generated_at).toLocaleString('es-VE') : new Date().toLocaleString('es-VE');

            // ── Stats ──
            const total      = users.length;
            const superUs    = users.filter(u => u.Nombre_rol === 'SuperUsuario').length;
            const admins     = users.filter(u => u.Nombre_rol === 'Administrativo').length;
            const workers    = users.filter(u => u.Nombre_rol === 'Trabajador').length;
            const activos    = users.filter(u => (u.Estado || 'Activo') !== 'Inactivo').length;
            const inactivos  = total - activos;
            const adminGroup = superUs + admins;
            const totalForCalc = adminGroup + workers || 1;
            const pctAdmin   = Math.round((adminGroup / totalForCalc) * 100);
            const pctWorker  = Math.round((workers    / totalForCalc) * 100);

            // ── Cobertura de vinculación ──
            const vinculados    = users.filter(u => u.Id_Trabajador && u.Id_Trabajador !== '').length;
            const sinVincular   = total - vinculados;
            const pctVinculados = total > 0 ? Math.round((vinculados / total) * 100) : 0;

            // ── Seguridad de Cuentas ──
            const conPreguntas   = users.filter(u => u.Tiene_Preguntas).length;
            const sinPreguntas   = total - conPreguntas;
            const pctSeguras     = total > 0 ? Math.round((conPreguntas / total) * 100) : 0;

            // ── Sort state ──
            let sortCol = '';
            let sortDir = 'asc';

            // ── CSV Export ──
            function exportCSV(list) {
                const headers = ['#','Usuario','Nombre Completo','Correo','Rol','Estado','Seguridad','Trabajador Vinculado','Último Acceso'];
                const rows = list.map((u, i) => [
                    i + 1,
                    `"${(u.Nombre_usuario||'').replace(/"/g,'""')}"`,
                    `"${(u.Nombre_completo||'—').replace(/"/g,'""')}"`,
                    `"${(u.Correo||'—').replace(/"/g,'""')}"`,
                    `"${(u.Nombre_rol||'').replace(/"/g,'""')}"`,
                    `"${(u.Estado||'Activo').replace(/"/g,'""')}"`,
                    `"${u.Tiene_Preguntas ? '🔒 Segura' : '⚠️ En riesgo'}"`,
                    `"${(u.Trabajador_Nombre||'—').replace(/"/g,'""')}"`,
                    `"${(u.Ultimo_Acceso||'—').replace(/"/g,'""')}"`,
                ]);
                const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `reporte_usuarios_${new Date().toISOString().slice(0,10)}.csv`;
                a.click();
                URL.revokeObjectURL(a.href);
            }

            // ── Role badge config ──
            const roleConfig = {
                'SuperUsuario':   { bg: 'linear-gradient(135deg,#7c3aed,#4f46e5)', label: 'SuperUsuario' },
                'Administrativo': { bg: 'linear-gradient(135deg,#1e40af,#2563eb)', label: 'Administrativo' },
                'Trabajador':     { bg: 'linear-gradient(135deg,#065f46,#10b981)', label: 'Trabajador' },
            };

            // ── Main render ──
            function renderReportView(filteredUsers, filters = {}) {
                const searchVal = filters.q   || '';
                const roleVal   = filters.rol || '';
                const statusVal = filters.estado || '';
                const securityVal = filters.seguridad || '';
                const fTotal    = filteredUsers.length;

                function arrow(col) {
                    if (sortCol !== col) return '<span style="opacity:0.35;margin-left:3px;font-size:9px;">⇅</span>';
                    return sortDir === 'asc'
                        ? '<span style="margin-left:3px;font-size:9px;">▲</span>'
                        : '<span style="margin-left:3px;font-size:9px;">▼</span>';
                }

                const html = `
                <div style="background:var(--bg-color);min-height:100%;padding:10px;font-family:inherit;">

                    <!-- ── INJECT STYLES ── -->
                    <style>
                        .rep-card { background:var(--card-bg);border-radius:14px;border:1px solid var(--border-color);padding:18px 20px;box-shadow:0 2px 8px rgba(0,0,0,0.05);transition:transform .2s,box-shadow .2s;position:relative;overflow:hidden; }
                        .rep-card:hover { transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,0.09); }
                        .rep-card .icon-bg { position:absolute;right:-10px;top:-10px;width:60px;height:60px;border-radius:50%;opacity:0.08; }
                        .rep-th { padding:13px 14px;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.88);font-weight:700;white-space:nowrap; }
                        .rep-th[data-sort] { cursor:pointer;user-select:none; }
                        .rep-th[data-sort]:hover { color:#fff;background:rgba(255,255,255,0.08); }
                        .rep-td { padding:13px 14px;font-size:12.5px;border-bottom:1px solid var(--border-color); }
                        .rep-tr:last-child .rep-td { border-bottom:none; }
                        .rep-tr { transition:background .12s; }
                        .rep-tr:hover .rep-td { background:color-mix(in srgb,var(--primary) 7%,transparent) !important; }
                        .rep-badge { display:inline-flex;align-items:center;padding:4px 11px;border-radius:20px;font-size:10px;font-weight:700;color:#fff;letter-spacing:0.4px;text-transform:uppercase; }
                        .rep-btn { display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:8px;border:none;cursor:pointer;font-size:12.5px;font-weight:700;transition:opacity .15s,transform .1s; }
                        .rep-btn:hover { opacity:.88;transform:translateY(-1px); }
                        .rep-input { padding:9px 13px;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-color);color:var(--text-main);font-size:13px;outline:none;transition:border-color .2s; }
                        .rep-input:focus { border-color:var(--primary); }
                    </style>

                    <!-- ── HEADER ── -->
                    <div style="display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,var(--primary) 0%,color-mix(in srgb,var(--primary),#000 25%) 100%);padding:18px 26px;border-radius:14px;margin-bottom:18px;box-shadow:0 4px 16px rgba(0,0,0,0.15);position:relative;overflow:hidden;">
                        <div style="position:absolute;right:-20px;top:-20px;width:120px;height:120px;background:rgba(255,255,255,0.06);border-radius:50%;"></div>
                        <div style="position:absolute;right:40px;bottom:-30px;width:80px;height:80px;background:rgba(255,255,255,0.04);border-radius:50%;"></div>
                        <div style="position:relative;">
                            <div style="font-size:22px;font-weight:900;color:#fff;letter-spacing:2px;line-height:1;">LUFRA2020</div>
                            <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:3px;">RIF: J-50032437-5 &nbsp;·&nbsp; Sistema de Gestión de Nómina</div>
                        </div>
                        <div style="text-align:right;position:relative;">
                            <div style="font-size:17px;font-weight:800;color:#fff;text-transform:uppercase;letter-spacing:1.5px;">Reporte de Usuarios</div>
                            <div style="font-size:11px;color:rgba(255,255,255,0.65);margin-top:3px;">Emisión: ${generatedAt}</div>
                        </div>
                    </div>

                    <!-- ── KPI CARDS ── -->
                    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:18px;">

                        <!-- Total Usuarios -->
                        <div class="rep-card">
                            <div style="position:absolute;right:-10px;top:-10px;width:70px;height:70px;background:#6366f1;border-radius:50%;opacity:0.08;"></div>
                            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
                                <div style="width:36px;height:36px;background:linear-gradient(135deg,#6366f1,#4f46e5);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                </div>
                                <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);font-weight:700;">Total Usuarios</div>
                            </div>
                            <div style="font-size:38px;font-weight:900;color:var(--text-main);line-height:1;letter-spacing:-1px;">${total}</div>
                            <div style="font-size:10.5px;color:var(--text-muted);margin-top:5px;">registrados en el sistema</div>
                        </div>

                        <!-- Estado de Cuentas -->
                        <div class="rep-card">
                            <div style="position:absolute;right:-10px;top:-10px;width:70px;height:70px;background:#10b981;border-radius:50%;opacity:0.08;"></div>
                            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
                                <div style="width:36px;height:36px;background:linear-gradient(135deg,#10b981,#059669);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2"><polyline points="20 6 9 17 4 12"/></svg>
                                </div>
                                <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);font-weight:700;">Estado de Cuentas</div>
                            </div>
                            <div style="display:flex;align-items:baseline;gap:6px;">
                                <span style="font-size:38px;font-weight:900;color:#10b981;line-height:1;letter-spacing:-1px;">${activos}</span>
                                <span style="font-size:12px;color:var(--text-muted);">activas</span>
                            </div>
                            <div style="margin-top:6px;display:flex;align-items:center;gap:6px;">
                                <div style="flex:1;height:5px;border-radius:3px;background:var(--bg-color);overflow:hidden;">
                                    <div style="height:100%;width:${total > 0 ? Math.round((activos/total)*100) : 0}%;background:linear-gradient(90deg,#10b981,#34d399);border-radius:3px;transition:width .5s;"></div>
                                </div>
                                <span style="font-size:10px;color:#ef4444;font-weight:600;">${inactivos} inact.</span>
                            </div>
                        </div>

                        <!-- Distribución de Personal -->
                        <div class="rep-card">
                            <div style="position:absolute;right:-10px;top:-10px;width:70px;height:70px;background:#f59e0b;border-radius:50%;opacity:0.08;"></div>
                            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
                                <div style="width:36px;height:36px;background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                </div>
                                <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);font-weight:700;">Distribución de Roles</div>
                            </div>
                            <div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
                                <span style="font-size:11px;color:var(--text-main);background:rgba(99,102,241,0.12);padding:3px 8px;border-radius:20px;font-weight:600;">SU: ${superUs}</span>
                                <span style="font-size:11px;color:var(--text-main);background:rgba(37,99,235,0.12);padding:3px 8px;border-radius:20px;font-weight:600;">Admin: ${admins}</span>
                                <span style="font-size:11px;color:var(--text-main);background:rgba(16,185,129,0.12);padding:3px 8px;border-radius:20px;font-weight:600;">Trab: ${workers}</span>
                            </div>
                            <div style="height:8px;border-radius:4px;overflow:hidden;display:flex;gap:1px;">
                                <div style="background:linear-gradient(90deg,#7c3aed,#4f46e5);width:${total>0?Math.round((superUs/total)*100):0}%;transition:width .5s;border-radius:4px 0 0 4px;" title="SuperUsuarios: ${superUs}"></div>
                                <div style="background:linear-gradient(90deg,#1e40af,#2563eb);width:${total>0?Math.round((admins/total)*100):0}%;transition:width .5s;" title="Administrativos: ${admins}"></div>
                                <div style="background:linear-gradient(90deg,#065f46,#10b981);flex:1;transition:width .5s;border-radius:0 4px 4px 0;" title="Trabajadores: ${workers}"></div>
                            </div>
                            <div style="font-size:9.5px;color:var(--text-muted);margin-top:4px;">Morado: SU | Azul: Admin | Verde: Trab.</div>
                        </div>

                        <!-- Cobertura de Vinculación -->
                        <div class="rep-card">
                            <div style="position:absolute;right:-10px;top:-10px;width:70px;height:70px;background:#0ea5e9;border-radius:50%;opacity:0.08;"></div>
                            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
                                <div style="width:36px;height:36px;background:linear-gradient(135deg,#0ea5e9,#0369a1);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                                </div>
                                <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);font-weight:700;">Cobertura de Vinculación</div>
                            </div>
                            <div style="display:flex;align-items:baseline;gap:6px;">
                                <span style="font-size:38px;font-weight:900;color:#0ea5e9;line-height:1;letter-spacing:-1px;">${pctVinculados}<span style="font-size:16px;">%</span></span>
                            </div>
                            <div style="margin-top:6px;display:flex;align-items:center;gap:6px;">
                                <div style="flex:1;height:5px;border-radius:3px;background:var(--bg-color);overflow:hidden;">
                                    <div style="height:100%;width:${pctVinculados}%;background:linear-gradient(90deg,#0ea5e9,#38bdf8);border-radius:3px;transition:width .5s;"></div>
                                </div>
                            </div>
                            <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">
                                <span style="color:#10b981;font-weight:700;">${vinculados} vinculados</span>
                                &nbsp;·&nbsp;
                                <span style="color:${sinVincular > 0 ? '#f59e0b' : 'var(--text-muted)'};font-weight:${sinVincular > 0 ? '700' : '400'};">${sinVincular} sin vincular</span>
                            </div>
                        </div>

                        <!-- Seguridad de Cuentas -->
                        <div class="rep-card">
                            <div style="position:absolute;right:-10px;top:-10px;width:70px;height:70px;background:#f59e0b;border-radius:50%;opacity:0.08;"></div>
                            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
                                <div style="width:36px;height:36px;background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                </div>
                                <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);font-weight:700;">Seguridad de Cuentas</div>
                            </div>
                            <div style="display:flex;align-items:baseline;gap:6px;">
                                <span style="font-size:38px;font-weight:900;color:#f59e0b;line-height:1;letter-spacing:-1px;">${pctSeguras}<span style="font-size:16px;">%</span></span>
                            </div>
                            <div style="margin-top:6px;display:flex;align-items:center;gap:6px;">
                                <div style="flex:1;height:5px;border-radius:3px;background:var(--bg-color);overflow:hidden;">
                                    <div style="height:100%;width:${pctSeguras}%;background:linear-gradient(90deg,#f59e0b,#fbbf24);border-radius:3px;transition:width .5s;"></div>
                                </div>
                            </div>
                            <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">
                                <span style="color:#10b981;font-weight:700;">${conPreguntas} seguras</span>
                                &nbsp;·&nbsp;
                                <span style="color:${sinPreguntas > 0 ? '#ef4444' : 'var(--text-muted)'};font-weight:${sinPreguntas > 0 ? '700' : '400'};">${sinPreguntas} en riesgo</span>
                            </div>
                        </div>
                    </div>

                    <!-- ── TOOLBAR ── -->
                    <div style="background:var(--card-bg);padding:14px 18px;border-radius:12px;border:1px solid var(--border-color);margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;box-shadow:0 1px 4px rgba(0,0,0,0.04);">
                        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
                            <div style="position:relative;">
                                <svg style="position:absolute;left:10px;top:50%;transform:translateY(-50%);pointer-events:none;" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                <input id="rep-search" type="text" value="${searchVal}" placeholder="Buscar usuario, correo..."
                                    class="rep-input" style="padding-left:32px;min-width:195px;">
                            </div>
                            <select id="rep-role" class="rep-input" style="cursor:pointer;">
                                <option value="">Todos los roles</option>
                                <option value="SuperUsuario"  ${roleVal==='SuperUsuario'  ? 'selected':''}>SuperUsuario</option>
                                <option value="Administrativo" ${roleVal==='Administrativo' ? 'selected':''}>Administrativo</option>
                                <option value="Trabajador"    ${roleVal==='Trabajador'    ? 'selected':''}>Trabajador</option>
                            </select>
                            <select id="rep-status" class="rep-input" style="cursor:pointer;">
                                <option value="">Todos los estados</option>
                                <option value="Activo"   ${statusVal==='Activo'   ? 'selected':''}>Activo</option>
                                <option value="Inactivo" ${statusVal==='Inactivo' ? 'selected':''}>Inactivo</option>
                            </select>
                            <select id="rep-security" class="rep-input" style="cursor:pointer;">
                                <option value="">Seguridad: Todas</option>
                                <option value="segura" ${securityVal==='segura' ? 'selected':''}>🔒 Cuentas Seguras</option>
                                <option value="riesgo" ${securityVal==='riesgo' ? 'selected':''}>⚠️ Cuentas en Riesgo</option>
                            </select>
                            <button id="rep-filter-btn" class="rep-btn" style="background:var(--primary);color:#fff;">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                                Filtrar
                            </button>
                            <button id="rep-clear-btn" class="rep-btn" style="background:var(--bg-color);color:var(--text-muted);border:1px solid var(--border-color);">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                Limpiar
                            </button>
                        </div>
                        <div style="display:flex;gap:8px;align-items:center;">
                            <span id="rep-count" style="font-size:11.5px;color:var(--text-muted);white-space:nowrap;background:var(--bg-color);padding:5px 10px;border-radius:20px;border:1px solid var(--border-color);">
                                ${fTotal === total
                                    ? `<strong>${total}</strong> usuario(s)`
                                    : `<strong style="color:var(--primary);">${fTotal}</strong> de ${total}`}
                            </span>
                            <button id="rep-csv-btn" class="rep-btn" title="Exportar a CSV/Excel" style="background:linear-gradient(135deg,#10b981,#059669);color:#fff;">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                CSV
                            </button>
                            <button id="rep-print-btn" class="rep-btn" style="background:linear-gradient(135deg,var(--primary),color-mix(in srgb,var(--primary),#000 20%));color:#fff;">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                                PDF
                            </button>
                        </div>
                    </div>

                    <!-- ── TABLE ── -->
                    <div style="background:var(--card-bg);border-radius:14px;overflow:hidden;border:1px solid var(--border-color);box-shadow:0 2px 10px rgba(0,0,0,0.05);">
                        <table style="width:100%;border-collapse:collapse;">
                            <thead>
                                <tr style="background:linear-gradient(90deg,var(--primary) 0%,color-mix(in srgb,var(--primary),#000 18%) 100%);">
                                    <th class="rep-th" style="width:38px;">#</th>
                                    <th class="rep-th" data-sort="Nombre_usuario">Usuario ${arrow('Nombre_usuario')}</th>
                                    <th class="rep-th" data-sort="Nombre_completo">Nombre Completo ${arrow('Nombre_completo')}</th>
                                    <th class="rep-th" data-sort="Correo">Correo ${arrow('Correo')}</th>
                                    <th class="rep-th" data-sort="Nombre_rol">Rol ${arrow('Nombre_rol')}</th>
                                    <th class="rep-th" data-sort="Estado">Estado ${arrow('Estado')}</th>
                                    <th class="rep-th" data-sort="Tiene_Preguntas">Seguridad ${arrow('Tiene_Preguntas')}</th>
                                    <th class="rep-th">Trabajador Vinculado</th>
                                    <th class="rep-th" data-sort="Ultimo_Acceso">Último Acceso ${arrow('Ultimo_Acceso')}</th>
                                </tr>
                            </thead>
                            <tbody id="rep-tbody">
                                ${renderRows(filteredUsers)}
                            </tbody>
                            <tfoot>
                                <tr style="background:var(--bg-color);border-top:2px solid var(--border-color);">
                                    <td colspan="5" class="rep-td" style="font-size:11px;color:var(--text-muted);font-weight:600;border-bottom:none;">
                                        Mostrando <strong style="color:var(--text-main);">${fTotal}</strong>${fTotal !== total ? ` de <strong style="color:var(--text-main);">${total}</strong>` : ''} usuario(s)
                                        &nbsp;·&nbsp; Activos: <strong style="color:#10b981;">${filteredUsers.filter(u=>(u.Estado||'Activo')!=='Inactivo').length}</strong>
                                        &nbsp;·&nbsp; Inactivos: <strong style="color:#ef4444;">${filteredUsers.filter(u=>u.Estado==='Inactivo').length}</strong>
                                        &nbsp;·&nbsp; Seguros: <strong style="color:#f59e0b;">${filteredUsers.filter(u=>u.Tiene_Preguntas).length}</strong>
                                    </td>
                                    <td colspan="4" class="rep-td" style="font-size:11px;color:var(--text-muted);text-align:right;border-bottom:none;">
                                        Generado: ${generatedAt}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>`;

                contentDetails.innerHTML = html;

                // ── Event bindings ──
                function applyFilter() {
                    const q  = (document.getElementById('rep-search')?.value || '').toLowerCase();
                    const r  = document.getElementById('rep-role')?.value   || '';
                    const s  = document.getElementById('rep-status')?.value || '';
                    const sec = document.getElementById('rep-security')?.value || '';
                    let list = users.filter(u => {
                        const matchQ = (u.Nombre_usuario||'').toLowerCase().includes(q)
                            || (u.Correo||'').toLowerCase().includes(q)
                            || (u.Nombre_completo||'').toLowerCase().includes(q)
                            || (u.Trabajador_Nombre||'').toLowerCase().includes(q);
                        const matchR = r ? u.Nombre_rol === r : true;
                        const matchS = s ? u.Estado === s : true;
                        const matchSec = sec ? (sec === 'segura' ? u.Tiene_Preguntas : !u.Tiene_Preguntas) : true;
                        return matchQ && matchR && matchS && matchSec;
                    });
                    if (sortCol) {
                        list = [...list].sort((a, b) => {
                            let va = a[sortCol];
                            let vb = b[sortCol];
                            if (typeof va === 'boolean') {
                                return sortDir === 'asc' ? (va === vb ? 0 : va ? 1 : -1) : (va === vb ? 0 : va ? -1 : 1);
                            }
                            va = (va || '').toString().toLowerCase();
                            vb = (vb || '').toString().toLowerCase();
                            return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
                        });
                    }
                    renderReportView(list, { q, rol: r, estado: s, seguridad: sec });
                }

                document.getElementById('rep-filter-btn')?.addEventListener('click', applyFilter);
                document.getElementById('rep-search')?.addEventListener('keyup', e => { if (e.key === 'Enter') applyFilter(); });
                document.getElementById('rep-search')?.addEventListener('input', applyFilter);
                document.getElementById('rep-security')?.addEventListener('change', applyFilter);
                document.getElementById('rep-role')?.addEventListener('change', applyFilter);
                document.getElementById('rep-status')?.addEventListener('change', applyFilter);

                document.getElementById('rep-clear-btn')?.addEventListener('click', () => {
                    sortCol = ''; sortDir = 'asc';
                    renderReportView(users);
                });

                document.getElementById('rep-csv-btn')?.addEventListener('click', () => exportCSV(filteredUsers));

                document.getElementById('rep-print-btn')?.addEventListener('click', () => {
                    const q      = document.getElementById('rep-search')?.value || '';
                    const rol    = document.getElementById('rep-role')?.value   || '';
                    const estado = document.getElementById('rep-status')?.value || '';
                    const seguridad = document.getElementById('rep-security')?.value || '';
                    window.open(`/superusuario/admin/users?print=true&q=${encodeURIComponent(q)}&rol=${encodeURIComponent(rol)}&estado=${encodeURIComponent(estado)}&seguridad=${encodeURIComponent(seguridad)}`, '_blank');
                });

                document.querySelectorAll('th[data-sort]').forEach(th => {
                    th.addEventListener('click', () => {
                        const col = th.getAttribute('data-sort');
                        sortDir = (sortCol === col && sortDir === 'asc') ? 'desc' : 'asc';
                        sortCol = col;
                        applyFilter();
                    });
                });
            }

            // ── Row builder ──
            function renderRows(list) {
                if (list.length === 0) {
                    return `<tr><td colspan="9" class="rep-td" style="padding:32px;text-align:center;color:var(--text-muted);font-size:13px;border-bottom:none;">
                        <div style="font-size:32px;margin-bottom:8px;">🔍</div>
                        No se encontraron usuarios con los filtros aplicados.
                    </td></tr>`;
                }
                return list.map((u, idx) => {
                    const r   = u.Nombre_rol || '';
                    const cfg = roleConfig[r] || { bg: 'linear-gradient(135deg,#374151,#6b7280)', label: r };

                    const estado      = u.Estado || 'Activo';
                    const isInactive  = estado === 'Inactivo';
                    const ultimoAcceso= u.Ultimo_Acceso
                        ? `<span style="font-family:monospace;font-size:11px;">${u.Ultimo_Acceso}</span>`
                        : `<span style="color:var(--text-muted);font-style:italic;font-size:11px;">Sin registro</span>`;
                    const correo = u.Correo
                        ? `<span style="font-size:12px;">${u.Correo}</span>`
                        : `<span style="color:var(--text-muted);">—</span>`;
                    const nombreCompleto = (u.Nombre_completo && u.Nombre_completo !== u.Nombre_usuario)
                        ? `<span style="font-size:12.5px;">${u.Nombre_completo}</span>`
                        : `<span style="color:var(--text-muted);">—</span>`;
                    const tieneVinculo = u.Id_Trabajador && u.Id_Trabajador !== '';
                    const vinculado = tieneVinculo
                        ? `<div style="display:flex;align-items:center;gap:5px;">
                               <span style="width:6px;height:6px;background:#10b981;border-radius:50%;flex-shrink:0;"></span>
                               <span style="font-size:11.5px;color:var(--text-main);">${u.Trabajador_Nombre || '—'}</span>
                           </div>`
                        : `<div style="display:flex;align-items:center;gap:5px;">
                               <span style="width:6px;height:6px;background:#d1d5db;border-radius:50%;flex-shrink:0;"></span>
                               <span style="font-size:11px;color:var(--text-muted);font-style:italic;">No vinculado</span>
                           </div>`;

                    const tienePreguntas = u.Tiene_Preguntas;
                    const seguridad = tienePreguntas
                        ? `<div style="display:flex;align-items:center;gap:5px;">
                               <span style="width:6px;height:6px;background:#10b981;border-radius:50%;flex-shrink:0;box-shadow:0 0 4px #10b981;"></span>
                               <span style="font-size:11.5px;color:#10b981;font-weight:700;">🔒 Segura</span>
                           </div>`
                        : `<div style="display:flex;align-items:center;gap:5px;">
                               <span style="width:6px;height:6px;background:#ef4444;border-radius:50%;flex-shrink:0;box-shadow:0 0 4px #ef4444;"></span>
                               <span style="font-size:11.5px;color:#ef4444;font-weight:700;" title="No ha configurado preguntas de seguridad">⚠️ En riesgo</span>
                           </div>`;

                    const rowBg = idx % 2 === 0
                        ? 'var(--card-bg)'
                        : 'color-mix(in srgb,var(--card-bg),var(--bg-color) 55%)';

                    return `
                        <tr class="rep-tr" style="background:${rowBg};">
                            <td class="rep-td" style="color:var(--text-muted);font-size:11.5px;text-align:center;width:38px;">${idx + 1}</td>
                            <td class="rep-td">
                                <div style="display:flex;align-items:center;gap:8px;">
                                    <div style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--primary),color-mix(in srgb,var(--primary),#fff 30%));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;flex-shrink:0;text-transform:uppercase;">
                                        ${(u.Nombre_usuario||'?').charAt(0)}
                                    </div>
                                    <strong style="font-size:13px;color:var(--text-main);">${u.Nombre_usuario}</strong>
                                </div>
                            </td>
                            <td class="rep-td" style="color:var(--text-main);">${nombreCompleto}</td>
                            <td class="rep-td" style="color:var(--text-muted);">${correo}</td>
                            <td class="rep-td">
                                <span class="rep-badge" style="background:${cfg.bg};">${cfg.label}</span>
                            </td>
                            <td class="rep-td">
                                <div style="display:flex;align-items:center;gap:5px;">
                                    <span style="width:7px;height:7px;border-radius:50%;background:${isInactive ? '#ef4444' : '#10b981'};flex-shrink:0;${isInactive ? '' : 'box-shadow:0 0 5px #10b981;'}"></span>
                                    <span style="font-size:12px;font-weight:700;color:${isInactive ? '#ef4444' : '#10b981'};">${estado}</span>
                                </div>
                            </td>
                            <td class="rep-td">${seguridad}</td>
                            <td class="rep-td">${vinculado}</td>
                            <td class="rep-td">${ultimoAcceso}</td>
                        </tr>`;
                }).join('');
            }

            // Initial render
            renderReportView(users);

        } catch (e) {
            contentDetails.innerHTML = `
                <div style="padding:40px;text-align:center;">
                    <div style="font-size:40px;margin-bottom:12px;">⚠️</div>
                    <p style="color:#ef4444;font-weight:700;font-size:15px;">Error al cargar el reporte</p>
                    <p style="color:var(--text-muted);font-size:13px;margin-top:4px;">${e.message}</p>
                    <button onclick="renderSuperReports()" style="margin-top:16px;background:var(--primary);color:white;padding:10px 22px;border-radius:8px;border:none;cursor:pointer;font-weight:700;font-size:13px;">↺ Reintentar</button>
                </div>`;
        }
    }




    // Mostrar usuario y logout
    const auth = sessionUser || {};
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay && auth) usernameDisplay.textContent = auth.username || auth.role || '';
    const logoutBtn = document.getElementById('logout-btn');
    const logoutForm = document.querySelector('form[action$="logout"]');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    if (logoutForm) logoutForm.addEventListener('submit', logout);

    // Cargar vista según rol autenticado (fallback administrativo)
    if (typeof loadRoleView === 'function') {
        loadRoleView((auth && auth.role) ? auth.role : 'Administrativo');
    } else {
        // Si la función aún no está disponible, será invocada cuando se inicialice la interfaz (initPayrollPage)
        console.warn('loadRoleView no está disponible todavía; se inicializará con initPayrollPage');
    }
}

// Función para mostrar modal de vacaciones al iniciar sesión
async function showVacationModal() {
    try {
        const response = await fetch('/trabajador/vacations-data', {
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();

        if (!response.ok || !data.fechaIngreso) return;

        // Reiniciar estado si la fecha de ingreso cambió (Login Global)
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

        const hireDate = new Date(data.fechaIngreso);
        const today = new Date();
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        const isOneYearOld = hireDate <= oneYearAgo;
        const hasPendingOrApproved = data.lastRequest && ['Pendiente', 'Aceptada'].includes(data.lastRequest.Estado);
        const alreadySubmitted = localStorage.getItem('vacationRequestSent') === 'true';
        const isDismissed = localStorage.getItem('vacationNoticeDismissed') === 'true';

        if (isOneYearOld && !hasPendingOrApproved && !alreadySubmitted && !isDismissed) {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;';
            modal.innerHTML = `
                <div class="modal-content" style="background: var(--bg-color); color: var(--text-main); padding: 20px; border-radius: 8px; max-width: 400px; width: 90%; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                    <h3 style="margin-top: 0; color: var(--text-main);">¡Atención!</h3>
                    <p>Ya ha pasado 1 año desde tu fecha de ingreso. Puedes realizar una solicitud de vacaciones.</p>
                    <label style="display: block; margin: 10px 0;">
                        <input type="checkbox" id="dismiss-checkbox" style="margin-right: 8px;"> No mostrar de nuevo
                    </label>
                    <button id="accept-btn" class="primary" style="width: 100%; padding: 10px; margin-top: 15px;">Aceptar</button>
                </div>
            `;
            document.body.appendChild(modal);

            document.getElementById('accept-btn').addEventListener('click', () => {
                const checked = document.getElementById('dismiss-checkbox').checked;
                if (checked) {
                    localStorage.setItem('vacationNoticeDismissed', 'true');
                }
                modal.remove();
            });
        }
    } catch (error) {
        console.error('Error showing vacation modal:', error);
    }
}

function initLoginPage() {
    // Corregir enlace de estilos si es necesario (login.html may use styles.css)
    const form = document.getElementById('loginForm') || document.getElementById('login-form') || document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const userInput = document.getElementById('username');
        const passInput = document.getElementById('password');
        const username = userInput ? userInput.value.trim() : 'demo';
        const password = passInput ? passInput.value : '';

        // Cuenta demo: admin/admin -> rol Administrativo
        if ((username === 'admin' && password === 'admin') || (username === 'demo' && password === 'demo')) {
            setAuth({ username: username, role: 'Administrativo', logged: true });
            // mostrar éxito si existe
            const successCard = document.getElementById('successCard');
            if (successCard) { successCard.style.display = ''; }
            // redirigir
            window.location.href = 'index.php';
            return;
        }

        // Autenticación simple local: cualquier usuario con contraseña no vacía será trabajador
        if (username && password.length > 0) {
            setAuth({ username: username, role: 'Trabajador', logged: true });
            window.location.href = 'index.php';
            return;
        }

        const message = document.getElementById('message') || document.getElementById('regMessage');
        if (message) message.textContent = 'Usuario o contraseña inválidos.';
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const pathname = window.location.pathname.toLowerCase();

    // Si estamos en login page -> inicializar login
    if (document.getElementById('loginForm') || pathname.endsWith('login.php')) {
        initLoginPage();
        return;
    }

    // Comprobar sesión en el backend
    const auth = await checkSessionAsync();
    sessionUser = auth;
    // Depuración ligera: muestra lo que devolvió el servidor
    console.debug('checkSession:', auth);

    // Si estamos en Index (o en cualquier otra página del sistema) -> verificar auth
    if (document.getElementById('content-header') || pathname.endsWith('index.php')) {
        if (!auth) {
            // No autenticado -> dejar que Laravel maneje el redirect si el middleware falla
            console.warn('Usuario no autenticado detectado por JS');
            return;
        }
        // inicializar interfaz administrativa
        initPayrollPage();

        // Solo una llamada al modal al cargar la página
        if (auth && auth.role === 'Trabajador') {
            showVacationModal();
        }
    }
});

// Asegurar que al usar el botón "Atrás" o al restaurar desde bfcache también se verifique la sesión
async function ensureAuthOnShow(event) {
    // Evitar verificación si ya estamos en el login (previene bucle de redirección)
    if (document.getElementById('loginForm') || window.location.pathname.toLowerCase().includes('login.php')) return;

    const a = await checkSessionAsync();
    if (!a) {
        // En Laravel, si la sesión expira, la siguiente recarga o fetch fallará y el middleware redirigirá.
        // Desactivamos la redirección manual a Login.php para evitar 404.
        console.warn('Sesión expirada detectada en popstate/pageshow');
    }
}
window.addEventListener('pageshow', ensureAuthOnShow);
window.addEventListener('popstate', ensureAuthOnShow);

// --- SISTEMA DE AYUDA GLOBAL DENTRO DE CADA MÓDULO Y CAMPO ---
(function() {
    const HELP_DICTIONARY = {
        "nombres": "Escriba los nombres completos del trabajador. Debe contener únicamente letras de la A a la Z, espacios y acentos.",
        "apellidos": "Escriba los apellidos completos del trabajador. Debe contener únicamente letras de la A a la Z, espacios y acentos.",
        "documento de identidad": "Introduzca la Cédula de Identidad única del trabajador en formato nacional. Ejemplo: V-12345678.",
        "fecha de nacimiento": "Seleccione la fecha de nacimiento del trabajador para validar su mayoría de edad y registros legales.",
        "género": "Indique el género biológico del trabajador para fines de clasificación y reportes.",
        "estado civil": "Seleccione la situación civil del trabajador (soltero, casado, etc.) requerida para beneficios contractuales.",
        "correo electrónico": "Correo corporativo del trabajador. Indique la dirección asignada por la compañía o, si no dispone de una propia, use su correo personal.",
        "teléfono móvil": "Número telefónico principal del trabajador para contacto directo, en caso de no poseer uno propio agregar el de algún familiar cercano para emergencias.",
        "dirección": "Indique la dirección exacta y completa de domicilio del trabajador para registros de personal.",
        "cargo": "Seleccione el cargo o rol administrativo que desempeñará el trabajador en la empresa.",
        "nivel educativo": "Seleccione el grado académico más alto que posea y haya certificado el trabajador.",
        "fecha de ingreso": "Seleccione la fecha formal de inicio de labores del trabajador. Esta fecha determina su antigüedad laboral.",
        "tipo de nómina": "Frecuencia de pago asociada al contrato del trabajador (Semanal o Quincenal).",
        "tipo": "Seleccionar si será asignación, deducción o bonificación.",
        "estado": "Indique si el trabajador está Activo o Inactivo en el sistema. No se refiere al estado civil.",
        "observaciones": "Campo opcional para escribir notas de interés, observaciones médicas, contractuales o detalles especiales sobre el trabajador.",
        "seleccionar trabajador": "Seleccione de la lista al trabajador que va a procesar. Solo se muestran trabajadores activos.",
        "trabajador asignado": "Seleccione el trabajador que utilizará este usuario. Este campo vincula el usuario al registro laboral correspondiente.",
        "salario mensual (bs.)": "Monto acordado mensual del trabajador. El sistema lo utilizará para calcular el salario diario promedio (mínimo Bs. 130.00).",
        "salario base (bs.)": "Monto de sueldo base mensual a partir del cual se calculan los conceptos salariales.",
        "año de pago": "Seleccione el año de período vacacional devengado y no pagado que se liquidará en esta transacción.",
        "año de nómina": "El año calendario al que pertenece el período de pago de la nómina.",
        "días de vacaciones": "Días calculados acumulados por antigüedad para el disfrute de vacaciones (mínimo 15 días + 1 día por cada año adicional, máx. 30).",
        "días de bono vacacional": "Cantidad de días del bono vacacional de ley a cancelar al trabajador (equivalente a los días de vacaciones ganados).",
        "fecha de pago": "Seleccione la fecha en que se procesará y hará efectivo el pago del recibo de nómina.",
        "período de nómina": "Seleccione que semana o quincena del año se usará para calcular las fechas automáticamente.",
        "desde:": "Fecha inicial que abarca el cálculo de los días trabajados en esta nómina.",
        "hasta:": "Fecha final de corte que abarca el cálculo de los días trabajados en esta nómina.",
        "seleccionar concepto": "Seleccione los conceptos que desea aplicar (Asignación y bonificación para sumas y Deducción para restas).",
        "cantidad": "Multiplicador de unidades auxiliares a aplicar al concepto.",
        "monto sugerido (bs.)": "Valor sugerido en Bolívares para este concepto, editable según sea necesario.",
        "código de referencia": "Abreviatura única de contabilidad para identificar este concepto en fórmulas de nómina.",
        "nombre del concepto": "Nombre descriptivo que aparecerá impreso en el desglose del recibo de pago.",
        "tipo": "Determine si el concepto suma al neto del trabajador (Asignación), resta (Deducción) o es especial (Bonificación).",
        "nombre del cargo": "Denominación técnica oficial del cargo en la empresa. Ejemplo: Analista de Sistemas.",
        "área administrativa": "Seleccione o escriba el departamento o división de la empresa al que pertenece el cargo.",
        "buscar": "Escriba texto libre (cédula, nombres, período) para realizar búsquedas instantáneas en la tabla inferior.",
        "año pagado": "Filtre los registros mostrando únicamente los pagos correspondientes al año vacacional seleccionado.",
        "fecha de registro": "Filtre el historial por la fecha exacta en la que se grabaron las transacciones en el sistema.",
        "estatus": "Seleccione el estado actual de los recibos (Pendiente de cobro, Publicado al empleado, Anulado).",
        "ordenar por:": "Permite reorganizar el listado en base a columnas específicas para mejor visualización.",
        "ordenar:": "Reorganice la lista de cargos de forma ascendente o descendente.",
        "nombre de usuario": "Introduzca su nombre de usuario tal como fue registrado en el sistema. Distingue entre mayúsculas y minúsculas.",
        "contraseña": "Clave secreta de acceso. Debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y un símbolo especial.",
        "nueva contraseña": "Establezca su nueva clave de acceso con mínimo 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial.",
        "confirmar contraseña": "Repita exactamente la nueva contraseña para confirmar que no hubo errores de escritura.",
        "tipo de permiso": "Seleccione la categoría del permiso solicitado: Personal, Médico, Académico u otro tipo reconocido por la empresa.",
        "fecha de inicio": "Seleccione el primer día del período de permiso o ausencia solicitado.",
        "fecha de fin": "Seleccione el último día de la ausencia. El sistema calculará automáticamente el total de días hábiles.",
        "motivo": "Describa de forma clara y concisa el motivo de la solicitud. Esta información la revisará el administrador.",
        "descripción": "Proporcione detalles adicionales que justifiquen o complementen la solicitud enviada.",
        "rol": "Asigne el nivel de acceso del usuario: Trabajador (consultas), Administrativo (nómina) o SuperUsuario (configuración total).",
        "filtrar por año": "Restrinja el historial para mostrar únicamente los recibos correspondientes al año seleccionado.",
        "filtrar por estatus": "Muestre solo los registros que coincidan con el estado de pago indicado (Pendiente, Publicado o Anulado).",
        "período vacacional": "Seleccione el año de período vacacional a liquidar. Solo aparecen períodos pendientes de pago.",
        "fecha de emisión": "Fecha oficial de emisión del documento o recibo. El sistema la establece automáticamente al procesar.",
        "salario diario": "Valor calculado automáticamente dividiendo el salario mensual entre 30 días. Base para conceptos diarios.",
        "total asignaciones": "Suma de todos los conceptos de tipo Asignación o Bonificación incluidos en este período de nómina.",
        "total deducciones": "Suma de todos los descuentos aplicados al salario bruto del trabajador en este período.",
        "neto a pagar": "Monto final que recibirá el trabajador: Total Asignaciones menos Total Deducciones.",
        "buscar trabajador": "Filtre la lista escribiendo nombre, cédula o cargo para localizar rápidamente al empleado deseado.",
        "filtrar por estado": "Filtre la tabla mostrando solo trabajadores Activos, Inactivos o todos simultáneamente.",
        "razón de rechazo": "Especifique el motivo oficial por el cual se rechaza la solicitud de permiso o vacaciones del trabajador."
    };

    const HELP_FIELD_OVERRIDES = {
        "u-username": "Ingresar nombre de usuario que utilizará el trabajador.",
        "u-name": "Ingresar nombre real del trabajador al cuál se asignará el usuario.",
        "u-worker": "Seleccione al trabajador que utilizará este usuario, (solo se pueden escoger trabajadores que aún no posean uno). En caso de obviarse este campo el usuario no contendrá datos personales ni será tomado en cuenta para procesos de nómina.",
        "u-email": "Correo corporativo del trabajador. Indique la dirección asignada por la compañía o, si no dispone de una propia, use su correo personal.",
        "w-correo": "Ingresar correo de uso personal del trabajador, en caso de no poseer puede obviarse este campo.",
        "w-estado": "Seleccionar si el trabajador se encontrará activo (podrá ser tomado en cuenta para procesos de nómina) o inactivo (No existe una relación laboral confirmada con este trabajador)."
    };

    const MODULE_FIELD_HELP_OVERRIDES = {
        "mi perfil": {
            "correo electrónico": "Correo electrónico de uso personal.",
            "cargo asignado": "Cargo que posee actualmente.",
            "fecha de ingreso": "Fecha exacta del inicio de sus operaciones en la empresa.",
            "dirección de habitación": "Dirección en dónde habita actualmente.",
            "teléfono": "Teléfono de uso personal o de emergencia.",
            "cédula de identidad": "Documento de identidad único y personal."
        },
        "panel de vacaciones": {
            "fecha de ingreso": "Fecha de inicio de la relación laboral, debe ser superior a un año.",
            "fecha_ingreso": "Fecha de inicio de la relación laboral, debe ser superior a un año."
        },
        "solicitud de vacaciones": {
            "fecha de ingreso": "Fecha de inicio de la relación laboral, debe ser superior a un año.",
            "fecha_ingreso": "Fecha de inicio de la relación laboral, debe ser superior a un año."
        },
        "pago de vacaciones": {
            "fecha de ingreso": "Fecha de inicio de la relación laboral, debe ser superior a un año.",
            "fecha_ingreso": "Fecha de inicio de la relación laboral, debe ser superior a un año."
        }
    };

    const MODULE_HELP_DICTIONARY = {
        "Registro de Trabajadores": {
            title: "Ayuda: Registro de Trabajadores",
            intro: "Administre el ciclo de vida del personal de la empresa. Registre nuevos trabajadores, actualice sus datos y gestione su estado laboral.",
            steps: [
                "**Registrar Nuevo Trabajador**: Haga clic en 'Registrar Nuevo Trabajador' y complete los datos biográficos (nombres, cédula, fecha de nacimiento), académicos (nivel educativo) y contractuales (cargo, tipo de nómina, fecha de ingreso).",
                "**Editar Datos**: Haga clic en editar para abrir el formulario de edición y actualizar cualquier campo del trabajador.",
                "**Activar / Desactivar**: Use el botón de estado para activar o desactivar un trabajador. Los inactivos no aparecen en los selectores de nómina y vacaciones."
            ]
        },
        "Gestionar Personal": {
            title: "Ayuda: Gestión de Personal",
            intro: "Este módulo le permite administrar el ciclo de vida del talento humano en la organización de forma segura y estructurada.",
            steps: [
                "**Registrar Personal**: Haga clic en 'Registrar Nuevo Trabajador' para abrir el formulario y complete minuciosamente la ficha biográfica, académica y contractual del empleado.",
                "**Editar y Actualizar**: Utilice la acción 'Editar' para corregir información preexistente o registrar ascensos y cambios de nómina.",
                "**Desactivar/Activar**: Utilice el botón correspondiente para gestionar el estado del trabajador; al desactivarse, sus pagos automáticos de nómina se suspenderán."
            ]
        },
        "Panel de Vacaciones": {
            title: "Ayuda: Panel de Vacaciones (Administrador)",
            intro: "Gestione el descanso legal de su plantilla laboral de manera controlada y precisa en base a la antigüedad y la ley vigente.",
            steps: [
                "**Solicitudes Recibidas**: En la pestaña 'Solicitudes' puede auditar las peticiones de los trabajadores, aprobándolas, rechazándolas con motivo de rechazo o revirtiendo decisiones.",
                "**Procesar Pagos**: En la pestaña 'Pagos', presione 'Crear Nuevo Pago de Vacaciones', seleccione un trabajador y un año pendiente. El sistema autocalculará sus días correspondientes de vacaciones y su bono vacacional.",
                "**Control de Historial**: En el historial inferior puede 'Publicar' recibos de pago (haciéndolos visibles al empleado), 'Anular' recibos inválidos, o 'Revertir' a pendiente los procesados hace menos de 24 horas."
            ]
        },
        "Pago de Nómina": {
            title: "Ayuda: Pago de Nómina",
            intro: "Prepare, calcule y registre los pagos de nómina semanales o quincenales del personal activo de la empresa.",
            steps: [
                "**Seleccionar Tipo de nómina**: Especifique que tipo de nómina desea procesar (Sólo semanal, sólo mensual o todos).",
                "**Seleccionar Trabajador**: Elija el trabajador activo desde el selector superior. Solo aparecen empleados activos con nómina configurada.",
                "**Configurar Período**: Seleccione el periodo que desea pagar entre los disponibles para cada trabajador (Dicho periodo determinará la fecha de inicio y fecha fin).",
                "**Agregar Conceptos**: Busque y añada asignaciones (Días trabajados o bonos) y deducciones (Días no laborados, etc). Ingrese la cantidad de unidades auxiliares para cada uno.",
                "**Resumen de Nómina**: Revise el total de asignaciones, deducciones y neto a pagar antes de confirmar. El cálculo es en tiempo real.",
                "**Confirmar Pago**: Presione 'Confirmar y procesar pago'. El recibo quedará en estado 'Pendiente' en el historial y podrá ser publicado o anulado luego.",
                "**Historial**: En la pestaña 'Ver recibos' puede buscar, filtrar, publicar, anular o revertir recibos. Use la selección múltiple para acciones masivas."
            ]
        },
        "Panel de Permisos": {
            title: "Ayuda: Panel de Permisos (Administrador)",
            intro: "Revise y resuelva las solicitudes de permisos laborales del personal. Apruebe ausencias justificadas o recháce las que no cumplan los criterios.",
            steps: [
                "**Revisar Solicitudes**: La tabla muestra todas las solicitudes recibidas con su trabajador solicitante, fechas y motivo declarado.",
                "**Aprobar Permiso**: Haga clic en 'Aprobar' en la columna Acciones para autorizar la ausencia del trabajador en el período indicado y luego seleccione si dicha ausencia debe ser o no remunerada.",
                "**Rechazar con Motivo**: Al rechazar, el sistema solicita una razón oficial que se comunicará al trabajador.",
                "**Filtros**: Use los filtros por tipo de permiso, estado (Pendiente, Aprobado, Rechazado) o fecha para gestionar grandes volúmenes de solicitudes."
            ]
        },
        "Gestión de Conceptos": {
            title: "Ayuda: Gestión de Conceptos de Nómina",
            intro: "Administre el catálogo de conceptos de nómina. Un concepto es cualquier ítem que suma (asignación) o resta (deducción) del salario del trabajador.",
            steps: [
                "**Crear Concepto**: Presione 'Nuevo Concepto', asigne un código único (ej: HEX), un nombre descriptivo (ej: 'Horas Extras'), seleccione el tipo (Asignación/Deducción/Bonificación) y el monto base.",
                "**Conceptos Diarios**: Los conceptos basados en días (Dias laborados, Días no laborados) calculan su monto automáticamente con el salario diario del trabajador.",
                "**Editar Concepto**: Haga clic en el ícono de edición para modificar nombre, tipo o monto. Los cambios solo afectan recibos futuros.",
                "**Desactivar**: Use el botón de desactivar para que un concepto ya no sea utilizable en pagos futuros"
            ]
        },
        "Gestión de Nóminas": {
            title: "Ayuda: Gestión y Procesamiento de Nóminas",
            intro: "Prepare y liquide periódicamente las obligaciones salariales semanales o quincenales de la organización.",
            steps: [
                "**Creación de Recibo**: Seleccione un trabajador activo, asigne el tipo de nómina e indique las fechas Desde/Hasta correspondientes.",
                "**Adición de Conceptos**: Agregue asignaciones (como horas extras) o deducciones (como inasistencias o impuestos) especificando el multiplicador de cantidad.",
                "**Procesamiento**: Presione 'Confirmar y procesar pago' para archivar el recibo en el historial con estado 'Pendiente'."
            ]
        },
        "Historial de Nómina": {
            title: "Ayuda: Historial de Nóminas Procesadas",
            intro: "Controle y audite todos los recibos de nómina emitidos y su estado actual.",
            steps: [
                "**Visualización y PDF**: Presione 'Previsualizar recibo' para abrir o descargar el desglose de nómina en formato PDF.",
                "**Acciones Masivas**: Utilice las casillas de verificación para procesar de forma masiva la aprobación, anulación o reversión de múltiples recibos elegibles simultáneamente."
            ]
        },
        "Gestión de Cargos": {
            title: "Ayuda: Gestión de Cargos y Áreas",
            intro: "Defina la estructura organizativa de la empresa catalogando roles y departamentos.",
            steps: [
                "**Nuevo Cargo**: Cree nombres de profesión oficiales vinculándolos a un departamento o área administrativa.",
                "**Control de Estado**: Habilite o deshabilite cargos. Los cargos inactivos no se mostrarán en la ficha de nuevos trabajadores."
            ]
        },
        "Gestión de Cargos": {
            title: "Ayuda: Gestión de Cargos y Areas",
            intro: "Defina la estructura organizativa de la empresa catalogando roles y departamentos a los que pertenecen.",
            steps: [
                "**Nuevo Cargo**: Ingrese el nombre oficial del cargo (ej: Analista) y seleccione el area administrativa correspondiente (ej: Tecnologia). Se sugiere nombrar los cargos con información sobre el área al que pertenece (ej: Analista de Sistemas) para evitar errores por duplicidad.",
                "**Area Administrativa**: Si el area no existe aún, escríbala directamente en el campo. El sistema la registrara automaticamente.",
                "**Habilitar/Deshabilitar**: Los cargos inactivos no apareceran en el formulario de registro de nuevos trabajadores. Puede desactivar un area para desactivar todos los cargos asociados a ella. (Solo se pueden desactivar cargos que no estén asignados a ningún trabajador.",
                "**Ver trabajadores**: Podrá visualizar los trabajadores que posean un cargo en específico."
            ]
        },
        "Mi Perfil": {
            title: "Ayuda: Mi Perfil",
            intro: "Visualice de manera clara e integral su informacion personal, academica y de nomina registrada en la empresa.",
            steps: [
                "**Verificacion de Datos**: Revise detenidamente su Cedula, Nombre, Telefono, Direccion y fecha de ingreso.",
                "**Datos Contractuales**: Confirme que su cargo, fecha de ingreso y datos registrados coincidan con su contrato laboral.",
                "**Reportar Errores**: Si detecta alguna inconsistencia en sus datos, notifique de inmediato a un administrador para su corrección."
            ]
        },
        "Historial de Pagos y Recibos": {
            title: "Ayuda: Historial de Pagos y Recibos",
            intro: "Consulte todos sus recibos de pago de nomina emitidos por la empresa y publicados.",
            steps: [
                "**Ver Recibo**: Haga clic en el icono de PDF para visualizar o descargar el desglose completo de un pago especifico.",
                "**Buscar recibos**: Use la barra de busqueda para localizar un recibo en específico.",
            ]
        },
        "Solicitud de Vacaciones": {
            title: "Ayuda: Solicitud de Vacaciones",
            intro: "Modulo de autogestion para planificar y consultar sus vacaciones anuales acumuladas por ley.",
            steps: [
                "**Verificar Elegibilidad**: Solo puede solicitar vacaciones si ha cumplido al menos 1 año continuo de servicio en la empresa.",
                "**Consultar Periodos**: Presione Ver periodos disponibles para auditar que años vacacionales ya disfruto y cuales tiene pendientes.",
                "**Nueva Solicitud**: Ingrese la fecha de inicio deseada y presione Enviar Solicitud al Administrador para iniciar el flujo de aprobacion.",
                "**Historial de Pagos**: En la pestana Pagos puede visualizar y descargar en PDF los recibos de pago vacacionales que el administrador haya publicado.",
                "**Estado de Solicitud**: Espere la respuesta del administrador. Recibirá notificacion de aprobacion o rechazo con motivo en este mismo modulo."
            ]
        },
        "Solicitud de Permisos": {
            title: "Ayuda: Solicitud de Permisos",
            intro: "Solicite permisos de ausencia laboral. Su administrador revisara y aprobara o rechazara la solicitud.",
            steps: [
                "**Crear Solicitud**: Haga click en Nueva solicitud, indique las fechas de inicio y fin y escriba el motivo de forma clara y detallada.",
                "**Documentacion**: Para permisos medicos o academicos, se sugiere tener a mano documentacion de respaldo que pueda solicitarle el administrador.",
                "**Seguimiento**: Consulte el estado de sus solicitudes en la tabla de historial. Los estados posibles son: Pendiente, Aprobado o Rechazado.",
            ]
        },
        "Gestion de Usuarios y Roles": {
            title: "Ayuda: Gestion de Usuarios y Roles",
            intro: "Panel de control total del sistema. Permite crear, editar, activar o desactivar usuarios y asignar roles de acceso al sistema de nominas.",
            steps: [
                "Dar click en 'Nuevo usuario' o 'editar' según sea el caso.",
                "Llenar los campos necesarios.",
                "Dar click en 'Guardar datos'.",
                "El botón 'Desactivar' suspende el acceso de un determinado usuario hasta que este vuelva a reactivarse."
            ]
        },
        "Gestión de Usuarios y Roles": {
            title: "Ayuda: Gestion de Usuarios y Roles",
            intro: "Panel de control total del sistema. Permite crear, editar, activar o desactivar usuarios y asignar roles de acceso al sistema de nominas.",
            steps: [
                "Dar click en 'Nuevo usuario' o 'editar' según sea el caso.",
                "Llenar los campos necesarios.",
                "Dar click en 'Guardar datos'.",
                "El botón 'Desactivar' suspende el acceso de un determinado usuario hasta que este vuelva a reactivarse."
            ]
        },
        "Generar Reportes de Usuario": {
            title: "Ayuda: Generacion de Reportes de Usuario",
            intro: "Genere reportes consolidados del sistema para auditoria, control de gestion o presentacion a gerencia.",
            steps: [
                "Señalar los datos que se requieren para el reporte.",
                "Dar click en 'Filtrar'.",
                "Dar click en 'Imprimir PDF'."
            ]
        }
    };

    let _lastHelpModule = null;
    function injectHelpSystem() {
        // 1. Inyectar/actualizar botón de Ayuda de Módulo en la cabecera
        const contentHeader = document.getElementById('content-header');
        if (contentHeader) {
            const moduleName = window.currentActiveModule || "";
            // Remove stale button if module changed
            if (moduleName !== _lastHelpModule) {
                const staleBtn = contentHeader.querySelector('#module-help-btn');
                if (staleBtn) staleBtn.remove();
                _lastHelpModule = moduleName;
            }

            if (moduleName && MODULE_HELP_DICTIONARY[moduleName]) {
                let existingBtn = contentHeader.querySelector('#module-help-btn');
                if (!existingBtn) {
                    const h4 = contentHeader.querySelector('h4');
                    if (h4) {
                        h4.style.display = 'inline-flex';
                        h4.style.alignItems = 'center';
                        h4.style.gap = '10px';
                        h4.style.flexWrap = 'wrap';
                        
                        const btn = document.createElement('button');
                        btn.id = 'module-help-btn';
                        btn.setAttribute('data-module', moduleName);
                        btn.style.padding = '5px 14px';
                        btn.style.fontSize = '0.78rem';
                        btn.style.borderRadius = '20px';
                        btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                        btn.style.color = '#fff';
                        btn.style.border = 'none';
                        btn.style.cursor = 'pointer';
                        btn.style.fontWeight = '700';
                        btn.style.display = 'inline-flex';
                        btn.style.alignItems = 'center';
                        btn.style.gap = '5px';
                        btn.style.boxShadow = '0 3px 10px rgba(16, 185, 129, 0.3)';
                        btn.style.transition = 'all 0.2s ease';
                        btn.style.letterSpacing = '0.3px';
                        btn.style.whiteSpace = 'nowrap';
                        btn.title = 'Ver guia de uso de este modulo';
                        
                        btn.innerHTML = `
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            Ayuda
                        `;
                        
                        btn.addEventListener('mouseenter', () => {
                            btn.style.transform = 'translateY(-1px)';
                            btn.style.boxShadow = '0 5px 15px rgba(16, 185, 129, 0.4)';
                        });
                        btn.addEventListener('mouseleave', () => {
                            btn.style.transform = 'translateY(0)';
                            btn.style.boxShadow = '0 3px 10px rgba(16, 185, 129, 0.3)';
                        });
                        
                        btn.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const info = MODULE_HELP_DICTIONARY[btn.getAttribute('data-module')] || MODULE_HELP_DICTIONARY[moduleName];
                            if (!info) return;
                            showModal({
                                type: 'info',
                                title: info.title,
                                html: `
                                    <div style="text-align: left; color: var(--text-main); font-size: 0.95rem; line-height: 1.7;">
                                        <p style="margin-top:0; font-weight:600; padding: 12px; background: rgba(16,185,129,0.08); border-radius: 8px; border-left: 3px solid #10b981;">${info.intro}</p>
                                        <div style="margin: 12px 0 0 0;">
                                            <span style="font-weight:700; display:block; margin-bottom:10px; font-size:0.82rem; text-transform:uppercase; letter-spacing:0.6px; color:#10b981;">Como usar este modulo:</span>
                                            <ul style="margin:0; padding-left:18px; list-style: none;">
                                                ${info.steps.map((s, i) => `<li style="margin-bottom:10px; padding: 8px 10px; background: rgba(0,0,0,0.02); border-radius: 6px; display: flex; gap: 8px; align-items: flex-start;"><span style="color:#10b981; font-weight:800; font-size:0.85rem; min-width:18px;">${i+1}.</span><span>${s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</span></li>`).join('')}
                                            </ul>
                                        </div>
                                    </div>
                                `
                            });
                        });
                        h4.appendChild(btn);
                    }
                }
            }
        }

        // 2. Inyectar botones de ayuda [?] en CADA campo (etiqueta <label>)
        const labels = document.querySelectorAll('label:not(.help-attached):not(.checkbox-container)');
        labels.forEach(lbl => {
            if (lbl.closest('[id*="filter"], [class*="filter"], [id*="f-"], [class*="f-"]')) return;
            const rawText = lbl.textContent.replace('*', '').trim().toLowerCase();
            const associatedInput = lbl.parentElement ? lbl.parentElement.querySelector('input[id], select[id], textarea[id]') : null;
            const fieldId = associatedInput ? associatedInput.id : null;
            const overrideText = fieldId ? HELP_FIELD_OVERRIDES[fieldId] : null;
            const moduleNameKey = (window.currentActiveModule || '').toString().trim().toLowerCase();
            const moduleOverrides = MODULE_FIELD_HELP_OVERRIDES[moduleNameKey] || {};
            const moduleOverrideText = moduleOverrides[fieldId] || moduleOverrides[rawText] || null;
            const dictKey = Object.keys(HELP_DICTIONARY).find(k => k === rawText) || Object.keys(HELP_DICTIONARY).find(k => rawText.startsWith(k) || k.startsWith(rawText));
            const helpText = overrideText || moduleOverrideText || (dictKey ? HELP_DICTIONARY[dictKey] : null);
            
            if (helpText) {
                lbl.classList.add('help-attached');
                lbl.style.display = 'inline-flex';
                lbl.style.alignItems = 'center';
                lbl.style.gap = '6px';
                lbl.style.flexWrap = 'wrap';

                const helpBadge = document.createElement('span');
                helpBadge.className = 'help-field-badge';
                helpBadge.style.display = 'inline-flex';
                helpBadge.style.alignItems = 'center';
                helpBadge.style.justifyContent = 'center';
                helpBadge.style.width = '15px';
                helpBadge.style.height = '15px';
                helpBadge.style.borderRadius = '50%';
                helpBadge.style.background = 'rgba(16, 185, 129, 0.15)';
                helpBadge.style.color = '#10b981';
                helpBadge.style.fontSize = '10px';
                helpBadge.style.fontWeight = 'bold';
                helpBadge.style.cursor = 'pointer';
                helpBadge.style.transition = 'all 0.2s';
                helpBadge.style.userSelect = 'none';
                helpBadge.textContent = '?';
                helpBadge.title = 'Click para ayuda sobre este campo';

                helpBadge.addEventListener('mouseenter', () => {
                    helpBadge.style.background = '#10b981';
                    helpBadge.style.color = '#fff';
                });
                helpBadge.addEventListener('mouseleave', () => {
                    helpBadge.style.background = 'rgba(16, 185, 129, 0.15)';
                    helpBadge.style.color = '#10b981';
                });

                helpBadge.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const cleanTitle = lbl.textContent.replace('?', '').replace('*', '').trim();
                    showModal({
                        type: 'info',
                        title: `Ayuda: ${cleanTitle}`,
                        html: `
                            <div style="text-align: left; color: var(--text-main); font-size: 0.95rem; line-height: 1.6;">
                                <p style="margin: 0; font-weight: 500;">${helpText}</p>
                            </div>
                        `
                    });
                });

                lbl.appendChild(helpBadge);
            }
        });
    }

    // Ejecutar inmediatamente y registrar intervalos para capturar renderizados dinámicos
    setInterval(injectHelpSystem, 600);
})();