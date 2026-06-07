(function () {
    // ─── Llave de configuración por usuario (para que NO se comparta entre usuarios) ──
    // Se obtiene de un id seguro disponible en la página (si no existe, cae a 'global').
    // Importante: no usar localStorage global como antes, porque se comparte entre usuarios.
    function getUserKey() {
        // Laravel normalmente expone el id por window.laravelUser.
        const u = window.laravelUser || null;
        const id = u && (u.id || u.userId || u.user_id);
        return id ? String(id) : 'global';
    }

    function getUserLSKey() {
        return `sessionTimeout_${getUserKey()}`;
    }

    // NOTE: compute the per-user LS key lazily because `window.laravelUser`
    // may not be available at script-evaluation time (it can be injected later).
    function getLSKey() { return getUserLSKey(); }

    // Opciones válidas en segundos ('off' = desactivado)
    const OPTIONS = { '30': 30, '60': 60, '120': 120, 'off': null };

    // Retorna los segundos configurados o null si está desactivado
    function getConfiguredSeconds() {
        const saved = localStorage.getItem(getLSKey()) || '120';
        return OPTIONS.hasOwnProperty(saved) ? OPTIONS[saved] : 120;
    }

    // ─── Estilos del modal ───────────────────────────────────────────────────
    const style = document.createElement('style');
    style.innerHTML = `
        #st-overlay {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.55);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2147483647;
            opacity: 0;
            transition: opacity 0.3s ease;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            pointer-events: none;
        }
        #st-overlay.st-visible {
            opacity: 1;
            pointer-events: auto;
        }
        #st-card {
            background: rgba(255, 255, 255, 0.96);
            border: 1px solid rgba(255, 255, 255, 0.45);
            border-radius: 24px;
            padding: 40px 32px 36px;
            width: 92%;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 24px 60px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.6);
            transform: scale(0.88);
            transition: transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1);
            color: #0f172a;
        }
        .dark-mode #st-card,
        body.dark-mode #st-card {
            background: rgba(15, 23, 42, 0.96);
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 24px 60px rgba(0,0,0,0.45);
            color: #f1f5f9;
        }
        #st-overlay.st-visible #st-card {
            transform: scale(1);
        }
        .st-icon {
            width: 64px;
            height: 64px;
            margin: 0 auto 18px;
            background: rgba(245, 158, 11, 0.12);
            color: #f59e0b;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: st-pulse 2s ease-in-out infinite;
        }
        @keyframes st-pulse {
            0%   { box-shadow: 0 0 0 0   rgba(245,158,11,0.45); }
            70%  { box-shadow: 0 0 0 14px rgba(245,158,11,0);   }
            100% { box-shadow: 0 0 0 0   rgba(245,158,11,0);    }
        }
        .st-title {
            font-size: 1.3rem;
            font-weight: 700;
            margin: 0 0 10px;
            line-height: 1.3;
        }
        .st-msg {
            font-size: 0.875rem;
            color: #64748b;
            margin: 0 0 26px;
            line-height: 1.55;
        }
        .dark-mode .st-msg,
        body.dark-mode .st-msg {
            color: #94a3b8;
        }
        .st-ring-wrap {
            position: relative;
            width: 100px;
            height: 100px;
            margin: 0 auto 28px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .st-ring-svg {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            transform: rotate(-90deg);
            overflow: visible;
        }
        .st-ring-bg {
            fill: none;
            stroke: #e2e8f0;
            stroke-width: 7;
        }
        .dark-mode .st-ring-bg,
        body.dark-mode .st-ring-bg {
            stroke: #1e293b;
        }
        .st-ring-arc {
            fill: none;
            stroke: #ef4444;
            stroke-width: 7;
            stroke-linecap: round;
            stroke-dasharray: 263.9;
            stroke-dashoffset: 0;
            transition: stroke-dashoffset 0.85s linear, stroke 0.4s;
        }
        .st-counter {
            font-size: 2.4rem;
            font-weight: 800;
            color: #ef4444;
            line-height: 1;
            transition: color 0.4s;
        }
        .st-btn {
            background: linear-gradient(135deg, #10a87a 0%, #0d8f68 100%);
            color: #fff;
            border: none;
            border-radius: 12px;
            padding: 14px 20px;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            letter-spacing: 0.01em;
            box-shadow: 0 4px 14px rgba(16,168,122,0.28);
            transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.2s;
        }
        .st-btn:hover {
            background: linear-gradient(135deg, #0d9068 0%, #0a7356 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(16,168,122,0.38);
        }
        .st-btn:active { transform: translateY(0); }
    `;
    document.head.appendChild(style);

    // ─── HTML del modal ──────────────────────────────────────────────────────
    const CIRC = 2 * Math.PI * 42; // ≈ 263.9

    const markup = `
        <div id="st-overlay">
            <div id="st-card">
                <div class="st-icon">
                    <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 9v3m0 3.01V15M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    </svg>
                </div>
                <p class="st-title">¡Su sesión está por expirar!</p>
                <p class="st-msg">Ha estado inactivo durante un tiempo.<br>¿Desea continuar conectado?</p>
                <div class="st-ring-wrap">
                    <svg class="st-ring-svg" viewBox="0 0 96 96">
                        <circle class="st-ring-bg"  cx="48" cy="48" r="42"/>
                        <circle class="st-ring-arc" id="st-arc" cx="48" cy="48" r="42"
                                style="stroke-dasharray:${CIRC.toFixed(2)};stroke-dashoffset:0"/>
                    </svg>
                    <span class="st-counter" id="st-num">10</span>
                </div>
                <button class="st-btn" id="st-keep">Mantener sesión activa</button>
            </div>
        </div>`;

    // ─── Núcleo de la lógica ─────────────────────────────────────────────────
    function init() {
        if (document.getElementById('st-overlay')) return;
        document.body.insertAdjacentHTML('beforeend', markup);

        const overlay = document.getElementById('st-overlay');
        const arc     = document.getElementById('st-arc');
        const numEl   = document.getElementById('st-num');
        const keepBtn = document.getElementById('st-keep');

        // ── Estado ───────────────────────────────────────────────────────────
        // Los valores se pueden cambiar en tiempo real desde el engranaje
        const WARNING_SECS = 10; // siempre 10 s de aviso antes del cierre

        // Leer configuración por usuario de forma determinística (evita que otros usuarios influyan)
        let totalSeconds  = getConfiguredSeconds(); // null = desactivado
        let elapsed       = 0;
        let warningShown  = false;
        let loggedOut     = false;
        let lastActivity  = Date.now();
        let disabled      = (totalSeconds === null);

        // ── Heartbeat (Latido de sesión) ───────────────────────────────────
        // Envía una señal al servidor para mantener la sesión de Laravel viva.
        function doHeartbeat() {
            if (loggedOut) return;
            // No enviamos latido automático si el aviso está en pantalla (el usuario debe decidir)
            // a menos que el temporizador esté desactivado.
            if (warningShown && !disabled) return; 

            fetch('/session/alive', { credentials: 'same-origin', cache: 'no-store' })
                .then(res => {
                    if (res.status === 401 || res.status === 419) doLogout();
                    return res.json().catch(() => ({}));
                })
                .then(data => {
                    if (data && data.alive === false) doLogout();
                })
                .catch(() => {}); // Ignorar errores de red para evitar cierres falsos
        }

        // Ejecutar el latido cada 60 segundos de forma ininterrumpida
        // para garantizar que Laravel no cierre la sesión por inactividad.
        setInterval(doHeartbeat, 60000);

        // ── Actualizar configuración en caliente ─────────────────────────────
        window.addEventListener('sessionTimeoutChanged', (e) => {
            const raw = e.detail && e.detail.value;

            // Solo aplicar si el evento corresponde a ESTE usuario.
            // Esto evita que otra pestaña/usuario cambie el timeout globalmente.
            const incomingKey = e.detail && e.detail.lsKey;
            if (incomingKey && incomingKey !== getLSKey()) return;

            totalSeconds = OPTIONS.hasOwnProperty(raw) ? OPTIONS[raw] : 30;
            disabled     = (totalSeconds === null);

            // Si se desactiva, ocultar el modal inmediatamente
            if (disabled && warningShown) hideWarning();

            // Reiniciar el contador de inactividad
            elapsed = 0;
            doHeartbeat();
        });

        // ── Detectar actividad ───────────────────────────────────────────────
        function onActivity() {
            if (warningShown || loggedOut) return;
            const now = Date.now();
            if (now - lastActivity < 200) return;
            lastActivity = now;
            elapsed = 0;
        }
        
        // Exponer globalmente para poder resetear el timer desde otras funciones críticas
        window.resetSessionInactivity = onActivity;

        ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click']
            .forEach(e => window.addEventListener(e, onActivity, { passive: true }));

        keepBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            if (loggedOut || disabled) return;

            // Refrescar sesión en el servidor inmediatamente al dar clic en el botón
            doHeartbeat();

            lastActivity = Date.now();
            elapsed = 0;
            if (warningShown) hideWarning();
        });

        // ── Mostrar / Ocultar ────────────────────────────────────────────────
        function showWarning(remaining) {
            warningShown = true;
            overlay.style.display = 'flex';
            requestAnimationFrame(() => {
                overlay.offsetHeight;
                overlay.classList.add('st-visible');
            });
            updateCounter(remaining);
        }

        function hideWarning() {
            warningShown = false;
            overlay.classList.remove('st-visible');
            setTimeout(() => { if (!warningShown) overlay.style.display = 'none'; }, 320);
            updateCounter(WARNING_SECS);
        }

        function updateCounter(remaining) {
            const r = Math.max(remaining, 0);
            numEl.textContent = r;
            const ratio = r / WARNING_SECS;
            arc.style.strokeDashoffset = (CIRC * (1 - ratio)).toFixed(2);
            const critical = r <= 3;
            arc.style.stroke  = critical ? '#dc2626' : '#ef4444';
            numEl.style.color = critical ? '#dc2626' : '#ef4444';
        }

        // ── Logout ───────────────────────────────────────────────────────────
        function doLogout() {
            if (loggedOut) return;
            loggedOut = true;
            window.location.href = '/login';
        }

        // ── Tick principal (1 s) ─────────────────────────────────────────────
        setInterval(() => {
            if (loggedOut) return;

            if (disabled) return;

            elapsed++;

            const warningStartAt = totalSeconds - WARNING_SECS; // p.ej. 20 s si total=30
            const remaining      = totalSeconds - elapsed;       // segundos restantes

            if (elapsed >= warningStartAt) {
                if (!warningShown) showWarning(remaining);
                else               updateCounter(remaining);

                if (remaining <= 0) doLogout();
            }
        }, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
