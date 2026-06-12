CREATE DATABASE IF NOT EXISTS `virtual_campus` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `virtual_campus`;

CREATE TABLE IF NOT EXISTS `users` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `name`        VARCHAR(255) NOT NULL,
  `email`       VARCHAR(255) NOT NULL UNIQUE,
  `password`    VARCHAR(255) NOT NULL,
  `avatar`      VARCHAR(10) DEFAULT NULL,
  `reset_token` VARCHAR(255) DEFAULT NULL,
  `reset_token_expires` DATETIME DEFAULT NULL,
  `created_at`  DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `courses` (
  `id`            INT AUTO_INCREMENT PRIMARY KEY,
  `title`         VARCHAR(255) NOT NULL,
  `icon`          VARCHAR(10) DEFAULT '📚',
  `instructor`    VARCHAR(255) NOT NULL,
  `participants`  INT DEFAULT 0,
  `duration`      VARCHAR(50) DEFAULT '90 menit',
  `room`          VARCHAR(100) DEFAULT '',
  `description`   TEXT DEFAULT NULL,
  `status`        ENUM('live','upcoming','idle') DEFAULT 'upcoming',
  `schedule`      VARCHAR(255) DEFAULT '',
  `created_at`    DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `enrollments` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `user_id`     INT NOT NULL,
  `course_id`   INT NOT NULL,
  `role`        ENUM('student','instructor') DEFAULT 'student',
  `joined_at`   DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_enrollment` (`user_id`, `course_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `meetings` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `code`        VARCHAR(10) NOT NULL UNIQUE,
  `title`       VARCHAR(255) NOT NULL,
  `host_id`     INT NOT NULL,
  `status`      ENUM('active','ended') DEFAULT 'active',
  `created_at`  DATETIME DEFAULT CURRENT_TIMESTAMP,
  `ended_at`    DATETIME DEFAULT NULL,
  FOREIGN KEY (`host_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
