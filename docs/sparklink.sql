-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 03, 2026 at 06:01 PM
-- Server version: 8.0.45-0ubuntu0.22.04.1
-- PHP Version: 8.1.2-1ubuntu2.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sparklink`
--

-- --------------------------------------------------------

--
-- Table structure for table `availability`
--

CREATE TABLE `availability` (
  `id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `day_of_week` enum('Mon','Tue','Wed','Thu','Fri','Sat','Sun') DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `availability`
--

INSERT INTO `availability` (`id`, `user_id`, `day_of_week`, `start_time`, `end_time`) VALUES
(1, 1, 'Mon', '09:00:00', '12:00:00'),
(2, 1, 'Mon', '14:00:00', '18:00:00'),
(3, 3, 'Mon', '10:00:00', '16:00:00'),
(4, 4, 'Mon', '11:00:00', '20:00:00'),
(5, 19, 'Mon', '09:00:00', '12:00:00'),
(6, 20, 'Mon', '09:00:00', '12:00:00'),
(7, 28, 'Thu', '07:00:00', '08:00:00'),
(8, 29, 'Thu', '07:00:00', '08:00:00'),
(9, 31, 'Fri', '06:00:00', '09:00:00'),
(10, 31, 'Fri', '11:00:00', '12:00:00'),
(14, 30, 'Wed', '06:00:00', '23:00:00'),
(19, 34, 'Wed', '06:00:00', '23:00:00'),
(20, 36, 'Wed', '06:00:00', '23:00:00'),
(23, 38, 'Thu', '09:00:00', '12:00:00'),
(24, 38, 'Thu', '13:00:00', '24:00:00'),
(25, 37, 'Thu', '09:00:00', '12:00:00'),
(26, 37, 'Thu', '13:00:00', '24:00:00'),
(31, 42, 'Wed', '01:00:00', '24:00:00'),
(32, 43, 'Wed', '01:00:00', '24:00:00'),
(37, 41, 'Thu', '01:00:00', '24:00:00'),
(38, 39, 'Thu', '06:00:00', '23:00:00'),
(40, 46, 'Sat', '22:00:00', '23:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `availability_requests`
--

CREATE TABLE `availability_requests` (
  `id` bigint NOT NULL,
  `match_id` int NOT NULL,
  `from_user_id` bigint NOT NULL,
  `to_user_id` bigint NOT NULL,
  `request_count` tinyint NOT NULL DEFAULT '1',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `availability_requests`
--

INSERT INTO `availability_requests` (`id`, `match_id`, `from_user_id`, `to_user_id`, `request_count`, `updated_at`, `created_at`) VALUES
(1, 6, 19, 20, 1, '2026-04-22 18:40:41', '2026-04-22 18:40:41'),
(2, 8, 31, 30, 1, '2026-04-24 17:38:47', '2026-04-24 17:38:47'),
(3, 9, 34, 36, 1, '2026-04-28 19:38:31', '2026-04-28 19:38:31'),
(4, 10, 37, 38, 1, '2026-04-29 18:06:21', '2026-04-29 18:06:21'),
(5, 11, 41, 39, 1, '2026-04-29 18:35:24', '2026-04-29 18:35:24'),
(6, 16, 46, 45, 1, '2026-05-02 18:24:10', '2026-05-02 18:24:10');

-- --------------------------------------------------------

--
-- Table structure for table `compatibility_scores`
--

CREATE TABLE `compatibility_scores` (
  `id` bigint NOT NULL,
  `user1_id` bigint DEFAULT NULL,
  `user2_id` bigint DEFAULT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `calculated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `compatibility_scores`
--

INSERT INTO `compatibility_scores` (`id`, `user1_id`, `user2_id`, `score`, `calculated_at`) VALUES
(1, 1, 3, '85.50', '2026-04-11 09:16:27'),
(2, 1, 4, '78.00', '2026-04-11 09:16:27');

-- --------------------------------------------------------

--
-- Table structure for table `email_otp`
--

CREATE TABLE `email_otp` (
  `otp_id` bigint NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `otp` varchar(10) DEFAULT NULL,
  `type` enum('signup','login','reset') DEFAULT NULL,
  `is_used` tinyint(1) DEFAULT '0',
  `expires_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `email_otp`
--

INSERT INTO `email_otp` (`otp_id`, `email`, `otp`, `type`, `is_used`, `expires_at`, `created_at`) VALUES
(1, 'belle@example.com', '123456', 'signup', 0, '2026-04-11 09:29:03', '2026-04-11 09:19:03'),
(2, 'john@example.com', '654321', 'login', 0, '2026-04-11 09:29:03', '2026-04-11 09:19:03'),
(3, 'vinodRyaka@gmail.com', '123456', 'signup', 1, '2026-04-16 17:16:03', '2026-04-16 17:06:03'),
(4, 'vinodRyaka@gmail.com', '123456', 'reset', 1, '2026-04-16 17:17:29', '2026-04-16 17:07:28'),
(5, 'testuser@gmail.com', '123456', 'signup', 1, '2026-04-16 17:58:46', '2026-04-16 17:48:46'),
(6, 'rahulsharma@gmail.com', '123456', 'signup', 1, '2026-04-17 17:25:14', '2026-04-17 17:15:13'),
(7, 'PriyaVerma@gmail.com', '123456', 'signup', 1, '2026-04-17 17:26:42', '2026-04-17 17:16:41'),
(8, 'AmanGupta@gmail.com', '123456', 'signup', 1, '2026-04-17 18:34:57', '2026-04-17 18:24:57'),
(9, 'SnehaKapoor@gmail.com', '123456', 'signup', 1, '2026-04-17 18:36:56', '2026-04-17 18:26:55'),
(10, 'KaranMehta@gmail.com', '123456', 'signup', 1, '2026-04-17 18:58:28', '2026-04-17 18:48:28'),
(11, 'rizwansheikh661@gmail.com', '123456', 'signup', 1, '2026-04-18 05:40:15', '2026-04-18 05:30:14'),
(12, 'nameerasheikh661@gmail.com', '123456', 'signup', 1, '2026-04-18 06:13:30', '2026-04-18 06:03:30'),
(13, 'RohitSingh@gmail.com', '123456', 'signup', 1, '2026-04-18 17:14:19', '2026-04-18 17:04:18'),
(14, 'NehaReddy@gmail.com', '123456', 'signup', 1, '2026-04-18 17:16:24', '2026-04-18 17:06:24'),
(15, 'Amanji@gail.com', '123456', 'signup', 1, '2026-04-18 18:25:48', '2026-04-18 18:15:48'),
(16, 'Snehaji@gail.com', '123456', 'signup', 1, '2026-04-18 18:29:15', '2026-04-18 18:19:15'),
(17, 'Snehaji@gail.com', '123456', 'reset', 0, '2026-04-19 14:03:17', '2026-04-19 13:53:16'),
(18, 'Amanji@gail.com', '123456', 'reset', 1, '2026-04-19 17:26:18', '2026-04-19 17:16:17'),
(19, 'amitsingh@yopmail.com', '123456', 'signup', 0, '2026-04-20 19:24:06', '2026-04-20 19:14:05'),
(20, 'Amanji@gail.com', '123456', 'reset', 1, '2026-04-20 19:27:32', '2026-04-20 19:17:32'),
(21, 'Amanji@gail.com', '123456', 'reset', 1, '2026-04-20 19:30:12', '2026-04-20 19:20:11'),
(22, 'Amanji@gail.com', '123456', 'reset', 1, '2026-04-20 19:33:42', '2026-04-20 19:23:42'),
(23, 'arjun.sparktest@yopmail.com', '360643', 'signup', 0, '2026-04-22 16:19:15', '2026-04-22 16:09:14'),
(24, 'priya.sparktest@yopmail.com', '268986', 'signup', 0, '2026-04-22 16:19:29', '2026-04-22 16:09:29'),
(25, 'arjun.sparktest2@mailinator.com', '361988', 'signup', 0, '2026-04-22 16:23:54', '2026-04-22 16:13:54'),
(26, 'Rahuldas@gmail.com', '742047', 'signup', 0, '2026-04-23 17:41:31', '2026-04-23 17:31:31'),
(27, 'rahuldas@yopmail.com', '911998', 'signup', 1, '2026-04-23 17:43:26', '2026-04-23 17:33:25'),
(28, 'priyadas@yopmail.com', '170654', 'signup', 1, '2026-04-23 17:48:48', '2026-04-23 17:38:48'),
(29, 'amanmeena@yopmail.com', '812872', 'signup', 1, '2026-04-24 17:31:42', '2026-04-24 17:21:42'),
(30, 'nehameena@yopmail.com', '323686', 'signup', 1, '2026-04-24 17:38:36', '2026-04-24 17:28:35'),
(31, 'yadaybrand@yopmail.com', '819860', 'signup', 1, '2026-04-26 16:13:30', '2026-04-26 16:03:30'),
(32, 'ethan@yopmail.com', '101994', 'signup', 1, '2026-04-28 19:21:04', '2026-04-28 19:11:03'),
(33, 'sophia@yopmail.com', '904460', 'signup', 0, '2026-04-28 19:39:44', '2026-04-28 19:29:43'),
(34, 'sophiaji@yopmail.com', '620363', 'signup', 1, '2026-04-28 19:40:29', '2026-04-28 19:30:29'),
(35, 'liam@yopmail.com', '116466', 'signup', 1, '2026-04-29 17:57:44', '2026-04-29 17:47:44'),
(36, 'olivia@yopmail.com', '924740', 'signup', 1, '2026-04-29 18:06:06', '2026-04-29 17:56:05'),
(37, 'noah@yopmail.com', '846106', 'signup', 1, '2026-04-29 18:31:36', '2026-04-29 18:21:36'),
(38, 'ava@yopmail.com', '566694', 'signup', 0, '2026-04-29 18:36:54', '2026-04-29 18:26:53'),
(39, 'avaji@yopmail.com', '492463', 'signup', 1, '2026-04-29 18:37:23', '2026-04-29 18:27:23'),
(40, 'noah01@yopmail.com', '670331', 'signup', 1, '2026-04-29 18:48:38', '2026-04-29 18:38:37'),
(41, 'avaji01@yopmail.com', '882888', 'signup', 1, '2026-04-29 18:50:17', '2026-04-29 18:40:17'),
(42, 'abc@yopmail.com', '982154', 'signup', 1, '2026-05-03 09:41:37', '2026-05-03 09:31:37'),
(43, 'rahuldon@yopmail.com', '815997', 'signup', 1, '2026-05-03 10:11:45', '2026-05-03 10:01:44');

-- --------------------------------------------------------

--
-- Table structure for table `interests_master`
--

CREATE TABLE `interests_master` (
  `interest_id` int NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `icon_url` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `interests_master`
--

INSERT INTO `interests_master` (`interest_id`, `name`, `icon_url`) VALUES
(1, 'Photography', '/images/interests/photography.png'),
(2, 'Shopping', '/images/interests/shopping.png'),
(3, 'Karaoke', '/images/interests/karaoke.png'),
(4, 'Yoga', '/images/interests/yoga.png'),
(5, 'Cooking', '/images/interests/cooking.png'),
(6, 'Tennis', '/images/interests/tennis.png'),
(7, 'Run', '/images/interests/run.png'),
(8, 'Swimming', '/images/interests/swimming.png'),
(9, 'Art', '/images/interests/art.png'),
(10, 'Traveling', '/images/interests/traveling.png'),
(11, 'Extreme', '/images/interests/extreme.png'),
(12, 'Music', '/images/interests/music.png'),
(13, 'Drink', '/images/interests/drink.png'),
(14, 'Video games', '/images/interests/videogames.png');

-- --------------------------------------------------------

--
-- Table structure for table `matches`
--

CREATE TABLE `matches` (
  `match_id` bigint NOT NULL,
  `user1_id` bigint DEFAULT NULL,
  `user2_id` bigint DEFAULT NULL,
  `status` enum('matched','unmatched','blocked') DEFAULT 'matched',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `spark_mode` tinyint(1) NOT NULL DEFAULT '0',
  `last_reminder_sent` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `matches`
--

INSERT INTO `matches` (`match_id`, `user1_id`, `user2_id`, `status`, `created_at`, `spark_mode`, `last_reminder_sent`) VALUES
(1, 1, 3, 'matched', '2026-04-11 09:19:43', 0, NULL),
(2, 1, 4, 'matched', '2026-04-11 09:19:43', 0, NULL),
(3, 5, 6, 'matched', '2026-04-13 09:32:22', 0, NULL),
(4, 15, 16, 'matched', '2026-04-18 11:26:13', 0, NULL),
(5, 17, 18, 'matched', '2026-04-18 17:16:21', 0, NULL),
(6, 19, 20, 'matched', '2026-04-18 18:39:47', 0, NULL),
(7, 28, 29, 'matched', '2026-04-23 17:53:07', 1, '2026-04-23 20:00:00'),
(8, 30, 31, 'matched', '2026-04-24 17:35:56', 1, NULL),
(9, 34, 36, 'matched', '2026-04-28 19:38:03', 1, '2026-04-30 16:00:00'),
(10, 37, 38, 'matched', '2026-04-29 18:02:34', 1, NULL),
(11, 39, 41, 'unmatched', '2026-04-29 18:32:25', 1, NULL),
(12, 42, 42, 'unmatched', '2026-04-29 18:42:42', 1, NULL),
(13, 43, 43, 'matched', '2026-04-29 18:44:36', 1, '2026-05-01 16:00:00'),
(14, 39, 41, 'matched', '2026-04-29 18:46:36', 1, NULL),
(16, 45, 46, 'matched', '2026-05-02 18:18:37', 1, '2026-05-03 16:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reference_id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `message`, `is_read`, `created_at`, `reference_id`) VALUES
(1, 1, 'match', 'You have a new match!', 0, '2026-04-11 09:18:19', NULL),
(2, 2, 'call', 'Video call scheduled', 0, '2026-04-11 09:18:19', NULL),
(3, 3, 'reward', 'You unlocked a reward!', 0, '2026-04-11 09:18:19', NULL),
(4, 16, 'new_match', 'It\'s a Match! You both liked each other.', 0, '2026-04-18 06:34:53', 15),
(5, 15, 'new_match', 'It\'s a Match! You both liked each other.', 0, '2026-04-18 06:34:53', 16),
(6, 16, 'liked', 'Rizwan Sheikh liked your profile.', 0, '2026-04-18 07:33:50', 15),
(7, 16, 'liked', 'Rizwan Sheikh liked your profile.', 0, '2026-04-18 07:39:04', 15),
(8, 16, 'liked', 'Rizwan Sheikh liked your profile.', 0, '2026-04-18 11:25:04', 15),
(9, 16, 'new_match', 'It\'s a Match! You both liked each other.', 0, '2026-04-18 11:26:13', 15),
(10, 15, 'new_match', 'It\'s a Match! You both liked each other.', 0, '2026-04-18 11:26:13', 16),
(11, 17, 'liked', 'Neha Reddy liked your profile.', 0, '2026-04-18 17:08:09', 18),
(12, 18, 'new_match', 'It\'s a Match! You both liked each other.', 0, '2026-04-18 17:16:21', 17),
(13, 17, 'new_match', 'It\'s a Match! You both liked each other.', 0, '2026-04-18 17:16:21', 18),
(14, 11, 'liked', 'Rahul Sharma liked your profile.', 0, '2026-04-18 18:28:58', 10),
(15, 20, 'liked', 'Aman Gupta liked your profile.', 1, '2026-04-18 18:36:33', 19),
(16, 19, 'new_match', 'It\'s a Match! You both liked each other.', 1, '2026-04-18 18:39:47', 20),
(17, 20, 'new_match', 'It\'s a Match! You both liked each other.', 1, '2026-04-18 18:39:47', 19),
(18, 20, 'reward', 'Your reward \"SpaGlow\" is ready! Show the QR code at the venue.', 0, '2026-04-19 14:01:20', NULL),
(19, 11, 'liked', 'Aman Gupta liked your profile.', 0, '2026-04-19 14:06:20', 19),
(20, 19, 'reward', 'Your reward \"Wine & Jazz\" is ready! Show the QR code at the venue.', 1, '2026-04-19 14:28:02', NULL),
(21, 21, 'reward', 'Your reward \"SpaGlow\" is ready! Show the QR code at the venue.', 0, '2026-04-20 19:26:13', NULL),
(22, 6, 'liked', 'טל liked your profile.', 0, '2026-04-22 14:25:18', 23),
(23, 6, 'liked', 'טל liked your profile.', 0, '2026-04-22 14:25:21', 23),
(24, 5, 'liked', 'טל liked your profile.', 0, '2026-04-22 14:25:22', 23),
(25, 20, 'availability_request', 'Aman Gupta wants to schedule a video date with you! Please add your available times so you can connect.', 0, '2026-04-22 18:40:41', 19),
(26, 19, 'video_call', 'Your video call has been scheduled for 4/27/2026, 9:00:00 AM', 1, '2026-04-22 18:51:51', 5),
(27, 20, 'video_call', 'Your video call has been scheduled for 4/27/2026, 9:00:00 AM', 0, '2026-04-22 18:51:51', 5),
(28, 28, 'liked', 'Priya das liked your profile.', 1, '2026-04-23 17:52:12', 29),
(29, 29, 'new_match', 'It\'s a Match! You both liked each other.', 1, '2026-04-23 17:53:07', 28),
(30, 28, 'new_match', 'It\'s a Match! You both liked each other.', 1, '2026-04-23 17:53:07', 29),
(31, 28, 'video_call', 'Don\'t forget to schedule your video date with Priya das! You have 46h left to set it up.', 1, '2026-04-23 20:00:00', 7),
(32, 29, 'video_call', 'Don\'t forget to schedule your video date with Rahul das! You have 46h left to set it up.', 0, '2026-04-23 20:00:00', 7),
(33, 28, 'video_call', 'Your video call has been scheduled for 4/30/2026, 7:00:00 AM', 1, '2026-04-23 20:02:13', 6),
(34, 29, 'video_call', 'Your video call has been scheduled for 4/30/2026, 7:00:00 AM', 0, '2026-04-23 20:02:13', 6),
(35, 31, 'liked', 'Aman Verma liked your profile.', 1, '2026-04-24 17:35:15', 30),
(36, 30, 'new_match', 'It\'s a Match! You both liked each other.', 1, '2026-04-24 17:35:56', 31),
(37, 31, 'new_match', 'It\'s a Match! You both liked each other.', 0, '2026-04-24 17:35:56', 30),
(38, 30, 'availability_request', 'Neha Sharma wants to schedule a video date with you! Please add your available times so you can connect.', 1, '2026-04-24 17:38:47', 31),
(39, 30, 'video_call', 'Your video call has been scheduled for 5/1/2026, 6:00:00 AM', 1, '2026-04-24 19:11:53', 7),
(40, 31, 'video_call', 'Your video call has been scheduled for 5/1/2026, 6:00:00 AM', 0, '2026-04-24 19:11:53', 7),
(41, 23, 'superliked', 'tova yaniv sent you a Superlike!', 0, '2026-04-25 14:19:58', 32),
(42, 23, 'superliked', 'tova yaniv sent you a Superlike!', 0, '2026-04-25 14:20:02', 32),
(43, 23, 'liked', 'tova yaniv liked your profile.', 0, '2026-04-25 14:20:04', 32),
(44, 23, 'superliked', 'tova yaniv sent you a Superlike!', 0, '2026-04-25 14:20:20', 32),
(45, 23, 'liked', 'tova yaniv liked your profile.', 0, '2026-04-25 14:20:22', 32),
(47, 34, 'liked', 'Sophia Bennett liked your profile.', 1, '2026-04-28 19:37:04', 36),
(48, 36, 'new_match', 'It\'s a Match! You both liked each other.', 1, '2026-04-28 19:38:03', 34),
(49, 34, 'new_match', 'It\'s a Match! You both liked each other.', 1, '2026-04-28 19:38:03', 36),
(50, 36, 'availability_request', 'Ethan Carter wants to schedule a video date with you! Please add your available times so you can connect.', 1, '2026-04-28 19:38:31', 34),
(51, 36, 'video_call', 'Your video call has been scheduled for 4/29/2026, 6:00:00 AM', 1, '2026-04-28 19:39:56', 8),
(52, 34, 'video_call', 'Your video call has been scheduled for 4/29/2026, 6:00:00 AM', 0, '2026-04-28 19:39:56', 8),
(53, 34, 'video_call', 'Your video call with Sophia Bennett starts in 10 minutes!', 0, '2026-04-29 05:49:00', 8),
(54, 36, 'video_call', 'Your video call with Ethan Carter starts in 10 minutes!', 1, '2026-04-29 05:49:00', 8),
(55, 34, 'video_call', 'Don\'t forget to schedule your video date with Sophia Bennett! You have 36h left to set it up.', 0, '2026-04-29 08:00:00', 9),
(56, 36, 'video_call', 'Don\'t forget to schedule your video date with Ethan Carter! You have 36h left to set it up.', 1, '2026-04-29 08:00:00', 9),
(57, 34, 'video_call', 'Don\'t forget to schedule your video date with Sophia Bennett! You have 32h left to set it up.', 0, '2026-04-29 12:00:00', 9),
(58, 36, 'video_call', 'Don\'t forget to schedule your video date with Ethan Carter! You have 32h left to set it up.', 0, '2026-04-29 12:00:00', 9),
(59, 34, 'video_call', 'Don\'t forget to schedule your video date with Sophia Bennett! You have 28h left to set it up.', 0, '2026-04-29 16:00:00', 9),
(60, 36, 'video_call', 'Don\'t forget to schedule your video date with Ethan Carter! You have 28h left to set it up.', 1, '2026-04-29 16:00:00', 9),
(61, 37, 'liked', 'Olivia Smith liked your profile.', 0, '2026-04-29 18:00:25', 38),
(62, 37, 'new_match', 'It\'s a Match! You both liked each other.', 1, '2026-04-29 18:02:34', 38),
(63, 38, 'new_match', 'It\'s a Match! You both liked each other.', 0, '2026-04-29 18:02:34', 37),
(64, 38, 'availability_request', 'Liam Johnson wants to schedule a video date with you! Please add your available times so you can connect.', 0, '2026-04-29 18:06:22', 37),
(65, 38, 'video_call', 'Your video call has been scheduled for 5/6/2026, 6:00:00 AM', 0, '2026-04-29 18:07:20', 9),
(66, 37, 'video_call', 'Your video call has been scheduled for 5/6/2026, 6:00:00 AM', 1, '2026-04-29 18:07:20', 9),
(67, 39, 'liked', 'Ava Brown liked your profile.', 0, '2026-04-29 18:31:43', 41),
(68, 41, 'new_match', 'It\'s a Match! You both liked each other.', 1, '2026-04-29 18:32:25', 39),
(69, 39, 'new_match', 'It\'s a Match! You both liked each other.', 0, '2026-04-29 18:32:25', 41),
(70, 39, 'availability_request', 'Ava Brown wants to schedule a video date with you! Please add your available times so you can connect.', 0, '2026-04-29 18:35:24', 41),
(71, 41, 'video_call', 'Your video call has been scheduled for 4/30/2026, 1:00:00 AM', 1, '2026-04-29 18:37:11', 10),
(72, 39, 'video_call', 'Your video call has been scheduled for 4/30/2026, 1:00:00 AM', 0, '2026-04-29 18:37:11', 10),
(73, 42, 'liked', 'Ava Brown liked your profile.', 0, '2026-04-29 18:42:11', 43),
(74, 42, 'new_match', 'It\'s a Match! You both liked each other.', 0, '2026-04-29 18:42:42', 42),
(75, 42, 'new_match', 'It\'s a Match! You both liked each other.', 0, '2026-04-29 18:42:42', 42),
(76, 43, 'new_match', 'It\'s a Match! You both liked each other.', 0, '2026-04-29 18:44:36', 43),
(77, 43, 'new_match', 'It\'s a Match! You both liked each other.', 0, '2026-04-29 18:44:36', 43),
(78, 39, 'new_match', 'It\'s a Match! You both liked each other.', 0, '2026-04-29 18:46:36', 41),
(79, 41, 'new_match', 'It\'s a Match! You both liked each other.', 0, '2026-04-29 18:46:36', 39),
(80, 41, 'video_call', 'Your video call has been scheduled for 5/6/2026, 1:00:00 AM', 0, '2026-04-29 18:58:49', 11),
(81, 39, 'video_call', 'Your video call has been scheduled for 5/6/2026, 1:00:00 AM', 0, '2026-04-29 18:58:49', 11),
(82, 34, 'video_call', 'Don\'t forget to schedule your video date with Sophia Bennett! You have 24h left to set it up.', 0, '2026-04-29 20:00:00', 9),
(83, 36, 'video_call', 'Don\'t forget to schedule your video date with Ethan Carter! You have 24h left to set it up.', 0, '2026-04-29 20:00:00', 9),
(84, 43, 'video_call', 'Don\'t forget to schedule your video date with Ava Brown! You have 47h left to set it up.', 0, '2026-04-29 20:00:00', 13),
(85, 43, 'video_call', 'Don\'t forget to schedule your video date with Ava Brown! You have 47h left to set it up.', 0, '2026-04-29 20:00:00', 13),
(86, 34, 'video_call', 'Don\'t forget to schedule your video date with Sophia Bennett! You have 20h left to set it up.', 0, '2026-04-30 00:00:00', 9),
(87, 36, 'video_call', 'Don\'t forget to schedule your video date with Ethan Carter! You have 20h left to set it up.', 0, '2026-04-30 00:00:00', 9),
(88, 43, 'video_call', 'Don\'t forget to schedule your video date with Ava Brown! You have 43h left to set it up.', 0, '2026-04-30 00:00:00', 13),
(89, 43, 'video_call', 'Don\'t forget to schedule your video date with Ava Brown! You have 43h left to set it up.', 0, '2026-04-30 00:00:00', 13),
(90, 39, 'video_call', 'Your video call with Ava Brown starts in 10 minutes!', 0, '2026-04-30 00:49:00', 10),
(91, 41, 'video_call', 'Your video call with Noah Williams starts in 10 minutes!', 0, '2026-04-30 00:49:00', 10),
(92, 34, 'video_call', 'Don\'t forget to schedule your video date with Sophia Bennett! You have 16h left to set it up.', 0, '2026-04-30 04:00:00', 9),
(93, 36, 'video_call', 'Don\'t forget to schedule your video date with Ethan Carter! You have 16h left to set it up.', 0, '2026-04-30 04:00:00', 9),
(94, 43, 'video_call', 'Don\'t forget to schedule your video date with Ava Brown! You have 39h left to set it up.', 0, '2026-04-30 04:00:00', 13),
(95, 43, 'video_call', 'Don\'t forget to schedule your video date with Ava Brown! You have 39h left to set it up.', 0, '2026-04-30 04:00:00', 13),
(96, 28, 'video_call', 'Your video call with Priya das starts in 10 minutes!', 0, '2026-04-30 06:49:00', 6),
(97, 29, 'video_call', 'Your video call with Rahul das starts in 10 minutes!', 0, '2026-04-30 06:49:00', 6),
(98, 34, 'video_call', 'Don\'t forget to schedule your video date with Sophia Bennett! You have 12h left to set it up.', 0, '2026-04-30 08:00:00', 9),
(99, 36, 'video_call', 'Don\'t forget to schedule your video date with Ethan Carter! You have 12h left to set it up.', 0, '2026-04-30 08:00:00', 9),
(100, 43, 'video_call', 'Don\'t forget to schedule your video date with Ava Brown! You have 35h left to set it up.', 0, '2026-04-30 08:00:00', 13),
(101, 43, 'video_call', 'Don\'t forget to schedule your video date with Ava Brown! You have 35h left to set it up.', 0, '2026-04-30 08:00:00', 13),
(102, 34, 'video_call', 'Don\'t forget to schedule your video date with Sophia Bennett! You have 8h left to set it up.', 0, '2026-04-30 12:00:00', 9),
(103, 36, 'video_call', 'Don\'t forget to schedule your video date with Ethan Carter! You have 8h left to set it up.', 0, '2026-04-30 12:00:00', 9),
(104, 43, 'video_call', 'Don\'t forget to schedule your video date with Ava Brown! You have 31h left to set it up.', 0, '2026-04-30 12:00:00', 13),
(105, 43, 'video_call', 'Don\'t forget to schedule your video date with Ava Brown! You have 31h left to set it up.', 0, '2026-04-30 12:00:00', 13),
(106, 34, 'video_call', 'Don\'t forget to schedule your video date with Sophia Bennett! You have 4h left to set it up.', 0, '2026-04-30 16:00:00', 9),
(107, 36, 'video_call', 'Don\'t forget to schedule your video date with Ethan Carter! You have 4h left to set it up.', 1, '2026-04-30 16:00:00', 9),
(108, 43, 'video_call', 'Don\'t forget to schedule your video date with Ava Brown! You have 27h left to set it up.', 0, '2026-04-30 16:00:00', 13),
(109, 43, 'video_call', 'Don\'t forget to schedule your video date with Ava Brown! You have 27h left to set it up.', 0, '2026-04-30 16:00:00', 13),
(113, 43, 'video_call', 'Don\'t forget to schedule your video date with Ava Brown! You have 23h left to set it up.', 0, '2026-04-30 20:00:00', 13),
(114, 43, 'video_call', 'Don\'t forget to schedule your video date with Ava Brown! You have 23h left to set it up.', 0, '2026-04-30 20:00:00', 13),
(117, 43, 'video_call', 'Don\'t forget to schedule your video date with Ava Brown! You have 19h left to set it up.', 0, '2026-05-01 00:00:00', 13),
(118, 43, 'video_call', 'Don\'t forget to schedule your video date with Ava Brown! You have 19h left to set it up.', 0, '2026-05-01 00:00:00', 13),
(121, 43, 'video_call', 'Don\'t forget to schedule your video date with Ava Brown! You have 15h left to set it up.', 0, '2026-05-01 04:00:00', 13),
(122, 43, 'video_call', 'Don\'t forget to schedule your video date with Ava Brown! You have 15h left to set it up.', 0, '2026-05-01 04:00:00', 13),
(125, 30, 'video_call', 'Your video call with Neha Sharma starts in 10 minutes!', 0, '2026-05-01 05:49:00', 7),
(126, 31, 'video_call', 'Your video call with Aman Verma starts in 10 minutes!', 0, '2026-05-01 05:49:00', 7),
(127, 43, 'video_call', 'Don\'t forget to schedule your video date with Ava Brown! You have 11h left to set it up.', 0, '2026-05-01 08:00:00', 13),
(128, 43, 'video_call', 'Don\'t forget to schedule your video date with Ava Brown! You have 11h left to set it up.', 0, '2026-05-01 08:00:00', 13),
(131, 43, 'video_call', 'Don\'t forget to schedule your video date with Ava Brown! You have 7h left to set it up.', 0, '2026-05-01 12:00:00', 13),
(132, 43, 'video_call', 'Don\'t forget to schedule your video date with Ava Brown! You have 7h left to set it up.', 0, '2026-05-01 12:00:00', 13),
(135, 43, 'video_call', 'Don\'t forget to schedule your video date with Ava Brown! You have 3h left to set it up.', 0, '2026-05-01 16:00:00', 13),
(136, 43, 'video_call', 'Don\'t forget to schedule your video date with Ava Brown! You have 3h left to set it up.', 0, '2026-05-01 16:00:00', 13),
(151, 45, 'liked', 'tova liked your profile.', 1, '2026-05-02 18:17:26', 46),
(152, 45, 'liked', 'tova liked your profile.', 1, '2026-05-02 18:18:17', 46),
(153, 45, 'superliked', 'tova sent you a Superlike!', 0, '2026-05-02 18:18:20', 46),
(154, 45, 'superliked', 'tova sent you a Superlike!', 0, '2026-05-02 18:18:22', 46),
(155, 46, 'new_match', 'It\'s a Match! You both liked each other.', 1, '2026-05-02 18:18:37', 45),
(156, 45, 'new_match', 'It\'s a Match! You both liked each other.', 1, '2026-05-02 18:18:37', 46),
(157, 45, 'availability_request', 'tova wants to schedule a video date with you! Please add your available times so you can connect.', 1, '2026-05-02 18:24:10', 46),
(158, 45, 'video_call', 'Don\'t forget to schedule your video date with tova! You have 46h left to set it up.', 0, '2026-05-02 20:00:00', 16),
(159, 46, 'video_call', 'Don\'t forget to schedule your video date with zvika! You have 46h left to set it up.', 0, '2026-05-02 20:00:00', 16),
(160, 45, 'video_call', 'Don\'t forget to schedule your video date with tova! You have 42h left to set it up.', 0, '2026-05-03 00:00:00', 16),
(161, 46, 'video_call', 'Don\'t forget to schedule your video date with zvika! You have 42h left to set it up.', 0, '2026-05-03 00:00:00', 16),
(162, 45, 'video_call', 'Don\'t forget to schedule your video date with tova! You have 38h left to set it up.', 0, '2026-05-03 04:00:00', 16),
(163, 46, 'video_call', 'Don\'t forget to schedule your video date with zvika! You have 38h left to set it up.', 0, '2026-05-03 04:00:00', 16),
(164, 45, 'video_call', 'Don\'t forget to schedule your video date with tova! You have 34h left to set it up.', 0, '2026-05-03 08:00:00', 16),
(165, 46, 'video_call', 'Don\'t forget to schedule your video date with zvika! You have 34h left to set it up.', 0, '2026-05-03 08:00:00', 16),
(166, 45, 'video_call', 'Don\'t forget to schedule your video date with tova! You have 30h left to set it up.', 0, '2026-05-03 12:00:00', 16),
(167, 46, 'video_call', 'Don\'t forget to schedule your video date with zvika! You have 30h left to set it up.', 0, '2026-05-03 12:00:00', 16),
(168, 45, 'video_call', 'Don\'t forget to schedule your video date with tova! You have 26h left to set it up.', 0, '2026-05-03 16:00:00', 16),
(169, 46, 'video_call', 'Don\'t forget to schedule your video date with zvika! You have 26h left to set it up.', 0, '2026-05-03 16:00:00', 16);

-- --------------------------------------------------------

--
-- Table structure for table `preferences`
--

CREATE TABLE `preferences` (
  `id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `interested_in` enum('male','female','other','all') DEFAULT NULL,
  `min_age` int DEFAULT NULL,
  `max_age` int DEFAULT NULL,
  `max_distance_km` int DEFAULT NULL,
  `height_cm` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `preferences`
--

INSERT INTO `preferences` (`id`, `user_id`, `interested_in`, `min_age`, `max_age`, `max_distance_km`, `height_cm`) VALUES
(1, 1, 'male', 25, 35, 50, NULL),
(2, 2, 'male', 24, 35, 30, NULL),
(3, 3, 'female', 22, 30, 100, NULL),
(4, 4, 'female', 22, 32, 80, NULL),
(5, 5, 'female', 24, 35, 50, 160),
(6, 6, 'female', 22, 32, 40, 155),
(7, 7, 'female', 22, 30, 60, 160),
(8, 9, 'female', 18, 35, 50, NULL),
(9, 10, 'female', 22, 28, 50, NULL),
(10, 11, 'male', 24, 30, 50, NULL),
(11, 12, 'female', 24, 32, 30, NULL),
(12, 13, 'male', 27, 35, 30, NULL),
(14, 15, 'female', 18, 35, 150, NULL),
(15, 16, 'male', 19, 46, 150, NULL),
(16, 17, 'female', 21, 27, 40, NULL),
(17, 18, 'male', 23, 28, 40, NULL),
(18, 19, 'female', 24, 59, 30, NULL),
(19, 20, 'male', 27, 35, 30, NULL),
(20, 21, 'female', 18, 35, 50, NULL),
(21, 23, 'female', 18, 35, 50, NULL),
(22, 28, 'female', 22, 30, 50, NULL),
(23, 29, 'male', 24, 32, 50, NULL),
(24, 30, 'female', 23, 30, 40, NULL),
(25, 31, 'male', 25, 32, 50, NULL),
(27, 33, 'all', 18, 35, 50, NULL),
(28, 34, 'female', 22, 30, 50, NULL),
(29, 36, 'male', 24, 32, 30, NULL),
(30, 37, 'female', 24, 32, 40, NULL),
(31, 38, 'male', 27, 35, 20, NULL),
(32, 39, 'female', 20, 26, 100, NULL),
(33, 41, 'male', 22, 28, 50, NULL),
(34, 42, 'female', 20, 26, 100, NULL),
(35, 43, 'male', 22, 28, 50, NULL),
(37, 45, 'female', 18, 60, 200, NULL),
(38, 46, 'male', 18, 60, 200, NULL),
(39, 47, 'female', 22, 30, 50, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `question_id` int NOT NULL,
  `text` varchar(255) DEFAULT NULL,
  `type` enum('single_choice','scale','text') DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `sort_order` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`question_id`, `text`, `type`, `category_id`, `sort_order`) VALUES
(1, 'What is your main goal from this app?', 'single_choice', 1, 1),
(2, 'How important is it that your partner shares similar values (family, loyalty, honesty)?', 'scale', 1, 2),
(3, 'How important is it that your partner shares similar social/political views?', 'scale', 1, 3),
(4, 'How important is religion/spirituality in your relationship?', 'single_choice', 1, 4),
(5, 'What’s your stance on having children?', 'single_choice', 2, 5),
(6, 'How important is a close relationship with your family and your partner’s family?', 'scale', 2, 6),
(7, 'How would you like your life to look in 10 years?', 'single_choice', 2, 7),
(8, 'What does your daily pace of life look like?', 'single_choice', 3, 8),
(9, 'How social are you? Do you enjoy being around people?', 'scale', 3, 9),
(10, 'How important is career and achievements to you right now?', 'scale', 3, 10),
(11, 'How would you describe your relationship with money?', 'scale', 3, 11),
(12, 'How important is it that your partner is tidy and clean at home?', 'scale', 3, 12),
(13, 'What’s your stance on smoking, alcohol, and substances?', 'single_choice', 3, 13),
(14, 'How would you describe your tendency to share emotions in a relationship?', 'scale', 4, 14),
(15, 'How important is physical affection (hugs, kisses, touch) in daily life?', 'scale', 4, 15),
(16, 'When someone close to you is stressed, how do you usually respond?', 'single_choice', 4, 16),
(17, 'How easily do you get hurt and take things personally?', 'scale', 4, 17),
(18, 'How important is personal development (therapy, workshops, learning, awareness)?', 'scale', 4, 18),
(19, 'When there’s a disagreement, what feels most natural to you?', 'single_choice', 5, 19),
(20, 'How important is humor and laughter as a way to cope with difficulties?', 'scale', 5, 20),
(21, 'How important is it that your partner is also your best friend?', 'scale', 5, 21),
(22, 'How much do you initiate messages, small questions, daily sharing?', 'scale', 5, 22),
(23, 'How important is sex as part of the relationship?', 'scale', 6, 23),
(24, 'What intimacy frequency feels right in a stable relationship?', 'single_choice', 6, 24),
(25, 'How important is it to feel your partner is on the same wavelength (humor, music, lifestyle)?', 'scale', 7, 25);

-- --------------------------------------------------------

--
-- Table structure for table `question_categories`
--

CREATE TABLE `question_categories` (
  `category_id` int NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `sort_order` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `question_categories`
--

INSERT INTO `question_categories` (`category_id`, `name`, `sort_order`) VALUES
(1, 'Goals & Values', 1),
(2, 'Future & Family', 2),
(3, 'Lifestyle', 3),
(4, 'Personality', 4),
(5, 'Communication', 5),
(6, 'Intimacy', 6),
(7, 'Compatibility', 7);

-- --------------------------------------------------------

--
-- Table structure for table `question_options`
--

CREATE TABLE `question_options` (
  `option_id` int NOT NULL,
  `question_id` int DEFAULT NULL,
  `text` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `question_options`
--

INSERT INTO `question_options` (`option_id`, `question_id`, `text`) VALUES
(1, 1, 'Casual dating / No labels for now'),
(2, 1, 'Serious long-term relationship'),
(3, 1, 'Marriage / Building a family'),
(4, 1, 'Still figuring it out'),
(8, 4, 'Not important at all'),
(9, 4, 'Somewhat important, but not critical'),
(10, 4, 'Very important to be on the same page'),
(11, 5, 'Not important at all'),
(12, 5, 'Somewhat important'),
(13, 5, 'Very important'),
(14, 7, 'Free/spontaneous lifestyle'),
(15, 7, 'Balance between career and family'),
(16, 7, 'Family focused life'),
(17, 8, 'Go with the flow'),
(18, 8, 'Balanced lifestyle'),
(19, 8, 'Structured and organized'),
(20, 13, 'Do not use'),
(21, 13, 'Occasional'),
(22, 13, 'Regular'),
(23, 16, 'Jump in and solve'),
(24, 16, 'Listen first'),
(25, 16, 'Take space first'),
(26, 19, 'Talk immediately'),
(27, 19, 'Cool down then talk'),
(28, 19, 'Let things slide'),
(29, 24, 'Low frequency'),
(30, 24, 'Moderate frequency'),
(31, 24, 'High frequency'),
(32, 2, '5'),
(33, 2, '4'),
(34, 2, '3'),
(35, 2, '2'),
(36, 2, '1'),
(37, 3, '5'),
(38, 3, '4'),
(39, 3, '3'),
(40, 3, '2'),
(41, 3, '1'),
(42, 6, '5'),
(43, 6, '4'),
(44, 6, '3'),
(45, 6, '2'),
(46, 6, '1'),
(47, 9, '5'),
(48, 9, '4'),
(49, 9, '3'),
(50, 9, '2'),
(51, 9, '1'),
(52, 10, '5'),
(53, 10, '4'),
(54, 10, '3'),
(55, 10, '2'),
(56, 10, '1'),
(57, 11, '5'),
(58, 11, '4'),
(59, 11, '3'),
(60, 11, '2'),
(61, 11, '1'),
(62, 12, '5'),
(63, 12, '4'),
(64, 12, '3'),
(65, 12, '2'),
(66, 12, '1'),
(67, 14, '5'),
(68, 14, '4'),
(69, 14, '3'),
(70, 14, '2'),
(71, 14, '1'),
(72, 15, '5'),
(73, 15, '4'),
(74, 15, '3'),
(75, 15, '2'),
(76, 15, '1'),
(77, 17, '5'),
(78, 17, '4'),
(79, 17, '3'),
(80, 17, '2'),
(81, 17, '1'),
(82, 18, '5'),
(83, 18, '4'),
(84, 18, '3'),
(85, 18, '2'),
(86, 18, '1'),
(87, 20, '5'),
(88, 20, '4'),
(89, 20, '3'),
(90, 20, '2'),
(91, 20, '1'),
(92, 21, '5'),
(93, 21, '4'),
(94, 21, '3'),
(95, 21, '2'),
(96, 21, '1'),
(97, 22, '5'),
(98, 22, '4'),
(99, 22, '3'),
(100, 22, '2'),
(101, 22, '1'),
(102, 23, '5'),
(103, 23, '4'),
(104, 23, '3'),
(105, 23, '2'),
(106, 23, '1'),
(107, 25, '5'),
(108, 25, '4'),
(109, 25, '3'),
(110, 25, '2'),
(111, 25, '1');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `report_id` bigint NOT NULL,
  `reporter_id` bigint NOT NULL,
  `reported_id` bigint NOT NULL,
  `reason` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `video_call_id` bigint DEFAULT NULL,
  `status` enum('pending','reviewed','dismissed') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rewards`
--

CREATE TABLE `rewards` (
  `reward_id` bigint NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `discount_percent` int DEFAULT NULL,
  `qr_code_url` text,
  `expiration_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rewards`
--

INSERT INTO `rewards` (`reward_id`, `name`, `description`, `discount_percent`, `qr_code_url`, `expiration_date`) VALUES
(1, 'SpaGlow', 'Spa treatment for couples', 10, 'qr1.png', '2026-12-31'),
(2, 'Kayak Day', 'Water adventure', 12, 'qr2.png', '2026-12-31'),
(3, 'Wine & Jazz', 'Romantic evening', 15, 'qr3.png', '2026-12-31');

-- --------------------------------------------------------

--
-- Table structure for table `swipes`
--

CREATE TABLE `swipes` (
  `swipe_id` bigint NOT NULL,
  `from_user` bigint DEFAULT NULL,
  `to_user` bigint DEFAULT NULL,
  `action` enum('like','dislike','superlike') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `swipes`
--

INSERT INTO `swipes` (`swipe_id`, `from_user`, `to_user`, `action`, `created_at`) VALUES
(1, 1, 3, 'like', '2026-04-11 09:19:34'),
(2, 3, 1, 'like', '2026-04-11 09:19:34'),
(3, 2, 3, 'like', '2026-04-11 09:19:34'),
(4, 3, 2, 'dislike', '2026-04-11 09:19:34'),
(5, 1, 4, 'like', '2026-04-11 09:19:34'),
(6, 4, 1, 'like', '2026-04-11 09:19:34'),
(7, 5, 6, 'like', '2026-04-13 09:24:22'),
(8, 6, 5, 'like', '2026-04-13 09:28:49'),
(9, 7, 6, 'like', '2026-04-13 09:28:53'),
(10, 11, 9, 'like', '2026-04-17 17:45:29'),
(11, 10, 11, 'like', '2026-04-17 18:16:34'),
(12, 13, 12, 'like', '2026-04-17 18:29:26'),
(15, 15, 16, 'like', '2026-04-18 07:39:04'),
(17, 16, 15, 'like', '2026-04-18 11:26:13'),
(18, 18, 17, 'like', '2026-04-18 17:08:09'),
(19, 17, 18, 'like', '2026-04-18 17:16:21'),
(21, 19, 20, 'like', '2026-04-18 18:36:33'),
(22, 20, 19, 'like', '2026-04-18 18:39:47'),
(23, 19, 11, 'dislike', '2026-04-19 14:06:20'),
(25, 23, 6, 'like', '2026-04-22 14:25:18'),
(27, 23, 5, 'dislike', '2026-04-22 14:25:22'),
(29, 29, 28, 'like', '2026-04-23 17:52:12'),
(30, 28, 29, 'like', '2026-04-23 17:53:07'),
(31, 30, 31, 'like', '2026-04-24 17:35:15'),
(32, 31, 30, 'like', '2026-04-24 17:35:56'),
(39, 36, 34, 'like', '2026-04-28 19:37:04'),
(40, 34, 36, 'like', '2026-04-28 19:38:03'),
(41, 38, 37, 'like', '2026-04-29 18:00:25'),
(42, 37, 38, 'like', '2026-04-29 18:02:34'),
(43, 41, 39, 'like', '2026-04-29 18:31:43'),
(44, 39, 41, 'like', '2026-04-29 18:32:25'),
(45, 43, 42, 'like', '2026-04-29 18:42:11'),
(46, 42, 42, 'like', '2026-04-29 18:42:42'),
(47, 43, 43, 'like', '2026-04-29 18:44:36'),
(53, 46, 7, 'dislike', '2026-05-02 18:17:04'),
(54, 46, 23, 'dislike', '2026-05-02 18:17:05'),
(55, 46, 33, 'dislike', '2026-05-02 18:17:08'),
(56, 45, 5, 'dislike', '2026-05-02 18:17:12'),
(57, 45, 6, 'dislike', '2026-05-02 18:17:13'),
(58, 46, 45, 'superlike', '2026-05-02 18:17:26'),
(64, 45, 46, 'like', '2026-05-02 18:18:37');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` bigint NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `height` int DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `bio` varchar(500) DEFAULT NULL,
  `profile_photo_url` text,
  `language` varchar(20) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `current_step` int DEFAULT '1',
  `fcm_token` varchar(512) DEFAULT NULL,
  `instagram_username` varchar(100) DEFAULT NULL,
  `facebook_id` varchar(100) DEFAULT NULL,
  `google_id` varchar(100) DEFAULT NULL,
  `terms_accepted` tinyint(1) NOT NULL DEFAULT '0',
  `suspended_until` datetime DEFAULT NULL,
  `apple_id` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `password_hash`, `phone`, `full_name`, `age`, `height`, `gender`, `bio`, `profile_photo_url`, `language`, `is_verified`, `created_at`, `updated_at`, `current_step`, `fcm_token`, `instagram_username`, `facebook_id`, `google_id`, `terms_accepted`, `suspended_until`, `apple_id`) VALUES
(1, 'belle@example.com', 'hashed123', '9999990001', 'Belle Benson', 28, NULL, 'female', 'Love traveling & meaningful connections', 'img1.jpg', NULL, 1, '2026-04-11 09:06:49', '2026-04-11 09:06:49', 1, NULL, NULL, NULL, NULL, 0, NULL, NULL),
(2, 'amelia@example.com', 'hashed123', '9999990002', 'Amelia Jones', 25, NULL, 'female', 'Music lover and foodie', 'img2.jpg', NULL, 1, '2026-04-11 09:06:49', '2026-04-11 09:06:49', 1, NULL, NULL, NULL, NULL, 0, NULL, NULL),
(3, 'john@example.com', 'hashed123', '9999990003', 'John Carter', 30, NULL, 'male', 'Fitness & adventure', 'img3.jpg', NULL, 1, '2026-04-11 09:06:49', '2026-04-11 09:06:49', 1, NULL, NULL, NULL, NULL, 0, NULL, NULL),
(4, 'alex@example.com', 'hashed123', '9999990004', 'Alex Smith', 27, NULL, 'male', 'Tech geek and gamer', 'img4.jpg', NULL, 1, '2026-04-11 09:06:49', '2026-04-11 09:06:49', 1, NULL, NULL, NULL, NULL, 0, NULL, NULL),
(5, 'amelia@test.com', '$2b$10$xe6Y4PKZhxhrNJspl4vPieB0sEN9uSpdxtf/Kb69Zdist7NA1eUUG', '+972781234567', 'Amelia Jones', 25, 168, 'female', 'Music lover and foodie. Looking for a real connection.', 'https://randomuser.me/api/portraits/women/44.jpg', 'en', 1, '2026-04-13 09:17:08', '2026-04-13 09:17:08', 6, NULL, NULL, NULL, NULL, 0, NULL, NULL),
(6, 'belle@test.com', '$2b$10$xe6Y4PKZhxhrNJspl4vPieB0sEN9uSpdxtf/Kb69Zdist7NA1eUUG', '+972789876543', 'Belle Benson', 28, 165, 'female', 'Love traveling & meaningful connections.', 'https://randomuser.me/api/portraits/women/68.jpg', 'en', 1, '2026-04-13 09:17:08', '2026-04-13 09:17:08', 6, NULL, NULL, NULL, NULL, 0, NULL, NULL),
(7, 'alex@test.com', '$2b$10$xe6Y4PKZhxhrNJspl4vPieB0sEN9uSpdxtf/Kb69Zdist7NA1eUUG', '+972781112233', 'Alex Turner', 30, 182, 'male', 'Adventure seeker. Coffee addict.', 'https://randomuser.me/api/portraits/men/32.jpg', 'en', 1, '2026-04-13 09:17:08', '2026-04-13 09:17:08', 6, NULL, NULL, NULL, NULL, 0, NULL, NULL),
(8, 'vinodRyaka@gmail.com', '$2b$10$a/6MMHebnIwxAdM5sTIWDezm.MX1ooG2RGiAzqbZFzfr8lOTmxry6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-04-16 17:06:03', '2026-04-16 17:08:37', 1, NULL, NULL, NULL, NULL, 0, NULL, NULL),
(9, 'testuser@gmail.com', '$2b$10$bL9uAViSFUE40qzPxvBhhebf6JhsUCRORMeODN52zZmDPsPKdccc.', NULL, 'vinod', 25, NULL, 'male', 'ok testing', 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/33ae74bc-976f-4300-a985-4ed453d280f1.jpg', NULL, 1, '2026-04-16 17:48:46', '2026-04-16 18:11:44', 9, NULL, NULL, NULL, NULL, 0, NULL, NULL),
(10, 'rahulsharma@gmail.com', '$2b$10$d5.kRzMuY8bW6Mvz9K2siOUFdbDDuEIwWe/EfkMovyLTRpWAw0/Pe', '9876543210', 'Rahul Sharma', 26, 175, 'male', 'okkkk', NULL, 'Hindi', 1, '2026-04-17 17:15:13', '2026-04-17 18:11:48', 9, NULL, 'rahul_vibes', NULL, NULL, 0, NULL, NULL),
(11, 'PriyaVerma@gmail.com', '$2b$10$cP.JWLmeHoRQyPv4pR.owOVVDJP73eFEgBd0hKKxj.8FBquVtlZOu', '9123456780', 'Priya Verma', 24, 162, 'female', 'okkkkk', 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/c821b978-2b41-4b96-b656-0acd7f68396f.png', 'Hindi', 1, '2026-04-17 17:16:41', '2026-04-17 17:26:02', 9, NULL, 'priya_life', NULL, NULL, 0, NULL, NULL),
(12, 'AmanGupta@gmail.com', '$2b$10$NxP6G7MdqigSUUxWrUz1gOSTlZTpNp53T7tkRpCOH.HvEo6sXfoj.', '9012345678', 'Aman Gupta', 29, 178, 'male', 'Gym lover, entrepreneur, loves coffee', NULL, 'Hindi', 1, '2026-04-17 18:24:57', '2026-04-17 18:26:16', 9, NULL, 'aman_fitlife', NULL, NULL, 0, NULL, NULL),
(13, 'SnehaKapoor@gmail.com', '$2b$10$Uwvsn7jY8iwvpISvdjRSkeyB.oL6F8nRNw65HfcYIn0Zp0UGdA856', '9988776655', 'Sneha Kapoor', 27, 165, 'female', 'Yoga, books, and peaceful vibes', NULL, 'Hindi', 1, '2026-04-17 18:26:55', '2026-04-17 18:45:43', 9, 'f6zpfi4gQVKdxBTQKdoO7m:APA91bEPbhbs5wd27PCO_XoOKdEmRe-WW-qhwj_Zvw657QU6DH-npYQAL1dj7hlZdSGKdJOrmvneUTEYcyvo99jwIvJRzpFsojpOToa4P0ykTzn0IJzRkqU', 'sneha_diaries', NULL, NULL, 0, NULL, NULL),
(15, 'rizwansheikh661@gmail.com', '$2b$10$D.U07PmndPEb8SHohSdryercJaRNcT9EZxfXUjnZTPASGkUA8X0YC', '9111291664', 'Rizwan Sheikh', 27, NULL, 'male', 'I am Software Engineer', 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/bf76ce7d-1199-4bea-a7c5-957c1e23e667.jpg', NULL, 1, '2026-04-18 05:30:14', '2026-05-03 17:34:50', 2, 'e2CVjneeQC6n2rWPiRx5vd:APA91bG2NvQgBRyg0fAMiTPKe1ctcq35cmOHPM8oFZ-SWdxMvf2Vp1kBx5SXvZ-6MKS0ubUJaO6AcFyHZeGveBJJ_8TEqRlylT7uri_RJg1TfHcSj9HLGMo', NULL, NULL, NULL, 0, NULL, NULL),
(16, 'nameerasheikh661@gmail.com', '$2b$10$BCIya13y3BbYOU5mRBMii.kcVc5o.AOcgW7ZhnNQtVsrFpqaUubVW', NULL, 'Nameera Sheikh', 26, NULL, 'female', 'I am house service', 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/29032287-1097-4b4c-acec-1552ffacf144.jpg', NULL, 1, '2026-04-18 06:03:30', '2026-04-18 06:07:10', 9, NULL, NULL, NULL, NULL, 0, NULL, NULL),
(17, 'RohitSingh@gmail.com', '$2b$10$3Tq6U0nhfhEUJxr8gc2/RuEbAi95cH3brKoClG/fZCFWkqBmevGmq', '9871234560', 'Rohit Singh', 25, 172, 'male', 'Travel freak, photography, adventure', 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/6f30cfb1-5ef7-4567-9cdf-40eccb9372da.png', 'English', 1, '2026-04-18 17:04:18', '2026-04-18 17:10:11', 9, 'f6zpfi4gQVKdxBTQKdoO7m:APA91bEPbhbs5wd27PCO_XoOKdEmRe-WW-qhwj_Zvw657QU6DH-npYQAL1dj7hlZdSGKdJOrmvneUTEYcyvo99jwIvJRzpFsojpOToa4P0ykTzn0IJzRkqU', 'rohit_travels', NULL, NULL, 0, NULL, NULL),
(18, 'NehaReddy@gmail.com', '$2b$10$Uqu7yi0N1UQbypJGqAv0KuLilkIsPWzVcEmvuxl71abWhQVjN8DQ2', '9765432101', 'Neha Reddy', 23, 160, 'female', 'Explorer, nature lover, loves photos', NULL, 'English', 1, '2026-04-18 17:06:24', '2026-04-18 17:07:25', 9, NULL, 'neha_explorer', NULL, NULL, 0, NULL, NULL),
(19, 'Amanji@gail.com', '$2b$10$.XVo2DyjcRrlO4CPO87zaODMli97/nJChGVQaCz2SK//Mv8Ld7Q9W', '9012345671', 'Aman Gupta', 29, 178, 'male', 'Gym lover, entrepreneur, loves coffee', 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/6afaf00a-cfec-44ab-a8f1-c8b31432bdd3.jpeg', 'Hindi', 1, '2026-04-18 18:15:48', '2026-04-20 19:24:14', 9, 'eQOxYZoFRFelcEuzPTh6Fs:APA91bGOWHogOIN0o2yMQ2RXkTM-TjUHVtBENWXjG5f-ls3-h2ReLJrbjMnxoidgZEzmfbX2XDGoJfONWG3iOImfKbGNuE4N_wplCaEEn-lm7-6-A8osq18', 'aman_fitlife', NULL, NULL, 0, NULL, NULL),
(20, 'Snehaji@gail.com', '$2b$10$4UMngM09fkmdBLTUG8T7AOTtH./4WfjplLWIDvE7s6JE88CQG5o7q', '9988776677', 'Sneha ji', 27, 165, 'female', 'Yoga, books, and peaceful vibes', 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/2f30acab-5339-43c3-9a20-e144c370aa3d.jpeg', 'Hindi', 1, '2026-04-18 18:19:15', '2026-04-18 18:35:10', 9, 'f6i7PBRwQiCsWjW4MQCHK_:APA91bEX5hwwnWgQ7VbfhnsvexC_WONip7iIrz5zkzV7FZVuYMLLVyLckRUGcvHXgHbCPhSyCf86dk4ECPN7YNLCOrBl62XAkiOZwyyUSsIpWJLpENB_QY4', 'sneha_diaries', NULL, NULL, 0, NULL, NULL),
(21, 'vinodrayka07@gmail.com', '', NULL, 'vinodrayka', 25, NULL, 'male', 'testing', 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/ea5df9fd-ea63-4559-88ac-9785fa4c5561.jpg', NULL, 1, '2026-04-19 15:20:50', '2026-04-19 15:27:24', 9, NULL, NULL, NULL, '102578603974743694521', 0, NULL, NULL),
(22, 'amitsingh@yopmail.com', '$2b$10$L3n9LL3AmkhT0OShmEZA1.hY.sjg1c7EtFoSy1fEaFGRn7IZoYdE6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-04-20 19:14:05', '2026-04-20 19:14:05', 1, NULL, NULL, NULL, NULL, 0, NULL, NULL),
(23, 'heineberg13@gmail.com', '', NULL, 'טל', 22, NULL, 'male', '..', 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/581e76fa-9570-4310-8dda-e65ea73dbcc2.jpg', NULL, 1, '2026-04-22 14:23:42', '2026-04-22 14:25:14', 9, NULL, NULL, NULL, '103293684203389188590', 0, NULL, NULL),
(24, 'arjun.sparktest@yopmail.com', '$2b$10$MuRGzX9UPpqhegBvXJ/upe1nTy/6C9mtqKN728FS3okj09mKSm1UW', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-04-22 16:09:14', '2026-04-22 16:09:14', 1, NULL, NULL, NULL, NULL, 0, NULL, NULL),
(25, 'priya.sparktest@yopmail.com', '$2b$10$Qm/J70YxW7Cs.y.9xcPJ7O2k8anNPbPfAuqBnF.2UOhze5Q.pDeiu', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-04-22 16:09:29', '2026-04-22 16:09:29', 1, NULL, NULL, NULL, NULL, 0, NULL, NULL),
(26, 'arjun.sparktest2@mailinator.com', '$2b$10$nJNZJED7rC6gtkBUAt/pf.wHaos/HSMaofq4o.Qhyec6.vVD2ussK', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-04-22 16:13:54', '2026-04-22 16:13:54', 1, NULL, NULL, NULL, NULL, 0, NULL, NULL),
(27, 'Rahuldas@gmail.com', '$2b$10$42fscyIMJXWxsG0Ry4rvfOOgMpjr5kmTnO07FS8t0OM2bYj5oA/my', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-04-23 17:31:31', '2026-04-23 17:31:31', 1, NULL, NULL, NULL, NULL, 1, NULL, NULL),
(28, 'rahuldas@yopmail.com', '$2b$10$jkskJOn7JqQN2IzWW5EJFu/YZJX3vxGdhTVv7K2zpdyEOpE0qyRFy', '987689999899', 'Rahul das', 26, 175, 'male', 'okkkk', 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/ddeb6825-b4cb-4177-9388-72cbc35bc634.jpeg', 'Hindi', 1, '2026-04-23 17:33:25', '2026-04-23 17:47:04', 9, 'eQOxYZoFRFelcEuzPTh6Fs:APA91bGOWHogOIN0o2yMQ2RXkTM-TjUHVtBENWXjG5f-ls3-h2ReLJrbjMnxoidgZEzmfbX2XDGoJfONWG3iOImfKbGNuE4N_wplCaEEn-lm7-6-A8osq18', 'rahul_vibes', NULL, NULL, 1, NULL, NULL),
(29, 'priyadas@yopmail.com', '$2b$10$DWWSbWGKA/MW.s6RenpZ6u5aNGzCpCvDkvaAgmyJri.qPx95KZpza', '9128878780', 'Priya das', 24, 162, 'female', 'okkkk', 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/df00b647-1c5a-40ae-b92f-f950750a9bd0.jpeg', 'Hindi', 1, '2026-04-23 17:38:48', '2026-04-23 17:49:21', 9, 'eQOxYZoFRFelcEuzPTh6Fs:APA91bGOWHogOIN0o2yMQ2RXkTM-TjUHVtBENWXjG5f-ls3-h2ReLJrbjMnxoidgZEzmfbX2XDGoJfONWG3iOImfKbGNuE4N_wplCaEEn-lm7-6-A8osq18', 'priya_smiles', NULL, NULL, 1, NULL, NULL),
(30, 'amanmeena@yopmail.com', '$2b$10$MceaURgxVsSMePfwppX.gOXrWfY7i4GkVmkeS.RHGN/5Cax43vvfe', '90000333333', 'Aman Verma', 27, 178, 'male', 'okkk', 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/67387eff-cd58-4631-8afb-792badd992cf.jpeg', 'Hindi', 1, '2026-04-24 17:21:42', '2026-04-26 16:12:51', 9, 'en48i-10QTq7npoNMXA97W:APA91bFJaN68xZcHwVNivAyfu6M58DgOhL7k6Hmu1ng4mhPpa7cnqqgqJEayuf2vKOYeDjYxDxxhvZUORbly2LmhituTNVuvFDFDSj9jxC4Tk9HeWbrckN4', 'aman_travels', NULL, NULL, 1, NULL, NULL),
(31, 'nehameena@yopmail.com', '$2b$10$oJLJx7BEMm0ydnFjGPsF3eSX3VfQi75HumUasHu8Us5wItGKglVw2', '9000066666', 'Neha Sharma', 25, 165, 'female', 'okkk', 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/cea066d5-e78a-43c7-9826-aeb2075a0275.jpeg', 'Hindi', 1, '2026-04-24 17:28:35', '2026-04-24 17:32:35', 9, 'eQOxYZoFRFelcEuzPTh6Fs:APA91bGOWHogOIN0o2yMQ2RXkTM-TjUHVtBENWXjG5f-ls3-h2ReLJrbjMnxoidgZEzmfbX2XDGoJfONWG3iOImfKbGNuE4N_wplCaEEn-lm7-6-A8osq18', 'neha_vibes', NULL, NULL, 1, NULL, NULL),
(33, 'yadaybrand@yopmail.com', '$2b$10$gV.vy8WID1aZqDv5Ux6xy.gxBzTb9U0yGRSRZUD4kmU1N6Z3yXx2m', NULL, '', 25, NULL, 'male', 'hhh', 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/65091bcb-6047-4a65-b647-8d234cc89f6a.jpg', NULL, 1, '2026-04-26 16:03:30', '2026-04-26 16:09:58', 6, NULL, NULL, NULL, NULL, 1, NULL, NULL),
(34, 'ethan@yopmail.com', '$2b$10$EBUOn66x0eKjIYeoDh.DLOcHRpdNIizIYI6NOKZGLYIA8FT9vHqo6', '98788787787', 'Ethan Carter', 27, 178, 'male', 'Love traveling, coffee, and late night talks.', 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/051162f1-a6ca-45e2-b9b7-f84c22a9a8a6.jpeg', 'English', 1, '2026-04-28 19:11:03', '2026-04-29 19:41:27', 9, 'dh-Ym8oBTA-kw1yxjUpD_0:APA91bHfxKIVHlvMETRMRIm3UpoM1OlCYCC03ZDqKuLwoFmGbzfxtP8-soofQQR53NGkmtlySY_wORLTtqNE2hlYJEL311ztx7jRVRJzZLTGimvS98ah-RQ', 'ethan.carter', NULL, NULL, 1, NULL, NULL),
(35, 'sophia@yopmail.com', '$2b$10$WXyTqFtj8xn8yKWxLYW1/eYhNjUYkc3/kDdlKaFtCcZB0yhGrtYjG', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-04-28 19:29:43', '2026-04-28 19:29:43', 1, NULL, NULL, NULL, NULL, 1, NULL, NULL),
(36, 'sophiaji@yopmail.com', '$2b$10$v5eoajB2M.FR62oxEzS9Dew6P5fDsSceVN2BpOouWhfunhaLRgOd2', '9123787887', 'Sophia Bennett', 25, 165, 'female', 'okkkk', 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/c8acb992-9939-4951-82da-aa3e4cf7fd23.jpeg', 'English', 1, '2026-04-28 19:30:29', '2026-05-03 17:32:27', 9, 'dR4uRQvmQ9Ox49B9eb6wy_:APA91bF2K1T6XdggWTEnStD1b42bNRG7HEKn83_tcB91KSppaMIM69LyIR8UBhBinyTMg3Cc1xrxio0v4ND_j5MAMHryLi7XSalMpoVxLr2bgTtDDYWu_SQ', 'sophia.b', NULL, NULL, 1, NULL, NULL),
(37, 'liam@yopmail.com', '$2b$10$sYD840hRJeQfm.BXfMdJJujqS5Hv93v4t1O5FEL18LNeA9pR3TA8y', '888888888', 'Liam Johnson', 30, 180, 'male', 'Gym lover and entrepreneur.', 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/3079e9ed-a118-44bd-8d61-e800bcb1bf30.png', 'English', 1, '2026-04-29 17:47:44', '2026-04-29 17:55:07', 9, 'dh-Ym8oBTA-kw1yxjUpD_0:APA91bHfxKIVHlvMETRMRIm3UpoM1OlCYCC03ZDqKuLwoFmGbzfxtP8-soofQQR53NGkmtlySY_wORLTtqNE2hlYJEL311ztx7jRVRJzZLTGimvS98ah-RQ', 'liam.j', NULL, NULL, 1, NULL, NULL),
(38, 'olivia@yopmail.com', '$2b$10$J5dYCyrw55V3nkIkzwzL/.YLD36ARlfCzEBN8ZhysnaUD0iMRZVgq', '8877778665544', 'Olivia Smith', 28, 170, 'female', 'Fitness trainer and yoga enthusiast.', 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/60681dbc-3e6c-4d97-92d8-c59f4b708d29.png', 'English', 1, '2026-04-29 17:56:05', '2026-04-30 18:49:56', 9, 'cYG-1WknT4Sn2Mui_ldbQg:APA91bEmO8d2d7OmCxqaQ7VABCGnmwzYi21hPwc362fZQ7EWdrZfbqSk9-be48NtX3yedxwAFLXFGW4Hh4qtIRE7RhYwK1RqrYpKfYQtU2P-E7QUXLQxnsU', 'olivia.fit', NULL, NULL, 1, NULL, NULL),
(39, 'noah@yopmail.com', '$2b$10$7Yv0Xq2FZR3.tqEld4pBoeD6idrUnVR0mpiOD1wqhANlfIHt2IVr2', '77666664433', 'Noah Williams', 24, 175, 'male', 'Music and gaming lover.', 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/e207b05c-f9f6-4289-ae7c-4d02421edcb2.jpeg', 'English', 1, '2026-04-29 18:21:36', '2026-04-29 18:26:16', 9, 'dh-Ym8oBTA-kw1yxjUpD_0:APA91bHfxKIVHlvMETRMRIm3UpoM1OlCYCC03ZDqKuLwoFmGbzfxtP8-soofQQR53NGkmtlySY_wORLTtqNE2hlYJEL311ztx7jRVRJzZLTGimvS98ah-RQ', 'noah.w', NULL, NULL, 1, NULL, NULL),
(40, 'ava@yopmail.com', '$2b$10$BvLLmU4gRyWRrqm44fXsUe0d41ZNXC8/24Qj0NYt2ygl9TzIVg2Qu', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-04-29 18:26:53', '2026-04-29 18:26:53', 1, NULL, NULL, NULL, NULL, 1, NULL, NULL),
(41, 'avaji@yopmail.com', '$2b$10$PAX5wMW0K19fGb5QL8wFae5kM9q5e30uDQMlACOGWyO8vXqD6.ZeS', '67778843322', 'Ava Brown', 23, 162, 'female', 'Singer and gamer girl.', 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/587814b7-b142-4626-82a2-511c3dd6b6cc.jpeg', 'English', 1, '2026-04-29 18:27:23', '2026-04-29 18:31:39', 9, 'dh-Ym8oBTA-kw1yxjUpD_0:APA91bHfxKIVHlvMETRMRIm3UpoM1OlCYCC03ZDqKuLwoFmGbzfxtP8-soofQQR53NGkmtlySY_wORLTtqNE2hlYJEL311ztx7jRVRJzZLTGimvS98ah-RQ', 'ava.music', NULL, NULL, 1, NULL, NULL),
(42, 'noah01@yopmail.com', '$2b$10$0OaHM.ZyOwJKEag8fXDdlezcuwHqfUsXixFMjHYLrKrXfvGJbPy0O', '776998899833', 'Noah Williams', 24, 175, 'male', 'Music and gaming lover.', 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/893f6fce-8ca8-4c77-a366-a7ce94871c0e.png', 'English', 1, '2026-04-29 18:38:37', '2026-04-29 18:39:46', 6, 'f6i7PBRwQiCsWjW4MQCHK_:APA91bEX5hwwnWgQ7VbfhnsvexC_WONip7iIrz5zkzV7FZVuYMLLVyLckRUGcvHXgHbCPhSyCf86dk4ECPN7YNLCOrBl62XAkiOZwyyUSsIpWJLpENB_QY4', 'noah.w', NULL, NULL, 1, NULL, NULL),
(43, 'avaji01@yopmail.com', '$2b$10$VTiAcPFNizvc3vWnoF7f2ezvoPUvDkK6HBLcfJcqkEi5aqaSeTpsO', '677788877643322', 'Ava Brown', 23, 162, 'female', 'Singer and gamer girl.', 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/f07dbf7e-fdef-4995-ab45-b38e4682b2ea.png', 'English', 1, '2026-04-29 18:40:17', '2026-04-29 18:41:33', 6, 'dh-Ym8oBTA-kw1yxjUpD_0:APA91bHfxKIVHlvMETRMRIm3UpoM1OlCYCC03ZDqKuLwoFmGbzfxtP8-soofQQR53NGkmtlySY_wORLTtqNE2hlYJEL311ztx7jRVRJzZLTGimvS98ah-RQ', 'ava.music', NULL, NULL, 1, NULL, NULL),
(45, 'zvikayaniv6@gmail.com', '', '0522513422', 'zvika', 40, NULL, 'male', 'shehdjj', 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/e328492e-85dc-4652-b582-d42eef491e40.jpg', 'hebrew', 1, '2026-05-02 17:56:15', '2026-05-02 18:11:48', 9, NULL, NULL, NULL, '111081384117875757609', 1, NULL, NULL),
(46, 'zivyon2@gmail.com', '', '0524555974', 'tova', 35, NULL, 'male', 'djshejrjrj', 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/a291ad97-a198-435f-8bec-da7b5395aef9.jpg', 'hebrew', 1, '2026-05-02 17:57:04', '2026-05-02 18:12:07', 9, NULL, NULL, NULL, '104805403084608684796', 1, NULL, NULL),
(47, 'abc@yopmail.com', '$2b$10$i0mg0YPC6bdFgCEVGIbVsuQzbzFXiJI2Z9n8oKjgVjIAWy6DV7skS', '20', 'Ethan Carter', 27, 178, 'male', 'Love traveling, coffee, and late night talks.', 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/f6d46ca7-d923-4437-9909-209b2ffa7249.jpg', 'English', 1, '2026-05-03 09:31:37', '2026-05-03 10:00:12', 0, 'dh-Ym8oBTA-kw1yxjUpD_0:APA91bHfxKIVHlvMETRMRIm3UpoM1OlCYCC03ZDqKuLwoFmGbzfxtP8-soofQQR53NGkmtlySY_wORLTtqNE2hlYJEL311ztx7jRVRJzZLTGimvS98ah-RQ', 'ethan.carter', NULL, NULL, 1, NULL, NULL),
(48, 'rahuldon@yopmail.com', '$2b$10$TzPxxnDmvlizmWwK7LqC5OINPANec11cxmj5XkyJSdfP3TsF2FHdC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-05-03 10:01:44', '2026-05-03 10:02:20', 2, NULL, NULL, NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_answers`
--

CREATE TABLE `user_answers` (
  `id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `question_id` int DEFAULT NULL,
  `option_id` int DEFAULT NULL,
  `answer` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_answers`
--

INSERT INTO `user_answers` (`id`, `user_id`, `question_id`, `option_id`, `answer`) VALUES
(1, 1, 2, 2, NULL),
(2, 3, 2, 2, NULL),
(3, 2, 2, 1, NULL),
(4, 4, 2, 3, NULL),
(5, 5, 1, 2, NULL),
(6, 5, 2, NULL, '5'),
(7, 5, 3, NULL, '3'),
(8, 5, 4, 8, NULL),
(9, 5, 5, NULL, NULL),
(10, 5, 6, NULL, '4'),
(11, 5, 7, NULL, NULL),
(12, 5, 8, NULL, NULL),
(13, 5, 9, NULL, '4'),
(14, 5, 10, NULL, '3'),
(15, 5, 11, NULL, '3'),
(16, 5, 12, NULL, '4'),
(17, 5, 13, NULL, NULL),
(18, 5, 14, NULL, '4'),
(19, 5, 15, NULL, '5'),
(20, 5, 16, NULL, NULL),
(21, 5, 17, NULL, '2'),
(22, 5, 18, NULL, '4'),
(23, 5, 19, NULL, NULL),
(24, 5, 20, NULL, '5'),
(25, 5, 21, NULL, '5'),
(26, 5, 22, NULL, '4'),
(27, 5, 23, NULL, '4'),
(28, 5, 24, NULL, NULL),
(29, 5, 25, NULL, '5'),
(30, 6, 1, 2, NULL),
(31, 6, 2, NULL, '5'),
(32, 6, 3, NULL, '3'),
(33, 6, 4, 8, NULL),
(34, 6, 5, NULL, NULL),
(35, 6, 6, NULL, '4'),
(36, 6, 7, NULL, NULL),
(37, 6, 8, NULL, NULL),
(38, 6, 9, NULL, '3'),
(39, 6, 10, NULL, '4'),
(40, 6, 11, NULL, '4'),
(41, 6, 12, NULL, '4'),
(42, 6, 13, NULL, NULL),
(43, 6, 14, NULL, '3'),
(44, 6, 15, NULL, '5'),
(45, 6, 16, NULL, NULL),
(46, 6, 17, NULL, '2'),
(47, 6, 18, NULL, '5'),
(48, 6, 19, NULL, NULL),
(49, 6, 20, NULL, '5'),
(50, 6, 21, NULL, '5'),
(51, 6, 22, NULL, '3'),
(52, 6, 23, NULL, '4'),
(53, 6, 24, NULL, NULL),
(54, 6, 25, NULL, '4'),
(55, 8, 1, NULL, 'Casual dating / No labels for now'),
(56, 9, 1, 1, 'Casual dating / No labels for now'),
(57, 9, 2, 35, '2'),
(58, 9, 3, 40, '2'),
(59, 9, 4, 9, 'Somewhat important, but not critical'),
(60, 9, 5, 12, 'Somewhat important'),
(61, 9, 6, 44, '3'),
(62, 9, 7, 15, 'Balance between career and family'),
(63, 9, 8, 18, 'Balanced lifestyle'),
(64, 9, 9, 49, '3'),
(65, 9, 10, 54, '3'),
(66, 9, 11, 59, '3'),
(67, 9, 12, 64, '3'),
(68, 9, 13, 21, 'Occasional'),
(69, 9, 14, 70, '2'),
(70, 9, 15, 75, '2'),
(71, 9, 16, 24, 'Listen first'),
(72, 9, 17, 80, '2'),
(73, 9, 18, 84, '3'),
(74, 9, 19, 28, 'Let things slide'),
(75, 9, 20, 90, '2'),
(76, 9, 21, 94, '3'),
(77, 9, 22, 100, '2'),
(78, 9, 23, 105, '2'),
(79, 9, 24, 30, 'Moderate frequency'),
(80, 9, 25, 110, '2'),
(81, 11, 1, 1, 'Casual dating / No labels for now'),
(82, 11, 2, 35, '2'),
(83, 11, 3, 40, '2'),
(84, 11, 4, 10, 'Very important to be on the same page'),
(85, 11, 5, 12, 'Somewhat important'),
(86, 11, 6, 45, '2'),
(87, 11, 7, 15, 'Balance between career and family'),
(88, 11, 8, 18, 'Balanced lifestyle'),
(89, 11, 9, 50, '2'),
(90, 11, 10, 55, '2'),
(91, 11, 11, 60, '2'),
(92, 11, 12, 65, '2'),
(93, 11, 13, 21, 'Occasional'),
(94, 11, 14, 70, '2'),
(95, 11, 15, 75, '2'),
(96, 11, 16, 24, 'Listen first'),
(97, 11, 17, 80, '2'),
(98, 11, 18, 85, '2'),
(99, 11, 19, 27, 'Cool down then talk'),
(100, 11, 20, 90, '2'),
(101, 11, 21, 95, '2'),
(102, 11, 22, 100, '2'),
(103, 11, 23, 105, '2'),
(104, 11, 24, 30, 'Moderate frequency'),
(105, 11, 25, 110, '2'),
(106, 10, 1, 1, 'Casual dating / No labels for now'),
(107, 10, 2, 35, '2'),
(108, 10, 3, 40, '2'),
(109, 10, 4, 8, 'Not important at all'),
(110, 10, 5, 11, 'Not important at all'),
(111, 10, 6, 45, '2'),
(112, 10, 7, 15, 'Balance between career and family'),
(113, 10, 8, 18, 'Balanced lifestyle'),
(114, 10, 9, 50, '2'),
(115, 10, 10, 55, '2'),
(116, 10, 11, 59, '3'),
(117, 10, 12, 65, '2'),
(118, 10, 13, 21, 'Occasional'),
(119, 10, 14, 70, '2'),
(120, 10, 15, 75, '2'),
(121, 10, 16, 24, 'Listen first'),
(122, 10, 17, 79, '3'),
(123, 10, 18, 85, '2'),
(124, 10, 19, 27, 'Cool down then talk'),
(125, 10, 20, 90, '2'),
(126, 10, 21, 95, '2'),
(127, 10, 22, 100, '2'),
(128, 10, 23, 105, '2'),
(129, 10, 24, 31, 'High frequency'),
(130, 10, 25, 110, '2'),
(131, 15, 1, 2, 'Serious long-term relationship'),
(132, 15, 2, 35, '2'),
(133, 15, 3, 39, '3'),
(134, 15, 4, 8, 'Not important at all'),
(135, 15, 5, 13, 'Very important'),
(136, 15, 6, 43, '4'),
(137, 15, 7, 15, 'Balance between career and family'),
(138, 15, 8, 18, 'Balanced lifestyle'),
(139, 15, 9, 49, '3'),
(140, 15, 10, 52, '5'),
(141, 15, 11, 57, '5'),
(142, 15, 12, 64, '3'),
(143, 15, 13, 22, 'Regular'),
(144, 15, 14, 69, '3'),
(145, 15, 15, 72, '5'),
(146, 15, 16, 25, 'Take space first'),
(147, 15, 17, 79, '3'),
(148, 15, 18, 84, '3'),
(149, 15, 19, 27, 'Cool down then talk'),
(150, 15, 20, 90, '2'),
(151, 15, 21, 94, '3'),
(152, 15, 22, 99, '3'),
(153, 15, 23, 105, '2'),
(154, 15, 24, 31, 'High frequency'),
(155, 15, 25, 109, '3'),
(156, 16, 1, 2, 'Serious long-term relationship'),
(157, 16, 2, 32, '5'),
(158, 16, 3, 39, '3'),
(159, 16, 4, 10, 'Very important to be on the same page'),
(160, 16, 5, 13, 'Very important'),
(161, 16, 6, 44, '3'),
(162, 16, 7, 15, 'Balance between career and family'),
(163, 16, 8, 18, 'Balanced lifestyle'),
(164, 16, 9, 49, '3'),
(165, 16, 10, 55, '2'),
(166, 16, 11, 59, '3'),
(167, 16, 12, 65, '2'),
(168, 16, 13, 20, 'Do not use'),
(169, 16, 14, 69, '3'),
(170, 16, 15, 72, '5'),
(171, 16, 16, 25, 'Take space first'),
(172, 16, 17, 79, '3'),
(173, 16, 18, 85, '2'),
(174, 16, 19, 26, 'Talk immediately'),
(175, 16, 20, 88, '4'),
(176, 16, 21, 94, '3'),
(177, 16, 22, 98, '4'),
(178, 16, 23, 104, '3'),
(179, 16, 24, 31, 'High frequency'),
(180, 16, 25, 109, '3'),
(181, 19, 1, 1, 'Casual dating / No labels for now'),
(182, 19, 2, 35, '2'),
(183, 19, 3, 40, '2'),
(184, 19, 4, 9, 'Somewhat important, but not critical'),
(185, 19, 5, 12, 'Somewhat important'),
(186, 19, 6, 45, '2'),
(187, 19, 7, 15, 'Balance between career and family'),
(188, 19, 8, 18, 'Balanced lifestyle'),
(189, 19, 9, 50, '2'),
(190, 19, 10, 55, '2'),
(191, 19, 11, 60, '2'),
(192, 19, 12, 65, '2'),
(193, 19, 13, 21, 'Occasional'),
(194, 19, 14, 70, '2'),
(195, 19, 15, 75, '2'),
(196, 19, 16, 24, 'Listen first'),
(197, 19, 17, 80, '2'),
(198, 19, 18, 85, '2'),
(199, 19, 19, 27, 'Cool down then talk'),
(200, 19, 20, 90, '2'),
(201, 19, 21, 95, '2'),
(202, 19, 22, 100, '2'),
(203, 19, 23, 105, '2'),
(204, 19, 24, 30, 'Moderate frequency'),
(205, 19, 25, 110, '2'),
(206, 20, 1, 2, 'Serious long-term relationship'),
(207, 20, 2, 35, '2'),
(208, 20, 3, 40, '2'),
(209, 20, 4, 9, 'Somewhat important, but not critical'),
(210, 20, 5, 12, 'Somewhat important'),
(211, 20, 6, 45, '2'),
(212, 20, 7, 15, 'Balance between career and family'),
(213, 20, 8, 18, 'Balanced lifestyle'),
(214, 20, 9, 50, '2'),
(215, 20, 10, 55, '2'),
(216, 20, 11, 60, '2'),
(217, 20, 12, 65, '2'),
(218, 20, 13, 21, 'Occasional'),
(219, 20, 14, 70, '2'),
(220, 20, 15, 75, '2'),
(221, 20, 16, 24, 'Listen first'),
(222, 20, 17, 80, '2'),
(223, 20, 18, 85, '2'),
(224, 20, 19, 27, 'Cool down then talk'),
(225, 20, 20, 90, '2'),
(226, 20, 21, 95, '2'),
(227, 20, 22, 100, '2'),
(228, 20, 23, 105, '2'),
(229, 20, 24, 30, 'Moderate frequency'),
(230, 20, 25, 110, '2'),
(231, 21, 1, 2, 'Serious long-term relationship'),
(232, 21, 2, 35, '2'),
(233, 21, 3, 40, '2'),
(234, 21, 4, 9, 'Somewhat important, but not critical'),
(235, 21, 5, 12, 'Somewhat important'),
(236, 21, 6, 45, '2'),
(237, 21, 7, 15, 'Balance between career and family'),
(238, 21, 8, 18, 'Balanced lifestyle'),
(239, 21, 9, 50, '2'),
(240, 21, 10, 55, '2'),
(241, 21, 11, 60, '2'),
(242, 21, 12, 65, '2'),
(243, 21, 13, 21, 'Occasional'),
(244, 21, 14, 70, '2'),
(245, 21, 15, 75, '2'),
(246, 21, 16, 24, 'Listen first'),
(247, 21, 17, 80, '2'),
(248, 21, 18, 85, '2'),
(249, 21, 19, 27, 'Cool down then talk'),
(250, 21, 20, 90, '2'),
(251, 21, 21, 95, '2'),
(252, 21, 22, 100, '2'),
(253, 21, 23, 105, '2'),
(254, 21, 24, 30, 'Moderate frequency'),
(255, 21, 25, 110, '2'),
(256, 23, 1, 1, 'Casual dating / No labels for now'),
(257, 23, 2, 34, '3'),
(258, 23, 3, 38, '4'),
(259, 23, 4, 9, 'Somewhat important, but not critical'),
(260, 23, 5, 13, 'Very important'),
(261, 23, 6, 45, '2'),
(262, 23, 7, 16, 'Family focused life'),
(263, 23, 8, 18, 'Balanced lifestyle'),
(264, 23, 9, 48, '4'),
(265, 23, 10, 53, '4'),
(266, 23, 11, 60, '2'),
(267, 23, 12, 65, '2'),
(268, 23, 13, 21, 'Occasional'),
(269, 23, 14, 68, '4'),
(270, 23, 15, 73, '4'),
(271, 23, 16, 24, 'Listen first'),
(272, 23, 17, 78, '4'),
(273, 23, 18, 83, '4'),
(274, 23, 19, 28, 'Let things slide'),
(275, 23, 20, 90, '2'),
(276, 23, 21, 94, '3'),
(277, 23, 22, 97, '5'),
(278, 23, 23, 106, '1'),
(279, 23, 24, 30, 'Moderate frequency'),
(280, 23, 25, 108, '4'),
(281, 28, 1, 2, 'Serious long-term relationship'),
(282, 28, 2, 35, '2'),
(283, 28, 3, 40, '2'),
(284, 28, 4, 9, 'Somewhat important, but not critical'),
(285, 28, 5, 12, 'Somewhat important'),
(286, 28, 6, 45, '2'),
(287, 28, 7, 15, 'Balance between career and family'),
(288, 28, 8, 18, 'Balanced lifestyle'),
(289, 28, 9, 50, '2'),
(290, 28, 10, 55, '2'),
(291, 28, 11, 60, '2'),
(292, 28, 12, 65, '2'),
(293, 28, 13, 21, 'Occasional'),
(294, 28, 14, 70, '2'),
(295, 28, 15, 75, '2'),
(296, 28, 16, 24, 'Listen first'),
(297, 28, 17, 80, '2'),
(298, 28, 18, 85, '2'),
(299, 28, 19, 27, 'Cool down then talk'),
(300, 28, 20, 90, '2'),
(301, 28, 21, 95, '2'),
(302, 28, 22, 100, '2'),
(303, 28, 23, 105, '2'),
(304, 28, 24, 30, 'Moderate frequency'),
(305, 28, 25, 110, '2'),
(306, 29, 1, 2, 'Serious long-term relationship'),
(307, 29, 2, 35, '2'),
(308, 29, 3, 40, '2'),
(309, 29, 4, 9, 'Somewhat important, but not critical'),
(310, 29, 5, 12, 'Somewhat important'),
(311, 29, 6, 45, '2'),
(312, 29, 7, 15, 'Balance between career and family'),
(313, 29, 8, 18, 'Balanced lifestyle'),
(314, 29, 9, 50, '2'),
(315, 29, 10, 55, '2'),
(316, 29, 11, 60, '2'),
(317, 29, 12, 65, '2'),
(318, 29, 13, 21, 'Occasional'),
(319, 29, 14, 70, '2'),
(320, 29, 15, 75, '2'),
(321, 29, 16, 24, 'Listen first'),
(322, 29, 17, 80, '2'),
(323, 29, 18, 85, '2'),
(324, 29, 19, 27, 'Cool down then talk'),
(325, 29, 20, 90, '2'),
(326, 29, 21, 95, '2'),
(327, 29, 22, 100, '2'),
(328, 29, 23, 105, '2'),
(329, 29, 24, 30, 'Moderate frequency'),
(330, 29, 25, 110, '2'),
(331, 31, 1, 2, 'Serious long-term relationship'),
(332, 31, 2, 35, '2'),
(333, 31, 3, 40, '2'),
(334, 31, 4, 9, 'Somewhat important, but not critical'),
(335, 31, 5, 12, 'Somewhat important'),
(336, 31, 6, 45, '2'),
(337, 31, 7, 15, 'Balance between career and family'),
(338, 31, 8, 18, 'Balanced lifestyle'),
(339, 31, 9, 50, '2'),
(340, 31, 10, 55, '2'),
(341, 31, 11, 60, '2'),
(342, 31, 12, 65, '2'),
(343, 31, 13, 21, 'Occasional'),
(344, 31, 14, 70, '2'),
(345, 31, 15, 75, '2'),
(346, 31, 16, 24, 'Listen first'),
(347, 31, 17, 80, '2'),
(348, 31, 18, 85, '2'),
(349, 31, 19, 27, 'Cool down then talk'),
(350, 31, 20, 90, '2'),
(351, 31, 21, 95, '2'),
(352, 31, 22, 100, '2'),
(353, 31, 23, 105, '2'),
(354, 31, 24, 30, 'Moderate frequency'),
(355, 31, 25, 110, '2'),
(356, 30, 1, 2, 'Serious long-term relationship'),
(357, 30, 2, 35, '2'),
(358, 30, 3, 40, '2'),
(359, 30, 4, 9, 'Somewhat important, but not critical'),
(360, 30, 5, 12, 'Somewhat important'),
(361, 30, 6, 45, '2'),
(362, 30, 7, 15, 'Balance between career and family'),
(363, 30, 8, 18, 'Balanced lifestyle'),
(364, 30, 9, 50, '2'),
(365, 30, 10, 55, '2'),
(366, 30, 11, 60, '2'),
(367, 30, 12, 65, '2'),
(368, 30, 13, 21, 'Occasional'),
(369, 30, 14, 70, '2'),
(370, 30, 15, 75, '2'),
(371, 30, 16, 24, 'Listen first'),
(372, 30, 17, 80, '2'),
(373, 30, 18, 85, '2'),
(374, 30, 19, 27, 'Cool down then talk'),
(375, 30, 20, 90, '2'),
(376, 30, 21, 95, '2'),
(377, 30, 22, 100, '2'),
(378, 30, 23, 105, '2'),
(379, 30, 24, 30, 'Moderate frequency'),
(380, 30, 25, 110, '2'),
(406, 34, 1, 2, 'Serious long-term relationship'),
(407, 34, 2, 35, '2'),
(408, 34, 3, 40, '2'),
(409, 34, 4, 9, 'Somewhat important, but not critical'),
(410, 34, 5, 12, 'Somewhat important'),
(411, 34, 6, 45, '2'),
(412, 34, 7, 15, 'Balance between career and family'),
(413, 34, 8, 18, 'Balanced lifestyle'),
(414, 34, 9, 50, '2'),
(415, 34, 10, 55, '2'),
(416, 34, 11, 60, '2'),
(417, 34, 12, 65, '2'),
(418, 34, 13, 21, 'Occasional'),
(419, 34, 14, 70, '2'),
(420, 34, 15, 75, '2'),
(421, 34, 16, 24, 'Listen first'),
(422, 34, 17, 80, '2'),
(423, 34, 18, 85, '2'),
(424, 34, 19, 27, 'Cool down then talk'),
(425, 34, 20, 90, '2'),
(426, 34, 21, 95, '2'),
(427, 34, 22, 100, '2'),
(428, 34, 23, 105, '2'),
(429, 34, 24, 30, 'Moderate frequency'),
(430, 34, 25, 110, '2'),
(431, 36, 1, 2, 'Serious long-term relationship'),
(432, 36, 2, 35, '2'),
(433, 36, 3, 40, '2'),
(434, 36, 4, 9, 'Somewhat important, but not critical'),
(435, 36, 5, 12, 'Somewhat important'),
(436, 36, 6, 45, '2'),
(437, 36, 7, 15, 'Balance between career and family'),
(438, 36, 8, 18, 'Balanced lifestyle'),
(439, 36, 9, 50, '2'),
(440, 36, 10, 55, '2'),
(441, 36, 11, 60, '2'),
(442, 36, 12, 65, '2'),
(443, 36, 13, 21, 'Occasional'),
(444, 36, 14, 70, '2'),
(445, 36, 15, 75, '2'),
(446, 36, 16, 24, 'Listen first'),
(447, 36, 17, 80, '2'),
(448, 36, 18, 85, '2'),
(449, 36, 19, 27, 'Cool down then talk'),
(450, 36, 20, 90, '2'),
(451, 36, 21, 95, '2'),
(452, 36, 22, 100, '2'),
(453, 36, 23, 105, '2'),
(454, 36, 24, 30, 'Moderate frequency'),
(455, 36, 25, 110, '2'),
(456, 37, 1, 2, 'Serious long-term relationship'),
(457, 37, 2, 35, '2'),
(458, 37, 3, 40, '2'),
(459, 37, 4, 9, 'Somewhat important, but not critical'),
(460, 37, 5, 12, 'Somewhat important'),
(461, 37, 6, 45, '2'),
(462, 37, 7, 15, 'Balance between career and family'),
(463, 37, 8, 18, 'Balanced lifestyle'),
(464, 37, 9, 50, '2'),
(465, 37, 10, 55, '2'),
(466, 37, 11, 60, '2'),
(467, 37, 12, 65, '2'),
(468, 37, 13, 21, 'Occasional'),
(469, 37, 14, 70, '2'),
(470, 37, 15, 75, '2'),
(471, 37, 16, 24, 'Listen first'),
(472, 37, 17, 80, '2'),
(473, 37, 18, 85, '2'),
(474, 37, 19, 27, 'Cool down then talk'),
(475, 37, 20, 90, '2'),
(476, 37, 21, 95, '2'),
(477, 37, 22, 100, '2'),
(478, 37, 23, 105, '2'),
(479, 37, 24, 30, 'Moderate frequency'),
(480, 37, 25, 110, '2'),
(481, 38, 1, 2, 'Serious long-term relationship'),
(482, 38, 2, 35, '2'),
(483, 38, 3, 40, '2'),
(484, 38, 4, 9, 'Somewhat important, but not critical'),
(485, 38, 5, 12, 'Somewhat important'),
(486, 38, 6, 45, '2'),
(487, 38, 7, 15, 'Balance between career and family'),
(488, 38, 8, 18, 'Balanced lifestyle'),
(489, 38, 9, 50, '2'),
(490, 38, 10, 55, '2'),
(491, 38, 11, 60, '2'),
(492, 38, 12, 65, '2'),
(493, 38, 13, 21, 'Occasional'),
(494, 38, 14, 70, '2'),
(495, 38, 15, 75, '2'),
(496, 38, 16, 24, 'Listen first'),
(497, 38, 17, 80, '2'),
(498, 38, 18, 85, '2'),
(499, 38, 19, 27, 'Cool down then talk'),
(500, 38, 20, 90, '2'),
(501, 38, 21, 95, '2'),
(502, 38, 22, 100, '2'),
(503, 38, 23, 105, '2'),
(504, 38, 24, 30, 'Moderate frequency'),
(505, 38, 25, 110, '2'),
(506, 39, 1, 2, 'Serious long-term relationship'),
(507, 39, 2, 35, '2'),
(508, 39, 3, 40, '2'),
(509, 39, 4, 9, 'Somewhat important, but not critical'),
(510, 39, 5, 12, 'Somewhat important'),
(511, 39, 6, 45, '2'),
(512, 39, 7, 15, 'Balance between career and family'),
(513, 39, 8, 18, 'Balanced lifestyle'),
(514, 39, 9, 50, '2'),
(515, 39, 10, 55, '2'),
(516, 39, 11, 60, '2'),
(517, 39, 12, 65, '2'),
(518, 39, 13, 21, 'Occasional'),
(519, 39, 14, 70, '2'),
(520, 39, 15, 75, '2'),
(521, 39, 16, 24, 'Listen first'),
(522, 39, 17, 80, '2'),
(523, 39, 18, 85, '2'),
(524, 39, 19, 27, 'Cool down then talk'),
(525, 39, 20, 90, '2'),
(526, 39, 21, 95, '2'),
(527, 39, 22, 100, '2'),
(528, 39, 23, 105, '2'),
(529, 39, 24, 30, 'Moderate frequency'),
(530, 39, 25, 110, '2'),
(531, 41, 1, 2, 'Serious long-term relationship'),
(532, 41, 2, 35, '2'),
(533, 41, 3, 40, '2'),
(534, 41, 4, 9, 'Somewhat important, but not critical'),
(535, 41, 5, 12, 'Somewhat important'),
(536, 41, 6, 45, '2'),
(537, 41, 7, 15, 'Balance between career and family'),
(538, 41, 8, 18, 'Balanced lifestyle'),
(539, 41, 9, 50, '2'),
(540, 41, 10, 55, '2'),
(541, 41, 11, 60, '2'),
(542, 41, 12, 65, '2'),
(543, 41, 13, 21, 'Occasional'),
(544, 41, 14, 70, '2'),
(545, 41, 15, 75, '2'),
(546, 41, 16, 24, 'Listen first'),
(547, 41, 17, 80, '2'),
(548, 41, 18, 85, '2'),
(549, 41, 19, 27, 'Cool down then talk'),
(550, 41, 20, 90, '2'),
(551, 41, 21, 95, '2'),
(552, 41, 22, 100, '2'),
(553, 41, 23, 105, '2'),
(554, 41, 24, 30, 'Moderate frequency'),
(555, 41, 25, 110, '2'),
(581, 45, 1, 3, 'Marriage / Building a family'),
(582, 45, 2, 32, '5'),
(583, 45, 3, 37, '5'),
(584, 45, 4, 8, 'Not important at all'),
(585, 45, 5, 11, 'Not important at all'),
(586, 45, 6, 42, '5'),
(587, 45, 7, 14, 'Free/spontaneous lifestyle'),
(588, 45, 8, 17, 'Go with the flow'),
(589, 45, 9, 47, '5'),
(590, 45, 10, 52, '5'),
(591, 45, 11, 57, '5'),
(592, 45, 12, 62, '5'),
(593, 45, 13, 22, 'Regular'),
(594, 45, 14, 67, '5'),
(595, 45, 15, 72, '5'),
(596, 45, 16, 23, 'Jump in and solve'),
(597, 45, 17, 77, '5'),
(598, 45, 18, 82, '5'),
(599, 45, 19, 26, 'Talk immediately'),
(600, 45, 20, 87, '5'),
(601, 45, 21, 92, '5'),
(602, 45, 22, 97, '5'),
(603, 45, 23, 102, '5'),
(604, 45, 24, 29, 'Low frequency'),
(605, 45, 25, 107, '5'),
(606, 46, 1, 3, 'Marriage / Building a family'),
(607, 46, 2, 32, '5'),
(608, 46, 3, 37, '5'),
(609, 46, 4, 8, 'Not important at all'),
(610, 46, 5, 11, 'Not important at all'),
(611, 46, 6, 42, '5'),
(612, 46, 7, 14, 'Free/spontaneous lifestyle'),
(613, 46, 8, 17, 'Go with the flow'),
(614, 46, 9, 47, '5'),
(615, 46, 10, 52, '5'),
(616, 46, 11, 57, '5'),
(617, 46, 12, 62, '5'),
(618, 46, 13, 22, 'Regular'),
(619, 46, 14, 67, '5'),
(620, 46, 15, 72, '5'),
(621, 46, 16, 23, 'Jump in and solve'),
(622, 46, 17, 77, '5'),
(623, 46, 18, 82, '5'),
(624, 46, 19, 26, 'Talk immediately'),
(625, 46, 20, 87, '5'),
(626, 46, 21, 92, '5'),
(627, 46, 22, 97, '5'),
(628, 46, 23, 102, '5'),
(629, 46, 24, 29, 'Low frequency'),
(630, 46, 25, 107, '5'),
(631, 47, 1, 1, 'Casual dating / No labels for now'),
(632, 47, 2, 35, '2'),
(633, 47, 3, 40, '2'),
(634, 47, 4, 9, 'Somewhat important, but not critical'),
(635, 47, 5, 12, 'Somewhat important'),
(636, 47, 6, 45, '2'),
(637, 47, 7, 15, 'Balance between career and family'),
(638, 47, 8, 18, 'Balanced lifestyle'),
(639, 47, 9, 50, '2'),
(640, 47, 10, 55, '2'),
(641, 47, 11, 60, '2'),
(642, 47, 12, 65, '2'),
(643, 47, 13, 21, 'Occasional'),
(644, 47, 14, 70, '2'),
(645, 47, 15, 75, '2'),
(646, 47, 16, 24, 'Listen first'),
(647, 47, 17, 80, '2'),
(648, 47, 18, 85, '2'),
(649, 47, 19, 27, 'Cool down then talk'),
(650, 47, 20, 90, '2'),
(651, 47, 21, 95, '2'),
(652, 47, 22, 100, '2'),
(653, 47, 23, 105, '2'),
(654, 47, 24, 30, 'Moderate frequency'),
(655, 47, 25, 110, '2');

-- --------------------------------------------------------

--
-- Table structure for table `user_interests`
--

CREATE TABLE `user_interests` (
  `id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `interest_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_interests`
--

INSERT INTO `user_interests` (`id`, `user_id`, `interest_id`) VALUES
(1, 1, 1),
(2, 1, 4),
(3, 1, 2),
(4, 2, 1),
(5, 2, 3),
(6, 3, 5),
(7, 3, 4),
(8, 4, 6),
(9, 4, 1),
(10, 5, 12),
(11, 5, 5),
(12, 5, 8),
(13, 5, 10),
(14, 6, 12),
(15, 6, 5),
(16, 6, 1),
(17, 6, 10),
(18, 7, 7),
(19, 7, 10),
(20, 7, 9),
(21, 9, 1),
(22, 9, 2),
(23, 9, 3),
(30, 11, 1),
(31, 11, 4),
(32, 11, 5),
(33, 10, 1),
(34, 10, 3),
(35, 10, 5),
(36, 12, 2),
(37, 12, 3),
(38, 12, 6),
(39, 13, 2),
(40, 13, 6),
(41, 13, 7),
(45, 15, 12),
(46, 15, 11),
(47, 15, 14),
(48, 15, 13),
(49, 15, 10),
(50, 15, 9),
(51, 15, 8),
(52, 15, 7),
(53, 15, 6),
(54, 15, 5),
(55, 15, 4),
(56, 15, 3),
(57, 15, 2),
(58, 15, 1),
(59, 16, 1),
(60, 16, 2),
(61, 16, 3),
(62, 16, 4),
(63, 16, 5),
(64, 16, 6),
(65, 16, 7),
(66, 16, 8),
(67, 16, 9),
(68, 16, 10),
(69, 16, 11),
(70, 16, 12),
(71, 16, 13),
(72, 16, 14),
(73, 17, 1),
(74, 17, 8),
(75, 17, 9),
(76, 18, 1),
(77, 18, 8),
(78, 18, 10),
(91, 19, 2),
(92, 19, 3),
(93, 19, 6),
(94, 20, 2),
(95, 20, 6),
(96, 20, 7),
(100, 21, 1),
(101, 21, 2),
(102, 21, 3),
(103, 23, 4),
(104, 23, 6),
(105, 23, 7),
(115, 28, 1),
(116, 28, 2),
(117, 28, 5),
(118, 29, 1),
(119, 29, 5),
(120, 29, 7),
(127, 31, 1),
(128, 31, 5),
(129, 31, 7),
(130, 30, 1),
(131, 30, 2),
(132, 30, 5),
(151, 34, 1),
(152, 34, 2),
(153, 34, 5),
(157, 36, 2),
(158, 36, 5),
(159, 36, 7),
(162, 37, 3),
(163, 37, 6),
(164, 37, 4),
(171, 38, 3),
(172, 38, 6),
(173, 38, 8),
(178, 39, 4),
(179, 39, 6),
(180, 39, 8),
(184, 41, 4),
(185, 41, 9),
(186, 41, 10),
(187, 42, 4),
(188, 42, 9),
(189, 43, 4),
(190, 43, 9),
(191, 43, 10),
(196, 45, 1),
(197, 45, 14),
(198, 45, 10),
(199, 46, 14),
(200, 46, 1),
(201, 46, 10),
(206, 47, 1),
(207, 47, 2),
(208, 47, 5);

-- --------------------------------------------------------

--
-- Table structure for table `user_location`
--

CREATE TABLE `user_location` (
  `id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_location`
--

INSERT INTO `user_location` (`id`, `user_id`, `latitude`, `longitude`, `city`, `updated_at`) VALUES
(1, 1, '28.61390000', '77.20900000', 'Delhi', '2026-04-11 09:07:12'),
(2, 2, '28.53550000', '77.39100000', 'Noida', '2026-04-11 09:07:12'),
(3, 3, '19.07600000', '72.87770000', 'Mumbai', '2026-04-11 09:07:12'),
(4, 4, '12.97160000', '77.59460000', 'Bangalore', '2026-04-11 09:07:12'),
(5, 5, '32.08530000', '34.78180000', 'Tel Aviv', '2026-04-13 09:19:08'),
(6, 6, '32.09000000', '34.78000000', 'Tel Aviv', '2026-04-13 09:19:08'),
(7, 7, '32.10000000', '34.80000000', 'Ramat Gan', '2026-04-13 09:19:08'),
(8, 9, '37.78583400', '-122.40641700', 'indore', '2026-04-16 18:11:44'),
(9, 10, '37.78583400', '-122.40641700', 'Delhi', '2026-04-17 18:11:48'),
(10, 11, '37.78583400', '-122.40641700', 'Delhi', '2026-04-17 17:20:55'),
(11, 12, '19.07600000', '72.87770000', 'Mumbai', '2026-04-17 18:26:16'),
(12, 13, '19.08220000', '72.84170000', 'Mumbai', '2026-04-17 18:27:57'),
(14, 15, '22.69632130', '75.88723210', 'indore', '2026-04-18 05:39:13'),
(15, 16, '22.69632410', '75.88723400', 'Indore', '2026-04-18 06:07:10'),
(16, 17, '12.97160000', '77.59460000', 'Bangalore', '2026-04-18 17:05:27'),
(17, 18, '12.93520000', '77.62450000', 'Bangalore', '2026-04-18 17:07:25'),
(18, 19, '37.78583400', '-122.40641700', 'indore', '2026-04-19 14:13:07'),
(19, 20, '37.78583400', '-122.40641700', 'Mumbai', '2026-04-18 18:35:10'),
(20, 21, '22.70140930', '75.86289040', 'indor', '2026-04-19 15:27:24'),
(21, 23, '32.08206230', '34.77525210', 'tel aviv', '2026-04-22 14:25:14'),
(22, 28, '22.70134960', '75.86266790', 'Indore', '2026-04-23 17:47:04'),
(23, 29, '22.70134960', '75.86264520', 'Indore', '2026-04-23 17:49:21'),
(24, 30, '22.70135820', '75.86188290', 'Indore', '2026-04-24 17:35:02'),
(25, 31, '22.70135860', '75.86188420', 'Indore', '2026-04-24 17:32:35'),
(27, 33, NULL, NULL, '', '2026-04-26 16:09:49'),
(28, 34, '22.70146000', '75.86255010', 'Indore', '2026-04-28 19:28:52'),
(29, 36, '22.70143830', '75.86242660', 'Indore', '2026-04-28 19:35:46'),
(30, 37, '22.70141350', '75.86224010', 'Bhopal', '2026-04-29 17:55:07'),
(31, 38, '22.70144210', '75.86214180', 'Bhopal', '2026-04-29 18:00:14'),
(32, 39, '22.70146860', '75.86198050', 'Delhi', '2026-04-29 18:26:16'),
(33, 41, '22.70071040', '75.86192850', 'Delhi', '2026-04-29 18:31:39'),
(34, 42, '28.61390000', '77.20900000', 'Delhi', '2026-04-29 18:39:25'),
(35, 43, '28.61450000', '77.21000000', 'Delhi', '2026-04-29 18:41:15'),
(37, 45, '32.27308330', '34.84698860', 'netania', '2026-05-02 18:07:21'),
(38, 46, '32.27308550', '34.84701440', 'netania', '2026-05-02 18:07:19'),
(39, 47, '22.71960000', '75.85770000', 'Indore', '2026-05-03 09:57:36');

-- --------------------------------------------------------

--
-- Table structure for table `user_offers`
--

CREATE TABLE `user_offers` (
  `id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `reward_id` bigint DEFAULT NULL,
  `redeemed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_offers`
--

INSERT INTO `user_offers` (`id`, `user_id`, `reward_id`, `redeemed_at`) VALUES
(1, 1, 1, NULL),
(2, 1, 2, NULL),
(3, 2, 3, NULL),
(4, 20, 1, '2026-04-19 14:01:20'),
(5, 19, 3, '2026-04-19 14:28:02'),
(6, 21, 1, '2026-04-20 19:26:13');

-- --------------------------------------------------------

--
-- Table structure for table `user_photos`
--

CREATE TABLE `user_photos` (
  `photo_id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `photo_url` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_photos`
--

INSERT INTO `user_photos` (`photo_id`, `user_id`, `photo_url`) VALUES
(1, 1, 'photo1.jpg'),
(2, 1, 'photo2.jpg'),
(3, 2, 'photo3.jpg'),
(4, 3, 'photo4.jpg'),
(5, 5, 'https://randomuser.me/api/portraits/women/44.jpg'),
(6, 5, 'https://randomuser.me/api/portraits/women/45.jpg'),
(7, 6, 'https://randomuser.me/api/portraits/women/68.jpg'),
(8, 6, 'https://randomuser.me/api/portraits/women/69.jpg'),
(9, 7, 'https://randomuser.me/api/portraits/men/32.jpg'),
(10, 9, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/33ae74bc-976f-4300-a985-4ed453d280f1.jpg'),
(11, 11, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/c821b978-2b41-4b96-b656-0acd7f68396f.png'),
(12, 15, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/bf76ce7d-1199-4bea-a7c5-957c1e23e667.jpg'),
(13, 15, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/d115547a-a9ff-447d-b4cd-c5dc26bb58de.jpg'),
(14, 16, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/29032287-1097-4b4c-acec-1552ffacf144.jpg'),
(15, 16, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/edd13069-c4ac-4b3b-bd60-b8ce863d2690.jpg'),
(16, 16, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/28e4e155-e982-4a47-9f01-58b5b9aa701d.jpg'),
(17, 16, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/88318b5b-9241-4bfa-acea-61d9358c29b2.jpg'),
(18, 16, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/af3e4571-ce7d-4822-86ab-b7674d0b275f.jpg'),
(19, 17, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/6f30cfb1-5ef7-4567-9cdf-40eccb9372da.png'),
(20, 20, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/2f30acab-5339-43c3-9a20-e144c370aa3d.jpeg'),
(21, 19, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/6afaf00a-cfec-44ab-a8f1-c8b31432bdd3.jpeg'),
(22, 21, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/ea5df9fd-ea63-4559-88ac-9785fa4c5561.jpg'),
(23, 21, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/f68351b1-9efb-4e59-8fff-7fb77f93fc21.jpg'),
(24, 23, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/581e76fa-9570-4310-8dda-e65ea73dbcc2.jpg'),
(25, 28, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/ddeb6825-b4cb-4177-9388-72cbc35bc634.jpeg'),
(26, 29, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/df00b647-1c5a-40ae-b92f-f950750a9bd0.jpeg'),
(27, 30, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/67387eff-cd58-4631-8afb-792badd992cf.jpeg'),
(28, 31, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/cea066d5-e78a-43c7-9826-aeb2075a0275.jpeg'),
(30, 33, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/65091bcb-6047-4a65-b647-8d234cc89f6a.jpg'),
(31, 34, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/051162f1-a6ca-45e2-b9b7-f84c22a9a8a6.jpeg'),
(32, 36, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/c8acb992-9939-4951-82da-aa3e4cf7fd23.jpeg'),
(33, 37, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/3079e9ed-a118-44bd-8d61-e800bcb1bf30.png'),
(34, 38, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/60681dbc-3e6c-4d97-92d8-c59f4b708d29.png'),
(35, 39, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/e207b05c-f9f6-4289-ae7c-4d02421edcb2.jpeg'),
(36, 41, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/587814b7-b142-4626-82a2-511c3dd6b6cc.jpeg'),
(37, 42, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/893f6fce-8ca8-4c77-a366-a7ce94871c0e.png'),
(38, 43, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/f07dbf7e-fdef-4995-ab45-b38e4682b2ea.png'),
(44, 45, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/e328492e-85dc-4652-b582-d42eef491e40.jpg'),
(45, 46, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/a291ad97-a198-435f-8bec-da7b5395aef9.jpg'),
(46, 47, 'https://fra1.digitaloceanspaces.com/sparklink-assets/profile_photos/f6d46ca7-d923-4437-9909-209b2ffa7249.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `video_calls`
--

CREATE TABLE `video_calls` (
  `call_id` bigint NOT NULL,
  `match_id` bigint DEFAULT NULL,
  `scheduled_time` datetime DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'scheduled',
  `meeting_link` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `notified_before` tinyint(1) DEFAULT '0',
  `expires_at` datetime DEFAULT NULL,
  `channel_name` varchar(100) DEFAULT NULL,
  `rtc_token` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `video_calls`
--

INSERT INTO `video_calls` (`call_id`, `match_id`, `scheduled_time`, `status`, `meeting_link`, `created_at`, `notified_before`, `expires_at`, `channel_name`, `rtc_token`) VALUES
(3, 1, '2026-04-12 11:00:00', 'scheduled', NULL, '2026-04-11 09:19:57', 0, NULL, NULL, NULL),
(4, 2, '2026-04-13 15:00:00', 'completed', NULL, '2026-04-11 09:19:57', 0, NULL, NULL, NULL),
(5, 6, '2026-04-27 09:00:00', 'completed', NULL, '2026-04-22 18:51:51', 0, '2026-04-27 09:20:00', 'call_6_1776883911237', NULL),
(6, 7, '2026-04-30 07:00:00', 'expired', NULL, '2026-04-23 20:02:13', 1, '2026-04-30 07:20:00', 'call_7_1776974533446', NULL),
(7, 8, '2026-05-01 06:00:00', 'expired', NULL, '2026-04-24 19:11:53', 1, '2026-05-01 06:20:00', 'call_8_1777057913224', NULL),
(8, 9, '2026-04-29 06:00:00', 'completed', NULL, '2026-04-28 19:39:56', 1, '2026-04-29 06:20:00', 'call_9_1777405196162', NULL),
(9, 10, '2026-05-06 06:00:00', 'completed', NULL, '2026-04-29 18:07:20', 0, '2026-05-06 06:20:00', 'call_10_1777486040462', NULL),
(10, 11, '2026-04-30 01:00:00', 'expired', NULL, '2026-04-29 18:37:11', 1, '2026-04-30 01:20:00', 'call_11_1777487831683', NULL),
(11, 14, '2026-05-06 01:00:00', 'completed', NULL, '2026-04-29 18:58:49', 0, '2026-05-06 01:20:00', 'call_14_1777489129353', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `availability`
--
ALTER TABLE `availability`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `availability_requests`
--
ALTER TABLE `availability_requests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_request_per_match` (`match_id`,`from_user_id`);

--
-- Indexes for table `compatibility_scores`
--
ALTER TABLE `compatibility_scores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user1_id` (`user1_id`),
  ADD KEY `user2_id` (`user2_id`);

--
-- Indexes for table `email_otp`
--
ALTER TABLE `email_otp`
  ADD PRIMARY KEY (`otp_id`);

--
-- Indexes for table `interests_master`
--
ALTER TABLE `interests_master`
  ADD PRIMARY KEY (`interest_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `matches`
--
ALTER TABLE `matches`
  ADD PRIMARY KEY (`match_id`),
  ADD KEY `user1_id` (`user1_id`),
  ADD KEY `user2_id` (`user2_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `preferences`
--
ALTER TABLE `preferences`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `question_categories`
--
ALTER TABLE `question_categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `question_options`
--
ALTER TABLE `question_options`
  ADD PRIMARY KEY (`option_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `reporter_id` (`reporter_id`),
  ADD KEY `reported_id` (`reported_id`);

--
-- Indexes for table `rewards`
--
ALTER TABLE `rewards`
  ADD PRIMARY KEY (`reward_id`);

--
-- Indexes for table `swipes`
--
ALTER TABLE `swipes`
  ADD PRIMARY KEY (`swipe_id`),
  ADD UNIQUE KEY `unique_swipe` (`from_user`,`to_user`),
  ADD KEY `to_user` (`to_user`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `uq_facebook_id` (`facebook_id`),
  ADD UNIQUE KEY `uq_google_id` (`google_id`),
  ADD UNIQUE KEY `uq_apple_id` (`apple_id`);

--
-- Indexes for table `user_answers`
--
ALTER TABLE `user_answers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_question` (`user_id`,`question_id`),
  ADD KEY `question_id` (`question_id`),
  ADD KEY `option_id` (`option_id`);

--
-- Indexes for table `user_interests`
--
ALTER TABLE `user_interests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `interest_id` (`interest_id`);

--
-- Indexes for table `user_location`
--
ALTER TABLE `user_location`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user_offers`
--
ALTER TABLE `user_offers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `reward_id` (`reward_id`);

--
-- Indexes for table `user_photos`
--
ALTER TABLE `user_photos`
  ADD PRIMARY KEY (`photo_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `video_calls`
--
ALTER TABLE `video_calls`
  ADD PRIMARY KEY (`call_id`),
  ADD KEY `match_id` (`match_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `availability`
--
ALTER TABLE `availability`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `availability_requests`
--
ALTER TABLE `availability_requests`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `compatibility_scores`
--
ALTER TABLE `compatibility_scores`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `email_otp`
--
ALTER TABLE `email_otp`
  MODIFY `otp_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `interests_master`
--
ALTER TABLE `interests_master`
  MODIFY `interest_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `matches`
--
ALTER TABLE `matches`
  MODIFY `match_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=170;

--
-- AUTO_INCREMENT for table `preferences`
--
ALTER TABLE `preferences`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `question_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `question_categories`
--
ALTER TABLE `question_categories`
  MODIFY `category_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `question_options`
--
ALTER TABLE `question_options`
  MODIFY `option_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `report_id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rewards`
--
ALTER TABLE `rewards`
  MODIFY `reward_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `swipes`
--
ALTER TABLE `swipes`
  MODIFY `swipe_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `user_answers`
--
ALTER TABLE `user_answers`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=656;

--
-- AUTO_INCREMENT for table `user_interests`
--
ALTER TABLE `user_interests`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=209;

--
-- AUTO_INCREMENT for table `user_location`
--
ALTER TABLE `user_location`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `user_offers`
--
ALTER TABLE `user_offers`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `user_photos`
--
ALTER TABLE `user_photos`
  MODIFY `photo_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `video_calls`
--
ALTER TABLE `video_calls`
  MODIFY `call_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `availability`
--
ALTER TABLE `availability`
  ADD CONSTRAINT `availability_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `compatibility_scores`
--
ALTER TABLE `compatibility_scores`
  ADD CONSTRAINT `compatibility_scores_ibfk_1` FOREIGN KEY (`user1_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `compatibility_scores_ibfk_2` FOREIGN KEY (`user2_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `matches`
--
ALTER TABLE `matches`
  ADD CONSTRAINT `matches_ibfk_1` FOREIGN KEY (`user1_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `matches_ibfk_2` FOREIGN KEY (`user2_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `preferences`
--
ALTER TABLE `preferences`
  ADD CONSTRAINT `preferences_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `question_categories` (`category_id`) ON DELETE CASCADE;

--
-- Constraints for table `question_options`
--
ALTER TABLE `question_options`
  ADD CONSTRAINT `question_options_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE;

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`reported_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `swipes`
--
ALTER TABLE `swipes`
  ADD CONSTRAINT `swipes_ibfk_1` FOREIGN KEY (`from_user`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `swipes_ibfk_2` FOREIGN KEY (`to_user`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `user_answers`
--
ALTER TABLE `user_answers`
  ADD CONSTRAINT `user_answers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_answers_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_answers_ibfk_3` FOREIGN KEY (`option_id`) REFERENCES `question_options` (`option_id`) ON DELETE SET NULL;

--
-- Constraints for table `user_interests`
--
ALTER TABLE `user_interests`
  ADD CONSTRAINT `user_interests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_interests_ibfk_2` FOREIGN KEY (`interest_id`) REFERENCES `interests_master` (`interest_id`) ON DELETE CASCADE;

--
-- Constraints for table `user_location`
--
ALTER TABLE `user_location`
  ADD CONSTRAINT `user_location_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `user_offers`
--
ALTER TABLE `user_offers`
  ADD CONSTRAINT `user_offers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_offers_ibfk_2` FOREIGN KEY (`reward_id`) REFERENCES `rewards` (`reward_id`) ON DELETE CASCADE;

--
-- Constraints for table `user_photos`
--
ALTER TABLE `user_photos`
  ADD CONSTRAINT `user_photos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `video_calls`
--
ALTER TABLE `video_calls`
  ADD CONSTRAINT `video_calls_ibfk_1` FOREIGN KEY (`match_id`) REFERENCES `matches` (`match_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
