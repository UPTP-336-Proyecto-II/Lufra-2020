<template>
  <!-- El contenedor principal ya está manejado por layouts.blade.php -->
  <router-view></router-view>
</template>

<script>
export default { 
  name: 'App',
  mounted() {
    // Notificación de bienvenida
    if (this.$toast) {
      this.$toast.fire({
        icon: 'info',
        title: 'Vue Dashboard cargado'
      });
    }
  }
}
</script>

<style scoped>
/* Estilos para el contenido dentro del layout de AdminLTE */
</style>
