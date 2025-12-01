// --- Utilidades de autenticación (local, simulada) ---
const AUTH_KEY = 'payrollAuth';
function getAuth(){
    try{ return JSON.parse(localStorage.getItem(AUTH_KEY)); }catch(e){ return null; }
}
function setAuth(obj){
    localStorage.setItem(AUTH_KEY, JSON.stringify(obj));
}
function logout(){
    localStorage.removeItem(AUTH_KEY);
    // redirigir al fichero de login ubicado en la carpeta del proyecto
    window.location.href = '../Login/Login.html';
}

// --- 1. Definición de Módulos por Rol ---
const roleModules = {
    "SuperUsuario": {
        name: "SuperUsuario",
        description: "Acceso total para mantenimiento y configuración del sistema.",
        modules: [
            "Gestión de Usuarios y Roles (CRUD)",
            "Configuración Global (Fórmulas, Impuestos)",
            "Logs y Auditoría del Sistema",
            "Respaldo de Base de Datos"
        ]
    },
    "Administrativo": {
        name: "Administrativo",
        description: "Módulos principales para el proceso de cálculo y gestión de la nómina.",
        modules: [
            "Registro de Trabajadores",
            "Pago de Nómina",
            "Panel de Cálculo de Nómina (Abrir/Cerrar Periodos)",
            "Gestión de Empleados (CRUD)",
            "Registro de Novedades (Bonos, Préstamos, Faltas)",
            "Generación de Reportes e Informes",
            "Configuración de Conceptos de Pago"
        ]
    },
    "Trabajador": {
        name: "Trabajador",
        description: "Módulos de autoservicio para la consulta de información personal.",
        modules: [
            "Mi Perfil / Actualización de Datos",
            "Historial de Pagos y Recibos (Descarga PDF)",
            "Resumen de Salario Base y Deducciones",
            "Solicitud de Vacaciones (Opcional)"
        ]
    }
};

// Nota: el mismo script se carga en `login.html` y en `Index.html`.
// Detectamos la página por la presencia de elementos y actuamos en consecuencia.

