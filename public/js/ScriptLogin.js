// ScriptLogin.js limpio para login Laravel
(function () {
    // Elementos del DOM
    const loginForm = document.getElementById('loginForm');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const message = document.getElementById('message');

    // SVG para mostrar/ocultar contraseña
    const eyeSvg = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M1.5 12s4-7 10.5-7S22.5 12 22.5 12s-4 7-10.5 7S1.5 12 1.5 12z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    const eyeOffSvg = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M3 3l18 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.47 10.47A3 3 0 0113.53 13.53" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2.21 12.7C3.67 15.55 7.17 18 12 18c6.5 0 10.5-6 10.5-6s-1.99-2.55-4.58-4.19" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;

    // Mostrar/ocultar contraseña
    const toggleButtons = document.querySelectorAll('.toggle-pass');
    toggleButtons.forEach(btn => {
        btn.innerHTML = eyeSvg;
        btn.setAttribute('title', 'Mostrar contraseña');
        btn.setAttribute('aria-label', 'Mostrar contraseña');
        btn.addEventListener('click', () => {
            const row = btn.closest('.input-row');
            if (!row) return;
            const inp = row.querySelector('input[type="password"], input[type="text"]');
            if (!inp) return;
            const isPassword = inp.type === 'password';
            inp.type = isPassword ? 'text' : 'password';
            btn.innerHTML = isPassword ? eyeOffSvg : eyeSvg;
            btn.setAttribute('aria-pressed', isPassword ? 'true' : 'false');
            btn.setAttribute('title', isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
            btn.setAttribute('aria-label', isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
            inp.focus();
        });
    });

    // Validación de contraseña en tiempo real
    const pwCriteria = document.getElementById('pwCriteria');
    if (pwCriteria) {
        const pwRules = [
            { test: (pw) => pw.length >= 8, key: 'length' },
            { test: (pw) => /[a-z]/.test(pw), key: 'lower' },
            { test: (pw) => /[A-Z]/.test(pw), key: 'upper' },
            { test: (pw) => /[0-9]/.test(pw), key: 'number' },
            { test: (pw) => /[^a-zA-Z0-9]/.test(pw), key: 'special' }
        ];
        password.addEventListener('input', () => {
            const pw = password.value;
            pwRules.forEach(rule => {
                const li = pwCriteria.querySelector(`[data-rule="${rule.key}"]`);
                if (li) {
                    li.classList.toggle('pass', rule.test(pw));
                    li.classList.toggle('fail', !rule.test(pw));
                }
            });
        });
    }

    // Formulario de login
    if (loginForm) {
        loginForm.addEventListener('submit', async (ev) => {
            ev.preventDefault();
            message.classList.remove('show');
            const u = username.value.trim();
            const p = password.value;
            if (!u || !p) {
                if (!u) username.setAttribute('aria-invalid', 'true');
                if (!p) password.setAttribute('aria-invalid', 'true');
                loginForm.classList.remove('shake');
                void loginForm.offsetWidth;
                loginForm.classList.add('shake');
                message.textContent = 'Por favor completa todos los campos.';
                message.className = 'show error';
                if (!u) username.focus();
                else if (!p) password.focus();
                return;
            }
            username.removeAttribute('aria-invalid');
            password.removeAttribute('aria-invalid');
            const btn = loginForm.querySelector('.btn');
            btn.classList.add('loading');
            btn.setAttribute('aria-busy', 'true');
            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                
                const response = await fetch('login', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify({
                        username: u,
                        password: p
                    })
                });
                
                btn.classList.remove('loading');
                btn.removeAttribute('aria-busy');

                const contentType = response.headers.get("content-type");
                
                if (!response.ok) {
                    if (contentType && contentType.includes("application/json")) {
                        const errorData = await response.json();
                        message.textContent = errorData.message || 'Error en el login';
                    } else if (response.status === 419) {
                        message.textContent = 'La sesión ha expirado. Recarga la página.';
                    } else {
                        message.textContent = 'Error de servidor o credenciales (Status: ' + response.status + ')';
                    }
                    message.className = 'show error';
                    return;
                }

                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    let redirectUrl = '/';
                    const role = (data.role || '').toLowerCase();
                    
                    if (role === 'trabajador') {
                        redirectUrl = '/trabajador';
                    } else if (role === 'administrativo') {
                        redirectUrl = '/administrativo';
                    } else if (role === 'superusuario') {
                        redirectUrl = '/superusuario';
                    }
                    
                    message.textContent = 'Inicio de sesión exitoso. Redirigiendo...';
                    message.className = 'show success';
                    
                    setTimeout(() => {
                        window.location.href = redirectUrl;
                    }, 500);
                } else {
                    // Si el servidor devolvió HTML (redirect seguido por fetch)
                    // Probablemente el login ya estaba activo o hubo un redirect intermedio.
                    // Redirigimos al controlador que sabe a dónde enviar cada rol.
                    console.warn('Login exitoso pero respuesta no es JSON. Redirigiendo al manejador de roles.');
                    window.location.href = '/redirect-after-login';
                }
            } catch (error) {
                btn.classList.remove('loading');
                btn.removeAttribute('aria-busy');
                message.textContent = 'Error de conexión o servidor.';
                message.className = 'show error';
            }
        });
    }
})();
