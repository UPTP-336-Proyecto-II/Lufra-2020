<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Sistema Nominas</a>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto">
            <li class="nav-item"><router-link to="/" class="nav-link">Dashboard</router-link></li>
            <li class="nav-item"><router-link to="/empleados" class="nav-link">Empleados</router-link></li>
            <li class="nav-item"><router-link to="/departamentos" class="nav-link">Departamentos</router-link></li>
            <li class="nav-item"><router-link to="/nominas" class="nav-link">Nominas</router-link></li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container-fluid mt-3"><router-view></router-view></div>
  </div>
</template>

<script>
export default { name: 'App' }
</script>
