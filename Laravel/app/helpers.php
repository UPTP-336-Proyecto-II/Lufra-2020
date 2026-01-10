<?php

use Illuminate\Support\Facades\DB;

if (!function_exists('userHasPermission')) {
    /**
     * Verificar si el usuario actual tiene un permiso específico (usando Spatie)
     */
    function userHasPermission(string $permiso): bool
    {
        if (!auth()->check()) {
            return false;
        }

        $user = auth()->user();
        
        // Super Admin tiene todos los permisos
        if ($user->email === 'admin@example.com') {
            return true;
        }

        return $user->hasPermissionTo($permiso);
    }
}

if (!function_exists('userHasRole')) {
    /**
     * Verificar si el usuario actual tiene un rol específico (usando Spatie)
     */
    function userHasRole(string ...$roles): bool
    {
        if (!auth()->check()) {
            return false;
        }

        $user = auth()->user();
        
        // Super Admin tiene todos los roles
        if ($user->email === 'admin@example.com') {
            return true;
        }

        return $user->hasAnyRole($roles);
    }
}

if (!function_exists('userRoles')) {
    /**
     * Obtener los roles del usuario actual (usando Spatie)
     */
    function userRoles(): array
    {
        if (!auth()->check()) {
            return [];
        }

        return auth()->user()->getRoleNames()->toArray();
    }
}

if (!function_exists('userPermissions')) {
    /**
     * Obtener los permisos del usuario actual (usando Spatie)
     */
    function userPermissions(): array
    {
        if (!auth()->check()) {
            return [];
        }

        return auth()->user()->getAllPermissions()->pluck('name')->toArray();
    }
}

if (!function_exists('canAccessModule')) {
    /**
     * Verificar si el usuario puede acceder a un módulo completo
     */
    function canAccessModule(string $modulo): bool
    {
        if (!auth()->check()) {
            return false;
        }

        $userEmail = auth()->user()->email;
        
        // Super Admin tiene acceso a todos los módulos
        if ($userEmail === 'admin@example.com') {
            return true;
        }

        $permisosPorModulo = [
            'empleados' => ['ver_empleados', 'crear_empleados', 'editar_empleados', 'eliminar_empleados'],
            'contratos' => ['ver_contratos', 'crear_contratos', 'editar_contratos', 'eliminar_contratos'],
            'departamentos' => ['ver_departamentos', 'crear_departamentos', 'editar_departamentos', 'eliminar_departamentos'],
            'nominas' => ['ver_nominas', 'crear_nominas', 'procesar_nominas', 'cerrar_nominas'],
            'pagos' => ['ver_pagos', 'registrar_pagos', 'aprobar_pagos'],
            'reportes' => ['ver_reportes', 'exportar_reportes'],
        ];

        if (!isset($permisosPorModulo[$modulo])) {
            return false;
        }

        // Si tiene al menos uno de los permisos del módulo, puede acceder
        foreach ($permisosPorModulo[$modulo] as $permiso) {
            if (userHasPermission($permiso)) {
                return true;
            }
        }

        return false;
    }
}
