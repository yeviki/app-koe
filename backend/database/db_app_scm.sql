-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 15, 2025 at 10:40 AM
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
-- Database: `db_app_scm`
--

-- --------------------------------------------------------

--
-- Table structure for table `dt_nasabah`
--

CREATE TABLE `dt_nasabah` (
  `id` int(11) NOT NULL,
  `nm_nasabah` varchar(255) DEFAULT NULL,
  `no_hp` varchar(20) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `foto_ktp` text DEFAULT NULL,
  `foto_nasabah` text DEFAULT NULL,
  `foto_rumah` text DEFAULT NULL,
  `foto_usaha` text DEFAULT NULL,
  `foto_promise` text DEFAULT NULL,
  `id_status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dt_nasabah`
--

INSERT INTO `dt_nasabah` (`id`, `nm_nasabah`, `no_hp`, `alamat`, `foto_ktp`, `foto_nasabah`, `foto_rumah`, `foto_usaha`, `foto_promise`, `id_status`) VALUES
(1, 'tet', '12341234', NULL, '1765791444716-125662802.jpg', '1765791388337-673162511.jpg', '1765791388342-602422523.jpeg', '1765791388343-467372210.jpg', '1765791388345-669333729.jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `dt_regis_nasabah`
--

CREATE TABLE `dt_regis_nasabah` (
  `id` int(11) NOT NULL,
  `nomor_regis` varchar(255) DEFAULT NULL,
  `id_nasabah` int(11) DEFAULT NULL,
  `tabungan` bigint(20) DEFAULT NULL,
  `pinjaman` bigint(20) DEFAULT NULL,
  `bunga` int(11) DEFAULT NULL,
  `adm` int(11) DEFAULT NULL,
  `tot_bunga` bigint(20) DEFAULT NULL,
  `tenor_hari` int(11) DEFAULT NULL,
  `total_angsuran` bigint(20) DEFAULT NULL,
  `total_uang_diterima` bigint(20) DEFAULT NULL,
  `status_transaksi` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dt_transaksi`
--

CREATE TABLE `dt_transaksi` (
  `id` int(11) NOT NULL,
  `id_nasabah` int(11) DEFAULT NULL,
  `id_regis_nasabah` int(11) DEFAULT NULL,
  `debit` bigint(20) DEFAULT NULL,
  `kredit` bigint(20) DEFAULT NULL,
  `angsuran_ke` int(11) DEFAULT NULL,
  `jenis_transaksi` int(11) DEFAULT NULL,
  `tanggal_transaksi` datetime DEFAULT NULL,
  `tanggal_input` date DEFAULT NULL,
  `keterangan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `syst_app_settings`
--

CREATE TABLE `syst_app_settings` (
  `id` int(11) NOT NULL,
  `key` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `syst_app_settings`
--

INSERT INTO `syst_app_settings` (`id`, `key`, `value`, `message`) VALUES
(1, 'application_mode', '0', 'Mohon maaf terjadi gangguan sistem, sistem saat ini sedang diupgrade, mohon tunggu sebentar TIM sedang mengatasi masalah tersebut');

-- --------------------------------------------------------

--
-- Table structure for table `syst_control`
--

CREATE TABLE `syst_control` (
  `id` int(11) NOT NULL,
  `control_name` varchar(50) DEFAULT NULL,
  `label_control` varchar(50) DEFAULT NULL,
  `id_status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `syst_control`
--

INSERT INTO `syst_control` (`id`, `control_name`, `label_control`, `id_status`) VALUES
(1, 'index', 'View Index', 1),
(2, 'create', 'Create Data', 1),
(3, 'update', 'Update Data', 1),
(4, 'delete', 'Delete Data', 1),
(5, 'detailList', 'List Detail', 1),
(6, 'setDetail', 'Set Detail', 1),
(7, 'updateDetail', 'Update Detail', 1),
(8, 'deleteDetail', 'Delete Detail', 1);

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
(1, 5, '2025-12-08 11:02:11', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'failed', NULL, 'testing'),
(2, 5, '2025-12-08 11:02:18', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-08 11:33:32', 'testing'),
(3, 1, '2025-12-08 11:03:38', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-08 11:32:30', 'yeviki'),
(4, 1, '2025-12-08 11:32:34', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-08 11:37:07', 'yeviki'),
(5, 5, '2025-12-08 11:34:12', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-08 13:23:31', 'testing'),
(6, 1, '2025-12-08 11:37:12', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-08 12:32:04', 'yeviki'),
(7, 1, '2025-12-08 12:32:10', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-08 12:33:54', 'yeviki'),
(8, 1, '2025-12-08 12:33:59', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(9, 1, '2025-12-08 12:34:22', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-08 13:00:38', 'yeviki'),
(10, 1, '2025-12-08 13:00:42', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(11, 1, '2025-12-08 13:01:20', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-08 13:01:29', 'yeviki'),
(12, 1, '2025-12-08 13:01:37', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-08 13:02:06', 'yeviki'),
(13, 1, '2025-12-08 13:02:10', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-08 13:02:15', 'yeviki'),
(14, 1, '2025-12-08 13:03:31', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-08 13:03:34', 'yeviki'),
(15, 1, '2025-12-08 13:04:18', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-08 13:04:20', 'yeviki'),
(16, 1, '2025-12-08 13:11:27', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-08 13:17:09', 'yeviki'),
(17, 1, '2025-12-08 13:17:14', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-08 13:17:22', 'yeviki'),
(18, 1, '2025-12-08 13:17:28', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(19, 5, '2025-12-08 13:20:05', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-08 13:23:31', 'testing'),
(20, 5, '2025-12-08 13:23:40', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(21, 5, '2025-12-08 13:33:58', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(22, 1, '2025-12-08 15:41:29', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(23, 1, '2025-12-08 15:41:35', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(24, 1, '2025-12-08 15:46:02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(25, 1, '2025-12-08 15:46:13', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(26, 1, '2025-12-08 15:47:56', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(27, 1, '2025-12-08 15:49:21', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(28, 1, '2025-12-08 15:50:13', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(29, 1, '2025-12-08 15:50:39', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-08 15:51:27', 'yeviki'),
(30, 1, '2025-12-08 15:51:31', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(31, 5, '2025-12-08 16:26:15', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(32, 1, '2025-12-09 08:45:04', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-09 08:49:17', 'yeviki'),
(33, 5, '2025-12-09 08:48:32', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(34, 1, '2025-12-09 08:49:26', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(35, 1, '2025-12-09 09:15:23', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(36, 1, '2025-12-09 09:40:01', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-09 09:41:20', 'yeviki'),
(37, 5, '2025-12-09 09:41:33', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(38, 5, '2025-12-09 09:41:41', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(39, 5, '2025-12-09 09:41:47', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(40, 5, '2025-12-09 09:41:54', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(41, 5, '2025-12-09 09:42:02', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(42, 1, '2025-12-09 09:46:18', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(43, 1, '2025-12-09 09:49:39', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(44, 1, '2025-12-09 09:50:24', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(45, 1, '2025-12-09 09:50:53', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(46, 1, '2025-12-09 09:51:19', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-09 09:51:37', 'yeviki'),
(47, 1, '2025-12-09 09:51:41', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-09 09:52:21', 'yeviki'),
(48, 1, '2025-12-09 09:52:25', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(49, 1, '2025-12-09 09:56:18', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', '2025-12-09 09:56:26', 'yeviki'),
(50, 1, '2025-12-09 10:29:03', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(51, 5, '2025-12-09 10:55:55', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(52, 5, '2025-12-09 10:56:06', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(53, 1, '2025-12-09 14:38:18', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(54, 5, '2025-12-09 15:11:44', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(55, 1, '2025-12-09 15:42:36', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(56, 1, '2025-12-12 13:18:52', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(57, 1, '2025-12-12 14:55:46', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(58, 1, '2025-12-15 09:41:51', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'success', '2025-12-15 10:10:40', 'yeviki'),
(59, 1, '2025-12-15 10:14:50', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'success', '2025-12-15 10:14:58', 'yeviki'),
(60, 1, '2025-12-15 10:16:59', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(61, 1, '2025-12-15 11:21:39', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(62, 1, '2025-12-15 12:21:46', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(63, 5, '2025-12-15 12:23:35', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(64, 1, '2025-12-15 13:43:03', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'success', NULL, 'yeviki'),
(65, 5, '2025-12-15 13:43:13', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(66, 5, '2025-12-15 14:23:11', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(67, 5, '2025-12-15 15:24:03', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'success', NULL, 'testing'),
(68, 5, '2025-12-15 15:49:25', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'success', NULL, 'testing');

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
(6, 'Roles', '/roles', 'Fingerprint', 3, 2, 'RolesPage'),
(7, 'Data Nasabah', '/nasabah', 'Settings', 1, 3, 'NasabahPage'),
(8, 'Laporan', '#', 'Files', 4, NULL, NULL),
(10, 'Module', '/module', 'File', 4, 2, 'ModulePage'),
(11, 'Control', '/control', 'Key', 5, 2, 'ControlPage');

-- --------------------------------------------------------

--
-- Table structure for table `syst_module`
--

CREATE TABLE `syst_module` (
  `id` int(11) NOT NULL,
  `module_name` varchar(50) DEFAULT NULL,
  `label_module` varchar(50) DEFAULT NULL,
  `id_status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `syst_module`
--

INSERT INTO `syst_module` (`id`, `module_name`, `label_module`, `id_status`) VALUES
(1, 'users', 'Users', 1),
(2, 'menu', 'Menu', 1),
(3, 'roles', 'Roles', 1),
(4, 'module', 'Module', 1),
(5, 'control', 'Control', 1),
(6, 'nasabah', 'Nasabah', 1);

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
(19, 2, 2, 1),
(20, 1, 10, 1),
(21, 1, 11, 1);

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

--
-- Dumping data for table `syst_roles_permissions`
--

INSERT INTO `syst_roles_permissions` (`id`, `roles_id`, `module_id`, `control_id`, `id_status`) VALUES
(1, 1, 1, 1, 1),
(2, 1, 1, 2, 1),
(3, 1, 1, 3, 1),
(4, 1, 1, 4, 1),
(5, 1, 2, 1, 1),
(6, 1, 2, 2, 1),
(7, 1, 2, 3, 1),
(8, 1, 2, 4, 1),
(9, 1, 4, 1, 1),
(10, 1, 4, 2, 1),
(11, 1, 4, 3, 1),
(12, 1, 4, 4, 1),
(13, 1, 5, 1, 1),
(14, 1, 5, 2, 1),
(15, 1, 5, 3, 1),
(16, 1, 5, 4, 1),
(17, 1, 3, 1, 1),
(18, 1, 3, 2, 1),
(19, 1, 3, 3, 1),
(20, 1, 3, 4, 1),
(21, 1, 3, 5, 1),
(22, 1, 3, 6, 1),
(23, 1, 3, 7, 1),
(24, 1, 3, 8, 1),
(25, 2, 1, 1, 1),
(26, 2, 1, 2, 1),
(27, 2, 1, 3, 0),
(28, 2, 6, 1, 1),
(29, 2, 6, 2, 1),
(30, 2, 6, 3, 1),
(31, 2, 6, 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `syst_status`
--

CREATE TABLE `syst_status` (
  `id` int(11) NOT NULL,
  `status_name` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `syst_status`
--

INSERT INTO `syst_status` (`id`, `status_name`) VALUES
(1, 'Aktif'),
(3, 'Tidak Aktif');

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
  `fullname` varchar(50) DEFAULT NULL,
  `blokir` enum('Ya','Tidak') DEFAULT NULL,
  `id_status` enum('Tidak Aktif','Aktif') DEFAULT NULL,
  `fail_count` int(11) DEFAULT NULL,
  `blocked_until` datetime DEFAULT NULL,
  `force_logout` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `syst_users`
--

INSERT INTO `syst_users` (`id`, `username`, `email`, `password`, `created_at`, `fullname`, `blokir`, `id_status`, `fail_count`, `blocked_until`, `force_logout`) VALUES
(1, 'yeviki', 'yeviki@gmail.com', '$2b$10$fSNk9ntz9dHBEN60FyO4EOwO7NoiTPsSJpDFUtofHAFDyIdzTfU2S', '2025-11-17 20:41:13', 'Yeviki Maisyah Putra', 'Tidak', 'Aktif', 0, NULL, 0),
(2, 'superadmin', 'admin@gmail.com', '$2b$10$s4K.epY1j14DZd2uWfUBNew/VwPpnf8.kVEdsbBStBn95s4P/W95W', '2025-11-17 22:16:54', 'Admin Super', 'Tidak', 'Aktif', 0, NULL, 0),
(3, 'supersaya', 'saya@gmail.com', '$2b$10$cBPot5EaqvqfR6tu.ixb7usJgDRjwvHWYOgEOaY0kaQEM2I/u7JGO', '2025-11-18 19:50:33', 'Saya Super', 'Tidak', 'Aktif', NULL, NULL, 0),
(4, 'test', 'test@gmail.com', '$2b$10$t/9EQdhHjtvbYNfXcCTN4evKKHRulrMveS9F/x55R8RuP78IFqhta', '2025-11-19 01:16:43', 'Pimpinan', 'Tidak', 'Aktif', 0, NULL, 0),
(5, 'testing', 'testing@gmail.com', '$2b$10$Nq1k3qANRc92hzamT9XWBeUcNUvqBTAMjOcpvKTw9JuS0GdPJaysG', '2025-11-19 01:38:29', 'Nama Testing', 'Tidak', 'Aktif', 0, NULL, 0),
(21, 'stafadmin', 'staf@gmail.com', '$2b$10$KF6cLK.WYpUDUalfYBbfi.t1ppksEC6DKNSEf56z8FdJkvmQTaA4G', '2025-12-08 06:16:51', 'Staf', 'Tidak', 'Aktif', NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `syst_users_roles`
--

CREATE TABLE `syst_users_roles` (
  `id` int(11) NOT NULL,
  `users_id` int(11) DEFAULT NULL,
  `roles_id` int(11) DEFAULT NULL,
  `id_status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `syst_users_roles`
--

INSERT INTO `syst_users_roles` (`id`, `users_id`, `roles_id`, `id_status`) VALUES
(3, 2, 1, 1),
(4, 3, 1, 1),
(5, 4, 3, 1),
(6, 5, 2, 1),
(7, 1, 1, 1),
(8, 1, 2, 1),
(9, 21, 4, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dt_nasabah`
--
ALTER TABLE `dt_nasabah`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dt_regis_nasabah`
--
ALTER TABLE `dt_regis_nasabah`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dt_transaksi`
--
ALTER TABLE `dt_transaksi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `syst_app_settings`
--
ALTER TABLE `syst_app_settings`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `syst_control`
--
ALTER TABLE `syst_control`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `syst_login_history`
--
ALTER TABLE `syst_login_history`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `user_id` (`user_id`) USING BTREE;

--
-- Indexes for table `syst_menu`
--
ALTER TABLE `syst_menu`
  ADD PRIMARY KEY (`id_menu`) USING BTREE;

--
-- Indexes for table `syst_module`
--
ALTER TABLE `syst_module`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `syst_roles`
--
ALTER TABLE `syst_roles`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `syst_roles_menu`
--
ALTER TABLE `syst_roles_menu`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `menu_id` (`menu_id`) USING BTREE,
  ADD KEY `syst_roles_menu_ibfk_1` (`roles_id`);

--
-- Indexes for table `syst_roles_permissions`
--
ALTER TABLE `syst_roles_permissions`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `syst_status`
--
ALTER TABLE `syst_status`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `syst_users`
--
ALTER TABLE `syst_users`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `email` (`email`) USING BTREE;

--
-- Indexes for table `syst_users_roles`
--
ALTER TABLE `syst_users_roles`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dt_nasabah`
--
ALTER TABLE `dt_nasabah`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `dt_regis_nasabah`
--
ALTER TABLE `dt_regis_nasabah`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dt_transaksi`
--
ALTER TABLE `dt_transaksi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `syst_app_settings`
--
ALTER TABLE `syst_app_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `syst_control`
--
ALTER TABLE `syst_control`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `syst_login_history`
--
ALTER TABLE `syst_login_history`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `syst_menu`
--
ALTER TABLE `syst_menu`
  MODIFY `id_menu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `syst_module`
--
ALTER TABLE `syst_module`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `syst_roles`
--
ALTER TABLE `syst_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `syst_roles_menu`
--
ALTER TABLE `syst_roles_menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `syst_roles_permissions`
--
ALTER TABLE `syst_roles_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `syst_status`
--
ALTER TABLE `syst_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `syst_users`
--
ALTER TABLE `syst_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `syst_users_roles`
--
ALTER TABLE `syst_users_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `syst_roles_menu`
--
ALTER TABLE `syst_roles_menu`
  ADD CONSTRAINT `syst_roles_menu_ibfk_1` FOREIGN KEY (`roles_id`) REFERENCES `syst_roles` (`id`),
  ADD CONSTRAINT `syst_roles_menu_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `syst_menu` (`id_menu`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
