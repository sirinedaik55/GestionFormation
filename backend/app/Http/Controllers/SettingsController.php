<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Artisan;

class SettingsController extends Controller
{
    /**
     * Get all system settings
     */
    public function index()
    {
        $settings = [
            'system' => $this->getSystemSettings(),
            'notifications' => $this->getNotificationSettings(),
            'security' => $this->getSecuritySettings()
        ];
        
        return response()->json($settings);
    }
    
    /**
     * Get system settings
     */
    public function getSystemSettings()
    {
        return [
            'siteName' => config('app.name', 'Formation Management System'),
            'siteDescription' => config('app.description', 'Complete training management solution'),
            'adminEmail' => config('mail.from.address', 'admin@company.com'),
            'defaultLanguage' => config('app.locale', 'fr'),
            'timezone' => config('app.timezone', 'Europe/Paris'),
            'dateFormat' => config('app.date_format', 'DD/MM/YYYY'),
            'timeFormat' => config('app.time_format', '24h'),
            'maxFileSize' => config('app.max_file_size', 10),
            'allowedFileTypes' => config('app.allowed_file_types', ['pdf', 'doc', 'docx', 'ppt', 'pptx']),
            'emailNotifications' => config('app.email_notifications', true),
            'smsNotifications' => config('app.sms_notifications', false),
            'autoBackup' => config('app.auto_backup', true),
            'backupFrequency' => config('app.backup_frequency', 'daily'),
            'maintenanceMode' => app()->isDownForMaintenance(),
            'debugMode' => config('app.debug', false)
        ];
    }
    
    /**
     * Get notification settings
     */
    public function getNotificationSettings()
    {
        return [
            'formationReminder' => config('notifications.formation_reminder', true),
            'attendanceAlert' => config('notifications.attendance_alert', true),
            'reportGeneration' => config('notifications.report_generation', true),
            'systemUpdates' => config('notifications.system_updates', true),
            'reminderDays' => config('notifications.reminder_days', 3),
            'emailTemplate' => config('notifications.email_template', 'default')
        ];
    }
    
    /**
     * Get security settings
     */
    public function getSecuritySettings()
    {
        return [
            'passwordMinLength' => config('security.password_min_length', 8),
            'passwordRequireUppercase' => config('security.password_require_uppercase', true),
            'passwordRequireNumbers' => config('security.password_require_numbers', true),
            'passwordRequireSymbols' => config('security.password_require_symbols', false),
            'sessionTimeout' => config('session.lifetime', 30),
            'maxLoginAttempts' => config('security.max_login_attempts', 5),
            'lockoutDuration' => config('security.lockout_duration', 15),
            'twoFactorAuth' => config('security.two_factor_auth', false)
        ];
    }
    
    /**
     * Update system settings
     */
    public function updateSystemSettings(Request $request)
    {
        $validated = $request->validate([
            'siteName' => 'required|string|max:255',
            'siteDescription' => 'nullable|string|max:500',
            'adminEmail' => 'required|email',
            'defaultLanguage' => 'required|string|in:fr,en,ar',
            'timezone' => 'required|string',
            'dateFormat' => 'required|string',
            'timeFormat' => 'required|string|in:24h,12h',
            'maxFileSize' => 'required|integer|min:1|max:100',
            'allowedFileTypes' => 'required|array',
            'emailNotifications' => 'boolean',
            'smsNotifications' => 'boolean',
            'autoBackup' => 'boolean',
            'backupFrequency' => 'required|string|in:daily,weekly,monthly',
            'maintenanceMode' => 'boolean',
            'debugMode' => 'boolean'
        ]);
        
        // Update configuration (in a real app, you'd update config files or database)
        foreach ($validated as $key => $value) {
            Cache::put("settings.system.{$key}", $value, now()->addDays(30));
        }
        
        return response()->json([
            'message' => 'System settings updated successfully',
            'settings' => $validated
        ]);
    }
    
    /**
     * Update notification settings
     */
    public function updateNotificationSettings(Request $request)
    {
        $validated = $request->validate([
            'formationReminder' => 'boolean',
            'attendanceAlert' => 'boolean',
            'reportGeneration' => 'boolean',
            'systemUpdates' => 'boolean',
            'reminderDays' => 'required|integer|min:1|max:30',
            'emailTemplate' => 'required|string|in:default,professional,modern'
        ]);
        
        foreach ($validated as $key => $value) {
            Cache::put("settings.notifications.{$key}", $value, now()->addDays(30));
        }
        
        return response()->json([
            'message' => 'Notification settings updated successfully',
            'settings' => $validated
        ]);
    }
    
