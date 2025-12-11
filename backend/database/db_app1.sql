-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 25, 2025 at 10:03 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `syst_menu`
--

CREATE TABLE `syst_menu` (
  `id_menu` int(11) NOT NULL,
  `title_menu` varchar(255) DEFAULT NULL,
  `url_menu` varchar(255) DEFAULT NULL,
  `icon_menu` varchar(255) DEFAULT NULL,
  `order_menu` smallint(6) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `create_by` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `syst_menu`
--

INSERT INTO `syst_menu` (`id_menu`, `title_menu`, `url_menu`, `icon_menu`, `order_menu`, `parent_id`, `create_by`) VALUES
(1, 'Dashboard', 'dashboard', 'LayoutDashboard', 1, NULL, 'yeviki'),
(2, 'Users', 'users', 'Users', 2, NULL, 'yeviki'),
(3, 'teass', 'tesat', 'tea', 1, NULL, NULL),
(4, 'tesatttt', 'teasttat', 'teattat', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `syst_roles`
--

CREATE TABLE `syst_roles` (
  `id` int(11) NOT NULL,
  `nama_role` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `syst_roles_menu`
--

CREATE TABLE `syst_roles_menu` (
  `id` int(11) NOT NULL,
  `id_role` int(11) DEFAULT NULL,
  `id_menu` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `syst_users`
--

CREATE TABLE `syst_users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `syst_users`
--

INSERT INTO `syst_users` (`id`, `username`, `email`, `password`, `created_at`, `role`) VALUES
(1, 'yeviki', 'yeviki@gmail.com', '$2b$10$fSNk9ntz9dHBEN60FyO4EOwO7NoiTPsSJpDFUtofHAFDyIdzTfU2S', '2025-11-18 03:41:13', 'adminsuper'),
(2, 'Admin Super', 'admin@gmail.com', '$2b$10$HyoaU9NaVVbNuSD3v2HN8O2x/yobOaOQAoGtadCEVRxX3oDrswKU2', '2025-11-18 05:16:54', 'adminsuper'),
(5, 'Saya Super', 'saya@gmail.com', '$2b$10$.hbDI.eUbKXy1bFZlkAxs.CWIozQB7AIG4pSFTWV0AofsYOw4ebl6', '2025-11-19 02:50:33', 'adminsuper'),
(8, 'test', 'test@gmail.com', '$2b$10$xGjtIchHxfC77CP7h/yH/OIm8olvl02KJD/0hWY1LByIctfZeA8Hi', '2025-11-19 08:16:43', 'pimpinan'),
(9, 'testing', 'testing@gmail.com', '$2b$10$WjxYbTOfjLxzasflomsBUOid02RnZRU/6T/O9JADuLXxLLfc4eI2a', '2025-11-19 08:38:29', 'adminlocal'),
(20, 'test1', 'test1@gmail.com', '$2b$10$nYuQV1lj89mcq5nUaLZjz.2qF0BPPxHLwvtwyZOBi1Ig4a/yi9GRe', '2025-11-24 09:44:30', 'adminlocal');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `syst_menu`
--
ALTER TABLE `syst_menu`
  ADD PRIMARY KEY (`id_menu`) USING BTREE;

--
-- Indexes for table `syst_roles`
--
ALTER TABLE `syst_roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `syst_roles_menu`
--
ALTER TABLE `syst_roles_menu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `syst_users`
--
ALTER TABLE `syst_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `syst_menu`
--
ALTER TABLE `syst_menu`
  MODIFY `id_menu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `syst_users`
--
ALTER TABLE `syst_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
