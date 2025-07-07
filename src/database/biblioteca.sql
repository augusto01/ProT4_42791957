-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-07-2025 a las 08:09:41
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
-- Base de datos: `biblioteca`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libros`
--

CREATE TABLE `libros` (
  `id` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `autor` varchar(30) NOT NULL,
  `categoria` varchar(30) NOT NULL,
  `año_publicacion` date NOT NULL,
  `isbn` varchar(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `libros`
--

INSERT INTO `libros` (`id`, `nombre`, `autor`, `categoria`, `año_publicacion`, `isbn`) VALUES
(2, '1984', 'George Orwell', 'Distopía', '1949-06-08', '9780451524935'),
(3, 'El principito', 'Antoine de Saint-Exupéry', 'Fábula', '1943-04-06', '9780156013987'),
(4, 'Rayuela', 'Julio Cortázar', 'Novela', '1963-06-28', '9788437602948'),
(5, 'Fahrenheit 451', 'Ray Bradbury', 'Ciencia ficción', '1953-10-19', '9781451673319'),
(6, 'Don Quijote de la Mancha', 'Miguel de Cervantes', 'Clásico', '1605-01-16', '9788491050663'),
(7, 'Crónica de una muerte anunciad', 'Gabriel García Márquez', 'Novela corta', '1981-03-01', '9781400034710'),
(8, 'La sombra del viento', 'Carlos Ruiz Zafón', 'Misterio', '2001-06-06', '9788408172174'),
(9, 'Orgullo y prejuicio', 'Jane Austen', 'Romance', '1813-01-28', '9780141439518'),
(10, 'El código Da Vinci', 'Dan Brown', 'Thriller', '2003-03-18', '9780307474278');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `libros`
--
ALTER TABLE `libros`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `isbn` (`isbn`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `libros`
--
ALTER TABLE `libros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
