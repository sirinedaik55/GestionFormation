-- Créer la table attendances
CREATE TABLE IF NOT EXISTS `attendances` (
    `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `formation_id` bigint(20) UNSIGNED NOT NULL,
    `user_id` bigint(20) UNSIGNED NOT NULL,
    `status` enum('present','absent','late') NOT NULL DEFAULT 'absent',
    `notes` text DEFAULT NULL,
    `taken_by` bigint(20) UNSIGNED NOT NULL,
    `taken_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `sent_to_admin` tinyint(1) NOT NULL DEFAULT 0,
    `sent_at` timestamp NULL DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `attendances_formation_id_user_id_unique` (`formation_id`,`user_id`),
    KEY `attendances_formation_id_foreign` (`formation_id`),
    KEY `attendances_user_id_foreign` (`user_id`),
    KEY `attendances_taken_by_foreign` (`taken_by`),
    CONSTRAINT `attendances_formation_id_foreign` FOREIGN KEY (`formation_id`) REFERENCES `formations` (`id`) ON DELETE CASCADE,
    CONSTRAINT `attendances_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `attendances_taken_by_foreign` FOREIGN KEY (`taken_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Créer la table notifications
CREATE TABLE IF NOT EXISTS `notifications` (
    `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` varchar(255) NOT NULL,
    `message` text NOT NULL,
    `type` varchar(255) NOT NULL DEFAULT 'info',
    `read_at` timestamp NULL DEFAULT NULL,
    `data` json DEFAULT NULL,
    `recipient_id` bigint(20) UNSIGNED NOT NULL,
    `sender_id` bigint(20) UNSIGNED DEFAULT NULL,
    `formation_id` bigint(20) UNSIGNED DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `notifications_recipient_id_read_at_index` (`recipient_id`,`read_at`),
    KEY `notifications_type_created_at_index` (`type`,`created_at`),
    KEY `notifications_recipient_id_foreign` (`recipient_id`),
    KEY `notifications_sender_id_foreign` (`sender_id`),
    KEY `notifications_formation_id_foreign` (`formation_id`),
    CONSTRAINT `notifications_recipient_id_foreign` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `notifications_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `notifications_formation_id_foreign` FOREIGN KEY (`formation_id`) REFERENCES `formations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 