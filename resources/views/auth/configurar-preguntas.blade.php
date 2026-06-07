@extends('layouts.app')

@section('title', 'Centro de Seguridad - Lufra 2020')

@section('content')
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<style>
    body {
        background-color: var(--bg-color, #f4f6f9);
        margin: 0;
        padding: 0;
        display: flex;
        transition: background-color 0.3s, color 0.3s;
    }

    /* BARRA LATERAL */
    .sidebar {
        width: 280px;
        background: linear-gradient(180deg, var(--sidebar-bg, #111827) 0%, var(--primary, #10a87a) 100%);
        color: #ffffff;
        display: flex;
        flex-direction: column;
        box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
        position: fixed;
        height: 100vh;
        overflow-y: auto;
        z-index: 100;
        transition: background 0.3s;
    }

    .sidebar h3 {
        text-align: center;
        font-size: 1.25rem;
        font-weight: 700;
        letter-spacing: 0.5px;
        margin: 0;
        padding: 30px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0,0,0,0.15);
    }

    #user-info-panel {
        padding: 25px 20px;
        text-align: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    #user-info-panel p {
        font-size: 1.1rem;
        font-weight: 600;
        margin: 0 0 12px 0;
        background: linear-gradient(90deg, #e0e7ff, #ffffff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .btn-back-sidebar {
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #ffffff;
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        text-decoration: none;
        box-sizing: border-box;
    }

    .btn-back-sidebar:hover {
        background-color: rgba(255, 255, 255, 0.2);
        box-shadow: 0 4px 12px rgba(255, 255, 255, 0.15);
        transform: translateY(-1px);
    }

    /* CONTENIDO PRINCIPAL DISTRIBUIDO EN DOS COLUMNAS */
    .main-security-content {
        flex: 1;
        margin-left: 280px;
        padding: 40px;
        display: flex;
        flex-direction: column;
        gap: 25px;
        box-sizing: border-box;
        min-height: 100vh;
    }

    .security-header-area {
        display: flex;
        align-items: center;
        gap: 15px;
        border-bottom: 2px solid var(--border-color, #e5e7eb);
        padding-bottom: 15px;
    }

    .security-header-area h1 {
        margin: 0;
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--text-main, #1f2937);
    }

    .security-grid {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: 30px;
        align-items: start;
    }

    /* COLUMNA IZQUIERDA: TARJETA DEL FORMULARIO */
    .setup-card-modern {
        background-color: var(--card-bg, #ffffff);
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02), 0 1px 3px rgba(0,0,0,0.05);
        padding: 35px;
        border: 1px solid var(--border-color, rgba(229, 231, 235, 0.7));
        transition: background-color 0.3s, border-color 0.3s;
    }

    .form-group-modern {
        margin-bottom: 24px;
    }

    .form-group-modern label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        font-size: 0.95rem;
        margin-bottom: 10px;
        color: var(--text-main, #374151);
    }

    .input-wrapper-icon {
        position: relative;
        display: flex;
        align-items: center;
    }

    .input-wrapper-icon i.field-icon {
        position: absolute;
        left: 15px;
        color: #9ca3af;
        font-size: 1rem;
    }

    .form-control-modern {
        width: 100%;
        padding: 14px 16px 14px 45px;
        border: 2px solid var(--border-color, #e5e7eb);
        border-radius: 10px;
        font-size: 0.95rem;
        font-family: 'Inter', sans-serif;
        outline: none;
        box-sizing: border-box;
        transition: all 0.2s ease;
        background-color: var(--card-bg, #ffffff);
        color: var(--text-main, #111827);
    }

    .form-control-modern:focus {
        border-color: var(--primary, #10a87a);
        box-shadow: 0 0 0 4px rgba(51, 51, 51, 0.12);
    }

    /* Ojo de visibilidad interactivo */
    .toggle-password-btn {
        position: absolute;
        right: 15px;
        background: none;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        padding: 0;
        font-size: 1rem;
    }
    .toggle-password-btn:hover {
        color: var(--primary, #10a87a);
    }

    .btn-save-modern {
        width: 100%;
        padding: 15px;
        background: var(--primary, #333333);
        color: white;
        border: none;
        border-radius: 10px;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(0,0,0,0.2);
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    .btn-save-modern:hover {
        background: var(--primary-hover, #000000);
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        transform: translateY(-2px);
    }

    /* Nueva cabecera de estado */
    .security-status-badge {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 18px;
        border-radius: 12px;
        font-size: 0.88rem;
        font-weight: 600;
        margin-bottom: 25px;
        animation: fadeSlideIn 0.4s ease both;
    }
    .security-status-badge.protected {
        background-color: rgba(34, 197, 94, 0.1);
        color: #22c55e;
        border: 1px solid rgba(34, 197, 94, 0.2);
    }
    .security-status-badge.vulnerable {
        background-color: rgba(245, 158, 11, 0.1);
        color: #f59e0b;
        border: 1px solid rgba(245, 158, 11, 0.2);
    }
    body.dark-mode .security-status-badge.protected {
        background-color: rgba(34, 197, 94, 0.15);
        color: #86efac;
        border: 1px solid rgba(34, 197, 94, 0.3);
    }
    body.dark-mode .security-status-badge.vulnerable {
        background-color: rgba(245, 158, 11, 0.15);
        color: #fcd34d;
        border: 1px solid rgba(245, 158, 11, 0.3);
    }

    /* Barra de fuerza para la respuesta */
    .strength-bar-container {
        margin-top: 10px;
        padding: 10px 14px;
        background: rgba(0, 0, 0, 0.02);
        border-radius: 10px;
        border: 1px solid var(--border-color, #e5e7eb);
        transition: all 0.3s ease;
    }
    body.dark-mode .strength-bar-container {
        background: rgba(255, 255, 255, 0.02);
        border-color: var(--border-color, #30363d);
    }
    .strength-segments {
        display: flex;
        gap: 6px;
        margin-bottom: 6px;
    }
    .strength-segment {
        flex: 1;
        height: 5px;
        border-radius: 3px;
        background: rgba(0, 0, 0, 0.08);
        transition: background 0.3s ease;
    }
    body.dark-mode .strength-segment {
        background: rgba(255, 255, 255, 0.08);
    }
    .strength-feedback-text {
        font-size: 0.76rem;
        font-weight: 600;
        text-align: right;
        min-height: 15px;
        transition: color 0.3s ease;
    }

    /* Validaciones visuales de inputs */
    .form-control-modern.is-valid {
        border-color: #22c55e !important;
        box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.12) !important;
    }
    .form-control-modern.is-invalid {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.12) !important;
    }

    /* Feedback en tiempo real */
    .realtime-feedback {
        font-size: 0.78rem;
        font-weight: 600;
        margin-top: 6px;
        min-height: 16px;
        transition: all 0.2s;
    }

    /* Deshabilitar botón */
    .btn-save-modern:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
    }

    @keyframes fadeSlideIn {
        from { opacity: 0; transform: translateY(-8px); }
        to   { opacity: 1; transform: translateY(0); }
    }

    /* COLUMNA DERECHA: TARJETAS COMPLEMENTARIAS */
    .info-side-panel {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .status-card {
        background: var(--card-bg, #ffffff);
        border-radius: 16px;
        padding: 25px;
        border: 1px solid var(--border-color, rgba(229, 231, 235, 0.7));
        display: flex;
        align-items: center;
        gap: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        transition: background-color 0.3s, border-color 0.3s;
    }

    .status-icon-box {
        width: 55px;
        height: 55px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
    }

    /* Clases de estado dinámicas basadas en si tiene pregunta */
    .status-protected { background-color: #e8f5e9; color: #1b5e20; border: 1px solid #c8e6c9; }
    .status-warning { background-color: #fff3e0; color: #e65100; border: 1px solid #ffe0b2; }

    .status-info h5 { margin: 0 0 5px 0; font-size: 1.05rem; font-weight: 700; }
    .status-info p { margin: 0; font-size: 0.88rem; color: #6b7280; }

    .utility-card {
        background: var(--card-bg, #ffffff);
        border-radius: 16px;
        padding: 25px;
        border: 1px solid var(--border-color, rgba(229, 231, 235, 0.7));
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        transition: background-color 0.3s, border-color 0.3s;
    }

    .utility-card h4 {
        margin: 0 0 15px 0;
        font-size: 1.1rem;
        font-weight: 700;
        color: #1f2937;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .tips-list {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .tips-list li {
        font-size: 0.88rem;
        color: #4b5563;
        margin-bottom: 12px;
        display: flex;
        align-items: flex-start;
        gap: 10px;
        line-height: 1.4;
    }

    .tips-list li i {
        color: var(--primary, #10a87a);
        margin-top: 3px;
        font-size: 0.85rem;
    }

    /* Alertas de Mensajes */
    .custom-alert {
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 22px;
        font-size: 0.9rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .alert-info { background-color: #eff6ff; color: #1e40af; border-left: 5px solid #3b82f6; }
    .alert-success { background-color: #f0fdf4; color: #166534; border-left: 5px solid #22c55e; }
    .alert-danger { background-color: #fef2f2; color: #b91c1c; border-left: 5px solid #ef4444; }

    /* Modal de confirmación de contraseña */
    .password-modal-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
    }
    .password-modal-overlay.active {
        opacity: 1;
        pointer-events: auto;
    }
    .password-modal {
        background: var(--card-bg, #fff);
        padding: 30px;
        border-radius: 12px;
        width: 90%;
        max-width: 400px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        transform: translateY(-20px);
        transition: transform 0.3s ease;
    }
    .password-modal-overlay.active .password-modal {
        transform: translateY(0);
    }
    .password-modal h3 {
        margin: 0 0 15px 0;
        color: var(--text-main, #1f2937);
        font-size: 1.2rem;
    }
    .password-modal p {
        color: #6b7280;
        font-size: 0.9rem;
        margin-bottom: 20px;
    }
    .password-modal .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
    }
    .btn-cancel {
        background: transparent;
        border: 1px solid #d1d5db;
        padding: 10px 15px;
        border-radius: 8px;
        color: #4b5563;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s ease;
    }
    .btn-confirm {
        background: var(--primary, #333333);
        border: none;
        padding: 10px 15px;
        border-radius: 8px;
        color: #fff;
        cursor: pointer;
        font-weight: 600;
    }

    /* SOPORTE DE MODO OSCURO PARA PARÁMETROS Y CONTROLES GENERALES */
    body.dark-mode {
        --bg-color: #0a0e14;
        --card-bg: #161b22;
        --text-main: #e6edf3;
        --text-muted: #848d97;
        --border-color: #30363d;
        --sidebar-bg: #0d1117;
        
        background-color: var(--bg-color);
        color: var(--text-main);
    }

    body.dark-mode .sidebar {
        border-right: 1px solid var(--border-color);
    }

    body.dark-mode .utility-card h4 {
        color: var(--text-main, #e6edf3);
    }

    body.dark-mode .tips-list li {
        color: var(--text-muted, #848d97);
    }

    body.dark-mode select.form-control-modern option {
        background-color: var(--card-bg, #161b22);
        color: var(--text-main, #e6edf3);
    }

    /* Clases de estado dinámicas en Modo Oscuro */
    body.dark-mode .status-protected {
        background-color: rgba(27, 94, 32, 0.2);
        color: #81c784;
        border-color: rgba(27, 94, 32, 0.4);
    }

    body.dark-mode .status-warning {
        background-color: rgba(230, 81, 0, 0.2);
        color: #ffb74d;
        border-color: rgba(230, 81, 0, 0.4);
    }

    body.dark-mode .status-info p {
        color: var(--text-muted, #848d97) !important;
    }

    /* Alertas en Modo Oscuro */
    body.dark-mode .alert-info {
        background-color: rgba(59, 130, 246, 0.15);
        color: #93c5fd;
        border-left-color: #3b82f6;
    }

    body.dark-mode .alert-success {
        background-color: rgba(34, 197, 94, 0.15);
        color: #86efac;
        border-left-color: #22c55e;
    }

    body.dark-mode .alert-danger {
        background-color: rgba(239, 68, 68, 0.15);
        color: #fca5a5;
        border-left-color: #ef4444;
    }

    /* Botón de Cancelar en Modo Oscuro */
    body.dark-mode .btn-cancel {
        border-color: var(--border-color);
        color: var(--text-main);
    }

    body.dark-mode .btn-cancel:hover {
        background-color: rgba(255, 255, 255, 0.05);
    }

    /* Tarjeta de soporte en Modo Oscuro */
    .support-card {
        background: rgba(249, 250, 251, 0.5) !important;
    }

    body.dark-mode .support-card {
        background: rgba(255, 255, 255, 0.03) !important;
    }

    body.dark-mode .support-card h4, 
    body.dark-mode .support-card p {
        color: var(--text-muted, #848d97) !important;
    }

    /* Modal de éxito animado */
    .success-modal-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(10, 14, 20, 0.85);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .success-modal-overlay.active {
        opacity: 1;
        pointer-events: auto;
    }
    .success-modal {
        background: var(--card-bg, #fff);
        padding: 40px;
        border-radius: 20px;
        width: 90%;
        max-width: 420px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        transform: translateY(30px) scale(0.95);
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        text-align: center;
        border: 1px solid var(--border-color, rgba(255, 255, 255, 0.05));
    }
    .success-modal-overlay.active .success-modal {
        transform: translateY(0) scale(1);
    }
    .success-circle-check {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background: rgba(34, 197, 94, 0.15);
        color: #22c55e;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        margin: 0 auto 20px auto;
        box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);
        animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes scaleIn {
        0% { transform: scale(0); }
        100% { transform: scale(1); }
    }
    .success-modal h3 {
        margin: 0 0 10px 0;
        color: var(--text-main, #1f2937);
        font-size: 1.5rem;
        font-weight: 700;
    }
    .success-modal p {
        color: var(--text-muted, #6b7280);
        font-size: 0.95rem;
        margin: 0 0 25px 0;
        line-height: 1.5;
    }
    .loading-bar-container {
        width: 100%;
        height: 6px;
        background: var(--border-color, #e5e7eb);
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 12px;
    }
    .loading-bar {
        width: 0%;
        height: 100%;
        background: var(--primary, #22c55e);
        border-radius: 3px;
        transition: width 2s linear;
    }

    /* Tooltip de ayuda */
    .rp-help {
        position: relative;
        display: inline-flex;
        align-items: center;
        cursor: help;
        margin-left: 6px;
    }
    .rp-help-icon {
        width: 16px; height: 16px;
        border-radius: 50%;
        background: rgba(0,0,0,0.06);
        border: 1px solid rgba(0,0,0,0.12);
        color: rgba(0,0,0,0.4);
        font-size: 10px;
        font-weight: 700;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.2s;
        font-style: normal;
    }
    body.dark-mode .rp-help-icon {
        background: rgba(255,255,255,0.12);
        border: 1px solid rgba(255,255,255,0.2);
        color: rgba(255,255,255,0.5);
    }
    .rp-help:hover .rp-help-icon {
        background: var(--primary, #333333);
        border-color: var(--primary, #333333);
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

    /* Contador de caracteres */
    .char-counter-container {
        display: flex;
        justify-content: flex-end;
        margin-top: 4px;
    }
    .char-counter {
        font-size: 0.72rem;
        color: var(--text-muted, #9ca3af);
        font-weight: 500;
        transition: color 0.2s ease;
    }
    .char-counter.warning {
        color: #f59e0b;
    }
    .char-counter.limit {
        color: #ef4444;
    }

    /* Banner de cambios pendientes */
    .pending-banner {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        background-color: rgba(245, 158, 11, 0.08);
        color: #f59e0b;
        border: 1px solid rgba(245, 158, 11, 0.15);
        border-radius: 8px;
        font-size: 0.8rem;
        font-weight: 600;
        margin-top: 15px;
        opacity: 0;
        pointer-events: none;
        transform: translateY(6px);
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .pending-banner.active {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0);
    }
    body.dark-mode .pending-banner {
        background-color: rgba(245, 158, 11, 0.12);
        color: #fcd34d;
        border-color: rgba(245, 158, 11, 0.2);
    }
</style>

<div class="sidebar">
    <h3>Sistema de Nóminas</h3>
    <div id="user-info-panel">
        <p id="username-display">{{ auth()->user()->name }}</p>
        
        @if(auth()->user()->Id_rol == 3)
            <a href="/superusuario" class="btn-back-sidebar">
                <i class="fas fa-arrow-left"></i> Volver al Panel
            </a>
        @elseif(auth()->user()->Id_rol == 1)
            <a href="/administrativo" class="btn-back-sidebar">
                <i class="fas fa-arrow-left"></i> Volver al Panel
            </a>
        @else
            <a href="/trabajador" class="btn-back-sidebar">
                <i class="fas fa-arrow-left"></i> Volver al Panel
            </a>
        @endif
    </div>
    
    <div style="margin-top: auto; padding: 20px; text-align: center; padding-bottom: 25px;">
        <img src="{{ asset('img/logo-exacto.png') }}" alt="Logo Lufra" style="width: 230px; max-width: 100%; height: auto; border-radius: 8px;" />
    </div>
</div>

<div class="main-security-content">
    
    <div class="security-header-area">
        <div style="background: var(--primary, #333333); width: 8px; height: 30px; border-radius: 4px;"></div>
        <h1>Centro de Seguridad Avanzada</h1>
    </div>

    <div class="security-grid">
        
        <div class="setup-card-modern">
            <!-- Cabecera de estado de seguridad -->
            <div class="security-status-badge {{ isset($preguntaActual) ? 'protected' : 'vulnerable' }}">
                @if(isset($preguntaActual))
                    <i class="fas fa-shield-alt"></i>
                    <span>Protección Activa • Modificado {{ \Carbon\Carbon::parse($preguntaActual->updated_at)->diffForHumans() }}</span>
                @else
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Cuenta Vulnerable • Configuración Requerida</span>
                @endif
            </div>
            
            @if(session('info'))
                <div class="custom-alert alert-info">
                    <i class="fas fa-info-circle"></i> {{ session('info') }}
                </div>
            @endif

            @if(session('success'))
                <div class="custom-alert alert-success">
                    <i class="fas fa-check-circle"></i> {{ session('success') }}
                </div>
            @endif

            @if($errors->has('current_password'))
                <div class="custom-alert alert-danger">
                    <i class="fas fa-exclamation-circle"></i> {{ $errors->first('current_password') }}
                </div>
            @endif
            @if($errors->has('respuesta'))
                <div class="custom-alert alert-danger">
                    <i class="fas fa-exclamation-circle"></i> {{ $errors->first('respuesta') }}
                </div>
            @endif
            @if($errors->has('pregunta_id'))
                <div class="custom-alert alert-danger">
                    <i class="fas fa-exclamation-circle"></i> {{ $errors->first('pregunta_id') }}
                </div>
            @endif

            <form id="setupQuestionsForm" action="{{ route('seguridad.guardar-preguntas') }}" method="POST">
                @csrf
                <input type="hidden" name="current_password" id="hidden_current_password" value="">
                
                <div class="form-group-modern">
                    <label for="pregunta1">
                        <i class="fas fa-question-circle" style="color: var(--primary, #10a87a);"></i>
                        Selecciona tu Pregunta Secreta
                        <span class="rp-help">
                            <i class="rp-help-icon">?</i>
                            <span class="rp-tooltip">Elige una pregunta cuya respuesta sea estable en el tiempo y fácil de recordar para ti.</span>
                        </span>
                    </label>
                    <div class="input-wrapper-icon">
                        <i class="fas fa-list field-icon"></i>
                        <select name="pregunta_id" id="pregunta1" class="form-control-modern" required style="padding-left: 45px;">
                            <option value="" disabled {{ !isset($preguntaActual) ? 'selected' : '' }}>Elige una pregunta clave...</option>
                            @foreach($preguntas as $pregunta)
                                <option value="{{ $pregunta->id }}" 
                                    {{ (isset($preguntaActual) && $preguntaActual->pregunta_id == $pregunta->id) ? 'selected' : '' }}>
                                    {{ $pregunta->pregunta }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>

                <div class="form-group-modern">
                    <label for="respuesta1">
                        <i class="fas fa-key" style="color: var(--primary, #10a87a);"></i>
                        Tu Respuesta de Seguridad
                        <span class="rp-help">
                            <i class="rp-help-icon">?</i>
                            <span class="rp-tooltip">La respuesta debe tener mínimo 4 caracteres y un máximo de 50. Evita respuestas obvias.</span>
                        </span>
                    </label>
                    <div class="input-wrapper-icon">
                        <i class="fas fa-lock field-icon"></i>
                        <input type="password" name="respuesta" id="respuesta1" class="form-control-modern" required maxlength="50"
                            placeholder="{{ isset($preguntaActual) ? 'Escribe una nueva respuesta si deseas cambiarla' : 'Escribe tu respuesta secreta aquí' }}" 
                            autocomplete="off">
                        <button type="button" class="toggle-password-btn" onclick="toggleResponseVisibility()">
                            <i id="eye-icon" class="fas fa-eye"></i>
                        </button>
                    </div>

                    <div class="char-counter-container">
                        <span id="char-counter" class="char-counter">0 / 50</span>
                    </div>

                    <div id="whitespace-feedback" class="realtime-feedback" style="display: none; color: #ef4444; margin-top: 6px;"></div>
                    
                    <!-- Barra de fuerza de la respuesta -->
                    <div class="strength-bar-container" id="strengthBarContainer" style="display: none; margin-top: 10px;">
                        <div class="strength-segments">
                            <div class="strength-segment" id="answ-seg1"></div>
                            <div class="strength-segment" id="answ-seg2"></div>
                            <div class="strength-segment" id="answ-seg3"></div>
                        </div>
                        <div class="strength-feedback-text" id="strengthFeedbackText"></div>
                    </div>
                </div>

                <div class="form-group-modern">
                    <label for="respuesta1_confirmation">
                        <i class="fas fa-key" style="color: var(--primary, #10a87a);"></i>
                        Confirmar Respuesta de Seguridad
                        <span class="rp-help">
                            <i class="rp-help-icon">?</i>
                            <span class="rp-tooltip">Debe coincidir exactamente con la respuesta ingresada arriba.</span>
                        </span>
                    </label>
                    <div class="input-wrapper-icon">
                        <i class="fas fa-lock field-icon"></i>
                        <input type="password" id="respuesta1_confirmation" class="form-control-modern" required maxlength="50"
                            placeholder="Repite tu respuesta secreta" 
                            autocomplete="off">
                        <button type="button" class="toggle-password-btn" onclick="toggleConfirmResponseVisibility()">
                            <i id="confirm-eye-icon" class="fas fa-eye"></i>
                        </button>
                    </div>
                    <div id="match-feedback" class="realtime-feedback"></div>
                </div>

                <!-- Cambio Opcional de Contraseña -->
                <div style="margin: 25px 0 15px 0; border-top: 1px dashed var(--border-color); padding-top: 20px;">
                    <h4 style="margin: 0 0 15px 0; font-size: 0.95rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-shield-alt" style="color: var(--primary, #10a87a);"></i>
                        Cambiar Contraseña (Opcional)
                    </h4>
                </div>

                <div class="form-group-modern">
                    <label for="new_password">
                        <i class="fas fa-lock" style="color: var(--primary, #10a87a);"></i>
                        Nueva Contraseña
                        <span class="rp-help">
                            <i class="rp-help-icon">?</i>
                            <span class="rp-tooltip">Mínimo 8 caracteres. Evita contraseñas usadas recientemente.</span>
                        </span>
                    </label>
                    <div class="input-wrapper-icon">
                        <i class="fas fa-key field-icon"></i>
                        <input type="password" name="new_password" id="new_password" class="form-control-modern" minlength="8" placeholder="Escribe tu nueva contraseña si deseas cambiarla" autocomplete="new-password">
                        <button type="button" class="toggle-password-btn" onclick="toggleVisibility('new_password', 'new-pass-eye-icon')">
                            <i id="new-pass-eye-icon" class="fas fa-eye"></i>
                        </button>
                    </div>
                    
                    <!-- Barra de fuerza de la nueva contraseña -->
                    <div class="strength-bar-container" id="passStrengthBarContainer" style="display: none; margin-top: 10px;">
                        <div class="strength-segments">
                            <div class="strength-segment" id="pass-seg1"></div>
                            <div class="strength-segment" id="pass-seg2"></div>
                            <div class="strength-segment" id="pass-seg3"></div>
                        </div>
                        <div class="strength-feedback-text" id="passStrengthFeedbackText"></div>
                    </div>
                </div>

                <div class="form-group-modern">
                    <label for="new_password_confirmation">
                        <i class="fas fa-lock" style="color: var(--primary, #10a87a);"></i>
                        Confirmar Nueva Contraseña
                        <span class="rp-help">
                            <i class="rp-help-icon">?</i>
                            <span class="rp-tooltip">Debe coincidir exactamente con la nueva contraseña.</span>
                        </span>
                    </label>
                    <div class="input-wrapper-icon">
                        <i class="fas fa-key field-icon"></i>
                        <input type="password" name="new_password_confirmation" id="new_password_confirmation" class="form-control-modern" placeholder="Repite tu nueva contraseña" autocomplete="new-password">
                        <button type="button" class="toggle-password-btn" onclick="toggleVisibility('new_password_confirmation', 'new-confirm-eye-icon')">
                            <i id="new-confirm-eye-icon" class="fas fa-eye"></i>
                        </button>
                    </div>
                    <div id="new-pass-match-feedback" class="realtime-feedback"></div>
                </div>

                <!-- Banner de cambios pendientes -->
                <div id="pending-changes-banner" class="pending-banner" style="margin-bottom: 20px;">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Tienes cambios pendientes de guardar en tu configuración de seguridad.</span>
                </div>

                <button type="submit" class="btn-save-modern" id="btnSaveQuestions" disabled>
                    <i class="fas fa-shield-alt"></i>
                    {{ isset($preguntaActual) ? 'ACTUALIZAR PARÁMETROS DE SEGURIDAD' : 'ACTIVAR PROTECCIÓN DE CUENTA' }}
                </button>
            </form>
        </div>

        <div class="info-side-panel">
            
            <div class="status-card">
                @if(isset($preguntaActual))
                    <div class="status-icon-box status-protected">
                        <i class="fas fa-user-shield"></i>
                    </div>
                    <div class="status-info">
                        <h5 style="color: #1b5e20;">Cuenta Protegida</h5>
                        <p>Ya tienes un parámetro de recuperación configurado correctamente.</p>
                    </div>
                @else
                    <div class="status-icon-box status-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="status-info">
                        <h5 style="color: #e65100;">Acceso Vulnerable</h5>
                        <p>Por favor, configura tu pregunta para evitar perder el acceso a tus nóminas.</p>
                    </div>
                @endif
            </div>

            <div class="utility-card">
                <h4><i class="fas fa-lightbulb" style="color: #ffb300;"></i> Consejos Prácticos</h4>
                <ul class="tips-list">
                    <li>
                        <i class="fas fa-shield-halved"></i>
                        <span>Elige una respuesta que sea fácil de recordar para ti, pero imposible de adivinar para otros.</span>
                    </li>
                    <li>
                        <i class="fas fa-shield-halved"></i>
                        <span>El campo distingue entre mayúsculas, minúsculas y acentos al momento de recuperar.</span>
                    </li>
                    <li>
                        <i class="fas fa-shield-halved"></i>
                        <span>Nunca compartas la respuesta secreta de tu ficha de empleado con el resto del personal.</span>
                    </li>
                </ul>
            </div>

            <div class="utility-card support-card">
                <h4 style="font-size: 0.95rem; color: #6b7280; margin-bottom: 5px;"><i class="fas fa-info-circle"></i> Soporte de Cuenta</h4>
                <p style="margin: 0; font-size: 0.85rem; color: #6b7280; line-height: 1.4;">
                    Si presentas problemas persistentes con tus credenciales de Lufra 2020, comunícate directamente con el departamento administrativo de sistemas.
                </p>
            </div>

        </div>

    </div>
</div>

<!-- Modal para confirmar contraseña -->
<div class="password-modal-overlay" id="passwordModal">
    <div class="password-modal">
        <h3><i class="fas fa-lock" style="color:var(--primary,#333333);"></i> Confirmar Identidad</h3>
        <p>Para guardar los cambios en tus parámetros de seguridad, por favor ingresa tu contraseña actual.</p>
        
        <div class="input-wrapper-icon">
            <i class="fas fa-key field-icon"></i>
            <input type="password" id="modal_password_input" class="form-control-modern" placeholder="Contraseña actual" style="padding-left: 45px;">
            <button type="button" class="toggle-password-btn" onclick="toggleModalPasswordVisibility()">
                <i id="modal-eye-icon" class="fas fa-eye"></i>
            </button>
        </div>
        <div id="modal_error_msg" style="color: #e74c3c; font-size: 0.85rem; margin-top: 5px; display: none;">Debe ingresar su contraseña.</div>

        <div class="modal-actions">
            <button type="button" class="btn-cancel" onclick="closePasswordModal()">Cancelar</button>
            <button type="button" class="btn-confirm" onclick="submitWithPassword()">Confirmar y Guardar</button>
        </div>
    </div>
</div>

<!-- Modal de éxito animado -->
<div class="success-modal-overlay" id="successModal">
    <div class="success-modal">
        <div class="success-circle-check">
            <i class="fas fa-check"></i>
        </div>
        <h3>¡Protección Activada!</h3>
        <p>Tus parámetros de seguridad han sido actualizados con éxito.</p>
        <div class="loading-bar-container">
            <div class="loading-bar" id="successLoadingBar"></div>
        </div>
        <span style="font-size: 0.8rem; color: #848d97;">Redirigiéndote al panel principal...</span>
    </div>
</div>

<script>
    // Función genérica para alternar visibilidad de contraseña
    function toggleVisibility(inputId, eyeIconId) {
        const input = document.getElementById(inputId);
        const eyeIcon = document.getElementById(eyeIconId);
        if (input.type === 'password') {
            input.type = 'text';
            eyeIcon.classList.remove('fa-eye');
            eyeIcon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            eyeIcon.classList.remove('fa-eye-slash');
            eyeIcon.classList.add('fa-eye');
        }
    }

    // Funciones legacy adaptadas
    function toggleResponseVisibility() { toggleVisibility('respuesta1', 'eye-icon'); }
    function toggleConfirmResponseVisibility() { toggleVisibility('respuesta1_confirmation', 'confirm-eye-icon'); }
    function toggleModalPasswordVisibility() { toggleVisibility('modal_password_input', 'modal-eye-icon'); }

    // DOM Elements
    const form = document.getElementById('setupQuestionsForm');
    const modal = document.getElementById('passwordModal');
    const passInput = document.getElementById('modal_password_input');
    const hiddenPassInput = document.getElementById('hidden_current_password');
    const errorMsg = document.getElementById('modal_error_msg');
    
    const questionSelect = document.getElementById('pregunta1');
    const responseInput = document.getElementById('respuesta1');
    const confirmInput = document.getElementById('respuesta1_confirmation');
    const saveBtn = document.getElementById('btnSaveQuestions');
    const matchFb = document.getElementById('match-feedback');
    
    const newPassInput = document.getElementById('new_password');
    const newPassConfirmInput = document.getElementById('new_password_confirmation');
    const newPassMatchFb = document.getElementById('new-pass-match-feedback');
    
    const strengthContainer = document.getElementById('strengthBarContainer');
    const strengthText = document.getElementById('strengthFeedbackText');
    const segments = [1, 2, 3].map(i => document.getElementById('answ-seg' + i));
    
    const passStrengthContainer = document.getElementById('passStrengthBarContainer');
    const passStrengthText = document.getElementById('passStrengthFeedbackText');
    const passSegments = [1, 2, 3].map(i => document.getElementById('pass-seg' + i));
    
    const charCounter = document.getElementById('char-counter');
    const whitespaceFeedback = document.getElementById('whitespace-feedback');
    const pendingBanner = document.getElementById('pending-changes-banner');
    const initialQuestionId = questionSelect.value;

    // STRENGTH CONFIG
    const STRENGTH_CONFIG = [
        { color: '#ef4444', label: 'Muy corta (Insegura) ❌' },
        { color: '#eab308', label: 'Aceptable ⚠️' },
        { color: '#22c55e', label: 'Excelente (Segura) ✨' }
    ];

    function updateStrength(val) {
        if (!val.trim()) {
            strengthContainer.style.display = 'none';
            return 0;
        }
        
        strengthContainer.style.display = 'block';
        let score = 0; // 0: <4, 1: 4-7, 2: >=8
        if (val.length >= 4 && val.length < 8) {
            score = 1;
        } else if (val.length >= 8) {
            score = 2;
        }
        
        const cfg = STRENGTH_CONFIG[score];
        segments.forEach((seg, i) => {
            seg.style.background = i <= score ? cfg.color : 'rgba(0, 0, 0, 0.08)';
        });
        
        strengthText.textContent = cfg.label;
        strengthText.style.color = cfg.color;
        
        return score;
    }

    function checkMatch() {
        const r1 = responseInput.value.trim();
        const r2 = confirmInput.value.trim();
        
        if (!r2) {
            matchFb.textContent = '';
            confirmInput.className = 'form-control-modern';
            return false;
        }
        
        if (r1 === r2) {
            matchFb.innerHTML = '<span style="color:#22c55e;"><i class="fas fa-check"></i> Las respuestas coinciden</span>';
            confirmInput.classList.remove('is-invalid');
            confirmInput.classList.add('is-valid');
            return true;
        } else {
            matchFb.innerHTML = '<span style="color:#ef4444;"><i class="fas fa-times"></i> Las respuestas no coinciden</span>';
            confirmInput.classList.remove('is-valid');
            confirmInput.classList.add('is-invalid');
            return false;
        }
    }

    function checkNewPassMatch() {
        const p1 = newPassInput.value;
        const p2 = newPassConfirmInput.value;
        
        if (!p2) {
            newPassMatchFb.textContent = '';
            newPassConfirmInput.className = 'form-control-modern';
            return false;
        }
        
        if (p1 === p2) {
            newPassMatchFb.innerHTML = '<span style="color:#22c55e;"><i class="fas fa-check"></i> Las contraseñas coinciden</span>';
            newPassConfirmInput.classList.remove('is-invalid');
            newPassConfirmInput.classList.add('is-valid');
            return true;
        } else {
            newPassMatchFb.innerHTML = '<span style="color:#ef4444;"><i class="fas fa-times"></i> Las contraseñas no coinciden</span>';
            newPassConfirmInput.classList.remove('is-valid');
            newPassConfirmInput.classList.add('is-invalid');
            return false;
        }
    }

    function updatePassStrength(val) {
        if (!val) {
            passStrengthContainer.style.display = 'none';
            return 0;
        }
        
        passStrengthContainer.style.display = 'block';
        let score = 0; // 0: <6, 1: 6-7, 2: >=8
        if (val.length >= 6 && val.length < 8) {
            score = 1;
        } else if (val.length >= 8) {
            score = 2;
        }
        
        const cfg = STRENGTH_CONFIG[score];
        passSegments.forEach((seg, i) => {
            seg.style.background = i <= score ? cfg.color : 'rgba(0, 0, 0, 0.08)';
        });
        
        passStrengthText.textContent = cfg.label;
        passStrengthText.style.color = cfg.color;
        
        return score;
    }

    function validateForm() {
        const questionOk = !!questionSelect.value;
        const r1Raw = responseInput.value;
        const r1 = r1Raw.trim();
        
        // Whitespace only validation
        const hasWhitespaceOnly = r1Raw.length > 0 && r1.length === 0;
        if (hasWhitespaceOnly) {
            whitespaceFeedback.textContent = 'La respuesta no puede contener únicamente espacios en blanco.';
            whitespaceFeedback.style.display = 'block';
            responseInput.classList.add('is-invalid');
            responseInput.classList.remove('is-valid');
        } else {
            whitespaceFeedback.style.display = 'none';
        }
        
        const responseLengthOk = r1.length >= 4 && !hasWhitespaceOnly;
        const matchOk = r1 === confirmInput.value.trim() && r1.length > 0;
        
        // Response border status
        if (r1Raw.length === 0) {
            responseInput.className = 'form-control-modern';
        } else if (responseLengthOk) {
            responseInput.classList.add('is-valid');
            responseInput.classList.remove('is-invalid');
        } else if (!hasWhitespaceOnly) {
            responseInput.classList.add('is-invalid');
            responseInput.classList.remove('is-valid');
        }
        
        // Validar nueva contraseña si se ha rellenado
        let newPassOk = true;
        const npVal = newPassInput.value;
        if (npVal.length > 0) {
            newPassOk = npVal.length >= 8 && npVal === newPassConfirmInput.value;
            if (npVal.length >= 8) {
                newPassInput.classList.remove('is-invalid');
                newPassInput.classList.add('is-valid');
            } else {
                newPassInput.classList.remove('is-valid');
                newPassInput.classList.add('is-invalid');
            }
        } else {
            newPassInput.className = 'form-control-modern';
            newPassConfirmInput.className = 'form-control-modern';
            newPassMatchFb.textContent = '';
        }
        
        // Pending changes banner control
        const isDirty = questionSelect.value !== initialQuestionId || r1Raw.length > 0 || confirmInput.value.length > 0 || npVal.length > 0;
        if (isDirty) {
            pendingBanner.classList.add('active');
        } else {
            pendingBanner.classList.remove('active');
        }
        
        const isReady = questionOk && responseLengthOk && matchOk && newPassOk;
        saveBtn.disabled = !isReady;
    }

    // Event Listeners
    questionSelect.addEventListener('change', validateForm);
    
    responseInput.addEventListener('input', () => {
        const len = responseInput.value.length;
        charCounter.textContent = `${len} / 50`;
        charCounter.className = 'char-counter';
        if (len >= 40 && len < 50) {
            charCounter.classList.add('warning');
        } else if (len >= 50) {
            charCounter.classList.add('limit');
        }

        updateStrength(responseInput.value);
        checkMatch();
        validateForm();
    });
    
    confirmInput.addEventListener('input', () => {
        checkMatch();
        validateForm();
    });
    
    newPassInput.addEventListener('input', () => {
        updatePassStrength(newPassInput.value);
        checkNewPassMatch();
        validateForm();
    });
    
    newPassConfirmInput.addEventListener('input', () => {
        checkNewPassMatch();
        validateForm();
    });

    // Form Intercept & Password verification
    form.addEventListener('submit', function(e) {
        if (!hiddenPassInput.value) {
            e.preventDefault();
            
            const pId = questionSelect.value;
            const r1 = responseInput.value.trim();
            const r2 = confirmInput.value.trim();
            
            // Validar campos de nueva contraseña
            const npVal = newPassInput.value;
            let newPassOk = true;
            if (npVal.length > 0) {
                newPassOk = npVal.length >= 8 && npVal === newPassConfirmInput.value;
            }
            
            if (!pId || r1.length < 4 || r1 !== r2 || !newPassOk) {
                form.reportValidity();
                return;
            }

            modal.classList.add('active');
            passInput.value = '';
            passInput.focus();
            errorMsg.style.display = 'none';
        }
    });

    function closePasswordModal() {
        modal.classList.remove('active');
        hiddenPassInput.value = '';
        passInput.value = '';
        errorMsg.style.display = 'none';
    }

    async function submitWithPassword() {
        const pass = passInput.value;
        if (!pass) {
            errorMsg.innerText = 'Debe ingresar su contraseña.';
            errorMsg.style.display = 'block';
            passInput.focus();
            return;
        }
        
        errorMsg.style.display = 'none';
        hiddenPassInput.value = pass;

        const confirmBtn = document.querySelector('.btn-confirm');
        const originalBtnText = confirmBtn.innerHTML;
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors && data.errors.current_password) {
                    errorMsg.innerText = data.errors.current_password[0];
                    errorMsg.style.display = 'block';
                } else if (data.errors && data.errors.new_password) {
                    closePasswordModal();
                    alert(data.errors.new_password[0]);
                } else if (data.errors && data.errors.respuesta) {
                    closePasswordModal();
                    alert(data.errors.respuesta[0]);
                } else if (data.errors && data.errors.pregunta_id) {
                    closePasswordModal();
                    alert(data.errors.pregunta_id[0]);
                } else {
                    errorMsg.innerText = data.message || 'Error al procesar la solicitud.';
                    errorMsg.style.display = 'block';
                }
                confirmBtn.disabled = false;
                confirmBtn.innerHTML = originalBtnText;
                passInput.focus();
                return;
            }

            closePasswordModal();

            const successModal = document.getElementById('successModal');
            const successLoadingBar = document.getElementById('successLoadingBar');
            
            successModal.classList.add('active');
            
            setTimeout(() => {
                successLoadingBar.style.width = '100%';
            }, 50);

            setTimeout(() => {
                window.location.href = data.redirect;
            }, 2100);

        } catch (error) {
            console.error('Error:', error);
            errorMsg.innerText = 'Error de conexión con el servidor.';
            errorMsg.style.display = 'block';
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = originalBtnText;
        }
    }

    passInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitWithPassword();
        }
    });

    // Run initial validation state on load
    document.addEventListener('DOMContentLoaded', () => {
        validateForm();
    });
</script>
@endsection