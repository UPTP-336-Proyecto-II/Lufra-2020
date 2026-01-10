<template>
    <div class="alert alert-info mb-0">
        <strong>Vue</strong> está funcionando ({{ message }})
    </div>
</template>

<script setup>
import { ref } from 'vue';

const message = ref('Vite + Vue 3');
</script>
