-- Crear tabla solicitudes_vacaciones si no existe
CREATE TABLE IF NOT EXISTS `solicitudes_vacaciones` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `empleado_id` bigint unsigned NOT NULL,
    `fecha_inicio` date NOT NULL,
    `fecha_fin` date NOT NULL,
    `dias_solicitados` int NOT NULL,
    `motivo` longtext DEFAULT NULL,
    `estado` enum('pendiente','aprobada','rechazada') NOT NULL DEFAULT 'pendiente',
    `observaciones` longtext DEFAULT NULL,
    `aprobado_por` bigint unsigned DEFAULT NULL,
    `fecha_aprobacion` timestamp NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    KEY `solicitudes_vacaciones_empleado_id_foreign` (`empleado_id`),
    KEY `solicitudes_vacaciones_aprobado_por_foreign` (`aprobado_por`),
    
    CONSTRAINT `solicitudes_vacaciones_empleado_id_foreign` 
        FOREIGN KEY (`empleado_id`) REFERENCES `empleados` (`id`) ON DELETE CASCADE,
    CONSTRAINT `solicitudes_vacaciones_aprobado_por_foreign` 
        FOREIGN KEY (`aprobado_por`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Agregar índices para optimización
CREATE INDEX idx_solicitudes_estado ON `solicitudes_vacaciones`(`estado`);
CREATE INDEX idx_solicitudes_fecha ON `solicitudes_vacaciones`(`fecha_inicio`, `fecha_fin`);
CREATE INDEX idx_solicitudes_empleado_estado ON `solicitudes_vacaciones`(`empleado_id`, `estado`);