function initPayrollPage(){
    const sidebarNav = document.getElementById('module-navigation');
    const contentHeader = document.getElementById('content-header');
    const contentDetails = document.getElementById('content-details');
    const roleTabs = document.querySelectorAll('.role-tab');

    function loadRoleView(roleName) {
        const roleData = roleModules[roleName];
        if(!roleData) return;

        // guardar rol actual
        currentRole = roleName;

        // 1. Actualizar la barra lateral (Módulos) y agregar handlers
        if(sidebarNav) sidebarNav.innerHTML = '';
        roleData.modules.forEach((moduleName, index) => {
            const link = document.createElement('a');
            link.href = "#";
            link.className = "nav-link";
            link.textContent = moduleName;
            if (index === 0) link.classList.add('active');
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // marcar activo
                sidebarNav.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
                link.classList.add('active');
                renderModule(moduleName);
            });
            if(sidebarNav) sidebarNav.appendChild(link);
        });

        // 2. Actualizar el contenido principal resumen
        if(contentHeader) contentHeader.innerHTML = `<h4>Rol Actual: ${roleData.name}</h4>`;
        if(contentDetails) contentDetails.innerHTML = `
            <p>${roleData.description}</p>
            <p><strong>Funcionalidades visibles en el menú:</strong></p>
            <ul class="module-list">
                ${roleData.modules.map(m => `<li>${m}</li>`).join('')}
            </ul>
            <p class="alert-info">
                <strong>Resumen:</strong> El usuario **${roleData.name}** solo tiene acceso a las funcionalidades listadas arriba y no puede ver los módulos de otros roles.
            </p>
        `;

        // 3. Activar la pestaña correcta (visual)
        if(roleTabs) roleTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-role') === roleName) tab.classList.add('active');
        });

        // renderizar primer módulo por defecto
        if(roleData.modules && roleData.modules.length) renderModule(roleData.modules[0]);
    }

    // --- variables y helpers para módulos ---
    let currentRole = 'Administrativo';

    function renderModule(moduleName){
        const role = currentRole;
        if(contentHeader) contentHeader.innerHTML = `<h4>${role} - ${moduleName}</h4>`;
        if(role === 'Administrativo') return renderAdminModule(moduleName);
        if(role === 'Trabajador') return renderWorkerModule(moduleName);
        if(role === 'SuperUsuario') return renderSuperModule(moduleName);
        if(contentDetails) contentDetails.innerHTML = `<p>Módulo no implementado.</p>`;
    }

    /* Helpers comunes */
    function getEmployees(){ try{ return JSON.parse(localStorage.getItem('payroll_employees'))||[] }catch(e){ return [] } }
    function saveEmployees(list){ localStorage.setItem('payroll_employees', JSON.stringify(list)); }

    // --- Implementaciones Administrativo ---
    function renderAdminModule(name){
        if(!contentDetails) return;
        
        // Registro de Trabajadores
        if(name.toLowerCase().includes('registro') && name.toLowerCase().includes('trabajador')){
            renderWorkerRegistration();
            return;
        }
        
        // Pago de Nómina
        if(name.toLowerCase().includes('pago') && name.toLowerCase().includes('nómina')){
            renderPayrollPayment();
            return;
        }
        
        if(name.toLowerCase().includes('cálcul') || name.toLowerCase().includes('calcul')){
            contentDetails.innerHTML = `
                <div>
                    <h4>Calculadora de Nómina</h4>
                    <label>Salario bruto: <input id="pay-gross" type="number" value="1000"/></label>
                    <label>Impuesto %: <input id="pay-tax" type="number" value="10"/></label>
                    <button id="calc-pay" class="primary">Calcular</button>
                    <div id="pay-result" style="margin-top:10px"></div>
                </div>`;
            document.getElementById('calc-pay').addEventListener('click', ()=>{
                const gross = Number(document.getElementById('pay-gross').value)||0;
                const tax = Number(document.getElementById('pay-tax').value)||0;
                const net = gross * (1 - tax/100);
                document.getElementById('pay-result').textContent = `Salario neto: $${net.toFixed(2)}`;
            });
            return;
        }
        if(name.toLowerCase().includes('emplead')){
            // reutilizar UI simple de empleados
            const arr = getEmployees();
            contentDetails.innerHTML = `<div><h4>Gestión de Empleados</h4><button id="add-emp" class="primary">Agregar</button><div id="emp-list" style="margin-top:12px"></div></div>`;
            const listEl = document.getElementById('emp-list');
            function refresh(){
                const a = getEmployees();
                if(a.length===0){ listEl.innerHTML = '<p>No hay empleados.</p>'; return; }
                listEl.innerHTML = `<table><thead><tr><th>ID</th><th>Nombre</th><th>Cargo</th><th></th></tr></thead><tbody>${a.map((e,i)=>`<tr><td>${i+1}</td><td>${e.name}</td><td>${e.role||''}</td><td><button data-i="${i}" class="del-emp">Eliminar</button></td></tr>`).join('')}</tbody></table>`;
                listEl.querySelectorAll('.del-emp').forEach(b=> b.addEventListener('click', ()=>{ const idx = Number(b.getAttribute('data-i')); const arr = getEmployees(); arr.splice(idx,1); saveEmployees(arr); refresh(); }));
            }
            document.getElementById('add-emp').addEventListener('click', ()=>{
                const name = prompt('Nombre'); if(!name) return; const role = prompt('Cargo')||''; const arr = getEmployees(); arr.push({name,role}); saveEmployees(arr); refresh();
            });
            refresh();
            return;
        }
        if(name.toLowerCase().includes('novedad')){
            contentDetails.innerHTML = `<div><h4>Registro de Novedades</h4><label>Empleado: <input id="n-emp"/></label><label>Tipo: <input id="n-type"/></label><label>Monto: <input id="n-amt" type="number"/></label><button id="n-save" class="primary">Guardar</button><div id="n-list" style="margin-top:12px"></div></div>`;
            const key='payroll_novedades';
            function load(){ try{ return JSON.parse(localStorage.getItem(key))||[] }catch(e){return[]} }
            function save(a){ localStorage.setItem(key, JSON.stringify(a)) }
            document.getElementById('n-save').addEventListener('click', ()=>{ const emp=document.getElementById('n-emp').value.trim(); const type=document.getElementById('n-type').value.trim(); const amt=Number(document.getElementById('n-amt').value)||0; if(!emp||!type) return alert('Empleado y tipo requeridos'); const arr=load(); arr.push({emp,type,amt,date:new Date().toISOString()}); save(arr); render(); });
            function render(){ const arr = load(); document.getElementById('n-list').innerHTML = arr.length? arr.map(n=>`<div>${n.date} - ${n.emp} - ${n.type} - $${n.amt}</div>`).join('') : '<p>No hay novedades.</p>'; }
            render();
            return;
        }
        if(name.toLowerCase().includes('reporte')){
            contentDetails.innerHTML = `<div><h4>Generar Reportes</h4><button id="gen-rep" class="primary">Generar CSV</button></div>`;
            document.getElementById('gen-rep').addEventListener('click', ()=>{
                const emps = getEmployees(); const nov = JSON.parse(localStorage.getItem('payroll_novedades')||'[]'); let csv='id,name,role\n'; emps.forEach((e,i)=> csv += `${i+1},"${e.name}","${e.role||''}"\n`); csv += '\nNOVEDADES\ndate,emp,type,amt\n'; nov.forEach(n=> csv += `${n.date},"${n.emp}","${n.type}",${n.amt}\n`); const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='reporte.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
            });
            return;
        }
        if(name.toLowerCase().includes('concept')){
            const cfgKey='payroll_config'; const cfg = JSON.parse(localStorage.getItem(cfgKey)||'{}');
            contentDetails.innerHTML = `<div><h4>Configuración de Conceptos</h4><textarea id="cfg-json" style="width:100%;height:200px">${JSON.stringify(cfg,null,2)}</textarea><div style="margin-top:8px"><button id="save-cfg" class="primary">Guardar</button></div></div>`;
            document.getElementById('save-cfg').addEventListener('click', ()=>{ try{ const v=JSON.parse(document.getElementById('cfg-json').value); localStorage.setItem(cfgKey, JSON.stringify(v)); alert('Configuración guardada'); }catch(e){ alert('JSON inválido'); } });
            return;
        }
        contentDetails.innerHTML = `<p>Módulo '${name}' no implementado (Administrativo).</p>`;
    }

    // --- Funciones para Trabajadores ---
    function getWorkers() {
        try {
            return JSON.parse(localStorage.getItem('payroll_workers') || '[]');
        } catch (e) {
            return [];
        }
    }

    function saveWorkers(workers) {
        localStorage.setItem('payroll_workers', JSON.stringify(workers));
    }

    // --- Funciones para Registro de Trabajadores ---
    function renderWorkerRegistration() {
        if (!contentDetails) return;
        
        const workers = getWorkers();
        
        let html = `
            <div class="worker-registration">
                <h4>Registro de Trabajadores</h4>
                <div style="margin-bottom: 20px;">
                    <button id="add-worker-btn" class="primary">➕ Registrar Nuevo Trabajador</button>
                </div>
                <div id="worker-form-container" style="display: none; background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h5>Datos del Trabajador</h5>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Nombres *</label>
                            <input type="text" id="worker-nombres" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Apellidos *</label>
                            <input type="text" id="worker-apellidos" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Cédula de Identidad *</label>
                            <input type="text" id="worker-cedula" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="V-12345678" required>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Fecha de Ingreso *</label>
                            <input type="date" id="worker-fecha-ingreso" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button id="save-worker-btn" class="primary">💾 Guardar Trabajador</button>
                        <button id="cancel-worker-btn" style="padding: 10px 20px; border-radius: 5px; border: 1px solid #ddd; background: #fff; cursor: pointer;">Cancelar</button>
                    </div>
                </div>
                <div id="workers-list">
                    <h5 style="margin-top: 20px;">Trabajadores Registrados</h5>
                    ${renderWorkersList(workers)}
                </div>
            </div>
        `;
        
        contentDetails.innerHTML = html;
        
        // Event listeners
        const formContainer = document.getElementById('worker-form-container');
        const addBtn = document.getElementById('add-worker-btn');
        const saveBtn = document.getElementById('save-worker-btn');
        const cancelBtn = document.getElementById('cancel-worker-btn');
        
        addBtn.addEventListener('click', () => {
            formContainer.style.display = 'block';
            document.getElementById('worker-nombres').value = '';
            document.getElementById('worker-apellidos').value = '';
            document.getElementById('worker-cedula').value = '';
            document.getElementById('worker-fecha-ingreso').value = '';
        });
        
        cancelBtn.addEventListener('click', () => {
            formContainer.style.display = 'none';
        });
        
        saveBtn.addEventListener('click', () => {
            const nombres = document.getElementById('worker-nombres').value.trim();
            const apellidos = document.getElementById('worker-apellidos').value.trim();
            const cedula = document.getElementById('worker-cedula').value.trim();
            const fechaIngreso = document.getElementById('worker-fecha-ingreso').value;
            
            if (!nombres || !apellidos || !cedula || !fechaIngreso) {
                alert('Por favor, complete todos los campos requeridos.');
                return;
            }
            
            const existingWorkers = getWorkers();
            if (existingWorkers.some(w => w.cedula === cedula)) {
                alert('Ya existe un trabajador registrado con esta cédula.');
                return;
            }
            
            const newWorker = {
                id: Date.now(),
                nombres: nombres,
                apellidos: apellidos,
                cedula: cedula,
                fechaIngreso: fechaIngreso,
                fechaRegistro: new Date().toISOString()
            };
            
            existingWorkers.push(newWorker);
            saveWorkers(existingWorkers);
            
            document.getElementById('workers-list').innerHTML = `
                <h5 style="margin-top: 20px;">Trabajadores Registrados</h5>
                ${renderWorkersList(existingWorkers)}
            `;
            
            formContainer.style.display = 'none';
            alert('Trabajador registrado exitosamente.');
            attachWorkerListListeners();
        });
        
        attachWorkerListListeners();
    }
    
    function renderWorkersList(workers) {
        if (workers.length === 0) {
            return '<p style="color: #7f8c8d; padding: 20px; text-align: center;">No hay trabajadores registrados.</p>';
        }
        
        return `
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <thead>
                    <tr style="background: #3498db; color: white;">
                        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">ID</th>
                        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Nombres</th>
                        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Apellidos</th>
                        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Cédula</th>
                        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Fecha Ingreso</th>
                        <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${workers.map((w, i) => `
                        <tr style="background: ${i % 2 === 0 ? '#fff' : '#f8f9fa'};">
                            <td style="padding: 10px; border: 1px solid #ddd;">${w.id}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${w.nombres}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${w.apellidos}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${w.cedula}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${new Date(w.fechaIngreso).toLocaleDateString('es-VE')}</td>
                            <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
                                <button class="delete-worker-btn" data-worker-id="${w.id}" style="padding: 5px 10px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    function attachWorkerListListeners() {
        const deleteButtons = document.querySelectorAll('.delete-worker-btn');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('¿Está seguro de eliminar este trabajador?')) {
                    const workerId = parseInt(btn.getAttribute('data-worker-id'));
                    const workers = getWorkers();
                    const filtered = workers.filter(w => w.id !== workerId);
                    saveWorkers(filtered);
                    
                    document.getElementById('workers-list').innerHTML = `
                        <h5 style="margin-top: 20px;">Trabajadores Registrados</h5>
                        ${renderWorkersList(filtered)}
                    `;
                    attachWorkerListListeners();
                }
            });
        });
    }

    // --- Funciones para Pago de Nómina ---
    function renderPayrollPayment() {
        if (!contentDetails) return;
        
        const workers = getWorkers();
        
        if (workers.length === 0) {
            contentDetails.innerHTML = `
                <div class="payroll-payment">
                    <h4>Pago de Nómina</h4>
                    <div class="alert-info">
                        <p>⚠️ No hay trabajadores registrados. Por favor, registre trabajadores primero en el módulo "Registro de Trabajadores".</p>
                    </div>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="payroll-payment">
                <h4>Pago de Nómina</h4>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h5>Datos del Pago</h5>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Trabajador *</label>
                            <select id="payment-worker" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                                <option value="">Seleccione un trabajador</option>
                                ${workers.map(w => `
                                    <option value="${w.id}" data-cedula="${w.cedula}" data-nombres="${w.nombres}" data-apellidos="${w.apellidos}">
                                        ${w.cedula} - ${w.nombres} ${w.apellidos}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Período *</label>
                            <input type="text" id="payment-periodo" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Ej: Enero 2024" required>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Fecha de Pago *</label>
                            <input type="date" id="payment-fecha-pago" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Fecha Inicio Período</label>
                            <input type="date" id="payment-fecha-inicio" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Fecha Fin Período</label>
                            <input type="date" id="payment-fecha-fin" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        </div>
                    </div>
                    <div style="background: #fff; padding: 15px; border-radius: 4px; margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 10px; font-weight: 600;">Salario Base (Bs.)</label>
                        <input type="number" id="payment-salario-base" value="130" step="0.01" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                    </div>
                    <div id="conceptos-section" style="margin-top: 20px;">
                        <h5>Conceptos del Recibo</h5>
                        <p style="color: #7f8c8d; font-size: 0.9em; margin-bottom: 10px;">Los conceptos se agregarán posteriormente. Por ahora el recibo se generará con el salario base.</p>
                        <div id="conceptos-list" style="background: #fff; padding: 15px; border-radius: 4px; min-height: 50px;">
                            <p style="color: #95a5a6; text-align: center;">No hay conceptos agregados aún</p>
                        </div>
                    </div>
                    <div style="margin-top: 20px; display: flex; gap: 10px;">
                        <button id="generate-payslip-btn" class="primary">💾 Generar Recibo de Pago</button>
                        <button id="preview-payslip-btn" style="padding: 10px 20px; border-radius: 5px; border: 1px solid #3498db; background: #fff; color: #3498db; cursor: pointer;">👁️ Vista Previa</button>
                    </div>
                </div>
            </div>
        `;
        
        contentDetails.innerHTML = html;
        
        const generateBtn = document.getElementById('generate-payslip-btn');
        const previewBtn = document.getElementById('preview-payslip-btn');
        
        generateBtn.addEventListener('click', () => {
            const workerSelect = document.getElementById('payment-worker');
            if (!workerSelect.value) {
                alert('Por favor, seleccione un trabajador.');
                return;
            }
            
            const periodo = document.getElementById('payment-periodo').value.trim();
            const fechaPago = document.getElementById('payment-fecha-pago').value;
            const fechaInicio = document.getElementById('payment-fecha-inicio').value;
            const fechaFin = document.getElementById('payment-fecha-fin').value;
            const salarioBase = parseFloat(document.getElementById('payment-salario-base').value) || 130;
            
            if (!periodo || !fechaPago) {
                alert('Por favor, complete los campos requeridos (Período y Fecha de Pago).');
                return;
            }
            
            const workerId = parseInt(workerSelect.value);
            const worker = workers.find(w => w.id === workerId);
            
            if (!worker) {
                alert('Error: Trabajador no encontrado.');
                return;
            }
            
            const payslips = getPayslips();
            const newId = payslips.length > 0 ? Math.max(...payslips.map(p => p.id)) + 1 : 1;
            
            const newPayslip = {
                id: newId,
                periodo: periodo,
                fechaPago: fechaPago,
                fechaInicio: fechaInicio || fechaPago,
                fechaFin: fechaFin || fechaPago,
                salarioBase: salarioBase,
                salarioMensual: 130.00,
                asignaciones: 0,
                bonificaciones: 0,
                deducciones: 0,
                neto: salarioBase,
                tipoNomina: 'Quincenal',
                trabajador: `${worker.nombres} ${worker.apellidos}`,
                cedula: worker.cedula,
                numeroRecibo: String(newId).padStart(10, '0'),
                conceptos: []
            };
            
            payslips.push(newPayslip);
            localStorage.setItem('payroll_payslips', JSON.stringify(payslips));
            
            alert(`Recibo de pago generado exitosamente para ${worker.nombres} ${worker.apellidos}.\n\nID del Recibo: ${newId}`);
            
            workerSelect.value = '';
            document.getElementById('payment-periodo').value = '';
            document.getElementById('payment-fecha-pago').value = '';
            document.getElementById('payment-fecha-inicio').value = '';
            document.getElementById('payment-fecha-fin').value = '';
            document.getElementById('payment-salario-base').value = '130';
        });
        
        previewBtn.addEventListener('click', () => {
            alert('La vista previa se implementará cuando se agreguen los conceptos.');
        });
    }

    // --- Funciones para Recibos de Pago ---
    function initializePayslipData() {
        const key = 'payroll_payslips';
        const existing = localStorage.getItem(key);
        let needsUpdate = false;
        
        if (existing) {
            try {
                const existingData = JSON.parse(existing);
                // Verificar si algún recibo no tiene salario base de 130
                needsUpdate = existingData.some(p => parseFloat(p.salarioBase) !== 130.00);
            } catch (e) {
                needsUpdate = true;
            }
        } else {
            needsUpdate = true;
        }
        
        if (needsUpdate) {
            // Crear datos de ejemplo
            const auth = getAuth() || {};
            const username = auth.username || 'Trabajador';
            const sampleData = [
                {
                    id: 1,
                    periodo: 'Enero 2024',
                    fechaPago: '2024-01-31',
                    fechaInicio: '2024-01-16',
                    fechaFin: '2024-01-31',
                    salarioBase: 130.00,
                    salarioMensual: 130.00,
                    asignaciones: 15.00,
                    bonificaciones: 10.00,
                    deducciones: 20.00,
                    neto: 135.00,
                    tipoNomina: 'Quincenal',
                    trabajador: username,
                    cedula: 'V-12345678',
                    numeroRecibo: '0000000001',
                    conceptos: [] // Estructura lista para agregar conceptos después
                },
                {
                    id: 2,
                    periodo: 'Febrero 2024',
                    fechaPago: '2024-02-15',
                    fechaInicio: '2024-02-01',
                    fechaFin: '2024-02-15',
                    salarioBase: 130.00,
                    salarioMensual: 130.00,
                    asignaciones: 15.00,
                    bonificaciones: 5.00,
                    deducciones: 20.00,
                    neto: 130.00,
                    tipoNomina: 'Quincenal',
                    trabajador: username,
                    cedula: 'V-12345678',
                    numeroRecibo: '0000000002',
                    conceptos: []
                },
                {
                    id: 3,
                    periodo: 'Febrero 2024',
                    fechaPago: '2024-02-29',
                    fechaInicio: '2024-02-16',
                    fechaFin: '2024-02-29',
                    salarioBase: 130.00,
                    salarioMensual: 130.00,
                    asignaciones: 15.00,
                    bonificaciones: 10.00,
                    deducciones: 20.00,
                    neto: 135.00,
                    tipoNomina: 'Quincenal',
                    trabajador: username,
                    cedula: 'V-12345678',
                    numeroRecibo: '0000000003',
                    conceptos: []
                },
                {
                    id: 4,
                    periodo: 'Marzo 2024',
                    fechaPago: '2024-03-15',
                    fechaInicio: '2024-03-01',
                    fechaFin: '2024-03-15',
                    salarioBase: 130.00,
                    salarioMensual: 130.00,
                    asignaciones: 15.00,
                    bonificaciones: 7.50,
                    deducciones: 20.00,
                    neto: 132.50,
                    tipoNomina: 'Quincenal',
                    trabajador: username,
                    cedula: 'V-12345678',
                    numeroRecibo: '0000000004',
                    conceptos: []
                },
                {
                    id: 5,
                    periodo: 'Marzo 2024',
                    fechaPago: '2024-03-31',
                    fechaInicio: '2024-03-16',
                    fechaFin: '2024-03-31',
                    salarioBase: 130.00,
                    salarioMensual: 130.00,
                    asignaciones: 15.00,
                    bonificaciones: 10.00,
                    deducciones: 20.00,
                    neto: 135.00,
                    tipoNomina: 'Quincenal',
                    trabajador: username,
                    cedula: 'V-12345678',
                    numeroRecibo: '0000000005',
                    conceptos: []
                }
            ];
            localStorage.setItem(key, JSON.stringify(sampleData));
        }
    }

    function getPayslips() {
        try {
            return JSON.parse(localStorage.getItem('payroll_payslips') || '[]');
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
        const date = new Date(dateString);
        return date.toLocaleDateString('es-VE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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

    function downloadPayslipPDF(payslip) {
        try {
            console.log('Iniciando generación de PDF para recibo:', payslip);
            
            if (typeof window.jspdf === 'undefined') {
                alert('Error: La librería jsPDF no está cargada. Por favor, recarga la página.');
                return;
            }

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            console.log('Documento PDF creado correctamente');

        // Configuración de colores
        const primaryColor = [52, 152, 219];
        const darkColor = [0, 0, 0];
        const borderColor = [200, 200, 200];

        let yPos = 10;

        // === ENCABEZADO IZQUIERDA (Logo y datos de empresa) ===
        // Logo (cuadrado azul con letra L)
        doc.setFillColor(...primaryColor);
        doc.rect(10, yPos, 15, 15, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('L', 17, yPos + 10, { align: 'center' });

        // Datos de la empresa
        doc.setTextColor(...darkColor);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Lufra 2020', 28, yPos + 5);
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('R.I.F.: J-123456789-0', 28, yPos + 10);
        doc.text('Dirección: Acarigua, Venezuela', 28, yPos + 14);
        doc.text('Teléfonos: +58 212-1234567', 28, yPos + 18);

        // === ENCABEZADO DERECHA (Información del recibo) ===
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('RECIBO DE PAGO', 190, yPos + 5, { align: 'right' });
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`Fecha Emisión: ${formatDateShort(payslip.fechaPago || '')}`, 190, yPos + 10, { align: 'right' });
        
        // Número de recibo en caja
        doc.setDrawColor(...borderColor);
        doc.setLineWidth(0.5);
        doc.rect(160, yPos + 12, 30, 8);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        const numeroRecibo = payslip.numeroRecibo || String(payslip.id).padStart(10, '0');
        doc.text(`Número: ${numeroRecibo}`, 175, yPos + 17, { align: 'center' });

        yPos = 35;

        // === INFORMACIÓN DEL TRABAJADOR ===
        doc.setDrawColor(...borderColor);
        doc.setLineWidth(0.3);
        doc.rect(10, yPos, 90, 25);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('Empleado:', 12, yPos + 5);
        doc.setFont('helvetica', 'normal');
        const empleadoText = `${payslip.cedula || 'N/A'} ${payslip.trabajador || 'Trabajador'}`;
        // Truncar si es muy largo (máximo 40 caracteres)
        const empleadoTextShort = empleadoText.length > 40 ? empleadoText.substring(0, 37) + '...' : empleadoText;
        doc.text(empleadoTextShort, 12, yPos + 9);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Cédula:', 12, yPos + 13);
        doc.setFont('helvetica', 'normal');
        doc.text(payslip.cedula || 'N/A', 12, yPos + 17);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Sueldo Mensual:', 12, yPos + 21);
        doc.setFont('helvetica', 'normal');
        // El salario mensual es de 130 bs
        const salarioMensual = 130.00;
        doc.text('Bs. ' + formatCurrencyVenezuela(salarioMensual), 12, yPos + 25);

        // === PERÍODO DE NÓMINA ===
        doc.rect(102, yPos, 88, 25);
        doc.setFont('helvetica', 'bold');
        doc.text('Nómina desde:', 104, yPos + 5);
        doc.setFont('helvetica', 'normal');
        let fechaInicio = payslip.fechaInicio;
        if (!fechaInicio && payslip.fechaPago) {
            // Calcular inicio del período (si es quincenal, primera o segunda quincena)
            const fechaPago = new Date(payslip.fechaPago);
            const dia = fechaPago.getDate();
            if (dia <= 15) {
                // Primera quincena
                fechaInicio = new Date(fechaPago.getFullYear(), fechaPago.getMonth(), 1).toISOString().split('T')[0];
            } else {
                // Segunda quincena
                fechaInicio = new Date(fechaPago.getFullYear(), fechaPago.getMonth(), 16).toISOString().split('T')[0];
            }
        }
        doc.text(formatDateShort(fechaInicio), 104, yPos + 9);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Hasta:', 104, yPos + 13);
        doc.setFont('helvetica', 'normal');
        const fechaFin = payslip.fechaFin || payslip.fechaPago;
        doc.text(formatDateShort(fechaFin), 104, yPos + 17);

        yPos = 65;

        // === TABLA DE CONCEPTOS ===
        // Encabezados de la tabla
        doc.setFillColor(240, 240, 240);
        doc.rect(10, yPos, 180, 8, 'F');
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...darkColor);
        
        // Columnas: Concepto, Descripción, Asignación, Deduc/Reten
        // Ajustar posiciones para mejor alineación
        doc.text('Concepto', 12, yPos + 5.5);
        doc.text('Descripción', 45, yPos + 5.5);
        doc.text('Asignación', 125, yPos + 5.5);
        doc.text('Deduc/Reten', 155, yPos + 5.5);

        // Líneas verticales de la tabla - ajustadas para alinear con los números
        doc.setDrawColor(...borderColor);
        doc.setLineWidth(0.2);
        doc.line(40, yPos, 40, yPos + 50); // Línea después de Concepto
        doc.line(120, yPos, 120, yPos + 50); // Línea después de Descripción
        doc.line(150, yPos, 150, yPos + 50); // Línea después de Asignación

        yPos += 8;

        // Filas de conceptos (vacías por ahora, pero con estructura)
        const conceptos = payslip.conceptos || [];
        const rowHeight = 6;
        const maxRows = 7; // Máximo de filas visibles

        for (let i = 0; i < maxRows; i++) {
            if (i < conceptos.length) {
                const concepto = conceptos[i];
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.text(concepto.codigo || '', 12, yPos + 4);
                doc.text(concepto.descripcion || '', 42, yPos + 4);
                // Alinear números a la derecha dentro de la columna (ancho de columna ~25mm)
                doc.text(concepto.asignacion ? formatCurrencyVenezuela(concepto.asignacion) : '0,00', 150, yPos + 4, { align: 'right' });
                doc.text(concepto.deduccion ? formatCurrencyVenezuela(concepto.deduccion) : '0,00', 180, yPos + 4, { align: 'right' });
            } else {
                // Filas vacías
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.setTextColor(200, 200, 200);
                doc.text('', 12, yPos + 4);
                doc.text('', 42, yPos + 4);
                doc.text('0,00', 150, yPos + 4, { align: 'right' });
                doc.text('0,00', 180, yPos + 4, { align: 'right' });
                doc.setTextColor(...darkColor);
            }
            
            // Línea horizontal entre filas
            doc.setDrawColor(...borderColor);
            doc.line(10, yPos + rowHeight, 190, yPos + rowHeight);
            yPos += rowHeight;
        }

        // Cerrar la tabla
        doc.line(10, yPos, 190, yPos);

        yPos += 5;

        // === TOTALES ===
        // Calcular totales solo de los conceptos (asignaciones y deducciones de conceptos)
        // Reutilizar la variable conceptos ya declarada arriba
        let totalAsignacion = 0;
        let totalDeduccion = 0;
        
        conceptos.forEach(concepto => {
            if (concepto.asignacion) {
                totalAsignacion += parseFloat(concepto.asignacion) || 0;
            }
            if (concepto.deduccion) {
                totalDeduccion += parseFloat(concepto.deduccion) || 0;
            }
        });

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('Total:', 125, yPos);
        doc.setFont('helvetica', 'normal');
        // Alinear totales con las columnas de números
        doc.text(formatCurrencyVenezuela(totalAsignacion), 150, yPos, { align: 'right' });
        doc.text(formatCurrencyVenezuela(totalDeduccion), 180, yPos, { align: 'right' });

        yPos += 8;

        // === NETO A PAGAR ===
        // Neto = Salario Base + Total Asignaciones - Total Deducciones
        const salarioBase = parseFloat(payslip.salarioBase) || 130.00;
        const neto = salarioBase + totalAsignacion - totalDeduccion;
        
        doc.setDrawColor(...borderColor);
        doc.setLineWidth(0.5);
        doc.rect(10, yPos, 180, 12);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Neto a Pagar:', 12, yPos + 8);
        doc.text(formatCurrencyVenezuela(neto), 180, yPos + 8, { align: 'right' });

        // Pie de página
        yPos = 275;
        doc.setTextColor(150, 150, 150);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text('Este documento es generado automáticamente por el Sistema de Nóminas Lufra 2020', 105, yPos, { align: 'center' });

        // Validar que el documento esté completo antes de guardar
        console.log('Validando documento PDF...');
        
        // Descargar con nombre de archivo seguro
        const periodoLimpio = (payslip.periodo || 'Recibo').replace(/[^a-zA-Z0-9_]/g, '_');
        const fileName = `Recibo_${periodoLimpio}_${payslip.id || '1'}.pdf`;
        console.log('Guardando PDF con nombre:', fileName);
        
        try {
            // Generar el PDF como blob primero para validar
            const pdfBlob = doc.output('blob');
            console.log('PDF generado como blob, tamaño:', pdfBlob.size, 'bytes');
            
            if (pdfBlob.size === 0) {
                throw new Error('El PDF generado está vacío');
            }
            
            // Descargar el PDF
            doc.save(fileName);
            console.log('PDF guardado exitosamente');
            
            // Mensaje de confirmación
            setTimeout(() => {
                alert('Recibo de pago descargado exitosamente: ' + fileName);
            }, 100);
            
        } catch (saveError) {
            console.error('Error al guardar el PDF:', saveError);
            // Intentar método alternativo
            const pdfDataUri = doc.output('datauristring');
            const link = document.createElement('a');
            link.href = pdfDataUri;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.log('PDF descargado usando método alternativo');
        }
        
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            console.error('Stack trace:', error.stack);
            alert('Error al generar el recibo de pago. Por favor, verifica la consola para más detalles.\n\nError: ' + error.message);
        }
    }

    function renderPayslipHistory() {
        if (!contentDetails) return;
        
        initializePayslipData();
        const payslips = getPayslips();
        const auth = getAuth() || {};
        
        if (payslips.length === 0) {
            contentDetails.innerHTML = `
                <div class="payslip-container">
                    <h4>Historial de Recibos de Pago</h4>
                    <div class="alert-info">
                        <p>No hay recibos de pago disponibles.</p>
                    </div>
                </div>
            `;
            return;
        }

        const grouped = groupPayslipsByPeriod(payslips);
        const periods = Object.keys(grouped).sort().reverse();

        let html = `
            <div class="payslip-container">
                <h4>Historial de Recibos de Pago</h4>
                <p style="color: #7f8c8d; margin-bottom: 20px;">
                    Visualiza y descarga tus recibos de pago organizados por período.
                </p>
        `;

        periods.forEach(period => {
            const periodPayslips = grouped[period];
            const totalPeriod = periodPayslips.reduce((sum, p) => sum + p.neto, 0);
            
            html += `
                <div class="period-section">
                    <div class="period-header">
                        <h5>${period}</h5>
                        <span class="period-total">Total: ${formatCurrency(totalPeriod)}</span>
                    </div>
                    <div class="payslip-list">
            `;

            periodPayslips.forEach(payslip => {
                html += `
                    <div class="payslip-card">
                        <div class="payslip-info">
                            <div class="payslip-date">
                                <strong>Fecha de Pago:</strong> ${formatDate(payslip.fechaPago)}
                            </div>
                            <div class="payslip-details">
                                <div class="detail-item">
                                    <span class="detail-label">Salario Base:</span>
                                    <span class="detail-value">${formatCurrency(payslip.salarioBase)}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Asignaciones:</span>
                                    <span class="detail-value positive">${formatCurrency(payslip.asignaciones)}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Bonificaciones:</span>
                                    <span class="detail-value positive">${formatCurrency(payslip.bonificaciones)}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Deducciones:</span>
                                    <span class="detail-value negative">${formatCurrency(payslip.deducciones)}</span>
                                </div>
                            </div>
                            <div class="payslip-net">
                                <span class="net-label">Neto a Pagar:</span>
                                <span class="net-amount">${formatCurrency(payslip.neto)}</span>
                            </div>
                        </div>
                        <div class="payslip-actions">
                            <button class="btn-download" data-payslip-id="${payslip.id}">
                                📄 Descargar PDF
                            </button>
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        html += `</div>`;

        contentDetails.innerHTML = html;
        
        // Agregar event listeners a los botones de descarga
        const downloadButtons = contentDetails.querySelectorAll('.btn-download');
        downloadButtons.forEach(button => {
            button.addEventListener('click', function() {
                const payslipId = parseInt(this.getAttribute('data-payslip-id'));
                const payslip = payslips.find(p => p.id === payslipId);
                if (payslip) {
                    downloadPayslipPDF(payslip);
                }
            });
        });
    }

    // --- Implementaciones Trabajador ---
    function renderWorkerModule(name){
        if(!contentDetails) return; const auth = getAuth()||{};
        if(name.toLowerCase().includes('perfil')){
            contentDetails.innerHTML = `<div><h4>Mi Perfil</h4><label>Usuario: <input id="profile-username" value="${auth.username||''}"/></label><label>Rol: <input id="profile-role" value="${auth.role||''}" disabled/></label><button id="save-profile" class="primary">Guardar</button></div>`;
            document.getElementById('save-profile').addEventListener('click', ()=>{ const u = document.getElementById('profile-username').value.trim(); if(!u) return alert('Nombre requerido'); const a=getAuth(); a.username=u; setAuth(a); alert('Perfil actualizado'); });
            return;
        }
        if(name.toLowerCase().includes('historial')){
            renderPayslipHistory();
            return;
        }
        if(name.toLowerCase().includes('resumen')){ contentDetails.innerHTML = `<div><h4>Resumen salarial</h4><p>Salario base: $1000</p><p>Deducciones: $200</p><p><strong>Net: $800</strong></p></div>`; return; }
        if(name.toLowerCase().includes('vacacion')|| name.toLowerCase().includes('vacaciones')){
            contentDetails.innerHTML = `<div><h4>Solicitud de Vacaciones</h4><label>Desde: <input type="date" id="vac-from"/></label><label>Hasta: <input type="date" id="vac-to"/></label><button id="send-vac" class="primary">Enviar</button><div id="vac-list" style="margin-top:8px"></div></div>`;
            const key='payroll_vacations'; function load(){ try{ return JSON.parse(localStorage.getItem(key))||[] }catch(e){return[]} } function save(a){ localStorage.setItem(key, JSON.stringify(a)) }
            document.getElementById('send-vac').addEventListener('click', ()=>{ const f=document.getElementById('vac-from').value; const t=document.getElementById('vac-to').value; if(!f||!t) return alert('Fechas requeridas'); const arr=load(); arr.push({user: auth.username, from:f,to:t, date:new Date().toISOString()}); save(arr); render(); });
            function render(){ const arr=load(); document.getElementById('vac-list').innerHTML = arr.length? arr.map(v=> `<div>${v.user}: ${v.from} -> ${v.to} (solicitado ${v.date})</div>`).join('') : '<p>No hay solicitudes.</p>' }
            render(); return;
        }
        contentDetails.innerHTML = `<p>Módulo '${name}' no implementado (Trabajador).</p>`;
    }

    // --- Implementaciones SuperUsuario ---
    function renderSuperModule(name){
        if(!contentDetails) return;
        if(name.toLowerCase().includes('usuarios')){ renderSuperUserView(); return; }
        if(name.toLowerCase().includes('configur')){
            const key='payroll_global_config'; const cfg = JSON.parse(localStorage.getItem(key)||'{}'); contentDetails.innerHTML = `<div><h4>Configuración Global</h4><textarea id="global-cfg" style="width:100%;height:220px">${JSON.stringify(cfg,null,2)}</textarea><div style="margin-top:8px"><button id="save-global" class="primary">Guardar</button></div></div>`; document.getElementById('save-global').addEventListener('click', ()=>{ try{ const v=JSON.parse(document.getElementById('global-cfg').value); localStorage.setItem(key, JSON.stringify(v)); alert('Guardado'); }catch(e){ alert('JSON inválido'); } }); return; }
        if(name.toLowerCase().includes('logs')){ const logs = JSON.parse(localStorage.getItem('payroll_logs')||'[]'); contentDetails.innerHTML = `<div><h4>Logs</h4>${logs.length? logs.map(l=> `<div>${l}</div>`).join('') : '<p>No hay logs.</p>'}<div style="margin-top:10px"><button id="download-logs" class="primary">Descargar</button></div></div>`; document.getElementById('download-logs').addEventListener('click', ()=>{ const arr = JSON.parse(localStorage.getItem('payroll_logs')||'[]'); const blob=new Blob([arr.join('\n')],{type:'text/plain'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='logs.txt'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }); return; }
        if(name.toLowerCase().includes('respaldo')|| name.toLowerCase().includes('respaldo')){ contentDetails.innerHTML = `<div><h4>Respaldo de Base de Datos (simulado)</h4><button id="export-db" class="primary">Exportar JSON</button></div>`; document.getElementById('export-db').addEventListener('click', ()=>{ const dump = { users: JSON.parse(localStorage.getItem('users')||'{}'), employees: JSON.parse(localStorage.getItem('payroll_employees')||'[]'), novedades: JSON.parse(localStorage.getItem('payroll_novedades')||'[]'), }; const blob = new Blob([JSON.stringify(dump,null,2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='backup.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }); return; }
        contentDetails.innerHTML = `<p>Módulo '${name}' no implementado (SuperUsuario).</p>`;
    }

    // Event Listeners para las pestañas
    if(roleTabs) roleTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const role = this.getAttribute('data-role');
            loadRoleView(role);
        });
    });

    // Mostrar usuario y logout
    const auth = getAuth();
    const usernameDisplay = document.getElementById('username-display');
    if(usernameDisplay && auth) usernameDisplay.textContent = auth.username || auth.role || '';
    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) logoutBtn.addEventListener('click', logout);

    // Cargar vista según rol autenticado (fallback administrativo)
    loadRoleView((auth && auth.role) ? auth.role : 'Administrativo');
}

function initLoginPage(){
    // Corregir enlace de estilos si es necesario (login.html may use styles.css)
    const form = document.getElementById('loginForm') || document.getElementById('login-form') || document.getElementById('login-form');
    if(!form) return;

    form.addEventListener('submit', function(e){
        e.preventDefault();
        const userInput = document.getElementById('username');
        const passInput = document.getElementById('password');
        const username = userInput ? userInput.value.trim() : 'demo';
        const password = passInput ? passInput.value : '';

        // Cuenta demo: admin/admin -> rol Administrativo
        if((username === 'admin' && password === 'admin') || (username === 'demo' && password === 'demo')){
            setAuth({ username: username, role: 'Administrativo', logged: true });
            // mostrar éxito si existe
            const successCard = document.getElementById('successCard');
            if(successCard){ successCard.style.display = ''; }
            // redirigir
            window.location.href = 'index.html';
            return;
        }

        // Autenticación simple local: cualquier usuario con contraseña no vacía será trabajador
        if(username && password.length > 0){
            setAuth({ username: username, role: 'Trabajador', logged: true });
            window.location.href = 'index.html';
            return;
        }

        const message = document.getElementById('message') || document.getElementById('regMessage');
        if(message) message.textContent = 'Usuario o contraseña inválidos.';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const pathname = window.location.pathname.toLowerCase();
    const auth = getAuth();

    // Si estamos en login page -> inicializar login
    if(document.getElementById('loginForm') || pathname.endsWith('login.html')){
        initLoginPage();
        return;
    }

    // Si estamos en Index (o en cualquier otra página del sistema) -> verificar auth
    if(document.getElementById('content-header') || pathname.endsWith('index.html')){
        if(!auth || !auth.logged){
            // no autenticado -> redirigir a la página de login en el proyecto
            window.location.href = '../Login/Login.html';
            return;
        }
        // inicializar interfaz administrativa
        initPayrollPage();
    }
});
