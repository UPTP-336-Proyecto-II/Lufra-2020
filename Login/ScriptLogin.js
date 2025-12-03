(() => {
    // Elementos del DOM
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const message = document.getElementById('message');
    const regMessage = document.getElementById('regMessage');
    const successCard = document.getElementById('successCard');
    const loginCard = document.querySelector('.login-card');
    const registerCard = document.querySelector('.register-card');
    const toRegisterLink = document.getElementById('toRegister');
    const backToLoginLink = document.getElementById('backToLogin');

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

    // Función para mostrar mensajes
    function showMessage(text, type = 'info', compact = false) {
        message.textContent = text;
        message.className = `show ${type}${compact ? ' compact' : ''}`;
        message.style.color = type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#7f8c8d';
    }

    function showRegMessage(text, type = 'info') {
        regMessage.textContent = text;
        regMessage.className = `show ${type}`;
        regMessage.style.color = type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#7f8c8d';
    }

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
            if (inp) inp.focus();
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
            { test: (pw) => /[!@#$%^&*]/.test(pw), key: 'special' }
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

    // Estado de campos llenos
    [username, password].forEach(field => {
        if (field) {
            field.addEventListener('input', () => {
                field.closest('.field').classList.toggle('filled', field.value.trim() !== '');
            });
            field.addEventListener('change', () => {
                field.closest('.field').classList.toggle('filled', field.value.trim() !== '');
            });
            field.addEventListener('blur', () => {
                field.closest('.field').classList.toggle('filled', field.value.trim() !== '');
            });
        }
    });

    // Navegación entre formularios
    if (toRegisterLink) {
        toRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginCard.style.display = 'none';
            loginCard.setAttribute('aria-hidden', 'true');
            registerCard.style.display = '';
            registerCard.setAttribute('aria-hidden', 'false');
            const regName = document.getElementById('regName');
            if (regName) regName.focus();
        });
    }

    if (backToLoginLink) {
        backToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerCard.style.display = 'none';
            registerCard.setAttribute('aria-hidden', 'true');
            loginCard.style.display = '';
            loginCard.setAttribute('aria-hidden', 'false');
            if (username) username.focus();
        });
    }

    // Formulario de login
    if (loginForm) {
        loginForm.addEventListener('submit', async (ev) => {
            ev.preventDefault();
            message.classList.remove('show');

            const meta = document.querySelector('.meta');
            if (meta) {
                meta.style.display = 'none';
                meta.setAttribute('aria-hidden', 'true');
            }

            const u = username.value.trim();
            const p = password.value;

            if (!u || !p) {
                if (!u) {
                    username.setAttribute('aria-invalid', 'true');
                }
                if (!p) {
                    password.setAttribute('aria-invalid', 'true');
                }
                loginForm.classList.remove('shake');
                void loginForm.offsetWidth;
                loginForm.classList.add('shake');
                showMessage('Por favor completa todos los campos.', 'error');
                if (!u) username.focus();
                else if (!p) password.focus();
                if (meta) {
                    meta.style.display = '';
                    meta.removeAttribute('aria-hidden');
                }
                return;
            }

            username.removeAttribute('aria-invalid');
            password.removeAttribute('aria-invalid');

            const btn = loginForm.querySelector('.btn');
            btn.classList.add('loading');
            btn.setAttribute('aria-busy', 'true');

            try {
                const response = await fetch('http://localhost/ProyectoUni/php-backend/login.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: u, password: p })
                });

                const data = await response.json();

                btn.classList.remove('loading');
                btn.removeAttribute('aria-busy');

                if (response.ok) {
                    showMessage('Inicio de sesión exitoso', 'success');
                    if (meta) {
                        meta.style.display = '';
                        meta.removeAttribute('aria-hidden');
                    }

                    localStorage.setItem('payrollAuth', JSON.stringify({
                        username: u,
                        role: data.role,
                        logged: true,
                        token: data.token
                    }));

                    let redirectPage = '../Sistema Nomina/index.html';
                    if (data.role === 'Administrativo') redirectPage = '../Sistema Nomina/admin.html';
                    else if (data.role === 'Trabajador') redirectPage = '../Sistema Nomina/trabajador.html';
                    else if (data.role === 'SuperUsuario') redirectPage = '../Sistema Nomina/superusuario.html';

                    setTimeout(() => {
                        window.location.href = redirectPage;
                    }, 700);
                } else {
                    showMessage(data.error || 'Error en el login', 'error');
                    if (meta) {
                        meta.style.display = '';
                        meta.removeAttribute('aria-hidden');
                    }
                }
            } catch (error) {
                btn.classList.remove('loading');
                btn.removeAttribute('aria-busy');
                showMessage('Error de conexión', 'error');
                if (meta) {
                    meta.style.display = '';
                    meta.removeAttribute('aria-hidden');
                }
            }
        });
    }

    // Formulario de registro
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const ruser = document.getElementById('regUsername').value.trim();
            const rpw = document.getElementById('regPassword').value;
            const rpw2 = document.getElementById('regPasswordConfirm').value;
            const role = document.getElementById('regRole').value;

            if (!name || !email || !ruser || !rpw || !rpw2) {
                showRegMessage('Por favor completa todos los campos.', 'error');
                return;
            }

            const emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if (!emailOK) {
                showRegMessage('Introduce un correo válido.', 'error');
                return;
            }

            if (rpw !== rpw2) {
                showRegMessage('Las contraseñas no coinciden.', 'error');
                return;
            }

            const failedReg = [
                { test: (pw) => pw.length >= 8, msg: 'Al menos 8 caracteres' },
                { test: (pw) => /[a-z]/.test(pw), msg: 'Al menos una letra minúscula' },
                { test: (pw) => /[A-Z]/.test(pw), msg: 'Al menos una letra mayúscula' },
                { test: (pw) => /[0-9]/.test(pw), msg: 'Al menos un número' },
                { test: (pw) => /[!@#$%^&*]/.test(pw), msg: 'Al menos un carácter especial' }
            ].filter(rule => !rule.test(rpw));

            if (failedReg.length) {
                showRegMessage('La contraseña no cumple los requisitos.', 'error');
                return;
            }

            try {
                const response = await fetch('http://localhost/ProyectoUni/php-backend/registrar.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, username: ruser, password: rpw, role })
                });

                const data = await response.json();

                if (response.ok) {
                    showRegMessage('Cuenta creada con éxito', 'success');
                    setTimeout(() => {
                        registerForm.reset();
                        registerCard.style.display = 'none';
                        registerCard.setAttribute('aria-hidden', 'true');
                        loginCard.style.display = '';
                        loginCard.setAttribute('aria-hidden', 'false');
                        if (username) username.focus();
                    }, 900);
                } else {
                    showRegMessage(data.error || 'Error en el registro', 'error');
                }
            } catch (error) {
                showRegMessage('Error de conexión', 'error');
            }
        });
    }
})();
