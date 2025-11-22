(() => {
    const form = document.getElementById('loginForm');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const message = document.getElementById('message');
    const successCard = document.getElementById('successCard');

    // SVG para ojo / ojo-cerrado (inline por simplicidad)
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

    // Mostrar / ocultar contraseña para TODOS los botones .toggle-pass
    const toggleButtons = document.querySelectorAll('.toggle-pass');
    toggleButtons.forEach(btn => {
        // initialize icon and accessible label
        btn.innerHTML = eyeSvg;
        btn.setAttribute('title','Mostrar contraseña');
        btn.setAttribute('aria-label','Mostrar contraseña');

        btn.addEventListener('click', () => {
            const row = btn.closest('.input-row');
            if(!row) return;
            const inp = row.querySelector('input[type="password"], input[type="text"]');
            if(!inp) return;
            const isPassword = inp.type === 'password';
            inp.type = isPassword ? 'text' : 'password';
            // update icon and labels
            if(isPassword){
                btn.innerHTML = eyeOffSvg;
                btn.setAttribute('aria-pressed','true');
                btn.setAttribute('title','Ocultar contraseña');
                btn.setAttribute('aria-label','Ocultar contraseña');
            } else {
                btn.innerHTML = eyeSvg;
                btn.setAttribute('aria-pressed','false');
                btn.setAttribute('title','Mostrar contraseña');
                btn.setAttribute('aria-label','Mostrar contraseña');
            }
            inp.focus();
        });
    });

    // Helper: mostrar mensaje
    // compact = true -> aplicar estilo más compacto para mensajes de requisitos
    function showMessage(text, kind = 'info', compact = false){
        // remove compact if present and not requested
        if(!compact) message.classList.remove('compact');
        message.textContent = text;
        message.style.color = kind === 'error' ? '#ef4444' : (kind === 'success' ? '#10b981' : 'var(--muted)');
        message.classList.add('show');
        if(compact) message.classList.add('compact');
    }

    // Gestionar clase 'filled' en campos con contenido (mejora cross-browser)
    function updateFilled(el){
        const field = el.closest('.field');
        if(!field) return;
        if(el.value && el.value.toString().trim() !== ''){
            field.classList.add('filled');
        } else {
            field.classList.remove('filled');
        }
    }

    // Reglas de validación de contraseña
    const pwCriteriaEl = document.getElementById('pwCriteria');
    const pwRules = [
        {key:'length', test: v => v.length >= 8},
        {key:'lower', test: v => /[a-z]/.test(v)},
        {key:'upper', test: v => /[A-Z]/.test(v)},
        {key:'number', test: v => /[0-9]/.test(v)},
        {key:'special', test: v => /[!@#\$%\^&\*]/.test(v)},
    ];

    // Almacenamiento simple de usuarios usando localStorage
    function loadUsers(){
        try{
            const raw = localStorage.getItem('users');
            return raw ? JSON.parse(raw) : null;
        }catch(e){ return null; }
    }
    function saveUsers(obj){
        try{ localStorage.setItem('users', JSON.stringify(obj)); }catch(e){}
    }

    // inicializar usuario por defecto 'admin' si no existe ninguno
    let users = loadUsers();
    if(!users){
        users = { admin: 'admin' };
        saveUsers(users);
    } else if(!users.admin){
        // ensure admin exists
        users.admin = 'admin';
        saveUsers(users);
    }

    function updatePwCriteria(val){
        if(!pwCriteriaEl) return;
        pwRules.forEach(r => {
            const li = pwCriteriaEl.querySelector(`li[data-rule="${r.key}"]`);
            if(!li) return;
            if(r.test(val)){
                li.classList.add('pass');
                li.classList.remove('fail');
            } else {
                li.classList.remove('pass');
                li.classList.add('fail');
            }
        });
    }

    // Inicializar estado 'filled' en los campos
    [username, password].forEach(i => updateFilled(i));
    // Escuchar cambios para actualizar clase
    [username, password].forEach(i => {
        i.addEventListener('input', () => updateFilled(i));
        i.addEventListener('change', () => updateFilled(i));
        i.addEventListener('blur', () => updateFilled(i));
    });

    // validación en vivo de la contraseña
    if(password){
        password.addEventListener('input', (e)=>{
            updatePwCriteria(e.target.value);
        });
        // initialize
        updatePwCriteria(password.value || '');
    }

    // Simula el envío con spinner y animaciones
    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        message.classList.remove('show');

        const meta = document.querySelector('.meta');
        if(meta){ meta.style.display = 'none'; meta.setAttribute('aria-hidden','true'); }

        const u = username.value.trim();
        const p = password.value;

        // validación simple
        if(!u || !p){
            // marcar inputs inválidos
            if(!u){ username.setAttribute('aria-invalid','true'); }
            if(!p){ password.setAttribute('aria-invalid','true'); }

            // shake animation
            form.classList.remove('shake');
            void form.offsetWidth; // force reflow
            form.classList.add('shake');
            showMessage('Por favor completa todos los campos.', 'error');

            // focus en primer campo vacío
            if(!u){ username.focus(); } else if(!p){ password.focus(); }

            // restaurar link de "olvidaste" cuando hay error
            if(meta){ meta.style.display = ''; meta.removeAttribute('aria-hidden'); }
            return;
        }

        // eliminar aria-invalid si estaba marcado
        username.removeAttribute('aria-invalid');
        password.removeAttribute('aria-invalid');

        // comprobar las credenciales frente a los usuarios guardados
        // recargar usuarios en caso de que hayan cambiado
        users = loadUsers() || users;
        if(!users[u]){
            showMessage('Usuario no encontrado. Por favor regístrate.', 'error');
            if(meta){ meta.style.display = ''; meta.removeAttribute('aria-hidden'); }
            username.focus();
            return;
        }

        if(users[u] !== p){
            showMessage('Usuario o contraseña incorrectos.', 'error');
            if(meta){ meta.style.display = ''; meta.removeAttribute('aria-hidden'); }
            password.focus();
            return;
        }

        // iniciar estado de carga (spinner)
        const btn = form.querySelector('.btn');
        btn.classList.add('loading');
        btn.setAttribute('aria-busy','true');

        // Simular llamada (puede reemplazarse por fetch real)
        setTimeout(() => {
            btn.classList.remove('loading');
            btn.removeAttribute('aria-busy');

            // Simular éxito cuando el usuario no sea 'error'
            if(u.toLowerCase() === 'error'){
                showMessage('Usuario o contraseña incorrectos.', 'error');
                // restore meta link in case it was hidden
                if(meta){ meta.style.display = ''; meta.removeAttribute('aria-hidden'); }
            } else {
                // éxito simple: mostrar mensaje dentro del cuadro
                showMessage('Inicio de sesión exitoso', 'success');
                // ensure any hidden meta link is restored for consistent UI
                if(meta){ meta.style.display = ''; meta.removeAttribute('aria-hidden'); }
            }
        }, 1000);
    });

    // pequeña mejora: eliminar la clase 'shake' después de la animación
    const style = document.createElement('style');
    style.textContent = '.shake{animation:shake .35s ease; } @keyframes shake{20%{transform:translateX(-6px)}60%{transform:translateX(6px)}100%{transform:translateX(0)}}';
    document.head.appendChild(style);

    // --- Manejo del formulario de registro ---
    const toRegister = document.getElementById('toRegister');
    const registerCard = document.getElementById('registerCard');
    const loginCard = document.querySelector('.login-card');
    const backToLogin = document.getElementById('backToLogin');
    const registerForm = document.getElementById('registerForm');
    const regMessage = document.getElementById('regMessage');

    // Mostrar mensaje en el formulario de registro
    function showRegMessage(text, kind = 'info'){
        if(!regMessage) return;
        regMessage.textContent = text;
        regMessage.style.color = kind === 'error' ? '#ef4444' : (kind === 'success' ? '#10b981' : 'var(--muted)');
        regMessage.style.opacity = '1';
    }

    if(toRegister && registerCard && loginCard){
        toRegister.addEventListener('click', (e)=>{
            e.preventDefault();
            loginCard.style.display = 'none';
            registerCard.style.display = 'flex';
            registerCard.removeAttribute('aria-hidden');
            const rname = document.getElementById('regName');
            if(rname) rname.focus();
        });
    }

    if(backToLogin && registerCard && loginCard){
        backToLogin.addEventListener('click', (e)=>{
            e.preventDefault();
            registerCard.style.display = 'none';
            registerCard.setAttribute('aria-hidden','true');
            loginCard.style.display = ''; // revert
            const u = document.getElementById('username');
            if(u) u.focus();
        });
    }

    if(registerForm){
        registerForm.addEventListener('submit', (e)=>{
            e.preventDefault();
            // gather fields
            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const ruser = document.getElementById('regUsername').value.trim();
            const rpw = document.getElementById('regPassword').value;
            const rpw2 = document.getElementById('regPasswordConfirm').value;

            if(!name || !email || !ruser || !rpw || !rpw2){
                showRegMessage('Por favor completa todos los campos.', 'error');
                return;
            }

            // basic email check
            const emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if(!emailOK){
                showRegMessage('Introduce un correo válido.', 'error');
                return;
            }

            if(rpw !== rpw2){
                showRegMessage('Las contraseñas no coinciden.', 'error');
                return;
            }

            // validate password rules
            const failedReg = pwRules.filter(r => !r.test(rpw)).map(r => r.key);
            if(failedReg.length){
                showRegMessage('La contraseña no cumple los requisitos.', 'error');
                return;
            }

            // save new user
            users = loadUsers() || {};
            if(users[ruser]){
                showRegMessage('El nombre de usuario ya existe.', 'error');
                return;
            }
            users[ruser] = rpw;
            saveUsers(users);

            showRegMessage('Cuenta creada con éxito', 'success');
            setTimeout(()=>{
                // reset and go back to login
                registerForm.reset();
                registerCard.style.display = 'none';
                registerCard.setAttribute('aria-hidden','true');
                loginCard.style.display = '';
                const u = document.getElementById('username');
                if(u) u.focus();
            }, 900);
        });
    }

})();