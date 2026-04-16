-- ============================================
-- GIRLHOOD SPECTRUM - DATABASE SCHEMA
-- Corre este ficheiro no phpMyAdmin do Hostinger
-- ============================================

CREATE TABLE IF NOT EXISTS `users` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `name`       VARCHAR(100)  NOT NULL,
  `email`      VARCHAR(255)  NOT NULL UNIQUE,
  `password`   VARCHAR(255)  NOT NULL,
  `created_at` TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `moods` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `user_id`    INT           NOT NULL,
  `mood`       VARCHAR(20)   NOT NULL,
  `intensity`  INT           NOT NULL DEFAULT 5,
  `notes`      TEXT,
  `created_at` TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `groups_table` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `name`        VARCHAR(100)  NOT NULL,
  `description` TEXT,
  `code`        VARCHAR(10)   NOT NULL UNIQUE,
  `creator_id`  INT           NOT NULL,
  `created_at`  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `group_members` (
  `id`        INT AUTO_INCREMENT PRIMARY KEY,
  `group_id`  INT       NOT NULL,
  `user_id`   INT       NOT NULL,
  `joined_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_member` (`group_id`, `user_id`),
  FOREIGN KEY (`group_id`) REFERENCES `groups_table`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`)  REFERENCES `users`(`id`)        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `fear_alerts` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `sender_id`  INT       NOT NULL,
  `group_id`   INT       NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`)         ON DELETE CASCADE,
  FOREIGN KEY (`group_id`)  REFERENCES `groups_table`(`id`)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `fear_alert_reads` (
  `id`       INT AUTO_INCREMENT PRIMARY KEY,
  `alert_id` INT NOT NULL,
  `user_id`  INT NOT NULL,
  UNIQUE KEY `unique_read` (`alert_id`, `user_id`),
  FOREIGN KEY (`alert_id`) REFERENCES `fear_alerts`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`)  REFERENCES `users`(`id`)       ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `support_notifications` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `sender_id`   INT            NOT NULL,
  `receiver_id` INT            NOT NULL,
  `is_read`     TINYINT(1)     DEFAULT 0,
  `created_at`  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`sender_id`)   REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
