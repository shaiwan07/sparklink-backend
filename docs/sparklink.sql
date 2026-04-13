-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 11, 2026 at 09:32 AM
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `availability`
--

INSERT INTO `availability` (`id`, `user_id`, `day_of_week`, `start_time`, `end_time`) VALUES
(1, 1, 'Mon', '09:00:00', '12:00:00'),
(2, 1, 'Mon', '14:00:00', '18:00:00'),
(3, 3, 'Mon', '10:00:00', '16:00:00'),
(4, 4, 'Mon', '11:00:00', '20:00:00');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `email_otp`
--

INSERT INTO `email_otp` (`otp_id`, `email`, `otp`, `type`, `is_used`, `expires_at`, `created_at`) VALUES
(1, 'belle@example.com', '123456', 'signup', 0, '2026-04-11 09:29:03', '2026-04-11 09:19:03'),
(2, 'john@example.com', '654321', 'login', 0, '2026-04-11 09:29:03', '2026-04-11 09:19:03');

-- --------------------------------------------------------

--
-- Table structure for table `interests_master`
--

CREATE TABLE `interests_master` (
  `interest_id` int NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `icon_url` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `matches`
--

INSERT INTO `matches` (`match_id`, `user1_id`, `user2_id`, `status`, `created_at`) VALUES
(1, 1, 3, 'matched', '2026-04-11 09:19:43'),
(2, 1, 4, 'matched', '2026-04-11 09:19:43');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `type` enum('match','message','call','reward') DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `message`, `is_read`, `created_at`) VALUES
(1, 1, 'match', 'You have a new match!', 0, '2026-04-11 09:18:19'),
(2, 2, 'call', 'Video call scheduled', 0, '2026-04-11 09:18:19'),
(3, 3, 'reward', 'You unlocked a reward!', 0, '2026-04-11 09:18:19');

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
  `max_distance_km` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `preferences`
--

INSERT INTO `preferences` (`id`, `user_id`, `interested_in`, `min_age`, `max_age`, `max_distance_km`) VALUES
(1, 1, 'male', 25, 35, 50),
(2, 2, 'male', 24, 35, 30),
(3, 3, 'female', 22, 30, 100),
(4, 4, 'female', 22, 32, 80);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
-- Table structure for table `rewards`
--

