@extends('layouts.app')

@section('title', 'Iniciar Sesión')

@section('content')

<!-- Theme Toggle Button -->
<button id="theme-toggle" class="theme-btn" aria-label="Cambiar tema">
    <!-- Icono de Luna (para activar modo oscuro) por defecto -->
    <svg id="moon-icon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
    <!-- Icono de Sol (para activar modo claro) oculto por defecto -->
    <svg id="sun-icon" viewBox="0 0 24 24" style="display:none;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
</button>

<main class="login-wrapper" role="main">
    <div class="login-card-container">
        
        <!-- The skewed blue background that covers the right side -->
        <div class="bg-slant"></div>

        <!-- Left Column: Logo and Branding -->
        <aside class="hero" aria-hidden="false" role="img" aria-label="Branding area">
            <div class="brand-content">
                <h1 class="brand-title">LUFRA2020</h1>
                <p class="brand-subtitle">SISTEMA PARA EL CONTROL DE NOMINAS</p>
            </div>
        </aside>

        <!-- Right Column: Login Form -->
        <div class="form-column">
            <form id="loginForm" class="form" novalidate>
                @if(session('logout_msg'))
                    <div style="background-color: rgba(239, 68, 68, 0.2); color: #fca5a5; padding: 10px; border-radius: 5px; margin-bottom: 20px; text-align: center; border: 1px solid rgba(239, 68, 68, 0.3); font-size: 0.9em;">
                        {{ session('logout_msg') }}
                    </div>
                @endif
                
                <div class="field">
                    <label for="username">Your email</label>
                    <div class="input-row">
                        <input type="text" id="username" name="username" placeholder="Enter your email" required autocomplete="username" />
                    </div>
                </div>
                
                <div class="field">
                    <label for="password">Password</label>
                    <div class="input-row">
                        <input type="password" id="password" name="password" placeholder="Enter your password" required autocomplete="current-password" />
                        <button type="button" class="toggle-pass" aria-label="Mostrar contraseña">
                            <!-- SVG eye icon (simple outline) -->
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                    </div>
                </div>
                
                <div class="form-options">
                    <label class="checkbox-container">
                        <input type="checkbox" id="remember" name="remember">
                        <span class="checkmark"></span>
                        Remember me
                    </label>
                    <a href="#" class="forgot-link">Recover password</a>
                </div>

                <div class="actions">
                    <button class="btn primary" type="submit">
                        <span class="btn-text">SIGN IN</span>
                        <span class="spinner" aria-hidden="true"></span>
                    </button>
                </div>
                
                <div id="message" role="status" aria-live="polite"></div>
                <div class="success" id="successCard" aria-hidden="true" style="display:none;">
                    <div class="check">✓</div>
                    <p>Redirigiendo...</p>
                </div>
            </form>
        </div>
        
    </div>
</main>
<link rel="stylesheet" href="{{ asset('css/styleLogin.css') }}">
<script src="{{ asset('js/ScriptLogin.js') }}" defer></script>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const themeBtn = document.getElementById('theme-toggle');
        const moonIcon = document.getElementById('moon-icon');
        const sunIcon = document.getElementById('sun-icon');
        
        // Comprobar preferencia guardada
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        }

        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                moonIcon.style.display = 'none';
                sunIcon.style.display = 'block';
            } else {
                localStorage.setItem('theme', 'light');
                moonIcon.style.display = 'block';
                sunIcon.style.display = 'none';
            }
        });
    });
</script>
@endsection
