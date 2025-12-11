-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 01, 2025 at 10:34 AM
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
-- Table structure for table `syst_control`
--

CREATE TABLE `syst_control` (
  `id` int(11) NOT NULL,
  `control_name` varchar(50) DEFAULT NULL,
  `id_status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `syst_login_history`
--

CREATE TABLE `syst_login_history` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `login_time` datetime DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `logout_time` datetime DEFAULT NULL,
  `attempted_email` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `syst_login_history`
--

INSERT INTO `syst_login_history` (`id`, `user_id`, `login_time`, `ip_address`, `user_agent`, `status`, `logout_time`, `attempted_email`) VALUES
(49, 1, '2025-12-01 09:01:29', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(50, 1, '2025-12-01 09:22:46', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(51, 1, '2025-12-01 09:23:03', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(52, 1, '2025-12-01 09:23:48', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(53, 1, '2025-12-01 09:55:51', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(54, 1, '2025-12-01 11:14:32', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(55, 1, '2025-12-01 11:18:59', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(56, 1, '2025-12-01 11:19:11', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-01 11:54:33', 'yeviki'),
(57, 1, '2025-12-01 11:55:16', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-01 12:22:35', 'yeviki'),
(58, 9, '2025-12-01 12:22:53', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'failed', NULL, 'testing'),
(59, 9, '2025-12-01 12:22:56', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'failed', NULL, 'testing'),
(60, 9, '2025-12-01 12:22:57', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'failed', NULL, 'testing'),
(61, 9, '2025-12-01 12:22:58', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'failed', NULL, 'testing'),
(62, 9, '2025-12-01 12:22:58', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'failed', NULL, 'testing'),
(63, 2, '2025-12-01 12:23:40', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-01 12:23:48', 'superadmin'),
(64, 9, '2025-12-01 12:24:28', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'failed', NULL, 'testing'),
(65, 1, '2025-12-01 13:57:32', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-01 14:02:14', 'yeviki'),
(66, 9, '2025-12-01 14:02:19', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(67, 9, '2025-12-01 14:03:03', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(68, 9, '2025-12-01 14:15:40', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(69, 9, '2025-12-01 14:17:28', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(70, 9, '2025-12-01 14:19:26', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(71, 1, '2025-12-01 14:20:58', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-01 14:21:03', 'yeviki'),
(72, 9, '2025-12-01 14:21:09', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'failed', NULL, 'testing'),
(73, 9, '2025-12-01 14:21:12', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(74, 9, '2025-12-01 14:29:12', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(75, 9, '2025-12-01 14:30:50', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'failed', NULL, 'testing'),
(76, 9, '2025-12-01 14:30:55', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(77, 9, '2025-12-01 14:31:27', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(78, 9, '2025-12-01 14:32:20', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(79, 9, '2025-12-01 14:35:28', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(80, 9, '2025-12-01 14:39:05', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(81, 9, '2025-12-01 16:24:41', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'testing');

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
  `component` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `syst_menu`
--

INSERT INTO `syst_menu` (`id_menu`, `title_menu`, `url_menu`, `icon_menu`, `order_menu`, `parent_id`, `component`) VALUES
(1, 'Dashboard', '/dashboard', 'LayoutDashboard', 1, NULL, 'DashboardHome'),
(2, 'Management System', '#', 'Shapes', 2, NULL, NULL),
(3, 'Panel Admin', '#', 'Admin', 3, NULL, NULL),
(4, 'Users', '/users', 'Users', 1, 2, 'UsersPage'),
(5, 'Menu', '/menu', 'Menu', 2, 2, 'MenuPage'),
(6, 'Roles', '/roles', 'Key', 3, 2, 'RolesPage'),
(7, 'Sub Menu 1', '/subMenu', 'Settings', 1, 3, 'SubMenuPage'),
(8, 'Laporan', '#', 'Files', 4, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `syst_module`
--

CREATE TABLE `syst_module` (
  `id` int(11) NOT NULL,
  `module_name` varchar(50) DEFAULT NULL,
  `id_status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `syst_roles`
--

CREATE TABLE `syst_roles` (
  `id` int(11) NOT NULL,
  `roles_name` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `syst_roles`
--

INSERT INTO `syst_roles` (`id`, `roles_name`) VALUES
(1, 'Super Admin'),
(2, 'Local Admin'),
(3, 'Pimpinan'),
(4, 'Staf');

-- --------------------------------------------------------

--
-- Table structure for table `syst_roles_menu`
--

CREATE TABLE `syst_roles_menu` (
  `id` int(11) NOT NULL,
  `roles_id` int(11) DEFAULT NULL,
  `menu_id` int(11) DEFAULT NULL,
  `id_status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `syst_roles_menu`
--

INSERT INTO `syst_roles_menu` (`id`, `roles_id`, `menu_id`, `id_status`) VALUES
(6, 2, 1, 1),
(7, 2, 3, 1),
(8, 2, 7, 1),
(9, 3, 1, 1),
(10, 3, 8, 1),
(11, 1, 1, 1),
(12, 1, 2, 1),
(13, 1, 4, 1),
(14, 1, 5, 1),
(15, 1, 6, 1),
(16, 1, 3, 1),
(17, 1, 7, 1),
(18, 2, 4, 1),
(19, 2, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `syst_roles_permissions`
--

CREATE TABLE `syst_roles_permissions` (
  `id` int(11) NOT NULL,
  `roles_id` int(11) DEFAULT NULL,
  `module_id` int(11) DEFAULT NULL,
  `control_id` int(11) DEFAULT NULL,
  `id_status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `syst_status`
--

CREATE TABLE `syst_status` (
  `id` int(11) NOT NULL,
  `status_name` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `syst_users`
--

CREATE TABLE `syst_users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `roles_id` int(11) DEFAULT NULL,
  `fullname` varchar(50) DEFAULT NULL,
  `blokir` enum('Ya','Tidak') DEFAULT NULL,
  `id_status` enum('Tidak Aktif','Aktif') DEFAULT NULL,
  `fail_count` int(11) DEFAULT NULL,
  `blocked_until` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `syst_users`
--

INSERT INTO `syst_users` (`id`, `username`, `email`, `password`, `created_at`, `roles_id`, `fullname`, `blokir`, `id_status`, `fail_count`, `blocked_until`) VALUES
(1, 'yeviki', 'yeviki@gmail.com', '$2b$10$fSNk9ntz9dHBEN60FyO4EOwO7NoiTPsSJpDFUtofHAFDyIdzTfU2S', '2025-11-17 20:41:13', 1, 'Yeviki Maisyah Putra', 'Tidak', 'Aktif', 0, NULL),
(2, 'superadmin', 'admin@gmail.com', '$2b$10$s4K.epY1j14DZd2uWfUBNew/VwPpnf8.kVEdsbBStBn95s4P/W95W', '2025-11-17 22:16:54', 1, 'Admin Super', 'Tidak', 'Aktif', 0, NULL),
(5, 'supersaya', 'saya@gmail.com', '$2b$10$cBPot5EaqvqfR6tu.ixb7usJgDRjwvHWYOgEOaY0kaQEM2I/u7JGO', '2025-11-18 19:50:33', 1, 'Saya Super', 'Tidak', 'Aktif', NULL, NULL),
(8, 'test', 'test@gmail.com', '$2b$10$t/9EQdhHjtvbYNfXcCTN4evKKHRulrMveS9F/x55R8RuP78IFqhta', '2025-11-19 01:16:43', 3, 'Pimpinan', 'Tidak', 'Aktif', 0, NULL),
(9, 'testing', 'testing@gmail.com', '$2b$10$Nq1k3qANRc92hzamT9XWBeUcNUvqBTAMjOcpvKTw9JuS0GdPJaysG', '2025-11-19 01:38:29', 2, 'Nama Testing', 'Tidak', 'Aktif', 0, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `syst_control`
--
ALTER TABLE `syst_control`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `syst_login_history`
--
ALTER TABLE `syst_login_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `syst_menu`
--
ALTER TABLE `syst_menu`
  ADD PRIMARY KEY (`id_menu`) USING BTREE;

--
-- Indexes for table `syst_module`
--
ALTER TABLE `syst_module`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `syst_roles`
--
ALTER TABLE `syst_roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `syst_roles_menu`
--
ALTER TABLE `syst_roles_menu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `roles_id` (`roles_id`),
  ADD KEY `menu_id` (`menu_id`);

--
-- Indexes for table `syst_roles_permissions`
--
ALTER TABLE `syst_roles_permissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `syst_status`
--
ALTER TABLE `syst_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `syst_users`
--
ALTER TABLE `syst_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `roles_id` (`roles_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `syst_login_history`
--
ALTER TABLE `syst_login_history`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `syst_menu`
--
ALTER TABLE `syst_menu`
  MODIFY `id_menu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `syst_roles`
--
ALTER TABLE `syst_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `syst_roles_menu`
--
ALTER TABLE `syst_roles_menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `syst_roles_permissions`
--
ALTER TABLE `syst_roles_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `syst_status`
--
ALTER TABLE `syst_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `syst_users`
--
ALTER TABLE `syst_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `syst_roles_menu`
--
ALTER TABLE `syst_roles_menu`
  ADD CONSTRAINT `syst_roles_menu_ibfk_1` FOREIGN KEY (`roles_id`) REFERENCES `syst_roles` (`id`),
  ADD CONSTRAINT `syst_roles_menu_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `syst_menu` (`id_menu`);

--
-- Constraints for table `syst_users`
--
ALTER TABLE `syst_users`
  ADD CONSTRAINT `syst_users_ibfk_1` FOREIGN KEY (`roles_id`) REFERENCES `syst_roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