CREATE TABLE `rewards` (
  `reward_id` bigint NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `discount_percent` int DEFAULT NULL,
  `qr_code_url` text,
  `expiration_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `swipes`
--

INSERT INTO `swipes` (`swipe_id`, `from_user`, `to_user`, `action`, `created_at`) VALUES
(1, 1, 3, 'like', '2026-04-11 09:19:34'),
(2, 3, 1, 'like', '2026-04-11 09:19:34'),
(3, 2, 3, 'like', '2026-04-11 09:19:34'),
(4, 3, 2, 'dislike', '2026-04-11 09:19:34'),
(5, 1, 4, 'like', '2026-04-11 09:19:34'),
(6, 4, 1, 'like', '2026-04-11 09:19:34');

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
  `gender` enum('male','female','other') DEFAULT NULL,
  `bio` varchar(500) DEFAULT NULL,
  `profile_photo_url` text,
  `language` varchar(20) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `password_hash`, `phone`, `full_name`, `age`, `gender`, `bio`, `profile_photo_url`, `language`, `is_verified`, `created_at`, `updated_at`) VALUES
(1, 'belle@example.com', 'hashed123', '9999990001', 'Belle Benson', 28, 'female', 'Love traveling & meaningful connections', 'img1.jpg', NULL, 1, '2026-04-11 09:06:49', '2026-04-11 09:06:49'),
(2, 'amelia@example.com', 'hashed123', '9999990002', 'Amelia Jones', 25, 'female', 'Music lover and foodie', 'img2.jpg', NULL, 1, '2026-04-11 09:06:49', '2026-04-11 09:06:49'),
(3, 'john@example.com', 'hashed123', '9999990003', 'John Carter', 30, 'male', 'Fitness & adventure', 'img3.jpg', NULL, 1, '2026-04-11 09:06:49', '2026-04-11 09:06:49'),
(4, 'alex@example.com', 'hashed123', '9999990004', 'Alex Smith', 27, 'male', 'Tech geek and gamer', 'img4.jpg', NULL, 1, '2026-04-11 09:06:49', '2026-04-11 09:06:49');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_answers`
--

INSERT INTO `user_answers` (`id`, `user_id`, `question_id`, `option_id`, `answer`) VALUES
(1, 1, 2, 2, NULL),
(2, 3, 2, 2, NULL),
(3, 2, 2, 1, NULL),
(4, 4, 2, 3, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_interests`
--

CREATE TABLE `user_interests` (
  `id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `interest_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
(9, 4, 1);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_location`
--

INSERT INTO `user_location` (`id`, `user_id`, `latitude`, `longitude`, `city`, `updated_at`) VALUES
(1, 1, '28.61390000', '77.20900000', 'Delhi', '2026-04-11 09:07:12'),
(2, 2, '28.53550000', '77.39100000', 'Noida', '2026-04-11 09:07:12'),
(3, 3, '19.07600000', '72.87770000', 'Mumbai', '2026-04-11 09:07:12'),
(4, 4, '12.97160000', '77.59460000', 'Bangalore', '2026-04-11 09:07:12');

-- --------------------------------------------------------

--
-- Table structure for table `user_offers`
--

CREATE TABLE `user_offers` (
  `id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `reward_id` bigint DEFAULT NULL,
  `redeemed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_offers`
--

INSERT INTO `user_offers` (`id`, `user_id`, `reward_id`, `redeemed_at`) VALUES
(1, 1, 1, NULL),
(2, 1, 2, NULL),
(3, 2, 3, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_photos`
--

CREATE TABLE `user_photos` (
  `photo_id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `photo_url` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_photos`
--

INSERT INTO `user_photos` (`photo_id`, `user_id`, `photo_url`) VALUES
(1, 1, 'photo1.jpg'),
(2, 1, 'photo2.jpg'),
(3, 2, 'photo3.jpg'),
(4, 3, 'photo4.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `video_calls`
--

CREATE TABLE `video_calls` (
  `call_id` bigint NOT NULL,
  `match_id` bigint DEFAULT NULL,
  `scheduled_time` datetime DEFAULT NULL,
  `status` enum('scheduled','completed','cancelled','failed') DEFAULT NULL,
  `meeting_link` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `video_calls`
--

INSERT INTO `video_calls` (`call_id`, `match_id`, `scheduled_time`, `status`, `meeting_link`, `created_at`) VALUES
(3, 1, '2026-04-12 11:00:00', 'scheduled', NULL, '2026-04-11 09:19:57'),
(4, 2, '2026-04-13 15:00:00', 'completed', NULL, '2026-04-11 09:19:57');

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
  ADD UNIQUE KEY `phone` (`phone`);

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
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `compatibility_scores`
--
ALTER TABLE `compatibility_scores`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `email_otp`
--
ALTER TABLE `email_otp`
  MODIFY `otp_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `interests_master`
--
ALTER TABLE `interests_master`
  MODIFY `interest_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `matches`
--
ALTER TABLE `matches`
  MODIFY `match_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `preferences`
--
ALTER TABLE `preferences`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
-- AUTO_INCREMENT for table `rewards`
--
ALTER TABLE `rewards`
  MODIFY `reward_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `swipes`
--
ALTER TABLE `swipes`
  MODIFY `swipe_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_answers`
--
ALTER TABLE `user_answers`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_interests`
--
ALTER TABLE `user_interests`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `user_location`
--
ALTER TABLE `user_location`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_offers`
--
ALTER TABLE `user_offers`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_photos`
--
ALTER TABLE `user_photos`
  MODIFY `photo_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `video_calls`
--
ALTER TABLE `video_calls`
  MODIFY `call_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
