@extends('layouts.app')

@section('title', 'Nueva Contraseña — LUFRA2020')

@section('content')
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    /* ─── Reset & Base ─── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .rp-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Inter', 'Segoe UI', sans-serif;
        position: relative;
        overflow: hidden;
        /* Fondo oscuro animado */
        background: #0f1117;
    }

    /* Orbes de fondo animados */
    .rp-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.35;
        animation: orbFloat 8s ease-in-out infinite;
        pointer-events: none;
    }
    .rp-orb-1 {
        width: 420px; height: 420px;
        background: var(--primary, #333333);
        top: -120px; left: -100px;
        animation-delay: 0s;
    }
    .rp-orb-2 {
        width: 320px; height: 320px;
        background: var(--primary, #333333);
        bottom: -80px; right: -80px;
        animation-delay: 3s;
        opacity: 0.2;
    }
    .rp-orb-3 {
        width: 200px; height: 200px;
        background: #6c63ff;
        top: 60%; left: 10%;
        animation-delay: 5s;
        opacity: 0.12;
    }

    @keyframes orbFloat {
        0%, 100% { transform: translateY(0) scale(1); }
        50%       { transform: translateY(-30px) scale(1.06); }
    }

    /* ─── Card ─── */
    .rp-card {
        position: relative;
        z-index: 10;
        width: 100%;
        max-width: 480px;
        margin: 24px;
        background: rgba(255, 255, 255, 0.04);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, 0.10);
        border-radius: 24px;
        padding: 44px 40px 36px;
        box-shadow: 0 24px 64px rgba(0,0,0,0.5),
                    0 0 0 1px rgba(255,255,255,0.05) inset;
        animation: cardIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }

    @keyframes cardIn {
        from { opacity: 0; transform: translateY(32px) scale(0.96); }
        to   { opacity: 1; transform: translateY(0)    scale(1);    }
    }

    /* ─── Header ─── */
    .rp-icon-wrap {
        width: 64px; height: 64px;
        border-radius: 18px;
        background: linear-gradient(135deg, var(--primary, #333) 0%, rgba(255,255,255,0.08) 100%);
        border: 1px solid rgba(255,255,255,0.15);
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 20px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        animation: iconPop 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
    }
    @keyframes iconPop {
        from { opacity: 0; transform: scale(0.6); }
        to   { opacity: 1; transform: scale(1);   }
    }

    .rp-title {
        color: #ffffff;
        font-size: 1.65rem;
        font-weight: 800;
        text-align: center;
        letter-spacing: -0.5px;
    }
    .rp-subtitle {
        color: rgba(255,255,255,0.5);
        font-size: 0.88rem;
        text-align: center;
        margin-top: 8px;
        line-height: 1.5;
    }
    .rp-subtitle strong { color: var(--primary, #888); }

    .rp-divider {
        height: 1px;
        background: rgba(255,255,255,0.08);
        margin: 24px 0;
    }

    /* ─── Field Groups ─── */
    .rp-field {
        margin-bottom: 20px;
    }

    .rp-label {
        display: flex;
        align-items: center;
        gap: 6px;
        color: rgba(255,255,255,0.8);
        font-size: 0.82rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        margin-bottom: 8px;
    }

    /* Tooltip de ayuda */
    .rp-help {
        position: relative;
        display: inline-flex;
        align-items: center;
        cursor: help;
    }
    .rp-help-icon {
        width: 15px; height: 15px;
        border-radius: 50%;
        background: rgba(255,255,255,0.12);
        border: 1px solid rgba(255,255,255,0.2);
        color: rgba(255,255,255,0.5);
        font-size: 9px;
        font-weight: 700;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.2s;
        font-style: normal;
    }
    .rp-help:hover .rp-help-icon {
        background: var(--primary, #555);
        border-color: var(--primary, #555);
        color: #fff;
    }
    .rp-tooltip {
        position: absolute;
        bottom: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%) translateY(4px);
        background: #1e2130;
        border: 1px solid rgba(255,255,255,0.12);
        color: rgba(255,255,255,0.85);
        font-size: 0.75rem;
        font-weight: 400;
        padding: 8px 12px;
        border-radius: 10px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: all 0.2s;
        z-index: 100;
        text-transform: none;
        letter-spacing: 0;
        box-shadow: 0 8px 20px rgba(0,0,0,0.4);
    }
    .rp-tooltip::after {
        content: '';
        position: absolute;
        top: 100%; left: 50%;
        transform: translateX(-50%);
        border: 5px solid transparent;
        border-top-color: rgba(255,255,255,0.12);
    }
    .rp-help:hover .rp-tooltip {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }

    /* ─── Input wrapper ─── */
    .rp-input-wrap {
        position: relative;
        display: flex;
        align-items: center;
    }
    .rp-input-wrap input {
        width: 100%;
        padding: 13px 46px 13px 16px;
        background: rgba(255,255,255,0.06);
        border: 1.5px solid rgba(255,255,255,0.10);
        border-radius: 12px;
        color: #ffffff;
        font-size: 0.95rem;
        font-family: inherit;
        outline: none;
        transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
        caret-color: var(--primary, #888);
    }
    .rp-input-wrap input::placeholder {
        color: rgba(255,255,255,0.25);
        font-size: 0.88rem;
    }
    .rp-input-wrap input:focus {
        border-color: var(--primary, #555);
        background: rgba(255,255,255,0.08);
        box-shadow: 0 0 0 3px rgba(100,100,100,0.15);
    }
    .rp-input-wrap input.is-valid {
        border-color: #22c55e !important;
        box-shadow: 0 0 0 3px rgba(34,197,94,0.12) !important;
    }
    .rp-input-wrap input.is-invalid {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239,68,68,0.12) !important;
    }
    .rp-input-wrap input.is-warn {
        border-color: #f59e0b !important;
        box-shadow: 0 0 0 3px rgba(245,158,11,0.12) !important;
    }

    .rp-toggle {
        position: absolute;
        right: 14px;
        background: none; border: none;
        color: rgba(255,255,255,0.3);
        cursor: pointer; padding: 0;
        display: flex; align-items: center;
        transition: color 0.2s;
    }
    .rp-toggle:hover { color: rgba(255,255,255,0.7); }
    .rp-toggle.active { color: var(--primary, #888); }

    /* ─── Strength Meter ─── */
    .rp-strength {
        margin-top: 10px;
    }
    .rp-strength-bar-wrap {
        display: flex; gap: 4px;
        margin-bottom: 5px;
    }
    .rp-strength-seg {
        flex: 1;
        height: 4px;
        border-radius: 2px;
        background: rgba(255,255,255,0.08);
        transition: background 0.4s ease;
    }
    .rp-strength-label {
        font-size: 0.73rem;
        font-weight: 600;
        color: rgba(255,255,255,0.35);
        text-align: right;
        letter-spacing: 0.3px;
        min-height: 14px;
        transition: color 0.3s;
    }

    /* ─── Rules Checklist ─── */
    .rp-rules {
        margin-top: 12px;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 12px;
        padding: 14px 16px;
    }
    .rp-rules-title {
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.8px;
        text-transform: uppercase;
        color: rgba(255,255,255,0.4);
        margin-bottom: 10px;
    }
    .rp-rule {
        display: flex;
        align-items: center;
        gap: 9px;
        font-size: 0.82rem;
        color: rgba(255,255,255,0.4);
        padding: 4px 0;
        transition: color 0.3s;
    }
    .rp-rule-dot {
        width: 18px; height: 18px;
        border-radius: 50%;
        border: 1.5px solid rgba(255,255,255,0.15);
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
        font-size: 9px;
        transition: all 0.3s;
    }
    .rp-rule.valid {
        color: #22c55e;
    }
    .rp-rule.valid .rp-rule-dot {
        background: rgba(34,197,94,0.15);
        border-color: #22c55e;
        color: #22c55e;
    }
    .rp-rule.invalid-hint {
        color: #f87171;
    }
    .rp-rule.invalid-hint .rp-rule-dot {
        background: rgba(239,68,68,0.1);
        border-color: #ef4444;
        color: #ef4444;
    }

    /* ─── Regla especial: no repetir contraseña ─── */
    .rp-rule.warn-same .rp-rule-dot {
        background: rgba(245,158,11,0.12);
        border-color: #f59e0b;
        color: #f59e0b;
    }
    .rp-rule.warn-same {
        color: #fbbf24;
    }

    /* ─── Match feedback ─── */
    .rp-match-feedback {
        margin-top: 7px;
        font-size: 0.78rem;
        font-weight: 600;
        min-height: 18px;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.3s;
    }

    /* ─── Alert banner ─── */
    .rp-alert {
        border-radius: 12px;
        padding: 13px 16px;
        font-size: 0.85rem;
        font-weight: 500;
        display: none;
        align-items: flex-start;
        gap: 10px;
        margin-bottom: 16px;
        animation: fadeSlideIn 0.3s ease;
    }
    @keyframes fadeSlideIn {
        from { opacity: 0; transform: translateY(-8px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    .rp-alert.show { display: flex; }
    .rp-alert.success {
        background: rgba(34,197,94,0.12);
        border: 1px solid rgba(34,197,94,0.3);
        color: #86efac;
    }
    .rp-alert.danger {
        background: rgba(239,68,68,0.12);
        border: 1px solid rgba(239,68,68,0.3);
        color: #fca5a5;
    }
    .rp-alert.warning {
        background: rgba(245,158,11,0.12);
        border: 1px solid rgba(245,158,11,0.3);
        color: #fcd34d;
    }
    .rp-alert-icon { flex-shrink: 0; margin-top: 1px; }

    /* ─── Submit Button ─── */
    .rp-btn {
        width: 100%;
        padding: 15px;
        background: linear-gradient(135deg, var(--primary, #444) 0%, rgba(0,0,0,0.4) 100%);
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 12px;
        color: #ffffff;
        font-family: inherit;
        font-size: 0.9rem;
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
        cursor: pointer;
        transition: all 0.3s;
        position: relative;
        overflow: hidden;
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    }
    .rp-btn::after {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(255,255,255,0);
        transition: background 0.3s;
    }
    .rp-btn:hover:not(:disabled)::after { background: rgba(255,255,255,0.06); }
    .rp-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,0,0,0.4); }
    .rp-btn:active:not(:disabled) { transform: translateY(0); }
    .rp-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
    }
    .rp-btn .btn-inner {
        display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .rp-btn .spinner {
        width: 16px; height: 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
        display: none;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ─── Back link ─── */
    .rp-back {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 16px;
        padding: 13px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,0.08);
        color: rgba(255,255,255,0.4);
        text-decoration: none;
        font-size: 0.85rem;
        font-weight: 600;
        transition: all 0.25s;
    }
    .rp-back:hover {
        border-color: rgba(255,255,255,0.18);
        color: rgba(255,255,255,0.75);
        background: rgba(255,255,255,0.04);
    }

    /* ─── Progress steps at top ─── */
    .rp-steps {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0;
        margin-bottom: 28px;
    }
    .rp-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        flex: 1;
    }
    .rp-step-circle {
        width: 32px; height: 32px;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 0.78rem;
        font-weight: 700;
        transition: all 0.3s;
    }
    .rp-step.done .rp-step-circle {
        background: rgba(34,197,94,0.2);
        border: 2px solid #22c55e;
        color: #22c55e;
    }
    .rp-step.active .rp-step-circle {
        background: var(--primary, #444);
        border: 2px solid rgba(255,255,255,0.3);
        color: #fff;
        box-shadow: 0 0 0 4px rgba(100,100,100,0.15);
    }
    .rp-step.pending .rp-step-circle {
        background: rgba(255,255,255,0.05);
        border: 2px solid rgba(255,255,255,0.12);
        color: rgba(255,255,255,0.3);
    }
    .rp-step-label {
        font-size: 0.68rem;
        font-weight: 600;
        letter-spacing: 0.3px;
        color: rgba(255,255,255,0.35);
        text-align: center;
    }
    .rp-step.active .rp-step-label { color: rgba(255,255,255,0.75); }
    .rp-step.done .rp-step-label { color: #22c55e; }
    .rp-step-line {
        flex: 1;
        height: 2px;
        background: rgba(255,255,255,0.08);
        margin: 0 4px;
        margin-bottom: 18px;
    }
    .rp-step-line.done { background: #22c55e; }
</style>

<div class="rp-page">
    <!-- Orbes decorativos -->
    <div class="rp-orb rp-orb-1"></div>
    <div class="rp-orb rp-orb-2"></div>
    <div class="rp-orb rp-orb-3"></div>

    <div class="rp-card">

        <!-- Pasos del proceso -->
        <div class="rp-steps">
            <div class="rp-step done">
                <div class="rp-step-circle">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span class="rp-step-label">Usuario</span>
            </div>
            <div class="rp-step-line done"></div>
            <div class="rp-step done">
                <div class="rp-step-circle">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span class="rp-step-label">Verificación</span>
            </div>
            <div class="rp-step-line done"></div>
            <div class="rp-step active">
                <div class="rp-step-circle">3</div>
                <span class="rp-step-label">Nueva Clave</span>
            </div>
        </div>

        <!-- Icono y título -->
        <div class="rp-icon-wrap">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                <circle cx="12" cy="16" r="1" fill="rgba(255,255,255,0.9)" stroke="none"/>
            </svg>
        </div>

        <h1 class="rp-title">Nueva Contraseña</h1>
        <p class="rp-subtitle">Establece una clave segura para tu cuenta en <strong>LUFRA2020</strong>.</p>

        <div class="rp-divider"></div>

        <!-- Formulario -->
        <form id="resetPasswordForm" novalidate>
            @csrf

            <!-- ── CAMPO 1: Nueva contraseña ── -->
            <div class="rp-field">
                <label class="rp-label" for="new_password">
                    Nueva contraseña
                    <span class="rp-help">
                        <i class="rp-help-icon">?</i>
                        <span class="rp-tooltip">Debe tener mín. 8 caracteres con mayúscula, minúscula, número y símbolo especial.</span>
                    </span>
                </label>
                <div class="rp-input-wrap">
                    <input type="password" id="new_password" name="password" required
                           autocomplete="new-password" spellcheck="false"
                           placeholder="Ingresa tu nueva contraseña">
                    <button type="button" class="rp-toggle" id="toggle-new" title="Mostrar/ocultar">
                        <svg id="eye-new-open" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        <svg id="eye-new-close" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    </button>
                </div>

                <!-- Barra de fuerza -->
                <div class="rp-strength" id="strengthBlock" style="display:none;">
                    <div class="rp-strength-bar-wrap">
                        <div class="rp-strength-seg" id="seg1"></div>
                        <div class="rp-strength-seg" id="seg2"></div>
                        <div class="rp-strength-seg" id="seg3"></div>
                        <div class="rp-strength-seg" id="seg4"></div>
                        <div class="rp-strength-seg" id="seg5"></div>
                    </div>
                    <div class="rp-strength-label" id="strength-label"></div>
                </div>

                <!-- Checklist de reglas -->
                <div class="rp-rules">
                    <div class="rp-rules-title">Requisitos de seguridad</div>
                    <div class="rp-rule" id="rule-length">
                        <div class="rp-rule-dot">○</div>
                        <span>Mínimo 8 caracteres</span>
                    </div>
                    <div class="rp-rule" id="rule-upper">
                        <div class="rp-rule-dot">○</div>
                        <span>Al menos una mayúscula (A–Z)</span>
                    </div>
                    <div class="rp-rule" id="rule-lower">
                        <div class="rp-rule-dot">○</div>
                        <span>Al menos una minúscula (a–z)</span>
                    </div>
                    <div class="rp-rule" id="rule-number">
                        <div class="rp-rule-dot">○</div>
                        <span>Al menos un número (0–9)</span>
                    </div>
                    <div class="rp-rule" id="rule-special">
                        <div class="rp-rule-dot">○</div>
                        <span>Al menos un carácter especial (!@#$…)</span>
                    </div>

                </div>
            </div>

            <!-- ── CAMPO 2: Confirmar contraseña ── -->
            <div class="rp-field">
                <label class="rp-label" for="confirm_password">
                    Confirmar contraseña
                    <span class="rp-help">
                        <i class="rp-help-icon">?</i>
                        <span class="rp-tooltip">Escribe exactamente la misma contraseña que ingresaste arriba.</span>
                    </span>
                </label>
                <div class="rp-input-wrap">
                    <input type="password" id="confirm_password" name="password_confirmation" required
                           autocomplete="new-password" spellcheck="false"
                           placeholder="Repite tu nueva contraseña">
                    <button type="button" class="rp-toggle" id="toggle-confirm" title="Mostrar/ocultar">
                        <svg id="eye-conf-open" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        <svg id="eye-conf-close" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    </button>
                </div>
                <div class="rp-match-feedback" id="match-feedback"></div>
            </div>

            <!-- Alert de respuesta del servidor -->
            <div class="rp-alert" id="rp-alert" role="alert">
                <span class="rp-alert-icon" id="alert-icon"></span>
                <span id="alert-text"></span>
            </div>

            <!-- Botón submit -->
            <button type="submit" id="btn-reset" class="rp-btn" disabled>
                <span class="btn-inner">
                    <div class="spinner" id="btn-spinner"></div>
                    <svg id="btn-lock-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <span id="btn-text">Actualizar Contraseña</span>
                </span>
            </button>

            <!-- Volver al login -->
            <a href="/login" class="rp-back">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5m0 0l7 7m-7-7l7-7"/></svg>
                Volver al inicio de sesión
            </a>
        </form>
    </div>
</div>

<script>
    /* ──────────────────────────────────────────
     *  Helpers CSRF & fetch
     * ────────────────────────────────────────── */
    async function refreshCsrfToken() {
        try {
            const res  = await fetch('/login', { method: 'GET', headers: { 'Cache-Control': 'no-cache' } });
            if (res.ok) {
                const html = await res.text();
                const doc  = new DOMParser().parseFromString(html, 'text/html');
                const tok  = doc.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                if (tok) {
                    const el = document.querySelector('meta[name="csrf-token"]');
                    el ? el.setAttribute('content', tok) : (() => {
                        const m = document.createElement('meta');
                        m.name = 'csrf-token'; m.content = tok;
                        document.head.appendChild(m);
                    })();
                    return tok;
                }
            }
        } catch(e) { console.error('CSRF refresh error:', e); }
        return null;
    }

    async function fetchWithCsrf(url, opts = {}) {
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        opts.headers = { ...(opts.headers || {}), 'X-CSRF-TOKEN': token };
        let res = await fetch(url, opts);
        if (res.status === 419) {
            const newTok = await refreshCsrfToken();
            if (newTok) { opts.headers['X-CSRF-TOKEN'] = newTok; res = await fetch(url, opts); }
        }
        return res;
    }

    /* ──────────────────────────────────────────
     *  DOM refs
     * ────────────────────────────────────────── */
    const passInput    = document.getElementById('new_password');
    const confirmInput = document.getElementById('confirm_password');
    const btn          = document.getElementById('btn-reset');
    const btnText      = document.getElementById('btn-text');
    const btnSpinner   = document.getElementById('btn-spinner');
    const btnLockIcon  = document.getElementById('btn-lock-icon');
    const matchFb      = document.getElementById('match-feedback');
    const alertBox     = document.getElementById('rp-alert');
    const alertText    = document.getElementById('alert-text');
    const alertIcon    = document.getElementById('alert-icon');
    const strengthBlock = document.getElementById('strengthBlock');
    const strengthLabel = document.getElementById('strength-label');
    const segments     = [1,2,3,4,5].map(i => document.getElementById('seg' + i));

    /* State */
    let sameAsCurrent = false; // se actualiza desde el backend cuando devuelve 422 (solo controla el botón)

    /* ──────────────────────────────────────────
     *  Toggle show/hide password
     * ────────────────────────────────────────── */
    function setupToggle(btnId, inputId, openId, closeId) {
        document.getElementById(btnId).addEventListener('click', () => {
            const input  = document.getElementById(inputId);
            const isPass = input.type === 'password';
            input.type   = isPass ? 'text' : 'password';
            document.getElementById(openId).style.display  = isPass ? 'none'  : '';
            document.getElementById(closeId).style.display = isPass ? ''     : 'none';
            document.getElementById(btnId).classList.toggle('active', isPass);
        });
    }
    setupToggle('toggle-new',     'new_password',     'eye-new-open',  'eye-new-close');
    setupToggle('toggle-confirm', 'confirm_password', 'eye-conf-open', 'eye-conf-close');

    /* ──────────────────────────────────────────
     *  Reglas de validación
     * ────────────────────────────────────────── */
    const RULES = [
        { id: 'rule-length',  test: v => v.length >= 8 },
        { id: 'rule-upper',   test: v => /[A-Z]/.test(v) },
        { id: 'rule-lower',   test: v => /[a-z]/.test(v) },
        { id: 'rule-number',  test: v => /[0-9]/.test(v) },
        { id: 'rule-special', test: v => /[^A-Za-z0-9]/.test(v) },
    ];

    function updateRules(val) {
        let passed = 0;
        RULES.forEach(r => {
            const el  = document.getElementById(r.id);
            const dot = el.querySelector('.rp-rule-dot');
            const ok  = r.test(val);
            el.classList.toggle('valid', ok);
            el.classList.remove('invalid-hint');
            dot.textContent = ok ? '✓' : '○';
            if (ok) passed++;
        });

        return passed; // 0–5
    }

    /* ──────────────────────────────────────────
     *  Barra de fuerza (5 segmentos)
     * ────────────────────────────────────────── */
    const STRENGTH_CONFIG = [
        { color: 'transparent',  label: '' },
        { color: '#ef4444',      label: 'Muy débil' },
        { color: '#f97316',      label: 'Débil' },
        { color: '#eab308',      label: 'Regular' },
        { color: '#22c55e',      label: 'Fuerte' },
        { color: '#16a34a',      label: '¡Excelente!' },
    ];

    function updateStrength(val) {
        const score = RULES.filter(r => r.test(val)).length;

        strengthBlock.style.display = val.length ? '' : 'none';
        const cfg = STRENGTH_CONFIG[score] || STRENGTH_CONFIG[0];

        segments.forEach((seg, i) => {
            seg.style.background = i < score ? cfg.color : 'rgba(255,255,255,0.08)';
        });
        strengthLabel.textContent  = cfg.label;
        strengthLabel.style.color  = cfg.color || 'rgba(255,255,255,0.35)';
    }

    /* ──────────────────────────────────────────
     *  Validación de coincidencia
     * ────────────────────────────────────────── */
    function checkMatch() {
        const p1 = passInput.value;
        const p2 = confirmInput.value;

        if (!p2) {
            matchFb.innerHTML = '';
            confirmInput.className = '';
            return false;
        }
        if (p1 === p2) {
            matchFb.innerHTML = '<span style="color:#22c55e;">✓ Las contraseñas coinciden</span>';
            confirmInput.classList.remove('is-invalid');
            confirmInput.classList.add('is-valid');
            return true;
        } else {
            matchFb.innerHTML = '<span style="color:#ef4444;">✗ Las contraseñas no coinciden</span>';
            confirmInput.classList.remove('is-valid');
            confirmInput.classList.add('is-invalid');
            return false;
        }
    }

    /* ──────────────────────────────────────────
     *  Habilitar/deshabilitar botón submit
     * ────────────────────────────────────────── */
    function evaluateForm() {
        const val    = passInput.value;
        const allOk  = RULES.every(r => r.test(val));
        const match  = val === confirmInput.value && confirmInput.value.length > 0;
        const noSame = !sameAsCurrent;

        const ready = allOk && match && noSame;
        btn.disabled = !ready;

        // Actualizar borde del campo contraseña
        if (val.length === 0) {
            passInput.className = '';
        } else if (allOk && noSame) {
            passInput.classList.add('is-valid');
            passInput.classList.remove('is-invalid', 'is-warn');
        } else if (sameAsCurrent) {
            passInput.classList.add('is-warn');
            passInput.classList.remove('is-valid', 'is-invalid');
        } else {
            passInput.classList.add('is-invalid');
            passInput.classList.remove('is-valid', 'is-warn');
        }
    }

    /* ──────────────────────────────────────────
     *  Event listeners
     * ────────────────────────────────────────── */
    passInput.addEventListener('input', () => {
        sameAsCurrent = false; // Resetear al escribir de nuevo
        updateRules(passInput.value);
        updateStrength(passInput.value);
        checkMatch();
        evaluateForm();
    });

    confirmInput.addEventListener('input', () => {
        checkMatch();
        evaluateForm();
    });

    /* ──────────────────────────────────────────
     *  Mostrar/ocultar alerta
     * ────────────────────────────────────────── */
    function showAlert(type, iconSvg, text) {
        alertBox.className = 'rp-alert show ' + type;
        alertIcon.innerHTML = iconSvg;
        alertText.textContent = text;
    }
    function hideAlert() {
        alertBox.className = 'rp-alert';
    }

    const ICON_SUCCESS = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    const ICON_DANGER  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    const ICON_WARN    = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;

    /* ──────────────────────────────────────────
     *  Submit
     * ────────────────────────────────────────── */
    document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAlert();

        const password              = passInput.value;
        const password_confirmation = confirmInput.value;

        /* Validaciones finales en cliente */
        if (!RULES.every(r => r.test(password))) {
            showAlert('danger', ICON_DANGER, 'La contraseña no cumple con todos los requisitos de seguridad.');
            return;
        }
        if (password !== password_confirmation) {
            showAlert('danger', ICON_DANGER, 'Las contraseñas ingresadas no coinciden. Verifica e inténtalo de nuevo.');
            return;
        }

        /* Loading state */
        btn.disabled = true;
        btnSpinner.style.display   = 'block';
        btnLockIcon.style.display  = 'none';
        btnText.textContent        = 'Guardando…';

        try {
            const res  = await fetchWithCsrf('/seguridad/actualizar-clave', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ password, password_confirmation })
            });
            const data = await res.json();

            if (res.ok) {
                /* ✅ Éxito */
                showAlert('success', ICON_SUCCESS, '¡Contraseña actualizada! Redirigiendo al inicio de sesión…');
                btn.disabled = true;
                btnText.textContent = 'Redirigiendo…';

                // Animación de salida de la card
                setTimeout(() => {
                    document.querySelector('.rp-card').style.opacity   = '0';
                    document.querySelector('.rp-card').style.transform = 'scale(0.97)';
                    document.querySelector('.rp-card').style.transition = 'all 0.4s ease';
                }, 1200);
                setTimeout(() => window.location.href = '/login', 2800);

            } else if (res.status === 422) {
                /* ⚠️ Contraseña anterior o validación */
                const msg = data.message || 'La contraseña no cumple con las políticas de seguridad.';
                const isSamePwd = msg.toLowerCase().includes('utiliz') || msg.toLowerCase().includes('anterior') || msg.toLowerCase().includes('recientemente');

                if (isSamePwd) {
                    sameAsCurrent = true;
                    updateRules(password);
                    evaluateForm();
                    showAlert('warning', ICON_WARN, 'No puedes reutilizar una contraseña que ya utilizaste anteriormente. Elige una diferente.');
                } else {
                    showAlert('danger', ICON_DANGER, msg);
                }

                /* Restaurar botón */
                btn.disabled = false;
                btnSpinner.style.display  = 'none';
                btnLockIcon.style.display = '';
                btnText.textContent       = 'Actualizar Contraseña';

            } else {
                showAlert('danger', ICON_DANGER, data.message || 'Ocurrió un error. Por favor intenta nuevamente.');
                btn.disabled = false;
                btnSpinner.style.display  = 'none';
                btnLockIcon.style.display = '';
                btnText.textContent       = 'Actualizar Contraseña';
            }

        } catch (err) {
            console.error('Error de red:', err);
            showAlert('danger', ICON_DANGER, 'No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.');
            btn.disabled = false;
            btnSpinner.style.display  = 'none';
            btnLockIcon.style.display = '';
            btnText.textContent       = 'Actualizar Contraseña';
        }
    });
</script>
@endsection