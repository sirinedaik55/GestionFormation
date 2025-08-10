<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Récupérer les notifications de l'utilisateur connecté
     */
    public function getNotifications(Request $request)
    {
        $user = Auth::user();
        
        $query = Notification::where('recipient_id', $user->id)
            ->with(['sender', 'formation'])
            ->orderBy('created_at', 'desc');

        // Filtres
        if ($request->unread_only) {
            $query->whereNull('read_at');
        }

        if ($request->type) {
            $query->where('type', $request->type);
        }

        $notifications = $query->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $notifications
        ]);
    }

    /**
     * Marquer une notification comme lue
     */
    public function markAsRead($id)
    {
        $user = Auth::user();
        
        $notification = Notification::where('id', $id)
            ->where('recipient_id', $user->id)
            ->first();

        if (!$notification) {
            return response()->json([
                'success' => false,
                'message' => 'Notification non trouvée'
            ], 404);
        }

        $notification->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Notification marquée comme lue'
        ]);
    }

    /**
     * Marquer toutes les notifications comme lues
     */
    public function markAllAsRead()
    {
        $user = Auth::user();
        
        Notification::where('recipient_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Toutes les notifications ont été marquées comme lues'
        ]);
    }

    /**
     * Compter les notifications non lues
     */
    public function getUnreadCount()
    {
        $user = Auth::user();
        
        $count = Notification::where('recipient_id', $user->id)
            ->whereNull('read_at')
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'unread_count' => $count
            ]
        ]);
    }

    /**
     * Supprimer une notification
     */
    public function deleteNotification($id)
    {
        $user = Auth::user();
        
        $notification = Notification::where('id', $id)
            ->where('recipient_id', $user->id)
            ->first();

        if (!$notification) {
            return response()->json([
                'success' => false,
                'message' => 'Notification non trouvée'
            ], 404);
        }

        $notification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notification supprimée'
        ]);
    }
} 