    /**
     * Update security settings
     */
    public function updateSecuritySettings(Request $request)
    {
        $validated = $request->validate([
            'passwordMinLength' => 'required|integer|min:6|max:20',
            'passwordRequireUppercase' => 'boolean',
            'passwordRequireNumbers' => 'boolean',
            'passwordRequireSymbols' => 'boolean',
            'sessionTimeout' => 'required|integer|min:5|max:120',
            'maxLoginAttempts' => 'required|integer|min:3|max:10',
            'lockoutDuration' => 'required|integer|min:5|max:60',
            'twoFactorAuth' => 'boolean'
        ]);
        
        foreach ($validated as $key => $value) {
            Cache::put("settings.security.{$key}", $value, now()->addDays(30));
        }
        
        return response()->json([
            'message' => 'Security settings updated successfully',
            'settings' => $validated
        ]);
    }
    
    /**
     * Reset settings to default
     */
    public function resetSettings(Request $request)
    {
        $type = $request->input('type', 'system'); // system, notifications, security
        
        // Clear cached settings
        Cache::forget("settings.{$type}.*");
        
        return response()->json([
            'message' => ucfirst($type) . ' settings reset to default values'
        ]);
    }
    
    /**
     * Export settings
     */
    public function exportSettings()
    {
        $settings = [
            'system' => $this->getSystemSettings(),
            'notifications' => $this->getNotificationSettings(),
            'security' => $this->getSecuritySettings(),
            'exported_at' => now()->toISOString()
        ];
        
        return response()->json($settings, 200, [
            'Content-Type' => 'application/json',
            'Content-Disposition' => 'attachment; filename="system-settings.json"'
        ]);
    }
    
    /**
     * Import settings
     */
    public function importSettings(Request $request)
    {
        $request->validate([
            'settings_file' => 'required|file|mimes:json'
        ]);
        
        $file = $request->file('settings_file');
        $content = file_get_contents($file->getPathname());
        $settings = json_decode($content, true);
        
        if (!$settings) {
            return response()->json(['error' => 'Invalid settings file'], 400);
        }
        
        // Import each settings type
        if (isset($settings['system'])) {
            foreach ($settings['system'] as $key => $value) {
                Cache::put("settings.system.{$key}", $value, now()->addDays(30));
            }
        }
        
        if (isset($settings['notifications'])) {
            foreach ($settings['notifications'] as $key => $value) {
                Cache::put("settings.notifications.{$key}", $value, now()->addDays(30));
            }
        }
        
        if (isset($settings['security'])) {
            foreach ($settings['security'] as $key => $value) {
                Cache::put("settings.security.{$key}", $value, now()->addDays(30));
            }
        }
        
        return response()->json([
            'message' => 'Settings imported successfully'
        ]);
    }
    
    /**
     * Perform system backup
     */
    public function performBackup()
    {
        try {
            // Run backup command (assuming you have a backup package installed)
            Artisan::call('backup:run');
            
            return response()->json([
                'message' => 'Backup completed successfully',
                'timestamp' => now()->toISOString()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Backup failed: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Clear system cache
     */
    public function clearCache()
    {
        try {
            Artisan::call('cache:clear');
            Artisan::call('config:clear');
            Artisan::call('route:clear');
            Artisan::call('view:clear');
            
            return response()->json([
                'message' => 'Cache cleared successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to clear cache: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get system information
     */
    public function getSystemInfo()
    {
        return response()->json([
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
            'database_connection' => config('database.default'),
            'cache_driver' => config('cache.default'),
            'queue_driver' => config('queue.default'),
            'mail_driver' => config('mail.default'),
            'storage_disk' => config('filesystems.default'),
            'app_env' => config('app.env'),
            'app_debug' => config('app.debug'),
            'memory_limit' => ini_get('memory_limit'),
            'max_execution_time' => ini_get('max_execution_time'),
            'upload_max_filesize' => ini_get('upload_max_filesize'),
            'disk_space' => [
                'total' => disk_total_space('/'),
                'free' => disk_free_space('/')
            ]
        ]);
    }
}
