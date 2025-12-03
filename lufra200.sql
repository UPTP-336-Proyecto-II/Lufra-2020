-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-11-2025 a las 19:16:00
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `lufra200`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignaciones`
--

CREATE TABLE `asignaciones` (
  `Id_Asignacion` int(11) NOT NULL,
  `Id_Concepto` int(11) NOT NULL,
  `Monto` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bonificaciones`
--

CREATE TABLE `bonificaciones` (
  `Id_Bonificacion` int(11) NOT NULL,
  `Id_Concepto` int(11) DEFAULT NULL,
  `Descripción` varchar(255) DEFAULT NULL,
  `Monto` decimal(10,2) NOT NULL,
  `Observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `concepto`
--

CREATE TABLE `concepto` (
  `Id_Concepto` int(11) NOT NULL,
  `Nombre_Concepto` varchar(100) NOT NULL,
  `Descripción` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contacto_emergencia`
--

CREATE TABLE `contacto_emergencia` (
  `Id_Contacto_Emergencia` int(11) NOT NULL,
  `Nombre_Contacto` varchar(150) NOT NULL,
  `Parentesco` varchar(50) DEFAULT NULL,
  `Telefono` varchar(20) DEFAULT NULL,
  `Direccion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `deducciones`
--

CREATE TABLE `deducciones` (
  `Id_Deduccion` int(11) NOT NULL,
  `Id_Concepto` int(11) NOT NULL,
  `Monto` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_recibo_asignacion`
--

CREATE TABLE `detalle_recibo_asignacion` (
  `Id_Recibo_Pago` int(11) NOT NULL,
  `Id_Asignacion` int(11) NOT NULL,
  `Monto_Aplicado` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_recibo_bonificacion`
--

CREATE TABLE `detalle_recibo_bonificacion` (
  `Id_Recibo_Pago` int(11) NOT NULL,
  `Id_Bonificacion` int(11) NOT NULL,
  `Cantidad` decimal(10,2) DEFAULT 1.00,
  `Monto_Aplicado` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_recibo_deduccion`
--

CREATE TABLE `detalle_recibo_deduccion` (
  `Id_Recibo_Pago` int(11) NOT NULL,
  `Id_Deduccion` int(11) NOT NULL,
  `Monto_Aplicado` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nivel_educativo`
--

CREATE TABLE `nivel_educativo` (
  `Id_Nivel_Educativo` int(11) NOT NULL,
  `Nombre_Nivel` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesion`
--

CREATE TABLE `profesion` (
  `Id_Profesion` int(11) NOT NULL,
  `Nombre_profesión` varchar(100) NOT NULL,
  `Area` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recibo_pago`
--

CREATE TABLE `recibo_pago` (
  `Id_Recibo_Pago` int(11) NOT NULL,
  `Id_Tipo_Nomina` int(11) NOT NULL,
  `Id_Trabajador` int(11) NOT NULL,
  `Fecha_Pago` date NOT NULL,
  `Salario_Base` decimal(10,2) NOT NULL,
  `Neto` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registro_trabajadores`
--

CREATE TABLE `registro_trabajadores` (
  `Id_registro` int(11) NOT NULL,
  `Id_Trabajador` int(11) NOT NULL,
  `Id_Tipo_Nomina` int(11) NOT NULL,
  `Fecha_registro` datetime DEFAULT current_timestamp(),
  `Observaciones` text DEFAULT NULL,
  `Estado` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `Id_rol` int(11) NOT NULL,
  `Nombre_rol` varchar(50) NOT NULL,
  `Estado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_nomina`
--

CREATE TABLE `tipo_nomina` (
  `Id_Tipo_Nomina` int(11) NOT NULL,
  `Frecuencia` varchar(50) NOT NULL,
  `Fecha_Inicio` date NOT NULL,
  `Fecha_Fin` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `trabajador`
--

CREATE TABLE `trabajador` (
  `Id_Trabajador` int(11) NOT NULL,
  `Id_Profesion` int(11) NOT NULL,
  `Id_Nivel_Educativo` int(11) NOT NULL,
  `Id_Contacto_Emergencia` int(11) DEFAULT NULL,
  `Nombre_Completo` varchar(150) NOT NULL,
  `Apellidos` varchar(150) NOT NULL,
  `Fecha_Nacimiento` date DEFAULT NULL,
  `Genero` char(1) DEFAULT NULL,
  `Documento_Identidad` varchar(50) NOT NULL,
  `Correo` varchar(100) DEFAULT NULL,
  `Telefono_Movil` varchar(20) DEFAULT NULL,
  `Direccion` varchar(255) DEFAULT NULL,
  `Color_Civil` varchar(50) DEFAULT NULL,
  `Ingreso_Anterior` varchar(255) DEFAULT NULL,
  `Fecha_de_Ingreso` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `Id_Usuario` int(11) NOT NULL,
  `Id_rol` int(11) NOT NULL,
  `Nombre_usuario` varchar(50) NOT NULL,
  `Correo` varchar(100) DEFAULT NULL,
  `Contraseña` varchar(255) NOT NULL,
  `Fecha_creación` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `asignaciones`
--
ALTER TABLE `asignaciones`
  ADD PRIMARY KEY (`Id_Asignacion`),
  ADD KEY `Id_Concepto` (`Id_Concepto`);

--
-- Indices de la tabla `bonificaciones`
--
ALTER TABLE `bonificaciones`
  ADD PRIMARY KEY (`Id_Bonificacion`),
  ADD KEY `Id_Concepto` (`Id_Concepto`);

--
-- Indices de la tabla `concepto`
--
ALTER TABLE `concepto`
  ADD PRIMARY KEY (`Id_Concepto`),
  ADD UNIQUE KEY `Nombre_Concepto` (`Nombre_Concepto`);

--
-- Indices de la tabla `contacto_emergencia`
--
ALTER TABLE `contacto_emergencia`
  ADD PRIMARY KEY (`Id_Contacto_Emergencia`);

--
-- Indices de la tabla `deducciones`
--
ALTER TABLE `deducciones`
  ADD PRIMARY KEY (`Id_Deduccion`),
  ADD KEY `Id_Concepto` (`Id_Concepto`);

--
-- Indices de la tabla `detalle_recibo_asignacion`
--
ALTER TABLE `detalle_recibo_asignacion`
  ADD PRIMARY KEY (`Id_Recibo_Pago`,`Id_Asignacion`),
  ADD KEY `Id_Asignacion` (`Id_Asignacion`);

--
-- Indices de la tabla `detalle_recibo_bonificacion`
--
ALTER TABLE `detalle_recibo_bonificacion`
  ADD PRIMARY KEY (`Id_Recibo_Pago`,`Id_Bonificacion`),
  ADD KEY `Id_Bonificacion` (`Id_Bonificacion`);

--
-- Indices de la tabla `detalle_recibo_deduccion`
--
ALTER TABLE `detalle_recibo_deduccion`
  ADD PRIMARY KEY (`Id_Recibo_Pago`,`Id_Deduccion`),
  ADD KEY `Id_Deduccion` (`Id_Deduccion`);

--
-- Indices de la tabla `nivel_educativo`
--
ALTER TABLE `nivel_educativo`
  ADD PRIMARY KEY (`Id_Nivel_Educativo`),
  ADD UNIQUE KEY `Nombre_Nivel` (`Nombre_Nivel`);

--
-- Indices de la tabla `profesion`
--
ALTER TABLE `profesion`
  ADD PRIMARY KEY (`Id_Profesion`),
  ADD UNIQUE KEY `Nombre_profesión` (`Nombre_profesión`);

--
-- Indices de la tabla `recibo_pago`
--
ALTER TABLE `recibo_pago`
  ADD PRIMARY KEY (`Id_Recibo_Pago`),
  ADD KEY `Id_Tipo_Nomina` (`Id_Tipo_Nomina`),
  ADD KEY `Id_Trabajador` (`Id_Trabajador`);

--
-- Indices de la tabla `registro_trabajadores`
--
ALTER TABLE `registro_trabajadores`
  ADD PRIMARY KEY (`Id_registro`),
  ADD KEY `Id_Trabajador` (`Id_Trabajador`),
  ADD KEY `Id_Tipo_Nomina` (`Id_Tipo_Nomina`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`Id_rol`),
  ADD UNIQUE KEY `Nombre_rol` (`Nombre_rol`);

--
-- Indices de la tabla `tipo_nomina`
--
ALTER TABLE `tipo_nomina`
  ADD PRIMARY KEY (`Id_Tipo_Nomina`);

--
-- Indices de la tabla `trabajador`
--
ALTER TABLE `trabajador`
  ADD PRIMARY KEY (`Id_Trabajador`),
  ADD UNIQUE KEY `Documento_Identidad` (`Documento_Identidad`),
  ADD UNIQUE KEY `Correo` (`Correo`),
  ADD KEY `Id_Profesion` (`Id_Profesion`),
  ADD KEY `Id_Nivel_Educativo` (`Id_Nivel_Educativo`),
  ADD KEY `Id_Contacto_Emergencia` (`Id_Contacto_Emergencia`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`Id_Usuario`),
  ADD UNIQUE KEY `Nombre_usuario` (`Nombre_usuario`),
  ADD UNIQUE KEY `Correo` (`Correo`),
  ADD KEY `Id_rol` (`Id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `asignaciones`
--
ALTER TABLE `asignaciones`
  MODIFY `Id_Asignacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `bonificaciones`
--
ALTER TABLE `bonificaciones`
  MODIFY `Id_Bonificacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `concepto`
--
ALTER TABLE `concepto`
  MODIFY `Id_Concepto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `contacto_emergencia`
--
ALTER TABLE `contacto_emergencia`
  MODIFY `Id_Contacto_Emergencia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `deducciones`
--
ALTER TABLE `deducciones`
  MODIFY `Id_Deduccion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `nivel_educativo`
--
ALTER TABLE `nivel_educativo`
  MODIFY `Id_Nivel_Educativo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `profesion`
--
ALTER TABLE `profesion`
  MODIFY `Id_Profesion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `recibo_pago`
--
ALTER TABLE `recibo_pago`
  MODIFY `Id_Recibo_Pago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `registro_trabajadores`
--
ALTER TABLE `registro_trabajadores`
  MODIFY `Id_registro` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `Id_rol` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipo_nomina`
--
ALTER TABLE `tipo_nomina`
  MODIFY `Id_Tipo_Nomina` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `trabajador`
--
ALTER TABLE `trabajador`
  MODIFY `Id_Trabajador` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `Id_Usuario` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asignaciones`
--
ALTER TABLE `asignaciones`
  ADD CONSTRAINT `asignaciones_ibfk_1` FOREIGN KEY (`Id_Concepto`) REFERENCES `concepto` (`Id_Concepto`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `bonificaciones`
--
ALTER TABLE `bonificaciones`
  ADD CONSTRAINT `bonificaciones_ibfk_1` FOREIGN KEY (`Id_Concepto`) REFERENCES `concepto` (`Id_Concepto`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `deducciones`
--
ALTER TABLE `deducciones`
  ADD CONSTRAINT `deducciones_ibfk_1` FOREIGN KEY (`Id_Concepto`) REFERENCES `concepto` (`Id_Concepto`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `detalle_recibo_asignacion`
--
ALTER TABLE `detalle_recibo_asignacion`
  ADD CONSTRAINT `detalle_recibo_asignacion_ibfk_1` FOREIGN KEY (`Id_Recibo_Pago`) REFERENCES `recibo_pago` (`Id_Recibo_Pago`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detalle_recibo_asignacion_ibfk_2` FOREIGN KEY (`Id_Asignacion`) REFERENCES `asignaciones` (`Id_Asignacion`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `detalle_recibo_bonificacion`
--
ALTER TABLE `detalle_recibo_bonificacion`
  ADD CONSTRAINT `detalle_recibo_bonificacion_ibfk_1` FOREIGN KEY (`Id_Recibo_Pago`) REFERENCES `recibo_pago` (`Id_Recibo_Pago`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detalle_recibo_bonificacion_ibfk_2` FOREIGN KEY (`Id_Bonificacion`) REFERENCES `bonificaciones` (`Id_Bonificacion`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `detalle_recibo_deduccion`
--
ALTER TABLE `detalle_recibo_deduccion`
  ADD CONSTRAINT `detalle_recibo_deduccion_ibfk_1` FOREIGN KEY (`Id_Recibo_Pago`) REFERENCES `recibo_pago` (`Id_Recibo_Pago`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detalle_recibo_deduccion_ibfk_2` FOREIGN KEY (`Id_Deduccion`) REFERENCES `deducciones` (`Id_Deduccion`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `recibo_pago`
--
ALTER TABLE `recibo_pago`
  ADD CONSTRAINT `recibo_pago_ibfk_1` FOREIGN KEY (`Id_Tipo_Nomina`) REFERENCES `tipo_nomina` (`Id_Tipo_Nomina`) ON UPDATE CASCADE,
  ADD CONSTRAINT `recibo_pago_ibfk_2` FOREIGN KEY (`Id_Trabajador`) REFERENCES `trabajador` (`Id_Trabajador`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `registro_trabajadores`
--
ALTER TABLE `registro_trabajadores`
  ADD CONSTRAINT `registro_trabajadores_ibfk_1` FOREIGN KEY (`Id_Trabajador`) REFERENCES `trabajador` (`Id_Trabajador`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `registro_trabajadores_ibfk_2` FOREIGN KEY (`Id_Tipo_Nomina`) REFERENCES `tipo_nomina` (`Id_Tipo_Nomina`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `trabajador`
--
ALTER TABLE `trabajador`
  ADD CONSTRAINT `trabajador_ibfk_1` FOREIGN KEY (`Id_Profesion`) REFERENCES `profesion` (`Id_Profesion`) ON UPDATE CASCADE,
  ADD CONSTRAINT `trabajador_ibfk_2` FOREIGN KEY (`Id_Nivel_Educativo`) REFERENCES `nivel_educativo` (`Id_Nivel_Educativo`) ON UPDATE CASCADE,
  ADD CONSTRAINT `trabajador_ibfk_3` FOREIGN KEY (`Id_Contacto_Emergencia`) REFERENCES `contacto_emergencia` (`Id_Contacto_Emergencia`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`Id_rol`) REFERENCES `roles` (`Id_rol`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
